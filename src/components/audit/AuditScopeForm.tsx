"use client";

import { useState } from "react";
import Link from "next/link";
import { getAuditCopy } from "@/i18n/audit";
import { AUDIT_IDS, auditMatch, type AuditId } from "@/lib/auditRoutes";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/types/calculator";
import { HoneypotField } from "@/components/HoneypotField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuditScopeForm({
  locale,
  model,
}: {
  locale: Locale;
  model?: string;
}) {
  const copy = getAuditCopy(locale);
  const suggested = model ? auditMatch(model).primary : "AUD-07";
  const [auditId, setAuditId] = useState<AuditId>(suggested);
  const [marketing, setMarketing] = useState(false);
  const [service, setService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!service) {
      setError(copy.consentService);
      return;
    }
    const form = new FormData(event.currentTarget);
    const lead = {
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      role: String(form.get("role") ?? ""),
      country: String(form.get("country") ?? ""),
      wantsEmailReport: marketing,
    };
    setLoading(true);
    try {
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "audit_scope_request",
          lead,
          language: locale,
          auditId,
          calculatorId: model || undefined,
          consentService: true,
          company_website: companyWebsite,
        }),
      });
      if (res.status === 400) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error === "Use un correo corporativo" ? copy.corporateEmail : copy.error);
        return;
      }
      if (!res.ok) {
        setError(copy.error);
        return;
      }
      trackEvent("cta_clicked", { cta: "audit_scope_request", auditId, model: model ?? "direct" });
      setDone(true);
    } catch {
      setError(copy.error);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-lg border border-brand-green/40 bg-white p-5 text-foreground" role="status">
        {copy.success}
      </p>
    );
  }

  return (
    <form method="post" onSubmit={onSubmit} className="relative space-y-4 rounded-xl border bg-white p-6">
      <HoneypotField onChange={setCompanyWebsite} />
      <div>
        <h2 className="text-xl font-bold text-foreground">{copy.formTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{copy.formLead}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="audit-name">{copy.name}</Label>
          <Input id="audit-name" name="name" autoComplete="name" required minLength={2} maxLength={200} />
        </div>
        <div>
          <Label htmlFor="audit-company">{copy.company}</Label>
          <Input id="audit-company" name="company" autoComplete="organization" required minLength={2} maxLength={200} />
        </div>
        <div>
          <Label htmlFor="audit-email">{copy.email}</Label>
          <Input id="audit-email" name="email" type="email" autoComplete="email" required maxLength={200} />
        </div>
        <div>
          <Label htmlFor="audit-role">{copy.role}</Label>
          <Input id="audit-role" name="role" autoComplete="organization-title" required minLength={2} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="audit-country">{copy.country}</Label>
          <select
            id="audit-country"
            name="country"
            required
            defaultValue=""
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>
              {copy.country}
            </option>
            {copy.countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="audit-interest">{copy.interest}</Label>
          <select
            id="audit-interest"
            name="auditId"
            required
            value={auditId}
            onChange={(event) => setAuditId(event.target.value as AuditId)}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {AUDIT_IDS.map((id) => (
              <option key={id} value={id}>
                {id} · {copy.offers[id].title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex items-start gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          className="mt-1 accent-brand-green"
          checked={service}
          onChange={(event) => setService(event.target.checked)}
          required
        />
        <span>{copy.consentService}</span>
      </label>
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          className="mt-1 accent-brand-green"
          checked={marketing}
          onChange={(event) => setMarketing(event.target.checked)}
        />
        <span>{copy.consentMarketing}</span>
      </label>
      <p className="text-xs text-muted-foreground">
        <Link href="/privacidad" className="underline">
          {locale === "en" ? "Privacy policy" : locale === "pt" ? "Política de privacidade" : "Política de privacidad"}
        </Link>
      </p>
      {error && (
        <p className="text-sm text-risk-critical" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
}
