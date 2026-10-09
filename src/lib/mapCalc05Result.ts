import { getRiskLevel } from "@/data/riskRanges";
import { formatImpact, type Calc05Input, type Calc05Result } from "@/lib/calc05";
import type {
  CalculationResult,
  Currency,
  Locale,
  Recommendation,
  RiskLevel,
} from "@/types/calculator";

const CLASS_TO_RISK: Record<Calc05Result["classification"], RiskLevel> = {
  low: "bajo",
  medium: "moderado",
  high: "alto",
  critical: "critico",
};

/** Calc05 score is 0–1000 (1000 = safer). Platform risk score is 0–100 (higher = worse). */
export function calc05ToPlatformScore(spritaScore: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - spritaScore / 10)));
}

function rec(
  id: string,
  title: { es: string; en: string; pt: string },
  description: { es: string; en: string; pt: string },
  priority: Recommendation["priority"],
  timeframe: Recommendation["timeframe"],
  area: Recommendation["area"] = "seguridad",
  type: Recommendation["type"] = "tecnica"
): Recommendation {
  return {
    id,
    title,
    description,
    priority,
    effort: priority === "critica" ? "alto" : priority === "alta" ? "medio" : "bajo",
    impact: priority === "critica" || priority === "alta" ? "alto" : "medio",
    timeframe,
    area,
    type,
  };
}

