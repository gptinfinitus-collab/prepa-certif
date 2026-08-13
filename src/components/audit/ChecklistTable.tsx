import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/i18n";
import { ITEM_STATUSES, scoreLabel, type AuditChecklistItem } from "@/lib/audit-checklists";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  conform: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  major: "bg-destructive/15 text-destructive",
  minor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  observation: "bg-primary/15 text-primary",
  na: "bg-muted text-muted-foreground",
};

interface Props {
  items: AuditChecklistItem[];
  onPatch: (id: string, patch: Partial<AuditChecklistItem>) => void;
}

/** Vue grille reprenant la structure d'une matrice d'audit classique. */
export function ChecklistTable({ items, onPatch }: Props) {
  const t = useT();

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[1180px] border-collapse text-sm">
        <thead>
          <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="w-[150px] px-3 py-2 font-medium">{t("audit.fields.chapter")}</th>
            <th className="w-[300px] px-3 py-2 font-medium">{t("audit.fields.requirement")}</th>
            <th className="w-[150px] px-3 py-2 font-medium">{t("audit.compliance.title")}</th>
            <th className="w-[70px] px-3 py-2 text-center font-medium">{t("audit.score.label")}</th>
            <th className="w-[210px] px-3 py-2 font-medium">{t("audit.fields.evidence")}</th>
            <th className="w-[210px] px-3 py-2 font-medium">{t("audit.fields.gap")}</th>
            <th className="w-[210px] px-3 py-2 font-medium">{t("audit.fields.action")}</th>
            <th className="w-[150px] px-3 py-2 font-medium">{t("audit.fields.owner")}</th>
            <th className="w-[140px] px-3 py-2 font-medium">{t("audit.fields.dueDate")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              id={`item-${item.id}`}
              className="border-t border-border align-top scroll-mt-40"
            >
              <td className="px-3 py-2 text-xs text-muted-foreground">{item.chapter}</td>
              <td className="px-3 py-2">
                {item.clause && (
                  <span className="mr-2 text-xs font-semibold text-primary">{item.clause}</span>
                )}
                <span className="leading-snug">{item.requirement}</span>
              </td>
              <td className="px-3 py-2">
                <Select
                  value={item.status}
                  onValueChange={(value) => onPatch(item.id, { status: value })}
                >
                  <SelectTrigger className="h-8 w-full text-xs print:hidden">
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
                <Badge className={`hidden print:inline-flex ${STATUS_STYLES[item.status]}`}>
                  {t(`audit.itemStatus.${item.status}`)}
                </Badge>
              </td>
              <td className="px-3 py-2 text-center text-sm font-medium tabular-nums">
                {scoreLabel(item.status)}
              </td>
              <td className="px-3 py-2">
                <Textarea
                  rows={2}
                  className="min-h-0 text-xs"
                  defaultValue={item.evidence ?? ""}
                  onBlur={(event) => onPatch(item.id, { evidence: event.target.value })}
                />
              </td>
              <td className="px-3 py-2">
                <Textarea
                  rows={2}
                  className="min-h-0 text-xs"
                  defaultValue={item.gap ?? ""}
                  onBlur={(event) => onPatch(item.id, { gap: event.target.value })}
                />
              </td>
              <td className="px-3 py-2">
                <Textarea
                  rows={2}
                  className="min-h-0 text-xs"
                  defaultValue={item.action ?? ""}
                  onBlur={(event) => onPatch(item.id, { action: event.target.value })}
                />
              </td>
              <td className="px-3 py-2">
                <Input
                  className="h-8 text-xs"
                  defaultValue={item.owner ?? ""}
                  onBlur={(event) => onPatch(item.id, { owner: event.target.value })}
                />
              </td>
              <td className="px-3 py-2">
                <Input
                  type="date"
                  className="h-8 text-xs"
                  defaultValue={item.due_date ?? ""}
                  onChange={(event) => onPatch(item.id, { due_date: event.target.value || null })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
