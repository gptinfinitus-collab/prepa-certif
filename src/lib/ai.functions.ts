import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  chatComplete,
  chunkText,
  embedTexts,
  extractDocumentText,
} from "@/lib/rag.server";

/** Analyse un document de la bibliothèque et l'indexe pour l'IA. */
export const ingestDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ documentId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: doc, error } = await supabase
      .from("library_documents")
      .select("id, name, storage_path")
      .eq("id", data.documentId)
      .single();
    if (error || !doc) throw new Error("Document introuvable.");

    try {
      const file = await supabase.storage.from("iso-library").download(doc.storage_path);
      if (file.error || !file.data) throw new Error("Fichier illisible dans la bibliothèque.");

      const text = await extractDocumentText(doc.name, await file.data.arrayBuffer());
      const chunks = chunkText(text);
      if (chunks.length === 0) throw new Error("Aucun texte exploitable trouvé dans ce document.");

      await supabase.from("document_chunks").delete().eq("document_id", doc.id);

      const batchSize = 32;
      let inserted = 0;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const vectors = await embedTexts(batch);
        const rows = batch.map((content, j) => ({
          document_id: doc.id,
          user_id: userId,
          chunk_index: i + j,
          content,
          embedding: JSON.stringify(vectors[j]),
        }));
        const { error: insertError } = await supabase.from("document_chunks").insert(rows);
        if (insertError) throw new Error(insertError.message);
        inserted += rows.length;
      }

      await supabase
        .from("library_documents")
        .update({ status: "ready", chunk_count: inserted, error: null })
        .eq("id", doc.id);

      return { chunkCount: inserted };
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Analyse impossible.";
      await supabase
        .from("library_documents")
        .update({ status: "error", error: message })
        .eq("id", doc.id);
      throw new Error(message);
    }
  });

interface Passage {
  content: string;
  document_id: string;
}

async function retrieve(
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> },
  query: string,
  matchCount = 8,
): Promise<Passage[]> {
  const [embedding] = await embedTexts([query]);
  const { data } = await supabase.rpc("match_document_chunks", {
    query_embedding: JSON.stringify(embedding),
    match_count: matchCount,
  });
  return (data as Passage[] | null) ?? [];
}

/** Répond à une question en s'appuyant sur les documents de l'utilisateur. */
export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        question: z.string().min(2).max(2000),
        certificationName: z.string().max(200).optional(),
        certificationId: z.string().uuid().nullable().optional(),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
          .max(10)
          .optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const passages = await retrieve(supabase as never, data.question);

    const sourcesBlock = passages
      .map((p, i) => `[Extrait ${i + 1}]\n${p.content}`)
      .join("\n\n")
      .slice(0, 18000);

    const system = [
      "Tu es un formateur expert des normes ISO et des audits de systèmes de management (référentiel IRCA / ISO 19011).",
      `L'apprenant prépare : ${data.certificationName ?? "une certification ISO"}.`,
      "Réponds en français, de façon structurée et pédagogique, avec des exemples d'audit concrets.",
      "Quand des extraits de documents personnels sont fournis, appuie-toi dessus en priorité et cite-les sous la forme (Extrait n).",
      "Ne recopie jamais de longs passages littéraux d'une norme protégée : reformule.",
      "Si l'information manque, dis-le et propose une piste de révision.",
    ].join(" ");

    const messages = [
      { role: "system" as const, content: system },
      ...(data.history ?? []).map((m) => ({ role: m.role, content: m.content })),
      {
        role: "user" as const,
        content: sourcesBlock
          ? `Documents personnels pertinents :\n\n${sourcesBlock}\n\nQuestion : ${data.question}`
          : data.question,
      },
    ];

    const answer = await chatComplete(messages);

    await supabase.from("ai_messages").insert([
      {
        user_id: userId,
        certification_id: data.certificationId ?? null,
        role: "user",
        content: data.question,
      },
      {
        user_id: userId,
        certification_id: data.certificationId ?? null,
        role: "assistant",
        content: answer,
      },
    ]);

    return { answer, sourceCount: passages.length };
  });

/** Génère un jeu de questions d'entraînement adapté au cursus et aux documents. */
export const generateQuizQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        certificationName: z.string().max(200),
        topic: z.string().max(300).optional(),
        count: z.number().int().min(3).max(10).default(5),
        difficulty: z.enum(["facile", "standard", "examen"]).default("standard"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const topic = data.topic?.trim() || `points clés de ${data.certificationName}`;
    const passages = await retrieve(supabase as never, topic, 6);
    const sourcesBlock = passages.map((p) => p.content).join("\n\n").slice(0, 12000);

    const raw = await chatComplete(
      [
        {
          role: "system",
          content:
            "Tu conçois des questions d'examen d'auditeur ISO (style IRCA). Réponds uniquement en JSON valide.",
        },
        {
          role: "user",
          content: [
            `Certification : ${data.certificationName}.`,
            `Thème : ${topic}.`,
            `Niveau : ${data.difficulty}.`,
            sourcesBlock ? `Extraits des documents de l'apprenant :\n${sourcesBlock}` : "",
            `Génère ${data.count} questions à choix multiples en français.`,
            'Format attendu : {"questions":[{"question":"...","choices":["a","b","c","d"],"answerIndex":0,"explanation":"..."}]}',
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      ],
      { temperature: 0.6, json: true },
    );

    const parsed = z
      .object({
        questions: z
          .array(
            z.object({
              question: z.string(),
              choices: z.array(z.string()).min(2).max(6),
              answerIndex: z.number().int().min(0),
              explanation: z.string().default(""),
            }),
          )
          .min(1),
      })
      .safeParse(JSON.parse(raw || "{}"));

    if (!parsed.success) throw new Error("La génération IA n'a pas renvoyé de questions exploitables.");
    return { questions: parsed.data.questions, sourceCount: passages.length };
  });
