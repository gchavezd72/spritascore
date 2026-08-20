/**
 * Builds an anonymized demo AnalysisModel from local Kiuwan exports.
 * Run: npx tsx scripts/generate-kiuwan-demo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloads = "/Users/gabrielchavezdiaz/Downloads";

const files = [
  "7555908_2025-09-15 22-02-38.0_DefectsTable_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_INSIGHT_COMPONENTS_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_INSIGHT_LICENSE_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_INSIGHT_OBSOLESCENCE_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_INSIGHT_SECURITY_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_Metrics_rfc_4180.csv",
  "7555908_2025-09-15 22-02-38.0_Vulnerabilities_rfc_4180.csv",
];

function sanitizePath(value) {
  return value
    .replace(/arlooh[_-]?flutter/gi, "demoapp")
    .replace(/arlooh/gi, "DemoApp")
    .replace(/com\/example\/[a-z0-9_]+/gi, "com/example/demoapp");
}

function sanitizeName(value) {
  return value.replace(/7555908/g, "demo").replace(/arlooh/gi, "demoapp");
}

const { parseKiuwanFiles } = await import(pathToFileURL(path.join(root, "src/lib/kiuwan/parse.ts")).href);

const sources = files
  .map((name) => {
    const full = path.join(downloads, name);
    if (!fs.existsSync(full)) return null;
    const text = fs.readFileSync(full, "utf8");
    return { name: sanitizeName(name), size: Buffer.byteLength(text), text };
  })
  .filter(Boolean);

if (sources.length === 0) {
  console.error("No Kiuwan sample files found in Downloads.");
  process.exit(1);
}

const { model, warnings } = parseKiuwanFiles(sources);

const sanitized = {
  ...model,
  files: model.files.map((file) => ({ ...file, name: sanitizeName(file.name) })),
  findings: model.findings.map((finding) => ({
    ...finding,
    file: sanitizePath(finding.file),
    id: finding.id.replace(/arlooh/gi, "demoapp"),
  })),
  metrics: model.metrics.map((metric) => ({ ...metric, file: sanitizePath(metric.file) })),
  application: { name: "DemoApp", analyzedAt: model.application.analyzedAt },
};

const out = path.join(root, "src/lib/kiuwan/demo.ts");
const body = `import type { AnalysisModel, ParseWarning } from "./types";

/** Anonymized snapshot derived from a real Kiuwan export. No source snippets. */
export const DEMO_ANALYSIS: AnalysisModel = ${JSON.stringify(sanitized, null, 2)};

export const DEMO_WARNINGS: ParseWarning[] = ${JSON.stringify(warnings, null, 2)};
`;

fs.writeFileSync(out, body);
console.log(`Wrote ${out} (${sanitized.findings.length} findings, ${sanitized.components.length} components)`);
