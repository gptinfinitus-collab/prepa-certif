import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useProfile } from "@/lib/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsOf } from "@/components/ProfileEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { typeLabels } from "@/data/program";
import { buildSchedule, scheduleByModuleId, computePace, formatShortDate } from "@/lib/schedule";
import { useProgress, useStudyPlan } from "@/lib/queries";
import { useCurriculum } from "@/lib/curriculum";
import { CheckCircle2, Circle, CalendarClock, PenLine } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Mon programme — PREPA ISO" },
      {
        name: "description",
        content:
          "Suivez vos séances de préparation à la certification ISO que vous avez choisie, votre avancement et votre rythme par rapport au planning.",
      },
      { property: "og:title", content: "Mon programme — PREPA ISO" },
      {
        property: "og:description",
        content: "Progression et séances de votre cursus de préparation ISO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: plan } = useStudyPlan();
  const { data: progress = [] } = useProgress();
  const { data: profile } = useProfile();
  const { curriculum, certificationName } = useCurriculum();
  const modules = curriculum.modules;

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.module_id));
  const schedule = plan ? buildSchedule(plan, modules) : null;
  const dates = schedule ? scheduleByModuleId(schedule) : new Map<number, Date>();
  const pace = schedule ? computePace(schedule, completedIds.size) : null;
  const percent = modules.length
    ? Math.round((completedIds.size / modules.length) * 100)
    : 0;
  const next = modules.find((m) => !completedIds.has(m.id));
  const firstName = profile?.first_name?.trim() || profile?.display_name?.split(" ")[0] || "";

  return (
    <AppShell title="Mon programme">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Accueil mobile */}
        <section className="mb-6 rounded-2xl border border-border bg-gradient-to-br from-primary/12 via-card to-card p-5 md:hidden">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 shrink-0 border border-border">
              <AvatarImage src={profile?.avatarSignedUrl ?? undefined} alt="" />
              <AvatarFallback>
                {initialsOf(profile?.first_name, profile?.last_name, profile?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Bonjour</p>
              <p className="truncate font-serif text-lg font-semibold">
                {firstName || "Bienvenue"}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-end justify-between">
              <p className="font-serif text-4xl font-semibold leading-none">{percent}%</p>
              <p className="text-xs text-muted-foreground">
                {completedIds.size} / {modules.length} séances
              </p>
            </div>
            <Progress value={percent} className="mt-3" />
          </div>
          {next ? (
            <div className="mt-5 rounded-xl border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Prochaine séance
              </p>
              <p className="mt-1 font-serif text-base font-semibold leading-snug">{next.title}</p>
              <Button asChild size="sm" className="mt-3 w-full">
                <Link to="/seance/$moduleId" params={{ moduleId: String(next.id) }}>
                  Continuer
                </Link>
              </Button>
            </div>
          ) : null}
          <p className="mt-4 text-xs text-muted-foreground">
            {schedule?.endDate
              ? `Fin estimée le ${formatShortDate(schedule.endDate)} · ${pace?.label ?? ""}`
              : "Configurez votre planning pour dater vos séances."}
          </p>
        </section>

        <h1 className="hidden items-center gap-3 font-serif text-3xl font-semibold md:flex">
          <span className="h-7 w-1.5 shrink-0 rounded-full bg-cert" aria-hidden />
          {certificationName}
        </h1>

        <p className="mt-2 hidden text-sm text-muted-foreground md:block">
          {schedule?.endDate
            ? `Fin estimée le ${formatShortDate(schedule.endDate)} · ${schedule.effectiveModulesPerDay} séance(s) par jour travaillé`
            : "Configurez votre planning pour dater vos séances."}
        </p>

        {!curriculum.complete ? (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <PenLine className="size-4 shrink-0 text-primary" aria-hidden />
            <p className="flex-1 text-sm text-muted-foreground">
              Cursus rédigé en cours de préparation : vous travaillez ici à partir des chapitres
              officiels du référentiel, de la méthodologie d'audit et de vos propres documents.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/bibliotheque">Ajouter mes documents</Link>
            </Button>
          </div>
        ) : null}

        <div className="mt-6 hidden gap-4 sm:grid-cols-3 md:grid">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-2xl font-semibold sm:text-3xl">{percent}%</p>
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
          {curriculum.weeks.map((week) => (
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
      </div>
    </AppShell>
  );
}
