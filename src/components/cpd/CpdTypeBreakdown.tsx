import { formatHours, hoursByType, type CpdEntry } from "@/lib/cpd";
import { useLocale, useT } from "@/i18n";

/** Répartition des heures CPD par type d'activité. */
export function CpdTypeBreakdown({ entries }: { entries: CpdEntry[] }) {
  const t = useT();
  const { bcp47 } = useLocale();
  const rows = hoursByType(entries);
  const max = rows.length > 0 ? Math.max(...rows.map((r) => r.hours)) : 0;

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t("cpd.noHoursThisYear")}</p>
    );
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.type} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{t(`cpd.types.${row.type}`, { defaultValue: row.type })}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {formatHours(row.hours, bcp47)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${max > 0 ? (row.hours / max) * 100 : 0}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
