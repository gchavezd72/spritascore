"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { CalculationResult } from "@/types/calculator";
import { getResult } from "@/lib/storage";
import { ReportPreview } from "@/components/ReportPreview";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    setResult(getResult(id));
  }, [id]);

  if (!result) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">Reporte no disponible.</p>
        <Link href="/" className="text-brand-orange">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="py-8 bg-white min-h-screen print:py-0">
      <div className="container mx-auto px-4 print:px-0">
        <div className="mb-6 print:hidden">
          <Link href={`/resultados/${id}`} className="text-sm text-brand-orange hover:underline">
            ← Volver a resultados
          </Link>
        </div>
        <ReportPreview result={result} />
      </div>
    </div>
  );
}