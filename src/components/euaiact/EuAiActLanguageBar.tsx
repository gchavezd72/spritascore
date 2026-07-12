"use client";

import Link from "next/link";
import { EU_AI_ACT_ROUTES } from "@/i18n/euAiAct";
import type { Locale } from "@/types/calculator";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

export function EuAiActLanguageBar({ activeLocale }: { activeLocale: Locale }) {
  return (
    <div className="flex justify-center gap-2 mb-8" role="navigation" aria-label="Language">
      {(Object.keys(EU_AI_ACT_ROUTES) as Locale[]).map((locale) => (
        <Link
          key={locale}
          href={EU_AI_ACT_ROUTES[locale]}
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
