/**
 * Contenu pédagogique générique et spécifique pour les référentiels autres
 * qu'ISO 45001 (dont le cursus est entièrement rédigé dans `program.json`).
 *
 * Le contenu générique est paramétré par la structure harmonisée (chapitres 4
 * à 10) : il s'adapte au sujet et au nom du système de management de la norme
 * active. Les surcharges par norme apportent les exemples sectoriels, les
 * points d'examen et les flashcards propres au référentiel.
 *
 * Toutes les formulations sont originales : aucune reproduction du texte
 * protégé des normes ISO.
 */

import type { Flashcard, LessonExtras } from "./lesson-extras";

/** Contexte transmis aux générateurs de contenu. */
export interface StandardContext {
  /** Code interne de la certification (`iso-9001`, `iso-27001`…). */
  code: string;
  /** Libellé affiché (« ISO 9001:2015 »). */
  label: string;
  /** Objet du management (« la qualité », « la sécurité de l'information »…). */
  subject: string;
  /** Nom du système de management (« SMQ », « SMSI »…). */
  systemName: string;
}

/** Numéro de chapitre HLS, ou `annexe` pour l'Annexe A d'ISO/IEC 27001. */
export type ClauseKey = "4" | "5" | "6" | "7" | "8" | "9" | "10" | "annexe";

/** Extrait le numéro de chapitre d'un intitulé du type « 6. Planification ». */
export function clauseKeyOf(clause: string): ClauseKey | null {
  const trimmed = clause.trim().toLowerCase();
  if (trimmed.startsWith("annexe")) return "annexe";
  const match = /^(\d+)/.exec(trimmed);
  const key = match?.[1];
  if (key && ["4", "5", "6", "7", "8", "9", "10"].includes(key)) return key as ClauseKey;
  return null;
}

/* ------------------------------------------------------ Contenu générique */

type Generator = (ctx: StandardContext) => LessonExtras;

