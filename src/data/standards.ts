import type { GlossaryEntry, QuizItem } from "./program";

/** Description d'un chapitre (ou d'une annexe) d'une norme. */
export interface ClauseSpec {
  clause: string;
  title: string;
  summary: string;
  requirements: string[];
  quiz?: QuizItem[];
}

export interface StandardReference {
  code: string;
  title: string;
  role: string;
  url: string;
}

/** Squelette officiel d'une norme sans cursus rédigé. */
export interface StandardSpec {
  /** Code de la certification en base (`certifications.code`). */
  code: string;
  label: string;
  subject: string;
  /** Objet du management (SMQ, SMSI, ...). */
  systemName: string;
  clauses: ClauseSpec[];
  glossary: GlossaryEntry[];
  references: StandardReference[];
}

interface HlsInput {
  systemName: string;
  subject: string;
  /** Terme employé par la norme pour l'objet du risque (« risques SST », « risques de sécurité de l'information »…). */
  riskTerm: string;
  /** Exemple d'indicateur de performance propre à la norme. */
  indicator: string;
  /** Exigences additionnelles spécifiques, indexées par numéro de chapitre. */
  extra?: Partial<Record<4 | 5 | 6 | 7 | 8 | 9 | 10, string[]>>;
}

/** Construit les chapitres 4 à 10 de la structure harmonisée (HLS) pour une norme donnée. */
function hlsClauses(input: HlsInput): ClauseSpec[] {
  const { systemName, subject, riskTerm, indicator, extra = {} } = input;
  return [
    {
      clause: "4. Contexte de l'organisme",
      title: "Contexte, parties intéressées et domaine d'application",
      summary: `Comprendre l'organisme et son contexte, identifier les parties intéressées pertinentes pour ${subject}, définir le domaine d'application et établir le ${systemName}.`,
      requirements: [
        "4.1 Enjeux internes et externes pertinents",
        "4.2 Besoins et attentes des parties intéressées, dont les exigences légales retenues",
        "4.3 Domaine d'application documenté et justifié",
        `4.4 ${systemName} : processus, interactions, critères et ressources`,
        ...(extra[4] ?? []),
      ],
    },
    {
      clause: "5. Leadership",
      title: "Engagement de la direction, politique et rôles",
      summary: `La direction démontre son leadership : politique ${subject}, rôles et responsabilités attribués, intégration des exigences aux processus métier.`,
      requirements: [
        "5.1 Leadership et engagement de la direction",
        `5.2 Politique ${subject} : appropriée, communiquée, tenue à jour`,
        "5.3 Rôles, responsabilités et autorités définis et communiqués",
        ...(extra[5] ?? []),
      ],
    },
    {
      clause: "6. Planification",
      title: "Risques, opportunités et objectifs",
      summary: `Planifier les actions face aux ${riskTerm} et aux opportunités, fixer des objectifs mesurables et planifier les modifications.`,
      requirements: [
        `6.1 Actions à mettre en œuvre face aux ${riskTerm} et opportunités`,
        "6.2 Objectifs et planification des actions pour les atteindre",
        "6.3 Planification des modifications du système",
        ...(extra[6] ?? []),
      ],
    },
    {
      clause: "7. Support",
      title: "Ressources, compétences, communication et information documentée",
      summary: `Fournir les ressources, assurer les compétences et la sensibilisation, organiser la communication et maîtriser l'information documentée du ${systemName}.`,
      requirements: [
        "7.1 Ressources nécessaires",
        "7.2 Compétences : besoins, actions, preuves",
        "7.3 Sensibilisation du personnel",
        "7.4 Communication interne et externe (quoi, quand, avec qui, comment)",
        "7.5 Information documentée : création, mise à jour, maîtrise",
        ...(extra[7] ?? []),
      ],
    },
    {
      clause: "8. Réalisation des activités opérationnelles",
      title: "Maîtrise opérationnelle",
      summary: `Planifier, mettre en œuvre et maîtriser les processus nécessaires pour satisfaire les exigences liées à ${subject}. Les sous-chapitres du chapitre 8 sont propres à chaque norme.`,
      requirements: [
        "8.1 Planification et maîtrise opérationnelles, critères des processus",
        ...(extra[8] ?? []),
      ],
    },
    {
      clause: "9. Évaluation des performances",
      title: "Surveillance, audit interne et revue de direction",
      summary: `Surveiller, mesurer, analyser et évaluer la performance (par exemple ${indicator}), réaliser les audits internes et la revue de direction.`,
      requirements: [
        "9.1 Surveillance, mesure, analyse et évaluation des performances",
        "9.2 Programme et réalisation des audits internes",
        "9.3 Revue de direction : éléments d'entrée et de sortie",
        ...(extra[9] ?? []),
      ],
    },
    {
      clause: "10. Amélioration",
      title: "Non-conformités, actions correctives et amélioration continue",
      summary: `Traiter les non-conformités, engager des actions correctives efficaces et améliorer en continu la pertinence et l'efficacité du ${systemName}.`,
      requirements: [
        "10.1 Opportunités d'amélioration",
        "10.2 Non-conformités et actions correctives, analyse des causes",
        "10.3 Amélioration continue",
        ...(extra[10] ?? []),
      ],
    },
  ];
}

