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
import { sanitizeInput } from "@/lib/utils";
import { trackExecutiveEvent } from "@/lib/analytics";
import { isDisposableEmail, type UtmParams } from "@/lib/executiveUtm";
import type { ExecutiveScoreResult } from "@/lib/calculateExecutiveRiskScore";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  email: z.string().email("Enter a valid business email"),
  company: z.string().min(2, "Company is required"),
});

type FormValues = z.infer<typeof schema>;

interface ExecutiveLeadFormProps {
  result: ExecutiveScoreResult;
  utm: UtmParams;
  onSuccess?: () => void;
}

export function ExecutiveLeadForm({ result, utm, onSuccess }: ExecutiveLeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError("");

    if (isDisposableEmail(data.email)) {
      setError("Please use a business email address.");
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
        country: "US",
        sector: "Financial services",
        appCount: "Not specified",
        wantsEmailReport: true,
      },
      calculatorId: "executive-software-risk-score",
      calculatorTitle: "Executive Software Risk Score",
      score: result.riskExposureScore,
      riskLevel: result.level,
      maturityPercent: result.maturityPercent,
      rawMaturityPoints: result.rawMaturityPoints,
      levelLabel: result.levelLabel,
      topWeakCategories: result.topWeakCategories,
      ...utm,
    };

    try {
      await fetch("/api/crm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      trackExecutiveEvent("software_score_form_submit", payload);
      setDone(true);
      onSuccess?.();
    } catch {
      setError("Could not submit your request. Please try again or email info@spritascore.com.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Card className="border-brand-green/30">
        <CardContent className="pt-6">
          <p className="text-brand-navy font-semibold">Thank you — we received your request.</p>
          <p className="text-muted-foreground text-sm mt-2">
            A Sprita iT specialist will follow up with your executive assessment details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-green/30" id="assessment-form">
      <CardHeader>
        <CardTitle>Request a no-cost Software Risk Assessment</CardTitle>
        <CardDescription>
          Receive an executive report with the Top 10 critical vulnerabilities and Top 10 priority
          software quality defects, plus a prioritized remediation plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name *</Label>
              <Input id="firstName" autoComplete="given-name" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-risk-critical mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input id="company" autoComplete="organization" {...register("company")} />
              {errors.company && (
                <p className="text-sm text-risk-critical mt-1">{errors.company.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Business email *</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-risk-critical mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
          {error && <p className="text-sm text-risk-critical">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Request a no-cost Software Risk Assessment"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to our{" "}
            <Link href="/privacidad" className="underline hover:text-foreground">
              privacy policy
            </Link>
            . This score is informational and does not constitute legal, regulatory, audit, or
            technical certification.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}