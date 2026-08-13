import { createFileRoute } from "@tanstack/react-router";
import { supabaseFromRequest, streamChat, orderHistory } from "@/lib/chat.server";
import { retrieve } from "@/lib/rag.server";

type Locale = "fr" | "en";

interface ChatBody {
  threadId?: string;
  question?: string;
  certificationName?: string;
  locale?: Locale;
}

function sse(event: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}

/** Consignes système communes au chat assistant (RAG), en français ou en anglais. */
function assistantSystemPrompt(locale: Locale, certificationName?: string): string {
  if (locale === "en") {
    return [
      "You are an expert trainer in ISO management-system standards and audits.",
      `The learner is preparing: ${certificationName ?? "an ISO certification"}.`,
      "Reference frameworks to use: ISO 45001:2018 and its Amendment 1:2024 for OH&S (injury and ill health) requirements (never use ISO/DIS 45001 as a source of requirements), ISO 19011 for audit guidelines, ISO/IEC 17021-1 for third-party certification rules (stage 1 / stage 2 audits, major and minor nonconformity classification, certification decision).",
      "Always explicitly distinguish a requirement of the audited standard, an audit guideline, and a certification rule: never attribute to ISO 19011 what belongs to ISO/IEC 17021-1.",
      "Always answer in the same language as the learner's latest question (French if it is in French, English if it is in English); if the language is ambiguous, answer in English.",
      "Write in a structured and pedagogical way, with concrete audit examples.",
      "When excerpts from personal documents are provided, rely on them first and cite them as (Excerpt n).",
      "The provided documents may only be partial previews of a standard: never assume they cover all requirements.",
      "Never reproduce literal passages of a protected standard and never try to reconstruct its official text: rephrase in your own words.",
      "If information is missing, say so and suggest a revision path.",
    ].join(" ");
  }
  return [
    "Tu es un formateur expert des normes ISO et des audits de systèmes de management.",
    `L'apprenant prépare : ${certificationName ?? "une certification ISO"}.`,
    "Référentiels à utiliser : ISO 45001:2018 et son Amendement 1:2024 pour la S&ST (n'utilise jamais l'ISO/DIS 45001 comme référentiel d'exigences), ISO 19011:2026 pour les lignes directrices d'audit, ISO/IEC 17021-1 pour le processus de certification tierce partie (audits étape 1 / étape 2, classification majeure ou mineure, décision de certification).",
    "Distingue toujours explicitement une exigence de la norme auditée, une ligne directrice d'audit et une règle de certification : n'attribue jamais à ISO 19011 ce qui relève d'ISO/IEC 17021-1.",
    "Réponds toujours dans la langue de la dernière question de l'apprenant (en français si elle est en français, en anglais si elle est en anglais) ; si la langue est ambiguë, réponds en français.",
    "Rédige de façon structurée et pédagogique, avec des exemples d'audit concrets.",
    "Quand des extraits de documents personnels sont fournis, appuie-toi dessus en priorité et cite-les sous la forme (Extrait n).",
    "Les documents fournis peuvent n'être que des aperçus partiels d'une norme : ne présume jamais qu'ils couvrent toutes les exigences.",
    "Ne recopie jamais de passages littéraux d'une norme protégée et ne tente jamais de reconstituer son texte officiel : reformule avec tes propres mots.",
    "Si l'information manque, dis-le et propose une piste de révision.",
  ].join(" ");
}

function userQuestionBlock(locale: Locale, sourcesBlock: string, question: string): string {
  if (locale === "en") {
    return sourcesBlock
      ? `Relevant personal documents:\n\n${sourcesBlock}\n\nQuestion: ${question}`
      : question;
  }
  return sourcesBlock
    ? `Documents personnels pertinents :\n\n${sourcesBlock}\n\nQuestion : ${question}`
    : question;
}

function sourcesLabel(locale: Locale): string {
  return locale === "en" ? "Excerpt" : "Extrait";
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
        const locale: Locale = isLocale(body.locale) ? body.locale : "fr";
        if (!question || question.length > 2000) {
          return new Response("Question invalide", { status: 400 });
        }

        const { data: thread } = await supabase
          .from("chat_threads")
          .select("id, title, certification_id")
          .eq("id", threadId)
          .maybeSingle();
        if (!thread) return new Response("Conversation introuvable", { status: 404 });

        // Les 12 messages LES PLUS RÉCENTS (lus en ordre décroissant puis remis
        // en ordre chronologique) : sinon le modèle ne voit que le début du fil
        // et se répète indéfiniment.
        const { data: recent } = await supabase
          .from("ai_messages")
          .select("role, content, created_at")
          .eq("thread_id", thread.id)
          .order("created_at", { ascending: false })
          .limit(12);
        const previous = orderHistory(recent);

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

        const interruptedMark =
          locale === "en" ? "\n\n_(response interrupted)_" : "\n\n_(réponse interrompue)_";

        const stream = new ReadableStream({
          async start(controller) {
            let answer = "";
            let interrupted = false;
            let closed = false;
            let sources: { content: string; document_id: string }[] = [];

            const push = (chunk: Uint8Array) => {
              if (closed) return;
              try {
                controller.enqueue(chunk);
              } catch {
                closed = true;
              }
            };

            // Battement de cœur : évite qu'un intermédiaire ne coupe un flux long.
            const heartbeat = setInterval(() => {
              push(new TextEncoder().encode(": keep-alive\n\n"));
            }, 10000);

            const onAbort = () => {
              interrupted = true;
              closed = true;
            };
            request.signal.addEventListener("abort", onAbort);

            try {
              const passages = await retrieve(supabase as never, question);
              sources = passages.map((p) => ({
                content: p.content.slice(0, 400),
                document_id: p.document_id,
              }));
              push(sse({ type: "sources", sources }));

              const sourcesBlock = passages
                .map((p, i) => `[${sourcesLabel(locale)} ${i + 1}]\n${p.content}`)
                .join("\n\n")
                .slice(0, 18000);

              const system = assistantSystemPrompt(locale, body.certificationName);

              const messages = [
                { role: "system" as const, content: system },
                ...previous.map((m) => ({
                  role: m.role as "user" | "assistant",
                  content: m.content,
                })),
                {
                  role: "user" as const,
                  content: userQuestionBlock(locale, sourcesBlock, question),
                },
              ];

              for await (const delta of streamChat(messages, { signal: request.signal })) {
                answer += delta;
                push(sse({ type: "delta", text: delta }));
              }
            } catch (cause) {
              const aborted =
                request.signal.aborted ||
                (cause instanceof Error &&
                  (cause.name === "AbortError" || /abort/i.test(cause.message)));
              if (aborted) {
                interrupted = true;
              } else {
                const message = cause instanceof Error ? cause.message : "Réponse IA indisponible.";
                push(sse({ type: "error", message }));
              }
            } finally {
              clearInterval(heartbeat);
              request.signal.removeEventListener("abort", onAbort);
            }

            // La réponse partielle est enregistrée : elle ne doit jamais être perdue.
            if (answer.trim()) {
              const { error } = await supabase.from("ai_messages").insert({
                user_id: userId,
                thread_id: thread.id,
                certification_id: thread.certification_id,
                role: "assistant",
                content: interrupted ? `${answer.trimEnd()}${interruptedMark}` : answer,
                sources,
              });
              if (error) {
                console.error("[chat] échec d'enregistrement du message", error.message);
              }
            }

            push(sse({ type: "done" }));
            if (!closed) {
              closed = true;
              try {
                controller.close();
              } catch {
                /* flux déjà fermé */
              }
            }
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
