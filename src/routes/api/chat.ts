import { createFileRoute } from "@tanstack/react-router";
import { supabaseFromRequest, streamChat } from "@/lib/chat.server";
import { retrieve } from "@/lib/rag.server";

interface ChatBody {
  threadId?: string;
  question?: string;
  certificationName?: string;
}

function sse(event: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await supabaseFromRequest(request);
        if (!auth) return new Response("Unauthorized", { status: 401 });
        const { supabase, userId } = auth;

        const body = (await request.json()) as ChatBody;
        const question = (body.question ?? "").trim();
        const threadId = body.threadId ?? "";
        if (!question || question.length > 2000) {
          return new Response("Question invalide", { status: 400 });
        }

        const { data: thread } = await supabase
          .from("chat_threads")
          .select("id, title, certification_id")
          .eq("id", threadId)
          .maybeSingle();
        if (!thread) return new Response("Conversation introuvable", { status: 404 });

        const { data: previous } = await supabase
          .from("ai_messages")
          .select("role, content")
          .eq("thread_id", thread.id)
          .order("created_at", { ascending: true })
          .limit(12);

        const { error: userInsertError } = await supabase.from("ai_messages").insert({
          user_id: userId,
          thread_id: thread.id,
          certification_id: thread.certification_id,
          role: "user",
          content: question,
        });
        if (userInsertError) return new Response(userInsertError.message, { status: 500 });

        if (thread.title === "Nouvelle conversation") {
          const title = question.length > 60 ? `${question.slice(0, 57)}…` : question;
          await supabase.from("chat_threads").update({ title }).eq("id", thread.id);
        } else {
          await supabase
            .from("chat_threads")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", thread.id);
        }

        const stream = new ReadableStream({
          async start(controller) {
            let answer = "";
            let sources: { content: string; document_id: string }[] = [];
            try {
              const passages = await retrieve(supabase as never, question);
              sources = passages.map((p) => ({
                content: p.content.slice(0, 400),
                document_id: p.document_id,
              }));
              controller.enqueue(sse({ type: "sources", sources }));

              const sourcesBlock = passages
                .map((p, i) => `[Extrait ${i + 1}]\n${p.content}`)
                .join("\n\n")
                .slice(0, 18000);

              const system = [
                "Tu es un formateur expert des normes ISO et des audits de systèmes de management.",
                `L'apprenant prépare : ${body.certificationName ?? "une certification ISO"}.`,
                "Référentiels à utiliser : ISO 45001:2018 et son Amendement 1:2024 pour la S&ST (n'utilise jamais l'ISO/DIS 45001 comme référentiel d'exigences), ISO 19011:2026 pour les lignes directrices d'audit, ISO/IEC 17021-1 pour le processus de certification tierce partie (audits étape 1 / étape 2, classification majeure ou mineure, décision de certification).",
                "Distingue toujours explicitement une exigence de la norme auditée, une ligne directrice d'audit et une règle de certification : n'attribue jamais à ISO 19011 ce qui relève d'ISO/IEC 17021-1.",
                "Réponds en français, de façon structurée et pédagogique, avec des exemples d'audit concrets.",
                "Quand des extraits de documents personnels sont fournis, appuie-toi dessus en priorité et cite-les sous la forme (Extrait n).",
                "Les documents fournis peuvent n'être que des aperçus partiels d'une norme : ne présume jamais qu'ils couvrent toutes les exigences.",
                "Ne recopie jamais de passages littéraux d'une norme protégée et ne tente jamais de reconstituer son texte officiel : reformule avec tes propres mots.",
                "Si l'information manque, dis-le et propose une piste de révision.",
              ].join(" ");


              const messages = [
                { role: "system" as const, content: system },
                ...(previous ?? []).map((m) => ({
                  role: m.role as "user" | "assistant",
                  content: m.content,
                })),
                {
                  role: "user" as const,
                  content: sourcesBlock
                    ? `Documents personnels pertinents :\n\n${sourcesBlock}\n\nQuestion : ${question}`
                    : question,
                },
              ];

              for await (const delta of streamChat(messages)) {
                answer += delta;
                controller.enqueue(sse({ type: "delta", text: delta }));
              }
            } catch (cause) {
              const message = cause instanceof Error ? cause.message : "Réponse IA indisponible.";
              controller.enqueue(sse({ type: "error", message }));
            }

            if (answer.trim()) {
              const { error } = await supabase.from("ai_messages").insert({
                user_id: userId,
                thread_id: thread.id,
                certification_id: thread.certification_id,
                role: "assistant",
                content: answer,
                sources,
              });
              if (error) {
                console.error("[chat] échec d'enregistrement du message", error.message);
              }
            }

            controller.enqueue(sse({ type: "done" }));
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            "content-type": "text/event-stream; charset=utf-8",
            "cache-control": "no-cache, no-transform",
            connection: "keep-alive",
          },
        });
      },
    },
  },
});
