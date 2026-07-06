/**
 * Executive Software Risk Score QA — run: npm run verify:executive
 */
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
  if (noResult.riskExposureScore !== 1000 || noResult.rawMaturityPoints !== 0) {
    console.error("FAIL: all No should be risk 1000 and maturity 0", noResult);
    failed++;
  } else {
    passed++;
  }

  const partial = Object.fromEntries(EXECUTIVE_QUESTION_META.map((q) => [q.id, "partially"]));
  const partialResult = calculateExecutiveRiskScore(partial);
  if (partialResult.rawMaturityPoints !== 7.5) {
    console.error("FAIL: all Partially should be 7.5 points", partialResult);
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