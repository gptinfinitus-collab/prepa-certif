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
    "Requirement-by-requirement checklist for the OH&S management system, from context to continual improvement.",
  sections: [
    {
      chapter: "4. Context of the organization",
      items: [
        {
          clause: "4.1",
          requirement:
            "External and internal issues relevant to the organization's purpose determined.",
          guidance:
            "Ask for the method (PESTEL, SWOT) and sources. Evidence: dated context analysis.",
        },
        {
          clause: "4.1",
          requirement: "Climate change considered as a relevant issue (Amd 1:2024).",
          guidance:
            "Heat, extreme events, air quality for exposed jobs. Evidence: record of the consideration, even if concluded not relevant.",
        },
        {
          clause: "4.1",
          requirement: "Issues reviewed and kept up to date at a defined frequency.",
          guidance:
            "Compare the last review date with actual changes. Evidence: management review, updated analysis.",
        },
        {
          clause: "4.2",
          requirement: "Workers and other relevant interested parties identified.",
          guidance:
            "Check contractors, temporary staff, visitors, neighbours are listed. Evidence: interested-party map.",
        },
        {
          clause: "4.2",
          requirement: "Needs and expectations of those interested parties determined.",
          guidance: "Ask how expectations were collected (surveys, works council, meetings).",
        },
        {
          clause: "4.2",
          requirement:
            "Needs and expectations adopted as compliance obligations identified as such.",
          guidance:
            "Check the split between plain expectation and adopted commitment. Evidence: compliance-obligation list.",
        },
        {
          clause: "4.2",
          requirement:
            "Interested-party expectations related to climate change considered (Amd 1:2024).",
          guidance:
            "Customer, insurer and local authority requirements. Evidence: record of the consideration.",
        },
        {
          clause: "4.3",
          requirement: "Scope determined considering issues, obligations and planned activities.",
          guidance: "Ask for justification of each boundary. Evidence: scope statement.",
        },
        {
          clause: "4.3",
          requirement:
            "Scope including activities, products and services under the organization's control or influence.",
          guidance: "Look for unjustified exclusions: remote work, sites, on-site contractors.",
        },
        {
          clause: "4.3",
          requirement: "Scope available as documented information.",
          guidance: "Check version, approval date and availability to interested parties.",
        },
        {
          clause: "4.4",
          requirement:
            "OH&S management system established, implemented, maintained and continually improved.",
          guidance: "Look for evidence the system has been alive over the last 12 months.",
        },
        {
          clause: "4.4",
          requirement: "Processes needed and their interactions determined.",
          guidance: "Have one process walked through end to end. Evidence: process map.",
        },
      ],
    },
    {
      chapter: "5. Leadership and worker participation",
      items: [
        {
          clause: "5.1",
          requirement:
            "Top management takes overall responsibility for the prevention of injury and ill health.",
          guidance:
            "Interview top management: who answers for a serious accident? Evidence: delegations, minutes.",
        },
        {
          clause: "5.1",
          requirement: "OH&S policy and objectives compatible with the strategic direction.",
          guidance: "Cross-check the strategic plan against OH&S objectives.",
        },
        {
          clause: "5.1",
          requirement:
            "Integration of system requirements into the organization's business processes.",
          guidance: "Check OH&S appears in projects, purchasing and HR — not in a silo.",
        },
        {
          clause: "5.1",
          requirement: "Resources needed for the system available.",
          guidance:
            "Prevention budget, dedicated headcount, allocated time. Evidence: budget, job descriptions.",
        },
        {
          clause: "5.1",
          requirement:
            "Importance of effective management and conformity to requirements communicated.",
          guidance: "Ask workers what messages they receive from management.",
        },
        {
          clause: "5.1",
          requirement: "Achievement of the system's intended outcomes ensured and monitored.",
          guidance: "Compare declared intended outcomes with the indicators tracked.",
        },
        {
          clause: "5.1",
          requirement:
            "Development, leadership and promotion of a culture supporting the system's outcomes.",
          guidance: "Look for signals: management site walks, recognition of reported issues.",
        },
        {
          clause: "5.1",
          requirement:
            "Protection of workers from reprisals when reporting incidents, hazards or risks.",
          guidance:
            "Ask workers what happens when a hazard is reported. Evidence: reporting procedure.",
        },
        {
          clause: "5.1",
          requirement:
            "Processes for consultation and participation of workers established and supported.",
          guidance: "Check the bodies exist and are active. Evidence: minutes.",
        },
        {
          clause: "5.1",
          requirement: "Establishment and operation of health and safety committees supported.",
          guidance: "Meeting frequency, representativeness, follow-up of requests.",
        },
        {
          clause: "5.2",
          requirement:
            "OH&S policy appropriate to the purpose, size and context of the organization.",
          guidance: "A generic copied policy is a weak signal: look for risk-specific wording.",
        },
        {
          clause: "5.2",
          requirement:
            "Commitment to provide safe and healthy working conditions, framed against the risks.",
          guidance: "Check consistency with the hazards actually identified.",
        },
        {
          clause: "5.2",
          requirement: "Commitment to fulfil legal and other requirements.",
          guidance: "Cross-check with the legal watch.",
        },
        {
          clause: "5.2",
          requirement: "Commitment to eliminate hazards and reduce OH&S risks.",
          guidance: "Look for evidence of elimination, not only PPE.",
        },
        {
          clause: "5.2",
          requirement: "Commitment to continual improvement of the system.",
          guidance: "Cross-check with objectives and the action plan.",
        },
        {
          clause: "5.2",
          requirement:
            "Commitment to consultation and participation of workers and their representatives.",
          guidance: "Cross-check with 5.4 evidence.",
        },
        {
          clause: "5.2",
          requirement:
            "Policy documented, communicated, available to interested parties and periodically reviewed.",
          guidance: "Check the signature date and actual display on site.",
        },
        {
          clause: "5.3",
          requirement:
            "Roles, responsibilities and authorities assigned, documented and communicated at all levels.",
          guidance:
            "Ask a worker who decides to stop an unsafe task. Evidence: job descriptions, org chart.",
        },
        {
          clause: "5.3",
          requirement:
            "Each worker takes responsibility for the aspects of the system they control.",
          guidance: "Check real understanding during shop-floor interviews.",
        },
        {
          clause: "5.3",
          requirement:
            "Responsibility and authority assigned for reporting system performance to top management.",
          guidance: "Identify the person and the actual reports.",
        },
        {
          clause: "5.4",
          requirement:
            "Mechanisms for consultation of non-managerial workers established at all levels and functions.",
          guidance:
            "Distinguish consultation (before the decision) from information. Evidence: committee minutes.",
        },
        {
          clause: "5.4",
          requirement:
            "Worker participation in hazard identification, risk assessment and determination of controls.",
          guidance: "Ask for a recent example where a shop-floor input changed a control.",
        },
        {
          clause: "5.4",
          requirement:
            "Barriers to participation identified and removed (time, language, literacy, fear of reprisal).",
          guidance: "Interview non-native-speaking or temporary workers.",
        },
        {
          clause: "5.4",
          requirement:
            "Access provided to clear, understandable and relevant information about the system.",
          guidance: "Check readability of the materials for the audiences concerned.",
        },
      ],
    },
    {
      chapter: "6. Planning",
      items: [
        {
          clause: "6.1.1",
          requirement:
            "Risks and opportunities for the system determined considering context, interested parties and scope.",
          guidance:
            "Do not confuse OH&S risks with management-system risks. Evidence: risk/opportunity register.",
        },
        {
          clause: "6.1.1",
          requirement:
            "Hazards, OH&S risks, legal requirements and planned changes taken into account.",
          guidance: "Check the planning inputs are traceable.",
        },
        {
          clause: "6.1.1",
          requirement:
            "Documented information maintained on risks, opportunities and planning processes.",
          guidance: "Check the last update date and the link with recent changes.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Hazard identification process ongoing and proactive, not triggered only after an incident.",
          guidance: "Look for frequency and triggers. Evidence: hazard identification procedure.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Work organization, social factors, workload and harassment taken into account.",
          guidance:
            "Psychosocial risks are the most common gap. Evidence: psychosocial risk assessment.",
        },
        {
          clause: "6.1.2.1",
          requirement: "Routine and non-routine activities and situations taken into account.",
          guidance: "Maintenance, shutdowns, emergency interventions, exceptional works.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Past incidents, internal and external, and their causes taken into account.",
          guidance: "Cross-check the incident register with the risk assessment.",
        },
        {
          clause: "6.1.2.1",
          requirement: "Potential emergency situations taken into account.",
          guidance: "Cross-check with 8.2: same scenarios on both sides?",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "People concerned taken into account: workers, contractors, visitors, neighbours.",
          guidance: "Check coverage of external parties.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Changes to the organization, processes, activities and knowledge taken into account.",
          guidance: "Cross-check with management of change (8.1.3).",
        },
        {
          clause: "6.1.2.2",
          requirement:
            "Risk assessment methodologies and criteria defined, documented and applied proactively.",
          guidance:
            "Have the rating walked through on a real job. Evidence: documented methodology.",
        },
        {
          clause: "6.1.2.2",
          requirement:
            "OH&S risks assessed from identified hazards, considering existing controls.",
          guidance:
            "Check consistency between criticality and action priority. Evidence: risk register.",
        },
        {
          clause: "6.1.2.2",
          requirement: "Other risks to the management system assessed.",
          guidance: "Do not stop at field risks: competence, outsourcing, obsolete documentation.",
        },
        {
          clause: "6.1.2.3",
          requirement:
            "OH&S improvement opportunities identified, including adapting work to workers.",
          guidance: "Ergonomics, new technology, reorganization. Ask for concrete examples.",
        },
        {
          clause: "6.1.2.3",
          requirement: "Opportunities to improve the management system identified and assessed.",
          guidance: "Cross-check with management review inputs.",
        },
        {
          clause: "6.1.3",
          requirement: "Applicable legal and other requirements determined and accessible.",
          guidance: "Test a recent regulatory change. Evidence: legal watch.",
        },
        {
          clause: "6.1.3",
          requirement:
            "Those requirements taken into account when establishing and implementing the system.",
          guidance: "Cross-check a specific legal requirement with the matching procedure.",
        },
        {
          clause: "6.1.3",
          requirement:
            "Requirements kept up to date, communicated and available as documented information.",
          guidance: "Check update dates and distribution to the people concerned.",
        },
        {
          clause: "6.1.4",
          requirement:
            "Actions planned to address risks, opportunities, legal requirements and emergency situations.",
          guidance: "Evidence: action plan with owners and due dates.",
        },
        {
          clause: "6.1.4",
          requirement:
            "Actions integrated into the system's processes and their effectiveness evaluated.",
          guidance: "Look for the effectiveness review, not just action closure.",
        },
        {
          clause: "6.1.4",
          requirement: "Hierarchy of controls considered when planning actions.",
          guidance: "PPE as the first response is a frequent nonconformity.",
        },
        {
          clause: "6.1.4",
          requirement:
            "Best practices, technological options and financial and operational constraints considered.",
          guidance: "Ask for justification of a recent trade-off.",
        },
        {
          clause: "6.2.1",
          requirement:
            "OH&S objectives established at relevant functions and levels, consistent with the policy.",
          guidance: "Look for objectives cascaded beyond the HSE department.",
        },
        {
          clause: "6.2.1",
          requirement:
            "Objectives measurable or evaluable, considering requirements, assessment results and worker consultation.",
          guidance: "Ask how an objective is measured and by whom.",
        },
        {
          clause: "6.2.1",
          requirement: "Objectives monitored, communicated and updated as appropriate.",
          guidance: "Check communication to workers, not just the management committee.",
        },
        {
          clause: "6.2.2",
          requirement:
            "Planning of objectives specifying what will be done and the resources required.",
          guidance: "An objective without resources is a display objective.",
        },
        {
          clause: "6.2.2",
          requirement: "Owner and target date defined for each objective.",
          guidance: "Check the owner is named.",
        },
        {
          clause: "6.2.2",
          requirement: "Method for evaluating results defined, including monitoring indicators.",
          guidance: "Ask for the associated indicator and its data source.",
        },
        {
          clause: "6.2.2",
          requirement: "Integration of objective-related actions into business processes.",
          guidance: "Look for traces in department plans, not only the HSE plan.",
        },
        {
          clause: "6.2.2",
          requirement: "Documented information maintained on objectives and associated plans.",
          guidance: "Check the current version and progress tracking.",
        },
      ],
    },
    {
      chapter: "7. Support",
      items: [
        {
          clause: "7.1",
          requirement:
            "Resources needed to establish, implement and improve the system determined and provided.",
          guidance:
            "Prevention budget, headcount, time, equipment. Evidence: budget, allocated means.",
        },
        {
          clause: "7.2",
          requirement: "Necessary competence determined for workers affecting OH&S performance.",
          guidance: "Including competence to identify hazards. Evidence: competence matrix.",
        },
        {
          clause: "7.2",
          requirement:
            "Competence ensured on the basis of appropriate education, training or experience.",
          guidance: "Cross-check a high-risk job with in-date authorizations.",
        },
        {
          clause: "7.2",
          requirement:
            "Actions taken to acquire and maintain competence, and their effectiveness evaluated.",
          guidance: "Look for post-training evaluation, not just the attendance sheet.",
        },
        {
          clause: "7.2",
          requirement: "Documented information retained as evidence of competence.",
          guidance: "Check archiving and refresher dates.",
        },
        {
          clause: "7.3",
          requirement: "Workers aware of the OH&S policy and objectives.",
          guidance: "Ask three workers about the content of the policy.",
        },
        {
          clause: "7.3",
          requirement:
            "Awareness of their contribution to the system's effectiveness and the benefits of improved performance.",
          guidance: "Look for job-specific, concrete wording.",
        },
        {
          clause: "7.3",
          requirement:
            "Awareness of the implications of not conforming to the system's requirements.",
          guidance: "Check the message is not limited to sanctions.",
        },
        {
          clause: "7.3",
          requirement: "Awareness of incidents and the outcomes of related investigations.",
          guidance: "Evidence: safety flashes, shared lessons learned.",
        },
        {
          clause: "7.3",
          requirement: "Awareness of the hazards, risks and controls relevant to them.",
          guidance: "Ask a worker about the risks of their own job.",
        },
        {
          clause: "7.3",
          requirement:
            "Workers informed of their ability to remove themselves from situations of serious and imminent danger.",
          guidance: "Essential field question. Evidence: safety induction, posting.",
        },
        {
          clause: "7.3",
          requirement:
            "Workers informed of the arrangements protecting them from undue consequences after such removal.",
          guidance: "Cross-check with 5.1 on reprisals.",
        },
        {
          clause: "7.4.1",
          requirement:
            "Internal and external communication process defined: what, when, with whom, how.",
          guidance: "Evidence: communication matrix or procedure.",
        },
        {
          clause: "7.4.1",
          requirement:
            "Diversity of workers taken into account: language, culture, literacy, disability.",
          guidance: "Check adapted materials exist at the sites concerned.",
        },
        {
          clause: "7.4.1",
          requirement: "Views of external interested parties considered in communication.",
          guidance: "Neighbour complaints, customer requests, client requirements.",
        },
        {
          clause: "7.4.2",
          requirement:
            "Internal communication of relevant information at all levels and functions, including on changes.",
          guidance: "Test how a worker escalates an OH&S issue.",
        },
        {
          clause: "7.4.2",
          requirement:
            "Communication process enabling workers to contribute to continual improvement.",
          guidance: "Look for feedback on reports: silence kills the mechanism.",
        },
        {
          clause: "7.4.3",
          requirement:
            "External communication of relevant information in line with processes and compliance obligations.",
          guidance: "Mandatory declarations, information to contractors and visitors.",
        },
        {
          clause: "7.5.1",
          requirement:
            "System including documented information required by the standard and that deemed necessary for effectiveness.",
          guidance: "Check the document inventory and gaps.",
        },
        {
          clause: "7.5.2",
          requirement:
            "Creating and updating: appropriate identification, description, format and media.",
          guidance: "Check references, dates and versions on a sample.",
        },
        {
          clause: "7.5.2",
          requirement:
            "Review and approval of documented information for suitability and adequacy.",
          guidance: "Check the approval signature on a recent document.",
        },
        {
          clause: "7.5.3",
          requirement: "Documented information available and suitable where needed.",
          guidance: "Verify at the workstation, not only in the quality office.",
        },
        {
          clause: "7.5.3",
          requirement:
            "Documented information protected: confidentiality, improper use, loss of integrity.",
          guidance: "Check access rights and backups, especially for health data.",
        },
        {
          clause: "7.5.3",
          requirement: "Distribution, access, retrieval and use controlled.",
          guidance: "Look for obsolete versions still circulating on site.",
        },
        {
          clause: "7.5.3",
          requirement: "Change control, retention and disposition of documented information.",
          guidance: "Check retention periods for regulatory records.",
        },
        {
          clause: "7.5.3",
          requirement: "Documented information of external origin identified and controlled.",
          guidance: "Standards, manufacturer manuals, safety data sheets: check current versions.",
        },
      ],
    },
    {
      chapter: "8. Operation",
      items: [
        {
          clause: "8.1.1",
          requirement: "Operational processes planned, implemented, controlled and maintained.",
          guidance: "Walk one high-risk process end to end.",
        },
        {
          clause: "8.1.1",
          requirement: "Criteria for the processes established.",
          guidance: "Look for operating procedures and stop thresholds.",
        },
        {
          clause: "8.1.1",
          requirement: "Control implemented in accordance with the established criteria.",
          guidance: "Compare observed practice with the written procedure.",
        },
        {
          clause: "8.1.1",
          requirement: "Work adapted to workers in the design of jobs and processes.",
          guidance: "Ergonomics, working hours, pace. Evidence: workstation studies.",
        },
        {
          clause: "8.1.1",
          requirement:
            "Coordination of relevant parties where multiple employers share a workplace.",
          guidance: "Evidence: prevention plan, safety protocol, coordination meetings.",
        },
        {
          clause: "8.1.2",
          requirement: "Elimination of hazards sought as first priority.",
          guidance: "Ask for an example of elimination achieved this year.",
        },
        {
          clause: "8.1.2",
          requirement:
            "Substitution with less hazardous processes, equipment or materials where possible.",
          guidance: "Look for chemical substitutions.",
        },
        {
          clause: "8.1.2",
          requirement: "Engineering controls and reorganization of work implemented.",
          guidance: "Collective guarding, automation, separation of people and machines.",
        },
        {
          clause: "8.1.2",
          requirement: "Administrative controls, including training, implemented.",
          guidance: "Work permits, lockout-tagout, job rotation.",
        },
        {
          clause: "8.1.2",
          requirement:
            "Adequate personal protective equipment provided free of charge and its use ensured.",
          guidance: "Check free provision, fit and replacement.",
        },
        {
          clause: "8.1.3",
          requirement:
            "Management-of-change process established for temporary and permanent changes.",
          guidance: "Evidence: management-of-change procedure.",
        },
        {
          clause: "8.1.3",
          requirement:
            "New products, services, processes, workplaces and equipment taken into account.",
          guidance: "Cross-check a recent project with its risk analysis.",
        },
        {
          clause: "8.1.3",
          requirement:
            "Changes in legal requirements and knowledge about hazards taken into account.",
          guidance: "Test a recent regulatory change and its operational impact.",
        },
        {
          clause: "8.1.3",
          requirement: "Unintended consequences of changes reviewed and action taken as needed.",
          guidance: "Look for the post-change review, often missing.",
        },
        {
          clause: "8.1.4.1",
          requirement:
            "Purchasing process controlled to ensure goods and services conform to system requirements.",
          guidance: "Check OH&S clauses in specifications and orders.",
        },
        {
          clause: "8.1.4.2",
          requirement:
            "Contractor procurement coordinated and OH&S criteria embedded in their selection.",
          guidance: "Evidence: selection grid, periodic contractor evaluation.",
        },
        {
          clause: "8.1.4.2",
          requirement:
            "Hazards arising from contractors' activities identified and risks controlled.",
          guidance: "Cross-check the prevention plan with what contractors actually do on site.",
        },
        {
          clause: "8.1.4.3",
          requirement:
            "Outsourced functions and processes controlled, with the type and extent of control defined.",
          guidance: "Check what remains the organization's responsibility.",
        },
        {
          clause: "8.1.4.3",
          requirement:
            "Outsourcing control consistent with legal requirements and intended outcomes.",
          guidance: "Cross-check the contract with the applicable regulatory obligations.",
        },
        {
          clause: "8.2",
          requirement:
            "Potential emergency situations identified and response planned, including first aid.",
          guidance: "Cross-check the scenario list with the risk assessment (6.1.2.1).",
        },
        {
          clause: "8.2",
          requirement: "Training on the planned response provided to the persons concerned.",
          guidance: "Check trained headcount per shift, including off-hours.",
        },
        {
          clause: "8.2",
          requirement: "Periodic testing and exercising of the planned response carried out.",
          guidance: "Check frequency, scenarios exercised and night/weekend coverage.",
        },
        {
          clause: "8.2",
          requirement:
            "Performance evaluated and the response revised after exercises and after any actual emergency.",
          guidance: "Evidence: exercise report with action plan.",
        },
        {
          clause: "8.2",
          requirement:
            "Relevant information communicated to workers, contractors, visitors and emergency services.",
          guidance: "Check visitor induction and posted instructions.",
        },
        {
          clause: "8.2",
          requirement:
            "Documented information maintained on emergency response processes and plans.",
          guidance: "Check up-to-date evacuation plans and contact lists.",
        },
      ],
    },
    {
      chapter: "9. Performance evaluation",
      items: [
        {
          clause: "9.1.1",
          requirement: "What needs to be monitored and measured determined.",
          guidance: "Look for the balance between lagging and leading indicators.",
        },
        {
          clause: "9.1.1",
          requirement:
            "Methods for monitoring, measurement, analysis and evaluation defined to ensure valid results.",
          guidance: "Ask how a key indicator is calculated.",
        },
        {
          clause: "9.1.1",
          requirement:
            "Criteria for evaluating OH&S performance defined, with appropriate indicators.",
          guidance: "Check comparison against a target, not just raw tracking.",
        },
        {
          clause: "9.1.1",
          requirement:
            "When monitoring is performed and when results are analysed and evaluated defined.",
          guidance: "Cross-check the stated frequency with actual records.",
        },
        {
          clause: "9.1.1",
          requirement:
            "Monitoring and measuring equipment calibrated or verified, used and maintained.",
          guidance: "Sound level meters, gas detectors, instruments: check certificates.",
        },
        {
          clause: "9.1.1",
          requirement:
            "Documented information retained as evidence of results and equipment maintenance.",
          guidance: "Check traceability of readings over twelve months.",
        },
        {
          clause: "9.1.2",
          requirement:
            "Process to evaluate compliance with legal and other requirements established.",
          guidance: "Evidence: compliance evaluation procedure.",
        },
        {
          clause: "9.1.2",
          requirement: "Frequency and methods for compliance evaluation determined.",
          guidance: "Check the frequency matches the risk level.",
        },
        {
          clause: "9.1.2",
          requirement: "Compliance evaluated and action taken where needed.",
          guidance: "Cross-check a detected regulatory gap with its treatment.",
        },
        {
          clause: "9.1.2",
          requirement:
            "Knowledge and understanding of compliance status maintained, with documented information retained.",
          guidance: "Ask management the current regulatory compliance status.",
        },
        {
          clause: "9.2.1",
          requirement:
            "Internal audits conducted at planned intervals to verify conformity and effective implementation.",
          guidance: "Check all processes are covered across the cycle.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Audit programme planned: frequency, methods, responsibilities, consultation, planning requirements and reporting.",
          guidance: "Evidence: approved annual audit programme.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Programme considering the importance of processes and results of previous audits.",
          guidance: "Check problem areas are audited more often.",
        },
        {
          clause: "9.2.2",
          requirement: "Audit criteria and scope defined for each audit.",
          guidance: "Check the mission letter or audit plan.",
        },
        {
          clause: "9.2.2",
          requirement: "Auditors selected to ensure objectivity and impartiality of the process.",
          guidance: "Check no auditor audits their own work.",
        },
        {
          clause: "9.2.2",
          requirement: "Results reported to relevant managers, workers and their representatives.",
          guidance: "Evidence: report distribution, committee minutes.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Action taken to address nonconformities and continually improve performance.",
          guidance: "Cross-check audit findings with the action plan.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Documented information retained as evidence of the audit programme and results.",
          guidance: "Check archiving of reports and evidence.",
        },
        {
          clause: "9.3",
          requirement: "Management review conducted at planned intervals by top management.",
          guidance: "Check senior leaders actually attend, not just HSE.",
        },
        {
          clause: "9.3",
          requirement: "Input: status of actions from previous management reviews.",
          guidance: "Look for line-by-line follow-up of previous decisions.",
        },
        {
          clause: "9.3",
          requirement:
            "Input: changes in external and internal issues, including legal requirements, risks and opportunities.",
          guidance: "Cross-check with 4.1 and the risk register.",
        },
        {
          clause: "9.3",
          requirement: "Input: extent to which the OH&S policy and objectives have been met.",
          guidance: "Check the quantified comparison against targets.",
        },
        {
          clause: "9.3",
          requirement:
            "Input: performance information — incidents, nonconformities, monitoring, legal compliance, audits, consultation, risks.",
          guidance: "Check all required topics are present.",
        },
        {
          clause: "9.3",
          requirement: "Input: adequacy of resources for maintaining an effective system.",
          guidance: "Look for a resource decision coming out of the review.",
        },
        {
          clause: "9.3",
          requirement:
            "Input: relevant communications from interested parties, including complaints.",
          guidance: "Neighbour complaints, customer requests, inspectorate remarks.",
        },
        {
          clause: "9.3",
          requirement: "Input: opportunities for continual improvement identified.",
          guidance: "Cross-check with 6.1.2.3 and worker suggestions.",
        },
        {
          clause: "9.3",
          requirement:
            "Output: conclusions on the suitability, adequacy and effectiveness of the system.",
          guidance: "A review without an explicit conclusion is a nonconformity.",
        },
        {
          clause: "9.3",
          requirement:
            "Output: decisions on improvement directions, changes, resources and needed actions.",
          guidance: "Check each decision has an owner and a due date.",
        },
        {
          clause: "9.3",
          requirement:
            "Output: opportunities for integration with other business processes and implications for strategic direction.",
          guidance: "Look for the link with the strategic plan.",
        },
        {
          clause: "9.3",
          requirement:
            "Relevant review results communicated to workers and their representatives, and documented information retained.",
          guidance: "Check actual distribution beyond the management committee.",
        },
      ],
    },
    {
      chapter: "10. Improvement",
      items: [
        {
          clause: "10.1",
          requirement:
            "Opportunities for improvement determined and necessary actions implemented to achieve intended outcomes.",
          guidance:
            "Cross-check improvement sources (audits, incidents, suggestions) with actions taken.",
        },
        {
          clause: "10.2",
          requirement:
            "Timely reaction to incidents and nonconformities: control, correction and dealing with consequences.",
          guidance: "Check the delays between occurrence, reporting and first action.",
        },
        {
          clause: "10.2",
          requirement:
            "Participation of workers and involvement of relevant interested parties in the investigation.",
          guidance: "Look for worker representatives in accident analyses.",
        },
        {
          clause: "10.2",
          requirement: "Need for corrective action evaluated through root-cause analysis.",
          guidance: 'Reject "worker inattention" as a root cause. Evidence: causal tree, 5 whys.',
        },
        {
          clause: "10.2",
          requirement:
            "Determining whether similar incidents or nonconformities exist or could occur elsewhere.",
          guidance: "Check actions are extended to other sites or lines.",
        },
        {
          clause: "10.2",
          requirement:
            "OH&S risks relating to new or changed hazards assessed before taking action.",
          guidance: "Cross-check with the risk assessment update.",
        },
        {
          clause: "10.2",
          requirement: "Existing controls reviewed against the hierarchy of controls.",
          guidance: "Check the response is not just adding another instruction.",
        },
        {
          clause: "10.2",
          requirement: "Corrective actions implemented and their effectiveness reviewed.",
          guidance: "Look for a delayed effectiveness review, not mere closure.",
        },
        {
          clause: "10.2",
          requirement: "Changes made to the management system where necessary.",
          guidance: "Procedures, training and risk assessment updated after the event.",
        },
        {
          clause: "10.2",
          requirement:
            "Documented information on incidents, nonconformities, actions and results retained and communicated.",
          guidance: "Check the incident register and its communication to workers.",
        },
        {
          clause: "10.3",
          requirement: "OH&S performance continually improved.",
          guidance: "Analyse indicator trends over three years.",
        },
        {
          clause: "10.3",
          requirement: "A culture that supports the management system promoted.",
          guidance: "Look for concrete actions, not just slogans.",
        },
        {
          clause: "10.3",
          requirement:
            "Participation of workers in implementing continual improvement actions promoted.",
          guidance: "Cross-check with 5.4 and the number of suggestions handled.",
        },
        {
          clause: "10.3",
          requirement:
            "Results of continual improvement communicated to workers and their representatives.",
          guidance: "Check communication materials and their frequency.",
        },
        {
          clause: "10.3",
          requirement: "Documented information retained as evidence of continual improvement.",
          guidance: "Check traceability of closed actions and their benefits.",
        },
      ],
    },
  ],
};

