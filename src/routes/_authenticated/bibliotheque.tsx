import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/queries";
import { useActiveCertification } from "@/lib/certifications";
import { ingestDocument } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Download, FileText, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useT } from "@/i18n";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/_authenticated/bibliotheque")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "library", "/bibliotheque");
  },
  component: Bibliotheque,
});

function useKinds() {
  const t = useT();
  return [
    { value: "cours", label: t("common.courseSupport") },
    { value: "norme", label: t("common.standardCopy") },
    { value: "autre", label: t("common.otherDocument") },
  ];
}

function Bibliotheque() {
  const t = useT();
  const kinds = useKinds();
  const { data: user } = useSession();
  const { certificationId } = useActiveCertification();
  const ingest = useServerFn(ingestDocument);
  const queryClient = useQueryClient();
  const [kind, setKind] = useState("cours");
  const [uploading, setUploading] = useState(false);

  const documents = useQuery({
    queryKey: ["library_documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("library_documents")
        .select("id, name, kind, status, error, chunk_count, is_partial, storage_path, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const analyse = useMutation({
    mutationFn: async (documentId: string) => ingest({ data: { documentId } }),
    onSuccess: (result) => {
      const cleaned =
        result.removedLines > 0
          ? t("common.watermarkRemovedNotice", { count: result.removedLines })
          : "";
      toast.success(
        t("common.documentIndexedToast", { count: result.chunkCount, cleaned }),
      );
      if (result.pageCount > 3 && result.chunkCount < 5) {
        toast.warning(t("common.previewExtractWarning"));
      }
      void queryClient.invalidateQueries({ queryKey: ["library_documents"] });
    },

    onError: (error: Error) => {
      toast.error(error.message);
      void queryClient.invalidateQueries({ queryKey: ["library_documents"] });
    },
  });

  async function handleUpload(file: File) {
    if (!user) return;
    setUploading(true);
    const path = `${user.id}/${file.name}`;
    const upload = await supabase.storage.from("iso-library").upload(path, file, { upsert: true });
    if (upload.error) {
      setUploading(false);
      toast.error(t("common.uploadFailed"));
      return;
    }
    const { data: row, error } = await supabase
      .from("library_documents")
      .upsert(
        {
          user_id: user.id,
          certification_id: certificationId,
          storage_path: path,
          name: file.name,
          kind,
          status: "pending",
          error: null,
          chunk_count: 0,
        },
        { onConflict: "user_id,storage_path" },
      )
      .select("id")
      .single();
    setUploading(false);
    if (error || !row) {
      toast.error(t("common.documentSaveImpossible"));
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["library_documents"] });
    toast.success(t("common.documentAddedAnalyzing"));
    analyse.mutate(row.id);
  }

  async function handleOpen(path: string) {
    const { data, error } = await supabase.storage.from("iso-library").createSignedUrl(path, 300);
    if (error || !data) {
      toast.error(t("common.linkUnavailable"));
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function handleDelete(id: string, path: string) {
    await supabase.storage.from("iso-library").remove([path]);
    const { error } = await supabase.from("library_documents").delete().eq("id", id);
    if (error) {
      toast.error(t("common.deleteImpossible"));
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["library_documents"] });
  }

  const list = documents.data ?? [];

  return (
    <AppShell title={t("common.myDocuments")}>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.myDocuments")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("common.myDocumentsIntro")}
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-sans text-lg">{t("common.addDocument")}</CardTitle>
            <CardDescription>
              {t("common.addDocumentDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger aria-label={t("common.documentType")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kinds.map((k) => (
                  <SelectItem key={k.value} value={k.value}>
                    {k.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="file"
              accept=".pdf,.txt,.md,.csv"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
            {uploading && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                {t("common.uploadInProgress")}
              </p>
            )}
          </CardContent>
        </Card>

        <section className="mt-8">
          <h2 className="font-sans text-xl font-semibold">{t("common.knowledgeBase")}</h2>
          {list.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">{t("common.noDocumentYet")}</p>
          ) : (
            <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
              {list.map((doc) => (
                <li key={doc.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-2 sm:basis-full lg:basis-auto">
                    <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span className="min-w-0 flex-1 break-words text-sm">{doc.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {kinds.find((k) => k.value === doc.kind)?.label ?? doc.kind}
                    </Badge>
                    {doc.status === "ready" ? (
                      <Badge className="bg-cert/15 text-cert" variant="secondary">
                        {t("common.indexed")} · {doc.chunk_count} {t("common.extractsUnit")}
                      </Badge>
                    ) : doc.status === "error" ? (
                      <Badge variant="destructive" title={doc.error ?? undefined}>
                        {t("common.analysisFailed")}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{t("common.awaitingAnalysis")}</Badge>
                    )}
                    {doc.is_partial ? (
                      <Badge
                        variant="outline"
                        className="border-amber-500/50 text-amber-600 dark:text-amber-400"
                        title={t("common.partialExtractTitle")}
                      >
                        {t("common.partialExtract")}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="-ml-2 flex flex-wrap items-center gap-1 sm:ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={analyse.isPending}
                      onClick={() => analyse.mutate(doc.id)}
                    >
                      {analyse.isPending && analyse.variables === doc.id ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : (
                        <Sparkles className="size-4" aria-hidden />
                      )}
                      {doc.status === "ready" ? t("common.reindex") : t("common.analyze")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpen(doc.storage_path)}>
                      <Download className="size-4" aria-hidden />
                      {t("common.open")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id, doc.storage_path)}
                    >
                      <Trash2 className="size-4 text-destructive" aria-hidden />
                      <span className="sr-only">{t("common.deleteDocument", { name: doc.name })}</span>
                    </Button>
                  </div>
                </li>

              ))}
            </ul>
          )}
          {list.some((d) => d.status === "error") && (
            <p className="mt-3 text-xs text-muted-foreground">
              {t("common.analysisFailedNotice")}
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
