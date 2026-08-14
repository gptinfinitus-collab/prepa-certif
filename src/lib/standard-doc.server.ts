/** Logique serveur du module « Norme » : import du PDF, sections, recherche. */

import { chunkText, embedTexts } from "@/lib/rag.server";
import { splitStandardSections, type ParsedSection } from "@/lib/standard-doc-split";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = any;

export const STANDARD_BUCKET = "iso-library";

/** Extrait le texte d'un PDF page par page. */
export async function extractPdfPages(bytes: ArrayBuffer): Promise<string[]> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const { text } = await extractText(pdf, { mergePages: false });
  return Array.isArray(text) ? (text as string[]) : [text as string];
}

export interface ImportInput {
  certificationId: string;
  storagePath: string;
  name: string;
  title: string;
  reference: string | null;
  language: string;
}

/**
 * Lit le PDF téléversé, le découpe en sections et remplace le contenu
 * précédemment importé pour cette certification.
 */
export async function importStandard(
  supabase: Client,
  userId: string,
  input: ImportInput,
): Promise<{ sectionCount: number; pageCount: number }> {
  const file = await supabase.storage.from(STANDARD_BUCKET).download(input.storagePath);
  if (file.error || !file.data) throw new Error("fileUnreadable");

  const pages = await extractPdfPages(await file.data.arrayBuffer());
  const sections: ParsedSection[] = splitStandardSections(pages);
  if (sections.length === 0) throw new Error("noExtractableText");

  const { data: document, error } = await supabase
    .from("standard_documents")
    .upsert(
      {
        owner_id: userId,
        certification_id: input.certificationId,
        title: input.title,
        reference: input.reference,
        language: input.language,
        storage_path: input.storagePath,
        status: "ready",
        error: null,
        section_count: sections.length,
        page_count: pages.length,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "owner_id,certification_id" },
    )
    .select("id")
    .single();
  if (error || !document) throw new Error(error?.message ?? "importFailed");

  await supabase.from("standard_sections").delete().eq("document_id", document.id);

  const rows = sections.map((section) => ({
    document_id: document.id,
    owner_id: userId,
    order_index: section.order,
    page: section.page,
    chapter: section.chapter,
    clause: section.clause,
    title: section.title.slice(0, 300),
    markdown: section.markdown,
  }));
  for (let i = 0; i < rows.length; i += 200) {
    const { error: insertError } = await supabase
      .from("standard_sections")
      .insert(rows.slice(i, i + 200));
    if (insertError) throw new Error(insertError.message);
  }

  await supabase
    .from("user_standard_progress")
    .delete()
    .eq("user_id", userId)
    .eq("document_id", document.id);

  await indexForAssistant(supabase, userId, input, document.id, sections);

  return { sectionCount: sections.length, pageCount: pages.length };
}

/** Indexe les sections importées pour que l'Assistant IA puisse les citer. */
async function indexForAssistant(
  supabase: Client,
  userId: string,
  input: ImportInput,
  documentId: string,
  sections: ParsedSection[],
): Promise<void> {
  try {
    const { data: library } = await supabase
      .from("library_documents")
      .upsert(
        {
          user_id: userId,
          certification_id: input.certificationId,
          storage_path: input.storagePath,
          name: input.name,
          kind: "norme",
          status: "ready",
          error: null,
          chunk_count: 0,
        },
        { onConflict: "user_id,storage_path" },
      )
      .select("id")
      .single();
    if (!library) return;

    await supabase
      .from("standard_documents")
      .update({ library_document_id: library.id })
      .eq("id", documentId);

    const text = sections.map((s) => `${s.title}\n${s.markdown}`).join("\n\n");
    const chunks = chunkText(text);
    if (chunks.length === 0) return;

    await supabase.from("document_chunks").delete().eq("document_id", library.id);

    let inserted = 0;
    for (let i = 0; i < chunks.length; i += 32) {
      const batch = chunks.slice(i, i + 32);
      const vectors = await embedTexts(batch);
      const rows = batch.map((content, j) => ({
        document_id: library.id,
        user_id: userId,
        chunk_index: i + j,
        content,
        embedding: JSON.stringify(vectors[j]),
      }));
      const { error } = await supabase.from("document_chunks").insert(rows);
      if (error) break;
      inserted += rows.length;
    }

    await supabase
      .from("library_documents")
      .update({ chunk_count: inserted, status: "ready" })
      .eq("id", library.id);
  } catch {
    /* l'indexation IA est un bonus : ne bloque jamais l'import */
  }
}
