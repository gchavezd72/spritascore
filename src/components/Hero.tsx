"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalculatorIcon } from "@/components/CalculatorIcon";
import { useTranslations } from "@/components/LanguageProvider";
import { useParallax } from "@/hooks/useParallax";

export function Hero() {
  const { t } = useTranslations();
  const h = t.hero;
  const layerSlow = useParallax(0.12);
  const layerMid = useParallax(0.22);
  const layerFast = useParallax(0.35);

  return (
    <section className="relative bg-background text-brand-navy overflow-hidden min-h-[520px]">
      {/* Parallax background layers */}
      <div
        className="parallax-layer absolute -top-16 -left-24 w-[420px] h-[420px] rounded-full opacity-40 pointer-events-none"
        style={{
          transform: `translate3d(0, ${layerSlow}px, 0)`,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--brand-green) 18%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="parallax-layer absolute top-8 -right-20 w-[360px] h-[360px] rounded-full opacity-35 pointer-events-none"
        style={{
          transform: `translate3d(0, ${layerMid}px, 0)`,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--brand-navy-light) 22%, transparent) 0%, transparent 68%)",
        }}
      />
      <div
        className="parallax-layer absolute bottom-12 left-[35%] w-48 h-48 rounded-2xl rotate-12 opacity-[0.07] pointer-events-none border border-brand-navy/20"
        style={{ transform: `translate3d(0, ${layerFast}px, 0) rotate(12deg)` }}
      />
      <div
        className="parallax-layer absolute top-[28%] right-[18%] opacity-20 pointer-events-none text-brand-green"
        style={{ transform: `translate3d(0, ${layerMid}px, 0)` }}
      >
        <CalculatorIcon category="seguridad" className="h-16 w-16" />
      </div>

      <div className="absolute inset-0 glow-ambient animate-glow-drift" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-green/40 to-transparent" />

      <div className="container mx-auto px-4 max-w-7xl py-24 md:py-32 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-border-hairline bg-surface px-3 py-1 shadow-sm animate-reveal-up [animation-delay:0ms]">
            <CalculatorIcon category="seguridad" className="h-3.5 w-3.5 text-brand-green" />
            <span className="text-xs font-medium text-brand-green tracking-wide uppercase">
              {h.badge}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight animate-reveal-up [animation-delay:80ms]">
            {h.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-reveal-up [animation-delay:160ms]">
            {h.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-reveal-up [animation-delay:240ms]">
            <Link href="#calculadoras">
              <Button size="lg" className="w-full sm:w-auto">
                {h.ctaPrimary}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#contacto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Calendar className="h-5 w-5" />
                {h.ctaSecondary}
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground border-l-2 border-brand-green pl-4 animate-reveal-up [animation-delay:320ms]">
            {h.trust}
          </p>
        </div>
      </div>
    </section>
  );
}