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
import { trackEvent } from "@/lib/analytics";
import { isDisposableEmail, type UtmParams } from "@/lib/executiveUtm";
import type { EuAiActResult } from "@/lib/calculateEuAiAct";
import { getEuAiActCopy } from "@/i18n/euAiAct";
import type { Locale } from "@/types/calculator";

interface EuAiActLeadFormProps {
  locale: Locale;
  result: EuAiActResult;
  utm: UtmParams;
}

export function EuAiActLeadForm({ locale, result, utm }: EuAiActLeadFormProps) {
  const copy = getEuAiActCopy(locale);
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
      event: "euaiact_form_submit",
      lead: {
        name: sanitizeInput(data.firstName),
        company: sanitizeInput(data.company),
        email: sanitizeInput(data.email),
        role: "EU AI Act assessment",
        country: locale === "es" ? "ES" : locale === "pt" ? "PT" : "US",
        sector: "AI / Compliance",
        wantsEmailReport: true,
      },
      calculatorId: "eu-ai-act-compliance",
      calculatorTitle: copy.meta.h1,
      language: locale,
      verdict: result.verdict,
      confidence: result.confidence,
      readinessScore: result.readinessScore,
      evidenceCoverage: result.evidenceCoverage,
      roles: result.roles,
      ...utm,
    };

    try {
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      trackEvent("euaiact_form_submit", payload);
      setDone(true);
    } catch {
      setError(copy.form.submitError);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Card className="border-brand-green/30" id="euaiact-form">
        <CardContent className="pt-6">
          <p className="text-brand-navy font-semibold">{copy.form.successTitle}</p>
          <p className="text-muted-foreground text-sm mt-2">{copy.form.successBody}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-green/30" id="euaiact-form">
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
