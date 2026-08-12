import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import { useCurriculum } from "@/lib/curriculum";
import {
  buildSchedule,
  dayNames,
  defaultPlan,
  formatFrenchDate,
  formatShortDate,
  type StudyPlan,
} from "@/lib/schedule";
import { useSaveStudyPlan, useStudyPlan } from "@/lib/queries";
import { useT } from "@/i18n";

export const Route = createFileRoute("/_authenticated/planning")({
  head: () => ({
    meta: [
      { title: "Mon planning — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Définissez la durée de votre préparation ISO : date de début, date d'examen, jours travaillés et séances par jour.",
      },
      { property: "og:title", content: "Mon planning — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Un calendrier de préparation à la certification entièrement configurable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),

  component: Planning,
});

const dayLabelKeys: Record<number, string> = {
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
  0: "sun",
};

function Planning() {
  const t = useT();
  const { data: saved } = useStudyPlan();
  const save = useSaveStudyPlan();
  const { curriculum, certificationName } = useCurriculum();
  const [plan, setPlan] = useState<StudyPlan>(defaultPlan);

  useEffect(() => {
    if (saved) setPlan(saved);
  }, [saved]);

  const schedule = buildSchedule(plan, curriculum.modules);

  function toggleDay(value: number) {
    setPlan((prev) => ({
      ...prev,
      study_days: prev.study_days.includes(value)
        ? prev.study_days.filter((d) => d !== value)
        : [...prev.study_days, value].sort(),
    }));
  }

  return (
    <AppShell title={t("common.myPlanning")}>
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.myPlanning")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t("common.planningIntro", {
            count: curriculum.modules.length,
            certificationName,
          })}
        </p>


        <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.parameters")}</CardTitle>
              <CardDescription>{t("common.adjustPaceDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="start">{t("common.startDate")}</Label>
                <Input
                  id="start"
                  type="date"
                  value={plan.start_date}
                  onChange={(e) => setPlan({ ...plan, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exam">{t("common.examDateOptional")}</Label>
                <Input
                  id="exam"
                  type="date"
                  value={plan.exam_date ?? ""}
                  onChange={(e) => setPlan({ ...plan, exam_date: e.target.value || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("common.workDays")}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {dayNames.map((d) => {
                    const label = t(`common.daysShort.${dayLabelKeys[d.value]}`);
                    return (
                      <Toggle
                        key={d.value}
                        pressed={plan.study_days.includes(d.value)}
                        onPressedChange={() => toggleDay(d.value)}
                        variant="outline"
                        size="sm"
                        aria-label={label}
                      >
                        {label}
                      </Toggle>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="perday">{t("common.sessionsPerWorkedDayLabel")}</Label>
                <Input
                  id="perday"
                  type="number"
                  min={1}
                  max={6}
                  value={plan.modules_per_day}
                  onChange={(e) =>
                    setPlan({ ...plan, modules_per_day: Math.max(1, Number(e.target.value) || 1) })
                  }
                />
              </div>
              <Button
                className="w-full"
                disabled={save.isPending || plan.study_days.length === 0}
                onClick={() =>
                  save.mutate(plan, {
                    onSuccess: () => toast.success(t("common.planningSaved")),
                    onError: () => toast.error(t("common.saveImpossible")),
                  })
                }
              >
                {t("common.saveMyPlanning")}
              </Button>
              {plan.study_days.length === 0 ? (
                <p className="text-xs text-destructive">{t("common.selectAtLeastOneDay")}</p>
              ) : null}
            </CardContent>
          </Card>

          <div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: t("common.workDaysSummary", {
                    days: schedule.days.length,
                    perDay: schedule.effectiveModulesPerDay,
                    end: schedule.endDate ? formatFrenchDate(schedule.endDate) : "—",
                  }),
                }}
              />
              {schedule.compressed ? (
                <p className="mt-2 text-sm text-accent-foreground">
                  {t("common.compressedPaceAutoNotice")}
                </p>
              ) : null}
            </div>

            <ol className="mt-4 space-y-2">
              {schedule.days.map((day) => (
                <li
                  key={day.date.toISOString()}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-md border border-border bg-card px-4 py-3"
                >
                  <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {formatShortDate(day.date)}
                  </span>
                  <span className="flex-1 text-sm">
                    {day.modules.map((m) => m.title).join(" · ")}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
