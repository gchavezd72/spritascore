import { getOwaspCategory } from "@/data/owaspTop10";
import { getMobileCategory } from "@/data/owaspMobileTop10";
import {
  CRITICALITY_FACTORS,
  ISO_25010_DIMENSIONS,
  MATURITY_FACTORS,
  dimensionRiskScore,
  getQualityMaturityLevel,
} from "@/data/isoQualityModel";
import {
  DATA_SENSITIVITY_MULTIPLIERS,
  EXPOSURE_MULTIPLIERS,
  MATURITY_MULTIPLIERS,
  REGULATION_MULTIPLIERS,
  getSector,
} from "@/data/sectorRiskFactors";
import {
  DEPENDENCY_LEVELS,
  EXPLOITATION_LEVELS,
  EXPOSURE_LEVELS,
  MATURITY_LEVELS,
  PRODUCT_CATEGORIES,
  REGULATIONS,
} from "@/data/commonOptions";
import type { CalculationResult, CalculatorId, Currency, Locale, LocalizedText } from "@/types/calculator";
import { generateId } from "@/lib/utils";
import { pickLocale, tr } from "@/lib/translate";
import {
  buildImpactMatrix,
  calculateRiskScore,
  clampScore,
  DEPENDENCY_SCORES,
  ENVIRONMENT_SCORES,
  EXPLOITATION_SCORES,
  EXPOSURE_SCORES,
  OPERATIONAL_IMPACT_SCORES,
} from "@/lib/calculateRisk";
import { generateRecommendations } from "@/lib/generateRecommendations";
import { formatCurrency } from "@/lib/formatCurrency";
import { getRiskLevel, getRiskLevelLabel } from "@/data/riskRanges";

