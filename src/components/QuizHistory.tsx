import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, History, Loader2, Target, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ALL_TOPICS,
  averageScore,
  filterAnswers,
  filterSessions,
  formatSessionDate,
  scoreTrend,
  sessionTopics,
  topicStats,
  weakestTopic,
  type QuizAnswerRow,
  type QuizSessionRow,
  type ResultFilter,
} from "@/lib/quiz-history";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

export function QuizHistory({
  certificationId,
  chapters,
  onRetrain,
}: {
  certificationId: string | null;
  chapters: string[];
  onRetrain: (topic: string) => void;
}) {
  const t = useT();
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [result, setResult] = useState<ResultFilter>("all");

  const sessions = useQuery({
    queryKey: ["quiz_sessions", "history", certificationId],
    queryFn: async () => {
      let query = supabase
        .from("quiz_sessions")
        .select("id, scope, topic, mode, difficulty, total, correct, score, source_count, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (certificationId) query = query.eq("certification_id", certificationId);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as QuizSessionRow[];
    },
  });

  const answers = useQuery({
    queryKey: ["quiz_answers", "history", certificationId, sessions.data?.length ?? 0],
    enabled: (sessions.data?.length ?? 0) > 0,
    queryFn: async () => {
      const ids = (sessions.data ?? []).map((s) => s.id);
      const { data, error } = await supabase
        .from("quiz_answers")
        .select(
          "id, session_id, position, chapter, clause, question, choices, expected, explanation, user_answer, is_correct, score, feedback",
        )
        .in("session_id", ids)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as QuizAnswerRow[];
    },
  });

  const allSessions = sessions.data ?? [];
  const allAnswers = useMemo(() => answers.data ?? [], [answers.data]);

  const topics = useMemo(() => sessionTopics(allSessions), [allSessions]);
  const visible = useMemo(
    () => filterSessions(allSessions, { topic, result }),
    [allSessions, topic, result],
  );
  const stats = useMemo(() => topicStats(allAnswers).slice(0, 5), [allAnswers]);
  const weakest = useMemo(() => weakestTopic(allAnswers, chapters), [allAnswers, chapters]);
  const average = averageScore(allSessions);
  const trend = scoreTrend(allSessions);

  const answersBySession = useMemo(() => {
    const map = new Map<string, QuizAnswerRow[]>();
    for (const answer of allAnswers) {
      const list = map.get(answer.session_id) ?? [];
      list.push(answer);
      map.set(answer.session_id, list);
    }
    return map;
  }, [allAnswers]);

  if (sessions.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {t("quiz.history.loading")}
      </div>
    );
  }

  if (allSessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-lg">{t("quiz.history.noneTitle")}</CardTitle>
          <CardDescription>{t("quiz.history.noneDesc")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="font-sans text-lg">{t("quiz.history.summaryTitle")}</CardTitle>
          <CardDescription>
            {t("quiz.history.summaryDesc", {
              count: allSessions.length,
              average,
              trend: trend !== 0 ? t("quiz.history.summaryTrend", { sign: trend > 0 ? "+" : "", trend }) : "",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={average} />
          {stats.length > 0 ? (
            <ul className="space-y-2">
              {stats.map((stat) => (
                <li key={stat.topic} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">{stat.topic}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {stat.correct}/{stat.attempts} · {Math.round(stat.ratio * 100)} %
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {weakest ? (
            <Button onClick={() => onRetrain(weakest)} className="w-full sm:w-auto">
              <Target className="size-4" aria-hidden />
              {t("quiz.history.retrain", { topic: weakest })}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("quiz.history.noWeakness")}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger aria-label={t("quiz.history.filterChapterLabel")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TOPICS}>{t("quiz.history.allChapters")}</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={result} onValueChange={(v) => setResult(v as ResultFilter)}>
            <SelectTrigger aria-label={t("quiz.history.filterResultLabel")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("quiz.history.allResults")}</SelectItem>
              <SelectItem value="correct">{t("quiz.history.successfulSessions")}</SelectItem>
              <SelectItem value="incorrect">{t("quiz.history.toReviewSessions")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("quiz.history.noSessionsMatch")}</p>
      ) : (
        <Accordion type="single" collapsible className="space-y-3">
          {visible.map((session) => {
            const rows = filterAnswers(answersBySession.get(session.id) ?? [], result);
            return (
              <AccordionItem
                key={session.id}
                value={session.id}
                className="rounded-xl border border-border bg-card px-4"
              >
                <AccordionTrigger className="gap-3 text-left">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-medium">{session.topic ?? session.scope}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatSessionDate(session.created_at)} ·{" "}
                      {session.mode === "qcm" ? t("quiz.trainer.formatQcm") : t("quiz.trainer.formatOpen")} · {session.difficulty}
                    </span>
                  </div>
                  <Badge variant={session.score >= 60 ? "secondary" : "destructive"}>
                    {session.score} / 100
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <p className="text-xs text-muted-foreground">
                    {t("quiz.history.correctCount", { correct: session.correct, total: session.total })}
                    {session.source_count > 0
                      ? t("quiz.history.sourceCount", { count: session.source_count })
                      : ""}
                  </p>
                  {rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("quiz.history.noAnswersMatch")}
                    </p>
                  ) : (
                    rows.map((row) => (
                      <div
                        key={row.id}
                        className={cn(
                          "space-y-2 rounded-lg border-l-2 bg-secondary/40 p-4 text-sm",
                          row.is_correct ? "border-emerald-500" : "border-destructive",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {row.is_correct ? (
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden />
                          ) : (
                            <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                          )}
                          <p className="font-medium leading-snug">{row.question}</p>
                        </div>
                        {row.clause ? (
                          <Badge variant="outline">{t("quiz.history.clauseBadge", { clause: row.clause })}</Badge>
                        ) : null}
                        <p>
                          <span className="text-muted-foreground">{t("quiz.history.yourAnswer")}</span>
                          {row.user_answer?.trim() || "—"}
                        </p>
                        {row.expected ? (
                          <p>
                            <span className="text-muted-foreground">{t("quiz.history.expectedAnswer")}</span>
                            {row.expected}
                          </p>
                        ) : null}
                        {row.explanation ? (
                          <p className="text-muted-foreground">{row.explanation}</p>
                        ) : null}
                        {row.feedback ? (
                          <p className="rounded-md bg-background/60 p-3">
                            <span className="text-muted-foreground">{t("quiz.history.aiFeedback")}</span>
                            {row.feedback}
                          </p>
                        ) : null}
                      </div>
                    ))
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <History className="size-3.5" aria-hidden />
        {t("quiz.history.retained")}
      </p>
    </div>
  );
}
