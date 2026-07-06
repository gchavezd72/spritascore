/**
 * Verifies that calculate() produces locale-consistent report content for ES/EN/PT.
 * Run: npm run verify:locale
 */
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const FIXTURES = {
  "iso-quality": {
    sector: "retail", country: "MX", softwareDependency: "alto", appType: "web",
    codeAge: 3, linesOfCode: "100k-500k", devCount: 10, devMonthlyCost: 5000,
    bugHours: 8, supportHours: 4, reworkHours: 6, monthlyIncidents: 3, currency: "USD",
    confirmEstimate: true,
    "functional-suitability": 3, "performance-efficiency": 3, compatibility: 3,
    usability: 3, reliability: 3, security: 3, maintainability: 3, portability: 3,
  },
  "owasp-web": {
    sector: "retail", country: "US", softwareDependency: "alto", appType: "web",
    userCount: 50000, sensitiveRecords: 100000, exposure: "externa", environment: "produccion",
    owaspCategory: "A01", exploitationLevel: "exploitable", operationalImpact: "degradacion",
    remediationDays: 14, exposureDays: 30, hourlyRate: 75, annualRevenue: 5000000,
    dataTypes: ["personal"], currency: "USD", confirmEstimate: true,
  },
  "owasp-mobile": {
    sector: "fintech", country: "BR", platform: "ambas", activeUsers: 50000, downloads: 100000,
    mobileCategory: "M1", storeRemoval: "no", jailbreakDetection: "no", certificatePinning: "no",
    obfuscation: "no", apiSecurity: "parcial", hourlyRate: 75, annualRevenue: 2000000,
    currency: "USD", confirmEstimate: true,
  },
  sector: {
    sector: "banca", country: "MX", regulation: "pci-dss", securityMaturity: "basico",
    exposure: "externa", appCriticality: "alto", digitalDependency: "alto", recordVolume: 100000,
    monthlyRevenue: 500000, annualRevenue: 6000000, dataTypes: ["financial"],
    controls: ["sast", "waf"], currency: "USD", confirmEstimate: true,
  },
  "aspm-cost": {
    sector: "retail", country: "US", appCount: 20, securityTools: ["sast", "sca", "dast"],
    findingsPerMonth: 200, noiseLevel: "alto", triageHoursPerWeek: 12, securityEngineers: 3,
    engineerMonthlyCost: 8000, currency: "USD", confirmEstimate: true,
  },
  "cra-compliance": {
    productCategory: "default", annualRevenue: 5000000, secureByDesign: "parcial",
    noKnownVulnerabilities: "parcial", riskAssessment: "parcial", dataProtection: "parcial",
    hasSbom: "no", hasDisclosurePolicy: "no", patchDays: 45, supportYears: 3,
    conformityAssessment: "no", incidentReporting: "parcial", hourlyRate: 85, currency: "EUR",
    confirmEstimate: true,
  },
  "dora-compliance": {
    sector: "banca", country: "ES", entityType: "credit-institution", annualRevenue: 50000000,
    q1: "3", q2: "2", q3: "3", q4: "2", q5: "3", q6: "2", q7: "3",
    q8: "2", q9: "2", q10: "3", q11: "2", q12: "2", q13: "3", q14: "3", q15: "2",
    hourlyRate: 95, currency: "EUR", confirmEstimate: true,
  },
};

const SUMMARY_MARKERS = {
  es: [/Con base en/i, /Sin una plataforma/i, /nivel de riesgo/i, /nivel de brecha/i, /Quedan \d+ días/i, /Obtuvo \d+\/75/i],
  en: [/Based on the information/i, /Without an Application Security/i, /risk level/i, /compliance gap level/i, /\d+ days left before/i, /You scored \d+\/75/i],
  pt: [/Com base nos dados/i, /Sem uma plataforma/i, /nível de risco/i, /nível de lacuna/i, /Restam \d+ dias/i, /obteve \d+\/75/i],
};

const UI_MARKERS = {
  es: { executiveSummary: /Resumen ejecutivo/, print: /Imprimir/ },
  en: { executiveSummary: /Executive summary/, print: /Print/ },
  pt: { executiveSummary: /Resumo executivo/, print: /Imprimir|Salvar/ },
};

function matchesAny(text, patterns) {
  return patterns.some((p) => p.test(text));
}

