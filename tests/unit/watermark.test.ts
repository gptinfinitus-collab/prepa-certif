import { describe, expect, it } from "vitest";
import { stripWatermarks, chunkText } from "@/lib/rag.server";

describe("stripWatermarks", () => {
  it("retire le filigrane iTeh STANDARD PREVIEW", () => {
    const { text, removedLines } = stripWatermarks([
      "iTeh STANDARD PREVIEW\n(standards.iteh.ai)\nL'organisme doit établir une politique SST.",
    ]);
    expect(text).toBe("L'organisme doit établir une politique SST.");
    expect(removedLines).toBe(2);
  });

  it("retire les en-têtes répétés et les numéros de page", () => {
    const pages = Array.from(
      { length: 6 },
      (_, i) => `ISO 45001:2018(F)\nContenu utile numéro ${i}\n${i + 1}`,
    );
    const { text, pageCount } = stripWatermarks(pages);
    expect(pageCount).toBe(6);
    expect(text).not.toContain("ISO 45001:2018(F)");
    expect(text).toContain("Contenu utile numéro 3");
  });

  it("conserve le texte légitime d'un document court", () => {
    const { text, removedLines } = stripWatermarks([
      "Article 6.1.2\nIdentification des dangers et évaluation des risques.",
    ]);
    expect(removedLines).toBe(0);
    expect(text).toContain("Identification des dangers");
  });
});

describe("chunkText", () => {
  it("ignore les segments sans contenu exploitable", () => {
    expect(chunkText("--- ... ---")).toEqual([]);
    expect(chunkText("Le système de management doit être documenté. ".repeat(4)).length).toBe(1);
  });
});
