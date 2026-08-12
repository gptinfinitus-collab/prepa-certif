import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { QuizTrainer } from "@/components/QuizTrainer";
import { QuizHistory } from "@/components/QuizHistory";
import { PreparationAnalysis } from "@/components/PreparationAnalysis";
import { useCurriculum } from "@/lib/curriculum";
import { useActiveCertification } from "@/lib/certifications";
import type { QuizItem } from "@/data/program";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useT } from "@/i18n";

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
  const t = useT();
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
      source: t("quiz.examTopicLabel"),
    }));
    return [...fromModules, ...fromExam];
  }, [curriculum]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [verdicts, setVerdicts] = useState<Record<number, Verdict>>({});
  const [tab, setTab] = useState("training");
  const [focusChapter, setFocusChapter] = useState<string | null>(null);


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
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("quiz.pageTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("quiz.pageIntro", { certificationName })}
        </p>

        <Tabs value={tab} onValueChange={setTab} className="mt-8">
          <TabsList className="no-scrollbar flex w-full max-w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="training" className="shrink-0 px-2.5 text-[0.8rem] sm:px-3 sm:text-sm">
              {t("quiz.tabs.training")}
            </TabsTrigger>
            <TabsTrigger value="history" className="shrink-0 px-2.5 text-[0.8rem] sm:px-3 sm:text-sm">
              {t("quiz.tabs.history")}
            </TabsTrigger>
            <TabsTrigger value="analysis" className="shrink-0 px-2.5 text-[0.8rem] sm:px-3 sm:text-sm">
              {t("quiz.tabs.analysis")}
            </TabsTrigger>
            <TabsTrigger value="cards" className="shrink-0 px-2.5 text-[0.8rem] sm:px-3 sm:text-sm">
              {t("quiz.tabs.cards")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="mt-6">
            <QuizTrainer
              key={focusChapter ?? "default"}
              certificationName={certificationName}
              certificationId={certificationId}
              chapters={chapters}
              initialChapter={focusChapter}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <QuizHistory
              certificationId={certificationId}
              chapters={chapters}
              onRetrain={(topic: string) => {
                setFocusChapter(topic);
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
                  <CardTitle className="font-sans text-lg">{t("quiz.cards.noneTitle")}</CardTitle>
                  <CardDescription>{t("quiz.cards.noneDesc")}</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader className="gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardDescription>
                      {t("quiz.cards.counter", { current: Math.min(index + 1, total), total })}
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
                      {t("quiz.cards.showAnswer")}
                    </Button>
                  )}
                  <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                    <Button onClick={() => record("known")} disabled={!revealed}>
                      {t("quiz.cards.know")}
                    </Button>
                    <Button variant="outline" onClick={() => record("review")} disabled={!revealed}>
                      {t("quiz.cards.review")}
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
                      {t("quiz.cards.restart")}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("quiz.cards.summary", { known, answered })}
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
