import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { program, modules } from "@/data/program";
import { CalendarRange, BookOpenCheck, ClipboardList, Library } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PREPA IRCA 45001 — Préparation à l'audit SMSST ISO 45001" },
      {
        name: "description",
        content:
          "Préparez la certification IRCA Responsable d'Audit ISO 45001:2018 : planning sur mesure, 21 séances de cours, quiz, examen blanc et suivi de progression.",
      },
      { property: "og:title", content: "PREPA IRCA 45001" },
      {
        property: "og:description",
        content:
          "Programme complet de préparation à la certification Responsable d'Audit SMSST ISO 45001:2018.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: CalendarRange,
    title: "Durée entièrement configurable",
    text: "Date de début, date d'examen, jours travaillés et nombre de séances par jour : le programme s'adapte à votre rythme, pas l'inverse.",
  },
  {
    icon: BookOpenCheck,
    title: "21 séances structurées",
    text: "Cours, points clés, mises en pratique et révisions couvrant les chapitres 4 à 10 de l'ISO 45001 et la conduite d'audit selon l'ISO 19011.",
  },
  {
    icon: ClipboardList,
    title: "Quiz et examen blanc",
    text: "Auto-évaluation à chaque séance, trames d'audit, fiches de non-conformité et examen blanc final.",
  },
  {
    icon: Library,
    title: "Bibliothèque personnelle",
    text: "Déposez vos exemplaires achetés des normes ISO dans un espace privé et chiffré, accessible pendant vos révisions.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
            <p className="font-medium uppercase tracking-[0.18em] text-accent-foreground/80 text-xs">
              Certification IRCA · ISO 45001:2018
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              {program.meta.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {program.meta.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/planning">Construire mon planning</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">Voir le programme</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Séances</dt>
                <dd className="font-serif text-3xl font-semibold">{modules.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Blocs</dt>
                <dd className="font-serif text-3xl font-semibold">{program.weeks.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Termes au glossaire</dt>
                <dd className="font-serif text-3xl font-semibold">{program.glossary.length}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-serif text-2xl font-semibold">Ce que contient la préparation</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <f.icon className="size-5 text-primary" aria-hidden />
                  <CardTitle className="font-serif text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{f.text}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="font-serif text-2xl font-semibold">Déroulé du programme</h2>
            <ol className="mt-6 space-y-4">
              {program.weeks.map((week) => (
                <li key={week.id} className="rounded-lg border border-border p-4">
                  <p className="font-serif text-lg font-semibold">{week.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {week.dayIds.length} séances ·{" "}
                    {week.dayIds
                      .map((id) => modules.find((m) => m.id === id)?.title)
                      .filter(Boolean)
                      .slice(0, 3)
                      .join(" · ")}
                    {week.dayIds.length > 3 ? "…" : ""}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground">
            {program.meta.copyrightNote}
          </div>
        </footer>
      </main>
    </div>
  );
}
