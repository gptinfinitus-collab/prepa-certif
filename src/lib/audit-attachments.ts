import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "@/lib/auth-user";
import { supabase } from "@/integrations/supabase/client";

/** Bucket privé dédié aux preuves d'audit. */
export const EVIDENCE_BUCKET = "audit-evidence";

/** Taille maximale d'une pièce jointe (10 Mo). */
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

/** Types acceptés : images, PDF, Word, Excel. */
export const ACCEPTED_MIME_PREFIXES = ["image/"];
export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
export const ACCEPT_ATTRIBUTE =
  "image/jpeg,image/png,image/webp,image/gif,application/pdf,.doc,.docx,.xls,.xlsx";

export interface AuditAttachment {
  id: string;
  item_id: string;
  checklist_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number;
  created_at: string;
}

const SELECT = "id, item_id, checklist_id, storage_path, file_name, mime_type, size_bytes, created_at";

export function isAcceptedFile(file: File): boolean {
  if (file.type.startsWith("image/") && !file.type.includes("heic") && !file.type.includes("heif")) {
    return true;
  }
  return ACCEPTED_MIME_TYPES.includes(file.type);
}

/** Nom de fichier sûr pour le chemin de stockage. */
function safeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80) || "fichier";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/** Toutes les pièces jointes d'un audit, groupées par ligne. */
export function useChecklistAttachments(checklistId: string) {
  return useQuery({
    queryKey: ["audit_attachments", checklistId],
    queryFn: async (): Promise<Record<string, AuditAttachment[]>> => {
      const { data, error } = await supabase
        .from("audit_item_attachments")
        .select(SELECT)
        .eq("checklist_id", checklistId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const map: Record<string, AuditAttachment[]> = {};
      for (const row of data ?? []) {
        (map[row.item_id] ??= []).push(row as AuditAttachment);
      }
      return map;
    },
  });
}

export function useUploadAttachment(checklistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, file }: { itemId: string; file: File }) => {
      const { data: userData } = await getAuthUser();
      const user = userData.user;
      if (!user) throw new Error("notAuthenticated");
      if (file.size > MAX_ATTACHMENT_BYTES) throw new Error("tooLarge");
      if (!isAcceptedFile(file)) throw new Error("badType");

      const path = `${user.id}/${checklistId}/${itemId}/${crypto.randomUUID()}-${safeName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from(EVIDENCE_BUCKET)
        .upload(path, file, { contentType: file.type || "application/octet-stream" });
      if (uploadError) throw uploadError;

      const { error } = await supabase.from("audit_item_attachments").insert({
        item_id: itemId,
        checklist_id: checklistId,
        user_id: user.id,
        storage_path: path,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
      if (error) {
        await supabase.storage.from(EVIDENCE_BUCKET).remove([path]);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_attachments", checklistId] });
    },
  });
}

export function useDeleteAttachment(checklistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attachment: AuditAttachment) => {
      const { error: storageError } = await supabase.storage
        .from(EVIDENCE_BUCKET)
        .remove([attachment.storage_path]);
      if (storageError) throw storageError;
      const { error } = await supabase
        .from("audit_item_attachments")
        .delete()
        .eq("id", attachment.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit_attachments", checklistId] });
    },
  });
}

/** URL signée temporaire pour ouvrir une pièce jointe. */
export async function attachmentUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .createSignedUrl(storagePath, 60 * 10);
  if (error) return null;
  return data?.signedUrl ?? null;
}
