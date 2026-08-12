/**
 * English mirror of `standards.ts`: same codes, same clause structure,
 * genuine English content using official ISO terminology. No normative
 * text is reproduced verbatim.
 */
import type { StandardSpec, StandardReference, ClauseSpec } from "./standards";
import type { GlossaryEntry } from "./program";

interface HlsInput {
  systemName: string;
  subject: string;
  /** Term used by the standard for the object of risk ("OH&S risks", "information security risks"…). */
  riskTerm: string;
  /** Example of a performance indicator specific to the standard. */
  indicator: string;
  /** Additional standard-specific requirements, indexed by clause number. */
  extra?: Partial<Record<4 | 5 | 6 | 7 | 8 | 9 | 10, string[]>>;
}

/** Builds clauses 4 to 10 of the harmonized high-level structure (HLS) for a given standard. */
function enHlsClauses(input: HlsInput): ClauseSpec[] {
  const { systemName, subject, riskTerm, indicator, extra = {} } = input;
  return [
    {
      clause: "4. Contexte de l'organisme",
      title: "Context, interested parties and scope",
      summary: `Understand the organization and its context, identify interested parties relevant to ${subject}, define the scope and establish the ${systemName}.`,
      requirements: [
        "4.1 Relevant internal and external issues",
        "4.2 Needs and expectations of interested parties, including applicable legal requirements",
        "4.3 Documented and justified scope",
        `4.4 ${systemName}: processes, interactions, criteria and resources`,
        ...(extra[4] ?? []),
      ],
    },
    {
      clause: "5. Leadership",
      title: "Top management commitment, policy and roles",
      summary: `Top management demonstrates leadership: a ${subject} policy, assigned roles and responsibilities, and integration of requirements into business processes.`,
      requirements: [
        "5.1 Leadership and commitment of top management",
        `5.2 ${subject} policy: appropriate, communicated, kept up to date`,
        "5.3 Defined and communicated roles, responsibilities and authorities",
        ...(extra[5] ?? []),
      ],
    },
    {
      clause: "6. Planification",
      title: "Risks, opportunities and objectives",
      summary: `Plan actions to address ${riskTerm} and opportunities, and set measurable objectives.`,
      requirements: [
        `6.1 Actions to address ${riskTerm} and opportunities`,
        "6.2 Objectives and planning of actions to achieve them",

        ...(extra[6] ?? []),
      ],
    },
    {
      clause: "7. Support",
      title: "Resources, competence, communication and documented information",
      summary: `Provide resources, ensure competence and awareness, organize communication and control the documented information of the ${systemName}.`,
      requirements: [
        "7.1 Necessary resources",
        "7.2 Competence: needs, actions, evidence",
        "7.3 Awareness of personnel",
        "7.4 Internal and external communication (what, when, with whom, how)",
        "7.5 Documented information: creation, updating, control",
        ...(extra[7] ?? []),
      ],
    },
    {
      clause: "8. Réalisation des activités opérationnelles",
      title: "Operational control",
      summary: `Plan, implement and control the processes needed to meet requirements related to ${subject}. The sub-clauses of clause 8 are specific to each standard.`,
      requirements: [
        "8.1 Operational planning and control, process criteria",
        ...(extra[8] ?? []),
      ],
    },
    {
      clause: "9. Évaluation des performances",
      title: "Monitoring, internal audit and management review",
      summary: `Monitor, measure, analyze and evaluate performance (for example ${indicator}), conduct internal audits and carry out the management review.`,
      requirements: [
        "9.1 Monitoring, measurement, analysis and evaluation of performance",
        "9.2 Internal audit programme and execution",
        "9.3 Management review: inputs and outputs",
        ...(extra[9] ?? []),
      ],
    },
    {
      clause: "10. Amélioration",
      title: "Nonconformity, corrective action and continual improvement",
      summary: `Address nonconformities, take effective corrective action and continually improve the suitability and effectiveness of the ${systemName}.`,
      requirements: [
        "10.1 Opportunities for improvement",
        "10.2 Nonconformity and corrective action, root-cause analysis",
        "10.3 Continual improvement",
        ...(extra[10] ?? []),
      ],
    },
  ];
}

