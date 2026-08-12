import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { legalDocument, legalHead, legalInfo } from "@/lib/legal";
import { useLocale } from "@/i18n";

export const Route = createFileRoute("/confidentialite")({
  head: () => legalHead("confidentialite"),
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  const { locale } = useLocale();
  return (
    <LegalPage doc={legalDocument("confidentialite")}>
      {locale === "en" ? <ConfidentialiteEn /> : <ConfidentialiteFr />}
    </LegalPage>
  );
}

function ConfidentialiteFr() {
  return (
    <>
      <h2>1. Responsable de traitement</h2>
      <p>
        {legalInfo.publisher}, {legalInfo.publisherStatus.fr}, est responsable du traitement des
        données personnelles collectées via l'application. Contact :{" "}
        <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
      </p>

      <h2>2. Données collectées</h2>
      <ul>
        <li>
          <strong>Compte</strong> : adresse e-mail, identifiant du fournisseur d'identité (Google,
          Apple) le cas échéant, date de création.
        </li>
        <li>
          <strong>Profil</strong> : prénom, nom, photo de profil, certification active.
        </li>
        <li>
          <strong>Contenus</strong> : documents de cours et de référence importés, ainsi que les
          extraits indexés servant à l'assistant IA.
        </li>
        <li>
          <strong>Activité pédagogique</strong> : planning, progression, réponses et scores aux
          quiz, historique des conversations avec l'assistant.
        </li>
        <li>
          <strong>Préférences</strong> : thème clair/sombre.
        </li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>Fourniture du service et gestion du compte — exécution du contrat.</li>
        <li>
          Personnalisation du programme, des quiz et des réponses de l'assistant — exécution du
          contrat.
        </li>
        <li>Sécurité, prévention des abus et journalisation technique — intérêt légitime.</li>
        <li>Respect des obligations légales applicables — obligation légale.</li>
      </ul>
      <p>Aucune donnée n'est vendue, louée ou utilisée à des fins publicitaires.</p>

      <h2>4. Sous-traitants</h2>
      <ul>
        <li>Hébergement applicatif, base de données, authentification et stockage de fichiers.</li>
        <li>
          Fournisseur de modèles d'intelligence artificielle, pour générer les réponses de
          l'assistant et l'évaluation des réponses ouvertes.
        </li>
      </ul>
      <p>
        Ces prestataires agissent sur instruction de l'éditeur, dans le cadre d'accords de
        sous-traitance conformes au RGPD. Lorsqu'un transfert hors de l'Union européenne est
        nécessaire, il est encadré par les clauses contractuelles types de la Commission européenne.
      </p>

      <h2>5. Durées de conservation</h2>
      <ul>
        <li>Données de compte et de profil : jusqu'à la suppression du compte.</li>
        <li>
          Documents importés et index associés : jusqu'à leur suppression par l'utilisateur ou la
          suppression du compte.
        </li>
        <li>Historique des quiz et conversations : jusqu'à suppression par l'utilisateur.</li>
        <li>Journaux techniques : 12 mois maximum.</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de
        limitation, d'opposition et de portabilité, ainsi que du droit de définir des directives
        post-mortem. Vous pouvez les exercer à l'adresse{" "}
        <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>. Vous pouvez
        également introduire une réclamation auprès de la CNIL (www.cnil.fr).
      </p>

      <h2>7. Sécurité</h2>
      <p>
        Les accès sont protégés par authentification, chiffrement des échanges (HTTPS) et règles de
        sécurité au niveau de la base de données garantissant que chaque utilisateur n'accède qu'à
        ses propres données.
      </p>

      <h2>8. Mineurs</h2>
      <p>
        Le service s'adresse à un public professionnel majeur et n'est pas destiné aux personnes de
        moins de 16 ans.
      </p>
    </>
  );
}

function ConfidentialiteEn() {
  return (
    <>
      <h2>1. Data controller</h2>
      <p>
        {legalInfo.publisher}, {legalInfo.publisherStatus.en}, is the controller responsible for
        processing personal data collected through the application. Contact:{" "}
        <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
      </p>

      <h2>2. Data collected</h2>
      <ul>
        <li>
          <strong>Account</strong>: email address, identity provider ID (Google, Apple) where
          applicable, creation date.
        </li>
        <li>
          <strong>Profile</strong>: first name, last name, profile photo, active certification.
        </li>
        <li>
          <strong>Content</strong>: imported course and reference documents, as well as the indexed
          excerpts used by the AI assistant.
        </li>
        <li>
          <strong>Learning activity</strong>: schedule, progress, quiz answers and scores,
          conversation history with the assistant.
        </li>
        <li>
          <strong>Preferences</strong>: light/dark theme.
        </li>
      </ul>

      <h2>3. Purposes and legal bases</h2>
      <ul>
        <li>Provision of the service and account management — performance of the contract.</li>
        <li>Personalization of the program, quizzes, and assistant answers — performance of the contract.</li>
        <li>Security, abuse prevention, and technical logging — legitimate interest.</li>
        <li>Compliance with applicable legal obligations — legal obligation.</li>
      </ul>
      <p>No data is sold, rented, or used for advertising purposes.</p>

      <h2>4. Processors</h2>
      <ul>
        <li>Application hosting, database, authentication, and file storage.</li>
        <li>Artificial intelligence model provider, to generate the assistant's answers and evaluate open-ended answers.</li>
      </ul>
      <p>
        These providers act on the publisher's instructions, under data processing agreements
        compliant with the GDPR. Where a transfer outside the European Union is necessary, it is
        governed by the European Commission's standard contractual clauses.
      </p>

      <h2>5. Retention periods</h2>
      <ul>
        <li>Account and profile data: until the account is deleted.</li>
        <li>Imported documents and their associated indexes: until deleted by the user or until the account is deleted.</li>
        <li>Quiz and conversation history: until deleted by the user.</li>
        <li>Technical logs: 12 months maximum.</li>
      </ul>

      <h2>6. Your rights</h2>
      <p>
        In accordance with the GDPR, you have the right to access, rectify, erase, restrict, and
        object to processing, as well as the right to data portability and the right to define
        post-mortem directives. You may exercise these rights at{" "}
        <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>. You may also
        lodge a complaint with the CNIL, the French data protection authority (www.cnil.fr).
      </p>

      <h2>7. Security</h2>
      <p>
        Access is protected by authentication, encryption of exchanges (HTTPS), and database-level
        security rules ensuring that each user can only access their own data.
      </p>

      <h2>8. Minors</h2>
      <p>
        The service is intended for a professional adult audience and is not intended for persons
        under 16 years of age.
      </p>
    </>
  );
}
