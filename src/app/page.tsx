"use client";

import { Hero } from "@/components/Hero";
import { CalculatorSelector } from "@/components/CalculatorSelector";
import { Reveal } from "@/components/Reveal";
import { MousePointerClick, ClipboardList, Calculator, Rocket } from "lucide-react";
import { useTranslations } from "@/components/LanguageProvider";

export default function HomePage() {
  const { t } = useTranslations();
  const hw = t.howItWorks;
  const cc = t.contactCta;
  const icons = [MousePointerClick, ClipboardList, Calculator, Rocket];

  return (
    <>
      <Hero />
      <CalculatorSelector />

      <section id="como-funciona" className="py-20 bg-background border-t border-border-hairline">
        <div className="container mx-auto px-4 max-w-7xl">
          <Reveal>
            <h2 className="text-3xl font-bold text-brand-navy text-center mb-12 tracking-tight">
              {hw.title}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {hw.steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={step.title} delay={i * 90}>
                  <div className="text-center">
                    <div className="inline-flex p-4 rounded-xl bg-brand-green/10 text-brand-green mb-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-brand-navy mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface border-t border-border-hairline">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Reveal>
            <p className="text-lg text-muted-foreground italic mb-4">&quot;{hw.quote}&quot;</p>
            <p className="text-brand-navy font-semibold">{hw.quoteSub}</p>
          </Reveal>
        </div>
      </section>

      <section id="contacto" className="py-20 bg-background border-t border-border-hairline">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold mb-4 tracking-tight text-brand-navy">{cc.title}</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{cc.body}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@spritascore.com?subject=Diagnóstico%20técnico%20Spritascore"
                className="inline-flex items-center justify-center gap-2 bg-brand-green text-white font-semibold px-8 py-3 rounded-lg shadow-sm hover:brightness-105 hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                {cc.requestDiagnostic}
              </a>
              <a
                href="mailto:info@spritascore.com?subject=Agendar%20llamada%20Spritascore"
                className="inline-flex items-center justify-center gap-2 border border-border-strong text-brand-navy font-semibold px-8 py-3 rounded-lg hover:bg-surface-hover hover:border-brand-navy/40 transition-colors"
              >
                {cc.scheduleCall}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
