import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  Bot,
  Loader2,
  Menu,
  MessageSquarePlus,
  Send,
  Sparkles,
  Square,
  RotateCcw,
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
import { useT, useLocale } from "@/i18n";
import { useActiveCertification } from "@/lib/certifications";
import {
  useCreateThread,
  useDeleteThread,
  useThreadMessages,
  useThreads,
  type ChatMessageRow,
} from "@/lib/threads";
import { cn, translateAppError } from "@/lib/utils";


export function AssistantChat({ threadId }: { threadId: string }) {
  const t = useT();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { certification, certificationId } = useActiveCertification();
  const certificationName = certification?.name ?? t("assistant.defaultCertification");
  const suggestions = t("assistant.start.suggestions", { returnObjects: true }) as string[];

  const threads = useThreads(certificationId ?? null);
  const stored = useThreadMessages(threadId);
  const createThread = useCreateThread();
  const deleteThread = useDeleteThread();

  const [pending, setPending] = useState<ChatMessageRow[]>([]);
  const [streamed, setStreamed] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const [failed, setFailed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const exchangeRef = useRef<HTMLDivElement>(null);
  const anchoredRef = useRef(false);
  // Référence stable : le composeur ne se re-rend pas quand la conversation change.
  const sendHandlerRef = useRef<(text: string) => void>(() => {});
  const sendRef = useCallback((text: string) => sendHandlerRef.current(text), []);

  const messages = [...(stored.data ?? []), ...pending];

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPending([]);
    setStreamed("");
    setBusy(false);
    setFailed(false);
    anchoredRef.current = false;
    textareaRef.current?.focus();
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [threadId]);

  // Une seule fois par échange : on cale le début de la question/réponse en haut
  // de l'écran, puis on laisse l'utilisateur libre de scroller pendant l'écriture.
  useEffect(() => {
    if (!busy) {
      anchoredRef.current = false;
      return;
    }
    if (anchoredRef.current) return;
    anchoredRef.current = true;
    requestAnimationFrame(() => {
      exchangeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [busy]);

  // Bouton « aller en bas » quand on n'est pas déjà en bas de la conversation.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      setShowScrollDown(distance > 200);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Le contenu grandit pendant l'écriture sans déclencher de scroll.
    const observer = new ResizeObserver(onScroll);
    observer.observe(document.body);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

  }, []);


  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  async function send(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    setBusy(true);
    setStreamed("");
    setLastQuestion(text);
    setPending([{ id: `local-${Date.now()}`, role: "user", content: text, sources: [] }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error(t("common.sessionExpired"));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ threadId, question: text, certificationName, locale }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(await response.text().catch(() => t("assistant.errors.unavailable")));
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
            throw new Error(event.message ?? t("assistant.errors.answerUnavailable"));
          }
        }
      }
      setFailed(false);
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === "AbortError";
      if (!aborted) {
        setFailed(true);
        toast.error(translateAppError(t, error, "assistant.errors.unavailable"));
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
      // On recharge les messages persistés AVANT d'effacer l'affichage local :
      // le texte reste visible, sans clignotement ni perte de la réponse partielle.
      await queryClient.invalidateQueries({ queryKey: ["chat-messages", threadId] });
      await queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
      setStreamed("");
      setPending([]);
      textareaRef.current?.focus();
    }
  }

  sendHandlerRef.current = (text: string) => {
    void send(text);
  };

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
            <Button variant="ghost" size="icon" aria-label={t("assistant.history.trigger")}>
              <Menu className="size-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-xs p-0">
            <SheetHeader className="p-4 pb-2">
              <SheetTitle className="font-sans text-base">{t("assistant.history.title")}</SheetTitle>
              <SheetDescription className="text-xs">
                {t("assistant.history.description")}
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
                {t("assistant.history.newThread")}
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
                      aria-label={t("assistant.history.deleteThread", { title: thread.title })}
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
          <h1 className="font-sans text-xl font-semibold sm:text-2xl">{t("assistant.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("assistant.subtitle", { certificationName })}
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
                {t("assistant.start.title")}
              </CardTitle>
              <CardDescription>{t("assistant.start.description")}</CardDescription>
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
          {messages.map((message, index) => {
            const isCurrentExchange = pending.length > 0 && index === messages.length - pending.length;
            return (
              <div
                key={message.id}
                ref={isCurrentExchange ? exchangeRef : undefined}
                className={isCurrentExchange ? "scroll-mt-20" : undefined}
              >
                <Bubble role={message.role} sources={message.sources}>
                  {message.content}
                </Bubble>
              </div>
            );
          })}

          {busy && streamed && <Bubble role="assistant">{streamed}</Bubble>}
          {busy && !streamed && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t("assistant.loading")}
            </p>
          )}
          {!busy && failed && lastQuestion && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
              <span>{t("assistant.errors.interrupted")}</span>
              <Button size="sm" variant="outline" onClick={() => void send(lastQuestion)}>
                <RotateCcw className="size-4" aria-hidden />
                {t("assistant.errors.retry")}
              </Button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showScrollDown && (
          <button
            type="button"
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })}
            aria-label={t("assistant.scrollToBottom")}
            className="fixed bottom-36 right-4 z-30 rounded-full border border-border bg-card/95 p-2 text-muted-foreground shadow-lg backdrop-blur transition-colors hover:text-foreground md:bottom-20 md:right-8"
          >
            <ArrowDown className="size-4" aria-hidden />
          </button>
        )}


        <ChatComposer busy={busy} onSend={sendRef} onStop={stop} textareaRef={textareaRef} />
      </section>

    </div>
  );
}

