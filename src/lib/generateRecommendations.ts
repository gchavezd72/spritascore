import { getRecommendationByKey } from "@/data/recommendations";
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

function pickUnique(recommendations: Recommendation[], limit = 10): Recommendation[] {
  const seen = new Set<string>();
  const result: Recommendation[] = [];
  for (const rec of recommendations) {
    if (!seen.has(rec.id)) {
      seen.add(rec.id);
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
  const keys: string[] = [];

  if (riskLevel === "critico") {
    keys.push("diagnostico-inmediato");
  }

  if (score > 75) {
    keys.push("plan-remediacion-30d");
  } else if (score >= 50) {
    keys.push("roadmap-riesgo-60d");
  } else {
    keys.push("monitoreo-preventivo-baseline");
  }

  const dataTypes = (inputs.dataTypes as string[]) ?? [];
  const exposure = inputs.exposure as string;
  if (
    dataTypes.length > 0 &&
    (exposure === "publica" || exposure === "api-publica" || exposure === "externa")
  ) {
    keys.push("controles-acceso-revisar");
    keys.push("monitoreo-logging-fortalecer");
  }

  if (
    inputs.appType === "legacy" ||
    (inputs.codeAge as number) > 5 ||
    inputs.linesOfCode === ">5m"
  ) {
    keys.push("deuda-tecnica-medir");
  }

  if (context.calculatorId === "iso-quality") {
    keys.push("sast-implementar");
    keys.push("quality-gates-cicd");
    keys.push("iso25010-mapeo");
    keys.push("kpis-calidad-definir");
    keys.push("gobierno-calidad-codigo");
    keys.push("sbom-mantener");
    keys.push("secure-coding-capacitacion");
  }

  if (context.calculatorId === "owasp-web") {
    keys.push("sca-implementar");
    keys.push("sbom-mantener");
    keys.push("dast-implementar");
    keys.push("config-segura-validar");
    keys.push("pruebas-seguridad-recurrentes");
    keys.push("vuln-management-programa");
    if (inputs.environment === "produccion") {
      keys.push("iast-adoptar");
    }
  }

  if (context.calculatorId === "owasp-mobile") {
    keys.push("almacenamiento-local-movil");
    keys.push("sca-implementar");
    if (inputs.thirdPartySdks === "si" || inputs.thirdPartySdks === true) {
      keys.push("supply-chain-movil");
      keys.push("sbom-mantener");
    }
    keys.push("ingenieria-inversa-proteccion");
    keys.push("vuln-management-programa");
  }

  const controls = (inputs.controls as string[]) ?? [];
  if (controls.includes("none") || controls.length === 0) {
    keys.push("madurez-seguridad-evaluacion");
  }

  if (controls.includes("none") === false && inputs.sector) {
    const regulatedSectors = ["banca", "fintech", "salud", "gobierno", "farmaceutica", "energia"];
    if (regulatedSectors.includes(inputs.sector as string)) {
      keys.push("evidencia-auditorias");
    }
  }

  if (context.calculatorId === "sector") {
    keys.push("evidencia-auditorias");
    keys.push("pruebas-seguridad-recurrentes");
    keys.push("aspm-consolidar");
    keys.push("sbom-mantener");
    keys.push("vuln-management-programa");
  }

  if (context.calculatorId === "aspm-cost") {
    keys.push("aspm-consolidar");
    keys.push("explotabilidad-priorizar");
    keys.push("herramientas-redundantes-eliminar");
    keys.push("sbom-mantener");
    keys.push("vuln-management-programa");
    keys.push("quality-gates-cicd");
  }

  if (context.calculatorId === "cra-compliance") {
    keys.push("cra-reporte-incidentes");
    keys.push("sbom-mantener");
    keys.push("vuln-management-programa");
    keys.push("sca-implementar");
    keys.push("sast-implementar");
    keys.push("dast-implementar");
    keys.push("cra-expediente-tecnico");
    keys.push("cra-periodo-soporte");
    keys.push("aspm-consolidar");
  }

  if (context.calculatorId === "dora-compliance") {
    keys.push("dora-marco-riesgos");
    keys.push("dora-inventario-activos");
    keys.push("dora-pruebas-resiliencia");
    keys.push("dora-proveedores-tic");
    keys.push("dora-reporte-incidentes");
    keys.push("dora-analisis-codigo");
    keys.push("dora-cultura-resiliencia");
    keys.push("sast-implementar");
    keys.push("dast-implementar");
    keys.push("sca-implementar");
    keys.push("vuln-management-programa");
    keys.push("quality-gates-cicd");
  }

  const all = pickUnique(keys.map(getRecommendationByKey), 10);

  return {
    all,
    immediate: all.filter((r) => r.timeframe === "inmediato"),
    days30: all.filter((r) => r.timeframe === "30-dias"),
    days90: all.filter(
      (r) => r.timeframe === "60-dias" || r.timeframe === "90-dias"
    ),
  };
}
