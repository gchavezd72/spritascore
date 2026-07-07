/**
 * GTM / GA4 dataLayer checks — run: npm run verify:gtm
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";

async function main() {
  let failed = 0;
  let passed = 0;
  const assert = (ok, msg) => (ok ? passed++ : (console.error(`FAIL: ${msg}`), failed++));

  const layout = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
  assert(layout.includes("GoogleTagManagerHead"), "GTM head in layout");
  assert(layout.includes("GtmConsentInit"), "Consent sync in layout");

  const gtm = fs.readFileSync(path.join(root, "src/components/GoogleTagManager.tsx"), "utf8");
  assert(gtm.includes("GTM-NDXVZKB3"), "GTM container id");
  assert(gtm.includes("gtm-consent-default"), "Consent default before GTM");

  const analytics = fs.readFileSync(path.join(root, "src/lib/analytics.ts"), "utf8");
  assert(analytics.includes("pushAnalyticsEvent"), "Analytics uses pushAnalyticsEvent");

  const { pushAnalyticsEvent, setDefaultConsent, updateAnalyticsConsent } = await import(
    pathToFileURL(path.join(root, "src/lib/gtm.ts")).href
  );

  global.window = {
    location: { href: "https://spritascore.com/test", pathname: "/test" },
    document: { title: "Test" },
    dataLayer: [],
    dispatchEvent: () => true,
  };
  global.document = global.window.document;

  setDefaultConsent();
  assert(global.window.dataLayer.length > 0, "default consent pushes to dataLayer");

  pushAnalyticsEvent("lead_submitted", { calculator: "owasp-top10-web", sector: "finance" });
  const lead = global.window.dataLayer.at(-1);
  assert(lead?.event === "lead_submitted", "lead event name");
  assert(lead?.ga4_event_name === "generate_lead", "lead maps to generate_lead");
  assert(lead?.conversion === true, "lead marked conversion");
  assert(lead?.calculator_id === "owasp-top10-web", "calculator_id normalized");

  updateAnalyticsConsent("granted");
  assert(global.window.dataLayer.some((e) => e?.event === "consent_update"), "consent update event");

  console.log(`\nGTM verification: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});