/**
 * Composeur isolé : la saisie ne re-rend que ce composant, jamais toute la
 * conversation (rendu Markdown coûteux) — la frappe reste instantanée.
 */
const ChatComposer = memo(function ChatComposer({
  busy,
  onSend,
  onStop,
  textareaRef,
}: {
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const t = useT();
  const [value, setValue] = useState("");

  // Question préremplie depuis une page du cours SGS.
  useEffect(() => {
    try {
      const prefill = sessionStorage.getItem("assistant:prefill");
      if (prefill) {
        sessionStorage.removeItem("assistant:prefill");
        setValue(prefill);
      }
    } catch {
      /* stockage indisponible */
    }
    textareaRef.current?.focus();
  }, [textareaRef]);

  // Champ auto-extensible : 1 ligne au repos, jusqu'à ~5 lignes puis scroll interne.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [value, textareaRef]);

  function submit() {
    const text = value.trim();
    if (!text || busy) return;
    setValue("");
    onSend(text);
  }

  return (
    <div className="sticky bottom-20 mt-4 flex items-end gap-2 rounded-full border border-border bg-card/95 py-1 pl-4 pr-1 backdrop-blur md:bottom-4">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={1}
        placeholder={t("assistant.input.placeholder")}
        aria-label={t("assistant.input.ariaLabel")}
        className="max-h-32 min-h-0 resize-none overflow-y-auto border-0 bg-transparent py-2 text-sm shadow-none placeholder:text-xs placeholder:text-muted-foreground/70 focus-visible:ring-0 md:text-sm"
      />
      <Button
        onClick={() => (busy ? onStop() : submit())}
        disabled={!busy && !value.trim()}
        size="icon"
        aria-label={busy ? t("assistant.input.stop") : t("assistant.input.send")}
        className="mb-1 size-9 shrink-0 rounded-full"
      >
        {busy ? (
          <Square className="size-3.5 fill-current" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
      </Button>
    </div>
  );
});

const Bubble = memo(function Bubble({
  role,
  children,
  sources = [],
}: {
  role: "user" | "assistant";
  children: string;
  sources?: ChatMessageRow["sources"];
}) {
  const t = useT();
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
              {t("assistant.sources.count", { count: sources.length })}
            </summary>
            <ul className="mt-2 space-y-2">
              {sources.map((source, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {t("assistant.sources.label", { index: i + 1 })}
                  </span>
                  <span className="break-words">{source.content}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
});
