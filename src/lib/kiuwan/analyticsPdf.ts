import { jsPDF } from "jspdf";
import { pdfText } from "@/lib/pdfText";
import {
  applicationFunnel,
  executiveSnapshot,
  formatEffort,
  qualityFindings,
  rankComponents,
  rankVulnerabilities,
} from "./aggregate";
import { isIdentifiableComponent, priorityLabel, priorityRank } from "./normalize";
import { priorityTone, remediateComponent, remediateFinding } from "./remediation";
import type { AnalysisModel, Finding, RankedComponentRisk, RankedVulnerability } from "./types";

const NAVY: [number, number, number] = [18, 33, 59];
const GREEN: [number, number, number] = [47, 154, 59];
const MUTED: [number, number, number] = [91, 100, 114];
const LINE: [number, number, number] = [220, 225, 232];
const PAPER: [number, number, number] = [247, 248, 250];
const WHITE: [number, number, number] = [255, 255, 255];

const PAGE_W = 297;
const PAGE_H = 210;
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 24;
const FOOTER_Y = PAGE_H - 10;
const GAP = 4;
const COL_GAP = 5;

type Doc = jsPDF & { internal: { getNumberOfPages: () => number } };

export interface AnalyticsPdfInput {
  model: AnalysisModel;
  findings: Finding[];
  logoDataUrl?: string | null;
}

function draw(doc: Doc, text: string, x: number, y: number, align?: "left" | "right" | "center") {
  const safe = pdfText(text);
  if (align === "right" || align === "center") {
    doc.text(safe, x, y, { align });
    return;
  }
  doc.text(safe, x, y);
}

function wrap(doc: Doc, text: string, width: number): string[] {
  return doc.splitTextToSize(pdfText(text), width) as string[];
}

function ensure(doc: Doc, y: number, needed: number, logo: string | null): number {
  if (y + needed <= PAGE_H - 16) return y;
  doc.addPage();
  drawChrome(doc, logo);
  return HEADER_H + 8;
}

function drawChrome(doc: Doc, logo: string | null) {
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");
  doc.setFillColor(...GREEN);
  doc.rect(0, HEADER_H, PAGE_W, 1.2, "F");

  if (logo) {
    try {
      const logoH = 12.5;
      const logoW = logoH * (500 / 162);
      const logoY = (HEADER_H - logoH) / 2;
      doc.addImage(logo, "PNG", MARGIN, logoY, logoW, logoH, undefined, "FAST");
    } catch {
      drawWordmark(doc);
    }
  } else {
    drawWordmark(doc);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...WHITE);
  draw(doc, "Informe Top 10", PAGE_W - MARGIN, 10, "right");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 214, 228);
  draw(doc, "Sprita iT Analytics  ·  confidencial", PAGE_W - MARGIN, 16, "right");
}

function drawWordmark(doc: Doc) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  draw(doc, "Sprita iT", MARGIN, 14);
  doc.setFillColor(...GREEN);
  doc.circle(MARGIN + 28.6, 9.6, 0.9, "F");
}

function drawFooter(doc: Doc) {
  const pages = doc.internal.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    draw(doc, "Sprita iT  ·  sprita-it.com  ·  Hallazgos priorizados, no un inventario completo.", MARGIN, FOOTER_Y);
    draw(doc, `${page} / ${pages}`, PAGE_W - MARGIN, FOOTER_Y, "right");
  }
}

function startSection(doc: Doc, logo: string | null, title: string, subtitle: string): number {
  doc.addPage();
  drawChrome(doc, logo);
  return sectionBanner(doc, HEADER_H + 8, title, subtitle, logo);
}

function sectionBanner(doc: Doc, y: number, title: string, subtitle: string, logo: string | null): number {
  y = ensure(doc, y, 18, logo);
  doc.setFillColor(...NAVY);
  doc.roundedRect(MARGIN, y, CONTENT_W, 12, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...WHITE);
  draw(doc, title, MARGIN + 4, y + 5.2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 210, 190);
  draw(doc, subtitle, MARGIN + 4, y + 9.6);
  return y + 16;
}

