import type { Locale } from "@/types/calculator";

/**
 * EU AI Act Compliance Readiness Assessment — structural model.
 * Copy lives in src/i18n/euAiAct.ts; the two engines live in
 * src/lib/calculateEuAiAct.ts. This file only describes the questionnaire
 * structure, scoring constants, weighting and the versioned regulatory data
 * (dates / obligations) so the legal content stays out of the render code.
 */

export const EU_AI_ACT_ROUTES: Record<Locale, string> = {
  en: "/en/eu-ai-act-compliance",
  es: "/es/cumplimiento-eu-ai-act",
  pt: "/pt/conformidade-eu-ai-act",
};

export function getEuAiActRoute(locale: Locale): string {
  return EU_AI_ACT_ROUTES[locale] ?? EU_AI_ACT_ROUTES.en;
}

/** Regulatory engine version — stamped on every report (spec §30/§33). */
export const REGULATORY_ENGINE_VERSION = "2024/1689 + Digital Omnibus · v1.0";
/** Normative cut-off date used by the date engine (spec cover + §5). */
export const REGULATORY_CUTOFF = "2026-07-12";
export const QUESTIONNAIRE_VERSION = "eu-ai-act-q1.0";

/* ------------------------------------------------------------------ *
 * Engine A — classification (deterministic). Answers: yes/no/not_sure/na
 * ------------------------------------------------------------------ */

export type ClassAnswerId = "yes" | "no" | "not_sure" | "na";

export const CLASSIFICATION_STAGES = [
  "scope",
  "ai-definition",
  "roles",
  "prohibited",
  "gpai",
  "transparency",
  "high-risk-product",
  "high-risk-use",
  "exception",
] as const;
export type ClassificationStage = (typeof CLASSIFICATION_STAGES)[number];

export interface ClassQuestionMeta {
  id: string;
  stage: ClassificationStage;
  /** Marks questions whose "not_sure" answer lowers confidence hardest. */
  classificationCritical?: boolean;
}

export const CLASS_QUESTIONS: ClassQuestionMeta[] = [
  // Scope
  { id: "S1", stage: "scope", classificationCritical: true },
  { id: "S2", stage: "scope", classificationCritical: true },
  { id: "S3", stage: "scope", classificationCritical: true },
  { id: "S4", stage: "scope" },
  { id: "S5", stage: "scope" },
  // AI-system definition
  { id: "D1", stage: "ai-definition", classificationCritical: true },
  { id: "D2", stage: "ai-definition" },
  { id: "D3", stage: "ai-definition" },
  { id: "D4", stage: "ai-definition", classificationCritical: true },
  // Roles (each "yes" adds a role)
  { id: "R1", stage: "roles" },
  { id: "R2", stage: "roles" },
  { id: "R3", stage: "roles" },
  { id: "R4", stage: "roles" },
  { id: "R5", stage: "roles" },
  { id: "R6", stage: "roles" },
  { id: "R7", stage: "roles" },
  // Prohibited practices (any "yes" => critical stop)
  { id: "P1", stage: "prohibited", classificationCritical: true },
  { id: "P2", stage: "prohibited", classificationCritical: true },
  { id: "P3", stage: "prohibited", classificationCritical: true },
  { id: "P4", stage: "prohibited", classificationCritical: true },
  { id: "P5", stage: "prohibited", classificationCritical: true },
  { id: "P6", stage: "prohibited", classificationCritical: true },
  { id: "P7", stage: "prohibited", classificationCritical: true },
  { id: "P8", stage: "prohibited", classificationCritical: true },
  { id: "P9", stage: "prohibited", classificationCritical: true },
  { id: "P10", stage: "prohibited", classificationCritical: true },
  // General-purpose AI models
  { id: "G1", stage: "gpai" },
  { id: "G2", stage: "gpai" },
  { id: "G3", stage: "gpai", classificationCritical: true },
  // Transparency (Art. 50)
  { id: "T1", stage: "transparency" },
  { id: "T2", stage: "transparency" },
  { id: "T3", stage: "transparency" },
  { id: "T4", stage: "transparency" },
  // High-risk by product (Annex I / Art. 6.1)
  { id: "HP1", stage: "high-risk-product", classificationCritical: true },
  { id: "HP2", stage: "high-risk-product", classificationCritical: true },
  // High-risk by use (Annex III / Art. 6.2)
  { id: "HU1", stage: "high-risk-use", classificationCritical: true },
  { id: "HU2", stage: "high-risk-use", classificationCritical: true },
  { id: "HU3", stage: "high-risk-use" },
  // Article 6.3 exception
  { id: "EX1", stage: "exception" },
  { id: "EX2", stage: "exception" },
  { id: "EX3", stage: "exception" },
  { id: "EX4", stage: "exception" },
];

/** Annex III area selected by the user (single select). */
export const ANNEX_III_AREAS = [
  "none",
  "biometrics",
  "critical-infrastructure",
  "education",
  "employment",
  "essential-services",
  "law-enforcement",
  "migration",
  "justice-democracy",
] as const;
export type AnnexIIIArea = (typeof ANNEX_III_AREAS)[number];

