import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserLinkDialog } from "@/components/links/UserLinkDialog";
import { INTERNAL_LINKS, USEFUL_LINKS, groupLinksByCategory } from "@/data/useful-links";
import {
  hostLabel,
  useDeleteUserLink,
  useIsSignedIn,
  useUpsertUserLink,
  useUserLinks,
  type UserLink,
} from "@/lib/useful-links";

const TITLE = "Liens utiles — PREPA CERTIF";
const DESCRIPTION =
  "Tous les liens utiles pour préparer votre certification ISO : textes officiels, schémas de certification d'auditeurs, accréditation, réglementation S&ST et ressources gratuites.";

export const Route = createFileRoute("/liens-utiles")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prepa-certif.app/liens-utiles" },
      { property: "og:image", content: "https://prepa-certif.app/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "PREPA CERTIF — Préparation aux certifications ISO" },
      { name: "twitter:image", content: "https://prepa-certif.app/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://prepa-certif.app/liens-utiles" }],
  }),
  component: UsefulLinksPage,
});

function UsefulLinksPage() {
  const groups = groupLinksByCategory(USEFUL_LINKS);
  const { data: signedIn = false } = useIsSignedIn();
  const { data: myLinks = [], isLoading } = useUserLinks();
  const upsert = useUpsertUserLink();
  const remove = useDeleteUserLink();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserLink | null>(null);

  const myGroups = groupLinksByCategory(myLinks);

  return (
    <AppShell title="Liens utiles">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">Liens utiles</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Les ressources externes à connaître pour votre préparation : textes officiels, schémas de
          certification d'auditeurs, règles d'accréditation et réglementation. Les normes restent
          protégées par le droit d'auteur : seuls les liens officiels d'achat ou de consultation
          sont proposés.
        </p>

        {groups.map((group) => (
          <section key={group.category} className="mt-8">
            <h2 className="font-sans text-lg font-semibold">{group.category}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {group.links.map((link) => (
                <Card key={link.url} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="font-sans text-base">{link.title}</CardTitle>
                      <Badge variant={link.cost === "gratuit" ? "secondary" : "outline"}>
                        {link.cost}
                      </Badge>
                    </div>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button asChild variant="outline" size="sm">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {hostLabel(link.url)}
                        <ExternalLink className="ml-2 size-3.5" aria-hidden />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-10">
          <h2 className="font-sans text-lg font-semibold">Dans l'application</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {INTERNAL_LINKS.map((item) => (
              <Card key={item.to}>
                <CardHeader className="pb-2">
                  <CardTitle className="font-sans text-base">{item.label}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={item.to}>Ouvrir</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-sans text-lg font-semibold">Mes liens</h2>
              <p className="text-sm text-muted-foreground">
                Vos ressources personnelles, visibles uniquement par vous.
              </p>
            </div>
            {signedIn && (
              <Button
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
              >
                <Plus className="mr-2 size-4" aria-hidden />
                Ajouter un lien
              </Button>
            )}
          </div>

          {!signedIn ? (
            <Card className="mt-4">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-6">
                <p className="text-sm text-muted-foreground">
                  Connectez-vous pour enregistrer vos propres liens utiles.
                </p>
                <Button asChild size="sm">
                  <Link to="/auth">Se connecter</Link>
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Chargement…</p>
          ) : myLinks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Aucun lien enregistré pour l'instant.
            </p>
          ) : (
            myGroups.map((group) => (
              <div key={group.category} className="mt-5">
                <h3 className="text-sm font-medium text-muted-foreground">{group.category}</h3>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {group.links.map((link) => (
                    <Card key={link.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="font-sans text-base">{link.title}</CardTitle>
                        {link.note && <CardDescription>{link.note}</CardDescription>}
                      </CardHeader>
                      <CardContent className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {hostLabel(link.url)}
                            <ExternalLink className="ml-2 size-3.5" aria-hidden />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditing(link);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 size-3.5" aria-hidden />
                          Modifier
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            remove.mutate(link.id, {
                              onSuccess: () => toast.success("Lien supprimé"),
                              onError: () => toast.error("Suppression impossible"),
                            })
                          }
                        >
                          <Trash2 className="mr-2 size-3.5" aria-hidden />
                          Supprimer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <UserLinkDialog
        open={open}
        onOpenChange={setOpen}
        link={editing}
        saving={upsert.isPending}
        onSubmit={(input) =>
          upsert.mutate(input, {
            onSuccess: () => {
              toast.success(input.id ? "Lien modifié" : "Lien ajouté");
              setOpen(false);
            },
            onError: () => toast.error("Enregistrement impossible"),
          })
        }
      />
    </AppShell>
  );
}
