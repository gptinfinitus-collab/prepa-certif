/**
 * English mirror of the audit checklist templates.
 *
 * Requirements are paraphrased: no literal wording of a protected standard
 * is reproduced here.
 */
import type { ChecklistTemplate } from "./audit-checklists";

export const enIso45001Checklist: ChecklistTemplate = {
  id: "iso-45001",
  title: "ISO 45001:2018 audit (+ Amd 1:2024)",
  standard: "ISO 45001:2018 / Amd 1:2024",
  description:
    "Clause-by-clause checklist for the OH&S management system, from context to improvement.",
  sections: [
    {
      chapter: "4. Context of the organization",
      items: [
        {
          clause: "4.1",
          requirement: "Relevant external and internal issues identified and kept up to date.",
          guidance:
            "Ask how issues were determined and how often they are reviewed. Evidence: context analysis, management review.",
        },
        {
          clause: "4.2",
          requirement:
            "Workers and other interested parties identified, with the needs and expectations adopted as compliance obligations.",
          guidance:
            "Check how expectations are sorted from adopted obligations. Evidence: stakeholder map, legal watch.",
        },
        {
          clause: "4.3",
          requirement:
            "Scope defined, documented and consistent with activities, locations and workers concerned.",
          guidance:
            "Look for unjustified exclusions (contractors, sites, remote work). Evidence: scope statement.",
        },
        {
          clause: "4.4",
          requirement: "OH&S management system established, implemented and continually improved.",
          guidance:
            "Have the processes and their interactions described. Evidence: process map, OH&S manual.",
        },
      ],
    },
    {
      chapter: "5. Leadership and worker participation",
      items: [
        {
          clause: "5.1",
          requirement:
            "Top management demonstrates leadership: overall accountability, resources, prevention culture, protection from reprisals.",
          guidance:
            "Interview management on production vs safety trade-offs and time spent on the floor. Evidence: decisions, budgets, minutes.",
        },
        {
          clause: "5.2",
          requirement:
            "OH&S policy appropriate, committing to safe working conditions, hazard elimination, consultation and continual improvement.",
          guidance:
            "Check distribution and understanding by the workers interviewed. Evidence: signed and dated policy.",
        },
        {
          clause: "5.3",
          requirement: "Roles, responsibilities and authorities assigned, communicated and understood.",
          guidance:
            "Ask a worker who may stop an unsafe task. Evidence: job descriptions, organization chart.",
        },
        {
          clause: "5.4",
          requirement:
            "Consultation and participation of workers (and their representatives) organized at all levels, with barriers removed.",
          guidance:
            "Distinguish consultation (before a decision) from participation. Evidence: safety committee, suggestions, field feedback.",
        },
      ],
    },
    {
      chapter: "6. Planning",
      items: [
        {
          clause: "6.1.1",
          requirement: "Risks and opportunities for the system determined, taking the context into account.",
          guidance:
            "Do not confuse OH&S risks with management-system risks. Evidence: risk and opportunity register.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Ongoing and proactive hazard identification process (work organization, social factors, past incidents, emergency situations, people affected).",
          guidance:
            "Check that psychosocial hazards and external parties are covered. Evidence: identification method.",
        },
        {
          clause: "6.1.2.2",
          requirement:
            "Assessment of OH&S risks and other risks to the system, using defined methods and criteria.",
          guidance:
            "Walk through one workstation assessment. Evidence: risk register, rating scale, documented criteria.",
        },
        {
          clause: "6.1.2.3",
          requirement: "Opportunities to improve OH&S and the system assessed.",
          guidance: "Look for concrete examples (ergonomics, new technology, lessons learned).",
        },
        {
          clause: "6.1.3",
          requirement:
            "Legal requirements and other obligations determined, accessible, kept up to date and taken into account.",
          guidance:
            "Test a recent regulatory change. Evidence: legal watch, compliance table, update dates.",
        },
        {
          clause: "6.1.4",
          requirement:
            "Actions planned to address hazards, risks, obligations and emergency situations, integrated into the system.",
          guidance: "Check the hierarchy of controls (elimination before PPE). Evidence: action plan.",
        },
        {
          clause: "6.2.1",
          requirement:
            "OH&S objectives consistent with the policy, measurable or evaluable, communicated and updated.",
          guidance: "Ask how an objective is measured. Evidence: objectives table.",
        },
        {
          clause: "6.2.2",
          requirement:
            "Planning for objectives: actions, resources, owners, deadlines, and how results will be evaluated.",
          guidance: "Check that one objective actually has all five elements. Evidence: dated action plan.",
        },
      ],
    },
    {
      chapter: "7. Support",
      items: [
        {
          clause: "7.1",
          requirement: "Resources needed for the system determined and provided.",
          guidance: "Prevention budget, headcount, allocated time. Evidence: budget, equipment.",
        },
        {
          clause: "7.2",
          requirement:
            "Necessary competence determined, acquired and evaluated, including for hazard identification.",
          guidance:
            "Cross-check a high-risk job with competence evidence. Evidence: skills matrix, authorizations, certificates.",
        },
        {
          clause: "7.3",
          requirement:
            "Workers aware of the policy, hazards, incidents and their right to remove themselves from a dangerous situation.",
          guidance:
            "Ask workers about the right to stop work. Evidence: safety induction, toolbox talks, notices.",
        },
        {
          clause: "7.4",
          requirement: "Internal and external communication defined (what, when, with whom, how).",
          guidance: "Check how a worker escalates an OH&S issue. Evidence: communication procedure.",
        },
        {
          clause: "7.5",
          requirement:
            "Documented information created, updated and controlled (distribution, access, protection, retention).",
          guidance:
            "Test the current version of a document at the workstation. Evidence: document control, revision indices.",
        },
      ],
    },
    {
      chapter: "8. Operation",
      items: [
        {
          clause: "8.1.1",
          requirement: "Operational processes planned, implemented, controlled and maintained.",
          guidance: "Observe a real activity and compare it with the work instruction.",
        },
        {
          clause: "8.1.2",
          requirement:
            "Hierarchy of controls applied: elimination, substitution, engineering, administrative controls, then PPE.",
          guidance: "Look for cases where PPE is the only barrier. Evidence: risk assessments, action plans.",
        },
        {
          clause: "8.1.3",
          requirement: "Management of change: permanent and temporary changes controlled beforehand.",
          guidance: "Take a recent change (machine, staffing, process) and check the prior analysis.",
        },
        {
          clause: "8.1.4",
          requirement:
            "Procurement, contractors and outsourcing controlled and coordinated with providers.",
          guidance: "Evidence: prevention plans, OH&S purchasing criteria, contractor induction.",
        },
        {
          clause: "8.2",
          requirement:
            "Emergency preparedness and response planned, tested and communicated to relevant parties.",
          guidance:
            "Check the date of the last drill and its lessons learned. Evidence: emergency plan, drill reports.",
        },
      ],
    },
    {
      chapter: "9. Performance evaluation",
      items: [
        {
          clause: "9.1.1",
          requirement:
            "Monitoring, measurement, analysis and evaluation of OH&S performance, with calibrated equipment where needed.",
          guidance:
            "Check the balance of leading and lagging indicators. Evidence: dashboards, calibration certificates.",
        },
        {
          clause: "9.1.2",
          requirement: "Periodic evaluation of compliance with legal requirements and other obligations.",
          guidance: "Evidence: compliance evaluation report and related action plan.",
        },
        {
          clause: "9.2",
          requirement:
            "Internal audit programme based on process importance and previous results; objective and impartial auditors.",
          guidance:
            "Check clause coverage over the cycle and auditor independence. Evidence: programme, reports, competence records.",
        },
        {
          clause: "9.3",
          requirement:
            "Management review covering every required input and producing traceable decisions.",
          guidance:
            "Look for commonly missing inputs (worker consultation, opportunities, resources). Evidence: minutes.",
        },
      ],
    },
    {
      chapter: "10. Improvement",
      items: [
        {
          clause: "10.1",
          requirement: "Improvement opportunities determined and actions implemented.",
          guidance: "Evidence: improvement tracking, trend indicators.",
        },
        {
          clause: "10.2",
          requirement:
            "Incidents and nonconformities handled: reaction, root cause analysis, correction, corrective actions, effectiveness review.",
          guidance:
            "Follow one incident end to end and check root cause analysis and worker involvement.",
        },
        {
          clause: "10.3",
          requirement:
            "Continual improvement of the system: performance, prevention culture, worker participation.",
          guidance: "Evidence: multi-year indicator trends, structural actions.",
        },
      ],
    },
  ],
};

