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

const WATERMARK_PATTERNS: RegExp[] = [
  /iteh/i,
  /standard\s*preview/i,
  /standards\.iteh\.ai/i,
  /document\s*preview/i,
  /^\(?preview\)?$/i,
  /https?:\/\/standards\./i,
  /full\s*standard\b.*\bpreview/i,
];

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

export interface CleanedText {
  text: string;
  pageCount: number;
  removedLines: number;
}

/**
 * Retire les filigranes et les lignes récurrentes (en-têtes, pieds de page,
 * numéros de page) d'un document extrait page par page.
 */
export function stripWatermarks(pages: string[]): CleanedText {
  const pageLines = pages.map((p) => p.split(/\r?\n/).map(normalizeLine));
  const pageCount = pages.length;

  // Lignes courtes répétées sur une large proportion des pages = bruit d'habillage.
  const occurrences = new Map<string, number>();
  for (const lines of pageLines) {
    for (const line of new Set(lines)) {
      if (!line || line.length > 120) continue;
      occurrences.set(line, (occurrences.get(line) ?? 0) + 1);
    }
  }
  const threshold = Math.max(3, Math.ceil(pageCount * 0.5));
  const recurring = new Set(
    [...occurrences.entries()].filter(([, n]) => pageCount >= 4 && n >= threshold).map(([l]) => l),
  );

  let removedLines = 0;
  const kept: string[] = [];
  for (const lines of pageLines) {
    for (const line of lines) {
      if (!line) {
        kept.push("");
        continue;
      }
      const isNoise =
        recurring.has(line) ||
        /^\d{1,4}$/.test(line) ||
        /^page\s+\d+(\s*(\/|sur|of)\s*\d+)?$/i.test(line) ||
        WATERMARK_PATTERNS.some((re) => re.test(line));
      if (isNoise) {
        removedLines += 1;
        continue;
      }
      kept.push(line);
    }
    kept.push("");
  }

  const text = kept
    .join("\n")
    .replace(/([a-zà-ÿ,;:])-\n([a-zà-ÿ])/g, "$1$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { text, pageCount, removedLines };
}

/** Extrait le texte brut d'un document téléversé, filigranes retirés. */
export async function extractDocumentText(name: string, bytes: ArrayBuffer): Promise<CleanedText> {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(bytes));
    const { text } = await extractText(pdf, { mergePages: false });
    const pages = Array.isArray(text) ? (text as string[]) : [text as string];
    return stripWatermarks(pages);
  }
  if (lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".csv")) {
    const decoded = new TextDecoder().decode(bytes);
    return stripWatermarks([decoded]);
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
    // Ignore les segments sans contenu réellement exploitable.
    if (slice.replace(/[^\p{L}\p{N}]/gu, "").length > 60) chunks.push(slice);
    if (end === clean.length) break;
    start = end - overlap;
  }
  return chunks.slice(0, 400);
}


interface Passage {
  content: string;
  document_id: string;
}

/** Recherche sémantique dans les documents indexés de l'utilisateur. */
export async function retrieve(
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