function costLabelMatchesLocale(label, locale) {
  if (!label) return false;
  if (locale === "es") {
    return /Costo|Riesgo|Exposición|Remediación|Corrección|Triage|Factor|Interrupción|base/i.test(label)
      && !/\b(the|without|based on)\b/i.test(label);
  }
  if (locale === "en") {
    return /\b(cost|base|bug|vulnerability|exposure|technical|remediation|triage|factor|estimated|fixing|support)\b/i.test(label)
      && !/ção\b/i.test(label);
  }
  if (locale === "pt") {
    return /Custo|Exposição|Remediação|Correção|Triagem|Fator|Interrupção|base/i.test(label);
  }
  return false;
}

async function loadModules() {
  const mod = await import(pathToFileURL(path.join(root, "src/lib/calculateCost.ts")).href);
  const i18n = await import(pathToFileURL(path.join(root, "src/i18n/index.ts")).href);
  const translate = await import(pathToFileURL(path.join(root, "src/lib/translate.ts")).href);
  const configs = await import(pathToFileURL(path.join(root, "src/data/calculatorConfigs.ts")).href);
  const localize = await import(pathToFileURL(path.join(root, "src/lib/localizeResult.ts")).href);
  return {
    calculate: mod.calculate,
    localizeResult: localize.localizeResult,
    getTranslations: i18n.getTranslations,
    tr: translate.tr,
    getCalculatorById: configs.getCalculatorById,
  };
}

async function main() {
  const { calculate, localizeResult, getTranslations, tr, getCalculatorById } = await loadModules();
  let failed = 0;
  let passed = 0;

  for (const calcId of Object.keys(FIXTURES)) {
    const inputs = FIXTURES[calcId];
    const currency = inputs.currency || "USD";
    const byLocale = {};

    for (const locale of ["es", "en", "pt"]) {
      const result = calculate(calcId, inputs, currency, locale);
      byLocale[locale] = result;

      if (result.locale !== locale) {
        console.error(`FAIL [${calcId}/${locale}] result.locale = ${result.locale}`);
        failed++;
      } else {
        passed++;
      }

      if (!matchesAny(result.executiveSummary, SUMMARY_MARKERS[locale])) {
        console.error(`FAIL [${calcId}/${locale}] executiveSummary locale mismatch`);
        console.error(`  → ${result.executiveSummary.slice(0, 100)}...`);
        failed++;
      } else {
        passed++;
      }

      const firstLabel = result.cost.items[0]?.label ?? "";
      if (!costLabelMatchesLocale(firstLabel, locale)) {
        console.error(`FAIL [${calcId}/${locale}] cost label: "${firstLabel}"`);
        failed++;
      } else {
        passed++;
      }

      const t = getTranslations(locale);
      if (!UI_MARKERS[locale].executiveSummary.test(t.resultsView.executiveSummary)) {
        console.error(`FAIL [${calcId}/${locale}] UI executiveSummary label`);
        failed++;
      } else {
        passed++;
      }
      if (!UI_MARKERS[locale].print.test(t.reportPreview.print)) {
        console.error(`FAIL [${calcId}/${locale}] UI print label`);
        failed++;
      } else {
        passed++;
      }

      const calc = getCalculatorById(calcId);
      const title = calc ? tr(calc.title, locale) : "";
      if (locale === "pt" && title && /Costo de|Cost of/i.test(title) && !/Custo de|Compliance com/i.test(title)) {
        console.error(`FAIL [${calcId}/pt] calculator title not translated: ${title}`);
        failed++;
      } else {
        passed++;
      }

      // localizeResult must preserve id/locale and regenerate copy
      const relocalized = localizeResult({ ...result, leadCaptured: true }, locale);
      if (relocalized.id !== result.id || relocalized.locale !== locale) {
        console.error(`FAIL [${calcId}/${locale}] localizeResult metadata`);
        failed++;
      } else if (relocalized.executiveSummary !== result.executiveSummary) {
        console.error(`FAIL [${calcId}/${locale}] localizeResult changed summary unexpectedly`);
        failed++;
      } else {
        passed++;
      }
    }

    if (byLocale.es.executiveSummary === byLocale.en.executiveSummary) {
      console.error(`FAIL [${calcId}] ES and EN summaries are identical`);
      failed++;
    } else {
      passed++;
    }
    if (byLocale.es.executiveSummary === byLocale.pt.executiveSummary) {
      console.error(`FAIL [${calcId}] ES and PT summaries are identical`);
      failed++;
    } else {
      passed++;
    }
  }

  console.log(`\nReport locale verification: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});