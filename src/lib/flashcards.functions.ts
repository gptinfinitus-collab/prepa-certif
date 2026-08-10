import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const EVAL_MODEL = "google/gemini-3.6-flash";

const EvaluateInput = z.object({
  question: z.string().min(1),
  expectedAnswer: z.string().min(1),
  userAnswer: z.string().min(1),
});

export type EvaluationStatus = "correct" | "partial" | "incorrect";

export interface EvaluationResult {
  status: EvaluationStatus;
  feedback: string;
}

export const evaluateFlashcardAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => EvaluateInput.parse(input))
  .handler(async ({ data }): Promise<EvaluationResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      throw new Error("Service IA indisponible.");
    }

    const prompt = [
      "Tu évalues une réponse d'apprentissage par rapport à une réponse attendue.",
      "Sois pédagogue et concis (2 à 3 phrases maximum).",
      "Règles d'évaluation :",
      "- 'correct' : la réponse saisie capture le sens essentiel de la réponse attendue, même avec des synonymes ou une formulation différente.",
      "- 'partial' : l'idée générale est présente mais il manque un élément important ou la formulation est imprécise.",
      "- 'incorrect' : la réponse est fausse, hors sujet ou ne reprend pas l'essentiel.",
      "",
      "Réponds UNIQUEMENT au format JSON suivant :",
      '{"status": "correct|partial|incorrect", "feedback": "..."}',
      "",
      "Question :",
      data.question,
      "",
      "Réponse attendue :",
      data.expectedAnswer,
      "",
      "Réponse de l'utilisateur :",
      data.userAnswer,
    ].join("\n");

    const response = await fetch(`${GATEWAY}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: EVAL_MODEL,
        messages: [
          { role: "system", content: "Tu es un évaluateur pédagogique. Tu réponds uniquement en JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (response.status === 429) {
      throw new Error("Limite de requêtes IA atteinte, réessayez dans un instant.");
    }
    if (response.status === 402) {
      throw new Error("Crédits IA épuisés pour cet espace de travail.");
    }
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Réponse IA indisponible (${response.status}): ${detail.slice(0, 200)}`);
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content ?? "";
    const parsed = parseEvaluationJson(content);
    if (!parsed) {
      throw new Error("L'évaluation IA n'a pas pu être lue.");
    }
    return parsed;
  });

function parseEvaluationJson(content: string): EvaluationResult | null {
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    const status = parsed.status;
    const feedback = parsed.feedback;
    if (
      (status === "correct" || status === "partial" || status === "incorrect") &&
      typeof feedback === "string" &&
      feedback.length > 0
    ) {
      return { status, feedback };
    }
  } catch {
    // fallback regex
    const statusMatch = /"status"\s*:\s*"(correct|partial|incorrect)"/.exec(content);
    const feedbackMatch = /"feedback"\s*:\s*"([^"]*)"/.exec(content);
    if (statusMatch) {
      return {
        status: statusMatch[1] as EvaluationStatus,
        feedback: feedbackMatch?.[1] ?? "Évaluation indisponible.",
      };
    }
  }
  return null;
}
