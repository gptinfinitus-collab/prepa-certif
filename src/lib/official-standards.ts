/** Textes de norme officiels déjà déposés dans l'application (lecture privée). */
export const OFFICIAL_STANDARD_LANGUAGES = ["fr", "en"] as const;

export type OfficialStandardLanguage = (typeof OFFICIAL_STANDARD_LANGUAGES)[number];

/** Codes de certification pour lesquels un texte officiel est disponible. */
export const OFFICIAL_STANDARDS: Record<string, readonly OfficialStandardLanguage[]> = {
  "iso-45001": ["fr", "en"],
};

/** Chemin de stockage partagé du texte officiel. */
export function officialStandardPath(code: string, language: OfficialStandardLanguage): string {
  return `official/${code}/${language}.pdf`;
}

/** Langues disponibles pour une certification donnée. */
export function officialLanguagesFor(code: string | undefined | null) {
  return (code && OFFICIAL_STANDARDS[code]) || [];
}
