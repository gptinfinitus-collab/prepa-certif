import { describe, expect, it } from "vitest";
import { EXAM_BODIES, getExamBody, isExamBodyId } from "@/lib/exam-bodies";
import { TRACKS, filterModulesByTrack, getTrack, trackForModule } from "@/lib/tracks";
import { leadAuditorModules, LEAD_AUDITOR_START_ID } from "@/data/lead-auditor";
import { getCurriculum } from "@/data/curriculum";

describe("organismes d'examen", () => {
  it("expose trois profils identifiables", () => {
    expect(EXAM_BODIES.map((b) => b.id)).toEqual(["pecb", "irca", "other"]);
    expect(isExamBodyId("pecb")).toBe(true);
    expect(isExamBodyId("cqi")).toBe(false);
    expect(getExamBody("irca")?.short).toBe("CQI/IRCA");
    expect(getExamBody(null)).toBeNull();
  });

  it("fournit une consigne de style à l'IA pour chaque organisme", () => {
    for (const body of EXAM_BODIES) {
      expect(body.promptStyle.length).toBeGreaterThan(40);
    }
  });
});

describe("niveau Lead Auditor", () => {
  it("est désormais ouvert", () => {
    expect(getTrack("lead_auditor").status).toBe("active");
    expect(TRACKS.every((t) => t.status === "active")).toBe(true);
  });

  it("génère des séances dédiées", () => {
    const modules = leadAuditorModules("ISO 45001:2018", 4);
    expect(modules.length).toBeGreaterThanOrEqual(6);
    expect(modules[0]!.id).toBe(LEAD_AUDITOR_START_ID);
    for (const m of modules) {
      expect(m.track).toBe("lead_auditor");
      expect(m.contentMarkdown).toContain("##");
      expect(trackForModule(m)).toBe("lead_auditor");
    }
  });

  it("cumule audit interne et pilotage d'équipe", () => {
    const modules = [
      { title: "Chapitre 4", objective: "Comprendre le contexte", type: "lesson" as const },
      { title: "Conduire un audit interne", objective: "audit", type: "practical" as const },
      ...leadAuditorModules("ISO 9001:2015", 4),
    ];
    const lead = filterModulesByTrack(modules, "lead_auditor");
    expect(lead.length).toBe(modules.length - 1);
    expect(filterModulesByTrack(modules, "general")).toHaveLength(1);
  });
});

describe("cursus", () => {
  it("intègre les séances Lead Auditor pour ISO 45001 et pour un squelette", () => {
    for (const code of ["iso-45001", "iso-9001"]) {
      const curriculum = getCurriculum({
        code,
        name: code,
        description: null,
        chapters: [],
        has_curriculum: true,
      })!;
      const lead = filterModulesByTrack(curriculum.modules, "lead_auditor");
      expect(lead.some((m) => m.track === "lead_auditor")).toBe(true);
      const ids = curriculum.modules.map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);
      const weekIds = curriculum.weeks.flatMap((w) => w.dayIds);
      expect(weekIds.filter((id) => id >= LEAD_AUDITOR_START_ID).length).toBeGreaterThan(0);
    }
  });
});
