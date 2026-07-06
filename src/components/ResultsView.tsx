"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Download, Mail, AlertTriangle, Clock, Lock } from "lucide-react";
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
import { formatCurrency } from "@/lib/formatCurrency";
import { formatTemplate } from "@/lib/translate";
import { getTranslations } from "@/i18n";

interface ResultsViewProps {
  result: CalculationResult;
}

const PREVIEW_RECOMMENDATION_COUNT = 3;

export function ResultsView({ result: initialResult }: ResultsViewProps) {
  const [result, setResult] = useState(initialResult);
  const [unlocked, setUnlocked] = useState(initialResult.leadCaptured);
  const { reportLocale, localizedResult, t } = useReportContext(result);
  const rv = t.resultsView;
  const cb = getTranslations(reportLocale).costBreakdown;

  const previewRecommendations = localizedResult.recommendations.slice(0, PREVIEW_RECOMMENDATION_COUNT);
  const remainingRecommendations = Math.max(
    0,
    localizedResult.recommendations.length - PREVIEW_RECOMMENDATION_COUNT
  );
  const probableCost =
    localizedResult.cost.probable ?? localizedResult.cost.annual ?? 0;

  const handleLeadSuccess = (lead: LeadData) => {
    const updated = { ...result, leadCaptured: true };
    setResult(updated);
    saveResult(updated);
    saveLead(result.id, lead);
    setUnlocked(true);
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
              <p className="text-lg text-muted-foreground mb-2">{localizedResult.partialSummary}</p>
              <p className="text-sm text-muted-foreground italic">&quot;{rv.quote}&quot;</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">{rv.economicEstimate}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {localizedResult.cost.min !== undefined && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{cb.minScenario}</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(localizedResult.cost.min, localizedResult.currency)}
                </p>
              </CardContent>
            </Card>
          )}
          <Card className="border-brand-green/30 bg-brand-green/[0.06]">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">{cb.probableScenario}</p>
              <p className="text-2xl font-bold text-brand-green">
                {formatCurrency(probableCost, localizedResult.currency)}
              </p>
            </CardContent>
          </Card>
          {localizedResult.cost.max !== undefined && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{cb.highScenario}</p>
                <p className="text-xl font-bold text-risk-critical">
                  {formatCurrency(localizedResult.cost.max, localizedResult.currency)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
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
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-risk-high/10 text-risk-high flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {factor}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {previewRecommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">{rv.previewRecommendations}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewRecommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} reportLocale={reportLocale} />
            ))}
          </div>
          {!unlocked && remainingRecommendations > 0 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              {formatTemplate(rv.moreRecommendations, { count: remainingRecommendations })}
            </p>
          )}
        </div>
      )}

      {!unlocked && (
        <>
          <Card className="border-brand-green/25 bg-brand-green/[0.04]">
            <CardContent className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">{rv.unlockForFullReport}</p>
                  <p className="text-sm text-muted-foreground">{rv.lockedMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <LeadCaptureForm result={result} onSuccess={handleLeadSuccess} />
        </>
      )}

      {unlocked ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{rv.executiveSummary}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed">{localizedResult.executiveSummary}</p>
            </CardContent>
          </Card>

          <CostBreakdown cost={localizedResult.cost} currency={localizedResult.currency} reportLocale={reportLocale} />

          {localizedResult.recommendations.length > PREVIEW_RECOMMENDATION_COUNT && (
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">{rv.recommendations}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localizedResult.recommendations.slice(PREVIEW_RECOMMENDATION_COUNT).map((rec) => (
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
                <Link href="/#contacto">
                  <Button size="lg" onClick={() => trackEvent("cta_clicked", { cta: "diagnostico" })}>
                    <Calendar className="h-5 w-5" />
                    {rv.requestDiagnostic}
                  </Button>
                </Link>
                <Link href={`/reporte/${result.id}`}>
                  <Button variant="outline" size="lg">
                    <Download className="h-5 w-5" />
                    {rv.downloadReport}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => trackEvent("cta_clicked", { cta: "email" })}
                >
                  <Mail className="h-5 w-5" />
                  {rv.receiveByEmail}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}