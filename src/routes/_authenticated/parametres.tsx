import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ProfileEditor } from "@/components/ProfileEditor";
import { ShareApp } from "@/components/ShareApp";
import { ExamBodyPicker } from "@/components/ExamBodyPicker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";
import { legalDocuments } from "@/lib/legal";
import { useSetOnboarded } from "@/lib/learning";
import { LogOut, Moon, CalendarRange, Sparkles } from "lucide-react";
import { useLocale, useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/_authenticated/parametres")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "settings", "/parametres");
  },
  component: Parametres,
});

function Parametres() {
  const t = useT();
  const { locale } = useLocale();
  const { theme, resolved, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setOnboarded = useSetOnboarded();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell title={t("common.settings")}>
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("common.settings")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("common.settingsIntro")}
        </p>

        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.profile")}</CardTitle>
              <CardDescription>{t("common.profilePhotoNameDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditor />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.appearance")}</CardTitle>
              <CardDescription>{t("common.themeDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Moon className="size-5 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0">
                    <Label htmlFor="dark-mode" className="text-sm font-medium">
                      {t("common.darkMode")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("common.darkModeDesc")}
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
                    {value === "light" ? t("common.light") : value === "dark" ? t("common.dark") : t("common.system")}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.examProfile")}</CardTitle>
              <CardDescription>
                {t("common.examProfileDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExamBodyPicker />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.study")}</CardTitle>
              <CardDescription>{t("common.studyDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/planning">
                  <CalendarRange className="size-4" aria-hidden />
                  {t("common.editSchedule")}
                </Link>
              </Button>
              <Button
                variant="outline"
                disabled={setOnboarded.isPending}
                onClick={() => {
                  setOnboarded.mutate(false, {
                    onSuccess: () => navigate({ to: "/dashboard" }),
                  });
                }}
              >
                <Sparkles className="size-4" aria-hidden />
                {t("common.restartOnboarding")}
              </Button>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.sharePrepaCertif")}</CardTitle>
              <CardDescription>
                {t("common.shareDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShareApp />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.language")}</CardTitle>
              <CardDescription>{t("common.languageDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcher />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.account")}</CardTitle>
              <CardDescription>{t("common.signOutDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => void signOut()}>
                <LogOut className="size-4" aria-hidden />
                {t("common.signOut")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">{t("common.legalDocuments")}</CardTitle>
              <CardDescription>{t("common.legalDocumentsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {legalDocuments.map((doc) => (
                <Button key={doc.slug} asChild size="sm" variant="outline">
                  <Link to={doc.path}>{doc.title[locale]}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
