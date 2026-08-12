import { cn } from "@/lib/utils";
import type { LessonSection } from "@/lib/lesson-sections";
import { useT } from "@/i18n";
import { Check } from "lucide-react";

export function SectionNav({
  sections,
  currentId,
  readIds,
  onSelect,
  className,
}: {
  sections: LessonSection[];
  currentId: string;
  readIds: string[];
  onSelect: (id: string) => void;
  className?: string;
}) {
  const t = useT();
  return (
    <nav className={cn("space-y-1", className)} aria-label={t("course.courseSummary")}>
      {sections.map((section, index) => {
        const isCurrent = section.id === currentId;
        const isRead = readIds.includes(section.id);
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs leading-snug transition-colors",
              isCurrent
                ? "bg-secondary font-medium text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
                isRead ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
              aria-hidden
            >
              {isRead ? <Check className="size-2.5" /> : index + 1}
            </span>
            <span className="min-w-0 flex-1 break-words">{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function CourseProgressBar({ value }: { value: number }) {
  const t = useT();
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t("course.progressAriaLabel")}
    >
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
