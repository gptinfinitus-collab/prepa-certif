import { BookOpenCheck, Compass, ShieldCheck, Lightbulb, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { NormativeRef, ReferenceType } from "@/data/program";
import { cn } from "@/lib/utils";

const icons: Record<ReferenceType, typeof BookOpenCheck> = {
  REQUIREMENT: ShieldCheck,
  GUIDANCE: Compass,
  CERTIFICATION_RULE: BookOpenCheck,
  GOOD_PRACTICE: Lightbulb,
  PEDAGOGICAL_EXAMPLE: GraduationCap,
};

const prefixes: Record<ReferenceType, string> = {
  REQUIREMENT: "Exigence",
  GUIDANCE: "Ligne directrice",
  CERTIFICATION_RULE: "Règle de certification",
  GOOD_PRACTICE: "Bonne pratique",
  PEDAGOGICAL_EXAMPLE: "Exemple pédagogique",
};

/** Libellé lisible du référentiel, ex. « ISO 45001:2018 + Amd 1:2024 ». */
export function referenceLabel(ref: NormativeRef): string | null {
  const type = ref.referenceType;
  if (!type) return null;
  const parts: string[] = [prefixes[type]];
  if (ref.standardRef) {
    parts.push(ref.standardEdition ? `${ref.standardRef}:${ref.standardEdition}` : ref.standardRef);
  }
  const base = parts.join(" ");
  return ref.clauseRef ? `${base} § ${ref.clauseRef}` : base;
}

/**
 * Badge de traçabilité normative : distingue une exigence de la norme auditée
 * d'une ligne directrice d'audit, d'une règle de certification tierce partie
 * ou d'un contenu purement pédagogique.
 */
export function ReferenceBadge({
  reference,
  className,
}: {
  reference: NormativeRef;
  className?: string;
}) {
  const label = referenceLabel(reference);
  if (!label || !reference.referenceType) return null;
  const Icon = icons[reference.referenceType];
  const isRequirement = reference.referenceType === "REQUIREMENT";

  return (
    <Badge
      variant={isRequirement ? "default" : "outline"}
      className={cn("gap-1 font-normal", className)}
    >
      <Icon className="size-3" aria-hidden />
      {label}
    </Badge>
  );
}
