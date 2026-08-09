import type { ProgramModule } from "@/data/program";

export type TrackId = "general" | "internal_auditor" | "lead_auditor";

export interface TrackDefinition {
  id: TrackId;
  name: string;
  short: string;
  description: string;
  status: "active" | "coming_soon";
  note?: string;
}

export const TRACKS: TrackDefinition[] = [
  {
    id: "general",
    name: "Maîtrise de la norme",
    short: "Maîtrise",
    description:
      "Comprendre les exigences, leur raison d'être et leur application dans une organisation.",
    status: "active",
  },
  {
    id: "internal_auditor",
    name: "Auditeur interne",
    short: "Auditeur interne",
    description:
      "Préparer, conduire et restituer un audit interne : preuves, constats, rapport.",
    status: "active",
  },
  {
    id: "lead_auditor",
    name: "Lead Auditor",
    short: "Lead Auditor",
    description:
      "Niveau en préparation : pilotage d'équipe d'audit et audit de certification.",
    status: "coming_soon",
    note:
      "Les examens Lead Auditor dépendent de l'organisme (PECB, CQI/IRCA, autres) : format, durée et règles varient. Ce niveau sera ouvert avec un profil d'examen documenté, propre à l'organisme choisi.",
  },
];

export const DEFAULT_TRACK: TrackId = "general";

export function isTrackId(value: string | null | undefined): value is TrackId {
  return value === "general" || value === "internal_auditor" || value === "lead_auditor";
}

export function getTrack(id: TrackId): TrackDefinition {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0]!;
}

/**
 * Avertissement affiché partout où un entraînement pourrait être confondu avec
 * l'examen réel d'un organisme de certification.
 */
export const MOCK_EXAM_DISCLAIMER =
  "Entraînement PREPA CERTIF. Ce test ne reproduit pas l'examen d'un organisme précis : le format, la durée et les règles varient selon l'organisme (PECB, CQI/IRCA, autres).";

const AUDIT_KEYWORDS = [
  "audit",
  "auditeur",
  "iso 19011",
  "constat",
  "non-conformité",
  "cas pratique",
  "examen blanc",
];

/** Niveau auquel une séance appartient. */
export function trackForModule(module: Pick<ProgramModule, "title" | "objective" | "type">): TrackId {
  const haystack = `${module.title} ${module.objective}`.toLowerCase();
  if (module.type === "mockExam" || module.type === "practical") return "internal_auditor";
  return AUDIT_KEYWORDS.some((k) => haystack.includes(k)) ? "internal_auditor" : "general";
}

export function filterModulesByTrack<T extends Pick<ProgramModule, "title" | "objective" | "type">>(
  modules: T[],
  track: TrackId,
): T[] {
  if (track === "lead_auditor") return [];
  return modules.filter((m) => trackForModule(m) === track);
}
