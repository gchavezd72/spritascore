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
  assert(crmRoute.includes("forwardToCrmWebhook"), "CRM route should use webhook helper");
  assert(crmRoute.includes('status: 405'), "PUT should be rejected");
  assert(crmRoute.includes("executiveLeadSchema"), "Executive leads should be schema-validated");
  assert(!/export async function PUT\(request/.test(crmRoute), "PUT must not forward arbitrary JSON");

  const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  assert(nextConfig.includes("Content-Security-Policy"), "Security headers missing CSP");
  assert(nextConfig.includes("Strict-Transport-Security"), "Security headers missing HSTS");
  assert(nextConfig.includes("X-Frame-Options"), "Security headers missing X-Frame-Options");

  assert(fs.existsSync(path.join(root, "src/middleware.ts")), "Rate-limit middleware missing");

  const { sanitizeInput } = await import(pathToFileURL(path.join(root, "src/lib/utils.ts")).href);
  const sanitized = sanitizeInput("  test\x00<script>  ");
  assert(!sanitized.includes("\x00") && !sanitized.includes("<"), "sanitizeInput should strip control chars and angle brackets");

  const { isDisposableEmail } = await import(pathToFileURL(path.join(root, "src/lib/email.ts")).href);
  assert(isDisposableEmail("user@mailinator.com"), "Disposable email detection");
  assert(!isDisposableEmail("user@company.com"), "Corporate email should pass");

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