/**
 * English content mirror for the generic per-clause training material and the
 * shared audit methodology sessions used for all certifications other than
 * ISO 45001 (whose curriculum lives entirely in `program.json`).
 *
 * The generic content is parameterised by the harmonised structure (clauses 4
 * to 10): it adapts to the subject and the management system name of the
 * active standard. The per-standard overrides bring in sector examples, exam
 * focus points and flashcards specific to each referential.
 *
 * All wording is original: no reproduction of copyrighted ISO standard text.
 */

import type { Flashcard, LessonExtras } from "./lesson-extras";
import type { ClauseKey, StandardContext } from "./standard-extras";

/* ------------------------------------------------------ Generic content */

type Generator = (ctx: StandardContext) => LessonExtras;

const generic: Record<ClauseKey, Generator> = {
  "4": (c) => ({
    objectives: [
      `Identify the internal and external issues that influence ${c.subject}`,
      "Distinguish an interested party from an interested party's requirement",
      `Justify the scope of the ${c.systemName}`,
      "Describe the system's processes and their interactions",
    ],
    auditorView: [
      "The auditor checks that the context analysis is actually used downstream: do the identified issues feed into risk analysis and objectives?",
      "They examine the consistency of the scope: any excluded site, activity or process must be justified and must not affect conformity.",
      "They look for evidence of an update: a context left unchanged since initial certification is a warning sign.",
    ],
    evidence: [
      "Context analysis (SWOT, PESTEL or free format), dated and reviewed",
      "Mapping of interested parties with their retained needs and expectations",
      "Documented scope, with justification for any exclusions",
      "Process map showing inputs, outputs and process owners",
    ],
    examFocus: [
      "The scope must be documented information: it is not an optional requirement.",
      "Not every expectation of an interested party becomes a requirement: the organization chooses which ones it retains, and must be able to explain why.",
    ],
    commonMistakes: [
      "Confusing interested party with customer: staff, authorities, neighbours and suppliers are also interested parties.",
      "Writing a generic context analysis, copied from a template, unrelated to the actual activity.",
      "Excluding an activity from the scope without demonstrating that it has no effect on conformity.",
    ],
    scenario: {
      prompt: `During an audit, the organization presents a two-page context analysis, undated, identical to that of its sister company. The scope excludes an outsourced workshop that performs a step critical to ${c.subject}. What findings do you raise?`,
      correction:
        "Two avenues. First, control of the context: without a date or organization-specific content, nothing demonstrates that the analysis was actually carried out and kept up to date; other evidence (management review, meeting minutes) should be sought before concluding. Second, the scope: a critical outsourced activity cannot simply be excluded; it must remain within the perimeter and be controlled as an outsourced process. The second avenue is the stronger one: the unmet requirement is clear and the evidence is the scope document itself.",
    },
    keyPoints: [
      "Clause 4 lays the foundation: everything that follows must be consistent with it.",
      "Context, interested parties and scope form a logical chain.",
      "The scope is mandatory documented information.",
      "An exclusion must be justified, not simply declared.",
    ],
    flashcards: [
      { front: "What must the scope contain?", back: "The boundaries of the system: sites, activities, products and services covered, plus justification for anything excluded." },
      { front: "Is an interested party's expectation always a requirement?", back: "No. The organization identifies expectations then decides which ones it retains as requirements, and must be able to justify that choice." },
      { front: "What does the auditor look for at clause 4?", back: "Consistency: do the identified issues show up again in the risks, objectives and processes?" },
    ],
  }),

  "5": (c) => ({
    objectives: [
      "Distinguish leadership from mere formal commitment",
      `Check that a ${c.subject} policy satisfies both form and substance requirements`,
      "Identify how roles and authorities are assigned and made known",
      "Spot evidence that the system is integrated into business processes",
    ],
    auditorView: [
      "The auditor questions top management directly: can they cite the objectives, results and decisions taken?",
      "They check that the policy is understood by operational staff, not just displayed in the lobby.",
      "They look for effective allocation of resources: budget, time, named individuals.",
    ],
    evidence: [
      "Policy dated, signed by top management and communicated",
      "Organization chart and job descriptions mentioning system-related responsibilities",
      "Management review minutes showing decisions and trade-offs",
      "Interviews with operational staff on their awareness of the policy",
    ],
    examFocus: [
      "The standard no longer requires an appointed 'management representative', but it does require that roles, responsibilities and authorities be assigned and communicated.",
      "The policy must be available to relevant interested parties, which does not necessarily mean publication to the general public.",
    ],
    commonMistakes: [
      "Believing that delegating the system to the quality manager is enough to demonstrate leadership.",
      "Auditing the policy only on its form, without checking that it is understood and applied.",
      "Assuming a very general policy is always acceptable: it must be appropriate to the purpose and context of the organization.",
    ],
    scenario: {
      prompt:
        "The policy is signed, displayed and contains the expected commitments. Yet none of the five operational staff interviewed know what commitments it contains, and the management review is limited to approving a table of indicators. What do you conclude?",
      correction:
        "The policy satisfies the formal requirements but not those on communication and understanding: the requirement to communicate within the organization is not met, the evidence being the consistent interview results. On the management review, approving indicators without any documented decision raises a question about management's engagement; the expected outputs should be examined before concluding. The best-supported nonconformity concerns communication of the policy.",
    },
    keyPoints: [
      "Leadership is demonstrated through decisions, resources and trade-offs, not a signature.",
      "The policy must be appropriate, communicated, understood and kept up to date.",
      "Roles and authorities must be assigned and known to those concerned.",
      "Integration into business processes distinguishes a living system from a parallel one.",
    ],
    flashcards: [
      { front: "How is leadership demonstrated during an audit?", back: "Through evidence: allocated resources, decisions made at management review, management involvement, documented trade-offs." },
      { front: "Does the standard require a management representative?", back: "No, not since the harmonised structure. It requires that roles, responsibilities and authorities be assigned and communicated." },
      { front: "Four expected qualities of a policy?", back: "Appropriate to the context, provides a framework for objectives, includes a commitment to continual improvement, communicated and kept up to date." },
    ],
  }),

  "6": (c) => ({
    objectives: [
      `Structure the identification and treatment of risks related to ${c.subject}`,
      "Distinguish risk, opportunity and the action taken to address them",
      "Draft measurable objectives and check how they are planned",
      "Understand the requirement to plan changes",
    ],
    auditorView: [
      "The auditor does not judge the risk-analysis method itself, but its consistency and effective application.",
      "They follow one significant risk end to end: identified, evaluated, addressed by an action, action completed and its effectiveness checked.",
      "They check that each objective has an owner, a deadline, resources and an evaluation method.",
    ],
    evidence: [
      "Risk and opportunity analysis with method, criteria and review date",
      "Associated action plan, with owners and deadlines",
      "Documented, measurable objectives, tracked over time",
      "Evidence that the effectiveness of actions taken has been evaluated",
    ],
    examFocus: [
      "The standard does not impose any formal risk-assessment method: it requires that risks be determined and addressed.",
      "An objective must be measurable, monitored, communicated and updated — missing even one of these elements is a nonconformity.",
    ],
    commonMistakes: [
      "Confusing the objective (the intended result) with the action (the means to achieve it).",
      "Producing an exhaustive risk matrix that is never linked to an action plan.",
      "Overlooking opportunities, treated as a mere box-ticking exercise.",
    ],
    scenario: {
      prompt: `The organization presents a map of 120 rated risks, updated annually. No action plan is attached to it; this year's ${c.subject} objectives are 'improve performance' and 'reduce nonconformities'. What nonconformities do you identify?`,
      correction:
        "Two distinct nonconformities. First: actions to address risks are neither planned nor integrated into the processes, the evidence being the absence of any action plan linked to the risk map. Second: the objectives are not measurable and allow no evaluation, the evidence being their wording. These two findings must not be merged: one concerns risk treatment, the other objectives.",
    },
    keyPoints: [
      "Risks and opportunities must lead to proportionate actions.",
      "The effectiveness of actions must be evaluated, not just their completion.",
      "An objective is measured, monitored, communicated and updated.",
      "Changes to the system must be planned: nothing should change on the fly.",
    ],
    flashcards: [
      { front: "Objective or action?", back: "The objective is the intended, measurable result. The action is the means deployed to achieve it." },
      { front: "Does the standard impose a risk-analysis method?", back: "No. It requires that risks be determined, addressed, and that the effectiveness of actions be evaluated." },
      { front: "What should be checked on an objective during an audit?", back: "Measurable, monitored, communicated, updated, with an owner, deadline, resources and evaluation method." },
    ],
  }),

  "7": (c) => ({
    objectives: [
      "Distinguish competence, awareness and training",
      `Check control of documented information within the ${c.systemName}`,
      "Analyse an internal and external communication arrangement",
      "Identify the resources needed for the system to operate",
    ],
    auditorView: [
      "The auditor asks for evidence of competence, not just an attendance certificate for a training session.",
      "They test awareness through open questions to operational staff, without putting them on the spot.",
      "They check document control through concrete cases: the version in use at the workstation, an obsolete document still being used, access to records.",
    ],
    evidence: [
      "Competence matrix and training plan, with evaluation of effectiveness",
      "Valid authorisations and qualifications",
      "Communication plan: what, when, with whom, how, by whom",
      "Document management system: versions, approvals, distribution, archiving",
    ],
    examFocus: [
      "Training is only one means among others: experience, mentoring or recruitment can also establish competence.",
      "Awareness and competence are two distinct requirements, with distinct evidence.",
    ],
    commonMistakes: [
      "Equating the training plan with proof of competence.",
      "Overlooking external communication, even though it is explicitly required.",
      "Assuming document control is limited to a document-management software tool.",
    ],
    scenario: {
      prompt:
        "An operator is working from a printed work instruction at revision B, while revision D is the current one. Yet the organization has an efficient electronic document management system. How do you handle this finding?",
      correction:
        "The tool is not at fault: what is missing is control over distribution and the withdrawal of obsolete documents. The finding is stated factually (instruction revision B in use at the workstation while revision D is current), the requirement is control of documented information, and the evidence is the on-site observation supported by an extract from the document register. What remains to be checked is the extent of the issue: an isolated case points to a minor nonconformity, several affected workstations point to a systemic failure.",
    },
    keyPoints: [
      "Competence = demonstrated know-how, not hours of training attended.",
      "Awareness is about meaning: why what I do matters.",
      "External communication is a requirement in its own right.",
      "Document control covers creation, updating, distribution and withdrawal.",
    ],
    flashcards: [
      { front: "Competence or awareness?", back: "Competence is the demonstrated ability to perform a task. Awareness is being conscious of the issues at stake and one's own contribution." },
      { front: "How can competence be proven without training?", back: "Through experience, on-the-job evaluation, mentoring, internal authorisation or an initial qualification." },
      { front: "Five questions a communication plan should answer?", back: "On what topics, when, with whom, how to communicate, and who communicates." },
    ],
  }),

  "8": (c) => ({
    objectives: [
      `Understand what operational control covers for ${c.subject}`,
      "Identify the criteria applicable to a process and how they are checked",
      "Analyse control over outsourced processes",
      "Check preparedness for emergency situations or incidents",
    ],
    auditorView: [
      "Clause 8 is where the audit is grounded in the field: the auditor observes actual activity, not just the procedure.",
      "They systematically compare what is written, what is said and what is done.",
      "They check that outsourcing transfers the activity, never the responsibility.",
    ],
    evidence: [
      "Operational procedures and instructions with their criteria",
      "Records of execution: checks, readings, approvals",
      "Contracts and specifications for providers, with performance evaluation",
      "Records of drills or simulations, with lessons learned",
    ],
    examFocus: [
      "Outsourcing a process never exempts the organization from its responsibility for the outcome.",
      "The requirement is about control: the amount of documentation is left to the organization's judgement.",
    ],
    commonMistakes: [
      "Auditing clause 8 in a meeting room, on paper, without any field observation.",
      "Accepting an emergency drill carried out once and never evaluated afterwards.",
      "Assuming that selecting a certified provider is enough to demonstrate control.",
    ],
    scenario: {
      prompt: `A process critical to ${c.subject} is entrusted to a certified provider. The organization presents the provider's certificate as the sole evidence of control, without contractual criteria or performance evaluation. What is your assessment?`,
      correction:
        "A third party's certificate attests to its own system, not to control of the service delivered to this particular organization. The requirement concerns defining control criteria and evaluating the provider; the missing evidence is twofold: no contractual criteria and no performance evaluation. The finding stands even if the provider performs satisfactorily, because the organization cannot demonstrate it.",
    },
    keyPoints: [
      "Clause 8 is audited on the ground, at the workstation.",
      "Criteria, implementation and evidence of conformity form a triad.",
      "Outsourcing is controlled contractually and verified in practice.",
      "Emergency preparedness must be tested and kept up to date.",
    ],
    flashcards: [
      { front: "Can responsibility be outsourced?", back: "No. An activity can be outsourced; responsibility for the outcome and its conformity remains with the organization." },
      { front: "How is an outsourced process controlled?", back: "By defining criteria, writing them into the contract, checking that they are met and evaluating the provider's performance." },
      { front: "How should clause 8 be audited effectively?", back: "In the field: observe the activity, question the operator, compare against the procedure and the records." },
    ],
  }),

  "9": (c) => ({
    objectives: [
      "Distinguish monitoring, measurement, analysis and evaluation",
      "Evaluate the relevance of an internal audit programme",
      "Check compliance with applicable legal requirements",
      "Check the completeness of the required inputs and outputs of management review",
    ],
    auditorView: [
      "The auditor checks that indicators measure system performance, not just activity.",
      "They check the independence of internal auditors: no one audits their own work.",
      "They make sure management review produces decisions, with resources and deadlines attached.",
    ],
    evidence: [
      "Dashboards and indicators tracked over time",
      "Internal audit programme based on risk, covering the whole scope over a cycle",
      "Internal audit reports with findings and follow-up of actions",
      "Management review minutes covering all required inputs",
    ],
    examFocus: [
      "The internal audit programme must cover the whole scope over a cycle, not necessarily every year.",
      "Management review has both required inputs AND required outputs: omitting even one input is a nonconformity.",
    ],
    commonMistakes: [
      "Confusing internal audit (evaluation of the system) with product inspection or control.",
      "Settling for activity indicators (number of meetings held) instead of performance indicators.",
      "Holding a management review with no decision and no allocation of resources.",
    ],
    scenario: {
      prompt:
        "The quality manager, who is also the owner of the purchasing process, conducted the internal audit of the purchasing process. The report raises no findings. Separately, the management review mentions neither feedback from interested parties nor the evaluation of regulatory compliance. What do you do?",
      correction:
        "Two independent findings. First, impartiality: an auditor must not audit their own work; the evidence is the report signed by the owner of the audited process. Second, management review: two required inputs are missing, the evidence being the minutes themselves. The absence of findings in the report is not in itself a nonconformity, but it reinforces the first finding.",
    },
    keyPoints: [
      "Measuring without analysing or evaluating does not satisfy the requirement.",
      "Internal audit requires impartiality and objectivity from auditors.",
      "The audit programme is built on risk and the importance of processes.",
      "Management review is judged by its decisions, not its length.",
    ],
    flashcards: [
      { front: "Who can carry out an internal audit?", back: "Any competent person impartial with respect to the activity audited, whether internal or external to the organization." },
      { front: "Must the internal audit programme cover everything every year?", back: "No: it must cover the whole scope over a defined cycle, taking risk and previous results into account." },
      { front: "What does a management review produce?", back: "Decisions and actions: opportunities for improvement, needs for changes to the system, resource needs." },
    ],
  }),

  "10": (c) => ({
    objectives: [
      "Distinguish correction, corrective action and improvement",
      "Analyse the cause of a nonconformity using a structured method",
      "Check the evaluation of the effectiveness of a corrective action",
      `Identify continual improvement practices within the ${c.systemName}`,
    ],
    auditorView: [
      "The auditor follows a nonconformity from its recording through to the closure of the corrective action.",
      "They check that the root cause was genuinely investigated, not just the first factor that came to mind.",
      "They check whether the question 'could this happen elsewhere?' was asked.",
    ],
    evidence: [
      "Register of nonconformities and complaints",
      "Documented root-cause analyses (5 whys, cause tree, fishbone diagram)",
      "Corrective action plans with owners, deadlines and status",
      "Evidence of effectiveness evaluation after implementation",
    ],
    examFocus: [
      "Correction addresses the effect, corrective action addresses the cause: both may be necessary.",
      "Preventive action no longer exists as a distinct requirement: prevention is now carried by the risk-based approach in clause 6.",
    ],
    commonMistakes: [
      "Closing a nonconformity as soon as the correction is made, without any root-cause analysis.",
      "Recording 'human error' or 'lack of rigour' as the root cause.",
      "Never checking the effectiveness of the actions taken.",
    ],
    scenario: {
      prompt:
        "The same nonconformity is recorded three times in eighteen months. Each time, the action is 'reminder of instructions to staff' and the record is closed the same day. How do you phrase the finding?",
      correction:
        "The recurrence shows the cause was never eliminated: the organization carried out a correction, not a corrective action. The finding reads as follows: three occurrences of the same nonconformity within eighteen months, the requirement is root-cause analysis and elimination of the cause to prevent recurrence, the evidence is the nonconformity register and the three identical records. Recurrence of the same nonconformity points towards a major nonconformity, since it reflects a failure of the improvement process itself.",
    },
    keyPoints: [
      "Correction ≠ corrective action: one repairs, the other removes the cause.",
      "Recurrence of a nonconformity directly calls clause 10 into question.",
      "The effectiveness of a corrective action must be checked afterwards.",
      "Continual improvement builds on the results of clause 9.",
    ],
    flashcards: [
      { front: "Correction or corrective action?", back: "Correction eliminates the nonconformity found. Corrective action eliminates its cause to prevent recurrence." },
      { front: "Does preventive action still exist?", back: "No, not as a separate requirement: prevention is now ensured by the risk-based approach in clause 6." },
      { front: "Why is recurrence serious?", back: "It proves the cause was never addressed and calls into question the effectiveness of the improvement system itself." },
    ],
  }),

  annexe: () => ({
    objectives: [
      "Understand the role of Annex A relative to risk treatment",
      "Know how to read a Statement of Applicability (SoA)",
      "Identify the four control families and their logic",
      "Check that exclusions are justified",
    ],
    auditorView: [
      "The auditor compares the risk treatment plan with the Statement of Applicability: any discrepancy must be explained.",
      "They select a few controls declared applicable and check their effective implementation on the ground.",
      "They examine the justification of exclusions: 'not applicable' with no reason is not acceptable.",
    ],
    evidence: [
      "Complete Statement of Applicability, with status and justification for each control",
      "Risk treatment plan linked to the selected controls",
      "Evidence of implementation of controls declared applicable",
      "Approval of the treatment plan by risk owners",
    ],
    examFocus: [
      "Annex A is a reference list for comparison, not a checklist of controls that must all be implemented.",
      "The Statement of Applicability is mandatory documented information: its absence is a major nonconformity.",
    ],
    commonMistakes: [
      "Believing that every control in Annex A must be implemented.",
      "Producing an SoA disconnected from the risk assessment.",
      "Declaring a control applicable without ever checking its implementation.",
    ],
    scenario: {
      prompt:
        "The Statement of Applicability declares 91 out of 93 controls applicable, with the sole justification 'good practice'. The risk treatment plan identifies only 12 controls. What do you find?",
      correction:
        "The SoA is not consistent with the risk assessment and treatment: it should derive from the treatment plan, compared against Annex A. A single generic justification does not demonstrate the process. The finding concerns the lack of a demonstrated link between risk treatment and the Statement of Applicability, the evidence being the comparison of the two documents. In addition, declaring 91 controls applicable commits the organization: each one must be capable of being audited.",
    },
    keyPoints: [
      "The SoA derives from risk treatment, never the other way round.",
      "Each control has a status and a justification.",
      "Declaring a control applicable is a commitment to demonstrate its implementation.",
      "Annex A acts as a safety net against omissions, not an imposed checklist.",
    ],
    flashcards: [
      { front: "What is Annex A for?", back: "A reference list used to check that no relevant control was overlooked during risk treatment." },
      { front: "What is the Statement of Applicability?", back: "A mandatory document listing the controls selected or excluded, with justification and implementation status." },
      { front: "Are all Annex A controls mandatory?", back: "No. Only those selected as a result of risk treatment are; exclusions must be justified." },
    ],
  }),
};

