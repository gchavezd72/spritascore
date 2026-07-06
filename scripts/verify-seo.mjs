/**
 * SEO/GEO QA checklist — run: npm run verify:seo
 */
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const SITE = "https://spritascore.com";

async function main() {
  const { allPublicSeoPaths, CALCULATOR_SEO_ROUTES } = await import(
    pathToFileURL(path.join(root, "src/lib/seoRoutes.ts")).href
  );
  const { getCalculatorSeoContent } = await import(
    pathToFileURL(path.join(root, "src/data/seoContent/calculatorPages.ts")).href
  );
  const { marketForRegion, REGION_LOCALE } = await import(
    pathToFileURL(path.join(root, "src/lib/regions.ts")).href
  );

  let failed = 0;
  let passed = 0;

  const paths = allPublicSeoPaths();
  if (paths.length < 40) {
    console.error(`FAIL: expected 40+ SEO paths, got ${paths.length}`);
    failed++;
  } else {
    console.log(`OK: ${paths.length} public SEO paths`);
    passed++;
  }

  for (const route of CALCULATOR_SEO_ROUTES) {
    for (const region of ["es-es", "en-us", "en-eu", "pt-pt"]) {
      const locale = REGION_LOCALE[region];
      const content = getCalculatorSeoContent(route.internalSlug, locale, marketForRegion(region));
      if (!content) {
        console.error(`FAIL: missing content ${route.internalSlug} ${locale}`);
        failed++;
        continue;
      }
      const words = [
        content.shortAnswer,
        ...content.measures,
        ...content.inputs,
        ...content.howItWorks,
        content.example,
        ...content.scoreMeaning,
        ...content.limitations,
      ].join(" ").split(/\s+/).length;

      if (words < 800) {
        console.error(`FAIL: ${route.internalSlug} ${region} only ${words} words`);
        failed++;
      } else {
        passed++;
      }
      if (!content.metaTitle || !content.metaDescription || content.faq.length < 4) {
        console.error(`FAIL: metadata/faq ${route.internalSlug} ${region}`);
        failed++;
      } else {
        passed++;
      }
    }
  }

  const llms = await fetch(`${SITE}/llms.txt`).catch(() => null);
  if (!llms?.ok) {
    console.warn("WARN: could not fetch production llms.txt (offline check skipped)");
  } else {
    const text = await llms.text();
    if (!text.includes("sprita-it.com") && !text.includes("Sprita IT")) {
      console.error("FAIL: llms.txt missing Sprita IT reference");
      failed++;
    } else {
      passed++;
    }
  }

  console.log(`\nSEO verification: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});