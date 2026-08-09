import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveCertification } from "@/lib/certifications";
import { DEFAULT_TRACK, isTrackId, type TrackId } from "@/lib/tracks";

async function requireUser() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Non connecté");
  return data.user;
}

/* ------------------------------------------------------------------ Niveau */

export function useActiveTrack() {
  const query = useQuery({
    queryKey: ["active_track"],
    queryFn: async (): Promise<TrackId> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return DEFAULT_TRACK;
      const { data, error } = await supabase
        .from("profiles")
        .select("active_track")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (error) throw error;
      return isTrackId(data?.active_track) ? data.active_track : DEFAULT_TRACK;
    },
  });
  return { track: query.data ?? DEFAULT_TRACK, isLoading: query.isLoading };
}

export function useSetActiveTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (track: TrackId) => {
      const user = await requireUser();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, active_track: track }, { onConflict: "id" });
      if (error) throw error;
      return track;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active_track"] });
      queryClient.invalidateQueries({ queryKey: ["lesson_progress"] });
    },
  });
}

/* ------------------------------------------------------ Organisme d'examen */

export function useExamBody() {
  const query = useQuery({
    queryKey: ["exam_body"],
    queryFn: async (): Promise<ExamBodyId | null> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("exam_body")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (error) throw error;
      return isExamBodyId(data?.exam_body) ? data.exam_body : null;
    },
  });
  return { examBody: query.data ?? null, isLoading: query.isLoading };
}

export function useSetExamBody() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (examBody: ExamBodyId | null) => {
      const user = await requireUser();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, exam_body: examBody }, { onConflict: "id" });
      if (error) throw error;
      return examBody;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exam_body"] }),
  });
}

/* --------------------------------------------------------- Progression fine */

export interface LessonProgress {
  module_id: number;
  sections_read: string[];
  current_section: string | null;
  quiz_submitted: boolean;
  completed: boolean;
  time_spent_seconds: number;
}

export function useLessonProgressList() {
  const { certificationId } = useActiveCertification();
  const { track } = useActiveTrack();
  return useQuery({
    queryKey: ["lesson_progress", certificationId, track],
    enabled: !!certificationId,
    queryFn: async (): Promise<LessonProgress[]> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user || !certificationId) return [];
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("module_id, sections_read, current_section, quiz_submitted, completed, time_spent_seconds")
        .eq("user_id", userData.user.id)
        .eq("certification_id", certificationId)
        .eq("track", track);
      if (error) throw error;
      return (data ?? []).map((row) => ({ ...row, sections_read: row.sections_read ?? [] }));
    },
  });
}

export function useLessonProgress(moduleId: number) {
  const list = useLessonProgressList();
  return {
    ...list,
    data: list.data?.find((p) => p.module_id === moduleId) ?? null,
  };
}

export function useSaveLessonProgress() {
  const queryClient = useQueryClient();
  const { certificationId } = useActiveCertification();
  const { track } = useActiveTrack();
  return useMutation({
    mutationFn: async (input: {
      moduleId: number;
      sectionsRead: string[];
      currentSection: string | null;
      quizSubmitted?: boolean;
      completed?: boolean;
    }) => {
      const user = await requireUser();
      if (!certificationId) throw new Error("Aucune certification sélectionnée");
      const { error } = await supabase.from("user_lesson_progress").upsert(
        {
          user_id: user.id,
          certification_id: certificationId,
          track,
          module_id: input.moduleId,
          sections_read: input.sectionsRead,
          current_section: input.currentSection,
          quiz_submitted: input.quizSubmitted ?? false,
          completed: input.completed ?? false,
          completed_at: input.completed ? new Date().toISOString() : null,
          last_activity_at: new Date().toISOString(),
        },
        { onConflict: "user_id,certification_id,track,module_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson_progress"] });
    },
  });
}

/* ------------------------------------------------------------------- Notes */

export function useLessonNote(moduleId: number) {
  return useQuery({
    queryKey: ["lesson_note", moduleId],
    queryFn: async (): Promise<string> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return "";
      const { data, error } = await supabase
        .from("user_notes")
        .select("content")
        .eq("user_id", userData.user.id)
        .eq("module_id", moduleId)
        .is("section_id", null)
        .maybeSingle();
      if (error) throw error;
      return data?.content ?? "";
    },
  });
}

