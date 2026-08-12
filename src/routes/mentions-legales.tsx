import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { legalDocument, legalHead, legalInfo } from "@/lib/legal";
import { useLocale } from "@/i18n";

export const Route = createFileRoute("/mentions-legales")({
  head: () => legalHead("mentions-legales"),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  const { locale } = useLocale();
  return (
    <LegalPage doc={legalDocument("mentions-legales")}>
      {locale === "en" ? <MentionsLegalesEn /> : <MentionsLegalesFr />}
    </LegalPage>
  );
}

function MentionsLegalesFr() {
  return (
    <>
      <h2>Éditeur du service</h2>
      <p>
        {legalInfo.publisher}, {legalInfo.publisherStatus.fr}.<br />
        Contact : <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>
        <br />
        Site : <a href={legalInfo.siteUrl}>{legalInfo.siteUrl}</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>{legalInfo.publicationDirector.fr}</p>

      <h2>Hébergement</h2>
      <p>
        {legalInfo.host}
        <br />
        {legalInfo.hostDetails.fr}
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
    </>
  );
}

function MentionsLegalesEn() {
  return (
    <>
      <h2>Service publisher</h2>
      <p>
        {legalInfo.publisher}, {legalInfo.publisherStatus.en}.<br />
        Contact: <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>
        <br />
        Website: <a href={legalInfo.siteUrl}>{legalInfo.siteUrl}</a>
      </p>

      <h2>Publication director</h2>
      <p>{legalInfo.publicationDirector.en}</p>

      <h2>Hosting</h2>
      <p>
        {legalInfo.host}
        <br />
        {legalInfo.hostDetails.en}
      </p>

      <h2>Intellectual property</h2>
      <p>
        All elements of the application (brand, logo, interface, educational content, code) are
        protected by intellectual property law. ISO standards and their contents remain the
        property of ISO and its member bodies. {legalInfo.appName} is not affiliated with any
        standardization or certification body.
      </p>

      <h2>Reporting</h2>
      <p>
        To report unlawful content, a rights infringement, or a security vulnerability, write to{" "}
        <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>.
      </p>

      <h2>Personal data</h2>
      <p>
        The processing of personal data is described in the privacy policy accessible from the
        bottom of this page.
      </p>
    </>
  );
}
