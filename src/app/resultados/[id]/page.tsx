"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CalculationResult } from "@/types/calculator";
import { getResult } from "@/lib/storage";
import { ResultsView } from "@/components/ResultsView";
import { getCalculatorById } from "@/data/calculatorConfigs";

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const stored = getResult(id);
    setResult(stored);
  }, [id]);

  if (!result) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600 mb-4">Resultado no encontrado o expirado.</p>
        <Link href="/" className="text-brand-orange font-semibold hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const calc = getCalculatorById(result.calculatorId);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-navy mb-6">
          <ArrowLeft className="h-4 w-4" />
          Volver a calculadoras
        </Link>
        <h1 className="text-3xl font-bold text-brand-navy mb-2">Resultado del análisis</h1>
        <p className="text-slate-600 mb-8">{calc?.title}</p>
        <ResultsView result={result} />
      </div>
    </div>
  );
}