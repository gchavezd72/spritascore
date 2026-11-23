/**
 * OWASP-oriented security checks — run: npm run verify:security
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";

async function main() {
  let failed = 0;
  let passed = 0;

  const assert = (condition, message) => {
    if (condition) {
      passed++;
    } else {
      console.error(`FAIL: ${message}`);
      failed++;
    }
  };

  const crmRoute = fs.readFileSync(path.join(root, "src/app/api/crm/route.ts"), "utf8");
  assert(!crmRoute.includes("await request.json()") || crmRoute.includes("isBodyTooLarge"), "CRM route should guard body size");
  assert(crmRoute.includes("isAllowedOrigin"), "CRM route should validate origin");
  assert(crmRoute.includes("notifyLead"), "CRM route should deliver leads via notifyLead");
  assert(fs.existsSync(path.join(root, "src/lib/sendLeadEmail.ts")), "Lead email sender missing");
  assert(crmRoute.includes('status: 405'), "PUT should be rejected");
  assert(crmRoute.includes("executiveLeadSchema"), "Executive leads should be schema-validated");
  assert(!/export async function PUT\(request/.test(crmRoute), "PUT must not forward arbitrary JSON");

  const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  assert(nextConfig.includes("Content-Security-Policy"), "Security headers missing CSP");
  assert(nextConfig.includes("Strict-Transport-Security"), "Security headers missing HSTS");
  assert(nextConfig.includes("X-Frame-Options"), "Security headers missing X-Frame-Options");

  assert(fs.existsSync(path.join(root, "src/middleware.ts")), "Rate-limit middleware missing");
  const middleware = fs.readFileSync(path.join(root, "src/middleware.ts"), "utf8");
  assert(middleware.includes("Bad request"), "Backslash requests should return 400");
  assert(middleware.includes("308"), "Duplicate hosts should redirect to the apex");
  assert(middleware.includes("crm-day:"), "CRM should have a daily rate limit");
  assert(nextConfig.includes("poweredByHeader: false"), "X-Powered-By should be disabled");
  const securityTxt = fs.readFileSync(path.join(root, "public/.well-known/security.txt"), "utf8");
  assert(securityTxt.includes("mailto:info@sprita-it.com"), "security.txt should name the product contact");
  assert(securityTxt.includes("Expires:"), "security.txt should expire");
  assert(crmRoute.includes("honeypotTripped"), "CRM should reject a filled honeypot before email");
  assert(crmRoute.includes("isRecentLead"), "CRM should dedupe a repeated lead");

  const { sanitizeInput } = await import(pathToFileURL(path.join(root, "src/lib/utils.ts")).href);
  const sanitized = sanitizeInput("  test\x00<script>  ");
  assert(!sanitized.includes("\x00") && !sanitized.includes("<"), "sanitizeInput should strip control chars and angle brackets");

  const { isDisposableEmail } = await import(pathToFileURL(path.join(root, "src/lib/email.ts")).href);
  assert(isDisposableEmail("user@mailinator.com"), "Disposable email detection");
  assert(!isDisposableEmail("user@company.com"), "Corporate email should pass");

  const { localeCookieString, localeFromCookieHeader, readLocaleCookie } = await import(
    pathToFileURL(path.join(root, "src/lib/localePreference.ts")).href
  );
  assert(localeCookieString("es") === "spritascore_locale=es; Path=/; Max-Age=31536000; SameSite=Lax", "Spanish locale cookie is a literal");
  assert(localeCookieString("pt", true).endsWith("; Secure"), "HTTPS locale cookie is Secure");
  assert(!localeCookieString("en").includes("Secure"), "HTTP locale cookie stays readable on localhost");
  assert(localeFromCookieHeader("a=b; spritascore_locale=pt") === "pt", "Locale cookie parser reads pt");
  assert(localeFromCookieHeader("spritascore_locale=english") === null, "Locale cookie parser rejects unknown values");
  assert(readLocaleCookie("nope") === "en", "Unknown locale falls back to English");

  const { sameOriginDestination } = await import(
    pathToFileURL(path.join(root, "src/lib/calculatorPath.ts")).href
  );
  const origin = "https://spritascore.com";
  assert(
    sameOriginDestination("/es", "?utm=1", "#contacto", origin) === "/es?utm=1#contacto",
    "Language switch keeps the current query and hash",
  );
  assert(sameOriginDestination("//evil.example", "", "", origin) === null, "Protocol-relative navigation is rejected");
  assert(sameOriginDestination("https://evil.example", "", "", origin) === null, "Absolute navigation is rejected");
  assert(
    sameOriginDestination("/pt", "?next=https://evil.example", "", origin) === "/pt?next=https://evil.example",
    "A URL inside the query stays on this origin",
  );

  const { jsonLdHtml } = await import(pathToFileURL(path.join(root, "src/components/JsonLd.tsx")).href);
  const encoded = jsonLdHtml({ name: "</script><script>alert(1)</script>" });
  assert(!encoded.includes("</"), "JSON-LD escapes a closing script tag");
  assert(JSON.parse(encoded).name === "</script><script>alert(1)</script>", "JSON-LD escape round-trips");

  const executiveForm = fs.readFileSync(
    path.join(root, "src/components/executive/ExecutiveLeadForm.tsx"),
    "utf8"
  );
  assert(executiveForm.includes('method: "POST"'), "Executive form should POST");
  assert(executiveForm.includes("!res.ok"), "Executive form should check response status");

  console.log(`\nSecurity verification: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});