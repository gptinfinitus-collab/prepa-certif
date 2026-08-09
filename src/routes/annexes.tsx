import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz } from "@/components/Quiz";
import { useCurriculum } from "@/lib/curriculum";

export const Route = createFileRoute("/annexes")({
  head: () => ({
    meta: [
      { title: "Annexes et trames d'audit — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Trame de plan d'audit, fiche de non-conformité, checklist générique et examen blanc pour préparer votre certification ISO.",
      },
      { property: "og:title", content: "Annexes et trames d'audit — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Trames opérationnelles et examen blanc pour votre certification ISO.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://prepa-certif.app/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "PREPA CERTIF — Préparation aux certifications ISO" },
      { name: "twitter:image", content: "https://prepa-certif.app/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Annexes,
});

function Annexes() {
  const { curriculum } = useCurriculum();
  const { annexes } = curriculum;

  return (
    <AppShell title="Annexes">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">Annexes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Les outils à réutiliser tels quels pendant vos mises en pratique et le jour de l'examen.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sans text-lg">Trame de plan d'audit</CardTitle>
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
            <CardTitle className="font-sans text-lg">Fiche de non-conformité</CardTitle>
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
            <CardTitle className="font-sans text-lg">Checklist générique</CardTitle>
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
          <h2 className="font-sans text-2xl font-semibold">Examen blanc final</h2>
          {annexes.finalMockExam.mcq.length > 0 ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Traitez les questions en conditions réelles avant d'afficher les réponses.
              </p>
              <div className="mt-4">
                <Quiz items={annexes.finalMockExam.mcq} />
              </div>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Aucun examen blanc rédigé pour ce référentiel pour le moment : appuyez-vous sur les
              résumés par chapitre et sur vos propres documents.
            </p>
          )}
        </section>

      </div>
    </AppShell>
  );
}
