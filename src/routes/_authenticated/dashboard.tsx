import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { modules, program, typeLabels } from "@/data/program";
import { buildSchedule, scheduleByModuleId, computePace, formatShortDate } from "@/lib/schedule";
import { useProgress, useStudyPlan } from "@/lib/queries";
import { CheckCircle2, Circle, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Mon programme — PREPA IRCA 45001" },
      {
        name: "description",
        content:
          "Suivez vos séances de préparation IRCA ISO 45001, votre avancement et votre rythme par rapport au planning.",
      },
      { property: "og:title", content: "Mon programme — PREPA IRCA 45001" },
      { property: "og:description", content: "Progression et séances de préparation ISO 45001." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: plan } = useStudyPlan();
  const { data: progress = [] } = useProgress();

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.module_id));
  const schedule = plan ? buildSchedule(plan) : null;
  const dates = schedule ? scheduleByModuleId(schedule) : new Map<number, Date>();
  const pace = schedule ? computePace(schedule, completedIds.size) : null;
  const percent = Math.round((completedIds.size / modules.length) * 100);
  const next = modules.find((m) => !completedIds.has(m.id));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl font-semibold">Mon programme</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {schedule?.endDate
            ? `Fin estimée le ${formatShortDate(schedule.endDate)} · ${schedule.effectiveModulesPerDay} séance(s) par jour travaillé`
            : "Configurez votre planning pour dater vos séances."}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-3xl font-semibold">{percent}%</p>
              <Progress value={percent} className="mt-3" />
              <p className="mt-2 text-xs text-muted-foreground">
                {completedIds.size} / {modules.length} séances terminées
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Rythme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-xl font-semibold">{pace?.label ?? "—"}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Attendu à ce jour : {pace?.expectedCompleted ?? 0} séance(s)
              </p>
              {schedule?.compressed ? (
                <p className="mt-2 text-xs text-accent-foreground">
                  Rythme compressé pour tenir la date d'examen.
                </p>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Prochaine séance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {next ? (
                <>
                  <p className="font-serif text-base font-semibold leading-snug">{next.title}</p>
                  <Button asChild size="sm" className="mt-3">
                    <Link to="/seance/$moduleId" params={{ moduleId: String(next.id) }}>
                      Ouvrir la séance
                    </Link>
                  </Button>
                </>
              ) : (
                <p className="text-sm">Programme terminé. Place à l'examen blanc !</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 space-y-8">
          {program.weeks.map((week) => (
            <section key={week.id}>
              <h2 className="font-serif text-xl font-semibold">{week.title}</h2>
              <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
                {week.dayIds.map((id) => {
                  const module = modules.find((m) => m.id === id);
                  if (!module) return null;
                  const done = completedIds.has(id);
                  const date = dates.get(id);
                  return (
                    <li key={id}>
                      <Link
                        to="/seance/$moduleId"
                        params={{ moduleId: String(id) }}
                        className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-secondary/60"
                      >
                        {done ? (
                          <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden />
                        ) : (
                          <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                        )}
                        <span className="flex-1 text-sm font-medium">{module.title}</span>
                        <Badge variant="secondary">{typeLabels[module.type]}</Badge>
                        {date ? (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarClock className="size-3.5" aria-hidden />
                            {formatShortDate(date)}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
