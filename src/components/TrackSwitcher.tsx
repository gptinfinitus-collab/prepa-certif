import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TRACKS, type TrackId } from "@/lib/tracks";
import { useActiveTrack, useExamBody, useSetActiveTrack } from "@/lib/learning";
import { ExamBodyPicker } from "@/components/ExamBodyPicker";
import { EXAM_BODY_DISCLAIMER, getExamBody } from "@/lib/exam-bodies";
import { Lock } from "lucide-react";
import { useState } from "react";
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
  const { track } = useActiveTrack();
  const setTrack = useSetActiveTrack();
  const { examBody } = useExamBody();
  const [askExamBody, setAskExamBody] = useState(false);
  const active = TRACKS.find((t) => t.id === track) ?? TRACKS[0]!;

  function select(id: TrackId) {
    if (id === "lead_auditor" && !examBody) {
      setAskExamBody(true);
      return;
    }
    setTrack.mutate(id);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Niveau de parcours">
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
              {definition.short}
              {locked ? (
                <Badge variant="secondary" className="ml-1">
                  Organisme requis
                </Badge>
              ) : null}
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{active.description}</p>

      <Dialog open={askExamBody} onOpenChange={setAskExamBody}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Choisissez votre organisme d'examen</DialogTitle>
            <DialogDescription>
              Le format de l'examen Lead Auditor varie selon l'organisme. Ce choix ouvre le niveau
              et adapte vos entraînements.
            </DialogDescription>
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
  const { track } = useActiveTrack();
  const { examBody } = useExamBody();
  const definition = TRACKS.find((t) => t.id === "lead_auditor");
  if (track !== "lead_auditor") {
    if (!definition?.note) return null;
    return (
      <p className="mt-2 rounded-md border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
        {definition.note}
      </p>
    );
  }
  const body = getExamBody(examBody);
  return (
    <p className="mt-2 rounded-md border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
      {body ? `Profil d'examen : ${body.name}. ` : ""}
      {EXAM_BODY_DISCLAIMER}
    </p>
  );
}
