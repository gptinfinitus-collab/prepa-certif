import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz } from "@/components/Quiz";
import { program } from "@/data/program";

export const Route = createFileRoute("/annexes")({
  head: () => ({
    meta: [
      { title: "Annexes et trames d'audit — PREPA IRCA 45001" },
      {
        name: "description",
        content:
          "Trame de plan d'audit, fiche de non-conformité, checklist générique et examen blanc final pour préparer la certification IRCA ISO 45001.",
      },
      { property: "og:title", content: "Annexes — PREPA IRCA 45001" },
      {
        property: "og:description",
        content: "Trames opérationnelles et examen blanc pour la certification IRCA ISO 45001.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Annexes,
});

function Annexes() {
  const { annexes } = program;
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-3xl font-semibold">Annexes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Les outils à réutiliser tels quels pendant vos mises en pratique et le jour de l'examen.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Trame de plan d'audit</CardTitle>
            <CardDescription>Les rubriques attendues par un auditeur IRCA.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {annexes.auditPlanTemplate.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Fiche de non-conformité</CardTitle>
            <CardDescription>Chaque champ doit être renseigné sans ambiguïté.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              {annexes.ncTemplate.map((field) => (
                <div key={field.field} className="py-2">
                  <dt className="text-sm font-medium">{field.field}</dt>
                  <dd className="text-sm text-muted-foreground">{field.hint}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Checklist générique</CardTitle>
            <CardDescription>Questions transverses à poser sur tout processus.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {annexes.genericChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold">Examen blanc final</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Traitez les questions en conditions réelles avant d'afficher les réponses.
          </p>
          <div className="mt-4">
            <Quiz items={annexes.finalMockExam.mcq} />
          </div>
        </section>
      </main>
    </div>
  );
}
