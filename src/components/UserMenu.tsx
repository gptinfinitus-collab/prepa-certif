import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, LogOut, Moon, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useSession } from "@/lib/queries";
import { useTheme } from "@/components/theme-provider";
import { initialsOf } from "@/components/ProfileEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Menu du profil : avatar rond (mobile) ou carte de sidebar (desktop). */
export function UserMenu({
  variant = "avatar",
  compact = false,
}: {
  variant?: "avatar" | "card";
  compact?: boolean;
}) {
  const { data: profile } = useProfile();
  const { data: user } = useSession();
  const { resolved, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.display_name ||
    "Mon profil";
  const email = profile?.email ?? user?.email ?? "";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const avatar = (
    <Avatar className="size-9 shrink-0 border border-border">
      <AvatarImage src={profile?.avatarSignedUrl ?? undefined} alt="" />
      <AvatarFallback className="text-xs">
        {initialsOf(profile?.first_name, profile?.last_name, email)}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "card" ? (
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              compact && "justify-center px-1.5 py-1.5",
            )}
            aria-label="Ouvrir le menu du profil"
          >
            {avatar}
            {!compact && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{fullName}</span>
                  <span className="block truncate text-xs text-muted-foreground">{email}</span>
                </span>
                <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Ouvrir le menu du profil"
          >
            {avatar}
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={variant === "card" ? "start" : "end"} className="w-64">

        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-9 border border-border">
            <AvatarImage src={profile?.avatarSignedUrl ?? undefined} alt="" />
            <AvatarFallback className="text-xs">
              {initialsOf(profile?.first_name, profile?.last_name, email)}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{fullName}</span>
            <span className="block truncate text-xs text-muted-foreground">{email}</span>
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profil">
            <User className="size-4" aria-hidden />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/parametres">
            <Settings className="size-4" aria-hidden />
            Paramètres
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setTheme(resolved === "dark" ? "light" : "dark");
          }}
          className="justify-between"
        >
          <span className="flex items-center gap-2">
            <Moon className="size-4" aria-hidden />
            Mode sombre
          </span>
          <Switch
            checked={resolved === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Basculer le mode sombre"
          />
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
