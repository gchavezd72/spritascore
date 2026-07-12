import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { pdfText } from "@/lib/pdfText";
import { getEuAiActCopy } from "@/i18n/euAiAct";
import {
  REGULATORY_ENGINE_VERSION,
  REGULATORY_CUTOFF,
  type ReadinessLevel,
} from "@/data/euAiAct";
import type { EuAiActResult, EuAiActAnswers } from "@/lib/calculateEuAiAct";
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

const LEVEL_COLOR: Record<ReadinessLevel, [number, number, number]> = {
  critical: BRAND.risk.critical,
  initial: BRAND.risk.critical,
  developing: BRAND.risk.high,
  managed: BRAND.risk.moderate,
  advanced: BRAND.risk.low,
  "review-ready": BRAND.risk.low,
};

function tableEndY(doc: JsDoc, fallback: number): number {
  return doc.lastAutoTable?.finalY ?? fallback;
}

function localeDate(locale: Locale, iso?: string) {
  const tag = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-ES";
  const d = iso ? new Date(iso + "T00:00:00") : new Date();
  return pdfText(d.toLocaleDateString(tag, { year: "numeric", month: "long", day: "numeric" }));
}

function hash4(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);
  return (h >>> 0).toString(36).toUpperCase().slice(0, 6).padStart(6, "0");
}

function ensureSpace(doc: JsDoc, y: number, needed: number): number {
  if (y + needed > PAGE_H - 22) {
    doc.addPage();
    return 24;
  }
  return y;
}

function drawLine(doc: JsDoc, text: string, x: number, y: number): void {
  doc.text(pdfText(text), x, y);
}

function drawPageFooter(doc: JsDoc, pageNum: number, pageLabel: string) {
  doc.setDrawColor(...BRAND.border);
  doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  drawLine(doc, "SpritaScore | Sprita iT", MARGIN, PAGE_H - 10);
  drawLine(doc, `${pageLabel} ${pageNum}`, PAGE_W - MARGIN, PAGE_H - 10);
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
  const lines = doc.splitTextToSize(pdfText(text), width) as string[];
  for (const lineText of lines) {
    y = ensureSpace(doc, y, line + 2);
    drawLine(doc, lineText, x, y);
    y += line;
  }
  return y;
}

function sanitizeRows(rows: string[][]): string[][] {
  return rows.map((row) => row.map((cell) => pdfText(cell)));
}

