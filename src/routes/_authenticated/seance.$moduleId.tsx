import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { MarkdownView } from "@/components/MarkdownView";
import { Quiz } from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModule, modules, typeLabels } from "@/data/program";
import { useProgress, useSetModuleProgress } from "@/lib/queries";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/_authenticated/seance/$moduleId")({
  head: ({ params }) => {
    const module = getModule(Number(params.moduleId));
    const title = module ? `${module.title} — PREPA IRCA 45001` : "Séance — PREPA IRCA 45001";
    const description = module?.objective ?? "Séance de préparation à l'audit ISO 45001.";
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  loader: ({ params }) => {
    const module = getModule(Number(params.moduleId));
    if (!module) throw notFound();
    return null;
  },
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
  const id = Number(moduleId);
  const module = getModule(id);
  const { data: progress = [] } = useProgress();
  const setProgress = useSetModuleProgress();

  if (!module) return null;

  const done = progress.some((p) => p.module_id === id && p.completed);
  const index = modules.findIndex((m) => m.id === id);
  const previous = index > 0 ? modules[index - 1] : undefined;
  const next = index < modules.length - 1 ? modules[index + 1] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">
            Programme
          </Link>
          <span>/</span>
          <span>{module.dayLabel}</span>
          <Badge variant="secondary">{typeLabels[module.type]}</Badge>
        </div>

        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight">{module.title}</h1>
        <p className="mt-3 rounded-md border-l-2 border-primary bg-secondary/50 p-3 text-sm">
          <strong className="font-medium">Objectif :</strong> {module.objective}
        </p>

        <article className="mt-8">
          <MarkdownView>{module.contentMarkdown}</MarkdownView>
        </article>

        {module.keyTakeaway ? (
          <Card className="mt-8 border-accent/60 bg-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-base">
                <Lightbulb className="size-4" aria-hidden />À retenir
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{module.keyTakeaway}</CardContent>
          </Card>
        ) : null}

        {module.quiz.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold">Auto-évaluation</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Répondez mentalement ou par écrit, puis comparez avec la réponse attendue.
            </p>
            <div className="mt-4">
              <Quiz items={module.quiz} />
            </div>
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button
            variant={done ? "secondary" : "default"}
            disabled={setProgress.isPending}
            onClick={() =>
              setProgress.mutate(
                { moduleId: id, completed: !done },
                {
                  onSuccess: () =>
                    toast.success(done ? "Séance rouverte." : "Séance marquée comme terminée."),
                  onError: () => toast.error("Impossible d'enregistrer la progression."),
                },
              )
            }
          >
            <CheckCircle2 className="size-4" aria-hidden />
            {done ? "Terminée — annuler" : "Marquer comme terminée"}
          </Button>
          <div className="ml-auto flex gap-2">
            {previous ? (
              <Button asChild variant="outline" size="sm">
                <Link to="/seance/$moduleId" params={{ moduleId: String(previous.id) }}>
                  <ArrowLeft className="size-4" aria-hidden />
                  Précédente
                </Link>
              </Button>
            ) : null}
            {next ? (
              <Button asChild variant="outline" size="sm">
                <Link to="/seance/$moduleId" params={{ moduleId: String(next.id) }}>
                  Suivante
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
