/**
 * Generate a review PDF from the anonymized demo fixture.
 * Run: npx tsx scripts/preview-analytics-pdf.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "tmp-pdf-review");
fs.mkdirSync(outDir, { recursive: true });

const { applySelection, defaultSelection } = await import(
  pathToFileURL(path.join(root, "src/lib/kiuwan/aggregate.ts")).href
);
const { buildAnalyticsPdf, logoFileToDataUrl } = await import(
  pathToFileURL(path.join(root, "src/lib/kiuwan/analyticsPdf.ts")).href
);

const demo = JSON.parse(fs.readFileSync(path.join(root, "public/analytics-demo.json"), "utf8"));
const findings = applySelection(demo.model, defaultSelection());
const logoBytes = fs.readFileSync(path.join(root, "public/logos/sprita-it.png"));
const logo = logoFileToDataUrl(new Uint8Array(logoBytes));

const doc = buildAnalyticsPdf({ model: demo.model, findings }, logo);
const out = path.join(outDir, "preview.pdf");
fs.writeFileSync(out, Buffer.from(doc.output("arraybuffer")));
console.log("Wrote", out, "pages", doc.getNumberOfPages());
