/**
 * Mirror anglais du contenu pédagogique générique par chapitre HLS.
 *
 * TODO(i18n) : contenu encore en français, à traduire.
 */
import type { LessonExtras } from "./lesson-extras";
import type { ClauseKey, StandardContext } from "./standard-extras";
import { getClauseExtras, methodologyExtras } from "./standard-extras";

export function enGenericClauseExtras(ctx: StandardContext, key: ClauseKey): LessonExtras {
  return getClauseExtras(ctx, key === "annexe" ? "Annexe A" : key, "fr");
}

export const enMethodologyExtras: LessonExtras[] = methodologyExtras;
