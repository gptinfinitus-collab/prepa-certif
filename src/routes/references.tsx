import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { program } from "@/data/program";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/references")({
  head: () => ({
    meta: [
      { title: "Références ISO — PREPA IRCA 45001" },
      {
        name: "description",
        content:
          "Normes de référence pour la certification IRCA : ISO 45001:2018, ISO 19011:2018, ISO 45003 et ISO/IEC 17021-1, avec liens officiels et résumés par chapitre.",
      },
      { property: "og:title", content: "Références ISO — PREPA IRCA 45001" },
      {
        property: "og:description",
        content: "Textes normatifs de référence et résumés par chapitre pour l'audit SMSST.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: References,
});

const standards = [
  {
    code: "ISO 45001:2018",
    title: "Systèmes de management de la santé et de la sécurité au travail — Exigences",
    role: "Norme d'exigences auditée. Chapitres 4 à 10.",
    url: "https://www.iso.org/fr/standard/63787.html",
  },
  {
    code: "ISO 19011:2018",
    title: "Lignes directrices pour l'audit des systèmes de management",
    role: "Méthodologie d'audit, principes, programme et compétences de l'auditeur.",
    url: "https://www.iso.org/fr/standard/70017.html",
  },
  {
    code: "ISO 45003:2021",
    title: "Santé et sécurité psychologiques au travail",
    role: "Lignes directrices sur les risques psychosociaux, complément utile.",
    url: "https://www.iso.org/fr/standard/64283.html",
  },
  {
    code: "ISO/IEC 17021-1:2015",
    title: "Exigences pour les organismes de certification",
    role: "Cadre de la certification tierce partie et du déroulé des audits.",
    url: "https://www.iso.org/fr/standard/61651.html",
  },
];

function References() {
  return (
    <AppShell title="Références ISO">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <h1 className="font-serif text-3xl font-semibold">Références ISO</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Les textes normatifs sont protégés par le droit d'auteur : ils ne peuvent pas être
          téléchargés depuis cette application. Vous trouverez ci-dessous les liens officiels
          d'achat ou de prévisualisation, puis des résumés par chapitre rédigés pour la
          préparation.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {standards.map((s) => (
            <Card key={s.code}>
              <CardHeader>
                <CardTitle className="font-serif text-lg">{s.code}</CardTitle>
                <CardDescription>{s.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.role}</p>
                <Button asChild variant="outline" size="sm">
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    Voir sur iso.org
                    <ExternalLink className="size-4" aria-hidden />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold">Résumés par chapitre</h2>
          <ul className="mt-4 space-y-3">
            {program.annexes.revisionSheets.map((sheet) => (
              <li key={sheet.clause} className="rounded-lg border border-border bg-card p-4">
                <p className="font-serif text-base font-semibold">{sheet.clause}</p>
                <p className="mt-1 text-sm text-muted-foreground">{sheet.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-xs text-muted-foreground">{program.meta.copyrightNote}</p>
      </div>
    </AppShell>
  );
}
