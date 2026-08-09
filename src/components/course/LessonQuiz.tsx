import { useState } from "react";
import type { QuizItem } from "@/data/program";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface LessonQuizResult {
  correct: number;
  total: number;
}

/**
 * Quiz de fin de séance : chaque question est révélée puis auto-évaluée.
 * L'auto-évaluation alimente la maîtrise par thème.
 */
export function LessonQuiz({
  items,
  onSubmit,
  submitted,
}: {
  items: QuizItem[];
  onSubmit: (result: LessonQuizResult) => void;
  submitted: boolean;
}) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [marks, setMarks] = useState<Record<number, boolean>>({});

  if (items.length === 0) return null;

  const answered = Object.keys(marks).length;
  const correct = Object.values(marks).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Répondez mentalement ou par écrit, affichez la réponse attendue, puis indiquez si votre
        réponse était juste. Vos réponses alimentent l'analyse de vos points faibles.
      </p>

      {items.map((item, index) => (
        <Card key={index} className="gap-3 p-4">
          <p className="text-sm font-medium">
            <span className="mr-2 text-muted-foreground">Q{index + 1}.</span>
            {item.question}
          </p>

          {revealed[index] ? (
            <>
              <p className="rounded-md border-l-2 border-accent bg-secondary/60 p-3 text-sm leading-relaxed">
                {item.answer}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={marks[index] === true ? "default" : "outline"}
                  onClick={() => setMarks((prev) => ({ ...prev, [index]: true }))}
                >
                  J'avais juste
                </Button>
                <Button
                  size="sm"
                  variant={marks[index] === false ? "secondary" : "outline"}
                  onClick={() => setMarks((prev) => ({ ...prev, [index]: false }))}
                >
                  À revoir
                </Button>
              </div>
            </>
          ) : (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevealed((prev) => ({ ...prev, [index]: true }))}
              >
                Afficher la réponse attendue
              </Button>
            </div>
          )}
        </Card>
      ))}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button
          disabled={answered === 0}
          onClick={() => onSubmit({ correct, total: answered })}
        >
          {submitted ? "Mettre à jour mon résultat" : "Valider le quiz"}
        </Button>
        <span className={cn("text-xs", answered === 0 ? "text-muted-foreground" : "text-foreground")}>
          {answered} / {items.length} question(s) auto-évaluée(s)
          {answered > 0 ? ` — ${Math.round((correct / answered) * 100)} % de réussite` : ""}
        </span>
      </div>
    </div>
  );
}
