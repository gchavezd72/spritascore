"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sanitizeInput } from "@/lib/utils";
import { trackExecutiveEvent } from "@/lib/analytics";
import { isDisposableEmail, type UtmParams } from "@/lib/executiveUtm";
import type { ExecutiveScoreResult } from "@/lib/calculateExecutiveRiskScore";
import { getExecutiveCopy } from "@/i18n/executive";
import type { Locale } from "@/types/calculator";

interface ExecutiveLeadFormProps {
  locale: Locale;
  result: ExecutiveScoreResult;
  utm: UtmParams;
  onSuccess?: () => void;
}

export function ExecutiveLeadForm({ locale, result, utm, onSuccess }: ExecutiveLeadFormProps) {
  const copy = getExecutiveCopy(locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(2, copy.form.firstNameRequired),
        email: z.string().email(copy.form.emailInvalid),
        company: z.string().min(2, copy.form.companyRequired),
      }),
    [copy]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    setError("");

    if (isDisposableEmail(data.email)) {
      setError(copy.form.disposableEmail);
      setLoading(false);
      return;
    }

    const payload = {
      event: "software_score_form_submit",
      lead: {
        name: sanitizeInput(data.firstName),
        company: sanitizeInput(data.company),
        email: sanitizeInput(data.email),
        role: "Executive assessment",
        country: locale === "es" ? "ES" : locale === "pt" ? "PT" : "US",
        sector: "Financial services",
        appCount: "Not specified",
        wantsEmailReport: true,
      },
      calculatorId: "executive-software-risk-score",
      calculatorTitle: copy.meta.h1,
      language: locale,
      score: result.riskExposureScore,
      riskLevel: result.level,
      maturityPercent: result.maturityPercent,
      rawMaturityPoints: result.rawMaturityPoints,
      levelLabel: result.levelLabel,
      topWeakCategories: result.topWeakCategories,
      ...utm,
    };

    try {
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      trackExecutiveEvent("software_score_form_submit", payload);
      setDone(true);
      onSuccess?.();
    } catch {
      setError(copy.form.submitError);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Card className="border-brand-green/30">
        <CardContent className="pt-6">
          <p className="text-brand-navy font-semibold">{copy.form.successTitle}</p>
          <p className="text-muted-foreground text-sm mt-2">{copy.form.successBody}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-green/30" id="assessment-form">
      <CardHeader>
        <CardTitle>{copy.form.title}</CardTitle>
        <CardDescription>{copy.form.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{copy.form.firstName} *</Label>
              <Input id="firstName" autoComplete="given-name" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-risk-critical mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="company">{copy.form.company} *</Label>
              <Input id="company" autoComplete="organization" {...register("company")} />
              {errors.company && (
                <p className="text-sm text-risk-critical mt-1">{errors.company.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">{copy.form.email} *</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-risk-critical mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
          {error && <p className="text-sm text-risk-critical">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? copy.form.submitting : copy.form.submit}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {copy.form.privacyPrefix}
            <Link href="/privacidad" className="underline hover:text-foreground">
              {copy.meta.privacy}
            </Link>
            {copy.form.privacySuffix}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}