/** Regulatory roles the engine can detect (from the R* answers). */
export const OPERATOR_ROLES = [
  "provider",
  "deployer",
  "importer",
  "distributor",
  "product-manufacturer",
  "gpai-downstream",
] as const;
export type OperatorRole = (typeof OPERATOR_ROLES)[number];

export const ROLE_BY_QUESTION: Record<string, OperatorRole> = {
  R1: "provider",
  R2: "deployer",
  R3: "importer",
  R4: "distributor",
  R5: "product-manufacturer",
  R6: "gpai-downstream",
};

/** Deterministic classification verdicts (Engine A output, spec §2). */
export type ClassificationVerdict =
  | "out-of-scope"
  | "not-ai-system"
  | "manual-review"
  | "prohibited"
  | "high-risk-annex-i"
  | "high-risk-annex-iii"
  | "possible-6-3-exception"
  | "gpai-systemic"
  | "gpai"
  | "transparency"
  | "limited-minimal";

/* ------------------------------------------------------------------ *
 * Engine B — readiness (weighted). Answers: 7-level maturity scale.
 * ------------------------------------------------------------------ */

export type ReadinessAnswerId =
  | "implemented_evidence"
  | "implemented_no_evidence"
  | "partial"
  | "planned"
  | "not_implemented"
  | "not_sure"
  | "na";

/** Answer → score value (spec §23.1). "na" is excluded from the denominator. */
export const READINESS_POINTS: Record<Exclude<ReadinessAnswerId, "na">, number> = {
  implemented_evidence: 1,
  implemented_no_evidence: 0.65,
  partial: 0.35,
  planned: 0.15,
  not_implemented: 0,
  not_sure: 0,
};

export const READINESS_DOMAINS = [
  "governance-qms",
  "risk-management",
  "data-governance",
  "technical-documentation",
  "transparency-instructions",
  "human-oversight",
  "accuracy-robustness-security",
  "conformity-registration",
  "post-market-incidents",
  "ai-literacy",
] as const;
export type ReadinessDomain = (typeof READINESS_DOMAINS)[number];

/** Provider high-risk weighting (SpritaScore methodology, spec §23.2). */
export const DOMAIN_WEIGHTS: Record<ReadinessDomain, number> = {
  "risk-management": 15,
  "accuracy-robustness-security": 15,
  "data-governance": 14,
  "governance-qms": 12,
  "technical-documentation": 12,
  "human-oversight": 10,
  "transparency-instructions": 8,
  "conformity-registration": 7,
  "post-market-incidents": 5,
  "ai-literacy": 2,
};

export interface ReadinessControlMeta {
  id: string;
  domain: ReadinessDomain;
  /** When missing (not_implemented / not_sure), caps the overall score. */
  critical?: boolean;
}

export const READINESS_CONTROLS: ReadinessControlMeta[] = [
  { id: "GOV1", domain: "governance-qms", critical: true }, // QMS
  { id: "GOV2", domain: "governance-qms" },
  { id: "RISK1", domain: "risk-management", critical: true },
  { id: "RISK2", domain: "risk-management" },
  { id: "DATA1", domain: "data-governance" },
  { id: "DATA2", domain: "data-governance" },
  { id: "DOC1", domain: "technical-documentation", critical: true },
  { id: "DOC2", domain: "technical-documentation" },
  { id: "TRANS1", domain: "transparency-instructions" },
  { id: "TRANS2", domain: "transparency-instructions" },
  { id: "HUM1", domain: "human-oversight", critical: true },
  { id: "HUM2", domain: "human-oversight" },
  { id: "SEC1", domain: "accuracy-robustness-security", critical: true },
  { id: "SEC2", domain: "accuracy-robustness-security" },
  { id: "CONF1", domain: "conformity-registration", critical: true },
  { id: "CONF2", domain: "conformity-registration" },
  { id: "POST1", domain: "post-market-incidents" },
  { id: "POST2", domain: "post-market-incidents" },
  { id: "LIT1", domain: "ai-literacy" },
];

/* ------------------------------------------------------------------ *
 * Readiness levels & evidence bands (spec §25 / §26).
 * ------------------------------------------------------------------ */

export type ReadinessLevel =
  | "critical"
  | "initial"
  | "developing"
  | "managed"
  | "advanced"
  | "review-ready";

export function getReadinessLevel(score: number): ReadinessLevel {
  if (score < 20) return "critical";
  if (score < 40) return "initial";
  if (score < 60) return "developing";
  if (score < 80) return "managed";
  if (score < 95) return "advanced";
  return "review-ready";
}

export type EvidenceBand =
  | "insufficient"
  | "fragmented"
  | "moderate"
  | "solid"
  | "prepared";

