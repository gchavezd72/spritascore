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

const OWASP_WEB_LEAD: Record<"2025" | "2021", Record<string, string>> = {
  "2025": {
    A01: "controles-acceso-revisar",
    A02: "config-segura-validar",
    A03: "sca-implementar",
    A04: "config-segura-validar",
    A05: "dast-implementar",
    A06: "sast-implementar",
    A07: "controles-acceso-revisar",
    A08: "sbom-mantener",
    A09: "monitoreo-logging-fortalecer",
    A10: "config-segura-validar",
  },
  "2021": {
    A01: "controles-acceso-revisar",
    A02: "config-segura-validar",
    A03: "dast-implementar",
    A04: "sast-implementar",
    A05: "config-segura-validar",
    A06: "sca-implementar",
    A07: "controles-acceso-revisar",
    A08: "sbom-mantener",
    A09: "monitoreo-logging-fortalecer",
    A10: "dast-implementar",
  },
};

function owaspWebLeadKey(raw: unknown): string | undefined {
  const value = String(raw ?? "").trim();
  if (!value) return undefined;
  const edition = value.startsWith("2025:") ? "2025" : "2021";
  const id = value.includes(":") ? value.slice(value.indexOf(":") + 1) : value;
  return OWASP_WEB_LEAD[edition][id];
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
  const generic: string[] = [];

  if (riskLevel === "critico") {
    generic.push("diagnostico-inmediato");
  }

  if (score > 75) {
    generic.push("plan-remediacion-30d");
  } else if (score >= 50) {
    generic.push("roadmap-riesgo-60d");
  } else {
    generic.push("monitoreo-preventivo-baseline");
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
    const lead = owaspWebLeadKey(inputs.owaspCategory);
    if (lead) keys.push(lead);
    if (inputs.exploitationLevel === "explotada" || inputs.exploitationLevel === "explotada-fuga") {
      keys.push("diagnostico-inmediato");
    }
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
    const encryption = String(inputs.localEncryption ?? "");
    const storage = String(inputs.insecureStorage ?? "");
    if (encryption === "no" || storage === "si") {
      keys.push("almacenamiento-local-movil");
    }
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
    if (!controls.includes("sbom") && !controls.includes("sca")) {
      keys.push("sbom-mantener");
    }
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
    const low = (fields: string[]) =>
      fields.some((field) => {
        const value = Number(inputs[field]);
        return Number.isFinite(value) && value <= 2;
      });
    if (low(["q1", "q2", "q3", "q4"])) {
      keys.push("dora-marco-riesgos");
      keys.push("dora-inventario-activos");
    }
    if (low(["q5", "q6", "q7"])) keys.push("dora-reporte-incidentes");
    if (low(["q8", "q9"])) {
      keys.push("dora-pruebas-resiliencia");
      keys.push("dast-implementar");
    }
    if (low(["q10", "q11", "q12"])) keys.push("dora-proveedores-tic");
    if (low(["q13", "q14", "q15"])) keys.push("dora-cultura-resiliencia");
    if (low(["q1", "q2", "q3", "q4", "q8", "q9"])) {
      keys.push("dora-analisis-codigo");
      keys.push("sast-implementar");
      keys.push("sca-implementar");
    }
    if (low(Array.from({ length: 15 }, (_, index) => `q${index + 1}`))) {
      keys.push("vuln-management-programa");
      keys.push("quality-gates-cicd");
    }
  }

  keys.push(...generic);

  const timeframeOrder = { inmediato: 0, "30-dias": 1, "60-dias": 2, "90-dias": 3 } as const;
  const all = pickUnique(keys.map(getRecommendationByKey), 16)
    .sort((a, b) => timeframeOrder[a.timeframe] - timeframeOrder[b.timeframe])
    .slice(0, 10);

  return {
    all,
    immediate: all.filter((r) => r.timeframe === "inmediato"),
    days30: all.filter((r) => r.timeframe === "30-dias"),
    days90: all.filter(
      (r) => r.timeframe === "60-dias" || r.timeframe === "90-dias"
    ),
  };
}
