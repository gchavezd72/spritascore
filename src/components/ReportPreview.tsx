"use client";

import type { CalculationResult } from "@/types/calculator";
import { formatCurrency } from "@/lib/formatCurrency";
import { getRiskLevelLabel } from "@/data/riskRanges";
import { getCalculatorById } from "@/data/calculatorConfigs";
import { trackEvent } from "@/lib/analytics";

interface ReportPreviewProps {
  result: CalculationResult;
}

const DISCLAIMER =
  "Los resultados generados por esta herramienta son estimaciones orientativas basadas en la información ingresada por el usuario, factores de riesgo comunes y modelos de referencia. No constituyen una auditoría formal, certificación, opinión legal ni análisis forense. Para obtener resultados concluyentes se recomienda realizar una evaluación técnica especializada.";

export function ReportPreview({ result }: ReportPreviewProps) {
  const calc = getCalculatorById(result.calculatorId);
  const probable = result.cost.probable ?? result.cost.annual ?? 0;

  const handlePrint = () => {
    trackEvent("report_downloaded", { calculator: result.calculatorId, resultId: result.id });
    window.print();
  };

  return (
    <div id="report-content" className="bg-white p-8 max-w-4xl mx-auto print:p-0">
      <div className="flex justify-between items-start mb-8 border-b pb-6 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Spritascore</h1>
          <p className="text-sm text-slate-500">Application Risk & Cost Calculator</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>{new Date(result.createdAt).toLocaleDateString("es-ES", { dateStyle: "long" })}</p>
          <p>ID: {result.id.slice(0, 12)}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-brand-navy mb-2">Resumen ejecutivo</h2>
      <p className="text-slate-700 mb-6 leading-relaxed">{result.executiveSummary}</p>

      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="text-xs text-slate-500 uppercase">Score de riesgo</p>
          <p className="text-2xl font-bold text-brand-navy">{result.score}/100</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Nivel</p>
          <p className="text-2xl font-bold">{getRiskLevelLabel(result.riskLevel)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Costo probable</p>
          <p className="text-2xl font-bold text-brand-orange">{formatCurrency(probable, result.currency)}</p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-brand-navy mb-3">Calculadora utilizada</h3>
      <p className="text-slate-700 mb-6">{calc?.title}</p>

      <h3 className="text-lg font-bold text-brand-navy mb-3">Factores de riesgo principales</h3>
      <ul className="list-disc pl-5 mb-6 space-y-1 text-slate-700">
        {result.riskFactors.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <h3 className="text-lg font-bold text-brand-navy mb-3">Matriz de impacto</h3>
      <table className="w-full mb-6 text-sm border-collapse">
        <tbody>
          {Object.entries(result.impactMatrix).map(([key, value]) => (
            <tr key={key} className="border-b border-slate-200">
              <td className="py-2 capitalize text-slate-600">{key}</td>
              <td className="py-2 text-right font-semibold">{value}/100</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-bold text-brand-navy mb-3">Estimación económica</h3>
      <table className="w-full mb-6 text-sm border-collapse">
        <tbody>
          {result.cost.items.map((item, i) => (
            <tr key={i} className="border-b border-slate-200">
              <td className="py-2 text-slate-600">{item.label}</td>
              <td className="py-2 text-right font-semibold">{formatCurrency(item.value, result.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-bold text-brand-navy mb-3">Recomendaciones priorizadas</h3>
      <div className="space-y-3 mb-6">
        {result.recommendations.map((rec, i) => (
          <div key={rec.id} className="border-l-4 border-brand-orange pl-4 py-1">
            <p className="font-semibold text-brand-navy">{i + 1}. {rec.title}</p>
            <p className="text-sm text-slate-600">{rec.description}</p>
            <p className="text-xs text-slate-400 mt-1">
              Prioridad: {rec.priority} | Plazo: {rec.timeframe} | Área: {rec.area}
            </p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold text-brand-navy mb-3">Próximos pasos sugeridos</h3>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {result.immediateActions.length > 0 && (
          <div>
            <p className="font-semibold text-sm text-risk-critical mb-1">Inmediato</p>
            <ul className="text-sm text-slate-700 list-disc pl-5">
              {result.immediateActions.map((a) => <li key={a.id}>{a.title}</li>)}
            </ul>
          </div>
        )}
        {result.actions30Days.length > 0 && (
          <div>
            <p className="font-semibold text-sm text-brand-orange mb-1">30 días</p>
            <ul className="text-sm text-slate-700 list-disc pl-5">
              {result.actions30Days.map((a) => <li key={a.id}>{a.title}</li>)}
            </ul>
          </div>
        )}
        {result.actions90Days.length > 0 && (
          <div>
            <p className="font-semibold text-sm text-brand-navy mb-1">60-90 días</p>
            <ul className="text-sm text-slate-700 list-disc pl-5">
              {result.actions90Days.map((a) => <li key={a.id}>{a.title}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t pt-6 text-xs text-slate-400 leading-relaxed">
        <p className="font-semibold mb-1">Disclaimer metodológico</p>
        <p>{DISCLAIMER}</p>
      </div>

      <button
        onClick={handlePrint}
        className="mt-6 print:hidden bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-navy-light"
      >
        Imprimir / Guardar como PDF
      </button>
    </div>
  );
}