export function getEvidenceBand(coverage: number): EvidenceBand {
  if (coverage < 30) return "insufficient";
  if (coverage < 60) return "fragmented";
  if (coverage < 80) return "moderate";
  if (coverage < 95) return "solid";
  return "prepared";
}

export type ConfidenceLevel = "high" | "medium" | "low";

/* ------------------------------------------------------------------ *
 * Date engine — key obligation groups (spec §5). Statuses are computed
 * against the assessment date, never hard-coded.
 * ------------------------------------------------------------------ */

export type ObligationStatus = "in-force" | "transition" | "future";

export interface ObligationGroup {
  id: string;
  legalSource: string;
  effectiveFrom: string; // ISO date
  /** Which classification verdicts make this group relevant. */
  appliesTo: (verdict: ClassificationVerdict, roles: OperatorRole[]) => boolean;
}

export const OBLIGATION_GROUPS: ObligationGroup[] = [
  {
    id: "prohibited",
    legalSource: "Art. 5",
    effectiveFrom: "2025-02-02",
    appliesTo: () => true,
  },
  {
    id: "ai-literacy",
    legalSource: "Art. 4",
    effectiveFrom: "2025-02-02",
    appliesTo: () => true,
  },
  {
    id: "gpai",
    legalSource: "Art. 53–55",
    effectiveFrom: "2025-08-02",
    appliesTo: (v) => v === "gpai" || v === "gpai-systemic",
  },
  {
    id: "transparency",
    legalSource: "Art. 50",
    effectiveFrom: "2026-08-02",
    appliesTo: (v) =>
      v === "transparency" ||
      v === "high-risk-annex-iii" ||
      v === "high-risk-annex-i",
  },
  {
    id: "high-risk-annex-iii",
    legalSource: "Art. 6.2 · Annex III",
    effectiveFrom: "2027-12-02",
    appliesTo: (v) => v === "high-risk-annex-iii" || v === "possible-6-3-exception",
  },
  {
    id: "high-risk-annex-i",
    legalSource: "Art. 6.1 · Annex I",
    effectiveFrom: "2028-08-02",
    appliesTo: (v) => v === "high-risk-annex-i",
  },
];

export function obligationStatus(
  effectiveFrom: string,
  assessmentDate: string
): ObligationStatus {
  return effectiveFrom <= assessmentDate ? "in-force" : "future";
}

/* ------------------------------------------------------------------ *
 * Complementary assessments (spec §22) — surfaced as alerts.
 * ------------------------------------------------------------------ */

export const COMPLEMENTARY_ASSESSMENTS = [
  "gdpr-dpia",
  "fria",
  "nis2",
  "dora",
  "cra",
  "medical-devices",
  "sector-safety",
] as const;
export type ComplementaryAssessment = (typeof COMPLEMENTARY_ASSESSMENTS)[number];

/* ------------------------------------------------------------------ *
 * Gap prioritization levels (spec §28).
 * ------------------------------------------------------------------ */
export type GapPriority = "P0" | "P1" | "P2" | "P3";

/* ------------------------------------------------------------------ *
 * Calculator card (registered in CALCULATOR_CONFIGS).
 * ------------------------------------------------------------------ */
export const EU_AI_ACT_CARD = {
  id: "eu-ai-act-compliance" as const,
  slug: "eu-ai-act-compliance",
  category: "compliance" as const,
  customRoute: EU_AI_ACT_ROUTES.es,
  title: {
    es: "Preparación para el cumplimiento del EU AI Act",
    en: "EU AI Act Compliance Readiness",
    pt: "Preparação para a conformidade com o EU AI Act",
  },
  shortDescription: {
    es: "Clasifique un sistema de IA bajo el EU AI Act, descubra qué obligaciones aplican y mida su preparación con un plan de acción priorizado.",
    en: "Classify an AI system under the EU AI Act, discover which obligations apply, and measure your readiness with a prioritized action plan.",
    pt: "Classifique um sistema de IA sob o EU AI Act, descubra quais obrigações se aplicam e meça sua preparação com um plano de ação priorizado.",
  },
  kicker: {
    es: "Reglamento (UE) 2024/1689 · Clasificación + preparación",
    en: "Regulation (EU) 2024/1689 · Classification + readiness",
    pt: "Regulamento (UE) 2024/1689 · Classificação + preparação",
  },
  badge: {
    es: "Compliance",
    en: "Compliance",
    pt: "Compliance",
  },
  audience: {
    es: "AI Officer · Legal · DPO · Riesgo",
    en: "AI Officer · Legal · DPO · Risk",
    pt: "AI Officer · Jurídico · DPO · Risco",
  },
  ctaLabel: {
    es: "Evaluar mi preparación para el EU AI Act",
    en: "Evaluate my EU AI Act readiness",
    pt: "Avaliar minha preparação para o EU AI Act",
  },
  complexity: "alta" as const,
  estimatedTime: { es: "6 a 8 minutos", en: "6 to 8 minutes", pt: "6 a 8 minutos" },
  featured: true,
  steps: [],
};