const isoUrl = (id: string) => `https://www.iso.org/standard/${id}.html`;

/** Cross-cutting standards useful for any auditor's preparation. */
export const enAuditReferences: StandardReference[] = [
  {
    code: "ISO 19011:2026",
    title: "Guidelines for auditing management systems",
    role: "Current edition: audit principles, managing an audit programme, conducting audits and auditor competence. Guidance only, not a certifiable standard.",
    url: isoUrl("70017"),
  },
  {
    code: "ISO/IEC 17021-1:2015",
    title: "Requirements for bodies providing audit and certification of management systems",
    role: "Framework for third-party certification and the conduct of certification audits.",
    url: isoUrl("61651"),
  },
];

/** Glossary common to all management system standards. */
export const enCommonGlossary: GlossaryEntry[] = [
  { term: "Audit", definition: "A systematic, independent and documented process for obtaining audit evidence and evaluating it objectively." },
  { term: "Audit evidence", definition: "Records, statements of fact or other verifiable information relevant to the audit criteria." },
  { term: "Audit criteria", definition: "The set of requirements used as a reference: a standard, policy, procedure or legal requirement." },
  { term: "Audit finding", definition: "The result of evaluating audit evidence against audit criteria: conformity, nonconformity or opportunity for improvement." },
  { term: "Nonconformity", definition: "Non-fulfilment of a requirement, stated as an observed fact, the requirement not met and the supporting evidence." },
  { term: "Corrective action", definition: "Action taken to eliminate the cause of a nonconformity so it does not recur, distinct from a mere correction." },
  { term: "Interested party", definition: "A person or organization that can affect, be affected by, or perceive itself to be affected by a decision or activity." },
  { term: "Documented information", definition: "Information that an organization must control and maintain, together with the medium on which it is held." },
  { term: "Process", definition: "A set of interrelated activities that transforms inputs into outputs." },
  { term: "Continual improvement", definition: "A recurring activity to enhance performance, typically structured around the PDCA cycle." },
  { term: "PDCA", definition: "Plan-Do-Check-Act: the improvement cycle underlying every management system standard." },
  { term: "Scope", definition: "The boundaries of the management system: sites, activities and processes included, with justified exclusions." },
  { term: "Management review", definition: "A periodic review by top management of the suitability, adequacy and effectiveness of the management system." },
  { term: "Risk", definition: "The effect of uncertainty on the achievement of objectives, which may be negative (a threat) or positive (an opportunity)." },
  { term: "Audit sampling", definition: "Selecting a representative portion of the available items in order to draw conclusions about the whole." },
];

function enSpec(
  code: string,
  label: string,
  systemName: string,
  subject: string,
  clauses: ClauseSpec[],
  glossary: GlossaryEntry[],
  mainStandard: StandardReference,
  extraRefs: StandardReference[] = [],
): StandardSpec {
  return {
    code,
    label,
    subject,
    systemName,
    clauses,
    glossary,
    references: [mainStandard, ...extraRefs, ...enAuditReferences],
  };
}

