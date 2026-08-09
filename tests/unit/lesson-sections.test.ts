import { describe, expect, it } from "vitest";
import {
  buildLessonSections,
  lessonReadingMinutes,
  readingMinutes,
  sectionTitle,
  splitMarkdownSections,
} from "@/lib/lesson-sections";
import { modules } from "@/data/program";

describe("splitMarkdownSections", () => {
  it("découpe le markdown sur les titres de niveau 3", () => {
    const parts = splitMarkdownSections("intro\n\n### Premier\ncorps 1\n\n### Second\ncorps 2");
    expect(parts).toHaveLength(3);
    expect(parts[0]?.heading).toBeNull();
    expect(parts[1]?.heading).toBe("Premier");
    expect(parts[2]?.body).toContain("corps 2");
  });

  it("retourne une seule partie quand il n'y a pas de titre", () => {
    const parts = splitMarkdownSections("un simple paragraphe");
    expect(parts).toHaveLength(1);
    expect(parts[0]?.heading).toBeNull();
  });

  it("ignore les contenus vides", () => {
    expect(splitMarkdownSections("   \n  \n")).toHaveLength(0);
  });
});

describe("readingMinutes", () => {
  it("retourne au minimum une minute", () => {
    expect(readingMinutes("trois petits mots")).toBe(1);
  });

  it("estime environ 200 mots par minute", () => {
    expect(readingMinutes(Array.from({ length: 600 }, () => "mot").join(" "))).toBe(3);
  });
});

describe("buildLessonSections", () => {
  const lesson = modules.find((m) => m.quiz.length > 0);

  it("expose un module de cours exploitable", () => {
    expect(lesson).toBeDefined();
  });

  it("commence par l'introduction et termine par le quiz", () => {
    const sections = buildLessonSections(lesson!);
    expect(sections[0]?.kind).toBe("intro");
    expect(sections.at(-1)?.kind).toBe("quiz");
  });

  it("génère des identifiants uniques", () => {
    const ids = buildLessonSections(lesson!).map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("respecte l'ordre pédagogique imposé", () => {
    const order = [
      "intro",
      "objectives",
      "course",
      "examples",
      "auditor",
      "evidence",
      "exam",
      "mistakes",
      "scenario",
      "takeaways",
      "flashcards",
      "quiz",
    ];
    const kinds = buildLessonSections(lesson!).map((s) => s.kind);
    const ranks = kinds.map((k) => order.indexOf(k));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("marque les flashcards comme facultatives", () => {
    for (const module of modules) {
      for (const section of buildLessonSections(module)) {
        if (section.kind === "flashcards") expect(section.required).toBe(false);
        else expect(section.required).toBe(true);
      }
    }
  });

  it("ne produit jamais de section sans bloc", () => {
    for (const module of modules) {
      for (const section of buildLessonSections(module)) {
        expect(section.blocks.length).toBeGreaterThan(0);
        expect(section.title.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("lessonReadingMinutes", () => {
  it("retourne une durée positive pour chaque séance", () => {
    for (const module of modules) {
      expect(lessonReadingMinutes(module)).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("sectionTitle", () => {
  it("fournit un intitulé français pour chaque type", () => {
    expect(sectionTitle("quiz")).toBe("Quiz de fin de séance");
    expect(sectionTitle("auditor")).toContain("auditeur");
  });
});
