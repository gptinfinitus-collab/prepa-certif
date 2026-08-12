import type { Locale } from "@/i18n/config";
import { enUsefulLinks, enCategoryLabels } from "./useful-links.en";
export const LINK_CATEGORIES = [
  "Normes et textes officiels",
  "Certification et registres d'auditeurs",
  "Accréditation et règles d'audit",
  "Réglementation S&ST",
  "Ressources de préparation",
  "Autre",
] as const;

export type LinkCategory = (typeof LINK_CATEGORIES)[number];

export interface UsefulLink {
  title: string;
  url: string;
  description: string;
  category: LinkCategory;
  cost: "gratuit" | "payant";
}

/** Catalogue curé de ressources externes utiles à la préparation. */
export const USEFUL_LINKS: UsefulLink[] = [
  // Normes et textes officiels
  {
    title: "Boutique ISO",
    url: "https://www.iso.org/store.html",
    description: "Achat officiel des textes normatifs en anglais et en français.",
    category: "Normes et textes officiels",
    cost: "payant",
  },
  {
    title: "ISO Online Browsing Platform (OBP)",
    url: "https://www.iso.org/obp/ui/",
    description:
      "Consultation gratuite des termes et définitions (chapitre 3) de la plupart des normes.",
    category: "Normes et textes officiels",
    cost: "gratuit",
  },
  {
    title: "ISO 45001:2018 — page officielle",
    url: "https://www.iso.org/standard/63787.html",
    description: "Systèmes de management de la santé et de la sécurité au travail (avec Amd 1:2024).",
    category: "Normes et textes officiels",
    cost: "payant",
  },
  {
    title: "ISO 9001:2015 — page officielle",
    url: "https://www.iso.org/standard/62085.html",
    description: "Systèmes de management de la qualité — exigences.",
    category: "Normes et textes officiels",
    cost: "payant",
  },
  {
    title: "ISO 14001:2015 — page officielle",
    url: "https://www.iso.org/standard/60857.html",
    description: "Systèmes de management environnemental — exigences.",
    category: "Normes et textes officiels",
    cost: "payant",
  },
  {
    title: "ISO/IEC 27001:2022 — page officielle",
    url: "https://www.iso.org/standard/27001",
    description: "Sécurité de l'information, cybersécurité et protection de la vie privée.",
    category: "Normes et textes officiels",
    cost: "payant",
  },
  {
    title: "ISO 19011 — lignes directrices pour l'audit",
    url: "https://www.iso.org/standard/70017.html",
    description: "Texte de référence pour la conduite des audits de systèmes de management.",
    category: "Normes et textes officiels",
    cost: "payant",
  },
  {
    title: "AFNOR Éditions",
    url: "https://www.boutique.afnor.org/",
    description: "Versions françaises (NF EN ISO) des normes et guides associés.",
    category: "Normes et textes officiels",
    cost: "payant",
  },

  // Certification et registres d'auditeurs
  {
    title: "CQI/IRCA — certification des auditeurs",
    url: "https://www.quality.org/cqi-irca-certification",
    description: "Schéma de certification, grades et conditions d'admission.",
    category: "Certification et registres d'auditeurs",
    cost: "gratuit",
  },
  {
    title: "CQI/IRCA — maintien de la certification (CPD)",
    url: "https://www.quality.org/cqi-irca-certification/maintaining-your-certification",
    description: "Règles de développement professionnel continu et de renouvellement annuel.",
    category: "Certification et registres d'auditeurs",
    cost: "gratuit",
  },
  {
    title: "CQI/IRCA — recherche de formations certifiées",
    url: "https://www.quality.org/training",
    description: "Annuaire des cours Lead Auditor reconnus par le schéma.",
    category: "Certification et registres d'auditeurs",
    cost: "gratuit",
  },
  {
    title: "PECB",
    url: "https://pecb.com/en/education-and-certification-for-individuals",
    description: "Schéma de certification alternatif (Lead Auditor, Lead Implementer).",
    category: "Certification et registres d'auditeurs",
    cost: "gratuit",
  },
  {
    title: "Exemplar Global",
    url: "https://exemplarglobal.org/certifications/",
    description: "Certification de personnes (auditeurs) reconnue à l'international.",
    category: "Certification et registres d'auditeurs",
    cost: "gratuit",
  },

  // Accréditation et règles d'audit
  {
    title: "International Accreditation Forum (IAF)",
    url: "https://iaf.nu/",
    description: "Organisation faîtière des organismes d'accréditation.",
    category: "Accréditation et règles d'audit",
    cost: "gratuit",
  },
  {
    title: "IAF — documents obligatoires (MD)",
    url: "https://iaf.nu/en/iaf-documents/",
    description: "Règles de durée d'audit, audits multisites, certification à distance.",
    category: "Accréditation et règles d'audit",
    cost: "gratuit",
  },
  {
    title: "ISO/IEC 17021-1 — exigences pour les organismes de certification",
    url: "https://www.iso.org/standard/61651.html",
    description: "Cadre des cycles de certification, étapes 1 et 2, surveillance.",
    category: "Accréditation et règles d'audit",
    cost: "payant",
  },
  {
    title: "COFRAC",
    url: "https://www.cofrac.fr/",
    description: "Organisme français d'accréditation : organismes certifiés et documents.",
    category: "Accréditation et règles d'audit",
    cost: "gratuit",
  },

  // Réglementation S&ST
  {
    title: "OIT — sécurité et santé au travail",
    url: "https://www.ilo.org/topics/safety-and-health-work",
    description: "Conventions, recommandations et rapports internationaux.",
    category: "Réglementation S&ST",
    cost: "gratuit",
  },
  {
    title: "EU-OSHA",
    url: "https://osha.europa.eu/fr",
    description: "Agence européenne : directives, campagnes et outils d'évaluation des risques.",
    category: "Réglementation S&ST",
    cost: "gratuit",
  },
  {
    title: "INRS",
    url: "https://www.inrs.fr/",
    description: "Dossiers techniques, fiches risques et méthodes de prévention.",
    category: "Réglementation S&ST",
    cost: "gratuit",
  },
  {
    title: "Légifrance — Code du travail (partie IV)",
    url: "https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006072050/",
    description: "Obligations françaises en santé et sécurité au travail.",
    category: "Réglementation S&ST",
    cost: "gratuit",
  },

  // Ressources de préparation
  {
    title: "ISO — ressources et publications gratuites",
    url: "https://www.iso.org/publications.html",
    description: "Briefing notes, handbooks et guides de mise en œuvre.",
    category: "Ressources de préparation",
    cost: "gratuit",
  },
  {
    title: "ISO 45001 — briefing note",
    url: "https://www.iso.org/iso-45001-occupational-health-and-safety.html",
    description: "Présentation officielle de la norme et de ses bénéfices.",
    category: "Ressources de préparation",
    cost: "gratuit",
  },
  {
    title: "Structure harmonisée (Annexe SL / Appendice 2)",
    url: "https://www.iso.org/sites/directives/current/consolidated/index.xhtml",
    description: "Directives ISO/IEC : structure commune des normes de systèmes de management.",
    category: "Ressources de préparation",
    cost: "gratuit",
  },
  {
    title: "ISO Survey",
    url: "https://www.iso.org/the-iso-survey.html",
    description: "Statistiques mondiales de certification par norme et par pays.",
    category: "Ressources de préparation",
    cost: "gratuit",
  },
];

