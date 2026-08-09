import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProfileEditor } from "@/components/ProfileEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — PREPA ISO" },
      {
        name: "description",
        content:
          "Modifiez votre photo, votre prénom et votre nom pour personnaliser votre espace de préparation aux certifications ISO.",
      },
      { property: "og:title", content: "Mon profil — PREPA ISO" },
      { property: "og:description", content: "Photo, prénom et nom de votre compte PREPA ISO." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profil,
});

function Profil() {
  return (
    <AppShell title="Profil">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Mon profil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre photo et votre identité, affichées dans l'application.
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Identité</CardTitle>
            <CardDescription>Photo recadrable, prénom et nom.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileEditor />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
