import { describe, expect, it } from "vitest";

import program from "@/data/program.json";
import { auditReferences } from "@/data/standards";
import { leadAuditorModules } from "@/data/lead-auditor";
import { standardExtras } from "@/data/standard-extras";
import { stripWatermarks } from "@/lib/rag.server";

const serialized = JSON.stringify([
  program,
  auditReferences,
  leadAuditorModules("ISO 45001", 3),
  standardExtras,
]);

describe("politique de référentiels", () => {
  it("ne présente jamais ISO 19011:2018 comme édition en vigueur", () => {
    expect(serialized).not.toContain("19011:2018");
    expect(auditReferences.some((r) => r.code === "ISO 19011:2026")).toBe(true);
  });

  it("n'utilise plus « déontologie » comme principe d'audit", () => {
    expect(serialized.toLowerCase()).not.toContain("déontologie");
  });

  it("attribue la classification majeure / mineure à ISO/IEC 17021-1", () => {
    expect(serialized).toContain("17021-1");
  });

  it("ne cite jamais ISO/DIS 45001 comme référentiel d'exigences", () => {
    expect(serialized).not.toContain("ISO/DIS 45001");
  });
});

describe("détection des documents partiels", () => {
  it("marque un PDF d'aperçu comme partiel", () => {
    const pages = Array.from(
      { length: 5 },
      (_, i) => `iTeh Standard Preview\nhttps://standards.iteh.ai\nContenu utile page ${i + 1}`,
    );
    const result = stripWatermarks(pages);
    expect(result.isPartial).toBe(true);
    expect(result.text).not.toMatch(/iteh/i);
  });

  it("ne marque pas un document normal comme partiel", () => {
    const result = stripWatermarks(["Un document de cours interne sur la sécurité au travail."]);
    expect(result.isPartial).toBe(false);
  });
});
