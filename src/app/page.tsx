import { Hero } from "@/components/Hero";
import { CalculatorSelector } from "@/components/CalculatorSelector";
import { CheckCircle, BarChart3, Shield, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CalculatorSelector />

      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-brand-navy text-center mb-12">
            Cómo funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: BarChart3, title: "1. Seleccione", desc: "Elija la calculadora que corresponda a su escenario de riesgo." },
              { icon: FileText, title: "2. Responda", desc: "Complete el wizard paso a paso con contexto de empresa y aplicación." },
              { icon: Shield, title: "3. Calcule", desc: "Obtenga score de riesgo, estimación económica y factores clave." },
              { icon: CheckCircle, title: "4. Actúe", desc: "Reciba recomendaciones priorizadas y solicite un diagnóstico técnico." },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex p-4 rounded-xl bg-brand-navy/5 text-brand-navy mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-brand-navy mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-lg text-slate-600 italic mb-4">
            &quot;No todos los defectos cuestan lo mismo. Los más peligrosos no siempre son los más visibles.&quot;
          </p>
          <p className="text-brand-navy font-semibold">
            Podemos ayudarte a validar estos resultados con un diagnóstico técnico de calidad, seguridad y dependencias de software.
          </p>
        </div>
      </section>

      <section id="contacto" className="py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Solicite un diagnóstico técnico</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Este resultado es una estimación inicial. Un diagnóstico técnico puede validar el nivel real de exposición, identificar vulnerabilidades específicas y priorizar acciones de remediación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@spritascore.com?subject=Diagnóstico%20técnico%20Spritascore"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3 rounded-lg hover:bg-brand-orange/90 transition-colors"
            >
              Solicitar diagnóstico
            </a>
            <a
              href="mailto:info@spritascore.com?subject=Agendar%20llamada%20Spritascore"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-brand-navy transition-colors"
            >
              Agendar llamada
            </a>
          </div>
        </div>
      </section>
    </>
  );
}