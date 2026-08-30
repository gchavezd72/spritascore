/**
 * Lead + client result email QA — run: npm run verify:lead-email
 */
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";

delete process.env.LEAD_EMAIL_TO;
delete process.env.LEAD_EMAIL_FROM;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const {
  resolveLeadRecipients,
  resolveFromAddress,
  buildOutgoingEmails,
} = await import(pathToFileURL(path.join(root, "src/lib/sendLeadEmail.ts")).href);

const defaultTo = resolveLeadRecipients("");
assert(defaultTo.length === 1 && defaultTo[0] === "info@sprita-it.com", `empty LEAD_EMAIL_TO falls back to Sprita iT inbox, got ${defaultTo}`);

const from = resolveFromAddress("");
assert(from.includes("info@sprita-it.com"), `empty LEAD_EMAIL_FROM falls back to info@sprita-it.com, got ${from}`);

const baseLead = {
  name: "Ana Perez",
  company: "Banco Demo",
  email: "ana.perez@bancodemo.com",
  role: "CISO",
  country: "ES",
  sector: "banca",
  appCount: "12",
};

const withReport = buildOutgoingEmails({
  event: "lead_submitted",
  lead: { ...baseLead, wantsEmailReport: true },
  resultId: "res-1",
  calculatorId: "owasp-web",
  calculatorTitle: "Costo de vulnerabilidad OWASP Top 10",
  language: "es",
  score: 72,
  riskLevel: "alto",
  estimatedCost: 480000,
  estimatedCostFormatted: "US$480,000",
  executiveSummary: "La aplicacion web tiene exposicion alta por inyeccion y control de acceso.",
  topRecommendations: ["Desplegar WAF", "Corregir control de acceso"],
});

assert(withReport.length === 2, `wantsEmailReport should send internal + client, got ${withReport.length}`);
assert(withReport[0].to.includes("info@sprita-it.com"), "internal notice goes to info@sprita-it.com");
assert(withReport[0].from.includes("info@sprita-it.com"), "internal notice is sent from info@sprita-it.com");
assert(withReport[1].from.includes("info@sprita-it.com"), "client report is sent from info@sprita-it.com");
assert(withReport[1].replyTo === "info@sprita-it.com", "client replies go to info@sprita-it.com");
assert(withReport[1].to.includes("ana.perez@bancodemo.com") || withReport[1].to[0] === "ana.perez@bancodemo.com", "second email goes to the client");
assert(withReport[1].html.includes("72"), "client email includes the score");
assert(withReport[1].html.includes("OWASP"), "client email includes the calculator name");
assert(withReport[1].html.includes("US$480,000") || withReport[1].html.includes("480"), "client email includes the cost");
assert(withReport[1].html.includes("inyeccion") || withReport[1].html.includes("exposicion"), "client email includes the executive summary");
assert(withReport[1].subject.toLowerCase().includes("spritascore"), "client subject is branded");
assert(!withReport[1].html.includes("UTM source"), "client email must not include internal lead fields");

const withoutReport = buildOutgoingEmails({
  event: "lead_submitted",
  lead: { ...baseLead, wantsEmailReport: false },
  resultId: "res-2",
  calculatorId: "iso-quality",
  calculatorTitle: "Costo de no calidad en el codigo",
  language: "es",
  score: 40,
});

assert(withoutReport.length === 1, "unchecked wantsEmailReport sends only the internal notice");
assert(!JSON.stringify(withoutReport[0].to).includes("ana.perez@bancodemo.com"), "client is not a recipient when they declined the report");

console.log("Lead email verification: passed");