/* -------------------------------------------------- Per-standard overrides */

type Overrides = Partial<Record<ClauseKey, LessonExtras>>;

const ex = (sector: string, text: string) => ({ sector, text });
const fc = (front: string, back: string): Flashcard => ({ front, back });

const overrides: Record<string, Overrides> = {
  "iso-9001": {
    "4": {
      examples: [
        ex("Services", "A consulting firm identifies the shortage of senior consultants as a major internal issue: this issue is reflected in its risks and its recruitment plan."),
        ex("Industry", "A manufacturer excludes its trading activity from the scope even though it accounts for 30% of customer revenue: the exclusion undermines the credibility of the certificate."),
      ],
    },
    "8": {
      examples: [
        ex("Industry", "The review of customer requirements is done verbally by phone, with no record: it is impossible to demonstrate that the order was reviewed before acceptance."),
        ex("Services", "A maintenance company releases its work orders without the team leader's approval even though the procedure requires it: release is not controlled."),
      ],
      examFocus: [
        "Design and development (8.3) may be excluded if the organization does not design anything — the exclusion must be justified.",
        "Customer property also covers personal data and intellectual property entrusted to the organization, not just physical goods.",
      ],
      flashcards: [
        fc("What does customer property cover?", "Any property entrusted to the organization: materials, tooling, premises, but also data, information and intellectual property."),
        fc("When can clause 8.3 be excluded?", "When the organization carries out no design and development activity, with documented justification."),
      ],
    },
    "9": {
      examples: [
        ex("Retail", "A retailer measures customer satisfaction solely by the number of complaints received: this measures voiced dissatisfaction, not actual perception."),
        ex("Industry", "A manufacturer cross-checks customer surveys, service-level rates and after-sales returns: this genuinely evaluates customer perception."),
      ],
      examFocus: [
        "Monitoring customer satisfaction (9.1.2) is an explicit ISO 9001 requirement, distinct from measuring the product itself.",
      ],
      flashcards: [
        fc("Do complaints equal customer satisfaction?", "No. Complaints are only one source among others; the standard requires monitoring the customer's actual perception."),
      ],
    },
  },

  "iso-14001": {
    "6": {
      examples: [
        ex("Industry", "A foundry identifies water consumption as a significant aspect after defining clear, traceable rating criteria."),
        ex("Logistics", "A transport company overlooks aspects arising in emergency situations (accidental spill) and only rates normal conditions."),
      ],
      examFocus: [
        "Environmental aspects must be identified under normal, abnormal and emergency conditions, including those reasonably foreseeable.",
        "Compliance obligations cover both legal requirements and other requirements the organization voluntarily subscribes to.",
      ],
      commonMistakes: [
        "Confusing the aspect (what the organization does) with the impact (the resulting change to the environment).",
        "Limiting aspects to visible discharges, overlooking resource consumption.",
      ],
      flashcards: [
        fc("Aspect or impact?", "The aspect is the element of activity that interacts with the environment; the impact is the resulting change to the environment."),
        fc("Under which conditions must aspects be identified?", "Normal, abnormal, start-up and shutdown conditions, and reasonably foreseeable emergency situations."),
      ],
    },
    "8": {
      examples: [
        ex("Industry", "A manufacturer passes its environmental requirements on to its packaging suppliers: the life-cycle perspective is applied upstream."),
        ex("Construction", "A works contractor has no instructions for a hydrocarbon spill on site: emergency response is deficient."),
      ],
      examFocus: [
        "The life-cycle perspective does not require a full life-cycle assessment: it requires considering the upstream and downstream stages the organization can influence.",
      ],
      flashcards: [
        fc("Life-cycle perspective: is an LCA required?", "No. Life-cycle stages the organization can influence must be considered, without a mandatory quantified analysis."),
      ],
    },
    "9": {
      examples: [
        ex("Industry", "Compliance evaluation is carried out annually, regulation by regulation, with a documented conclusion: the requirement is met."),
        ex("Services", "A regulatory watch subscription exists but is never used: watching is not the same as evaluating compliance."),
      ],
      examFocus: [
        "Evaluating compliance with compliance obligations is an explicit requirement and must reach a conclusion, not just list the applicable texts.",
      ],
    },
  },

  "iso-27001": {
    "6": {
      examples: [
        ex("Technology", "A SaaS provider identifies its risks by asset, appoints a risk owner for each one and has the treatment plan approved: the process is complete."),
        ex("Healthcare", "A facility rates its risks but never appoints an owner: no one can approve acceptance of the residual risk."),
      ],
      examFocus: [
        "Exception to the general rule: ISO/IEC 27001 does impose a defined and documented risk assessment process (§6.1.2), with acceptance criteria and criteria for performing the assessment. The 'the standard imposes no method' rule that applies to ISO 9001 or ISO 45001 does not apply here.",
        "The Statement of Applicability (SoA) is a required document: it lists the necessary controls, their justification, their implementation status and the justification for any exclusions relative to Annex A.",
        "The risk owner must approve the treatment plan and accept residual risks: this is an explicit requirement.",
        "The risk assessment must be reproducible: the criteria must produce consistent and comparable results.",
      ],
      commonMistakes: [
        "Making the information security manager the owner of every risk, when they lack the authority to accept a business risk.",
        "Changing the assessment method every year, making results incomparable.",
      ],
      flashcards: [
        fc("Who accepts a residual risk?", "The risk owner, who must hold the corresponding authority and responsibility."),
        fc("What does 'reproducible assessment' mean?", "Applied twice under the same conditions, the method produces consistent, comparable results."),
      ],
    },
    "8": {
      examples: [
        ex("Technology", "The risk treatment plan is reviewed with every major architecture change: operational control keeps pace with the actual system."),
        ex("Industry", "A change of hosting provider is made without a new risk assessment: planning of changes is not under control."),
      ],
    },
    "9": {
      examples: [
        ex("Technology", "The dashboard tracks the time taken to fix critical vulnerabilities, not just their number: the indicator measures performance."),
        ex("Finance", "The number of reported incidents drops sharply with no explanation: the auditor checks whether detection or reporting has actually declined."),
      ],
    },
  },

  "iso-22000": {
    "8": {
      examples: [
        ex("Food industry", "A cannery sets a scientifically validated critical limit for temperature, continuously monitored with automatic recording: the CCP is under control."),
        ex("Catering", "A CCP is identified but its critical limit is 'correct temperature': the limit is not measurable, so it is unusable."),
      ],
      examFocus: [
        "A critical limit must be measurable and validated: a qualitative judgement is not acceptable for a CCP.",
        "PRPs, operational PRPs and CCPs follow different control and monitoring logics: confusing them is heavily penalised in the exam.",
        "Prerequisite programmes (§8.2) and hazard analysis (§8.5) assume required preliminary steps: forming the food safety team, describing products and processes, a flow diagram verified on site.",
        "Validation (§8.5.3) proves before implementation that a control measure is capable; verification (§8.8) confirms afterwards that the arrangement works; monitoring tracks control in real time.",
        "Control of product nonconformities falls under §8.9: corrections, corrective actions, handling of potentially unsafe products, withdrawal and recall.",
      ],
      commonMistakes: [
        "Declaring every sensitive step a CCP, making the HACCP plan unmanageable.",
        "Confusing monitoring (at every batch, continuous) with verification (periodic, on the effectiveness of the arrangement).",
      ],
      flashcards: [
        fc("PRP, oPRP or CCP?", "The PRP creates the basic hygienic environment. The oPRP controls a significant hazard without a measurable critical limit. The CCP has a measurable critical limit and systematic monitoring."),
        fc("Monitoring or verification?", "Monitoring tracks control of the hazard in real time. Verification periodically confirms that the arrangement is working."),
      ],
    },
    "10": {
      examples: [
        ex("Food industry", "A recall is triggered in under four hours thanks to traceability tested twice a year: the arrangement is proven."),
        ex("Food industry", "A recall procedure exists but has never been tested: nothing demonstrates that it would work."),
      ],
      examFocus: [
        "The withdrawal and recall arrangement must be tested, and the test must be recorded.",
      ],
    },
  },

  "iso-50001": {
    "6": {
      examples: [
        ex("Industry", "A plant identifies three significant energy uses accounting for 78% of its consumption and focuses its actions on them."),
        ex("Commercial real estate", "A property manager defines EnPIs without an energy baseline: no improvement can be demonstrated."),
      ],
      examFocus: [
        "Without an energy baseline (EnB), no improvement in energy performance can be demonstrated.",
        "EnPIs must be normalised for relevant variables (production, degree-days) to remain comparable.",
      ],
      commonMistakes: [
        "Confusing energy consumption with energy performance: a drop in production lowers consumption without any real improvement.",
        "Treating every energy use as significant, which dilutes resources.",
      ],
      flashcards: [
        fc("What is a SEU?", "A significant energy use: a use representing a substantial share of consumption or offering strong improvement potential."),
        fc("Why is an energy baseline essential?", "Because energy performance is demonstrated by comparison with a quantified, documented reference."),
      ],
    },
    "9": {
      examples: [
        ex("Industry", "EnPIs are normalised for production volume: real performance appears despite activity variations."),
        ex("Commercial real estate", "Consumption is compared year on year with no weather correction: the conclusion is misleading."),
      ],
    },
  },

  "iso-13485": {
    "4": {
      examFocus: [
        "ISO 13485:2016 does not follow the harmonised 10-clause structure: it keeps an 8-clause structure (4 Quality management system, 5 Management responsibility, 6 Resource management, 7 Product realization, 8 Measurement, analysis and improvement).",
        "Clause 4 requires a quality manual and a medical device file per device type or family: two documents not required by other standards.",
      ],
      flashcards: [
        fc("What is the structure of ISO 13485:2016?", "Eight clauses, of which 4 to 8 are normative: quality management system, management responsibility, resource management, product realization, measurement, analysis and improvement."),
      ],
    },
    "5": {
      examFocus: [
        "Clause 5 is titled 'Management responsibility', not 'Leadership': ISO 13485 keeps the requirement for an appointed management representative (§5.5.2), removed in the harmonised-structure standards.",
        "The quality policy and objectives must explicitly incorporate the regulatory requirements applicable to the device and the target markets.",
      ],
      flashcards: [
        fc("Does ISO 13485 require a management representative?", "Yes: §5.5.2 requires the appointment of a member of management responsible for the quality system and reporting to top management, unlike ISO 9001:2015."),
      ],
    },
    "6": {
      examFocus: [
        "ISO 13485's clause 6, 'Resource management', contains no 'risks and opportunities' requirement in the harmonised-structure sense. Product risk management falls under §7.1 and ISO 14971.",
        "Contamination control and the work environment (§6.4) are requirements specific to sterile or sensitive devices.",
      ],
    },
    "7": {
      examples: [
        ex("Medical devices", "The device file gathers specifications, verification and validation results, and the history of changes: traceability is demonstrated."),
        ex("Medical devices", "A sterile component supplier is changed without revalidation: control of changes is deficient."),
      ],
      examFocus: [
        "Verification and validation are two distinct steps: verification confirms conformity to specifications, validation confirms fitness for the intended use.",
        "Risk management (ISO 14971) is required throughout product realization, under §7.1.",
      ],
      flashcards: [
        fc("Verification or validation?", "Verification proves the product conforms to specifications. Validation proves it meets the intended use of the user."),
        fc("What is the medical device file?", "The set of documents demonstrating the device's conformity to applicable requirements throughout its life cycle."),
      ],
    },
    "8": {
      examples: [
        ex("Medical devices", "Complaints are analysed within 48 hours and evaluated against vigilance obligations: the regulatory requirement is embedded."),
        ex("Medical devices", "A serious complaint is handled like an ordinary one, with no evaluation of whether it should be reported to the competent authority."),
      ],
      examFocus: [
        "ISO 13485 favours documented effectiveness and regulatory compliance; continual improvement is less central than in ISO 9001.",
        "Clause 8 retains preventive actions (§8.5.3), removed from the harmonised-structure standards.",
      ],
    },
  },

  "iso-22301": {
    "8": {
      examples: [
        ex("Finance", "The BIA sets a 4-hour RTO for the payment service; the annual exercise demonstrates recovery in 3 hours 20 minutes: the capability is proven."),
        ex("Services", "Continuity plans exist but no exercise has been carried out in three years: continuity capability is not demonstrated."),
      ],
      examFocus: [
        "The BIA determines priorities and recovery time objectives; the risk assessment determines disruption scenarios. Both are required.",
        "An untested continuity plan demonstrates no capability: an exercising programme is an explicit requirement.",
      ],
      commonMistakes: [
        "Setting an RTO shorter than what can actually be achieved, without ever testing it.",
        "Confusing RTO (recovery time) and RPO (acceptable data loss).",
      ],
      flashcards: [
        fc("RTO or RPO?", "The RTO is the maximum acceptable time before an activity is resumed. The RPO is the maximum acceptable data loss, expressed as a duration."),
        fc("What is the BIA for?", "To determine priority activities, their recovery time objectives and the resources needed in case of disruption."),
      ],
    },
  },

  "iso-37001": {
    "5": {
      examples: [
        ex("Construction", "The compliance function reports directly to the board of directors and has its own budget: independence is demonstrated."),
        ex("Industry", "The compliance function is assigned to the sales director: its independence from exposed activities is not assured."),
      ],
      examFocus: [
        "The anti-bribery compliance function must be independent, adequately resourced, and have direct access to the governing body.",
      ],
      flashcards: [
        fc("What conditions apply to the compliance function?", "Independence from exposed activities, sufficient resources, competence, and direct access to the governing body."),
      ],
    },
    "8": {
      examples: [
        ex("International trade", "Each business intermediary undergoes due diligence proportionate to the risk, renewed periodically."),
        ex("Services", "A gift register exists but is never checked or linked to a threshold: the control is theoretical."),
      ],
      examFocus: [
        "Due diligence must be proportionate to risk and renewed: a single check at the start of the relationship is not enough.",
        "Whistle-blower protection is a requirement in its own right, distinct from the reporting mechanism itself.",
      ],
      commonMistakes: [
        "Applying the same level of due diligence to all third parties, regardless of risk.",
        "Treating a signed code of ethics as an anti-bribery control.",
      ],
      flashcards: [
        fc("What is due diligence?", "A thorough, risk-proportionate assessment of bribery risk related to a third party, project or exposed position, renewed periodically."),
        fc("Are reporting and protection the same requirement?", "No. The standard requires a reporting mechanism AND measures protecting people who report in good faith."),
      ],
    },
  },
};

