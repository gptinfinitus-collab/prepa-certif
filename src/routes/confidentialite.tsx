import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { legalDocument, legalHead, legalInfo } from "@/lib/legal";

export const Route = createFileRoute("/confidentialite")({
  head: () => legalHead("confidentialite"),
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  return (
    <LegalPage doc={legalDocument("confidentialite")}>
      <h2>1. Responsable de traitement</h2>
      <p>
        {legalInfo.publisher}, {legalInfo.publisherStatus}, est responsable du traitement des
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
    </LegalPage>
  );
}
