/** Informations de l'éditeur utilisées par toutes les pages légales. */
export const legalInfo = {
  appName: "PREPA CERTIF",
  siteUrl: "https://prepa-certif.app",
  publisher: "PREPA CERTIF",
  publisherStatus: "éditeur du service en ligne PREPA CERTIF",
  publicationDirector: "Le représentant légal de PREPA CERTIF",
  contactEmail: "contact@prepa-certif.app",
  privacyEmail: "privacy@prepa-certif.app",
  host: "Lovable (Cloudflare Workers)",
  hostDetails: "Infrastructure d'hébergement et de base de données située dans l'Union européenne.",
  updatedAt: "9 août 2026",
} as const;

export type LegalDocument = {
  slug: "cgu" | "confidentialite" | "cookies" | "mentions-legales";
  path: "/cgu" | "/confidentialite" | "/cookies" | "/mentions-legales";
  title: string;
  description: string;
};

export const legalDocuments: LegalDocument[] = [
  {
    slug: "cgu",
    path: "/cgu",
    title: "Conditions générales d'utilisation",
    description:
      "Règles d'utilisation du service PREPA CERTIF : compte, contenus, propriété intellectuelle et responsabilité.",
  },
  {
    slug: "confidentialite",
    path: "/confidentialite",
    title: "Politique de confidentialité",
    description:
      "Données collectées par PREPA CERTIF, finalités, durées de conservation et droits RGPD des utilisateurs.",
  },
  {
    slug: "cookies",
    path: "/cookies",
    title: "Politique de cookies",
    description:
      "Cookies utilisés par PREPA CERTIF : session d'authentification et préférence d'affichage uniquement.",
  },
  {
    slug: "mentions-legales",
    path: "/mentions-legales",
    title: "Mentions légales",
    description: "Éditeur, directeur de publication, contact et hébergeur du service PREPA CERTIF.",
  },
];

export function legalDocument(slug: LegalDocument["slug"]): LegalDocument {
  const found = legalDocuments.find((doc) => doc.slug === slug);
  if (!found) throw new Error(`Document légal inconnu : ${slug}`);
  return found;
}

/** Métadonnées `head()` normalisées pour une page légale. */
export function legalHead(slug: LegalDocument["slug"]) {
  const doc = legalDocument(slug);
  const title = `${doc.title} — ${legalInfo.appName}`;
  const url = `${legalInfo.siteUrl}${doc.path}`;
  return {
    meta: [
      { title },
      { name: "description", content: doc.description },
      { property: "og:title", content: title },
      { property: "og:description", content: doc.description },
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
