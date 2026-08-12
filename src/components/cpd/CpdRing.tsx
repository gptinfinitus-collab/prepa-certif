import { formatHours } from "@/lib/cpd";
import { useT } from "@/i18n";

/** Jauge circulaire de progression CPD (tokens sémantiques uniquement). */
export function CpdRing({
  total,
  target,
  size = 148,
}: {
  total: number;
  target: number;
  size?: number;
}) {
  const t = useT();
  const safeTarget = target > 0 ? target : 1;
  const ratio = Math.min(total / safeTarget, 1);
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.round((total / safeTarget) * 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        role="img"
        aria-label={t("cpd.progressAriaLabel", { percent })}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums">{percent}%</span>
        <span className="text-xs text-muted-foreground">
          {formatHours(total)} / {formatHours(target)}
        </span>
      </div>
    </div>
  );
}
