import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "@/lib/auth-user";
import { supabase } from "@/integrations/supabase/client";

export interface Certification {
  id: string;
  code: string;
  name: string;
  family: string | null;
  description: string | null;
  chapters: string[];
  has_curriculum: boolean;
  sort_order: number;
  is_custom: boolean;
  owner_id: string | null;
}

export interface UserCertification {
  id: string;
  certification_id: string;
  is_active: boolean;
  certification: Certification;
}

function toChapters(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

const CERT_SELECT =
  "id, code, name, family, description, chapters, has_curriculum, sort_order, is_custom, owner_id";

type CertRow = Omit<Certification, "chapters"> & { chapters: unknown };

function mapCert(row: CertRow): Certification {
  return { ...row, chapters: toChapters(row.chapters) };
}

/** Catalogue complet : normes officielles + normes personnalisées de l'utilisateur. */
export function useCertificationCatalog() {
  return useQuery({
    queryKey: ["certifications"],
    queryFn: async (): Promise<Certification[]> => {
      const { data, error } = await supabase
        .from("certifications")
        .select(CERT_SELECT)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => mapCert(row as CertRow));
    },
  });
}

/** Cursus suivis par l'utilisateur connecté. */
export function useMyCertifications() {
  return useQuery({
    queryKey: ["user_certifications"],
    queryFn: async (): Promise<UserCertification[]> => {
      const { data: userData } = await getAuthUser();
      const user = userData.user;
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_certifications")
        .select(`id, certification_id, is_active, certification:certifications(${CERT_SELECT})`)
        .eq("user_id", user.id);
      if (error) throw error;
      return (data ?? [])
        .filter((row) => row.certification)
        .map((row) => ({
          id: row.id,
          certification_id: row.certification_id,
          is_active: row.is_active,
          certification: mapCert(row.certification as unknown as CertRow),
        }))
        .sort((a, b) => a.certification.sort_order - b.certification.sort_order);
    },
  });
}

/** Certification actuellement sélectionnée (ou null si aucune). */
export function useActiveCertification() {
  const query = useMyCertifications();
  const active = query.data?.find((c) => c.is_active) ?? query.data?.[0] ?? null;
  return {
    ...query,
    certification: active?.certification ?? null,
    certificationId: active?.certification_id ?? null,
  };
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["user_certifications"] });
  queryClient.invalidateQueries({ queryKey: ["certifications"] });
  queryClient.invalidateQueries({ queryKey: ["study_plan"] });
  queryClient.invalidateQueries({ queryKey: ["module_progress"] });
}

/** Ajoute une certification au parcours de l'utilisateur et la rend active. */
export function useFollowCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (certificationId: string) => {
      const { data: userData } = await getAuthUser();
      const user = userData.user;
      if (!user) throw new Error("notSignedIn");
      await supabase
        .from("user_certifications")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);
      const { error } = await supabase
        .from("user_certifications")
        .upsert(
          { user_id: user.id, certification_id: certificationId, is_active: true },
          { onConflict: "user_id,certification_id" },
        );
      if (error) throw error;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

/** Change la certification active parmi celles déjà suivies. */
export function useSetActiveCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (certificationId: string) => {
      const { data: userData } = await getAuthUser();
      const user = userData.user;
      if (!user) throw new Error("notSignedIn");
      await supabase
        .from("user_certifications")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);
      const { error } = await supabase
        .from("user_certifications")
        .update({ is_active: true })
        .eq("user_id", user.id)
        .eq("certification_id", certificationId);
      if (error) throw error;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

/** Retire un cursus du parcours de l'utilisateur. */
export function useUnfollowCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (certificationId: string) => {
      const { data: userData } = await getAuthUser();
      const user = userData.user;
      if (!user) throw new Error("notSignedIn");
      const { error } = await supabase
        .from("user_certifications")
        .delete()
        .eq("user_id", user.id)
        .eq("certification_id", certificationId);
      if (error) throw error;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

/** Crée une certification personnalisée puis la suit. */
export function useCreateCustomCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; family?: string; description?: string; chapters: string[] }) => {
      const { data: userData } = await getAuthUser();
      const user = userData.user;
      if (!user) throw new Error("notSignedIn");
      const code = `custom-${input.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 40)}-${Date.now().toString(36)}`;

      const { data, error } = await supabase
        .from("certifications")
        .insert({
          code,
          name: input.name,
          family: input.family || null,
          description: input.description || null,
          chapters: input.chapters,
          has_curriculum: false,
          sort_order: 500,
          is_custom: true,
          owner_id: user.id,
        })
        .select("id")
        .single();
      if (error) throw error;

      await supabase
        .from("user_certifications")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);
      const { error: linkError } = await supabase
        .from("user_certifications")
        .insert({ user_id: user.id, certification_id: data.id, is_active: true });
      if (linkError) throw linkError;
      return data.id;
    },
    onSuccess: () => invalidate(queryClient),
  });
}
