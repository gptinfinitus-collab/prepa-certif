import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandLogo } from "@/components/BrandLogo";
import { AuthBackdrop } from "@/components/AuthBackdrop";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authErrorKey, fieldErrors, newPasswordSchema } from "@/lib/auth-schemas";
import { useT } from "@/i18n";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    const base = pageHead(locale, "resetPassword", "/reset-password");
    return {
      meta: [...base.meta, { name: "robots", content: "noindex" }],
      links: base.links,
    };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const t = useT();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setHasSession(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setHasSession(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);


  /** Message d'erreur d'authentification dans la langue active. */
  function authError(error: unknown): string {
    const key = error instanceof Error ? authErrorKey(error.message) : null;
    if (key) return t(`auth.${key}`);
    return error instanceof Error && error.message ? error.message : t("auth.genericError");
  }

  async function handleSubmit() {
    const parsed = newPasswordSchema.safeParse({ password, confirm });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
      if (error) throw error;
      toast.success(t("auth.passwordUpdated"));
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      setFormError(
        authError(error),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <AuthBackdrop />

      <Card className="relative z-10 w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="items-center text-center">
          <BrandLogo className="mx-auto size-16 text-primary" />
          <CardTitle className="font-sans text-2xl">{t("auth.resetPasswordTitle")}</CardTitle>
          <CardDescription>
            {t("auth.resetPasswordSubtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {ready && !hasSession ? (
            <div className="space-y-3 text-sm">
              <p className="rounded-md border border-border bg-secondary/60 p-3">
                {t("auth.resetLinkInvalid")}
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">{t("auth.backToSignInLink")}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">{t("auth.newPassword")}</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={show ? "text" : "password"}
                    className="pr-10"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    data-testid="toggle-new-password"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? t("auth.hidePassword") : t("auth.showPassword")}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors["password"] ? (
                  <p className="text-xs text-destructive">{t(`auth.${errors["password"]}`)}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
                <Input
                  id="confirm-password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                {errors["confirm"] ? (
                  <p className="text-xs text-destructive">{t(`auth.${errors["confirm"]}`)}</p>
                ) : null}
              </div>

              {formError ? (
                <div
                  role="alert"
                  className="space-y-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <p>{formError}</p>
                  <Button size="sm" variant="outline" onClick={() => setFormError(null)}>
                    {t("auth.retry")}
                  </Button>
                </div>
              ) : null}

              <Button className="w-full" disabled={loading} onClick={handleSubmit}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {t("auth.updatePassword")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