export function downloadEuAiActPdf(
  locale: Locale,
  answers: EuAiActAnswers,
  result: EuAiActResult
): boolean {
  try {
    const copy = getEuAiActCopy(locale);
    const pdf = copy.pdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" }) as JsDoc;

    const reportId = `SAI-${new Date().toISOString().slice(0, 10)}-${hash4(JSON.stringify(answers))}`;
    const verdict = copy.verdicts[result.verdict];

    // Cover band
    doc.setFillColor(...BRAND.navy);
    doc.rect(0, 0, PAGE_W, 54, "F");
    doc.setFillColor(...BRAND.green);
    doc.rect(0, 54, PAGE_W, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    drawLine(doc, "Sprita", MARGIN, 20);
    doc.setTextColor(...BRAND.green);
    drawLine(doc, "Score", MARGIN + 28, 20);
    doc.setFontSize(9);
    doc.setTextColor(200, 210, 225);
    drawLine(doc, "by Sprita iT", MARGIN, 27);
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    drawLine(doc, copy.meta.h1, MARGIN, 39);
    doc.setFontSize(8.5);
    doc.setTextColor(200, 210, 225);
    drawLine(doc, `${pdf.subtitle} | ${localeDate(locale)}`, MARGIN, 46);
    drawLine(
      doc,
      `${pdf.reportId}: ${reportId}  |  ${pdf.engineVersion}: ${REGULATORY_ENGINE_VERSION}`,
      MARGIN,
      51
    );

    let y = 64;

    // Classification banner
    doc.setFillColor(...BRAND.light);
    doc.roundedRect(MARGIN, y, CONTENT_W, 34, 3, 3, "F");
    doc.setDrawColor(...BRAND.border);
    doc.roundedRect(MARGIN, y, CONTENT_W, 34, 3, 3, "S");
    const bannerColor = result.criticalStop ? BRAND.risk.critical : BRAND.navy;
    doc.setFillColor(...bannerColor);
    doc.rect(MARGIN, y, 3, 34, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...BRAND.muted);
    drawLine(doc, pdf.classification.toUpperCase(), MARGIN + 8, y + 8);
    doc.setFontSize(14);
    doc.setTextColor(...BRAND.navy);
    y = drawWrapped(doc, verdict.label, MARGIN + 8, y + 15, CONTENT_W - 14, 13, "bold", 5.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.muted);
    drawLine(
      doc,
      `${pdf.confidence}: ${copy.confidence[result.confidence].label}  |  ${pdf.assessmentDate}: ${localeDate(locale, REGULATORY_CUTOFF)}`,
      MARGIN + 8,
      y + 2
    );
    y += 12;

    // Executive summary
    y = drawSectionTitle(doc, pdf.executiveSummary, y);
    y = drawWrapped(doc, verdict.description, MARGIN, y, CONTENT_W, 10);
    if (result.roles.length > 0) {
      y += 2;
      y = drawWrapped(
        doc,
        `${pdf.detectedRoles}: ${result.roles.map((r) => copy.roles[r]).join(", ")}`,
        MARGIN,
        y,
        CONTENT_W,
        9,
        "bold"
      );
    }

    // Scope & limitations
    y += 3;
    y = drawSectionTitle(doc, pdf.scopeLimitations, y);
    y = drawWrapped(doc, pdf.scopeLimitationsBody, MARGIN, y, CONTENT_W, 9);

    // Applicable obligations
    y += 3;
    y = drawSectionTitle(doc, pdf.applicableObligations, y);
    if (result.obligations.length === 0) {
      y = drawWrapped(doc, copy.ui.noObligations, MARGIN, y, CONTENT_W, 9);
    } else {
      autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN },
        head: sanitizeRows([[pdf.colObligation, pdf.colSource, pdf.colDate, pdf.colStatus]]),
        body: sanitizeRows(
          result.obligations.map((o) => [
            copy.obligations[o.id],
            o.legalSource,
            localeDate(locale, o.effectiveFrom),
            copy.obligationStatus[o.status],
          ])
        ),
        theme: "grid",
        headStyles: { fillColor: BRAND.navy, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, textColor: BRAND.navy },
        alternateRowStyles: { fillColor: BRAND.light },
        columnStyles: { 0: { cellWidth: 78 }, 1: { cellWidth: 40 }, 3: { cellWidth: 34 } },
        styles: { cellPadding: 2.5, lineColor: BRAND.border, lineWidth: 0.1, overflow: "linebreak" },
      });
      y = tableEndY(doc, y) + 8;
    }

    // Readiness (skip when critical stop)
    if (!result.criticalStop && result.readinessScore != null && result.readinessLevel) {
      y = ensureSpace(doc, y, 40);
      y = drawSectionTitle(doc, pdf.readiness, y);
      const color = LEVEL_COLOR[result.readinessLevel];
      doc.setFillColor(...color);
      doc.roundedRect(MARGIN, y, 40, 24, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      drawLine(doc, `${result.readinessScore}`, MARGIN + 10, y + 13);
      doc.setFontSize(7);
      drawLine(doc, "/ 100", MARGIN + 10, y + 19);
      doc.setTextColor(...BRAND.navy);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      drawLine(doc, copy.levels[result.readinessLevel].label, MARGIN + 46, y + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...BRAND.muted);
      drawLine(
        doc,
        `${pdf.evidenceCoverage}: ${result.evidenceCoverage}% (${copy.evidenceBands[result.evidenceBand]})`,
        MARGIN + 46,
        y + 15
      );
      drawLine(doc, copy.levels[result.readinessLevel].interpretation, MARGIN + 46, y + 21);
      y += 30;

      if (result.cappedAt != null) {
        doc.setFontSize(8.5);
        doc.setTextColor(...BRAND.risk.high);
        for (const r of result.capReasons) {
          y = drawWrapped(doc, `> ${copy.capReasons[r]}`, MARGIN, y, CONTENT_W, 8.5, "normal", 4);
        }
        doc.setTextColor(...BRAND.navy);
        y += 2;
      }

      // Domain results table
      y = drawSectionTitle(doc, pdf.domainResults, y);
      autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN },
        head: sanitizeRows([[pdf.colDomain, pdf.colScore]]),
        body: sanitizeRows(
          result.domainScores.map((d) => [
            copy.domains[d.domain],
            d.applicable && d.score != null ? `${d.score} / 100` : pdf.notAssessed,
          ])
        ),
        theme: "grid",
        headStyles: { fillColor: BRAND.navy, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, textColor: BRAND.navy },
        alternateRowStyles: { fillColor: BRAND.light },
        columnStyles: { 1: { cellWidth: 40 } },
        styles: { cellPadding: 2.5, lineColor: BRAND.border, lineWidth: 0.1 },
      });
      y = tableEndY(doc, y) + 8;
    }

    // Remediation plan / critical gaps
    if (result.gaps.length > 0) {
      y = ensureSpace(doc, y, 30);
      y = drawSectionTitle(doc, pdf.remediationPlan, y);
      autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN },
        head: sanitizeRows([[pdf.colPriority, pdf.colGap, pdf.colOwner]]),
        body: sanitizeRows(
          result.gaps.map((g) => [
            g.priority,
            copy.gaps[g.key],
            g.domain ? copy.domainOwners[g.domain] : "—",
          ])
        ),
        theme: "grid",
        headStyles: { fillColor: BRAND.navy, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
        bodyStyles: { fontSize: 8, textColor: BRAND.navy, valign: "top" },
        columnStyles: { 0: { cellWidth: 14 }, 1: { cellWidth: 118 }, 2: { cellWidth: 46 } },
        alternateRowStyles: { fillColor: BRAND.light },
        styles: { cellPadding: 2.5, lineColor: BRAND.border, lineWidth: 0.1, overflow: "linebreak" },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 0) {
            const p = result.gaps[data.row.index]?.priority;
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.textColor =
              p === "P0" ? BRAND.risk.critical : p === "P1" ? BRAND.risk.high : p === "P2" ? BRAND.risk.moderate : BRAND.muted;
          }
        },
      });
      y = tableEndY(doc, y) + 8;
    }

    // Complementary assessments + warnings
    if (result.complementary.length > 0) {
      y = ensureSpace(doc, y, 20);
      y = drawSectionTitle(doc, pdf.complementary, y);
      for (const c of result.complementary) {
        y = ensureSpace(doc, y, 7);
        doc.setFillColor(...BRAND.green);
        doc.circle(MARGIN + 1.5, y - 1.2, 0.8, "F");
        y = drawWrapped(doc, copy.complementary[c], MARGIN + 5, y, CONTENT_W - 5, 9, "normal", 4.2);
        y += 1;
      }
    }
    if (result.warnings.length > 0) {
      y += 2;
      y = ensureSpace(doc, y, 20);
      y = drawSectionTitle(doc, pdf.warnings, y);
      for (const w of [...new Set(result.warnings)]) {
        y = ensureSpace(doc, y, 7);
        doc.setFillColor(...BRAND.risk.high);
        doc.circle(MARGIN + 1.5, y - 1.2, 0.8, "F");
        y = drawWrapped(doc, copy.warnings[w], MARGIN + 5, y, CONTENT_W - 5, 9, "normal", 4.2);
        y += 1;
      }
    }

    // Next steps box
    y = ensureSpace(doc, y, 40);
    y += 2;
    doc.setFillColor(...BRAND.navy);
    doc.roundedRect(MARGIN, y, CONTENT_W, 34, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BRAND.green);
    drawLine(doc, pdf.nextStepsTitle, MARGIN + 6, y + 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(220, 228, 240);
    y = drawWrapped(doc, pdf.nextStepsBody, MARGIN + 6, y + 14, CONTENT_W - 12, 9, "normal", 4);
    doc.setFontSize(8);
    doc.setTextColor(...BRAND.green);
    drawLine(doc, pdf.contactLine, MARGIN + 6, y + 3);
    y += 12;

    // Disclaimer
    y = ensureSpace(doc, y, 20);
    doc.setFontSize(7.5);
    doc.setTextColor(...BRAND.muted);
    drawWrapped(doc, pdf.disclaimer, MARGIN, y, CONTENT_W, 7.5, "normal", 3.6);

    // Footers
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      drawPageFooter(doc, p, pdf.page);
    }

    doc.save(`${pdf.filename}-${new Date().toISOString().slice(0, 10)}.pdf`);
    return true;
  } catch {
    return false;
  }
}
