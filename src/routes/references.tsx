import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurriculum } from "@/lib/curriculum";
import { useT } from "@/i18n";
import { ExternalLink } from "lucide-react";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/references")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "references", "/references");
  },
  component: References,
});

function References() {
  const t = useT();
  const { curriculum, certificationName } = useCurriculum();

  return (
    <AppShell title={t("common.isoReferences")}>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.isoReferences")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t("common.isoReferencesIntro", { certificationName })}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {curriculum.references.map((s) => (
            <Card key={s.code}>
              <CardHeader>
                <CardTitle className="font-sans text-lg">{s.code}</CardTitle>
                <CardDescription>{s.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.role}</p>
                <Button asChild variant="outline" size="sm">
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {t("common.viewOnIso")}
                    <ExternalLink className="size-4" aria-hidden />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-sans text-2xl font-semibold">{t("common.chapterSummariesTitle")}</h2>
          <ul className="mt-4 space-y-3">
            {curriculum.annexes.revisionSheets.map((sheet) => (
              <li key={sheet.clause} className="rounded-lg border border-border bg-card p-4">
                <p className="font-sans text-base font-semibold">{sheet.clause}</p>
                <p className="mt-1 text-sm text-muted-foreground">{sheet.summary}</p>
              </li>
            ))}
            {curriculum.annexes.revisionSheets.length === 0 ? (
              <li className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                {t("common.noSummariesAvailable")}
              </li>
            ) : null}
          </ul>
        </section>

        <p className="mt-10 text-xs text-muted-foreground">{curriculum.copyrightNote}</p>
      </div>
    </AppShell>
  );
}
