import { describe, expect, it } from "vitest";

import { resources } from "@/i18n/i18n";

/** Chemins de toutes les clés terminales d'un dictionnaire. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return [prefix];
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

describe("i18n", () => {
  const fr = keyPaths(resources.fr.translation).sort();
  const en = keyPaths(resources.en.translation).sort();

  it("expose exactement les mêmes clés en français et en anglais", () => {
    expect(en.filter((k) => !fr.includes(k))).toEqual([]);
    expect(fr.filter((k) => !en.includes(k))).toEqual([]);
  });

  it("ne laisse aucune valeur vide", () => {
    for (const [locale, dict] of Object.entries(resources)) {
      const stack: unknown[] = [dict.translation];
      while (stack.length) {
        const node = stack.pop();
        if (typeof node === "string") {
          expect(node.length, `valeur vide en ${locale}`).toBeGreaterThan(0);
        } else if (Array.isArray(node)) {
          stack.push(...node);
        } else if (node && typeof node === "object") {
          stack.push(...Object.values(node as Record<string, unknown>));
        }
      }
    }
  });
});
