/**
 * English mirror of the ISO 45001 course pedagogical content.
 *
 * All wording is original: no verbatim reproduction of protected ISO
 * standard text.
 */
import type { LessonExtras } from "./lesson-extras";

export const enLessonExtras: Record<number, LessonExtras> = {
  1: {
    objectives: [
      "Explain the purpose of an OH&S management system",
      "Position ISO 45001 relative to technical safety regulations",
      "Restate the logic of the PDCA cycle and its link to Clauses 4 to 10",
      "Distinguish reactive prevention from proactive prevention",
      "Differentiate certification of an organization from certification of a person",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "A factory replaces gloves after every accident, never analysing why cuts keep recurring: this is a reaction, not a system.",
      },
      {
        sector: "Construction",
        text: "A company assesses working-at-height risks as early as the design phase of a project and adapts the method statement: this is proactive prevention.",
      },
      {
        sector: "Healthcare",
        text: "A hospital treats biological hazards and the psychosocial workload of caregivers at the same level, because both affect health at work.",
      },
    ],
    auditorView: [
      "The auditor seeks to understand whether OH&S is managed over time or handled case by case.",
      "They observe whether the improvement loop is genuinely closed: do findings lead to decisions?",
    ],
    evidence: [
      "Signed and communicated OH&S policy",
      "OH&S objectives with deadlines and owners",
      "Management review minutes",
      "Indicators tracked over time, not just the number of accidents",
    ],
    examFocus: [
      "PDCA is not a documented procedure: it is an operating logic.",
      "ISO 45001 is a requirements standard; ISO 45002 and ISO 45003 are guidance documents, not auditable as requirements.",
    ],
    commonMistakes: [
      "Believing that ISO 45001 only addresses accidents, forgetting occupational illness and ill health.",
      "Thinking that a competent HSE manager alone constitutes a management system.",
      "Confusing organizational certification with an auditor's personal qualification.",
    ],
    scenario: {
      prompt:
        "An SME shows a declining accident rate over three years but has no written OH&S objectives or management review. The owner considers a management system to be 'paperwork'. How do you respond, based on the logic of the standard?",
      correction:
        "The observed decrease cannot be shown to be a managed result: without objectives or review, nothing proves the performance is controlled rather than due to chance or reduced activity. The standard does not require paperwork but a loop: plan objectives, allocate resources, measure, then decide. The point is not the document, but the ability to demonstrate and reproduce the result.",
    },
    flashcards: [
      { front: "What does PDCA stand for?", back: "Plan – Do – Check – Act: plan, implement, check, and act to improve." },
      { front: "Which clauses form the auditable core of ISO 45001?", back: "Clauses 4 to 10. Clauses 1 to 3 are introductory." },
      { front: "Which standard preceded ISO 45001?", back: "OHSAS 18001, a British reference standard, replaced by ISO 45001 published in 2018." },
      { front: "Reactive or proactive prevention?", back: "Reactive: acting after the event. Proactive: identifying and treating the hazard before the event." },
      { front: "Requirements standard or guidance document?", back: "ISO 45001 = certifiable requirements. ISO 45002 / 45003 = guidance to support implementation." },
    ],
  },

  2: {
    objectives: [
      "Distinguish hazard and OH&S risk",
      "Differentiate incident, accident and near-miss",
      "Differentiate consultation and participation of workers",
      "Differentiate correction and corrective action",
      "Correctly use the notions of performance and effectiveness",
    ],
    examples: [
      {
        sector: "Logistics",
        text: "Oil-covered floor (hazard) → a forklift operator crosses the area (exposure) → slip (event) → fracture (consequence) → risk is assessed as likelihood × severity.",
      },
      {
        sector: "Office work",
        text: "A persistently excessive workload is a psychosocial hazard: it may not cause a visible accident, but it does cause ill health.",
      },
      {
        sector: "Transport",
        text: "A driver narrowly avoids a collision: no harm occurs, so it is a near-miss — a signal to be treated as a learning opportunity.",
      },
    ],
    auditorView: [
      "The auditor tests command of the vocabulary among the people met, not only the HSE manager.",
      "They check that the organization addresses near-misses, not only accidents with lost time.",
    ],
    evidence: [
      "Incident register including near-misses",
      "Analysis of an event showing the distinction between correction and corrective action",
      "Minutes of worker consultation and evidence of their participation in decisions",
    ],
    examFocus: [
      "An undesirable event does not necessarily involve injury or ill health: it can have no consequence at all (near-miss).",
      "Consultation gathers an opinion; participation involves people in the decision. Both are required, on different topics.",
      "Training does not prove competence: competence is the demonstrated ability to achieve the intended result.",
    ],
    commonMistakes: [
      "Using 'hazard' and 'risk' as synonyms.",
      "Reducing an incident to an accident with bodily harm.",
      "Treating the correction (cleaning the oil) as the corrective action (eliminating the leak).",
    ],
    scenario: {
      prompt:
        "After a fall caused by an oil spill, the company cleaned the floor, trained the operator, and closed the file. The manager calls this a 'corrective action'. Is this correct?",
      correction:
        "No. Cleaning the spill is a correction: dealing with the immediate consequence. A corrective action would require identifying the cause of the oil's presence — a machine leak, lack of inspection, unsuitable maintenance procedure — and acting to prevent recurrence. Training alone does not remove the cause.",
    },
    flashcards: [
      { front: "Hazard", back: "A source with the potential to cause injury or ill health." },
      { front: "OH&S risk", back: "Combination of the likelihood of a hazardous event and the severity of its consequences." },
      { front: "Near-miss", back: "An incident without actual harm, but which could have caused it." },
      { front: "Consultation vs participation", back: "Consultation: seeking an opinion before a decision. Participation: involving workers in the decision." },
      { front: "Correction vs corrective action", back: "Correction: dealing with the effect. Corrective action: eliminating the cause to prevent recurrence." },
      { front: "Performance vs effectiveness", back: "Performance: a measurable result. Effectiveness: the extent to which planned results are achieved." },
      { front: "Documented information", back: "Information that the organization must control and keep up to date, regardless of its medium." },
    ],
  },

  3: {
    objectives: [
      "Identify internal and external issues relevant to OH&S",
      "Determine interested parties and their applicable requirements",
      "Justify a coherent scope",
      "Link context to OH&S risks and to the system's processes",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "A site in a Seveso zone identifies regulatory pressure and neighbouring communities as an external issue, and ageing facilities as an internal issue.",
      },
      {
        sector: "Services",
        text: "An engineering firm identifies remote working as an internal issue: it changes exposure to risk and the way workers are consulted.",
      },
    ],
    auditorView: [
      "The auditor checks consistency: do the stated issues show up in the risks, objectives and decisions?",
      "They examine any exclusion of an activity from the scope and its justification.",
    ],
    evidence: [
      "Context analysis kept up to date and dated",
      "Table of interested parties and the requirements retained",
      "Accessible scope statement",
      "Map of the system's processes and their interactions",
    ],
    examFocus: [
      "The standard requires no specific tool: SWOT, PESTEL or a simple table are all acceptable if the result is demonstrated.",
      "Not every expectation of interested parties becomes an obligation: the organization decides which ones it adopts.",
      "The scope cannot exclude an activity that affects the OH&S of workers.",
    ],
    commonMistakes: [
      "Confusing interested parties with customers.",
      "Writing a generic context analysis unrelated to actual risks.",
      "Reducing the scope to a geographical address.",
    ],
    scenario: {
      prompt:
        "A site excludes its maintenance workshop from its scope, which is outsourced to a contractor working on its premises. Is this exclusion acceptable?",
      correction:
        "No. Contractors working on-site are under the organization's control or influence, and their activity affects OH&S. The scope may describe boundaries but cannot exclude exposed workers whose working conditions the organization controls or influences.",
    },
    flashcards: [
      { front: "Internal issue", back: "A factor specific to the organization affecting its ability to achieve OH&S results: culture, resources, equipment age." },
      { front: "External issue", back: "A factor in the organization's environment: regulation, market, climate, neighbourhood, technology." },
      { front: "Relevant interested party", back: "A person or organization that can affect, or be affected by, the organization's OH&S decisions." },
      { front: "Scope", back: "The documented boundary of the system: sites, activities, products and services covered." },
    ],
  },

  4: {
    objectives: [
      "Describe the expected evidence of top management leadership",
      "Analyse an OH&S policy against the requirements",
      "Distinguish consultation from participation in cases required by the standard",
      "Verify the assignment of roles, responsibilities and authorities",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "The site director spends one hour a week on OH&S walkabouts and personally arbitrates safety investment decisions.",
      },
      {
        sector: "Construction",
        text: "Tradespeople take part in drafting the method statements for working at height: they are the ones who identify the real constraints.",
      },
      {
        sector: "Healthcare",
        text: "Staff representatives are involved in choosing needle-stick protection devices before purchase, not after.",
      },
    ],
    auditorView: [
      "The auditor questions top management directly: can they name the main risks and the system's objectives?",
      "They look for evidence of genuine worker participation, not just top-down information.",
      "They check that workers can report a hazard without fear of reprisal.",
    ],
    evidence: [
      "OH&S policy dated, signed, communicated and available",
      "Minutes of meetings where OH&S decisions were made by top management",
      "Role descriptions and delegated authorities",
      "Minutes of worker consultation and evidence of participation",
    ],
    examFocus: [
      "Leadership cannot be delegated: the HSE manager facilitates, but top management remains accountable.",
      "The standard explicitly distinguishes topics subject to consultation from those subject to participation.",
      "Freedom from reprisal for reporting is a requirement, not just good practice.",
    ],
    commonMistakes: [
      "Treating the appointment of an HSE manager as proof of leadership.",
      "Equating the display of the policy with its communication and understanding.",
      "Treating participation as a mere information meeting.",
    ],
    scenario: {
      prompt:
        "The OH&S policy is posted in the lobby, but three operators interviewed do not know its content and have never been consulted on the risk assessment for their job. What findings do you formulate?",
      correction:
        "Two separate nonconformity issues arise. First, the policy must be communicated and understood within the organization: mere display without ownership does not demonstrate this. Second, worker participation in hazard identification and risk assessment is explicitly required; its absence is a structural gap, to be formulated separately.",
    },
    flashcards: [
      { front: "Who holds OH&S leadership?", back: "Top management. It can delegate tasks, never accountability for the system." },
      { front: "Three commitments expected of an OH&S policy", back: "Providing safe working conditions, eliminating hazards and reducing risks, continually improving — with consultation and participation of workers." },
      { front: "Protection of reporting", back: "Workers must be able to report hazards and incidents without fear of reprisal." },
    ],
  },

  5: {
    objectives: [
      "Apply the chain hazard → event → consequence → risk level",
      "Apply the hierarchy of controls",
      "Distinguish OH&S risks from risks to the management system",
      "Formulate measurable and planned OH&S objectives",
      "Identify applicable legal and other requirements",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "Replacing a hazardous solvent with a less harmful product is substitution, much higher in the hierarchy than handing out masks.",
      },
      {
        sector: "Logistics",
        text: "Physically separating pedestrian and forklift traffic is an engineering control; floor marking alone remains an administrative control.",
      },
      {
        sector: "Office work",
        text: "Reducing an excessive workload is an organizational measure, not a stress-management training course.",
      },
    ],
    auditorView: [
      "The auditor checks that the hierarchy of controls was genuinely examined before choosing PPE.",
      "They check that the risk assessment was updated after a change: new machine, new process, new organization.",
      "They check that objectives are backed by resources, owners and deadlines.",
    ],
    evidence: [
      "Dated risk assessment document with the method explained",
      "Evidence of update following a significant change",
      "Legal monitoring and compliance evaluation",
      "Action plan linking objectives, resources, owners and deadlines",
    ],
    examFocus: [
      "Order of the hierarchy: elimination, substitution, engineering controls, administrative controls, personal protective equipment.",
      "OH&S opportunities are not 'business benefits': they are chances to improve OH&S performance.",
      "Risks to the system (loss of key competence, outdated legal monitoring) are distinct from OH&S risks to people.",
    ],
    commonMistakes: [
      "Starting with PPE, which is the last level of the hierarchy.",
      "Setting unmeasurable objectives such as 'improve safety'.",
      "Confusing legal monitoring with compliance evaluation.",
    ],
    scenario: {
      prompt:
        "Faced with a workstation at 92 dB(A), the company hands out earplugs and trains operators. Does this comply with the logic of the standard?",
      correction:
        "Insufficient as it stands. Nothing shows that higher levels of the hierarchy were examined: eliminating the source, replacing the machine, enclosure, acoustic treatment, reducing exposure time. PPE remains acceptable as a supplement or interim measure, but the process must demonstrate that more effective upstream measures were considered.",
    },
    flashcards: [
      { front: "Hierarchy of controls", back: "Elimination → substitution → engineering controls → administrative controls → PPE." },
      { front: "OH&S opportunity", back: "A circumstance that could lead to an improvement in OH&S performance." },
      { front: "Compliant OH&S objective", back: "Consistent with the policy, measurable, monitored, communicated, with resources, an owner and a deadline." },
      { front: "Other requirements", back: "Non-regulatory commitments the organization chooses to meet: agreements, customer requirements, internal standards." },
    ],
  },

  8: {
    objectives: [
      "Distinguish training, awareness and competence",
      "Identify internal and external communication needs",
      "Apply the requirements for controlling documented information",
      "Assess the adequacy of resources allocated to the system",
    ],
    examples: [
      {
        sector: "Construction",
        text: "An operator holds a valid qualification but does not know how to apply the site's method statement: competence is not demonstrated.",
      },
      {
        sector: "Healthcare",
        text: "Posting instructions only in French, in a multilingual team, causes internal communication to fail.",
      },
    ],
    auditorView: [
      "The auditor verifies competence on the ground, by questioning the operator, not just checking the certificate in a binder.",
      "They check document control: the current version is at the workstation, obsolete ones have been withdrawn.",
    ],
    evidence: [
      "Competence matrix and post-training evaluations",
      "Internal and external communication plan",
      "List of documented information, with version and distribution",
      "Budget or resources allocated to OH&S",
    ],
    examFocus: [
      "Competence is a demonstrated ability; training is only one means of achieving it.",
      "Awareness targets all workers; competence targets functions with an impact on OH&S.",
      "The standard does not require paper procedures: it requires control of the documented information that is necessary.",
    ],
    commonMistakes: [
      "Equating a training certificate with competence.",
      "Multiplying procedures 'to look ISO-compliant' rather than documenting what is necessary.",
      "Forgetting external communication: contractors, visitors, authorities.",
    ],
    scenario: {
      prompt:
        "A company presents a complete training plan, but no temporary worker has received a safety induction, for lack of time. What is your analysis?",
      correction:
        "Temporary workers are workers within the meaning of the standard. The lack of a safety induction affects both awareness and the competence of exposed people, and often operational control. The existence of a training plan for permanent staff does not address this: the gap concerns the population actually exposed.",
    },
    flashcards: [
      { front: "Competence", back: "The ability to apply knowledge and skills to achieve intended results." },
      { front: "Awareness", back: "Awareness of the policy, risks, one's contribution, and the consequences of a deviation." },
      { front: "Documented information", back: "Information and its medium, which the organization must keep up to date and control." },
    ],
  },

  9: {
    objectives: [
      "Describe the requirements for operational planning and control",
      "Apply the hierarchy of controls in operational control",
      "Control change, outsourcing and procurement",
      "Build an emergency preparedness and response setup",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "Before installing a new production line, a change-risk analysis is conducted and method statements are updated.",
      },
      {
        sector: "Logistics",
        text: "OH&S criteria are included in the carrier-selection specifications and checked during supplier audits.",
      },
    ],
    auditorView: [
      "The auditor traces a recent change end to end: was it anticipated or simply endured?",
      "They check that emergency drills are conducted, evaluated and improved, including with contractors present on site.",
    ],
    evidence: [
      "Change-risk analyses",
      "Contracts and specifications including OH&S requirements",
      "Emergency plans, drill reports and actions from lessons learned",
      "Work permits, lockout/tagout records, method statements",
    ],
    examFocus: [
      "Control of outsourced activities remains the organization's responsibility.",
      "Change management covers temporary and organizational changes, not only technical ones.",
      "Emergency drills must involve relevant interested parties present at the workplace.",
    ],
    commonMistakes: [
      "Believing that outsourcing an activity transfers OH&S responsibility.",
      "Limiting change management to new equipment.",
      "Settling for a written emergency plan that has never been tested.",
    ],
    scenario: {
      prompt:
        "An annual evacuation drill is carried out, but night-shift cleaning contractors have never taken part. What is your finding?",
      correction:
        "The emergency arrangements must cover everyone present at the workplace, including contractors and staff on shifted schedules. A drill that structurally excludes an exposed population does not demonstrate the organization's response capability.",
    },
    flashcards: [
      { front: "Operational control", back: "The set of arrangements ensuring activities are carried out under the intended OH&S conditions." },
      { front: "Change management", back: "Prior analysis of the OH&S consequences of permanent or temporary changes." },
      { front: "Outsourcing", back: "The organization retains responsibility for the OH&S of activities it outsources and must define how they are controlled." },
    ],
  },

  10: {
    objectives: [
      "Build a relevant monitoring and measurement setup",
      "Distinguish lagging and leading indicators",
      "Describe the evaluation of compliance with legal requirements",
      "Position the role of internal audit and management review",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "Tracking the completion rate of site walkabouts (leading) in addition to the accident frequency rate (lagging).",
      },
      {
        sector: "Services",
        text: "Measuring the average time to process hazard reports: a simple and very telling indicator during audits.",
      },
    ],
    auditorView: [
      "The auditor checks whether measured data are used to decide, or only to fill in a dashboard.",
      "They check calibration or verification of measuring equipment where data reliability depends on it.",
      "They review management review inputs and outputs to check the decision-making loop.",
    ],
    evidence: [
      "OH&S dashboard with frequency and owners",
      "Dated regulatory compliance evaluation",
      "Internal audit programme and reports",
      "Management review minutes with decisions and resources",
    ],
    examFocus: [
      "Compliance evaluation is a distinct requirement from legal monitoring.",
      "A purely lagging indicator cannot demonstrate proactive prevention.",
      "Internal audit must be conducted with objectivity and impartiality: an auditor does not audit their own work.",
    ],
    commonMistakes: [
      "Reducing performance evaluation to the frequency rate.",
      "Confusing management review with an HSE team meeting.",
      "Having a process audited by its own owner.",
    ],
    scenario: {
      prompt:
        "The management review is held annually and its minutes only list indicators, without any decision or resource allocation. Is this sufficient?",
      correction:
        "No. The management review must produce outputs: decisions on opportunities for improvement, needs for change to the system, and required resources. A purely descriptive record does not demonstrate that top management steers the system.",
    },
    flashcards: [
      { front: "Lagging indicator", back: "A measure of an event that has already occurred: accidents, lost days, reported illnesses." },
      { front: "Leading indicator", back: "A measure of an upstream preventive action: walkabouts, toolbox talks, closed actions, treated near-misses." },
      { front: "Compliance evaluation", back: "Periodic and documented verification of compliance with legal and other requirements." },
      { front: "Impartiality of internal audit", back: "The auditor must not audit their own activities." },
    ],
  },

  11: {
    objectives: [
      "Handle an incident or nonconformity following the logic of the standard",
      "Conduct a root-cause analysis",
      "Distinguish correction, corrective action and continual improvement",
      "Demonstrate the effectiveness of a corrective action",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "Five successive 'whys' show that a missing guard results from a maintenance procedure lacking a controlled reassembly step.",
      },
      {
        sector: "Construction",
        text: "Recurring same-level falls lead to a review of storage organization, not just a reminder of the tidiness rule.",
      },
    ],
    auditorView: [
      "The auditor traces a nonconformity end to end: detection, correction, root-cause analysis, action, verification of effectiveness.",
      "They spot repeated corrective actions, a sign that the real cause was not addressed.",
    ],
    evidence: [
      "Incident and nonconformity reports",
      "Root-cause analyses (5 whys, cause tree, Ishikawa)",
      "Action plans with effectiveness verification",
      "Evidence of updating the risk assessment after the event",
    ],
    examFocus: [
      "A corrective action without effectiveness verification remains incomplete.",
      "Continual improvement is not limited to handling deviations: it also includes proactively seeking progress.",
      "An incident without harm must also trigger a cause investigation.",
    ],
    commonMistakes: [
      "Closing a nonconformity as soon as the correction is made.",
      "Naming 'human error' as the root cause.",
      "Forgetting to update the risk assessment after the event.",
    ],
    scenario: {
      prompt:
        "The same nonconformity about PPE use is opened, treated and closed three times in a year, each time with 'reminder of the rule' as the action. What is your finding?",
      correction:
        "The recurrence shows that the root-cause analysis has not succeeded: the reminder is a correction, not a corrective action. Organizational causes must be explored — uncomfortable or unavailable PPE, incompatible with the task, no monitoring. The gap concerns the effectiveness of the corrective action process, not just PPE use.",
    },
    flashcards: [
      { front: "Nonconformity", back: "Non-fulfilment of a requirement." },
      { front: "Root cause", back: "An organizational or systemic cause whose elimination prevents recurrence." },
      { front: "Effectiveness of a corrective action", back: "Verified when the cause has disappeared and the deviation no longer recurs over a relevant period." },
    ],
  },

  12: {
    objectives: [
      "Position ISO 19011 relative to ISO 45001",
      "Restate the principles of auditing",
      "Distinguish an audit programme from an individual audit",
      "Understand the risk-based approach applied to audit",
    ],
    examples: [
      {
        sector: "Multiple sectors",
        text: "An annual audit programme plans six internal audits; each one is a distinct audit with its own plan.",
      },
    ],
    auditorView: [
      "The auditor applies the evidence-based approach: an unsupported finding does not hold.",
      "Independence is demonstrated by how the programme is organized, not by a declaration.",
    ],
    evidence: [
      "Annual audit programme with scopes and deadlines",
      "Individual audit plans",
      "Audit reports and collected evidence",
    ],
    examFocus: [
      "ISO 19011:2026 is a guidance document, not a certifiable requirements standard.",
      "The principles: integrity, fair presentation, due professional care, confidentiality, independence, evidence-based approach, risk-based approach.",
      "Stage 1 and Stage 2 certification audits and the major/minor classification of nonconformities fall under ISO/IEC 17021-1, not ISO 19011.",
    ],
    commonMistakes: [
      "Treating ISO 19011 as an auditable requirements standard.",
      "Confusing the audit programme (overall steering) with the audit (the actual engagement).",
    ],
    scenario: {
      prompt:
        "A quality manager claims their internal audit is compliant because it follows 'the requirements of ISO 19011'. What do you correct?",
      correction:
        "ISO 19011 provides guidance, not certifiable requirements. The internal audit requirement comes from ISO 45001, Clause 9.2; ISO 19011 helps implement it. The wording needs correcting, even though the practice itself may be sound.",
    },
    flashcards: [
      { front: "ISO 19011:2026", back: "Guidelines for auditing management systems. Not a certifiable requirements standard." },
      { front: "Audit programme", back: "The set of audits planned over a given period for a defined purpose." },
      { front: "Evidence-based approach", back: "Audit conclusions rely on verifiable evidence, obtained through sampling." },
    ],
  },

  13: {
    objectives: [
      "Distinguish first-, second- and third-party audits",
      "Choose collection methods suited to the objective",
      "Build a defensible sampling approach",
      "Adapt the method for remote auditing",
    ],
    examples: [
      {
        sector: "Multiple sectors",
        text: "Internal audit (first party), audit of a supplier (second party), certification audit by an accredited body (third party).",
      },
      {
        sector: "Services",
        text: "A remote video-conference audit works well for document review, much less so for observing a workstation.",
      },
    ],
    auditorView: [
      "Cross-check methods: an interview alone is never enough to establish a solid finding.",
      "Document the sample used, to make the finding reproducible.",
    ],
    evidence: [
      "Time-stamped audit notes",
      "Documents reviewed, with reference and version",
      "Dated and located field observations",
    ],
    examFocus: [
      "A certification audit is always a third-party audit, never a second-party one.",
      "Sampling implies an accepted residual risk: an audit does not guarantee the total absence of deviation.",
    ],
    commonMistakes: [
      "Calling a mere inspection visit an 'audit'.",
      "Basing a finding on a single self-declared source.",
    ],
    scenario: {
      prompt:
        "During a remote audit, the auditor concludes that PPE use is well controlled based on photos sent by the auditee. Is this acceptable?",
      correction:
        "Weak. Evidence provided by the auditee, neither time-stamped nor contextualized, cannot support a conclusion about daily practice. It must be cross-checked: interviews with operators, inspection records, live camera visits, or this part should be deferred to an on-site audit.",
    },
    flashcards: [
      { front: "First-party audit", back: "An internal audit, conducted by or for the organization itself." },
      { front: "Second-party audit", back: "An audit conducted by a party with an interest: a customer, at a supplier's premises." },
      { front: "Third-party audit", back: "An audit by an independent external body, notably for certification." },
      { front: "Collection methods", back: "Interviews, observation, document review, data analysis." },
    ],
  },

  15: {
    objectives: [
      "Identify the personal qualities expected of an auditor",
      "Adopt a professional stance in difficult situations",
      "Formulate effective open questions",
      "Manage confidentiality and conflicts of interest",
    ],
    examples: [
      {
        sector: "Multiple sectors",
        text: "Faced with a defensive auditee, rephrasing and returning to the observed fact defuses tension better than insisting on the deviation.",
      },
      {
        sector: "Healthcare",
        text: "An auditor confronted with identifiable medical information must refrain from recording it in the report.",
      },
    ],
    auditorView: [
      "The auditor listens more than they speak: the goal is to understand how things actually work.",
      "They separate the observed fact from interpretation and from the individual.",
    ],
    evidence: [
      "Declarations of independence and absence of conflict of interest",
      "Confidentiality commitments",
      "Auditor evaluations and maintenance of competence",
    ],
    examFocus: [
      "The auditor identifies deviations from requirements; they do not propose solutions, unless explicitly mandated to advise.",
      "Impartiality requires not auditing an activity one was recently responsible for.",
    ],
    commonMistakes: [
      "Adopting the posture of an inspector or enforcer.",
      "Writing a finding aimed at a person rather than a process.",
      "Offering solutions during a certification audit.",
    ],
    scenario: {
      prompt:
        "An auditee confides in you about internal tension between two departments and asks you not to mention it. The information sheds light on a system dysfunction. What do you do?",
      correction:
        "Confidentiality protects the source, not the dysfunction. Neither the name nor the statement is recorded, but an independent objective piece of evidence is sought — minutes, processing delays, observed deviations — allowing, if it exists, a finding based on verifiable facts.",
    },
    flashcards: [
      { front: "Auditor stance", back: "Active listening, open questions, factual approach, no judgement of people." },
      { front: "Conflict of interest", back: "A situation compromising impartiality: auditing one's own work, one's department, a relative." },
      { front: "Confidentiality", back: "Information gathered is used only for the purposes of the audit." },
    ],
  },

  16: {
    objectives: [
      "Define the objective, scope and criteria of an audit",
      "Build a realistic audit plan",
      "Prepare a useful document review",
      "Build an evidence-oriented checklist rather than a clause-based one",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "The plan schedules the workshop audit during a shift change, precisely because that is a critical moment.",
      },
      {
        sector: "Construction",
        text: "The preliminary document review reveals a risk assessment not updated for two years: the audit trail is identified before arriving on site.",
      },
    ],
    auditorView: [
      "Good preparation turns the checklist into a guide, not a closed questionnaire.",
      "The plan should allow margin: interesting leads emerge during the audit.",
    ],
    evidence: [
      "Audit plan distributed and accepted",
      "Explicit audit criteria",
      "Checklist or guide prepared",
      "Preliminary document analysis",
    ],
    examFocus: [
      "Audit criteria ≠ audit objectives: criteria are the reference points for comparison.",
      "The scope must specify the sites, activities, processes and period covered.",
    ],
    commonMistakes: [
      "Building a checklist that just copies the clauses.",
      "Planning an audit without accounting for actual working hours.",
      "Forgetting to have the plan approved by the auditee.",
    ],
    scenario: {
      prompt:
        "The audit plan allocates two hours to audit three workshops, maintenance and procurement. What risk do you identify?",
      correction:
        "The time allowed does not permit collecting sufficient evidence: the sample becomes too small to support conclusions. Either the scope must be reduced, the duration extended, or the audit team strengthened. An audit that cannot be completed in the allotted time compromises the reliability of its conclusions.",
    },
    flashcards: [
      { front: "Audit objective", back: "What the audit seeks to establish: conformity, effectiveness, ability to achieve results." },
      { front: "Audit criteria", back: "Reference points for comparison: standard, legal requirements, internal procedures, contract." },
      { front: "Audit scope", back: "Extent and boundaries: sites, activities, processes, period." },
    ],
  },

  17: {
    objectives: [
      "Conduct an effective opening meeting",
      "Collect evidence through interview, observation and documents",
      "Manage time and unforeseen events during the audit",
      "Prepare and conduct the closing meeting",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "By following an operator at their workstation, the auditor notices a gap between the written method statement and actual practice.",
      },
      {
        sector: "Logistics",
        text: "A document presented as 'current' bears an outdated revision date: documentary evidence must be verified, not taken on trust.",
      },
    ],
    auditorView: [
      "Audit the real flow rather than the org chart: follow a product, an incident, a person.",
      "Announce findings at closing without surprises: they were confirmed throughout the audit.",
    ],
    evidence: [
      "Attendance sheets for opening and closing meetings",
      "Dated field notes",
      "Precise references of the documents examined",
    ],
    examFocus: [
      "The closing meeting presents findings and conclusions, not a negotiation of deviations.",
      "Every finding must have been confirmed with the auditee before closing.",
    ],
    commonMistakes: [
      "Revealing a major deviation at closing without having verified it with the auditee.",
      "Conducting the audit entirely in a meeting room, without field observation.",
      "Negotiating the severity of a finding to avoid conflict.",
    ],
    scenario: {
      prompt:
        "At the closing meeting, the auditee disputes a deviation by producing a document never shown during the audit. What do you do?",
      correction:
        "Examine the evidence: if it is admissible, dated and consistent with the audited period, the finding is withdrawn or reworded. Otherwise, it stands. The evidence-based approach prevails: neither stubbornness nor complacency, but a factual analysis traced in the report.",
    },
    flashcards: [
      { front: "Opening meeting", back: "Confirms the plan, criteria, logistics, and confidentiality and safety rules." },
      { front: "Closing meeting", back: "Presents findings and conclusions, clarifies next steps and response deadlines." },
      { front: "Auditing the real flow", back: "Following an activity, incident or product end to end rather than clause by clause." },
    ],
  },

  18: {
    objectives: [
      "Write a factual, precise and verifiable finding",
      "Classify a deviation as a major or minor nonconformity",
      "Distinguish nonconformity, observation and point of concern",
      "Write a usable audit report",
    ],
    examples: [
      {
        sector: "Manufacturing",
        text: "'Of the 8 incident analysis forms examined, 5 contain no root-cause analysis': fact, sample, requirement.",
      },
      {
        sector: "Services",
        text: "'Staff seem uninvolved' is not a finding: it is an impression, not verifiable.",
      },
    ],
    auditorView: [
      "A good finding contains the observed fact, the evidence, the unmet requirement, and nothing more.",
      "Severity is judged on systemic effect and risk, not on frustration felt.",
    ],
    evidence: [
      "Complete deviation records",
      "Audit report distributed on time",
      "Tracking of the auditee's responses and action plans",
    ],
    examFocus: [
      "Major: systemic failure, total absence of a required process, or immediate serious risk.",
      "Minor: an isolated deviation that does not cause the system to fail.",
      "An observation is not a deviation: it cannot require a corrective action.",
    ],
    commonMistakes: [
      "Writing a finding as a solution: 'operators should be trained'.",
      "Citing the clause without describing the observed fact.",
      "Turning an accumulation of minors into a major without justification.",
    ],
    scenario: {
      prompt:
        "Correctly formulate this finding: 'New arrivals are not well onboarded, safety is not taken seriously.'",
      correction:
        "Example rewording: 'Of 6 temporary workers who joined in the last 3 months, no record of a safety induction could be produced (sample from 12/03, personnel register). The requirement for worker awareness is not met.' The finding states the fact, the sample, the evidence and the requirement, without value judgement or proposed solution.",
    },
    flashcards: [
      { front: "Structure of a finding", back: "Observed fact + evidence/sample + unmet requirement." },
      { front: "Major nonconformity", back: "A systemic failure, absence of a required process, or serious risk to health and safety." },
      { front: "Minor nonconformity", back: "An isolated deviation that does not affect the overall capability of the system." },
      { front: "Observation", back: "A point of attention or improvement opportunity; it does not require a mandatory corrective action." },
    ],
  },

  19: {
    objectives: [
      "Draw on the whole course in a realistic case",
      "Collect and prioritize evidence",
      "Write classified and defensible findings",
    ],
    auditorView: [
      "Treat the case as a real audit: scope, sample, evidence, then write-up.",
      "Review by asking: could a third party replicate this finding with the same evidence?",
    ],
    examFocus: [
      "Practical exercises value the quality of the finding's write-up as much as its detection.",
    ],
  },
};