/* ------------------------------------------------------------ Assembly */

function merge(base: LessonExtras, extra: LessonExtras | undefined): LessonExtras {
  if (!extra) return base;
  const merged: LessonExtras = { ...base };
  const objectives = extra.objectives ?? base.objectives;
  if (objectives) merged.objectives = objectives;
  const keyPoints = extra.keyPoints ?? base.keyPoints;
  if (keyPoints) merged.keyPoints = keyPoints;
  const scenario = extra.scenario ?? base.scenario;
  if (scenario) merged.scenario = scenario;

  const examples = [...(base.examples ?? []), ...(extra.examples ?? [])];
  if (examples.length) merged.examples = examples;
  const auditorView = [...(base.auditorView ?? []), ...(extra.auditorView ?? [])];
  if (auditorView.length) merged.auditorView = auditorView;
  const evidence = [...(base.evidence ?? []), ...(extra.evidence ?? [])];
  if (evidence.length) merged.evidence = evidence;
  const examFocus = [...(base.examFocus ?? []), ...(extra.examFocus ?? [])];
  if (examFocus.length) merged.examFocus = examFocus;
  const commonMistakes = [...(base.commonMistakes ?? []), ...(extra.commonMistakes ?? [])];
  if (commonMistakes.length) merged.commonMistakes = commonMistakes;
  const flashcards = [...(base.flashcards ?? []), ...(extra.flashcards ?? [])];
  if (flashcards.length) merged.flashcards = flashcards;

  return merged;
}

