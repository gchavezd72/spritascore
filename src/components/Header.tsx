"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useTranslations } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/calculator";

const LOCALES: Locale[] = ["es", "en", "pt"];

export function Header() {
  const { t, locale, setLocale } = useTranslations();
  const n = t.landing.nav;
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
          <Link href="/#calculadoras">{n.calculators}</Link>
          <Link href="/#producto">{n.score}</Link>
          <Link href="/#metodo">{n.how}</Link>
          <Link href="/#sectores">{n.sectors}</Link>
          <Link href="/#contacto">{n.contact}</Link>
        </nav>
        <div className="hd-right">
          <div className="lang">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                className={locale === loc ? "on" : ""}
                onClick={() => setLocale(loc)}
                aria-pressed={locale === loc}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          <Link href="/#calculadoras" className="btn btn-solid noshrink">
            {n.calcNow}
          </Link>
          <button
            type="button"
            className="burger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
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