export const enStandardSpecs: Record<string, StandardSpec> = {
  "iso-9001": enSpec(
    "iso-9001",
    "ISO 9001:2015",
    "quality management system (QMS)",
    "quality",
    enHlsClauses({
      systemName: "quality management system (QMS)",
      subject: "quality",
      riskTerm: "quality risks",
      indicator: "customer satisfaction and the product nonconformity rate",
      extra: {
        6: ["6.3 Planning of changes to the QMS"],
        8: [
          "8.2 Requirements for products and services, review of customer requirements",
          "8.3 Design and development (where applicable)",
          "8.4 Control of externally provided processes, products and services",
          "8.5 Production and service provision, identification and traceability, customer property",
          "8.6 Release of products and services",
          "8.7 Control of nonconforming outputs",
        ],
        9: ["9.1.2 Customer satisfaction: monitoring customer perception"],
      },
    }),
    [
      { term: "Customer", definition: "A person or organization that could or does receive a product or service intended for, or required by, that person or organization." },
      { term: "Customer satisfaction", definition: "The customer's perception of the degree to which their expectations have been fulfilled." },
      { term: "Process approach", definition: "Managing activities as interrelated processes that form a coherent system." },
      { term: "Traceability", definition: "The ability to trace the history, application or location of an item." },
    ],
    { code: "ISO 9001:2015", title: "Quality management systems — Requirements", role: "The requirements standard being audited, clauses 4 to 10.", url: isoUrl("62085") },
    [{ code: "ISO 9000:2015", title: "Quality management systems — Fundamentals and vocabulary", role: "Official definitions used throughout the 9001 family.", url: isoUrl("45481") }],
  ),
  "iso-14001": enSpec(
    "iso-14001",
    "ISO 14001:2015",
    "environmental management system (EMS)",
    "the environment",
    enHlsClauses({
      systemName: "environmental management system (EMS)",
      subject: "the environment",
      riskTerm: "environmental risks and impacts",
      indicator: "energy consumption, emissions and waste generation",
      extra: {
        6: [
          "6.1.2 Environmental aspects and associated impacts, significance criteria",
          "6.1.3 Compliance obligations",
        ],
        8: [
          "Life cycle perspective and requirements passed on to external providers (under 8.1)",
          "8.2 Emergency preparedness and response",
        ],
        9: ["9.1.2 Evaluation of compliance with compliance obligations"],
      },
    }),
    [
      { term: "Environmental aspect", definition: "An element of an organization's activities, products or services that can interact with the environment." },
      { term: "Environmental impact", definition: "Any change to the environment, whether adverse or beneficial, resulting wholly or partly from environmental aspects." },
      { term: "Compliance obligation", definition: "A legal requirement the organization must comply with, plus other requirements it chooses to adopt." },
      { term: "Life cycle perspective", definition: "Consideration of the successive stages of a product, from raw material acquisition to end of life." },
    ],
    { code: "ISO 14001:2015", title: "Environmental management systems — Requirements", role: "The requirements standard being audited, clauses 4 to 10.", url: isoUrl("60857") },
  ),
  "iso-27001": enSpec(
    "iso-27001",
    "ISO/IEC 27001:2022",
    "information security management system (ISMS)",
    "information security",
    [
      ...enHlsClauses({
        systemName: "information security management system (ISMS)",
        subject: "information security",
        riskTerm: "information security risks",
        indicator: "the number of security incidents and the vulnerability remediation rate",
        extra: {
          6: [
            "6.1.2 Information security risk assessment (criteria, identification, analysis, evaluation)",
            "6.1.3 Risk treatment, Statement of Applicability (SoA), treatment plan",
            "6.3 Planning of changes to the ISMS (2024 amendment)",
          ],
          8: [
            "8.2 Performing information security risk assessments at planned intervals",
            "8.3 Implementation of the information security risk treatment plan",
          ],
        },
      }),
      {
        clause: "Annexe A",
        title: "93 controls (organizational, people, physical, technological)",
        summary:
          "A reference set of controls to compare against the risk treatment. Any exclusion must be justified in the Statement of Applicability.",
        requirements: [
          "A.5 Organizational controls (37)",
          "A.6 People controls (8)",
          "A.7 Physical controls (14)",
          "A.8 Technological controls (34)",
        ],
      },
    ],
    [
      { term: "ISMS", definition: "Information security management system: the set of processes aimed at preserving confidentiality, integrity and availability." },
      { term: "Statement of Applicability (SoA)", definition: "A document listing the Annex A controls that are included or excluded, with justification and implementation status." },
      { term: "Confidentiality, integrity, availability", definition: "The three fundamental properties of information security (CIA)." },
      { term: "Risk owner", definition: "A person with the accountability and authority to manage a given risk." },
    ],
    { code: "ISO/IEC 27001:2022", title: "Information security, cybersecurity and privacy protection — Information security management systems — Requirements", role: "The requirements standard being audited, clauses 4 to 10 plus Annex A.", url: isoUrl("27001") },
    [{ code: "ISO/IEC 27002:2022", title: "Information security controls", role: "Implementation guidance for the Annex A controls.", url: isoUrl("75652") }],
  ),
  "iso-22000": enSpec(
    "iso-22000",
    "ISO 22000:2018",
    "food safety management system (FSMS)",
    "food safety",
    enHlsClauses({
      systemName: "food safety management system (FSMS)",
      subject: "food safety",
      riskTerm: "food safety hazards",
      indicator: "CCP verification results and the number of withdrawals/recalls",
      extra: {
        8: [
          "8.2 Prerequisite programmes (PRPs)",
          "8.3 Traceability system",
          "8.4 Emergency preparedness and response",
          "8.5 Hazard control: hazard analysis, operational PRPs and HACCP plan (CCPs, critical limits)",
          "8.6 Updating information specifying the PRPs and the hazard control plan",
          "8.7 Control of monitoring and measuring",
          "8.8 Verification related to PRPs and the hazard control plan",
          "8.9 Control of nonconformities: corrections, corrective actions, withdrawals and recalls",
        ],
      },
    }),
    [
      { term: "PRP", definition: "Prerequisite programme: basic conditions and activities necessary to maintain a hygienic environment." },
      { term: "CCP", definition: "Critical control point: a step at which a control measure is essential to prevent or reduce a hazard." },
      { term: "Critical limit", definition: "A measurable value that separates acceptability from unacceptability at a CCP." },
      { term: "HACCP", definition: "Hazard Analysis and Critical Control Points, the method integrated into ISO 22000." },
    ],
    { code: "ISO 22000:2018", title: "Food safety management systems — Requirements", role: "The requirements standard being audited, clauses 4 to 10.", url: isoUrl("65464") },
  ),
  "iso-50001": enSpec(
    "iso-50001",
    "ISO 50001:2018",
    "energy management system (EnMS)",
    "energy performance",
    enHlsClauses({
      systemName: "energy management system (EnMS)",
      subject: "energy performance",
      riskTerm: "risks related to energy performance",
      indicator: "EnPIs compared to the energy baseline (EnB)",
      extra: {
        6: [
          "6.3 Energy review: significant energy uses (SEUs) and relevant variables",
          "6.4 Energy performance indicators (EnPIs)",
          "6.5 Energy baseline (EnB)",
          "6.6 Planning for the collection of energy data",
        ],
        8: ["8.2 Design taking energy performance into account", "8.3 Procurement of energy and energy-consuming equipment"],
      },
    }),
    [
      { term: "SEU", definition: "Significant energy use: a use accounting for substantial energy consumption or offering considerable potential for improvement." },
      { term: "EnPI", definition: "Energy performance indicator: a quantified measure of energy performance." },
      { term: "EnB", definition: "Energy baseline: a quantitative reference used as a basis for comparison." },
    ],
    { code: "ISO 50001:2018", title: "Energy management systems — Requirements", role: "The requirements standard being audited, clauses 4 to 10.", url: isoUrl("69426") },
  ),
  "iso-13485": enSpec(
    "iso-13485",
    "ISO 13485:2016",
    "quality management system for medical devices",
    "medical device quality",
    [
      {
        clause: "4. Système de management de la qualité",
        title: "General requirements and documentation requirements",
        summary:
          "ISO 13485:2016 does not follow the harmonized structure: it retains an 8-clause structure. Clause 4 establishes the system, its regulatory role and its documentation.",
        requirements: [
          "4.1 General requirements: processes, risk-based approach, the organization's regulatory role",
          "4.1.6 Validation of software applications used within the system",
          "4.2.1 Documentation: quality manual, required documented procedures, medical device file",
          "4.2.3 Medical device file for each type or family of devices",
          "4.2.4 Control of documents; 4.2.5 Control of records and retention periods",
        ],
      },
      {
        clause: "5. Responsabilité de la direction",
        title: "Commitment, policy, planning and management review",
        summary:
          "Top management demonstrates commitment, defines the quality policy and objectives, assigns responsibilities and appoints a management representative — a requirement specific to ISO 13485.",
        requirements: [
          "5.1 Management commitment, including meeting applicable regulatory requirements",
          "5.2 Customer focus: customer requirements and regulatory requirements",
          "5.3 Quality policy; 5.4 Planning: quality objectives and quality management system planning",
          "5.5.2 Management representative appointed: a requirement retained by ISO 13485",
          "5.5.3 Internal communication; 5.6 Management review: defined inputs and outputs",
        ],
      },
      {
        clause: "6. Management des ressources",
        title: "Human resources, infrastructure and work environment",
        summary:
          "Provide resources, ensure competence and control the work environment, including product cleanliness and contamination control.",
        requirements: [
          "6.1 Provision of resources",
          "6.2 Human resources: competence, training, effectiveness of actions, records",
          "6.3 Infrastructure, including maintenance and documented maintenance requirements",
          "6.4.1 Work environment; 6.4.2 Contamination control (sterile devices)",
        ],
      },
      {
        clause: "7. Réalisation du produit",
        title: "From planning to release of the device",
        summary:
          "The operational core of the standard: planning including risk management (ISO 14971), design and development, purchasing, production and control of measuring equipment.",
        requirements: [
          "7.1 Planning of product realization, with risk management throughout realization",
          "7.2 Customer-related processes: requirements, review, communication (including notification to authorities)",
          "7.3 Design and development: planning, inputs/outputs, review, verification, validation, transfer, control of changes, design file",
          "7.4 Purchasing: supplier selection criteria, purchasing information, verification of purchased product",
          "7.5 Production: control, cleanliness, installation, associated servicing, sterile processes, process validation, identification and traceability, preservation",
          "7.6 Control of monitoring and measuring equipment",
        ],
      },
      {
        clause: "8. Mesure, analyse et amélioration",
        title: "Feedback, audits, nonconformities and actions",
        summary:
          "Monitor the product and the system, handle feedback and complaints, notify authorities and improve through corrective and preventive actions.",
        requirements: [
          "8.2.1 Feedback; 8.2.2 Complaint handling; 8.2.3 Reporting to regulatory authorities",
          "8.2.4 Internal audit; 8.2.5 Monitoring and measurement of processes; 8.2.6 Monitoring and measurement of product",
          "8.3 Control of nonconforming product, including post-delivery actions and advisory notices",
          "8.4 Analysis of data; 8.5.1 Improvement; 8.5.2 Corrective action; 8.5.3 Preventive action",
        ],
      },
    ],
    [
      { term: "Medical device", definition: "An instrument, apparatus or software intended by the manufacturer for a medical purpose in relation to human beings." },
      { term: "Medical device file", definition: "The set of documents demonstrating that the device conforms to applicable requirements." },
      { term: "Vigilance", definition: "Post-market surveillance and notification of incidents to competent authorities." },
    ],
    { code: "ISO 13485:2016", title: "Medical devices — Quality management systems — Requirements for regulatory purposes", role: "The requirements standard being audited, with a structure specific to regulatory alignment.", url: isoUrl("59752") },
  ),
  "iso-22301": enSpec(
    "iso-22301",
    "ISO 22301:2019",
    "business continuity management system (BCMS)",
    "business continuity",
    enHlsClauses({
      systemName: "business continuity management system (BCMS)",
      subject: "business continuity",
      riskTerm: "disruption-related risks",
      indicator: "exercise results, and the achieved RTO and RPO",
      extra: {
        8: [
          "8.2 Business impact analysis (BIA) and risk assessment",
          "8.3 Continuity strategies and solutions",
          "8.4 Continuity plans and procedures, response structure, communication",
          "8.5 Exercise and testing programme",
          "8.6 Evaluation of continuity documentation and capabilities",
        ],
      },
    }),
    [
      { term: "BIA", definition: "Business impact analysis: analysis of the consequences over time of a disruption to activities." },
      { term: "RTO", definition: "Recovery time objective: the maximum tolerable period before an activity must be resumed." },
      { term: "RPO", definition: "Recovery point objective: the maximum tolerable loss of data, expressed as a period of time." },
      { term: "MTPD", definition: "Maximum tolerable period of disruption, beyond which the impacts become unacceptable." },
    ],
    { code: "ISO 22301:2019", title: "Security and resilience — Business continuity management systems — Requirements", role: "The requirements standard being audited, clauses 4 to 10.", url: isoUrl("75106") },
  ),
  "iso-37001": enSpec(
    "iso-37001",
    "ISO 37001:2016",
    "anti-bribery management system (ABMS)",
    "anti-bribery",
    enHlsClauses({
      systemName: "anti-bribery management system (ABMS)",
      subject: "anti-bribery",
      riskTerm: "bribery risks",
      indicator: "alerts received, due diligence performed and gifts declared",
      extra: {
        4: ["4.5 Bribery risk assessment, reviewed periodically"],
        5: ["5.3.2 Anti-bribery compliance function, independent and adequately resourced"],
        8: [
          "8.2 Due diligence (business associates, projects, exposed personnel)",
          "8.5 Financial and non-financial controls",
          "8.7 Gifts, hospitality, donations and similar benefits",
          "8.9 Raising concerns and whistle-blower protection",
          "8.10 Investigation and handling of bribery",
        ],
      },
    }),
    [
      { term: "Bribery", definition: "Offering, promising, giving, accepting or soliciting an undue advantage to induce a particular course of conduct." },
      { term: "Due diligence", definition: "A thorough assessment of the nature and extent of the bribery risk associated with a transaction, associate or role." },
      { term: "Compliance function", definition: "The person or team responsible for overseeing the design and implementation of the anti-bribery management system." },
    ],
    { code: "ISO 37001:2016", title: "Anti-bribery management systems — Requirements with guidance for use", role: "The requirements standard being audited, clauses 4 to 10.", url: isoUrl("65034") },
  ),
  "iso-19011": enSpec(
    "iso-19011",
    "ISO 19011",
    "audit programme",
    "auditing management systems",
    [
      {
        clause: "4. Principes de l'audit",
        title: "The seven principles underpinning the credibility of audits",
        summary:
          "Auditing relies on principles that ensure its conclusions are relevant, sufficient and comparable from one auditor to another.",
        guidance: true,
        requirements: [
          "Integrity: the foundation of professionalism for the auditor",
          "Fair presentation: reporting truthfully and accurately, including unresolved disagreements",
          "Due professional care: diligence and judgement applied in every audit situation",
          "Confidentiality: security of the information obtained",
          "Independence: freedom from responsibility for the activity being audited, objectivity of conclusions",
          "Evidence-based approach: verifiable conclusions drawn from rational sampling",
          "Risk-based approach: focusing the audit on what matters to the audit client and the organization",
        ],
        quiz: [
          {
            question: "Name three of the seven principles of auditing.",
            answer:
              "Any three of: integrity, fair presentation, due professional care, confidentiality, independence, evidence-based approach, risk-based approach.",
          },
          {
            question: "Why is ISO 19011 not a certifiable standard?",
            answer:
              "It provides guidance rather than requirements. The requirements applicable to certification bodies are set out in ISO/IEC 17021-1.",
          },
        ],
      },
      {
        clause: "5. Management d'un programme d'audit",
        title: "Managing the whole set of audits, not a single audit",
        summary:
          "The audit programme covers all audits planned over a given period: objectives, risks and opportunities, resources, implementation, monitoring, review and improvement.",
        guidance: true,
        requirements: [
          "5.1 Establishing audit programme objectives based on the organization's issues and priorities",
          "5.2 Determining and evaluating the risks and opportunities of the programme",
          "5.3 Establishing the programme: extent, timeframe, methods, criteria, resources, required competence",
          "5.4 Implementing: appointing team leaders, forming audit teams, managing outcomes and records",
          "5.5 Monitoring the programme and its effectiveness",
          "5.6 Reviewing and improving the programme in light of results and feedback",
        ],
        quiz: [
          {
            question: "What is the difference between an audit programme and an audit plan?",
            answer:
              "The programme covers the whole set of audits planned over a period; the plan describes how a given audit will be carried out (timing, scope, contacts).",
          },
        ],
      },
      {
        clause: "6. Réalisation d'un audit",
        title: "From initiation to follow-up, step by step",
        summary:
          "The typical audit sequence: initiation, preparation, conducting the activities on-site or remotely, preparing and distributing the report, closure and follow-up.",
        guidance: true,
        requirements: [
          "6.1 Initiating the audit: contact with the auditee, feasibility of the audit",
          "6.2 Preparation: review of documented information, audit plan, task assignment, working documents",
          "6.3 Conducting the audit: opening meeting, communication during the audit, role of guides and observers, gathering and verifying information",
          "6.4 Audit findings: evaluating evidence against criteria, conclusions, closing meeting",
          "6.5 Audit report: preparation, content, distribution",
          "6.6 Completing the audit and 6.7 follow-up of actions decided by the auditee",
        ],
        quiz: [
          {
            question: "What are the three elements of an acceptable nonconformity statement?",
            answer: "The observed fact, the requirement not met, and the supporting evidence.",
          },
          {
            question: "Who decides on the corrective actions following the audit?",
            answer:
              "The auditee: the audit team records findings and draws conclusions, but does not prescribe the solution.",
          },
        ],
      },
      {
        clause: "7. Compétence et évaluation des auditeurs",
        title: "What makes an auditor — and a team leader — competent",
        summary:
          "Competence combines personal behaviour, generic auditing knowledge and skills, discipline- and sector-specific knowledge, maintained through continual improvement.",
        guidance: true,
        requirements: [
          "7.2 Determining the competence needed in light of the programme's objectives",
          "Expected personal behaviour: ethical, open-minded, diplomatic, observant, tenacious, decisive",
          "Generic knowledge and skills, discipline-specific knowledge, and knowledge specific to the audit team leader",
          "7.3 Establishing evaluation criteria, 7.4 selecting the appropriate method, 7.5 conducting the evaluation",
          "7.6 Maintaining and improving competence (experience, training, participation in audits)",
        ],
        quiz: [
          {
            question:
              "Name three personal behaviours expected of an auditor according to ISO 19011.",
            answer:
              "Any three of: ethical, open-minded, diplomatic, observant, perceptive, versatile, tenacious, decisive, self-reliant, courageous, well-organized.",
          },
        ],
      },
      {
        clause: "Annexe A",
        title: "Additional guidance for auditors",
        summary:
          "Practical supplements: applying audit methods, remote auditing, auditing context, leadership and commitment, compliance, the supply chain, as well as verifying information and sampling.",
        guidance: true,
        requirements: [
          "On-site and remote audit methods, interactive or non-interactive",
          "Auditing context, leadership, risks and opportunities, and the life cycle",
          "Professionalism: professional judgement, performance results",
          "Verifying information, sampling, auditing regulatory compliance",
        ],
      },
    ],
    [
      {
        term: "Audit programme",
        definition:
          "Arrangements for a set of one or more audits planned for a specific time frame and directed towards a specific purpose.",
      },
      {
        term: "Audit plan",
        definition: "A description of the activities and arrangements for a given audit.",
      },
      {
        term: "Audit client",
        definition: "The organization or person requesting an audit.",
      },
      {
        term: "Auditee",
        definition: "The whole or part of an organization that is being audited.",
      },
      {
        term: "Guide",
        definition:
          "A person appointed by the auditee to assist the audit team; a guide does not influence or interfere with the conduct of the audit.",
      },
      {
        term: "Observer",
        definition:
          "A person who accompanies the audit team but does not audit and does not influence the conduct of the audit.",
      },
      {
        term: "Technical expert",
        definition:
          "A person who provides specific knowledge or expertise to the audit team but does not act as an auditor.",
      },
      {
        term: "Audit risk",
        definition:
          "The risk of reaching incorrect or incomplete audit conclusions, notably through insufficient sampling.",
      },
    ],
    {
      code: "ISO 19011:2026",
      title: "Guidelines for auditing management systems",
      role: "The reference studied: principles, managing the audit programme, conducting audits and auditor competence. Guidance only, not certifiable.",
      url: isoUrl("70017"),
    },
  ),
};
