import { HTML_LANG, OG_LOCALE, type Locale } from "@/i18n/config";

import frSeo from "@/i18n/locales/fr/seo.json";
import enSeo from "@/i18n/locales/en/seo.json";

export const SITE_URL = "https://prepa-certif.app";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

const SEO = { fr: frSeo, en: enSeo } as const;

export type SeoKey = Exclude<keyof typeof frSeo, "imageAlt">;

/**
 * Métadonnées d'une page dans la langue active : titre, description, Open Graph,
 * Twitter, canonique et alternates `hreflang` (une seule arborescence d'URL).
 */
export function pageHead(locale: Locale, key: SeoKey, path: string) {
  const dict = SEO[locale] ?? SEO.fr;
  const entry = dict[key] as {
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
  };
  const url = `${SITE_URL}${path}`;
  const alternate: Locale = locale === "fr" ? "en" : "fr";

  return {
    meta: [
      { title: entry.title },
      { name: "description", content: entry.description },
      { property: "og:title", content: entry.ogTitle ?? entry.title },
      { property: "og:description", content: entry.ogDescription ?? entry.description },

      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: dict.imageAlt },
      { property: "og:locale", content: OG_LOCALE[locale] },
      { property: "og:locale:alternate", content: OG_LOCALE[alternate] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: HTML_LANG.fr, href: url },
      { rel: "alternate", hrefLang: HTML_LANG.en, href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
  };
}
