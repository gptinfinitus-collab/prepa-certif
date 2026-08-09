import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { legalDocument, legalHead, legalInfo } from "@/lib/legal";

export const Route = createFileRoute("/mentions-legales")({
  head: () => legalHead("mentions-legales"),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  return (
    <LegalPage doc={legalDocument("mentions-legales")}>
      <h2>Éditeur du service</h2>
      <p>
        {legalInfo.publisher}, {legalInfo.publisherStatus}.<br />
        Contact : <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>
        <br />
        Site : <a href={legalInfo.siteUrl}>{legalInfo.siteUrl}</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>{legalInfo.publicationDirector}</p>

      <h2>Hébergement</h2>
      <p>
        {legalInfo.host}
        <br />
        {legalInfo.hostDetails}
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments de l'application (marque, logo, interface, contenus pédagogiques,
        code) est protégé par le droit de la propriété intellectuelle. Les normes ISO et leurs
        contenus restent la propriété de l'ISO et de ses organismes membres. {legalInfo.appName}{" "}
        n'est affilié à aucun organisme de normalisation ou de certification.
      </p>

      <h2>Signalement</h2>
      <p>
        Pour signaler un contenu illicite, une atteinte aux droits ou une faille de sécurité,
        écrivez à <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans la politique de confidentialité
        accessible depuis le bas de cette page.
      </p>
    </LegalPage>
  );
}
