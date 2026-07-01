import { Shield } from "lucide-react";

const DISCLAIMER =
  "Los resultados generados por esta herramienta son estimaciones orientativas. No constituyen una auditoría formal, certificación, opinión legal ni análisis forense.";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-400 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold mb-3">
              <Shield className="h-5 w-5 text-brand-orange" />
              Spritascore
            </div>
            <p className="text-sm max-w-md leading-relaxed">
              Una herramienta diseñada para ayudar a equipos de tecnología, seguridad y cumplimiento a priorizar riesgos con lenguaje financiero.
            </p>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-white font-semibold">Calculadoras</p>
            <p>Costo de no calidad (ISO 25010)</p>
            <p>Vulnerabilidad OWASP Top 10</p>
            <p>OWASP Mobile Top 10</p>
            <p>Riesgo por sector</p>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-white font-semibold">Contacto</p>
            <p>spritascore.com</p>
            <p>info@spritascore.com</p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-xs leading-relaxed">
          <p className="mb-2">{DISCLAIMER}</p>
          <p>© {new Date().getFullYear()} Spritascore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}