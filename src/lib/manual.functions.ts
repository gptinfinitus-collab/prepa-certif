import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MANUAL_ID = "sgs-iso-45001-lg-2022";

/** Sommaire complet du cours SGS. */
export const getManualToc = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { getManualTocData } = await import("@/lib/sgs-course.server");
    return getManualTocData();
  });

/** Une page du cours, avec ses voisines. */
export const getManualSection = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ sectionId: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { getManualSectionData } = await import("@/lib/sgs-course.server");
    return getManualSectionData(data.sectionId);
  });

/** Recherche plein texte dans le cours. */
export const searchManual = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ query: z.string().max(200) }).parse(data))
  .handler(async ({ data }) => {
    const { searchManualData } = await import("@/lib/sgs-course.server");
    return searchManualData(data.query);
  });

/** Progression de lecture de l'utilisateur dans le cours. */
export const getManualProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_manual_progress")
      .select("section_id, read_ids")
      .eq("user_id", userId)
      .eq("manual_id", MANUAL_ID)
      .maybeSingle();
    return {
      sectionId: data?.section_id ?? null,
      readIds: (data?.read_ids as string[] | null) ?? [],
    };
  });

/** Marque une page comme lue et mémorise la position courante. */
export const markManualSectionRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ sectionId: z.string().min(1) }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("user_manual_progress")
      .select("read_ids")
      .eq("user_id", userId)
      .eq("manual_id", MANUAL_ID)
      .maybeSingle();

    const readIds = new Set(((existing?.read_ids as string[] | null) ?? []).concat(data.sectionId));
    const { error } = await supabase.from("user_manual_progress").upsert(
      {
        user_id: userId,
        manual_id: MANUAL_ID,
        section_id: data.sectionId,
        read_ids: [...readIds],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,manual_id" },
    );
    if (error) throw new Error(error.message);
    return { readIds: [...readIds] };
  });
