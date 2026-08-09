import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Lecture locale de la session (pas d'aller-retour réseau) pour une navigation instantanée.
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      return { user: sessionData.session.user };
    }

    // Repli : vérification serveur uniquement si aucune session locale n'est disponible.
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