export const enIso19011Checklist: ChecklistTemplate = {
  id: "iso-19011",
  title: "ISO 19011:2026 audit conduct",
  standard: "ISO 19011:2026",
  description:
    "Step-by-step checklist of the audit programme and of conducting an audit, from initiation to follow-up.",
  sections: [
    {
      chapter: "Programme and initiation",
      items: [
        {
          clause: "5.1",
          requirement:
            "Audit programme objectives established and consistent with the client's strategic direction.",
          guidance: "Ask what the programme is meant to deliver beyond keeping the certificate.",
        },
        {
          clause: "5.2",
          requirement: "Risks and opportunities of the audit programme determined and addressed.",
          guidance: "Resource availability, competence, site access, confidentiality.",
        },
        {
          clause: "5.3",
          requirement:
            "Audit programme established: extent, schedule, methods, resources and criteria.",
          guidance: "Evidence: approved and distributed annual programme.",
        },
        {
          clause: "5.4",
          requirement: "Roles and responsibilities of the person managing the programme defined.",
          guidance: "Check that person's competence, not just their appointment.",
        },
        {
          clause: "5.4",
          requirement:
            "Programme resources determined: time, travel, tools, remote audit technology.",
          guidance: "An unresourced programme is a fictional programme.",
        },
        {
          clause: "6.2",
          requirement: "Audit initiated with defined and agreed objectives, scope and criteria.",
          guidance: "Evidence: mission letter or audit initiation form.",
        },
        {
          clause: "6.2",
          requirement:
            "Audit feasibility determined: sufficient information, cooperation, time and resources.",
          guidance: "Look for a record of the feasibility decision.",
        },
        {
          clause: "6.2",
          requirement:
            "Contact established with the auditee: arrangements, confidentiality, access and safety confirmed.",
          guidance: "Check agreement on guides and observers.",
        },
      ],
    },
    {
      chapter: "Audit preparation",
      items: [
        {
          clause: "6.3.1",
          requirement:
            "Review of relevant documented information performed before the on-site audit.",
          guidance: "Check the auditor knows the system before arriving.",
        },
        {
          clause: "6.3.1",
          requirement:
            "Adequacy and sufficiency of documented information evaluated against the audit criteria.",
          guidance: "Insufficient documentation can justify postponing the audit.",
        },
        {
          clause: "6.3.2",
          requirement:
            "Audit plan established: objectives, scope, criteria, dates, locations, timings and roles.",
          guidance: "Evidence: audit plan issued and accepted by the auditee.",
        },
        {
          clause: "6.3.2",
          requirement: "Audit plan risk-based and adapted to the auditee's size and complexity.",
          guidance: "Check enough time is allocated to critical processes.",
        },
        {
          clause: "6.3.2",
          requirement: "Audit methods selected: on-site, remote, interactive or non-interactive.",
          guidance: "Justify the use of remote auditing and its limits.",
        },
        {
          clause: "6.3.3",
          requirement:
            "Work assigned within the audit team according to competence and impartiality.",
          guidance: "Check each auditor's impartiality declaration.",
        },
        {
          clause: "6.3.4",
          requirement: "Working documents prepared: checklists, sampling plans, finding forms.",
          guidance: "A rigid checklist must not prevent following a lead.",
        },
        {
          clause: "6.3.4",
          requirement: "Sampling plan defined and justified.",
          guidance: "Ask for the sample size and selection rationale.",
        },
      ],
    },
    {
      chapter: "Conducting the audit",
      items: [
        {
          clause: "6.4.2",
          requirement: "Roles of guides and observers assigned and rules of conduct agreed.",
          guidance: "The guide must not answer on the auditee's behalf.",
        },
        {
          clause: "6.4.3",
          requirement:
            "Opening meeting held: plan, methods, communication channels, safety and confidentiality confirmed.",
          guidance: "Evidence: attendance sheet and minutes.",
        },
        {
          clause: "6.4.4",
          requirement:
            "Communication within the team and with the auditee maintained during the audit.",
          guidance: "Daily briefings, immediate alert if imminent risk is seen.",
        },
        {
          clause: "6.4.5",
          requirement:
            "Availability of and access to information managed, including for remote activities.",
          guidance: "Check actual access to the planned systems and areas.",
        },
        {
          clause: "6.4.6",
          requirement:
            "Information collected by appropriate sampling, then verified before being accepted as evidence.",
          guidance: "An unverified statement is not audit evidence.",
        },
        {
          clause: "6.4.6",
          requirement:
            "Audit evidence obtained through interviews, observation and document review, and recorded.",
          guidance: "Look for triangulation across the three sources.",
        },
        {
          clause: "6.4.7",
          requirement:
            "Audit findings determined by evaluating evidence against the audit criteria.",
          guidance: "A finding without a requirement reference is not acceptable.",
        },
        {
          clause: "6.4.7",
          requirement:
            "Conformities, nonconformities and opportunities for improvement distinguished and graded.",
          guidance: "Check the consistency of major/minor grading.",
        },
        {
          clause: "6.4.7",
          requirement:
            "Nonconformities reviewed with the auditee to acknowledge the evidence, before conclusion.",
          guidance: "The auditee must acknowledge the facts, not necessarily the grading.",
        },
        {
          clause: "6.4.8",
          requirement:
            "Audit conclusions prepared by the team: system capability, achievement of objectives, ability to improve.",
          guidance: "Look for a conclusion on effectiveness, not just a count of nonconformities.",
        },
        {
          clause: "6.4.9",
          requirement:
            "Closing meeting held: findings and conclusions presented, follow-up schedule, divergences addressed.",
          guidance: "Evidence: signed minutes and distribution list.",
        },
      ],
    },
    {
      chapter: "Report and follow-up",
      items: [
        {
          clause: "6.5",
          requirement:
            "Audit report complete, accurate, concise and clear, covering objectives, scope, criteria, findings and conclusions.",
          guidance: "Check each finding is traceable to evidence.",
        },
        {
          clause: "6.5",
          requirement: "Report identifying the audit team, people met, dates and locations.",
          guidance: "Check the mandatory identification elements are present.",
        },
        {
          clause: "6.5",
          requirement:
            "Audit limitations, obstacles encountered and objectives not achieved stated.",
          guidance: "Areas not audited, denied access, key people unavailable.",
        },
        {
          clause: "6.6",
          requirement:
            "Report distributed within the agreed timeframe, to intended recipients, respecting confidentiality.",
          guidance: "Check the issue date against the committed lead time.",
        },
        {
          clause: "6.6",
          requirement:
            "Audit formally completed when all planned activities have been carried out.",
          guidance: "Evidence: closure statement and archived audit file.",
        },
        {
          clause: "6.7",
          requirement:
            "Auditee corrections and corrective actions submitted, reviewed and accepted within the agreed timeframe.",
          guidance: "Check the relevance of the proposed cause analysis.",
        },
        {
          clause: "6.7",
          requirement:
            "Effectiveness of actions verified, where appropriate during a subsequent audit.",
          guidance: "Look for verification evidence, not just the promise of action.",
        },
        {
          clause: "7",
          requirement:
            "Auditor competence evaluated and maintained, including through continuing professional development.",
          guidance: "Cross-check with the continuing professional development log.",
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
          requirement:
            "Context, interested parties and relevant requirements determined and monitored.",
          guidance: "Evidence: context analysis, management review.",
        },
        {
          clause: "4.4",
          requirement:
            "QMS processes determined with inputs, outputs, sequence, criteria and indicators.",
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
          requirement:
            "Risks and opportunities identified and actions integrated into the processes.",
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
          requirement:
            "Requirements for products and services determined and reviewed before commitment.",
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
          requirement:
            "Internal audits performed per programme and a complete management review held.",
          guidance: "Evidence: audit programme, review minutes.",
        },
        {
          clause: "10.2",
          requirement:
            "Nonconformities handled with root cause analysis and effective corrective actions.",
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
          requirement:
            "Environmental policy committing to protection of the environment and compliance.",
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
          requirement:
            "Risk assessments and treatments performed at planned intervals and after change.",
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
