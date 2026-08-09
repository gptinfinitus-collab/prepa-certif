import { defaultPlan, parseISODate, toISODate, type StudyPlan } from "@/lib/schedule";

/** Étapes de l'écran de bienvenue, dans l'ordre. */
export type OnboardingStepId = "certification" | "track" | "planning";

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
  description: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "certification",
    title: "Quelle certification préparez-vous ?",
    description: "Elle définit votre programme, vos documents et votre progression.",
  },
  {
    id: "track",
    title: "Quel niveau visez-vous ?",
    description:
      "Maîtrise de la norme, auditeur interne ou Lead Auditor. Vous pourrez en changer à tout moment.",
  },
  {
    id: "planning",
    title: "Quand passez-vous l'examen ?",
    description: "Nous répartissons vos séances sur vos jours de révision jusqu'à cette date.",
  },
];

export const STUDY_DAY_LABELS: { value: number; label: string; short: string }[] = [
  { value: 1, label: "Lundi", short: "L" },
  { value: 2, label: "Mardi", short: "Ma" },
  { value: 3, label: "Mercredi", short: "Me" },
  { value: 4, label: "Jeudi", short: "J" },
  { value: 5, label: "Vendredi", short: "V" },
  { value: 6, label: "Samedi", short: "S" },
  { value: 0, label: "Dimanche", short: "D" },
];

export const MAX_MODULES_PER_DAY = 4;

/** L'écran de bienvenue s'affiche tant qu'il n'a pas été terminé ou passé. */
export function needsOnboarding(input: {
  onboardedAt: string | null;
  hasCertification: boolean;
}): boolean {
  if (input.onboardedAt) return false;
  return !input.hasCertification || true;
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

/** Message court résumant la faisabilité du rythme proposé. */
export function paceSummary(plan: StudyPlan, moduleCount: number, today = new Date()): string {
  if (!plan.exam_date) {
    return `${moduleCount} séances à votre rythme, ${plan.modules_per_day} par jour de révision.`;
  }
  const exam = parseISODate(plan.exam_date);
  const lastDay = new Date(exam);
  lastDay.setDate(lastDay.getDate() - 1);
  const available = countStudyDaysBetween(today, lastDay, plan.study_days);
  const capacity = available * plan.modules_per_day;
  if (capacity >= moduleCount) {
    return `${moduleCount} séances réparties sur ${available} jours de révision, ${plan.modules_per_day} par jour.`;
  }
  return `Rythme serré : ${moduleCount} séances pour ${available} jours de révision disponibles. Ajoutez des jours ou avancez la date de début.`;
}