const generic: Record<ClauseKey, Generator> = {
  "4": (c) => ({
    objectives: [
      `Identifier les enjeux internes et externes qui influencent ${c.subject}`,
      "Distinguer une partie intéressée d'une exigence de partie intéressée",
      `Justifier le domaine d'application du ${c.systemName}`,
      "Décrire les processus du système et leurs interactions",
    ],
    auditorView: [
      "L'auditeur vérifie que le contexte est réellement utilisé en aval : les enjeux nourrissent-ils l'analyse de risques et les objectifs ?",
      "Il examine la cohérence du domaine d'application : un site, une activité ou un processus exclu doit être justifié et sans impact sur la conformité.",
      "Il cherche la trace d'une mise à jour : un contexte figé depuis la certification initiale est un signal d'alerte.",
    ],
    evidence: [
      "Analyse de contexte (SWOT, PESTEL ou format libre) datée et révisée",
      "Cartographie des parties intéressées avec leurs besoins et attentes retenus",
      "Domaine d'application documenté, avec la justification des exclusions",
      "Cartographie des processus indiquant entrées, sorties et pilotes",
    ],
    examFocus: [
      "Le domaine d'application doit être une information documentée : ce n'est pas une exigence facultative.",
      "Toutes les attentes des parties intéressées ne deviennent pas des exigences : l'organisme choisit celles qu'il retient, et doit pouvoir l'expliquer.",
    ],
    commonMistakes: [
      "Confondre partie intéressée et client : le personnel, les autorités, les riverains et les fournisseurs en font aussi partie.",
      "Rédiger une analyse de contexte générique, recopiée d'un modèle, sans lien avec l'activité réelle.",
      "Exclure une activité du domaine d'application sans démontrer qu'elle n'affecte pas la conformité.",
    ],
    scenario: {
      prompt: `Lors d'un audit, l'organisme présente une analyse de contexte de deux pages, non datée, identique à celle de sa société sœur. Le domaine d'application exclut un atelier sous-traité qui réalise une étape déterminante pour ${c.subject}. Quels constats formulez-vous ?`,
      correction:
        "Deux pistes. D'abord la maîtrise du contexte : sans date ni éléments propres à l'organisme, rien ne démontre que l'analyse a été menée et tenue à jour ; il faut chercher d'autres preuves (revue de direction, comptes rendus) avant de conclure. Ensuite le domaine d'application : une activité externalisée déterminante ne peut pas être simplement exclue ; elle doit rester dans le périmètre et être maîtrisée au titre des processus externalisés. La seconde piste est la plus solide : l'exigence non satisfaite est claire et la preuve est le document de périmètre lui-même.",
    },
    keyPoints: [
      "Le chapitre 4 pose les fondations : tout ce qui suit doit y être cohérent.",
      "Contexte, parties intéressées et périmètre forment un enchaînement logique.",
      "Le domaine d'application est une information documentée obligatoire.",
      "Une exclusion se justifie, elle ne se décrète pas.",
    ],
    flashcards: [
      { front: "Que doit contenir le domaine d'application ?", back: "Les limites du système : sites, activités, produits et services couverts, ainsi que la justification de ce qui est exclu." },
      { front: "Une attente de partie intéressée est-elle toujours une exigence ?", back: "Non. L'organisme identifie les attentes puis décide lesquelles il retient comme exigences, et doit pouvoir justifier ce choix." },
      { front: "Que cherche l'auditeur au chapitre 4 ?", back: "La cohérence : les enjeux identifiés se retrouvent-ils dans les risques, les objectifs et les processus ?" },
    ],
  }),

  "5": (c) => ({
    objectives: [
      "Distinguer leadership et simple engagement formel",
      `Vérifier qu'une politique ${c.subject} satisfait les exigences de forme et de fond`,
      "Identifier comment les rôles et autorités sont attribués et connus",
      "Repérer les preuves d'intégration du système aux processus métier",
    ],
    auditorView: [
      "L'auditeur interroge la direction elle-même : sait-elle citer les objectifs, les résultats et les décisions prises ?",
      "Il vérifie que la politique est comprise par les opérationnels, pas seulement affichée dans le hall d'accueil.",
      "Il recherche l'allocation effective des ressources : budget, temps, personnes nommées.",
    ],
    evidence: [
      "Politique datée, signée par la direction et diffusée",
      "Organigramme et fiches de fonction mentionnant les responsabilités liées au système",
      "Comptes rendus de revue de direction montrant des décisions et des arbitrages",
      "Entretiens avec des opérationnels sur leur connaissance de la politique",
    ],
    examFocus: [
      "La norme n'exige pas un « représentant de la direction » nommé, mais bien que les rôles, responsabilités et autorités soient attribués et communiqués.",
      "La politique doit être disponible pour les parties intéressées pertinentes, ce qui n'implique pas nécessairement une publication au grand public.",
    ],
    commonMistakes: [
      "Croire que déléguer le système au responsable qualité suffit à démontrer le leadership.",
      "Auditer la politique uniquement sur sa forme, sans vérifier qu'elle est comprise et appliquée.",
      "Considérer qu'une politique très générale est toujours acceptable : elle doit être appropriée à la finalité et au contexte de l'organisme.",
    ],
    scenario: {
      prompt:
        "La politique est signée, affichée et présente les engagements attendus. Mais aucun des cinq opérationnels interrogés ne sait quels engagements elle contient, et la revue de direction se limite à valider un tableau d'indicateurs. Que concluez-vous ?",
      correction:
        "La politique satisfait les exigences de forme mais pas celles de communication et de compréhension : l'exigence de communication au sein de l'organisme n'est pas satisfaite, la preuve étant les entretiens concordants. Sur la revue de direction, valider des indicateurs sans décision documentée interroge l'engagement de la direction ; il faut examiner les éléments de sortie attendus avant de conclure. La non-conformité la mieux étayée porte sur la communication de la politique.",
    },
    keyPoints: [
      "Le leadership se démontre par des décisions, des ressources et des arbitrages, pas par une signature.",
      "La politique doit être appropriée, communiquée, comprise et tenue à jour.",
      "Les rôles et autorités doivent être attribués et connus des intéressés.",
      "L'intégration aux processus métier distingue un système vivant d'un système parallèle.",
    ],
    flashcards: [
      { front: "Comment démontrer le leadership en audit ?", back: "Par des preuves : ressources allouées, décisions en revue de direction, participation de la direction, arbitrages tracés." },
      { front: "La norme exige-t-elle un représentant de la direction ?", back: "Non, plus depuis la structure harmonisée. Elle exige que les rôles, responsabilités et autorités soient attribués et communiqués." },
      { front: "Quatre qualités attendues d'une politique ?", back: "Appropriée au contexte, cadre pour les objectifs, engagement d'amélioration continue, communiquée et tenue à jour." },
    ],
  }),

  "6": (c) => ({
    objectives: [
      `Structurer l'identification et le traitement des risques liés à ${c.subject}`,
      "Distinguer risque, opportunité et action à mettre en œuvre",
      "Rédiger des objectifs mesurables et vérifier leur planification",
      "Comprendre l'exigence de planification des modifications",
    ],
    auditorView: [
      "L'auditeur ne juge pas la méthode d'analyse de risques, mais sa cohérence et son application effective.",
      "Il suit un risque significatif de bout en bout : identifié, évalué, traité par une action, action réalisée et efficacité vérifiée.",
      "Il vérifie que chaque objectif a un responsable, une échéance, des ressources et une méthode d'évaluation.",
    ],
    evidence: [
      "Analyse des risques et opportunités avec méthode, critères et date de révision",
      "Plan d'actions associé, avec responsables et échéances",
      "Objectifs documentés, mesurables et suivis dans le temps",
      "Preuves d'évaluation de l'efficacité des actions engagées",
    ],
    examFocus: [
      "La norme n'impose aucune méthode formelle d'appréciation des risques : elle exige que les risques soient déterminés et traités.",
      "Un objectif doit être mesurable, surveillé, communiqué et mis à jour — l'absence d'un seul de ces éléments constitue un écart.",
    ],
    commonMistakes: [
      "Confondre l'objectif (le résultat visé) avec l'action (le moyen d'y parvenir).",
      "Produire une matrice de risques exhaustive jamais reliée à un plan d'actions.",
      "Oublier les opportunités, traitées comme un simple exercice de style.",
    ],
    scenario: {
      prompt: `L'organisme présente une cartographie de 120 risques cotés, mise à jour annuellement. Aucun plan d'actions n'y est rattaché ; les objectifs ${c.subject} de l'année sont « améliorer la performance » et « réduire les écarts ». Quels écarts relevez-vous ?`,
      correction:
        "Deux écarts distincts. Premier : les actions face aux risques ne sont pas planifiées ni intégrées aux processus, la preuve étant l'absence de tout plan d'actions relié à la cartographie. Second : les objectifs ne sont pas mesurables et ne permettent aucune évaluation, la preuve étant leur formulation. Ces deux constats ne se confondent pas : l'un porte sur le traitement des risques, l'autre sur les objectifs.",
    },
    keyPoints: [
      "Risques et opportunités doivent déboucher sur des actions proportionnées.",
      "L'efficacité des actions doit être évaluée, pas seulement leur réalisation.",
      "Un objectif se mesure, se suit, se communique et se met à jour.",
      "Les modifications du système se planifient : rien ne se change au fil de l'eau.",
    ],
    flashcards: [
      { front: "Objectif ou action ?", back: "L'objectif est le résultat visé et mesurable. L'action est le moyen déployé pour l'atteindre." },
      { front: "La norme impose-t-elle une méthode d'analyse de risques ?", back: "Non. Elle exige que les risques soient déterminés, traités et que l'efficacité des actions soit évaluée." },
      { front: "Que vérifier sur un objectif en audit ?", back: "Mesurable, surveillé, communiqué, mis à jour, avec responsable, échéance, ressources et méthode d'évaluation." },
    ],
  }),

  "7": (c) => ({
    objectives: [
      "Distinguer compétence, sensibilisation et formation",
      `Vérifier la maîtrise de l'information documentée du ${c.systemName}`,
      "Analyser un dispositif de communication interne et externe",
      "Identifier les ressources nécessaires au fonctionnement du système",
    ],
    auditorView: [
      "L'auditeur demande la preuve de la compétence, pas seulement l'attestation de présence à une formation.",
      "Il teste la sensibilisation par des questions ouvertes aux opérationnels, sans les mettre en difficulté.",
      "Il vérifie la maîtrise documentaire par des cas concrets : version en poste, document obsolète encore utilisé, accès aux enregistrements.",
    ],
    evidence: [
      "Matrice de compétences et plan de formation, avec évaluation de l'efficacité",
      "Habilitations et qualifications en cours de validité",
      "Plan de communication : quoi, quand, avec qui, comment, par qui",
      "Système de gestion documentaire : versions, approbations, diffusion, archivage",
    ],
    examFocus: [
      "La formation est un moyen parmi d'autres : l'expérience, le tutorat ou le recrutement peuvent aussi établir la compétence.",
      "Sensibilisation et compétence sont deux exigences distinctes, avec des preuves distinctes.",
    ],
    commonMistakes: [
      "Assimiler le plan de formation à la démonstration de la compétence.",
      "Négliger la communication externe, pourtant explicitement exigée.",
      "Considérer que la maîtrise documentaire se limite à un logiciel de gestion documentaire.",
    ],
    scenario: {
      prompt:
        "Un opérateur applique une instruction de travail imprimée, en indice B, alors que l'indice en vigueur est le D. L'organisme dispose pourtant d'une gestion électronique documentaire performante. Comment traitez-vous ce constat ?",
      correction:
        "L'outil n'est pas en cause : c'est la maîtrise de la diffusion et le retrait des documents périmés qui font défaut. Le constat s'énonce factuellement (instruction indice B en poste alors que l'indice D est en vigueur), l'exigence est la maîtrise de l'information documentée, la preuve est l'observation au poste complétée par l'extraction du référentiel. Reste à vérifier l'ampleur : un cas isolé oriente vers une non-conformité mineure, plusieurs postes concernés vers une défaillance systémique.",
    },
    keyPoints: [
      "Compétence = savoir démontré, pas heures de formation suivies.",
      "La sensibilisation porte sur le sens : pourquoi ce que je fais compte.",
      "La communication externe est une exigence à part entière.",
      "La maîtrise documentaire couvre création, mise à jour, diffusion et retrait.",
    ],
    flashcards: [
      { front: "Compétence ou sensibilisation ?", back: "La compétence est l'aptitude démontrée à réaliser une tâche. La sensibilisation est la conscience des enjeux et de sa contribution." },
      { front: "Comment prouver une compétence sans formation ?", back: "Par l'expérience, l'évaluation en situation, le tutorat, l'habilitation interne ou le diplôme initial." },
      { front: "Cinq questions du plan de communication ?", back: "Sur quels sujets, quand, avec qui, comment communiquer, et qui communique." },
    ],
  }),

  "8": (c) => ({
    objectives: [
      `Comprendre ce que recouvre la maîtrise opérationnelle pour ${c.subject}`,
      "Identifier les critères applicables à un processus et leur vérification",
      "Analyser la maîtrise des processus externalisés",
      "Vérifier la préparation aux situations d'urgence ou aux incidents",
    ],
    auditorView: [
      "Le chapitre 8 est le cœur du terrain : l'auditeur observe l'activité réelle, pas seulement la procédure.",
      "Il compare systématiquement ce qui est écrit, ce qui est dit et ce qui est fait.",
      "Il vérifie que l'externalisation transfère l'activité, jamais la responsabilité.",
    ],
    evidence: [
      "Procédures et instructions opérationnelles avec leurs critères",
      "Enregistrements de réalisation : contrôles, relevés, validations",
      "Contrats et cahiers des charges des prestataires, avec évaluation de leur performance",
      "Comptes rendus d'exercices ou de simulations, avec retour d'expérience",
    ],
    examFocus: [
      "Externaliser un processus n'exonère jamais l'organisme de sa responsabilité sur le résultat.",
      "L'exigence porte sur la maîtrise : la quantité de documentation est laissée à l'appréciation de l'organisme.",
    ],
    commonMistakes: [
      "Auditer le chapitre 8 en salle, sur documents, sans observation de terrain.",
      "Accepter un exercice d'urgence réalisé une fois puis jamais évalué.",
      "Considérer que la sélection d'un prestataire certifié suffit à démontrer sa maîtrise.",
    ],
    scenario: {
      prompt: `Un processus déterminant pour ${c.subject} est confié à un prestataire certifié. L'organisme présente le certificat du prestataire comme unique preuve de maîtrise, sans critères contractuels ni évaluation de performance. Qu'en pensez-vous ?`,
      correction:
        "Le certificat d'un tiers atteste de son système, pas de la maîtrise de la prestation rendue à cet organisme. L'exigence porte sur la définition des critères de maîtrise et sur l'évaluation du prestataire ; la preuve manquante est double : absence de critères contractuels et absence d'évaluation de performance. Le constat est recevable même si le prestataire donne satisfaction, car l'organisme ne peut pas le démontrer.",
    },
    keyPoints: [
      "Le chapitre 8 s'audite sur le terrain, au poste de travail.",
      "Critères, mise en œuvre et preuve de conformité forment un triptyque.",
      "L'externalisation se maîtrise contractuellement et se vérifie.",
      "La préparation aux situations d'urgence se teste et se met à jour.",
    ],
    flashcards: [
      { front: "Peut-on externaliser la responsabilité ?", back: "Non. On externalise une activité ; la responsabilité du résultat et de la conformité reste à l'organisme." },
      { front: "Comment maîtriser un processus externalisé ?", back: "Définir les critères, les contractualiser, vérifier la réalisation et évaluer la performance du prestataire." },
      { front: "Comment auditer efficacement le chapitre 8 ?", back: "Sur le terrain : observer l'activité, interroger l'opérateur, comparer avec la procédure et les enregistrements." },
    ],
  }),

  "9": (c) => ({
    objectives: [
      "Distinguer surveillance, mesure, analyse et évaluation",
      "Évaluer la pertinence d'un programme d'audit interne",
      "Vérifier la conformité aux exigences légales applicables",
      "Contrôler l'exhaustivité des éléments d'entrée et de sortie de la revue de direction",
    ],
    auditorView: [
      "L'auditeur vérifie que les indicateurs mesurent la performance du système, pas seulement l'activité.",
      "Il contrôle l'indépendance des auditeurs internes : personne n'audite son propre travail.",
      "Il s'assure que la revue de direction produit des décisions, avec des moyens et des échéances.",
    ],
    evidence: [
      "Tableaux de bord et indicateurs suivis dans la durée",
      "Programme d'audit interne fondé sur les risques, couvrant l'ensemble du périmètre sur un cycle",
      "Rapports d'audit interne avec constats et suivi des actions",
      "Compte rendu de revue de direction couvrant tous les éléments d'entrée requis",
    ],
    examFocus: [
      "Le programme d'audit interne doit couvrir tout le périmètre sur un cycle, pas nécessairement chaque année.",
      "La revue de direction a des éléments d'entrée ET des éléments de sortie exigés : l'omission d'un seul élément d'entrée est un écart.",
    ],
    commonMistakes: [
      "Confondre l'audit interne (évaluation du système) avec le contrôle produit ou l'inspection.",
      "Se contenter d'indicateurs d'activité (nombre de réunions tenues) au lieu d'indicateurs de performance.",
      "Réaliser une revue de direction sans décision ni allocation de moyens.",
    ],
    scenario: {
      prompt:
        "Le responsable qualité, également pilote du processus achats, a conduit l'audit interne du processus achats. Le rapport ne relève aucun constat. Par ailleurs, la revue de direction ne mentionne ni le retour des parties intéressées, ni l'évaluation de la conformité réglementaire. Que faites-vous ?",
      correction:
        "Deux constats indépendants. D'abord l'impartialité : un auditeur ne doit pas auditer son propre travail ; la preuve est le rapport signé par le pilote du processus audité. Ensuite la revue de direction : deux éléments d'entrée exigés sont absents, la preuve étant le compte rendu lui-même. L'absence de constat dans le rapport n'est pas en soi une non-conformité, mais elle renforce le premier constat.",
    },
    keyPoints: [
      "Mesurer sans analyser ni évaluer ne satisfait pas l'exigence.",
      "L'audit interne exige impartialité et objectivité des auditeurs.",
      "Le programme d'audit se construit sur les risques et l'importance des processus.",
      "La revue de direction se juge sur ses décisions, pas sur sa durée.",
    ],
    flashcards: [
      { front: "Qui peut réaliser un audit interne ?", back: "Toute personne compétente et impartiale vis-à-vis de l'activité auditée, interne ou externe à l'organisme." },
      { front: "Le programme d'audit interne doit-il tout couvrir chaque année ?", back: "Non : il doit couvrir l'ensemble du périmètre sur un cycle défini, en tenant compte des risques et des résultats antérieurs." },
      { front: "Que produit une revue de direction ?", back: "Des décisions et des actions : opportunités d'amélioration, besoins de changement du système, besoins en ressources." },
    ],
  }),

  "10": (c) => ({
    objectives: [
      "Distinguer correction, action corrective et amélioration",
      "Analyser la cause d'une non-conformité avec une méthode structurée",
      "Vérifier l'évaluation de l'efficacité d'une action corrective",
      `Repérer les démarches d'amélioration continue du ${c.systemName}`,
    ],
    auditorView: [
      "L'auditeur suit une non-conformité de son enregistrement à la clôture de l'action corrective.",
      "Il vérifie que la cause racine a été recherchée, et non le premier facteur venu.",
      "Il contrôle que la question « le problème peut-il se reproduire ailleurs ? » a été posée.",
    ],
    evidence: [
      "Registre des non-conformités et des réclamations",
      "Analyses de causes documentées (5 pourquoi, arbre des causes, Ishikawa)",
      "Plans d'actions correctives avec responsables, échéances et statut",
      "Preuves d'évaluation de l'efficacité après mise en œuvre",
    ],
    examFocus: [
      "La correction traite l'effet, l'action corrective traite la cause : les deux peuvent être nécessaires.",
      "L'action préventive n'existe plus en tant que telle : la prévention est portée par l'approche par les risques du chapitre 6.",
    ],
    commonMistakes: [
      "Clore une non-conformité dès la correction réalisée, sans analyse de cause.",
      "Retenir « erreur humaine » ou « manque de rigueur » comme cause racine.",
      "Ne jamais vérifier l'efficacité des actions engagées.",
    ],
    scenario: {
      prompt:
        "Une non-conformité identique est enregistrée trois fois en dix-huit mois. À chaque fois, l'action est « rappel des consignes au personnel » et la fiche est close le jour même. Comment formulez-vous le constat ?",
      correction:
        "La récurrence démontre que la cause n'a pas été éliminée : l'organisme a réalisé une correction, pas une action corrective. Le constat s'énonce ainsi : trois occurrences du même écart en dix-huit mois, l'exigence est l'analyse de la cause et l'élimination de celle-ci pour éviter la réapparition, la preuve est le registre des non-conformités et les trois fiches identiques. La récurrence d'un même écart oriente vers une non-conformité majeure car elle traduit une défaillance du processus d'amélioration.",
    },
    keyPoints: [
      "Correction ≠ action corrective : l'une répare, l'autre supprime la cause.",
      "La récurrence d'un écart interroge directement le chapitre 10.",
      "L'efficacité d'une action corrective doit être vérifiée après coup.",
      "L'amélioration continue s'appuie sur les résultats du chapitre 9.",
    ],
    flashcards: [
      { front: "Correction ou action corrective ?", back: "La correction élimine la non-conformité constatée. L'action corrective élimine sa cause pour éviter la réapparition." },
      { front: "L'action préventive existe-t-elle encore ?", back: "Non, plus en tant qu'exigence distincte : la prévention est assurée par l'approche par les risques du chapitre 6." },
      { front: "Pourquoi la récurrence est-elle grave ?", back: "Elle prouve que la cause n'a pas été traitée et met en cause l'efficacité du système d'amélioration lui-même." },
    ],
  }),

  annexe: () => ({
    objectives: [
      "Comprendre le rôle de l'Annexe A par rapport au traitement des risques",
      "Savoir lire une Déclaration d'applicabilité (SoA)",
      "Identifier les quatre familles de mesures et leur logique",
      "Vérifier la justification des exclusions",
    ],
    auditorView: [
      "L'auditeur compare le plan de traitement des risques et la Déclaration d'applicabilité : toute divergence doit s'expliquer.",
      "Il choisit quelques mesures déclarées applicables et en vérifie la mise en œuvre effective sur le terrain.",
      "Il examine la justification des exclusions : « non applicable » sans motif n'est pas recevable.",
    ],
    evidence: [
      "Déclaration d'applicabilité complète, avec statut et justification pour chaque mesure",
      "Plan de traitement des risques relié aux mesures retenues",
      "Preuves de mise en œuvre des mesures déclarées applicables",
      "Approbation du plan de traitement par les propriétaires de risques",
    ],
    examFocus: [
      "L'Annexe A est un référentiel de comparaison, pas une liste de mesures obligatoires à appliquer intégralement.",
      "La Déclaration d'applicabilité est une information documentée obligatoire : son absence est une non-conformité majeure.",
    ],
    commonMistakes: [
      "Croire que toutes les mesures de l'Annexe A doivent être mises en œuvre.",
      "Produire une SoA déconnectée de l'appréciation des risques.",
      "Déclarer une mesure applicable sans jamais en vérifier la mise en œuvre.",
    ],
    scenario: {
      prompt:
        "La Déclaration d'applicabilité déclare 91 mesures applicables sur 93, avec pour justification unique « bonne pratique ». Le plan de traitement des risques n'identifie que 12 mesures. Que constatez-vous ?",
      correction:
        "La SoA n'est pas cohérente avec l'appréciation et le traitement des risques : elle doit découler du plan de traitement, comparé à l'Annexe A. Une justification unique et générique ne démontre pas la démarche. Le constat porte sur l'absence de lien démontré entre le traitement des risques et la Déclaration d'applicabilité, la preuve étant la comparaison des deux documents. Par ailleurs, déclarer 91 mesures applicables engage l'organisme : chacune devra pouvoir être auditée.",
    },
    keyPoints: [
      "La SoA découle du traitement des risques, jamais l'inverse.",
      "Chaque mesure a un statut et une justification.",
      "Déclarer applicable, c'est s'engager à démontrer la mise en œuvre.",
      "L'Annexe A sert de garde-fou contre les oublis, pas de check-list imposée.",
    ],
    flashcards: [
      { front: "À quoi sert l'Annexe A ?", back: "De référentiel de comparaison pour vérifier qu'aucune mesure pertinente n'a été omise lors du traitement des risques." },
      { front: "Qu'est-ce que la Déclaration d'applicabilité ?", back: "Un document obligatoire listant les mesures retenues ou exclues, avec justification et état de mise en œuvre." },
      { front: "Toutes les mesures de l'Annexe A sont-elles obligatoires ?", back: "Non. Seules celles retenues à l'issue du traitement des risques le sont ; les exclusions doivent être justifiées." },
    ],
  }),
};

