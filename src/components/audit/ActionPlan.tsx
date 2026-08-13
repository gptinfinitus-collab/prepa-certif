import { AlertTriangle, CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n";
import type { AuditChecklistItem } from "@/lib/audit-checklists";

/** Lignes qui doivent apparaître dans le plan d'actions : NC, observations ou action saisie. */
export function actionPlanItems(items: AuditChecklistItem[]): AuditChecklistItem[] {
  const relevant = items.filter(
    (item) =>
      ["major", "minor", "observation"].includes(item.status) ||
      (item.action ?? "").trim().length > 0 ||
      (item.gap ?? "").trim().length > 0,
  );
  return relevant.sort((a, b) => {
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return a.position - b.position;
  });
}

const STATUS_TONES: Record<string, string> = {
  major: "bg-destructive/15 text-destructive",
  minor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  observation: "bg-primary/15 text-primary",
};

/** Suivi transversal des écarts et de leurs actions correctives. */
export function ActionPlan({ items }: { items: AuditChecklistItem[] }) {
  const t = useT();
  const rows = actionPlanItems(items);
  const today = new Date().toISOString().slice(0, 10);
  const incomplete = rows.filter(
    (row) => !(row.owner ?? "").trim() || !row.due_date,
  ).length;

  return (
    <Card>
      <CardHeader className="gap-1 pb-3">
        <CardTitle className="text-base">{t("audit.actionPlan.title")}</CardTitle>
        {rows.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {t("audit.actionPlan.count", { count: rows.length })}
            {incomplete > 0 && ` · ${t("audit.actionPlan.missing", { count: incomplete })}`}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("audit.actionPlan.empty")}</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => {
              const overdue = Boolean(row.due_date && row.due_date < today);
              return (
                <li
                  key={row.id}
                  className="rounded-lg border border-border bg-background/60 p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {row.clause && (
                      <span className="text-xs font-semibold text-primary">{row.clause}</span>
                    )}
                    <Badge
                      variant="secondary"
                      className={STATUS_TONES[row.status] ?? "bg-muted text-muted-foreground"}
                    >
                      {t(`audit.itemStatus.${row.status}`)}
                    </Badge>
                    <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      {overdue ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                      ) : (
                        <CalendarClock className="h-3.5 w-3.5" />
                      )}
                      <span className={overdue ? "font-medium text-destructive" : ""}>
                        {row.due_date ?? t("audit.actionPlan.noDate")}
                        {overdue ? ` · ${t("audit.actionPlan.overdue")}` : ""}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium leading-snug">{row.requirement}</p>
                  {row.gap && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium">{t("audit.actionPlan.gap")} : </span>
                      {row.gap}
                    </p>
                  )}
                  {row.action && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium">{t("audit.actionPlan.action")} : </span>
                      {row.action}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium">{t("audit.actionPlan.owner")} : </span>
                    {row.owner?.trim() || t("audit.actionPlan.noOwner")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
