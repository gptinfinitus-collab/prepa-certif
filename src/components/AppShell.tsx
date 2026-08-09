import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookMarked,
  CalendarRange,
  Check,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  GraduationCap,
  Home,
  Library,
  ListChecks,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  SpellCheck,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useSession } from "@/lib/queries";
import { useMyCertifications, useSetActiveCertification } from "@/lib/certifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initialsOf } from "@/components/ProfileEditor";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Programme", icon: Home },
  { to: "/planning", label: "Mon planning", icon: CalendarRange },
  { to: "/references", label: "Références ISO", icon: BookMarked },
  { to: "/glossaire", label: "Glossaire", icon: SpellCheck },
  { to: "/annexes", label: "Annexes", icon: ListChecks },
  { to: "/bibliotheque", label: "Ma bibliothèque", icon: Library },
  { to: "/certifications", label: "Mes certifications", icon: GraduationCap },
  { to: "/parametres", label: "Paramètres", icon: Settings },
];

const mobileItems = [
  { to: "/dashboard", label: "Accueil", icon: Home },
  { to: "/planning", label: "Planning", icon: CalendarRange },
  { to: "/references", label: "Références", icon: BookMarked },
  { to: "/bibliotheque", label: "Docs", icon: Library },
  { to: "/parametres", label: "Profil", icon: User },
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
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-left transition-colors hover:bg-sidebar-accent",
            compact && "border-border bg-transparent px-2 py-1.5",
          )}
          aria-label="Changer de certification"
        >
          <GraduationCap className="size-4 shrink-0 text-primary" aria-hidden />
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


function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}

function ProfileBlock({ collapsed }: { collapsed: boolean }) {
  const { data: profile } = useProfile();
  const { data: user } = useSession();
  const signOut = useSignOut();
  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.display_name ||
    "Mon profil";
  const email = profile?.email ?? user?.email ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2 text-left transition-colors hover:bg-sidebar-accent",
            collapsed && "justify-center border-transparent bg-transparent p-1",
          )}
        >
          <Avatar className="size-9 shrink-0 border border-sidebar-border">
            <AvatarImage src={profile?.avatarSignedUrl ?? undefined} alt="" />
            <AvatarFallback className="text-xs">
              {initialsOf(profile?.first_name, profile?.last_name, email)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-sidebar-foreground">
                {fullName}
              </span>
              <span className="block truncate text-xs text-muted-foreground">{email}</span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/parametres">
            <Settings className="size-4" aria-hidden />
            Paramètres
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut className="size-4" aria-hidden />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const activeMobile = mobileItems.some((i) => isActive(i.to));
  useCertificationGuard();

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-[4.5rem]" : "w-64",
        )}
      >
        <div className={cn("flex items-center gap-2 px-4 py-4", collapsed && "justify-center px-2")}>
          <ShieldCheck className="size-6 shrink-0 text-sidebar-primary" aria-hidden />
          {!collapsed && (
            <Link to="/" className="min-w-0">
              <span className="block truncate font-serif text-sm font-semibold leading-tight">
                PREPA ISO
              </span>
              <span className="block text-xs text-muted-foreground">
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
        </nav>

        <div className="space-y-2 border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          >
            {collapsed ? (
              <ChevronsRight className="size-4" aria-hidden />
            ) : (
              <>
                <ChevronsLeft className="size-4" aria-hidden />
                Replier
              </>
            )}
          </Button>
          <ProfileBlock collapsed={collapsed} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur md:hidden">
          <ShieldCheck className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-serif text-base font-semibold">
            {title ?? "PREPA IRCA 45001"}
          </span>
          <Link to="/parametres" aria-label="Paramètres">
            <Settings className="size-5 text-muted-foreground" aria-hidden />
          </Link>
        </header>

        <main className="min-w-0 flex-1 pb-24 md:pb-0">{children}</main>

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