/* -------------------------------------------------- Surcharges par norme */

type Overrides = Partial<Record<ClauseKey, LessonExtras>>;

const ex = (sector: string, text: string) => ({ sector, text });
const fc = (front: string, back: string): Flashcard => ({ front, back });

const overrides: Record<string, Overrides> = {
  "iso-9001": {
    "4": {
      examples: [
        ex("Services", "Un cabinet de conseil identifie la pénurie de consultants seniors comme enjeu interne majeur : cet enjeu se retrouve dans ses risques et son plan de recrutement."),
        ex("Industrie", "Un fabricant exclut son activité de négoce du périmètre alors qu'elle représente 30 % du chiffre d'affaires client : l'exclusion fragilise la crédibilité du certificat."),
      ],
    },
    "8": {
      examples: [
        ex("Industrie", "La revue des exigences client est faite oralement au téléphone, sans trace : impossible de démontrer que la commande a été revue avant acceptation."),
        ex("Services", "Une société de maintenance libère ses interventions sans validation du chef d'équipe alors que la procédure l'exige : la libération n'est pas maîtrisée."),
      ],
      examFocus: [
        "La conception et le développement (8.3) peuvent être exclus si l'organisme ne conçoit rien — l'exclusion doit être justifiée.",
        "La propriété du client couvre aussi les données personnelles et la propriété intellectuelle confiées, pas seulement les biens physiques.",
      ],
      flashcards: [
        fc("Que couvre la propriété du client ?", "Tout bien confié : matières, outillages, locaux, mais aussi données, informations et propriété intellectuelle."),
        fc("Quand peut-on exclure le chapitre 8.3 ?", "Lorsque l'organisme ne réalise aucune activité de conception et développement, avec justification documentée."),
      ],
    },
    "9": {
      examples: [
        ex("Distribution", "Une enseigne mesure la satisfaction client uniquement par le nombre de réclamations reçues : elle mesure l'insatisfaction exprimée, pas la perception réelle."),
        ex("Industrie", "Un industriel croise enquêtes clients, taux de service et retours SAV : il évalue réellement la perception du client."),
      ],
      examFocus: [
        "La surveillance de la satisfaction du client (9.1.2) est une exigence explicite d'ISO 9001, distincte de la mesure des produits.",
      ],
      flashcards: [
        fc("Réclamations = satisfaction client ?", "Non. Les réclamations sont une source parmi d'autres ; la norme demande de surveiller la perception du client."),
      ],
    },
  },

  "iso-14001": {
    "6": {
      examples: [
        ex("Industrie", "Une fonderie retient la consommation d'eau comme aspect significatif après avoir défini des critères de cotation clairs et traçables."),
        ex("Logistique", "Un transporteur oublie les aspects en situation d'urgence (déversement accidentel) et ne cote que les situations normales."),
      ],
      examFocus: [
        "Les aspects environnementaux doivent être identifiés en conditions normales, anormales et en situation d'urgence, y compris raisonnablement prévisibles.",
        "Les obligations de conformité recouvrent les exigences légales et les autres exigences auxquelles l'organisme souscrit volontairement.",
      ],
      commonMistakes: [
        "Confondre l'aspect (ce que fait l'organisme) et l'impact (la modification de l'environnement qui en résulte).",
        "Limiter les aspects aux rejets visibles, en oubliant les consommations de ressources.",
      ],
      flashcards: [
        fc("Aspect ou impact ?", "L'aspect est l'élément de l'activité qui interagit avec l'environnement ; l'impact est la modification de l'environnement qui en résulte."),
        fc("Dans quelles conditions identifier les aspects ?", "Conditions normales, anormales, de démarrage et d'arrêt, et situations d'urgence raisonnablement prévisibles."),
      ],
    },
    "8": {
      examples: [
        ex("Industrie", "Un fabricant transmet ses exigences environnementales à ses fournisseurs d'emballage : la perspective de cycle de vie est appliquée en amont."),
        ex("BTP", "Une entreprise de travaux ne prévoit aucune consigne en cas de déversement d'hydrocarbures sur chantier : la réponse aux situations d'urgence est défaillante."),
      ],
      examFocus: [
        "La perspective de cycle de vie n'impose pas une analyse de cycle de vie complète : elle impose de considérer les étapes amont et aval sur lesquelles l'organisme a une influence.",
      ],
      flashcards: [
        fc("Perspective de cycle de vie : faut-il une ACV ?", "Non. Il faut prendre en compte les étapes du cycle de vie sur lesquelles l'organisme peut avoir une influence, sans analyse quantifiée obligatoire."),
      ],
    },
    "9": {
      examples: [
        ex("Industrie", "L'évaluation de conformité réglementaire est réalisée annuellement, arrêté par arrêté, avec conclusion tracée : l'exigence est satisfaite."),
        ex("Services", "Une veille réglementaire est abonnée mais jamais exploitée : la veille n'est pas une évaluation de conformité."),
      ],
      examFocus: [
        "L'évaluation de la conformité aux obligations de conformité est une exigence explicite et doit conclure, pas seulement lister les textes.",
      ],
    },
  },

  "iso-27001": {
    "6": {
      examples: [
        ex("Numérique", "Un éditeur SaaS identifie ses risques par actif, nomme un propriétaire de risque pour chacun et fait approuver le plan de traitement : la démarche est complète."),
        ex("Santé", "Un établissement cote ses risques sans jamais désigner de propriétaire : personne ne peut approuver l'acceptation du risque résiduel."),
      ],
      examFocus: [
        "Exception à la règle générale : ISO/IEC 27001 impose bien un processus d'appréciation du risque défini et documenté (§6.1.2), avec des critères d'acceptation et des critères de réalisation de l'appréciation. Le « la norme n'impose aucune méthode » valable pour ISO 9001 ou ISO 45001 ne s'applique pas ici.",
        "La Déclaration d'applicabilité (SoA) est un document exigé : elle liste les mesures nécessaires, leur justification, leur statut de mise en œuvre et la justification des exclusions par rapport à l'Annexe A.",
        "Le propriétaire du risque doit approuver le plan de traitement et accepter les risques résiduels : c'est une exigence explicite.",
        "L'appréciation des risques doit être reproductible : les critères doivent produire des résultats cohérents et comparables.",
      ],

      commonMistakes: [
        "Faire porter tous les risques par le RSSI, qui n'a pas l'autorité pour accepter un risque métier.",
        "Changer de méthode d'appréciation chaque année, rendant les résultats incomparables.",
      ],
      flashcards: [
        fc("Qui accepte un risque résiduel ?", "Le propriétaire du risque, qui doit disposer de l'autorité et de la responsabilité correspondantes."),
        fc("Que signifie « appréciation reproductible » ?", "Appliquée deux fois dans les mêmes conditions, la méthode donne des résultats cohérents et comparables."),
      ],
    },
    "8": {
      examples: [
        ex("Numérique", "Le plan de traitement des risques est révisé à chaque évolution majeure de l'architecture : la maîtrise opérationnelle suit le système réel."),
        ex("Industrie", "Un changement d'hébergeur est réalisé sans nouvelle appréciation des risques : la planification des modifications n'est pas maîtrisée."),
      ],
    },
    "9": {
      examples: [
        ex("Numérique", "Le tableau de bord suit le délai de correction des vulnérabilités critiques, pas seulement leur nombre : l'indicateur mesure la performance."),
        ex("Finance", "Le nombre d'incidents déclarés baisse fortement sans explication : l'auditeur cherche si c'est la détection ou la déclaration qui a régressé."),
      ],
    },
  },

  "iso-22000": {
    "8": {
      examples: [
        ex("Agroalimentaire", "Une conserverie définit une limite critique de température validée scientifiquement, surveillée en continu avec enregistrement automatique : le CCP est maîtrisé."),
        ex("Restauration collective", "Un CCP est identifié mais sa limite critique est « température correcte » : la limite n'est pas mesurable, donc inexploitable."),
      ],
      examFocus: [
        "Une limite critique doit être mesurable et validée : une appréciation qualitative n'est pas recevable à un CCP.",
        "PRP, PRP opérationnel et CCP ont des logiques de maîtrise et de surveillance différentes : la confusion est très pénalisée à l'examen.",
        "Les programmes prérequis (§8.2) et l'analyse des dangers (§8.5) supposent des étapes préalables exigées : constitution de l'équipe sécurité des denrées alimentaires, description des produits et des processus, diagramme des flux vérifié sur site.",
        "La validation (§8.5.3) prouve avant mise en œuvre que la mesure de maîtrise est capable ; la vérification (§8.8) confirme après coup que le dispositif fonctionne ; la surveillance suit la maîtrise en temps réel.",
        "La maîtrise des non-conformités de produit relève du §8.9 : corrections, actions correctives, traitement des produits potentiellement dangereux, retrait et rappel.",
      ],

      commonMistakes: [
        "Déclarer CCP toute étape sensible, ce qui rend le plan HACCP ingérable.",
        "Confondre la surveillance (à chaque lot, en continu) et la vérification (périodique, sur l'efficacité du dispositif).",
      ],
      flashcards: [
        fc("PRP, PRPo ou CCP ?", "Le PRP crée l'environnement hygiénique de base. Le PRPo maîtrise un danger significatif sans limite critique mesurable. Le CCP a une limite critique mesurable et une surveillance systématique."),
        fc("Surveillance ou vérification ?", "La surveillance suit en temps réel la maîtrise du danger. La vérification confirme périodiquement que le dispositif fonctionne."),
      ],
    },
    "10": {
      examples: [
        ex("Agroalimentaire", "Un retrait est déclenché en moins de quatre heures grâce à une traçabilité testée deux fois par an : le dispositif est démontré."),
        ex("Agroalimentaire", "La procédure de rappel existe mais n'a jamais été testée : rien ne démontre qu'elle fonctionnerait."),
      ],
      examFocus: [
        "Le dispositif de retrait et de rappel doit être testé, et le test doit être enregistré.",
      ],
    },
  },

  "iso-50001": {
    "6": {
      examples: [
        ex("Industrie", "Une usine identifie trois usages énergétiques significatifs représentant 78 % de sa consommation et concentre ses actions sur eux."),
        ex("Tertiaire", "Un gestionnaire immobilier définit des IPÉ sans situation énergétique de référence : aucune amélioration ne peut être démontrée."),
      ],
      examFocus: [
        "Sans situation énergétique de référence (SER), aucune amélioration de la performance énergétique n'est démontrable.",
        "Les IPÉ doivent être corrigés des variables pertinentes (production, degrés-jours) pour rester comparables.",
      ],
      commonMistakes: [
        "Confondre consommation d'énergie et performance énergétique : une baisse de production fait baisser la consommation sans progrès.",
        "Retenir tous les usages comme significatifs, ce qui dilue les moyens.",
      ],
      flashcards: [
        fc("Qu'est-ce qu'un UES ?", "Un usage énergétique significatif : usage représentant une part importante de la consommation ou offrant un fort potentiel d'amélioration."),
        fc("Pourquoi une SER est-elle indispensable ?", "Parce que la performance énergétique se démontre par comparaison avec une référence quantifiée et documentée."),
      ],
    },
    "9": {
      examples: [
        ex("Industrie", "Les IPÉ sont corrigés du volume produit : la performance réelle apparaît malgré les variations d'activité."),
        ex("Tertiaire", "La consommation est comparée d'une année sur l'autre sans correction climatique : la conclusion est faussée."),
      ],
    },
  },

  "iso-13485": {
    "4": {
      examFocus: [
        "ISO 13485:2016 ne suit pas la structure harmonisée en 10 chapitres : elle conserve la structure en 8 chapitres (4 Système de management de la qualité, 5 Responsabilité de la direction, 6 Management des ressources, 7 Réalisation du produit, 8 Mesure, analyse et amélioration).",
        "Le chapitre 4 exige un manuel qualité et un dossier du dispositif médical par type ou famille de dispositifs : deux documents que les autres normes n'imposent pas.",
      ],
      flashcards: [
        fc("Quelle est la structure d'ISO 13485:2016 ?", "Huit chapitres, dont 4 à 8 sont normatifs : système de management de la qualité, responsabilité de la direction, management des ressources, réalisation du produit, mesure, analyse et amélioration."),
      ],
    },
    "5": {
      examFocus: [
        "Le chapitre 5 s'intitule « Responsabilité de la direction », pas « Leadership » : ISO 13485 maintient l'exigence d'un représentant de la direction nommé (§5.5.2), supprimée dans les normes à structure harmonisée.",
        "La politique et les objectifs qualité doivent intégrer explicitement les exigences réglementaires applicables au dispositif et aux marchés visés.",
      ],
      flashcards: [
        fc("ISO 13485 exige-t-elle un représentant de la direction ?", "Oui : le §5.5.2 impose de nommer un membre de la direction chargé du système qualité et du reporting à la direction, contrairement à ISO 9001:2015."),
      ],
    },
    "6": {
      examFocus: [
        "Le chapitre 6 d'ISO 13485 est « Management des ressources » : il ne contient pas d'exigence « risques et opportunités » au sens de la structure harmonisée. La gestion des risques produit relève du §7.1 et d'ISO 14971.",
        "La maîtrise de la contamination et l'environnement de travail (§6.4) sont des exigences propres aux dispositifs stériles ou sensibles.",
      ],
    },
    "7": {
      examples: [
        ex("Dispositifs médicaux", "Le dossier du dispositif regroupe spécifications, résultats de vérification et de validation, et l'historique des modifications : la traçabilité est démontrée."),
        ex("Dispositifs médicaux", "Une modification de fournisseur de composant stérile est réalisée sans revalidation : la maîtrise des modifications est défaillante."),
      ],
      examFocus: [
        "Vérification et validation sont deux étapes distinctes : la vérification confirme la conformité aux spécifications, la validation confirme l'aptitude à l'usage prévu.",
        "La gestion des risques (ISO 14971) est exigée tout au long de la réalisation du produit, au §7.1.",
      ],
      flashcards: [
        fc("Vérification ou validation ?", "La vérification prouve que le produit est conforme aux spécifications. La validation prouve qu'il répond à l'usage prévu par l'utilisateur."),
        fc("Qu'est-ce que le dossier du dispositif médical ?", "L'ensemble des documents démontrant la conformité du dispositif aux exigences applicables tout au long de son cycle de vie."),
      ],
    },
    "8": {
      examples: [
        ex("Dispositifs médicaux", "Les réclamations sont analysées sous 48 h et évaluées au regard des obligations de vigilance : l'exigence réglementaire est intégrée."),
        ex("Dispositifs médicaux", "Une réclamation grave est traitée comme une réclamation ordinaire, sans évaluation de la nécessité de notifier l'autorité compétente."),
      ],
      examFocus: [
        "ISO 13485 privilégie l'efficacité documentée et la conformité réglementaire ; l'amélioration continue y est moins centrale que dans ISO 9001.",
        "Le chapitre 8 conserve les actions préventives (§8.5.3), disparues des normes à structure harmonisée.",
      ],
    },
  },


  "iso-22301": {
    "8": {
      examples: [
        ex("Finance", "Le BIA fixe un RTO de 4 h pour le service de paiement ; l'exercice annuel démontre une reprise en 3 h 20 : la capacité est prouvée."),
        ex("Services", "Les plans de continuité existent mais aucun exercice n'a été réalisé depuis trois ans : la capacité de continuité n'est pas démontrée."),
      ],
      examFocus: [
        "Le BIA détermine les priorités et les délais de reprise ; l'appréciation des risques détermine les scénarios de rupture. Les deux sont exigés.",
        "Un plan de continuité non exercé ne démontre aucune capacité : le programme d'exercices est une exigence explicite.",
      ],
      commonMistakes: [
        "Fixer un RTO plus court que le délai réellement atteignable, sans jamais le tester.",
        "Confondre RTO (délai de reprise) et RPO (perte de données admissible).",
      ],
      flashcards: [
        fc("RTO ou RPO ?", "Le RTO est le délai maximal admissible avant reprise d'une activité. Le RPO est la perte de données maximale admissible, exprimée en durée."),
        fc("À quoi sert le BIA ?", "À déterminer les activités prioritaires, leurs délais de reprise et les ressources nécessaires en cas d'interruption."),
      ],
    },
  },

  "iso-37001": {
    "5": {
      examples: [
        ex("BTP", "La fonction de conformité rapporte directement au conseil d'administration et dispose d'un budget propre : l'indépendance est démontrée."),
        ex("Industrie", "La fonction de conformité est confiée au directeur commercial : son indépendance vis-à-vis des activités exposées n'est pas assurée."),
      ],
      examFocus: [
        "La fonction de conformité anti-corruption doit être indépendante, dotée de ressources et avoir un accès direct à l'organe de gouvernance.",
      ],
      flashcards: [
        fc("Quelles conditions pour la fonction de conformité ?", "Indépendance vis-à-vis des activités exposées, ressources suffisantes, compétence, et accès direct à l'organe de gouvernance."),
      ],
    },
    "8": {
      examples: [
        ex("Négoce international", "Chaque intermédiaire commercial fait l'objet d'une diligence raisonnable proportionnée au risque, renouvelée périodiquement."),
        ex("Services", "Un registre des cadeaux existe mais n'est jamais contrôlé ni relié à un seuil : le contrôle est théorique."),
      ],
      examFocus: [
        "La diligence raisonnable doit être proportionnée au risque et renouvelée : une vérification unique à l'entrée en relation ne suffit pas.",
        "La protection des lanceurs d'alerte est une exigence à part entière, distincte du dispositif de signalement.",
      ],
      commonMistakes: [
        "Appliquer le même niveau de diligence à tous les tiers, indépendamment du risque.",
        "Considérer qu'une charte éthique signée constitue un contrôle anti-corruption.",
      ],
      flashcards: [
        fc("Qu'est-ce que la diligence raisonnable ?", "Une évaluation approfondie et proportionnée du risque de corruption lié à un tiers, un projet ou un poste exposé, renouvelée périodiquement."),
        fc("Signalement et protection : même exigence ?", "Non. La norme exige un dispositif de signalement ET des mesures protégeant les personnes qui signalent de bonne foi."),
      ],
    },
  },
};

