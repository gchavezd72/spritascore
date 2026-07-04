"use client";

import type { CalculationResult } from "@/types/calculator";
import { formatCurrency } from "@/lib/formatCurrency";
import { getRiskLevelLabel } from "@/data/riskRanges";
import { getCalculatorById } from "@/data/calculatorConfigs";
import { trackEvent } from "@/lib/analytics";
import { tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";

interface ReportPreviewProps {
  result: CalculationResult;
}

export function ReportPreview({ result }: ReportPreviewProps) {
  const { t, locale } = useTranslations();
  const calc = getCalculatorById(result.calculatorId);
  const probable = result.cost.probable ?? result.cost.annual ?? 0;
  const rp = t.reportPreview;
  const rc = t.recommendationCard;

  const handlePrint = () => {
    trackEvent("report_downloaded", { calculator: result.calculatorId, resultId: result.id });
    window.print();
  };

  return (
    <div id="report-content" className="bg-white text-slate-900 p-8 max-w-4xl mx-auto print:p-0">
      <div className="flex justify-between items-start mb-8 border-b pb-6 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Spritascore</h1>
          <p className="text-sm text-slate-500">{rp.productName}</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>{new Date(result.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", { dateStyle: "long" })}</p>
          <p>ID: {result.id.slice(0, 12)}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-brand-navy mb-2">{t.resultsView.executiveSummary}</h2>
      <p className="text-slate-700 mb-6 leading-relaxed">{result.executiveSummary}</p>

      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="text-xs text-slate-500 uppercase">{rp.riskScore}</p>
          <p className="text-2xl font-bold text-brand-navy">{result.score}/100</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">{rp.level}</p>
          <p className="text-2xl font-bold text-slate-900">{getRiskLevelLabel(result.riskLevel, locale)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">{rp.probableCost}</p>
          <p className="text-2xl font-bold text-brand-green">{formatCurrency(probable, result.currency)}</p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-brand-navy mb-3">{rp.calculatorUsed}</h3>
      <p className="text-slate-700 mb-6">{calc ? tr(calc.title, locale) : ""}</p>

      <h3 className="text-lg font-bold text-brand-navy mb-3">{rp.mainRiskFactors}</h3>
      <ul className="list-disc pl-5 mb-6 space-y-1 text-slate-700">
        {result.riskFactors.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <h3 className="text-lg font-bold text-brand-navy mb-3">{rp.impactMatrix}</h3>
      <table className="w-full mb-6 text-sm border-collapse">
        <tbody>
          {Object.entries(result.impactMatrix).map(([key, value]) => (
            <tr key={key} className="border-b border-slate-200">
              <td className="py-2 capitalize text-slate-600">
                {t.impactMatrixLabels[key as keyof typeof t.impactMatrixLabels]}
              </td>
              <td className="py-2 text-right font-semibold">{value}/100</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-bold text-brand-navy mb-3">{rp.economicEstimate}</h3>
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

      <h3 className="text-lg font-bold text-brand-navy mb-3">{rp.prioritizedRecommendations}</h3>
      <div className="space-y-3 mb-6">
        {result.recommendations.map((rec, i) => (
          <div key={rec.id} className="border-l-4 border-brand-green pl-4 py-1">
            <p className="font-semibold text-brand-navy">{i + 1}. {tr(rec.title, locale)}</p>
            <p className="text-sm text-slate-600">{tr(rec.description, locale)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {rc.priority}: {rc.priorityLabels[rec.priority]} | {rc.timeframe}: {rc.timeframeLabels[rec.timeframe]} | {rc.area}: {rc.areaLabels[rec.area]}
            </p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold text-brand-navy mb-3">{rp.suggestedNextSteps}</h3>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {result.immediateActions.length > 0 && (
          <div>
            <p className="font-semibold text-sm text-risk-critical mb-1">{rp.immediate}</p>
            <ul className="text-sm text-slate-700 list-disc pl-5">
              {result.immediateActions.map((a) => <li key={a.id}>{tr(a.title, locale)}</li>)}
            </ul>
          </div>
        )}
        {result.actions30Days.length > 0 && (
          <div>
            <p className="font-semibold text-sm text-brand-green mb-1">{rp.days30}</p>
            <ul className="text-sm text-slate-700 list-disc pl-5">
              {result.actions30Days.map((a) => <li key={a.id}>{tr(a.title, locale)}</li>)}
            </ul>
          </div>
        )}
        {result.actions90Days.length > 0 && (
          <div>
            <p className="font-semibold text-sm text-brand-navy mb-1">{rp.days60to90}</p>
            <ul className="text-sm text-slate-700 list-disc pl-5">
              {result.actions90Days.map((a) => <li key={a.id}>{tr(a.title, locale)}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t pt-6 text-xs text-slate-400 leading-relaxed">
        <p className="font-semibold mb-1">{rp.methodologyDisclaimer}</p>
        <p>{rp.disclaimerText}</p>
      </div>

      <button
        onClick={handlePrint}
        className="mt-6 print:hidden bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-navy-light"
      >
        {rp.print}
      </button>
    </div>
  );
}
