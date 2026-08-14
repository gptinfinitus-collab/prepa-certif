/**
 * Découpage d'une norme extraite page par page en sections navigables
 * (chapitre, numéro de clause, titre, contenu markdown).
 *
 * Module pur : aucune dépendance serveur, testable unitairement.
 */

export interface ParsedSection {
  order: number;
  page: number;
  chapter: string;
  clause: string | null;
  title: string;
  markdown: string;
}

const NOISE_PATTERNS: RegExp[] = [
  /^\d{1,4}$/,
  /^page\s+\d+(\s*(\/|sur|of)\s*\d+)?$/i,
  /iteh/i,
  /standard\s*preview/i,
  /standards\.iteh\.ai/i,
  /^https?:\/\/\S+$/i,
  /tous droits réservés/i,
  /all rights reserved/i,
];

/** Titres de parties liminaires reconnus sans numérotation. */
const FRONT_MATTER =
  /^(avant-propos|foreword|introduction|sommaire|contents|bibliographie|bibliography)\b/i;

const ANNEX = /^(annexe|annex)\s+([A-Z])\b\s*(.*)$/i;

/** Ex. « 6.1.2 Appréciation des risques ». */
const CLAUSE = /^(\d{1,2}(?:\.\d{1,3}){0,3})\.?\s+(\S.{1,110})$/;

function normalize(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

/** Repère les lignes d'habillage répétées sur une large part des pages. */
function recurringLines(pages: string[][]): Set<string> {
  const count = new Map<string, number>();
  for (const lines of pages) {
    for (const line of new Set(lines)) {
      if (!line || line.length > 120) continue;
      count.set(line, (count.get(line) ?? 0) + 1);
    }
  }
  const threshold = Math.max(3, Math.ceil(pages.length * 0.5));
  return new Set(
    [...count.entries()]
      .filter(() => pages.length >= 4)
      .filter(([, n]) => n >= threshold)
      .map(([line]) => line),
  );
}

function isNoise(line: string, recurring: Set<string>): boolean {
  if (recurring.has(line)) return true;
  return NOISE_PATTERNS.some((re) => re.test(line));
}

interface Draft {
  page: number;
  chapter: string;
  clause: string | null;
  title: string;
  lines: string[];
}

function toMarkdown(lines: string[]): string {
  return lines
    .join("\n")
    .replace(/([a-zà-ÿ,;:])-\n([a-zà-ÿ])/g, "$1$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Découpe le texte d'une norme en sections. Le découpage suit la numérotation
 * officielle (4, 4.1, 4.1.2…), les annexes et les parties liminaires. Faute de
 * titres détectables, chaque page devient une section.
 */
export function splitStandardSections(pages: string[]): ParsedSection[] {
  const pageLines = pages.map((page) => page.split(/\r?\n/).map(normalize));
  const recurring = recurringLines(pageLines);

  const drafts: Draft[] = [];
  const chapterTitles = new Map<string, string>();
  let current: Draft | null = null;

  const start = (page: number, chapter: string, clause: string | null, title: string) => {
    current = { page, chapter, clause, title, lines: [] };
    drafts.push(current);
  };

  pageLines.forEach((lines, index) => {
    const page = index + 1;
    for (const line of lines) {
      if (!line) {
        if (current && current.lines.at(-1) !== "") current.lines.push("");
        continue;
      }
      if (isNoise(line, recurring)) continue;

      const annex = ANNEX.exec(line);
      if (annex) {
        const letter = (annex[2] ?? "").toUpperCase();
        const chapter = `Annexe ${letter}`;
        chapterTitles.set(chapter, chapter);
        start(page, chapter, null, normalize(`${chapter} ${annex[3] ?? ""}`));
        continue;
      }

      const clause = CLAUSE.exec(line);
      if (clause) {
        const number = clause[1] ?? "";
        const title = clause[2] ?? "";
        const top = number.split(".")[0] ?? number;
        if (!number.includes(".")) chapterTitles.set(top, `${top}. ${title}`);
        const chapter = chapterTitles.get(top) ?? `Chapitre ${top}`;
        start(page, chapter, number, `${number} ${title}`);
        continue;
      }

      if (FRONT_MATTER.test(line) && line.length <= 60) {
        start(page, "Introduction", null, line);
        continue;
      }

      if (!current) start(page, "Introduction", null, "Introduction");
      current!.lines.push(line);
    }
  });

  const sections = drafts
    .map((draft) => ({ ...draft, markdown: toMarkdown(draft.lines) }))
    .filter((draft) => draft.title.length > 0);

  if (sections.length < 2) {
    return pageLines
      .map((lines, index) => ({
        order: index,
        page: index + 1,
        chapter: "Document",
        clause: null,
        title: `Page ${index + 1}`,
        markdown: toMarkdown(lines.filter((line) => !isNoise(line, recurring))),
      }))
      .filter((section) => section.markdown.length > 0);
  }

  return sections.map((section, order) => ({
    order,
    page: section.page,
    chapter: section.chapter,
    clause: section.clause,
    title: section.title,
    markdown: section.markdown,
  }));
}
