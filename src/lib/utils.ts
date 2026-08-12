import { clsx, type ClassValue } from "clsx";
import type { TFunction } from "i18next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate une date selon la langue active (étiquette BCP 47, ex. `fr-FR`, `en-GB`). */
export function formatDate(date: Date, bcp47: string, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString(bcp47, options);
}

/** Formate une date-heure selon la langue active. */
export function formatDateTime(date: Date, bcp47: string, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleString(bcp47, options);
}

/**
 * Traduit une erreur applicative : si `error.message` correspond à un code
 * connu (`common.errors.<code>`), renvoie sa traduction ; sinon retombe sur
 * `fallbackKey`. Les messages bruts du backend ne sont jamais affichés tels quels.
 */
export function translateAppError(
  t: TFunction,
  error: unknown,
  fallbackKey: string,
): string {
  if (error instanceof Error && error.message) {
    const translated = t(`common.errors.${error.message}`, { defaultValue: "" });
    if (translated) return translated;
  }
  return t(fallbackKey);
}

