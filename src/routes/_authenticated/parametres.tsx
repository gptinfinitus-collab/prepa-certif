import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ProfileEditor } from "@/components/ProfileEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Moon, CalendarRange } from "lucide-react";

export const Route = createFileRoute("/_authenticated/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Gérez votre profil, votre photo, votre prénom et nom, et activez le mode sombre bleu nuit de PREPA CERTIF.",
      },
      { property: "og:title", content: "Paramètres — PREPA CERTIF" },
      { property: "og:description", content: "Profil, apparence et préférences d'étude." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Parametres,
});

function Parametres() {
  const { theme, resolved, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell title="Paramètres">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Paramètres</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre profil, l'apparence de l'application et votre compte.
        </p>

        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Profil</CardTitle>
              <CardDescription>Photo, prénom et nom affichés dans l'application.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditor />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Apparence</CardTitle>
              <CardDescription>Thème clair ou bleu nuit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Moon className="size-5 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0">
                    <Label htmlFor="dark-mode" className="text-sm font-medium">
                      Mode sombre
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Palette bleu nuit, contraste optimisé pour les longues sessions.
                    </p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={resolved === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["light", "dark", "system"] as const).map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={theme === value ? "default" : "outline"}
                    onClick={() => setTheme(value)}
                  >
                    {value === "light" ? "Clair" : value === "dark" ? "Sombre" : "Système"}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Étude</CardTitle>
              <CardDescription>Dates, jours travaillés et rythme de révision.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/planning">
                  <CalendarRange className="size-4" aria-hidden />
                  Modifier mon planning
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Compte</CardTitle>
              <CardDescription>Déconnexion de cet appareil.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => void signOut()}>
                <LogOut className="size-4" aria-hidden />
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
