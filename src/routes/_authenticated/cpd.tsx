import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, NotebookPen, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { CpdEntryDialog } from "@/components/cpd/CpdEntryDialog";
import { CpdRing } from "@/components/cpd/CpdRing";
import { CpdTypeBreakdown } from "@/components/cpd/CpdTypeBreakdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  availableYears,
  CPD_TYPES,
  entryYear,
  formatHours,
  toCsv,
  totalHours,
  useCpdEntries,
  useCpdTarget,
  useDeleteCpdEntry,
  useSaveCpdTarget,
  useUpsertCpdEntry,
  type CpdEntry,
  type CpdEntryInput,
} from "@/lib/cpd";

export const Route = createFileRoute("/_authenticated/cpd")({
  head: () => ({
    meta: [
      { title: "Journal CPD — PREPA CERTIF" },
      {
        name: "description",
        content:
          "Suivez vos heures de développement professionnel continu (CPD) pour le maintien de votre certification Lead Auditor.",
      },
      { property: "og:title", content: "Journal CPD — PREPA CERTIF" },
      {
        property: "og:description",
        content: "Objectif annuel, répartition par type d'activité et export CSV de vos heures CPD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CpdPage,
});

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function CpdPage() {
  const currentYear = new Date().getFullYear();
  const { data: entries = [], isLoading } = useCpdEntries();
  const { data: target = 20 } = useCpdTarget();
  const saveTarget = useSaveCpdTarget();
  const upsert = useUpsertCpdEntry();
  const remove = useDeleteCpdEntry();

  const [year, setYear] = useState<number>(currentYear);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CpdEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CpdEntry | null>(null);
  const [targetDraft, setTargetDraft] = useState<string | null>(null);

  const years = useMemo(() => availableYears(entries, currentYear), [entries, currentYear]);
  const yearEntries = useMemo(
    () => entries.filter((e) => entryYear(e) === year),
    [entries, year],
  );
  const filtered = useMemo(
    () => (typeFilter === "all" ? yearEntries : yearEntries.filter((e) => e.type === typeFilter)),
    [yearEntries, typeFilter],
  );
  const yearTotal = totalHours(yearEntries);

  const handleSubmit = async (input: CpdEntryInput) => {
    try {
      await upsert.mutateAsync(input);
      setDialogOpen(false);
      setEditing(null);
      toast.success(input.id ? "Entrée mise à jour" : "Entrée ajoutée");
    } catch {
      toast.error("Enregistrement impossible");
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Entrée supprimée");
    } catch {
      toast.error("Suppression impossible");
    } finally {
      setPendingDelete(null);
    }
  };

  const commitTarget = async () => {
    if (targetDraft === null) return;
    const value = Number(targetDraft.replace(",", "."));
    setTargetDraft(null);
    if (!Number.isFinite(value) || value <= 0 || value === target) return;
    try {
      await saveTarget.mutateAsync(value);
      toast.success("Objectif annuel mis à jour");
    } catch {
      toast.error("Mise à jour impossible");
    }
  };

  const exportCsv = () => {
    if (entries.length === 0) {
      toast.error("Aucune entrée à exporter");
      return;
    }
    const blob = new Blob([`\uFEFF${toCsv(entries)}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `journal-cpd-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  return (
    <AppShell title="Journal CPD">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Journal CPD</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Développement professionnel continu — maintien de la certification Lead Auditor.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <Download className="size-4" aria-hidden />
              Export CSV
            </Button>
            <Button onClick={openNew}>
              <Plus className="size-4" aria-hidden />
              Nouvelle entrée
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Progression {year}</CardTitle>
              <CardDescription>Heures cumulées par rapport à votre objectif annuel.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-6">
              <CpdRing total={yearTotal} target={target} />
              <div className="min-w-[10rem] flex-1 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cpd-target">Objectif annuel (heures)</Label>
                  <Input
                    id="cpd-target"
                    type="number"
                    min="1"
                    step="1"
                    className="max-w-[9rem]"
                    value={targetDraft ?? String(target)}
                    onChange={(e) => setTargetDraft(e.target.value)}
                    onBlur={commitTarget}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {yearTotal >= target
                    ? "Objectif atteint. Continuez à consigner vos activités."
                    : `Il reste ${formatHours(Math.round((target - yearTotal) * 100) / 100)} à réaliser.`}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition par type</CardTitle>
              <CardDescription>Heures par type d'activité en {year}.</CardDescription>
            </CardHeader>
            <CardContent>
              <CpdTypeBreakdown entries={yearEntries} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Mes activités</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                  <SelectTrigger className="w-[7.5rem]" aria-label="Filtrer par année">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[10rem]" aria-label="Filtrer par type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {CPD_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Chargement…</p>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center">
                <NotebookPen className="size-8 text-muted-foreground" aria-hidden />
                <div>
                  <p className="font-medium">Aucune activité enregistrée</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Commencez à consigner vos formations, audits et lectures professionnelles.
                  </p>
                </div>
                <Button onClick={openNew}>
                  <Plus className="size-4" aria-hidden />
                  Ajouter une entrée
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Aucune entrée pour ces filtres.
              </p>
            ) : (
              <>
                {/* Tableau — desktop */}
                <div className="hidden overflow-x-auto md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[8.5rem]">Date</TableHead>
                        <TableHead>Activité</TableHead>
                        <TableHead className="w-[9rem]">Type</TableHead>
                        <TableHead className="w-[6rem] text-right">Heures</TableHead>
                        <TableHead className="w-[6rem] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatDate(entry.date)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{entry.title}</span>
                            {entry.reference && (
                              <span className="block truncate text-xs text-muted-foreground">
                                {entry.reference}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{entry.type}</Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatHours(entry.hours)}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Modifier ${entry.title}`}
                                onClick={() => {
                                  setEditing(entry);
                                  setDialogOpen(true);
                                }}
                              >
                                <Pencil className="size-4" aria-hidden />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Supprimer ${entry.title}`}
                                onClick={() => setPendingDelete(entry)}
                              >
                                <Trash2 className="size-4 text-destructive" aria-hidden />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Cartes — mobile */}
                <ul className="space-y-3 md:hidden">
                  {filtered.map((entry) => (
                    <li key={entry.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{entry.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatDate(entry.date)} · {formatHours(entry.hours)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {entry.type}
                        </Badge>
                      </div>
                      {entry.reference && (
                        <p className="mt-2 truncate text-xs text-muted-foreground">
                          {entry.reference}
                        </p>
                      )}
                      <div className="mt-2 flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Modifier ${entry.title}`}
                          onClick={() => {
                            setEditing(entry);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-4" aria-hidden />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Supprimer ${entry.title}`}
                          onClick={() => setPendingDelete(entry)}
                        >
                          <Trash2 className="size-4 text-destructive" aria-hidden />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <CpdEntryDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        entry={editing}
        onSubmit={handleSubmit}
        saving={upsert.isPending}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette entrée ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {pendingDelete?.title} » sera définitivement retirée de votre journal CPD.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
