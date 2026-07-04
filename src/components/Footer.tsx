"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useTranslations } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useTranslations();
  const f = t.footer;

  return (
    <footer className="bg-brand-navy text-slate-400 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <Logo variant="light" className="text-lg mb-3" />
            <p className="text-sm max-w-md leading-relaxed">{f.description}</p>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-white font-semibold">{f.calculatorsTitle}</p>
            {f.calculatorNames.map((name) => (
              <p key={name}>{name}</p>
            ))}
          </div>
          <div className="text-sm space-y-2">
            <p className="text-white font-semibold">{f.contactTitle}</p>
            <p>spritascore.com</p>
            <p>info@spritascore.com</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-xs leading-relaxed">
          <p className="mb-2">{f.disclaimer}</p>
          <p className="flex flex-wrap items-center gap-x-2">
            <span>© {new Date().getFullYear()} Spritascore. {f.rights}</span>
            <Link href="/privacidad" className="text-slate-300 hover:text-white hover:underline">
              {f.privacyPolicy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
