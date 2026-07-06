"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isDisposableEmail } from "@/lib/email";
import { sanitizeInput } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { saveResult, saveLead } from "@/lib/storage";
import { tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";
import type { CalculationResult, LeadData } from "@/types/calculator";
import { getCalculatorById } from "@/data/calculatorConfigs";
import type { TranslationKeys } from "@/i18n/es";

function buildSchema(t: TranslationKeys) {
  return z.object({
    name: z.string().min(2, t.leadForm.nameRequired),
    company: z.string().min(2, t.leadForm.companyRequired),
    email: z.string().email(t.leadForm.emailInvalid),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

interface ReportUnlockModalProps {
  result: CalculationResult;
  onUnlocked: (result: CalculationResult) => void;
}

export function ReportUnlockModal({ result, onUnlocked }: ReportUnlockModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, locale } = useTranslations();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
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
    const lead: LeadData = {
      name: sanitizeInput(data.name),
      company: sanitizeInput(data.company),
      role: "No especificado",
      email: sanitizeInput(data.email),
      country: (inputs.country as string) || "No especificado",
      sector: (inputs.sector as string) || "No especificado",
      appCount: (inputs.appCount as string | number | undefined)?.toString() || "No especificado",
      wantsEmailReport: true,
    };

    try {
      const calc = getCalculatorById(result.calculatorId);
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: result.id,
          lead,
          calculatorId: result.calculatorId,
          calculatorTitle: calc ? tr(calc.title, locale) : undefined,
          score: result.score,
          riskLevel: result.riskLevel,
          estimatedCost: result.cost.probable ?? result.cost.annual,
          topRecommendations: result.recommendations.slice(0, 3).map((r) => tr(r.title, locale)),
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      trackEvent("lead_submitted", { resultId: result.id, sector: lead.sector });

      const updated = { ...result, leadCaptured: true };
      saveResult(updated);
      saveLead(result.id, lead);
      onUnlocked(updated);
    } catch {
      setError(t.leadForm.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-surface border border-border-hairline p-8 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <button
          onClick={() => router.push(`/resultados/${result.id}`)}
          aria-label={t.unlockModal.close}
          className="absolute right-4 top-4 text-muted-foreground hover:text-brand-navy"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-brand-navy text-center mb-1">{t.unlockModal.title}</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">{t.unlockModal.description}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="unlock-name">{t.leadForm.name} *</Label>
            <Input id="unlock-name" autoFocus {...register("name")} />
            {errors.name && <p className="text-sm text-risk-critical mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="unlock-company">{t.leadForm.company} *</Label>
            <Input id="unlock-company" {...register("company")} />
            {errors.company && <p className="text-sm text-risk-critical mt-1">{errors.company.message}</p>}
          </div>
          <div>
            <Label htmlFor="unlock-email">{t.leadForm.email} *</Label>
            <Input id="unlock-email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-risk-critical mt-1">{errors.email.message}</p>}
          </div>
          {error && <p className="text-sm text-risk-critical">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.leadForm.submitting : t.unlockModal.submit}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {t.leadForm.privacyNotice.split("{privacyLink}")[0]}
            <a href="/privacidad" className="underline hover:text-foreground">
              {t.leadForm.privacyLinkText}
            </a>
            {t.leadForm.privacyNotice.split("{privacyLink}")[1]}
          </p>
        </form>
      </div>
    </div>
  );
}
