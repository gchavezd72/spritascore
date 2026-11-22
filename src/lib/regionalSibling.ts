import type { Locale } from "@/types/calculator";
import {
  calcSection,
  guidesSection,
  isRegion,
  methodologySection,
  regionPath,
  type Region,
} from "@/lib/regions";
import { CALCULATOR_SEO_ROUTES, GUIDE_SEO_SLUGS, type GuideSlug } from "@/lib/seoRoutes";

type SectionKind = "calculators" | "guides" | "methodology";

function regionForLocale(current: Region, locale: Locale): Region {
  if (locale === "es") return "es-es";
  if (locale === "pt") return "pt-pt";
  if (current === "en-us" || current === "en-eu") return current;
  return "en-eu";
}

function sectionKind(region: Region, section: string): SectionKind | null {
  if (section === calcSection(region)) return "calculators";
  if (section === guidesSection(region)) return "guides";
  if (section === methodologySection(region)) return "methodology";
  return null;
}

function sectionFor(region: Region, kind: SectionKind): string {
  if (kind === "calculators") return calcSection(region);
  if (kind === "guides") return guidesSection(region);
  return methodologySection(region);
}

function mapSlug(from: Region, to: Region, kind: SectionKind, slug: string): string | null {
  if (kind === "guides") {
    const guide = (Object.keys(GUIDE_SEO_SLUGS) as GuideSlug[]).find((key) => GUIDE_SEO_SLUGS[key][from] === slug);
    return guide ? GUIDE_SEO_SLUGS[guide][to] : null;
  }
  const route = CALCULATOR_SEO_ROUTES.find((item) => item.slugs[from] === slug);
  return route ? route.slugs[to] : null;
}

/** Same regional article in another language. Null when the URL is not a regional SEO path. */
export function regionalSibling(pathname: string, locale: Locale): string | null {
  const parts = pathname.split("/").filter(Boolean);
  const current = parts[0];
  if (!current || !isRegion(current)) return null;

  const target = regionForLocale(current, locale);
  if (parts.length === 1) return `/${target}`;

  const kind = sectionKind(current, parts[1]);
  if (!kind) return `/${target}`;

  const section = sectionFor(target, kind);
  const slug = parts[2];
  if (!slug) return regionPath(target, section);

  const mapped = mapSlug(current, target, kind, slug);
  if (!mapped) return regionPath(target, section);
  return regionPath(target, section, mapped);
}
