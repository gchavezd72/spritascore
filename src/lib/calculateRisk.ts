import { getRiskLevel } from "@/data/riskRanges";
import type { ImpactMatrix, RiskLevel } from "@/types/calculator";

export function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function calculateRiskScore(factors: {
  technicalSeverity?: number;
  exposure?: number;
  sensitiveData?: number;
  exploitability?: number;
  businessCriticality?: number;
  exposureTime?: number;
  detectionMaturity?: number;
  responseCapacity?: number;
  qualityGaps?: number;
  sectorMultiplier?: number;
}): { score: number; riskLevel: RiskLevel } {
  const weights = {
    technicalSeverity: 0.15,
    exposure: 0.12,
    sensitiveData: 0.12,
    exploitability: 0.13,
    businessCriticality: 0.12,
    exposureTime: 0.1,
    detectionMaturity: 0.08,
    responseCapacity: 0.08,
    qualityGaps: 0.1,
  };

  let score = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const value = factors[key as keyof typeof factors];
    if (value !== undefined) {
      score += value * weight;
      totalWeight += weight;
    }
  }

  if (factors.sectorMultiplier && factors.sectorMultiplier > 1) {
    score *= Math.min(factors.sectorMultiplier / 2, 1.3);
  }

  const normalized = totalWeight > 0 ? score / totalWeight : score;
  const finalScore = clampScore(normalized);
  return { score: finalScore, riskLevel: getRiskLevel(finalScore) };
}

export function buildImpactMatrix(params: {
  financial: number;
  technical: number;
  operational: number;
  regulatory: number;
  reputational: number;
}): ImpactMatrix {
  return {
    financial: clampScore(params.financial),
    technical: clampScore(params.technical),
    operational: clampScore(params.operational),
    regulatory: clampScore(params.regulatory),
    reputational: clampScore(params.reputational),
  };
}

export const EXPLOITATION_SCORES: Record<string, number> = {
  teorica: 20,
  detectada: 40,
  exploitable: 65,
  explotada: 85,
  "explotada-fuga": 100,
};

export const EXPOSURE_SCORES: Record<string, number> = {
  interna: 25,
  externa: 55,
  publica: 80,
  "api-publica": 90,
};

export const OPERATIONAL_IMPACT_SCORES: Record<string, number> = {
  ninguna: 10,
  degradacion: 40,
  parcial: 70,
  total: 100,
};

export const DEPENDENCY_SCORES: Record<string, number> = {
  bajo: 25,
  medio: 50,
  alto: 75,
  critico: 95,
};

export const ENVIRONMENT_SCORES: Record<string, number> = {
  desarrollo: 15,
  testing: 35,
  produccion: 90,
};