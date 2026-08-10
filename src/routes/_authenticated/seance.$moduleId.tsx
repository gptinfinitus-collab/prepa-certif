import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { LessonBlocks } from "@/components/course/LessonBlocks";
import { LessonQuiz } from "@/components/course/LessonQuiz";
import { CourseProgressBar, SectionNav } from "@/components/course/SectionNav";
import { ReferenceBadge } from "@/components/course/ReferenceBadge";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { typeLabels } from "@/data/program";
import { useProgress, useSetModuleProgress } from "@/lib/queries";
import {
  useLessonNote,
  useLessonProgress,
  useRecordTopicMastery,
  useSaveLessonNote,
  useSaveLessonProgress,
} from "@/lib/learning";
import { useCurriculum } from "@/lib/curriculum";
import { buildLessonSections, lessonReadingMinutes } from "@/lib/lesson-sections";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Clock, List, MessageCircleQuestion, NotebookPen } from "lucide-react";

const searchSchema = z.object({
  section: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/seance/$moduleId")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Séance de préparation — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Cours séquencé : comprendre, exemples, regard de l'auditeur, point examen, mise en situation et quiz.",
      },
      { property: "og:title", content: "Séance de préparation — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Cours découpé en étapes courtes, avec flashcards et quiz de fin de séance.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  errorComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">
      Cette séance n'a pas pu être chargée.
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Séance introuvable.</div>
  ),
  component: Seance,
});

