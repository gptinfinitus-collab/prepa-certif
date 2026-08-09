import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { QuizTrainer } from "@/components/QuizTrainer";
import { PreparationAnalysis } from "@/components/PreparationAnalysis";
import { useCurriculum } from "@/lib/curriculum";
import { useActiveCertification } from "@/lib/certifications";
import type { QuizItem } from "@/data/program";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz IA et niveau de préparation — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Générez des QCM et questions ouvertes corrigés par l'IA à partir de votre norme et de vos documents, et suivez votre niveau de préparation chapitre par chapitre.",
      },
      { property: "og:title", content: "Quiz IA et niveau de préparation — PREPA CERTIF" },
      {
        property: "og:description",
        content:
          "Entraînements générés par l'IA, correction commentée avec renvoi aux clauses et analyse de vos points faibles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuizPage,
});

interface Flashcard extends QuizItem {
  source: string;
}

type Verdict = "known" | "review";

function QuizPage() {
  const { curriculum, certificationName } = useCurriculum();
  const { certificationId } = useActiveCertification();

  const chapters = useMemo(
    () => curriculum.modules.map((module) => module.title),
    [curriculum],
  );

  const flashcards = useMemo<Flashcard[]>(() => {
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

  const total = flashcards.length;
  const answered = Object.keys(verdicts).length;
  const known = Object.values(verdicts).filter((v) => v === "known").length;
  const current = flashcards[index];

  function record(verdict: Verdict) {
    setVerdicts((prev) => ({ ...prev, [index]: verdict }));
    setRevealed(false);
    setIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)));
  }

  return (
    <AppShell title="Quiz">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">Entraînement et niveau</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Quiz générés par l'IA sur {certificationName}, corrigés avec renvoi aux clauses, et suivi
          de votre progression par chapitre.
        </p>

        <Tabs value={tab} onValueChange={setTab} className="mt-8">
          <TabsList className="flex w-full flex-wrap justify-start sm:w-auto">
            <TabsTrigger value="training">Entraînement</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="analysis">Mon niveau</TabsTrigger>
            <TabsTrigger value="cards">Fiches</TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="mt-6">
            <QuizTrainer
              key={focus ?? "default"}
              certificationName={certificationName}
              certificationId={certificationId}
              chapters={chapters}
              initialChapter={focus}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <QuizHistory
              certificationId={certificationId}
              chapters={chapters}
              onRetrain={(topic) => {
                setFocus(topic);
                setTab("training");
              }}
            />
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <PreparationAnalysis
              certificationName={certificationName}
              certificationId={certificationId}
            />
          </TabsContent>


          <TabsContent value="cards" className="mt-6">
            {total === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans text-lg">Aucune fiche disponible</CardTitle>
                  <CardDescription>
                    Le cursus de cette certification ne contient pas encore de questions rédigées.
                    Utilisez l'entraînement généré par l'IA à partir de vos documents.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader className="gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardDescription>
                      Fiche {Math.min(index + 1, total)} sur {total}
                    </CardDescription>
                    <Badge variant="secondary">{current?.source}</Badge>
                  </div>
                  <Progress value={(answered / total) * 100} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-sans text-lg leading-snug">{current?.question}</p>
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
                      onClick={() => {
                        setVerdicts({});
                        setIndex(0);
                        setRevealed(false);
                      }}
                    >
                      <RotateCcw className="size-4" aria-hidden />
                      Recommencer
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {known} maîtrisée(s) sur {answered} fiche(s) traitée(s).
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
