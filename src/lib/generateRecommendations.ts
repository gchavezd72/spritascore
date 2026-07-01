import { getRecommendationByTitle } from "@/data/recommendations";
import type {
  CalculatorId,
  Recommendation,
  RiskLevel,
} from "@/types/calculator";

interface RecommendationContext {
  calculatorId: CalculatorId;
  score: number;
  riskLevel: RiskLevel;
  inputs: Record<string, unknown>;
  riskFactors: string[];
}

function pickUnique(recommendations: Recommendation[], limit = 8): Recommendation[] {
  const seen = new Set<string>();
  const result: Recommendation[] = [];
  for (const rec of recommendations) {
    if (!seen.has(rec.title)) {
      seen.add(rec.title);
      result.push(rec);
    }
    if (result.length >= limit) break;
  }
  return result;
}

export function generateRecommendations(
  context: RecommendationContext
): {
  all: Recommendation[];
  immediate: Recommendation[];
  days30: Recommendation[];
  days90: Recommendation[];
} {
  const { score, riskLevel, inputs } = context;
  const titles: string[] = [];

  if (riskLevel === "critico") {
    titles.push("Diagnóstico técnico inmediato");
  }

  if (score > 75) {
    titles.push("Plan de remediación ejecutivo (30 días)");
  } else if (score >= 50) {
    titles.push("Roadmap de reducción de riesgo (60 días)");
  } else {
    titles.push("Monitoreo preventivo y baseline de calidad");
  }

  const dataTypes = (inputs.dataTypes as string[]) ?? [];
  const exposure = inputs.exposure as string;
  if (
    dataTypes.length > 0 &&
    (exposure === "publica" || exposure === "api-publica" || exposure === "externa")
  ) {
    titles.push("Revisar controles de acceso y autorización");
    titles.push("Fortalecer monitoreo y logging de seguridad");
  }

  if (
    inputs.appType === "legacy" ||
    (inputs.codeAge as number) > 5 ||
    inputs.linesOfCode === ">5m"
  ) {
    titles.push("Medir y gestionar deuda técnica");
  }

  if (context.calculatorId === "iso-quality") {
    titles.push("Implementar análisis estático de código (SAST)");
    titles.push("Automatizar quality gates en CI/CD");
    titles.push("Mapear hallazgos contra ISO/IEC 25010");
    titles.push("Definir KPIs ejecutivos de calidad");
    titles.push("Gobierno de calidad de código");
  }

  if (context.calculatorId === "owasp-web") {
    titles.push("Implementar SCA y SBOM");
    titles.push("Validar configuración segura");
    titles.push("Pruebas de seguridad recurrentes");
  }

  if (context.calculatorId === "owasp-mobile") {
    titles.push("Revisar almacenamiento local en apps móviles");
    if (inputs.thirdPartySdks === "si" || inputs.thirdPartySdks === true) {
      titles.push("Análisis de supply chain móvil");
    }
    titles.push("Protección contra ingeniería inversa");
  }

  const controls = (inputs.controls as string[]) ?? [];
  if (controls.includes("none") || controls.length === 0) {
    titles.push("Evaluación de madurez de seguridad");
  }

  if (controls.includes("none") === false && inputs.sector) {
    const regulatedSectors = ["banca", "fintech", "salud", "gobierno", "farmaceutica", "energia"];
    if (regulatedSectors.includes(inputs.sector as string)) {
      titles.push("Evidencia técnica para auditorías");
    }
  }

  if (context.calculatorId === "sector") {
    titles.push("Evidencia técnica para auditorías");
    titles.push("Pruebas de seguridad recurrentes");
  }

  const all = pickUnique(titles.map(getRecommendationByTitle), 8);

  return {
    all,
    immediate: all.filter((r) => r.timeframe === "inmediato"),
    days30: all.filter((r) => r.timeframe === "30-dias"),
    days90: all.filter(
      (r) => r.timeframe === "60-dias" || r.timeframe === "90-dias"
    ),
  };
}