"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Download, Mail, AlertTriangle } from "lucide-react";
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

interface ResultsViewProps {
  result: CalculationResult;
}

export function ResultsView({ result: initialResult }: ResultsViewProps) {
  const [result, setResult] = useState(initialResult);
  const [unlocked, setUnlocked] = useState(initialResult.leadCaptured);

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
      <Card className="border-brand-navy/20">
        <CardContent className="pt-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <RiskScore score={result.score} riskLevel={result.riskLevel} />
            <div className="flex-1 text-center lg:text-left">
              <p className="text-lg text-slate-600 mb-2">{result.partialSummary}</p>
              <p className="text-sm text-slate-500 italic">
                &quot;No todos los defectos cuestan lo mismo. Los más peligrosos no siempre son los más visibles.&quot;
              </p>
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
              <CardTitle>Resumen ejecutivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">{result.executiveSummary}</p>
            </CardContent>
          </Card>

          <CostBreakdown cost={result.cost} currency={result.currency} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Matriz de impacto</CardTitle>
              </CardHeader>
              <CardContent>
                <ImpactMatrix matrix={result.impactMatrix} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-risk-high" />
                  Factores de riesgo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.riskFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
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
            <h3 className="text-xl font-bold text-brand-navy mb-4">Recomendaciones priorizadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>

          <Card className="bg-brand-navy text-white">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-lg mb-2">
                Este resultado es una estimación inicial. Un diagnóstico técnico puede validar el nivel real de exposición.
              </p>
              <p className="text-slate-300 mb-6">
                Podemos ayudarte a validar estos resultados con un diagnóstico técnico de calidad, seguridad y dependencias de software.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#contacto">
                  <Button size="lg" onClick={() => trackEvent("cta_clicked", { cta: "diagnostico" })}>
                    <Calendar className="h-5 w-5" />
                    Solicitar diagnóstico
                  </Button>
                </Link>
                <Link href={`/reporte/${result.id}`}>
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-brand-navy">
                    <Download className="h-5 w-5" />
                    Descargar reporte
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10"
                  onClick={() => trackEvent("cta_clicked", { cta: "email" })}
                >
                  <Mail className="h-5 w-5" />
                  Recibir por email
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="py-12 text-center text-slate-400">
            <p>Complete el formulario para desbloquear el reporte completo con recomendaciones, matriz de riesgo y descarga.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}