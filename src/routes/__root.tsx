import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, themeBootstrapScript } from "@/components/theme-provider";
import { InstallPrompt } from "@/components/InstallPrompt";
import { I18nProvider, useT } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import i18n, { applyI18nLocale } from "@/i18n/i18n";
import { resolveInitialLocale } from "@/i18n/locale.isomorphic";
import frSeo from "@/i18n/locales/fr/seo.json";
import enSeo from "@/i18n/locales/en/seo.json";

function NotFoundComponent() {
  const t = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("common.notFoundTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("common.notFoundText")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("common.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  // Rendu hors provider : on lit la langue résolue puis l'instance i18next.
  const locale = resolveInitialLocale();
  applyI18nLocale(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {i18n.t("common.loadErrorTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{i18n.t("common.loadErrorText")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {i18n.t("common.retry")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {i18n.t("common.backHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // La langue est résolue une fois par requête et partagée avec toutes les routes
  // enfants, ce qui permet à chaque `head()` de produire des métadonnées localisées.
  beforeLoad: () => ({ locale: resolveInitialLocale() }),
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    const dict = locale === "en" ? enSeo : frSeo;

    return {
      // Uniquement les métadonnées valables pour tout le site : titre, description
      // et Open Graph spécifiques sont émis par chaque route feuille.
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "google-site-verification",
          content: "2xhgbbgCb_24CgRm7Lz0TZ6Zk-e4Z_FDeCp9uKcQ5yA",
        },
        { property: "og:site_name", content: "PREPA CERTIF" },
        { name: "author", content: "PREPA CERTIF" },
        { name: "theme-color", content: "#0f2f4f" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-title", content: "PREPA CERTIF" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "mobile-web-app-capable", content: "yes" },
      ],

      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
        { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "64x64" },

        { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://prepa-certif.app/#organization",
                name: "PREPA CERTIF",
                url: "https://prepa-certif.app",
                logo: "https://prepa-certif.app/og-image.png",
                email: "contact@prepa-certif.app",
              },
              {
                "@type": "WebSite",
                "@id": "https://prepa-certif.app/#website",
                name: "PREPA CERTIF",
                url: "https://prepa-certif.app",
                inLanguage: locale === "en" ? "en-GB" : "fr-FR",
                description: dict.root.description,
                publisher: { "@id": "https://prepa-certif.app/#organization" },
              },
            ],
          }),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const locale = resolveInitialLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function AuthSync() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return null;
}

function RootComponent() {
  const { queryClient, locale } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider initialLocale={locale}>
        <AuthSync />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster />
        <InstallPrompt />
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
