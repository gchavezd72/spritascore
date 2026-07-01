import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  resultId: z.string().min(1),
  lead: z.object({
    name: z.string().min(2).max(200),
    company: z.string().min(2).max(200),
    role: z.string().min(2).max(200),
    email: z.string().email().max(200),
    country: z.string().min(1).max(50),
    sector: z.string().min(1).max(100),
    appCount: z.string().min(1).max(20),
    wantsEmailReport: z.boolean(),
  }),
  calculatorId: z.string().optional(),
  calculatorTitle: z.string().optional(),
  score: z.number().optional(),
  riskLevel: z.string().optional(),
  estimatedCost: z.number().optional(),
  topRecommendations: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { resultId, lead, ...metrics } = parsed.data;

    const webhookUrl = process.env.CRM_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "lead_submitted",
          lead,
          resultId,
          ...metrics,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.info("[CRM Lead]", {
        ...lead,
        resultId,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Server-side storage is not available; client sends enriched payload
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.CRM_WEBHOOK_URL;

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}