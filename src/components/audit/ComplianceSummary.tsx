import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useT } from "@/i18n";
import type { ComplianceSummary as Summary } from "@/lib/audit-checklists";

interface Props {
  summary: Summary;
}

/** Couleur du taux : vert ≥ 90 %, ambre ≥ 70 %, rouge en dessous. */
function rateTone(rate: number | null): string {
  if (rate === null) return "text-muted-foreground";
  if (rate >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-destructive";
}

/** Synthèse de conformité par chapitre + taux global (calcul purement local). */
export const ComplianceSummary = memo(function ComplianceSummary({ summary }: Props) {
  const t = useT();
  const [open, setOpen] = useState(true);
  const { byChapter, overall } = summary;

  if (byChapter.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card/60 print:break-inside-avoid">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold">{t("audit.compliance.title")}</span>
        <span className="flex items-center gap-2">
          <span className={`text-sm font-bold tabular-nums ${rateTone(overall.rate)}`}>
            {overall.rate === null ? "—" : `${overall.rate}%`}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform print:hidden ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <div className={open ? "block" : "hidden print:block"}>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-medium">{t("audit.compliance.chapter")}</th>
                <th className="py-2 pr-3 text-right font-medium">{t("audit.compliance.evaluated")}</th>
                <th className="py-2 pr-3 font-medium">{t("audit.compliance.breakdown")}</th>
                <th className="py-2 text-right font-medium">{t("audit.compliance.rate")}</th>
              </tr>
            </thead>
            <tbody>
              {byChapter.map((row) => (
                <tr key={row.chapter} className="border-b border-border/60 align-middle">
                  <td className="py-2 pr-3 font-medium">{row.chapter}</td>
                  <td className="py-2 pr-3 text-right tabular-nums text-muted-foreground">
                    {row.evaluated} / {row.total}
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex flex-wrap gap-1">
                      {row.counts.conform > 0 && (
                        <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          {t("audit.itemStatus.conform")} · {row.counts.conform}
                        </Badge>
                      )}
                      {row.counts.observation > 0 && (
                        <Badge variant="secondary" className="bg-primary/15 text-primary">
                          {t("audit.itemStatus.observation")} · {row.counts.observation}
                        </Badge>
                      )}
                      {row.counts.minor > 0 && (
                        <Badge variant="secondary" className="bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          {t("audit.itemStatus.minor")} · {row.counts.minor}
                        </Badge>
                      )}
                      {row.counts.major > 0 && (
                        <Badge variant="secondary" className="bg-destructive/15 text-destructive">
                          {t("audit.itemStatus.major")} · {row.counts.major}
                        </Badge>
                      )}
                      {row.counts.na > 0 && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          {t("audit.itemStatus.na")} · {row.counts.na}
                        </Badge>
                      )}
                      {row.counts.pending > 0 && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          {t("audit.itemStatus.pending")} · {row.counts.pending}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={row.rate ?? 0} className="hidden h-1.5 w-20 sm:block" />
                      <span className={`w-12 text-right font-semibold tabular-nums ${rateTone(row.rate)}`}>
                        {row.rate === null ? "—" : `${row.rate}%`}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-3 pr-3 font-semibold">{t("audit.compliance.overall")}</td>
                <td className="py-3 pr-3 text-right tabular-nums text-muted-foreground">
                  {overall.evaluated} / {overall.applicable}
                </td>
                <td className="py-3 pr-3 text-xs text-muted-foreground">
                  {t("audit.compliance.coverage", { coverage: overall.coverage })}
                </td>
                <td className={`py-3 text-right text-base font-bold tabular-nums ${rateTone(overall.rate)}`}>
                  {overall.rate === null ? "—" : `${overall.rate}%`}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="pt-2 text-xs italic text-muted-foreground">{t("audit.compliance.note")}</p>
        </div>
      </div>
    </section>
  );
});
