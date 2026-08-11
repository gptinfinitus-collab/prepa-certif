import { describe, expect, it } from "vitest";
import { LINK_CATEGORIES, USEFUL_LINKS, groupLinksByCategory } from "@/data/useful-links";
import { hostLabel, isValidUrl, normalizeUrl } from "@/lib/useful-links";

describe("normalizeUrl", () => {
  it("ajoute https:// quand le schéma est absent", () => {
    expect(normalizeUrl("iso.org")).toBe("https://iso.org");
  });
  it("conserve un schéma existant", () => {
    expect(normalizeUrl("http://iso.org")).toBe("http://iso.org");
  });
  it("renvoie une chaîne vide pour une saisie vide", () => {
    expect(normalizeUrl("   ")).toBe("");
  });
});

describe("isValidUrl", () => {
  it("accepte http et https", () => {
    expect(isValidUrl("https://quality.org")).toBe(true);
    expect(isValidUrl("http://quality.org")).toBe(true);
    expect(isValidUrl("quality.org/page")).toBe(true);
  });
  it("refuse les schémas non web et les saisies vides", () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("mailto:a@b.c")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });
});

describe("hostLabel", () => {
  it("retire le préfixe www", () => {
    expect(hostLabel("https://www.iso.org/store.html")).toBe("iso.org");
  });
});

describe("groupLinksByCategory", () => {
  it("respecte l'ordre déclaré des catégories", () => {
    const groups = groupLinksByCategory(USEFUL_LINKS);
    const order = groups.map((g) => g.category);
    const expected = LINK_CATEGORIES.filter((c) => order.includes(c));
    expect(order).toEqual(expected);
  });

  it("place les catégories inconnues à la fin", () => {
    const groups = groupLinksByCategory([
      { category: "Perso" },
      { category: "Autre" },
      { category: "Perso" },
    ]);
    expect(groups.map((g) => g.category)).toEqual(["Autre", "Perso"]);
    expect(groups[1]!.links).toHaveLength(2);
  });

  it("n'omet aucun lien du catalogue", () => {
    const total = groupLinksByCategory(USEFUL_LINKS).reduce((n, g) => n + g.links.length, 0);
    expect(total).toBe(USEFUL_LINKS.length);
  });

  it("le catalogue n'utilise que des URL web valides", () => {
    for (const link of USEFUL_LINKS) expect(isValidUrl(link.url)).toBe(true);
  });
});
