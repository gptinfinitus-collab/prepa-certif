import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie, getRequestHeader } from "@tanstack/react-start/server";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  detectBrowserLocale,
  isLocale,
  readLocaleCookie,
  type Locale,
} from "./config";

/**
 * Langue résolue AVANT le premier rendu :
 * - côté serveur, depuis le cookie de langue ou l'en-tête Accept-Language ;
 * - côté client, depuis le cookie puis localStorage puis le navigateur.
 * Les deux côtés convergent donc sur la même valeur (pas de flash de français
 * ni de décalage d'hydratation).
 */
export const resolveInitialLocale = createIsomorphicFn()
  .server((): Locale => {
    try {
      const cookie = getCookie(LOCALE_COOKIE_KEY);
      if (isLocale(cookie)) return cookie;
      const header = getRequestHeader("accept-language") ?? "";
      for (const part of header.split(",")) {
        const short = part.trim().slice(0, 2).toLowerCase();
        if (isLocale(short)) return short;
      }
    } catch {
      // Hors contexte de requête (prerender) : repli sur la langue par défaut.
    }
    return DEFAULT_LOCALE;
  })
  .client((): Locale => {
    const cookie = readLocaleCookie();
    if (cookie) return cookie;
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
    return detectBrowserLocale();
  });
