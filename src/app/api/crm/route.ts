import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAllowedOrigin, isBodyTooLarge } from "@/lib/apiSecurity";
import { notifyLead } from "@/lib/notifyLead";
import { isDisposableEmail } from "@/lib/email";
import { sanitizeInput } from "@/lib/utils";

const safeString = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .transform((value) => sanitizeInput(value));

const utmField = z.string().trim().max(200).optional();

const leadSchema = z.object({
  resultId: safeString(100),
  lead: z.object({
    name: safeString(200).pipe(z.string().min(2)),
    company: safeString(200).pipe(z.string().min(2)),
    role: safeString(200).pipe(z.string().min(2)),
    email: z.string().trim().email().max(200).transform((value) => sanitizeInput(value)),
    country: safeString(50),
    sector: safeString(100),
    appCount: safeString(20),
    wantsEmailReport: z.boolean(),
  }),
  calculatorId: z.string().trim().max(100).optional(),
  calculatorTitle: z.string().trim().max(300).optional(),
  language: z.enum(["es", "en", "pt"]).optional(),
  score: z.number().optional(),
  riskLevel: z.string().trim().max(50).optional(),
  estimatedCost: z.number().optional(),
  estimatedCostFormatted: z.string().trim().max(80).optional(),
  executiveSummary: z.string().trim().max(4000).optional(),
  topRecommendations: z.array(z.string().trim().max(500)).max(10).optional(),
  classification: z.string().trim().max(200).optional(),
  spritaScore: z.union([z.string(), z.number()]).optional(),
  impactFormatted: z.string().trim().max(120).optional(),
});

const executiveLeadSchema = z.object({
  event: z.literal("software_score_form_submit"),
  lead: z.object({
    name: safeString(200).pipe(z.string().min(2)),
    company: safeString(200).pipe(z.string().min(2)),
    email: z.string().trim().email().max(200).transform((value) => sanitizeInput(value)),
    role: z.string().trim().max(200).optional(),
    country: safeString(50),
    sector: safeString(100),
    appCount: safeString(20),
    wantsEmailReport: z.boolean(),
  }),
  calculatorId: z.string().trim().max(100),
  calculatorTitle: z.string().trim().max(300).optional(),
  language: z.enum(["en", "es", "pt"]),
  score: z.number(),
  riskLevel: z.string().trim().max(50),
  maturityPercent: z.number().optional(),
  rawMaturityPoints: z.number().optional(),
  levelLabel: z.string().trim().max(100).optional(),
  executiveSummary: z.string().trim().max(4000).optional(),
  topRecommendations: z.array(z.string().trim().max(500)).max(10).optional(),
  topWeakCategories: z.array(z.string().trim().max(100)).max(10).optional(),
  utm_source: utmField,
  utm_medium: utmField,
  utm_campaign: utmField,
  utm_content: utmField,
  utm_term: utmField,
  referrer: z.string().trim().max(500).optional(),
});

const auditLeadSchema = z.object({
  event: z.literal("audit_scope_request"),
  lead: z.object({
    name: safeString(200).pipe(z.string().min(2)),
    company: safeString(200).pipe(z.string().min(2)),
    email: z.string().trim().email().max(200).transform((value) => sanitizeInput(value)),
    role: safeString(120).pipe(z.string().min(2)),
    country: safeString(50),
    wantsEmailReport: z.boolean(),
  }),
  language: z.enum(["en", "es", "pt"]),
  auditId: z.enum(["AUD-01", "AUD-02", "AUD-03", "AUD-04", "AUD-05", "AUD-06", "AUD-07"]),
  calculatorId: z.string().trim().max(100).optional(),
  consentService: z.literal(true),
});

const euAiActLeadSchema = z.object({
  event: z.literal("euaiact_form_submit"),
  lead: z.object({
    name: safeString(200).pipe(z.string().min(2)),
    company: safeString(200).pipe(z.string().min(2)),
    email: z.string().trim().email().max(200).transform((value) => sanitizeInput(value)),
    role: z.string().trim().max(200).optional(),
    country: safeString(50),
    sector: safeString(100),
    appCount: z.string().trim().max(20).optional(),
    wantsEmailReport: z.boolean(),
  }),
  calculatorId: z.string().trim().max(100),
  calculatorTitle: z.string().trim().max(300).optional(),
  language: z.enum(["en", "es", "pt"]),
  verdict: z.string().trim().max(80).optional(),
  confidence: z.string().trim().max(80).optional(),
  readinessScore: z.number().nullable().optional(),
  evidenceCoverage: z.number().optional(),
  executiveSummary: z.string().trim().max(4000).optional(),
  topRecommendations: z.array(z.string().trim().max(500)).max(10).optional(),
  utm_source: utmField,
  utm_medium: utmField,
  utm_campaign: utmField,
  utm_content: utmField,
  utm_term: utmField,
  referrer: z.string().trim().max(500).optional(),
});

