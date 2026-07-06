import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  EXECUTIVE_SECTIONS,
  type ExecutiveAnswerId,
} from "@/data/executiveSoftwareRiskScore";
import { getCategoryActions, getLevelActionPlan } from "@/data/executivePdfPlans";
import type { ExecutiveScoreResult } from "@/lib/calculateExecutiveRiskScore";
import { getAnswerPoints } from "@/lib/calculateExecutiveRiskScore";
import { pdfText } from "@/lib/pdfText";
import { getExecutiveCopy, getExecutiveQuestions } from "@/i18n/executive";
import type { Locale } from "@/types/calculator";

const BRAND = {
  navy: [18, 33, 59] as [number, number, number],
  green: [31, 191, 108] as [number, number, number],
  muted: [91, 100, 114] as [number, number, number],
  light: [247, 248, 250] as [number, number, number],
  border: [230, 233, 239] as [number, number, number],
  risk: {
    low: [31, 191, 108] as [number, number, number],
    moderate: [234, 179, 8] as [number, number, number],
    high: [249, 115, 22] as [number, number, number],
    critical: [239, 68, 68] as [number, number, number],
  },
};

const MARGIN = 16;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_H = 4.5;

type JsDoc = jsPDF & {
  internal: { getNumberOfPages: () => number };
  lastAutoTable?: { finalY: number };
};

function tableEndY(doc: JsDoc, fallback: number): number {
  return doc.lastAutoTable?.finalY ?? fallback;
}

