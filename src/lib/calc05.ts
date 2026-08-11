// ─────────────────────────────────────────────────────────────────────────────
// SpritaScore — Calculadora 05: Custo de Vulnerabilidade por Setor
// Lógica de cálculo pura. Sin dependencias de framework.
// ─────────────────────────────────────────────────────────────────────────────

export type Sector =
  | "saude"
  | "tech"
  | "fintech"
  | "seguros"
  | "varejo"
  | "industria"
  | "publico"
  | "outro";

export type Currency = "BRL" | "USD";

export interface Calc05Input {
  sector: Sector;
  vol: 1 | 2 | 3 | 4;       // rango de registros
  ia: 1 | 2 | 3;             // uso de IA generativa
  sca: 1 | 2 | 3;            // análisis de dependencias
  mat: 1 | 2 | 3 | 4;        // madurez de seguridad
  hist: 1 | 2 | 3;           // historial de incidentes
  currency: Currency;
}

export interface Calc05Result {
  score: number;              // 0–1000
  impactBRL: number;          // R$ raw
  impactUSD: number;          // USD raw
  classification: "low" | "medium" | "high" | "critical";
  bullets: string[];          // claves i18n de bullets (máx. 3)
  sector: Sector;
  currency: Currency;
}

// ── TIPO DE CAMBIO ────────────────────────────────────────────────────────────
// Actualizar periodicamente. Alternativa: fetch desde API en build time.
const BRL_TO_USD = 0.18; // ~5.55 BRL/USD agosto 2026

// ── TABLAS DE LOOKUP ──────────────────────────────────────────────────────────

/** Costo base por registro expuesto — en BRL */
const BASE_COST_BRL: Record<Sector, number> = {
  saude:     620,
  tech:      480,
  fintech:   890,
  seguros:   640,
  varejo:    320,
  industria: 280,
  publico:   510,
  outro:     380,
};

/** Multiplicador regulatorio LGPD/ANPD por sector */
const LGPD_MULT: Record<Sector, number> = {
  saude:     1.6,
  tech:      1.3,
  fintech:   1.7,
  seguros:   1.4,
  varejo:    1.2,
  industria: 1.1,
  publico:   1.5,
  outro:     1.2,
};

/** Cap máximo de impacto mostrado — en BRL */
const CAP_BRL: Record<Sector, number> = {
  saude:     50_000_000,
  fintech:   80_000_000,
  tech:      35_000_000,
  seguros:   45_000_000,
  varejo:    25_000_000,
  publico:   30_000_000,
  industria: 20_000_000,
  outro:     20_000_000,
};

/** Volumen representativo del rango + multiplicador */
const VOL_DATA: Record<number, { est: number; mult: number }> = {
  1: { est: 5_000,     mult: 1.0 },
  2: { est: 55_000,    mult: 1.4 },
  3: { est: 550_000,   mult: 1.8 },
  4: { est: 1_500_000, mult: 2.4 },
};

const IA_MULT:   Record<number, number> = { 1: 1.0, 2: 1.3, 3: 1.6 };
const SCA_MULT:  Record<number, number> = { 1: 1.0, 2: 1.3, 3: 1.5 };
const MAT_MULT:  Record<number, number> = { 1: 1.6, 2: 1.3, 3: 1.1, 4: 0.9 };
const HIST_MULT: Record<number, number> = { 1: 1.0, 2: 1.4, 3: 1.25 };

// ── CLASIFICACIÓN ─────────────────────────────────────────────────────────────
function classify(score: number): Calc05Result["classification"] {
  if (score >= 800) return "low";
  if (score >= 550) return "medium";
  if (score >= 300) return "high";
  return "critical";
}

// ── BULLETS — claves i18n ─────────────────────────────────────────────────────
// Las claves se resuelven en el componente con t("bullets.<key>")
interface BulletCandidate {
  priority: number;
  key: string;
  condition: boolean;
}

function getBulletKeys(input: Calc05Input): string[] {
  const { sector, ia, sca, mat, hist, vol } = input;

  const candidates: BulletCandidate[] = [
    { priority: 1, key: "ia_prod",    condition: ia === 3 },
    { priority: 1, key: "incident",   condition: hist === 2 },
    { priority: 2, key: "no_sca",     condition: sca === 3 },
    { priority: 2, key: "no_insight", condition: hist === 3 },
    { priority: 2, key: "high_vol",   condition: vol === 4 },
    { priority: 3, key: "basic_mat",  condition: mat === 1 },
    { priority: 3, key: "ia_dev",     condition: ia === 2 },
    { priority: 3, key: "reg_sector", condition: sector === "fintech" || sector === "saude" },
    { priority: 9, key: "generic",    condition: true }, // fallback siempre true
  ];

  return candidates
    .filter((c) => c.condition)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)
    .map((c) => c.key);
}

// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────────────────────
export function calcular(input: Calc05Input): Calc05Result {
  const { sector, vol, ia, sca, mat, hist, currency } = input;

  const base    = BASE_COST_BRL[sector];
  const volData = VOL_DATA[vol];
  const lgpd    = LGPD_MULT[sector];
  const cap     = CAP_BRL[sector];

  const rawBRL =
    base *
    volData.est *
    volData.mult *
    lgpd *
    IA_MULT[ia] *
    SCA_MULT[sca] *
    MAT_MULT[mat] *
    HIST_MULT[hist];

  const impactBRL = Math.min(rawBRL, cap);
  const impactUSD = impactBRL * BRL_TO_USD;

  // Score: 1000 = sin riesgo, 0 = máximo riesgo
  const score = Math.max(0, 1000 - Math.round((impactBRL / cap) * 1000));

  return {
    score,
    impactBRL,
    impactUSD,
    classification: classify(score),
    bullets: getBulletKeys(input),
    sector,
    currency,
  };
}

// ── FORMATO DE NÚMERO ─────────────────────────────────────────────────────────
export function formatImpact(result: Calc05Result): string {
  if (result.currency === "BRL") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(result.impactBRL);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(result.impactUSD);
}

// ── BUCKET DE ANALYTICS (nunca exponer número exacto) ─────────────────────────
export function impactBucket(brl: number): string {
  if (brl < 1_000_000)   return "<1M";
  if (brl < 10_000_000)  return "1M-10M";
  if (brl < 30_000_000)  return "10M-30M";
  return ">30M";
}
