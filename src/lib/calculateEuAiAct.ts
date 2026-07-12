import {
  CLASS_QUESTIONS,
  READINESS_CONTROLS,
  READINESS_DOMAINS,
  READINESS_POINTS,
  DOMAIN_WEIGHTS,
  ROLE_BY_QUESTION,
  OBLIGATION_GROUPS,
  obligationStatus,
  getReadinessLevel,
  getEvidenceBand,
  REGULATORY_CUTOFF,
  type ClassAnswerId,
  type ReadinessAnswerId,
  type AnnexIIIArea,
  type ClassificationVerdict,
  type OperatorRole,
  type ReadinessDomain,
  type ReadinessLevel,
  type EvidenceBand,
  type ConfidenceLevel,
  type ObligationStatus,
  type ComplementaryAssessment,
  type GapPriority,
} from "@/data/euAiAct";

export interface EuAiActAnswers {
  classification: Record<string, ClassAnswerId>;
  annexArea: AnnexIIIArea;
  readiness: Record<string, ReadinessAnswerId>;
}

export interface DomainScore {
  domain: ReadinessDomain;
  score: number | null;
  applicable: boolean;
}

export interface ObligationLine {
  id: string;
  legalSource: string;
  effectiveFrom: string;
  status: ObligationStatus;
}

export interface GapLine {
  priority: GapPriority;
  key: string; // maps to copy.gaps[key]
  domain?: ReadinessDomain;
}

export interface EuAiActResult {
  // Engine A — classification
  verdict: ClassificationVerdict;
  flags: ClassificationVerdict[];
  roles: OperatorRole[];
  roleTransformation: boolean;
  criticalStop: boolean; // prohibited practice
  manualReview: boolean;
  notes: string[]; // note keys (military / rnd / out-of-scope / not-ai / manual-review)
  confidence: ConfidenceLevel;
  confidenceReasons: string[]; // reason keys

  // Engine B — readiness (null when criticalStop)
  readinessScore: number | null;
  readinessLevel: ReadinessLevel | null;
  cappedAt: number | null;
  capReasons: string[]; // reason keys
  domainScores: DomainScore[];
  evidenceCoverage: number;
  evidenceBand: EvidenceBand;

  // Regulatory context
  obligations: ObligationLine[];
  nextRelevantDate: string | null;
  complementary: ComplementaryAssessment[];
  gaps: GapLine[];
  warnings: string[]; // warning keys
}

const PROHIBITED_IDS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];
const HR_CRITICAL_IDS = ["HP1", "HP2", "HU1", "HU2"];

/** Score cap applied when a critical control is missing (spec §24). */
const CONTROL_CAP: Record<string, number> = {
  GOV1: 49,
  RISK1: 49,
  DOC1: 49,
  CONF1: 49,
  HUM1: 59,
  SEC1: 59,
};

const CAP_REASON_BY_CONTROL: Record<string, string> = {
  GOV1: "cap-qms",
  RISK1: "cap-risk",
  DOC1: "cap-doc",
  CONF1: "cap-conformity",
  HUM1: "cap-human",
  SEC1: "cap-security",
};

function isYes(a?: ClassAnswerId) {
  return a === "yes";
}
function isUnsure(a?: ClassAnswerId) {
  return a === "not_sure";
}

