import type { Locale } from "@/i18n/config";

/** Texte localisé pour les deux langues prises en charge. */
export type LocalizedText = Record<Locale, string>;

/** Informations de l'éditeur utilisées par toutes les pages légales. */
export const legalInfo = {
  appName: "PREPA CERTIF",
  siteUrl: "https://prepa-certif.app",
  publisher: "PREPA CERTIF",
  publisherStatus: {
    fr: "éditeur du service en ligne PREPA CERTIF",
    en: "publisher of the PREPA CERTIF online service",
  } satisfies LocalizedText,
  publicationDirector: {
    fr: "Le représentant légal de PREPA CERTIF",
    en: "The legal representative of PREPA CERTIF",
  } satisfies LocalizedText,
  contactEmail: "contact@prepa-certif.app",
  privacyEmail: "privacy@prepa-certif.app",
  host: "Lovable (Cloudflare Workers)",
  hostDetails: {
    fr: "Infrastructure d'hébergement et de base de données située dans l'Union européenne.",
    en: "Hosting and database infrastructure located in the European Union.",
  } satisfies LocalizedText,
  updatedAt: {
    fr: "9 août 2026",
    en: "August 9, 2026",
  } satisfies LocalizedText,
} as const;

export type LegalDocument = {
  slug: "cgu" | "confidentialite" | "cookies" | "mentions-legales";
  path: "/cgu" | "/confidentialite" | "/cookies" | "/mentions-legales";
  title: LocalizedText;
  description: LocalizedText;
};

export const legalDocuments: LegalDocument[] = [
  {
    slug: "cgu",
    path: "/cgu",
    title: { fr: "Conditions générales d'utilisation", en: "Terms of Use" },
    description: {
      fr: "Règles d'utilisation du service PREPA CERTIF : compte, contenus, propriété intellectuelle et responsabilité.",
      en: "Rules for using the PREPA CERTIF service: account, content, intellectual property and liability.",
    },
  },
  {
    slug: "confidentialite",
    path: "/confidentialite",
    title: { fr: "Politique de confidentialité", en: "Privacy Policy" },
    description: {
      fr: "Données collectées par PREPA CERTIF, finalités, durées de conservation et droits RGPD des utilisateurs.",
      en: "Data collected by PREPA CERTIF, purposes, retention periods and users' GDPR rights.",
    },
  },
  {
    slug: "cookies",
    path: "/cookies",
    title: { fr: "Politique de cookies", en: "Cookie Policy" },
    description: {
      fr: "Cookies utilisés par PREPA CERTIF : session d'authentification et préférence d'affichage uniquement.",
      en: "Cookies used by PREPA CERTIF: authentication session and display preference only.",
    },
  },
  {
    slug: "mentions-legales",
    path: "/mentions-legales",
    title: { fr: "Mentions légales", en: "Legal Notice" },
    description: {
      fr: "Éditeur, directeur de publication, contact et hébergeur du service PREPA CERTIF.",
      en: "Publisher, publication director, contact and host of the PREPA CERTIF service.",
    },
  },
];

export function legalDocument(slug: LegalDocument["slug"]): LegalDocument {
  const found = legalDocuments.find((doc) => doc.slug === slug);
  if (!found) throw new Error(`Document légal inconnu : ${slug}`);
  return found;
}

/**
 * Métadonnées `head()` normalisées pour une page légale. Le head étant
 * généré côté serveur avant résolution de la langue du visiteur, il reste en
 * français (langue par défaut) ; le contenu visible de la page, lui, suit la
 * langue active via `useLocale()`.
 */
export function legalHead(slug: LegalDocument["slug"], locale: Locale = "fr") {
  const doc = legalDocument(slug);
  const title = `${doc.title[locale]} — ${legalInfo.appName}`;
  const description = doc.description[locale];
  const url = `${legalInfo.siteUrl}${doc.path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://prepa-certif.app/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "PREPA CERTIF — Préparation aux certifications ISO" },
      { name: "twitter:image", content: "https://prepa-certif.app/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
