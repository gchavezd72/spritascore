/**
 * Parser + aggregation checks for Sprita iT Analytics.
 * Run: npm run verify:analytics
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloads = "/Users/gabrielchavezdiaz/Downloads";

let failed = 0;
let passed = 0;
const assert = (condition, message) => {
  if (condition) {
    passed += 1;
    return;
  }
  failed += 1;
  console.error(`FAIL: ${message}`);
};

const { parseCsv } = await import(pathToFileURL(path.join(root, "src/lib/kiuwan/csv.ts")).href);
const { classifyByFilename, classifyByHeaders } = await import(
  pathToFileURL(path.join(root, "src/lib/kiuwan/classify.ts")).href
);
const { parseKiuwanFiles } = await import(pathToFileURL(path.join(root, "src/lib/kiuwan/parse.ts")).href);
const { applicationFunnel, componentFunnel, qualityRadar, improvementsByArea, executiveSnapshot, applySelection, defaultSelection } =
  await import(pathToFileURL(path.join(root, "src/lib/kiuwan/aggregate.ts")).href);

const quoted = parseCsv('a,b\n"1,2",3\n');
assert(quoted.headers.join("|") === "a|b", "CSV headers");
assert(quoted.rows[0].a === "1,2" && quoted.rows[0].b === "3", "Quoted comma field");

assert(classifyByFilename("x_Vulnerabilities_rfc_4180.csv") === "vulnerabilities", "Classify vulnerabilities filename");
assert(classifyByFilename("x_INSIGHT_SECURITY_rfc_4180.csv") === "insight-security", "Classify insight security");
assert(classifyByFilename("webclient-defects.sarif.json") === "sarif", "Classify SARIF");
assert(classifyByFilename("sbom-webclient.json") === "sbom", "Classify SBOM");
assert(
  classifyByHeaders(["CVE", "CVSS Base Score", "Exploitability Subscore", "Component"]) === "insight-security",
  "Classify security by headers"
);

const sample = parseKiuwanFiles([
  {
    name: "demo_Vulnerabilities_rfc_4180.csv",
    size: 120,
    text: "Rule code,Rule,Priority,CWE,Software characteristic,Vulnerability type,Language,Effort,File,Line number,Muted,Status\nR1,Backup,High,16,Security,Misconfiguration,Kotlin,06m,app/AndroidManifest.xml,2,No,none\n",
  },
  {
    name: "demo_INSIGHT_SECURITY_rfc_4180.csv",
    size: 80,
    text: "CVE,Private,CWE,CVSS Base Score,Description,Component,Mute\n",
  },
  {
    name: "demo_Metrics_rfc_4180.csv",
    size: 160,
    text: "File,Lines of code,Global indicator,Efficiency indicator,Maintainability indicator,Portability indicator,Reliability  indicator,Security indicator,All defects\nsrc/a.ts,20,80,90,40,100,50,100,3\n",
  },
  {
    name: "demo_DefectsTable_rfc_4180.csv",
    size: 140,
    text: "Rule code,Rule,Priority,CWE,Software characteristic,Vulnerability type,Language,Effort,File,Line number,Muted,Status\nQ1,Dead code,High,,Maintainability,,Java,30m,src/a.ts,10,No,none\n",
  },
]);

assert(sample.model.findings.length === 2, `Sample findings, got ${sample.model.findings.length}`);
assert(sample.model.files.some((file) => file.kind === "insight-security" && file.rowCount === 0), "Empty security file detected");
const funnel = applicationFunnel(sample.model.findings);
assert(funnel.stages.at(-1)?.id === "top10", "App funnel ends at top 10");
assert((funnel.stages.at(-1)?.count ?? 99) <= 10, "App funnel last stage <= 10");
const radar = qualityRadar(sample.model, sample.model.findings);
assert(radar.length === 5, "Radar has 5 attributes");
assert(radar.every((item) => item.score >= 0 && item.score <= 100), "Radar scores 0-100");
const exec = executiveSnapshot(sample.model, sample.model.findings);
assert(exec.securityFile.present && exec.securityFile.empty, "Executive snapshot sees empty security file");
const byArea = improvementsByArea(sample.model.findings);
assert(Array.isArray(byArea.Maintainability) && byArea.Maintainability.length === 1, "Improvements by area");

const realFiles = [
  "7555908_2025-09-15 22-02-38.0_DefectsTable_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_INSIGHT_COMPONENTS_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_INSIGHT_LICENSE_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_INSIGHT_OBSOLESCENCE_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_INSIGHT_SECURITY_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_Metrics_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_Vulnerabilities_rfc_4180.csv",
]
  .map((name) => path.join(downloads, name))
  .filter((full) => fs.existsSync(full));

if (realFiles.length > 0) {
  const sources = realFiles.map((full) => ({
    name: path.basename(full),
    size: fs.statSync(full).size,
    text: fs.readFileSync(full, "utf8"),
  }));
  const parsed = parseKiuwanFiles(sources);
  const selected = applySelection(parsed.model, defaultSelection());
  const app = applicationFunnel(selected);
  const sca = componentFunnel(parsed.model);
  assert(parsed.model.findings.length > 0, "Real export produces findings");
  assert((app.stages.at(-1)?.count ?? 99) <= 10, `Real app funnel last <= 10, got ${app.stages.at(-1)?.count}`);
  assert((sca.stages.at(-1)?.count ?? 99) <= 10, `Real component funnel last <= 10, got ${sca.stages.at(-1)?.count}`);
  assert(
    sca.stages.every((stage, index) => index === 0 || stage.count <= sca.stages[index - 1].count),
    "Component funnel is monotonic"
  );
  const security = parsed.model.files.find((file) => file.kind === "insight-security");
  assert(Boolean(security), "Real security file classified");
  assert(security?.rowCount === 0, "Real INSIGHT_SECURITY is empty");
  assert(qualityRadar(parsed.model, selected).length === 5, "Real radar has 5 axes");
} else {
  console.log("SKIP: local Kiuwan CSVs not found in Downloads");
}

const demoPath = path.join(root, "public/analytics-demo.json");
assert(fs.existsSync(demoPath), "Demo fixture exists");
if (fs.existsSync(demoPath)) {
  const demo = JSON.parse(fs.readFileSync(demoPath, "utf8"));
  assert(Array.isArray(demo.model?.findings) && demo.model.findings.length > 0, "Demo fixture has findings");
}

const { buildAnalyticsPdf, logoFileToDataUrl } = await import(
  pathToFileURL(path.join(root, "src/lib/kiuwan/analyticsPdf.ts")).href
);
const { remediateFinding } = await import(pathToFileURL(path.join(root, "src/lib/kiuwan/remediation.ts")).href);
const backup = remediateFinding({
  rule: "Inadecuate backup configuration",
  ruleCode: "OPT.KOTLIN.ANDROID.PreventBackupVulnerability",
  cwe: ["CWE-16"],
});
assert(backup.example.includes("allowBackup"), "Backup remediation includes example");
assert(fs.existsSync(path.join(root, "public/logos/sprita-it-light.png")), "Sprita iT light logo is available");
assert(fs.existsSync(path.join(root, "public/logos/sprita-it-dark.png")), "Sprita iT dark logo is available");
if (fs.existsSync(demoPath)) {
  const demo = JSON.parse(fs.readFileSync(demoPath, "utf8"));
  const findings = applySelection(demo.model, defaultSelection());
  const logo = logoFileToDataUrl(new Uint8Array(fs.readFileSync(path.join(root, "public/logos/sprita-it-light.png"))));
  const doc = buildAnalyticsPdf({ model: demo.model, findings }, logo);
  const bytes = Buffer.from(doc.output("arraybuffer"));
  assert(bytes.subarray(0, 5).toString() === "%PDF-", "PDF magic header");
  assert(doc.getNumberOfPages() >= 3, `PDF should have cover + 3 analyses, got ${doc.getNumberOfPages()}`);
  const raw = bytes.toString("latin1");
  assert(raw.includes("Top 10") || raw.includes("Informe"), "PDF contains title");
  assert(bytes.length > 20_000, "PDF is not empty");
}

console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
