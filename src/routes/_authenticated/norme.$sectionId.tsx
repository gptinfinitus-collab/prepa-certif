import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookMarked, Bot, Check, Loader2, Search } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { MarkdownView } from "@/components/MarkdownView";
import { CourseProgressBar } from "@/components/course/SectionNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { pageHead } from "@/lib/seo";
import { highlightParts } from "@/lib/manual";
import { useActiveCertification } from "@/lib/certifications";
import {
  useMarkStandardSectionRead,
  useStandardProgress,
  useStandardSearch,
  useStandardSection,
  useStandardToc,
} from "@/lib/standard-doc";

export const Route = createFileRoute("/_authenticated/norme/$sectionId")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "standard", "/norme");
  },
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  component: StandardSectionPage,
});

/** Texte avec surlignage des termes recherchés. */
function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  return (
    <>
      {highlightParts(text, query).map((part, i) =>
        part.hit ? (
          <mark key={i} className="rounded bg-primary/25 px-0.5 text-foreground">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

function StandardSectionPage() {
  const t = useT();
  const navigate = useNavigate();
  const { sectionId } = Route.useParams();
  const { q } = Route.useSearch();
  const { certification, certificationId } = useActiveCertification();

  const toc = useStandardToc(certificationId ?? null);
  const section = useStandardSection(sectionId);
  const documentId = section.data?.document_id ?? toc.data?.documentId;
  const progress = useStandardProgress(documentId);
  const markRead = useMarkStandardSectionRead();

  const [query, setQuery] = useState(q ?? "");
  const search = useStandardSearch(documentId, query);
  const readIds = progress.data?.readIds ?? [];

  useEffect(() => {
    if (section.data && documentId) markRead.mutate({ documentId, sectionId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, section.data?.id, documentId]);

  const percent = useMemo(() => {
    const total = toc.data?.sectionCount ?? 0;
    return total > 0 ? (readIds.length / total) * 100 : 0;
  }, [toc.data?.sectionCount, readIds.length]);

  function askAssistant() {
    if (!section.data) return;
    const question = t("standardDoc.askPrompt", { title: section.data.title });
    try {
      sessionStorage.setItem(
        "assistant:prefill",
        `${question}\n\n${section.data.markdown.slice(0, 1200)}`,
      );
    } catch {
      /* stockage indisponible */
    }
    navigate({ to: "/assistant" });
  }

  const tocPanel = (
    <div className="space-y-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("standardDoc.searchPlaceholder")}
          aria-label={t("standardDoc.searchLabel")}
          className="h-9 pl-8 text-sm"
        />
      </div>
      {query.trim().length >= 2 ? (
        <div className="space-y-1">
          <p className="px-1 text-xs text-muted-foreground">
            {search.isFetching
              ? t("standardDoc.searching")
              : t("standardDoc.resultCount", { count: search.data?.length ?? 0 })}
          </p>
          <ul className="max-h-[calc(100dvh-14rem)] space-y-1 overflow-y-auto pr-1 md:max-h-[calc(100dvh-16rem)]">
            {(search.data ?? []).map((hit) => (
              <li key={hit.id}>
                <Link
                  to="/norme/$sectionId"
                  params={{ sectionId: hit.id }}
                  search={{ q: query }}
                  className="block rounded-md px-2 py-1.5 text-left text-xs hover:bg-secondary"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground">
                      <Highlighted text={hit.title} query={query} />
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">p. {hit.page}</span>
                  </span>
                  <span className="mt-0.5 block text-muted-foreground">
                    <Highlighted text={hit.snippet} query={query} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <nav
          className="max-h-[calc(100dvh-14rem)] space-y-3 overflow-y-auto pr-1 md:max-h-[calc(100dvh-16rem)]"
          aria-label={t("standardDoc.summary")}
        >
          {(toc.data?.chapters ?? []).map((chapter) => (
            <div key={chapter.name} className="space-y-1">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {chapter.name}
              </p>
              {chapter.entries.map((entry) => {
                const isCurrent = entry.id === sectionId;
                const isRead = readIds.includes(entry.id);
                return (
                  <Link
                    key={entry.id}
                    to="/norme/$sectionId"
                    params={{ sectionId: entry.id }}
                    search={{ q: undefined }}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs leading-snug transition-colors",
                      isCurrent
                        ? "bg-secondary font-medium text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px]",
                        isRead ? "border-primary bg-primary text-primary-foreground" : "border-border",
                      )}
                      aria-hidden
                    >
                      {isRead ? <Check className="size-2.5" /> : entry.page}
                    </span>
                    <span className="min-w-0 flex-1 break-words">{entry.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      )}
    </div>
  );

  return (
    <AppShell title={t("standardDoc.title")}>
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:py-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="shrink-0 gap-1">
            <BookMarked className="size-3" aria-hidden />
            {certification?.name ?? t("standardDoc.title")}
          </Badge>
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {toc.data?.reference ?? ""}
          </span>
          <div className="shrink-0 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" aria-label={t("standardDoc.summaryAndSearch")}>
                  <Search className="size-4 sm:mr-1.5" aria-hidden />
                  <span className="hidden sm:inline">{t("standardDoc.summaryAndSearch")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-[88vw] max-w-sm flex-col overflow-y-auto">
                <SheetTitle className="mb-3 text-sm">{t("standardDoc.summaryAndSearch")}</SheetTitle>
                {tocPanel}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <CourseProgressBar value={percent} />

        <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden self-start md:sticky md:top-4 md:block">{tocPanel}</aside>

          <div className="min-w-0 space-y-4">
            {section.isLoading ? (
              <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t("common.loading")}
              </div>
            ) : !section.data ? (
              <p className="py-16 text-sm text-muted-foreground">{t("standardDoc.notFound")}</p>
            ) : (
              <>
                <Card>
                  <CardContent className="space-y-4 p-4 sm:p-5 lg:p-7">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {section.data.chapter} · {t("standardDoc.page", { page: section.data.page })}
                      </p>
                      <h1 className="text-lg font-semibold leading-tight sm:text-xl">
                        <Highlighted text={section.data.title} query={query} />
                      </h1>
                    </div>
                    <div className="lg:max-w-[70ch]">
                      <MarkdownView>{section.data.markdown}</MarkdownView>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:order-2 sm:w-auto sm:flex-1"
                    onClick={askAssistant}
                  >
                    <Bot className="mr-1.5 size-4" aria-hidden />
                    <span className="truncate">{t("standardDoc.askAi")}</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-2 sm:contents">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 sm:order-1 sm:h-9 sm:flex-1"
                      disabled={!section.data.previousId}
                      onClick={() =>
                        section.data?.previousId &&
                        navigate({
                          to: "/norme/$sectionId",
                          params: { sectionId: section.data.previousId },
                          search: { q: query || undefined },
                        })
                      }
                    >
                      <ArrowLeft className="mr-1.5 size-4" aria-hidden />
                      <span className="truncate">{t("standardDoc.previous")}</span>
                    </Button>
                    <Button
                      size="sm"
                      className="h-10 sm:order-3 sm:h-9 sm:flex-1"
                      disabled={!section.data.nextId}
                      onClick={() =>
                        section.data?.nextId &&
                        navigate({
                          to: "/norme/$sectionId",
                          params: { sectionId: section.data.nextId },
                          search: { q: query || undefined },
                        })
                      }
                    >
                      <span className="truncate">{t("standardDoc.next")}</span>
                      <ArrowRight className="ml-1.5 size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </>
            )}
            <p className="text-[11px] text-muted-foreground">{t("standardDoc.copyright")}</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