export const enIso19011Checklist: ChecklistTemplate = {
  id: "iso-19011",
  title: "ISO 19011:2026 audit conduct",
  standard: "ISO 19011:2026",
  description: "Checklist for running an audit, from planning to follow-up of conclusions.",
  sections: [
    {
      chapter: "Programme and initiation",
      items: [
        {
          clause: "5",
          requirement: "Audit programme objectives defined and programme risks considered.",
          guidance: "Evidence: annual programme, programme risk analysis.",
        },
        {
          clause: "5.5",
          requirement: "Audit team assembled with the required competence and impartiality.",
          guidance: "Evidence: assignment letter, independence declarations, competence records.",
        },
      ],
    },
    {
      chapter: "Audit preparation",
      items: [
        {
          clause: "6.2",
          requirement:
            "Contact established with the auditee, feasibility confirmed, objectives, scope and criteria agreed.",
          guidance: "Evidence: preliminary exchanges, written confirmation of scope.",
        },
        {
          clause: "6.3",
          requirement: "Document review carried out beforehand and used.",
          guidance: "Evidence: review notes, points of attention.",
        },
        {
          clause: "6.3",
          requirement: "Audit plan prepared, communicated and accepted; work allocated within the team.",
          guidance: "Evidence: dated audit plan with times, sites and contacts.",
        },
        {
          clause: "6.3",
          requirement: "Working documents prepared (checklists, sampling plans, finding sheets).",
          guidance: "Check that sampling is justified rather than improvised.",
        },
      ],
    },
    {
      chapter: "Conducting the audit",
      items: [
        {
          clause: "6.4.2",
          requirement: "Opening meeting held: objectives, method, confidentiality, safety, logistics.",
          guidance: "Evidence: agenda, attendance sheet.",
        },
        {
          clause: "6.4.6",
          requirement: "Information collected by sampling and verified before becoming audit evidence.",
          guidance: "Check traceability: source, date and reference of each piece of evidence.",
        },
        {
          clause: "6.4.7",
          requirement: "Audit findings established by comparing evidence against audit criteria.",
          guidance: "A finding = evidence + criterion + factual gap, never a judgement on a person.",
        },
        {
          clause: "6.4.8",
          requirement: "Audit conclusions prepared by the team before closing.",
          guidance: "Evidence: team meeting, draft conclusions.",
        },
        {
          clause: "6.4.9",
          requirement: "Closing meeting held: findings presented, understood, accepted, next steps explained.",
          guidance: "Evidence: attendance sheet, diverging opinions recorded.",
        },
      ],
    },
    {
      chapter: "Report and follow-up",
      items: [
        {
          clause: "6.5",
          requirement: "Audit report complete, accurate, clear and distributed within the agreed time.",
          guidance: "Evidence: signed report, issue date.",
        },
        {
          clause: "6.6",
          requirement: "Audit completed and documented information retained or disposed of as agreed.",
          guidance: "Evidence: completion record.",
        },
        {
          clause: "6.7",
          requirement: "Auditee corrective actions followed up and effectiveness verified.",
          guidance: "Evidence: auditee action plan, effectiveness check.",
        },
      ],
    },
  ],
};