/** Liens internes de l'application, proposés en complément. */
export const INTERNAL_LINKS = [
  { to: "/references", label: "Références ISO", description: "Textes normatifs et résumés par chapitre." },
  { to: "/glossaire", label: "Glossaire", description: "Définitions clés attendues à l'examen." },
  { to: "/annexes", label: "Annexes", description: "Trames d'audit et examen blanc." },
  { to: "/cpd", label: "Journal CPD", description: "Suivi de votre développement professionnel." },
] as const;

/** Regroupe des liens par catégorie, dans l'ordre déclaré des catégories. */
export function groupLinksByCategory<T extends { category: string }>(
  links: T[],
): { category: string; links: T[] }[] {
  const known = LINK_CATEGORIES.filter((c) => links.some((l) => l.category === c));
  const extra = Array.from(new Set(links.map((l) => l.category))).filter(
    (c) => !LINK_CATEGORIES.includes(c as LinkCategory),
  );
  return [...known, ...extra].map((category) => ({
    category,
    links: links.filter((l) => l.category === category),
  }));
}

/** Catalogue de liens dans la langue demandée. */
export function getUsefulLinks(locale: Locale = "fr"): UsefulLink[] {
  return locale === "en" ? enUsefulLinks : USEFUL_LINKS;
}

/** Libellé affiché d'une catégorie de liens. */
export function getCategoryLabel(category: LinkCategory, locale: Locale = "fr"): string {
  return locale === "en" ? enCategoryLabels[category] : category;
}