function drawTwoColumns(
  doc: Doc,
  y: number,
  logo: string | null,
  leftTitle: string,
  leftLines: string[],
  rightTitle: string,
  rightLines: string[],
  tone: [number, number, number],
  rank: number
): number {
  const leftW = (CONTENT_W - COL_GAP) * 0.46;
  const rightW = (CONTENT_W - COL_GAP) * 0.54;
  const pad = 4;
  const usableLeft = leftW - pad * 2 - 8;
  const usableRight = rightW - pad * 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const leftBody = wrap(doc, leftLines.join("\n"), usableLeft);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const rightBody = wrap(doc, rightLines.join("\n"), usableRight);
  const lineH = 3.6;
  const headerBlock = 10;
  const height = Math.max(36, headerBlock + Math.max(leftBody.length, rightBody.length) * lineH + 8);

  y = ensure(doc, y, height + 2, logo);

  const leftX = MARGIN;
  const rightX = MARGIN + leftW + COL_GAP;

  doc.setFillColor(...PAPER);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.25);
  doc.roundedRect(leftX, y, leftW, height, 1.5, 1.5, "FD");
  doc.setFillColor(244, 250, 246);
  doc.roundedRect(rightX, y, rightW, height, 1.5, 1.5, "FD");

  doc.setFillColor(...tone);
  doc.roundedRect(leftX, y, 8, height, 1.5, 1.5, "F");
  doc.setFillColor(...tone);
  doc.rect(leftX + 4, y, 4, height, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  draw(doc, String(rank).padStart(2, "0"), leftX + 4, y + 8, "center");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  const titleLines = wrap(doc, leftTitle, usableLeft);
  let ly = y + 6;
  for (const line of titleLines.slice(0, 2)) {
    draw(doc, line, leftX + pad + 8, ly);
    ly += 4;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  for (const line of leftBody) {
    draw(doc, line, leftX + pad + 8, ly);
    ly += lineH;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GREEN);
  draw(doc, rightTitle.toUpperCase(), rightX + pad, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  let ry = y + 11;
  for (const line of rightBody) {
    if (ry > y + height - 4) break;
    draw(doc, line, rightX + pad, ry);
    ry += lineH;
  }

  return y + height + GAP;
}

export async function downloadAnalyticsBriefingPdf(input: AnalyticsPdfInput): Promise<boolean> {
  try {
    const logo = input.logoDataUrl ?? (await loadLogoDataUrl());
    const doc = buildAnalyticsPdf(input, logo);
    const app = pdfText(input.model.application.name || "analisis");
    const filename = `Sprita-iT-top10-hallazgos-${app}-${uniqueStamp()}.pdf`.replace(/[^\w.\-]+/g, "_");
    doc.save(filename);
    return true;
  } catch {
    return false;
  }
}

export function buildAnalyticsPdf(input: AnalyticsPdfInput, logo: string | null): Doc {
  const { model, findings } = input;
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" }) as Doc;
  const snapshot = executiveSnapshot(model, findings);
  const appTop = mergeByRule(applicationFunnel(findings).top10).slice(0, 10);
  const securityNames = new Set(appTop.map((item) => item.rule.toLowerCase()));
  const qualityTop = mergeByRule(rankVulnerabilities(qualityFindings(findings)))
    .filter((item) => !securityNames.has(item.rule.toLowerCase()))
    .slice(0, 10);
  const componentTop = briefingComponents(model);
  const dateStr = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

  drawChrome(doc, logo);
  let y = HEADER_H + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...NAVY);
  draw(doc, "Top 10 defectos por analisis", MARGIN, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  draw(
    doc,
    `${model.application.name ?? "Aplicacion"}  ·  ${model.application.analyzedAt ?? dateStr}  ·  ${dateStr}`,
    MARGIN,
    y
  );
  y += 8;

  const boxW = (CONTENT_W - 8) / 3;
  const boxes: Array<{ label: string; value: string; hint: string }> = [
    {
      label: "Postura",
      value: `${snapshot.score} · ${snapshot.label}`,
      hint: snapshot.effortLabel ? `Esfuerzo visible: ${snapshot.effortLabel}` : "Sin esfuerzo informado",
    },
    {
      label: "Seguridad de aplicacion",
      value: `${appTop.length} criticas`,
      hint: snapshot.securityFile.present
        ? snapshot.securityFile.empty
          ? "INSIGHT_SECURITY presente y sin CVEs"
          : `${snapshot.componentCves} CVE de terceros`
        : "Falta archivo de seguridad SCA",
    },
    {
      label: "Alcance de este PDF",
      value: "Solo Top 10",
      hint: "No incluye el inventario completo de hallazgos.",
    },
  ];
  boxes.forEach((box, index) => {
    const x = MARGIN + index * (boxW + 4);
    doc.setFillColor(...PAPER);
    doc.setDrawColor(...LINE);
    doc.roundedRect(x, y, boxW, 24, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...GREEN);
    draw(doc, box.label.toUpperCase(), x + 4, y + 6);
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    draw(doc, box.value, x + 4, y + 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    const hints = wrap(doc, box.hint, boxW - 8);
    draw(doc, hints[0] ?? "", x + 4, y + 19);
  });
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  const intro = wrap(
    doc,
    "Cada seccion lista como maximo diez defectos, ordenados por severidad y volumen. A la derecha de cada hallazgo hay un ejemplo de remediacion Sprita iT para orientar al equipo de desarrollo. Este documento no sustituye el inventario completo ni una auditoria de codigo.",
    CONTENT_W
  );
  intro.forEach((line) => {
    draw(doc, line, MARGIN, y);
    y += 4.2;
  });
  y += 4;
  const toc = [
    ["1. Seguridad de aplicacion", `${appTop.length} defectos`, "Vulnerabilidades SAST con ejemplo de remediacion"],
    ["2. Componentes de terceros", `${componentTop.length} defectos`, "SCA, licencias y artefactos sin identidad"],
    ["3. Calidad de codigo", `${qualityTop.length} defectos`, "Reglas de calidad priorizadas por severidad"],
  ];
  toc.forEach((row, index) => {
    const x = MARGIN;
    const rowY = y + index * 16;
    doc.setFillColor(...PAPER);
    doc.setDrawColor(...LINE);
    doc.roundedRect(x, rowY, CONTENT_W, 14, 1.5, 1.5, "FD");
    doc.setFillColor(...GREEN);
    doc.roundedRect(x, rowY, 3, 14, 1.5, 1.5, "F");
    doc.rect(x + 1.5, rowY, 1.5, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    draw(doc, row[0], x + 8, rowY + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    draw(doc, row[2], x + 8, rowY + 11);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...GREEN);
    draw(doc, row[1], PAGE_W - MARGIN - 4, rowY + 8, "right");
  });
  y += toc.length * 16 + 6;
  doc.setFillColor(...GREEN);
  doc.roundedRect(MARGIN, y, CONTENT_W, 16, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...WHITE);
  draw(doc, "Como leer cada ficha", MARGIN + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  draw(
    doc,
    "Izquierda: el defecto. Derecha: ejemplo de remediacion Sprita iT. Este PDF no sustituye el inventario completo.",
    MARGIN + 4,
    y + 12
  );

  y = startSection(
    doc,
    logo,
    "1. Seguridad de aplicacion",
    "Las 10 vulnerabilidades SAST mas criticas (CSV Vulnerabilities / SARIF)"
  );
  if (appTop.length === 0) {
    y = emptyState(doc, y, "No hay vulnerabilidades de aplicacion en la seleccion actual.", logo);
  } else {
    for (const item of appTop) {
      y = drawFindingRow(doc, y, logo, item);
    }
  }

  y = startSection(
    doc,
    logo,
    "2. Componentes de terceros",
    "Los 10 componentes SCA/SBOM mas criticos (Insight + licencias + obsolescencia)"
  );
  if (componentTop.length === 0) {
    y = emptyState(doc, y, "No hay componentes de terceros en el analisis.", logo);
  } else {
    for (const item of componentTop) {
      y = drawComponentRow(doc, y, logo, item);
    }
  }

  y = startSection(
    doc,
    logo,
    "3. Calidad de codigo",
    "Los 10 defectos de calidad mas importantes (DefectsTable / metricas)"
  );
  if (qualityTop.length === 0) {
    y = emptyState(doc, y, "No hay defectos de calidad en la seleccion actual.", logo);
  } else {
    for (const item of qualityTop) {
      y = drawFindingRow(doc, y, logo, item);
    }
  }

  drawFooter(doc);
  return doc;
}

function emptyState(doc: Doc, y: number, message: string, logo: string | null): number {
  y = ensure(doc, y, 16, logo);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  draw(doc, message, MARGIN, y);
  return y + 10;
}

export function uniqueStamp(now = new Date()): string {
  const pad = (value: number, width = 2) => String(value).padStart(width, "0");
  const tenths = Math.floor(now.getMilliseconds() / 100);
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.${tenths}`;
}

function drawFindingRow(doc: Doc, y: number, logo: string | null, item: RankedVulnerability): number {
  const rem = remediateFinding({ ...item, language: item.languages[0] });
  const leftLines = [
    `${priorityLabel(item.priority)}  ·  ${plural(item.count, "hallazgo")}  ·  ${plural(item.files, "archivo")}  ·  ${formatEffort(item.effortMinutes)}`,
    item.cwe.length ? item.cwe.join(", ") : "Sin CWE",
    item.vulnerabilityType || item.characteristic || "",
    item.languages.join(", "),
    item.ruleCode,
  ].filter(Boolean);
  const rightLines = [`Norma: ${rem.standard}`, rem.summary, "", rem.example, "", `Verificar: ${rem.verify}`];
  return drawTwoColumns(
    doc,
    y,
    logo,
    item.rule,
    leftLines,
    rem.title,
    rightLines,
    priorityTone(item.priority),
    item.rank
  );
}

function mergeByRule(items: RankedVulnerability[]): RankedVulnerability[] {
  const map = new Map<string, RankedVulnerability>();
  for (const item of items) {
    const key = item.rule.trim().toLowerCase();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...item, languages: [...item.languages], cwe: [...item.cwe] });
      continue;
    }
    existing.count += item.count;
    existing.files += item.files;
    existing.effortMinutes += item.effortMinutes;
    existing.languages = uniqueStrings([...existing.languages, ...item.languages]);
    existing.cwe = uniqueStrings([...existing.cwe, ...item.cwe]);
    if (priorityRank(item.priority) > priorityRank(existing.priority)) {
      existing.priority = item.priority;
      existing.ruleCode = item.ruleCode;
    }
  }
  return [...map.values()].map((item, index) => ({ ...item, rank: index + 1 }));
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function isNoiseAsset(name: string): boolean {
  return /\.(bin|json|ttf|otf|frag|png|jpg|jpeg|webp|txt|z)$/i.test(name);
}

function briefingComponents(model: AnalysisModel): RankedComponentRisk[] {
  const ranked = rankComponents(model);
  const libraries = ranked.filter(
    (item) =>
      ((isIdentifiableComponent(item.name) && !isNoiseAsset(item.name) && !isWeakIdentity(item.name)) ||
        item.licenses.length > 0 ||
        item.vulnerabilityCount > 0 ||
        (item.cvssMax ?? 0) > 0)
  );
  const remainder = ranked.filter(
    (item) => !libraries.some((other) => other.name === item.name && other.version === item.version)
  );
  const selected: RankedComponentRisk[] = libraries.slice(0, remainder.length > 0 ? 9 : 10);
  if (remainder.length > 0) {
    selected.push({
      rank: 0,
      name: `${remainder.length} artefactos de build sin identidad`,
      version: "n/a",
      securityRisk: "Unknown",
      licenseRisk: "Unknown",
      obsolescenceRisk: "Unknown",
      vulnerabilityCount: 0,
      cves: [],
      cvssMax: null,
      licenses: [],
    });
  }
  return selected.slice(0, 10).map((item, index) => ({ ...item, rank: index + 1 }));
}

function isWeakIdentity(name: string): boolean {
  return (
    /^[a-z0-9]$/i.test(name) ||
    /^(full|libs|base|classes|data|res|bin|core)$/i.test(name) ||
    /isolate_snapshot|kernel_blob|notices\.z|vm_snapshot|gradle-wrapper/i.test(name)
  );
}

function plural(count: number, singular: string): string {
  const word = count === 1 ? singular : `${singular}s`;
  return `${count} ${word}`;
}

function drawComponentRow(doc: Doc, y: number, logo: string | null, item: RankedComponentRisk): number {
  const rem = remediateComponent(item);
  const display = item.name;
  const leftLines = [
    `Version: ${item.version || "sin version"}`,
    `Seguridad: ${item.securityRisk}  ·  Licencia: ${item.licenseRisk}  ·  Obsolescencia: ${item.obsolescenceRisk}`,
    item.vulnerabilityCount > 0 ? `${item.vulnerabilityCount} CVE` : "Sin CVE informado",
    item.licenses.length ? item.licenses.join(", ") : "Licencia no declarada",
  ];
  const rightLines = [`Norma: ${rem.standard}`, rem.summary, "", rem.example, "", `Verificar: ${rem.verify}`];
  return drawTwoColumns(doc, y, logo, display, leftLines, rem.title, rightLines, NAVY, item.rank);
}

export async function loadLogoDataUrl(): Promise<string | null> {
  if (typeof fetch === "undefined") return null;
  try {
    const response = await fetch("/logos/sprita-it-light.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch {
    return null;
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function logoFileToDataUrl(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:image/png;base64,${btoa(binary)}`;
}
