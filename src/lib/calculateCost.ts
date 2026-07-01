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
import type { CalculationResult, CalculatorId, Currency } from "@/types/calculator";
import { generateId } from "@/lib/utils";
import {
  buildImpactMatrix,
  calculateRiskScore,
  DEPENDENCY_SCORES,
  ENVIRONMENT_SCORES,
  EXPLOITATION_SCORES,
  EXPOSURE_SCORES,
  OPERATIONAL_IMPACT_SCORES,
} from "@/lib/calculateRisk";
import { generateRecommendations } from "@/lib/generateRecommendations";
import { formatCurrency } from "@/lib/formatCurrency";
import { getRiskLevelLabel } from "@/data/riskRanges";

function num(val: unknown, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

function str(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback;
}

export function calculateIsoQuality(
  inputs: Record<string, unknown>,
  currency: Currency
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

  for (const dim of ISO_25010_DIMENSIONS) {
    const rating = num(inputs[dim.id], 3);
    qualityRatings.push(rating);
    dimensionRisks.push({
      name: dim.nameEs,
      risk: dimensionRiskScore(rating, dim.weight),
    });
  }

  const avgQuality =
    qualityRatings.reduce((a, b) => a + b, 0) / qualityRatings.length;
  const maturityLevel = getQualityMaturityLevel(avgQuality);
  const maturityFactor = MATURITY_FACTORS[maturityLevel] ?? 1.2;

  const monthlyCost = monthlyHours * hourlyRate * critFactor * maturityFactor;
  const annualCost = monthlyCost * 12;
  const perDevCost = devCount > 0 ? annualCost / devCount : annualCost;

  const incidentFactor = Math.min(incidents * 3, 30);
  const qualityGapScore =
    dimensionRisks.reduce((s, d) => s + d.risk, 0) / dimensionRisks.length;

  const { score, riskLevel } = calculateRiskScore({
    technicalSeverity: qualityGapScore,
    businessCriticality: DEPENDENCY_SCORES[criticality] ?? 50,
    qualityGaps: qualityGapScore,
    detectionMaturity: 100 - avgQuality * 20,
    responseCapacity: Math.max(20, 100 - incidentFactor * 2),
  });

  const topDimensions = [...dimensionRisks]
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 3)
    .map((d) => d.name);

  const riskFactors = [
    `Deuda técnica en: ${topDimensions.join(", ")}`,
    `${incidents} incidentes mensuales promedio`,
    `${reworkHours + bugHours}h/semana en corrección y retrabajo`,
    `Dependencia de software: ${criticality}`,
  ];

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

  const levelLabel = getRiskLevelLabel(riskLevel);

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
      items: [
        { label: "Corrección de bugs", value: bugHours * 4.33 * hourlyRate * 12 },
        { label: "Soporte por defectos", value: supportHours * 4.33 * hourlyRate * 12 },
        { label: "Retrabajo", value: reworkHours * 4.33 * hourlyRate * 12 },
        { label: "Factor de criticidad", value: annualCost - monthlyHours * hourlyRate * 12 },
      ],
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: `Con base en los datos ingresados, su aplicación presenta un nivel de riesgo ${levelLabel}. El costo estimado de no calidad se encuentra entre ${formatCurrency(annualCost * 0.7, currency)} y ${formatCurrency(annualCost * 1.5, currency)}, con un escenario probable de ${formatCurrency(annualCost, currency)} anuales. Los principales factores de riesgo son: ${riskFactors.slice(0, 2).join("; ")}.`,
    partialSummary: `Nivel de riesgo ${levelLabel} (score: ${score}/100). Costo anual estimado: ${formatCurrency(annualCost, currency, true)}.`,
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

export function calculateOwaspWeb(
  inputs: Record<string, unknown>,
  currency: Currency
): CalculationResult {
  const category = getOwaspCategory(str(inputs.owaspCategory, "A01"));
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

  const riskFactors = [
    `Vulnerabilidad OWASP: ${owasp.nameEs}`,
    `Exposición: ${exposure} por ${exposureDays} días`,
    `Nivel de explotación: ${exploitation}`,
    `${sensitiveRecords.toLocaleString()} registros sensibles`,
  ];

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

  const levelLabel = getRiskLevelLabel(riskLevel);

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
      items: [
        { label: "Remediación técnica", value: remediationCost },
        { label: "Investigación", value: investigationCost },
        { label: "Interrupción operativa", value: interruptionCost },
        { label: "Riesgo regulatorio", value: regulatoryCost },
        { label: "Impacto reputacional", value: reputationalCost },
        { label: "Costo de oportunidad", value: opportunityCost },
        { label: "Monitoreo posterior", value: monitoringCost },
      ],
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: `Con base en los datos ingresados, su aplicación presenta un nivel de riesgo ${levelLabel}. El costo estimado de exposición se encuentra entre ${formatCurrency(totalCost * 0.6, currency)} y ${formatCurrency(totalCost * 2, currency)}, con un escenario probable de ${formatCurrency(totalCost, currency)}. Los principales factores de riesgo son: ${riskFactors.slice(0, 2).join("; ")}.`,
    partialSummary: `Nivel de riesgo ${levelLabel} (score: ${score}/100). Impacto estimado: ${formatCurrency(totalCost, currency, true)}.`,
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

export function calculateOwaspMobile(
  inputs: Record<string, unknown>,
  currency: Currency
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
    detectionMaturity: inputs.localEncryption === "si" ? 50 : 80,
    responseCapacity: num(inputs.updateFrequency, 30) < 14 ? 60 : 35,
  });

  const riskFactors = [
    `Vulnerabilidad móvil: ${mobile.nameEs}`,
    `${activeUsers.toLocaleString()} usuarios activos`,
    `Plataforma: ${platform}`,
    hasPayments ? "Procesa pagos in-app" : "Sin pagos in-app",
  ];

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

  const levelLabel = getRiskLevelLabel(riskLevel);

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
      items: [
        { label: "Remediación técnica", value: remediationCost },
        { label: "Republicación en stores", value: publishCost },
        { label: "Soporte a usuarios", value: supportCost },
        { label: "Exposición de datos", value: dataExposureCost },
        { label: "Riesgo de fraude", value: fraudRisk },
        { label: "Pérdida de usuarios", value: userLossCost },
        { label: "Impacto reputacional", value: reputationalCost },
      ],
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: `Con base en los datos ingresados, su aplicación móvil presenta un nivel de riesgo ${levelLabel}. El costo estimado se encuentra entre ${formatCurrency(totalCost * 0.5, currency)} y ${formatCurrency(totalCost * 2.5, currency)}, con un escenario probable de ${formatCurrency(totalCost, currency)}. Impacto por usuario: ${formatCurrency(totalCost / Math.max(activeUsers, 1), currency)}.`,
    partialSummary: `Nivel de riesgo ${levelLabel} (score: ${score}/100). Costo estimado: ${formatCurrency(totalCost, currency, true)}.`,
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

export function calculateSector(
  inputs: Record<string, unknown>,
  currency: Currency
): CalculationResult {
  const sectorId = str(inputs.sector, "retail");
  const sector = getSector(sectorId)!;
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

  const riskFactors = [
    `Sector: ${sector.name} (multiplicador ${sector.multiplier}x)`,
    `Regulación: ${regulation.toUpperCase()}`,
    `Madurez de seguridad: ${maturity}`,
    `${records.toLocaleString()} registros sensibles`,
  ];

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
    title: `Recomendación sectorial: ${sector.name}`,
    description: text,
    priority: "alta" as const,
    effort: "medio" as const,
    impact: "alto" as const,
    timeframe: "30-dias" as const,
    area: "cumplimiento" as const,
    type: "regulatoria" as const,
  }));

  const allRecs = [...sectorRecs, ...recs.all].slice(0, 8);
  const levelLabel = getRiskLevelLabel(riskLevel);

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
      items: [
        { label: "Costo base de vulnerabilidad", value: baseCost },
        { label: "Factor sectorial", value: baseCost * (sector.multiplier - 1) },
        { label: "Factor regulatorio", value: baseCost * sector.multiplier * (regulationMult - 1) },
        { label: "Factor de madurez", value: baseCost * sector.multiplier * regulationMult * (maturityMult - 1) },
        { label: "Ajuste por volumen de datos", value: adjustedCost - totalCost },
      ],
    },
    impactMatrix,
    riskFactors,
    recommendations: allRecs,
    immediateActions: recs.immediate,
    actions30Days: [...sectorRecs.filter(() => true), ...recs.days30].slice(0, 4),
    actions90Days: recs.days90,
    executiveSummary: `Con base en los datos ingresados, su organización en el sector ${sector.name} presenta un nivel de riesgo ${levelLabel}. El costo estimado se encuentra entre ${formatCurrency(finalCost * 0.5, currency)} y ${formatCurrency(finalCost * 3, currency)}, con un escenario probable de ${formatCurrency(finalCost, currency)}.`,
    partialSummary: `Nivel de riesgo ${levelLabel} (score: ${score}/100). Costo probable: ${formatCurrency(finalCost, currency, true)}.`,
    inputs,
    createdAt: new Date().toISOString(),
    leadCaptured: false,
  };
}

export function calculate(
  calculatorId: CalculatorId,
  inputs: Record<string, unknown>,
  currency: Currency
): CalculationResult {
  switch (calculatorId) {
    case "iso-quality":
      return calculateIsoQuality(inputs, currency);
    case "owasp-web":
      return calculateOwaspWeb(inputs, currency);
    case "owasp-mobile":
      return calculateOwaspMobile(inputs, currency);
    case "sector":
      return calculateSector(inputs, currency);
    default:
      throw new Error(`Unknown calculator: ${calculatorId}`);
  }
}