const isoUrl = (id: string) => `https://www.iso.org/fr/standard/${id}.html`;

/** Normes transverses utiles à toute préparation d'auditeur. */
export const auditReferences: StandardReference[] = [
  {
    code: "ISO 19011:2018",
    title: "Lignes directrices pour l'audit des systèmes de management",
    role: "Principes de l'audit, programme d'audit, conduite et compétences de l'auditeur.",
    url: isoUrl("70017"),
  },
  {
    code: "ISO/IEC 17021-1:2015",
    title: "Exigences pour les organismes de certification",
    role: "Cadre de la certification tierce partie et déroulé des audits de certification.",
    url: isoUrl("61651"),
  },
];

/** Glossaire commun à toutes les normes de système de management. */
export const commonGlossary: GlossaryEntry[] = [
  { term: "Audit", definition: "Processus méthodique, indépendant et documenté permettant d'obtenir des preuves d'audit et de les évaluer de manière objective." },
  { term: "Preuve d'audit", definition: "Enregistrements, énoncés de faits ou autres informations vérifiables et pertinents par rapport aux critères d'audit." },
  { term: "Critères d'audit", definition: "Ensemble d'exigences utilisées comme référence : norme, politique, procédure, exigence légale." },
  { term: "Constat d'audit", definition: "Résultat de l'évaluation des preuves d'audit par rapport aux critères d'audit : conformité, non-conformité ou opportunité." },
  { term: "Non-conformité", definition: "Non-satisfaction d'une exigence. Elle s'énonce par un constat factuel, l'exigence non respectée et la preuve associée." },
  { term: "Action corrective", definition: "Action visant à éliminer la cause d'une non-conformité pour éviter sa réapparition, à ne pas confondre avec la correction." },
  { term: "Partie intéressée", definition: "Personne ou organisme pouvant influer sur une décision ou une activité, être influencé ou s'estimer influencé par elle." },
  { term: "Information documentée", definition: "Information devant être maîtrisée et tenue à jour par l'organisme, ainsi que son support." },
  { term: "Processus", definition: "Ensemble d'activités corrélées qui transforme des éléments d'entrée en éléments de sortie." },
  { term: "Amélioration continue", definition: "Activité récurrente d'amélioration des performances, généralement structurée par le cycle PDCA." },
  { term: "PDCA", definition: "Planifier, Réaliser, Vérifier, Agir : cycle d'amélioration structurant toutes les normes de système de management." },
  { term: "Domaine d'application", definition: "Périmètre du système de management : sites, activités, processus inclus et exclusions justifiées." },
  { term: "Revue de direction", definition: "Examen périodique par la direction de la pertinence, de l'adéquation et de l'efficacité du système de management." },
  { term: "Risque", definition: "Effet de l'incertitude sur l'atteinte des objectifs, pouvant être négatif (menace) ou positif (opportunité)." },
  { term: "Échantillonnage d'audit", definition: "Sélection d'une partie représentative des éléments disponibles afin de conclure sur l'ensemble." },
];

function spec(
  code: string,
  label: string,
  systemName: string,
  subject: string,
  clauses: ClauseSpec[],
  glossary: GlossaryEntry[],
  mainStandard: StandardReference,
  extraRefs: StandardReference[] = [],
): StandardSpec {
  return {
    code,
    label,
    subject,
    systemName,
    clauses,
    glossary,
    references: [mainStandard, ...extraRefs, ...auditReferences],
  };
}

