import type { RiskLevel } from "@/types/calculator";

export const RISK_LEVELS: Record<
  RiskLevel,
  { min: number; max: number; label: string; color: string }
> = {
  bajo: { min: 0, max: 30, label: "Bajo", color: "#22c55e" },
  moderado: { min: 31, max: 55, label: "Moderado", color: "#eab308" },
  alto: { min: 56, max: 75, label: "Alto", color: "#f97316" },
  critico: { min: 76, max: 100, label: "Crítico", color: "#ef4444" },
};

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return "bajo";
  if (score <= 55) return "moderado";
  if (score <= 75) return "alto";
  return "critico";
}

export function getRiskLevelLabel(level: RiskLevel): string {
  return RISK_LEVELS[level].label;
}