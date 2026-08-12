import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { useCurriculum } from "@/lib/curriculum";
import { useT } from "@/i18n";

export const Route = createFileRoute("/glossaire")({
  head: () => ({
    meta: [
      { title: "Glossaire de l'audit ISO — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Définitions des termes clés des systèmes de management et de l'audit : constat, non-conformité, preuve d'audit, périmètre, partie intéressée et plus.",
      },
      { property: "og:title", content: "Glossaire de l'audit ISO — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Termes clés de l'audit et des systèmes de management expliqués simplement.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://prepa-certif.app/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "PREPA CERTIF — Préparation aux certifications ISO" },
      { name: "twitter:image", content: "https://prepa-certif.app/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://prepa-certif.app/glossaire" },
    ],
    links: [{ rel: "canonical", href: "https://prepa-certif.app/glossaire" }],
  }),
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
