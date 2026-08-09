import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TRACKS, type TrackId } from "@/lib/tracks";
import { useActiveTrack, useSetActiveTrack } from "@/lib/learning";
import { Lock } from "lucide-react";

/**
 * Sélecteur de niveau de parcours : Maîtrise → Auditeur interne → Lead Auditor.
 * Le niveau Lead Auditor reste verrouillé tant qu'aucun profil d'examen
 * documenté (PECB, CQI/IRCA, autre) n'est implémenté.
 */
export function TrackSwitcher({ className }: { className?: string }) {
  const { track } = useActiveTrack();
  const setTrack = useSetActiveTrack();
  const active = TRACKS.find((t) => t.id === track) ?? TRACKS[0]!;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Niveau de parcours">
        {TRACKS.map((definition) => {
          const isActive = definition.id === track;
          const locked = definition.status === "coming_soon";
          return (
            <Button
              key={definition.id}
              role="tab"
              aria-selected={isActive}
              size="sm"
              variant={isActive ? "default" : "outline"}
              disabled={locked || setTrack.isPending}
              onClick={() => setTrack.mutate(definition.id as TrackId)}
            >
              {locked ? <Lock className="size-3.5" aria-hidden /> : null}
              {definition.short}
              {locked ? (
                <Badge variant="secondary" className="ml-1">
                  Bientôt
                </Badge>
              ) : null}
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{active.description}</p>
    </div>
  );
}

export function LeadAuditorNotice() {
  const definition = TRACKS.find((t) => t.id === "lead_auditor");
  if (!definition?.note) return null;
  return (
    <p className="rounded-md border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
      {definition.note}
    </p>
  );
}
