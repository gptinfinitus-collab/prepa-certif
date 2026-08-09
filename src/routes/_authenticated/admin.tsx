import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, RefreshCw, Search, ShieldCheck, Trash2, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
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

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AdminPage() {
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
          <h1 className="mt-4 text-xl font-semibold">Espace réservé</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cette page est réservée au super administrateur de PREPA CERTIF.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
            <p className="text-sm text-muted-foreground">
              Qui utilise PREPA CERTIF, et où en sont-ils dans leur préparation.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} aria-hidden />
            Actualiser
          </Button>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Comptes", value: stats.total, icon: Users },
            { label: "Comptes actifs", value: stats.active, icon: CheckCircle2 },
            { label: "Connectés (7 j)", value: stats.recent, icon: ShieldCheck },
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
            <CardTitle className="text-base">Utilisateurs</CardTitle>
            <CardDescription>
              Recherchez par nom ou e-mail, puis désactivez ou supprimez un compte.
            </CardDescription>
            <div className="relative pt-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un utilisateur"
                className="pl-9"
                aria-label="Rechercher un utilisateur"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
            ) : filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Aucun compte trouvé.</p>
            ) : (
              <div className="-mx-2 overflow-x-auto px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Certification</TableHead>
                      <TableHead className="text-right">Séances</TableHead>
                      <TableHead className="text-right">Quiz</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((u) => (
                      <TableRow key={u.id} className={u.disabled ? "opacity-60" : undefined}>
                        <TableCell className="min-w-56">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{u.displayName ?? "—"}</span>
                            {u.isSuperAdmin && <Badge variant="secondary">Super admin</Badge>}
                            {u.disabled && <Badge variant="destructive">Désactivé</Badge>}
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
                        <TableCell className="text-right tabular-nums">
                          {u.modulesCompleted}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{u.quizSessions}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(u.lastSignInAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              disabled={u.isSuperAdmin || toggle.isPending}
                              aria-label={u.disabled ? "Réactiver le compte" : "Désactiver le compte"}
                              onClick={() =>
                                toggle.mutate(
                                  { userId: u.id, disabled: !u.disabled },
                                  {
                                    onSuccess: () =>
                                      toast.success(
                                        u.disabled ? "Compte réactivé." : "Compte désactivé.",
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
                                  aria-label="Supprimer le compte"
                                >
                                  <Trash2 className="size-4" aria-hidden />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer ce compte ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {u.email} et toutes ses données de préparation seront
                                    définitivement supprimés. Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      remove.mutate(u.id, {
                                        onSuccess: () => toast.success("Compte supprimé."),
                                        onError: (e: Error) => toast.error(e.message),
                                      })
                                    }
                                  >
                                    Supprimer
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
