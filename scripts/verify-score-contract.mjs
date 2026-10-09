/**
 * Score contract — run: npm run verify:score
 * DORA normalization, calc 05 display scale, EU AI Act scope, currency format.
 */
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { z } from "zod";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";

function load(rel) {
  return import(pathToFileURL(path.join(root, rel)).href);
}

let failed = 0;
let passed = 0;

function check(name, ok, detail) {
  if (ok) {
    passed++;
    console.log("PASS", name);
  } else {
    failed++;
    console.error("FAIL", name, detail ?? "");
  }
}

const questions = Array.from({ length: 15 }, (_, index) => [`q${index + 1}`, 1]);

function doraInputs(score, scope) {
  return {
    annualRevenue: 10_000_000,
    hourlyRate: 50,
    entityType: "credit-institution",
    doraInScope: scope,
    ...Object.fromEntries(questions.map(([key]) => [key, score])),
  };
}

async function main() {
  const { calculateDoraCompliance } = await load("src/lib/calculateCost.ts");
  const { calcular } = await load("src/lib/calc05.ts");
  const { mapCalc05ToCalculationResult } = await load("src/lib/mapCalc05Result.ts");
  const { getCalc05Copy } = await load("src/i18n/calc05.ts");
  const { calculateEuAiAct } = await load("src/lib/calculateEuAiAct.ts");
  const { formatCurrency } = await load("src/lib/formatCurrency.ts");

  const absent = calculateDoraCompliance(doraInputs(1, "si"), "USD", "es");
  const absentText = JSON.stringify(absent);
  check("dora all 1s score 100", absent.score === 100, absent.score);
  check("dora all 1s maturity 0%", absentText.includes("0%"), absentText.slice(0, 400));
  check("dora all 1s hides 20% maturity", !absentText.includes("20% de madurez"));

  const full = calculateDoraCompliance(doraInputs(5, "si"), "USD", "es");
  const fullText = JSON.stringify(full);
  check("dora all 5s score 0", full.score === 0, full.score);
  check("dora all 5s maturity 100%", fullText.includes("100%"));

  const out = calculateDoraCompliance(doraInputs(1, "no"), "USD", "es");
  const outText = JSON.stringify(out);
  check("dora out of scope costs less than in-scope sanction", out.cost.probable < absent.cost.probable, {
    out: out.cost.probable,
    inScope: absent.cost.probable,
  });
  check("dora out of scope is not labeled non-compliance", outText.includes("no se etiqueta"));

  const input = {
    sector: "fintech",
    vol: 4,
    ia: 3,
    sca: 3,
    mat: 1,
    hist: 3,
    currency: "USD",
  };
  const calc05 = calcular(input);
  const copy = getCalc05Copy("es");
  const bulletTexts = calc05.bullets.map((key) => copy.bullets[key] ?? key);
  const mapped = mapCalc05ToCalculationResult(input, calc05, "es", bulletTexts);
  const mappedText = JSON.stringify(mapped);
  check("calc05 display omits /1000", !mappedText.includes("/1000"));
  check("calc05 bullets omit LGPD and ANPD", !/LGPD|ANPD|Art\. 46/.test(bulletTexts.join("\n") + mappedText));
  check("calc05 USD notes the BRL rate", mappedText.includes("0,18") || mappedText.includes("0.18"));

  const outOfScope = calculateEuAiAct({
    classification: { S1: "no", S2: "no", S3: "no" },
    annexArea: "none",
    readiness: {},
  });
  check("ai act out of scope is not regulatory", outOfScope.regulatoryApplicable === false);
  check("ai act out of scope has no obligations", outOfScope.obligations.length === 0, outOfScope.obligations);
  check("ai act out of scope has no readiness", outOfScope.readinessScore == null);

  const notAi = calculateEuAiAct({
    classification: { S1: "yes", D1: "no", D4: "yes" },
    annexArea: "none",
    readiness: {},
  });
  check("not an AI system is not regulatory", notAi.regulatoryApplicable === false && notAi.verdict === "not-ai-system", notAi.verdict);
  check("not an AI system has no obligations", notAi.obligations.length === 0);
  check("not an AI system has no readiness", notAi.readinessScore == null);

  const eur = formatCurrency(4_000_000, "EUR", true);
  const mxn = formatCurrency(4_000_000, "MXN", true);
  check("EUR compact avoids Mio", !eur.includes("Mio"), eur);
  check("MXN shows the currency code", mxn.includes("MXN"), mxn);

  const numberSchema = z.preprocess(
    (value) => (value === "" || value == null || (typeof value === "number" && Number.isNaN(value)) ? undefined : value),
    z.number({ error: "Ingrese un número." })
  );
  const parsed = numberSchema.safeParse(Number.NaN);
  const message = parsed.success ? "" : parsed.error.issues.map((issue) => issue.message).join(" ");
  check("number validation stays in Spanish", !parsed.success && !/expected/i.test(message), message);

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
