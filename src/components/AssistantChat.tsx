import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bot,
  Loader2,
  Menu,
  MessageSquarePlus,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { MarkdownView } from "@/components/MarkdownView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useActiveCertification } from "@/lib/certifications";
import {
  useCreateThread,
  useDeleteThread,
  useThreadMessages,
  useThreads,
  type ChatMessageRow,
} from "@/lib/threads";
import { cn } from "@/lib/utils";


const suggestions = [
  "Explique la différence entre non-conformité majeure et mineure.",
  "Comment préparer un plan d'audit conforme à l'ISO 19011 ?",
  "Quelles preuves collecter pour évaluer le leadership (chapitre 5) ?",
];

export function AssistantChat({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { certification, certificationId } = useActiveCertification();
  const certificationName = certification?.name ?? "votre certification ISO";

  const threads = useThreads(certificationId ?? null);
  const stored = useThreadMessages(threadId);
  const createThread = useCreateThread();
  const deleteThread = useDeleteThread();

  const [pending, setPending] = useState<ChatMessageRow[]>([]);
  const [streamed, setStreamed] = useState("");
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = [...(stored.data ?? []), ...pending];

  useEffect(() => {
    setPending([]);
    setStreamed("");
    setBusy(false);
    textareaRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamed]);

  async function send(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setStreamed("");
    setPending([{ id: `local-${Date.now()}`, role: "user", content: text, sources: [] }]);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Session expirée, reconnectez-vous.");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ threadId, question: text, certificationName }),
      });
      if (!response.ok || !response.body) {
        throw new Error(await response.text().catch(() => "Assistant indisponible."));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let index = buffer.indexOf("\n\n");
        while (index !== -1) {
          const raw = buffer.slice(0, index).trim();
          buffer = buffer.slice(index + 2);
          index = buffer.indexOf("\n\n");
          if (!raw.startsWith("data:")) continue;
          const event = JSON.parse(raw.slice(5).trim()) as {
            type: string;
            text?: string;
            message?: string;
          };
          if (event.type === "delta" && event.text) {
            answer += event.text;
            setStreamed(answer);
          } else if (event.type === "error") {
            throw new Error(event.message ?? "Réponse IA indisponible.");
          }
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Assistant indisponible.");
    } finally {
      setBusy(false);
      setStreamed("");
      setPending([]);
      await queryClient.invalidateQueries({ queryKey: ["chat-messages", threadId] });
      await queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
      textareaRef.current?.focus();
    }
  }

  async function startThread() {
    const thread = await createThread.mutateAsync(certificationId ?? null);
    navigate({ to: "/assistant/$threadId", params: { threadId: thread.id } });
  }

  async function removeThread(id: string) {
    await deleteThread.mutateAsync(id);
    if (id === threadId) navigate({ to: "/assistant" });
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col px-4 py-4 md:py-8">
      <div className="flex min-w-0 items-start gap-2">
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Historique des conversations">
              <Menu className="size-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-xs p-0">
            <SheetHeader className="p-4 pb-2">
              <SheetTitle className="font-sans text-base">Conversations</SheetTitle>
              <SheetDescription className="text-xs">
                Vos échanges avec l'assistant, par certification.
              </SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4 pt-0">
              <Button
                onClick={startThread}
                disabled={createThread.isPending}
                className="w-full"
                size="sm"
              >
                <MessageSquarePlus className="size-4" aria-hidden />
                Nouvelle conversation
              </Button>
              <nav className="flex flex-col gap-1">
                {threads.isLoading &&
                  [0, 1, 2].map((i) => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
                {(threads.data ?? []).map((thread) => (
                  <div
                    key={thread.id}
                    className={cn(
                      "flex min-w-0 items-center gap-1 rounded-lg border border-border px-1",
                      thread.id === threadId ? "bg-secondary" : "bg-card",
                    )}
                  >
                    <Link
                      to="/assistant/$threadId"
                      params={{ threadId: thread.id }}
                      onClick={() => setHistoryOpen(false)}
                      className="min-w-0 flex-1 truncate px-2 py-2 text-sm"
                      title={thread.title}
                    >
                      {thread.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeThread(thread.id)}
                      aria-label={`Supprimer ${thread.title}`}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <h1 className="font-sans text-xl font-semibold sm:text-2xl">Assistant de préparation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Questions directes sur {certificationName}, l'audit et vos documents indexés.
          </p>
        </div>
      </div>

      <section className="flex min-w-0 flex-col">
        {stored.isLoading && (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-16 w-2/3 rounded-xl" />
            <Skeleton className="ml-auto h-24 w-5/6 rounded-xl" />
          </div>
        )}

        {!stored.isLoading && messages.length === 0 && !busy && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-sans text-lg">
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
          {messages.map((message) => (
            <Bubble key={message.id} role={message.role} sources={message.sources}>
              {message.content}
            </Bubble>
          ))}

          {busy && streamed && <Bubble role="assistant">{streamed}</Bubble>}
          {busy && !streamed && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              L'assistant consulte vos documents…
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-20 mt-4 flex items-end gap-2 rounded-full border border-border bg-card/95 py-1 pl-4 pr-1 backdrop-blur md:bottom-4">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder="Votre question…"
            aria-label="Votre question"
            className="max-h-32 min-h-0 resize-none overflow-y-auto border-0 bg-transparent py-2 text-sm shadow-none placeholder:text-xs placeholder:text-muted-foreground/70 focus-visible:ring-0 md:text-sm"
          />
          <Button
            onClick={() => void send(input)}
            disabled={busy || !input.trim()}
            size="icon"
            aria-label="Envoyer"
            className="mb-1 size-9 shrink-0 rounded-full"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
          </Button>
        </div>
      </section>

    </div>
  );
}

function Bubble({
  role,
  children,
  sources = [],
}: {
  role: "user" | "assistant";
  children: string;
  sources?: ChatMessageRow["sources"];
}) {
  return (
    <div className={cn("flex min-w-0 gap-2 sm:gap-3", role === "user" && "flex-row-reverse")}>
      <span
        className={cn(
          "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full",
          role === "user" ? "bg-secondary" : "bg-cert/15 text-cert",
        )}
        aria-hidden
      >
        {role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
      </span>
      <div
        className={cn(
          "min-w-0 max-w-[calc(100%-2.75rem)] rounded-xl border border-border px-3 py-3 text-sm leading-relaxed sm:px-4 lg:max-w-[85%]",
          role === "user" ? "bg-secondary" : "bg-card",
        )}
      >
        {role === "assistant" ? (
          <MarkdownView>{children}</MarkdownView>
        ) : (
          <p className="whitespace-pre-wrap">{children}</p>
        )}
        {role === "assistant" && sources.length > 0 && (
          <details className="mt-3 rounded-lg border border-border bg-secondary/40 p-2">
            <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
              {sources.length} extrait{sources.length > 1 ? "s" : ""} de vos documents
            </summary>
            <ul className="mt-2 space-y-2">
              {sources.map((source, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Extrait {i + 1} — </span>
                  <span className="break-words">{source.content}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