export const standardSpecs: Record<string, StandardSpec> = {
  "iso-9001": spec(
    "iso-9001",
    "ISO 9001:2015",
    "système de management de la qualité (SMQ)",
    "la qualité",
    hlsClauses({
      systemName: "système de management de la qualité (SMQ)",
      subject: "la qualité",
      riskTerm: "risques qualité",
      indicator: "la satisfaction client et le taux de non-conformités produit",
      extra: {
        8: [
          "8.2 Exigences relatives aux produits et services, revue des exigences client",
          "8.3 Conception et développement (si applicable)",
          "8.4 Maîtrise des processus, produits et services fournis par des prestataires externes",
          "8.5 Production et prestation de service, identification et traçabilité, propriété du client",
          "8.6 Libération des produits et services",
          "8.7 Maîtrise des éléments de sortie non conformes",
        ],
        9: ["9.1.2 Satisfaction du client : surveillance de la perception du client"],
      },
    }),
    [
      { term: "Client", definition: "Personne ou organisme susceptible de recevoir un produit ou un service destiné à cette personne ou cet organisme." },
      { term: "Satisfaction du client", definition: "Perception du client sur le niveau de satisfaction de ses attentes." },
      { term: "Approche processus", definition: "Management des activités comme des processus corrélés formant un système cohérent." },
      { term: "Traçabilité", definition: "Aptitude à retrouver l'historique, l'utilisation ou la localisation d'un objet." },
    ],
    { code: "ISO 9001:2015", title: "Systèmes de management de la qualité — Exigences", role: "Norme d'exigences auditée, chapitres 4 à 10.", url: isoUrl("62085") },
    [{ code: "ISO 9000:2015", title: "Principes essentiels et vocabulaire", role: "Définitions officielles utilisées par la famille 9001.", url: isoUrl("45481") }],
  ),
  "iso-14001": spec(
    "iso-14001",
    "ISO 14001:2015",
    "système de management environnemental (SME)",
    "l'environnement",
    hlsClauses({
      systemName: "système de management environnemental (SME)",
      subject: "l'environnement",
      riskTerm: "risques et impacts environnementaux",
      indicator: "la consommation d'énergie, les rejets et la production de déchets",
      extra: {
        6: [
          "6.1.2 Aspects environnementaux et impacts associés, critères de significativité",
          "6.1.3 Obligations de conformité",
        ],
        8: [
          "8.1 Perspective de cycle de vie et exigences transmises aux prestataires externes",
          "8.2 Préparation et réponse aux situations d'urgence",
        ],
        9: ["9.1.2 Évaluation de la conformité aux obligations de conformité"],
      },
    }),
    [
      { term: "Aspect environnemental", definition: "Élément des activités, produits ou services susceptible d'interagir avec l'environnement." },
      { term: "Impact environnemental", definition: "Modification de l'environnement, négative ou bénéfique, résultant totalement ou partiellement des aspects environnementaux." },
      { term: "Obligation de conformité", definition: "Exigence légale que l'organisme doit respecter et autres exigences auxquelles il souscrit." },
      { term: "Perspective de cycle de vie", definition: "Prise en compte des étapes successives d'un produit, de l'acquisition des matières à la fin de vie." },
    ],
    { code: "ISO 14001:2015", title: "Systèmes de management environnemental — Exigences", role: "Norme d'exigences auditée, chapitres 4 à 10.", url: isoUrl("60857") },
  ),
  "iso-27001": spec(
    "iso-27001",
    "ISO/IEC 27001:2022",
    "système de management de la sécurité de l'information (SMSI)",
    "la sécurité de l'information",
    [
      ...hlsClauses({
        systemName: "système de management de la sécurité de l'information (SMSI)",
        subject: "la sécurité de l'information",
        riskTerm: "risques de sécurité de l'information",
        indicator: "le nombre d'incidents de sécurité et le taux de traitement des vulnérabilités",
        extra: {
          6: [
            "6.1.2 Appréciation des risques de sécurité de l'information (critères, identification, analyse, évaluation)",
            "6.1.3 Traitement des risques, Déclaration d'applicabilité (SoA), plan de traitement",
          ],
        },
      }),
      {
        clause: "Annexe A",
        title: "93 mesures de sécurité (organisationnelles, humaines, physiques, technologiques)",
        summary:
          "Référentiel de mesures à comparer au traitement des risques. Chaque exclusion doit être justifiée dans la Déclaration d'applicabilité.",
        requirements: [
          "A.5 Mesures organisationnelles (37)",
          "A.6 Mesures liées aux personnes (8)",
          "A.7 Mesures physiques (14)",
          "A.8 Mesures technologiques (34)",
        ],
      },
    ],
    [
      { term: "SMSI", definition: "Système de management de la sécurité de l'information : ensemble des processus visant à préserver confidentialité, intégrité et disponibilité." },
      { term: "Déclaration d'applicabilité (SoA)", definition: "Document listant les mesures de l'Annexe A retenues ou exclues, avec justification et état de mise en œuvre." },
      { term: "Confidentialité, intégrité, disponibilité", definition: "Les trois propriétés fondamentales de la sécurité de l'information (CIA)." },
      { term: "Propriétaire du risque", definition: "Personne ayant la responsabilité et l'autorité de gérer un risque donné." },
    ],
    { code: "ISO/IEC 27001:2022", title: "Sécurité de l'information — Systèmes de management — Exigences", role: "Norme d'exigences auditée, chapitres 4 à 10 + Annexe A.", url: isoUrl("27001") },
    [{ code: "ISO/IEC 27002:2022", title: "Mesures de sécurité de l'information", role: "Guide de mise en œuvre des mesures de l'Annexe A.", url: isoUrl("75652") }],
  ),
  "iso-22000": spec(
    "iso-22000",
    "ISO 22000:2018",
    "système de management de la sécurité des denrées alimentaires (SMSDA)",
    "la sécurité des denrées alimentaires",
    hlsClauses({
      systemName: "système de management de la sécurité des denrées alimentaires (SMSDA)",
      subject: "la sécurité des denrées alimentaires",
      riskTerm: "dangers liés à la sécurité des denrées alimentaires",
      indicator: "les résultats de vérification des CCP et le nombre de retraits/rappels",
      extra: {
        8: [
          "8.2 Programmes prérequis (PRP)",
          "8.5 Analyse des dangers, PRP opérationnels et plan HACCP (CCP, limites critiques)",
          "8.7 Maîtrise de la surveillance et du mesurage",
          "8.9 Maîtrise des non-conformités produit, retraits et rappels",
        ],
      },
    }),
    [
      { term: "PRP", definition: "Programme prérequis : conditions et activités de base nécessaires pour maintenir un environnement hygiénique." },
      { term: "CCP", definition: "Point critique pour la maîtrise : étape où une mesure de maîtrise est essentielle pour prévenir ou réduire un danger." },
      { term: "Limite critique", definition: "Valeur mesurable séparant l'acceptabilité de l'inacceptabilité à un CCP." },
      { term: "HACCP", definition: "Méthode d'analyse des dangers et de maîtrise des points critiques, intégrée à l'ISO 22000." },
    ],
    { code: "ISO 22000:2018", title: "Systèmes de management de la sécurité des denrées alimentaires — Exigences", role: "Norme d'exigences auditée, chapitres 4 à 10.", url: isoUrl("65464") },
  ),
  "iso-50001": spec(
    "iso-50001",
    "ISO 50001:2018",
    "système de management de l'énergie (SMÉ)",
    "la performance énergétique",
    hlsClauses({
      systemName: "système de management de l'énergie (SMÉ)",
      subject: "la performance énergétique",
      riskTerm: "risques liés à la performance énergétique",
      indicator: "les IPÉ comparés à la situation énergétique de référence (SER)",
      extra: {
        6: [
          "6.3 Revue énergétique : usages énergétiques significatifs (UES) et variables pertinentes",
          "6.4 Indicateurs de performance énergétique (IPÉ)",
          "6.5 Situation énergétique de référence (SER)",
          "6.6 Planification du recueil des données énergétiques",
        ],
        8: ["8.2 Conception intégrant la performance énergétique", "8.3 Achats d'énergie et d'équipements consommateurs"],
      },
    }),
    [
      { term: "UES", definition: "Usage énergétique significatif : usage représentant une consommation importante ou offrant un potentiel d'amélioration." },
      { term: "IPÉ", definition: "Indicateur de performance énergétique : mesure quantifiée de la performance énergétique." },
      { term: "SER", definition: "Situation énergétique de référence : référence quantitative servant de base à la comparaison." },
    ],
    { code: "ISO 50001:2018", title: "Systèmes de management de l'énergie — Exigences", role: "Norme d'exigences auditée, chapitres 4 à 10.", url: isoUrl("69426") },
  ),
  "iso-13485": spec(
    "iso-13485",
    "ISO 13485:2016",
    "système de management de la qualité des dispositifs médicaux",
    "la qualité des dispositifs médicaux",
    hlsClauses({
      systemName: "système de management de la qualité des dispositifs médicaux",
      subject: "la qualité des dispositifs médicaux",
      riskTerm: "risques liés au dispositif et à la conformité réglementaire",
      indicator: "les réclamations, la vigilance et les rappels de produits",
      extra: {
        7: ["Manuel qualité, dossier du dispositif médical et exigences réglementaires applicables"],
        8: [
          "Conception et développement : plan, vérification, validation, transfert, maîtrise des modifications",
          "Processus de production stériles, propreté du produit, activités d'installation et de service",
          "Traçabilité, identification et enregistrements de production",
        ],
        9: ["Retour d'information, traitement des réclamations et notification aux autorités réglementaires"],
      },
    }),
    [
      { term: "Dispositif médical", definition: "Instrument, appareil ou logiciel destiné par le fabricant à une finalité médicale sur l'être humain." },
      { term: "Dossier du dispositif médical", definition: "Ensemble des documents démontrant la conformité du dispositif aux exigences applicables." },
      { term: "Vigilance", definition: "Surveillance après commercialisation et notification des incidents aux autorités compétentes." },
    ],
    { code: "ISO 13485:2016", title: "Dispositifs médicaux — Systèmes de management de la qualité", role: "Norme d'exigences auditée, structure spécifique alignée sur la réglementation.", url: isoUrl("59752") },
  ),
  "iso-22301": spec(
    "iso-22301",
    "ISO 22301:2019",
    "système de management de la continuité d'activité (SMCA)",
    "la continuité d'activité",
    hlsClauses({
      systemName: "système de management de la continuité d'activité (SMCA)",
      subject: "la continuité d'activité",
      riskTerm: "risques de rupture d'activité",
      indicator: "les résultats des exercices, le RTO et le RPO atteints",
      extra: {
        8: [
          "8.2 Bilan d'impact sur l'activité (BIA) et appréciation des risques",
          "8.3 Stratégies et solutions de continuité",
          "8.4 Plans et procédures de continuité, structure d'intervention, communication",
          "8.5 Programme d'exercices et de tests",
          "8.6 Évaluation de la documentation et des capacités de continuité",
        ],
      },
    }),
    [
      { term: "BIA", definition: "Bilan d'impact sur l'activité : analyse des conséquences dans le temps d'une interruption des activités." },
      { term: "RTO", definition: "Durée maximale d'interruption admissible avant reprise d'une activité." },
      { term: "RPO", definition: "Perte de données maximale admissible, exprimée en durée." },
      { term: "MTPD", definition: "Durée maximale d'interruption tolérable au-delà de laquelle les impacts deviennent inacceptables." },
    ],
    { code: "ISO 22301:2019", title: "Sécurité et résilience — Systèmes de management de la continuité d'activité", role: "Norme d'exigences auditée, chapitres 4 à 10.", url: isoUrl("75106") },
  ),
  "iso-37001": spec(
    "iso-37001",
    "ISO 37001:2016",
    "système de management anti-corruption (SMAC)",
    "la lutte contre la corruption",
    hlsClauses({
      systemName: "système de management anti-corruption (SMAC)",
      subject: "la lutte contre la corruption",
      riskTerm: "risques de corruption",
      indicator: "les alertes reçues, les diligences réalisées et les cadeaux déclarés",
      extra: {
        4: ["4.5 Appréciation du risque de corruption, révisée périodiquement"],
        5: ["5.3 Fonction de conformité anti-corruption, indépendante et dotée de ressources"],
        8: [
          "8.2 Diligence raisonnable (partenaires, projets, personnel exposé)",
          "8.5 Contrôles financiers et non financiers",
          "8.7 Cadeaux, invitations, dons et avantages similaires",
          "8.9 Signalement des soupçons et protection des lanceurs d'alerte",
          "8.10 Enquête et traitement des faits de corruption",
        ],
      },
    }),
    [
      { term: "Corruption", definition: "Offre, promesse, remise, acceptation ou sollicitation d'un avantage indu en vue d'obtenir un comportement déterminé." },
      { term: "Diligence raisonnable", definition: "Évaluation approfondie de la nature et de l'étendue du risque de corruption lié à une transaction, un partenaire ou un poste." },
      { term: "Fonction de conformité", definition: "Personne ou équipe chargée de superviser la conception et la mise en œuvre du système anti-corruption." },
    ],
    { code: "ISO 37001:2016", title: "Systèmes de management anti-corruption — Exigences", role: "Norme d'exigences auditée, chapitres 4 à 10.", url: isoUrl("65034") },
  ),
};

export function getStandardSpec(code: string | null | undefined): StandardSpec | null {
  if (!code) return null;
  return standardSpecs[code] ?? null;
}
