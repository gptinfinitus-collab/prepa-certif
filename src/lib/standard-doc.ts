import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  deleteStandardDocument,
  getStandardDocument,
  getStandardProgress,
  getStandardSection,
  getStandardToc,
  importOfficialStandard,
  importStandardDocument,
  markStandardSectionRead,
  searchStandard,
} from "@/lib/standard-doc.functions";


/** Document de norme importé pour la certification active. */
export function useStandardDocument(certificationId: string | null) {
  const fn = useServerFn(getStandardDocument);
  return useQuery({
    queryKey: ["standard", "document", certificationId],
    enabled: !!certificationId,
    queryFn: () => fn({ data: { certificationId: certificationId as string } }),
  });
}

/** Sommaire de la norme (chapitres et sections). */
export function useStandardToc(certificationId: string | null) {
  const fn = useServerFn(getStandardToc);
  return useQuery({
    queryKey: ["standard", "toc", certificationId],
    enabled: !!certificationId,
    queryFn: () => fn({ data: { certificationId: certificationId as string } }),
    staleTime: 5 * 60 * 1000,
  });
}

/** Contenu d'une section de la norme. */
export function useStandardSection(sectionId: string) {
  const fn = useServerFn(getStandardSection);
  return useQuery({
    queryKey: ["standard", "section", sectionId],
    queryFn: () => fn({ data: { sectionId } }),
    staleTime: 5 * 60 * 1000,
  });
}

/** Résultats de recherche dans la norme. */
export function useStandardSearch(documentId: string | null | undefined, query: string) {
  const fn = useServerFn(searchStandard);
  const trimmed = query.trim();
  return useQuery({
    queryKey: ["standard", "search", documentId, trimmed],
    enabled: !!documentId && trimmed.length >= 2,
    queryFn: () => fn({ data: { documentId: documentId as string, query: trimmed } }),
    staleTime: 60 * 1000,
  });
}

/** Progression de lecture enregistrée. */
export function useStandardProgress(documentId: string | null | undefined) {
  const fn = useServerFn(getStandardProgress);
  return useQuery({
    queryKey: ["standard", "progress", documentId],
    enabled: !!documentId,
    queryFn: () => fn({ data: { documentId: documentId as string } }),
  });
}

/** Marque une section comme lue. */
export function useMarkStandardSectionRead() {
  const fn = useServerFn(markStandardSectionRead);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { documentId: string; sectionId: string }) => fn({ data: input }),
    onSuccess: (_result, input) =>
      qc.invalidateQueries({ queryKey: ["standard", "progress", input.documentId] }),
  });
}

/** Lance l'import du PDF déjà téléversé. */
export function useImportStandardDocument() {
  const fn = useServerFn(importStandardDocument);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      certificationId: string;
      storagePath: string;
      name: string;
      title: string;
      reference: string | null;
      language: "fr" | "en";
    }) => fn({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["standard"] }),
  });
}

/** Supprime la norme importée. */
export function useDeleteStandardDocument() {
  const fn = useServerFn(deleteStandardDocument);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (certificationId: string) => fn({ data: { certificationId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["standard"] }),
  });
}
