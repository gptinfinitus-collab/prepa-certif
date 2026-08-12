import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

import { pageHead } from "@/lib/seo";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/")({
  ssr: false,
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "home", "/");
  },
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});