/* ------------------------------------------------------------ Assemblage */

function merge(base: LessonExtras, extra: LessonExtras | undefined): LessonExtras {
  if (!extra) return base;
  const merged: LessonExtras = { ...base };
  const objectives = extra.objectives ?? base.objectives;
  if (objectives) merged.objectives = objectives;
  const keyPoints = extra.keyPoints ?? base.keyPoints;
  if (keyPoints) merged.keyPoints = keyPoints;
  const scenario = extra.scenario ?? base.scenario;
  if (scenario) merged.scenario = scenario;

  const examples = [...(base.examples ?? []), ...(extra.examples ?? [])];
  if (examples.length) merged.examples = examples;
  const auditorView = [...(base.auditorView ?? []), ...(extra.auditorView ?? [])];
  if (auditorView.length) merged.auditorView = auditorView;
  const evidence = [...(base.evidence ?? []), ...(extra.evidence ?? [])];
  if (evidence.length) merged.evidence = evidence;
  const examFocus = [...(base.examFocus ?? []), ...(extra.examFocus ?? [])];
  if (examFocus.length) merged.examFocus = examFocus;
  const commonMistakes = [...(base.commonMistakes ?? []), ...(extra.commonMistakes ?? [])];
  if (commonMistakes.length) merged.commonMistakes = commonMistakes;
  const flashcards = [...(base.flashcards ?? []), ...(extra.flashcards ?? [])];
  if (flashcards.length) merged.flashcards = flashcards;

  return merged;
}


