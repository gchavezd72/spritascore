/**
 * Executive Software Risk Score QA — run: npm run verify:executive
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";

async function main() {
  const { calculateExecutiveRiskScore, getAnswerPoints } = await import(
    pathToFileURL(path.join(root, "src/lib/calculateExecutiveRiskScore.ts")).href
  );
  const { EXECUTIVE_QUESTION_META } = await import(
    pathToFileURL(path.join(root, "src/data/executiveSoftwareRiskScore.ts")).href
  );
  const { pdfText } = await import(pathToFileURL(path.join(root, "src/lib/pdfText.ts")).href);

  let failed = 0;
  let passed = 0;

  const allYes = Object.fromEntries(EXECUTIVE_QUESTION_META.map((q) => [q.id, "yes"]));
  const allNo = Object.fromEntries(EXECUTIVE_QUESTION_META.map((q) => [q.id, "no"]));

  const yesResult = calculateExecutiveRiskScore(allYes);
  if (yesResult.riskExposureScore !== 0 || yesResult.rawMaturityPoints !== 15) {
    console.error("FAIL: all Yes should be risk 0 and maturity 15", yesResult);
    failed++;
  } else {
    passed++;
  }

  const noResult = calculateExecutiveRiskScore(allNo);
  if (noResult.riskExposureScore !== 100 || noResult.rawMaturityPoints !== 0 || noResult.maturityPercent !== 0) {
    console.error("FAIL: all No should be risk 100 and maturity 0", noResult);
    failed++;
  } else {
    passed++;
  }

  const partial = Object.fromEntries(EXECUTIVE_QUESTION_META.map((q) => [q.id, "partially"]));
  const partialResult = calculateExecutiveRiskScore(partial);
  if (partialResult.rawMaturityPoints !== 7.5 || partialResult.riskExposureScore !== 50) {
    console.error("FAIL: all Partially should be 7.5 points and risk 50", partialResult);
    failed++;
  } else {
    passed++;
  }

  const unsure = Object.fromEntries(EXECUTIVE_QUESTION_META.map((q) => [q.id, "not_sure"]));
  const unsureResult = calculateExecutiveRiskScore(unsure);
  if (unsureResult.riskExposureScore !== 100 || unsureResult.rawMaturityPoints !== 0) {
    console.error("FAIL: all Not sure should score 0 points and risk 100", unsureResult);
    failed++;
  } else {
    passed++;
  }

  const overScale = [yesResult, noResult, partialResult, unsureResult].some(
    (result) => result.riskExposureScore < 0 || result.riskExposureScore > 100
  );
  if (overScale) {
    console.error("FAIL: executive risk must stay inside 0–100");
    failed++;
  } else {
    passed++;
  }

  if (getAnswerPoints("not_sure") !== 0 || getAnswerPoints("partially") !== 0.5) {
    console.error("FAIL: answer point mapping");
    failed++;
  } else {
    passed++;
  }

  if (EXECUTIVE_QUESTION_META.length !== 15) {
    console.error("FAIL: expected 15 questions");
    failed++;
  } else {
    passed++;
  }

  const scaleFiles = [
    "src/components/executive/ExecutiveSoftwareRiskResult.tsx",
    "src/lib/executivePdf.ts",
    "src/i18n/executive.ts",
    "src/lib/calculateExecutiveRiskScore.ts",
  ];
  const scaleText = scaleFiles.map((rel) => fs.readFileSync(path.join(root, rel), "utf8")).join("\n");
  if (/\/ 1000|1000 is the worst|1000 la peor|1000 a pior|\* 1000/.test(scaleText)) {
    console.error("FAIL: executive score copy still mentions 1000");
    failed++;
  } else {
    passed++;
  }

  const sanitized = pdfText("→ Deploy SBOM · 0–30 days — Prioridades");
  if (sanitized.includes("\u2192") || sanitized.includes("\u00B7") || sanitized.includes("\u2014")) {
    console.error("FAIL: pdfText should strip Unicode punctuation", sanitized);
    failed++;
  } else if (!sanitized.startsWith("> Deploy SBOM")) {
    console.error("FAIL: pdfText arrow replacement", sanitized);
    failed++;
  } else {
    passed++;
  }

  console.log(`\nExecutive score verification: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});