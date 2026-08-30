/**
 * Printable PDF filename QA — run: npm run verify:pdf-filename
 *
 * Expected shape:
 *   {calculator-slug}-YYYY-MM-DD_HH-MM-SS.T.pdf
 * where T is tenths of a second (one decimal digit).
 */
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const { uniqueStamp, calculatorPdfFilename, calculatorPdfBasename } = await import(
  pathToFileURL(path.join(root, "src/lib/pdfFilename.ts")).href
);

const now = new Date(2026, 7, 20, 15, 4, 5, 370);
const stamp = uniqueStamp(now);

assert(stamp === "2026-08-20_15-04-05.3", `uniqueStamp seconds + tenths: got ${stamp}`);

assert(
  calculatorPdfFilename("owasp-top10-web", now) === "owasp-top10-web-2026-08-20_15-04-05.3.pdf",
  "printable filename uses calculator prefix + stamp + .pdf"
);

assert(
  calculatorPdfBasename("executive-software-risk-score", now) ===
    "executive-software-risk-score-2026-08-20_15-04-05.3",
  "print dialog basename has calculator prefix and no extension"
);

assert(
  calculatorPdfFilename("Costo de no calidad", now) ===
    "Costo-de-no-calidad-2026-08-20_15-04-05.3.pdf",
  "unsafe characters in the calculator prefix are sanitized"
);

const fourTenths = uniqueStamp(new Date(2026, 7, 20, 9, 8, 7, 400));
assert(fourTenths.endsWith("09-08-07.4"), `four tenths of a second: got ${fourTenths}`);

console.log("PDF filename verification: passed");