function Seance() {
  const { moduleId } = Route.useParams();
  const { section: sectionParam } = Route.useSearch();
  const navigate = useNavigate();
  const id = Number(moduleId);
  const { curriculum } = useCurriculum();
  const modules = curriculum.modules;
  const module = modules.find((m) => m.id === id);

  const { data: progress = [] } = useProgress();
  const setProgress = useSetModuleProgress();
  const { data: lessonProgress } = useLessonProgress(id);
  const saveLessonProgress = useSaveLessonProgress();
  const recordMastery = useRecordTopicMastery();
  const { data: note = "" } = useLessonNote(id);
  const saveNote = useSaveLessonNote(id);

  const [readIds, setReadIds] = useState<string[]>([]);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);

  const sections = useMemo(() => (module ? buildLessonSections(module) : []), [module]);
  const currentId =
    sectionParam && sections.some((s) => s.id === sectionParam)
      ? sectionParam
      : (sections[0]?.id ?? "");
  const currentIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === currentId),
  );
  const current = sections[currentIndex];

  useEffect(() => {
    if (lessonProgress?.sections_read) setReadIds(lessonProgress.sections_read);
  }, [lessonProgress?.sections_read]);

  useEffect(() => {
    setNoteDraft(note);
  }, [note]);

  // Marque automatiquement la section affichée comme lue.
  useEffect(() => {
    if (!module || !currentId) return;
    if (readIds.includes(currentId)) return;
    const next = [...readIds, currentId];
    setReadIds(next);
    saveLessonProgress.mutate({
      moduleId: id,
      sectionsRead: next,
      currentSection: currentId,
      quizSubmitted: lessonProgress?.quiz_submitted ?? false,
      completed: lessonProgress?.completed ?? false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, module?.id]);

  if (!module) {
    return (
      <AppShell title="Séance">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Cette séance n'existe pas dans le cursus de la certification active.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/dashboard">Revenir au programme</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const requiredIds = sections.filter((s) => s.required).map((s) => s.id);
  const readRequired = requiredIds.filter((sid) => readIds.includes(sid)).length;
  const quizSection = sections.find((s) => s.kind === "quiz");
  const quizSubmitted = lessonProgress?.quiz_submitted ?? false;
  const allRequiredRead = readRequired === requiredIds.length;
  const canComplete = allRequiredRead && (!quizSection || quizSubmitted);
  const done = progress.some((p) => p.module_id === id && p.completed);
  const percent = requiredIds.length ? (readRequired / requiredIds.length) * 100 : 0;

  const goTo = (sid: string) => {
    void navigate({
      to: "/seance/$moduleId",
      params: { moduleId },
      search: { section: sid },
    });
  };

  const previousSection = sections[currentIndex - 1];
  const nextSection = sections[currentIndex + 1];
  const moduleIndex = modules.findIndex((m) => m.id === id);
  const nextModule = modules[moduleIndex + 1];

  const markComplete = () => {
    setProgress.mutate(
      { moduleId: id, completed: !done },
      {
        onSuccess: () => toast.success(done ? "Séance rouverte." : "Séance terminée."),
      },
    );
    saveLessonProgress.mutate({
      moduleId: id,
      sectionsRead: readIds,
      currentSection: currentId,
      quizSubmitted,
      completed: !done,
    });
  };

  const nav = (
    <SectionNav sections={sections} currentId={currentId} readIds={readIds} onSelect={goTo} />
  );

  return (
    <AppShell title="Séance">
      <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-6 md:py-10">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-6 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sommaire
            </p>
            {nav}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">
              Programme
            </Link>
            <span>/</span>
            <span>{module.dayLabel}</span>
            <Badge variant="secondary">{typeLabels[module.type]}</Badge>
            <ReferenceBadge reference={module} />
            <span className="flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {lessonReadingMinutes(module)} min
            </span>
          </div>


          <h1 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">{module.title}</h1>

          <div className="sticky top-0 z-10 -mx-4 mt-4 bg-background/95 px-4 py-3 backdrop-blur">
            <CourseProgressBar value={percent} />
            <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                Étape {currentIndex + 1} / {sections.length} — {readRequired}/{requiredIds.length}{" "}
                sections lues
              </span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <List className="size-4" aria-hidden />
                    Sommaire
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 overflow-y-auto p-4">
                  <SheetHeader className="p-0">
                    <SheetTitle className="text-sm">Sommaire du cours</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">{nav}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {current ? (
            <section className="mt-6" aria-labelledby="section-title">
              <h2 id="section-title" className="text-xl font-semibold">
                {current.title}
              </h2>
              <div className="mt-4">
                {current.kind === "quiz" && quizSection ? (
                  <LessonQuiz
                    items={module.quiz}
                    submitted={quizSubmitted}
                    onSubmit={(result) => {
                      saveLessonProgress.mutate({
                        moduleId: id,
                        sectionsRead: readIds,
                        currentSection: currentId,
                        quizSubmitted: true,
                        completed: done,
                      });
                      recordMastery.mutate(
                        Array.from({ length: result.total }, (_, i) => ({
                          topic: module.title,
                          correct: i < result.correct,
                        })),
                      );
                      toast.success("Quiz enregistré.");
                    }}
                  />
                ) : (
                  <LessonBlocks blocks={current.blocks} moduleId={id} />
                )}
              </div>
            </section>
          ) : null}

          <div className="mt-8 grid grid-cols-4 gap-2 border-t border-border pt-6 lg:flex lg:flex-wrap lg:items-center lg:gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!previousSection}
              onClick={() => previousSection && goTo(previousSection.id)}
              className="h-auto w-full flex-col gap-1 py-2 lg:h-9 lg:w-auto lg:flex-row lg:py-0"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              <span className="text-[10px] leading-none lg:hidden">Préc.</span>
              <span className="hidden lg:inline">Précédent</span>
            </Button>
            {nextSection ? (
              <Button
                size="sm"
                onClick={() => goTo(nextSection.id)}
                className="h-auto w-full flex-col gap-1 py-2 lg:h-9 lg:w-auto lg:flex-row lg:py-0"
              >
                <span className="text-[10px] leading-none lg:hidden">Continuer</span>
                <span className="hidden lg:inline">Continuer</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Button>
            ) : (
              <Button
                size="sm"
                variant={done ? "secondary" : "default"}
                onClick={markComplete}
                disabled={!canComplete && !done}
                className="h-auto w-full flex-col gap-1 py-2 lg:h-9 lg:w-auto lg:flex-row lg:py-0"
              >
                <span className="text-[10px] leading-none lg:hidden">
                  {done ? "Rouvrir" : "Terminer"}
                </span>
                <span className="hidden lg:inline">
                  {done ? "Rouvrir la séance" : "Terminer la séance"}
                </span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNoteOpen((v) => !v)}
              className="h-auto w-full flex-col gap-1 py-2 lg:h-9 lg:w-auto lg:flex-row lg:py-0"
            >
              <NotebookPen className="size-4 shrink-0" aria-hidden />
              <span className="text-[10px] leading-none lg:hidden">Note</span>
              <span className="hidden lg:inline">Ma note</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-auto w-full flex-col gap-1 py-2 lg:h-9 lg:w-auto lg:flex-row lg:py-0"
            >
              <Link to="/assistant">
                <MessageCircleQuestion className="size-4 shrink-0" aria-hidden />
                <span className="text-[10px] leading-none lg:hidden">IA</span>
                <span className="hidden lg:inline">Demander à l'IA</span>
              </Link>
            </Button>
          </div>

          {!canComplete && !done ? (
            <p className="mt-3 text-xs text-muted-foreground">
              La séance sera marquée terminée une fois toutes les sections parcourues et le quiz
              validé.
            </p>
          ) : null}

          {noteOpen ? (
            <div className="mt-6 space-y-2">
              <label htmlFor="lesson-note" className="text-sm font-medium">
                Note personnelle
              </label>
              <Textarea
                id="lesson-note"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={5}
                placeholder="Vos remarques, points à revoir, questions à poser…"
              />
              <Button
                size="sm"
                disabled={saveNote.isPending}
                onClick={() =>
                  saveNote.mutate(noteDraft, { onSuccess: () => toast.success("Note enregistrée.") })
                }
              >
                Enregistrer la note
              </Button>
            </div>
          ) : null}

          {nextModule ? (
            <div className="mt-8 border-t border-border pt-6">
              <Link
                to="/seance/$moduleId"
                params={{ moduleId: String(nextModule.id) }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Séance suivante : {nextModule.title}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