function classify(cls: Record<string, ClassAnswerId>, annexArea: AnnexIIIArea) {
  const outOfScope =
    cls.S1 === "no" && cls.S2 === "no" && cls.S3 === "no";

  const prohibitedYes = PROHIBITED_IDS.some((id) => isYes(cls[id]));
  const prohibitedUnsure = PROHIBITED_IDS.some((id) => isUnsure(cls[id]));

  // AI-system definition: purely deterministic with no inference → likely not AI
  const notAi = isYes(cls.D4) && !isYes(cls.D1);

  // Roles
  const roles: OperatorRole[] = [];
  for (const [q, role] of Object.entries(ROLE_BY_QUESTION)) {
    if (isYes(cls[q]) && !roles.includes(role)) roles.push(role);
  }
  const roleTransformation = isYes(cls.R7);
  if (roleTransformation && !roles.includes("provider")) roles.push("provider");

  const gpai = isYes(cls.G1);
  const gpaiSystemic = gpai && isYes(cls.G3);
  const transparency = ["T1", "T2", "T3", "T4"].some((id) => isYes(cls[id]));

  const hrProduct = isYes(cls.HP1) && isYes(cls.HP2);
  const hrUseBase =
    annexArea !== "none" && isYes(cls.HU1) && (isYes(cls.HU2) || isYes(cls.HU3));
  const exceptionQualifies =
    hrUseBase &&
    isYes(cls.EX1) &&
    isYes(cls.EX2) &&
    cls.EX3 === "no" &&
    isYes(cls.EX4) &&
    !isYes(cls.HU3);
  const hrUse = hrUseBase && !exceptionQualifies;

  const flags: ClassificationVerdict[] = [];
  if (prohibitedYes) flags.push("prohibited");
  if (hrProduct) flags.push("high-risk-annex-i");
  if (hrUse) flags.push("high-risk-annex-iii");
  if (exceptionQualifies) flags.push("possible-6-3-exception");
  if (gpaiSystemic) flags.push("gpai-systemic");
  else if (gpai) flags.push("gpai");
  if (transparency) flags.push("transparency");

  let verdict: ClassificationVerdict;
  if (prohibitedYes) verdict = "prohibited";
  else if (outOfScope) verdict = "out-of-scope";
  else if (notAi) verdict = "not-ai-system";
  else if (hrProduct) verdict = "high-risk-annex-i";
  else if (hrUse) verdict = "high-risk-annex-iii";
  else if (exceptionQualifies) verdict = "possible-6-3-exception";
  else if (gpaiSystemic) verdict = "gpai-systemic";
  else if (gpai) verdict = "gpai";
  else if (transparency) verdict = "transparency";
  else verdict = "limited-minimal";

  const manualReview =
    !prohibitedYes &&
    (prohibitedUnsure ||
      isUnsure(cls.D1) ||
      isUnsure(cls.HP1) ||
      isUnsure(cls.HU1) ||
      (notAi && (isUnsure(cls.D1) || cls.D1 == null)));

  const notes: string[] = [];
  if (outOfScope) notes.push("out-of-scope");
  if (isYes(cls.S4)) notes.push("military");
  if (isYes(cls.S5)) notes.push("rnd");
  if (notAi) notes.push("not-ai");
  if (manualReview) notes.push("manual-review");

  return {
    verdict,
    flags,
    roles,
    roleTransformation,
    prohibitedYes,
    prohibitedUnsure,
    hrProduct,
    hrUse,
    hrUseBase,
    exceptionQualifies,
    gpai,
    gpaiSystemic,
    transparency,
    manualReview,
    notes,
    annexArea,
  };
}

function computeConfidence(
  cls: Record<string, ClassAnswerId>,
  rd: Record<string, ReadinessAnswerId>,
  a: ReturnType<typeof classify>
): { confidence: ConfidenceLevel; reasons: string[] } {
  const reasons: string[] = [];

  // classification unknowns
  const answeredClass = CLASS_QUESTIONS.filter((q) => cls[q.id]);
  const unknownClass = answeredClass.filter((q) => cls[q.id] === "not_sure");

  // readiness unknowns (exclude na)
  const answeredRd = READINESS_CONTROLS.filter(
    (c) => rd[c.id] && rd[c.id] !== "na"
  );
  const unknownRd = answeredRd.filter((c) => rd[c.id] === "not_sure");

  const answered = answeredClass.length + answeredRd.length;
  const unknown = unknownClass.length + unknownRd.length;
  const ratio = answered > 0 ? unknown / answered : 0;

  const criticalUnknown =
    a.prohibitedUnsure ||
    HR_CRITICAL_IDS.some((id) => cls[id] === "not_sure");

  let confidence: ConfidenceLevel = "high";
  if (ratio > 0.2) {
    confidence = "low";
    reasons.push("many-unknowns");
  } else if (ratio >= 0.05) {
    confidence = "medium";
    reasons.push("some-unknowns");
  }
  if (criticalUnknown) {
    confidence = confidence === "low" ? "low" : "medium";
    reasons.push("critical-unknown");
  }
  if (a.manualReview && confidence === "high") {
    confidence = "medium";
    reasons.push("manual-review");
  }
  return { confidence, reasons };
}

