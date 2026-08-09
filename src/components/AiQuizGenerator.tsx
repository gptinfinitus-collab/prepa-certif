import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateQuizQuestions } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GeneratedQuestion {
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

/** Générateur de QCM inédits à partir du cursus et des documents indexés. */
export function AiQuizGenerator({ certificationName }: { certificationName: string }) {
  const generate = useServerFn(generateQuizQuestions);
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [sourceCount, setSourceCount] = useState(0);

  const mutation = useMutation({
    mutationFn: async () =>
      generate({
        data: { certificationName, topic: topic.trim() || undefined, count: 5, difficulty: "examen" },
      }),
    onSuccess: (result) => {
      setQuestions(result.questions);
      setAnswers({});
      setSourceCount(result.sourceCount);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const answered = Object.keys(answers).length;
  const correct = questions.filter((q, i) => answers[i] === q.answerIndex).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <Wand2 className="size-5 text-cert" aria-hidden />
          Entraînement généré par l'IA
        </CardTitle>
        <CardDescription>
          Questions inédites créées à partir de {certificationName} et des documents de cours
          indexés dans votre bibliothèque.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Thème ciblé (ex. chapitre 6, planification, non-conformités)"
          />
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-4" aria-hidden />
            )}
            Générer 5 questions
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">
                {sourceCount > 0 ? `${sourceCount} extrait(s) de vos documents` : "Sans document indexé"}
              </Badge>
              {answered > 0 && (
                <span>
                  {correct} bonne(s) réponse(s) sur {answered}
                </span>
              )}
            </div>

            {questions.map((q, qi) => {
              const chosen = answers[qi];
              return (
                <div key={qi} className="rounded-lg border border-border p-4">
                  <p className="font-serif text-base leading-snug">
                    {qi + 1}. {q.question}
                  </p>
                  <div className="mt-3 space-y-2">
                    {q.choices.map((choice, ci) => {
                      const isChosen = chosen === ci;
                      const isAnswer = q.answerIndex === ci;
                      const revealed = chosen !== undefined;
                      return (
                        <button
                          key={ci}
                          type="button"
                          disabled={revealed}
                          onClick={() => setAnswers((prev) => ({ ...prev, [qi]: ci }))}
                          className={cn(
                            "w-full rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                            revealed && isAnswer && "border-cert bg-cert/10 font-medium",
                            revealed && isChosen && !isAnswer && "border-destructive bg-destructive/10",
                          )}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                  {chosen !== undefined && q.explanation && (
                    <p className="mt-3 rounded-md bg-secondary/60 p-3 text-sm leading-relaxed">
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
