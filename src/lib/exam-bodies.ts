/**
 * Organisme d'examen visé par l'apprenant. Le format des examens Lead Auditor
 * varie fortement d'un organisme à l'autre : le choix conditionne l'ouverture
 * du niveau Lead Auditor et le style des entraînements générés.
 */
export type ExamBodyId = "pecb" | "irca" | "other";

export interface ExamBodyDefinition {
  id: ExamBodyId;
  name: string;
  short: string;
  description: string;
  /** Consigne transmise à l'IA pour caler le style des questions. */
  promptStyle: string;
  /** Nombre de questions conseillé par session d'entraînement. */
  suggestedCount: number;
  /** Mode d'entraînement le plus représentatif de l'examen. */
  suggestedMode: "qcm" | "ouverte";
}

export const EXAM_BODIES: ExamBodyDefinition[] = [
  {
    id: "pecb",
    name: "PECB Lead Auditor",
    short: "PECB",
    description:
      "Examen en domaines de compétences, questions à scénario courtes et essais argumentés, livre ouvert.",
    promptStyle:
      "Style PECB : questions organisées par domaine de compétence, énoncés de scénario courts, réponse argumentée renvoyant explicitement à la clause. Épreuve à livre ouvert : privilégie l'analyse plutôt que la mémorisation.",
    suggestedCount: 6,
    suggestedMode: "qcm",
  },
  {
    id: "irca",
    name: "CQI / IRCA Lead Auditor",
    short: "CQI/IRCA",
    description:
      "Examen écrit de fin de formation : mises en situation longues, rédaction de non-conformités et de constats.",
    promptStyle:
      "Style CQI/IRCA : mises en situation d'audit détaillées, l'apprenant doit identifier le constat, le qualifier (non-conformité majeure/mineure, opportunité d'amélioration), citer la preuve et rédiger l'énoncé de non-conformité.",
    suggestedCount: 4,
    suggestedMode: "ouverte",
  },
  {
    id: "other",
    name: "Autre organisme / non défini",
    short: "Autre",
    description:
      "Préparation générique Lead Auditor : compétences d'audit attendues par la majorité des organismes.",
    promptStyle:
      "Style générique Lead Auditor : mélange de questions de connaissance (ISO 19011, processus de certification) et de mises en situation de pilotage d'équipe d'audit.",
    suggestedCount: 5,
    suggestedMode: "qcm",
  },
];

export function isExamBodyId(value: string | null | undefined): value is ExamBodyId {
  return value === "pecb" || value === "irca" || value === "other";
}

export function getExamBody(id: string | null | undefined): ExamBodyDefinition | null {
  return EXAM_BODIES.find((body) => body.id === id) ?? null;
}

/** Avertissement légal obligatoire dès qu'un organisme est nommé. */
export const EXAM_BODY_DISCLAIMER =
  "PREPA CERTIF est un outil de préparation indépendant. Il n'est affilié à aucun organisme de certification et ne remplace pas une formation accréditée : seuls les organismes délivrent les examens et les certificats.";
