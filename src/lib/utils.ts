import { clsx, type ClassValue } from "clsx";
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
 * `fallbackKey`. Les messages Supabase bruts ne sont jamais affichés tels quels.
 */
export function translateAppError(
  t: (key: string, options?: Record<string, unknown>) => string,
  error: unknown,
  fallbackKey: string,
): string {
  if (error instanceof Error && error.message) {
    const key = `common.errors.${error.message}`;
    const translated = t(key, { defaultValue: "" });
    if (translated) return translated;
  }
  return t(fallbackKey);
}
