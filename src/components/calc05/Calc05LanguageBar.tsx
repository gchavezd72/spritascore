"use client";

import Link from "next/link";
import { CALC05_ROUTES } from "@/i18n/calc05";
import type { Locale } from "@/types/calculator";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

interface Calc05LanguageBarProps {
  activeLocale: Locale;
  /** Preserve query string when switching languages (e.g. ?sector=saude) */
  querySuffix?: string;
}

export function Calc05LanguageBar({
  activeLocale,
  querySuffix = "",
}: Calc05LanguageBarProps) {
  return (
    <div className="flex justify-center gap-2 mb-8" role="navigation" aria-label="Language">
      {(Object.keys(CALC05_ROUTES) as Locale[]).map((locale) => (
        <Link
          key={locale}
          href={`${CALC05_ROUTES[locale]}${querySuffix}`}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors",
            locale === activeLocale
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-background text-muted-foreground border-border-strong hover:border-brand-navy/30"
          )}
          aria-current={locale === activeLocale ? "page" : undefined}
        >
          {LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}
