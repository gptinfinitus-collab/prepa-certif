import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Loader2, PlayCircle, Search } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CourseProgressBar } from "@/components/course/SectionNav";
import { useT } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { pageHead } from "@/lib/seo";
import { useManualProgress, useManualSearch, useManualToc } from "@/lib/manual";

export const Route = createFileRoute("/_authenticated/cours/")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "manual", "/cours");
  },
  component: ManualIndexPage,
});

function ManualIndexPage() {
  const t = useT();
  const navigate = useNavigate();
  const toc = useManualToc();
  const progress = useManualProgress();
  const [query, setQuery] = useState("");
  const search = useManualSearch(query);

  const total = toc.data?.sectionCount ?? 0;
  const read = progress.data?.readIds.length ?? 0;
  const firstId = toc.data?.chapters[0]?.entries[0]?.id;
  const resumeId = progress.data?.sectionId ?? firstId;

  return (
    <AppShell title={t("manual.title")}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="space-y-2">
            <Badge variant="secondary" className="w-fit gap-1">
              <BookOpen className="size-3" aria-hidden />
              {toc.data?.publisher ?? "SGS"}
            </Badge>
            <CardTitle className="text-lg leading-tight">{toc.data?.title ?? t("manual.title")}</CardTitle>
            <CardDescription>
              {toc.data?.reference} · {t("manual.pagesRead", { read, total })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CourseProgressBar value={total ? (read / total) * 100 : 0} />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={!resumeId}
                onClick={() =>
                  resumeId &&
                  navigate({ to: "/cours/$sectionId", params: { sectionId: resumeId }, search: { q: undefined } })
                }
              >
                <PlayCircle className="mr-1.5 size-4" aria-hidden />
                {read > 0 ? t("manual.resume") : t("manual.start")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("manual.searchPlaceholder")}
              aria-label={t("manual.searchLabel")}
              className="h-10 pl-8"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("manual.searchTip")}</p>

          {query.trim().length >= 2 ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {search.isFetching
                  ? t("manual.searching")
                  : t("manual.resultCount", { count: search.data?.length ?? 0 })}
              </p>
              <ul className="space-y-2">
                {(search.data ?? []).map((hit) => (
                  <li key={hit.id}>
                    <Link
                      to="/cours/$sectionId"
                      params={{ sectionId: hit.id }}
                      search={{ q: query }}
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-secondary/60"
                    >
                      <span className="flex items-center justify-between gap-2 text-sm font-medium">
                        {hit.title}
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
          ) : toc.isLoading ? (
            <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t("common.loading")}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {(toc.data?.chapters ?? []).map((chapter) => (
                <Card key={chapter.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wide">{chapter.name}</CardTitle>
                    <CardDescription>{chapter.entries.length} pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {chapter.entries.slice(0, 6).map((entry) => (
                        <li key={entry.id}>
                          <Link
                            to="/cours/$sectionId"
                            params={{ sectionId: entry.id }}
                            search={{ q: undefined }}
                            className="flex gap-2 rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <span className="shrink-0 tabular-nums">p. {entry.page}</span>
                            <span className="min-w-0 flex-1 truncate">{entry.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {chapter.entries.length > 6 && (
                      <Link
                        to="/cours/$sectionId"
                        params={{ sectionId: chapter.entries[0]!.id }}
                        search={{ q: undefined }}
                        className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                      >
                        {t("common.seeAll", { defaultValue: "Tout voir" })}
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
