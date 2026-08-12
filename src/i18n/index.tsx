import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALE_STORAGE_KEY,
  isLocale,
  readLocaleCookie,
  writeLocaleCookie,
  type Locale,
} from "./config";
import i18n, { applyI18nLocale } from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Étiquette BCP 47 (`fr-FR`, `en-GB`) pour le formatage des dates et des tris. */
  bcp47: string;
  /** Faux tant que la langue de l'utilisateur n'a pas été résolue côté client. */
  ready: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  bcp47: HTML_LANG[DEFAULT_LOCALE],
  ready: false,
});

/** Enregistre la langue sur le profil connecté (silencieux hors session). */
async function persistLocale(locale: Locale) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;
  await supabase.from("profiles").upsert({ id: user.id, locale }, { onConflict: "id" });
}

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  // La langue est déjà résolue côté serveur : le premier rendu client est identique.
  applyI18nLocale(initialLocale);
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [ready, setReady] = useState(false);

  // Le profil utilisateur reste la source de vérité une fois connecté.
  useEffect(() => {
    let cancelled = false;

    const apply = (next: Locale) => {
      if (cancelled) return;
      setLocaleState(next);
      applyI18nLocale(next);
      writeLocaleCookie(next);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      if (typeof document !== "undefined") document.documentElement.lang = next;
      setReady(true);
    };

    apply(readLocaleCookie() ?? initialLocale);

    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("locale")
        .eq("id", user.id)
        .maybeSingle();
      if (profile && isLocale(profile.locale)) apply(profile.locale);
    })();

    return () => {
      cancelled = true;
    };
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    applyI18nLocale(next);
    if (typeof window !== "undefined") window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    writeLocaleCookie(next);
    if (typeof document !== "undefined") document.documentElement.lang = next;
    void persistLocale(next);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, bcp47: HTML_LANG[locale], ready }),
    [locale, setLocale, ready],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}


/** Langue active et fonction de changement de langue. */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

/**
 * Fonction de traduction. Les clés sont préfixées par leur domaine :
 * `t("nav.dashboard")`, `t("common.save")`, `t("course.keyTakeaway")`...
 */
export function useT() {
  const { t } = useTranslation();
  return t;
}

export { i18n };