export function useSaveLessonNote(moduleId: number) {
  const queryClient = useQueryClient();
  const { certificationId } = useActiveCertification();
  return useMutation({
    mutationFn: async (content: string) => {
      const user = await requireUser();
      const { error } = await supabase.from("user_notes").upsert(
        {
          user_id: user.id,
          certification_id: certificationId ?? null,
          module_id: moduleId,
          section_id: null,
          content,
        },
        { onConflict: "user_id,module_id,section_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lesson_note", moduleId] }),
  });
}

/* -------------------------------------------------------------- Flashcards */

export type FlashcardStatus = "again" | "mastered";

export function useFlashcardProgress(moduleId: number) {
  return useQuery({
    queryKey: ["flashcard_progress", moduleId],
    queryFn: async (): Promise<Record<string, FlashcardStatus>> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return {};
      const { data, error } = await supabase
        .from("user_flashcard_progress")
        .select("card_key, status")
        .eq("user_id", userData.user.id)
        .eq("module_id", moduleId);
      if (error) throw error;
      const map: Record<string, FlashcardStatus> = {};
      for (const row of data ?? []) {
        map[row.card_key] = row.status === "mastered" ? "mastered" : "again";
      }
      return map;
    },
  });
}

export function useSetFlashcardStatus(moduleId: number) {
  const queryClient = useQueryClient();
  const { certificationId } = useActiveCertification();
  return useMutation({
    mutationFn: async (input: { cardKey: string; status: FlashcardStatus }) => {
      const user = await requireUser();
      const { error } = await supabase.from("user_flashcard_progress").upsert(
        {
          user_id: user.id,
          certification_id: certificationId ?? null,
          module_id: moduleId,
          card_key: input.cardKey,
          status: input.status,
          reviewed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,module_id,card_key" },
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flashcard_progress", moduleId] }),
  });
}

/* --------------------------------------------------- Maîtrise par thème */

export interface TopicMastery {
  topic: string;
  correct: number;
  attempts: number;
}

export function useTopicMastery() {
  const { certificationId } = useActiveCertification();
  const { track } = useActiveTrack();
  return useQuery({
    queryKey: ["topic_mastery", certificationId, track],
    enabled: !!certificationId,
    queryFn: async (): Promise<TopicMastery[]> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user || !certificationId) return [];
      const { data, error } = await supabase
        .from("user_topic_mastery")
        .select("topic, correct, attempts")
        .eq("user_id", userData.user.id)
        .eq("certification_id", certificationId)
        .eq("track", track)
        .order("attempts", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useRecordTopicMastery() {
  const queryClient = useQueryClient();
  const { certificationId } = useActiveCertification();
  const { track } = useActiveTrack();
  return useMutation({
    mutationFn: async (entries: { topic: string; correct: boolean }[]) => {
      const user = await requireUser();
      if (!certificationId || entries.length === 0) return;

      const aggregated = new Map<string, { correct: number; attempts: number }>();
      for (const entry of entries) {
        const key = entry.topic.trim();
        if (!key) continue;
        const current = aggregated.get(key) ?? { correct: 0, attempts: 0 };
        aggregated.set(key, {
          correct: current.correct + (entry.correct ? 1 : 0),
          attempts: current.attempts + 1,
        });
      }
      if (aggregated.size === 0) return;

      const topics = [...aggregated.keys()];
      const { data: existing, error: readError } = await supabase
        .from("user_topic_mastery")
        .select("topic, correct, attempts")
        .eq("user_id", user.id)
        .eq("certification_id", certificationId)
        .eq("track", track)
        .in("topic", topics);
      if (readError) throw readError;

      const previous = new Map((existing ?? []).map((row) => [row.topic, row]));
      const rows = topics.map((topic) => {
        const add = aggregated.get(topic)!;
        const before = previous.get(topic);
        return {
          user_id: user.id,
          certification_id: certificationId,
          track,
          topic,
          correct: (before?.correct ?? 0) + add.correct,
          attempts: (before?.attempts ?? 0) + add.attempts,
          last_seen_at: new Date().toISOString(),
        };
      });

      const { error } = await supabase
        .from("user_topic_mastery")
        .upsert(rows, { onConflict: "user_id,certification_id,track,topic" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topic_mastery"] }),
  });
}
