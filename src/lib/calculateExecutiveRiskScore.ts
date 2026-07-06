import {
  EXECUTIVE_ANSWERS,
  EXECUTIVE_QUESTIONS,
  WEAK_CATEGORY_PRIORITY,
  WEAK_CATEGORY_RECOMMENDATIONS,
  type ExecutiveAnswerId,
  type ExecutiveWeakCategory,
} from "@/data/executiveSoftwareRiskScore";

export type ExecutiveMaturityLevel = "low" | "moderate" | "high" | "critical";

export interface ExecutiveScoreResult {
  rawMaturityPoints: number;
  maturityPercent: number;
  riskExposureScore: number;
  level: ExecutiveMaturityLevel;
  levelLabel: string;
  exposureLabel: string;
  interpretation: string;
  topWeakCategories: ExecutiveWeakCategory[];
  recommendations: { category: ExecutiveWeakCategory; text: string }[];
}

const LEVEL_CONFIG: Record<
  ExecutiveMaturityLevel,
  { label: string; exposure: string; interpretation: string }
> = {
  low: {
    label: "Mature visibility",
    exposure: "Low",
    interpretation:
      "Software risk appears governed with mature controls and evidence.",
  },
  moderate: {
    label: "Partial visibility",
    exposure: "Moderate",
    interpretation:
      "Controls exist, but blind spots remain across ownership, evidence, AI code, vendor code, or dependencies.",
  },
  high: {
    label: "High exposure",
    exposure: "High",
    interpretation:
      "Significant weaknesses may affect audit readiness, operational resilience, or remediation discipline.",
  },
  critical: {
    label: "Critical blind spots",
    exposure: "Critical",
    interpretation:
      "The organization likely lacks sufficient visibility into software-related risk.",
  },
};

export function getAnswerPoints(answerId: ExecutiveAnswerId): number {
  return EXECUTIVE_ANSWERS.find((a) => a.id === answerId)?.maturityPoints ?? 0;
}

export function getMaturityLevel(rawPoints: number): ExecutiveMaturityLevel {
  if (rawPoints >= 13) return "low";
  if (rawPoints >= 9) return "moderate";
  if (rawPoints >= 5) return "high";
  return "critical";
}

export function calculateExecutiveRiskScore(
  answers: Record<string, ExecutiveAnswerId>
): ExecutiveScoreResult {
  let rawMaturityPoints = 0;

  for (const question of EXECUTIVE_QUESTIONS) {
    const answer = answers[question.id];
    rawMaturityPoints += answer ? getAnswerPoints(answer) : 0;
  }

  const maturityPercent = Math.round((rawMaturityPoints / 15) * 100);
  const riskExposureScore = Math.round(((15 - rawMaturityPoints) / 15) * 1000);
  const level = getMaturityLevel(rawMaturityPoints);
  const config = LEVEL_CONFIG[level];

  const weakCounts = new Map<ExecutiveWeakCategory, number>();

  for (const question of EXECUTIVE_QUESTIONS) {
    const answer = answers[question.id];
    if (answer === "no" || answer === "not_sure") {
      weakCounts.set(
        question.weakCategory,
        (weakCounts.get(question.weakCategory) ?? 0) + 1
      );
    }
  }

  const topWeakCategories = [...weakCounts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return (
        WEAK_CATEGORY_PRIORITY.indexOf(a[0]) - WEAK_CATEGORY_PRIORITY.indexOf(b[0])
      );
    })
    .slice(0, 3)
    .map(([category]) => category);

  const recommendations = topWeakCategories.map((category) => ({
    category,
    text: WEAK_CATEGORY_RECOMMENDATIONS[category],
  }));

  return {
    rawMaturityPoints,
    maturityPercent,
    riskExposureScore,
    level,
    levelLabel: config.label,
    exposureLabel: config.exposure,
    interpretation: config.interpretation,
    topWeakCategories,
    recommendations,
  };
}