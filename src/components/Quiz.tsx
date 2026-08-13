import { useState } from "react";
import type { QuizItem } from "@/data/program";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useT } from "@/i18n";

export function Quiz({ items }: { items: QuizItem[] }) {
  const t = useT();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Card key={index} className="gap-3 p-4">
          <p className="text-sm font-medium">
            <span className="mr-2 text-accent-strong">Q{index + 1}.</span>
            {item.question}
          </p>
          {revealed[index] ? (
            <p className="rounded-md border-l-2 border-accent bg-secondary/60 p-3 text-sm text-foreground/90">
              {item.answer}
            </p>
          ) : (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevealed((prev) => ({ ...prev, [index]: true }))}
              >
                {t("quiz.showAnswer")}
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
