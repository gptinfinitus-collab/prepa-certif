import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|tsx|css)$/.test(entry) ? [full] : [];
  });
}

const files = walk("src");

describe("typographie", () => {
  it("n'utilise plus la classe font-serif", () => {
    const offenders = files.filter((file) => readFileSync(file, "utf8").includes("font-serif"));
    expect(offenders).toEqual([]);
  });

  it("définit Inter comme police d'affichage et de corps", () => {
    const css = readFileSync("src/styles.css", "utf8");
    expect(css).toContain('--font-display: "Inter"');
    expect(css).toContain('--font-body: "Inter"');
  });
});