function num(val: unknown, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

function str(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback;
}

/** Resolve a raw enum value to its human-readable, localized label. */
function labelOf(
  options: readonly { value: string; label: LocalizedText }[],
  value: string,
  locale: Locale
): string {
  const opt = options.find((o) => o.value === value);
  return opt ? tr(opt.label, locale) : value;
}

const PLATFORM_LABELS: Record<string, LocalizedText> = {
  ios: { es: "iOS", en: "iOS", pt: "iOS" },
  android: { es: "Android", en: "Android", pt: "Android" },
  ambas: { es: "iOS y Android", en: "iOS and Android", pt: "iOS e Android" },
};

const ENVIRONMENT_LABELS: Record<string, LocalizedText> = {
  desarrollo: { es: "Desarrollo", en: "Development", pt: "Desenvolvimento" },
  testing: { es: "Testing", en: "Testing", pt: "Testes" },
  produccion: { es: "Producción", en: "Production", pt: "Produção" },
};

export function calculateIsoQuality(
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  const devCost = num(inputs.devMonthlyCost, 5000);
  const devCount = num(inputs.devCount, 5);
  const bugHours = num(inputs.bugHours, 8);
  const supportHours = num(inputs.supportHours, 4);
  const reworkHours = num(inputs.reworkHours, 6);
  const incidents = num(inputs.monthlyIncidents, 3);

  const hourlyRate = devCost / 160;
  const monthlyHours = (bugHours + supportHours + reworkHours) * 4.33;
  const criticality = str(inputs.softwareDependency, "medio");
  const critFactor = CRITICALITY_FACTORS[criticality] ?? 1.3;

  const qualityRatings: number[] = [];
  const dimensionRisks: { name: string; risk: number }[] = [];
  let unknownDimensions = 0;

  for (const dim of ISO_25010_DIMENSIONS) {
    const rating = num(inputs[dim.id], 0);
    if (rating < 1) {
      unknownDimensions += 1;
      continue;
    }
    qualityRatings.push(rating);
    dimensionRisks.push({
      name: pickLocale(locale, { es: dim.nameEs, en: dim.name, pt: dim.namePt }),
      risk: dimensionRiskScore(rating, dim.weight),
    });
  }

  const avgQuality =
    qualityRatings.length > 0
      ? qualityRatings.reduce((a, b) => a + b, 0) / qualityRatings.length
      : null;
  const maturityLevel = avgQuality == null ? null : getQualityMaturityLevel(avgQuality);
  const maturityFactor = maturityLevel == null ? 1 : (MATURITY_FACTORS[maturityLevel] ?? 1.2);

  const monthlyCost = monthlyHours * hourlyRate * critFactor * maturityFactor;
  const annualCost = monthlyCost * 12;
  const perDevCost = devCount > 0 ? annualCost / devCount : annualCost;

  const incidentFactor = Math.min(incidents * 3, 30);
  const qualityGapScore =
    dimensionRisks.length > 0
      ? dimensionRisks.reduce((s, d) => s + d.risk, 0) / dimensionRisks.length
      : 0;

  const { score, riskLevel } = calculateRiskScore({
    technicalSeverity: qualityGapScore,
    businessCriticality: DEPENDENCY_SCORES[criticality] ?? 50,
    qualityGaps: qualityGapScore,
    detectionMaturity: avgQuality == null ? 50 : 100 - avgQuality * 20,
    responseCapacity: Math.max(20, 100 - incidentFactor * 2),
  });

  const topDimensions = [...dimensionRisks]
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 3)
    .map((d) => d.name);

  const criticalityLabel = labelOf(DEPENDENCY_LEVELS, criticality, locale);
  const riskFactors = pickLocale(locale, {
    es: [
      topDimensions.length > 0
        ? `Deuda técnica concentrada en: ${topDimensions.join(", ")}`
        : "Sin indicadores ISO declarados. No se aplicó un punto medio como evidencia técnica",
      `${incidents} incidentes al mes en promedio`,
      `${bugHours + supportHours + reworkHours} horas/semana del equipo (total, no por persona) en bugs, soporte y retrabajo`,
      unknownDimensions > 0
        ? `${unknownDimensions} indicadores ISO en «No sé»: no se usaron como evidencia ni como un punto medio`
        : `Indicadores ISO declarados. El costo reparte el total del equipo entre ${devCount} desarrolladores y no multiplica las horas por persona`,
      `Dependencia del negocio del software: ${criticalityLabel}`,
    ],
    en: [
      topDimensions.length > 0
        ? `Technical debt concentrated in: ${topDimensions.join(", ")}`
        : "No ISO indicators declared. A midpoint was not used as technical evidence",
      `${incidents} incidents per month on average`,
      `${bugHours + supportHours + reworkHours} team hours/week (total, not per person) on bugs, support, and rework`,
      unknownDimensions > 0
        ? `${unknownDimensions} ISO indicators left as “Don't know”: they were not used as evidence or as a midpoint`
        : `Declared ISO indicators. Cost splits the team total across ${devCount} developers and does not multiply hours per person`,
      `Business dependency on software: ${criticalityLabel}`,
    ],
    pt: [
      topDimensions.length > 0
        ? `Dívida técnica concentrada em: ${topDimensions.join(", ")}`
        : "Sem indicadores ISO declarados. Não se usou um ponto médio como evidência técnica",
      `${incidents} incidentes por mês em média`,
      `${bugHours + supportHours + reworkHours} horas/semana da equipe (total, não por pessoa) em bugs, suporte e retrabalho`,
      unknownDimensions > 0
        ? `${unknownDimensions} indicadores ISO em «Não sei»: não foram usados como evidência nem como ponto médio`
        : `Indicadores ISO declarados. O custo reparte o total da equipe entre ${devCount} desenvolvedores e não multiplica as horas por pessoa`,
      `Dependência do negócio no software: ${criticalityLabel}`,
    ],
  });

  const impactMatrix = buildImpactMatrix({
    financial: score * 0.9,
    technical: qualityGapScore,
    operational: DEPENDENCY_SCORES[criticality] ?? 50,
    regulatory: criticality === "critico" ? 70 : 40,
    reputational: score * 0.6,
  });

  const recs = generateRecommendations({
    calculatorId: "iso-quality",
    score,
    riskLevel,
    inputs,
    riskFactors,
  });

  const levelLabel = getRiskLevelLabel(riskLevel, locale);

  return {
    id: generateId(),
    calculatorId: "iso-quality",
    score,
    riskLevel,
    currency,
    cost: {
      monthly: monthlyCost,
      annual: annualCost,
      perDeveloper: perDevCost,
      min: annualCost * 0.7,
      probable: annualCost,
      max: annualCost * 1.5,
      items: pickLocale(locale, {
        es: [
          { label: "Corrección de bugs", value: bugHours * 4.33 * hourlyRate * 12 },
          { label: "Soporte por defectos", value: supportHours * 4.33 * hourlyRate * 12 },
          { label: "Retrabajo", value: reworkHours * 4.33 * hourlyRate * 12 },
          { label: "Factor de criticidad", value: annualCost - monthlyHours * hourlyRate * 12 },
        ],
        en: [
          { label: "Bug fixing", value: bugHours * 4.33 * hourlyRate * 12 },
          { label: "Defect support", value: supportHours * 4.33 * hourlyRate * 12 },
          { label: "Rework", value: reworkHours * 4.33 * hourlyRate * 12 },
          { label: "Criticality factor", value: annualCost - monthlyHours * hourlyRate * 12 },
        ],
        pt: [
          { label: "Correção de bugs", value: bugHours * 4.33 * hourlyRate * 12 },
          { label: "Suporte por defeitos", value: supportHours * 4.33 * hourlyRate * 12 },
          { label: "Retrabalho", value: reworkHours * 4.33 * hourlyRate * 12 },
          { label: "Fator de criticidade", value: annualCost - monthlyHours * hourlyRate * 12 },
        ],
      }),
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: pickLocale(locale, {
      es: `Con base en los datos ingresados, su aplicación presenta un nivel de riesgo ${levelLabel}. El costo estimado de no calidad se encuentra entre ${formatCurrency(annualCost * 0.7, currency)} y ${formatCurrency(annualCost * 1.5, currency)}, con un escenario probable de ${formatCurrency(annualCost, currency)} anuales. Los principales factores de riesgo son: ${riskFactors.slice(0, 2).join("; ")}.`,
      en: `Based on the information provided, your application shows a ${levelLabel} risk level. The estimated cost of poor quality ranges between ${formatCurrency(annualCost * 0.7, currency)} and ${formatCurrency(annualCost * 1.5, currency)}, with a probable scenario of ${formatCurrency(annualCost, currency)} per year. The main risk factors are: ${riskFactors.slice(0, 2).join("; ")}.`,
      pt: `Com base nos dados informados, sua aplicação apresenta um nível de risco ${levelLabel}. O custo estimado de má qualidade está entre ${formatCurrency(annualCost * 0.7, currency)} e ${formatCurrency(annualCost * 1.5, currency)}, com um cenário provável de ${formatCurrency(annualCost, currency)} por ano. Os principais fatores de risco são: ${riskFactors.slice(0, 2).join("; ")}.`,
    }),
    partialSummary: pickLocale(locale, {
      es: `Nivel de riesgo ${levelLabel} (exposición ${score}/100). Costo anual de no calidad: ${formatCurrency(annualCost, currency, true)}.`,
      en: `${levelLabel} risk level (exposure ${score}/100). Annual cost of poor quality: ${formatCurrency(annualCost, currency, true)}.`,
      pt: `Nível de risco ${levelLabel} (exposição ${score}/100). Custo anual de má qualidade: ${formatCurrency(annualCost, currency, true)}.`,
    }),
    methodNote: pickLocale(locale, {
      es: "Costo mensual = horas semanales del equipo × 4,33 × (costo mensual por persona / 160) × criticidad × madurez. El número de desarrolladores no multiplica las horas. El mínimo (×0,7) y el máximo (×1,5) son escenarios, no un intervalo de confianza.",
      en: "Monthly cost = team weekly hours × 4.33 × (monthly cost per person / 160) × criticality × maturity. Headcount does not multiply hours. The minimum (×0.7) and maximum (×1.5) are scenarios, not a confidence interval.",
      pt: "Custo mensal = horas semanais da equipe × 4,33 × (custo mensal por pessoa / 160) × criticidade × maturidade. O número de desenvolvedores não multiplica as horas. O mínimo (×0,7) e o máximo (×1,5) são cenários, não um intervalo de confiança.",
    }),
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

export function calculateOwaspWeb(
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  const category = getOwaspCategory(str(inputs.owaspCategory, "2025:A01"));
  const hourlyRate = num(inputs.hourlyRate, 75);
  const remediationDays = num(inputs.remediationDays, 14);
  const exposureDays = num(inputs.exposureDays, 30);
  const userCount = num(inputs.userCount, 10000);
  const sensitiveRecords = num(inputs.sensitiveRecords, 50000);
  const annualRevenue = num(inputs.annualRevenue, 5000000);

  const owasp = category!;
  const remediationHours =
    (owasp.remediationHours.min + owasp.remediationHours.max) / 2;
  const complexity = owasp.complexityFactor;

  const remediationCost = remediationHours * hourlyRate * complexity;
  const investigationCost = remediationCost * 0.4;
  const dailyRevenue = annualRevenue / 365;
  const opImpact = str(inputs.operationalImpact, "degradacion");
  const opPct = (OPERATIONAL_IMPACT_SCORES[opImpact] ?? 40) / 100;
  const interruptionCost = dailyRevenue * remediationDays * opPct * 0.5;

  const dataTypes = (inputs.dataTypes as string[]) ?? ["personal"];
  const dataMultiplier = Math.max(
    ...dataTypes.map((d) => DATA_SENSITIVITY_MULTIPLIERS[d] ?? 1.2)
  );
  const sector = str(inputs.sector, "retail");
  const sectorConfig = getSector(sector);
  const regulatoryCost =
    sensitiveRecords * 0.5 * dataMultiplier * (sectorConfig?.multiplier ?? 1.5);

  const exploitation = str(inputs.exploitationLevel, "exploitable");
  const exploitScore = EXPLOITATION_SCORES[exploitation] ?? 65;
  const reputationalPct = (exploitScore / 100) * 0.08;
  const reputationalCost = annualRevenue * reputationalPct;

  const opportunityCost = interruptionCost * 0.3;
  const monitoringCost = hourlyRate * 40;

  const totalCost =
    remediationCost +
    investigationCost +
    interruptionCost +
    regulatoryCost +
    reputationalCost +
    opportunityCost +
    monitoringCost;

  const exposure = str(inputs.exposure, "externa");
  const environment = str(inputs.environment, "produccion");

  const { score, riskLevel } = calculateRiskScore({
    technicalSeverity: owasp.severityWeight * 10,
    exposure: EXPOSURE_SCORES[exposure] ?? 55,
    sensitiveData: Math.min(100, dataMultiplier * 40),
    exploitability: exploitScore,
    businessCriticality: DEPENDENCY_SCORES[str(inputs.softwareDependency, "alto")] ?? 75,
    exposureTime: Math.min(100, exposureDays * 2),
    detectionMaturity: ENVIRONMENT_SCORES[environment] === 90 ? 40 : 70,
    responseCapacity: remediationDays < 7 ? 70 : 40,
  });

  const owaspName = pickLocale(locale, { es: owasp.nameEs, en: owasp.name, pt: owasp.name });
  const exposureLabel = labelOf(EXPOSURE_LEVELS, exposure, locale);
  const exploitationLabel = labelOf(EXPLOITATION_LEVELS, exploitation, locale);
  const environmentLabel = labelOf(Object.entries(ENVIRONMENT_LABELS).map(([value, label]) => ({ value, label })), environment, locale);
  const riskFactors = pickLocale(locale, {
    es: [
      `Vulnerabilidad OWASP Top 10 ${category?.edition ?? "2021"}${category?.edition === "2021" ? " (histórico)" : ""}: ${owaspName}`,
      `Exposición ${exposureLabel.toLowerCase()} en ${environmentLabel.toLowerCase()} durante ${exposureDays} días`,
      `Nivel de explotación: ${exploitationLabel}`,
      `${sensitiveRecords.toLocaleString()} registros sensibles en riesgo`,
    ],
    en: [
      `OWASP Top 10 ${category?.edition ?? "2021"}${category?.edition === "2021" ? " (historical)" : ""} vulnerability: ${owaspName}`,
      `${exposureLabel} exposure in ${environmentLabel.toLowerCase()} for ${exposureDays} days`,
      `Exploitation level: ${exploitationLabel}`,
      `${sensitiveRecords.toLocaleString()} sensitive records at risk`,
    ],
    pt: [
      `Vulnerabilidade OWASP Top 10 ${category?.edition ?? "2021"}${category?.edition === "2021" ? " (histórico)" : ""}: ${owaspName}`,
      `Exposição ${exposureLabel.toLowerCase()} em ${environmentLabel.toLowerCase()} por ${exposureDays} dias`,
      `Nível de exploração: ${exploitationLabel}`,
      `${sensitiveRecords.toLocaleString()} registros sensíveis em risco`,
    ],
  });

  const impactMatrix = buildImpactMatrix({
    financial: score * 0.85,
    technical: owasp.severityWeight * 10,
    operational: OPERATIONAL_IMPACT_SCORES[opImpact] ?? 40,
    regulatory: dataMultiplier * 35,
    reputational: exploitScore * 0.8,
  });

  const recs = generateRecommendations({
    calculatorId: "owasp-web",
    score,
    riskLevel,
    inputs,
    riskFactors,
  });

  const levelLabel = getRiskLevelLabel(riskLevel, locale);

  return {
    id: generateId(),
    calculatorId: "owasp-web",
    score,
    riskLevel,
    currency,
    cost: {
      min: totalCost * 0.6,
      probable: totalCost,
      max: totalCost * 2,
      remediation: remediationCost,
      investigation: investigationCost,
      interruption: interruptionCost,
      regulatory: regulatoryCost,
      reputational: reputationalCost,
      opportunity: opportunityCost,
      monitoring: monitoringCost,
      items: pickLocale(locale, {
        es: [
          { label: "Remediación técnica", value: remediationCost },
          { label: "Investigación", value: investigationCost },
          { label: "Interrupción operativa", value: interruptionCost },
          { label: "Riesgo regulatorio", value: regulatoryCost },
          { label: "Impacto reputacional", value: reputationalCost },
          { label: "Costo de oportunidad", value: opportunityCost },
          { label: "Monitoreo posterior", value: monitoringCost },
        ],
        en: [
          { label: "Technical remediation", value: remediationCost },
          { label: "Investigation", value: investigationCost },
          { label: "Operational disruption", value: interruptionCost },
          { label: "Regulatory risk", value: regulatoryCost },
          { label: "Reputational impact", value: reputationalCost },
          { label: "Opportunity cost", value: opportunityCost },
          { label: "Post-incident monitoring", value: monitoringCost },
        ],
        pt: [
          { label: "Remediação técnica", value: remediationCost },
          { label: "Investigação", value: investigationCost },
          { label: "Interrupção operacional", value: interruptionCost },
          { label: "Risco regulatório", value: regulatoryCost },
          { label: "Impacto reputacional", value: reputationalCost },
          { label: "Custo de oportunidade", value: opportunityCost },
          { label: "Monitoramento pós-incidente", value: monitoringCost },
        ],
      }),
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: pickLocale(locale, {
      es: `Con base en los datos ingresados, su aplicación presenta un nivel de riesgo ${levelLabel}. El costo estimado de exposición se encuentra entre ${formatCurrency(totalCost * 0.6, currency)} y ${formatCurrency(totalCost * 2, currency)}, con un escenario probable de ${formatCurrency(totalCost, currency)}. Los principales factores de riesgo son: ${riskFactors.slice(0, 2).join("; ")}.`,
      en: `Based on the information provided, your application shows a ${levelLabel} risk level. The estimated exposure cost ranges between ${formatCurrency(totalCost * 0.6, currency)} and ${formatCurrency(totalCost * 2, currency)}, with a probable scenario of ${formatCurrency(totalCost, currency)}. The main risk factors are: ${riskFactors.slice(0, 2).join("; ")}.`,
      pt: `Com base nos dados informados, sua aplicação apresenta um nível de risco ${levelLabel}. O custo estimado de exposição está entre ${formatCurrency(totalCost * 0.6, currency)} e ${formatCurrency(totalCost * 2, currency)}, com um cenário provável de ${formatCurrency(totalCost, currency)}. Os principais fatores de risco são: ${riskFactors.slice(0, 2).join("; ")}.`,
    }),
    partialSummary: pickLocale(locale, {
      es: `Exposición ${score}/100 (${levelLabel}). Pérdida de planificación ${formatCurrency(totalCost, currency, true)}, distinta del costo de remediación.`,
      en: `Exposure ${score}/100 (${levelLabel}). Planning loss ${formatCurrency(totalCost, currency, true)}, separate from remediation cost.`,
      pt: `Exposição ${score}/100 (${levelLabel}). Perda de planejamento ${formatCurrency(totalCost, currency, true)}, distinta do custo de remediação.`,
    }),
    methodNote: pickLocale(locale, {
      es: `La pérdida de planificación suma remediación, investigación, interrupción, riesgo regulatorio, reputación, oportunidad y monitoreo. ${exploitation === "explotada" || exploitation === "explotada-fuga" ? "El usuario declaró un incidente explotado." : "Es un escenario hipotético: el usuario no declaró un incidente confirmado."} El mínimo (×0,6) y el máximo (×2) son escenarios, no un intervalo de confianza. Los pesos de OWASP 2025 reutilizan el modelo 2021 hasta calibración.`,
      en: `Planning loss adds remediation, investigation, interruption, regulatory risk, reputation, opportunity, and monitoring. ${exploitation === "explotada" || exploitation === "explotada-fuga" ? "The user declared an exploited incident." : "This is a hypothetical scenario: the user did not declare a confirmed incident."} The minimum (×0.6) and maximum (×2) are scenarios, not a confidence interval. OWASP 2025 weights reuse the 2021 model until calibrated.`,
      pt: `A perda de planejamento soma remediação, investigação, interrupção, risco regulatório, reputação, oportunidade e monitoramento. ${exploitation === "explotada" || exploitation === "explotada-fuga" ? "O usuário declarou um incidente explorado." : "É um cenário hipotético: o usuário não declarou um incidente confirmado."} O mínimo (×0,6) e o máximo (×2) são cenários, não um intervalo de confiança. Os pesos do OWASP 2025 reutilizam o modelo 2021 até calibração.`,
    }),
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

export function calculateOwaspMobile(
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  const category = getMobileCategory(str(inputs.mobileCategory, "M1"));
  const hourlyRate = num(inputs.hourlyRate, 75);
  const activeUsers = num(inputs.activeUsers, 50000);
  const downloads = num(inputs.downloads, 100000);
  const annualRevenue = num(inputs.annualRevenue, 2000000);

  const mobile = category!;
  const remediationHours =
    (mobile.remediationHours.min + mobile.remediationHours.max) / 2;
  const platform = str(inputs.platform, "ambas");
  const platformFactor =
    platform === "ios"
      ? mobile.platformRisk.ios
      : platform === "android"
        ? mobile.platformRisk.android
        : (mobile.platformRisk.ios + mobile.platformRisk.android) / 2;

  const remediationCost = remediationHours * hourlyRate * platformFactor;
  const publishDays = num(inputs.publishDays, 7);
  const publishCost = publishDays * hourlyRate * 8;
  const supportCost = activeUsers * 0.05 * 2;

  const hasPayments = inputs.hasPayments === "si" || inputs.hasPayments === true;
  const fraudRisk = hasPayments ? activeUsers * 0.02 * 15 : 0;
  const dataExposure = inputs.insecureStorage === "si" ? activeUsers * 0.5 : activeUsers * 0.1;
  const dataExposureCost = dataExposure * 3;

  const userChurnPct = 0.03;
  const userLossCost = activeUsers * userChurnPct * (annualRevenue / Math.max(activeUsers, 1));
  const reputationalCost = annualRevenue * 0.04;

  const sdkRisk =
    inputs.thirdPartySdks === "si" || inputs.thirdPartySdks === true ? 1.4 : 1.0;
  const totalCost =
    (remediationCost + publishCost + supportCost + dataExposureCost + reputationalCost + userLossCost + fraudRisk) *
    sdkRisk;

  const { score, riskLevel } = calculateRiskScore({
    technicalSeverity: mobile.severityWeight * 10,
    exposure: platform === "ambas" ? 75 : 60,
    sensitiveData: hasPayments ? 85 : 55,
    exploitability: inputs.jailbreakDetection === "no" ? 75 : 40,
    businessCriticality: hasPayments ? 85 : 55,
    exposureTime: publishDays * 5,
    detectionMaturity: inputs.localEncryption === "si" ? 50 : inputs.localEncryption === "no_se" ? 65 : 80,
    responseCapacity: num(inputs.updateFrequency, 30) < 14 ? 60 : 35,
  });

  const mobileName = pickLocale(locale, { es: mobile.nameEs, en: mobile.name, pt: mobile.name });
  const platformLabel = PLATFORM_LABELS[platform] ? tr(PLATFORM_LABELS[platform], locale) : platform;
  const riskFactors = pickLocale(locale, {
    es: [
      `Vulnerabilidad móvil: ${mobileName}`,
      `${activeUsers.toLocaleString()} usuarios activos expuestos`,
      `Plataforma: ${platformLabel}`,
      hasPayments ? "Declaró pagos in-app. El modelo suma riesgo de fraude solo en ese caso" : "No declaró pagos in-app. El modelo no suma fraude por ese canal",
      `Descargas declaradas: ${downloads.toLocaleString()}. El costo usa usuarios activos y no vuelve a contar las descargas`,
      inputs.localEncryption === "si"
        ? "Declaró cifrado local. No se recomienda cifrar de nuevo por ese control"
        : inputs.localEncryption === "no_se"
          ? "Cifrado local: no sabe. No se trata como control ausente"
          : "Declaró que no usa cifrado local",
    ],
    en: [
      `Mobile vulnerability: ${mobileName}`,
      `${activeUsers.toLocaleString()} active users exposed`,
      `Platform: ${platformLabel}`,
      hasPayments ? "Declared in-app payments. Fraud risk is added only in that case" : "Did not declare in-app payments. Fraud is not added for that channel",
      `Declared downloads: ${downloads.toLocaleString()}. Cost uses active users and does not count downloads again`,
      inputs.localEncryption === "si"
        ? "Declared local encryption. That control is not recommended again"
        : inputs.localEncryption === "no_se"
          ? "Local encryption: unknown. It is not treated as a missing control"
          : "Declared that local encryption is not used",
    ],
    pt: [
      `Vulnerabilidade móvel: ${mobileName}`,
      `${activeUsers.toLocaleString()} usuários ativos expostos`,
      `Plataforma: ${platformLabel}`,
      hasPayments ? "Declarou pagamentos in-app. O modelo soma risco de fraude só nesse caso" : "Não declarou pagamentos in-app. O modelo não soma fraude por esse canal",
      `Downloads declarados: ${downloads.toLocaleString()}. O custo usa usuários ativos e não conta os downloads de novo`,
      inputs.localEncryption === "si"
        ? "Declarou criptografia local. Esse controle não é recomendado de novo"
        : inputs.localEncryption === "no_se"
          ? "Criptografia local: não sabe. Não é tratada como controle ausente"
          : "Declarou que não usa criptografia local",
    ],
  });

  const impactMatrix = buildImpactMatrix({
    financial: score * 0.8,
    technical: mobile.severityWeight * 10,
    operational: hasPayments ? 75 : 45,
    regulatory: inputs.appType === "salud" || inputs.appType === "banca" ? 80 : 45,
    reputational: score * 0.7,
  });

  const recs = generateRecommendations({
    calculatorId: "owasp-mobile",
    score,
    riskLevel,
    inputs,
    riskFactors,
  });

  const levelLabel = getRiskLevelLabel(riskLevel, locale);

  return {
    id: generateId(),
    calculatorId: "owasp-mobile",
    score,
    riskLevel,
    currency,
    cost: {
      min: totalCost * 0.5,
      probable: totalCost,
      max: totalCost * 2.5,
      perDeveloper: totalCost / Math.max(num(inputs.devCount, 1), 1),
      items: pickLocale(locale, {
        es: [
          { label: "Remediación técnica", value: remediationCost },
          { label: "Republicación en stores", value: publishCost },
          { label: "Soporte a usuarios", value: supportCost },
          { label: "Exposición de datos", value: dataExposureCost },
          { label: "Riesgo de fraude", value: fraudRisk },
          { label: "Pérdida de usuarios", value: userLossCost },
          { label: "Impacto reputacional", value: reputationalCost },
        ],
        en: [
          { label: "Technical remediation", value: remediationCost },
          { label: "App store re-publishing", value: publishCost },
          { label: "User support", value: supportCost },
          { label: "Data exposure", value: dataExposureCost },
          { label: "Fraud risk", value: fraudRisk },
          { label: "User churn", value: userLossCost },
          { label: "Reputational impact", value: reputationalCost },
        ],
        pt: [
          { label: "Remediação técnica", value: remediationCost },
          { label: "Republicação nas lojas", value: publishCost },
          { label: "Suporte ao usuário", value: supportCost },
          { label: "Exposição de dados", value: dataExposureCost },
          { label: "Risco de fraude", value: fraudRisk },
          { label: "Perda de usuários", value: userLossCost },
          { label: "Impacto reputacional", value: reputationalCost },
        ],
      }),
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: pickLocale(locale, {
      es: `Con base en los datos ingresados, su aplicación móvil presenta un nivel de riesgo ${levelLabel}. El costo estimado se encuentra entre ${formatCurrency(totalCost * 0.5, currency)} y ${formatCurrency(totalCost * 2.5, currency)}, con un escenario probable de ${formatCurrency(totalCost, currency)}. Impacto por usuario: ${formatCurrency(totalCost / Math.max(activeUsers, 1), currency)}.`,
      en: `Based on the information provided, your mobile application shows a ${levelLabel} risk level. The estimated cost ranges between ${formatCurrency(totalCost * 0.5, currency)} and ${formatCurrency(totalCost * 2.5, currency)}, with a probable scenario of ${formatCurrency(totalCost, currency)}. Impact per user: ${formatCurrency(totalCost / Math.max(activeUsers, 1), currency)}.`,
      pt: `Com base nos dados informados, seu aplicativo móvel apresenta um nível de risco ${levelLabel}. O custo estimado está entre ${formatCurrency(totalCost * 0.5, currency)} e ${formatCurrency(totalCost * 2.5, currency)}, com um cenário provável de ${formatCurrency(totalCost, currency)}. Impacto por usuário: ${formatCurrency(totalCost / Math.max(activeUsers, 1), currency)}.`,
    }),
    partialSummary: pickLocale(locale, {
      es: `Exposición ${score}/100 (${levelLabel}). Pérdida de planificación ${formatCurrency(totalCost, currency, true)}.`,
      en: `Exposure ${score}/100 (${levelLabel}). Planning loss ${formatCurrency(totalCost, currency, true)}.`,
      pt: `Exposição ${score}/100 (${levelLabel}). Perda de planejamento ${formatCurrency(totalCost, currency, true)}.`,
    }),
    methodNote: pickLocale(locale, {
      es: "El costo de soporte y de pérdida de usuarios usa usuarios activos. Las descargas se muestran como dato declarado y no se suman otra vez. Es un escenario del cuestionario, no un incidente confirmado, salvo que las respuestas lo digan.",
      en: "Support and user-loss cost use active users. Downloads are shown as a declared input and are not added again. This is a questionnaire scenario, not a confirmed incident, unless the answers say so.",
      pt: "O custo de suporte e de perda de usuários usa usuários ativos. Os downloads aparecem como dado declarado e não são somados de novo. É um cenário do questionário, não um incidente confirmado, salvo se as respostas o disserem.",
    }),
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

export function calculateSector(
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  const sectorId = str(inputs.sector, "retail");
  const sector = getSector(sectorId)!;
  const sectorName = tr(sector.name, locale);
  const annualRevenue = num(inputs.annualRevenue, 10000000);
  const monthlyRevenue = num(inputs.monthlyRevenue, annualRevenue / 12);
  const records = num(inputs.recordVolume, 100000);
  const regulation = str(inputs.regulation, "gdpr");
  const maturity = str(inputs.securityMaturity, "basico");
  const exposure = str(inputs.exposure, "externa");
  const dataTypes = (inputs.dataTypes as string[]) ?? ["personal"];

  const baseCost = monthlyRevenue * 0.15;
  const dataMultiplier = Math.max(
    ...dataTypes.map((d) => DATA_SENSITIVITY_MULTIPLIERS[d] ?? 1.2)
  );
  const exposureMult = EXPOSURE_MULTIPLIERS[exposure] ?? 1.4;
  const regulationMult = REGULATION_MULTIPLIERS[regulation] ?? 1.5;
  const maturityMult = MATURITY_MULTIPLIERS[maturity] ?? 1.6;

  const totalCost =
    baseCost *
    sector.multiplier *
    dataMultiplier *
    exposureMult *
    regulationMult *
    maturityMult;

  const recordFactor = Math.min(records / 100000, 3);
  const adjustedCost = totalCost * (1 + recordFactor * 0.2);

  const controls = (inputs.controls as string[]) ?? [];
  const controlPenalty = controls.includes("none") ? 1.3 : controls.length < 3 ? 1.15 : 1.0;
  const finalCost = adjustedCost * controlPenalty;

  const { score, riskLevel } = calculateRiskScore({
    technicalSeverity: sector.multiplier * 30,
    exposure: EXPOSURE_SCORES[exposure] ?? 55,
    sensitiveData: dataMultiplier * 40,
    exploitability: controlPenalty > 1.2 ? 70 : 45,
    businessCriticality: DEPENDENCY_SCORES[str(inputs.appCriticality, "alto")] ?? 75,
    sectorMultiplier: sector.multiplier,
    detectionMaturity: maturityMult < 1 ? 30 : 70,
    responseCapacity: controls.length > 4 ? 60 : 30,
  });

  const regulationLabel = labelOf(REGULATIONS, regulation, locale);
  const maturityLabel = labelOf(MATURITY_LEVELS, maturity, locale);
  const riskFactors = pickLocale(locale, {
    es: [
      `Sector: ${sectorName} (multiplicador de riesgo ${sector.multiplier}x)`,
      `Regulación aplicable: ${regulationLabel}`,
      `Madurez de seguridad: ${maturityLabel}`,
      `${records.toLocaleString()} registros sensibles gestionados`,
    ],
    en: [
      `Sector: ${sectorName} (${sector.multiplier}x risk multiplier)`,
      `Applicable regulation: ${regulationLabel}`,
      `Security maturity: ${maturityLabel}`,
      `${records.toLocaleString()} sensitive records handled`,
    ],
    pt: [
      `Setor: ${sectorName} (multiplicador de risco ${sector.multiplier}x)`,
      `Regulamentação aplicável: ${regulationLabel}`,
      `Maturidade de segurança: ${maturityLabel}`,
      `${records.toLocaleString()} registros sensíveis gerenciados`,
    ],
  });

  const impactMatrix = buildImpactMatrix({
    financial: score * 0.9,
    technical: sector.multiplier * 25,
    operational: DEPENDENCY_SCORES[str(inputs.digitalDependency, "alto")] ?? 70,
    regulatory: regulationMult * 40,
    reputational: score * 0.65,
  });

  const recs = generateRecommendations({
    calculatorId: "sector",
    score,
    riskLevel,
    inputs: { ...inputs, sector: sectorId },
    riskFactors,
  });

  const sectorRecs = sector.recommendations.map((text, i) => ({
    id: `sector-rec-${i}`,
    title: {
      es: `Recomendación sectorial: ${tr(sector.name, "es")}`,
      en: `Sector recommendation: ${tr(sector.name, "en")}`,
    },
    description: text,
    priority: "alta" as const,
    effort: "medio" as const,
    impact: "alto" as const,
    timeframe: "30-dias" as const,
    area: "cumplimiento" as const,
    type: "regulatoria" as const,
  }));

  const allRecs = [...sectorRecs, ...recs.all].slice(0, 8);
  const levelLabel = getRiskLevelLabel(riskLevel, locale);

  return {
    id: generateId(),
    calculatorId: "sector",
    score,
    riskLevel,
    currency,
    cost: {
      min: finalCost * 0.5,
      probable: finalCost,
      max: finalCost * 3,
      items: pickLocale(locale, {
        es: [
          { label: "Costo base de vulnerabilidad", value: baseCost },
          { label: "Factor sectorial", value: baseCost * (sector.multiplier - 1) },
          { label: "Factor regulatorio", value: baseCost * sector.multiplier * (regulationMult - 1) },
          { label: "Factor de madurez", value: baseCost * sector.multiplier * regulationMult * (maturityMult - 1) },
          { label: "Ajuste por volumen de datos", value: adjustedCost - totalCost },
        ],
        en: [
          { label: "Base vulnerability cost", value: baseCost },
          { label: "Sector factor", value: baseCost * (sector.multiplier - 1) },
          { label: "Regulatory factor", value: baseCost * sector.multiplier * (regulationMult - 1) },
          { label: "Maturity factor", value: baseCost * sector.multiplier * regulationMult * (maturityMult - 1) },
          { label: "Data volume adjustment", value: adjustedCost - totalCost },
        ],
        pt: [
          { label: "Custo base de vulnerabilidade", value: baseCost },
          { label: "Fator setorial", value: baseCost * (sector.multiplier - 1) },
          { label: "Fator regulatório", value: baseCost * sector.multiplier * (regulationMult - 1) },
          { label: "Fator de maturidade", value: baseCost * sector.multiplier * regulationMult * (maturityMult - 1) },
          { label: "Ajuste por volume de dados", value: adjustedCost - totalCost },
        ],
      }),
    },
    impactMatrix,
    riskFactors,
    recommendations: allRecs,
    immediateActions: recs.immediate,
    actions30Days: [...sectorRecs.filter(() => true), ...recs.days30].slice(0, 4),
    actions90Days: recs.days90,
    executiveSummary: pickLocale(locale, {
      es: `Con base en los datos ingresados, su organización en el sector ${sectorName} presenta un nivel de riesgo ${levelLabel}. El costo estimado se encuentra entre ${formatCurrency(finalCost * 0.5, currency)} y ${formatCurrency(finalCost * 3, currency)}, con un escenario probable de ${formatCurrency(finalCost, currency)}.`,
      en: `Based on the information provided, your organization in the ${sectorName} sector shows a ${levelLabel} risk level. The estimated cost ranges between ${formatCurrency(finalCost * 0.5, currency)} and ${formatCurrency(finalCost * 3, currency)}, with a probable scenario of ${formatCurrency(finalCost, currency)}.`,
      pt: `Com base nos dados informados, sua organização no setor ${sectorName} apresenta um nível de risco ${levelLabel}. O custo estimado está entre ${formatCurrency(finalCost * 0.5, currency)} e ${formatCurrency(finalCost * 3, currency)}, com um cenário provável de ${formatCurrency(finalCost, currency)}.`,
    }),
    partialSummary: pickLocale(locale, {
      es: `Nivel de riesgo ${levelLabel} (score: ${score}/100). Costo probable: ${formatCurrency(finalCost, currency, true)}.`,
      en: `${levelLabel} risk level (score: ${score}/100). Probable cost: ${formatCurrency(finalCost, currency, true)}.`,
      pt: `Nível de risco ${levelLabel} (score: ${score}/100). Custo provável: ${formatCurrency(finalCost, currency, true)}.`,
    }),
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

const NOISE_MULTIPLIERS: Record<string, number> = {
  bajo: 0.35,
  medio: 0.6,
  alto: 0.85,
};

export function calculateAspmCost(
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  const appCount = num(inputs.appCount, 20);
  const tools = (inputs.securityTools as string[]) ?? ["sast", "sca"];
  const toolCount = Math.max(tools.length, 1);
  const monthlyFindings = num(inputs.monthlyFindings, 500);
  const noiseLevel = str(inputs.noiseLevel, "medio");
  const noisePct = NOISE_MULTIPLIERS[noiseLevel] ?? 0.6;
  const triageHoursWeek = num(inputs.triageHoursWeek, 10);
  const teamSize = num(inputs.teamSize, 2);
  const hourlyRate = num(inputs.hourlyRate, 60);
  const remediationDelayDays = num(inputs.remediationDelayDays, 21);

  const triageHoursYear = triageHoursWeek * teamSize * 4.33 * 12;
  const contextSwitchHoursYear = Math.max(toolCount - 1, 0) * 6 * 12;
  const totalHoursYear = triageHoursYear + contextSwitchHoursYear;

  const triageCost = triageHoursYear * hourlyRate;
  const noiseCost = triageCost * noisePct;
  const contextSwitchCost = contextSwitchHoursYear * hourlyRate;
  const delayedRemediationCost = remediationDelayDays * hourlyRate * teamSize * 0.5;

  const totalCost = triageCost + noiseCost + contextSwitchCost + delayedRemediationCost;
  const fte = totalHoursYear / 2080;

  const { score, riskLevel } = calculateRiskScore({
    technicalSeverity: noisePct * 100,
    exposure: Math.min(100, appCount * 2),
    sensitiveData: Math.min(100, (monthlyFindings / 10)),
    exploitability: noisePct * 90,
    businessCriticality: Math.min(95, toolCount * 12),
    exposureTime: Math.min(100, remediationDelayDays * 3),
    detectionMaturity: 100 - noisePct * 60,
    responseCapacity: remediationDelayDays < 14 ? 65 : 30,
  });

  const noiseWord = tr(
    ({ bajo: { es: "bajo", en: "low", pt: "baixo" }, medio: { es: "medio", en: "medium", pt: "médio" }, alto: { es: "alto", en: "high", pt: "alto" } } as Record<string, LocalizedText>)[noiseLevel] ?? { es: noiseLevel, en: noiseLevel },
    locale
  );
  const riskFactors = pickLocale(locale, {
    es: [
      `${Math.round(totalHoursYear).toLocaleString()} horas al año perdidas en triage manual y cambio de contexto (≈${fte.toFixed(1)} personas de tiempo completo)`,
      `${toolCount} herramientas declaradas. No se comprobó si están integradas. El cambio de contexto suma un supuesto de 6 horas al mes por herramienta adicional`,
      `Ruido: banda declarada «${noiseWord}». El modelo usa ${Math.round(noisePct * 100)}% como supuesto de esa banda (más de 50% se modela como 85%), no como medición`,
      `${remediationDelayDays} días extra de exposición por hallazgo crítico debido a la falta de priorización clara`,
    ],
    en: [
      `${Math.round(totalHoursYear).toLocaleString()} hours per year lost to manual triage and context switching (≈${fte.toFixed(1)} full-time employees)`,
      `${toolCount} tools declared. Integration was not checked. Context switching adds an assumption of 6 hours per month for each additional tool`,
      `Noise: declared band “${noiseWord}”. The model uses ${Math.round(noisePct * 100)}% as that band’s assumption (above 50% is modeled as 85%), not as a measurement`,
      `${remediationDelayDays} extra days of exposure per critical finding due to unclear prioritization`,
    ],
    pt: [
      `${Math.round(totalHoursYear).toLocaleString()} horas por ano perdidas em triagem manual e troca de contexto (≈${fte.toFixed(1)} funcionários em tempo integral)`,
      `${toolCount} ferramentas declaradas. Não se verificou se estão integradas. A troca de contexto soma um pressuposto de 6 horas por mês para cada ferramenta adicional`,
      `Ruído: faixa declarada «${noiseWord}». O modelo usa ${Math.round(noisePct * 100)}% como pressuposto dessa faixa (mais de 50% é modelado como 85%), não como medição`,
      `${remediationDelayDays} dias extras de exposição por achado crítico devido à falta de priorização clara`,
    ],
  });

  const impactMatrix = buildImpactMatrix({
    financial: score * 0.75,
    technical: noisePct * 100,
    operational: Math.min(95, toolCount * 15),
    regulatory: 35,
    reputational: score * 0.5,
  });

  const recs = generateRecommendations({
    calculatorId: "aspm-cost",
    score,
    riskLevel,
    inputs,
    riskFactors,
  });

  const levelLabel = getRiskLevelLabel(riskLevel, locale);

  return {
    id: generateId(),
    calculatorId: "aspm-cost",
    score,
    riskLevel,
    currency,
    cost: {
      min: totalCost * 0.6,
      probable: totalCost,
      max: totalCost * 1.6,
      items: pickLocale(locale, {
        es: [
          { label: "Triage manual de hallazgos", value: triageCost },
          { label: "Ruido: falsos positivos y duplicados", value: noiseCost },
          { label: "Cambio de contexto entre herramientas", value: contextSwitchCost },
          { label: "Remediación retrasada por falta de priorización", value: delayedRemediationCost },
        ],
        en: [
          { label: "Manual finding triage", value: triageCost },
          { label: "Noise: false positives and duplicates", value: noiseCost },
          { label: "Context switching between tools", value: contextSwitchCost },
          { label: "Delayed remediation from lack of prioritization", value: delayedRemediationCost },
        ],
        pt: [
          { label: "Triagem manual de achados", value: triageCost },
          { label: "Ruído: falsos positivos e duplicados", value: noiseCost },
          { label: "Troca de contexto entre ferramentas", value: contextSwitchCost },
          { label: "Remediação atrasada por falta de priorização", value: delayedRemediationCost },
        ],
      }),
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: pickLocale(locale, {
      es: `Con los datos declarados, el equipo dedica aproximadamente ${Math.round(totalHoursYear).toLocaleString()} horas al año (equivalente a ${fte.toFixed(1)} personas de tiempo completo) a clasificar y correlacionar alertas de ${toolCount} herramientas. Esas horas, a ${formatCurrency(hourlyRate, currency)} por hora, cuestan ${formatCurrency(triageCost + contextSwitchCost, currency)}. El supuesto de ruido de la banda añade ${formatCurrency(noiseCost, currency)} sobre el triage, sin horas nuevas. El retraso de remediación suma ${formatCurrency(delayedRemediationCost, currency)}. Esas cifras no restan licencia ni implantación. El escenario alto ${formatCurrency(totalCost * 1.6, currency)} multiplica el total por 1,6.`,
      en: `From the declared inputs, the team spends about ${Math.round(totalHoursYear).toLocaleString()} hours per year (about ${fte.toFixed(1)} full-time employees) classifying and correlating alerts from ${toolCount} tools. Those hours, at ${formatCurrency(hourlyRate, currency)} per hour, cost ${formatCurrency(triageCost + contextSwitchCost, currency)}. The band’s noise assumption adds ${formatCurrency(noiseCost, currency)} on top of triage, with no extra hours. Remediation delay adds ${formatCurrency(delayedRemediationCost, currency)}. These figures do not subtract license or implementation cost. The high scenario ${formatCurrency(totalCost * 1.6, currency)} multiplies the total by 1.6.`,
      pt: `Com os dados declarados, a equipe dedica cerca de ${Math.round(totalHoursYear).toLocaleString()} horas por ano (cerca de ${fte.toFixed(1)} pessoas em tempo integral) a classificar e correlacionar alertas de ${toolCount} ferramentas. Essas horas, a ${formatCurrency(hourlyRate, currency)} por hora, custam ${formatCurrency(triageCost + contextSwitchCost, currency)}. O pressuposto de ruído da faixa acrescenta ${formatCurrency(noiseCost, currency)} sobre a triagem, sem horas novas. O atraso de remediação soma ${formatCurrency(delayedRemediationCost, currency)}. Esses valores não descontam licença nem implantação. O cenário alto ${formatCurrency(totalCost * 1.6, currency)} multiplica o total por 1,6.`,
    }),
    partialSummary: pickLocale(locale, {
      es: `Exposición ${score}/100 (${levelLabel}). ${Math.round(totalHoursYear).toLocaleString()} horas/año declaradas más cambio de contexto. Costo de planificación ${formatCurrency(totalCost, currency, true)}.`,
      en: `Exposure ${score}/100 (${levelLabel}). ${Math.round(totalHoursYear).toLocaleString()} declared hours per year plus context switching. Planning cost ${formatCurrency(totalCost, currency, true)}.`,
      pt: `Exposição ${score}/100 (${levelLabel}). ${Math.round(totalHoursYear).toLocaleString()} horas/ano declaradas mais troca de contexto. Custo de planejamento ${formatCurrency(totalCost, currency, true)}.`,
    }),
    methodNote: pickLocale(locale, {
      es: "Horas al año = horas semanales por persona × personas × 4,33 × 12, más un supuesto de cambio de contexto. El porcentaje de ruido es el supuesto de la banda elegida. No se comprobó si las herramientas están conectadas.",
      en: "Hours per year = weekly hours per person × people × 4.33 × 12, plus a context-switching assumption. The noise percentage is the chosen band’s assumption. Tool integration was not checked.",
      pt: "Horas por ano = horas semanais por pessoa × pessoas × 4,33 × 12, mais um pressuposto de troca de contexto. A percentagem de ruído é o pressuposto da faixa escolhida. Não se verificou se as ferramentas estão ligadas.",
    }),
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
    hoursPerYear: Math.round(totalHoursYear),
  };
}

const GAP3: Record<string, number> = { si: 0, parcial: 0.5, no: 1 };
const GAP2: Record<string, number> = { si: 0, no: 1 };
const CONFORMITY_GAP: Record<string, number> = { si: 0, "en-proceso": 0.5, no: 1 };

function patchDaysGap(days: number): number {
  if (days <= 30) return 0;
  if (days <= 90) return 0.5;
  return 1;
}

function supportYearsGap(years: number): number {
  if (years >= 5) return 0;
  if (years >= 2) return 0.5;
  return 1;
}

const CRA_REPORTING_DEADLINE = new Date("2026-09-11T00:00:00Z");
const CRA_FULL_COMPLIANCE_DEADLINE = new Date("2027-12-11T00:00:00Z");

function daysUntil(date: Date): number {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export function calculateCraCompliance(
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  const annualRevenue = num(inputs.annualRevenue, 5000000);
  const productCategory = str(inputs.productCategory, "default");
  const normalizedCategory =
    productCategory === "importante" || productCategory === "class-i"
      ? "class-i"
      : productCategory === "class-ii"
        ? "class-ii"
        : productCategory === "critico"
          ? "critico"
          : "default";
  const euMarket = str(inputs.euMarket, "no_se");
  const distribution = str(inputs.distribution, "no_se");
  const outOfCraScope = euMarket === "no" || distribution === "saas";
  const hourlyRate = num(inputs.hourlyRate, 85);
  const patchDays = num(inputs.patchDays, 30);
  const supportYears = num(inputs.supportYears, 5);

  const essentialGapPct =
    ((GAP3[str(inputs.secureByDesign, "parcial")] ?? 0.5) +
      (GAP3[str(inputs.noKnownVulnerabilities, "parcial")] ?? 0.5) +
      (GAP3[str(inputs.riskAssessment, "parcial")] ?? 0.5) +
      (GAP3[str(inputs.dataProtection, "parcial")] ?? 0.5)) /
    4;

  const vulnGapPct =
    ((GAP2[str(inputs.hasSbom, "no")] ?? 1) +
      (GAP2[str(inputs.hasDisclosurePolicy, "no")] ?? 1) +
      patchDaysGap(patchDays) +
      supportYearsGap(supportYears)) /
    4;

  const reportingGapPct =
    ((GAP3[str(inputs.hasIncidentProcess, "parcial")] ?? 0.5) +
      (CONFORMITY_GAP[str(inputs.conformityDone, "no")] ?? 1)) /
    2;

  const score = clampScore(essentialGapPct * 40 + vulnGapPct * 35 + reportingGapPct * 25);
  const riskLevel = getRiskLevel(score);
  const levelLabel = getRiskLevelLabel(riskLevel, locale);

  const categoryMultiplier =
    normalizedCategory === "critico" ? 1.4 : normalizedCategory === "class-i" || normalizedCategory === "class-ii" ? 1.2 : 1;

  const essentialFineExposure = Math.min(annualRevenue * 0.025, 15_000_000) * essentialGapPct;
  const vulnFineExposure = Math.min(annualRevenue * 0.02, 10_000_000) * vulnGapPct;
  const reportingFineExposure = Math.min(annualRevenue * 0.01, 5_000_000) * reportingGapPct;
  const regulatoryExposure = outOfCraScope
    ? 0
    : (essentialFineExposure + vulnFineExposure + reportingFineExposure) * categoryMultiplier;

  const remediationHours =
    200 * essentialGapPct + 150 * vulnGapPct + 80 * reportingGapPct;
  const remediationCost = remediationHours * hourlyRate;

  const conformityCost =
    normalizedCategory === "critico" ? 75_000 : normalizedCategory === "class-i" || normalizedCategory === "class-ii" ? 35_000 : 0;

  const totalCost = regulatoryExposure + remediationCost + conformityCost;

  const reportingDaysLeft = daysUntil(CRA_REPORTING_DEADLINE);
  const fullComplianceDaysLeft = daysUntil(CRA_FULL_COMPLIANCE_DEADLINE);

  const categoryShort = tr(
    ({
      default: {
        es: "producto por defecto (la mayoría del software)",
        en: "default product (most software)",
        pt: "produto padrão (a maioria do software)",
      },
      "class-i": {
        es: "producto importante de clase I (Anexo III). Ejemplos orientativos: sistemas operativos, navegadores, gestores de contraseñas. No es un dictamen",
        en: "important Class I product (Annex III). Illustrative examples: operating systems, browsers, password managers. Not a legal opinion",
        pt: "produto importante de classe I (Anexo III). Exemplos orientativos: sistemas operativos, navegadores, gestores de senhas. Não é um parecer",
      },
      "class-ii": {
        es: "producto importante de clase II (Anexo III). Ejemplos orientativos: cortafuegos, IDS/IPS, hipervisores. No es un dictamen",
        en: "important Class II product (Annex III). Illustrative examples: firewalls, IDS/IPS, hypervisors. Not a legal opinion",
        pt: "produto importante de classe II (Anexo III). Exemplos orientativos: firewalls, IDS/IPS, hipervisores. Não é um parecer",
      },
      critico: {
        es: "producto crítico (Anexo IV). Ejemplos orientativos: cajas de seguridad hardware, pasarelas de contadores y tarjetas inteligentes. No es un dictamen",
        en: "critical product (Annex IV). Illustrative examples: hardware security boxes, smart-meter gateways, and smartcards. Not a legal opinion",
        pt: "produto crítico (Anexo IV). Exemplos orientativos: caixas de segurança em hardware, gateways de contadores e cartões inteligentes. Não é um parecer",
      },
    } as Record<string, LocalizedText>)[normalizedCategory] ?? { es: normalizedCategory, en: normalizedCategory, pt: normalizedCategory },
    locale
  );
  const craScopeNote = pickLocale(locale, {
    es: outOfCraScope
      ? "Resultado preliminar de no aplicabilidad del Reglamento (UE) 2024/2847. Los controles no se etiquetan como incumplimiento. La sanción hipotética queda en cero."
      : euMarket === "si"
        ? "Ámbito UE declarado por quien responde. Las cifras regulatorias son una sanción hipotética, no una multa determinada."
        : "Ámbito UE no confirmado. La sanción es hipotética hasta confirmar mercado, rol y si hay un producto puesto en el mercado.",
    en: outOfCraScope
      ? "Preliminary non-applicability under Regulation (EU) 2024/2847. Controls are not labeled as non-compliance. The hypothetical sanction is zero."
      : euMarket === "si"
        ? "EU scope declared by the respondent. Regulatory figures are a hypothetical sanction, not a determined fine."
        : "EU scope not confirmed. The sanction is hypothetical until market, role, and whether a product is placed on the market are confirmed.",
    pt: outOfCraScope
      ? "Resultado preliminar de não aplicabilidade do Regulamento (UE) 2024/2847. Os controles não são rotulados como incumprimento. A sanção hipotética fica em zero."
      : euMarket === "si"
        ? "Âmbito UE declarado por quem responde. Os valores regulatórios são uma sanção hipotética, não uma multa determinada."
        : "Âmbito UE não confirmado. A sanção é hipotética até confirmar mercado, papel e se há um produto colocado no mercado.",
  });
  const riskFactors = pickLocale(locale, {
    es: [
      reportingDaysLeft > 0
        ? `Quedan ${reportingDaysLeft.toLocaleString()} días para que entren en vigor las obligaciones de reporte de vulnerabilidades del CRA (11 sept. 2026)`
        : `Las obligaciones de reporte de vulnerabilidades del CRA ya están vigentes desde el 11 de septiembre de 2026`,
      fullComplianceDaysLeft > 0
        ? `Quedan ${fullComplianceDaysLeft.toLocaleString()} días para el cumplimiento total del CRA (11 dic. 2027)`
        : `El plazo de cumplimiento total del CRA (11 dic. 2027) ya se cumplió`,
      `Brecha en requisitos esenciales de seguridad: ${Math.round(essentialGapPct * 100)}% aún sin cubrir`,
      `Brecha en gestión de vulnerabilidades (SBOM, parches, divulgación): ${Math.round(vulnGapPct * 100)}% aún sin cubrir`,
      craScopeNote,
      `Categoría declarada: ${categoryShort}. Oriente la clase con el Reglamento (UE) 2024/2847; esto no sustituye esa lectura.`,
    ],
    en: [
      reportingDaysLeft > 0
        ? `${reportingDaysLeft.toLocaleString()} days left before the CRA's vulnerability reporting obligations take effect (Sept. 11, 2026)`
        : `The CRA's vulnerability reporting obligations have been in effect since September 11, 2026`,
      fullComplianceDaysLeft > 0
        ? `${fullComplianceDaysLeft.toLocaleString()} days left until full CRA compliance is required (Dec. 11, 2027)`
        : `The full CRA compliance deadline (Dec. 11, 2027) has already passed`,
      `Essential security requirements gap: ${Math.round(essentialGapPct * 100)}% still unmet`,
      `Vulnerability management gap (SBOM, patching, disclosure): ${Math.round(vulnGapPct * 100)}% still unmet`,
      craScopeNote,
      `Declared category: ${categoryShort}. Check the class against Regulation (EU) 2024/2847; this is not that reading.`,
    ],
    pt: [
      reportingDaysLeft > 0
        ? `Restam ${reportingDaysLeft.toLocaleString()} dias para que entrem em vigor as obrigações de reporte de vulnerabilidades do CRA (11 set. 2026)`
        : `As obrigações de reporte de vulnerabilidades do CRA já estão em vigor desde 11 de setembro de 2026`,
      fullComplianceDaysLeft > 0
        ? `Restam ${fullComplianceDaysLeft.toLocaleString()} dias para o cumprimento total do CRA (11 dez. 2027)`
        : `O prazo de cumprimento total do CRA (11 dez. 2027) já se encerrou`,
      `Lacuna em requisitos essenciais de segurança: ${Math.round(essentialGapPct * 100)}% ainda não cobertos`,
      `Lacuna em gestão de vulnerabilidades (SBOM, patches, divulgação): ${Math.round(vulnGapPct * 100)}% ainda não cobertos`,
      craScopeNote,
      `Categoria declarada: ${categoryShort}. Confira a classe no Regulamento (UE) 2024/2847; isto não substitui essa leitura.`,
    ],
  });

  const impactMatrix = buildImpactMatrix({
    financial: score * 0.85,
    technical: essentialGapPct * 100,
    operational: vulnGapPct * 100,
    regulatory: reportingGapPct * 100 * categoryMultiplier,
    reputational: score * 0.6,
  });

  const recs = generateRecommendations({
    calculatorId: "cra-compliance",
    score,
    riskLevel,
    inputs,
    riskFactors,
  });

  return {
    id: generateId(),
    calculatorId: "cra-compliance",
    score,
    riskLevel,
    currency,
    cost: {
      min: totalCost * 0.6,
      probable: totalCost,
      max: totalCost * 1.5,
      regulatory: regulatoryExposure,
      remediation: remediationCost,
      items: pickLocale(locale, {
        es: [
          { label: "Sanción hipotética por requisitos esenciales", value: outOfCraScope ? 0 : essentialFineExposure * categoryMultiplier },
          { label: "Sanción hipotética por gestión de vulnerabilidades", value: outOfCraScope ? 0 : vulnFineExposure * categoryMultiplier },
          { label: "Sanción hipotética por obligaciones de reporte", value: outOfCraScope ? 0 : reportingFineExposure * categoryMultiplier },
          { label: "Costo de remediación técnica y documental", value: remediationCost },
          ...(conformityCost > 0 ? [{ label: "Costo de evaluación de conformidad (no es una sanción)", value: conformityCost }] : []),
        ],
        en: [
          { label: "Hypothetical sanction for essential requirements", value: outOfCraScope ? 0 : essentialFineExposure * categoryMultiplier },
          { label: "Hypothetical sanction for vulnerability management", value: outOfCraScope ? 0 : vulnFineExposure * categoryMultiplier },
          { label: "Hypothetical sanction for reporting obligations", value: outOfCraScope ? 0 : reportingFineExposure * categoryMultiplier },
          { label: "Technical and documentation remediation cost", value: remediationCost },
          ...(conformityCost > 0 ? [{ label: "Conformity assessment cost (not a sanction)", value: conformityCost }] : []),
        ],
        pt: [
          { label: "Sanção hipotética por requisitos essenciais", value: outOfCraScope ? 0 : essentialFineExposure * categoryMultiplier },
          { label: "Sanção hipotética por gestão de vulnerabilidades", value: outOfCraScope ? 0 : vulnFineExposure * categoryMultiplier },
          { label: "Sanção hipotética por obrigações de reporte", value: outOfCraScope ? 0 : reportingFineExposure * categoryMultiplier },
          { label: "Custo de remediação técnica e documental", value: remediationCost },
          ...(conformityCost > 0 ? [{ label: "Custo de avaliação de conformidade (não é sanção)", value: conformityCost }] : []),
        ],
      }),
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: pickLocale(locale, {
      es: `${craScopeNote} Brecha de controles ${levelLabel} (exposición ${score}/100). Sanción hipotética ${formatCurrency(regulatoryExposure, currency)}. Remediación ${formatCurrency(remediationCost, currency)}. Conformidad ${formatCurrency(conformityCost, currency)}. Esta calculadora no modela por separado el impacto de un incidente. Suma de planificación ${formatCurrency(totalCost, currency)}. El rango ${formatCurrency(totalCost * 0.6, currency)}–${formatCurrency(totalCost * 1.5, currency)} son escenarios ×0,6 y ×1,5. Reporte de vulnerabilidades: 11 de septiembre de 2026. Aplicación plena: 11 de diciembre de 2027. Referencia: Reglamento (UE) 2024/2847.`,
      en: `${craScopeNote} Control gap ${levelLabel} (exposure ${score}/100). Hypothetical sanction ${formatCurrency(regulatoryExposure, currency)}. Remediation ${formatCurrency(remediationCost, currency)}. Conformity ${formatCurrency(conformityCost, currency)}. This calculator does not separately model incident impact. Planning total ${formatCurrency(totalCost, currency)}. The range ${formatCurrency(totalCost * 0.6, currency)}–${formatCurrency(totalCost * 1.5, currency)} is a ×0.6 and ×1.5 scenario band. Vulnerability reporting: 11 September 2026. Full application: 11 December 2027. Reference: Regulation (EU) 2024/2847.`,
      pt: `${craScopeNote} Lacuna de controles ${levelLabel} (exposição ${score}/100). Sanção hipotética ${formatCurrency(regulatoryExposure, currency)}. Remediação ${formatCurrency(remediationCost, currency)}. Conformidade ${formatCurrency(conformityCost, currency)}. Esta calculadora não modela à parte o impacto de um incidente. Soma de planejamento ${formatCurrency(totalCost, currency)}. O intervalo ${formatCurrency(totalCost * 0.6, currency)}–${formatCurrency(totalCost * 1.5, currency)} são cenários ×0,6 e ×1,5. Reporte de vulnerabilidades: 11 de setembro de 2026. Aplicação plena: 11 de dezembro de 2027. Referência: Regulamento (UE) 2024/2847.`,
    }),
    partialSummary: pickLocale(locale, {
      es: `${outOfCraScope ? "Preliminar: fuera de ámbito CRA. " : ""}Exposición de controles ${score}/100. Sanción hipotética ${formatCurrency(regulatoryExposure, currency, true)}. Remediación ${formatCurrency(remediationCost, currency, true)}.`,
      en: `${outOfCraScope ? "Preliminary: outside CRA scope. " : ""}Control exposure ${score}/100. Hypothetical sanction ${formatCurrency(regulatoryExposure, currency, true)}. Remediation ${formatCurrency(remediationCost, currency, true)}.`,
      pt: `${outOfCraScope ? "Preliminar: fora do âmbito CRA. " : ""}Exposição de controles ${score}/100. Sanção hipotética ${formatCurrency(regulatoryExposure, currency, true)}. Remediação ${formatCurrency(remediationCost, currency, true)}.`,
    }),
    methodNote: pickLocale(locale, {
      es: "Tres cifras distintas: sanción hipotética, costo de remediación y costo de conformidad. No hay un término separado de impacto de incidente. La categoría es la que declaró el usuario, contrastada con los Anexos III y IV del Reglamento (UE) 2024/2847.",
      en: "Three separate figures: hypothetical sanction, remediation cost, and conformity cost. There is no separate incident-impact term. The category is the one the user declared, checked against Annexes III and IV of Regulation (EU) 2024/2847.",
      pt: "Três valores distintos: sanção hipotética, custo de remediação e custo de conformidade. Não há um termo separado de impacto de incidente. A categoria é a declarada pelo usuário, conferida com os Anexos III e IV do Regulamento (UE) 2024/2847.",
    }),
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

const DORA_ENTITY_MULTIPLIERS: Record<string, number> = {
  "credit-institution": 1.3,
  "payment-institution": 1.2,
  "investment-firm": 1.15,
  insurance: 1.1,
  "ict-provider": 1.25,
  "other-financial": 1.0,
};

const DORA_QUESTION_FIELDS = [
  "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15",
] as const;

const DORA_PILLAR_FIELDS: Record<string, readonly string[]> = {
  governance: ["q1", "q2", "q3", "q4"],
  incidents: ["q5", "q6", "q7"],
  resilience: ["q8", "q9"],
  "third-party": ["q10", "q11", "q12"],
  culture: ["q13", "q14", "q15"],
};

function doraQuestionScore(inputs: Record<string, unknown>, field: string): number {
  return Math.min(5, Math.max(1, num(inputs[field], 1)));
}

function doraPillarGap(inputs: Record<string, unknown>, fields: readonly string[]): number {
  const max = fields.length * 5;
  const min = fields.length;
  const span = max - min;
  const total = fields.reduce((sum, field) => sum + doraQuestionScore(inputs, field), 0);
  return span > 0 ? (max - total) / span : 1;
}

function getDoraMaturityDiagnosis(normalizedPct: number, locale: Locale): string {
  if (normalizedPct >= 87) {
    return pickLocale(locale, {
      es: "Cumplimiento alto / Excelente madurez. La organización demuestra una sólida resiliencia operativa digital.",
      en: "High compliance / Excellent maturity. The organization demonstrates strong digital operational resilience.",
      pt: "Conformidade alta / Excelente maturidade. A organização demonstra sólida resiliência operacional digital.",
    });
  }
  if (normalizedPct >= 62) {
    return pickLocale(locale, {
      es: "Cumplimiento moderado. Existen fundamentos, pero se identifican brechas que requieren atención.",
      en: "Moderate compliance. Foundations exist, but gaps requiring attention have been identified.",
      pt: "Conformidade moderada. Existem fundamentos, mas foram identificadas lacunas que exigem atenção.",
    });
  }
  if (normalizedPct >= 37) {
    return pickLocale(locale, {
      es: "Cumplimiento parcial. Se necesitan mejoras sustanciales para reducir riesgos regulatorios.",
      en: "Partial compliance. Substantial improvements are needed to reduce regulatory risk.",
      pt: "Conformidade parcial. São necessárias melhorias substanciais para reduzir riscos regulatórios.",
    });
  }
  return pickLocale(locale, {
    es: "Cumplimiento bajo. Se recomienda intervención inmediata.",
    en: "Low compliance. Immediate intervention is recommended.",
    pt: "Conformidade baixa. Recomenda-se intervenção imediata.",
  });
}

export function calculateDoraCompliance(
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  const annualRevenue = num(inputs.annualRevenue, 50_000_000);
  const hourlyRate = num(inputs.hourlyRate, 95);
  const entityType = str(inputs.entityType, "other-financial");
  const entityMultiplier = DORA_ENTITY_MULTIPLIERS[entityType] ?? 1;

  const rawTotal = DORA_QUESTION_FIELDS.reduce(
    (sum, field) => sum + doraQuestionScore(inputs, field),
    0
  );
  const maturityPct = Math.max(0, Math.min(100, Math.round(((rawTotal - 15) / 60) * 100)));
  const gapPct = (100 - maturityPct) / 100;
  const score = clampScore(100 - maturityPct);
  const riskLevel = getRiskLevel(score);
  const levelLabel = getRiskLevelLabel(riskLevel, locale);
  const diagnosis = getDoraMaturityDiagnosis(maturityPct, locale);
  const doraInScope = str(inputs.doraInScope, "no_se");

  const governanceGap = doraPillarGap(inputs, DORA_PILLAR_FIELDS.governance);
  const incidentsGap = doraPillarGap(inputs, DORA_PILLAR_FIELDS.incidents);
  const resilienceGap = doraPillarGap(inputs, DORA_PILLAR_FIELDS.resilience);
  const thirdPartyGap = doraPillarGap(inputs, DORA_PILLAR_FIELDS["third-party"]);
  const cultureGap = doraPillarGap(inputs, DORA_PILLAR_FIELDS.culture);

  const regulatoryExposure =
    doraInScope === "no"
      ? 0
      : Math.min(annualRevenue * 0.015, 20_000_000) * gapPct * entityMultiplier;
  const remediationHours =
    120 * governanceGap +
    90 * incidentsGap +
    110 * resilienceGap +
    100 * thirdPartyGap +
    60 * cultureGap;
  const remediationCost = remediationHours * hourlyRate;
  const auditReadinessCost = gapPct * 45_000 * entityMultiplier;
  const totalCost = regulatoryExposure + remediationCost + auditReadinessCost;

  const entityLabel = tr(
    ({
      "credit-institution": { es: "entidad de crédito", en: "credit institution", pt: "instituição de crédito" },
      "payment-institution": { es: "entidad de pago", en: "payment institution", pt: "instituição de pagamento" },
      "investment-firm": { es: "empresa de inversión", en: "investment firm", pt: "empresa de investimento" },
      insurance: { es: "compañía de seguros", en: "insurance company", pt: "companhia de seguros" },
      "ict-provider": { es: "proveedor crítico de TIC", en: "critical ICT provider", pt: "provedor crítico de TIC" },
      "other-financial": { es: "entidad financiera", en: "financial entity", pt: "entidade financeira" },
    } as Record<string, LocalizedText>)[entityType] ?? { es: entityType, en: entityType, pt: entityType },
    locale
  );

  const scopeNote = pickLocale(locale, {
    es:
      doraInScope === "si"
        ? "Ámbito declarado por quien responde. Las respuestas son declaraciones, no evidencia. Reglamento (UE) 2022/2554, aplicable desde el 17 de enero de 2025 si la entidad está en ámbito."
        : doraInScope === "no"
          ? "Ámbito preliminar: la entidad no se declaró sujeta a DORA. La madurez siguiente no se etiqueta como incumplimiento."
          : "Ámbito no confirmado. La sanción es hipotética y solo aplica si la entidad está en el ámbito del Reglamento (UE) 2022/2554 (desde el 17 de enero de 2025).",
    en:
      doraInScope === "si"
        ? "Scope declared by the respondent. Answers are declarations, not evidence. Regulation (EU) 2022/2554 has applied since 17 January 2025 where the entity is in scope."
        : doraInScope === "no"
          ? "Preliminary scope: the entity was not declared subject to DORA. The maturity below is not labeled as non-compliance."
          : "Scope not confirmed. The sanction is hypothetical and applies only if the entity is in scope of Regulation (EU) 2022/2554 (since 17 January 2025).",
    pt:
      doraInScope === "si"
        ? "Âmbito declarado por quem responde. As respostas são declarações, não evidência. Regulamento (UE) 2022/2554, aplicável desde 17 de janeiro de 2025 se a entidade estiver no âmbito."
        : doraInScope === "no"
          ? "Âmbito preliminar: a entidade não se declarou sujeita ao DORA. A maturidade abaixo não é rotulada como incumprimento."
          : "Âmbito não confirmado. A sanção é hipotética e só se aplica se a entidade estiver no âmbito do Regulamento (UE) 2022/2554 (desde 17 de janeiro de 2025).",
  });
  const riskFactors = pickLocale(locale, {
    es: [
      `Puntuación bruta ${rawTotal}/75. Madurez normalizada ${maturityPct}% (0% = controles ausentes, 100% = implementados).`,
      scopeNote,
      diagnosis,
      `Brecha en marco de gestión de riesgos TIC: ${Math.round(governanceGap * 100)}%`,
      `Brecha en gestión de incidentes y reporte: ${Math.round(incidentsGap * 100)}%`,
      `Brecha en pruebas de resiliencia (DAST/pen testing): ${Math.round(resilienceGap * 100)}%`,
      `Brecha en gestión de proveedores TIC: ${Math.round(thirdPartyGap * 100)}%`,
      `Entidad declarada: ${entityLabel}`,
    ],
    en: [
      `Raw score ${rawTotal}/75. Normalized maturity ${maturityPct}% (0% = controls absent, 100% = implemented).`,
      scopeNote,
      diagnosis,
      `ICT risk management framework gap: ${Math.round(governanceGap * 100)}%`,
      `Incident management and reporting gap: ${Math.round(incidentsGap * 100)}%`,
      `Resilience testing gap (DAST/pen testing): ${Math.round(resilienceGap * 100)}%`,
      `ICT provider management gap: ${Math.round(thirdPartyGap * 100)}%`,
      `Declared entity: ${entityLabel}`,
    ],
    pt: [
      `Pontuação bruta ${rawTotal}/75. Maturidade normalizada ${maturityPct}% (0% = controles ausentes, 100% = implementados).`,
      scopeNote,
      diagnosis,
      `Lacuna no framework de gestão de riscos de TIC: ${Math.round(governanceGap * 100)}%`,
      `Lacuna em gestão de incidentes e reporte: ${Math.round(incidentsGap * 100)}%`,
      `Lacuna em testes de resiliência (DAST/pen testing): ${Math.round(resilienceGap * 100)}%`,
      `Lacuna em gestão de provedores de TIC: ${Math.round(thirdPartyGap * 100)}%`,
      `Entidade declarada: ${entityLabel}`,
    ],
  });

  const impactMatrix = buildImpactMatrix({
    financial: score * 0.8,
    technical: governanceGap * 100,
    operational: incidentsGap * 100,
    regulatory: gapPct * 100 * entityMultiplier,
    reputational: score * 0.55,
  });

  const recs = generateRecommendations({
    calculatorId: "dora-compliance",
    score,
    riskLevel,
    inputs,
    riskFactors,
  });

  return {
    id: generateId(),
    calculatorId: "dora-compliance",
    score,
    riskLevel,
    currency,
    cost: {
      min: totalCost * 0.6,
      probable: totalCost,
      max: totalCost * 1.5,
      regulatory: regulatoryExposure,
      remediation: remediationCost,
      items: pickLocale(locale, {
        es: [
          { label: "Exposición regulatoria estimada (sanciones y supervisión)", value: regulatoryExposure },
          { label: "Costo de remediación de brechas DORA", value: remediationCost },
          { label: "Preparación de evidencia y auditoría", value: auditReadinessCost },
        ],
        en: [
          { label: "Estimated regulatory exposure (fines and supervision)", value: regulatoryExposure },
          { label: "DORA gap remediation cost", value: remediationCost },
          { label: "Evidence and audit readiness", value: auditReadinessCost },
        ],
        pt: [
          { label: "Exposição regulatória estimada (sanções e supervisão)", value: regulatoryExposure },
          { label: "Custo de remediação de lacunas DORA", value: remediationCost },
          { label: "Preparação de evidências e auditoria", value: auditReadinessCost },
        ],
      }),
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: pickLocale(locale, {
      es: `Brecha de madurez ${levelLabel} (exposición ${score}/100, donde 100 es peor). Puntuación bruta ${rawTotal}/75 y madurez normalizada ${maturityPct}%. ${diagnosis} ${scopeNote} Sanción hipotética ${formatCurrency(regulatoryExposure, currency)}. Costo de remediación ${formatCurrency(remediationCost, currency)}. Preparación de evidencia ${formatCurrency(auditReadinessCost, currency)}. Suma de planificación ${formatCurrency(totalCost, currency)}. El rango ${formatCurrency(totalCost * 0.6, currency)}–${formatCurrency(totalCost * 1.5, currency)} son escenarios ×0,6 y ×1,5, no un intervalo de confianza.`,
      en: `Maturity gap ${levelLabel} (exposure ${score}/100, where 100 is worse). Raw score ${rawTotal}/75 and normalized maturity ${maturityPct}%. ${diagnosis} ${scopeNote} Hypothetical sanction ${formatCurrency(regulatoryExposure, currency)}. Remediation cost ${formatCurrency(remediationCost, currency)}. Evidence preparation ${formatCurrency(auditReadinessCost, currency)}. Planning total ${formatCurrency(totalCost, currency)}. The range ${formatCurrency(totalCost * 0.6, currency)}–${formatCurrency(totalCost * 1.5, currency)} is a ×0.6 and ×1.5 scenario band, not a confidence interval.`,
      pt: `Lacuna de maturidade ${levelLabel} (exposição ${score}/100, em que 100 é pior). Pontuação bruta ${rawTotal}/75 e maturidade normalizada ${maturityPct}%. ${diagnosis} ${scopeNote} Sanção hipotética ${formatCurrency(regulatoryExposure, currency)}. Custo de remediação ${formatCurrency(remediationCost, currency)}. Preparação de evidências ${formatCurrency(auditReadinessCost, currency)}. Soma de planejamento ${formatCurrency(totalCost, currency)}. O intervalo ${formatCurrency(totalCost * 0.6, currency)}–${formatCurrency(totalCost * 1.5, currency)} são cenários ×0,6 e ×1,5, não um intervalo de confiança.`,
    }),
    partialSummary: pickLocale(locale, {
      es: `Madurez normalizada ${maturityPct}% (bruto ${rawTotal}/75). Exposición ${score}/100. Suma de planificación ${formatCurrency(totalCost, currency, true)}.`,
      en: `Normalized maturity ${maturityPct}% (raw ${rawTotal}/75). Exposure ${score}/100. Planning total ${formatCurrency(totalCost, currency, true)}.`,
      pt: `Maturidade normalizada ${maturityPct}% (bruto ${rawTotal}/75). Exposição ${score}/100. Soma de planejamento ${formatCurrency(totalCost, currency, true)}.`,
    }),
    methodNote: pickLocale(locale, {
      es: "Madurez normalizada = (puntos brutos − 15) / 60. Un control en 1 no recibe crédito de madurez. La suma junta sanción hipotética, remediación y evidencia; no es una sola exposición.",
      en: "Normalized maturity = (raw points − 15) / 60. A control scored 1 receives no maturity credit. The total adds a hypothetical sanction, remediation, and evidence preparation.",
      pt: "Maturidade normalizada = (pontos brutos − 15) / 60. Um controle em 1 não recebe crédito de maturidade. A soma junta sanção hipotética, remediação e evidência.",
    }),
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

export function calculate(
  calculatorId: CalculatorId,
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  let result: CalculationResult;
  switch (calculatorId) {
    case "iso-quality":
      result = calculateIsoQuality(inputs, currency, locale);
      break;
    case "owasp-web":
      result = calculateOwaspWeb(inputs, currency, locale);
      break;
    case "owasp-mobile":
      result = calculateOwaspMobile(inputs, currency, locale);
      break;
    case "sector":
      result = calculateSector(inputs, currency, locale);
      break;
    case "aspm-cost":
      result = calculateAspmCost(inputs, currency, locale);
      break;
    case "cra-compliance":
      result = calculateCraCompliance(inputs, currency, locale);
      break;
    case "dora-compliance":
      result = calculateDoraCompliance(inputs, currency, locale);
      break;
    default:
      throw new Error(`Unknown calculator: ${calculatorId}`);
  }
  return { ...result, locale };
}
