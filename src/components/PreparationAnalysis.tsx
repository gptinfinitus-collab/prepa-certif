import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Brain, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { analyzePreparation } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/i18n";

interface SessionRow {
  id: string;
  scope: string;
  mode: string;
  difficulty: string;
  total: number;
  correct: number;
  score: number;
  created_at: string;
}

interface Analysis {
  level: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export function PreparationAnalysis({
  certificationName,
  certificationId,
}: {
  certificationName: string;
  certificationId: string | null;
}) {
  const t = useT();
  const analyze = useServerFn(analyzePreparation);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const sessions = useQuery({
    queryKey: ["quiz_sessions", certificationId],
    queryFn: async () => {
      let query = supabase
        .from("quiz_sessions")
        .select("id, scope, mode, difficulty, total, correct, score, created_at")
        .order("created_at", { ascending: false })
        .limit(30);
      if (certificationId) query = query.eq("certification_id", certificationId);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as SessionRow[];
    },
  });

  const rows = sessions.data ?? [];

  const byScope = useMemo(() => {
    const map = new Map<string, { score: number; count: number; questions: number }>();
    for (const row of rows) {
      const entry = map.get(row.scope) ?? { score: 0, count: 0, questions: 0 };
      entry.score += row.score;
      entry.count += 1;
      entry.questions += row.total;
      map.set(row.scope, entry);
    }
    return [...map.entries()]
      .map(([scope, e]) => ({
        scope,
        average: Math.round(e.score / e.count),
        sessions: e.count,
        questions: e.questions,
      }))
      .sort((a, b) => a.average - b.average);
  }, [rows]);

  const global = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + r.score, 0) / rows.length)
    : 0;

  const mutation = useMutation({
    mutationFn: async () => analyze({ data: { certificationName, certificationId } }),
    onSuccess: (result) => setAnalysis(result as Analysis),
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans text-lg">
            <Brain className="size-5 text-cert" aria-hidden />
            {t("quiz.analysis.title", { certificationName })}
          </CardTitle>
          <CardDescription>
            {t("quiz.analysis.description", { count: rows.length })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-4xl font-semibold">{global}%</span>
            <span className="text-sm text-muted-foreground">{t("quiz.analysis.averageSuccess")}</span>
          </div>
          <Progress value={global} />

          {byScope.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium">{t("quiz.analysis.byChapterTitle")}</p>
              {byScope.map((item) => (
                <div key={item.scope} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{item.scope}</span>
                    <span className="shrink-0 text-muted-foreground">
                      {t("quiz.analysis.questionsCount", { average: item.average, count: item.questions })}
                    </span>
                  </div>
                  <Progress value={item.average} />
                </div>
              ))}
            </div>
          )}

          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || rows.length === 0}>
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-4" aria-hidden />
            )}
            {t("quiz.analysis.analyzeButton")}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-lg">
              <TrendingUp className="size-5 text-cert" aria-hidden />
              {t("quiz.analysis.aiAnalysisTitle")}
            </CardTitle>
            <CardDescription>{analysis.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Badge variant="secondary">{t("quiz.analysis.estimatedLevel", { level: analysis.level })}</Badge>
            {[
              { title: t("quiz.analysis.strengths"), items: analysis.strengths },
              { title: t("quiz.analysis.weaknesses"), items: analysis.weaknesses },
              { title: t("quiz.analysis.recommendations"), items: analysis.recommendations },
            ]
              .filter((block) => block.items.length > 0)
              .map((block) => (
                <div key={block.title} className="space-y-1">
                  <p className="font-medium">{block.title}</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-lg">{t("quiz.analysis.sessionHistoryTitle")}</CardTitle>
          <CardDescription>{t("quiz.analysis.sessionHistoryDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("quiz.analysis.noSessions")}
            </p>
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.scope}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleString("fr-FR")} ·{" "}
                    {row.mode === "qcm" ? t("quiz.trainer.formatQcm") : t("quiz.trainer.formatOpen")} · {row.difficulty}
                  </p>
                </div>
                <Badge variant={row.score >= 70 ? "default" : "secondary"}>
                  {row.score}% ({row.correct}/{row.total})
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
