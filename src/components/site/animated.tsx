"use client";

import { useEffect, useRef, useState } from "react";
import { useParallax } from "@/hooks/useParallax";

/** Parallax background layers for the hero (isolated so scrolling only
 * re-renders this subtree, not the whole page). */
export function HeroBg() {
  const gridPar = useParallax(-0.03);
  const b1Par = useParallax(0.06);
  const b2Par = useParallax(-0.04);
  return (
    <div className="hero-bg">
      <div className="grid-lines" style={{ transform: `translate3d(0, ${gridPar}px, 0)` }} />
      <div className="blob b1" style={{ transform: `translate3d(0, ${b1Par}px, 0)` }} />
      <div className="blob b2" style={{ transform: `translate3d(0, ${b2Par}px, 0)` }} />
    </div>
  );
}

/**
 * Counts a number from 0 to `target` with a cubic ease-out the first time the
 * element enters the viewport. Honors prefers-reduced-motion (jumps to target).
 */
function useCountUp<T extends HTMLElement>(target: number, durationMs = 1200) {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const t0 = performance.now();
            const step = (t: number) => {
              const p = Math.min(1, (t - t0) / durationMs);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target, durationMs]);

  return { ref, value };
}

/** Animated integer, e.g. the stat numbers. */
export function CountUp({ target, locale = "es" }: { target: number; locale?: string }) {
  const { ref, value } = useCountUp<HTMLSpanElement>(target);
  return <span ref={ref}>{value.toLocaleString(localeTag(locale))}</span>;
}

/** Hero score ring: conic-gradient fills as the number counts to `target`. */
export function ScoreRing({
  target = 842,
  label,
  locale = "es",
}: {
  target?: number;
  label: string;
  locale?: string;
}) {
  const { ref, value } = useCountUp<HTMLDivElement>(target, 1700);
  const v = ((value / 1000) * 100).toFixed(1);
  return (
    <div className="ring" ref={ref} style={{ ["--v" as string]: v } as React.CSSProperties}>
      <div className="ring-tick" />
      <div className="ring-inner">
        <div className="ring-num">{value.toLocaleString(localeTag(locale))}</div>
        <div className="ring-lab">{label}</div>
      </div>
    </div>
  );
}

/** Large gauge used in the dark "El score" section. */
export function ScoreGauge({
  target = 842,
  sub,
  locale = "es",
}: {
  target?: number;
  sub: string;
  locale?: string;
}) {
  const { ref, value } = useCountUp<HTMLDivElement>(target, 1700);
  const v = ((value / 1000) * 100).toFixed(1);
  return (
    <div className="gauge" ref={ref} style={{ ["--v" as string]: v } as React.CSSProperties}>
      <div className="gauge-c">
        <div className="gauge-n">{value.toLocaleString(localeTag(locale))}</div>
        <div className="gauge-sub">{sub}</div>
      </div>
    </div>
  );
}

function localeTag(locale: string) {
  return locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-ES";
}
