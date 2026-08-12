/**
 * Mirror anglais de `standards.ts` : mêmes codes, mêmes chapitres, contenu en
 * anglais (terminologie officielle ISO). Aucun texte normatif n'est reproduit.
 *
 * TODO(i18n) : contenu encore en français, à traduire.
 */
import { standardSpecs, auditReferences, commonGlossary } from "./standards";
import type { StandardSpec, StandardReference } from "./standards";
import type { GlossaryEntry } from "./program";

export const enStandardSpecs: Record<string, StandardSpec> = standardSpecs;
export const enAuditReferences: StandardReference[] = auditReferences;
export const enCommonGlossary: GlossaryEntry[] = commonGlossary;
