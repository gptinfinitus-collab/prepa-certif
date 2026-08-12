/**
 * Mirror anglais des séances Lead Auditor.
 *
 * TODO(i18n) : contenu encore en français, à traduire.
 */
import type { LeadModuleSpec } from "./lead-auditor";
import { leadAuditorSpecsFr } from "./lead-auditor";

export function enLeadAuditorSpecs(label: string): LeadModuleSpec[] {
  return leadAuditorSpecsFr(label);
}
