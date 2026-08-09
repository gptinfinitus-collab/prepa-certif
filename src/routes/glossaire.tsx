import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
import { program } from "@/data/program";

export const Route = createFileRoute("/glossaire")({
  head: () => ({
    meta: [
      { title: "Glossaire de l'audit SMSST — PREPA IRCA 45001" },
      {
        name: "description",
        content:
          "Définitions des termes clés de l'ISO 45001 et de l'audit : constat, non-conformité, preuve d'audit, périmètre, partie intéressée et plus.",
      },
      { property: "og:title", content: "Glossaire — PREPA IRCA 45001" },
      {
        property: "og:description",
        content: "Termes clés de l'audit et du management SST expliqués simplement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Glossaire,
});

function Glossaire() {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const entries = program.glossary.filter(
    (g) =>
      !needle ||
      g.term.toLowerCase().includes(needle) ||
      g.definition.toLowerCase().includes(needle),
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-3xl font-semibold">Glossaire</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {program.glossary.length} termes essentiels pour l'examen et le terrain.
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
              <dt className="font-serif text-base font-semibold">{entry.term}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{entry.definition}</dd>
            </div>
          ))}
          {entries.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">Aucun résultat.</p>
          ) : null}
        </dl>
      </main>
    </div>
  );
}
