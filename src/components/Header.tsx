"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CalculatorsMegaMenu } from "@/components/CalculatorsMegaMenu";
import { useTranslations } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/calculator";

const LOCALES: Locale[] = ["es", "en", "pt"];

export function Header() {
  const { t, locale, setLocale } = useTranslations();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-hairline">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <Logo className="text-xl" />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <CalculatorsMegaMenu />
          <Link href="/#como-funciona" className="nav-underline hover:text-brand-navy transition-colors">
            {t.nav.howItWorks}
          </Link>
          <Link href="/#contacto" className="nav-underline hover:text-brand-navy transition-colors">
            {t.nav.contact}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border-strong text-xs font-semibold overflow-hidden">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocale(loc)}
                className={cn(
                  "px-2.5 py-1.5 transition-colors uppercase",
                  locale === loc ? "bg-brand-green text-white" : "text-muted-foreground hover:bg-surface-hover"
                )}
                aria-pressed={locale === loc}
              >
                {loc}
              </button>
            ))}
          </div>
          <Link
            href="/#calculadoras"
            className="bg-brand-green text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:brightness-105 hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            {t.nav.calculateNow}
          </Link>
        </div>
      </div>
    </header>
  );
}