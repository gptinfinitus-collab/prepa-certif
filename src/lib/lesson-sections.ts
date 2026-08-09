import type { ProgramModule, QuizItem } from "@/data/program";
import { getLessonExtras, type Flashcard, type LessonScenario } from "@/data/lesson-extras";

export type SectionKind =
  | "intro"
  | "objectives"
  | "course"
  | "examples"
  | "auditor"
  | "evidence"
  | "exam"
  | "mistakes"
  | "scenario"
  | "takeaways"
  | "flashcards"
  | "quiz";

export type ContentBlock =
  | { type: "markdown"; content: string }
  | { type: "list"; variant: "objective" | "auditor" | "evidence" | "exam" | "mistake" | "key"; items: string[] }
  | { type: "examples"; items: { sector: string; text: string }[] }
  | { type: "scenario"; scenario: LessonScenario }
  | { type: "flashcards"; cards: Flashcard[] }
  | { type: "quiz"; items: QuizItem[] };

export interface LessonSection {
  id: string;
  kind: SectionKind;
  title: string;
  /** Étape obligatoire pour considérer la séance terminée. */
  required: boolean;
  blocks: ContentBlock[];
}

const KIND_TITLES: Record<SectionKind, string> = {
  intro: "Pourquoi cette notion est importante",
  objectives: "Objectifs d'apprentissage",
  course: "Cours",
  examples: "Exemples concrets",
  auditor: "Le regard de l'auditeur",
  evidence: "Quelles preuves rechercher ?",
  exam: "Point examen",
  mistakes: "Erreurs fréquentes",
  scenario: "Mise en situation",
  takeaways: "À retenir",
  flashcards: "Flashcards",
  quiz: "Quiz de fin de séance",
};

export function sectionTitle(kind: SectionKind): string {
  return KIND_TITLES[kind];
}

/** Découpe un markdown en parties, une par titre de niveau 3. */
export function splitMarkdownSections(markdown: string): { heading: string | null; body: string }[] {
  const lines = markdown.split("\n");
  const parts: { heading: string | null; body: string[] }[] = [];
  let current: { heading: string | null; body: string[] } = { heading: null, body: [] };

  for (const line of lines) {
    const match = /^###\s+(.*)$/.exec(line.trim());
    if (match) {
      if (current.heading !== null || current.body.join("").trim().length > 0) parts.push(current);
      current = { heading: (match[1] ?? "").trim(), body: [] };
    } else {
      current.body.push(line);
    }
  }
  if (current.heading !== null || current.body.join("").trim().length > 0) parts.push(current);

  return parts
    .map((p) => ({ heading: p.heading, body: p.body.join("\n").trim() }))
    .filter((p) => p.heading !== null || p.body.length > 0);
}

/** Estimation de lecture : ~200 mots par minute, minimum 1 minute. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Construit le parcours séquencé d'une séance : une étape par bloc pédagogique,
 * dans l'ordre imposé par la trame de cours.
 */
export function buildLessonSections(module: ProgramModule): LessonSection[] {
  const extras = getLessonExtras(module.id);
  const sections: LessonSection[] = [];
  const parts = splitMarkdownSections(module.contentMarkdown);
  const intro = parts.find((p) => p.body.length > 0);

  sections.push({
    id: "intro",
    kind: "intro",
    title: KIND_TITLES.intro,
    required: true,
    blocks: [
      { type: "markdown", content: `**Objectif de la séance :** ${module.objective}` },
      ...(intro
        ? [{ type: "markdown" as const, content: intro.body.split("\n\n").slice(0, 1).join("\n\n") }]
        : []),
    ],
  });

  if (extras.objectives?.length) {
    sections.push({
      id: "objectives",
      kind: "objectives",
      title: KIND_TITLES.objectives,
      required: true,
      blocks: [{ type: "list", variant: "objective", items: extras.objectives }],
    });
  }

  parts.forEach((part, index) => {
    if (!part.body && !part.heading) return;
    sections.push({
      id: `course-${index}`,
      kind: "course",
      title: part.heading ?? KIND_TITLES.course,
      required: true,
      blocks: [{ type: "markdown", content: part.body }],
    });
  });

  if (extras.examples?.length) {
    sections.push({
      id: "examples",
      kind: "examples",
      title: KIND_TITLES.examples,
      required: true,
      blocks: [{ type: "examples", items: extras.examples }],
    });
  }

  if (extras.auditorView?.length) {
    sections.push({
      id: "auditor",
      kind: "auditor",
      title: KIND_TITLES.auditor,
      required: true,
      blocks: [{ type: "list", variant: "auditor", items: extras.auditorView }],
    });
  }

  if (extras.evidence?.length) {
    sections.push({
      id: "evidence",
      kind: "evidence",
      title: KIND_TITLES.evidence,
      required: true,
      blocks: [{ type: "list", variant: "evidence", items: extras.evidence }],
    });
  }

  if (extras.examFocus?.length) {
    sections.push({
      id: "exam",
      kind: "exam",
      title: KIND_TITLES.exam,
      required: true,
      blocks: [{ type: "list", variant: "exam", items: extras.examFocus }],
    });
  }

  if (extras.commonMistakes?.length) {
    sections.push({
      id: "mistakes",
      kind: "mistakes",
      title: KIND_TITLES.mistakes,
      required: true,
      blocks: [{ type: "list", variant: "mistake", items: extras.commonMistakes }],
    });
  }

  if (extras.scenario) {
    sections.push({
      id: "scenario",
      kind: "scenario",
      title: KIND_TITLES.scenario,
      required: true,
      blocks: [{ type: "scenario", scenario: extras.scenario }],
    });
  }

  const keyPoints = extras.keyPoints ?? (module.keyTakeaway ? [module.keyTakeaway] : []);
  if (keyPoints.length) {
    sections.push({
      id: "takeaways",
      kind: "takeaways",
      title: KIND_TITLES.takeaways,
      required: true,
      blocks: [{ type: "list", variant: "key", items: keyPoints }],
    });
  }

  if (extras.flashcards?.length) {
    sections.push({
      id: "flashcards",
      kind: "flashcards",
      title: KIND_TITLES.flashcards,
      required: false,
      blocks: [{ type: "flashcards", cards: extras.flashcards }],
    });
  }

  if (module.quiz.length) {
    sections.push({
      id: "quiz",
      kind: "quiz",
      title: KIND_TITLES.quiz,
      required: true,
      blocks: [{ type: "quiz", items: module.quiz }],
    });
  }

  return sections;
}

export function lessonReadingMinutes(module: ProgramModule): number {
  const extras = getLessonExtras(module.id);
  const extraText = [
    ...(extras.objectives ?? []),
    ...(extras.examples ?? []).map((e) => e.text),
    ...(extras.auditorView ?? []),
    ...(extras.evidence ?? []),
    ...(extras.examFocus ?? []),
    ...(extras.commonMistakes ?? []),
    extras.scenario?.prompt ?? "",
    extras.scenario?.correction ?? "",
  ].join(" ");
  return readingMinutes(`${module.contentMarkdown} ${extraText}`);
}
