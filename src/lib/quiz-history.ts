/**
 * Logique pure de l'historique d'entraînement : filtres, agrégats et choix du
 * thème à réviser en priorité. Isolée des composants pour rester testable.
 */

export interface QuizSessionRow {
  id: string;
  scope: string;
  topic: string | null;
  mode: string;
  difficulty: string;
  total: number;
  correct: number;
  score: number;
  source_count: number;
  created_at: string;
}

export interface QuizAnswerRow {
  id: string;
  session_id: string;
  position: number;
  chapter: string | null;
  clause: string | null;
  question: string;
  choices: string[] | null;
  expected: string | null;
  explanation: string | null;
  user_answer: string | null;
  is_correct: boolean;
  score: number;
  feedback: string | null;
}

export type ResultFilter = "all" | "correct" | "incorrect";

export const ALL_TOPICS = "__all__";

/** Thèmes disponibles dans l'historique (chapitre travaillé, sinon portée). */
export function sessionTopics(sessions: QuizSessionRow[], locale = "fr"): string[] {
  const set = new Set<string>();
  for (const session of sessions) set.add(session.topic ?? session.scope);
  return [...set].sort((a, b) => a.localeCompare(b, locale));
}

/** Filtre les sessions par thème et par résultat (réussie = score ≥ 60). */
export function filterSessions(
  sessions: QuizSessionRow[],
  { topic = ALL_TOPICS, result = "all" as ResultFilter }: { topic?: string; result?: ResultFilter },
): QuizSessionRow[] {
  return sessions.filter((session) => {
    if (topic !== ALL_TOPICS && (session.topic ?? session.scope) !== topic) return false;
    if (result === "correct" && session.score < 60) return false;
    if (result === "incorrect" && session.score >= 60) return false;
    return true;
  });
}

/** Filtre les réponses d'une session selon le résultat attendu. */
export function filterAnswers(answers: QuizAnswerRow[], result: ResultFilter): QuizAnswerRow[] {
  if (result === "correct") return answers.filter((a) => a.is_correct);
  if (result === "incorrect") return answers.filter((a) => !a.is_correct);
  return answers;
}

export interface TopicStat {
  topic: string;
  attempts: number;
  correct: number;
  ratio: number;
}

/** Taux de réussite par thème, du plus faible au plus solide. */
export function topicStats(
  answers: Pick<QuizAnswerRow, "chapter" | "clause" | "is_correct">[],
): TopicStat[] {
  const map = new Map<string, { attempts: number; correct: number }>();
  for (const answer of answers) {
    const topic = (answer.chapter || answer.clause || "").trim();
    if (!topic) continue;
    const entry = map.get(topic) ?? { attempts: 0, correct: 0 };
    entry.attempts += 1;
    if (answer.is_correct) entry.correct += 1;
    map.set(topic, entry);
  }
  return [...map.entries()]
    .map(([topic, e]) => ({ ...e, topic, ratio: e.correct / e.attempts }))
    .sort((a, b) => a.ratio - b.ratio || b.attempts - a.attempts);
}

/**
 * Thème à réentraîner : le moins bien réussi, en privilégiant un chapitre
 * réellement présent au programme pour que le quiz ciblé soit générable.
 */
export function weakestTopic(
  answers: Pick<QuizAnswerRow, "chapter" | "clause" | "is_correct">[],
  chapters: string[] = [],
): string | null {
  const stats = topicStats(answers).filter((s) => s.ratio < 1);
  if (stats.length === 0) return null;
  if (chapters.length > 0) {
    const known = stats.find((s) => chapters.includes(s.topic));
    if (known) return known.topic;
  }
  return stats[0]!.topic;
}

/** Moyenne des scores, arrondie. */
export function averageScore(sessions: Pick<QuizSessionRow, "score">[]): number {
  if (sessions.length === 0) return 0;
  return Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length);
}

/** Évolution en points entre la moyenne des sessions récentes et des plus anciennes. */
export function scoreTrend(sessions: Pick<QuizSessionRow, "score">[]): number {
  if (sessions.length < 4) return 0;
  const half = Math.floor(sessions.length / 2);
  const recent = averageScore(sessions.slice(0, half));
  const older = averageScore(sessions.slice(sessions.length - half));
  return recent - older;
}

/** `bcp47` : étiquette de langue active (`fr-FR`, `en-GB`). */
export function formatSessionDate(iso: string, bcp47 = "fr-FR"): string {
  return new Intl.DateTimeFormat(bcp47, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
