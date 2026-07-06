export const BRAND_COLORS = {
  navy: "#12213b",
  green: "#1fbf6c",
  muted: "#8b9bb8",
  light: "#f7f8fa",
} as const;

/** Compact mark for favicon sizes (16–64px). */
export function SpritaScoreMark({ size = 32 }: { size?: number }) {
  const fontMain = Math.round(size * 0.5);
  const fontSub = Math.round(size * 0.26);
  const barW = Math.round(size * 0.36);
  const barH = Math.max(2, Math.round(size * 0.09));
  const radius = Math.round(size * 0.22);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_COLORS.navy,
        borderRadius: radius,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
        <span
          style={{
            fontSize: fontMain,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.04em",
          }}
        >
          S
        </span>
        <span
          style={{
            fontSize: fontSub,
            fontWeight: 600,
            color: BRAND_COLORS.muted,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          i
        </span>
      </div>
      <div
        style={{
          width: barW,
          height: barH,
          background: BRAND_COLORS.green,
          borderRadius: barH,
          marginTop: Math.round(size * 0.05),
        }}
      />
    </div>
  );
}

/** Full wordmark for larger icons (Apple touch, PWA). */
export function SpritaScoreWordmark({ size = 180 }: { size?: number }) {
  const fontSize = Math.round(size * 0.22);
  const dividerH = Math.round(size * 0.22);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, #1a3358 60%, #0f1a2e 100%)`,
        borderRadius: Math.round(size * 0.18),
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -size * 0.2,
          right: -size * 0.15,
          width: size * 0.55,
          height: size * 0.55,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND_COLORS.green}33 0%, transparent 70%)`,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.03), position: "relative" }}>
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          Sprita
        </span>
        <span
          style={{
            fontSize,
            fontWeight: 600,
            color: BRAND_COLORS.muted,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          iT
        </span>
        <span
          style={{
            width: 2,
            height: dividerH,
            background: "rgba(255,255,255,0.22)",
            margin: `0 ${Math.round(size * 0.01)}px`,
          }}
        />
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: BRAND_COLORS.green,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          Score
        </span>
      </div>
    </div>
  );
}