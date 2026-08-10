import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const EvaluateInput = z.object({
  question: z.string().min(1),
  expectedAnswer: z.string().min(1),
  userAnswer: z.string().min(1),
});

const EvaluationSchema = z.object({
  status: z.enum(["correct", "partial", "incorrect"]),
  feedback: z.string().min(1),
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

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3.6-flash");

    const prompt = [
      "Tu évalues une réponse d'apprentissage par rapport à une réponse attendue.",
      "Sois pédagogue et concis (2 à 3 phrases maximum).",
      "Règles d'évaluation :",
      "- 'correct' : la réponse saisie capture le sens essentiel de la réponse attendue, même avec des synonymes ou une formulation différente.",
      "- 'partial' : l'idée générale est présente mais il manque un élément important ou la formulation est imprécise.",
      "- 'incorrect' : la réponse est fausse, hors sujet ou ne reprend pas l'essentiel.",
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

    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: EvaluationSchema }),
        prompt,
      });
      return output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        const fallback = parseFallbackEvaluation(error.text);
        if (fallback) return fallback;
      }
      throw error;
    }
  });

function parseFallbackEvaluation(text: string): EvaluationResult | null {
  const lower = text.toLowerCase();
  let status: EvaluationStatus = "incorrect";
  if (lower.includes('"status": "correct"') || lower.includes("'status': 'correct'")) {
    status = "correct";
  } else if (lower.includes('"status": "partial"') || lower.includes("'status': 'partial'")) {
    status = "partial";
  }
  const feedback = text.replace(/.*"feedback"\s*[:=]\s*["']?/s, "").replace(/["']?\s*\}?\s*$/s, "").trim();
  return { status, feedback: feedback || "Évaluation indisponible." };
}
