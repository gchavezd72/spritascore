"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Download, Mail, AlertTriangle, Clock, Pencil } from "lucide-react";
import type { CalculationResult, LeadData } from "@/types/calculator";
import { RiskScore } from "@/components/RiskScore";
import { CostBreakdown } from "@/components/CostBreakdown";
import { ImpactMatrix } from "@/components/ImpactMatrix";
import { RecommendationCard } from "@/components/RecommendationCard";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveResult, saveLead } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { useReportContext } from "@/hooks/useReportContext";
import { formatEstimate } from "@/lib/formatCurrency";
import { getCalculatorById } from "@/data/calculatorConfigs";
import { getTranslations } from "@/i18n";

interface ResultsViewProps {
  result: CalculationResult;
}

export function ResultsView({ result: initialResult }: ResultsViewProps) {
  const [result, setResult] = useState(initialResult);
  const [sent, setSent] = useState(initialResult.leadCaptured);
  const { reportLocale, localizedResult, t } = useReportContext(result);
  const rv = t.resultsView;
  const cb = getTranslations(reportLocale).costBreakdown;
  const calc = getCalculatorById(result.calculatorId);
  const editHref = calc ? `/calculadora/${calc.slug}?edit=${encodeURIComponent(result.id)}` : "/";

  const probableCost = localizedResult.cost.probable ?? localizedResult.cost.annual ?? 0;

  const headline = (amount: number) => {
    const text = formatEstimate(amount, localizedResult.currency);
    return Math.abs(amount) >= 10_000 ? `${rv.approxPrefix} ${text}` : text;
  };

  const handleLeadSuccess = (lead: LeadData) => {
    const updated = { ...result, leadCaptured: true };
    setResult(updated);
    saveResult(updated);
    saveLead(result.id, lead);
    setSent(true);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <RiskScore score={localizedResult.score} riskLevel={localizedResult.riskLevel} reportLocale={reportLocale} />
            <div className="flex-1 text-center lg:text-left">
              {localizedResult.hoursPerYear !== undefined && (
                <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green font-semibold px-4 py-2 rounded-lg mb-3">
                  <Clock className="h-4 w-4" />
                  ≈{localizedResult.hoursPerYear.toLocaleString()} {rv.hoursRecoverable} ({(localizedResult.hoursPerYear / 2080).toFixed(1)} {rv.fteEquivalent})
                </div>
              )}
              <p className="text-lg text-muted-foreground mb-4">{localizedResult.partialSummary}</p>
              <Link href={editHref} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline">
                <Pencil className="h-4 w-4" />
                {rv.editAnswers}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">{rv.economicEstimate}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {localizedResult.cost.min !== undefined && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{cb.minScenario}</p>
                <p className="text-xl font-bold text-foreground">
                  {headline(localizedResult.cost.min)}
                </p>
              </CardContent>
            </Card>
          )}
          <Card className="border-brand-green/30 bg-brand-green/[0.06]">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">{cb.probableScenario}</p>
              <p className="text-2xl font-bold text-brand-green">
                {headline(probableCost)}
              </p>
              {localizedResult.methodNote && (
                <p className="text-xs text-muted-foreground mt-3 text-left leading-relaxed">{localizedResult.methodNote}</p>
              )}
            </CardContent>
          </Card>
          {localizedResult.cost.max !== undefined && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{cb.highScenario}</p>
                <p className="text-xl font-bold text-risk-critical">
                  {headline(localizedResult.cost.max)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-3">{rv.scenarioNote}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{rv.impactMatrix}</CardTitle>
          </CardHeader>
          <CardContent>
            <ImpactMatrix matrix={localizedResult.impactMatrix} reportLocale={reportLocale} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-risk-high" />
              {rv.riskFactors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {localizedResult.riskFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f97316]/15 text-risk-high flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {factor}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{rv.executiveSummary}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 leading-relaxed">{localizedResult.executiveSummary}</p>
        </CardContent>
      </Card>

      <CostBreakdown cost={localizedResult.cost} currency={localizedResult.currency} reportLocale={reportLocale} />

      {localizedResult.recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">{rv.recommendations}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localizedResult.recommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} reportLocale={reportLocale} />
            ))}
          </div>
        </div>
      )}

      <Card className="bg-surface-hover">
        <CardContent className="pt-8 pb-8 text-center">
          <p className="text-lg mb-2 text-foreground">{rv.ctaBody1}</p>
          <p className="text-muted-foreground mb-6">{rv.ctaBody2}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@sprita-it.com?subject=Diagn%C3%B3stico%20t%C3%A9cnico%20SpritaScore">
              <Button
                size="lg"
                onClick={() => trackEvent("cta_clicked", { cta: "diagnostico" })}
              >
                <Calendar className="h-5 w-5" />
                {rv.requestDiagnostic}
              </Button>
            </a>
            <Link href={`/reporte/${result.id}`}>
              <Button variant="outline" size="lg">
                <Download className="h-5 w-5" />
                {rv.downloadReport}
              </Button>
            </Link>
            <a href="mailto:info@sprita-it.com?subject=Reporte%20SpritaScore">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => trackEvent("cta_clicked", { cta: "email" })}
              >
                <Mail className="h-5 w-5" />
                {rv.receiveByEmail}
              </Button>
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            info@sprita-it.com · spritascore.com
          </p>
        </CardContent>
      </Card>

      {sent ? (
        <p className="text-sm text-muted-foreground text-center" role="status">{rv.validationSent}</p>
      ) : (
        <LeadCaptureForm result={result} onSuccess={handleLeadSuccess} />
      )}
    </div>
  );
}
