import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const certInput = z.object({ certificationId: z.string().uuid() });

export interface StandardTocEntry {
  id: string;
  page: number;
  title: string;
}

export interface StandardToc {
  documentId: string;
  title: string;
  reference: string | null;
  language: string;
  sectionCount: number;
  chapters: { name: string; entries: StandardTocEntry[] }[];
}

/** Document de norme importé pour la certification active (ou null). */
export const getStandardDocument = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => certInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from("standard_documents")
      .select("id, title, reference, language, status, error, section_count, page_count, storage_path")
      .eq("owner_id", userId)
      .eq("certification_id", data.certificationId)
      .maybeSingle();
    return row ?? null;
  });

/** Sommaire de la norme : chapitres et sections. */
export const getStandardToc = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => certInput.parse(data))
  .handler(async ({ data, context }): Promise<StandardToc | null> => {
    const { supabase, userId } = context;
    const { data: doc } = await supabase
      .from("standard_documents")
      .select("id, title, reference, language")
      .eq("owner_id", userId)
      .eq("certification_id", data.certificationId)
      .maybeSingle();
    if (!doc) return null;

    const { data: sections } = await supabase
      .from("standard_sections")
      .select("id, page, chapter, title")
      .eq("document_id", doc.id)
      .order("order_index", { ascending: true });

    const chapters: { name: string; entries: StandardTocEntry[] }[] = [];
    for (const section of sections ?? []) {
      const last = chapters.at(-1);
      const entry = { id: section.id, page: section.page, title: section.title };
      if (last && last.name === section.chapter) last.entries.push(entry);
      else chapters.push({ name: section.chapter, entries: [entry] });
    }

    return {
      documentId: doc.id,
      title: doc.title,
      reference: doc.reference,
      language: doc.language,
      sectionCount: sections?.length ?? 0,
      chapters,
    };
  });

/** Une section de la norme, avec ses voisines. */
export const getStandardSection = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ sectionId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: section } = await supabase
      .from("standard_sections")
      .select("id, document_id, order_index, page, chapter, clause, title, markdown")
      .eq("id", data.sectionId)
      .eq("owner_id", userId)
      .maybeSingle();
    if (!section) return null;

    const { data: neighbours } = await supabase
      .from("standard_sections")
      .select("id, order_index")
      .eq("document_id", section.document_id)
      .order("order_index", { ascending: true });

    const list = neighbours ?? [];
    const index = list.findIndex((s) => s.id === section.id);
    return {
      ...section,
      index,
      total: list.length,
      previousId: index > 0 ? (list[index - 1]?.id ?? null) : null,
      nextId: index >= 0 && index < list.length - 1 ? (list[index + 1]?.id ?? null) : null,
    };
  });

/** Recherche plein texte dans la norme importée. */
export const searchStandard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ documentId: z.string().uuid(), query: z.string().max(200) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: hits } = await supabase.rpc("search_standard_sections", {
      p_document_id: data.documentId,
      p_query: data.query,
    });
    return (hits ?? []) as { id: string; page: number; chapter: string; title: string; snippet: string }[];
  });

/** Progression de lecture dans la norme. */
export const getStandardProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ documentId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from("user_standard_progress")
      .select("section_id, read_ids")
      .eq("user_id", userId)
      .eq("document_id", data.documentId)
      .maybeSingle();
    return {
      sectionId: row?.section_id ?? null,
      readIds: (row?.read_ids as string[] | null) ?? [],
    };
  });

/** Marque une section comme lue et mémorise la position courante. */
export const markStandardSectionRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ documentId: z.string().uuid(), sectionId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("user_standard_progress")
      .select("read_ids")
      .eq("user_id", userId)
      .eq("document_id", data.documentId)
      .maybeSingle();

    const readIds = new Set(((existing?.read_ids as string[] | null) ?? []).concat(data.sectionId));
    const { error } = await supabase.from("user_standard_progress").upsert(
      {
        user_id: userId,
        document_id: data.documentId,
        section_id: data.sectionId,
        read_ids: [...readIds],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,document_id" },
    );
    if (error) throw new Error(error.message);
    return { readIds: [...readIds] };
  });

/** Importe le PDF téléversé et le découpe en sections navigables. */
export const importStandardDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        certificationId: z.string().uuid(),
        storagePath: z.string().min(1),
        name: z.string().min(1).max(200),
        title: z.string().min(1).max(200),
        reference: z.string().max(200).nullable().default(null),
        language: z.enum(["fr", "en"]).default("fr"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { importStandard } = await import("@/lib/standard-doc.server");
    return importStandard(context.supabase, context.userId, data);
  });

/** Supprime la norme importée pour cette certification. */
export const deleteStandardDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => certInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: doc } = await supabase
      .from("standard_documents")
      .select("id, storage_path")
      .eq("owner_id", userId)
      .eq("certification_id", data.certificationId)
      .maybeSingle();
    if (!doc) return { deleted: false };

    await supabase.storage.from("iso-library").remove([doc.storage_path]);
    await supabase.from("standard_documents").delete().eq("id", doc.id);
    return { deleted: true };
  });
