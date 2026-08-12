import type { ProgramModule } from "@/data/program";

export type TrackId = "general" | "internal_auditor" | "lead_auditor";

export interface TrackDefinition {
  id: TrackId;
  status: "active" | "coming_soon";
  /** Vrai si ce niveau a une note d'avertissement dédiée (voir `quiz.tracks.<id>.note`). */
  hasNote?: boolean;
}

/**
 * Niveaux de parcours. Les libellés (nom, description, note) sont traduits
 * via les clés `quiz.tracks.<id>.*` (voir src/i18n/locales/{fr,en}/quiz.json).
 */
export const TRACKS: TrackDefinition[] = [
  { id: "general", status: "active" },
  { id: "internal_auditor", status: "active" },
  { id: "lead_auditor", status: "active", hasNote: true },
];

export const DEFAULT_TRACK: TrackId = "general";

export function isTrackId(value: string | null | undefined): value is TrackId {
  return value === "general" || value === "internal_auditor" || value === "lead_auditor";
}

export function getTrack(id: TrackId): TrackDefinition {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0]!;
}

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
export function trackForModule(
  module: Pick<ProgramModule, "title" | "objective" | "type"> & { track?: TrackId },
): TrackId {
  if (module.track) return module.track;
  const haystack = `${module.title} ${module.objective}`.toLowerCase();
  if (module.type === "mockExam" || module.type === "practical") return "internal_auditor";
  return AUDIT_KEYWORDS.some((k) => haystack.includes(k)) ? "internal_auditor" : "general";
}

/**
 * Séances affichées pour un niveau. Le niveau Lead Auditor est cumulatif :
 * il reprend la méthodologie d'audit interne et y ajoute les séances de
 * pilotage d'équipe.
 */
export function filterModulesByTrack<
  T extends Pick<ProgramModule, "title" | "objective" | "type"> & { track?: TrackId },
>(modules: T[], track: TrackId): T[] {
  if (track === "lead_auditor") {
    return modules.filter((m) => {
      const t = trackForModule(m);
      return t === "internal_auditor" || t === "lead_auditor";
    });
  }
  return modules.filter((m) => trackForModule(m) === track);
}
