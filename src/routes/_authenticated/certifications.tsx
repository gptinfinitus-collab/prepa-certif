import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { certificationAccentStyle } from "@/lib/cert-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCertificationCatalog,
  useCreateCustomCertification,
  useFollowCertification,
  useMyCertifications,
  useSetActiveCertification,
  useUnfollowCertification,
} from "@/lib/certifications";
import { Check, CircleDashed, Plus, Search, Sparkles } from "lucide-react";
import { useT } from "@/i18n";

export const Route = createFileRoute("/_authenticated/certifications")({
  head: () => ({
    meta: [
      { title: "Mes certifications — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Choisissez la certification que vous préparez : ISO 9001, 14001, 45001, 27001, 22000, 50001, 13485, 22301, 37001 ou votre propre référentiel.",
      },
      { property: "og:title", content: "Mes certifications — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Sélectionnez et suivez plusieurs cursus de préparation à la certification ISO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CertificationsPage,
});

function CustomCertificationDialog() {
  const t = useT();
  const create = useCreateCustomCertification();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [description, setDescription] = useState("");
  const [chapters, setChapters] = useState("");

  async function submit() {
    if (!name.trim()) {
      toast.error(t("common.giveReferentialName"));
      return;
    }
    try {
      await create.mutateAsync({
        name: name.trim(),
        family: family.trim(),
        description: description.trim(),
        chapters: chapters
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      });
      setOpen(false);
      setName("");
      setFamily("");
      setDescription("");
      setChapters("");
      toast.success(t("common.referentialCreated"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.creationImpossible"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4" aria-hidden />
          {t("common.customReferential")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-sans">{t("common.createReferential")}</DialogTitle>
          <DialogDescription>
            {t("common.createReferentialDesc")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cert-name">{t("common.name")}</Label>
            <Input
              id="cert-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ISO 21001:2018"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert-family">{t("common.domain")}</Label>
            <Input
              id="cert-family"
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              placeholder="Organismes de formation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert-desc">{t("common.description")}</Label>
            <Textarea
              id="cert-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert-chapters">{t("common.chaptersOnePerLine")}</Label>
            <Textarea
              id="cert-chapters"
              value={chapters}
              onChange={(e) => setChapters(e.target.value)}
              rows={5}
              placeholder={"4. Contexte de l'organisme\n5. Leadership"}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => void submit()} disabled={create.isPending}>
            {create.isPending ? t("common.creating") : t("common.createAndActivate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CertificationsPage() {
  const t = useT();
  const navigate = useNavigate();
  const { data: catalog = [], isLoading } = useCertificationCatalog();
  const { data: mine = [] } = useMyCertifications();
  const follow = useFollowCertification();
  const setActive = useSetActiveCertification();
  const unfollow = useUnfollowCertification();
  const [search, setSearch] = useState("");

  const followedIds = new Set(mine.map((m) => m.certification_id));
  const activeId = mine.find((m) => m.is_active)?.certification_id ?? null;

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((c) =>
      [c.name, c.code, c.family, c.description].some((v) => (v ?? "").toLowerCase().includes(q)),
    );
  }, [catalog, search]);

  async function handleSelect(id: string) {
    try {
      if (followedIds.has(id)) {
        await setActive.mutateAsync(id);
      } else {
        await follow.mutateAsync(id);
      }
      toast.success(t("common.certificationActivated"));
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.actionImpossible"));
    }
  }

  return (
    <AppShell title={t("common.myCertifications")}>
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.myCertifications")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t("common.myCertificationsIntro")}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("common.searchStandardPlaceholder")}
              className="pl-9"
              aria-label={t("common.searchStandardPlaceholder")}
            />
          </div>
          <CustomCertificationDialog />
        </div>

        {isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">{t("common.loadingCatalog")}</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((cert) => {
              const followed = followedIds.has(cert.id);
              const active = activeId === cert.id;
              return (
                <Card
                  key={cert.id}
                  style={certificationAccentStyle(cert.code)}
                  className={cn(
                    "cert-tint border-t-4 border-t-cert",
                    active ? "ring-1 ring-cert/40" : undefined,
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="font-sans text-lg">{cert.name}</CardTitle>
                      {active && (
                        <Badge className="shrink-0 bg-cert text-cert-foreground">
                          <Check className="size-3" aria-hidden />
                          {t("common.active")}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{cert.family}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      {cert.has_curriculum ? (
                        <>
                          <Sparkles className="size-3.5 text-primary" aria-hidden />
                          {t("common.fullCurriculumAvailable")}
                        </>
                      ) : (
                        <>
                          <CircleDashed className="size-3.5" aria-hidden />
                          {t("common.freePreparation")}
                        </>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={active ? "secondary" : "default"}
                        disabled={active || follow.isPending || setActive.isPending}
                        onClick={() => void handleSelect(cert.id)}
                      >
                        {active ? t("common.selected") : followed ? t("common.activate") : t("common.start")}
                      </Button>
                      {followed && !active && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => void unfollow.mutateAsync(cert.id)}
                        >
                          {t("common.remove")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {results.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("common.noStandardMatches")}</p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
