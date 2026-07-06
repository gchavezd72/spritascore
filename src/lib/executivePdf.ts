import { EXECUTIVE_QUESTIONS } from "@/data/executiveSoftwareRiskScore";
import type { ExecutiveScoreResult } from "@/lib/calculateExecutiveRiskScore";
import type { ExecutiveAnswerId } from "@/data/executiveSoftwareRiskScore";

export function downloadExecutiveScorePdf(
  answers: Record<string, ExecutiveAnswerId>,
  result: ExecutiveScoreResult
) {
  const answerLabel = (id?: ExecutiveAnswerId) =>
    id ? id.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

  const rows = EXECUTIVE_QUESTIONS.map(
    (q, i) =>
      `<tr><td>${i + 1}</td><td>${q.categoryLabel}</td><td>${q.text}</td><td>${answerLabel(answers[q.id])}</td></tr>`
  ).join("");

  const recs = result.recommendations
    .map((r) => `<li><strong>${r.category.replace(/-/g, " ")}</strong> — ${r.text}</li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Executive Software Risk Score — SpritaScore</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #12213b; margin: 40px; line-height: 1.5; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .sub { color: #5b6472; margin-bottom: 24px; }
    .score { font-size: 32px; font-weight: 700; color: #1fbf6c; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px; }
    th, td { border: 1px solid #e6e9ef; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f7f8fa; }
    .disclaimer { margin-top: 32px; font-size: 11px; color: #5b6472; }
    .brand { margin-top: 16px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Executive Software Risk Score</h1>
  <p class="sub">SpritaScore by Sprita iT · ${new Date().toLocaleDateString("en-US")}</p>
  <p class="score">Risk Exposure Score: ${result.riskExposureScore} / 1000</p>
  <p><strong>Executive Maturity:</strong> ${result.levelLabel} (${result.exposureLabel} exposure)</p>
  <p><strong>Maturity points:</strong> ${result.rawMaturityPoints} / 15 (${result.maturityPercent}%)</p>
  <p>${result.interpretation}</p>
  <h2>Top gap areas</h2>
  <ul>${recs || "<li>No critical gaps identified in this self-assessment.</li>"}</ul>
  <h2>Questionnaire responses</h2>
  <table>
    <thead><tr><th>#</th><th>Category</th><th>Question</th><th>Answer</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="disclaimer">This score is an executive self-assessment and prioritization aid. It does not constitute legal advice, audit certification, or proof of compliance.</p>
  <p class="brand">spritascore.com · sprita-it.com</p>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}