function computeReadiness(rd: Record<string, ReadinessAnswerId>, applyCaps: boolean) {
  const domainScores: DomainScore[] = [];

  for (const domain of READINESS_DOMAINS) {
    const controls = READINESS_CONTROLS.filter((c) => c.domain === domain);
    let obtained = 0;
    let possible = 0;
    for (const c of controls) {
      const a = rd[c.id];
      if (!a || a === "na") continue;
      obtained += READINESS_POINTS[a];
      possible += 1;
    }
    domainScores.push({
      domain,
      score: possible > 0 ? Math.round((obtained / possible) * 100) : null,
      applicable: possible > 0,
    });
  }

  let acc = 0;
  let totalW = 0;
  for (const d of domainScores) {
    if (d.applicable && d.score != null) {
      acc += d.score * DOMAIN_WEIGHTS[d.domain];
      totalW += DOMAIN_WEIGHTS[d.domain];
    }
  }
  const rawOverall = totalW > 0 ? Math.round(acc / totalW) : 0;

  // Critical caps (spec §24) — only apply to high-risk providers.
  const capReasons: string[] = [];
  let cap = 100;
  if (applyCaps) {
    for (const c of READINESS_CONTROLS) {
      if (!c.critical) continue;
      const a = rd[c.id];
      const missing = !a || a === "not_implemented" || a === "not_sure";
      if (missing && CONTROL_CAP[c.id] != null) {
        if (CONTROL_CAP[c.id] < cap) cap = CONTROL_CAP[c.id];
        capReasons.push(CAP_REASON_BY_CONTROL[c.id]);
      }
    }
  }
  const cappedAt = cap < 100 ? cap : null;
  const overall = Math.min(rawOverall, cap);

  // Evidence coverage (spec §26)
  const applicable = READINESS_CONTROLS.filter(
    (c) => rd[c.id] && rd[c.id] !== "na"
  );
  const withEvidence = applicable.filter(
    (c) => rd[c.id] === "implemented_evidence"
  );
  const coverage =
    applicable.length > 0
      ? Math.round((withEvidence.length / applicable.length) * 100)
      : 0;

  return {
    domainScores,
    overall,
    cappedAt,
    capReasons: [...new Set(capReasons)],
    evidenceCoverage: coverage,
  };
}

function computeComplementary(
  a: ReturnType<typeof classify>,
  cls: Record<string, ClassAnswerId>
): ComplementaryAssessment[] {
  const set = new Set<ComplementaryAssessment>();
  const isHighRisk = a.hrProduct || a.hrUse;

  if (
    isYes(cls.T3) ||
    ["biometrics", "employment", "essential-services", "law-enforcement", "migration"].includes(
      a.annexArea
    ) ||
    isHighRisk
  ) {
    set.add("gdpr-dpia");
  }
  if (
    a.roles.includes("deployer") &&
    (a.hrUse ||
      ["essential-services", "education", "employment", "law-enforcement", "migration", "justice-democracy"].includes(
        a.annexArea
      ))
  ) {
    set.add("fria");
  }
  if (a.annexArea === "critical-infrastructure") set.add("nis2");
  if (a.annexArea === "essential-services") set.add("dora");
  if (a.hrProduct || a.roles.includes("product-manufacturer")) {
    set.add("cra");
    set.add("medical-devices");
    set.add("sector-safety");
  }
  return [...set];
}

function computeGaps(
  a: ReturnType<typeof classify>,
  rd: Record<string, ReadinessAnswerId>,
  complementary: ComplementaryAssessment[]
): GapLine[] {
  const gaps: GapLine[] = [];
  const isHighRisk = a.hrProduct || a.hrUse;
  const missing = (id: string) => {
    const v = rd[id];
    return !v || v === "not_implemented" || v === "not_sure";
  };
  const weak = (id: string) => {
    const v = rd[id];
    return !v || v === "not_implemented" || v === "not_sure" || v === "planned" || v === "partial";
  };

  // P0 — immediate suspension / review
  if (a.prohibitedYes) gaps.push({ priority: "P0", key: "prohibited-practice" });
  if (isHighRisk && missing("CONF1"))
    gaps.push({ priority: "P0", key: "high-risk-no-basis", domain: "conformity-registration" });
  if (isHighRisk && missing("HUM1"))
    gaps.push({ priority: "P0", key: "no-human-oversight", domain: "human-oversight" });
  if (a.roleTransformation)
    gaps.push({ priority: "P0", key: "role-change" });

  // P1 — before placing on market / using (high-risk provider obligations)
  if (isHighRisk && a.manualReview)
    gaps.push({ priority: "P1", key: "classification-undocumented" });
  if (isHighRisk && missing("RISK1"))
    gaps.push({ priority: "P1", key: "no-risk-management", domain: "risk-management" });
  if (isHighRisk && missing("DOC1"))
    gaps.push({ priority: "P1", key: "no-technical-documentation", domain: "technical-documentation" });
  if (isHighRisk && missing("GOV1"))
    gaps.push({ priority: "P1", key: "no-qms", domain: "governance-qms" });
  if (isHighRisk && weak("CONF2"))
    gaps.push({ priority: "P1", key: "registration-pending", domain: "conformity-registration" });
  if (complementary.includes("fria"))
    gaps.push({ priority: "P1", key: "fria-required" });
  if (isHighRisk && missing("SEC1"))
    gaps.push({ priority: "P1", key: "insufficient-security", domain: "accuracy-robustness-security" });

  // P2 — next 30–90 days
  const gpai = a.gpai || a.gpaiSystemic;
  if (isHighRisk && weak("SEC2"))
    gaps.push({ priority: "P2", key: "accuracy-metrics", domain: "accuracy-robustness-security" });
  if (isHighRisk && (weak("DATA1") || weak("DATA2")))
    gaps.push({ priority: "P2", key: "data-governance", domain: "data-governance" });
  if ((isHighRisk || gpai) && weak("POST1"))
    gaps.push({ priority: "P2", key: "incident-management", domain: "post-market-incidents" });
  if ((isHighRisk || a.transparency) && weak("TRANS1"))
    gaps.push({ priority: "P2", key: "instructions", domain: "transparency-instructions" });

  // P3 — continuous improvement
  if (weak("LIT1"))
    gaps.push({ priority: "P3", key: "ai-literacy", domain: "ai-literacy" });
  if (weak("POST2"))
    gaps.push({ priority: "P3", key: "monitoring", domain: "post-market-incidents" });

  const order: GapPriority[] = ["P0", "P1", "P2", "P3"];
  return gaps
    .sort((x, y) => order.indexOf(x.priority) - order.indexOf(y.priority))
    .slice(0, 10);
}

