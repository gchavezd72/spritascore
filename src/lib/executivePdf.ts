import { jsPDF } from "jspdf";
import type { ExecutiveAnswerId } from "@/data/executiveSoftwareRiskScore";
import type { ExecutiveScoreResult } from "@/lib/calculateExecutiveRiskScore";
import { getExecutiveCopy, getExecutiveQuestions } from "@/i18n/executive";
import type { Locale } from "@/types/calculator";

const MARGIN = 14;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  for (const line of lines) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

export function downloadExecutiveScorePdf(
  locale: Locale,
  answers: Record<string, ExecutiveAnswerId>,
  result: ExecutiveScoreResult
): boolean {
  try {
    const copy = getExecutiveCopy(locale);
    const questions = getExecutiveQuestions(locale);
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    y = addWrappedText(doc, copy.pdf.title, MARGIN, y, CONTENT_WIDTH, 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y = addWrappedText(
      doc,
      `SpritaScore · Sprita iT · ${new Date().toLocaleDateString(locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-ES")}`,
      MARGIN,
      y + 2,
      CONTENT_WIDTH,
      5
    );

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    y = addWrappedText(
      doc,
      `${copy.pdf.riskScore}: ${result.riskExposureScore} / 1000`,
      MARGIN,
      y,
      CONTENT_WIDTH,
      7
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y = addWrappedText(
      doc,
      `${copy.pdf.maturity}: ${result.levelLabel} (${result.exposureLabel})`,
      MARGIN,
      y,
      CONTENT_WIDTH,
      6
    );
    y = addWrappedText(
      doc,
      `${copy.pdf.points}: ${result.rawMaturityPoints} / 15 (${result.maturityPercent}%)`,
      MARGIN,
      y,
      CONTENT_WIDTH,
      6
    );
    y = addWrappedText(doc, result.interpretation, MARGIN, y + 2, CONTENT_WIDTH, 6);

    y += 4;
    doc.setFont("helvetica", "bold");
    y = addWrappedText(doc, copy.pdf.topGaps, MARGIN, y, CONTENT_WIDTH, 6);
    doc.setFont("helvetica", "normal");

    if (result.recommendations.length === 0) {
      y = addWrappedText(doc, copy.pdf.noGaps, MARGIN, y, CONTENT_WIDTH, 6);
    } else {
      for (const rec of result.recommendations) {
        y = addWrappedText(doc, `• ${rec.label}: ${rec.text}`, MARGIN, y, CONTENT_WIDTH, 6);
      }
    }

    y += 6;
    doc.setFont("helvetica", "bold");
    y = addWrappedText(doc, copy.pdf.responses, MARGIN, y, CONTENT_WIDTH, 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    questions.forEach((q, index) => {
      const answerId = answers[q.id];
      const answerLabel = answerId ? copy.answers[answerId] : "—";
      const block = `${index + 1}. [${q.categoryLabel}] ${q.text}\n   → ${answerLabel}`;
      y = addWrappedText(doc, block, MARGIN, y + 1, CONTENT_WIDTH, 5);
    });

    y += 4;
    doc.setFontSize(8);
    doc.setTextColor(90, 100, 114);
    addWrappedText(doc, copy.pdf.disclaimer, MARGIN, y, CONTENT_WIDTH, 4);
    doc.setTextColor(18, 33, 59);

    const date = new Date().toISOString().slice(0, 10);
    doc.save(`${copy.pdf.filename}-${date}.pdf`);
    return true;
  } catch {
    return false;
  }
}