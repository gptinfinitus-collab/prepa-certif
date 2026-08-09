import { describe, expect, it } from "vitest";
import {
  ALL_TOPICS,
  averageScore,
  filterAnswers,
  filterSessions,
  scoreTrend,
  sessionTopics,
  topicStats,
  weakestTopic,
  type QuizAnswerRow,
  type QuizSessionRow,
} from "@/lib/quiz-history";

function session(partial: Partial<QuizSessionRow> & { id: string }): QuizSessionRow {
  return {
    scope: "Programme complet",
    topic: null,
    mode: "qcm",
    difficulty: "examen",
    total: 5,
    correct: 3,
    score: 60,
    source_count: 0,
    created_at: "2026-08-01T10:00:00.000Z",
    ...partial,
  };
}

function answer(partial: Partial<QuizAnswerRow> & { id: string }): QuizAnswerRow {
  return {
    session_id: "s1",
    position: 0,
    chapter: null,
    clause: null,
    question: "Q",
    choices: null,
    expected: null,
    explanation: null,
    user_answer: null,
    is_correct: false,
    score: 0,
    feedback: null,
    ...partial,
  };
}

const sessions = [
  session({ id: "a", topic: "Chapitre 6", score: 40 }),
  session({ id: "b", topic: "Chapitre 9", score: 80 }),
  session({ id: "c", topic: "Chapitre 6", score: 90 }),
  session({ id: "d", topic: null, scope: "Programme complet", score: 30 }),
];

describe("filtres de l'historique", () => {
  it("liste les thèmes rencontrés, chapitre ou portée", () => {
    expect(sessionTopics(sessions)).toEqual(["Chapitre 6", "Chapitre 9", "Programme complet"]);
  });

  it("filtre par thème", () => {
    expect(filterSessions(sessions, { topic: "Chapitre 6" }).map((s) => s.id)).toEqual(["a", "c"]);
    expect(filterSessions(sessions, { topic: ALL_TOPICS })).toHaveLength(4);
  });

  it("filtre par résultat au seuil de 60", () => {
    expect(filterSessions(sessions, { result: "correct" }).map((s) => s.id)).toEqual(["b", "c"]);
    expect(filterSessions(sessions, { result: "incorrect" }).map((s) => s.id)).toEqual(["a", "d"]);
  });

  it("combine thème et résultat", () => {
    expect(
      filterSessions(sessions, { topic: "Chapitre 6", result: "incorrect" }).map((s) => s.id),
    ).toEqual(["a"]);
  });

  it("filtre les réponses d'une session", () => {
    const rows = [
      answer({ id: "1", is_correct: true }),
      answer({ id: "2", is_correct: false }),
    ];
    expect(filterAnswers(rows, "correct").map((r) => r.id)).toEqual(["1"]);
    expect(filterAnswers(rows, "incorrect").map((r) => r.id)).toEqual(["2"]);
    expect(filterAnswers(rows, "all")).toHaveLength(2);
  });
});

describe("agrégats et ciblage des erreurs", () => {
  const rows = [
    answer({ id: "1", chapter: "Chapitre 6", is_correct: false }),
    answer({ id: "2", chapter: "Chapitre 6", is_correct: false }),
    answer({ id: "3", chapter: "Chapitre 9", is_correct: true }),
    answer({ id: "4", chapter: "Chapitre 9", is_correct: false }),
    answer({ id: "5", chapter: null, clause: "7.5", is_correct: true }),
    answer({ id: "6", chapter: null, clause: null, is_correct: false }),
  ];

  it("classe les thèmes du plus faible au plus solide", () => {
    const stats = topicStats(rows);
    expect(stats.map((s) => s.topic)).toEqual(["Chapitre 6", "Chapitre 9", "7.5"]);
    expect(stats[0]).toMatchObject({ attempts: 2, correct: 0, ratio: 0 });
  });

  it("ignore les réponses sans thème identifiable", () => {
    expect(topicStats(rows).reduce((s, t) => s + t.attempts, 0)).toBe(5);
  });

  it("propose le thème le plus faible présent au programme", () => {
    expect(weakestTopic(rows, ["Chapitre 6", "Chapitre 9"])).toBe("Chapitre 6");
    expect(weakestTopic(rows, ["Chapitre 9"])).toBe("Chapitre 9");
    expect(weakestTopic(rows)).toBe("Chapitre 6");
  });

  it("ne propose rien quand tout est réussi", () => {
    expect(weakestTopic([answer({ id: "1", chapter: "Chapitre 4", is_correct: true })])).toBeNull();
    expect(weakestTopic([])).toBeNull();
  });

  it("calcule moyenne et tendance", () => {
    expect(averageScore(sessions)).toBe(60);
    expect(averageScore([])).toBe(0);
    expect(scoreTrend(sessions)).toBe(0);
    expect(
      scoreTrend([
        session({ id: "1", score: 90 }),
        session({ id: "2", score: 80 }),
        session({ id: "3", score: 40 }),
        session({ id: "4", score: 30 }),
      ]),
    ).toBe(50);
  });
});