/** English-language generic clause content, enriched with per-standard overrides. */
export function enGenericClauseExtras(ctx: StandardContext, key: ClauseKey): LessonExtras {
  const base = generic[key](ctx);
  return merge(base, overrides[ctx.code]?.[key]);
}

/** English content for the audit methodology sessions, shared by all standards. */
export const enMethodologyExtras: LessonExtras[] = [
  {
    objectives: [
      "State the audit principles and their practical consequences",
      "Use the precise vocabulary expected in the exam",
      "Distinguish first-party, second-party and third-party audits",
      "Position the auditor's role relative to that of a consultant",
    ],
    examples: [
      ex("Internal audit", "An internal auditor suggests the solution to implement: this oversteps the role and compromises impartiality for future audits."),
      ex("Certification audit", "A third-party auditor identifies a nonconformity, states it factually and lets the organization choose its own corrective action: the role is respected."),
    ],
    auditorView: [
      "Each principle has a concrete translation: the evidence-based approach forbids concluding on an impression.",
      "Independence does not mean hostility: it means the absence of conflict of interest and bias.",
    ],
    evidence: [
      "Assignment letter or audit programme specifying scope and criteria",
      "Declaration of absence of conflict of interest from the audit team",
      "Factual, time-stamped audit notes mentioning sources",
    ],
    examFocus: [
      "Audit criteria and audit evidence are two distinct notions: criteria are the reference, evidence is what is observed.",
      "The auditor records findings and draws conclusions; they do not prescribe the solution.",
    ],
    commonMistakes: [
      "Concluding there is a nonconformity based on a feeling or an unverified statement.",
      "Slipping into consulting by suggesting the solution to the auditee.",
      "Using 'nonconformity' to describe what is really just an opportunity for improvement.",
    ],
    scenario: {
      prompt:
        "An auditee tells you: 'Anyway, the procedure is never followed here.' You have not yet observed any workstation. What do you do with this statement?",
      correction:
        "A statement is a lead, not evidence. It must be checked: ask to observe several relevant workstations, review records and cross-check sources. If observation confirms the nonconformity, the finding is based on the observed facts and records, not on the auditee's remark. If nothing confirms it, no finding can be raised, even though the statement seemed credible.",
    },
    keyPoints: [
      "Seven audit principles (ISO 19011:2026): integrity, fair presentation, due professional care, confidentiality, independence, evidence-based approach, risk-based approach.",
      "A finding without verifiable evidence is not a finding.",
      "The auditor evaluates; they do not advise.",
      "Precise vocabulary is very heavily assessed in the exam.",
    ],
    flashcards: [
      fc("Audit criteria?", "The set of requirements used as a reference: standard, policy, procedures, legal and contractual requirements."),
      fc("Audit evidence?", "Records, statements of fact or other information that is verifiable and relevant to the audit criteria."),
      fc("Second-party audit?", "An audit carried out by a party with an interest in the audited organization, typically a customer auditing its supplier."),
      fc("Can an auditor propose a solution?", "No. They record findings and draw conclusions; proposing a solution would amount to consulting and would compromise their impartiality."),
    ],
  },
  {
    objectives: [
      "Build a workable and realistic audit plan",
      "Prepare a defensible sampling approach",
      "Conduct an audit interview using open questions",
      "Run an opening and a closing meeting",
    ],
    examples: [
      ex("Industry", "The auditor spends the first half-day in the field rather than on documents: facts are gathered before explanations are heard."),
      ex("Services", "An audit plan announces eight processes in one day: the plan is not realistic and sampling becomes superficial."),
    ],
    auditorView: [
      "The audit plan is binding on the auditor: departing from it without the auditee's agreement weakens the audit.",
      "Open questions ('show me', 'how do you know that') produce evidence; closed questions produce a mere 'yes'.",
      "Sampling must be explained: size, selection method, period covered.",
    ],
    evidence: [
      "Audit plan circulated in advance, with scope, criteria, schedule and contacts",
      "Checklist prepared from risks and the results of previous audits",
      "Dated audit notes referencing documents, people interviewed and observations",
      "Minutes of the opening and closing meetings with signatures",
    ],
    examFocus: [
      "The opening meeting confirms the plan, the arrangements and the ground rules; it is not a mere formality.",
      "The auditee must be able to respond to findings at the closing meeting, before the report is issued.",
    ],
    commonMistakes: [
      "Asking closed questions that produce no evidence.",
      "Spending the whole day in a meeting room going through documents.",
      "Announcing a finding at the closing meeting that was never raised with the auditee during the audit.",
    ],
    scenario: {
      prompt:
        "At the closing meeting, you announce a major nonconformity that the auditee discovers at that very moment. They strongly object, arguing they could have produced the missing evidence. What should you have done?",
      correction:
        "A finding must be shared with the auditee at the moment it is established, during the audit, so they can produce further evidence. The closing meeting confirms and formalises findings; it does not reveal them. Good practice: state the finding on the spot, explicitly ask whether other evidence exists, and only retain it after that check. On substance, if the evidence exists and is produced, the finding must be withdrawn.",
    },
    keyPoints: [
      "An audit plan is prepared, circulated and followed.",
      "Sampling must be defensible and explained.",
      "Open questions produce evidence.",
      "No finding should be discovered at the closing meeting.",
    ],
    flashcards: [
      fc("Purpose of the opening meeting?", "To confirm the plan, criteria, practical arrangements, confidentiality and safety rules, and to answer questions."),
      fc("Three questions that produce evidence?", "'Show me', 'how do you know that', 'what happens if'."),
      fc("What to do with a disputed finding?", "Go back to the facts and evidence: if the auditee produces valid evidence, the finding is withdrawn; otherwise it is maintained and documented."),
    ],
  },
  {
    objectives: [
      "Write an indisputable nonconformity in three elements",
      "Classify a nonconformity as major or minor with defensible reasoning",
      "Distinguish nonconformity, observation and opportunity for improvement",
      "Structure an audit report that the auditee can actually use",
    ],
    examples: [
      ex("Industry", "'On 12 March, three of the five fire extinguishers in Hall B had a periodic inspection overdue by more than six months (photographic record and inspection register).' — a factual finding, identifiable requirement, cited evidence."),
      ex("Services", "'Supplier monitoring is insufficient.' — a judgement with no fact, no requirement, no evidence: not acceptable."),
    ],
    auditorView: [
      "A good finding can be reread six months later and still be understood without its author.",
      "Severity is reasoned: a systemic failure, the total absence of a required process, or a proven risk to the outcome point towards major.",
      "The report must be usable: the auditee must be able to start their root-cause analysis without going back to the auditor.",
    ],
    evidence: [
      "Nonconformity records stating the fact, the requirement and the evidence",
      "Audit report with summary, classified findings and conclusion",
      "Traceability of cited evidence: document references, dates, people interviewed",
    ],
    examFocus: [
      "Three mandatory elements: the fact observed, the unmet requirement, the evidence.",
      "An accumulation of minor nonconformities on the same process can amount to a major nonconformity.",
      "An opportunity for improvement can never replace a proven nonconformity.",
    ],
    commonMistakes: [
      "Writing a judgement ('insufficient', 'poorly controlled') instead of a fact.",
      "Citing the requirement without the evidence, or the evidence without the requirement.",
      "Downgrading a nonconformity to an opportunity for improvement to spare the auditee.",
    ],
    scenario: {
      prompt:
        "You find, across four different processes, that corrective actions are closed without any evaluation of their effectiveness. Each case, taken alone, seems minor. How do you classify the whole?",
      correction:
        "Repetition across four independent processes is no longer an isolated case: it reflects a failure of the improvement process itself, and therefore a major nonconformity. The finding should be phrased at system level: the requirement to evaluate the effectiveness of corrective actions is not met, the evidence being the four cases cited by name. Writing four minor findings instead of one major finding would mask the real problem.",
    },
    keyPoints: [
      "Fact + requirement + evidence: the three non-negotiable elements.",
      "Severity is reasoned and justified, not just felt.",
      "Recurrence of a nonconformity tips the classification towards major.",
      "The report must enable the auditee to act on their own.",
    ],
    flashcards: [
      fc("Three elements of a nonconformity?", "The fact observed, the unmet requirement, and the evidence supporting the fact."),
      fc("What characterises a major nonconformity?", "The total absence of a required element, a systemic failure, or a nonconformity calling into question the system's ability to achieve its intended results."),
      fc("Can a nonconformity be converted into an opportunity?", "No. An unmet requirement is a nonconformity; an opportunity for improvement concerns something conforming that could still be improved."),
    ],
  },
];
