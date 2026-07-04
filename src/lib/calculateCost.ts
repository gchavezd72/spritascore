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
import { tr } from "@/lib/translate";
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

function isEn(locale: Locale): boolean {
  return locale === "en";
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
  ios: { es: "iOS", en: "iOS" },
  android: { es: "Android", en: "Android" },
  ambas: { es: "iOS y Android", en: "iOS and Android" },
};

const ENVIRONMENT_LABELS: Record<string, LocalizedText> = {
  desarrollo: { es: "Desarrollo", en: "Development" },
  testing: { es: "Testing", en: "Testing" },
  produccion: { es: "Producción", en: "Production" },
};

export function calculateIsoQuality(
  inputs: Record<string, unknown>,
  currency: Currency,
  locale: Locale = "es"
): CalculationResult {
  const en = isEn(locale);
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
      name: en ? dim.name : dim.nameEs,
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

  const criticalityLabel = labelOf(DEPENDENCY_LEVELS, criticality, locale);
  const riskFactors = en
    ? [
        `Technical debt concentrated in: ${topDimensions.join(", ")}`,
        `${incidents} incidents per month on average`,
        `${reworkHours + bugHours} hours/week spent on bug fixing and rework`,
        `Business dependency on software: ${criticalityLabel}`,
      ]
    : [
        `Deuda técnica concentrada en: ${topDimensions.join(", ")}`,
        `${incidents} incidentes al mes en promedio`,
        `${reworkHours + bugHours} horas/semana en corrección de errores y retrabajo`,
        `Dependencia del negocio del software: ${criticalityLabel}`,
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
      items: en
        ? [
            { label: "Bug fixing", value: bugHours * 4.33 * hourlyRate * 12 },
            { label: "Defect support", value: supportHours * 4.33 * hourlyRate * 12 },
            { label: "Rework", value: reworkHours * 4.33 * hourlyRate * 12 },
            { label: "Criticality factor", value: annualCost - monthlyHours * hourlyRate * 12 },
          ]
        : [
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
    executiveSummary: en
      ? `Based on the information provided, your application shows a ${levelLabel} risk level. The estimated cost of poor quality ranges between ${formatCurrency(annualCost * 0.7, currency)} and ${formatCurrency(annualCost * 1.5, currency)}, with a probable scenario of ${formatCurrency(annualCost, currency)} per year. The main risk factors are: ${riskFactors.slice(0, 2).join("; ")}.`
      : `Con base en los datos ingresados, su aplicación presenta un nivel de riesgo ${levelLabel}. El costo estimado de no calidad se encuentra entre ${formatCurrency(annualCost * 0.7, currency)} y ${formatCurrency(annualCost * 1.5, currency)}, con un escenario probable de ${formatCurrency(annualCost, currency)} anuales. Los principales factores de riesgo son: ${riskFactors.slice(0, 2).join("; ")}.`,
    partialSummary: en
      ? `${levelLabel} risk level (score: ${score}/100). Estimated annual cost: ${formatCurrency(annualCost, currency, true)}.`
      : `Nivel de riesgo ${levelLabel} (score: ${score}/100). Costo anual estimado: ${formatCurrency(annualCost, currency, true)}.`,
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
  const en = isEn(locale);
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

  const owaspName = en ? owasp.name : owasp.nameEs;
  const exposureLabel = labelOf(EXPOSURE_LEVELS, exposure, locale);
  const exploitationLabel = labelOf(EXPLOITATION_LEVELS, exploitation, locale);
  const environmentLabel = labelOf(Object.entries(ENVIRONMENT_LABELS).map(([value, label]) => ({ value, label })), environment, locale);
  const riskFactors = en
    ? [
        `OWASP vulnerability: ${owaspName}`,
        `${exposureLabel} exposure in ${environmentLabel.toLowerCase()} for ${exposureDays} days`,
        `Exploitation level: ${exploitationLabel}`,
        `${sensitiveRecords.toLocaleString()} sensitive records at risk`,
      ]
    : [
        `Vulnerabilidad OWASP: ${owaspName}`,
        `Exposición ${exposureLabel.toLowerCase()} en ${environmentLabel.toLowerCase()} durante ${exposureDays} días`,
        `Nivel de explotación: ${exploitationLabel}`,
        `${sensitiveRecords.toLocaleString()} registros sensibles en riesgo`,
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
      items: en
        ? [
            { label: "Technical remediation", value: remediationCost },
            { label: "Investigation", value: investigationCost },
            { label: "Operational disruption", value: interruptionCost },
            { label: "Regulatory risk", value: regulatoryCost },
            { label: "Reputational impact", value: reputationalCost },
            { label: "Opportunity cost", value: opportunityCost },
            { label: "Post-incident monitoring", value: monitoringCost },
          ]
        : [
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
    executiveSummary: en
      ? `Based on the information provided, your application shows a ${levelLabel} risk level. The estimated exposure cost ranges between ${formatCurrency(totalCost * 0.6, currency)} and ${formatCurrency(totalCost * 2, currency)}, with a probable scenario of ${formatCurrency(totalCost, currency)}. The main risk factors are: ${riskFactors.slice(0, 2).join("; ")}.`
      : `Con base en los datos ingresados, su aplicación presenta un nivel de riesgo ${levelLabel}. El costo estimado de exposición se encuentra entre ${formatCurrency(totalCost * 0.6, currency)} y ${formatCurrency(totalCost * 2, currency)}, con un escenario probable de ${formatCurrency(totalCost, currency)}. Los principales factores de riesgo son: ${riskFactors.slice(0, 2).join("; ")}.`,
    partialSummary: en
      ? `${levelLabel} risk level (score: ${score}/100). Estimated impact: ${formatCurrency(totalCost, currency, true)}.`
      : `Nivel de riesgo ${levelLabel} (score: ${score}/100). Impacto estimado: ${formatCurrency(totalCost, currency, true)}.`,
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
  const en = isEn(locale);
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

  const mobileName = en ? mobile.name : mobile.nameEs;
  const platformLabel = PLATFORM_LABELS[platform] ? tr(PLATFORM_LABELS[platform], locale) : platform;
  const riskFactors = en
    ? [
        `Mobile vulnerability: ${mobileName}`,
        `${activeUsers.toLocaleString()} active users exposed`,
        `Platform: ${platformLabel}`,
        hasPayments ? "Processes in-app payments" : "No in-app payments",
      ]
    : [
        `Vulnerabilidad móvil: ${mobileName}`,
        `${activeUsers.toLocaleString()} usuarios activos expuestos`,
        `Plataforma: ${platformLabel}`,
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
      items: en
        ? [
            { label: "Technical remediation", value: remediationCost },
            { label: "App store re-publishing", value: publishCost },
            { label: "User support", value: supportCost },
            { label: "Data exposure", value: dataExposureCost },
            { label: "Fraud risk", value: fraudRisk },
            { label: "User churn", value: userLossCost },
            { label: "Reputational impact", value: reputationalCost },
          ]
        : [
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
    executiveSummary: en
      ? `Based on the information provided, your mobile application shows a ${levelLabel} risk level. The estimated cost ranges between ${formatCurrency(totalCost * 0.5, currency)} and ${formatCurrency(totalCost * 2.5, currency)}, with a probable scenario of ${formatCurrency(totalCost, currency)}. Impact per user: ${formatCurrency(totalCost / Math.max(activeUsers, 1), currency)}.`
      : `Con base en los datos ingresados, su aplicación móvil presenta un nivel de riesgo ${levelLabel}. El costo estimado se encuentra entre ${formatCurrency(totalCost * 0.5, currency)} y ${formatCurrency(totalCost * 2.5, currency)}, con un escenario probable de ${formatCurrency(totalCost, currency)}. Impacto por usuario: ${formatCurrency(totalCost / Math.max(activeUsers, 1), currency)}.`,
    partialSummary: en
      ? `${levelLabel} risk level (score: ${score}/100). Estimated cost: ${formatCurrency(totalCost, currency, true)}.`
      : `Nivel de riesgo ${levelLabel} (score: ${score}/100). Costo estimado: ${formatCurrency(totalCost, currency, true)}.`,
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
  const en = isEn(locale);
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
  const riskFactors = en
    ? [
        `Sector: ${sectorName} (${sector.multiplier}x risk multiplier)`,
        `Applicable regulation: ${regulationLabel}`,
        `Security maturity: ${maturityLabel}`,
        `${records.toLocaleString()} sensitive records handled`,
      ]
    : [
        `Sector: ${sectorName} (multiplicador de riesgo ${sector.multiplier}x)`,
        `Regulación aplicable: ${regulationLabel}`,
        `Madurez de seguridad: ${maturityLabel}`,
        `${records.toLocaleString()} registros sensibles gestionados`,
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
      items: en
        ? [
            { label: "Base vulnerability cost", value: baseCost },
            { label: "Sector factor", value: baseCost * (sector.multiplier - 1) },
            { label: "Regulatory factor", value: baseCost * sector.multiplier * (regulationMult - 1) },
            { label: "Maturity factor", value: baseCost * sector.multiplier * regulationMult * (maturityMult - 1) },
            { label: "Data volume adjustment", value: adjustedCost - totalCost },
          ]
        : [
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
    executiveSummary: en
      ? `Based on the information provided, your organization in the ${sectorName} sector shows a ${levelLabel} risk level. The estimated cost ranges between ${formatCurrency(finalCost * 0.5, currency)} and ${formatCurrency(finalCost * 3, currency)}, with a probable scenario of ${formatCurrency(finalCost, currency)}.`
      : `Con base en los datos ingresados, su organización en el sector ${sectorName} presenta un nivel de riesgo ${levelLabel}. El costo estimado se encuentra entre ${formatCurrency(finalCost * 0.5, currency)} y ${formatCurrency(finalCost * 3, currency)}, con un escenario probable de ${formatCurrency(finalCost, currency)}.`,
    partialSummary: en
      ? `${levelLabel} risk level (score: ${score}/100). Probable cost: ${formatCurrency(finalCost, currency, true)}.`
      : `Nivel de riesgo ${levelLabel} (score: ${score}/100). Costo probable: ${formatCurrency(finalCost, currency, true)}.`,
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
  const en = isEn(locale);
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
    ({ bajo: { es: "bajo", en: "low" }, medio: { es: "medio", en: "medium" }, alto: { es: "alto", en: "high" } } as Record<string, LocalizedText>)[noiseLevel] ?? { es: noiseLevel, en: noiseLevel },
    locale
  );
  const riskFactors = en
    ? [
        `${Math.round(totalHoursYear).toLocaleString()} hours per year lost to manual triage and context switching (≈${fte.toFixed(1)} full-time employees)`,
        `${toolCount} disconnected security tools with no shared prioritization`,
        `Estimated noise level: ${noiseWord} — about ${Math.round(noisePct * 100)}% of findings are duplicates or false positives`,
        `${remediationDelayDays} extra days of exposure per critical finding due to unclear prioritization`,
      ]
    : [
        `${Math.round(totalHoursYear).toLocaleString()} horas al año perdidas en triage manual y cambio de contexto (≈${fte.toFixed(1)} personas de tiempo completo)`,
        `${toolCount} herramientas de seguridad desconectadas y sin priorización compartida`,
        `Nivel de ruido estimado: ${noiseWord} — cerca del ${Math.round(noisePct * 100)}% de los hallazgos son duplicados o falsos positivos`,
        `${remediationDelayDays} días extra de exposición por hallazgo crítico debido a la falta de priorización clara`,
      ];

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
      items: en
        ? [
            { label: "Manual finding triage", value: triageCost },
            { label: "Noise: false positives and duplicates", value: noiseCost },
            { label: "Context switching between tools", value: contextSwitchCost },
            { label: "Delayed remediation from lack of prioritization", value: delayedRemediationCost },
          ]
        : [
            { label: "Triage manual de hallazgos", value: triageCost },
            { label: "Ruido: falsos positivos y duplicados", value: noiseCost },
            { label: "Cambio de contexto entre herramientas", value: contextSwitchCost },
            { label: "Remediación retrasada por falta de priorización", value: delayedRemediationCost },
          ],
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: en
      ? `Without an Application Security Posture Management (ASPM) platform to correlate and prioritize findings, your team loses approximately ${Math.round(totalHoursYear).toLocaleString()} hours per year (equivalent to ${fte.toFixed(1)} full-time employees) manually triaging ${toolCount} disconnected tools. The estimated annual cost of that inefficiency is ${formatCurrency(totalCost, currency)}, with a scenario that could reach ${formatCurrency(totalCost * 1.6, currency)} if finding volume grows.`
      : `Sin una plataforma de gestión de postura de seguridad de aplicaciones (ASPM) que correlacione y priorice hallazgos, su equipo pierde aproximadamente ${Math.round(totalHoursYear).toLocaleString()} horas al año (equivalente a ${fte.toFixed(1)} personas de tiempo completo) triando manualmente ${toolCount} herramientas desconectadas. El costo anual estimado de esa ineficiencia es de ${formatCurrency(totalCost, currency)}, con un escenario que puede llegar a ${formatCurrency(totalCost * 1.6, currency)} si el volumen de hallazgos crece.`,
    partialSummary: en
      ? `${levelLabel} risk level (score: ${score}/100). You lose ≈${Math.round(totalHoursYear).toLocaleString()} hours/year and ${formatCurrency(totalCost, currency, true)}/year without automated prioritization.`
      : `Nivel de riesgo ${levelLabel} (score: ${score}/100). Pierde ≈${Math.round(totalHoursYear).toLocaleString()} horas/año y ${formatCurrency(totalCost, currency, true)}/año sin priorización automática.`,
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
  const en = isEn(locale);
  const annualRevenue = num(inputs.annualRevenue, 5000000);
  const productCategory = str(inputs.productCategory, "default");
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

  const categoryMultiplier = productCategory === "critico" ? 1.4 : productCategory === "importante" ? 1.2 : 1;

  const essentialFineExposure = Math.min(annualRevenue * 0.025, 15_000_000) * essentialGapPct;
  const vulnFineExposure = Math.min(annualRevenue * 0.02, 10_000_000) * vulnGapPct;
  const reportingFineExposure = Math.min(annualRevenue * 0.01, 5_000_000) * reportingGapPct;
  const regulatoryExposure = (essentialFineExposure + vulnFineExposure + reportingFineExposure) * categoryMultiplier;

  const remediationHours =
    200 * essentialGapPct + 150 * vulnGapPct + 80 * reportingGapPct;
  const remediationCost = remediationHours * hourlyRate;

  const conformityCost = productCategory === "critico" ? 75_000 : productCategory === "importante" ? 35_000 : 0;

  const totalCost = regulatoryExposure + remediationCost + conformityCost;

  const reportingDaysLeft = daysUntil(CRA_REPORTING_DEADLINE);
  const fullComplianceDaysLeft = daysUntil(CRA_FULL_COMPLIANCE_DEADLINE);

  const categoryShort = tr(
    ({
      default: { es: "por defecto", en: "default" },
      importante: { es: "importante (Anexo III)", en: "important (Annex III)" },
      critico: { es: "crítico (Anexo IV)", en: "critical (Annex IV)" },
    } as Record<string, LocalizedText>)[productCategory] ?? { es: productCategory, en: productCategory },
    locale
  );
  const riskFactors = en
    ? [
        reportingDaysLeft > 0
          ? `${reportingDaysLeft.toLocaleString()} days left before the CRA's vulnerability reporting obligations take effect (Sept. 11, 2026)`
          : `The CRA's vulnerability reporting obligations have been in effect since September 11, 2026`,
        fullComplianceDaysLeft > 0
          ? `${fullComplianceDaysLeft.toLocaleString()} days left until full CRA compliance is required (Dec. 11, 2027)`
          : `The full CRA compliance deadline (Dec. 11, 2027) has already passed`,
        `Essential security requirements gap: ${Math.round(essentialGapPct * 100)}% still unmet`,
        `Vulnerability management gap (SBOM, patching, disclosure): ${Math.round(vulnGapPct * 100)}% still unmet`,
        `Product classified as ${categoryShort}${productCategory !== "default" ? " — requires third-party conformity assessment" : ""}`,
      ]
    : [
        reportingDaysLeft > 0
          ? `Quedan ${reportingDaysLeft.toLocaleString()} días para que entren en vigor las obligaciones de reporte de vulnerabilidades del CRA (11 sept. 2026)`
          : `Las obligaciones de reporte de vulnerabilidades del CRA ya están vigentes desde el 11 de septiembre de 2026`,
        fullComplianceDaysLeft > 0
          ? `Quedan ${fullComplianceDaysLeft.toLocaleString()} días para el cumplimiento total del CRA (11 dic. 2027)`
          : `El plazo de cumplimiento total del CRA (11 dic. 2027) ya se cumplió`,
        `Brecha en requisitos esenciales de seguridad: ${Math.round(essentialGapPct * 100)}% aún sin cubrir`,
        `Brecha en gestión de vulnerabilidades (SBOM, parches, divulgación): ${Math.round(vulnGapPct * 100)}% aún sin cubrir`,
        `Producto clasificado como ${categoryShort}${productCategory !== "default" ? " — requiere evaluación de conformidad por terceros" : ""}`,
      ];

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
      items: en
        ? [
            { label: "Estimated exposure from essential requirements", value: essentialFineExposure * categoryMultiplier },
            { label: "Estimated exposure from vulnerability management", value: vulnFineExposure * categoryMultiplier },
            { label: "Estimated exposure from reporting obligations", value: reportingFineExposure * categoryMultiplier },
            { label: "Technical and documentation remediation cost", value: remediationCost },
            ...(conformityCost > 0 ? [{ label: "Third-party conformity assessment", value: conformityCost }] : []),
          ]
        : [
            { label: "Exposición estimada por requisitos esenciales", value: essentialFineExposure * categoryMultiplier },
            { label: "Exposición estimada por gestión de vulnerabilidades", value: vulnFineExposure * categoryMultiplier },
            { label: "Exposición estimada por obligaciones de reporte", value: reportingFineExposure * categoryMultiplier },
            { label: "Costo de remediación técnica y documental", value: remediationCost },
            ...(conformityCost > 0 ? [{ label: "Evaluación de conformidad por terceros", value: conformityCost }] : []),
          ],
    },
    impactMatrix,
    riskFactors,
    recommendations: recs.all,
    immediateActions: recs.immediate,
    actions30Days: recs.days30,
    actions90Days: recs.days90,
    executiveSummary: en
      ? `Your compliance gap level with the EU Cyber Resilience Act is ${levelLabel} (score: ${score}/100). Based on your essential requirements, vulnerability management, and reporting obligations, the estimated regulatory and remediation exposure is ${formatCurrency(totalCost, currency)}, ranging between ${formatCurrency(totalCost * 0.6, currency)} and ${formatCurrency(totalCost * 1.5, currency)}. Vulnerability reporting obligations take effect on September 11, 2026, and full compliance is required from December 11, 2027.`
      : `Su nivel de brecha de cumplimiento con el EU Cyber Resilience Act es ${levelLabel} (score: ${score}/100). Con base en sus requisitos esenciales, gestión de vulnerabilidades y obligaciones de reporte, la exposición regulatoria y de remediación estimada es de ${formatCurrency(totalCost, currency)}, en un rango entre ${formatCurrency(totalCost * 0.6, currency)} y ${formatCurrency(totalCost * 1.5, currency)}. Las obligaciones de reporte de vulnerabilidades entran en vigor el 11 de septiembre de 2026 y el cumplimiento total se exige desde el 11 de diciembre de 2027.`,
    partialSummary: en
      ? `CRA compliance gap level: ${levelLabel} (score: ${score}/100). Estimated exposure: ${formatCurrency(totalCost, currency, true)}.`
      : `Nivel de brecha de cumplimiento CRA: ${levelLabel} (score: ${score}/100). Exposición estimada: ${formatCurrency(totalCost, currency, true)}.`,
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
  switch (calculatorId) {
    case "iso-quality":
      return calculateIsoQuality(inputs, currency, locale);
    case "owasp-web":
      return calculateOwaspWeb(inputs, currency, locale);
    case "owasp-mobile":
      return calculateOwaspMobile(inputs, currency, locale);
    case "sector":
      return calculateSector(inputs, currency, locale);
    case "aspm-cost":
      return calculateAspmCost(inputs, currency, locale);
    case "cra-compliance":
      return calculateCraCompliance(inputs, currency, locale);
    default:
      throw new Error(`Unknown calculator: ${calculatorId}`);
  }
}
