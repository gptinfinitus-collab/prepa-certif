import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { legalDocument, legalHead, legalInfo } from "@/lib/legal";

export const Route = createFileRoute("/cookies")({
  head: () => legalHead("cookies"),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPage doc={legalDocument("cookies")}>
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
    </LegalPage>
  );
}
