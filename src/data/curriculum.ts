import {
  program as iso45001Program,
  type GlossaryEntry,
  type ProgramAnnexes,
  type ProgramModule,
  type ProgramWeek,
} from "./program";
import {
  getAuditReferences,
  getCommonGlossary,
  getStandardSpec,
  type ClauseSpec,
  type StandardReference,
} from "./standards";
import {
  getClauseExtras,
  getMethodologyExtras,
  type StandardContext,
} from "./standard-extras";
import { leadAuditorModules } from "./lead-auditor";
import { getProgram } from "./program";
import type { Locale } from "@/i18n/config";

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
function iso45001Curriculum(locale: Locale): Curriculum {
  const prog = getProgram(locale);
  const leadWeekId = Math.max(...prog.weeks.map((w) => w.id)) + 1;
  const leadModules = leadAuditorModules("ISO 45001:2018", leadWeekId, locale);
  return {
    complete: true,
    title: prog.meta.title,
    subtitle: prog.meta.subtitle,
    weeks: [
      ...prog.weeks,
      { id: leadWeekId, title: "Lead Auditor", dayIds: leadModules.map((m) => m.id) },
    ],
    modules: [...prog.modules, ...leadModules],
    glossary: prog.glossary,
    annexes: prog.annexes,
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
      ...getAuditReferences(locale),
    ],
    copyrightNote: COPYRIGHT_NOTE,
  };
}

function clauseModule(
  id: number,
  week: number,
  clause: ClauseSpec,
  ctx: StandardContext,
  locale: Locale,
): ProgramModule {
  const label = ctx.label;
  const isGuidance = clause.guidance === true;

  const body = [
    `## ${clause.title}`,
    "",
    clause.summary,
    "",
    isGuidance ? "### Recommandations à maîtriser" : "### Exigences à maîtriser",
    "",
    ...clause.requirements.map((r) => `- ${r}`),
    "",
    "### Questions à se poser en audit",
    "",
    isGuidance
      ? "- Comment cette recommandation se traduit-elle concrètement dans ma pratique d'audit ?"
      : "- Quelle preuve documentée démontre la mise en œuvre de cette exigence ?",
    "- Qui en est responsable et comment le sait-il ?",
    "- Comment l'efficacité est-elle vérifiée et améliorée ?",
  ].join("\n");

  return {
    id,
    week,
    type: "lesson",
    dayLabel: `Séance ${id}`,
    title: `${clause.clause} — ${clause.title}`,
    objective: isGuidance
      ? `Maîtriser les recommandations du chapitre « ${clause.clause} » de ${label} et savoir les appliquer en audit.`
      : `Maîtriser les exigences du chapitre « ${clause.clause} » de ${label} et savoir les auditer.`,
    contentMarkdown: body,
    keyTakeaway: clause.summary,
    quiz: clause.quiz ?? [
      {
        question: isGuidance
          ? `Citez deux recommandations clés du chapitre « ${clause.clause} ».`
          : `Citez deux exigences clés du chapitre « ${clause.clause} ».`,
        answer: clause.requirements.slice(0, 2).join(" / "),
      },
    ],
    extras: getClauseExtras(ctx, clause.clause, locale),
  };
}

/** Séances de méthodologie d'audit, communes à toutes les normes. */
function methodologyModules(
  startId: number,
  week: number,
  label: string,
  locale: Locale,
): ProgramModule[] {
  const extras = getMethodologyExtras(locale);
  const items = [
    {
      title: "Principes et vocabulaire de l'audit (ISO 19011:2026)",
      objective: "Connaître les principes de l'audit et le vocabulaire attendu à l'examen.",
      content:
        "## Principes de l'audit (ISO 19011:2026 — lignes directrices)\n\n- Intégrité, présentation impartiale, conscience professionnelle\n- Indépendance, approche fondée sur des preuves, approche par les risques, confidentialité\n\n> ISO 19011 donne des lignes directrices, pas des exigences certifiables. Les règles propres à la certification tierce partie (audit étape 1 / étape 2, classification majeure ou mineure des non-conformités, décision de certification) relèvent d'ISO/IEC 17021-1.\n\n## Vocabulaire\n\nCritères d'audit, preuve d'audit, constat, conclusion, périmètre, programme d'audit.",

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
    ...(extras[index] ? { extras: extras[index] } : {}),
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
  ctx: StandardContext,
  description: string | null,
  clauses: ClauseSpec[],
  glossary: GlossaryEntry[],
  references: StandardReference[],
  locale: Locale,
): Curriculum {
  const label = ctx.label;
  const clauseModules = clauses.map((clause, index) => clauseModule(index + 1, 1, clause, ctx, locale));
  const methodology = methodologyModules(clauseModules.length + 1, 2, label, locale);
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
  const leadModules = leadAuditorModules(label, 4, locale);



  return {
    complete: false,
    title: label,
    subtitle: description ?? "Préparation libre à partir des chapitres du référentiel.",
    weeks: [
      { id: 1, title: "Les chapitres du référentiel", dayIds: clauseModules.map((m) => m.id) },
      { id: 2, title: "Méthodologie d'audit", dayIds: methodology.map((m) => m.id) },
      { id: 3, title: "Consolidation", dayIds: [reviewId] },
      { id: 4, title: "Lead Auditor", dayIds: leadModules.map((m) => m.id) },
    ],
    modules: [...clauseModules, ...methodology, review, ...leadModules],
    glossary: [...glossary, ...getCommonGlossary(locale)].sort((a, b) => a.term.localeCompare(b.term, locale)),
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
export function getCurriculum(
  cert: CurriculumSource | null,
  locale: Locale = "fr",
): Curriculum | null {
  if (!cert) return null;
  if (cert.code === "iso-45001") return iso45001Curriculum(locale);

  const spec = getStandardSpec(cert.code, locale);
  if (spec) {
    return skeletonCurriculum(
      { code: spec.code, label: spec.label, subject: spec.subject, systemName: spec.systemName },
      cert.description,
      spec.clauses,
      spec.glossary,
      spec.references,
      locale,
    );
  }

  // Référentiel personnalisé : uniquement les chapitres saisis par l'utilisateur.
  const clauses: ClauseSpec[] = cert.chapters.map((chapter) => ({
    clause: chapter,
    title: chapter,
    summary:
      locale === "en"
        ? `Clause of the ${cert.name} framework.`
        : `Chapitre du référentiel ${cert.name}.`,
    requirements: [
      locale === "en"
        ? "To be completed with your own notes and course documents."
        : "À compléter avec vos propres notes et documents de cours.",
    ],
  }));
  return skeletonCurriculum(
    { code: cert.code, label: cert.name, subject: "la performance", systemName: "système de management" },
    cert.description,
    clauses,
    [],
    getAuditReferences(locale),
    locale,
  );
}
