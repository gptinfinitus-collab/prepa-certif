import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { useCurriculum } from "@/lib/curriculum";
import { useT } from "@/i18n";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/glossaire")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "glossary", "/glossaire");
  },
  component: Glossaire,
});

function Glossaire() {
  const t = useT();
  const [query, setQuery] = useState("");
  const { curriculum, certificationName } = useCurriculum();
  const needle = query.trim().toLowerCase();
  const entries = curriculum.glossary.filter(
    (g) =>
      !needle ||
      g.term.toLowerCase().includes(needle) ||
      g.definition.toLowerCase().includes(needle),
  );

  return (
    <AppShell title={t("common.glossary")}>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.glossary")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("common.glossaryIntro", { count: curriculum.glossary.length, certificationName })}
        </p>
        <Input
          className="mt-6"
          placeholder={t("common.searchTermPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
          {entries.map((entry) => (
            <div key={entry.term} className="px-4 py-3">
              <dt className="font-sans text-base font-semibold">{entry.term}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{entry.definition}</dd>
            </div>
          ))}
          {entries.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">{t("common.noResults")}</p>
          ) : null}
        </dl>
      </div>
    </AppShell>
  );
}
