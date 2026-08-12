/**
 * English content mirror for the Lead Auditor sessions.
 *
 * All wording is original: no reproduction of copyrighted ISO standard text.
 */
import type { LeadModuleSpec } from "./lead-auditor";

export function enLeadAuditorSpecs(label: string): LeadModuleSpec[] {
  return [
    {
      title: "Role and responsibilities of the audit team leader",
      objective:
        "Understand what the organization expects from an audit team leader, from appointment through to the final report.",
      sections: [
        {
          heading: "What the role covers",
          body: [
            "The audit team leader, as described in the ISO 19011:2026 guidelines, is appointed for a specific audit. They bear responsibility for the conduct of the audit and its conclusions, not just for their own share of the work.",
            "Their responsibilities: prepare the audit plan, assign tasks among auditors and technical experts, arbitrate disagreements over findings, run the opening and closing meetings, and validate the report.",
          ],
        },
        {
          heading: "Expected competencies",
          body: [
            "Beyond mastery of " + label + ", the organization assesses the ability to make decisions under time pressure, to manage a team and to maintain a professional relationship with the auditee, including in tense situations.",
            "Competence is demonstrated by audits carried out as an auditor, then by audits carried out under supervision as a team leader.",
          ],
        },
      ],
      keyTakeaway:
        "The audit team leader is responsible for the conduct of the audit and its conclusions, including the work of the other auditors.",
      quiz: [
        {
          question: "Who arbitrates a disagreement between two auditors on how to classify a finding?",
          answer:
            "The audit team leader: they decide, based on evidence and the requirement, and own the conclusion in the report.",
        },
      ],
    },
    {
      title: "Audit programme, audit plan and time management",
      objective:
        "Build a realistic audit plan and allocate audit time across the processes to be covered.",
      sections: [
        {
          heading: "Programme versus plan: do not confuse them",
          body: [
            "The audit programme covers a period and a set of audits. The audit plan describes a single audit: scope, criteria, dates, sites, schedule, auditors, processes audited.",
            "The plan is communicated to the auditee before the audit and may be adjusted by mutual agreement during the audit.",
          ],
        },
        {
          heading: "Allocating time",
          body: [
            "Time is allocated according to the risk and importance of the processes, not evenly across clauses. A critical, poorly controlled process deserves more time than a stable one.",
            "Explicitly plan time slots for daily team meetings, consolidating findings and preparing the closing meeting.",
          ],
        },
      ],
      keyTakeaway:
        "The audit plan allocates time based on the risk and importance of processes, and reserves time to consolidate findings.",
      quiz: [
        {
          question: "What is the difference between an audit programme and an audit plan?",
          answer:
            "The programme covers a set of audits over a period; the plan describes how a specific audit is organised (scope, criteria, schedule, auditors).",
        },
      ],
    },
    {
      title: "Opening meeting and team leadership",
      objective:
        "Run the opening meeting and lead the team during the audit, including when the unexpected happens.",
      sections: [
        {
          heading: "Opening meeting",
          body: [
            "Mandatory points: introduction of the team, confirmation of the scope, criteria and plan, sampling method and associated uncertainty, communication channels, safety and confidentiality rules, arrangements for the closing meeting.",
            "It is short, factual, and must obtain the auditee's explicit agreement on how the audit will proceed.",
          ],
        },
        {
          heading: "Leading during the audit",
          body: [
            "Daily team briefing: progress, findings in progress, reallocating time if a process is falling behind.",
            "Escalation: any obstacle to the audit (unavailable documents, refused access, intimidation) is reported to the auditee and, if it persists, to the audit client; it may lead to the audit being interrupted.",
          ],
        },
      ],
      keyTakeaway:
        "The opening meeting locks in the scope, criteria and ground rules; the daily team briefing allows time to be reallocated.",
      quiz: [
        {
          question: "What does the team leader do if a department refuses access to records?",
          answer:
            "They report it immediately to the auditee, log the obstacle and, if it persists, inform the audit client; the audit may be suspended or its scope limited in the report.",
        },
      ],
    },
    {
      title: "Classifying and writing a nonconformity",
      objective:
        "Distinguish major, minor and opportunity for improvement, and write a defensible statement.",
      sections: [
        {
          heading: "Classification",
          body: [
            "Major: failure to implement a requirement, a systemic failure, or a significant effect on the conformity of the system's results.",
            "Minor: an isolated, one-off nonconformity that does not invalidate the process concerned.",
            "Opportunity for improvement: no nonconformity against a requirement, but a possible avenue for progress. It must never be used to avoid raising a genuine nonconformity.",
          ],
        },
        {
          heading: "Structure of a statement",
          body: [
            "Three components: the requirement (a clause of " + label + " or an internal document), the evidence observed (a dated, identifiable fact), the nonconformity (how the evidence fails to meet the requirement).",
            "The statement describes a fact, not a person, and does not propose a solution: root cause and corrective action belong to the auditee.",
          ],
        },
      ],
      keyTakeaway:
        "A nonconformity = requirement + evidence + gap. Neither a judgement of a person, nor an imposed solution.",
      quiz: [
        {
          question: "What are the three mandatory components of a nonconformity statement?",
          answer: "The requirement concerned, the objective evidence observed, and the gap found between the two.",
        },
        {
          question: "Can an awkward nonconformity be turned into an opportunity for improvement?",
          answer:
            "No. If there is a gap against a requirement, it is a nonconformity; reclassifying it compromises the integrity of the audit.",
        },
      ],
    },
    {
      title: "Closing meeting, report and follow-up",
      objective:
        "Present defensible conclusions, write the report and ensure follow-up of corrective actions.",
      sections: [
        {
          heading: "Closing meeting",
          body: [
            "Findings are presented in order of importance, sampling is recalled, and conclusions plus any recommendation are stated. Unresolved disagreements are recorded in the report.",
            "The certification recommendation never belongs to the audit team alone: the decision is made by the certification body.",
          ],
        },
        {
          heading: "Report and follow-up",
          body: [
            "The report contains at minimum: scope, criteria, team, dates, findings, conclusions, and any points not covered.",
            "Follow-up: root-cause analysis provided by the auditee, action plan, verification of effectiveness — based on evidence, not on a mere statement. A nonconformity is only closed once it has been verified.",
          ],
        },
      ],
      keyTakeaway:
        "The audit team concludes and recommends; the certification decision belongs to the organization. A nonconformity is closed on proof of effectiveness.",
      quiz: [
        {
          question: "Who decides whether to grant the certificate?",
          answer:
            "The certification body, based on the report; the audit team only makes a recommendation.",
        },
      ],
    },
    {
      title: "Ethics, impartiality and handling difficult situations",
      objective:
        "Maintain the professional posture expected of a Lead Auditor when faced with pressure and conflicts of interest.",
      sections: [
        {
          heading: "Principles",
          body: [
            "The audit principles of ISO 19011:2026 apply first and foremost to the team leader: integrity, fair presentation, due professional care, confidentiality, independence, evidence-based approach, risk-based approach.",
            "Conflict of interest: an auditor does not audit an area for which they have been responsible or which they recently advised on. Any such case must be declared before the audit.",
          ],
        },
        {
          heading: "Difficult situations",
          body: [
            "A hostile or evasive auditee: return to the facts and the requirement, keep a neutral tone, record any refusal to provide evidence.",
            "Pressure to withdraw a finding: maintain the finding if it is supported, offer to re-examine the evidence if new information is produced, and record the exchange.",
          ],
        },
      ],
      keyTakeaway:
        "A well-supported finding is not up for negotiation: it is only reconsidered in light of new evidence.",
      quiz: [
        {
          question: "An auditor advised the audited company six months ago. What should be done?",
          answer:
            "It must be declared: they cannot audit that area, as the team's impartiality would be compromised.",
        },
      ],
    },
  ];
}
