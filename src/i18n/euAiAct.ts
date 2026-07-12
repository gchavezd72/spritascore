import type { Locale } from "@/types/calculator";
import {
  CLASS_QUESTIONS,
  READINESS_CONTROLS,
  type ClassificationStage,
  type ClassAnswerId,
  type ReadinessAnswerId,
  type ReadinessDomain,
  type ReadinessLevel,
  type EvidenceBand,
  type ConfidenceLevel,
  type ClassificationVerdict,
  type OperatorRole,
  type AnnexIIIArea,
  type ObligationStatus,
  type ComplementaryAssessment,
  type GapPriority,
} from "@/data/euAiAct";

export { EU_AI_ACT_ROUTES } from "@/data/euAiAct";

export type EuAiActCopy = {
  meta: {
    title: string;
    description: string;
    ogDescription: string;
    h1: string;
    kicker: string;
    subtitle: string;
    intro: string;
    regNote: string;
    privacyWarning: string;
    trustLine: string;
    brandLine: string;
    privacy: string;
  };
  stages: Record<ClassificationStage, string>;
  readinessStage: string;
  classQuestions: Record<string, string>;
  classAnswers: Record<ClassAnswerId, string>;
  areaQuestion: string;
  areas: Record<AnnexIIIArea, string>;
  domains: Record<ReadinessDomain, string>;
  domainOwners: Record<ReadinessDomain, string>;
  controls: Record<string, string>;
  readinessAnswers: Record<ReadinessAnswerId, string>;
  verdicts: Record<ClassificationVerdict, { label: string; description: string }>;
  roles: Record<OperatorRole, string>;
  notes: Record<string, string>;
  confidence: Record<ConfidenceLevel, { label: string; description: string }>;
  confidenceReasons: Record<string, string>;
  levels: Record<ReadinessLevel, { label: string; interpretation: string }>;
  evidenceBands: Record<EvidenceBand, string>;
  capReasons: Record<string, string>;
  obligations: Record<string, string>;
  obligationStatus: Record<ObligationStatus, string>;
  complementary: Record<ComplementaryAssessment, string>;
  gapPriorities: Record<GapPriority, string>;
  gaps: Record<string, string>;
  warnings: Record<string, string>;
  ui: {
    stageProgress: string;
    complete: string;
    engineA: string;
    engineB: string;
    classificationTitle: string;
    classificationDescription: string;
    readinessTitle: string;
    readinessDescription: string;
    back: string;
    next: string;
    seeResults: string;
    yourResults: string;
    classificationHeading: string;
    primaryClassification: string;
    otherFlags: string;
    detectedRoles: string;
    confidenceLabel: string;
    obligationsHeading: string;
    nextDate: string;
    noObligations: string;
    readinessHeading: string;
    readinessScore: string;
    evidenceCoverage: string;
    domainBreakdown: string;
    notAssessed: string;
    cappedNote: string;
    criticalGaps: string;
    complementaryHeading: string;
    warningsHeading: string;
    criticalStopTitle: string;
    criticalStopBody: string;
    requestReview: string;
    downloadPdf: string;
    copySummary: string;
    disclaimer: string;
    pdfGenerating: string;
    pdfError: string;
    selectPlaceholder: string;
    of: string;
  };
  form: {
    title: string;
    description: string;
    firstName: string;
    company: string;
    email: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    disposableEmail: string;
    submitError: string;
    privacyPrefix: string;
    privacySuffix: string;
    firstNameRequired: string;
    emailInvalid: string;
    companyRequired: string;
  };
  pdf: {
    subtitle: string;
    executiveSummary: string;
    classification: string;
    detectedRoles: string;
    applicableObligations: string;
    readiness: string;
    evidenceCoverage: string;
    domainResults: string;
    criticalGaps: string;
    remediationPlan: string;
    complementary: string;
    warnings: string;
    scopeLimitations: string;
    scopeLimitationsBody: string;
    colObligation: string;
    colSource: string;
    colDate: string;
    colStatus: string;
    colDomain: string;
    colScore: string;
    colPriority: string;
    colGap: string;
    colOwner: string;
    nextStepsTitle: string;
    nextStepsBody: string;
    contactLine: string;
    reportId: string;
    engineVersion: string;
    assessmentDate: string;
    confidence: string;
    page: string;
    notAssessed: string;
    disclaimer: string;
    filename: string;
  };
};

