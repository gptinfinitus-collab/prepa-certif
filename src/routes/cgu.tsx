import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { legalDocument, legalHead, legalInfo } from "@/lib/legal";

export const Route = createFileRoute("/cgu")({
  head: () => legalHead("cgu"),
  component: CguPage,
});

function CguPage() {
  return (
    <LegalPage doc={legalDocument("cgu")}>
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d'utilisation (CGU) encadrent l'accès et l'utilisation du
        service {legalInfo.appName}, une application d'aide à la préparation aux certifications et
        qualifications d'auditeur relatives aux normes ISO (9001, 14001, 27001, 45001, 22000, etc.).
      </p>
      <p>
        {legalInfo.appName} est un outil pédagogique indépendant. Il n'est ni affilié, ni approuvé,
        ni sponsorisé par l'ISO, par IRCA/CQI ou par un quelconque organisme de certification.
      </p>

      <h2>2. Compte utilisateur</h2>
      <p>
        L'accès aux fonctionnalités nécessite la création d'un compte via e-mail et mot de passe ou
        via un fournisseur d'identité (Google, Apple). L'utilisateur s'engage à fournir des
        informations exactes, à protéger ses identifiants et à signaler tout usage non autorisé de
        son compte.
      </p>

      <h2>3. Utilisation autorisée</h2>
      <ul>
        <li>Usage strictement personnel, à des fins de préparation et de formation.</li>
        <li>
          Interdiction de revendre, redistribuer ou rendre publics les contenus générés ou hébergés
          par le service.
        </li>
        <li>
          Interdiction de tentative d'accès non autorisé, de rétro-ingénierie ou de surcharge
          volontaire de l'infrastructure.
        </li>
      </ul>

      <h2>4. Contenus déposés par l'utilisateur</h2>
      <p>
        L'utilisateur peut importer des documents de cours et de référence afin d'alimenter
        l'assistant IA. Il garantit disposer des droits nécessaires sur ces documents et reste seul
        responsable de leur licéité. Ces documents restent sa propriété et sont utilisés uniquement
        pour lui fournir des réponses personnalisées.
      </p>

      <h2>5. Propriété intellectuelle</h2>
      <p>
        Les textes normatifs ISO demeurent la propriété de l'ISO et de ses organismes membres. Leur
        consultation dans le service suppose que l'utilisateur en détient une copie licite. Les
        éléments propres à {legalInfo.appName} (interface, contenus pédagogiques, code) sont
        protégés et ne peuvent être reproduits sans autorisation.
      </p>

      <h2>6. Assistant IA</h2>
      <p>
        Les réponses de l'assistant sont générées automatiquement et peuvent comporter des erreurs
        ou des approximations. Elles ne remplacent ni la lecture des normes officielles, ni une
        formation certifiante, ni un avis professionnel.
      </p>

      <h2>7. Limitation de responsabilité</h2>
      <p>
        {legalInfo.appName} est fourni « en l'état », sans garantie de résultat, notamment de
        réussite à un examen ou à une certification. La responsabilité de l'éditeur ne saurait être
        engagée pour les dommages indirects liés à l'utilisation du service.
      </p>

      <h2>8. Suspension et résiliation</h2>
      <p>
        L'utilisateur peut supprimer son compte à tout moment depuis les paramètres ou en écrivant à{" "}
        <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>. L'éditeur peut
        suspendre un compte en cas de manquement grave aux présentes CGU.
      </p>

      <h2>9. Modification des CGU</h2>
      <p>
        Les CGU peuvent évoluer. La version applicable est celle publiée sur cette page à la date
        d'utilisation du service.
      </p>

      <h2>10. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit français. À défaut de résolution amiable, les
        tribunaux compétents seront ceux du ressort du siège de l'éditeur.
      </p>
    </LegalPage>
  );
}