export const enIso9001Checklist: ChecklistTemplate = {
  id: "iso-9001",
  title: "ISO 9001:2015 audit",
  standard: "ISO 9001:2015",
  description: "Concise checklist for the quality management system.",
  sections: [
    {
      chapter: "4-5. Context and leadership",
      items: [
        {
          clause: "4.1 / 4.2",
          requirement: "Context, interested parties and relevant requirements determined and monitored.",
          guidance: "Evidence: context analysis, management review.",
        },
        {
          clause: "4.4",
          requirement: "QMS processes determined with inputs, outputs, sequence, criteria and indicators.",
          guidance: "Evidence: process map and process sheets.",
        },
        {
          clause: "5.1.2",
          requirement:
            "Customer focus demonstrated: customer and statutory requirements met, risks addressed.",
          guidance: "Evidence: customer satisfaction, complaints, conformity indicators.",
        },
        {
          clause: "5.2 / 5.3",
          requirement: "Quality policy communicated; roles and responsibilities assigned.",
          guidance: "Evidence: policy, organization chart, job descriptions.",
        },
      ],
    },
    {
      chapter: "6-7. Planning and support",
      items: [
        {
          clause: "6.1",
          requirement: "Risks and opportunities identified and actions integrated into the processes.",
          guidance: "Evidence: risk register with effectiveness follow-up.",
        },
        {
          clause: "6.2 / 6.3",
          requirement: "Quality objectives planned and QMS changes controlled.",
          guidance: "Evidence: action plan, change management.",
        },
        {
          clause: "7.1.5",
          requirement: "Monitoring and measuring resources suitable, verified or calibrated.",
          guidance: "Evidence: metrology records.",
        },
        {
          clause: "7.2 / 7.3 / 7.5",
          requirement: "Competence, awareness and documented information controlled.",
          guidance: "Evidence: training plan, document control.",
        },
      ],
    },
    {
      chapter: "8. Operation",
      items: [
        {
          clause: "8.2",
          requirement: "Requirements for products and services determined and reviewed before commitment.",
          guidance: "Evidence: order review, quotations.",
        },
        {
          clause: "8.4",
          requirement: "External providers evaluated, selected and monitored.",
          guidance: "Evidence: supplier evaluation, incoming checks.",
        },
        {
          clause: "8.5",
          requirement:
            "Production and service provision controlled: identification, traceability, preservation, post-delivery activities.",
          guidance: "Observe an operation and its traceability.",
        },
        {
          clause: "8.7",
          requirement: "Nonconforming outputs identified and controlled.",
          guidance: "Evidence: product nonconformity log.",
        },
      ],
    },
    {
      chapter: "9-10. Performance and improvement",
      items: [
        {
          clause: "9.1.2",
          requirement: "Customer satisfaction monitored and used.",
          guidance: "Evidence: surveys, complaint analysis.",
        },
        {
          clause: "9.2 / 9.3",
          requirement: "Internal audits performed per programme and a complete management review held.",
          guidance: "Evidence: audit programme, review minutes.",
        },
        {
          clause: "10.2",
          requirement: "Nonconformities handled with root cause analysis and effective corrective actions.",
          guidance: "Follow one nonconformity end to end.",
        },
      ],
    },
  ],
};