const EN: EuAiActCopy = {
  meta: {
    title: "EU AI Act Compliance Readiness Assessment | SpritaScore by Sprita iT",
    description:
      "Classify an AI system under the EU AI Act (Regulation (EU) 2024/1689), find out which obligations apply now and later, and measure your compliance readiness with a prioritized action plan. Multilingual, no code upload.",
    ogDescription:
      "Classify your AI system, identify applicable obligations and get a readiness score with a prioritized action plan under the EU AI Act.",
    h1: "EU AI Act Compliance Readiness Assessment",
    kicker: "Regulation (EU) 2024/1689 · SpritaScore by Sprita iT",
    subtitle: "Assess one AI system and one use case. Get a preliminary classification, a readiness score and a prioritized action plan.",
    intro:
      "Discover how your system may be classified under the EU AI Act, which obligations could apply, and which evidence you need to prepare. This tool separates legal classification, applicable obligations, operational readiness, evidence coverage and confidence level.",
    regNote: "Regulatory cut-off: 12 July 2026 · Regulation (EU) 2024/1689, including the Digital Omnibus on AI.",
    privacyWarning:
      "Do not upload personal data, secrets, source code, credentials, model weights or confidential information. Describe your evidence without revealing its content.",
    trustLine: "SpritaScore is a brand of",
    brandLine: "Sprita iT",
    privacy: "Privacy policy",
  },
  stages: {
    scope: "1. Territorial and material scope",
    "ai-definition": "2. Is it an AI system?",
    roles: "3. Roles in the value chain",
    prohibited: "4. Prohibited practices",
    gpai: "5. General-purpose AI models",
    transparency: "6. Transparency obligations (Art. 50)",
    "high-risk-product": "7. High risk by product (Annex I)",
    "high-risk-use": "8. High risk by use (Annex III)",
    exception: "9. Article 6.3 exception",
  },
  readinessStage: "10. Compliance readiness",
  classQuestions: {
    S1: "Does the organization place on the market, put into service or use the AI system in the European Union?",
    S2: "Is the organization that uses the system established or located in the European Union?",
    S3: "Even if the provider or deployer is outside the EU, are the system's outputs used in the European Union?",
    S4: "Is the system used exclusively for military, defence or national-security purposes?",
    S5: "Is the activity exclusively scientific research or pre-market development, with no real-world testing?",
    D1: "Does the system infer, learn, identify patterns or determine how to generate an output (rather than only fixed rules)?",
    D2: "Does it generate predictions, recommendations, decisions, classifications, scores or content?",
    D3: "Can the output influence physical, digital, organizational or human environments?",
    D4: "Does it operate only through explicitly programmed deterministic rules, with no inference or learning?",
    R1: "Does the organization develop the system (or have it developed) and place it on the market under its own name or brand?",
    R2: "Does it use the system under its own authority (not purely personal use)?",
    R3: "Does it import the system from a non-EU country to place it on the EU market?",
    R4: "Does it distribute or resell the system in the EU without being its provider or importer?",
    R5: "Does it integrate the system into a product it markets under its own brand?",
    R6: "Does it integrate a third party's general-purpose AI model into its own system or application?",
    R7: "Has it made a substantial modification, changed the intended purpose, or rebranded the system?",
    P1: "Does it use subliminal, manipulative or deceptive techniques that could materially distort behaviour and cause significant harm?",
    P2: "Does it exploit vulnerabilities related to age, disability or social/economic situation to distort behaviour and cause harm?",
    P3: "Does it perform social scoring leading to detrimental or unjustified treatment of people?",
    P4: "Does it predict the risk of a person committing a crime based solely on profiling or personality traits?",
    P5: "Does it create or expand facial-recognition databases through untargeted scraping of images?",
    P6: "Does it infer emotions of people in the workplace or education, outside permitted medical or safety purposes?",
    P7: "Does it categorize people from biometric data to infer race, political opinions, religion, sexual orientation, etc.?",
    P8: "Is it used for real-time remote biometric identification in publicly accessible spaces for law-enforcement purposes?",
    P9: "Does it generate or manipulate intimate or sexual content of real people without their consent?",
    P10: "Is it designed or usable to generate child sexual abuse material?",
    G1: "Does the organization develop (or commission) a general-purpose AI model with significant generality, usable across many tasks or systems?",
    G2: "Is the model provided to third parties to be integrated into applications or systems?",
    G3: "Does the training compute exceed the regulatory threshold, or has the Commission designated it as having systemic risk?",
    T1: "Does the system interact directly with people?",
    T2: "Does it generate or manipulate synthetic audio, image, video or text?",
    T3: "Does it use emotion recognition or biometric categorization?",
    T4: "Does it generate deepfakes that could appear authentic?",
    HP1: "Is the system a product (or a safety component of a product) covered by EU harmonized legislation (e.g. machinery, medical devices, toys, motor vehicles)?",
    HP2: "Does that sectoral legislation require a third-party conformity assessment?",
    HU1: "Does the output materially influence a decision about people?",
    HU2: "Does that decision affect a person's rights, access, opportunities, safety or conditions?",
    HU3: "Is profiling of natural persons performed?",
    EX1: "Does it perform only a narrow procedural, preparatory or improvement task, without replacing human assessment?",
    EX2: "Is there a genuine, competent and documented human review?",
    EX3: "Could it create a significant risk to health, safety or fundamental rights?",
    EX4: "Is there a documented assessment justifying the Article 6.3 exception?",
  },
  classAnswers: { yes: "Yes", no: "No", not_sure: "Don't know", na: "Not applicable" },
  areaQuestion: "If it may be high-risk by use, which Annex III area best matches the system's intended purpose?",
  areas: {
    none: "None / not applicable",
    biometrics: "Biometrics",
    "critical-infrastructure": "Critical infrastructure",
    education: "Education and vocational training",
    employment: "Employment and worker management",
    "essential-services": "Essential private/public services (credit, insurance)",
    "law-enforcement": "Law enforcement",
    migration: "Migration, asylum and border control",
    "justice-democracy": "Administration of justice and democratic processes",
  },
  domains: {
    "governance-qms": "Governance and quality management system",
    "risk-management": "Risk management",
    "data-governance": "Data and data governance",
    "technical-documentation": "Technical documentation and traceability",
    "transparency-instructions": "Transparency and instructions for use",
    "human-oversight": "Human oversight",
    "accuracy-robustness-security": "Accuracy, robustness and cybersecurity",
    "conformity-registration": "Conformity assessment and registration",
    "post-market-incidents": "Post-market monitoring and incidents",
    "ai-literacy": "AI literacy",
  },
  domainOwners: {
    "governance-qms": "AI governance lead / CISO",
    "risk-management": "Risk management",
    "data-governance": "Data / ML engineering",
    "technical-documentation": "Product / engineering",
    "transparency-instructions": "Product / legal",
    "human-oversight": "Operations / business owner",
    "accuracy-robustness-security": "Security / ML engineering",
    "conformity-registration": "Legal / regulatory",
    "post-market-incidents": "Operations / support",
    "ai-literacy": "People / training",
  },
  controls: {
    GOV1: "A documented quality management system covers development, testing, changes, incidents and regulatory communications.",
    GOV2: "An approved AI governance policy exists with an accountable regulatory owner and a pre-production approval process.",
    RISK1: "A continuous risk-management process runs across the whole lifecycle.",
    RISK2: "Reasonably foreseeable misuse and impacts on vulnerable groups are analysed and residual risk is documented.",
    DATA1: "Data provenance, selection criteria, relevance and representativeness are documented.",
    DATA2: "Bias is identified and performance is evaluated across relevant groups.",
    DOC1: "Technical documentation is maintained per Annex IV (purpose, architecture, data, capabilities, limitations).",
    DOC2: "The system generates logs and versioning that allow relevant events to be reconstructed.",
    TRANS1: "Clear instructions for use identify the provider, intended purpose, accuracy, limitations and human oversight.",
    TRANS2: "Affected people are informed of AI interaction, synthetic content, emotion recognition or deepfakes as applicable.",
    HUM1: "Human oversight is defined with people who can intervene, override the output and stop the system.",
    HUM2: "Those people are competent, trained and have workload that allows genuine review.",
    SEC1: "Accuracy metrics and minimum performance thresholds are defined and tested before deployment.",
    SEC2: "Adversarial, robustness and cybersecurity testing protects the model, weights, artifacts and dependencies.",
    CONF1: "The conformity-assessment route and applicable harmonized standards have been determined.",
    CONF2: "The EU declaration of conformity, CE marking and EU database registration are planned or completed.",
    POST1: "A post-market monitoring plan collects real performance data and deployer feedback.",
    POST2: "A serious-incident reporting process with regulatory deadlines exists.",
    LIT1: "An AI-literacy program is in place for staff, adapted to their role and the affected people.",
  },
  readinessAnswers: {
    implemented_evidence: "Implemented, with verifiable evidence",
    implemented_no_evidence: "Implemented, no evidence available",
    partial: "Partially implemented",
    planned: "Planned",
    not_implemented: "Not implemented",
    not_sure: "Don't know",
    na: "Not applicable",
  },
  verdicts: {
    "out-of-scope": {
      label: "Likely out of territorial scope",
      description: "The system does not appear to be placed on the market, put into service or used in the EU, and its outputs are not used in the EU. Validate before relying on this.",
    },
    "not-ai-system": {
      label: "Possibly not an AI system",
      description: "The system appears to run on explicitly programmed deterministic rules without inference. Technical and legal review is recommended before excluding it.",
    },
    "manual-review": {
      label: "Manual review required",
      description: "The information provided is not enough to determine the classification. Validate the intended purpose, technical operation and roles.",
    },
    prohibited: {
      label: "Possible prohibited practice",
      description: "The described use may fall under a prohibited practice (Art. 5). The system must not be presented as partially compliant. Suspend deployment and obtain specialized legal review.",
    },
    "high-risk-annex-i": {
      label: "High-risk system — Annex I (Art. 6.1)",
      description: "The system is, or is a safety component of, a regulated product requiring third-party conformity assessment. Provider high-risk obligations apply.",
    },
    "high-risk-annex-iii": {
      label: "High-risk system — Annex III (Art. 6.2)",
      description: "The intended use falls within a high-risk Annex III area and materially influences decisions about people. High-risk provider and deployer obligations apply.",
    },
    "possible-6-3-exception": {
      label: "Possible Article 6.3 exception",
      description: "The system sits in an Annex III area but may not be high-risk because it performs a narrow task without materially influencing decisions. Document and preserve this assessment.",
    },
    "gpai-systemic": {
      label: "General-purpose AI model with systemic risk",
      description: "The model shows high-impact capabilities or exceeds the compute threshold. Additional evaluation, incident and cybersecurity obligations apply.",
    },
    gpai: {
      label: "General-purpose AI model",
      description: "The model has significant generality and can be used across many systems. Technical documentation and downstream-provider information obligations apply.",
    },
    transparency: {
      label: "Transparency obligations (Art. 50)",
      description: "The system interacts with people or generates synthetic content, so transparency and labelling obligations apply. Not necessarily high-risk.",
    },
    "limited-minimal": {
      label: "Limited or minimal risk",
      description: "No prohibited practice, high-risk use or specific transparency obligation was identified. Good practice and AI literacy still apply.",
    },
  },
  roles: {
    provider: "Provider",
    deployer: "Deployer",
    importer: "Importer",
    distributor: "Distributor",
    "product-manufacturer": "Product manufacturer",
    "gpai-downstream": "Downstream provider (integrates a GPAI model)",
  },
  notes: {
    "out-of-scope": "Territorial scope: the system does not appear to be placed on the EU market or used in the EU.",
    military: "Possible exclusion for exclusively military, defence or national-security use — validate it applies strictly.",
    rnd: "Pre-market research and development may be out of scope, but not once there is real-world testing or the system is put into service.",
    "not-ai": "The system may fall outside the AI-system definition; do not conclude with certainty without technical documentation.",
    "manual-review": "Some answers do not allow a definitive classification. This is a provisional classification.",
  },
  confidence: {
    high: { label: "High", description: "No unknown answers affect the classification and the intended purpose and roles are clear." },
    medium: { label: "Medium", description: "Some uncertainties exist but they do not directly affect prohibited practices or the main classification." },
    low: { label: "Low", description: "There are unknown answers in prohibited practices or high-risk classification, or over 20% of answers are unknown." },
  },
  confidenceReasons: {
    "many-unknowns": "Over 20% of applicable answers are unknown.",
    "some-unknowns": "Between 5% and 20% of applicable answers are unknown.",
    "critical-unknown": "There are unknown answers in prohibited practices or high-risk classification.",
    "manual-review": "Some classification questions could not be answered definitively.",
  },
  levels: {
    critical: { label: "Critical", interpretation: "There is no sufficient control base." },
    initial: { label: "Initial", interpretation: "Isolated actions exist, but not a demonstrable program." },
    developing: { label: "Developing", interpretation: "Partial controls exist with relevant gaps." },
    managed: { label: "Managed", interpretation: "A structured program exists, although gaps remain." },
    advanced: { label: "Advanced", interpretation: "Most obligations are covered and documented." },
    "review-ready": { label: "Ready for compliance review", interpretation: "Controls and evidence are broadly available." },
  },
  evidenceBands: {
    insufficient: "Insufficient evidence",
    fragmented: "Fragmented evidence",
    moderate: "Moderate evidence",
    solid: "Solid evidence",
    prepared: "Broadly prepared file",
  },
  capReasons: {
    "cap-qms": "No quality management system for a high-risk provider (score capped at 49).",
    "cap-risk": "No risk-management process (score capped at 49).",
    "cap-doc": "No technical documentation (score capped at 49).",
    "cap-conformity": "Mandatory conformity assessment not started (score capped at 49).",
    "cap-human": "No effective human oversight (score capped at 59).",
    "cap-security": "No cybersecurity controls or testing (score capped at 59).",
  },
  obligations: {
    prohibited: "Prohibition of unacceptable-risk practices",
    "ai-literacy": "AI literacy obligation",
    gpai: "General-purpose AI model obligations",
    transparency: "Transparency obligations (Art. 50)",
    "high-risk-annex-iii": "High-risk obligations — Annex III systems",
    "high-risk-annex-i": "High-risk obligations — products under sectoral legislation",
  },
  obligationStatus: {
    "in-force": "In force",
    transition: "In force with transition period",
    future: "Future obligation",
  },
  complementary: {
    "gdpr-dpia": "GDPR and Data Protection Impact Assessment (DPIA)",
    fria: "Fundamental Rights Impact Assessment (FRIA)",
    nis2: "NIS2 (network and information security)",
    dora: "DORA (digital operational resilience — finance)",
    cra: "Cyber Resilience Act",
    "medical-devices": "Medical devices regulation",
    "sector-safety": "Sectoral product-safety legislation",
  },
  gapPriorities: {
    P0: "P0 — Immediate suspension or review",
    P1: "P1 — Before placing on market or using",
    P2: "P2 — Next 30–90 days",
    P3: "P3 — Continuous improvement",
  },
  gaps: {
    "prohibited-practice": "A possible prohibited practice was identified — suspend deployment and obtain legal review.",
    "high-risk-no-basis": "High-risk use without a determined conformity-assessment route or legal basis.",
    "no-human-oversight": "No effective human oversight is defined for the system.",
    "role-change": "A change of role may turn the organization into a provider — reassess obligations.",
    "classification-undocumented": "The high-risk classification is not documented — record the rationale and evidence.",
    "no-risk-management": "No lifecycle risk-management process is in place.",
    "no-technical-documentation": "No technical documentation exists per Annex IV.",
    "no-qms": "No quality management system exists.",
    "registration-pending": "EU declaration of conformity, CE marking or database registration is pending.",
    "fria-required": "A Fundamental Rights Impact Assessment (FRIA) is likely required and not completed.",
    "insufficient-security": "Cybersecurity controls, accuracy thresholds or testing are insufficient.",
    "accuracy-metrics": "Accuracy metrics and robustness testing are incomplete.",
    "data-governance": "Data governance, provenance and bias evaluation are incomplete.",
    "incident-management": "Post-market monitoring and serious-incident processes are incomplete.",
    instructions: "Instructions for use and transparency information are insufficient.",
    "ai-literacy": "AI-literacy training is incomplete for staff.",
    monitoring: "Continuous monitoring and periodic review should be strengthened.",
  },
  warnings: {
    "role-change": "Possible change of regulatory role (e.g. becoming a provider).",
    "legal-review": "Specialized legal review recommended before regulatory decisions.",
    dpia: "A GDPR Data Protection Impact Assessment (DPIA) is likely needed.",
    fria: "A Fundamental Rights Impact Assessment (FRIA) may be required.",
    "sector-review": "Sectoral product-safety review may apply.",
    registration: "Registration in the EU database may be required.",
    conformity: "A conformity assessment may be required before market placement.",
  },
  ui: {
    stageProgress: "Stage {current} of {total}",
    complete: "{percent}% complete",
    engineA: "Classification",
    engineB: "Readiness",
    classificationTitle: "Legal classification",
    classificationDescription: "Answer about scope, roles and risk. \"Don't know\" is never treated as \"No\".",
    readinessTitle: "Compliance readiness",
    readinessDescription: "Rate the maturity and evidence of each control. Do not upload confidential content.",
    back: "Back",
    next: "Next",
    seeResults: "See my results",
    yourResults: "Your results",
    classificationHeading: "Regulatory classification",
    primaryClassification: "Preliminary classification",
    otherFlags: "Other applicable classifications",
    detectedRoles: "Detected roles",
    confidenceLabel: "Confidence level",
    obligationsHeading: "Applicable obligations and timeline",
    nextDate: "Next relevant date",
    noObligations: "No specific obligations were mapped for this classification beyond baseline duties.",
    readinessHeading: "Compliance readiness",
    readinessScore: "Readiness score",
    evidenceCoverage: "Evidence coverage",
    domainBreakdown: "Readiness by domain",
    notAssessed: "Not assessed",
    cappedNote: "Score capped due to missing critical controls:",
    criticalGaps: "Critical gaps and prioritized action plan",
    complementaryHeading: "Complementary assessments to consider",
    warningsHeading: "Warnings",
    criticalStopTitle: "Critical alert: possible prohibited practice",
    criticalStopBody:
      "The described use may fall under a prohibited practice of the EU AI Act. The system must not be presented as partially compliant and no readiness score is calculated. Suspend deployment or expansion until you obtain a specialized legal assessment. No control can compensate for a prohibited practice.",
    requestReview: "Request a technical and regulatory review",
    downloadPdf: "Download PDF report",
    copySummary: "Copy result summary",
    disclaimer:
      "This tool provides a preliminary assessment of applicability and readiness. It does not constitute legal advice, certification, a declaration of conformity or authorization to place an AI system on the EU market. Results must be validated by qualified technical and legal professionals.",
    pdfGenerating: "Generating PDF…",
    pdfError: "Could not generate the PDF. Please try again or use Print to PDF from your browser.",
    selectPlaceholder: "Select…",
    of: "of",
  },
  form: {
    title: "Request a technical and regulatory review",
    description: "Receive a validation of your classification, evidence and priorities from a Sprita iT specialist.",
    firstName: "First name",
    company: "Company",
    email: "Business email",
    submit: "Request a review",
    submitting: "Submitting…",
    successTitle: "Thank you — we received your request.",
    successBody: "A Sprita iT specialist will follow up regarding your EU AI Act assessment.",
    disposableEmail: "Please use a business email address.",
    submitError: "Could not submit your request. Please try again or email info@spritascore.com.",
    privacyPrefix: "By submitting, you agree to our ",
    privacySuffix: ". This result is informational and does not constitute legal, regulatory or conformity certification.",
    firstNameRequired: "First name is required",
    emailInvalid: "Enter a valid business email",
    companyRequired: "Company is required",
  },
  pdf: {
    subtitle: "EU AI Act readiness report",
    executiveSummary: "Executive summary",
    classification: "Regulatory classification",
    detectedRoles: "Detected roles",
    applicableObligations: "Applicable obligations and timeline",
    readiness: "Compliance readiness",
    evidenceCoverage: "Evidence coverage",
    domainResults: "Results by domain",
    criticalGaps: "Critical gaps",
    remediationPlan: "Prioritized remediation plan",
    complementary: "Complementary assessments",
    warnings: "Warnings",
    scopeLimitations: "Scope and limitations",
    scopeLimitationsBody:
      "This report assesses one AI system, one version and one intended use. Classification may depend on facts, technical documentation, sectoral legislation, national rules and authority decisions that cannot be determined by an automated questionnaire alone.",
    colObligation: "Obligation",
    colSource: "Legal source",
    colDate: "From",
    colStatus: "Status",
    colDomain: "Domain",
    colScore: "Score",
    colPriority: "Priority",
    colGap: "Gap / action",
    colOwner: "Suggested owner",
    nextStepsTitle: "Recommended next step",
    nextStepsBody:
      "Request a technical and regulatory review from Sprita iT to validate the classification, evidence and priorities before making regulatory decisions.",
    contactLine: "spritascore.com · sprita-it.com · info@spritascore.com",
    reportId: "Report ID",
    engineVersion: "Regulatory engine",
    assessmentDate: "Assessment date",
    confidence: "Confidence",
    page: "Page",
    notAssessed: "Not assessed",
    disclaimer:
      "This tool provides a preliminary assessment of applicability and readiness based on user-provided information and the regulatory version stated in this report. It does not constitute legal advice, certification, a declaration of conformity, an official conformity assessment or authorization to place or use an AI system in the European Union. Results must be validated by qualified technical and legal professionals before making regulatory decisions.",
    filename: "spritascore-eu-ai-act-readiness",
  },
};

