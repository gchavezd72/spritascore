import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { forwardToCrmWebhook, isAllowedOrigin, isBodyTooLarge } from "@/lib/apiSecurity";
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
  score: z.number().optional(),
  riskLevel: z.string().trim().max(50).optional(),
  estimatedCost: z.number().optional(),
  topRecommendations: z.array(z.string().trim().max(500)).max(10).optional(),
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
  topWeakCategories: z.array(z.string().trim().max(100)).max(10).optional(),
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

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
    }

    if (isBodyTooLarge(request)) {
      return NextResponse.json({ error: "Carga demasiado grande" }, { status: 413 });
    }

    const body = await request.json();

    if (body?.event === "software_score_form_submit") {
      const parsed = executiveLeadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
      }

      if (rejectDisposable(parsed.data.lead.email)) {
        return NextResponse.json({ error: "Use un correo corporativo" }, { status: 400 });
      }

      const forwarded = await forwardToCrmWebhook({
        ...parsed.data,
        timestamp: new Date().toISOString(),
      });

      if (!forwarded) {
        return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 502 });
      }

      if (process.env.NODE_ENV === "development") {
        console.info("[CRM Executive Lead]", parsed.data.lead.email);
      }

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

    const forwarded = await forwardToCrmWebhook({
      event: "lead_submitted",
      lead,
      resultId,
      ...metrics,
      timestamp: new Date().toISOString(),
    });

    if (!forwarded) {
      return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 502 });
    }

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