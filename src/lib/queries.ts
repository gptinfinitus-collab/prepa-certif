import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultPlan, type StudyPlan } from "@/lib/schedule";
import { useActiveCertification } from "@/lib/certifications";

export interface ModuleProgress {
  module_id: number;
  completed: boolean;
  self_score: number | null;
  completed_at: string | null;
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },
  });
}

export function useStudyPlan() {
  const { certificationId } = useActiveCertification();
  return useQuery({
    queryKey: ["study_plan", certificationId],
    enabled: !!certificationId,
    queryFn: async (): Promise<StudyPlan> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user || !certificationId) return defaultPlan;
      const { data, error } = await supabase
        .from("study_plans")
        .select("start_date, exam_date, study_days, modules_per_day")
        .eq("user_id", user.id)
        .eq("certification_id", certificationId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return defaultPlan;
      return {
        start_date: data.start_date,
        exam_date: data.exam_date,
        study_days: (data.study_days ?? [1, 2, 3, 4, 5]).map(Number),
        modules_per_day: data.modules_per_day ?? 1,
      };
    },
  });
}

export function useSaveStudyPlan() {
  const queryClient = useQueryClient();
  const { certificationId } = useActiveCertification();
  return useMutation({
    mutationFn: async (plan: StudyPlan) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Non connecté");
      if (!certificationId) throw new Error("Aucune certification sélectionnée");
      const { error } = await supabase.from("study_plans").upsert(
        {
          user_id: user.id,
          certification_id: certificationId,
          start_date: plan.start_date,
          exam_date: plan.exam_date,
          study_days: plan.study_days,
          modules_per_day: plan.modules_per_day,
        },
        { onConflict: "user_id,certification_id" },
      );
      if (error) throw error;
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study_plan"] });
    },
  });
}

export function useProgress() {
  const { certificationId } = useActiveCertification();
  return useQuery({
    queryKey: ["module_progress", certificationId],
    enabled: !!certificationId,
    queryFn: async (): Promise<ModuleProgress[]> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user || !certificationId) return [];
      const { data, error } = await supabase
        .from("module_progress")
        .select("module_id, completed, self_score, completed_at")
        .eq("user_id", user.id)
        .eq("certification_id", certificationId);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSetModuleProgress() {
  const queryClient = useQueryClient();
  const { certificationId } = useActiveCertification();
  return useMutation({
    mutationFn: async (input: { moduleId: number; completed: boolean; selfScore?: number | null }) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Non connecté");
      if (!certificationId) throw new Error("Aucune certification sélectionnée");
      const { error } = await supabase.from("module_progress").upsert(
        {
          user_id: user.id,
          certification_id: certificationId,
          module_id: input.moduleId,
          completed: input.completed,
          self_score: input.selfScore ?? null,
          completed_at: input.completed ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,certification_id,module_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module_progress"] });
    },
  });
}


export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<(Profile & { email: string | null; avatarSignedUrl: string | null }) | null> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;

      const profile: Profile = data ?? {
        id: user.id,
        first_name: null,
        last_name: null,
        display_name: null,
        avatar_url: null,
      };

      let avatarSignedUrl: string | null = null;
      if (profile.avatar_url) {
        if (profile.avatar_url.startsWith("http")) {
          avatarSignedUrl = profile.avatar_url;
        } else {
          const { data: signed } = await supabase.storage
            .from("avatars")
            .createSignedUrl(profile.avatar_url, 60 * 60);
          avatarSignedUrl = signed?.signedUrl ?? null;
        }
      }

      return { ...profile, email: user.email ?? null, avatarSignedUrl };
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { first_name: string; last_name: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Non connecté");
      const display = [input.first_name, input.last_name].filter(Boolean).join(" ").trim();
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          first_name: input.first_name || null,
          last_name: input.last_name || null,
          display_name: display || null,
        },
        { onConflict: "id" },
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blob: Blob) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Non connecté");
      const path = `${user.id}/avatar-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (uploadError) throw uploadError;
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, avatar_url: path }, { onConflict: "id" });
      if (error) throw error;
      return path;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}
