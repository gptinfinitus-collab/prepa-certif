import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  Brain,
  Bot,
  CalendarRange,
  Check,
  ChevronsUpDown,
  GraduationCap,
  Home,
  Library,
  ListChecks,
  Link as LinkIcon,
  Menu,
  MoreHorizontal,
  NotebookPen,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Settings,
  ShieldCheck,
  SpellCheck,
} from "lucide-react";

import { useSession } from "@/lib/queries";
import { useMyCertifications, useSetActiveCertification } from "@/lib/certifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/UserMenu";
import { BrandLogo } from "@/components/BrandLogo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { certificationAccentStyle } from "@/lib/cert-theme";
import { useIsSuperAdmin } from "@/lib/admin";
import { useT } from "@/i18n";

const navItems = [
  { to: "/dashboard", key: "nav.dashboard", icon: Home },
  { to: "/planning", key: "nav.planning", icon: CalendarRange },
  { to: "/quiz", key: "nav.quiz", icon: Brain },
  { to: "/assistant", key: "nav.assistant", icon: Bot },
  { to: "/cours", key: "nav.course", icon: BookOpen },
  { to: "/references", key: "nav.references", icon: BookMarked },
  { to: "/glossaire", key: "nav.glossary", icon: SpellCheck },
  { to: "/annexes", key: "nav.annexes", icon: ListChecks },
  { to: "/liens-utiles", key: "nav.usefulLinks", icon: LinkIcon },
  { to: "/bibliotheque", key: "nav.library", icon: Library },
  { to: "/cpd", key: "nav.cpd", icon: NotebookPen },
  { to: "/certifications", key: "nav.certifications", icon: GraduationCap },
  { to: "/parametres", key: "nav.settings", icon: Settings },
];

const mobileItems = [
  { to: "/dashboard", key: "nav.home", icon: Home },
  { to: "/planning", key: "nav.mobilePlanning", icon: CalendarRange },
  { to: "/quiz", key: "nav.quiz", icon: Brain },
  { to: "/assistant", key: "nav.mobileAssistant", icon: Bot },
];

const linkClass = (active: boolean, collapsed: boolean) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
    collapsed && "justify-center px-0",
    active &&
      "bg-sidebar-primary/12 font-medium text-sidebar-primary hover:bg-sidebar-primary/16 hover:text-sidebar-primary",
  );

/** Liste de navigation partagée entre la barre latérale et le panneau mobile. */
function NavLinks({
  isActive,
  collapsed = false,
  onNavigate,
}: {
  isActive: (to: string) => boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const t = useT();
  const isSuperAdmin = useIsSuperAdmin();
  const items = isSuperAdmin
    ? [...navItems, { to: "/admin", key: "nav.admin", icon: ShieldCheck }]
    : navItems;

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          title={t(item.key)}
          aria-label={t(item.key)}
          onClick={onNavigate}
          className={linkClass(isActive(item.to), collapsed)}
        >
          <item.icon className="size-4 shrink-0" aria-hidden />
          {!collapsed && <span className="truncate">{t(item.key)}</span>}
        </Link>
      ))}
    </>
  );
}


