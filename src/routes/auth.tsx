import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BrandLogo } from "@/components/BrandLogo";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Connexion — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Connectez-vous avec Google, Apple ou votre e-mail pour accéder à votre planning de préparation IRCA ISO 45001.",
      },
      { property: "og:title", content: "Connexion — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Accédez à votre programme de préparation à l'audit ISO 45001.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function safePath(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const destination = safePath(search.redirect);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(false);

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

  async function handleOAuth(provider: "google" | "apple") {
    setLoading(true);
    try {
      sessionStorage.setItem("prepa_irca_redirect", destination);
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("La connexion a échoué. Merci de réessayer.");
        return;
      }
      if (result.redirected) return;
      navigate({ to: destination, replace: true });
    } finally {
      setLoading(false);
    }
  }

  async function handlePassword(mode: "signin" | "signup") {
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setPendingConfirm(true);
          toast.success("Vérifiez votre boîte mail pour confirmer votre inscription.");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <BrandLogo className="size-8 text-primary" />
          <CardTitle className="font-serif text-2xl">PREPA CERTIF</CardTitle>
          <CardDescription>
            Connectez-vous pour retrouver votre planning et votre progression.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => handleOAuth("google")}
            >
              Continuer avec Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => handleOAuth("apple")}
            >
              Continuer avec Apple
            </Button>
          </div>

          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>

          {pendingConfirm ? (
            <p className="rounded-md border border-border bg-secondary/60 p-3 text-sm">
              Un e-mail de confirmation vous a été envoyé. Cliquez sur le lien reçu pour activer
              votre compte, puis revenez ici.
            </p>
          ) : (
            <Tabs defaultValue="signin">
              <TabsList className="w-full">
                <TabsTrigger value="signin" className="flex-1">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">
                  Créer un compte
                </TabsTrigger>
              </TabsList>
              {(["signin", "signup"] as const).map((mode) => (
                <TabsContent key={mode} value={mode} className="space-y-3 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`${mode}-email`}>E-mail</Label>
                    <Input
                      id={`${mode}-email`}
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`${mode}-password`}>Mot de passe</Label>
                    <Input
                      id={`${mode}-password`}
                      type="password"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={loading || !email || !password}
                    onClick={() => handlePassword(mode)}
                  >
                    {mode === "signin" ? "Se connecter" : "Créer mon compte"}
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
