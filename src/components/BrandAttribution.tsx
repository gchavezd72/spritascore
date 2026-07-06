import Link from "next/link";
import { ORGANIZATION } from "@/lib/seo";

interface BrandAttributionProps {
  variant?: "bar" | "footer";
  locale?: "es" | "en" | "pt";
}

const COPY = {
  es: {
    bar: "SpritaScore es una marca de",
    footer: "SpritaScore es una marca registrada de",
    cta: "Conozca los servicios de seguridad de aplicaciones de Sprita iT",
  },
  en: {
    bar: "SpritaScore is a brand of",
    footer: "SpritaScore is a registered brand of",
    cta: "Explore Sprita iT application security services",
  },
  pt: {
    bar: "SpritaScore é uma marca da",
    footer: "SpritaScore é uma marca registrada da",
    cta: "Conheça os serviços de segurança de aplicações da Sprita iT",
  },
};

export function BrandAttribution({ variant = "bar", locale = "es" }: BrandAttributionProps) {
  const c = COPY[locale];

  if (variant === "bar") {
    return (
      <div className="brand-bar">
        <div className="wrap brand-bar-in">
          <span>
            {c.bar}{" "}
            <Link href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer">
              Sprita iT
            </Link>
          </span>
          <Link href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer" className="brand-bar-link">
            sprita-it.com ↗
          </Link>
        </div>
      </div>
    );
  }

  return (
    <p className="brand-footer-line">
      {c.footer}{" "}
      <Link href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer">
        Sprita iT
      </Link>
      .{" "}
      <Link href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer">
        {c.cta} ↗
      </Link>
    </p>
  );
}