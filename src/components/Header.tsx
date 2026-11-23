"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useTranslations } from "@/components/LanguageProvider";
import { getAuditCopy } from "@/i18n/audit";
import { auditPath } from "@/lib/auditRoutes";
import { languageSwitchPath, sameOriginDestination } from "@/lib/calculatorPath";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/calculator";

const LOCALES: Locale[] = ["en", "es", "pt"];

export function Header() {
  const { t, locale, setLocale } = useTranslations();
  const pathname = usePathname() || "/";
  const home = locale === "en" ? "/" : `/${locale}`;
  const n = t.landing.nav;
  const auditNav = getAuditCopy(locale).nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sc hd", scrolled && "scrolled", open && "open")}>
      <div className="wrap hd-in">
        <Logo className="text-lg" />
        <nav className="nav" onClick={() => setOpen(false)}>
          <Link href={`${home}#calculadoras`}>{n.calculators}</Link>
          <Link href={`${home}#producto`}>{n.score}</Link>
          <Link href={`${home}#metodo`}>{n.how}</Link>
          <Link href={`${home}#sectores`}>{n.sectors}</Link>
          <Link href={auditPath(locale)}>{auditNav}</Link>
          <Link href={`${home}#contacto`}>{n.contact}</Link>
          <Link href="/analytics">Analytics</Link>
        </nav>
        <div className="hd-right">
          <div className="lang">
            {LOCALES.map((loc) => {
              const nextPath = languageSwitchPath(pathname, loc);
              const className = locale === loc ? "on" : "";
              if (!nextPath) {
                return (
                  <button
                    key={loc}
                    type="button"
                    className={className}
                    onClick={() => setLocale(loc)}
                    aria-pressed={locale === loc}
                  >
                    {loc.toUpperCase()}
                  </button>
                );
              }
              return (
                <a
                  key={loc}
                  href={nextPath}
                  className={className}
                  hrefLang={loc}
                  lang={loc}
                  aria-current={locale === loc ? "page" : undefined}
                  onClick={(event) => {
                    setLocale(loc);
                    event.preventDefault();
                    if (nextPath === window.location.pathname) return;
                    const destination = sameOriginDestination(
                      nextPath,
                      window.location.search,
                      window.location.hash,
                      window.location.origin,
                    );
                    if (!destination) return;
                    window.location.assign(destination);
                  }}
                >
                  {loc.toUpperCase()}
                </a>
              );
            })}
          </div>
          <Link href={`${home}#calculadoras`} className="btn btn-solid noshrink">
            {n.calcNow}
          </Link>
          <button
            type="button"
            className="burger"
            onClick={() => setOpen((o) => !o)}
            aria-label={n.menu}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
