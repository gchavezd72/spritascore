export type ExecutiveAnswerId = "yes" | "partially" | "no" | "not_sure";

export type ExecutiveWeakCategory =
  | "ai-assisted-code"
  | "vendor-delivered-code"
  | "open-source-dependencies"
  | "release-controls"
  | "audit-evidence"
  | "software-governance";

export interface ExecutiveAnswerOption {
  id: ExecutiveAnswerId;
  label: string;
  maturityPoints: number;
}

export interface ExecutiveQuestion {
  id: string;
  category: string;
  categoryLabel: string;
  text: string;
  weakCategory: ExecutiveWeakCategory;
}

export const EXECUTIVE_ANSWERS: ExecutiveAnswerOption[] = [
  { id: "yes", label: "Yes", maturityPoints: 1 },
  { id: "partially", label: "Partially", maturityPoints: 0.5 },
  { id: "no", label: "No", maturityPoints: 0 },
  { id: "not_sure", label: "Not sure", maturityPoints: 0 },
];

export const EXECUTIVE_QUESTIONS: ExecutiveQuestion[] = [
  {
    id: "q1",
    category: "software-governance",
    categoryLabel: "Software Governance",
    text: "There is an up-to-date inventory of all business-critical applications.",
    weakCategory: "software-governance",
  },
  {
    id: "q2",
    category: "software-governance",
    categoryLabel: "Software Governance",
    text: "Each critical application has a clearly identified business and technical owner.",
    weakCategory: "software-governance",
  },
  {
    id: "q3",
    category: "software-governance",
    categoryLabel: "Software Governance",
    text: "Management receives periodic indicators of software risk, not only vulnerability counts.",
    weakCategory: "software-governance",
  },
  {
    id: "q4",
    category: "secure-development",
    categoryLabel: "Secure Development",
    text: "Internally developed code is automatically analyzed before release.",
    weakCategory: "software-governance",
  },
  {
    id: "q5",
    category: "secure-development",
    categoryLabel: "Secure Development",
    text: "Code delivered by vendors or external development partners is independently validated.",
    weakCategory: "vendor-delivered-code",
  },
  {
    id: "q6",
    category: "secure-development",
    categoryLabel: "Secure Development",
    text: "AI-assisted or AI-generated code is reviewed before it reaches production.",
    weakCategory: "ai-assisted-code",
  },
  {
    id: "q7",
    category: "dependencies-supply-chain",
    categoryLabel: "Dependencies and Supply Chain",
    text: "The organization knows which open-source libraries and third-party components are used by critical applications.",
    weakCategory: "open-source-dependencies",
  },
  {
    id: "q8",
    category: "dependencies-supply-chain",
    categoryLabel: "Dependencies and Supply Chain",
    text: "The organization receives alerts when critical CVEs affect components used in production.",
    weakCategory: "open-source-dependencies",
  },
  {
    id: "q9",
    category: "dependencies-supply-chain",
    categoryLabel: "Dependencies and Supply Chain",
    text: "Open-source license risk is reviewed before components are approved or released.",
    weakCategory: "open-source-dependencies",
  },
  {
    id: "q10",
    category: "quality-continuity",
    categoryLabel: "Quality and Continuity",
    text: "Technical debt and maintainability are measured for critical applications.",
    weakCategory: "software-governance",
  },
  {
    id: "q11",
    category: "quality-continuity",
    categoryLabel: "Quality and Continuity",
    text: "Critical vulnerabilities can automatically block or stop a production release.",
    weakCategory: "release-controls",
  },
  {
    id: "q12",
    category: "quality-continuity",
    categoryLabel: "Quality and Continuity",
    text: "Critical applications already in operation are reviewed periodically, not only before release.",
    weakCategory: "release-controls",
  },
  {
    id: "q13",
    category: "compliance-audit-evidence",
    categoryLabel: "Compliance and Audit Evidence",
    text: "The organization can produce objective evidence for internal audits, clients, examiners, or regulators.",
    weakCategory: "audit-evidence",
  },
  {
    id: "q14",
    category: "compliance-audit-evidence",
    categoryLabel: "Compliance and Audit Evidence",
    text: "The organization can show software risk trends over time using metrics.",
    weakCategory: "audit-evidence",
  },
  {
    id: "q15",
    category: "compliance-audit-evidence",
    categoryLabel: "Compliance and Audit Evidence",
    text: "Critical vulnerabilities have defined remediation timeframes and accountable owners.",
    weakCategory: "audit-evidence",
  },
];

export const WEAK_CATEGORY_PRIORITY: ExecutiveWeakCategory[] = [
  "ai-assisted-code",
  "vendor-delivered-code",
  "open-source-dependencies",
  "release-controls",
  "audit-evidence",
  "software-governance",
];

export const WEAK_CATEGORY_RECOMMENDATIONS: Record<ExecutiveWeakCategory, string> = {
  "ai-assisted-code": "Define a review gate for AI-assisted code before it reaches production.",
  "vendor-delivered-code": "Validate vendor-delivered code independently before accepting releases.",
  "open-source-dependencies":
    "Maintain dependency visibility and CVE alerting for critical applications.",
  "release-controls":
    "Define release-blocking rules for critical vulnerabilities and policy violations.",
  "audit-evidence":
    "Preserve objective evidence that shows risk evolution and remediation status over time.",
  "software-governance":
    "Establish ownership, inventory, and executive reporting for business-critical applications.",
};

export const EXECUTIVE_SECTIONS = [
  "software-governance",
  "secure-development",
  "dependencies-supply-chain",
  "quality-continuity",
  "compliance-audit-evidence",
] as const;

export const EXECUTIVE_ROUTE = "/en/executive-software-risk-score";

export const EXECUTIVE_CARD = {
  id: "executive-software-risk-score" as const,
  slug: "executive-software-risk-score",
  category: "seguridad" as const,
  title: { es: "Executive Software Risk Score", en: "Executive Software Risk Score", pt: "Executive Software Risk Score" },
  shortDescription: {
    es: "Identify visibility gaps across AI-assisted code, vendor-delivered software, open-source dependencies, and release controls.",
    en: "Identify visibility gaps across AI-assisted code, vendor-delivered software, open-source dependencies, and release controls.",
    pt: "Identify visibility gaps across AI-assisted code, vendor-delivered software, open-source dependencies, and release controls.",
  },
  kicker: {
    es: "15 questions · 3 minutes · No code upload",
    en: "15 questions · 3 minutes · No code upload",
    pt: "15 questions · 3 minutes · No code upload",
  },
  badge: {
    es: "Executive diagnostic",
    en: "Executive diagnostic",
    pt: "Executive diagnostic",
  },
  audience: {
    es: "CIO · CISO · Risk · Technology",
    en: "CIO · CISO · Risk · Technology",
    pt: "CIO · CISO · Risk · Technology",
  },
  ctaLabel: {
    es: "Calculate my software risk score",
    en: "Calculate my software risk score",
    pt: "Calculate my software risk score",
  },
  complexity: "baja" as const,
  estimatedTime: { es: "3 minutes", en: "3 minutes", pt: "3 minutes" },
  featured: true,
  customRoute: EXECUTIVE_ROUTE,
  steps: [],
};