"use client";

import Link from "next/link";
import { BrandFooterLine } from "@/components/BrandBar";
import { Logo } from "@/components/Logo";
import { useTranslations } from "@/components/LanguageProvider";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { getAuditCopy } from "@/i18n/audit";
import { auditPath } from "@/lib/auditRoutes";
import { calculatorPath } from "@/lib/calculatorPath";
import { tr } from "@/lib/translate";

export function Footer() {
  const { t, locale } = useTranslations();
  const home = locale === "en" ? "/" : `/${locale}`;
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
            <p className="ft-label">{f.calculatorsTitle}</p>
            <ul>
              {CALCULATOR_CONFIGS.map((calc) => (
                <li key={calc.id}>
                  <Link
                    href={calculatorPath(calc, locale)}
                  >
                    {tr(calc.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="ft-label">{l.footer.productTitle}</p>
            <ul>
              <li>
                <Link href={`${home}#producto`}>{l.footer.product.score}</Link>
              </li>
              <li>
                <Link href={`${home}#metodo`}>{l.footer.product.how}</Link>
              </li>
              <li>
                <Link href={`${home}#sectores`}>{l.footer.product.sectors}</Link>
              </li>
              <li>
                <Link href={auditPath(locale)}>{getAuditCopy(locale).nav}</Link>
              </li>
              <li>
                <Link href="/analytics">Analytics</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="ft-label">{f.contactTitle}</p>
            <ul>
              <li>
                <a href="mailto:info@sprita-it.com">info@sprita-it.com</a>
              </li>
              <li>
                <a href="https://spritascore.com">spritascore.com</a>
              </li>
            </ul>
          </div>
        </div>
        <BrandFooterLine />
        <div className="ft-disc">{f.disclaimer}</div>
        <div className="ft-bot">
          <span className="mono">
            © {new Date().getFullYear()} SpritaScore ·{" "}
            <a href="https://sprita-it.com" target="_blank" rel="noopener noreferrer">
              Sprita iT
            </a>
          </span>
          <Link href="/privacidad">{f.privacyPolicy}</Link>
        </div>
      </div>
    </footer>
  );
}
