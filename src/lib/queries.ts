import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultPlan, type StudyPlan } from "@/lib/schedule";

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
  return useQuery({
    queryKey: ["study_plan"],
    queryFn: async (): Promise<StudyPlan> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return defaultPlan;
      const { data, error } = await supabase
        .from("study_plans")
        .select("start_date, exam_date, study_days, modules_per_day")
        .eq("user_id", user.id)
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
  return useMutation({
    mutationFn: async (plan: StudyPlan) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Non connecté");
      const { error } = await supabase.from("study_plans").upsert(
        {
          user_id: user.id,
          start_date: plan.start_date,
          exam_date: plan.exam_date,
          study_days: plan.study_days,
          modules_per_day: plan.modules_per_day,
        },
        { onConflict: "user_id" },
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
  return useQuery({
    queryKey: ["module_progress"],
    queryFn: async (): Promise<ModuleProgress[]> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return [];
      const { data, error } = await supabase
        .from("module_progress")
        .select("module_id, completed, self_score, completed_at")
        .eq("user_id", user.id);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSetModuleProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { moduleId: number; completed: boolean; selfScore?: number | null }) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Non connecté");
      const { error } = await supabase.from("module_progress").upsert(
        {
          user_id: user.id,
          module_id: input.moduleId,
          completed: input.completed,
          self_score: input.selfScore ?? null,
          completed_at: input.completed ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,module_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module_progress"] });
    },
  });
}