export const enIso14001Checklist: ChecklistTemplate = {
  id: "iso-14001",
  title: "ISO 14001:2015 audit",
  standard: "ISO 14001:2015",
  description: "Concise checklist for the environmental management system.",
  sections: [
    {
      chapter: "4-5. Context and leadership",
      items: [
        {
          clause: "4.1 / 4.2",
          requirement:
            "Environmental issues, environmental conditions and interested parties determined.",
          guidance: "Evidence: environmental analysis.",
        },
        {
          clause: "5.2",
          requirement: "Environmental policy committing to protection of the environment and compliance.",
          guidance: "Check the pollution prevention commitment.",
        },
      ],
    },
    {
      chapter: "6. Planning",
      items: [
        {
          clause: "6.1.2",
          requirement:
            "Environmental aspects identified from a life cycle perspective, significant aspects determined.",
          guidance: "Evidence: aspects/impacts analysis, significance criteria.",
        },
        {
          clause: "6.1.3",
          requirement: "Compliance obligations determined, accessible and taken into account.",
          guidance: "Evidence: up-to-date legal watch.",
        },
        {
          clause: "6.2",
          requirement: "Environmental objectives consistent with significant aspects and planned.",
          guidance: "Evidence: environmental programme.",
        },
      ],
    },
    {
      chapter: "7-8. Support and operation",
      items: [
        {
          clause: "7.2 / 7.3",
          requirement: "Environmental competence and awareness ensured.",
          guidance: "Ask an operator about sorting and prevention practices.",
        },
        {
          clause: "8.1",
          requirement:
            "Operational control established, including outsourced processes and life cycle requirements.",
          guidance: "Evidence: instructions, requirements passed on to providers.",
        },
        {
          clause: "8.2",
          requirement: "Environmental emergency preparedness and response tested.",
          guidance: "Evidence: scenarios (spill, fire), drill reports.",
        },
      ],
    },
    {
      chapter: "9-10. Performance and improvement",
      items: [
        {
          clause: "9.1.2",
          requirement: "Periodic evaluation of compliance with obligations performed.",
          guidance: "Evidence: compliance review and follow-up.",
        },
        {
          clause: "9.2 / 9.3",
          requirement: "Internal audits and management review covering environmental performance.",
          guidance: "Evidence: reports, review minutes.",
        },
        {
          clause: "10.2",
          requirement: "Environmental nonconformities handled and impacts mitigated.",
          guidance: "Follow a real gap through to effectiveness verification.",
        },
      ],
    },
  ],
};