function localeDate(locale: Locale) {
  const tag = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-ES";
  return pdfText(
    new Date().toLocaleDateString(tag, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
}

function ensureSpace(doc: JsDoc, y: number, needed: number): number {
  if (y + needed > PAGE_H - 22) {
    doc.addPage();
    drawPageFooter(doc, doc.internal.getNumberOfPages());
    return 24;
  }
  return y;
}

/** Never pass string arrays to doc.text — draw one line at a time. */
function drawLine(doc: JsDoc, text: string, x: number, y: number): void {
  doc.text(pdfText(text), x, y);
}

function drawPageFooter(doc: JsDoc, pageNum: number, locale?: Locale) {
  const copy = locale ? getExecutiveCopy(locale).pdf : null;
  doc.setDrawColor(...BRAND.border);
  doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  drawLine(doc, "SpritaScore | Sprita iT", MARGIN, PAGE_H - 10);
  if (copy) {
    drawLine(doc, `${copy.page} ${pageNum}`, PAGE_W - MARGIN, PAGE_H - 10);
  }
  doc.setTextColor(...BRAND.navy);
}

function drawSectionTitle(doc: JsDoc, title: string, y: number): number {
  y = ensureSpace(doc, y, 14);
  doc.setFillColor(...BRAND.navy);
  doc.rect(MARGIN, y, CONTENT_W, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  drawLine(doc, title, MARGIN + 3, y + 5.5);
  doc.setTextColor(...BRAND.navy);
  return y + 12;
}

function drawWrapped(
  doc: JsDoc,
  text: string,
  x: number,
  y: number,
  width: number,
  size = 10,
  style: "normal" | "bold" = "normal",
  line = LINE_H
): number {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  const safe = pdfText(text);
  const lines = doc.splitTextToSize(safe, width) as string[];
  for (const lineText of lines) {
    y = ensureSpace(doc, y, line + 2);
    drawLine(doc, lineText, x, y);
    y += line;
  }
  return y;
}

function drawBulletList(doc: JsDoc, items: string[], x: number, y: number, width: number): number {
  for (const item of items) {
    y = ensureSpace(doc, y, 8);
    doc.setFillColor(...BRAND.green);
    doc.circle(x + 1.5, y - 1.2, 0.8, "F");
    y = drawWrapped(doc, item, x + 5, y, width - 5, 9, "normal", 4.2);
    y += 1.5;
  }
  return y;
}

function domainStatus(points: number, max: number, copy: ReturnType<typeof getExecutiveCopy>["pdf"]) {
  const ratio = max > 0 ? points / max : 0;
  if (ratio >= 0.8) return copy.statusStrong;
  if (ratio >= 0.45) return copy.statusPartial;
  return copy.statusWeak;
}

function answerColor(answerId?: ExecutiveAnswerId): [number, number, number] {
  if (answerId === "yes") return BRAND.risk.low;
  if (answerId === "partially") return BRAND.risk.moderate;
  return BRAND.risk.critical;
}

function sanitizeTableRows(rows: string[][]): string[][] {
  return rows.map((row) => row.map((cell) => pdfText(cell)));
}

export function downloadExecutiveScorePdf(
  locale: Locale,
  answers: Record<string, ExecutiveAnswerId>,
  result: ExecutiveScoreResult
): boolean {
  try {
    const copy = getExecutiveCopy(locale);
    const pdf = copy.pdf;
    const questions = getExecutiveQuestions(locale);
    const doc = new jsPDF({ unit: "mm", format: "a4" }) as JsDoc;
    const actionPlan = getLevelActionPlan(locale, result.level);
    const categoryActions = getCategoryActions(locale, result.topWeakCategories);
    const dateStr = localeDate(locale);

    doc.setFillColor(...BRAND.navy);
    doc.rect(0, 0, PAGE_W, 52, "F");
    doc.setFillColor(...BRAND.green);
    doc.rect(0, 52, PAGE_W, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    drawLine(doc, "Sprita", MARGIN, 22);
    doc.setTextColor(...BRAND.green);
    drawLine(doc, "Score", MARGIN + 28, 22);
    doc.setFontSize(10);
    doc.setTextColor(200, 210, 225);
    drawLine(doc, "by Sprita iT", MARGIN, 30);

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    drawLine(doc, pdf.title, MARGIN, 42);
    doc.setFontSize(9);
    doc.setTextColor(200, 210, 225);
    drawLine(doc, `${pdf.subtitle} | ${dateStr}`, MARGIN, 48);

    let y = 64;

    doc.setFillColor(...BRAND.light);
    doc.roundedRect(MARGIN, y, CONTENT_W, 42, 3, 3, "F");
    doc.setDrawColor(...BRAND.border);
    doc.roundedRect(MARGIN, y, CONTENT_W, 42, 3, 3, "S");

    const riskColor = BRAND.risk[result.level];
    doc.setFillColor(...riskColor);
    doc.roundedRect(MARGIN + 6, y + 6, 52, 30, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    drawLine(doc, String(result.riskExposureScore), MARGIN + 32, y + 24);
    doc.setFontSize(8);
    drawLine(doc, "/ 1000", MARGIN + 32, y + 31);
    doc.setFontSize(7);
    drawLine(doc, pdf.riskScore.toUpperCase(), MARGIN + 6, y + 12);

    const col2 = MARGIN + 66;
    doc.setTextColor(...BRAND.navy);
    doc.setFontSize(11);
    drawLine(doc, `${pdf.maturity}:`, col2, y + 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    drawLine(doc, result.levelLabel, col2, y + 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.muted);
    drawLine(doc, `${result.exposureLabel} exposure`, col2, y + 24);

    doc.setTextColor(...BRAND.navy);
    doc.setFontSize(10);
    drawLine(
      doc,
      `${pdf.points}: ${result.rawMaturityPoints} / 15 (${result.maturityPercent}%)`,
      col2,
      y + 32
    );

    y += 50;
    y = drawSectionTitle(doc, pdf.executiveSummary, y);
    y = drawWrapped(doc, result.interpretation, MARGIN, y, CONTENT_W, 10);

    y += 4;
    y = drawSectionTitle(doc, pdf.categoryBreakdown, y);

    const domainRows = sanitizeTableRows(
      EXECUTIVE_SECTIONS.map((section) => {
        const qs = questions.filter((q) => q.category === section);
        const points = qs.reduce((sum, q) => {
          const answer = answers[q.id];
          return sum + (answer ? getAnswerPoints(answer) : 0);
        }, 0);
        const max = qs.length;
        return [
          copy.sections[section],
          `${points} / ${max}`,
          domainStatus(points, max, pdf),
        ];
      })
    );

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: sanitizeTableRows([[pdf.colDomain, pdf.colScore, pdf.colStatus]]),
      body: domainRows,
      theme: "grid",
      headStyles: {
        fillColor: BRAND.navy,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: BRAND.navy },
      alternateRowStyles: { fillColor: BRAND.light },
      styles: { cellPadding: 3, lineColor: BRAND.border, lineWidth: 0.1 },
    });

    y = tableEndY(doc, y) + 8;

    y = drawSectionTitle(doc, pdf.recommendationsTitle, y);

    if (result.recommendations.length === 0) {
      y = drawWrapped(doc, pdf.noGaps, MARGIN, y, CONTENT_W, 10);
    } else {
      result.recommendations.forEach((rec, index) => {
        y = ensureSpace(doc, y, 28);
        doc.setFillColor(...BRAND.light);
        doc.roundedRect(MARGIN, y, CONTENT_W, 22, 2, 2, "F");
        doc.setDrawColor(...BRAND.border);
        doc.roundedRect(MARGIN, y, CONTENT_W, 22, 2, 2, "S");

        doc.setFillColor(...BRAND.green);
        doc.circle(MARGIN + 6, y + 7, 4, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        drawLine(doc, String(index + 1), MARGIN + 6, y + 8.2);

        doc.setTextColor(...BRAND.navy);
        doc.setFontSize(10);
        drawLine(doc, rec.label, MARGIN + 14, y + 8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...BRAND.muted);
        y = drawWrapped(doc, rec.text, MARGIN + 14, y + 12, CONTENT_W - 18, 9, "normal", 4);

        const extra = categoryActions.find((c) => c.category === rec.category);
        if (extra?.actions[0]) {
          doc.setTextColor(...BRAND.navy);
          doc.setFontSize(8);
          drawLine(doc, `> ${extra.actions[0]}`, MARGIN + 14, y);
          y += 4;
        }

        y += 22;
      });
    }

    doc.addPage();
    drawPageFooter(doc, doc.internal.getNumberOfPages(), locale);
    y = 24;
    y = drawSectionTitle(doc, pdf.actionPlanTitle, y);

    const phases: { title: string; items: string[]; color: [number, number, number] }[] = [
      { title: pdf.phaseImmediate, items: actionPlan.immediate, color: BRAND.risk.critical },
      { title: pdf.phaseShort, items: actionPlan.shortTerm, color: BRAND.risk.moderate },
      { title: pdf.phaseMedium, items: actionPlan.mediumTerm, color: BRAND.risk.low },
    ];

    for (const phase of phases) {
      y = ensureSpace(doc, y, 20);
      doc.setFillColor(...phase.color);
      doc.rect(MARGIN, y, 3, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...BRAND.navy);
      drawLine(doc, phase.title, MARGIN + 6, y + 5.5);
      y += 10;
      y = drawBulletList(doc, phase.items, MARGIN, y, CONTENT_W);
      y += 4;
    }

    y += 2;
    y = drawSectionTitle(doc, pdf.responses, y);

    const tableBody = sanitizeTableRows(
      questions.map((q, index) => {
        const answerId = answers[q.id];
        return [
          String(index + 1),
          q.categoryLabel,
          q.text,
          answerId ? copy.answers[answerId] : "-",
        ];
      })
    );

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: sanitizeTableRows([[pdf.colNum, pdf.colCategory, pdf.colQuestion, pdf.colAnswer]]),
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: BRAND.navy,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 7.5, textColor: BRAND.navy, valign: "top" },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 32 },
        2: { cellWidth: 88 },
        3: { cellWidth: 28 },
      },
      alternateRowStyles: { fillColor: BRAND.light },
      styles: { cellPadding: 2.5, overflow: "linebreak", lineColor: BRAND.border, lineWidth: 0.1 },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const rowIndex = data.row.index;
          const q = questions[rowIndex];
          const answerId = answers[q?.id];
          data.cell.styles.textColor = answerColor(answerId);
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    y = tableEndY(doc, y) + 10;

    y = ensureSpace(doc, y, 40);
    doc.setFillColor(...BRAND.navy);
    doc.roundedRect(MARGIN, y, CONTENT_W, 36, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BRAND.green);
    drawLine(doc, pdf.nextStepsTitle, MARGIN + 6, y + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(220, 228, 240);
    y = drawWrapped(doc, pdf.nextStepsBody, MARGIN + 6, y + 14, CONTENT_W - 12, 9, "normal", 4);
    doc.setFontSize(8);
    doc.setTextColor(...BRAND.green);
    drawLine(doc, pdf.contactLine, MARGIN + 6, y + 4);

    y += 12;
    doc.setFontSize(7.5);
    doc.setTextColor(...BRAND.muted);
    drawWrapped(doc, pdf.disclaimer, MARGIN, y, CONTENT_W, 7.5);

    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      drawPageFooter(doc, p, locale);
    }

    const date = new Date().toISOString().slice(0, 10);
    doc.save(`${pdf.filename}-${date}.pdf`);
    return true;
  } catch {
    return false;
  }
}