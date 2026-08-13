import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  Brain,
  Bot,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronsUpDown,
  ClipboardCheck,
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

interface NavItem {
  to: string;
  key: string;
  icon: typeof Home;
}

interface NavGroup {
  id: string;
  key: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: "prep",
    key: "nav.groupPrep",
    items: [
      { to: "/dashboard", key: "nav.dashboard", icon: Home },
      { to: "/planning", key: "nav.planning", icon: CalendarRange },
      { to: "/quiz", key: "nav.quiz", icon: Brain },
      { to: "/assistant", key: "nav.assistant", icon: Bot },
    ],
  },
  {
    id: "field",
    key: "nav.groupField",
    items: [{ to: "/check-lists", key: "nav.checklists", icon: ClipboardCheck }],
  },
  {
    id: "content",
    key: "nav.groupContent",
    items: [
      { to: "/cours", key: "nav.course", icon: BookOpen },
      { to: "/references", key: "nav.references", icon: BookMarked },
      { to: "/glossaire", key: "nav.glossary", icon: SpellCheck },
      { to: "/annexes", key: "nav.annexes", icon: ListChecks },
      { to: "/bibliotheque", key: "nav.library", icon: Library },
      { to: "/liens-utiles", key: "nav.usefulLinks", icon: LinkIcon },
    ],
  },
  {
    id: "journey",
    key: "nav.groupJourney",
    items: [
      { to: "/cpd", key: "nav.cpd", icon: NotebookPen },
      { to: "/certifications", key: "nav.certifications", icon: GraduationCap },
    ],
  },
  {
    id: "settings",
    key: "nav.groupSettings",
    items: [{ to: "/parametres", key: "nav.settings", icon: Settings }],
  },
];

const mobileItems = [
  { to: "/dashboard", key: "nav.home", icon: Home },
  { to: "/planning", key: "nav.mobilePlanning", icon: CalendarRange },
  { to: "/quiz", key: "nav.quiz", icon: Brain },
  { to: "/assistant", key: "nav.mobileAssistant", icon: Bot },
];

const OPEN_GROUPS_KEY = "prepa.navGroups";

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

  const groups: NavGroup[] = navGroups.map((group) =>
    group.id === "settings" && isSuperAdmin
      ? { ...group, items: [...group.items, { to: "/admin", key: "nav.admin", icon: ShieldCheck }] }
      : group,
  );

  // Sections ouvertes : persistées, avec ouverture automatique de la section active.
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group) => [group.id, true])),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(OPEN_GROUPS_KEY);
    if (!raw) return;
    try {
      const stored = JSON.parse(raw) as Record<string, boolean>;
      setOpen((current) => ({ ...current, ...stored }));
    } catch {
      /* préférence illisible : on garde les sections ouvertes */
    }
  }, []);

  function toggle(id: string) {
    setOpen((current) => {
      const next = { ...current, [id]: !current[id] };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify(next));
      }
      return next;
    });
  }

  // En mode replié, on masque les entêtes et on affiche uniquement les icônes.
  if (collapsed) {
    return (
      <>
        {groups.flatMap((group) =>
          group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              title={t(item.key)}
              aria-label={t(item.key)}
              onClick={onNavigate}
              className={linkClass(isActive(item.to), true)}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
            </Link>
          )),
        )}
      </>
    );
  }

  return (
    <>
      {groups.map((group) => {
        const groupActive = group.items.some((item) => isActive(item.to));
        const expanded = open[group.id] ?? true;
        return (
          <div key={group.id} className="space-y-0.5">
            <button
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={expanded || groupActive}
              className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground"
            >
              <span className="truncate">{t(group.key)}</span>
              <ChevronDown
                className={cn("size-3.5 transition-transform", !(expanded || groupActive) && "-rotate-90")}
                aria-hidden
              />
            </button>
            {(expanded || groupActive) && (
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={t(item.key)}
                    aria-label={t(item.key)}
                    onClick={onNavigate}
                    className={linkClass(isActive(item.to), false)}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden />
                    <span className="truncate">{t(item.key)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
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
  // Clé basée sur la route réellement résolue : l'animation ne se joue qu'au
  // moment où le nouveau contenu est affiché (pas au clic, sur l'ancienne page).
  const resolvedKey = useRouterState({
    select: (s) =>
      s.matches[s.matches.length - 1]?.id ?? s.resolvedLocation?.pathname ?? s.location.pathname,
  });
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
          <div className="sticky top-0 z-30 hidden w-fit px-3 pt-3 lg:block">
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
            <div key={resolvedKey} className="page-enter">
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
