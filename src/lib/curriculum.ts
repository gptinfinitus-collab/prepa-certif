import { useMemo } from "react";
import { getCurriculum, type Curriculum } from "@/data/curriculum";
import { useActiveCertification } from "@/lib/certifications";
import { useLocale } from "@/i18n";

const DEFAULT_SOURCE = {
  code: "iso-45001",
  name: "ISO 45001:2018",
  description: null,
  chapters: [],
  has_curriculum: true,
};

/**
 * Cursus de la certification active : contenu rédigé (ISO 45001) ou squelette
 * officiel de la norme choisie. Retombe sur ISO 45001 hors session.
 */
export function useCurriculum(): { curriculum: Curriculum; certificationName: string } {
  const { certification } = useActiveCertification();
  const { locale } = useLocale();
  const curriculum = useMemo(
    () =>
      getCurriculum(
        certification
          ? {
              code: certification.code,
              name: certification.name,
              description: certification.description,
              chapters: certification.chapters,
              has_curriculum: certification.has_curriculum,
            }
          : DEFAULT_SOURCE,
        locale,
      ) as Curriculum,
    [certification, locale],
  );

  return { curriculum, certificationName: certification?.name ?? "ISO 45001:2018" };
}
