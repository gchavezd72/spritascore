import type { LocalizedText, Locale, RiskLevel } from "@/types/calculator";
import { tr } from "@/lib/translate";

export const RISK_LEVELS: Record<
  RiskLevel,
  { min: number; max: number; label: LocalizedText; color: string }
> = {
  bajo: { min: 0, max: 30, label: { es: "Bajo", en: "Low", pt: "Baixo" }, color: "#22c55e" },
  moderado: { min: 31, max: 55, label: { es: "Moderado", en: "Moderate", pt: "Moderado" }, color: "#eab308" },
  alto: { min: 56, max: 75, label: { es: "Alto", en: "High", pt: "Alto" }, color: "#f97316" },
  critico: { min: 76, max: 100, label: { es: "Crítico", en: "Critical", pt: "Crítico" }, color: "#ef4444" },
};

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return "bajo";
  if (score <= 55) return "moderado";
  if (score <= 75) return "alto";
  return "critico";
}

export function getRiskLevelLabel(level: RiskLevel, locale: Locale = "es"): string {
  return tr(RISK_LEVELS[level].label, locale);
}