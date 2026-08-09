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
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <Brain className="size-5 text-cert" aria-hidden />
            Niveau de préparation — {certificationName}
          </CardTitle>
          <CardDescription>
            Calculé sur vos {rows.length} dernière(s) session(s) d'entraînement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl font-semibold">{global}%</span>
            <span className="text-sm text-muted-foreground">de réussite moyenne</span>
          </div>
          <Progress value={global} />

          {byScope.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium">Score par chapitre</p>
              {byScope.map((item) => (
                <div key={item.scope} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{item.scope}</span>
                    <span className="shrink-0 text-muted-foreground">
                      {item.average}% · {item.questions} question(s)
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
            Analyser mes points faibles
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <TrendingUp className="size-5 text-cert" aria-hidden />
              Analyse IA
            </CardTitle>
            <CardDescription>{analysis.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Badge variant="secondary">Niveau estimé : {analysis.level}</Badge>
            {[
              { title: "Points forts", items: analysis.strengths },
              { title: "À travailler", items: analysis.weaknesses },
              { title: "Recommandations", items: analysis.recommendations },
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
          <CardTitle className="font-serif text-lg">Historique des sessions</CardTitle>
          <CardDescription>Vos entraînements enregistrés pour ce cursus.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune session pour le moment : lancez un entraînement pour démarrer le suivi.
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
                    {row.mode === "qcm" ? "QCM" : "Questions ouvertes"} · {row.difficulty}
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
