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
import { authErrorMessage, fieldErrors, newPasswordSchema } from "@/lib/auth-schemas";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — PREPA CERTIF" },
      {
        name: "description",
        content: "Définissez un nouveau mot de passe pour votre compte PREPA CERTIF.",
      },
      { property: "og:title", content: "Nouveau mot de passe — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Choisissez un nouveau mot de passe sécurisé pour votre compte.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
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
      toast.success("Votre mot de passe a été mis à jour.");
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error ? authErrorMessage(error.message) : "Une erreur est survenue.",
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
          <CardTitle className="font-serif text-2xl">Nouveau mot de passe</CardTitle>
          <CardDescription>
            Choisissez un mot de passe d'au moins 6 caractères pour votre compte.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {ready && !hasSession ? (
            <div className="space-y-3 text-sm">
              <p className="rounded-md border border-border bg-secondary/60 p-3">
                Ce lien de réinitialisation est invalide ou a expiré. Demandez-en un nouveau depuis
                la page de connexion.
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Retour à la connexion</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
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
                    aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors["password"] ? (
                  <p className="text-xs text-destructive">{errors["password"]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirmation</Label>
                <Input
                  id="confirm-password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                {errors["confirm"] ? (
                  <p className="text-xs text-destructive">{errors["confirm"]}</p>
                ) : null}
              </div>

              {formError ? (
                <div
                  role="alert"
                  className="space-y-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <p>{formError}</p>
                  <Button size="sm" variant="outline" onClick={() => setFormError(null)}>
                    Réessayer
                  </Button>
                </div>
              ) : null}

              <Button className="w-full" disabled={loading} onClick={handleSubmit}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Mettre à jour mon mot de passe
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
