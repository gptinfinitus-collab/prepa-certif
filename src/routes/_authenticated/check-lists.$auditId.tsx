import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  LayoutGrid,
  Table2,
  Download,
  Plus,
  Printer,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocale, useT } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { pageHead } from "@/lib/seo";
import { ComplianceSummary } from "@/components/audit/ComplianceSummary";
import { ActionPlan } from "@/components/audit/ActionPlan";
import { ChecklistTable } from "@/components/audit/ChecklistTable";
import {
  buildChecklistCsv,
  complianceSummary,
  downloadTextFile,
  findTemplate,
  scoreLabel,
  slugifyTitle,
  summarize,
  templateItemCount,
  useAddChecklistItem,
  useAuditChecklist,
  useAuditChecklistItems,
  useDeleteChecklistItem,
  useSyncChecklistFromTemplate,
  useUpdateAuditChecklist,
  useUpdateChecklistItem,
  CHECKLIST_STATUSES,
  ITEM_STATUSES,
  type AuditChecklistItem,
} from "@/lib/audit-checklists";

export const Route = createFileRoute("/_authenticated/check-lists/$auditId")({
  head: ({ match }) => {
    const locale = (match.context as { locale?: Locale }).locale ?? DEFAULT_LOCALE;
    return pageHead(locale, "checklistDetail", "/check-lists");
  },
  component: ChecklistDetailPage,
});

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  conform: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  major: "bg-destructive/15 text-destructive",
  minor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  observation: "bg-primary/15 text-primary",
  na: "bg-muted text-muted-foreground",
};

