import { describe, expect, it } from "vitest";

import { getCurriculum } from "@/data/curriculum";
import { clauseKeyOf, getClauseExtras, methodologyExtras } from "@/data/standard-extras";
import { standardSpecs } from "@/data/standards";
import { buildLessonSections, moduleExtras } from "@/lib/lesson-sections";

const ctx = {
  code: "iso-9001",
  label: "ISO 9001:2015",
  subject: "la qualité",
  systemName: "SMQ",
};

describe("clauseKeyOf", () => {
  it("extrait le numéro de chapitre", () => {
    expect(clauseKeyOf("6. Planification")).toBe("6");
    expect(clauseKeyOf("10 Amélioration")).toBe("10");
  });

  it("reconnaît l'annexe", () => {
    expect(clauseKeyOf("Annexe A — Mesures de sécurité")).toBe("annexe");
  });

  it("renvoie null hors structure harmonisée", () => {
    expect(clauseKeyOf("3. Termes et définitions")).toBeNull();
    expect(clauseKeyOf("Chapitre personnalisé")).toBeNull();
  });
});

describe("getClauseExtras", () => {
  it("fournit une trame pédagogique complète pour chaque chapitre HLS", () => {
    for (const clause of ["4.", "5.", "6.", "7.", "8.", "9.", "10."]) {
      const extras = getClauseExtras(ctx, clause);
      expect(extras.objectives?.length, clause).toBeGreaterThanOrEqual(3);
      expect(extras.auditorView?.length, clause).toBeGreaterThanOrEqual(2);
      expect(extras.evidence?.length, clause).toBeGreaterThanOrEqual(3);
      expect(extras.examFocus?.length, clause).toBeGreaterThanOrEqual(1);
      expect(extras.commonMistakes?.length, clause).toBeGreaterThanOrEqual(2);
      expect(extras.scenario?.prompt, clause).toBeTruthy();
      expect(extras.scenario?.correction, clause).toBeTruthy();
      expect(extras.keyPoints?.length, clause).toBeGreaterThanOrEqual(3);
      expect(extras.flashcards?.length, clause).toBeGreaterThanOrEqual(2);
    }
  });

  it("personnalise le contenu selon la norme", () => {
    const q = getClauseExtras(ctx, "4. Contexte");
    expect(q.objectives?.join(" ")).toContain("la qualité");

    const info = getClauseExtras(
      { code: "iso-27001", label: "ISO/IEC 27001", subject: "la sécurité de l'information", systemName: "SMSI" },
      "4. Contexte",
    );
    expect(info.objectives?.join(" ")).toContain("la sécurité de l'information");
  });

  it("ajoute les spécificités du référentiel sans écraser la trame générique", () => {
    const extras = getClauseExtras(ctx, "9. Évaluation des performances");
    expect(extras.examFocus?.some((t) => t.includes("satisfaction"))).toBe(true);
    expect(extras.examFocus?.length).toBeGreaterThan(1);
    expect(extras.examples?.length).toBeGreaterThanOrEqual(2);
  });

  it("couvre l'Annexe A d'ISO/IEC 27001", () => {
    const extras = getClauseExtras(
      { code: "iso-27001", label: "ISO/IEC 27001", subject: "la sécurité de l'information", systemName: "SMSI" },
      "Annexe A",
    );
    expect(extras.examFocus?.join(" ")).toContain("Déclaration d'applicabilité");
  });

  it("renvoie un contenu vide pour un chapitre hors structure harmonisée", () => {
    expect(getClauseExtras(ctx, "Chapitre maison")).toEqual({});
  });
});

describe("méthodologie d'audit", () => {
  it("fournit trois séances enrichies", () => {
    expect(methodologyExtras).toHaveLength(3);
    for (const extras of methodologyExtras) {
      expect(extras.objectives?.length).toBeGreaterThanOrEqual(3);
      expect(extras.scenario?.correction).toBeTruthy();
      expect(extras.flashcards?.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("cursus générés", () => {
  const source = (code: string, name: string) => ({
    code,
    name,
    description: null,
    chapters: [],
    has_curriculum: false,
  });

  it("attache le contenu pédagogique à chaque séance de chapitre", () => {
    for (const spec of Object.values(standardSpecs)) {
      const curriculum = getCurriculum(source(spec.code, spec.label));
      expect(curriculum, spec.code).not.toBeNull();
      const lessons = curriculum!.modules.filter((m) => m.type === "lesson");
      expect(lessons.length, spec.code).toBeGreaterThan(0);
      for (const lesson of lessons) {
        const extras = moduleExtras(lesson);
        expect(Object.keys(extras).length, `${spec.code} / ${lesson.title}`).toBeGreaterThan(0);
      }
    }
  });

  it("découpe une séance générée en étapes pédagogiques", () => {
    const curriculum = getCurriculum(source("iso-9001", "ISO 9001:2015"))!;
    const lesson = curriculum.modules.find((m) => m.type === "lesson")!;
    const kinds = buildLessonSections(lesson).map((s) => s.kind);
    for (const kind of ["intro", "objectives", "course", "auditor", "evidence", "exam", "mistakes", "scenario", "takeaways", "flashcards"]) {
      expect(kinds, kind).toContain(kind);
    }
  });

  it("enrichit aussi les séances de méthodologie", () => {
    const curriculum = getCurriculum(source("iso-14001", "ISO 14001:2015"))!;
    const practicals = curriculum.modules.filter((m) => m.type === "practical");
    expect(practicals).toHaveLength(3);
    for (const module of practicals) {
      expect(moduleExtras(module).flashcards?.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("laisse le cursus ISO 45001 sur son contenu rédigé", () => {
    const curriculum = getCurriculum(source("iso-45001", "ISO 45001:2018"))!;
    expect(curriculum.complete).toBe(true);
    const first = curriculum.modules[0]!;
    expect(first.extras).toBeUndefined();
    expect(moduleExtras(first).objectives?.length).toBeGreaterThan(0);
  });
});

describe("structure des chapitres par norme", () => {
  const numberOf = (r: string) => /^(\d+\.\d+)/.exec(r.trim())?.[1] ?? null;

  it("n'expose aucun numéro de sous-chapitre en doublon", () => {
    for (const [code, standard] of Object.entries(standardSpecs)) {
      for (const clause of standard.clauses) {
        const numbers = clause.requirements.map(numberOf).filter(Boolean) as string[];
        expect(new Set(numbers).size, `${code} ${clause.clause}`).toBe(numbers.length);
      }
    }
  });

  it("ne mentionne les situations d'urgence que dans les normes concernées", () => {
    const allowed = new Set(["iso-14001", "iso-22000", "iso-22301"]);
    for (const [code, standard] of Object.entries(standardSpecs)) {
      if (allowed.has(code)) continue;
      const text = standard.clauses.flatMap((c) => c.requirements).join(" ").toLowerCase();
      expect(text.includes("urgence"), code).toBe(false);
    }
  });

  it("traite ISO 13485 hors structure harmonisée", () => {
    const clauses = standardSpecs["iso-13485"]!.clauses.map((c) => c.clause);
    expect(clauses).toEqual([
      "4. Système de management de la qualité",
      "5. Responsabilité de la direction",
      "6. Management des ressources",
      "7. Réalisation du produit",
      "8. Mesure, analyse et amélioration",
    ]);
  });
});