const ES: EuAiActCopy = {
  meta: {
    title: "Evaluación de Preparación para el Cumplimiento del EU AI Act | SpritaScore by Sprita iT",
    description:
      "Clasifique un sistema de IA bajo el EU AI Act (Reglamento (UE) 2024/1689), descubra qué obligaciones aplican hoy y en el futuro, y mida su preparación con un plan de acción priorizado. Multiidioma, sin subir código.",
    ogDescription:
      "Clasifique su sistema de IA, identifique obligaciones aplicables y obtenga una puntuación de preparación con un plan de acción priorizado bajo el EU AI Act.",
    h1: "Evaluación de Preparación para el Cumplimiento del EU AI Act",
    kicker: "Reglamento (UE) 2024/1689 · SpritaScore by Sprita iT",
    subtitle: "Evalúe un sistema y un caso de uso específico. Reciba una clasificación preliminar, una puntuación de preparación y un plan de acción priorizado.",
    intro:
      "Descubra cómo puede clasificarse su sistema bajo el EU AI Act, qué obligaciones podrían aplicarle y qué evidencias necesita preparar. Esta herramienta separa la clasificación jurídica, las obligaciones aplicables, la preparación operativa, la cobertura de evidencias y el nivel de confianza.",
    regNote: "Fecha de corte normativo: 12 de julio de 2026 · Reglamento (UE) 2024/1689, incluyendo el Digital Omnibus on AI.",
    privacyWarning:
      "No cargue datos personales, secretos, código fuente, credenciales, pesos de modelos ni información confidencial. Describa las evidencias sin revelar su contenido.",
    trustLine: "SpritaScore es una marca de",
    brandLine: "Sprita iT",
    privacy: "Política de privacidad",
  },
  stages: {
    scope: "1. Ámbito territorial y material",
    "ai-definition": "2. ¿Es un sistema de IA?",
    roles: "3. Funciones en la cadena de valor",
    prohibited: "4. Prácticas prohibidas",
    gpai: "5. Modelos de IA de propósito general",
    transparency: "6. Obligaciones de transparencia (art. 50)",
    "high-risk-product": "7. Alto riesgo por producto (Anexo I)",
    "high-risk-use": "8. Alto riesgo por caso de uso (Anexo III)",
    exception: "9. Excepción del artículo 6.3",
  },
  readinessStage: "10. Preparación para el cumplimiento",
  classQuestions: {
    S1: "¿La organización introduce, comercializa, pone en servicio o utiliza el sistema de IA en la Unión Europea?",
    S2: "¿La organización que utiliza el sistema está establecida o ubicada en la Unión Europea?",
    S3: "Aunque el proveedor o responsable del despliegue esté fuera de la UE, ¿los resultados del sistema se utilizan en la Unión Europea?",
    S4: "¿El sistema se utiliza exclusivamente con fines militares, de defensa o de seguridad nacional?",
    S5: "¿La actividad es exclusivamente investigación científica o desarrollo previo a la comercialización, sin pruebas en condiciones reales?",
    D1: "¿El sistema infiere, aprende, identifica patrones o determina cómo generar una salida (más allá de reglas fijas)?",
    D2: "¿Genera predicciones, recomendaciones, decisiones, clasificaciones, puntuaciones o contenido?",
    D3: "¿La salida puede influir en entornos físicos, digitales, organizacionales o humanos?",
    D4: "¿Funciona únicamente mediante reglas determinísticas explícitamente programadas, sin inferencia ni aprendizaje?",
    R1: "¿La organización desarrolla el sistema (o encarga su desarrollo) y lo comercializa bajo su propio nombre o marca?",
    R2: "¿Utiliza el sistema bajo su propia autoridad (no un uso exclusivamente personal)?",
    R3: "¿Importa el sistema desde un país no perteneciente a la UE para introducirlo en el mercado de la Unión?",
    R4: "¿Distribuye o revende el sistema en la UE sin ser su proveedor ni importador?",
    R5: "¿Integra el sistema como componente de un producto que comercializa bajo su propia marca?",
    R6: "¿Integra un modelo de propósito general de un tercero en su propio sistema o aplicación?",
    R7: "¿Ha efectuado una modificación sustancial, cambiado el propósito previsto o la marca del sistema?",
    P1: "¿Utiliza técnicas subliminales, manipuladoras o engañosas que puedan alterar materialmente la conducta y causar un perjuicio significativo?",
    P2: "¿Explota vulnerabilidades relacionadas con edad, discapacidad o situación social/económica para alterar la conducta y causar daño?",
    P3: "¿Realiza puntuación social que conduce a un trato perjudicial o injustificado de personas?",
    P4: "¿Predice el riesgo de que una persona cometa un delito basándose únicamente en perfilado o rasgos de personalidad?",
    P5: "¿Crea o amplía bases de datos de reconocimiento facial mediante extracción indiscriminada de imágenes?",
    P6: "¿Infiere emociones de personas en el trabajo o la educación, fuera de una finalidad médica o de seguridad permitida?",
    P7: "¿Clasifica personas a partir de datos biométricos para inferir raza, opiniones políticas, religión, orientación sexual, etc.?",
    P8: "¿Se utiliza para identificación biométrica remota en tiempo real en espacios públicos con fines policiales?",
    P9: "¿Genera o manipula contenido íntimo o sexual de personas reales sin su consentimiento?",
    P10: "¿Está diseñado o puede utilizarse para generar material de abuso sexual infantil?",
    G1: "¿La organización desarrolla (o encarga) un modelo de IA de propósito general con generalidad significativa, usable en múltiples tareas o sistemas?",
    G2: "¿El modelo se proporciona a terceros para integrarlo en aplicaciones o sistemas?",
    G3: "¿El cómputo de entrenamiento supera el umbral regulatorio o la Comisión lo ha designado con riesgo sistémico?",
    T1: "¿El sistema interactúa directamente con personas?",
    T2: "¿Genera o manipula audio, imagen, video o texto sintético?",
    T3: "¿Utiliza reconocimiento de emociones o categorización biométrica?",
    T4: "¿Genera deepfakes que podrían parecer auténticos?",
    HP1: "¿El sistema es un producto (o componente de seguridad de un producto) sujeto a legislación armonizada de la UE (p.ej. máquinas, dispositivos médicos, juguetes, automoción)?",
    HP2: "¿Esa legislación sectorial exige una evaluación de conformidad por un tercero?",
    HU1: "¿La salida influye materialmente en una decisión sobre personas?",
    HU2: "¿Esa decisión afecta derechos, acceso, oportunidades, seguridad o condiciones de una persona?",
    HU3: "¿Se realiza perfilado de personas físicas?",
    EX1: "¿Realiza solo una tarea procedimental estrecha, preparatoria o de mejora, sin sustituir la evaluación humana?",
    EX2: "¿Existe una revisión humana real, competente y documentada?",
    EX3: "¿Podría producir un riesgo significativo para la salud, la seguridad o los derechos fundamentales?",
    EX4: "¿Existe una evaluación documentada que justifica la excepción del artículo 6.3?",
  },
  classAnswers: { yes: "Sí", no: "No", not_sure: "No lo sé", na: "No aplica" },
  areaQuestion: "Si puede ser de alto riesgo por su uso, ¿qué área del Anexo III corresponde mejor al propósito previsto del sistema?",
  areas: {
    none: "Ninguna / no aplica",
    biometrics: "Biometría",
    "critical-infrastructure": "Infraestructura crítica",
    education: "Educación y formación profesional",
    employment: "Empleo y gestión de trabajadores",
    "essential-services": "Servicios esenciales privados/públicos (crédito, seguros)",
    "law-enforcement": "Aplicación de la ley",
    migration: "Migración, asilo y control fronterizo",
    "justice-democracy": "Administración de justicia y procesos democráticos",
  },
  domains: {
    "governance-qms": "Gobierno y sistema de gestión de calidad",
    "risk-management": "Gestión de riesgos",
    "data-governance": "Datos y gobierno de datos",
    "technical-documentation": "Documentación técnica y trazabilidad",
    "transparency-instructions": "Transparencia e instrucciones de uso",
    "human-oversight": "Supervisión humana",
    "accuracy-robustness-security": "Precisión, robustez y ciberseguridad",
    "conformity-registration": "Evaluación de conformidad y registro",
    "post-market-incidents": "Monitoreo posterior e incidentes",
    "ai-literacy": "Alfabetización en IA",
  },
  domainOwners: {
    "governance-qms": "Responsable de gobernanza de IA / CISO",
    "risk-management": "Gestión de riesgos",
    "data-governance": "Datos / ingeniería de ML",
    "technical-documentation": "Producto / ingeniería",
    "transparency-instructions": "Producto / legal",
    "human-oversight": "Operaciones / dueño del negocio",
    "accuracy-robustness-security": "Seguridad / ingeniería de ML",
    "conformity-registration": "Legal / regulatorio",
    "post-market-incidents": "Operaciones / soporte",
    "ai-literacy": "Personas / capacitación",
  },
  controls: {
    GOV1: "Un sistema de gestión de calidad documentado cubre desarrollo, pruebas, cambios, incidentes y comunicaciones regulatorias.",
    GOV2: "Existe una política de gobernanza de IA aprobada, con un propietario regulatorio responsable y un proceso de aprobación previo a producción.",
    RISK1: "Existe un proceso continuo de gestión de riesgos durante todo el ciclo de vida.",
    RISK2: "Se analiza el uso indebido razonablemente previsible y los impactos en grupos vulnerables, y se documenta el riesgo residual.",
    DATA1: "Se documenta la procedencia de los datos, los criterios de selección, la relevancia y la representatividad.",
    DATA2: "Se identifican sesgos y se evalúa el rendimiento por grupos relevantes.",
    DOC1: "Se mantiene documentación técnica conforme al Anexo IV (propósito, arquitectura, datos, capacidades, limitaciones).",
    DOC2: "El sistema genera registros y control de versiones que permiten reconstruir eventos relevantes.",
    TRANS1: "Instrucciones de uso claras identifican al proveedor, propósito previsto, precisión, limitaciones y supervisión humana.",
    TRANS2: "Se informa a las personas afectadas sobre interacción con IA, contenido sintético, reconocimiento de emociones o deepfakes según corresponda.",
    HUM1: "La supervisión humana está definida con personas que pueden intervenir, anular la salida y detener el sistema.",
    HUM2: "Esas personas son competentes, están capacitadas y tienen una carga de trabajo que permite una revisión real.",
    SEC1: "Se definen métricas de precisión y umbrales mínimos de rendimiento, probados antes del despliegue.",
    SEC2: "Pruebas adversariales, de robustez y ciberseguridad protegen el modelo, los pesos, los artefactos y las dependencias.",
    CONF1: "Se ha determinado la vía de evaluación de conformidad y las normas armonizadas aplicables.",
    CONF2: "La declaración UE de conformidad, el marcado CE y el registro en la base europea están planificados o completados.",
    POST1: "Un plan de monitoreo posterior recopila datos reales de rendimiento y comentarios de los responsables del despliegue.",
    POST2: "Existe un proceso de reporte de incidentes graves con plazos regulatorios.",
    LIT1: "Existe un programa de alfabetización en IA para el personal, adaptado a su función y a las personas afectadas.",
  },
  readinessAnswers: {
    implemented_evidence: "Implementado y con evidencia verificable",
    implemented_no_evidence: "Implementado, sin evidencia disponible",
    partial: "Parcialmente implementado",
    planned: "Planificado",
    not_implemented: "No implementado",
    not_sure: "No lo sé",
    na: "No aplica",
  },
  verdicts: {
    "out-of-scope": {
      label: "Probablemente fuera del ámbito territorial",
      description: "El sistema no parece introducirse, ponerse en servicio ni utilizarse en la UE, y sus resultados no se utilizan en la UE. Valide antes de depender de esta conclusión.",
    },
    "not-ai-system": {
      label: "Posiblemente no es un sistema de IA",
      description: "El sistema parece funcionar con reglas determinísticas explícitas sin inferencia. Se recomienda revisión técnica y jurídica antes de excluirlo.",
    },
    "manual-review": {
      label: "Requiere revisión manual",
      description: "La información proporcionada no basta para determinar la clasificación. Valide el propósito previsto, el funcionamiento técnico y las funciones.",
    },
    prohibited: {
      label: "Posible práctica prohibida",
      description: "El uso descrito podría constituir una práctica prohibida (art. 5). El sistema no debe presentarse como parcialmente conforme. Suspenda el despliegue y obtenga una evaluación jurídica especializada.",
    },
    "high-risk-annex-i": {
      label: "Sistema de alto riesgo — Anexo I (art. 6.1)",
      description: "El sistema es, o es componente de seguridad de, un producto regulado que requiere evaluación de conformidad por un tercero. Aplican las obligaciones del proveedor de alto riesgo.",
    },
    "high-risk-annex-iii": {
      label: "Sistema de alto riesgo — Anexo III (art. 6.2)",
      description: "El uso previsto se encuentra en un área de alto riesgo del Anexo III e influye materialmente en decisiones sobre personas. Aplican obligaciones de proveedor y responsable del despliegue.",
    },
    "possible-6-3-exception": {
      label: "Posible excepción del artículo 6.3",
      description: "El sistema está en un área del Anexo III pero podría no ser de alto riesgo por realizar una tarea estrecha sin influir materialmente en decisiones. Documente y conserve esta evaluación.",
    },
    "gpai-systemic": {
      label: "Modelo de IA de propósito general con riesgo sistémico",
      description: "El modelo presenta capacidades de alto impacto o supera el umbral de cómputo. Aplican obligaciones adicionales de evaluación, incidentes y ciberseguridad.",
    },
    gpai: {
      label: "Modelo de IA de propósito general",
      description: "El modelo tiene generalidad significativa y puede usarse en múltiples sistemas. Aplican obligaciones de documentación técnica e información a proveedores descendentes.",
    },
    transparency: {
      label: "Obligaciones de transparencia (art. 50)",
      description: "El sistema interactúa con personas o genera contenido sintético, por lo que aplican obligaciones de transparencia y marcado. No necesariamente de alto riesgo.",
    },
    "limited-minimal": {
      label: "Riesgo limitado o mínimo",
      description: "No se identificó práctica prohibida, uso de alto riesgo ni obligación específica de transparencia. Aplican buenas prácticas y alfabetización en IA.",
    },
  },
  roles: {
    provider: "Proveedor",
    deployer: "Responsable del despliegue",
    importer: "Importador",
    distributor: "Distribuidor",
    "product-manufacturer": "Fabricante del producto",
    "gpai-downstream": "Proveedor descendente (integra un modelo GPAI)",
  },
  notes: {
    "out-of-scope": "Ámbito territorial: el sistema no parece introducirse en el mercado de la UE ni utilizarse en la UE.",
    military: "Posible exclusión por uso exclusivamente militar, de defensa o seguridad nacional — valide que aplique estrictamente.",
    rnd: "La investigación y el desarrollo previos a la comercialización pueden quedar fuera del alcance, pero no cuando existan pruebas en condiciones reales o el sistema se ponga en servicio.",
    "not-ai": "El sistema podría quedar fuera de la definición de sistema de IA; no concluya con certeza sin documentación técnica.",
    "manual-review": "Algunas respuestas no permiten una clasificación definitiva. Esta es una clasificación provisional.",
  },
  confidence: {
    high: { label: "Alto", description: "No existen respuestas desconocidas que modifiquen la clasificación y el propósito previsto y las funciones están claros." },
    medium: { label: "Medio", description: "Existen algunas incertidumbres, pero no afectan directamente la práctica prohibida ni la clasificación principal." },
    low: { label: "Bajo", description: "Existen respuestas desconocidas en prácticas prohibidas o clasificación de alto riesgo, o más del 20% de las respuestas son desconocidas." },
  },
  confidenceReasons: {
    "many-unknowns": "Más del 20% de las respuestas aplicables son desconocidas.",
    "some-unknowns": "Entre el 5% y el 20% de las respuestas aplicables son desconocidas.",
    "critical-unknown": "Existen respuestas desconocidas en prácticas prohibidas o clasificación de alto riesgo.",
    "manual-review": "Algunas preguntas de clasificación no pudieron responderse de forma definitiva.",
  },
  levels: {
    critical: { label: "Crítico", interpretation: "No existe una base de control suficiente." },
    initial: { label: "Inicial", interpretation: "Existen acciones aisladas, pero no un programa demostrable." },
    developing: { label: "En desarrollo", interpretation: "Hay controles parciales con brechas relevantes." },
    managed: { label: "Gestionado", interpretation: "Existe un programa estructurado, aunque persisten brechas." },
    advanced: { label: "Avanzado", interpretation: "La mayoría de las obligaciones está cubierta y documentada." },
    "review-ready": { label: "Preparado para revisión de cumplimiento", interpretation: "Los controles y evidencias están ampliamente disponibles." },
  },
  evidenceBands: {
    insufficient: "Evidencia insuficiente",
    fragmented: "Evidencia fragmentada",
    moderate: "Evidencia moderada",
    solid: "Evidencia sólida",
    prepared: "Expediente ampliamente preparado",
  },
  capReasons: {
    "cap-qms": "Ausencia de sistema de gestión de calidad para un proveedor de alto riesgo (puntuación máxima 49).",
    "cap-risk": "Ausencia de gestión de riesgos (puntuación máxima 49).",
    "cap-doc": "Ausencia de documentación técnica (puntuación máxima 49).",
    "cap-conformity": "Evaluación de conformidad obligatoria no iniciada (puntuación máxima 49).",
    "cap-human": "Ausencia de supervisión humana efectiva (puntuación máxima 59).",
    "cap-security": "Ausencia de controles de ciberseguridad o pruebas (puntuación máxima 59).",
  },
  obligations: {
    prohibited: "Prohibición de prácticas de riesgo inaceptable",
    "ai-literacy": "Obligación de alfabetización en IA",
    gpai: "Obligaciones de modelos de IA de propósito general",
    transparency: "Obligaciones de transparencia (art. 50)",
    "high-risk-annex-iii": "Obligaciones de alto riesgo — sistemas del Anexo III",
    "high-risk-annex-i": "Obligaciones de alto riesgo — productos con legislación sectorial",
  },
  obligationStatus: {
    "in-force": "Vigente",
    transition: "Vigente con periodo transitorio",
    future: "Obligación futura",
  },
  complementary: {
    "gdpr-dpia": "GDPR y evaluación de impacto de protección de datos (DPIA)",
    fria: "Evaluación de impacto sobre derechos fundamentales (FRIA)",
    nis2: "NIS2 (seguridad de redes y sistemas)",
    dora: "DORA (resiliencia operativa digital — finanzas)",
    cra: "Cyber Resilience Act",
    "medical-devices": "Normativa de dispositivos médicos",
    "sector-safety": "Legislación sectorial de seguridad de productos",
  },
  gapPriorities: {
    P0: "P0 — Suspensión o revisión inmediata",
    P1: "P1 — Antes de comercializar o utilizar",
    P2: "P2 — Próximos 30–90 días",
    P3: "P3 — Mejora continua",
  },
  gaps: {
    "prohibited-practice": "Se identificó una posible práctica prohibida — suspenda el despliegue y obtenga revisión jurídica.",
    "high-risk-no-basis": "Uso de alto riesgo sin una vía de evaluación de conformidad o base jurídica determinada.",
    "no-human-oversight": "No se define una supervisión humana efectiva para el sistema.",
    "role-change": "Un cambio de función puede convertir a la organización en proveedor — reevalúe las obligaciones.",
    "classification-undocumented": "La clasificación de alto riesgo no está documentada — registre el razonamiento y la evidencia.",
    "no-risk-management": "No existe un proceso de gestión de riesgos durante el ciclo de vida.",
    "no-technical-documentation": "No existe documentación técnica conforme al Anexo IV.",
    "no-qms": "No existe un sistema de gestión de calidad.",
    "registration-pending": "La declaración UE de conformidad, el marcado CE o el registro en la base europea están pendientes.",
    "fria-required": "Probablemente se requiere una evaluación de impacto sobre derechos fundamentales (FRIA) y no está completada.",
    "insufficient-security": "Los controles de ciberseguridad, umbrales de precisión o pruebas son insuficientes.",
    "accuracy-metrics": "Las métricas de precisión y las pruebas de robustez están incompletas.",
    "data-governance": "El gobierno de datos, la procedencia y la evaluación de sesgos están incompletos.",
    "incident-management": "El monitoreo posterior y los procesos de incidentes graves están incompletos.",
    instructions: "Las instrucciones de uso y la información de transparencia son insuficientes.",
    "ai-literacy": "La capacitación en alfabetización en IA está incompleta para el personal.",
    monitoring: "El monitoreo continuo y la revisión periódica deberían reforzarse.",
  },
  warnings: {
    "role-change": "Posible cambio de función regulatoria (p.ej. convertirse en proveedor).",
    "legal-review": "Se recomienda revisión jurídica especializada antes de decisiones regulatorias.",
    dpia: "Probablemente se necesita una evaluación de impacto de protección de datos (DPIA) del GDPR.",
    fria: "Podría requerirse una evaluación de impacto sobre derechos fundamentales (FRIA).",
    "sector-review": "Podría aplicar una revisión sectorial de seguridad de productos.",
    registration: "Podría requerirse el registro en la base de datos europea.",
    conformity: "Podría requerirse una evaluación de conformidad antes de la comercialización.",
  },
  ui: {
    stageProgress: "Etapa {current} de {total}",
    complete: "{percent}% completado",
    engineA: "Clasificación",
    engineB: "Preparación",
    classificationTitle: "Clasificación jurídica",
    classificationDescription: "Responda sobre alcance, funciones y riesgo. «No lo sé» nunca se interpreta como «No».",
    readinessTitle: "Preparación para el cumplimiento",
    readinessDescription: "Califique la madurez y la evidencia de cada control. No cargue contenido confidencial.",
    back: "Atrás",
    next: "Siguiente",
    seeResults: "Ver mis resultados",
    yourResults: "Sus resultados",
    classificationHeading: "Clasificación regulatoria",
    primaryClassification: "Clasificación preliminar",
    otherFlags: "Otras clasificaciones aplicables",
    detectedRoles: "Funciones detectadas",
    confidenceLabel: "Nivel de confianza",
    obligationsHeading: "Obligaciones aplicables y calendario",
    nextDate: "Próxima fecha relevante",
    noObligations: "No se mapearon obligaciones específicas para esta clasificación más allá de los deberes básicos.",
    readinessHeading: "Preparación para el cumplimiento",
    readinessScore: "Puntuación de preparación",
    evidenceCoverage: "Cobertura de evidencias",
    domainBreakdown: "Preparación por dominio",
    notAssessed: "No evaluado",
    cappedNote: "Puntuación limitada por controles críticos faltantes:",
    criticalGaps: "Brechas críticas y plan de acción priorizado",
    complementaryHeading: "Evaluaciones complementarias a considerar",
    warningsHeading: "Advertencias",
    criticalStopTitle: "Alerta crítica: posible práctica prohibida",
    criticalStopBody:
      "El uso descrito podría constituir una práctica prohibida del EU AI Act. El sistema no debe presentarse como parcialmente conforme y no se calcula una puntuación de preparación. Suspenda el despliegue o la ampliación hasta obtener una evaluación jurídica especializada. Ningún control puede compensar una práctica prohibida.",
    requestReview: "Solicitar una revisión técnica y regulatoria",
    downloadPdf: "Descargar informe PDF",
    copySummary: "Copiar resumen del resultado",
    disclaimer:
      "Esta herramienta proporciona una evaluación preliminar de aplicabilidad y preparación. No constituye asesoramiento jurídico, certificación, declaración de conformidad ni autorización para introducir un sistema de IA en la UE. Los resultados deben ser validados por profesionales técnicos y jurídicos cualificados.",
    pdfGenerating: "Generando PDF…",
    pdfError: "No se pudo generar el PDF. Intente de nuevo o use Imprimir como PDF en su navegador.",
    selectPlaceholder: "Seleccionar…",
    of: "de",
  },
  form: {
    title: "Solicitar una revisión técnica y regulatoria",
    description: "Reciba una validación de su clasificación, evidencias y prioridades por parte de un especialista de Sprita iT.",
    firstName: "Nombre",
    company: "Empresa",
    email: "Correo corporativo",
    submit: "Solicitar una revisión",
    submitting: "Enviando…",
    successTitle: "Gracias — recibimos su solicitud.",
    successBody: "Un especialista de Sprita iT dará seguimiento respecto a su evaluación del EU AI Act.",
    disposableEmail: "Use un correo corporativo válido.",
    submitError: "No se pudo enviar la solicitud. Intente de nuevo o escriba a info@spritascore.com.",
    privacyPrefix: "Al enviar, acepta nuestra ",
    privacySuffix: ". Este resultado es informativo y no constituye certificación legal, regulatoria ni de conformidad.",
    firstNameRequired: "El nombre es obligatorio",
    emailInvalid: "Ingrese un correo corporativo válido",
    companyRequired: "La empresa es obligatoria",
  },
  pdf: {
    subtitle: "Informe de preparación EU AI Act",
    executiveSummary: "Resumen ejecutivo",
    classification: "Clasificación regulatoria",
    detectedRoles: "Funciones detectadas",
    applicableObligations: "Obligaciones aplicables y calendario",
    readiness: "Preparación para el cumplimiento",
    evidenceCoverage: "Cobertura de evidencias",
    domainResults: "Resultados por dominio",
    criticalGaps: "Brechas críticas",
    remediationPlan: "Plan de remediación priorizado",
    complementary: "Evaluaciones complementarias",
    warnings: "Advertencias",
    scopeLimitations: "Alcance y limitaciones",
    scopeLimitationsBody:
      "Este informe evalúa un sistema de IA, una versión y un uso previsto. La clasificación puede depender de hechos, documentación técnica, legislación sectorial, normas nacionales y decisiones de autoridades que no pueden determinarse únicamente mediante un cuestionario automatizado.",
    colObligation: "Obligación",
    colSource: "Fuente jurídica",
    colDate: "Desde",
    colStatus: "Estado",
    colDomain: "Dominio",
    colScore: "Puntuación",
    colPriority: "Prioridad",
    colGap: "Brecha / acción",
    colOwner: "Responsable sugerido",
    nextStepsTitle: "Siguiente paso recomendado",
    nextStepsBody:
      "Solicite una revisión técnica y regulatoria de Sprita iT para validar la clasificación, las evidencias y las prioridades antes de tomar decisiones regulatorias.",
    contactLine: "spritascore.com · sprita-it.com · info@spritascore.com",
    reportId: "ID del reporte",
    engineVersion: "Motor regulatorio",
    assessmentDate: "Fecha de evaluación",
    confidence: "Confianza",
    page: "Página",
    notAssessed: "No evaluado",
    disclaimer:
      "Esta herramienta proporciona una evaluación preliminar de aplicabilidad y preparación basada en la información suministrada por el usuario y en la versión regulatoria indicada en este reporte. No constituye asesoramiento jurídico, certificación, declaración de conformidad, evaluación de conformidad oficial ni autorización para introducir o utilizar un sistema de IA en la Unión Europea. Los resultados deben ser validados por profesionales técnicos y jurídicos cualificados antes de tomar decisiones regulatorias.",
    filename: "spritascore-preparacion-eu-ai-act",
  },
};

