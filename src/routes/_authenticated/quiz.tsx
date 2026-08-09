import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Brain, RotateCcw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiQuizGenerator } from "@/components/AiQuizGenerator";
import { useCurriculum } from "@/lib/curriculum";
import type { QuizItem } from "@/data/program";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz d'entraînement — PREPA ISO" },
      {
        name: "description",
        content:
          "Entraînez-vous avec des questions issues de votre cursus ISO et auto-évaluez votre niveau de préparation avant l'examen d'auditeur.",
      },
      { property: "og:title", content: "Quiz d'entraînement — PREPA ISO" },
      {
        property: "og:description",
        content: "Questions de révision et auto-évaluation de votre niveau de préparation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuizPage,
});

interface Question extends QuizItem {
  source: string;
}

type Verdict = "known" | "review";

function QuizPage() {
  const { curriculum, certificationName } = useCurriculum();

  const questions = useMemo<Question[]>(() => {
    const fromModules = curriculum.modules.flatMap((module) =>
      module.quiz.map((item) => ({ ...item, source: module.title })),
    );
    const fromExam = (curriculum.annexes.finalMockExam?.mcq ?? []).map((item) => ({
      ...item,
      source: "Examen blanc",
    }));
    return [...fromModules, ...fromExam];
  }, [curriculum]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [verdicts, setVerdicts] = useState<Record<number, Verdict>>({});

  const total = questions.length;
  const answered = Object.keys(verdicts).length;
  const known = Object.values(verdicts).filter((v) => v === "known").length;
  const score = answered > 0 ? Math.round((known / answered) * 100) : 0;
  const current = questions[index];

  function record(verdict: Verdict) {
    setVerdicts((prev) => ({ ...prev, [index]: verdict }));
    setRevealed(false);
    setIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)));
  }

  function reset() {
    setVerdicts({});
    setIndex(0);
    setRevealed(false);
  }

  return (
    <AppShell title="Quiz">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <h1 className="font-serif text-3xl font-semibold">Quiz d'entraînement</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions issues de votre cursus {certificationName}. Répondez mentalement, révélez la
          réponse attendue, puis évaluez-vous honnêtement.
        </p>

        <div className="mt-8">
          <AiQuizGenerator certificationName={certificationName} />
        </div>

        {total === 0 ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Aucune question disponible</CardTitle>
              <CardDescription>
                Le cursus de cette certification ne contient pas encore de questions rédigées.
                Ajoutez vos documents de cours dans la bibliothèque : ils alimenteront les quiz
                générés par l'IA.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader className="gap-2">
                <div className="flex items-center justify-between gap-3">
                  <CardDescription>
                    Question {Math.min(index + 1, total)} sur {total}
                  </CardDescription>
                  <Badge variant="secondary">{current?.source}</Badge>
                </div>
                <Progress value={(answered / total) * 100} />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-serif text-lg leading-snug">{current?.question}</p>
                {revealed ? (
                  <p className="rounded-lg border-l-2 border-cert bg-secondary/60 p-4 text-sm leading-relaxed">
                    {current?.answer}
                  </p>
                ) : (
                  <Button variant="outline" onClick={() => setRevealed(true)}>
                    Afficher la réponse
                  </Button>
                )}
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button onClick={() => record("known")} disabled={!revealed}>
                    Je maîtrise
                  </Button>
                  <Button variant="outline" onClick={() => record("review")} disabled={!revealed}>
                    À revoir
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-auto text-muted-foreground"
                    onClick={reset}
                  >
                    <RotateCcw className="size-4" aria-hidden />
                    Recommencer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-lg">
                  <Brain className="size-5 text-cert" aria-hidden />
                  Niveau de préparation
                </CardTitle>
                <CardDescription>
                  Estimation basée sur vos auto-évaluations : {known} maîtrisées sur {answered}{" "}
                  question(s) traitée(s).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-semibold">{score}%</span>
                  <span className="text-sm text-muted-foreground">de réussite déclarée</span>
                </div>
                <Progress value={score} />
                <p className="flex items-start gap-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-cert" aria-hidden />
                  Complétez cette auto-évaluation avec les questions générées par l'IA à partir de
                  vos documents de cours indexés dans la bibliothèque.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
