import manual from "@/data/sgs-course.json";

export interface ManualSection {
  id: string;
  order: number;
  page: number;
  chapter: string;
  title: string;
  markdown: string;
}

export interface ManualData {
  id: string;
  title: string;
  publisher: string;
  reference: string;
  language: string;
  chapters: string[];
  sections: ManualSection[];
}

const data = manual as unknown as ManualData;

export interface ManualTocEntry {
  id: string;
  page: number;
  title: string;
}

export interface ManualToc {
  id: string;
  title: string;
  publisher: string;
  reference: string;
  language: string;
  sectionCount: number;
  chapters: { name: string; entries: ManualTocEntry[] }[];
}

/** Sommaire du manuel : chapitres du document et pages qui les composent. */
export function getManualTocData(): ManualToc {
  return {
    id: data.id,
    title: data.title,
    publisher: data.publisher,
    reference: data.reference,
    language: data.language,
    sectionCount: data.sections.length,
    chapters: data.chapters.map((name) => ({
      name,
      entries: data.sections
        .filter((s) => s.chapter === name)
        .map((s) => ({ id: s.id, page: s.page, title: s.title })),
    })),
  };
}

export interface ManualSectionView extends ManualSection {
  index: number;
  total: number;
  previousId: string | null;
  nextId: string | null;
}

/** Une page du manuel, avec ses voisines pour la lecture séquentielle. */
export function getManualSectionData(sectionId: string): ManualSectionView | null {
  const index = data.sections.findIndex((s) => s.id === sectionId);
  if (index === -1) return null;
  const section = data.sections[index]!;
  return {
    ...section,
    index,
    total: data.sections.length,
    previousId: index > 0 ? data.sections[index - 1]!.id : null,
    nextId: index < data.sections.length - 1 ? data.sections[index + 1]!.id : null,
  };
}

export function getFirstSectionId(): string {
  return data.sections[0]!.id;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export interface ManualSearchHit {
  id: string;
  page: number;
  chapter: string;
  title: string;
  snippet: string;
  score: number;
}

/**
 * Recherche plein texte insensible aux accents et à la casse. Une requête entre
 * guillemets est traitée comme une expression exacte, sinon tous les mots
 * doivent être présents dans la page.
 */
export function searchManualData(query: string, limit = 40): ManualSearchHit[] {
  const raw = query.trim();
  if (raw.length < 2) return [];

  const exact = /^".+"$/.test(raw);
  const needle = normalize(exact ? raw.slice(1, -1) : raw);
  const terms = exact ? [needle] : needle.split(/\s+/).filter((t) => t.length > 1);
  if (terms.length === 0) return [];

  const hits: ManualSearchHit[] = [];
  for (const section of data.sections) {
    const haystack = normalize(`${section.title}\n${section.markdown}`);
    const titleHay = normalize(section.title);
    let score = 0;
    let firstIndex = -1;
    let matchedAll = true;

    for (const term of terms) {
      const occurrences = haystack.split(term).length - 1;
      if (occurrences === 0) {
        matchedAll = false;
        break;
      }
      score += occurrences + (titleHay.includes(term) ? 5 : 0);
      const at = haystack.indexOf(term);
      if (firstIndex === -1 || at < firstIndex) firstIndex = at;
    }
    if (!matchedAll) continue;

    const plain = `${section.title}\n${section.markdown}`;
    const start = Math.max(0, firstIndex - 90);
    const snippet = `${start > 0 ? "…" : ""}${plain.slice(start, start + 260).replace(/\s+/g, " ").trim()}…`;

    hits.push({
      id: section.id,
      page: section.page,
      chapter: section.chapter,
      title: section.title,
      snippet,
      score,
    });
  }

  return hits.sort((a, b) => b.score - a.score || a.page - b.page).slice(0, limit);
}
