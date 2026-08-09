import type { ProgramModule } from "./program";

/**
 * Séances du niveau Lead Auditor : pilotage d'une équipe d'audit et audit de
 * certification. Communes à toutes les normes, contextualisées par le libellé
 * du référentiel travaillé.
 */
export const LEAD_AUDITOR_START_ID = 9001;

interface LeadModuleSpec {
  title: string;
  objective: string;
  sections: { heading: string; body: string[] }[];
  keyTakeaway: string;
  quiz: { question: string; answer: string }[];
}

function specs(label: string): LeadModuleSpec[] {
  return [
    {
      title: "Rôle et responsabilités du responsable d'équipe d'audit",
      objective:
        "Comprendre ce que l'organisme attend d'un responsable d'équipe d'audit, de la désignation au rapport final.",
      sections: [
        {
          heading: "Ce que recouvre le rôle",
          body: [
            "Le responsable d'équipe d'audit, au sens des lignes directrices d'ISO 19011:2026, est désigné pour un audit précis. Il porte la responsabilité de la conduite de l'audit et de ses conclusions, pas seulement de sa propre part de travail.",
            "Ses responsabilités : préparer le plan d'audit, répartir les tâches entre auditeurs et experts techniques, arbitrer les désaccords sur les constats, animer les réunions d'ouverture et de clôture, valider le rapport.",
          ],
        },
        {
          heading: "Compétences attendues",
          body: [
            "Au-delà de la maîtrise de " + label + ", l'organisme évalue la capacité à décider sous contrainte de temps, à gérer une équipe et à tenir une relation professionnelle avec l'audité, y compris en situation de tension.",
            "La compétence est démontrée par des audits réalisés en tant qu'auditeur, puis par des audits supervisés en tant que responsable d'équipe.",
          ],
        },
      ],
      keyTakeaway:
        "Le responsable d'équipe d'audit est responsable de la conduite de l'audit et de ses conclusions, y compris du travail des autres auditeurs.",
      quiz: [
        {
          question: "Qui arbitre un désaccord entre deux auditeurs sur la qualification d'un constat ?",
          answer:
            "Le responsable d'équipe d'audit : il tranche, en s'appuyant sur la preuve et l'exigence, et assume la conclusion dans le rapport.",
        },
      ],
    },
    {
      title: "Programme d'audit, plan d'audit et gestion du temps",
      objective:
        "Construire un plan d'audit réaliste et répartir le temps d'audit entre les processus à couvrir.",
      sections: [
        {
          heading: "Programme et plan : ne pas confondre",
          body: [
            "Le programme d'audit couvre une période et un ensemble d'audits. Le plan d'audit décrit un audit : périmètre, critères, dates, sites, horaires, auditeurs, processus audités.",
            "Le plan est communiqué à l'audité avant l'audit et peut être ajusté d'un commun accord pendant l'audit.",
          ],
        },
        {
          heading: "Répartir le temps",
          body: [
            "Le temps est réparti selon le risque et l'importance des processus, pas de façon uniforme entre chapitres. Un processus critique mal maîtrisé mérite plus de temps qu'un processus stable.",
            "Prévoir explicitement des créneaux pour les réunions d'équipe quotidiennes, la consolidation des constats et la préparation de la réunion de clôture.",
          ],
        },
      ],
      keyTakeaway:
        "Le plan d'audit alloue le temps en fonction du risque et de l'importance des processus, et réserve du temps pour consolider les constats.",
      quiz: [
        {
          question: "Quelle est la différence entre programme d'audit et plan d'audit ?",
          answer:
            "Le programme couvre un ensemble d'audits sur une période ; le plan décrit l'organisation d'un audit précis (périmètre, critères, horaires, auditeurs).",
        },
      ],
    },
    {
      title: "Réunion d'ouverture et conduite d'équipe",
      objective:
        "Animer la réunion d'ouverture et piloter l'équipe pendant l'audit, y compris en cas d'imprévu.",
      sections: [
        {
          heading: "Réunion d'ouverture",
          body: [
            "Points obligatoires : présentation de l'équipe, confirmation du périmètre, des critères et du plan, méthode d'échantillonnage et incertitude associée, canaux de communication, règles de sécurité et de confidentialité, modalités de la réunion de clôture.",
            "Elle est courte, factuelle, et doit obtenir l'accord explicite de l'audité sur le déroulement.",
          ],
        },
        {
          heading: "Piloter pendant l'audit",
          body: [
            "Point d'équipe quotidien : avancement, constats en cours, réallocation du temps si un processus prend du retard.",
            "Escalade : tout obstacle à l'audit (documents indisponibles, accès refusé, intimidation) est signalé à l'audité et, s'il persiste, au commanditaire de l'audit ; il peut conduire à interrompre l'audit.",
          ],
        },
      ],
      keyTakeaway:
        "La réunion d'ouverture verrouille périmètre, critères et règles du jeu ; le point d'équipe quotidien permet de réallouer le temps.",
      quiz: [
        {
          question: "Que fait le responsable d'équipe si un service refuse l'accès à des enregistrements ?",
          answer:
            "Il le signale immédiatement à l'audité, consigne l'obstacle et, s'il persiste, en informe le commanditaire ; l'audit peut être suspendu ou son périmètre limité dans le rapport.",
        },
      ],
    },
    {
      title: "Qualifier et rédiger une non-conformité",
      objective:
        "Distinguer majeure, mineure et opportunité d'amélioration, et rédiger un énoncé opposable.",
      sections: [
        {
          heading: "Qualification",
          body: [
            "Majeure : absence de mise en œuvre d'une exigence, défaillance systémique, ou effet significatif sur la conformité des résultats du système.",
            "Mineure : écart ponctuel et isolé, n'invalidant pas le processus concerné.",
            "Opportunité d'amélioration : aucun écart à une exigence, mais une piste de progrès. Elle ne doit jamais servir à éviter de formuler une non-conformité réelle.",
          ],
        },
        {
          heading: "Structure d'un énoncé",
          body: [
            "Trois composants : l'exigence (clause de " + label + " ou document interne), la preuve observée (fait daté, identifiable), l'écart (en quoi la preuve ne satisfait pas l'exigence).",
            "L'énoncé décrit un fait, pas une personne, et ne propose pas de solution : la cause et l'action corrective appartiennent à l'audité.",
          ],
        },
      ],
      keyTakeaway:
        "Une non-conformité = exigence + preuve + écart. Ni jugement de personne, ni solution imposée.",
      quiz: [
        {
          question: "Quels sont les trois composants obligatoires d'un énoncé de non-conformité ?",
          answer: "L'exigence concernée, la preuve objective observée, et l'écart constaté entre les deux.",
        },
        {
          question: "Peut-on transformer une non-conformité gênante en opportunité d'amélioration ?",
          answer:
            "Non. S'il y a écart à une exigence, c'est une non-conformité ; requalifier compromet l'intégrité de l'audit.",
        },
      ],
    },
    {
      title: "Réunion de clôture, rapport et suivi",
      objective:
        "Présenter des conclusions défendables, rédiger le rapport et assurer le suivi des actions correctives.",
      sections: [
        {
          heading: "Réunion de clôture",
          body: [
            "Présentation des constats par ordre d'importance, rappel de l'échantillonnage, énoncé des conclusions et de la recommandation éventuelle. Les divergences non résolues sont enregistrées dans le rapport.",
            "La recommandation de certification n'appartient jamais à l'équipe d'audit seule : la décision est prise par l'organisme de certification.",
          ],
        },
        {
          heading: "Rapport et suivi",
          body: [
            "Le rapport contient au minimum : périmètre, critères, équipe, dates, constats, conclusions, points non couverts.",
            "Suivi : analyse des causes fournie par l'audité, plan d'action, vérification de l'efficacité — sur preuve, pas sur déclaration. Une non-conformité n'est soldée qu'après vérification.",
          ],
        },
      ],
      keyTakeaway:
        "L'équipe d'audit conclut et recommande ; la décision de certification revient à l'organisme. Une non-conformité se solde sur preuve d'efficacité.",
      quiz: [
        {
          question: "Qui décide de l'octroi du certificat ?",
          answer:
            "L'organisme de certification, sur la base du rapport ; l'équipe d'audit ne fait qu'une recommandation.",
        },
      ],
    },
    {
      title: "Éthique, impartialité et gestion des situations difficiles",
      objective:
        "Tenir la posture professionnelle attendue d'un Lead Auditor face aux pressions et aux conflits d'intérêts.",
      sections: [
        {
          heading: "Principes",
          body: [
            "Les principes d'audit d'ISO 19011:2026 s'appliquent au responsable d'équipe en premier : intégrité, présentation impartiale, conscience professionnelle, confidentialité, indépendance, approche fondée sur des preuves, approche par les risques.",
            "Conflit d'intérêts : un auditeur n'audite pas un domaine dont il a été responsable ou qu'il a conseillé récemment. Le cas se déclare avant l'audit.",
          ],
        },
        {
          heading: "Situations difficiles",
          body: [
            "Audité hostile ou fuyant : revenir aux faits et à l'exigence, garder un ton neutre, consigner le refus de fournir une preuve.",
            "Pression pour retirer un constat : maintenir le constat s'il est étayé, proposer de réexaminer la preuve si un élément nouveau est produit, tracer l'échange.",
          ],
        },
      ],
      keyTakeaway:
        "Un constat étayé ne se négocie pas : il se réexamine seulement à la lumière d'une preuve nouvelle.",
      quiz: [
        {
          question: "Un auditeur a conseillé l'entreprise auditée il y a six mois. Que faire ?",
          answer:
            "Le déclarer : il ne peut pas auditer ce domaine, l'impartialité de l'équipe serait compromise.",
        },
      ],
    },
  ];
}

export function leadAuditorModules(label: string, week: number): ProgramModule[] {
  return specs(label).map((spec, index) => ({
    id: LEAD_AUDITOR_START_ID + index,
    week,
    track: "lead_auditor" as const,
    type: "lesson" as const,
    dayLabel: `Lead Auditor ${index + 1}`,
    title: spec.title,
    objective: spec.objective,
    contentMarkdown: spec.sections
      .flatMap((section) => [`## ${section.heading}`, "", ...section.body.flatMap((b) => [b, ""])])
      .join("\n")
      .trim(),
    keyTakeaway: spec.keyTakeaway,
    quiz: spec.quiz,
    extras: {
      objectives: [spec.objective],
      auditorView: spec.sections.map((section) => `${section.heading} : ${section.body[0] ?? ""}`),
      examFocus: [spec.keyTakeaway],
      keyPoints: spec.sections.flatMap((section) => section.body),
      flashcards: spec.quiz.map((q) => ({ front: q.question, back: q.answer })),
    },
  }));
}
