import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TRACKS, type TrackId } from "@/lib/tracks";
import { useActiveTrack, useExamBody, useSetActiveTrack } from "@/lib/learning";
import { ExamBodyPicker } from "@/components/ExamBodyPicker";
import { EXAM_BODY_DISCLAIMER, getExamBody } from "@/lib/exam-bodies";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Sélecteur de niveau de parcours : Maîtrise → Auditeur interne → Lead Auditor.
 * Le niveau Lead Auditor s'ouvre une fois l'organisme d'examen choisi.
 */
export function TrackSwitcher({ className }: { className?: string }) {
  const t = useT();
  const { track } = useActiveTrack();
  const setTrack = useSetActiveTrack();
  const { examBody } = useExamBody();
  const [askExamBody, setAskExamBody] = useState(false);
  const active = TRACKS.find((tr) => tr.id === track) ?? TRACKS[0]!;

  function select(id: TrackId) {
    if (id === "lead_auditor" && !examBody) {
      setAskExamBody(true);
      return;
    }
    setTrack.mutate(id);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("quiz.trackSwitcher.ariaLabel")}>
        {TRACKS.map((definition) => {
          const isActive = definition.id === track;
          const locked = definition.id === "lead_auditor" && !examBody;
          return (
            <Button
              key={definition.id}
              role="tab"
              aria-selected={isActive}
              size="sm"
              variant={isActive ? "default" : "outline"}
              disabled={setTrack.isPending}
              onClick={() => select(definition.id)}
            >
              {locked ? <Lock className="size-3.5" aria-hidden /> : null}
              {t(`quiz.tracks.${definition.id}.short`)}
              {locked ? (
                <Badge variant="secondary" className="ml-1">
                  {t("quiz.trackSwitcher.examBodyRequired")}
                </Badge>
              ) : null}
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{t(`quiz.tracks.${active.id}.description`)}</p>

      <Dialog open={askExamBody} onOpenChange={setAskExamBody}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("quiz.trackSwitcher.dialogTitle")}</DialogTitle>
            <DialogDescription>{t("quiz.trackSwitcher.dialogDesc")}</DialogDescription>
          </DialogHeader>
          <ExamBodyPicker
            onSelected={() => {
              setAskExamBody(false);
              setTrack.mutate("lead_auditor");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function LeadAuditorNotice() {
  const t = useT();
  const { track } = useActiveTrack();
  const { examBody } = useExamBody();
  const definition = TRACKS.find((tr) => tr.id === "lead_auditor");
  if (track !== "lead_auditor") {
    if (!definition?.note) return null;
    return (
      <p className="mt-2 rounded-md border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
        {t("quiz.tracks.lead_auditor.note")}
      </p>
    );
  }
  const body = getExamBody(examBody);
  return (
    <p className="mt-2 rounded-md border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
      {body ? t("quiz.trackSwitcher.examProfile", { name: t(`quiz.examBodies.${body.id}.name`) }) : ""}
      {t("quiz.examBodyDisclaimer")}
    </p>
  );
}
