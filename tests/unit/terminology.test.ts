import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Verrouille la terminologie normative ISO 45001:2018 (+ Amd 1:2024) :
 * « S&ST » et non « SST », « traumatisme et pathologie » et non « blessure ».
 * Les seules occurrences tolérées sont pédagogiques (elles citent le terme
 * obsolète pour l'expliquer) et vivent dans program.json.
 */
const files = [
  "src/data/lesson-extras.ts",
  "src/data/standard-extras.ts",
  "src/data/standards.ts",
  "src/data/curriculum.ts",
  "src/data/lead-auditor.ts",
];

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("terminologie S&ST", () => {
  it.each(files)("%s n'emploie pas « SST » seul", (file) => {
    const matches = read(file).match(/(?<![&\w])SST\b/g) ?? [];
    expect(matches).toHaveLength(0);
  });

  it.each(files)("%s n'emploie pas « blessure »", (file) => {
    expect(read(file).toLowerCase()).not.toContain("blessure");
  });

  it("le glossaire du programme définit le danger par traumatisme et pathologie", () => {
    const program = read("src/data/program.json");
    expect(program).toContain("traumatisme et pathologie");
  });
});

describe("hiérarchie des mesures", () => {
  it("emploie « mesures de prévention » et non « mesures de maîtrise »", () => {
    for (const file of [...files, "src/data/program.json"]) {
      expect(read(file).toLowerCase(), file).not.toContain("mesures de maîtrise");
    }
  });
});
