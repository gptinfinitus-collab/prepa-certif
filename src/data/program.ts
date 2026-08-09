import raw from "./program.json";

export type ModuleType = "lesson" | "review" | "practical" | "mockExam" | "rest" | "wrapup";

export interface QuizItem {
  question: string;
  answer: string;
}

export interface ProgramModule {
  id: number;
  week: number;
  type: ModuleType;
  dayLabel: string;
  title: string;
  objective: string;
  contentMarkdown: string;
  keyTakeaway: string | null;
  quiz: QuizItem[];
  /**
   * Contenu pédagogique attaché au module (exemples, regard de l'auditeur,
   * point examen…). Utilisé par les cursus générés à partir d'un référentiel ;
   * le cursus ISO 45001 s'appuie sur `lessonExtras` indexé par identifiant.
   */
  extras?: import("./lesson-extras").LessonExtras;
}


export interface ProgramWeek {
  id: number;
  title: string;
  dayIds: number[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface ProgramMeta {
  title: string;
  subtitle: string;
  candidateExample: string;
  trainingExample: string;
  howToUse: string;
  copyrightNote: string;
  version: string;
}

export interface ProgramAnnexes {
  auditPlanTemplate: string[];
  ncTemplate: { field: string; hint: string }[];
  genericChecklist: string[];
  revisionSheets: { clause: string; summary: string }[];
  finalMockExam: {
    mcq: QuizItem[];
    [key: string]: unknown;
  };
}

interface Program {
  meta: ProgramMeta;
  weeks: ProgramWeek[];
  modules: ProgramModule[];
  glossary: GlossaryEntry[];
  annexes: ProgramAnnexes;
}

const data = raw as unknown as {
  meta: ProgramMeta;
  weeks: ProgramWeek[];
  days: ProgramModule[];
  glossary: GlossaryEntry[];
  annexes: ProgramAnnexes;
};

export const program: Program = {
  meta: data.meta,
  weeks: data.weeks,
  modules: data.days,
  glossary: data.glossary,
  annexes: data.annexes,
};

export const modules = program.modules;

export function getModule(id: number): ProgramModule | undefined {
  return modules.find((m) => m.id === id);
}

export const typeLabels: Record<ModuleType, string> = {
  lesson: "Cours",
  review: "Révision",
  practical: "Mise en pratique",
  mockExam: "Examen blanc",
  rest: "Repos",
  wrapup: "Bilan",
};
