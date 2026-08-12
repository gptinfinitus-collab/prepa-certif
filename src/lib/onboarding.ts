import { defaultPlan, parseISODate, toISODate, type StudyPlan } from "@/lib/schedule";

/** Étapes de l'écran de bienvenue, dans l'ordre. */
export type OnboardingStepId = "certification" | "track" | "planning";

export interface OnboardingStep {
  id: OnboardingStepId;
  titleKey: string;
  descriptionKey: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "certification",
    titleKey: "common.onboarding.certTitle",
    descriptionKey: "common.onboarding.certDesc",
  },
  {
    id: "track",
    titleKey: "common.onboarding.trackTitle",
    descriptionKey: "common.onboarding.trackDesc",
  },
  {
    id: "planning",
    titleKey: "common.onboarding.planningTitle",
    descriptionKey: "common.onboarding.planningDesc",
  },
];

export const STUDY_DAY_LABELS: { value: number; labelKey: string; shortKey: string }[] = [
  { value: 1, labelKey: "common.days.mon", shortKey: "common.daysShort.mon" },
  { value: 2, labelKey: "common.days.tue", shortKey: "common.daysShort.tue" },
  { value: 3, labelKey: "common.days.wed", shortKey: "common.daysShort.wed" },
  { value: 4, labelKey: "common.days.thu", shortKey: "common.daysShort.thu" },
  { value: 5, labelKey: "common.days.fri", shortKey: "common.daysShort.fri" },
  { value: 6, labelKey: "common.days.sat", shortKey: "common.daysShort.sat" },
  { value: 0, labelKey: "common.days.sun", shortKey: "common.daysShort.sun" },
];

export const MAX_MODULES_PER_DAY = 4;

/**
 * L'écran de bienvenue s'affiche tant qu'il n'a pas été terminé ou passé.
 * Il réapparaît si le compte n'a plus aucune certification suivie.
 */
export function needsOnboarding(input: {
  onboardedAt: string | null;
  hasCertification: boolean;
}): boolean {
  if (!input.onboardedAt) return true;
  return !input.hasCertification;
}

export function toggleStudyDay(days: number[], day: number): number[] {
  const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
  if (next.length === 0) return days;
  return next.sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
}

/** Nombre de jours de révision entre deux dates, bornes incluses. */
export function countStudyDaysBetween(from: Date, to: Date, studyDays: number[]): number {
  if (studyDays.length === 0 || to < from) return 0;
  let count = 0;
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  while (cursor <= end) {
    if (studyDays.includes(cursor.getDay())) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

/**
 * Planning pré-rempli à partir des réponses de l'écran de bienvenue :
 * le rythme quotidien est déduit du nombre de séances et du temps disponible
 * avant l'examen.
 */
export function suggestPlan(input: {
  today?: Date;
  examDate: string | null;
  studyDays: number[];
  moduleCount: number;
}): StudyPlan {
  const today = input.today ?? new Date();
  const studyDays = input.studyDays.length ? input.studyDays : defaultPlan.study_days;
  const plan: StudyPlan = {
    start_date: toISODate(today),
    exam_date: input.examDate,
    study_days: studyDays,
    modules_per_day: 1,
  };
  if (!input.examDate || input.moduleCount <= 0) return plan;

  const exam = parseISODate(input.examDate);
  if (exam <= today) return { ...plan, modules_per_day: MAX_MODULES_PER_DAY };

  // Dernier jour de révision : la veille de l'examen.
  const lastDay = new Date(exam);
  lastDay.setDate(lastDay.getDate() - 1);
  const available = countStudyDaysBetween(today, lastDay, studyDays);
  if (available <= 0) return { ...plan, modules_per_day: MAX_MODULES_PER_DAY };

  const perDay = Math.ceil(input.moduleCount / available);
  return { ...plan, modules_per_day: Math.min(Math.max(perDay, 1), MAX_MODULES_PER_DAY) };
}

/**
 * Résumé de faisabilité du rythme, sous forme de clé de traduction et de
 * paramètres : le libellé est produit dans la langue active par l'interface.
 */
export interface PaceSummary {
  key: "paceFree" | "paceSpread" | "paceTight";
  params: { count: number; days: number; perDay: number };
}

export function paceSummary(plan: StudyPlan, moduleCount: number, today = new Date()): PaceSummary {
  if (!plan.exam_date) {
    return {
      key: "paceFree",
      params: { count: moduleCount, days: 0, perDay: plan.modules_per_day },
    };
  }
  const exam = parseISODate(plan.exam_date);
  const lastDay = new Date(exam);
  lastDay.setDate(lastDay.getDate() - 1);
  const available = countStudyDaysBetween(today, lastDay, plan.study_days);
  const capacity = available * plan.modules_per_day;
  const params = { count: moduleCount, days: available, perDay: plan.modules_per_day };
  return { key: capacity >= moduleCount ? "paceSpread" : "paceTight", params };
}
