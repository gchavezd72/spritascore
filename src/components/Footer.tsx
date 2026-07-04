"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useTranslations } from "@/components/LanguageProvider";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { tr } from "@/lib/translate";

export function Footer() {
  const { t, locale } = useTranslations();
  const f = t.footer;
  const l = t.landing;

  return (
    <footer className="sc ft">
      <div className="wrap">
        <div className="ft-top">
          <div>
            <Logo variant="light" className="text-lg" />
            <p className="ft-about">{l.footer.tagline}</p>
          </div>
          <div>
            <h5>{f.calculatorsTitle}</h5>
            <ul>
              {CALCULATOR_CONFIGS.map((calc) => (
                <li key={calc.id}>
                  <Link href={`/calculadora/${calc.slug}`}>{tr(calc.title, locale)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5>{l.footer.productTitle}</h5>
            <ul>
              <li>
                <Link href="/#producto">{l.footer.product.score}</Link>
              </li>
              <li>
                <Link href="/#metodo">{l.footer.product.how}</Link>
              </li>
              <li>
                <Link href="/#sectores">{l.footer.product.sectors}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>{f.contactTitle}</h5>
            <ul>
              <li>
                <a href="mailto:info@spritascore.com">info@spritascore.com</a>
              </li>
              <li>
                <a href="https://spritascore.com">spritascore.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="ft-disc">{f.disclaimer}</div>
        <div className="ft-bot">
          <span className="mono">© {new Date().getFullYear()} Spritascore · Sprita iT</span>
          <Link href="/privacidad">{f.privacyPolicy}</Link>
        </div>
      </div>
    </footer>
  );
}
