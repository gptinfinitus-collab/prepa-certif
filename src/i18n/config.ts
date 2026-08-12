/** Langues prises en charge par l'application. */
export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_STORAGE_KEY = "pc_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}

/** Locale déduite du navigateur, avec repli sur le français. */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const langs = [navigator.language, ...(navigator.languages ?? [])];
  for (const lang of langs) {
    const short = lang?.slice(0, 2).toLowerCase();
    if (isLocale(short)) return short;
  }
  return DEFAULT_LOCALE;
}
