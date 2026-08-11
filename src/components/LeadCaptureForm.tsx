"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isDisposableEmail } from "@/lib/email";
import { sanitizeInput } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";
import type { CalculationResult, LeadData } from "@/types/calculator";
import { getCalculatorById } from "@/data/calculatorConfigs";
import type { TranslationKeys } from "@/i18n/es";

function buildSchema(t: TranslationKeys) {
  return z.object({
    firstName: z.string().min(2, t.leadForm.nameRequired),
    lastName: z.string().min(2, t.leadForm.lastNameRequired),
    company: z.string().min(2, t.leadForm.companyRequired),
    role: z.string().optional(),
    email: z.string().email(t.leadForm.emailInvalid),
    wantsEmailReport: z.boolean(),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

interface LeadCaptureFormProps {
  result: CalculationResult;
  onSuccess: (lead: LeadData) => void;
}

export function LeadCaptureForm({ result, onSuccess }: LeadCaptureFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, locale } = useTranslations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: { wantsEmailReport: true },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError("");

    if (isDisposableEmail(data.email)) {
      setError(t.leadForm.disposableEmail);
      setLoading(false);
      return;
    }

    const inputs = result.inputs;
    const fullName = `${sanitizeInput(data.firstName)} ${sanitizeInput(data.lastName)}`.trim();
    const sanitized: LeadData = {
      name: fullName,
      company: sanitizeInput(data.company),
      role: sanitizeInput(data.role || "No especificado"),
      email: sanitizeInput(data.email),
      country: (inputs.country as string) || "No especificado",
      sector: (inputs.sector as string) || "No especificado",
      appCount: (inputs.appCount as string | number | undefined)?.toString() || "No especificado",
      wantsEmailReport: data.wantsEmailReport,
    };

    try {
      const calc = getCalculatorById(result.calculatorId);
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: result.id,
          lead: sanitized,
          calculatorId: result.calculatorId,
          calculatorTitle: calc ? tr(calc.title, locale) : undefined,
          score: result.score,
          riskLevel: result.riskLevel,
          estimatedCost: result.cost.probable ?? result.cost.annual,
          topRecommendations: result.recommendations
            .slice(0, 3)
            .map((r) => tr(r.title, locale)),
          language: locale,
          spritaScore: inputs.spritaScore,
          impactFormatted: inputs.impactFormatted,
          classification: inputs.classification,
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      trackEvent("lead_submitted", {
        resultId: result.id,
        sector: sanitized.sector,
        calculator: result.calculatorId,
      });
      onSuccess(sanitized);
    } catch {
      setError(t.leadForm.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-brand-green/30">
      <CardHeader>
        <CardTitle>{t.leadForm.title}</CardTitle>
        <CardDescription>{t.leadForm.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t.leadForm.firstName} *</Label>
              <Input id="firstName" autoComplete="given-name" autoFocus {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-risk-critical mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">{t.leadForm.lastName} *</Label>
              <Input id="lastName" autoComplete="family-name" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-risk-critical mt-1">{errors.lastName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="company">{t.leadForm.company} *</Label>
              <Input id="company" autoComplete="organization" {...register("company")} />
              {errors.company && (
                <p className="text-sm text-risk-critical mt-1">{errors.company.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">{t.leadForm.email} *</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-risk-critical mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="role">{t.leadForm.role}</Label>
              <Input
                id="role"
                placeholder={t.leadForm.rolePlaceholder}
                autoComplete="organization-title"
                {...register("role")}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-brand-green"
              checked={watch("wantsEmailReport")}
              onChange={(e) => setValue("wantsEmailReport", e.target.checked)}
            />
            <span className="text-sm text-muted-foreground">{t.leadForm.wantsEmailReport}</span>
          </label>
          {error && <p className="text-sm text-risk-critical">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.leadForm.submitting : t.leadForm.submit}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {t.leadForm.privacyNotice.split("{privacyLink}")[0]}
            <Link href="/privacidad" className="underline hover:text-foreground">
              {t.leadForm.privacyLinkText}
            </Link>
            {t.leadForm.privacyNotice.split("{privacyLink}")[1]}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
