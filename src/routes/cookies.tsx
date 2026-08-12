import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { legalDocument, legalHead, legalInfo } from "@/lib/legal";
import { useLocale } from "@/i18n";

export const Route = createFileRoute("/cookies")({
  head: () => legalHead("cookies"),
  component: CookiesPage,
});

function CookiesPage() {
  const { locale } = useLocale();
  return <LegalPage doc={legalDocument("cookies")}>{locale === "en" ? <CookiesEn /> : <CookiesFr />}</LegalPage>;
}

function CookiesFr() {
  return (
    <>
      <h2>1. Principe</h2>
      <p>
        {legalInfo.appName} n'utilise aucun cookie publicitaire, aucun traceur tiers et aucun outil
        de mesure d'audience comportementale. Seuls des traceurs strictement nécessaires au
        fonctionnement du service sont déposés, ce qui ne requiert pas de bandeau de consentement.
      </p>

      <h2>2. Traceurs utilisés</h2>
      <ul>
        <li>
          <strong>Session d'authentification</strong> : conserve votre connexion entre deux visites.
          Durée : jusqu'à la déconnexion ou l'expiration du jeton.
        </li>
        <li>
          <strong>Préférence d'affichage</strong> : mémorise votre choix de thème clair ou sombre.
          Durée : jusqu'à effacement du stockage local du navigateur.
        </li>
      </ul>

      <h2>3. Gestion</h2>
      <p>
        Vous pouvez à tout moment effacer ces données via les paramètres de votre navigateur.
        La suppression du traceur de session entraîne une déconnexion du service.
      </p>

      <h2>4. Contact</h2>
      <p>
        Pour toute question :{" "}
        <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
      </p>
    </>
  );
}

function CookiesEn() {
  return (
    <>
      <h2>1. Principle</h2>
      <p>
        {legalInfo.appName} does not use any advertising cookies, third-party trackers, or
        behavioral audience measurement tools. Only trackers strictly necessary for the service to
        function are set, which does not require a consent banner.
      </p>

      <h2>2. Trackers used</h2>
      <ul>
        <li>
          <strong>Authentication session</strong>: keeps you signed in between visits. Duration:
          until sign-out or token expiry.
        </li>
        <li>
          <strong>Display preference</strong>: remembers your light or dark theme choice. Duration:
          until your browser's local storage is cleared.
        </li>
      </ul>

      <h2>3. Managing trackers</h2>
      <p>
        You can clear this data at any time via your browser settings. Deleting the session tracker
        will sign you out of the service.
      </p>

      <h2>4. Contact</h2>
      <p>
        For any question:{" "}
        <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
      </p>
    </>
  );
}
