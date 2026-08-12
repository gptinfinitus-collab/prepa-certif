import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Ban,
  CheckCircle2,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLocale, useT } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminUsers, useDeleteUser, useIsSuperAdmin, useToggleUserDisabled } from "@/lib/admin";
import {
  type AdminSortKey,
  computeAdminStats,
  filterAdminUsers,
  sortAdminUsers,
} from "@/lib/admin-users";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administration — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Espace super administrateur : suivez les comptes inscrits, leur activité de préparation, désactivez ou supprimez un utilisateur.",
      },
      { property: "og:title", content: "Administration — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Suivi des comptes et de l'activité des apprenants PREPA CERTIF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function formatDate(value: string | null, locale: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SortButton({
  label,
  sortKey,
  active,
  direction,
  onSort,
  ariaLabel,
}: {
  label: string;
  ariaLabel: string;
  sortKey: AdminSortKey;
  active: AdminSortKey;
  direction: "asc" | "desc";
  onSort: (key: AdminSortKey) => void;
}) {
  const isActive = active === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
      aria-label={ariaLabel}
    >
      {label}
      {isActive ? (
        direction === "asc" ? (
          <ArrowUp className="size-3" aria-hidden />
        ) : (
          <ArrowDown className="size-3" aria-hidden />
        )
      ) : null}
    </button>
  );
}

function AdminPage() {
  const t = useT();
  const { locale } = useLocale();
  const isSuperAdmin = useIsSuperAdmin();
  const { data: users = [], isLoading, refetch, isFetching } = useAdminUsers(isSuperAdmin);
  const toggle = useToggleUserDisabled();
  const remove = useDeleteUser();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<AdminSortKey>("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(
    () => sortAdminUsers(filterAdminUsers(users, search), sortKey, direction),
    [users, search, sortKey, direction],
  );

  const stats = useMemo(() => computeAdminStats(users), [users]);

  function toggleSort(key: AdminSortKey) {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("desc");
    }
  }


  if (!isSuperAdmin) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <ShieldCheck className="mx-auto size-10 text-muted-foreground" aria-hidden />
          <h1 className="mt-4 text-xl font-semibold">{t("admin.restrictedTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("admin.restrictedDesc")}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("admin.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("admin.subtitle")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} aria-hidden />
            {t("admin.refresh")}
          </Button>
        </header>

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
          {[
            { label: t("admin.stats.total"), value: stats.total, icon: Users },
            { label: t("admin.stats.signups7"), value: stats.signupsLast7, icon: UserPlus },
            { label: t("admin.stats.signups30"), value: stats.signupsLast30, icon: UserPlus },
            { label: t("admin.stats.active7"), value: stats.activeLast7, icon: CheckCircle2 },
            { label: t("admin.stats.disabled"), value: stats.disabled, icon: Ban },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <s.icon className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("admin.users")}</CardTitle>
            <CardDescription>{t("admin.usersDesc")}</CardDescription>
            <div className="relative pt-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("admin.searchPlaceholder")}
                className="pl-9"
                aria-label={t("admin.searchPlaceholder")}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("admin.loading")}</p>
            ) : filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("admin.noAccountFound")}</p>
            ) : (
              <div className="-mx-2 overflow-x-auto px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <SortButton
                          label={t("admin.columns.user")}
                          ariaLabel={t("admin.sortBy", { label: t("admin.columns.user") })}
                          sortKey="name"
                          active={sortKey}
                          direction={direction}
                          onSort={toggleSort}
                        />
                      </TableHead>
                      <TableHead>{t("admin.columns.certification")}</TableHead>
                      <TableHead className="text-right">
                        <SortButton
                          label={t("admin.columns.activity")}
                          ariaLabel={t("admin.sortBy", { label: t("admin.columns.activity") })}
                          sortKey="activity"
                          active={sortKey}
                          direction={direction}
                          onSort={toggleSort}
                        />
                      </TableHead>
                      <TableHead className="text-right">{t("admin.columns.docs")}</TableHead>
                      <TableHead>
                        <SortButton
                          label={t("admin.columns.signupDate")}
                          ariaLabel={t("admin.sortBy", { label: t("admin.columns.signupDate") })}
                          sortKey="createdAt"
                          active={sortKey}
                          direction={direction}
                          onSort={toggleSort}
                        />
                      </TableHead>
                      <TableHead>
                        <SortButton
                          label={t("admin.columns.lastSignIn")}
                          ariaLabel={t("admin.sortBy", { label: t("admin.columns.lastSignIn") })}
                          sortKey="lastSignInAt"
                          active={sortKey}
                          direction={direction}
                          onSort={toggleSort}
                        />
                      </TableHead>
                      <TableHead className="text-right">{t("admin.columns.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((u) => (
                      <TableRow key={u.id} className={u.disabled ? "opacity-60" : undefined}>
                        <TableCell className="min-w-56">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{u.displayName ?? "—"}</span>
                            {u.isSuperAdmin && <Badge variant="secondary">{t("admin.superAdmin")}</Badge>}
                            {u.disabled && <Badge variant="destructive">{t("admin.disabled")}</Badge>}
                          </div>
                          <span className="block truncate text-xs text-muted-foreground">
                            {u.email}
                            {u.provider ? ` · ${u.provider}` : ""}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">
                          {u.activeCertification ?? "—"}
                          {u.activeTrack ? (
                            <span className="block text-xs text-muted-foreground">
                              {u.activeTrack}
                            </span>
                          ) : null}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right text-sm tabular-nums">
                          {u.modulesCompleted} {t("admin.sessionsUnit")}
                          <span className="block text-xs text-muted-foreground">
                            {u.quizSessions} {t("admin.quizUnit")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {u.documentsCount}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(u.createdAt, locale)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(u.lastSignInAt, locale)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              disabled={u.isSuperAdmin || toggle.isPending}
                              aria-label={u.disabled ? t("admin.reactivateAccount") : t("admin.disableAccount")}
                              onClick={() =>
                                toggle.mutate(
                                  { userId: u.id, disabled: !u.disabled },
                                  {
                                    onSuccess: () =>
                                      toast.success(
                                        u.disabled
                                          ? t("admin.accountReactivated")
                                          : t("admin.accountDisabled"),
                                      ),
                                    onError: (e: Error) => toast.error(e.message),
                                  },
                                )
                              }
                            >
                              {u.disabled ? (
                                <CheckCircle2 className="size-4" aria-hidden />
                              ) : (
                                <Ban className="size-4" aria-hidden />
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-destructive"
                                  disabled={u.isSuperAdmin}
                                  aria-label={t("admin.deleteAccount")}
                                >
                                  <Trash2 className="size-4" aria-hidden />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t("admin.deleteAccountTitle")}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t("admin.deleteAccountDesc", { email: u.email })}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      remove.mutate(u.id, {
                                        onSuccess: () => toast.success(t("admin.accountDeleted")),
                                        onError: (e: Error) => toast.error(e.message),
                                      })
                                    }
                                  >
                                    {t("common.delete")}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
