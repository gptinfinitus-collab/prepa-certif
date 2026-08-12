import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getManualProgress,
  getManualSection,
  getManualToc,
  markManualSectionRead,
  searchManual,
} from "@/lib/manual.functions";

/** Sommaire du cours (chapitres et pages). */
export function useManualToc() {
  const fn = useServerFn(getManualToc);
  return useQuery({ queryKey: ["manual", "toc"], queryFn: () => fn(), staleTime: Infinity });
}

/** Contenu d'une page du cours. */
export function useManualSection(sectionId: string) {
  const fn = useServerFn(getManualSection);
  return useQuery({
    queryKey: ["manual", "section", sectionId],
    queryFn: () => fn({ data: { sectionId } }),
    staleTime: Infinity,
  });
}

/** Résultats de recherche dans le cours. */
export function useManualSearch(query: string) {
  const fn = useServerFn(searchManual);
  const trimmed = query.trim();
  return useQuery({
    queryKey: ["manual", "search", trimmed],
    enabled: trimmed.length >= 2,
    queryFn: () => fn({ data: { query: trimmed } }),
    staleTime: 60 * 1000,
  });
}

/** Progression de lecture enregistrée. */
export function useManualProgress() {
  const fn = useServerFn(getManualProgress);
  return useQuery({ queryKey: ["manual", "progress"], queryFn: () => fn() });
}

/** Marque une page comme lue. */
export function useMarkManualSectionRead() {
  const fn = useServerFn(markManualSectionRead);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: string) => fn({ data: { sectionId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["manual", "progress"] }),
  });
}

/** Découpe un texte pour surligner les termes recherchés. */
export function highlightParts(text: string, query: string): { text: string; hit: boolean }[] {
  const raw = query.trim().replace(/^"|"$/g, "");
  const terms = raw
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (terms.length === 0) return [{ text, hit: false }];

  const regex = new RegExp(`(${terms.join("|")})`, "gi");
  return text
    .split(regex)
    .filter((part) => part !== "")
    .map((part) => ({ text: part, hit: regex.test(part) && new RegExp(`^(${terms.join("|")})$`, "i").test(part) }));
}