function recommendationsFor(
  input: Calc05Input,
  bullets: string[]
): Recommendation[] {
  const list: Recommendation[] = [];

  if (bullets.includes("ia_prod") || input.ia === 3) {
    list.push(
      rec(
        "ia-governance",
        {
          es: "Gobernanza de código asistido por IA",
          en: "AI-assisted code governance",
          pt: "Governança de código assistido por IA",
        },
        {
          es: "Hipótesis ligada a la respuesta de IA en producción: defina políticas de asistentes de código, exija revisión humana y registre la procedencia. El uso de IA no demuestra por sí solo que falte trazabilidad.",
          en: "Hypothesis tied to the production-AI answer: define coding-assistant policies, require human review, and record provenance. AI use alone does not prove missing traceability.",
          pt: "Hipótese ligada à resposta de IA em produção: defina políticas de assistentes de código, exija revisão humana e registre a proveniência. O uso de IA não demonstra sozinho que falte rastreabilidade.",
        },
        "critica",
        "inmediato",
        "desarrollo",
        "operativa"
      )
    );
  }

  if (bullets.includes("no_sca") || input.sca >= 2) {
    list.push(
      rec(
        "sca-sbom",
        {
          es: "Automatizar SCA y generar SBOM en CI/CD",
          en: "Automate SCA and generate SBOMs in CI/CD",
          pt: "Automatizar SCA e gerar SBOM no CI/CD",
        },
        {
          es: "Hipótesis ligada a la respuesta sin SCA: integre análisis de composición en cada build. No tener SCA no demuestra que no exista un SBOM; verifíquelo antes de afirmarlo.",
          en: "Hypothesis tied to the no-SCA answer: integrate composition analysis on every build. Lacking SCA does not prove there is no SBOM; check that before stating it.",
          pt: "Hipótese ligada à resposta sem SCA: integre análise de composição em cada build. Não ter SCA não demonstra que não exista um SBOM; verifique antes de afirmá-lo.",
        },
        "critica",
        "30-dias",
        "seguridad",
        "tecnica"
      )
    );
  }

  if (bullets.includes("incident") || input.hist === 2) {
    list.push(
      rec(
        "incident-readiness",
        {
          es: "Fortalecer respuesta a incidentes de aplicaciones",
          en: "Strengthen application incident response",
          pt: "Fortalecer resposta a incidentes de aplicações",
        },
        {
          es: "Documente runbooks, contactos y SLAs de contención. Ejecute un tabletop trimestral y conecte alertas de AppSec con el proceso de IR del negocio.",
          en: "Document runbooks, contacts, and containment SLAs. Run a quarterly tabletop and connect AppSec alerts to the business IR process.",
          pt: "Documente runbooks, contatos e SLAs de contenção. Execute um tabletop trimestral e conecte alertas de AppSec ao processo de IR do negócio.",
        },
        "alta",
        "30-dias",
        "seguridad",
        "operativa"
      )
    );
  }

  if (bullets.includes("basic_mat") || input.mat <= 2) {
    list.push(
      rec(
        "appsec-program",
        {
          es: "Establecer un programa AppSec mínimo viable",
          en: "Establish a minimum viable AppSec program",
          pt: "Estabelecer um programa AppSec mínimo viável",
        },
        {
          es: "Asigne un owner de seguridad de aplicaciones, defina estándares de secure coding, y priorice SAST + secret scanning en repositorios críticos antes de expandir a todo el portafolio.",
          en: "Assign an application-security owner, define secure-coding standards, and prioritize SAST + secret scanning on critical repos before expanding portfolio-wide.",
          pt: "Designe um owner de segurança de aplicações, defina padrões de secure coding e priorize SAST + secret scanning em repositórios críticos antes de expandir o portfólio.",
        },
        "alta",
        "60-dias",
        "direccion",
        "ejecutiva"
      )
    );
  }

  if (bullets.includes("high_vol") || input.vol >= 3) {
    list.push(
      rec(
        "data-protection",
        {
          es: "Reducir superficie de datos sensibles",
          en: "Reduce sensitive-data surface",
          pt: "Reduzir superfície de dados sensíveis",
        },
        {
          es: "Ligado al volumen declarado: clasifique datos, minimice retención y cifre. La ley aplicable se cita solo cuando el país y el mercado estén declarados.",
          en: "Tied to the declared volume: classify data, minimize retention, and encrypt. Cite a statute only once the country and market are declared.",
          pt: "Ligado ao volume declarado: classifique dados, minimize retenção e criptografe. Cite uma lei só quando o país e o mercado estiverem declarados.",
        },
        "alta",
        "30-dias",
        "cumplimiento",
        "regulatoria"
      )
    );
  }

  if (bullets.includes("reg_sector") || input.sector === "fintech" || input.sector === "saude") {
    list.push(
      rec(
        "regulated-evidence",
        {
          es: "Empaquetar evidencia para clientes y reguladores",
          en: "Package evidence for customers and regulators",
          pt: "Empacotar evidências para clientes e reguladores",
        },
        {
          es: "Prepare un paquete de due diligence: mapa de datos, controles AppSec, SLAs de parcheo, inventario de proveedores y registro de incidentes. Reduce fricción comercial en sectores regulados.",
          en: "Prepare a due-diligence pack: data map, AppSec controls, patch SLAs, vendor inventory, and incident log. Reduces sales friction in regulated sectors.",
          pt: "Prepare um pacote de due diligence: mapa de dados, controles AppSec, SLAs de patch, inventário de fornecedores e registro de incidentes. Reduz fricção comercial em setores regulados.",
        },
        "media",
        "90-dias",
        "cumplimiento",
        "regulatoria"
      )
    );
  }

  list.push(
    rec(
      "aspm-visibility",
      {
        es: "Unificar hallazgos con enfoque ASPM",
        en: "Unify findings with an ASPM approach",
        pt: "Unificar achados com abordagem ASPM",
      },
      {
        es: "Correlacione SAST, SCA, DAST y secretos en un backlog priorizado por explotabilidad y criticidad de negocio para recortar el tiempo de triage y el costo de no remediar a tiempo.",
        en: "Correlate SAST, SCA, DAST, and secrets into a backlog prioritized by exploitability and business criticality to cut triage time and the cost of late remediation.",
        pt: "Correlacione SAST, SCA, DAST e segredos em um backlog priorizado por explorabilidade e criticidade de negócio para reduzir tempo de triagem e o custo de não remediar a tempo.",
      },
      "media",
      "90-dias",
      "seguridad",
      "tecnica"
    ),
    rec(
      "technical-diagnosis",
      {
        es: "Validar exposición con diagnóstico técnico SpritaScore",
        en: "Validate exposure with a SpritaScore technical diagnosis",
        pt: "Validar exposição com diagnóstico técnico SpritaScore",
      },
      {
        es: "Esta estimación orienta presupuesto y prioridad. Un diagnóstico técnico sobre código, dependencias y controles de release convierte el score en un plan accionable con evidencias para dirección.",
        en: "This estimate guides budget and priority. A technical diagnosis of code, dependencies, and release controls turns the score into an actionable plan with board-ready evidence.",
        pt: "Esta estimativa orienta orçamento e prioridade. Um diagnóstico técnico de código, dependências e controles de release transforma o score em um plano acionável com evidências para a direção.",
      },
      "media",
      "inmediato",
      "direccion",
      "ejecutiva"
    )
  );

  // Dedupe by id, keep order
  const seen = new Set<string>();
  return list.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

function summaries(
  input: Calc05Input,
  result: Calc05Result,
  locale: Locale,
  impactFormatted: string
): { executive: string; partial: string; factors: string[] } {
  const sectorLabels: Record<string, Record<Locale, string>> = {
    saude: { es: "salud", en: "healthcare", pt: "saúde" },
    tech: { es: "tecnología / SaaS", en: "technology / SaaS", pt: "tecnologia / SaaS" },
    fintech: { es: "fintech / banca", en: "fintech / banking", pt: "fintech / bancos" },
    seguros: { es: "seguros", en: "insurance", pt: "seguros" },
    varejo: { es: "retail / e-commerce", en: "retail / e-commerce", pt: "varejo / e-commerce" },
    industria: { es: "industria / energía", en: "industry / energy", pt: "indústria / energia" },
    publico: { es: "sector público", en: "public sector", pt: "setor público" },
    outro: { es: "su sector", en: "your sector", pt: "seu setor" },
  };
  const sector = sectorLabels[input.sector]?.[locale] ?? input.sector;
  const classLabel = {
    low: { es: "bajo", en: "low", pt: "baixo" },
    medium: { es: "medio", en: "medium", pt: "médio" },
    high: { es: "alto", en: "high", pt: "alto" },
    critical: { es: "crítico", en: "critical", pt: "crítico" },
  }[result.classification][locale];

  const exposure = calc05ToPlatformScore(result.score);
  const rateNote =
    result.currency === "USD"
      ? locale === "en"
        ? " USD figures use 1 BRL = 0.18 USD (August 2026 reference)."
        : locale === "pt"
          ? " Os valores em USD usam 1 BRL = 0,18 USD (referência de agosto de 2026)."
          : " Las cifras en USD usan 1 BRL = 0,18 USD (referencia de agosto de 2026)."
      : "";
  const partial =
    locale === "en"
      ? `Estimated exposure of ${impactFormatted} for a ${sector} profile (exposure ${exposure}/100, where 100 is worse · ${classLabel} risk).${rateNote}`
      : locale === "pt"
        ? `Exposição estimada de ${impactFormatted} para um perfil de ${sector} (exposição ${exposure}/100, em que 100 é pior · risco ${classLabel}).${rateNote}`
        : `Exposición estimada de ${impactFormatted} para un perfil de ${sector} (exposición ${exposure}/100, donde 100 es peor · riesgo ${classLabel}).${rateNote}`;

  const executive =
    locale === "en"
      ? `Based on six operational questions, your organization in the ${sector} sector shows ${classLabel} application-risk exposure (${exposure}/100, where 100 is worse). Modeled financial exposure is approximately ${impactFormatted}.${rateNote} The figure is calibrated by declared record volume, generative-AI use, SCA maturity, AppSec maturity, and incident history. AI use does not prove missing authorship traceability, and the absence of SCA does not prove there is no SBOM. This is a planning estimate, not a penetration test or a legal opinion. Contact info@sprita-it.com for a technical diagnosis.`
      : locale === "pt"
        ? `Com base em seis perguntas operacionais, sua organização no setor de ${sector} apresenta exposição de risco de aplicações ${classLabel} (${exposure}/100, em que 100 é pior). A exposição financeira modelada é de aproximadamente ${impactFormatted}.${rateNote} O valor é calibrado por volume de registros, uso de IA generativa, maturidade de SCA, maturidade AppSec e histórico de incidentes. O uso de IA não prova falta de rastreabilidade de autoria, e a ausência de SCA não prova que não exista um SBOM. É uma estimativa de planejamento, não um pentest nem um parecer jurídico. Contate info@sprita-it.com para um diagnóstico técnico.`
        : `Con base en seis preguntas operativas, su organización en el sector de ${sector} presenta una exposición de riesgo de aplicaciones ${classLabel} (${exposure}/100, donde 100 es peor). La exposición financiera modelada es de aproximadamente ${impactFormatted}.${rateNote} La cifra se calibra con el volumen de registros, el uso de IA generativa, la madurez de SCA, la madurez AppSec y el historial de incidentes. El uso de IA no demuestra falta de trazabilidad de autoría, y la ausencia de SCA no demuestra que no exista un SBOM. Es una estimación de planificación, no un pentest ni una opinión legal. Contacte info@sprita-it.com para un diagnóstico técnico.`;

  // Risk factors will be resolved with i18n bullets in the caller via copy
  return { executive, partial, factors: result.bullets };
}

export function mapCalc05ToCalculationResult(
  input: Calc05Input,
  result: Calc05Result,
  locale: Locale,
  bulletTexts: string[]
): CalculationResult {
  const platformScore = calc05ToPlatformScore(result.score);
  const riskLevel = CLASS_TO_RISK[result.classification] ?? getRiskLevel(platformScore);
  const impact = result.currency === "USD" ? result.impactUSD : result.impactBRL;
  const currency = result.currency as Currency;
  const impactFormatted = formatImpact(result);
  const { executive, partial } = summaries(input, result, locale, impactFormatted);
  const recs = recommendationsFor(input, result.bullets);

  const costItems =
    locale === "en"
      ? [
          { label: "Base exposure (sector × volume)", value: Math.round(impact * 0.45) },
          { label: "Regulatory pressure (sector assumption, not a cited statute)", value: Math.round(impact * 0.2) },
          { label: "AI & supply-chain amplification", value: Math.round(impact * 0.2) },
          { label: "Maturity & incident history", value: Math.round(impact * 0.15) },
        ]
      : locale === "pt"
        ? [
            { label: "Exposição base (setor × volume)", value: Math.round(impact * 0.45) },
            { label: "Pressão regulatória (suposto de setor, sem lei citada)", value: Math.round(impact * 0.2) },
            { label: "Amplificação IA e cadeia de suprimentos", value: Math.round(impact * 0.2) },
            { label: "Maturidade e histórico de incidentes", value: Math.round(impact * 0.15) },
          ]
        : [
            { label: "Exposición base (sector × volumen)", value: Math.round(impact * 0.45) },
            { label: "Presión regulatoria (supuesto de sector, sin ley citada)", value: Math.round(impact * 0.2) },
            { label: "Amplificación IA y cadena de suministro", value: Math.round(impact * 0.2) },
            { label: "Madurez e historial de incidentes", value: Math.round(impact * 0.15) },
          ];

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `calc05-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id,
    calculatorId: "sector",
    score: platformScore,
    riskLevel,
    cost: {
      min: Math.round(impact * 0.45),
      probable: Math.round(impact),
      max: Math.round(impact * 1.85),
      items: costItems,
    },
    impactMatrix: {
      financial: Math.min(100, Math.round(platformScore * 1.05)),
      technical: Math.min(100, Math.round(40 + (input.sca - 1) * 18 + (input.ia - 1) * 12)),
      operational: Math.min(100, Math.round(35 + (4 - input.mat) * 15)),
      regulatory: Math.min(
        100,
        Math.round(
          40 +
            (input.sector === "fintech" || input.sector === "saude" ? 25 : 10) +
            (input.vol - 1) * 10
        )
      ),
      reputational: Math.min(100, Math.round(30 + (input.hist === 2 ? 25 : 10) + platformScore * 0.3)),
    },
    riskFactors: bulletTexts,
    recommendations: recs,
    immediateActions: recs.filter((r) => r.timeframe === "inmediato").slice(0, 4),
    actions30Days: recs.filter((r) => r.timeframe === "30-dias").slice(0, 4),
    actions90Days: recs
      .filter((r) => r.timeframe === "60-dias" || r.timeframe === "90-dias")
      .slice(0, 4),
    executiveSummary: executive,
    partialSummary: partial,
    inputs: {
      ...input,
      spritaScore: result.score,
      classification: result.classification,
      impactBRL: result.impactBRL,
      impactUSD: result.impactUSD,
      impactFormatted,
      calculator: "calc05",
    },
    currency,
    locale,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}
