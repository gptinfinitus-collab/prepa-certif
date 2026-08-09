import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, RotateCcw, Sparkles, Wand2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { generateQuizQuestions, gradeOpenAnswers } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useActiveTrack, useExamBody } from "@/lib/learning";

interface GeneratedQuestion {
  question: string;
  choices?: string[] | undefined;
  answerIndex?: number | undefined;
  expected?: string | undefined;
  explanation: string;
  clause: string;
}

interface Correction {
  score: number;
  feedback: string;
}

const ALL = "__all__";

export function QuizTrainer({
  certificationName,
  certificationId,
  chapters,
}: {
  certificationName: string;
  certificationId: string | null;
  chapters: string[];
}) {
  const generate = useServerFn(generateQuizQuestions);
  const grade = useServerFn(gradeOpenAnswers);
  const { track } = useActiveTrack();
  const { examBody } = useExamBody();
  const queryClient = useQueryClient();

  const [chapter, setChapter] = useState<string>(ALL);
  const [count, setCount] = useState("5");
  const [mode, setMode] = useState<"qcm" | "ouverte">("qcm");
  const [difficulty, setDifficulty] = useState<"facile" | "standard" | "examen">("examen");

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [sourceCount, setSourceCount] = useState(0);
  const [choiceAnswers, setChoiceAnswers] = useState<Record<number, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<number, string>>({});
  const [corrections, setCorrections] = useState<Record<number, Correction> | null>(null);
  const [saved, setSaved] = useState(false);

  const scope = chapter === ALL ? "Programme complet" : chapter;

  const qcmDone = mode === "qcm" && questions.length > 0 &&
    Object.keys(choiceAnswers).length === questions.length;
  const correctCount = useMemo(
    () => questions.filter((q, i) => choiceAnswers[i] === q.answerIndex).length,
    [questions, choiceAnswers],
  );

  const finalScore = useMemo(() => {
    if (mode === "qcm")
      return questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
    if (!corrections) return 0;
    const values = Object.values(corrections);
    return values.length
      ? Math.round(values.reduce((sum, c) => sum + c.score, 0) / values.length)
      : 0;
  }, [mode, questions.length, correctCount, corrections]);

  async function persist(payload: {
    total: number;
    correct: number;
    score: number;
    rows: {
      position: number;
      clause: string;
      question: string;
      choices: string[] | null;
      expected: string | null;
      explanation: string;
      user_answer: string;
      is_correct: boolean;
      score: number;
      feedback: string | null;
    }[];
  }) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const { data: session, error } = await supabase
      .from("quiz_sessions")
      .insert({
        user_id: user.id,
        certification_id: certificationId,
        scope,
        topic: chapter === ALL ? null : chapter,
        mode,
        difficulty,
        total: payload.total,
        correct: payload.correct,
        score: payload.score,
        source_count: sourceCount,
      })
      .select("id")
      .single();
    if (error || !session) return;

    await supabase.from("quiz_answers").insert(
      payload.rows.map((row) => ({
        session_id: session.id,
        user_id: user.id,
        chapter: chapter === ALL ? null : chapter,
        ...row,
      })),
    );
    setSaved(true);
    queryClient.invalidateQueries({ queryKey: ["quiz_sessions"] });
  }

  const generation = useMutation({
    mutationFn: async () =>
      generate({
        data: {
          certificationName,
          chapter: chapter === ALL ? undefined : chapter,
          count: Number(count),
          difficulty,
          mode,
          track,
          examBody,
        },
      }),
    onSuccess: (result) => {
      setQuestions(result.questions);
      setSourceCount(result.sourceCount);
      setChoiceAnswers({});
      setOpenAnswers({});
      setCorrections(null);
      setSaved(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const correction = useMutation({
    mutationFn: async () => {
      const items = questions.map((q, i) => ({
        question: q.question,
        expected: q.expected ?? "",
        answer: openAnswers[i]?.trim() || "(pas de réponse)",
      }));
      const result = await grade({ data: { certificationName, items } });
      return result.results;
    },
    onSuccess: async (results) => {
      const map: Record<number, Correction> = {};
      results.forEach((r, i) => {
        map[i] = { score: Math.round(r.score), feedback: r.feedback };
      });
      setCorrections(map);
      const avg = results.length
        ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
        : 0;
      await persist({
        total: questions.length,
        correct: results.filter((r) => r.score >= 60).length,
        score: avg,
        rows: questions.map((q, i) => ({
          position: i,
          clause: q.clause,
          question: q.question,
          choices: null,
          expected: q.expected ?? null,
          explanation: q.explanation,
          user_answer: openAnswers[i] ?? "",
          is_correct: (map[i]?.score ?? 0) >= 60,
          score: map[i]?.score ?? 0,
          feedback: map[i]?.feedback ?? null,
        })),
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function finishQcm() {
    await persist({
      total: questions.length,
      correct: correctCount,
      score: finalScore,
      rows: questions.map((q, i) => ({
        position: i,
        clause: q.clause,
        question: q.question,
        choices: q.choices ?? null,
        expected:
          q.choices && q.answerIndex !== undefined ? (q.choices[q.answerIndex] ?? null) : null,
        explanation: q.explanation,
        user_answer:
          choiceAnswers[i] !== undefined ? (q.choices?.[choiceAnswers[i]] ?? "") : "",
        is_correct: choiceAnswers[i] === q.answerIndex,
        score: choiceAnswers[i] === q.answerIndex ? 100 : 0,
        feedback: null,
      })),
    });
    toast.success("Session enregistrée dans votre historique.");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans text-lg">
            <Wand2 className="size-5 text-cert" aria-hidden />
            Nouvel entraînement
          </CardTitle>
          <CardDescription>
            Questions générées à partir de {certificationName}, du chapitre choisi et de vos
            documents indexés.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Chapitre</Label>
              <Select value={chapter} onValueChange={setChapter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Programme complet</SelectItem>
                  {chapters.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Questions</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["3", "5", "8", "10"].map((n) => (
                    <SelectItem key={n} value={n}>
                      {n} questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Format</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as "qcm" | "ouverte")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qcm">QCM</SelectItem>
                  <SelectItem value="ouverte">Questions ouvertes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Niveau</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as typeof difficulty)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facile">Découverte</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="examen">Examen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => generation.mutate()} disabled={generation.isPending}>
              {generation.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Sparkles className="size-4" aria-hidden />
              )}
              Générer l'entraînement
            </Button>
            {questions.length > 0 && (
              <>
                <Badge variant="secondary">
                  {sourceCount > 0
                    ? `${sourceCount} extrait(s) de vos documents`
                    : "Sans document indexé"}
                </Badge>
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => {
                    setQuestions([]);
                    setCorrections(null);
                    setSaved(false);
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden />
                  Effacer
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {questions.map((q, qi) => {
        const chosen = choiceAnswers[qi];
        const revealed = mode === "qcm" ? chosen !== undefined : !!corrections;
        return (
          <Card key={qi}>
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="font-sans text-base leading-snug">
                  {qi + 1}. {q.question}
                </CardTitle>
                {q.clause && <Badge variant="outline">Clause {q.clause}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mode === "qcm" ? (
                <div className="space-y-2">
                  {(q.choices ?? []).map((choice, ci) => {
                    const isAnswer = q.answerIndex === ci;
                    return (
                      <button
                        key={ci}
                        type="button"
                        disabled={revealed}
                        onClick={() => setChoiceAnswers((prev) => ({ ...prev, [qi]: ci }))}
                        className={cn(
                          "w-full rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                          revealed && isAnswer && "border-cert bg-cert/10 font-medium",
                          revealed && chosen === ci && !isAnswer && "border-destructive bg-destructive/10",
                        )}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Textarea
                  value={openAnswers[qi] ?? ""}
                  disabled={!!corrections}
                  onChange={(e) =>
                    setOpenAnswers((prev) => ({ ...prev, [qi]: e.target.value }))
                  }
                  placeholder="Rédigez votre réponse d'auditeur…"
                  rows={4}
                />
              )}

              {mode === "ouverte" && corrections?.[qi] && (
                <div className="space-y-2 rounded-md bg-secondary/60 p-3 text-sm leading-relaxed">
                  <div className="flex items-center gap-2 font-medium">
                    {corrections[qi].score >= 60 ? (
                      <CheckCircle2 className="size-4 text-cert" aria-hidden />
                    ) : (
                      <XCircle className="size-4 text-destructive" aria-hidden />
                    )}
                    {corrections[qi].score}/100
                  </div>
                  <p>{corrections[qi].feedback}</p>
                  {q.expected && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Réponse attendue :</span> {q.expected}
                    </p>
                  )}
                </div>
              )}

              {revealed && q.explanation && (
                <p className="rounded-md border-l-2 border-cert bg-secondary/40 p-3 text-sm leading-relaxed">
                  {q.explanation}
                  {q.clause && (
                    <span className="text-muted-foreground"> (voir clause {q.clause})</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}

      {questions.length > 0 && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            {mode === "ouverte" && !corrections ? (
              <Button onClick={() => correction.mutate()} disabled={correction.isPending}>
                {correction.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="size-4" aria-hidden />
                )}
                Corriger mes réponses
              </Button>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-2xl font-semibold sm:text-3xl">{finalScore}%</span>
                  <span className="text-sm text-muted-foreground">
                    {mode === "qcm"
                      ? `${correctCount} bonne(s) réponse(s) sur ${questions.length}`
                      : "score moyen de vos réponses"}
                  </span>
                </div>
                <Progress value={finalScore} />
                {mode === "qcm" && (
                  <Button onClick={finishQcm} disabled={!qcmDone || saved}>
                    {saved ? "Session enregistrée" : "Terminer et enregistrer"}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
