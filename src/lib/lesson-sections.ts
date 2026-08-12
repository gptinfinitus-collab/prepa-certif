import type { ProgramModule, QuizItem } from "@/data/program";
import {
  getLessonExtras,
  type Flashcard,
  type LessonExtras,
  type LessonScenario,
} from "@/data/lesson-extras";

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

type Locale = "fr" | "en";

const KIND_TITLES: Record<Locale, Record<SectionKind, string>> = {
  fr: {
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
  },
  en: {
    intro: "Why this topic matters",
    objectives: "Learning objectives",
    course: "Lesson",
    examples: "Concrete examples",
    auditor: "The auditor's view",
    evidence: "What evidence to look for?",
    exam: "Exam focus",
    mistakes: "Common mistakes",
    scenario: "Practice scenario",
    takeaways: "Key takeaways",
    flashcards: "Flashcards",
    quiz: "End-of-session quiz",
  },
};

const OBJECTIVE_LABEL: Record<Locale, string> = {
  fr: "Objectif de la séance",
  en: "Session objective",
};

export function sectionTitle(kind: SectionKind, locale: Locale = "fr"): string {
  return KIND_TITLES[locale][kind];
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
 * Contenu pédagogique d'un module : attaché au module pour les cursus générés
 * à partir d'un référentiel, indexé par identifiant pour le cursus ISO 45001.
 */
export function moduleExtras(module: ProgramModule): LessonExtras {
  return module.extras ?? getLessonExtras(module.id);
}

/**
 * Construit le parcours séquencé d'une séance : une étape par bloc pédagogique,
 * dans l'ordre imposé par la trame de cours.
 */
export function buildLessonSections(module: ProgramModule, locale: Locale = "fr"): LessonSection[] {
  const titles = KIND_TITLES[locale];
  const extras = moduleExtras(module);
  const sections: LessonSection[] = [];
  const parts = splitMarkdownSections(module.contentMarkdown);
  const intro = parts.find((p) => p.body.length > 0);

  sections.push({
    id: "intro",
    kind: "intro",
    title: titles.intro,
    required: true,
    blocks: [
      { type: "markdown", content: `**${OBJECTIVE_LABEL[locale]} :** ${module.objective}` },
      ...(intro
        ? [{ type: "markdown" as const, content: intro.body.split("\n\n").slice(0, 1).join("\n\n") }]
        : []),
    ],
  });

  if (extras.objectives?.length) {
    sections.push({
      id: "objectives",
      kind: "objectives",
      title: titles.objectives,
      required: true,
      blocks: [{ type: "list", variant: "objective", items: extras.objectives }],
    });
  }

  parts.forEach((part, index) => {
    if (!part.body && !part.heading) return;
    sections.push({
      id: `course-${index}`,
      kind: "course",
      title: part.heading ?? titles.course,
      required: true,
      blocks: [{ type: "markdown", content: part.body }],
    });
  });

  if (extras.examples?.length) {
    sections.push({
      id: "examples",
      kind: "examples",
      title: titles.examples,
      required: true,
      blocks: [{ type: "examples", items: extras.examples }],
    });
  }

  if (extras.auditorView?.length) {
    sections.push({
      id: "auditor",
      kind: "auditor",
      title: titles.auditor,
      required: true,
      blocks: [{ type: "list", variant: "auditor", items: extras.auditorView }],
    });
  }

  if (extras.evidence?.length) {
    sections.push({
      id: "evidence",
      kind: "evidence",
      title: titles.evidence,
      required: true,
      blocks: [{ type: "list", variant: "evidence", items: extras.evidence }],
    });
  }

  if (extras.examFocus?.length) {
    sections.push({
      id: "exam",
      kind: "exam",
      title: titles.exam,
      required: true,
      blocks: [{ type: "list", variant: "exam", items: extras.examFocus }],
    });
  }

  if (extras.commonMistakes?.length) {
    sections.push({
      id: "mistakes",
      kind: "mistakes",
      title: titles.mistakes,
      required: true,
      blocks: [{ type: "list", variant: "mistake", items: extras.commonMistakes }],
    });
  }

  if (extras.scenario) {
    sections.push({
      id: "scenario",
      kind: "scenario",
      title: titles.scenario,
      required: true,
      blocks: [{ type: "scenario", scenario: extras.scenario }],
    });
  }

  const keyPoints = extras.keyPoints ?? (module.keyTakeaway ? [module.keyTakeaway] : []);
  if (keyPoints.length) {
    sections.push({
      id: "takeaways",
      kind: "takeaways",
      title: titles.takeaways,
      required: true,
      blocks: [{ type: "list", variant: "key", items: keyPoints }],
    });
  }

  if (extras.flashcards?.length) {
    sections.push({
      id: "flashcards",
      kind: "flashcards",
      title: titles.flashcards,
      required: false,
      blocks: [{ type: "flashcards", cards: extras.flashcards }],
    });
  }

  if (module.quiz.length) {
    sections.push({
      id: "quiz",
      kind: "quiz",
      title: titles.quiz,
      required: true,
      blocks: [{ type: "quiz", items: module.quiz }],
    });
  }

  return sections;
}

export function lessonReadingMinutes(module: ProgramModule): number {
  const extras = moduleExtras(module);
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
