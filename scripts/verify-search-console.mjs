/**
 * Search Console readiness — run: npm run verify:search-console
 */
const SITE = "https://spritascore.com";

async function main() {
  let failed = 0;
  let passed = 0;
  const assert = (ok, msg) => (ok ? passed++ : (console.error(`FAIL: ${msg}`), failed++));

  const robots = await fetch(`${SITE}/robots.txt`).then((r) => r.text());
  assert(robots.includes("Sitemap: https://spritascore.com/sitemap.xml"), "robots.txt lists sitemap");
  assert(robots.includes("Disallow: /api/"), "robots blocks /api/");

  const sitemapRes = await fetch(`${SITE}/sitemap.xml`);
  assert(sitemapRes.ok, "sitemap.xml returns 200");
  const sitemap = await sitemapRes.text();
  assert(sitemap.includes("<loc>https://spritascore.com</loc>"), "sitemap includes home");
  assert(sitemap.includes("/en/executive-software-risk-score"), "sitemap includes executive EN");
  assert(sitemap.includes("/es-es/"), "sitemap includes regional pages");

  const home = await fetch(SITE).then((r) => r.text());
  assert(home.includes('rel="canonical"') || home.includes("canonical"), "home has canonical");
  assert(!home.includes('noindex'), "home is not noindex");

  const verification = process.env.GOOGLE_SITE_VERIFICATION;
  if (verification) {
    assert(
      home.includes(`google-site-verification" content="${verification}"`) ||
        home.includes(`content="${verification}" name="google-site-verification"`),
      "google-site-verification meta present when env is set"
    );
  } else {
    console.log("NOTE: GOOGLE_SITE_VERIFICATION not set — use GA4 or DNS verification in Search Console.");
  }

  console.log(`\nSearch Console readiness: ${passed} passed, ${failed} failed`);
  console.log(`
Next steps in Search Console (https://search.google.com/search-console):
1. Add property: https://spritascore.com
2. Verify (recommended: Google Analytics G-PET5JPXKYG, same Google account)
3. Sitemaps → submit: https://spritascore.com/sitemap.xml
4. URL Inspection → request indexing for / and /en/executive-software-risk-score
`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});