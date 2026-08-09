import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Ma bibliothèque — PREPA ISO" },
      {
        name: "description",
        content:
          "Espace privé pour déposer et consulter vos exemplaires personnels des normes ISO 45001 et ISO 19011 pendant vos révisions.",
      },
      { property: "og:title", content: "Ma bibliothèque — PREPA ISO" },
      { property: "og:description", content: "Vos documents normatifs personnels, en privé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Bibliotheque,
});

interface StoredFile {
  name: string;
  size: number;
}

function Bibliotheque() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh(uid: string) {
    const { data, error } = await supabase.storage.from("iso-library").list(uid, { limit: 100 });
    if (error) {
      toast.error("Impossible de lister vos documents.");
      return;
    }
    setFiles(
      (data ?? [])
        .filter((f) => f.id !== null)
        .map((f) => ({ name: f.name, size: (f.metadata?.["size"] as number) ?? 0 })),
    );
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) void refresh(uid);
    });
  }, []);

  async function handleUpload(file: File) {
    if (!userId) return;
    setBusy(true);
    const { error } = await supabase.storage
      .from("iso-library")
      .upload(`${userId}/${file.name}`, file, { upsert: true });
    setBusy(false);
    if (error) {
      toast.error("Le téléversement a échoué.");
      return;
    }
    toast.success("Document ajouté à votre bibliothèque.");
    void refresh(userId);
  }

  async function handleOpen(name: string) {
    if (!userId) return;
    const { data, error } = await supabase.storage
      .from("iso-library")
      .createSignedUrl(`${userId}/${name}`, 300);
    if (error || !data) {
      toast.error("Lien indisponible.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function handleDelete(name: string) {
    if (!userId) return;
    const { error } = await supabase.storage.from("iso-library").remove([`${userId}/${name}`]);
    if (error) {
      toast.error("Suppression impossible.");
      return;
    }
    void refresh(userId);
  }

  return (
    <AppShell title="Ma bibliothèque">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <h1 className="font-serif text-3xl font-semibold">Ma bibliothèque</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Les normes ISO sont protégées par le droit d'auteur et ne peuvent pas être diffusées par
          cette application. Déposez ici vos propres exemplaires achetés : ils restent strictement
          privés et ne sont accessibles qu'avec votre compte.
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Ajouter un document</CardTitle>
            <CardDescription>PDF, DOCX ou images. 50 Mo maximum par fichier.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
          </CardContent>
        </Card>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold">Mes documents</h2>
          {files.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Aucun document pour l'instant.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
              {files.map((file) => (
                <li key={file.name} className="flex items-center gap-3 px-4 py-3">
                  <FileText className="size-4 text-primary" aria-hidden />
                  <span className="flex-1 truncate text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} Mo
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleOpen(file.name)}>
                    <Download className="size-4" aria-hidden />
                    Ouvrir
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(file.name)}>
                    <Trash2 className="size-4 text-destructive" aria-hidden />
                    <span className="sr-only">Supprimer {file.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
