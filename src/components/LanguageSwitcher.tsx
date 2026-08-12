import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LOCALES, LOCALE_LABELS } from "@/i18n/config";
import { useLocale, useT } from "@/i18n";

/** Sélecteur de langue FR / EN. */
export function LanguageSwitcher({
  variant = "button",
  className,
}: {
  variant?: "button" | "compact";
  className?: string;
}) {
  const { locale, setLocale } = useLocale();
  const t = useT();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={variant === "compact" ? "icon" : "sm"}
          className={cn("gap-2", className)}
          aria-label={t("common.language")}
        >
          <Languages className="size-4" aria-hidden />
          {variant === "button" && <span className="uppercase">{locale}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => setLocale(code)}
            className={cn(code === locale && "font-medium text-primary")}
          >
            {LOCALE_LABELS[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