/** Sélecteur de certification active. */
function CertificationSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const { data: mine = [] } = useMyCertifications();
  const setActive = useSetActiveCertification();
  const active = mine.find((m) => m.is_active) ?? mine[0] ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          style={certificationAccentStyle(active?.certification.code)}
          className={cn(
            "cert-tint flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-left transition-colors hover:bg-sidebar-accent",
            compact && "border-border bg-transparent px-2 py-1.5",
          )}
          aria-label={t("nav.changeCertification")}
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {active?.certification.name ?? t("nav.chooseCertification")}
            </span>
            {!compact && (
              <span className="block truncate text-xs text-muted-foreground">
                {active?.certification.family ?? t("nav.noActiveCertification")}
              </span>
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>{t("nav.myTracks")}</DropdownMenuLabel>
        {mine.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onSelect={() => void setActive.mutateAsync(item.certification_id)}
          >
            <span
              className="cert-tint size-2.5 shrink-0 rounded-full bg-cert"
              style={certificationAccentStyle(item.certification.code)}
              aria-hidden
            />
            <Check
              className={cn("size-4", item.is_active ? "opacity-100" : "opacity-0")}
              aria-hidden
            />
            <span className="truncate">{item.certification.name}</span>
          </DropdownMenuItem>
        ))}
        {mine.length === 0 && (
          <DropdownMenuItem disabled>{t("nav.noTrack")}</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/certifications">
            <Plus className="size-4" aria-hidden />
            {t("nav.addCertification")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Redirige vers le choix de certification quand l'utilisateur n'en suit aucune. */
function useCertificationGuard() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: user } = useSession();
  const { data: mine, isSuccess } = useMyCertifications();

  useEffect(() => {
    if (!user || !isSuccess) return;
    if ((mine?.length ?? 0) === 0 && pathname !== "/certifications") {
      navigate({ to: "/certifications", replace: true });
    }
  }, [user, isSuccess, mine, pathname, navigate]);
}





export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const t = useT();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1280) setCollapsed(true);
  }, []);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const activeMobile = mobileItems.some((i) => isActive(i.to));
  const { data: mine = [] } = useMyCertifications();
  const activeCert = mine.find((m) => m.is_active) ?? mine[0] ?? null;
  useCertificationGuard();

  return (
    <div
      className="cert-tint min-h-screen bg-background lg:flex"
      style={certificationAccentStyle(activeCert?.certification.code)}
    >
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[4.5rem]" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-4",
            collapsed && "justify-center px-2",
          )}
        >
          <BrandLogo className={cn("shrink-0 text-sidebar-primary", collapsed ? "size-9" : "size-10")} />
          {!collapsed && (
            <Link to="/" className="min-w-0 flex-1">
              <span className="block truncate text-base font-semibold leading-tight">PREPA CERTIF</span>
              <span className="block truncate whitespace-nowrap text-xs text-muted-foreground">
                {t("nav.brandTagline")}
              </span>
            </Link>
          )}
        </div>

        {!collapsed && (
          <div className="px-2 pb-2">
            <CertificationSwitcher />
          </div>
        )}


        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
          <NavLinks isActive={isActive} collapsed={collapsed} />
        </nav>


        <div className="border-t border-sidebar-border p-2">
          <UserMenu variant="card" compact={collapsed} />
        </div>
      </aside>

      {/* Panneau de navigation complet — mobile et tablette */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="flex w-[17rem] flex-col gap-0 bg-sidebar p-0">
          <SheetTitle className="sr-only">{t("nav.navigation")}</SheetTitle>
          <div className="flex items-center gap-3 px-4 py-4">
            <BrandLogo className="size-9 shrink-0 text-sidebar-primary" />
            <span className="min-w-0 flex-1 truncate text-base font-semibold">PREPA CERTIF</span>
          </div>
          <div className="px-2 pb-2">
            <CertificationSwitcher />
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
            <NavLinks isActive={isActive} onNavigate={() => setMenuOpen(false)} />
          </nav>
          <div className="border-t border-sidebar-border p-2">
            <UserMenu variant="card" />
          </div>
        </SheetContent>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile header */}
          <header className="sticky top-0 z-30 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center gap-3">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9 shrink-0" aria-label={t("nav.openMenu")}>
                  <Menu className="size-5" aria-hidden />
                </Button>
              </SheetTrigger>
              <BrandLogo className="size-6 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 truncate text-base font-semibold">PREPA CERTIF</span>
              <UserMenu />
            </div>
            <div className="mt-2">
              <CertificationSwitcher compact />
            </div>
          </header>


          {/* Desktop sidebar toggle */}
          <div className="hidden px-3 pt-3 lg:block">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 text-muted-foreground"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={t(collapsed ? "nav.expandMenu" : "nav.collapseMenu")}
            >
              {collapsed ? (
                <PanelLeft className="size-5" aria-hidden />
              ) : (
                <PanelLeftClose className="size-5" aria-hidden />
              )}
            </Button>
          </div>

          <main className="min-w-0 flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
            <div key={pathname} className="page-enter">
              {children}
            </div>
          </main>


          {/* Mobile bottom nav */}
          <nav
            className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
            aria-label={t("nav.navigation")}
          >
            {mobileItems.map((item) => {
              const active = activeMobile ? isActive(item.to) : false;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2 text-[0.68rem] transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-full transition-colors",
                      active && "bg-primary/12",
                    )}
                  >
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  {t(item.key)}
                </Link>
              );
            })}
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[0.68rem] transition-colors",
                  activeMobile ? "text-muted-foreground" : "text-primary",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full transition-colors",
                    !activeMobile && "bg-primary/12",
                  )}
                >
                  <MoreHorizontal className="size-5" aria-hidden />
                </span>
                {t("nav.more")}
              </button>
            </SheetTrigger>
          </nav>
        </div>
      </Sheet>

    </div>
  );
}
