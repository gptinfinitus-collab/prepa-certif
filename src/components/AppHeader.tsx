import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Programme" },
  { to: "/planning", label: "Mon planning" },
  { to: "/references", label: "Références ISO" },
  { to: "/glossaire", label: "Glossaire" },
  { to: "/annexes", label: "Annexes" },
];

export function AppHeader() {
  const { data: user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" aria-hidden />
          <span className="font-serif text-base font-semibold tracking-tight">PREPA IRCA 45001</span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                pathname.startsWith(item.to) && "font-medium text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="size-4" aria-hidden />
              Se déconnecter
            </Button>
          </div>
        ) : (
          <Button asChild size="sm">
            <Link to="/auth">Se connecter</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
