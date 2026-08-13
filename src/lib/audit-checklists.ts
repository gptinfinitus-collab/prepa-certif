import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "@/lib/auth-user";
import { supabase } from "@/integrations/supabase/client";
import { auditChecklistTemplates, type ChecklistTemplate } from "@/data/audit-checklists";
import { enAuditChecklistTemplates } from "@/data/audit-checklists.en";
import type { Locale } from "@/i18n/config";

/** Statuts de constat disponibles sur une ligne de check-list. */
export const ITEM_STATUSES = ["pending", "conform", "major", "minor", "observation", "na"] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const CHECKLIST_STATUSES = ["draft", "in_progress", "done"] as const;
export type ChecklistStatus = (typeof CHECKLIST_STATUSES)[number];

export interface AuditChecklist {
  id: string;
  title: string;
  template_id: string | null;
  certification_id: string | null;
  audited_entity: string | null;
  scope: string | null;
  auditor: string | null;
  audit_date: string | null;
  status: string;
  updated_at: string;
}

export interface AuditChecklistItem {
  id: string;
  checklist_id: string;
  chapter: string;
  clause: string | null;
  requirement: string;
  guidance: string | null;
  position: number;
  status: string;
  evidence: string | null;
  finding: string | null;
  auditee: string | null;
  is_custom: boolean;
}

const LIST_SELECT =
  "id, title, template_id, certification_id, audited_entity, scope, auditor, audit_date, status, updated_at";
const ITEM_SELECT =
  "id, checklist_id, chapter, clause, requirement, guidance, position, status, evidence, finding, auditee, is_custom";

/** Modèles de check-lists dans la langue demandée. */
export function templatesFor(locale: Locale): ChecklistTemplate[] {
  return locale === "en" ? enAuditChecklistTemplates : auditChecklistTemplates;
}

export function findTemplate(locale: Locale, id: string): ChecklistTemplate | null {
  return templatesFor(locale).find((template) => template.id === id) ?? null;
}

/** Nombre d'exigences d'un modèle. */
export function templateItemCount(template: ChecklistTemplate): number {
  return template.sections.reduce((total, section) => total + section.items.length, 0);
}

/** Compteurs d'avancement d'une check-list remplie. */
export function summarize(items: AuditChecklistItem[]) {
  const counts: Record<ItemStatus, number> = {
    pending: 0,
    conform: 0,
    major: 0,
    minor: 0,
    observation: 0,
    na: 0,
  };
  for (const item of items) {
    const status = (ITEM_STATUSES as readonly string[]).includes(item.status)
      ? (item.status as ItemStatus)
      : "pending";
    counts[status] += 1;
  }
  const total = items.length;
  const treated = total - counts.pending;
  return {
    counts,
    total,
    treated,
    progress: total === 0 ? 0 : Math.round((treated / total) * 100),
    nonConformities: counts.major + counts.minor,
  };
}

