import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { BookMarked, Loader2, PlayCircle, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CourseProgressBar } from "@/components/course/SectionNav";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/queries";
import { useActiveCertification } from "@/lib/certifications";
import { useLocale, useT } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { pageHead } from "@/lib/seo";
import {
  officialLanguagesFor,
  type OfficialStandardLanguage,
} from "@/lib/official-standards";
import {
  useDeleteStandardDocument,
  useImportOfficialStandard,
  useImportStandardDocument,
  useStandardDocument,
  useStandardProgress,
  useStandardSearch,
  useStandardToc,
} from "@/lib/standard-doc";

export const Route = createFileRoute("/_authenticated/norme/")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "standard", "/norme");
  },
  component: StandardIndexPage,
});

function StandardIndexPage() {
  const t = useT();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const { data: user } = useSession();
  const { certification, certificationId } = useActiveCertification();

  const document = useStandardDocument(certificationId ?? null);
  const toc = useStandardToc(certificationId ?? null);
  const progress = useStandardProgress(document.data?.id);
  const [query, setQuery] = useState("");
  const search = useStandardSearch(document.data?.id, query);
  const importDoc = useImportStandardDocument();
  const officialDoc = useImportOfficialStandard();
  const removeDoc = useDeleteStandardDocument();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const total = toc.data?.sectionCount ?? 0;
  const read = progress.data?.readIds.length ?? 0;
  const firstId = toc.data?.chapters[0]?.entries[0]?.id;
  const resumeId = progress.data?.sectionId ?? firstId;

  async function handleFile(file: File) {
    if (!user || !certificationId || !certification) return;
    setUploading(true);
    const path = `${user.id}/normes/${certification.code}-${file.name}`;
    const upload = await supabase.storage.from("iso-library").upload(path, file, { upsert: true });
    if (upload.error) {
      setUploading(false);
      toast.error(t("common.uploadFailed"));
      return;
    }
    importDoc.mutate(
      {
        certificationId,
        storagePath: path,
        name: file.name,
        title: certification.name,
        reference: certification.description,
        language: locale === "en" ? "en" : "fr",
      },
      {
        onSuccess: (result) => {
          setUploading(false);
          toast.success(
            t("standardDoc.imported", { sections: result.sectionCount, pages: result.pageCount }),
          );
        },
        onError: () => {
          setUploading(false);
          toast.error(t("standardDoc.importFailed"));
        },
      },
    );
  }

  const officialLanguages = officialLanguagesFor(certification?.code);

  function loadOfficial(language: OfficialStandardLanguage) {
    if (!certificationId) return;
    officialDoc.mutate(
      { certificationId, language },
      {
        onSuccess: (result) =>
          toast.success(
            t("standardDoc.imported", { sections: result.sectionCount, pages: result.pageCount }),
          ),
        onError: () => toast.error(t("standardDoc.importFailed")),
      },
    );
  }

  const busy = uploading || importDoc.isPending || officialDoc.isPending;


  return (
    <AppShell title={t("standardDoc.title")}>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:py-8">
        <Card>
          <CardHeader className="space-y-2">
            <Badge variant="secondary" className="w-fit gap-1">
              <BookMarked className="size-3" aria-hidden />
              {certification?.name ?? t("standardDoc.title")}
            </Badge>
            <CardTitle className="text-lg leading-tight">
              {document.data?.title ?? certification?.name ?? t("standardDoc.title")}
            </CardTitle>
            <CardDescription>
              {document.data
                ? t("standardDoc.sectionsRead", { read, total })
                : t("standardDoc.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!certificationId ? (
              <p className="text-sm text-muted-foreground">{t("standardDoc.noCertification")}</p>
            ) : document.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t("common.loading")}
              </div>
            ) : document.data ? (
              <>
                <CourseProgressBar value={total ? (read / total) * 100 : 0} />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={!resumeId}
                    onClick={() =>
                      resumeId &&
                      navigate({
                        to: "/norme/$sectionId",
                        params: { sectionId: resumeId },
                        search: { q: undefined },
                      })
                    }
                  >
                    <PlayCircle className="mr-1.5 size-4" aria-hidden />
                    {read > 0 ? t("standardDoc.resume") : t("standardDoc.start")}
                  </Button>
                  <Button variant="outline" size="sm" disabled={busy} onClick={() => fileInput.current?.click()}>
                    <Upload className="mr-1.5 size-4" aria-hidden />
                    {t("standardDoc.reimport")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy || removeDoc.isPending}
                    onClick={() =>
                      certificationId &&
                      removeDoc.mutate(certificationId, {
                        onSuccess: () => toast.success(t("standardDoc.deleted")),
                      })
                    }
                  >
                    <Trash2 className="mr-1.5 size-4" aria-hidden />
                    {t("standardDoc.delete")}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium">{t("standardDoc.emptyTitle")}</p>
                <p className="text-sm text-muted-foreground">
                  {officialLanguages.length > 0
                    ? t("standardDoc.officialAvailable", { name: certification?.name ?? "" })
                    : t("standardDoc.emptyBody", { name: certification?.name ?? "" })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {officialLanguages.map((lang) => (
                    <Button
                      key={lang}
                      size="sm"
                      disabled={busy}
                      onClick={() => loadOfficial(lang)}
                    >
                      {busy && officialDoc.variables?.language === lang ? (
                        <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden />
                      ) : (
                        <BookMarked className="mr-1.5 size-4" aria-hidden />
                      )}
                      {t(lang === "fr" ? "standardDoc.loadFrench" : "standardDoc.loadEnglish")}
                    </Button>
                  ))}
                  <Button
                    variant={officialLanguages.length > 0 ? "outline" : "default"}
                    size="sm"
                    disabled={busy}
                    onClick={() => fileInput.current?.click()}
                  >
                    {busy && !officialDoc.isPending ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden />
                    ) : (
                      <Upload className="mr-1.5 size-4" aria-hidden />
                    )}
                    {busy ? t("standardDoc.importing") : t("standardDoc.import")}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{t("standardDoc.privateNotice")}</p>
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void handleFile(file);
              }}
            />
          </CardContent>
        </Card>

        {document.data && (
          <div className="space-y-3">
            <div className="relative w-full sm:max-w-md lg:max-w-xl">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("standardDoc.searchPlaceholder")}
                aria-label={t("standardDoc.searchLabel")}
                className="h-10 pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">{t("standardDoc.searchTip")}</p>

            {query.trim().length >= 2 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {search.isFetching
                    ? t("standardDoc.searching")
                    : t("standardDoc.resultCount", { count: search.data?.length ?? 0 })}
                </p>
                <ul className="space-y-2">
                  {(search.data ?? []).map((hit) => (
                    <li key={hit.id}>
                      <Link
                        to="/norme/$sectionId"
                        params={{ sectionId: hit.id }}
                        search={{ q: query }}
                        className="block rounded-lg border border-border p-3 transition-colors hover:bg-secondary/60"
                      >
                        <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-sm font-medium">
                          <span className="min-w-0 flex-1 break-words">{hit.title}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {hit.chapter} · p. {hit.page}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">{hit.snippet}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {(toc.data?.chapters ?? []).map((chapter) => (
                  <Card key={chapter.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm leading-tight">{chapter.name}</CardTitle>
                      <CardDescription>
                        {t("standardDoc.sections", { count: chapter.entries.length })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {chapter.entries.slice(0, 8).map((entry) => (
                        <Link
                          key={entry.id}
                          to="/norme/$sectionId"
                          params={{ sectionId: entry.id }}
                          search={{ q: undefined }}
                          className="block rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          {entry.title}
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">{t("standardDoc.copyright")}</p>
      </div>
    </AppShell>
  );
}