const PT: EuAiActCopy = {
  meta: {
    title: "Avaliação de Preparação para a Conformidade com o EU AI Act | SpritaScore by Sprita iT",
    description:
      "Classifique um sistema de IA sob o EU AI Act (Regulamento (UE) 2024/1689), descubra quais obrigações se aplicam hoje e no futuro, e meça sua preparação com um plano de ação priorizado. Multilíngue, sem upload de código.",
    ogDescription:
      "Classifique seu sistema de IA, identifique obrigações aplicáveis e obtenha uma pontuação de preparação com um plano de ação priorizado sob o EU AI Act.",
    h1: "Avaliação de Preparação para a Conformidade com o EU AI Act",
    kicker: "Regulamento (UE) 2024/1689 · SpritaScore by Sprita iT",
    subtitle: "Avalie um sistema e um caso de uso específico. Receba uma classificação preliminar, uma pontuação de preparação e um plano de ação priorizado.",
    intro:
      "Descubra como seu sistema pode ser classificado sob o EU AI Act, quais obrigações podem se aplicar e quais evidências você precisa preparar. Esta ferramenta separa a classificação jurídica, as obrigações aplicáveis, a preparação operacional, a cobertura de evidências e o nível de confiança.",
    regNote: "Data de corte normativo: 12 de julho de 2026 · Regulamento (UE) 2024/1689, incluindo o Digital Omnibus on AI.",
    privacyWarning:
      "Não carregue dados pessoais, segredos, código-fonte, credenciais, pesos de modelos nem informações confidenciais. Descreva as evidências sem revelar seu conteúdo.",
    trustLine: "SpritaScore é uma marca da",
    brandLine: "Sprita iT",
    privacy: "Política de privacidade",
  },
  stages: {
    scope: "1. Âmbito territorial e material",
    "ai-definition": "2. É um sistema de IA?",
    roles: "3. Funções na cadeia de valor",
    prohibited: "4. Práticas proibidas",
    gpai: "5. Modelos de IA de propósito geral",
    transparency: "6. Obrigações de transparência (art. 50)",
    "high-risk-product": "7. Alto risco por produto (Anexo I)",
    "high-risk-use": "8. Alto risco por caso de uso (Anexo III)",
    exception: "9. Exceção do artigo 6.3",
  },
  readinessStage: "10. Preparação para a conformidade",
  classQuestions: {
    S1: "A organização introduz, comercializa, coloca em serviço ou utiliza o sistema de IA na União Europeia?",
    S2: "A organização que utiliza o sistema está estabelecida ou localizada na União Europeia?",
    S3: "Mesmo que o fornecedor ou responsável pela implantação esteja fora da UE, os resultados do sistema são usados na União Europeia?",
    S4: "O sistema é usado exclusivamente para fins militares, de defesa ou de segurança nacional?",
    S5: "A atividade é exclusivamente pesquisa científica ou desenvolvimento anterior à comercialização, sem testes em condições reais?",
    D1: "O sistema infere, aprende, identifica padrões ou determina como gerar uma saída (além de regras fixas)?",
    D2: "Gera previsões, recomendações, decisões, classificações, pontuações ou conteúdo?",
    D3: "A saída pode influenciar ambientes físicos, digitais, organizacionais ou humanos?",
    D4: "Funciona apenas por regras determinísticas explicitamente programadas, sem inferência nem aprendizado?",
    R1: "A organização desenvolve o sistema (ou encomenda seu desenvolvimento) e o comercializa sob seu próprio nome ou marca?",
    R2: "Utiliza o sistema sob sua própria autoridade (não um uso exclusivamente pessoal)?",
    R3: "Importa o sistema de um país fora da UE para introduzi-lo no mercado da União?",
    R4: "Distribui ou revende o sistema na UE sem ser seu fornecedor nem importador?",
    R5: "Integra o sistema como componente de um produto que comercializa sob sua própria marca?",
    R6: "Integra um modelo de propósito geral de terceiros em seu próprio sistema ou aplicação?",
    R7: "Realizou uma modificação substancial, alterou o propósito previsto ou a marca do sistema?",
    P1: "Utiliza técnicas subliminares, manipuladoras ou enganosas que possam distorcer materialmente o comportamento e causar dano significativo?",
    P2: "Explora vulnerabilidades relacionadas a idade, deficiência ou situação social/econômica para distorcer o comportamento e causar dano?",
    P3: "Realiza pontuação social que leva a tratamento prejudicial ou injustificado de pessoas?",
    P4: "Prevê o risco de uma pessoa cometer um crime baseando-se apenas em perfilamento ou traços de personalidade?",
    P5: "Cria ou amplia bases de reconhecimento facial mediante extração indiscriminada de imagens?",
    P6: "Infere emoções de pessoas no trabalho ou na educação, fora de uma finalidade médica ou de segurança permitida?",
    P7: "Classifica pessoas a partir de dados biométricos para inferir raça, opiniões políticas, religião, orientação sexual, etc.?",
    P8: "É usado para identificação biométrica remota em tempo real em espaços públicos com fins policiais?",
    P9: "Gera ou manipula conteúdo íntimo ou sexual de pessoas reais sem seu consentimento?",
    P10: "É projetado ou pode ser usado para gerar material de abuso sexual infantil?",
    G1: "A organização desenvolve (ou encomenda) um modelo de IA de propósito geral com generalidade significativa, utilizável em múltiplas tarefas ou sistemas?",
    G2: "O modelo é fornecido a terceiros para integrá-lo em aplicações ou sistemas?",
    G3: "O cômputo de treinamento supera o limiar regulatório ou a Comissão o designou com risco sistêmico?",
    T1: "O sistema interage diretamente com pessoas?",
    T2: "Gera ou manipula áudio, imagem, vídeo ou texto sintético?",
    T3: "Utiliza reconhecimento de emoções ou categorização biométrica?",
    T4: "Gera deepfakes que poderiam parecer autênticos?",
    HP1: "O sistema é um produto (ou componente de segurança de um produto) sujeito a legislação harmonizada da UE (p.ex. máquinas, dispositivos médicos, brinquedos, automóveis)?",
    HP2: "Essa legislação setorial exige uma avaliação de conformidade por terceiros?",
    HU1: "A saída influencia materialmente uma decisão sobre pessoas?",
    HU2: "Essa decisão afeta direitos, acesso, oportunidades, segurança ou condições de uma pessoa?",
    HU3: "É realizado perfilamento de pessoas físicas?",
    EX1: "Realiza apenas uma tarefa procedimental estreita, preparatória ou de melhoria, sem substituir a avaliação humana?",
    EX2: "Existe uma revisão humana real, competente e documentada?",
    EX3: "Poderia produzir um risco significativo para a saúde, segurança ou direitos fundamentais?",
    EX4: "Existe uma avaliação documentada que justifica a exceção do artigo 6.3?",
  },
  classAnswers: { yes: "Sim", no: "Não", not_sure: "Não sei", na: "Não se aplica" },
  areaQuestion: "Se puder ser de alto risco pelo uso, qual área do Anexo III corresponde melhor ao propósito previsto do sistema?",
  areas: {
    none: "Nenhuma / não se aplica",
    biometrics: "Biometria",
    "critical-infrastructure": "Infraestrutura crítica",
    education: "Educação e formação profissional",
    employment: "Emprego e gestão de trabalhadores",
    "essential-services": "Serviços essenciais privados/públicos (crédito, seguros)",
    "law-enforcement": "Aplicação da lei",
    migration: "Migração, asilo e controle de fronteiras",
    "justice-democracy": "Administração da justiça e processos democráticos",
  },
  domains: {
    "governance-qms": "Governança e sistema de gestão da qualidade",
    "risk-management": "Gestão de riscos",
    "data-governance": "Dados e governança de dados",
    "technical-documentation": "Documentação técnica e rastreabilidade",
    "transparency-instructions": "Transparência e instruções de uso",
    "human-oversight": "Supervisão humana",
    "accuracy-robustness-security": "Precisão, robustez e cibersegurança",
    "conformity-registration": "Avaliação de conformidade e registro",
    "post-market-incidents": "Monitoramento pós-mercado e incidentes",
    "ai-literacy": "Alfabetização em IA",
  },
  domainOwners: {
    "governance-qms": "Responsável de governança de IA / CISO",
    "risk-management": "Gestão de riscos",
    "data-governance": "Dados / engenharia de ML",
    "technical-documentation": "Produto / engenharia",
    "transparency-instructions": "Produto / jurídico",
    "human-oversight": "Operações / dono do negócio",
    "accuracy-robustness-security": "Segurança / engenharia de ML",
    "conformity-registration": "Jurídico / regulatório",
    "post-market-incidents": "Operações / suporte",
    "ai-literacy": "Pessoas / capacitação",
  },
  controls: {
    GOV1: "Um sistema de gestão da qualidade documentado cobre desenvolvimento, testes, mudanças, incidentes e comunicações regulatórias.",
    GOV2: "Existe uma política de governança de IA aprovada, com um proprietário regulatório responsável e um processo de aprovação anterior à produção.",
    RISK1: "Existe um processo contínuo de gestão de riscos durante todo o ciclo de vida.",
    RISK2: "Analisa-se o uso indevido razoavelmente previsível e os impactos em grupos vulneráveis, e documenta-se o risco residual.",
    DATA1: "Documenta-se a procedência dos dados, os critérios de seleção, a relevância e a representatividade.",
    DATA2: "Identificam-se vieses e avalia-se o desempenho por grupos relevantes.",
    DOC1: "Mantém-se documentação técnica conforme o Anexo IV (propósito, arquitetura, dados, capacidades, limitações).",
    DOC2: "O sistema gera registros e controle de versões que permitem reconstruir eventos relevantes.",
    TRANS1: "Instruções de uso claras identificam o fornecedor, propósito previsto, precisão, limitações e supervisão humana.",
    TRANS2: "Informa-se as pessoas afetadas sobre interação com IA, conteúdo sintético, reconhecimento de emoções ou deepfakes conforme aplicável.",
    HUM1: "A supervisão humana está definida com pessoas que podem intervir, anular a saída e deter o sistema.",
    HUM2: "Essas pessoas são competentes, capacitadas e têm carga de trabalho que permite uma revisão real.",
    SEC1: "Definem-se métricas de precisão e limiares mínimos de desempenho, testados antes da implantação.",
    SEC2: "Testes adversariais, de robustez e cibersegurança protegem o modelo, os pesos, os artefatos e as dependências.",
    CONF1: "Determinou-se a via de avaliação de conformidade e as normas harmonizadas aplicáveis.",
    CONF2: "A declaração UE de conformidade, a marcação CE e o registro na base europeia estão planejados ou concluídos.",
    POST1: "Um plano de monitoramento pós-mercado coleta dados reais de desempenho e feedback dos responsáveis pela implantação.",
    POST2: "Existe um processo de reporte de incidentes graves com prazos regulatórios.",
    LIT1: "Existe um programa de alfabetização em IA para o pessoal, adaptado à sua função e às pessoas afetadas.",
  },
  readinessAnswers: {
    implemented_evidence: "Implementado e com evidência verificável",
    implemented_no_evidence: "Implementado, sem evidência disponível",
    partial: "Parcialmente implementado",
    planned: "Planejado",
    not_implemented: "Não implementado",
    not_sure: "Não sei",
    na: "Não se aplica",
  },
  verdicts: {
    "out-of-scope": {
      label: "Provavelmente fora do âmbito territorial",
      description: "O sistema não parece ser introduzido, colocado em serviço nem utilizado na UE, e seus resultados não são usados na UE. Valide antes de depender desta conclusão.",
    },
    "not-ai-system": {
      label: "Possivelmente não é um sistema de IA",
      description: "O sistema parece funcionar com regras determinísticas explícitas sem inferência. Recomenda-se revisão técnica e jurídica antes de excluí-lo.",
    },
    "manual-review": {
      label: "Requer revisão manual",
      description: "A informação fornecida não basta para determinar a classificação. Valide o propósito previsto, o funcionamento técnico e as funções.",
    },
    prohibited: {
      label: "Possível prática proibida",
      description: "O uso descrito pode constituir uma prática proibida (art. 5). O sistema não deve ser apresentado como parcialmente conforme. Suspenda a implantação e obtenha uma avaliação jurídica especializada.",
    },
    "high-risk-annex-i": {
      label: "Sistema de alto risco — Anexo I (art. 6.1)",
      description: "O sistema é, ou é componente de segurança de, um produto regulado que requer avaliação de conformidade por terceiros. Aplicam-se as obrigações do fornecedor de alto risco.",
    },
    "high-risk-annex-iii": {
      label: "Sistema de alto risco — Anexo III (art. 6.2)",
      description: "O uso previsto encontra-se em uma área de alto risco do Anexo III e influencia materialmente decisões sobre pessoas. Aplicam-se obrigações de fornecedor e responsável pela implantação.",
    },
    "possible-6-3-exception": {
      label: "Possível exceção do artigo 6.3",
      description: "O sistema está em uma área do Anexo III, mas pode não ser de alto risco por realizar uma tarefa estreita sem influenciar materialmente decisões. Documente e conserve esta avaliação.",
    },
    "gpai-systemic": {
      label: "Modelo de IA de propósito geral com risco sistêmico",
      description: "O modelo apresenta capacidades de alto impacto ou supera o limiar de cômputo. Aplicam-se obrigações adicionais de avaliação, incidentes e cibersegurança.",
    },
    gpai: {
      label: "Modelo de IA de propósito geral",
      description: "O modelo tem generalidade significativa e pode ser usado em múltiplos sistemas. Aplicam-se obrigações de documentação técnica e informação a fornecedores descendentes.",
    },
    transparency: {
      label: "Obrigações de transparência (art. 50)",
      description: "O sistema interage com pessoas ou gera conteúdo sintético, portanto aplicam-se obrigações de transparência e marcação. Não necessariamente de alto risco.",
    },
    "limited-minimal": {
      label: "Risco limitado ou mínimo",
      description: "Não se identificou prática proibida, uso de alto risco nem obrigação específica de transparência. Aplicam-se boas práticas e alfabetização em IA.",
    },
  },
  roles: {
    provider: "Fornecedor",
    deployer: "Responsável pela implantação",
    importer: "Importador",
    distributor: "Distribuidor",
    "product-manufacturer": "Fabricante do produto",
    "gpai-downstream": "Fornecedor descendente (integra um modelo GPAI)",
  },
  notes: {
    "out-of-scope": "Âmbito territorial: o sistema não parece ser introduzido no mercado da UE nem utilizado na UE.",
    military: "Possível exclusão por uso exclusivamente militar, de defesa ou segurança nacional — valide que se aplique estritamente.",
    rnd: "A pesquisa e o desenvolvimento anteriores à comercialização podem ficar fora do âmbito, mas não quando existirem testes em condições reais ou o sistema for colocado em serviço.",
    "not-ai": "O sistema pode ficar fora da definição de sistema de IA; não conclua com certeza sem documentação técnica.",
    "manual-review": "Algumas respostas não permitem uma classificação definitiva. Esta é uma classificação provisória.",
  },
  confidence: {
    high: { label: "Alto", description: "Não existem respostas desconhecidas que modifiquem a classificação e o propósito previsto e as funções estão claros." },
    medium: { label: "Médio", description: "Existem algumas incertezas, mas não afetam diretamente a prática proibida nem a classificação principal." },
    low: { label: "Baixo", description: "Existem respostas desconhecidas em práticas proibidas ou classificação de alto risco, ou mais de 20% das respostas são desconhecidas." },
  },
  confidenceReasons: {
    "many-unknowns": "Mais de 20% das respostas aplicáveis são desconhecidas.",
    "some-unknowns": "Entre 5% e 20% das respostas aplicáveis são desconhecidas.",
    "critical-unknown": "Existem respostas desconhecidas em práticas proibidas ou classificação de alto risco.",
    "manual-review": "Algumas perguntas de classificação não puderam ser respondidas de forma definitiva.",
  },
  levels: {
    critical: { label: "Crítico", interpretation: "Não existe uma base de controle suficiente." },
    initial: { label: "Inicial", interpretation: "Existem ações isoladas, mas não um programa demonstrável." },
    developing: { label: "Em desenvolvimento", interpretation: "Existem controles parciais com lacunas relevantes." },
    managed: { label: "Gerenciado", interpretation: "Existe um programa estruturado, embora persistam lacunas." },
    advanced: { label: "Avançado", interpretation: "A maioria das obrigações está coberta e documentada." },
    "review-ready": { label: "Preparado para revisão de conformidade", interpretation: "Os controles e evidências estão amplamente disponíveis." },
  },
  evidenceBands: {
    insufficient: "Evidência insuficiente",
    fragmented: "Evidência fragmentada",
    moderate: "Evidência moderada",
    solid: "Evidência sólida",
    prepared: "Dossiê amplamente preparado",
  },
  capReasons: {
    "cap-qms": "Ausência de sistema de gestão da qualidade para um fornecedor de alto risco (pontuação máxima 49).",
    "cap-risk": "Ausência de gestão de riscos (pontuação máxima 49).",
    "cap-doc": "Ausência de documentação técnica (pontuação máxima 49).",
    "cap-conformity": "Avaliação de conformidade obrigatória não iniciada (pontuação máxima 49).",
    "cap-human": "Ausência de supervisão humana efetiva (pontuação máxima 59).",
    "cap-security": "Ausência de controles de cibersegurança ou testes (pontuação máxima 59).",
  },
  obligations: {
    prohibited: "Proibição de práticas de risco inaceitável",
    "ai-literacy": "Obrigação de alfabetização em IA",
    gpai: "Obrigações de modelos de IA de propósito geral",
    transparency: "Obrigações de transparência (art. 50)",
    "high-risk-annex-iii": "Obrigações de alto risco — sistemas do Anexo III",
    "high-risk-annex-i": "Obrigações de alto risco — produtos com legislação setorial",
  },
  obligationStatus: {
    "in-force": "Vigente",
    transition: "Vigente com período transitório",
    future: "Obrigação futura",
  },
  complementary: {
    "gdpr-dpia": "GDPR e avaliação de impacto de proteção de dados (DPIA)",
    fria: "Avaliação de impacto sobre direitos fundamentais (FRIA)",
    nis2: "NIS2 (segurança de redes e sistemas)",
    dora: "DORA (resiliência operacional digital — finanças)",
    cra: "Cyber Resilience Act",
    "medical-devices": "Regulamentação de dispositivos médicos",
    "sector-safety": "Legislação setorial de segurança de produtos",
  },
  gapPriorities: {
    P0: "P0 — Suspensão ou revisão imediata",
    P1: "P1 — Antes de comercializar ou utilizar",
    P2: "P2 — Próximos 30–90 dias",
    P3: "P3 — Melhoria contínua",
  },
  gaps: {
    "prohibited-practice": "Identificou-se uma possível prática proibida — suspenda a implantação e obtenha revisão jurídica.",
    "high-risk-no-basis": "Uso de alto risco sem uma via de avaliação de conformidade ou base jurídica determinada.",
    "no-human-oversight": "Não se define uma supervisão humana efetiva para o sistema.",
    "role-change": "Uma mudança de função pode tornar a organização um fornecedor — reavalie as obrigações.",
    "classification-undocumented": "A classificação de alto risco não está documentada — registre o raciocínio e a evidência.",
    "no-risk-management": "Não existe um processo de gestão de riscos durante o ciclo de vida.",
    "no-technical-documentation": "Não existe documentação técnica conforme o Anexo IV.",
    "no-qms": "Não existe um sistema de gestão da qualidade.",
    "registration-pending": "A declaração UE de conformidade, a marcação CE ou o registro na base europeia estão pendentes.",
    "fria-required": "Provavelmente requer-se uma avaliação de impacto sobre direitos fundamentais (FRIA) e não está concluída.",
    "insufficient-security": "Os controles de cibersegurança, limiares de precisão ou testes são insuficientes.",
    "accuracy-metrics": "As métricas de precisão e os testes de robustez estão incompletos.",
    "data-governance": "A governança de dados, a procedência e a avaliação de vieses estão incompletas.",
    "incident-management": "O monitoramento pós-mercado e os processos de incidentes graves estão incompletos.",
    instructions: "As instruções de uso e a informação de transparência são insuficientes.",
    "ai-literacy": "A capacitação em alfabetização em IA está incompleta para o pessoal.",
    monitoring: "O monitoramento contínuo e a revisão periódica deveriam ser reforçados.",
  },
  warnings: {
    "role-change": "Possível mudança de função regulatória (p.ex. tornar-se fornecedor).",
    "legal-review": "Recomenda-se revisão jurídica especializada antes de decisões regulatórias.",
    dpia: "Provavelmente é necessária uma avaliação de impacto de proteção de dados (DPIA) do GDPR.",
    fria: "Poderia ser requerida uma avaliação de impacto sobre direitos fundamentais (FRIA).",
    "sector-review": "Poderia aplicar-se uma revisão setorial de segurança de produtos.",
    registration: "Poderia ser requerido o registro na base de dados europeia.",
    conformity: "Poderia ser requerida uma avaliação de conformidade antes da comercialização.",
  },
  ui: {
    stageProgress: "Etapa {current} de {total}",
    complete: "{percent}% concluído",
    engineA: "Classificação",
    engineB: "Preparação",
    classificationTitle: "Classificação jurídica",
    classificationDescription: "Responda sobre âmbito, funções e risco. «Não sei» nunca é interpretado como «Não».",
    readinessTitle: "Preparação para a conformidade",
    readinessDescription: "Avalie a maturidade e a evidência de cada controle. Não carregue conteúdo confidencial.",
    back: "Voltar",
    next: "Próximo",
    seeResults: "Ver meus resultados",
    yourResults: "Seus resultados",
    classificationHeading: "Classificação regulatória",
    primaryClassification: "Classificação preliminar",
    otherFlags: "Outras classificações aplicáveis",
    detectedRoles: "Funções detectadas",
    confidenceLabel: "Nível de confiança",
    obligationsHeading: "Obrigações aplicáveis e calendário",
    nextDate: "Próxima data relevante",
    noObligations: "Não foram mapeadas obrigações específicas para esta classificação além dos deveres básicos.",
    readinessHeading: "Preparação para a conformidade",
    readinessScore: "Pontuação de preparação",
    evidenceCoverage: "Cobertura de evidências",
    domainBreakdown: "Preparação por domínio",
    notAssessed: "Não avaliado",
    cappedNote: "Pontuação limitada por controles críticos ausentes:",
    criticalGaps: "Lacunas críticas e plano de ação priorizado",
    complementaryHeading: "Avaliações complementares a considerar",
    warningsHeading: "Advertências",
    criticalStopTitle: "Alerta crítica: possível prática proibida",
    criticalStopBody:
      "O uso descrito pode constituir uma prática proibida do EU AI Act. O sistema não deve ser apresentado como parcialmente conforme e não se calcula uma pontuação de preparação. Suspenda a implantação ou a ampliação até obter uma avaliação jurídica especializada. Nenhum controle pode compensar uma prática proibida.",
    requestReview: "Solicitar uma revisão técnica e regulatória",
    downloadPdf: "Baixar relatório PDF",
    copySummary: "Copiar resumo do resultado",
    disclaimer:
      "Esta ferramenta fornece uma avaliação preliminar de aplicabilidade e preparação. Não constitui assessoria jurídica, certificação, declaração de conformidade nem autorização para introduzir um sistema de IA na UE. Os resultados devem ser validados por profissionais técnicos e jurídicos qualificados.",
    pdfGenerating: "Gerando PDF…",
    pdfError: "Não foi possível gerar o PDF. Tente novamente ou use Imprimir como PDF no navegador.",
    selectPlaceholder: "Selecionar…",
    of: "de",
  },
  form: {
    title: "Solicitar uma revisão técnica e regulatória",
    description: "Receba uma validação da sua classificação, evidências e prioridades por um especialista da Sprita iT.",
    firstName: "Nome",
    company: "Empresa",
    email: "E-mail corporativo",
    submit: "Solicitar uma revisão",
    submitting: "Enviando…",
    successTitle: "Obrigado — recebemos sua solicitação.",
    successBody: "Um especialista da Sprita iT dará seguimento sobre sua avaliação do EU AI Act.",
    disposableEmail: "Use um e-mail corporativo válido.",
    submitError: "Não foi possível enviar a solicitação. Tente novamente ou escreva para info@spritascore.com.",
    privacyPrefix: "Ao enviar, você aceita nossa ",
    privacySuffix: ". Este resultado é informativo e não constitui certificação legal, regulatória nem de conformidade.",
    firstNameRequired: "O nome é obrigatório",
    emailInvalid: "Insira um e-mail corporativo válido",
    companyRequired: "A empresa é obrigatória",
  },
  pdf: {
    subtitle: "Relatório de preparação EU AI Act",
    executiveSummary: "Resumo executivo",
    classification: "Classificação regulatória",
    detectedRoles: "Funções detectadas",
    applicableObligations: "Obrigações aplicáveis e calendário",
    readiness: "Preparação para a conformidade",
    evidenceCoverage: "Cobertura de evidências",
    domainResults: "Resultados por domínio",
    criticalGaps: "Lacunas críticas",
    remediationPlan: "Plano de remediação priorizado",
    complementary: "Avaliações complementares",
    warnings: "Advertências",
    scopeLimitations: "Âmbito e limitações",
    scopeLimitationsBody:
      "Este relatório avalia um sistema de IA, uma versão e um uso previsto. A classificação pode depender de fatos, documentação técnica, legislação setorial, normas nacionais e decisões de autoridades que não podem ser determinados apenas por um questionário automatizado.",
    colObligation: "Obrigação",
    colSource: "Fonte jurídica",
    colDate: "Desde",
    colStatus: "Status",
    colDomain: "Domínio",
    colScore: "Pontuação",
    colPriority: "Prioridade",
    colGap: "Lacuna / ação",
    colOwner: "Responsável sugerido",
    nextStepsTitle: "Próximo passo recomendado",
    nextStepsBody:
      "Solicite uma revisão técnica e regulatória da Sprita iT para validar a classificação, as evidências e as prioridades antes de tomar decisões regulatórias.",
    contactLine: "spritascore.com · sprita-it.com · info@spritascore.com",
    reportId: "ID do relatório",
    engineVersion: "Motor regulatório",
    assessmentDate: "Data de avaliação",
    confidence: "Confiança",
    page: "Página",
    notAssessed: "Não avaliado",
    disclaimer:
      "Esta ferramenta fornece uma avaliação preliminar de aplicabilidade e preparação com base nas informações fornecidas pelo usuário e na versão regulatória indicada neste relatório. Não constitui assessoria jurídica, certificação, declaração de conformidade, avaliação de conformidade oficial nem autorização para introduzir ou utilizar um sistema de IA na União Europeia. Os resultados devem ser validados por profissionais técnicos e jurídicos qualificados antes de tomar decisões regulatórias.",
    filename: "spritascore-preparacao-eu-ai-act",
  },
};

const COPY: Record<Locale, EuAiActCopy> = { en: EN, es: ES, pt: PT };

export function getEuAiActCopy(locale: Locale): EuAiActCopy {
  return COPY[locale] ?? COPY.en;
}

export function getEuAiActClassQuestions(locale: Locale) {
  const copy = getEuAiActCopy(locale);
  return CLASS_QUESTIONS.map((meta) => ({
    ...meta,
    stageLabel: copy.stages[meta.stage],
    text: copy.classQuestions[meta.id],
  }));
}

export function getEuAiActControls(locale: Locale) {
  const copy = getEuAiActCopy(locale);
  return READINESS_CONTROLS.map((meta) => ({
    ...meta,
    domainLabel: copy.domains[meta.domain],
    text: copy.controls[meta.id],
  }));
}

export function formatEuAiAct(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
