"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SECTOR_OPTIONS } from "@/data/sectorRiskFactors";
import { COUNTRIES } from "@/data/commonOptions";
import { sanitizeInput } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { CalculationResult, LeadData } from "@/types/calculator";
import { getCalculatorById } from "@/data/calculatorConfigs";

const leadSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  company: z.string().min(2, "Empresa requerida"),
  role: z.string().min(2, "Cargo requerido"),
  email: z.string().email("Email corporativo inválido"),
  country: z.string().min(1, "País requerido"),
  sector: z.string().min(1, "Sector requerido"),
  appCount: z.string().min(1, "Requerido"),
  wantsEmailReport: z.boolean(),
});

interface LeadCaptureFormProps {
  result: CalculationResult;
  onSuccess: (lead: LeadData) => void;
}

export function LeadCaptureForm({ result, onSuccess }: LeadCaptureFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LeadData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { wantsEmailReport: true },
  });

  const onSubmit = async (data: LeadData) => {
    setLoading(true);
    setError("");

    const sanitized: LeadData = {
      name: sanitizeInput(data.name),
      company: sanitizeInput(data.company),
      role: sanitizeInput(data.role),
      email: sanitizeInput(data.email),
      country: data.country,
      sector: data.sector,
      appCount: data.appCount,
      wantsEmailReport: data.wantsEmailReport,
    };

    try {
      const calc = getCalculatorById(result.calculatorId);
      await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: result.id,
          lead: sanitized,
          calculatorId: result.calculatorId,
          calculatorTitle: calc?.title,
          score: result.score,
          riskLevel: result.riskLevel,
          estimatedCost: result.cost.probable ?? result.cost.annual,
          topRecommendations: result.recommendations.slice(0, 3).map((r) => r.title),
        }),
      });
      trackEvent("lead_submitted", { resultId: result.id, sector: sanitized.sector });
      onSuccess(sanitized);
    } catch {
      setError("Error al enviar. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-brand-orange/30">
      <CardHeader>
        <CardTitle>Desbloquee su reporte completo</CardTitle>
        <CardDescription>
          Complete sus datos para acceder al reporte detallado, recomendaciones priorizadas y descarga en PDF.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-risk-critical mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="company">Empresa *</Label>
              <Input id="company" {...register("company")} />
              {errors.company && <p className="text-sm text-risk-critical mt-1">{errors.company.message}</p>}
            </div>
            <div>
              <Label htmlFor="role">Cargo *</Label>
              <Input id="role" placeholder="CTO, CISO, Director de TI..." {...register("role")} />
              {errors.role && <p className="text-sm text-risk-critical mt-1">{errors.role.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email corporativo *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-risk-critical mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="country">País *</Label>
              <Select id="country" options={COUNTRIES} {...register("country")} />
              {errors.country && <p className="text-sm text-risk-critical mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <Label htmlFor="sector">Sector *</Label>
              <Select id="sector" options={SECTOR_OPTIONS} {...register("sector")} />
              {errors.sector && <p className="text-sm text-risk-critical mt-1">{errors.sector.message}</p>}
            </div>
            <div>
              <Label htmlFor="appCount">Nº aproximado de aplicaciones *</Label>
              <Select
                id="appCount"
                options={[
                  { value: "1-5", label: "1 a 5" },
                  { value: "6-20", label: "6 a 20" },
                  { value: "21-50", label: "21 a 50" },
                  { value: "50+", label: "Más de 50" },
                ]}
                {...register("appCount")}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-brand-orange"
              checked={watch("wantsEmailReport")}
              onChange={(e) => setValue("wantsEmailReport", e.target.checked)}
            />
            <span className="text-sm text-slate-600">Deseo recibir el reporte por email</span>
          </label>
          {error && <p className="text-sm text-risk-critical">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Obtener reporte completo"}
          </Button>
          <p className="text-xs text-slate-400 text-center">
            Al enviar, acepta nuestra política de privacidad. No compartimos su información con terceros.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}