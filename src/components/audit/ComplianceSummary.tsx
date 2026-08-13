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

type Counts = Summary["byChapter"][number]["counts"];

const BADGE_TONES: Record<keyof Counts, string> = {
  conform: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  observation: "bg-primary/15 text-primary",
  minor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  major: "bg-destructive/15 text-destructive",
  na: "bg-muted text-muted-foreground",
  pending: "bg-muted text-muted-foreground",
};

/** Badges de répartition par statut, partagés entre la vue mobile et le tableau. */
function CountBadges({ counts, t }: { counts: Counts; t: (key: string) => string }) {
  return (
    <>
      {(Object.keys(BADGE_TONES) as (keyof Counts)[]).map((key) =>
        counts[key] > 0 ? (
          <Badge key={key} variant="secondary" className={BADGE_TONES[key]}>
            {t(`audit.itemStatus.${key}`)} · {counts[key]}
          </Badge>
        ) : null,
      )}
    </>
  );

/** Synthèse de conformité par chapitre + taux global (calcul purement local). */
export const ComplianceSummary = memo(function ComplianceSummary({ summary }: Props) {
  const t = useT();
  const [open, setOpen] = useState(true);
  const { byChapter, overall } = summary;

  if (byChapter.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card print:break-inside-avoid">
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
        {/* Mobile : liste empilée, pas de tableau à faire défiler */}
        <ul className="space-y-2 px-3 pb-4 sm:hidden print:hidden">
          {byChapter.map((row) => (
            <li key={row.chapter} className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-medium">{row.chapter}</span>
                <span className={`shrink-0 text-sm font-bold tabular-nums ${rateTone(row.rate)}`}>
                  {row.rate === null ? "—" : `${row.rate}%`}
                </span>
              </div>
              <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                {row.evaluated} / {row.total}
              </p>
              <Progress value={row.rate ?? 0} className="mt-2 h-1.5" />
              <div className="mt-2 flex flex-wrap gap-1">
                <CountBadges counts={row.counts} t={t} />
              </div>
            </li>
          ))}
          <li className="rounded-lg border border-border bg-muted/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">{t("audit.compliance.overall")}</span>
              <span className={`text-base font-bold tabular-nums ${rateTone(overall.rate)}`}>
                {overall.rate === null ? "—" : `${overall.rate}%`}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {overall.evaluated} / {overall.applicable} ·{" "}
              {t("audit.compliance.coverage", { coverage: overall.coverage })}
            </p>
          </li>
          <li className="px-1 text-xs italic text-muted-foreground">{t("audit.compliance.note")}</li>
        </ul>

        <div className="hidden overflow-x-auto px-4 pb-4 sm:block print:block">
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
