/**
 * Mirror anglais du catalogue de liens utiles.
 *
 * TODO(i18n) : contenu encore en français, à traduire.
 */
import type { LinkCategory, UsefulLink } from "./useful-links";
import { USEFUL_LINKS } from "./useful-links";

export const enUsefulLinks: UsefulLink[] = USEFUL_LINKS;

export const enCategoryLabels: Record<LinkCategory, string> = {
  "Normes et textes officiels": "Standards and official texts",
  "Certification et registres d'auditeurs": "Certification and auditor registers",
  "Accréditation et règles d'audit": "Accreditation and audit rules",
  "Réglementation S&ST": "OH&S regulations",
  "Ressources de préparation": "Preparation resources",
  Autre: "Other",
};