export const enIso27001Checklist: ChecklistTemplate = {
  id: "iso-27001",
  title: "ISO/IEC 27001:2022 audit",
  standard: "ISO/IEC 27001:2022",
  description: "Concise checklist for the information security management system.",
  sections: [
    {
      chapter: "4-6. ISMS framework",
      items: [
        {
          clause: "4.3",
          requirement: "ISMS scope defined, including interfaces and dependencies.",
          guidance: "Evidence: scope document, justified exclusions.",
        },
        {
          clause: "6.1.2",
          requirement: "Information security risk assessment process defined and applied.",
          guidance: "Evidence: method, acceptance criteria, results.",
        },
        {
          clause: "6.1.3",
          requirement: "Risk treatment defined with a justified statement of applicability.",
          guidance: "Check excluded controls and their justification.",
        },
        {
          clause: "6.2",
          requirement: "Information security objectives established and monitored.",
          guidance: "Evidence: security indicators.",
        },
      ],
    },
    {
      chapter: "7-8. Support and operation",
      items: [
        {
          clause: "7.2 / 7.3",
          requirement: "Security competence and awareness ensured for all relevant roles.",
          guidance: "Evidence: awareness campaigns, phishing tests.",
        },
        {
          clause: "8.1",
          requirement:
            "Security processes planned, implemented and controlled, including at providers.",
          guidance: "Evidence: operating procedures, contractual clauses.",
        },
        {
          clause: "8.2 / 8.3",
          requirement: "Risk assessments and treatments performed at planned intervals and after change.",
          guidance: "Evidence: dates of the latest assessments.",
        },
      ],
    },
    {
      chapter: "Annex A (controls)",
      items: [
        {
          clause: "A.5",
          requirement:
            "Organizational controls in place: policies, roles, supplier management, incidents.",
          guidance: "Evidence: signed policies, incident register.",
        },
        {
          clause: "A.6",
          requirement: "People controls: screening, terms of employment, exit, remote working.",
          guidance: "Evidence: confidentiality clauses, exit procedure.",
        },
        {
          clause: "A.7",
          requirement: "Physical controls: secure areas, access control, equipment protection.",
          guidance: "Observe access points and clear-desk practice.",
        },
        {
          clause: "A.8",
          requirement:
            "Technological controls: access management, logging, backups, vulnerabilities, cryptography.",
          guidance: "Evidence: access reviews, restore tests, patch tracking.",
        },
      ],
    },
    {
      chapter: "9-10. Performance and improvement",
      items: [
        {
          clause: "9.2 / 9.3",
          requirement: "ISMS internal audits and management review performed.",
          guidance: "Evidence: audit programme, minutes.",
        },
        {
          clause: "10.2",
          requirement: "Nonconformities handled, causes analysed, effectiveness verified.",
          guidance: "Follow a security incident through to closure.",
        },
      ],
    },
  ],
};

export const enAuditChecklistTemplates: ChecklistTemplate[] = [
  enIso45001Checklist,
  enIso19011Checklist,
  enIso9001Checklist,
  enIso14001Checklist,
  enIso27001Checklist,
];
