import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { MarkdownView } from "@/components/MarkdownView";
import { askAssistant } from "@/lib/ai.functions";
import { useActiveCertification } from "@/lib/certifications";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assistant")({
  head: () => ({
    meta: [
      { title: "Assistant IA — PREPA ISO" },
      {
        name: "description",
        content:
          "Posez vos questions sur les normes ISO et l'audit : l'assistant répond en s'appuyant sur vos documents de cours indexés.",
      },
      { property: "og:title", content: "Assistant IA — PREPA ISO" },
      {
        property: "og:description",
        content: "Un tuteur IA qui répond à partir de votre bibliothèque de cours ISO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssistantPage,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Explique la différence entre non-conformité majeure et mineure.",
  "Comment préparer un plan d'audit conforme à l'ISO 19011 ?",
  "Quelles preuves collecter pour évaluer le leadership (chapitre 5) ?",
];

function AssistantPage() {
  const ask = useServerFn(askAssistant);
  const { certification, certificationId } = useActiveCertification();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const certificationName = certification?.name ?? "votre certification ISO";

  const history = useQuery({
    queryKey: ["ai-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_messages")
        .select("role, content, created_at")
        .order("created_at", { ascending: true })
        .limit(40);
      if (error) throw error;
      return (data ?? []).map((m) => ({ role: m.role as Message["role"], content: m.content }));
    },
  });

  useEffect(() => {
    if (history.data && messages.length === 0) setMessages(history.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const mutation = useMutation({
    mutationFn: async (question: string) =>
      ask({
        data: {
          question,
          certificationName,
          certificationId: certificationId ?? null,
          history: messages.slice(-6),
        },
      }),
    onSuccess: (result) => {
      setMessages((prev) => [...prev, { role: "assistant", content: result.answer }]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setMessages((prev) => prev.slice(0, -1));
    },
  });

  function send(question: string) {
    const text = question.trim();
    if (!text || mutation.isPending) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    mutation.mutate(text);
  }

  return (
    <AppShell title="Assistant IA">
      <div className="mx-auto flex max-w-3xl flex-col px-4 py-6 md:py-10">
        <h1 className="font-serif text-3xl font-semibold">Assistant de préparation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions directes sur {certificationName}, l'audit et vos documents de cours indexés dans
          la bibliothèque.
        </p>

        {messages.length === 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <Sparkles className="size-5 text-cert" aria-hidden />
                Par où commencer ?
              </CardTitle>
              <CardDescription>Choisissez une question ou écrivez la vôtre.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="mt-6 space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
            >
              <span
                className={cn(
                  "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full",
                  message.role === "user" ? "bg-secondary" : "bg-cert/15 text-cert",
                )}
                aria-hidden
              >
                {message.role === "user" ? (
                  <User className="size-4" />
                ) : (
                  <Bot className="size-4" />
                )}
              </span>
              <div
                className={cn(
                  "min-w-0 max-w-[85%] rounded-xl border border-border px-4 py-3 text-sm leading-relaxed",
                  message.role === "user" ? "bg-secondary" : "bg-card",
                )}
              >
                {message.role === "assistant" ? (
                  <MarkdownView>{message.content}</MarkdownView>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {mutation.isPending && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              L'assistant consulte vos documents…
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-20 mt-6 rounded-xl border border-border bg-card/95 p-3 backdrop-blur md:bottom-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            placeholder="Posez votre question (Entrée pour envoyer)…"
            className="resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <div className="flex justify-end">
            <Button onClick={() => send(input)} disabled={mutation.isPending || !input.trim()}>
              <Send className="size-4" aria-hidden />
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
