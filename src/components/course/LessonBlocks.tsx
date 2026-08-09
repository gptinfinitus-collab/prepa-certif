import { useState } from "react";
import { MarkdownView } from "@/components/MarkdownView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "@/lib/lesson-sections";
import type { Flashcard, LessonScenario } from "@/data/lesson-extras";
import { useFlashcardProgress, useSetFlashcardStatus } from "@/lib/learning";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  FileSearch,
  GraduationCap,
  Search,
  Target,
} from "lucide-react";

const LIST_META = {
  objective: { icon: Target, label: "Compétence visée", tone: "border-primary/40 bg-primary/5" },
  auditor: { icon: Search, label: "Regard de l'auditeur", tone: "border-primary/40 bg-primary/5" },
  evidence: { icon: FileSearch, label: "Preuve possible", tone: "border-accent/50 bg-accent/10" },
  exam: { icon: GraduationCap, label: "Point examen", tone: "border-accent/50 bg-accent/10" },
  mistake: { icon: AlertTriangle, label: "Erreur fréquente", tone: "border-destructive/40 bg-destructive/5" },
  key: { icon: CheckCircle2, label: "À retenir", tone: "border-accent/50 bg-accent/10" },
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
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-primary/40">
      <CardHeader>
        <CardTitle className="text-base">Cas pratique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p>{scenario.prompt}</p>
        {open ? (
          <div className="rounded-md border-l-2 border-accent bg-secondary/60 p-3">
            <p className="mb-1 font-medium">Correction</p>
            <p>{scenario.correction}</p>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Réfléchissez, puis affichez la correction
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function FlashcardDeck({ moduleId, cards }: { moduleId: number; cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { data: statuses = {} } = useFlashcardProgress(moduleId);
  const setStatus = useSetFlashcardStatus(moduleId);
  const card = cards[index];
  if (!card) return null;
  const cardKey = `${index}`;
  const mastered = Object.values(statuses).filter((s) => s === "mastered").length;

  const go = (next: number) => {
    setIndex((next + cards.length) % cards.length);
    setFlipped(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Carte {index + 1} / {cards.length}
        </span>
        <span>{mastered} acquise(s)</span>
      </div>
      <Card className="min-h-40 justify-center p-6 text-center">
        <p className="text-sm font-medium leading-relaxed">{card.front}</p>
        {flipped ? (
          <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
            {card.back}
          </p>
        ) : null}
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setFlipped((v) => !v)}>
          {flipped ? "Masquer" : "Retourner"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setStatus.mutate({ cardKey, status: "again" });
            go(index + 1);
          }}
        >
          À revoir
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setStatus.mutate({ cardKey, status: "mastered" });
            go(index + 1);
          }}
        >
          Acquise
        </Button>
      </div>
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
