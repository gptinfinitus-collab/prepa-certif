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

export const Route = createFileRoute("/_authenticated/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Mes documents — PREPA ISO" },
      {
        name: "description",
        content:
          "Déposez vos supports de cours et vos exemplaires de normes : ils sont indexés pour alimenter l'assistant IA et les quiz personnalisés.",
      },
      { property: "og:title", content: "Mes documents — PREPA ISO" },
      {
        property: "og:description",
        content: "Bibliothèque privée indexée pour l'assistant IA de préparation ISO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Bibliotheque,
});

const kinds = [
  { value: "cours", label: "Support de cours" },
  { value: "norme", label: "Exemplaire de norme" },
  { value: "autre", label: "Autre document" },
];

function Bibliotheque() {
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
        .select("id, name, kind, status, error, chunk_count, storage_path, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const analyse = useMutation({
    mutationFn: async (documentId: string) => ingest({ data: { documentId } }),
    onSuccess: (result) => {
      toast.success(`Document indexé : ${result.chunkCount} extraits disponibles pour l'IA.`);
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
      toast.error("Le téléversement a échoué.");
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
      toast.error("Enregistrement du document impossible.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["library_documents"] });
    toast.success("Document ajouté. Analyse en cours…");
    analyse.mutate(row.id);
  }

  async function handleOpen(path: string) {
    const { data, error } = await supabase.storage.from("iso-library").createSignedUrl(path, 300);
    if (error || !data) {
      toast.error("Lien indisponible.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function handleDelete(id: string, path: string) {
    await supabase.storage.from("iso-library").remove([path]);
    const { error } = await supabase.from("library_documents").delete().eq("id", id);
    if (error) {
      toast.error("Suppression impossible.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["library_documents"] });
  }

  const list = documents.data ?? [];

  return (
    <AppShell title="Mes documents">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Mes documents</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Supports de cours, notes de formation et exemplaires personnels de normes. Chaque document
          est privé, puis découpé et indexé pour servir de base de connaissances à l'assistant IA et
          aux quiz générés.
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Ajouter un document</CardTitle>
            <CardDescription>
              PDF, TXT ou Markdown pour l'indexation IA. 50 Mo maximum par fichier.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger aria-label="Type de document">
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
                Téléversement en cours…
              </p>
            )}
          </CardContent>
        </Card>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold">Base de connaissances</h2>
          {list.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Aucun document pour l'instant.</p>
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
                        Indexé · {doc.chunk_count} extraits
                      </Badge>
                    ) : doc.status === "error" ? (
                      <Badge variant="destructive" title={doc.error ?? undefined}>
                        Analyse échouée
                      </Badge>
                    ) : (
                      <Badge variant="outline">En attente d'analyse</Badge>
                    )}
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
                      {doc.status === "ready" ? "Réindexer" : "Analyser"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpen(doc.storage_path)}>
                      <Download className="size-4" aria-hidden />
                      Ouvrir
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id, doc.storage_path)}
                    >
                      <Trash2 className="size-4 text-destructive" aria-hidden />
                      <span className="sr-only">Supprimer {doc.name}</span>
                    </Button>
                  </div>
                </li>

              ))}
            </ul>
          )}
          {list.some((d) => d.status === "error") && (
            <p className="mt-3 text-xs text-muted-foreground">
              Une analyse a échoué : vérifiez que le fichier contient bien du texte sélectionnable
              (les PDF scannés sans OCR ne peuvent pas être indexés).
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
