import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn, translateAppError } from "@/lib/utils";
import { certificationAccentStyle } from "@/lib/cert-theme";
import {
  useActiveCertification,
  useCertificationCatalog,
  useFollowCertification,
} from "@/lib/certifications";
import { useActiveTrack, useExamBody, useSetActiveTrack, useSetExamBody, useSetOnboarded } from "@/lib/learning";
import { useCurriculum } from "@/lib/curriculum";
import { useSaveStudyPlan } from "@/lib/queries";
import { TRACKS, filterModulesByTrack, type TrackId } from "@/lib/tracks";
import { EXAM_BODIES, type ExamBodyId } from "@/lib/exam-bodies";
import {
  MAX_MODULES_PER_DAY,
  ONBOARDING_STEPS,
  STUDY_DAY_LABELS,
  paceSummary,
  suggestPlan,
  toggleStudyDay,
} from "@/lib/onboarding";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useT } from "@/i18n";

interface OnboardingProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Écran de bienvenue en trois temps : certification, niveau de parcours puis
 * planning. Les réponses pré-remplissent le planning de révision.
 */
export function Onboarding({ open, onClose }: OnboardingProps) {
  const t = useT();
  const [stepIndex, setStepIndex] = useState(0);
  const step = ONBOARDING_STEPS[stepIndex]!;

  const { data: catalog = [] } = useCertificationCatalog();
  const { certification } = useActiveCertification();
  const follow = useFollowCertification();
  const { track } = useActiveTrack();
  const setTrack = useSetActiveTrack();
  const { examBody } = useExamBody();
  const setExamBody = useSetExamBody();
  const setOnboarded = useSetOnboarded();
  const savePlan = useSaveStudyPlan();
  const { curriculum } = useCurriculum();

  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackId | null>(null);
  const [selectedBody, setSelectedBody] = useState<ExamBodyId | null>(null);
  const [examDate, setExamDate] = useState("");
  const [studyDays, setStudyDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const certId = selectedCert ?? certification?.id ?? null;
  const currentTrack = selectedTrack ?? track;
  const currentBody = selectedBody ?? examBody;

  const moduleCount = useMemo(
    () => filterModulesByTrack(curriculum.modules, currentTrack).length,
    [curriculum, currentTrack],
  );
  const plan = useMemo(
    () => suggestPlan({ examDate: examDate || null, studyDays, moduleCount }),
    [examDate, studyDays, moduleCount],
  );

  const busy =
    follow.isPending || setTrack.isPending || setExamBody.isPending || savePlan.isPending || setOnboarded.isPending;

  async function skip() {
    try {
      await setOnboarded.mutateAsync(true);
    } finally {
      onClose();
    }
  }

  async function next() {
    try {
      if (step.id === "certification") {
        if (!certId) {
          toast.error(t("common.onboarding.chooseCertToContinue"));
          return;
        }
        if (certId !== certification?.id) await follow.mutateAsync(certId);
        setStepIndex(1);
        return;
      }
      if (step.id === "track") {
        if (currentTrack === "lead_auditor" && !currentBody) {
          toast.error(t("common.onboarding.chooseExamBody"));
          return;
        }
        if (selectedBody) await setExamBody.mutateAsync(selectedBody);
        if (currentTrack !== track) await setTrack.mutateAsync(currentTrack);
        setStepIndex(2);
        return;
      }
      await savePlan.mutateAsync(plan);
      await setOnboarded.mutateAsync(true);
      toast.success(t("common.onboarding.planningReady"));
      onClose();
    } catch (error) {
      toast.error(translateAppError(t, error, "common.onboarding.actionImpossible"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && void skip()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            {t("common.onboarding.stepOf", { current: stepIndex + 1, total: ONBOARDING_STEPS.length })}
          </div>
          <DialogTitle className="font-sans text-xl">{t(step.titleKey)}</DialogTitle>
          <DialogDescription>{t(step.descriptionKey)}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5" aria-hidden>
          {ONBOARDING_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1 flex-1 rounded-full",
                i <= stepIndex ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        {step.id === "certification" && (
          <div className="grid gap-2 sm:grid-cols-2">
            {catalog.map((cert) => {
              const active = certId === cert.id;
              return (
                <button
                  key={cert.id}
                  type="button"
                  style={certificationAccentStyle(cert.code)}
                  onClick={() => setSelectedCert(cert.id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-lg border p-3 text-left transition",
                    active ? "border-cert ring-1 ring-cert/40" : "border-border hover:bg-accent",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{cert.name}</span>
                    {active && <Check className="mt-0.5 size-4 shrink-0 text-cert" aria-hidden />}
                  </div>
                  <span className="text-xs text-muted-foreground">{cert.family}</span>
                </button>
              );
            })}
          </div>
        )}

        {step.id === "track" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              {TRACKS.map((definition) => {
                const active = currentTrack === definition.id;
                return (
                  <button
                    key={definition.id}
                    type="button"
                    onClick={() => setSelectedTrack(definition.id)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-lg border p-3 text-left transition",
                      active ? "border-primary ring-1 ring-primary/30" : "border-border hover:bg-accent",
                    )}
                  >
                    <span className="font-medium">{t(`quiz.tracks.${definition.id}.name`)}</span>
                    <p className="text-xs text-muted-foreground">{t(`quiz.tracks.${definition.id}.description`)}</p>
                  </button>
                );
              })}
            </div>

            {currentTrack === "lead_auditor" && (
              <div className="space-y-2 rounded-lg border border-border p-3">
                <p className="text-sm font-medium">{t("common.onboarding.examBody")}</p>
                <div className="flex flex-wrap gap-2">
                  {EXAM_BODIES.map((body) => (
                    <Button
                      key={body.id}
                      type="button"
                      size="sm"
                      variant={currentBody === body.id ? "default" : "outline"}
                      onClick={() => setSelectedBody(body.id)}
                    >
                      {body.short}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step.id === "planning" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="onboarding-exam-date">{t("common.onboarding.examDateOptional")}</Label>
              <Input
                id="onboarding-exam-date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("common.onboarding.reviewDays")}</Label>
              <div className="flex flex-wrap gap-2">
                {STUDY_DAY_LABELS.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    size="sm"
                    variant={studyDays.includes(day.value) ? "default" : "outline"}
                    aria-pressed={studyDays.includes(day.value)}
                    onClick={() => setStudyDays((d) => toggleStudyDay(d, day.value))}
                  >
                    {t(day.labelKey)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {t("common.onboarding.sessionsPerDay", { plural: plan.modules_per_day > 1 ? "s" : "" })}
                </Badge>
                {plan.modules_per_day === MAX_MODULES_PER_DAY && (
                  <span className="text-xs text-muted-foreground">{t("common.onboarding.maxPace")}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{paceSummary(plan, moduleCount)}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button variant="ghost" onClick={() => void skip()} disabled={busy}>
            {t("common.onboarding.skip")}
          </Button>
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <Button variant="outline" onClick={() => setStepIndex((i) => i - 1)} disabled={busy}>
                <ChevronLeft className="size-4" aria-hidden />
                {t("common.onboarding.back")}
              </Button>
            )}
            <Button onClick={() => void next()} disabled={busy}>
              {step.id === "planning" ? t("common.onboarding.finish") : t("common.onboarding.continueLabel")}
              {step.id !== "planning" && <ChevronRight className="size-4" aria-hidden />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Monté sur le tableau de bord : ouvre l'écran de bienvenue si nécessaire. */
export function OnboardingGate({ show }: { show: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  return <Onboarding open={show && !dismissed} onClose={() => setDismissed(true)} />;
}