export function calculateEuAiAct(
  answers: EuAiActAnswers,
  assessmentDate: string = REGULATORY_CUTOFF
): EuAiActResult {
  const cls = answers.classification ?? {};
  const rd = answers.readiness ?? {};
  const a = classify(cls, answers.annexArea ?? "none");
  const criticalStop = a.prohibitedYes;

  const { confidence, reasons: confidenceReasons } = computeConfidence(cls, rd, a);

  const isHighRiskProvider = (a.hrProduct || a.hrUse) && a.roles.includes("provider");
  const readiness = criticalStop ? null : computeReadiness(rd, isHighRiskProvider);

  const readinessScore = readiness ? readiness.overall : null;
  const readinessLevel = readiness ? getReadinessLevel(readiness.overall) : null;
  const evidenceCoverage = readiness ? readiness.evidenceCoverage : 0;
  const evidenceBand = getEvidenceBand(evidenceCoverage);

  // Obligations (date engine)
  const obligations: ObligationLine[] = OBLIGATION_GROUPS.filter((g) =>
    g.appliesTo(a.verdict, a.roles)
  )
    .map((g) => ({
      id: g.id,
      legalSource: g.legalSource,
      effectiveFrom: g.effectiveFrom,
      status: obligationStatus(g.effectiveFrom, assessmentDate),
    }))
    .sort((x, y) => x.effectiveFrom.localeCompare(y.effectiveFrom));

  const futureDates = obligations
    .filter((o) => o.status === "future")
    .map((o) => o.effectiveFrom)
    .sort();
  const nextRelevantDate = futureDates[0] ?? null;

  const complementary = computeComplementary(a, cls);
  const gaps = computeGaps(a, rd, complementary);

  // Warnings (spec §29.6)
  const warnings: string[] = [];
  const isHighRisk = a.hrProduct || a.hrUse;
  if (a.roleTransformation) warnings.push("role-change");
  if (criticalStop || isHighRisk || a.manualReview) warnings.push("legal-review");
  if (complementary.includes("gdpr-dpia")) warnings.push("dpia");
  if (complementary.includes("fria")) warnings.push("fria");
  if (complementary.includes("sector-safety")) warnings.push("sector-review");
  if (isHighRisk) {
    warnings.push("registration");
    warnings.push("conformity");
  }

  return {
    verdict: a.verdict,
    flags: a.flags,
    roles: a.roles,
    roleTransformation: a.roleTransformation,
    criticalStop,
    manualReview: a.manualReview,
    notes: a.notes,
    confidence,
    confidenceReasons,
    readinessScore,
    readinessLevel,
    cappedAt: readiness ? readiness.cappedAt : null,
    capReasons: readiness ? readiness.capReasons : [],
    domainScores: readiness ? readiness.domainScores : [],
    evidenceCoverage,
    evidenceBand,
    obligations,
    nextRelevantDate,
    complementary,
    gaps,
    warnings,
  };
}