/**
 * Contenu pédagogique d'un chapitre d'une norme : trame générique de la
 * structure harmonisée enrichie des spécificités du référentiel.
 */
export function getClauseExtras(ctx: StandardContext, clause: string): LessonExtras {
  const key = clauseKeyOf(clause);
  if (!key) return {};
  const base = generic[key](ctx);
  return merge(base, overrides[ctx.code]?.[key]);
}

/** Contenu pédagogique des séances de méthodologie d'audit, commun à toutes les normes. */
export const methodologyExtras: LessonExtras[] = [
  {
    objectives: [
      "Énoncer les principes de l'audit et leurs conséquences pratiques",
      "Employer le vocabulaire exact attendu à l'examen",
      "Distinguer audit de première, deuxième et tierce partie",
      "Situer le rôle de l'auditeur par rapport à celui du consultant",
    ],
    examples: [
      ex("Audit interne", "Un auditeur interne suggère la solution à mettre en place : il sort de son rôle et compromet son impartialité pour les audits suivants."),
      ex("Audit de certification", "Un auditeur tierce partie constate un écart, l'énonce factuellement et laisse l'organisme choisir son action corrective : le rôle est tenu."),
    ],
    auditorView: [
      "Chaque principe a une traduction concrète : l'approche fondée sur les preuves interdit de conclure sur une impression.",
      "L'indépendance ne signifie pas l'hostilité : elle signifie l'absence de conflit d'intérêts et de parti pris.",
    ],
    evidence: [
      "Lettre de mission ou programme d'audit précisant périmètre et critères",
      "Déclaration d'absence de conflit d'intérêts de l'équipe d'audit",
      "Notes d'audit factuelles, horodatées, mentionnant les sources",
    ],
    examFocus: [
      "Critères d'audit et preuves d'audit sont deux notions distinctes : les critères sont la référence, les preuves sont ce qui est observé.",
      "L'auditeur constate et conclut ; il ne prescrit pas la solution.",
    ],
    commonMistakes: [
      "Conclure à une non-conformité sur la base d'un ressenti ou d'une déclaration non vérifiée.",
      "Basculer dans le conseil en proposant la solution à l'audité.",
      "Employer « non-conformité » pour désigner une simple opportunité d'amélioration.",
    ],
    scenario: {
      prompt:
        "Un audité vous dit : « De toute façon, la procédure n'est jamais appliquée ici. » Vous n'avez encore observé aucun poste. Que faites-vous de cette déclaration ?",
      correction:
        "Une déclaration est une piste, pas une preuve. Il faut la vérifier : demander à observer plusieurs postes concernés, consulter les enregistrements et croiser les sources. Si l'observation confirme l'écart, le constat s'appuie sur les faits observés et les enregistrements, pas sur la phrase de l'audité. Si rien ne le confirme, aucun constat ne peut être formulé, même si la déclaration semblait crédible.",
    },
    keyPoints: [
      "Sept principes d'audit (ISO 19011:2026) : intégrité, présentation impartiale, conscience professionnelle, confidentialité, indépendance, approche fondée sur des preuves, approche par les risques.",
      "Un constat sans preuve vérifiable n'est pas un constat.",
      "L'auditeur évalue, il ne conseille pas.",
      "Le vocabulaire exact est très fortement évalué à l'examen.",
    ],
    flashcards: [
      fc("Critères d'audit ?", "L'ensemble des exigences servant de référence : norme, politique, procédures, exigences légales et contractuelles."),
      fc("Preuve d'audit ?", "Enregistrements, énoncés de faits ou autres informations vérifiables et pertinents au regard des critères d'audit."),
      fc("Audit de deuxième partie ?", "Audit réalisé par une partie ayant un intérêt dans l'organisme audité, typiquement un client chez son fournisseur."),
      fc("L'auditeur peut-il proposer une solution ?", "Non. Il constate et conclut ; proposer la solution relèverait du conseil et compromettrait son impartialité."),
    ],
  },
  {
    objectives: [
      "Construire un plan d'audit exploitable et réaliste",
      "Préparer un échantillonnage défendable",
      "Conduire un entretien d'audit avec des questions ouvertes",
      "Tenir une réunion d'ouverture et de clôture",
    ],
    examples: [
      ex("Industrie", "L'auditeur consacre la première demi-journée au terrain plutôt qu'aux documents : il collecte des faits avant d'écouter les explications."),
      ex("Services", "Un plan d'audit annonce huit processus en une journée : le plan n'est pas tenable et l'échantillonnage devient superficiel."),
    ],
    auditorView: [
      "Le plan d'audit engage l'auditeur : s'en écarter sans accord de l'audité fragilise l'audit.",
      "Les questions ouvertes (« montrez-moi », « comment savez-vous que ») produisent des preuves ; les questions fermées produisent des « oui ».",
      "L'échantillonnage doit être expliqué : taille, méthode de sélection, période couverte.",
    ],
    evidence: [
      "Plan d'audit diffusé à l'avance, avec périmètre, critères, horaires et interlocuteurs",
      "Liste de vérification préparée à partir des risques et des résultats d'audits antérieurs",
      "Notes d'audit datées, référençant documents, personnes rencontrées et observations",
      "Comptes rendus de réunion d'ouverture et de clôture avec émargement",
    ],
    examFocus: [
      "La réunion d'ouverture confirme le plan, les modalités et les règles ; elle n'est pas une simple formalité.",
      "L'audité doit pouvoir réagir aux constats en réunion de clôture, avant l'émission du rapport.",
    ],
    commonMistakes: [
      "Poser des questions fermées qui n'apportent aucune preuve.",
      "Passer la journée en salle de réunion sur des documents.",
      "Annoncer un constat en clôture qui n'a jamais été évoqué avec l'audité pendant l'audit.",
    ],
    scenario: {
      prompt:
        "En réunion de clôture, vous annoncez une non-conformité majeure que l'audité découvre à cet instant. Il conteste vivement, arguant qu'il aurait pu produire la preuve manquante. Qu'auriez-vous dû faire ?",
      correction:
        "Un constat doit être partagé avec l'audité au moment où il est établi, pendant l'audit, pour lui permettre de produire les preuves complémentaires. La réunion de clôture confirme et formalise, elle ne révèle pas. La bonne pratique : énoncer le constat sur place, demander explicitement s'il existe une autre preuve, et ne le retenir qu'après cette vérification. Sur le fond, si la preuve existe et est produite, le constat doit être levé.",
    },
    keyPoints: [
      "Un plan d'audit se prépare, se diffuse et se tient.",
      "L'échantillonnage doit être défendable et expliqué.",
      "Les questions ouvertes produisent les preuves.",
      "Aucun constat ne doit être découvert en clôture.",
    ],
    flashcards: [
      fc("Objectif de la réunion d'ouverture ?", "Confirmer le plan, les critères, les modalités pratiques, les règles de confidentialité et de sécurité, et répondre aux questions."),
      fc("Trois questions produisant des preuves ?", "« Montrez-moi », « comment savez-vous que », « que se passe-t-il si »."),
      fc("Que faire d'un constat contesté ?", "Revenir aux faits et aux preuves : si l'audité produit une preuve valable, le constat est levé ; sinon il est maintenu et documenté."),
    ],
  },
  {
    objectives: [
      "Rédiger une non-conformité indiscutable en trois éléments",
      "Classer un écart en majeur ou mineur avec un raisonnement défendable",
      "Distinguer non-conformité, remarque et opportunité d'amélioration",
      "Structurer un rapport d'audit exploitable par l'audité",
    ],
    examples: [
      ex("Industrie", "« Le 12 mars, trois des cinq extincteurs du hall B présentaient une vérification périodique échue depuis plus de six mois (relevé photographique et registre de vérification). » — constat factuel, exigence identifiable, preuve citée."),
      ex("Services", "« Le suivi des fournisseurs est insuffisant. » — jugement sans fait, sans exigence, sans preuve : non recevable."),
    ],
    auditorView: [
      "Un bon constat se relit six mois plus tard et reste compréhensible sans son auteur.",
      "La gravité se raisonne : défaillance systémique, absence totale d'un processus exigé, ou risque avéré sur le résultat orientent vers le majeur.",
      "Le rapport doit être utilisable : l'audité doit pouvoir engager son analyse de cause sans revenir vers l'auditeur.",
    ],
    evidence: [
      "Fiches d'écart mentionnant fait, exigence et preuve",
      "Rapport d'audit avec synthèse, constats classés et conclusion",
      "Traçabilité des preuves citées : références documentaires, dates, personnes rencontrées",
    ],
    examFocus: [
      "Trois éléments obligatoires : le fait constaté, l'exigence non satisfaite, la preuve.",
      "Une accumulation de non-conformités mineures sur un même processus peut caractériser une non-conformité majeure.",
      "Une opportunité d'amélioration ne peut jamais remplacer une non-conformité avérée.",
    ],
    commonMistakes: [
      "Rédiger un jugement (« insuffisant », « mal maîtrisé ») au lieu d'un fait.",
      "Citer l'exigence sans la preuve, ou la preuve sans l'exigence.",
      "Requalifier une non-conformité en opportunité d'amélioration pour ménager l'audité.",
    ],
    scenario: {
      prompt:
        "Vous relevez, sur quatre processus différents, que les actions correctives sont closes sans évaluation d'efficacité. Chaque cas pris isolément semble mineur. Comment classez-vous l'ensemble ?",
      correction:
        "La répétition sur quatre processus indépendants ne relève plus du cas isolé : elle traduit une défaillance du processus d'amélioration lui-même, donc une non-conformité majeure. Le constat doit être formulé au niveau du système : l'exigence d'évaluation de l'efficacité des actions correctives n'est pas satisfaite, la preuve étant les quatre dossiers cités nommément. Rédiger quatre mineures au lieu d'une majeure masquerait le problème réel.",
    },
    keyPoints: [
      "Fait + exigence + preuve : les trois éléments non négociables.",
      "La gravité se raisonne et se justifie, elle ne se ressent pas.",
      "La répétition d'un écart fait basculer vers le majeur.",
      "Le rapport doit permettre à l'audité d'agir seul.",
    ],
    flashcards: [
      fc("Trois éléments d'une non-conformité ?", "Le fait constaté, l'exigence non satisfaite, et la preuve qui étaye le fait."),
      fc("Qu'est-ce qui caractérise une non-conformité majeure ?", "L'absence totale d'un élément exigé, une défaillance systémique, ou un écart mettant en cause l'aptitude du système à atteindre les résultats attendus."),
      fc("Peut-on convertir une non-conformité en opportunité ?", "Non. Une exigence non satisfaite est une non-conformité ; l'opportunité concerne un point conforme pouvant être amélioré."),
    ],
  },
];
