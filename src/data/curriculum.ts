import {
  program as iso45001Program,
  type GlossaryEntry,
  type ProgramAnnexes,
  type ProgramModule,
  type ProgramWeek,
} from "./program";
import {
  auditReferences,
  commonGlossary,
  getStandardSpec,
  type ClauseSpec,
  type StandardReference,
} from "./standards";

export interface Curriculum {
  /** Vrai lorsque le cursus est entièrement rédigé (séances, quiz, examen blanc). */
  complete: boolean;
  title: string;
  subtitle: string;
  weeks: ProgramWeek[];
  modules: ProgramModule[];
  glossary: GlossaryEntry[];
  annexes: ProgramAnnexes;
  references: StandardReference[];
  copyrightNote: string;
}

const COPYRIGHT_NOTE = iso45001Program.meta.copyrightNote;

/** Trames d'audit réutilisables quelle que soit la norme. */
const genericAnnexes = {
  auditPlanTemplate: iso45001Program.annexes.auditPlanTemplate,
  ncTemplate: iso45001Program.annexes.ncTemplate,
  genericChecklist: iso45001Program.annexes.genericChecklist,
};

/** Cursus complet ISO 45001 (contenu rédigé). */
function iso45001Curriculum(): Curriculum {
  return {
    complete: true,
    title: iso45001Program.meta.title,
    subtitle: iso45001Program.meta.subtitle,
    weeks: iso45001Program.weeks,
    modules: iso45001Program.modules,
    glossary: iso45001Program.glossary,
    annexes: iso45001Program.annexes,
    references: [
      {
        code: "ISO 45001:2018",
        title: "Systèmes de management de la santé et de la sécurité au travail — Exigences",
        role: "Norme d'exigences auditée. Chapitres 4 à 10.",
        url: "https://www.iso.org/fr/standard/63787.html",
      },
      {
        code: "ISO 45003:2021",
        title: "Santé et sécurité psychologiques au travail",
        role: "Lignes directrices sur les risques psychosociaux, complément utile.",
        url: "https://www.iso.org/fr/standard/64283.html",
      },
      ...auditReferences,
    ],
    copyrightNote: COPYRIGHT_NOTE,
  };
}

function clauseModule(
  id: number,
  week: number,
  clause: ClauseSpec,
  ctx: StandardContext,
): ProgramModule {
  const label = ctx.label;

  const body = [
    `## ${clause.title}`,
    "",
    clause.summary,
    "",
    "### Exigences à maîtriser",
    "",
    ...clause.requirements.map((r) => `- ${r}`),
    "",
    "### Questions à se poser en audit",
    "",
    "- Quelle preuve documentée démontre la mise en œuvre de cette exigence ?",
    "- Qui en est responsable et comment le sait-il ?",
    "- Comment l'efficacité est-elle vérifiée et améliorée ?",
  ].join("\n");

  return {
    id,
    week,
    type: "lesson",
    dayLabel: `Séance ${id}`,
    title: `${clause.clause} — ${clause.title}`,
    objective: `Maîtriser les exigences du chapitre « ${clause.clause} » de ${label} et savoir les auditer.`,
    contentMarkdown: body,
    keyTakeaway: clause.summary,
    quiz: clause.quiz ?? [
      {
        question: `Citez deux exigences clés du chapitre « ${clause.clause} ».`,
        answer: clause.requirements.slice(0, 2).join(" / "),
      },
    ],
  };
}

