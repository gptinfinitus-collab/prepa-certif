import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserLink {
  id: string;
  title: string;
  url: string;
  category: string;
  note: string | null;
}

export interface UserLinkInput {
  id?: string;
  title: string;
  url: string;
  category: string;
  note: string | null;
}

const SELECT = "id, title, url, category, note";

/** Normalise une saisie d'URL : ajoute https:// si le schéma est absent. */
export function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  return `https://${value}`;
}

/** Valide une URL : seuls http et https sont acceptés. */
export function isValidUrl(raw: string): boolean {
  const value = normalizeUrl(raw);
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && !!parsed.hostname;
  } catch {
    return false;
  }
}

/** Nom de domaine lisible pour l'affichage d'un lien. */
export function hostLabel(raw: string): string {
  try {
    return new URL(normalizeUrl(raw)).hostname.replace(/^www\./, "");
  } catch {
    return raw;
  }
}

/** Liens personnels de l'utilisateur connecté (vide si non connecté). */
export function useUserLinks() {
  return useQuery({
    queryKey: ["user_links"],
    queryFn: async (): Promise<UserLink[]> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_links")
        .select(SELECT)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpsertUserLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UserLinkInput) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("notSignedIn");
      const payload = {
        user_id: user.id,
        title: input.title,
        url: normalizeUrl(input.url),
        category: input.category,
        note: input.note,
      };
      if (input.id) {
        const { error } = await supabase
          .from("user_links")
          .update(payload)
          .eq("id", input.id)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_links").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user_links"] }),
  });
}

export function useDeleteUserLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user_links"] }),
  });
}

/** Indique si un utilisateur est connecté (utilisable sur une page publique). */
export function useIsSignedIn() {
  return useQuery({
    queryKey: ["is_signed_in"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return !!data.user;
    },
  });
}
