import { ImageResponse } from "next/og";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const OG_SIZE = { width: 1200, height: 630 };

const NAVY = "#12213b";
const GREEN = "#1fbf6c";
const MUTED = "#8b9bb8";
const LIGHT = "#f7f8fa";

interface OgImageOptions {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  chips?: string[];
}

export function createOgImage({
  title = SITE_NAME,
  subtitle = "Convierte el riesgo técnico en impacto financiero",
  eyebrow = SITE_TAGLINE,
  chips = ["ISO 25010", "OWASP", "EU CRA", "DORA", "ASPM"],
}: OgImageOptions = {}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(135deg, ${NAVY} 0%, #1a3358 55%, #0f1a2e 100%)`,
          color: LIGHT,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GREEN}33 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -40,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, #4a5d8244 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em" }}>Sprita</span>
            <span style={{ fontSize: 34, fontWeight: 600, color: MUTED }}>iT</span>
            <span
              style={{
                width: 2,
                height: 28,
                background: "rgba(255,255,255,0.2)",
                margin: "0 4px",
              }}
            />
            <span style={{ fontSize: 34, fontWeight: 700, color: GREEN }}>Score</span>
          </div>
          <p style={{ fontSize: 18, color: MUTED, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {eyebrow}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative", maxWidth: 900 }}>
          <h1
            style={{
              fontSize: title.length > 42 ? 46 : 56,
              fontWeight: 700,
              lineHeight: 1.08,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 28, color: "#c8d2e4", margin: 0, lineHeight: 1.35 }}>{subtitle}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {chips.map((chip) => (
              <span
                key={chip}
                style={{
                  fontSize: 16,
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#dbe4f4",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: "50%",
              border: `4px solid ${GREEN}`,
              fontSize: 28,
              fontWeight: 700,
              color: GREEN,
              background: "rgba(31,191,108,0.08)",
            }}
          >
            {CALCULATOR_CONFIGS.length}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}