/** Séances de méthodologie d'audit, communes à toutes les normes. */
function methodologyModules(startId: number, week: number, label: string): ProgramModule[] {
  const items = [
    {
      title: "Principes et vocabulaire de l'audit (ISO 19011)",
      objective: "Connaître les principes de l'audit et le vocabulaire attendu à l'examen.",
      content:
        "## Principes de l'audit\n\n- Déontologie, présentation impartiale, conscience professionnelle\n- Indépendance, approche fondée sur les preuves, approche par les risques, confidentialité\n\n## Vocabulaire\n\nCritères d'audit, preuve d'audit, constat, conclusion, périmètre, programme d'audit.",
      takeaway: "Un constat sans preuve n'est pas un constat.",
    },
    {
      title: "Préparer et conduire l'audit",
      objective: "Construire un plan d'audit, préparer les questions et mener les entretiens.",
      content:
        "## Préparation\n\n- Revue documentaire, analyse des risques, échantillonnage\n- Plan d'audit : périmètre, critères, horaires, interlocuteurs\n\n## Conduite\n\n- Réunion d'ouverture, questions ouvertes, recherche de preuves, notes factuelles\n- Réunion de clôture : présentation des constats, droit de réponse de l'audité",
      takeaway: "Le plan d'audit est un engagement : il se prépare et se tient.",
    },
    {
      title: "Rédiger les constats et le rapport",
      objective: "Formuler des non-conformités indiscutables et un rapport exploitable.",
      content:
        `## Formulation d'une non-conformité\n\n1. Le constat factuel observé\n2. L'exigence de ${label} non satisfaite\n3. La preuve (document, entretien, observation)\n\n## Rapport\n\nSynthèse, points forts, non-conformités classées (majeure / mineure), opportunités d'amélioration, conclusion sur l'aptitude du système.`,
      takeaway: "Fait + exigence + preuve : les trois éléments d'une non-conformité recevable.",
    },
  ];

  return items.map((item, index) => ({
    id: startId + index,
    week,
    type: "practical" as const,
    dayLabel: `Séance ${startId + index}`,
    title: item.title,
    objective: item.objective,
    contentMarkdown: item.content,
    keyTakeaway: item.takeaway,
    quiz: [],
  }));
}

/** Construit un cursus « préparation libre » à partir des chapitres d'un référentiel. */
function skeletonCurriculum(
  label: string,
  description: string | null,
  clauses: ClauseSpec[],
  glossary: GlossaryEntry[],
  references: StandardReference[],
): Curriculum {
  const clauseModules = clauses.map((clause, index) => clauseModule(index + 1, 1, clause, label));
  const methodology = methodologyModules(clauseModules.length + 1, 2, label);
  const reviewId = clauseModules.length + methodology.length + 1;
  const review: ProgramModule = {
    id: reviewId,
    week: 3,
    type: "review",
    dayLabel: `Séance ${reviewId}`,
    title: "Révision générale et auto-évaluation",
    objective: `Reprendre chapitre par chapitre ${label} et identifier vos points faibles.`,
    contentMarkdown:
      "## Méthode\n\n- Reprenez chaque chapitre et reformulez ses exigences sans regarder vos notes\n- Notez votre niveau de confiance de 1 à 5\n- Concentrez les révisions suivantes sur les chapitres notés en dessous de 4",
    keyTakeaway: "Réviser, c'est vérifier ce que l'on sait restituer, pas relire.",
    quiz: [],
  };

  return {
    complete: false,
    title: label,
    subtitle: description ?? "Préparation libre à partir des chapitres du référentiel.",
    weeks: [
      { id: 1, title: "Les chapitres du référentiel", dayIds: clauseModules.map((m) => m.id) },
      { id: 2, title: "Méthodologie d'audit", dayIds: methodology.map((m) => m.id) },
      { id: 3, title: "Consolidation", dayIds: [reviewId] },
    ],
    modules: [...clauseModules, ...methodology, review],
    glossary: [...glossary, ...commonGlossary].sort((a, b) => a.term.localeCompare(b.term, "fr")),
    annexes: {
      ...genericAnnexes,
      revisionSheets: clauses.map((c) => ({ clause: c.clause, summary: c.summary })),
      finalMockExam: { mcq: [] },
    },
    references,
    copyrightNote: COPYRIGHT_NOTE,
  };
}

export interface CurriculumSource {
  code: string;
  name: string;
  description: string | null;
  chapters: string[];
  has_curriculum: boolean;
}

/**
 * Renvoie le cursus d'une certification : contenu rédigé lorsqu'il existe,
 * sinon squelette officiel (chapitres, méthodologie, glossaire, références).
 */
export function getCurriculum(cert: CurriculumSource | null): Curriculum | null {
  if (!cert) return null;
  if (cert.code === "iso-45001") return iso45001Curriculum();

  const spec = getStandardSpec(cert.code);
  if (spec) {
    return skeletonCurriculum(spec.label, cert.description, spec.clauses, spec.glossary, spec.references);
  }

  // Référentiel personnalisé : uniquement les chapitres saisis par l'utilisateur.
  const clauses: ClauseSpec[] = cert.chapters.map((chapter) => ({
    clause: chapter,
    title: chapter,
    summary: `Chapitre du référentiel ${cert.name}.`,
    requirements: ["À compléter avec vos propres notes et documents de cours."],
  }));
  return skeletonCurriculum(cert.name, cert.description, clauses, [], auditReferences);
}
