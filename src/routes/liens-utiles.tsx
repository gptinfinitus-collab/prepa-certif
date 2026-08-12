import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserLinkDialog } from "@/components/links/UserLinkDialog";
import { getCategoryLabel, getUsefulLinks, groupLinksByCategory, type LinkCategory } from "@/data/useful-links";
import {
  hostLabel,
  useDeleteUserLink,
  useIsSignedIn,
  useUpsertUserLink,
  useUserLinks,
  type UserLink,
} from "@/lib/useful-links";
import { useLocale, useT } from "@/i18n";


import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/liens-utiles")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "usefulLinks", "/liens-utiles");
  },
  component: UsefulLinksPage,
});

function UsefulLinksPage() {
  const t = useT();
  const { locale } = useLocale();
  const groups = groupLinksByCategory(getUsefulLinks(locale));
  // Liens internes : libellés repris de la navigation, donc déjà traduits.
  const internalLinks = [
    { to: "/references" as const, label: t("nav.references"), description: t("common.internalLinks.references") },
    { to: "/glossaire" as const, label: t("nav.glossary"), description: t("common.internalLinks.glossary") },
    { to: "/annexes" as const, label: t("nav.annexes"), description: t("common.internalLinks.annexes") },
    { to: "/cpd" as const, label: t("nav.cpd"), description: t("common.internalLinks.cpd") },
  ];
  const { data: signedIn = false } = useIsSignedIn();
  const { data: myLinks = [], isLoading } = useUserLinks();
  const upsert = useUpsertUserLink();
  const remove = useDeleteUserLink();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserLink | null>(null);

  const myGroups = groupLinksByCategory(myLinks);

  return (
    <AppShell title={t("common.usefulLinks")}>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.usefulLinks")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t("common.usefulLinksIntro")}
        </p>

        {groups.map((group) => (
          <section key={group.category} className="mt-8">
            <h2 className="font-sans text-lg font-semibold">{getCategoryLabel(group.category as LinkCategory, locale)}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {group.links.map((link) => (
                <Card key={link.url} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="font-sans text-base">{link.title}</CardTitle>
                      <Badge variant={link.cost === "gratuit" ? "secondary" : "outline"}>
                        {link.cost === "gratuit" ? t("common.free") : t("common.paid")}
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
          <h2 className="font-sans text-lg font-semibold">{t("common.inTheApp")}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {internalLinks.map((item) => (
              <Card key={item.to}>
                <CardHeader className="pb-2">
                  <CardTitle className="font-sans text-base">{item.label}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={item.to}>{t("common.open")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-sans text-lg font-semibold">{t("common.myLinks")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("common.myLinksDesc")}
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
                {t("common.addLink")}
              </Button>
            )}
          </div>

          {!signedIn ? (
            <Card className="mt-4">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-6">
                <p className="text-sm text-muted-foreground">
                  {t("common.signInToSaveLinks")}
                </p>
                <Button asChild size="sm">
                  <Link to="/auth">{t("common.signIn")}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : myLinks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("common.noLinksSaved")}
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
                          {t("common.edit")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            remove.mutate(link.id, {
                              onSuccess: () => toast.success(t("common.linkDeleted")),
                              onError: () => toast.error(t("common.linkDeleteFailed")),
                            })
                          }
                        >
                          <Trash2 className="mr-2 size-3.5" aria-hidden />
                          {t("common.delete")}
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
              toast.success(input.id ? t("common.linkUpdated") : t("common.linkAdded"));
              setOpen(false);
            },
            onError: () => toast.error(t("common.linkSaveFailed")),
          })
        }
      />
    </AppShell>
  );
}
