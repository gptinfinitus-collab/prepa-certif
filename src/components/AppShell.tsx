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
import { cn } from "@/lib/utils";
import { certificationAccentStyle } from "@/lib/cert-theme";
import { useIsSuperAdmin } from "@/lib/admin";

const navItems = [
  { to: "/dashboard", label: "Programme", icon: Home },
  { to: "/planning", label: "Mon planning", icon: CalendarRange },
  { to: "/quiz", label: "Quiz", icon: Brain },
  { to: "/assistant", label: "Assistant IA", icon: Bot },
  { to: "/references", label: "Références ISO", icon: BookMarked },
  { to: "/glossaire", label: "Glossaire", icon: SpellCheck },
  { to: "/annexes", label: "Annexes", icon: ListChecks },
  { to: "/bibliotheque", label: "Mes documents", icon: Library },
  { to: "/certifications", label: "Mes certifications", icon: GraduationCap },
  { to: "/parametres", label: "Paramètres", icon: Settings },
];

const mobileItems = [
  { to: "/dashboard", label: "Accueil", icon: Home },
  { to: "/planning", label: "Planning", icon: CalendarRange },
  { to: "/quiz", label: "Quiz", icon: Brain },
  { to: "/assistant", label: "Assistant", icon: Bot },
  { to: "/bibliotheque", label: "Docs", icon: Library },
];

/** Sélecteur de certification active. */
function CertificationSwitcher({ compact = false }: { compact?: boolean }) {
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
          aria-label="Changer de certification"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {active?.certification.name ?? "Choisir une certification"}
            </span>
            {!compact && (
              <span className="block truncate text-xs text-muted-foreground">
                {active?.certification.family ?? "Aucune certification active"}
              </span>
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Mes cursus</DropdownMenuLabel>
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
          <DropdownMenuItem disabled>Aucun cursus suivi</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/certifications">
            <Plus className="size-4" aria-hidden />
            Ajouter une certification
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
  const [collapsed, setCollapsed] = useState(false);
  const isSuperAdmin = useIsSuperAdmin();
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) setCollapsed(true);
  }, []);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const activeMobile = mobileItems.some((i) => isActive(i.to));
  const { data: mine = [] } = useMyCertifications();
  const activeCert = mine.find((m) => m.is_active) ?? mine[0] ?? null;
  useCertificationGuard();

  return (
    <div
      className="cert-tint min-h-screen bg-background md:flex"
      style={certificationAccentStyle(activeCert?.certification.code)}
    >
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-[4.5rem]" : "w-56 lg:w-64",
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
                Préparation à la certification
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
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && "justify-center px-0",
                isActive(item.to) &&
                  "bg-sidebar-primary/12 font-medium text-sidebar-primary hover:bg-sidebar-primary/16 hover:text-sidebar-primary",
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
          {isSuperAdmin && (
            <Link
              to="/admin"
              title="Administration"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && "justify-center px-0",
                isActive("/admin") &&
                  "bg-sidebar-primary/12 font-medium text-sidebar-primary hover:bg-sidebar-primary/16 hover:text-sidebar-primary",
              )}
            >
              <ShieldCheck className="size-4 shrink-0" aria-hidden />
              {!collapsed && <span className="truncate">Administration</span>}
            </Link>
          )}
        </nav>


        <div className="border-t border-sidebar-border p-2">
          <UserMenu variant="card" compact={collapsed} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <BrandLogo className="size-6 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate text-base font-semibold">PREPA CERTIF</span>
            <UserMenu />
          </div>
          <div className="mt-2">
            <CertificationSwitcher compact />
          </div>
        </header>


        {/* Desktop sidebar toggle */}
        <div className="hidden px-3 pt-3 md:block">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          >
            {collapsed ? (
              <PanelLeft className="size-5" aria-hidden />
            ) : (
              <PanelLeftClose className="size-5" aria-hidden />
            )}
          </Button>
        </div>

        <main className="min-w-0 flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
          <div key={pathname} className="page-enter">
            {children}
          </div>
        </main>


        {/* Mobile bottom nav */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
          aria-label="Navigation principale"
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
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