/** Liste des audits de l'utilisateur, du plus récemment modifié au plus ancien. */
export function useAuditChecklists() {
  return useQuery({
    queryKey: ["audit_checklists"],
    queryFn: async (): Promise<AuditChecklist[]> => {
      const { data, error } = await supabase
        .from("audit_checklists")
        .select(LIST_SELECT)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAuditChecklist(checklistId: string) {
  return useQuery({
    queryKey: ["audit_checklist", checklistId],
    queryFn: async (): Promise<AuditChecklist | null> => {
      const { data, error } = await supabase
        .from("audit_checklists")
        .select(LIST_SELECT)
        .eq("id", checklistId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useAuditChecklistItems(checklistId: string) {
  return useQuery({
    queryKey: ["audit_checklist_items", checklistId],
    queryFn: async (): Promise<AuditChecklistItem[]> => {
      const { data, error } = await supabase
        .from("audit_checklist_items")
        .select(ITEM_SELECT)
        .eq("checklist_id", checklistId)
        .order("position", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export interface CreateChecklistInput {
  title: string;
  template: ChecklistTemplate | null;
  certificationId: string | null;
  auditedEntity?: string | null;
  auditDate?: string | null;
}

/** Crée un audit, à partir d'un modèle ou vierge. */
export function useCreateAuditChecklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateChecklistInput): Promise<AuditChecklist> => {
      const { data: userData } = await getAuthUser();
      const user = userData.user;
      if (!user) throw new Error("notAuthenticated");

      const { data: checklist, error } = await supabase
        .from("audit_checklists")
        .insert({
          user_id: user.id,
          certification_id: input.certificationId,
          template_id: input.template?.id ?? null,
          title: input.title,
          audited_entity: input.auditedEntity ?? null,
          audit_date: input.auditDate ?? null,
          status: "in_progress",
        })
        .select(LIST_SELECT)
        .single();
      if (error) throw error;

      if (input.template) {
        let position = 0;
        const rows = input.template.sections.flatMap((section) =>
          section.items.map((item) => ({
            checklist_id: checklist.id,
            user_id: user.id,
            chapter: section.chapter,
            clause: item.clause,
            requirement: item.requirement,
            guidance: item.guidance,
            position: (position += 10),
            status: "pending",
          })),
        );
        const { error: itemsError } = await supabase.from("audit_checklist_items").insert(rows);
        if (itemsError) throw itemsError;
      }

      return checklist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_checklists"] });
    },
  });
}

export function useUpdateAuditChecklist(checklistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Omit<AuditChecklist, "id" | "updated_at">>) => {
      const { error } = await supabase.from("audit_checklists").update(patch).eq("id", checklistId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_checklist", checklistId] });
      queryClient.invalidateQueries({ queryKey: ["audit_checklists"] });
    },
  });
}

export function useDeleteAuditChecklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (checklistId: string) => {
      const { error } = await supabase.from("audit_checklists").delete().eq("id", checklistId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_checklists"] });
    },
  });
}

/** Mise à jour d'une ligne, avec application optimiste dans le cache. */
export function useUpdateChecklistItem(checklistId: string) {
  const queryClient = useQueryClient();
  const key = ["audit_checklist_items", checklistId];
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<AuditChecklistItem> }) => {
      const { error } = await supabase.from("audit_checklist_items").update(patch).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<AuditChecklistItem[]>(key);
      queryClient.setQueryData<AuditChecklistItem[]>(key, (rows) =>
        (rows ?? []).map((row) => (row.id === id ? { ...row, ...patch } : row)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

export function useAddChecklistItem(checklistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { chapter: string; clause: string; requirement: string }) => {
      const { data: userData } = await getAuthUser();
      const user = userData.user;
      if (!user) throw new Error("notAuthenticated");
      const { data: last } = await supabase
        .from("audit_checklist_items")
        .select("position")
        .eq("checklist_id", checklistId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
      const { error } = await supabase.from("audit_checklist_items").insert({
        checklist_id: checklistId,
        user_id: user.id,
        chapter: input.chapter,
        clause: input.clause || null,
        requirement: input.requirement,
        position: (last?.position ?? 0) + 10,
        is_custom: true,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_checklist_items", checklistId] });
    },
  });
}

export function useDeleteChecklistItem(checklistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("audit_checklist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_checklist_items", checklistId] });
    },
  });
}

/** Échappe une valeur pour un fichier CSV (séparateur point-virgule). */
function csvCell(value: string | null | undefined): string {
  const text = (value ?? "").replace(/\r?\n/g, " ").trim();
  return `"${text.replace(/"/g, '""')}"`;
}

/** Construit le contenu CSV d'une check-list remplie. */
export function buildChecklistCsv(
  items: AuditChecklistItem[],
  headers: string[],
  statusLabel: (status: string) => string,
): string {
  const lines = [headers.map(csvCell).join(";")];
  for (const item of items) {
    lines.push(
      [
        csvCell(item.chapter),
        csvCell(item.clause),
        csvCell(item.requirement),
        csvCell(statusLabel(item.status)),
        csvCell(item.evidence),
        csvCell(item.finding),
        csvCell(item.auditee),
      ].join(";"),
    );
  }
  return `\ufeff${lines.join("\r\n")}`;
}

/** Déclenche le téléchargement d'un fichier texte généré côté client. */
export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Nom de fichier sûr dérivé du titre de l'audit. */
export function slugifyTitle(title: string): string {
  return (
    title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "audit"
  );
}
