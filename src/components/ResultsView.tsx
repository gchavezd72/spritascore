"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Download, Mail, AlertTriangle, Clock } from "lucide-react";
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
import { useTranslations } from "@/components/LanguageProvider";

interface ResultsViewProps {
  result: CalculationResult;
}

export function ResultsView({ result: initialResult }: ResultsViewProps) {
  const [result, setResult] = useState(initialResult);
  const [unlocked, setUnlocked] = useState(initialResult.leadCaptured);
  const { t } = useTranslations();
  const rv = t.resultsView;

  const handleLeadSuccess = (lead: LeadData) => {
    const updated = { ...result, leadCaptured: true };
    setResult(updated);
    saveResult(updated);
    saveLead(result.id, lead);
    setUnlocked(true);
  };

  return (
    <div className="space-y-8">
      {/* Partial result always visible */}
      <Card>
        <CardContent className="pt-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <RiskScore score={result.score} riskLevel={result.riskLevel} />
            <div className="flex-1 text-center lg:text-left">
              {result.hoursPerYear !== undefined && (
                <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green font-semibold px-4 py-2 rounded-lg mb-3">
                  <Clock className="h-4 w-4" />
                  ≈{result.hoursPerYear.toLocaleString()} {rv.hoursRecoverable} ({(result.hoursPerYear / 2080).toFixed(1)} {rv.fteEquivalent})
                </div>
              )}
              <p className="text-lg text-muted-foreground mb-2">{result.partialSummary}</p>
              <p className="text-sm text-muted-foreground italic">&quot;{rv.quote}&quot;</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!unlocked && (
        <LeadCaptureForm result={result} onSuccess={handleLeadSuccess} />
      )}

      {unlocked ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{rv.executiveSummary}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed">{result.executiveSummary}</p>
            </CardContent>
          </Card>

          <CostBreakdown cost={result.cost} currency={result.currency} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{rv.impactMatrix}</CardTitle>
              </CardHeader>
              <CardContent>
                <ImpactMatrix matrix={result.impactMatrix} />
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
                  {result.riskFactors.map((factor, i) => (
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

          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">{rv.recommendations}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>

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
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>{rv.lockedMessage}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
