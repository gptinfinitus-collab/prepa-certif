/** Langues prises en charge par l'application. */
export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_STORAGE_KEY = "pc_locale";

/** Cookie lu côté serveur pour rendre la première page dans la bonne langue. */
export const LOCALE_COOKIE_KEY = "pc_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

/** Étiquette BCP 47 utilisée pour `<html lang>` et le formatage des dates. */
export const HTML_LANG: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
};

/** Valeur Open Graph correspondante. */
export const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
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

/** Lecture du cookie de langue côté navigateur. */
export function readLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE_KEY}=([^;]*)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return isLocale(value) ? value : null;
}

/** Écriture du cookie de langue (1 an), lisible par le rendu serveur. */
export function writeLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
