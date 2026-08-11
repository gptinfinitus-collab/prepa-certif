import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CPD_TYPES = [
  "Formation",
  "Audit",
  "Lecture",
  "Conférence",
  "Enseignement",
  "Adhésion",
  "Autre",
] as const;

export type CpdType = (typeof CPD_TYPES)[number];

export interface CpdEntry {
  id: string;
  date: string;
  title: string;
  type: string;
  hours: number;
  reference: string | null;
  notes: string | null;
}

export interface CpdEntryInput {
  id?: string;
  date: string;
  title: string;
  type: string;
  hours: number;
  reference: string | null;
  notes: string | null;
}

const SELECT = "id, date, title, type, hours, reference, notes";

/** Journal CPD de l'utilisateur connecté, trié par date décroissante. */
export function useCpdEntries() {
  return useQuery({
    queryKey: ["cpd_entries"],
    queryFn: async (): Promise<CpdEntry[]> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return [];
      const { data, error } = await supabase
        .from("cpd_entries")
        .select(SELECT)
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row, hours: Number(row.hours) }));
    },
  });
}

export function useUpsertCpdEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CpdEntryInput) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Non connecté");
      const payload = {
        user_id: user.id,
        date: input.date,
        title: input.title,
        type: input.type,
        hours: input.hours,
        reference: input.reference,
        notes: input.notes,
      };
      if (input.id) {
        const { error } = await supabase
          .from("cpd_entries")
          .update(payload)
          .eq("id", input.id)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cpd_entries").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cpd_entries"] }),
  });
}

export function useDeleteCpdEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cpd_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cpd_entries"] }),
  });
}

export const DEFAULT_CPD_TARGET = 20;

/** Objectif annuel d'heures CPD. */
export function useCpdTarget() {
  return useQuery({
    queryKey: ["cpd_settings"],
    queryFn: async (): Promise<number> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return DEFAULT_CPD_TARGET;
      const { data, error } = await supabase
        .from("cpd_settings")
        .select("annual_target_hours")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data ? Number(data.annual_target_hours) : DEFAULT_CPD_TARGET;
    },
  });
}

export function useSaveCpdTarget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (hours: number) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Non connecté");
      const { error } = await supabase
        .from("cpd_settings")
        .upsert({ user_id: user.id, annual_target_hours: hours }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cpd_settings"] }),
  });
}

/* ---------- Fonctions pures (testées unitairement) ---------- */

export function entryYear(entry: Pick<CpdEntry, "date">): number {
  return Number(entry.date.slice(0, 4));
}

/** Années disponibles : celles des entrées + année en cours, décroissantes. */
export function availableYears(entries: CpdEntry[], currentYear: number): number[] {
  const years = new Set<number>([currentYear]);
  for (const entry of entries) years.add(entryYear(entry));
  return [...years].sort((a, b) => b - a);
}

export function totalHours(entries: CpdEntry[]): number {
  return Math.round(entries.reduce((sum, e) => sum + (Number(e.hours) || 0), 0) * 100) / 100;
}

/** Total d'heures par type, décroissant, types sans heures exclus. */
export function hoursByType(entries: CpdEntry[]): { type: string; hours: number }[] {
  const map = new Map<string, number>();
  for (const entry of entries) {
    map.set(entry.type, (map.get(entry.type) ?? 0) + (Number(entry.hours) || 0));
  }
  return [...map.entries()]
    .map(([type, hours]) => ({ type, hours: Math.round(hours * 100) / 100 }))
    .filter((row) => row.hours > 0)
    .sort((a, b) => b.hours - a.hours);
}

function csvCell(value: string | number | null): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

/** Export CSV (séparateur point-virgule, compatible Excel FR). */
export function toCsv(entries: CpdEntry[]): string {
  const header = ["Date", "Activité", "Type", "Heures", "Référence", "Notes"];
  const rows = entries.map((e) =>
    [e.date, e.title, e.type, e.hours, e.reference ?? "", e.notes ?? ""].map(csvCell).join(";"),
  );
  return [header.map(csvCell).join(";"), ...rows].join("\r\n");
}

export function formatHours(hours: number): string {
  return Number.isInteger(hours) ? `${hours} h` : `${hours.toFixed(1).replace(".", ",")} h`;
}
