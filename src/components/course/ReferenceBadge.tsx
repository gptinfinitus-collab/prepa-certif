import { BookOpenCheck, Compass, ShieldCheck, Lightbulb, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { NormativeRef, ReferenceType } from "@/data/program";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

const icons: Record<ReferenceType, typeof BookOpenCheck> = {
  REQUIREMENT: ShieldCheck,
  GUIDANCE: Compass,
  CERTIFICATION_RULE: BookOpenCheck,
  GOOD_PRACTICE: Lightbulb,
  PEDAGOGICAL_EXAMPLE: GraduationCap,
};

const prefixKeys: Record<ReferenceType, string> = {
  REQUIREMENT: "course.reference.requirement",
  GUIDANCE: "course.reference.guidance",
  CERTIFICATION_RULE: "course.reference.certificationRule",
  GOOD_PRACTICE: "course.reference.goodPractice",
  PEDAGOGICAL_EXAMPLE: "course.reference.pedagogicalExample",
};

/** Libellé lisible du référentiel, ex. « ISO 45001:2018 + Amd 1:2024 ». */
export function referenceLabel(
  ref: NormativeRef,
  translate: (key: string) => string = (key) => key,
): string | null {
  const type = ref.referenceType;
  if (!type) return null;
  const parts: string[] = [translate(prefixKeys[type])];
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
  const t = useT();
  const label = referenceLabel(reference, t);
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
