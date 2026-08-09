/** Utilitaires serveur pour l'indexation et l'interrogation des documents (RAG). */

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
export const EMBEDDING_DIMENSIONS = 1536;
export const EMBEDDING_MODEL = "google/gemini-embedding-001";
export const CHAT_MODEL = "google/gemini-2.5-flash";

function apiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Service IA indisponible.");
  return key;
}

/** Calcule les vecteurs d'un lot de textes. */
export async function embedTexts(inputs: string[]): Promise<number[][]> {
  const response = await fetch(`${GATEWAY}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: inputs,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Embeddings indisponibles (${response.status}): ${detail.slice(0, 200)}`);
  }
  const payload = (await response.json()) as { data: { embedding: number[]; index: number }[] };
  return payload.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Appelle le modèle de conversation et renvoie le texte produit. */
export async function chatComplete(
  messages: ChatMessage[],
  options: { temperature?: number; json?: boolean } = {},
): Promise<string> {
  const response = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages,
      temperature: options.temperature ?? 0.3,
      ...(options.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (response.status === 429) throw new Error("Limite de requêtes IA atteinte, réessayez dans un instant.");
  if (response.status === 402) throw new Error("Crédits IA épuisés pour cet espace de travail.");
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Réponse IA indisponible (${response.status}): ${detail.slice(0, 200)}`);
  }
  const payload = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return payload.choices[0]?.message.content ?? "";
}

/** Extrait le texte brut d'un document téléversé. */
export async function extractDocumentText(name: string, bytes: ArrayBuffer): Promise<string> {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(bytes));
    const { text } = await extractText(pdf, { mergePages: true });
    return typeof text === "string" ? text : text.join("\n");
  }
  if (lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".csv")) {
    return new TextDecoder().decode(bytes);
  }
  throw new Error("Format non analysable : convertissez le document en PDF, TXT ou Markdown.");
}

/** Découpe un texte en segments d'environ `size` caractères avec recouvrement. */
export function chunkText(text: string, size = 1400, overlap = 200): string[] {
  const clean = text.replace(/\s+\n/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
  if (!clean) return [];
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    const slice = clean.slice(start, end).trim();
    if (slice.length > 40) chunks.push(slice);
    if (end === clean.length) break;
    start = end - overlap;
  }
  return chunks.slice(0, 400);
}
