import { modules, type ProgramModule } from "@/data/program";

export interface StudyPlan {
  start_date: string; // YYYY-MM-DD
  exam_date: string | null;
  study_days: number[]; // 0 = dimanche ... 6 = samedi
  modules_per_day: number;
}

export const defaultPlan: StudyPlan = {
  start_date: toISODate(new Date()),
  exam_date: null,
  study_days: [1, 2, 3, 4, 5],
  modules_per_day: 1,
};

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export interface ScheduledDay {
  date: Date;
  modules: ProgramModule[];
}

export interface ScheduleResult {
  days: ScheduledDay[];
  /** Nombre de séances par jour réellement appliqué (peut être augmenté pour tenir la date d'examen). */
  effectiveModulesPerDay: number;
  /** Vrai si le rythme a dû être compressé pour respecter la date d'examen. */
  compressed: boolean;
  endDate: Date | null;
}

function isStudyDay(date: Date, studyDays: number[]): boolean {
  return studyDays.includes(date.getDay());
}

function countStudyDays(from: Date, to: Date, studyDays: number[]): number {
  if (to < from) return 0;
  let count = 0;
  const cursor = new Date(from);
  while (cursor <= to) {
    if (isStudyDay(cursor, studyDays)) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

/**
 * Répartit les séances du programme sur le calendrier réel de l'utilisateur.
 * La durée n'est pas figée : elle découle de la date de début, des jours
 * travaillés, du nombre de séances par jour et, si elle est fournie, de la
 * date d'examen (qui peut compresser le rythme).
 */
export function buildSchedule(plan: StudyPlan, list: ProgramModule[] = modules): ScheduleResult {
  const studyDays = plan.study_days.length > 0 ? plan.study_days : [0, 1, 2, 3, 4, 5, 6];
  const start = parseISODate(plan.start_date);
  let perDay = Math.max(1, Math.round(plan.modules_per_day));
  let compressed = false;

  if (plan.exam_date) {
    const exam = parseISODate(plan.exam_date);
    const available = countStudyDays(start, exam, studyDays);
    if (available > 0) {
      const needed = Math.ceil(list.length / available);
      if (needed > perDay) {
        perDay = needed;
        compressed = true;
      }
    }
  }

  const days: ScheduledDay[] = [];
  const cursor = new Date(start);
  let index = 0;
  let guard = 0;
  while (index < list.length && guard < 3000) {
    guard += 1;
    if (isStudyDay(cursor, studyDays)) {
      days.push({ date: new Date(cursor), modules: list.slice(index, index + perDay) });
      index += perDay;
    }
    if (index < list.length) cursor.setDate(cursor.getDate() + 1);
  }

  return {
    days,
    effectiveModulesPerDay: perDay,
    compressed,
    endDate: days.length ? days[days.length - 1].date : null,
  };
}

export function scheduleByModuleId(result: ScheduleResult): Map<number, Date> {
  const map = new Map<number, Date>();
  for (const day of result.days) {
    for (const m of day.modules) map.set(m.id, day.date);
  }
  return map;
}

export function formatFrenchDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

export interface PaceStatus {
  expectedCompleted: number;
  label: string;
  tone: "ahead" | "ontrack" | "behind";
}

/** Compare le nombre de séances terminées à ce que le planning prévoit aujourd'hui. */
export function computePace(result: ScheduleResult, completedCount: number): PaceStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let expected = 0;
  for (const day of result.days) {
    if (day.date <= today) expected += day.modules.length;
  }
  const diff = completedCount - expected;
  if (diff >= 1) return { expectedCompleted: expected, label: `En avance de ${diff} séance(s)`, tone: "ahead" };
  if (diff <= -1)
    return { expectedCompleted: expected, label: `En retard de ${Math.abs(diff)} séance(s)`, tone: "behind" };
  return { expectedCompleted: expected, label: "Dans les temps", tone: "ontrack" };
}

export const dayNames = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" },
  { value: 5, label: "Ven" },
  { value: 6, label: "Sam" },
  { value: 0, label: "Dim" },
];
