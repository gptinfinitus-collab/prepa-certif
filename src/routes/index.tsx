import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { program } from "@/data/program";
import { standardSpecs } from "@/data/standards";
import { CalendarRange, BookOpenCheck, ClipboardList, Library } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PREPA CERTIF — Préparez votre certification d'auditeur ISO" },
      {
        name: "description",
        content:
          "Préparez les certifications ISO 9001, 14001, 45001, 27001, 22000 et plus : planning sur mesure, séances par chapitre, quiz, examen blanc et suivi de progression.",
      },
      { property: "og:title", content: "PREPA CERTIF — Préparez votre certification d'auditeur ISO" },
      {
        property: "og:description",
        content:
          "Une plateforme de préparation pour les principales normes ISO, avec planning configurable et suivi de progression.",
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
    title: "Une préparation par norme",
    text: "Chapitres 4 à 10 du référentiel choisi, exigences clés, méthodologie d'audit selon l'ISO 19011 et glossaire dédié.",
  },
  {
    icon: ClipboardList,
    title: "Quiz et examen blanc",
    text: "Auto-évaluation à chaque séance, trames d'audit, fiches de non-conformité et examen blanc.",
  },
  {
    icon: Library,
    title: "Bibliothèque personnelle",
    text: "Déposez vos exemplaires achetés des normes et vos documents de cours dans un espace privé, accessible pendant vos révisions.",
  },
];

const catalogue = [
  { code: "ISO 45001:2018", label: "Santé et sécurité au travail", ready: true },
  ...Object.values(standardSpecs).map((s) => ({
    code: s.label,
    label: s.subject.replace(/^l[ae'] ?/, ""),
    ready: false,
  })),
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
            <p className="font-medium uppercase tracking-[0.18em] text-accent-foreground/80 text-xs">
              Certifications d'auditeur · Normes ISO
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Préparez votre certification ISO à votre rythme
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Choisissez la norme que vous préparez, construisez votre planning, travaillez chapitre
              par chapitre et suivez votre progression. Plusieurs certifications peuvent être
              suivies en parallèle.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/certifications">Choisir ma certification</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">Voir mon programme</Link>
              </Button>
            </div>
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
            <h2 className="font-serif text-2xl font-semibold">Normes prises en charge</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Le cursus rédigé complet est disponible pour l'ISO 45001. Les autres normes démarrent
              avec leur squelette officiel : chapitres, exigences clés, glossaire et références. Un
              référentiel personnalisé peut aussi être créé.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catalogue.map((item) => (
                <li key={item.code} className="rounded-lg border border-border p-4">
                  <p className="font-serif text-base font-semibold">{item.code}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.ready ? "Cursus complet disponible" : "Préparation libre"}
                  </p>
                </li>
              ))}
            </ul>
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
