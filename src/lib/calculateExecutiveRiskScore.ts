import {
  EXECUTIVE_ANSWER_POINTS,
  EXECUTIVE_QUESTION_META,
  WEAK_CATEGORY_PRIORITY,
  type ExecutiveAnswerId,
  type ExecutiveWeakCategory,
} from "@/data/executiveSoftwareRiskScore";
import { getExecutiveCopy } from "@/i18n/executive";
import type { Locale } from "@/types/calculator";

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
  recommendations: { category: ExecutiveWeakCategory; label: string; text: string }[];
}

export function getAnswerPoints(answerId: ExecutiveAnswerId): number {
  return EXECUTIVE_ANSWER_POINTS[answerId] ?? 0;
}

export function getMaturityLevel(rawPoints: number): ExecutiveMaturityLevel {
  if (rawPoints >= 13) return "low";
  if (rawPoints >= 9) return "moderate";
  if (rawPoints >= 5) return "high";
  return "critical";
}

export function calculateExecutiveRiskScore(
  answers: Record<string, ExecutiveAnswerId>,
  locale: Locale = "en"
): ExecutiveScoreResult {
  const copy = getExecutiveCopy(locale);
  let rawMaturityPoints = 0;

  for (const question of EXECUTIVE_QUESTION_META) {
    const answer = answers[question.id];
    rawMaturityPoints += answer ? getAnswerPoints(answer) : 0;
  }

  const maturityPercent = Math.round((rawMaturityPoints / 15) * 100);
  const riskExposureScore = Math.round(((15 - rawMaturityPoints) / 15) * 1000);
  const level = getMaturityLevel(rawMaturityPoints);
  const levelConfig = copy.levels[level];

  const weakCounts = new Map<ExecutiveWeakCategory, number>();

  for (const question of EXECUTIVE_QUESTION_META) {
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
      return WEAK_CATEGORY_PRIORITY.indexOf(a[0]) - WEAK_CATEGORY_PRIORITY.indexOf(b[0]);
    })
    .slice(0, 3)
    .map(([category]) => category);

  const recommendations = topWeakCategories.map((category) => ({
    category,
    label: copy.weakCategories[category],
    text: copy.recommendations[category],
  }));

  return {
    rawMaturityPoints,
    maturityPercent,
    riskExposureScore,
    level,
    levelLabel: levelConfig.label,
    exposureLabel: levelConfig.exposure,
    interpretation: levelConfig.interpretation,
    topWeakCategories,
    recommendations,
  };
}