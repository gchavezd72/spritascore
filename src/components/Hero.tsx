import Link from "next/link";
import { Shield, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-brand-navy text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-navy-light/30 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
      <div className="container mx-auto px-4 max-w-7xl py-24 md:py-32 relative">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-brand-orange" />
            <span className="text-sm font-medium text-brand-orange tracking-wide uppercase">
              Spritascore — Application Risk & Cost Calculator
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Calcula cuánto le puede costar a tu empresa una vulnerabilidad o la mala calidad del código
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            Convierte riesgos técnicos en impacto financiero. Estima el costo de defectos, vulnerabilidades OWASP, riesgos móviles y exposición por sector en menos de 5 minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href="#calculadoras">
              <Button size="lg" className="w-full sm:w-auto">
                Calcular mi riesgo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#contacto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-brand-navy">
                <Calendar className="h-5 w-5" />
                Solicitar diagnóstico técnico
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-400 border-l-2 border-brand-orange pl-4">
            Basado en modelos de calidad ISO/IEC 25010, OWASP Top 10, OWASP Mobile Top 10 y criterios de riesgo por industria.
          </p>
        </div>
      </div>
    </section>
  );
}