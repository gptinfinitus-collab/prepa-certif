import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { useCurriculum } from "@/lib/curriculum";

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
    <AppShell title="Glossaire">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">Glossaire</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {curriculum.glossary.length} termes essentiels pour {certificationName} et l'audit.
        </p>
        <Input
          className="mt-6"
          placeholder="Rechercher un terme…"
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
            <p className="px-4 py-6 text-sm text-muted-foreground">Aucun résultat.</p>
          ) : null}
        </dl>
      </div>
    </AppShell>
  );
}
