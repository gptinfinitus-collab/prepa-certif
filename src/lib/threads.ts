/** Gestion des fils de conversation de l'assistant IA. */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "@/lib/auth-user";
import { supabase } from "@/integrations/supabase/client";

export interface ChatThread {
  id: string;
  title: string;
  updated_at: string;
  certification_id: string | null;
}

export interface ChatMessageRow {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: { content: string; document_id: string }[];
}

export function useThreads(certificationId: string | null | undefined) {
  return useQuery({
    queryKey: ["chat-threads", certificationId ?? "none"],
    queryFn: async (): Promise<ChatThread[]> => {
      let query = supabase
        .from("chat_threads")
        .select("id, title, updated_at, certification_id")
        .order("updated_at", { ascending: false })
        .limit(50);
      if (certificationId) query = query.eq("certification_id", certificationId);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as ChatThread[];
    },
  });
}

export function useThreadMessages(threadId: string) {
  return useQuery({
    queryKey: ["chat-messages", threadId],
    queryFn: async (): Promise<ChatMessageRow[]> => {
      const { data, error } = await supabase
        .from("ai_messages")
        .select("id, role, content, sources")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        sources: Array.isArray(m.sources)
          ? (m.sources as unknown as ChatMessageRow["sources"])
          : [],
      }));
    },
  });
}

export function useCreateThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (certificationId: string | null): Promise<ChatThread> => {
      const { data: userData } = await getAuthUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("sessionExpired");
      const { data, error } = await supabase
        .from("chat_threads")
        .insert({ user_id: userId, certification_id: certificationId })
        .select("id, title, updated_at, certification_id")
        .single();
      if (error) throw error;
      return data as ChatThread;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat-threads"] }),
  });
}

export function useDeleteThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      const { error } = await supabase.from("chat_threads").delete().eq("id", threadId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat-threads"] }),
  });
}