function rejectDisposable(email: string) {
  return isDisposableEmail(email);
}

function honeypotTripped(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as { company_website?: unknown }).company_website;
  return typeof value === "string" && value.trim().length > 0;
}

const recentLeads = new Map<string, number>();
const LEAD_DEDUPE_MS = 10 * 60 * 1000;

function leadDedupeKey(event: string, email: string): string {
  return `${event}:${email.trim().toLowerCase()}`;
}

function isRecentLead(key: string): boolean {
  const now = Date.now();
  for (const [stored, at] of recentLeads) {
    if (now - at > LEAD_DEDUPE_MS) recentLeads.delete(stored);
  }
  const previous = recentLeads.get(key);
  return previous != null && now - previous < LEAD_DEDUPE_MS;
}

function rememberLead(key: string) {
  recentLeads.set(key, Date.now());
}

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
    }

    if (isBodyTooLarge(request)) {
      return NextResponse.json({ error: "Carga demasiado grande" }, { status: 413 });
    }

    const body = await request.json();

    if (honeypotTripped(body)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    if (body?.event === "software_score_form_submit") {
      const parsed = executiveLeadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
      }

      if (rejectDisposable(parsed.data.lead.email)) {
        return NextResponse.json({ error: "Use un correo corporativo" }, { status: 400 });
      }

      const dedupeKey = leadDedupeKey(parsed.data.event, parsed.data.lead.email);
      if (isRecentLead(dedupeKey)) {
        return NextResponse.json({ success: true });
      }

      const delivered = await notifyLead({
        ...parsed.data,
        timestamp: new Date().toISOString(),
      });

      if (!delivered) {
        return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 502 });
      }

      rememberLead(dedupeKey);

      if (process.env.NODE_ENV === "development") {
        console.info("[CRM Executive Lead]", parsed.data.lead.email);
      }

      return NextResponse.json({ success: true });
    }

    if (body?.event === "audit_scope_request") {
      const parsed = auditLeadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
      }

      if (rejectDisposable(parsed.data.lead.email)) {
        return NextResponse.json({ error: "Use un correo corporativo" }, { status: 400 });
      }

      const dedupeKey = leadDedupeKey(parsed.data.event, parsed.data.lead.email);
      if (isRecentLead(dedupeKey)) {
        return NextResponse.json({ success: true });
      }

      const delivered = await notifyLead({
        ...parsed.data,
        timestamp: new Date().toISOString(),
      });

      if (!delivered) {
        return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 502 });
      }

      rememberLead(dedupeKey);
      return NextResponse.json({ success: true });
    }

    if (body?.event === "euaiact_form_submit") {
      const parsed = euAiActLeadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
      }

      if (rejectDisposable(parsed.data.lead.email)) {
        return NextResponse.json({ error: "Use un correo corporativo" }, { status: 400 });
      }

      const dedupeKey = leadDedupeKey(parsed.data.event, parsed.data.lead.email);
      if (isRecentLead(dedupeKey)) {
        return NextResponse.json({ success: true });
      }

      const delivered = await notifyLead({
        ...parsed.data,
        score: parsed.data.readinessScore ?? undefined,
        riskLevel: parsed.data.verdict,
        timestamp: new Date().toISOString(),
      });

      if (!delivered) {
        return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 502 });
      }

      rememberLead(dedupeKey);
      return NextResponse.json({ success: true });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    if (rejectDisposable(parsed.data.lead.email)) {
      return NextResponse.json({ error: "Use un correo corporativo" }, { status: 400 });
    }

    const { resultId, lead, ...metrics } = parsed.data;
    const dedupeKey = leadDedupeKey("lead_submitted", lead.email);
    if (isRecentLead(dedupeKey)) {
      return NextResponse.json({ success: true });
    }

    const delivered = await notifyLead({
      event: "lead_submitted",
      lead,
      resultId,
      ...metrics,
      timestamp: new Date().toISOString(),
    });

    if (!delivered) {
      return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 502 });
    }

    rememberLead(dedupeKey);

    if (process.env.NODE_ENV === "development") {
      console.info("[CRM Lead]", { email: lead.email, resultId });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}