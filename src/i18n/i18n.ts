import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE, type Locale } from "./config";

import frCommon from "./locales/fr/common.json";
import frNav from "./locales/fr/nav.json";
import frAuth from "./locales/fr/auth.json";
import frCourse from "./locales/fr/course.json";
import frQuiz from "./locales/fr/quiz.json";
import frCpd from "./locales/fr/cpd.json";
import frLegal from "./locales/fr/legal.json";
import frAdmin from "./locales/fr/admin.json";
import frAssistant from "./locales/fr/assistant.json";
import frManual from "./locales/fr/manual.json";
import frSeo from "./locales/fr/seo.json";
import frAudit from "./locales/fr/audit.json";
import frStandardDoc from "./locales/fr/standardDoc.json";

import enCommon from "./locales/en/common.json";
import enNav from "./locales/en/nav.json";
import enAuth from "./locales/en/auth.json";
import enCourse from "./locales/en/course.json";
import enQuiz from "./locales/en/quiz.json";
import enCpd from "./locales/en/cpd.json";
import enLegal from "./locales/en/legal.json";
import enAdmin from "./locales/en/admin.json";
import enAssistant from "./locales/en/assistant.json";
import enManual from "./locales/en/manual.json";
import enSeo from "./locales/en/seo.json";
import enAudit from "./locales/en/audit.json";
import enStandardDoc from "./locales/en/standardDoc.json";

/** Ressources fusionnées dans un unique espace de noms `translation`. */
export const resources = {
  fr: {
    translation: {
      common: frCommon,
      nav: frNav,
      auth: frAuth,
      course: frCourse,
      quiz: frQuiz,
      cpd: frCpd,
      legal: frLegal,
      admin: frAdmin,
      assistant: frAssistant,
      manual: frManual,
      seo: frSeo,
      audit: frAudit,
      standardDoc: frStandardDoc,
    },
  },
  en: {
    translation: {
      common: enCommon,
      nav: enNav,
      auth: enAuth,
      course: enCourse,
      quiz: enQuiz,
      cpd: enCpd,
      legal: enLegal,
      admin: enAdmin,
      assistant: enAssistant,
      manual: enManual,
      seo: enSeo,
      audit: enAudit,
      standardDoc: enStandardDoc,
    },
  },
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    defaultNS: "translation",
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

/** Change la langue de l'instance i18next (idempotent). */
export function applyI18nLocale(locale: Locale) {
  if (i18n.language !== locale) void i18n.changeLanguage(locale);
}

export default i18n;
