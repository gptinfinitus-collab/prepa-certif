/**
 * Sample interview questions per checklist chapter (English version).
 *
 * Written in our own words: no literal extract of the standards.
 * First key: template id. Second key: exact chapter label of the template.
 */
import type { ChapterQuestionMap } from "./audit-chapter-questions";

export const enAuditChapterQuestions: ChapterQuestionMap = {
  "iso-45001": {
    "4. Context of the organization": [
      "How did you identify the internal and external issues that affect occupational health and safety?",
      "Who took part in that analysis, and when was it last reviewed?",
      "How were the effects of climate change considered in that analysis?",
      "Which interested parties did you retain, and which of their expectations became obligations for you?",
      "Show me the scope of the system: what did you include, what did you exclude and why?",
    ],
    "5. Leadership and worker participation": [
      "How does top management demonstrate its OH&S commitment in practice, day to day?",
      "How was the OH&S policy communicated, and what do workers remember of it?",
      "Who is responsible for what in OH&S? Show me how those roles are formalised.",
      "How do non-managerial workers take part in decisions that affect them?",
      "Which barriers to participation did you identify, and how did you remove them?",
    ],
    "6. Planning": [
      "How do you identify hazards, including those linked to work organisation and emergency situations?",
      "Show me how a recently identified hazard was assessed and then treated.",
      "How do you keep the list of your compliance obligations up to date?",
      "What are this year's OH&S objectives, and how are they turned into action plans?",
      "How are changes (new process, new equipment) planned from an OH&S standpoint?",
    ],
    "7. Support": [
      "What resources were allocated to OH&S this year? Show me one arbitration decision.",
      "How do you determine the competence needed per role, and how do you verify it?",
      "How is a new joiner or agency worker made aware before starting work?",
      "How does OH&S information flow, both ways, with contractors?",
      "How do you control versions and access to system documents?",
    ],
    "8. Operation": [
      "Show me how the hierarchy of controls is applied to a specific risk.",
      "How do you control activities carried out by contractors or service providers?",
      "How is OH&S taken into account in procurement and design?",
      "Which emergency scenarios did you identify, and when was the last drill?",
      "What did you learn from the last drill and what did you change afterwards?",
    ],
    "9. Performance evaluation": [
      "Which indicators do you monitor, and why those?",
      "How do you periodically evaluate compliance with your obligations?",
      "Show me the internal audit programme and the auditors' competence.",
      "How do audit results reach top management?",
      "What concrete decisions came out of the last management review?",
    ],
    "10. Improvement": [
      "Walk me through a recent incident, from reporting to closure.",
      "How do you look for root causes rather than immediate causes?",
      "How do you verify the effectiveness of corrective actions over time?",
      "Which improvements came from workers' suggestions?",
      "How do you measure that the system improves year on year?",
    ],
  },
  "iso-19011": {
    "Programme and initiation": [
      "What did you base the audit programme objectives on?",
      "How were programme risks and opportunities considered?",
      "How do you decide the extent and frequency of audits?",
      "How is initial contact with the auditee established?",
    ],
    "Audit preparation": [
      "How did you build the audit team and verify its competence?",
      "Show me the document review carried out before the audit.",
      "How was the audit plan built and agreed with the auditee?",
      "Which sampling method did you choose, and why?",
    ],
    "Conducting the audit": [
      "How does the opening meeting run, and what do you announce there?",
      "How do you collect and verify the information gathered?",
      "How do you distinguish an audit finding from a mere observation?",
      "How do you handle a disagreement with the auditee during the audit?",
    ],
    "Report and follow-up": [
      "How are conclusions worded and supported?",
      "Within what timeframe is the report issued, and to whom?",
      "How is follow-up of audit actions ensured?",
      "How do you evaluate auditor and programme performance?",
    ],
  },
  "iso-9001": {
    "4-5. Context and leadership": [
      "How do context and interested parties shape your quality system?",
      "Show me your process map and the interactions between processes.",
      "How does top management demonstrate leadership on quality?",
      "How does customer focus translate into your decisions?",
    ],
    "6-7. Planning and support": [
      "How do you identify and address risks and opportunities?",
      "What are your quality objectives and how is achievement tracked?",
      "How do you manage competence and authorisations?",
      "How do you control your monitoring and measuring resources?",
    ],
    "8. Operation": [
      "How do you review customer requirements before accepting an order?",
      "How do you control external providers and suppliers?",
      "Show me the traceability of a recent product or service.",
      "How do you handle a nonconformity detected in production?",
    ],
    "9-10. Performance and improvement": [
      "How do you measure customer satisfaction, and what do you do with it?",
      "Show me the internal audit programme and its results.",
      "What decisions came out of the last management review?",
      "How do you verify the effectiveness of corrective actions?",
    ],
  },
  "iso-14001": {
    "4-5. Context and leadership": [
      "Which external and internal environmental issues did you retain?",
      "How are the expectations of neighbours and authorities taken into account?",
      "How does top management carry the environmental policy?",
      "What scope did you define, and why?",
    ],
    "6. Planning": [
      "How do you identify your environmental aspects and their significance?",
      "Show me how the life cycle perspective is reflected in that analysis.",
      "How do you list your regulatory compliance obligations?",
      "Which environmental objectives did you set, and with what resources?",
    ],
    "7-8. Support and operation": [
      "How are people whose work has an environmental impact trained?",
      "How do you control high-impact operations and external providers?",
      "Which environmental emergency situations did you identify?",
      "When was the last drill and what did you learn from it?",
    ],
    "9-10. Performance and improvement": [
      "Which environmental indicators do you monitor, and how often?",
      "How do you periodically evaluate regulatory compliance?",
      "How are environmental nonconformities handled through to closure?",
      "Which concrete improvements were achieved this year?",
    ],
  },
  "iso-27001": {
    "4-6. ISMS framework": [
      "How was the scope of the information security management system defined?",
      "How do you identify and assess information security risks?",
      "Show me the statement of applicability and its justifications.",
      "How is the risk treatment plan approved and followed up?",
    ],
    "7-8. Support and operation": [
      "How do you raise staff awareness of information security?",
      "How are changes assessed from a security standpoint?",
      "How are supplier-related risks controlled?",
      "How often are risks reassessed?",
    ],
    "Annex A (controls)": [
      "How are access rights granted, reviewed and revoked?",
      "Show me how backups are tested and restored.",
      "How do you detect and log security events?",
      "How is physical security of sensitive areas ensured?",
    ],
    "9-10. Performance and improvement": [
      "Which security indicators do you monitor and how are they used?",
      "Show me the internal audit programme for the security system.",
      "How was a recent security incident handled?",
      "Which improvements came from the last management review?",
    ],
  },
};
