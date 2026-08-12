import { useState } from "react";
import { MarkdownView } from "@/components/MarkdownView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "@/lib/lesson-sections";
import type { Flashcard, LessonScenario } from "@/data/lesson-extras";
import {
  useFlashcardProgress,
  useSetFlashcardStatus,
  useEvaluateFlashcardAnswer,
} from "@/lib/learning";
import type { EvaluationStatus } from "@/lib/flashcards.functions";
import { useT } from "@/i18n";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  FileSearch,
  GraduationCap,
  Loader2,
  Search,
  Target,
} from "lucide-react";

const LIST_META = {
  objective: { icon: Target, labelKey: "course.blocks.objectiveLabel", tone: "border-primary/40 bg-primary/5" },
  auditor: { icon: Search, labelKey: "course.blocks.auditorLabel", tone: "border-primary/40 bg-primary/5" },
  evidence: { icon: FileSearch, labelKey: "course.blocks.evidenceLabel", tone: "border-accent/50 bg-accent/10" },
  exam: { icon: GraduationCap, labelKey: "course.blocks.examLabel", tone: "border-accent/50 bg-accent/10" },
  mistake: { icon: AlertTriangle, labelKey: "course.blocks.mistakeLabel", tone: "border-destructive/40 bg-destructive/5" },
  key: { icon: CheckCircle2, labelKey: "course.blocks.keyLabel", tone: "border-accent/50 bg-accent/10" },
} as const;

function BlockList({
  variant,
  items,
}: {
  variant: keyof typeof LIST_META;
  items: string[];
}) {
  const meta = LIST_META[variant];
  const Icon = meta.icon;
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className={cn("flex gap-3 rounded-md border p-3 text-sm leading-relaxed", meta.tone)}
        >
          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ExampleCards({ items }: { items: { sector: string; text: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <Card key={index} className="gap-2 p-4">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-muted-foreground" aria-hidden />
            <Badge variant="secondary">{item.sector}</Badge>
          </div>
          <p className="text-sm leading-relaxed">{item.text}</p>
        </Card>
      ))}
    </div>
  );
}

function ScenarioBlock({ scenario }: { scenario: LessonScenario }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-primary/40">
      <CardHeader>
        <CardTitle className="text-base">{t("course.blocks.scenarioTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p>{scenario.prompt}</p>
        {open ? (
          <div className="rounded-md border-l-2 border-accent bg-secondary/60 p-3">
            <p className="mb-1 font-medium">{t("course.blocks.correction")}</p>
            <p>{scenario.correction}</p>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            {t("course.blocks.revealCorrection")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function FlashcardDeck({ moduleId, cards }: { moduleId: number; cards: Flashcard[] }) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluated, setEvaluated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: progress = {} } = useFlashcardProgress(moduleId);
  const setStatus = useSetFlashcardStatus(moduleId);
  const evaluate = useEvaluateFlashcardAnswer(moduleId);

  const card = cards[index];
  if (!card) return null;
  const cardKey = `${index}`;
  const item = progress[cardKey];
  const mastered = Object.values(progress).filter((p) => p.status === "mastered").length;

  const go = (next: number) => {
    setIndex((next + cards.length) % cards.length);
    setUserAnswer("");
    setEvaluated(false);
    setError(null);
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return;
    setError(null);
    try {
      await evaluate.mutateAsync({
        cardKey,
        question: card.front,
        expectedAnswer: card.back,
        userAnswer: userAnswer.trim(),
      });
      setEvaluated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("course.blocks.evaluationError"));
    }
  };

  const handleManualFlip = () => {
    setEvaluated(true);
    setError(null);
  };

  const statusColor: Record<EvaluationStatus, string> = {
    correct: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    partial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    incorrect: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };

  const statusLabel: Record<EvaluationStatus, string> = {
    correct: t("course.blocks.statusCorrect"),
    partial: t("course.blocks.statusPartial"),
    incorrect: t("course.blocks.statusIncorrect"),
  };

  const showBack = evaluated || item?.evaluationStatus;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("course.blocks.cardCounter", { current: index + 1, total: cards.length })}</span>
        <span>{t("course.blocks.masteredCount", { count: mastered })}</span>
      </div>

      <Card className="min-h-40 justify-center p-5 text-center">
        <p className="text-sm font-medium leading-relaxed">{card.front}</p>
        {showBack ? (
          <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
            {card.back}
          </p>
        ) : null}
      </Card>

      {!showBack ? (
        <div className="space-y-2">
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={t("course.blocks.answerPlaceholder")}
            className="min-h-20 resize-none text-sm"
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={!userAnswer.trim() || evaluate.isPending}
              onClick={handleEvaluate}
            >
              {evaluate.isPending ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  {t("course.blocks.verifying")}
                </>
              ) : (
                t("course.blocks.verifyAnswer")
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleManualFlip}>
              {t("course.blocks.seeAnswer")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {item?.evaluationStatus ? (
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                statusColor[item.evaluationStatus],
              )}
            >
              <p className="font-medium">{statusLabel[item.evaluationStatus]}</p>
              {item.evaluationFeedback ? (
                <p className="mt-1 text-xs opacity-90">{item.evaluationFeedback}</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setStatus.mutate({ cardKey, status: "again" });
                go(index + 1);
              }}
            >
              {t("course.blocks.toReview")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setStatus.mutate({ cardKey, status: "mastered" });
                go(index + 1);
              }}
            >
              {t("course.blocks.mastered")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function LessonBlocks({ blocks, moduleId }: { blocks: ContentBlock[]; moduleId: number }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "markdown":
            return <MarkdownView key={index}>{block.content}</MarkdownView>;
          case "list":
            return <BlockList key={index} variant={block.variant} items={block.items} />;
          case "examples":
            return <ExampleCards key={index} items={block.items} />;
          case "scenario":
            return <ScenarioBlock key={index} scenario={block.scenario} />;
          case "flashcards":
            return <FlashcardDeck key={index} moduleId={moduleId} cards={block.cards} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
