import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BrandLogo } from "@/components/BrandLogo";
import { AuthBackdrop } from "@/components/AuthBackdrop";
import { AppleIcon, GoogleIcon } from "@/components/BrandIcons";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  authErrorMessage,
  credentialsSchema,
  fieldErrors,
  forgotPasswordSchema,
  safePath,
} from "@/lib/auth-schemas";
import { useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "auth", "/auth");
  },
  component: AuthPage,
});

type Mode = "signin" | "signup";

function AuthPage() {
  const t = useT();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const destination = safePath(search.redirect);

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: destination, replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate({ to: destination, replace: true });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate, destination]);

  function resetErrors() {
    setErrors({});
    setFormError(null);
  }

  async function handleOAuth(provider: "google" | "apple") {
    setLoading(true);
    resetErrors();
    try {
      sessionStorage.setItem("prepa_certif_redirect", destination);
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.redirected) return;
      if (result.error) {
        setFormError(t("auth.oauthFailed"));
        return;
      }
      navigate({ to: destination, replace: true });
    } catch {
      setFormError(t("auth.oauthFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function handlePassword() {
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    resetErrors();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setPendingConfirm(true);
          toast.success(t("auth.confirmEmailToast"));
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
      }
    } catch (error) {
      const message =
        error instanceof Error ? authErrorMessage(error.message) : t("auth.genericError");
      setFormError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    resetErrors();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (error) {
      setFormError(
        error instanceof Error ? authErrorMessage(error.message) : t("auth.genericError"),
      );
    } finally {
      setLoading(false);
    }
  }

  const errorBlock = formError ? (
    <div
      role="alert"
      data-testid="auth-error"
      className="space-y-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
    >
      <p>{formError}</p>
      <Button type="button" size="sm" variant="outline" onClick={resetErrors}>
        {t("auth.retry")}
      </Button>
    </div>
  ) : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <AuthBackdrop />

      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitcher />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="items-center text-center">
          <BrandLogo className="mx-auto size-16 text-primary" />
          <h1 className="font-sans text-2xl leading-none font-semibold tracking-tight">
            {t("auth.signInTitle")}
          </h1>
          <CardDescription>
            {forgotOpen ? t("auth.forgotSubtitle") : t("auth.signInSubtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {forgotOpen ? (
            <div className="space-y-4">
              {resetSent ? (
                <p className="rounded-md border border-border bg-secondary/60 p-3 text-sm">
                  {t("auth.resetSentText")}
                </p>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="forgot-email">{t("auth.email")}</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors["email"] ? (
                      <p className="text-xs text-destructive">{errors["email"]}</p>
                    ) : null}
                  </div>
                  {errorBlock}
                  <Button className="w-full" disabled={loading} onClick={handleForgotPassword}>
                    {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                    {t("auth.sendResetLink")}
                  </Button>
                </>
              )}
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setForgotOpen(false);
                  setResetSent(false);
                  resetErrors();
                }}
              >
                <ArrowLeft className="size-4" />
                {t("auth.backToSignIn")}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleOAuth("google")}
                  aria-label={t("auth.continueWithGoogle")}
                >
                  <GoogleIcon />
                  Google
                </Button>
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleOAuth("apple")}
                  aria-label={t("auth.continueWithApple")}
                >
                  <AppleIcon />
                  Apple
                </Button>
              </div>

              <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t("auth.or")}
                <span className="h-px flex-1 bg-border" />
              </div>

              {pendingConfirm ? (
                <p className="rounded-md border border-border bg-secondary/60 p-3 text-sm">
                  {t("auth.confirmPendingText")}
                </p>
              ) : (
                <Tabs
                  value={mode}
                  onValueChange={(value) => {
                    setMode(value as Mode);
                    resetErrors();
                  }}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="signin" className="flex-1">
                      {t("auth.signInTab")}
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="flex-1">
                      {t("auth.signUpTab")}
                    </TabsTrigger>
                  </TabsList>

                  {(["signin", "signup"] as const).map((tab) => (
                    <TabsContent key={tab} value={tab} className="space-y-3 pt-4">
                      <div className="space-y-1.5">
                        <Label htmlFor={`${tab}-email`}>{t("auth.email")}</Label>
                        <Input
                          id={`${tab}-email`}
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors["email"] ? (
                          <p className="text-xs text-destructive">{errors["email"]}</p>
                        ) : null}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`${tab}-password`}>{t("auth.password")}</Label>
                        <div className="relative">
                          <Input
                            id={`${tab}-password`}
                            type={showPassword ? "text" : "password"}
                            className="pr-10"
                            autoComplete={tab === "signin" ? "current-password" : "new-password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            data-testid={`toggle-password-${tab}`}
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={
                              showPassword ? t("auth.hidePassword") : t("auth.showPassword")
                            }
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        {errors["password"] ? (
                          <p className="text-xs text-destructive">{errors["password"]}</p>
                        ) : null}
                      </div>

                      {tab === "signin" ? (
                        <button
                          type="button"
                          className="text-xs text-primary underline-offset-4 hover:underline"
                          onClick={() => {
                            setForgotOpen(true);
                            resetErrors();
                          }}
                        >
                          {t("auth.forgotPassword")}
                        </button>
                      ) : null}

                      {errorBlock}

                      <Button className="w-full" disabled={loading} onClick={handlePassword}>
                        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                        {tab === "signin" ? t("auth.signIn") : t("auth.signUp")}
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </>
          )}

          <p className="text-center text-xs text-muted-foreground">
            {t("auth.termsPrefix")}{" "}
            <Link to="/cgu" className="underline underline-offset-4 hover:text-foreground">
              {t("auth.termsLink")}
            </Link>{" "}
            {t("auth.and")}{" "}
            <Link
              to="/confidentialite"
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t("auth.privacyLink")}
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
