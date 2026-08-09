import raw from "./program.json";

export type ModuleType = "lesson" | "review" | "practical" | "mockExam" | "rest" | "wrapup";

/**
 * Nature de l'affirmation portée par un contenu ou une question, afin que
 * l'apprenant ne confonde jamais une exigence de la norme auditée avec une
 * ligne directrice d'audit ou une règle de certification tierce partie.
 */
export type ReferenceType =
  | "REQUIREMENT"
  | "GUIDANCE"
  | "CERTIFICATION_RULE"
  | "GOOD_PRACTICE"
  | "PEDAGOGICAL_EXAMPLE";

export type ReviewStatus = "DRAFT" | "NEEDS_VERIFICATION" | "VERIFIED";

/** Traçabilité normative attachable à un contenu ou à une question. */
export interface NormativeRef {
  /** Référentiel source, ex. « ISO 45001 », « ISO 19011 », « ISO/IEC 17021-1 ». */
  standardRef?: string;
  /** Édition utilisée, ex. « 2018 + Amd 1:2024 », « 2026 ». */
  standardEdition?: string;
  /** Chapitre ou article cité, ex. « 5.2 ». */
  clauseRef?: string;
  referenceType?: ReferenceType;
  /** Date de la dernière vérification du contenu contre sa source. */
  verifiedAt?: string;
  reviewStatus?: ReviewStatus;
}

export interface QuizItem extends NormativeRef {
  question: string;
  answer: string;
  /** Question de révision reprise d'une séance antérieure (hors statistiques). */
  revision?: boolean;
}


export interface ProgramModule extends NormativeRef {
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
  /** Niveau de parcours imposé pour ce module (sinon déduit du contenu). */
  track?: "general" | "internal_auditor" | "lead_auditor";
}


export interface ProgramWeek {
  id: number;
  title: string;
  dayIds: number[];
}

export interface GlossaryEntry extends NormativeRef {
  term: string;
  definition: string;
}

export interface ProgramMeta {
  title: string;
  subtitle: string;
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
