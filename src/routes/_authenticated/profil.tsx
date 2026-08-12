import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useT } from "@/i18n";
import { ProfileEditor } from "@/components/ProfileEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Modifiez votre photo, votre prénom et votre nom pour personnaliser votre espace de préparation aux certifications ISO.",
      },
      { property: "og:title", content: "Mon profil — PREPA CERTIF" },
      { property: "og:description", content: "Photo, prénom et nom de votre compte PREPA CERTIF." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profil,
});

function Profil() {
  const t = useT();
  return (
    <AppShell title={t("common.profile")}>
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.myProfile")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("common.profilePhotoIdentity")}
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sans text-lg">{t("common.identity")}</CardTitle>
            <CardDescription>{t("common.croppablePhotoNameDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileEditor />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
