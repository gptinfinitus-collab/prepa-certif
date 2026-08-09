import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EXAM_BODIES, EXAM_BODY_DISCLAIMER, type ExamBodyId } from "@/lib/exam-bodies";
import { useExamBody, useSetExamBody } from "@/lib/learning";
import { Check } from "lucide-react";

/** Choix de l'organisme d'examen visé (PECB, CQI/IRCA, autre). */
export function ExamBodyPicker({
  onSelected,
  className,
}: {
  onSelected?: (id: ExamBodyId) => void;
  className?: string;
}) {
  const { examBody } = useExamBody();
  const setExamBody = useSetExamBody();

  function choose(id: ExamBodyId) {
    setExamBody.mutate(id, {
      onSuccess: () => {
        toast.success("Profil d'examen enregistré.");
        onSelected?.(id);
      },
      onError: () => toast.error("Enregistrement impossible."),
    });
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid gap-2">
        {EXAM_BODIES.map((body) => {
          const isActive = body.id === examBody;
          return (
            <button
              key={body.id}
              type="button"
              disabled={setExamBody.isPending}
              onClick={() => choose(body.id)}
              aria-pressed={isActive}
              className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                isActive
                  ? "border-primary bg-secondary/60"
                  : "border-border hover:bg-secondary/40",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{body.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{body.description}</span>
              </span>
              {isActive ? <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{EXAM_BODY_DISCLAIMER}</p>
      {examBody ? (
        <Button
          variant="ghost"
          size="sm"
          disabled={setExamBody.isPending}
          onClick={() => setExamBody.mutate(null)}
        >
          Réinitialiser mon profil d'examen
        </Button>
      ) : null}
    </div>
  );
}
