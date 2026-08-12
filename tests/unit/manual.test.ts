import { describe, expect, it } from "vitest";
import {
  getFirstSectionId,
  getManualSectionData,
  getManualTocData,
  searchManualData,
} from "@/lib/sgs-course.server";

describe("sommaire du cours SGS", () => {
  const toc = getManualTocData();

  it("expose toutes les pages du guide", () => {
    expect(toc.sectionCount).toBe(244);
    expect(toc.chapters.length).toBeGreaterThan(5);
    expect(toc.chapters.map((c) => c.name)).toContain("PREMIÈRE SÉANCE");
  });

  it("chaîne les pages dans l'ordre du document", () => {
    const first = getManualSectionData(getFirstSectionId());
    expect(first?.page).toBe(1);
    expect(first?.previousId).toBeNull();
    const second = getManualSectionData(first!.nextId!);
    expect(second?.page).toBe(2);
    expect(second?.previousId).toBe(first!.id);
  });

  it("renvoie null pour une page inconnue", () => {
    expect(getManualSectionData("p9999")).toBeNull();
  });
});

describe("recherche dans le cours", () => {
  it("ignore accents et casse", () => {
    const hits = searchManualData("seance");
    const accented = searchManualData("SÉANCE");
    expect(hits.length).toBeGreaterThan(0);
    expect(accented.length).toBe(hits.length);
  });

  it("exige tous les mots de la requête", () => {
    const hits = searchManualData("non-conformité majeure");
    expect(hits.every((h) => h.snippet.length > 0)).toBe(true);
    expect(searchManualData("zzzzz inexistant")).toEqual([]);
  });

  it("gère l'expression exacte entre guillemets", () => {
    const exact = searchManualData('"plan d\'audit"');
    expect(Array.isArray(exact)).toBe(true);
  });

  it("ignore les requêtes trop courtes", () => {
    expect(searchManualData("a")).toEqual([]);
  });
});
