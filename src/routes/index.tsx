import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "PREPA CERTIF — Préparation aux certifications d'auditeur ISO" },
      {
        name: "description",
        content:
          "Connectez-vous à PREPA CERTIF pour préparer vos certifications ISO : planning sur mesure, quiz, examen blanc et suivi de progression.",
      },
      { property: "og:title", content: "PREPA CERTIF — Préparation aux certifications ISO" },
      {
        property: "og:description",
        content: "Accédez à votre espace de préparation aux certifications d'auditeur ISO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});
