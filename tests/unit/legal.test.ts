import { describe, expect, it } from "vitest";
import { legalDocuments, legalHead, legalInfo, legalDocument } from "@/lib/legal";

describe("legal documents", () => {
  it("expose les quatre documents attendus", () => {
    expect(legalDocuments.map((d) => d.slug)).toEqual([
      "cgu",
      "confidentialite",
      "cookies",
      "mentions-legales",
    ]);
  });

  it("associe chaque slug à sa route", () => {
    for (const doc of legalDocuments) {
      expect(doc.path).toBe(`/${doc.slug}`);
      expect(legalDocument(doc.slug)).toEqual(doc);
    }
  });

  it("lève une erreur pour un slug inconnu", () => {
    // @ts-expect-error slug volontairement invalide
    expect(() => legalDocument("inconnu")).toThrow();
  });

  it("expose un titre et une description en français et en anglais pour chaque document", () => {
    for (const doc of legalDocuments) {
      expect(doc.title.fr).toBeTruthy();
      expect(doc.title.en).toBeTruthy();
      expect(doc.title.fr).not.toBe(doc.title.en);
      expect(doc.description.fr).toBeTruthy();
      expect(doc.description.en).toBeTruthy();
    }
  });

  it("génère des métadonnées SEO complètes et uniques", () => {
    const titles = new Set<string>();
    for (const doc of legalDocuments) {
      const head = legalHead(doc.slug);
      const meta = Object.fromEntries(
        head.meta.map((m) => [
          "title" in m ? "title" : ((m as Record<string, string>)["name"] ?? (m as Record<string, string>)["property"]),
          "title" in m ? (m as Record<string, string>)["title"] : (m as Record<string, string>)["content"],
        ]),
      );
      expect(meta["title"]).toContain(legalInfo.appName);
      expect(meta["title"]!.length).toBeLessThan(70);
      expect(meta["description"]!.length).toBeLessThan(160);
      expect(meta["og:title"]).toBe(meta["title"]);
      expect(meta["og:type"]).toBe("website");
      expect(meta["twitter:card"]).toBe("summary_large_image");
      expect(meta["og:image"]).toMatch(/^https:\/\//);
      expect(head.links[0]!.href).toBe(`${legalInfo.siteUrl}${doc.path}`);
      titles.add(meta["title"]!);
    }
    expect(titles.size).toBe(legalDocuments.length);
  });
});