function ChecklistDetailPage() {
  const { auditId } = Route.useParams();
  const t = useT();
  const { locale } = useLocale();
  const navigate = useNavigate();

  const { data: checklist, isLoading } = useAuditChecklist(auditId);
  const { data: items = [] } = useAuditChecklistItems(auditId);
  const updateChecklist = useUpdateAuditChecklist(auditId);
  const updateItem = useUpdateChecklistItem(auditId);
  const addItem = useAddChecklistItem(auditId);
  const deleteItem = useDeleteChecklistItem(auditId);
  const syncFromTemplate = useSyncChecklistFromTemplate(auditId);

  // Modèle d'origine : sert à proposer les exigences ajoutées depuis la création.
  const template = checklist?.template_id ? findTemplate(locale, checklist.template_id) : null;
  const templateTotal = template ? templateItemCount(template) : 0;
  const canSync = template !== null && templateTotal > items.length;


  const [filter, setFilter] = useState<"all" | "pending" | "nc">("all");
  const [chapterFilter, setChapterFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ chapter: "", clause: "", requirement: "" });

  // Sur les modèles longs, les chapitres sont repliés par défaut (vue « tous les chapitres »).
  const [view, setView] = useState<"cards" | "table">("cards");
  const [treatmentOpen, setTreatmentOpen] = useState<Record<string, boolean>>({});
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const collapseByDefault = items.length > 60 && chapterFilter === "all" && search.trim() === "";
  const isChapterCollapsed = (chapter: string) =>
    openChapters[chapter] === undefined ? collapseByDefault : !openChapters[chapter];
  const toggleChapter = (chapter: string) =>
    setOpenChapters((prev) => ({ ...prev, [chapter]: isChapterCollapsed(chapter) }));


  const stats = useMemo(() => summarize(items), [items]);
  const compliance = useMemo(() => complianceSummary(items), [items]);

  /** Chapitres présents dans la check-list, dans l'ordre des exigences. */
  const chapters = useMemo(() => {
    const seen: string[] = [];
    for (const item of items) if (!seen.includes(item.chapter)) seen.push(item.chapter);
    return seen;
  }, [items]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return items.filter((item) => {
      if (chapterFilter !== "all" && item.chapter !== chapterFilter) return false;
      if (filter === "pending" && item.status !== "pending") return false;
      if (filter === "nc" && item.status !== "major" && item.status !== "minor") return false;
      if (!needle) return true;
      return `${item.chapter} ${item.clause ?? ""} ${item.requirement}`.toLowerCase().includes(needle);
    });
  }, [items, filter, chapterFilter, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, AuditChecklistItem[]>();
    for (const item of visible) {
      const list = map.get(item.chapter) ?? [];
      list.push(item);
      map.set(item.chapter, list);
    }
    return [...map.entries()];
  }, [visible]);

  /** Options du menu « aller à » : une entrée par exigence affichée. */
  const clauseOptions = useMemo(
    () =>
      visible.map((item) => ({
        id: item.id,
        label: `${item.clause ?? item.chapter} — ${item.requirement.slice(0, 48)}`,
      })),
    [visible],
  );

  function jumpToClause(id: string) {
    // Déplie le chapitre concerné avant de faire défiler jusqu'à l'exigence.
    const chapter = items.find((item) => item.id === id)?.chapter;
    if (chapter) setOpenChapters((prev) => ({ ...prev, [chapter]: true }));
    requestAnimationFrame(() => {
      document
        .getElementById(`item-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function patchItem(id: string, patch: Partial<AuditChecklistItem>) {
    updateItem.mutate({ id, patch });
  }

  function exportCsv() {
    const headers = t("audit.export.headers", { returnObjects: true }) as string[];
    const summaryHeaders = t("audit.compliance.csvHeaders", { returnObjects: true }) as string[];
    const summaryRows = [
      ...compliance.byChapter.map((row) => [
        row.chapter,
        String(row.evaluated),
        String(row.total),
        row.rate === null ? "—" : `${row.rate}%`,
      ]),
      [
        t("audit.compliance.overall"),
        String(compliance.overall.evaluated),
        String(compliance.overall.applicable),
        compliance.overall.rate === null ? "—" : `${compliance.overall.rate}%`,
      ],
    ];
    const csv = buildChecklistCsv(items, headers, (status) => t(`audit.itemStatus.${status}`), {
      headers: summaryHeaders,
      rows: summaryRows,
    });
    downloadTextFile(`${slugifyTitle(checklist?.title ?? "audit")}.csv`, csv, "text/csv;charset=utf-8");
  }

  async function askAi(item: AuditChecklistItem) {
    const prompt = t("audit.aiPrompt", {
      requirement: item.requirement,
      clause: item.clause ?? item.chapter,
      evidence: item.evidence || "—",
    });
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      /* presse-papiers indisponible : on ouvre quand même l'assistant */
    }
    navigate({ to: "/assistant" });
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <div className="h-40 animate-pulse rounded-lg border border-border bg-muted/40" />
        </div>
      </AppShell>
    );
  }

  if (!checklist) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6 sm:px-6 lg:py-8">
          <p className="text-sm text-muted-foreground">{t("audit.notFound")}</p>
          <Button asChild variant="outline">
            <Link to="/check-lists">{t("audit.backToList")}</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        <div className="print:hidden">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/check-lists">
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t("audit.backToList")}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="gap-3 pb-3">
            <CardTitle className="text-xl">{checklist.title}</CardTitle>
            {canSync && template && (
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
                <p className="text-xs text-muted-foreground">
                  {t("audit.sync.hint", { count: templateTotal, current: items.length })}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  disabled={syncFromTemplate.isPending}
                  onClick={() =>
                    syncFromTemplate.mutate(template, {
                      onSuccess: ({ added }) =>
                        toast.success(
                          added > 0
                            ? t("audit.sync.added", { count: added })
                            : t("audit.sync.upToDate"),
                        ),
                      onError: () => toast.error(t("audit.sync.error")),
                    })
                  }
                >
                  <RefreshCw
                    className={`mr-1 h-4 w-4 ${syncFromTemplate.isPending ? "animate-spin" : ""}`}
                  />
                  {t("audit.sync.action")}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-1">
                <Label htmlFor="entity">{t("audit.header.auditedEntity")}</Label>
                <Input
                  id="entity"
                  defaultValue={checklist.audited_entity ?? ""}
                  onBlur={(event) => updateChecklist.mutate({ audited_entity: event.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="auditor">{t("audit.header.auditor")}</Label>
                <Input
                  id="auditor"
                  defaultValue={checklist.auditor ?? ""}
                  onBlur={(event) => updateChecklist.mutate({ auditor: event.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="date">{t("audit.header.date")}</Label>
                <Input
                  id="date"
                  type="date"
                  defaultValue={checklist.audit_date ?? ""}
                  onChange={(event) =>
                    updateChecklist.mutate({ audit_date: event.target.value || null })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="status">{t("audit.header.status")}</Label>
                <Select
                  value={checklist.status}
                  onValueChange={(value) => updateChecklist.mutate({ status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHECKLIST_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`audit.status.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:col-span-2 xl:col-span-4">
                <Label htmlFor="scope">{t("audit.header.scope")}</Label>
                <Textarea
                  id="scope"
                  rows={2}
                  defaultValue={checklist.scope ?? ""}
                  onBlur={(event) => updateChecklist.mutate({ scope: event.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">{t("audit.progress")}</span>
                <span className="text-muted-foreground">
                  {t("audit.treated", { treated: stats.treated, total: stats.total })}
                </span>
              </div>
              <Progress value={stats.progress} />
              <div className="flex flex-wrap gap-2 pt-1">
                {ITEM_STATUSES.filter((status) => status !== "pending").map((status) => (
                  <Badge key={status} variant="secondary" className={STATUS_STYLES[status]}>
                    {t(`audit.itemStatus.${status}`)} · {stats.counts[status]}
                  </Badge>
                ))}
              </div>
            </div>

            <ComplianceSummary summary={compliance} />

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap print:hidden">
              <Button size="sm" variant="outline" onClick={exportCsv}>
                <Download className="mr-1 h-4 w-4" />
                {t("audit.export.csv")}
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                <Printer className="mr-1 h-4 w-4" />
                {t("audit.export.print")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="col-span-2 sm:col-span-1"
                onClick={() => setAdding((open) => !open)}
              >
                <Plus className="mr-1 h-4 w-4" />
                {t("audit.addItem.action")}
              </Button>
            </div>

            {adding && (
              <div className="grid gap-2 rounded-lg border border-dashed border-border p-3 sm:grid-cols-4 print:hidden">
                <Input
                  placeholder={t("audit.addItem.chapterPlaceholder")}
                  value={draft.chapter}
                  onChange={(event) => setDraft({ ...draft, chapter: event.target.value })}
                />
                <Input
                  placeholder={t("audit.addItem.clausePlaceholder")}
                  value={draft.clause}
                  onChange={(event) => setDraft({ ...draft, clause: event.target.value })}
                />
                <Input
                  className="sm:col-span-2"
                  placeholder={t("audit.addItem.requirementPlaceholder")}
                  value={draft.requirement}
                  onChange={(event) => setDraft({ ...draft, requirement: event.target.value })}
                />
                <div className="flex gap-2 sm:col-span-4">
                  <Button
                    size="sm"
                    disabled={!draft.requirement.trim() || addItem.isPending}
                    onClick={async () => {
                      await addItem.mutateAsync({
                        chapter: draft.chapter.trim() || t("audit.fields.chapter"),
                        clause: draft.clause.trim(),
                        requirement: draft.requirement.trim(),
                      });
                      setDraft({ chapter: draft.chapter, clause: "", requirement: "" });
                    }}
                  >
                    {t("audit.addItem.submit")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                    {t("audit.addItem.cancel")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="sticky top-[6.5rem] z-20 space-y-3 rounded-xl border border-border bg-card/95 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:p-4 lg:top-2 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <div className="-mx-1 flex w-full gap-2 overflow-x-auto px-1 pb-0.5 sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0">
              {(["all", "pending", "nc"] as const).map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={filter === value ? "default" : "outline"}
                  className="shrink-0"
                  onClick={() => setFilter(value)}
                >
                  {t(`audit.filters.${value}`)}
                </Button>
              ))}
            </div>
            <Input
              className="h-9 w-full sm:ml-auto sm:max-w-xs"
              placeholder={t("audit.filters.search")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {chapters.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-border/60 pt-3 sm:flex-row sm:items-center">
              <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("audit.filters.chapters")}
              </span>
              <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                <Button
                  size="sm"
                  variant={chapterFilter === "all" ? "secondary" : "ghost"}
                  className="h-7 shrink-0 rounded-full px-3 text-xs"
                  onClick={() => setChapterFilter("all")}
                >
                  {t("audit.filters.allChapters")}
                </Button>
                {chapters.map((chapter) => (
                  <Button
                    key={chapter}
                    size="sm"
                    variant={chapterFilter === chapter ? "secondary" : "ghost"}
                    className="h-7 shrink-0 rounded-full px-3 text-xs"
                    onClick={() => setChapterFilter(chapter)}
                  >
                    {chapter}
                  </Button>
                ))}
              </div>
              {clauseOptions.length > 0 && (
                <Select value="" onValueChange={jumpToClause}>
                  <SelectTrigger className="h-8 w-full text-xs sm:ml-auto sm:w-[190px]">
                    <SelectValue placeholder={t("audit.filters.jumpTo")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {clauseOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id} className="text-xs">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>


        {grouped.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            {t("audit.filters.noResult")}
          </p>
        ) : (
          <div className="space-y-6">
            {grouped.map(([chapter, chapterItems]) => {
              const collapsed = isChapterCollapsed(chapter);
              return (
              <section key={chapter} className="space-y-4">
                <button
                  type="button"
                  onClick={() => toggleChapter(chapter)}
                  className="flex w-full items-center gap-2 text-left text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="h-4 w-1 rounded-full bg-primary/60" />
                  {chapter}
                  <span className="text-xs font-normal normal-case">({chapterItems.length})</span>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 shrink-0 transition-transform ${collapsed ? "" : "rotate-180"}`}
                  />
                </button>
                <ul className={`space-y-4 ${collapsed ? "hidden print:block" : ""}`}>
                  {chapterItems.map((item) => (
                    <li key={item.id} id={`item-${item.id}`} className="scroll-mt-48 lg:scroll-mt-40">
                      <Card>
                        <CardContent className="space-y-4 p-4 sm:p-5">
                          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                            <div className="min-w-0 space-y-1">
                              <p className="text-sm font-medium leading-snug">
                                {item.clause ? (
                                  <span className="mr-2 text-primary">{item.clause}</span>
                                ) : null}
                                {item.requirement}
                              </p>
                              {item.guidance && (
                                <p className="text-xs text-muted-foreground">{item.guidance}</p>
                              )}
                            </div>
                            <Select
                              value={item.status}
                              onValueChange={(value) => patchItem(item.id, { status: value })}
                            >
                              <SelectTrigger className="h-9 w-full sm:w-[170px] print:hidden">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ITEM_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {t(`audit.itemStatus.${status}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`shrink-0 tabular-nums ${STATUS_STYLES[item.status]}`}
                              >
                                {t("audit.score.label")} · {scoreLabel(item.status)}
                              </Badge>
                              <Badge className={`hidden print:inline-flex ${STATUS_STYLES[item.status]}`}>
                                {t(`audit.itemStatus.${item.status}`)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs">{t("audit.fields.evidence")}</Label>
                              <Textarea
                                rows={2}
                                defaultValue={item.evidence ?? ""}
                                onBlur={(event) => patchItem(item.id, { evidence: event.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">{t("audit.fields.finding")}</Label>
                              <Textarea
                                rows={2}
                                defaultValue={item.finding ?? ""}
                                onBlur={(event) => patchItem(item.id, { finding: event.target.value })}
                              />
                            </div>
                          </div>

                          {(() => {
                            const needsTreatment = ["major", "minor", "observation"].includes(
                              item.status,
                            );
                            const filled =
                              Boolean(item.gap || item.action || item.owner || item.due_date);
                            const open =
                              treatmentOpen[item.id] ?? (needsTreatment || filled);
                            return (
                              <div className="space-y-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground print:hidden"
                                  onClick={() =>
                                    setTreatmentOpen((prev) => ({ ...prev, [item.id]: !open }))
                                  }
                                >
                                  {t("audit.treatment.title")}
                                  <ChevronDown
                                    className={`ml-auto h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                                  />
                                </button>
                                <div className={open ? "space-y-3" : "hidden print:block"}>
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="space-y-1">
                                      <Label className="text-xs">{t("audit.fields.gap")}</Label>
                                      <Textarea
                                        rows={2}
                                        defaultValue={item.gap ?? ""}
                                        onBlur={(event) =>
                                          patchItem(item.id, { gap: event.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">{t("audit.fields.action")}</Label>
                                      <Textarea
                                        rows={2}
                                        defaultValue={item.action ?? ""}
                                        onBlur={(event) =>
                                          patchItem(item.id, { action: event.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">{t("audit.fields.owner")}</Label>
                                      <Input
                                        className="h-9"
                                        defaultValue={item.owner ?? ""}
                                        onBlur={(event) =>
                                          patchItem(item.id, { owner: event.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">{t("audit.fields.dueDate")}</Label>
                                      <Input
                                        type="date"
                                        className="h-9"
                                        defaultValue={item.due_date ?? ""}
                                        onChange={(event) =>
                                          patchItem(item.id, {
                                            due_date: event.target.value || null,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          <div className="flex flex-wrap items-center gap-2 print:hidden">
                            <Input
                              className="h-9 w-full sm:h-8 sm:max-w-[220px]"
                              placeholder={t("audit.fields.auditee")}
                              defaultValue={item.auditee ?? ""}
                              onBlur={(event) => patchItem(item.id, { auditee: event.target.value })}
                            />
                            <Button size="sm" variant="ghost" className="shrink-0" onClick={() => askAi(item)}>
                              <Sparkles className="mr-1 h-4 w-4" />
                              {t("audit.askAi")}
                            </Button>
                            {item.is_custom && (
                              <Button
                                size="sm"
                                variant="ghost"
                                aria-label={t("audit.deleteItem")}
                                onClick={() => {
                                  deleteItem.mutate(item.id, {
                                    onError: () => toast.error(t("audit.errors.save")),
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
