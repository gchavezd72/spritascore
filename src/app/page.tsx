"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CountUp, ScoreRing, ScoreGauge, HeroBg } from "@/components/site/animated";
import { useTranslations } from "@/components/LanguageProvider";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { tr } from "@/lib/translate";

export default function HomePage() {
  const { t, locale } = useTranslations();
  const l = t.landing;
  const cs = t.calculatorSelector;

  return (
    <div className="sc">
      {/* Hero */}
      <section className="hero" id="hero">
        <HeroBg />
        <div className="wrap hero-in">
          <div className="hero-copy">
            <Reveal>
              <span className="eyebrow">{l.hero.eyebrow}</span>
              <h1 className="h1">
                {l.hero.h1a}
                <br />
                <span className="it">{l.hero.h1b}</span>
              </h1>
              <p className="lead">{l.hero.lead}</p>
              <div className="hero-cta">
                <Link href="#calculadoras" className="btn btn-solid">
                  {l.hero.cta1} <span className="arr">↗</span>
                </Link>
                <Link href="#contacto" className="btn btn-ghost">
                  {l.hero.cta2}
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="ring-wrap">
            <ScoreRing label={l.hero.scoreLabel} locale={locale} />
          </div>
        </div>
        <div className="scrollcue">
          <span className="ln" />
          <span>{l.hero.scroll}</span>
        </div>
      </section>

      {/* Strip marquee */}
      <div className="strip">
        <div className="mq">
          {[...l.marquee, ...l.marquee].map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>

      {/* Statement */}
      <section className="statement" id="statement">
        <div className="grid-lines" />
        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <Reveal>
            <span className="eyebrow">{l.statement.eyebrow}</span>
            <h2 className="stmt-h" style={{ marginTop: 24 }}>
              {l.statement.before}
              <span className="hl">{l.statement.pct}</span>
              {l.statement.after}
            </h2>
            <p className="stmt-sub">{l.statement.sub}</p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="sec">
        <div className="wrap">
          <Reveal>
            <div className="stats">
              {l.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <div className="stat-n">
                    <CountUp target={s.n} locale={locale} />
                  </div>
                  <div className="stat-l">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Calculators */}
      <section className="sec" id="calculadoras">
        <div className="wrap">
          <Reveal>
            <div className="svc-head">
              <div>
                <span className="eyebrow">{l.calc.eyebrow}</span>
                <h2 className="h2" style={{ marginTop: 20 }}>
                  {l.calc.h2}
                </h2>
              </div>
              <p className="lead">{l.calc.lead}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="svc-grid">
              {CALCULATOR_CONFIGS.map((calc, i) => (
                <Link href={`/calculadora/${calc.slug}`} className="svc" key={calc.id}>
                  <span className="go">↗</span>
                  <span className="svc-tag">{cs.categories[calc.category]}</span>
                  <div className="svc-i">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="h3">{tr(calc.title, locale)}</h3>
                  <p>{tr(calc.shortDescription, locale)}</p>
                  <div className="svc-meta">
                    {cs.complexity} {cs.complexityLabels[calc.complexity]} · {tr(calc.estimatedTime, locale)}
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* The score (dark) */}
      <section className="sec dark" id="producto">
        <div className="grid-lines" />
        <div className="wrap prod-in">
          <Reveal>
            <span className="eyebrow">{l.score.eyebrow}</span>
            <h2 className="h2 serif" style={{ margin: "22px 0 24px" }}>
              SpritaScore<span className="it">.</span>
            </h2>
            <p className="lead">{l.score.lead}</p>
            <div className="prod-pts">
              {l.score.points.map((p) => (
                <div className="prod-pt" key={p.k}>
                  <span className="k">{p.k}</span>
                  <span className="v">{p.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <div>
            <ScoreGauge sub={l.score.gaugeSub} locale={locale} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="sec method" id="metodo">
        <div className="wrap">
          <Reveal>
            <div className="svc-head">
              <div>
                <span className="eyebrow">{l.method.eyebrow}</span>
                <h2 className="h2" style={{ marginTop: 20 }}>
                  {l.method.h2}
                </h2>
              </div>
              <p className="lead">{l.method.lead}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="steps">
              {l.method.steps.map((step, i) => (
                <div className="step" key={step.t}>
                  <span className="dot" />
                  {i < l.method.steps.length - 1 && <span className="bar" />}
                  <div className="step-n">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="h3">{step.t}</h3>
                  <p>{step.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sectors */}
      <section className="sec" id="sectores">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">{l.sectors.eyebrow}</span>
            <h2 className="h2" style={{ marginTop: 20, maxWidth: 840 }}>
              {l.sectors.h2}
            </h2>
            <div className="sectors">
              {l.sectors.chips.map((chip) => (
                <span className="chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quote */}
      <section className="sec quote">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow" style={{ color: "var(--green2)" }}>
              {l.quote.eyebrow}
            </span>
            <p className="quote-t">
              {l.quote.before}
              <span className="hl">{l.quote.hl}</span>
              {l.quote.after}
            </p>
            <div className="quote-a">{l.quote.author}</div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="sec cta" id="contacto">
        <div className="wrap">
          <Reveal>
            <div className="cta-box">
              <div className="rings" />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span className="eyebrow">{l.cta.eyebrow}</span>
                <h2 className="h2" style={{ marginTop: 20 }}>
                  {l.cta.h2}
                </h2>
              </div>
              <div className="cta-actions">
                <a
                  href="mailto:info@spritascore.com?subject=Diagn%C3%B3stico%20t%C3%A9cnico%20Spritascore"
                  className="btn btn-light"
                >
                  {l.cta.btn} <span className="arr">↗</span>
                </a>
                <span className="overline" style={{ color: "rgba(255,255,255,.85)" }}>
                  {l.cta.note}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
