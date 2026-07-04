"use client";

import { useTranslations } from "@/components/LanguageProvider";

export default function PrivacyPage() {
  const { t } = useTranslations();
  const p = t.privacy;

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{p.title}</h1>
        <p className="text-sm text-muted-foreground mb-8">{p.lastUpdated}</p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-2">{p.s1Heading}</h2>
        <ul className="list-disc pl-5 text-foreground/85 space-y-1">
          <li>{p.s1Item1}</li>
          <li>{p.s1Item2}</li>
          <li>{p.s1Item3}</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-2">{p.s2Heading}</h2>
        <p className="text-foreground/85">{p.s2Body}</p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-2">{p.s3Heading}</h2>
        <p className="text-foreground/85">{p.s3Body}</p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-2">{p.s4Heading}</h2>
        <p className="text-foreground/85">{p.s4Body}</p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-2">{p.s5Heading}</h2>
        <p className="text-foreground/85">
          {p.s5BodyBefore}{" "}
          <a href="mailto:info@spritascore.com" className="text-brand-green font-semibold hover:underline">
            info@spritascore.com
          </a>
          {p.s5BodyAfter}
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-2">{p.s6Heading}</h2>
        <p className="text-foreground/85">
          {p.s6BodyBefore}{" "}
          <a href="mailto:info@spritascore.com" className="text-brand-green font-semibold hover:underline">
            info@spritascore.com
          </a>
          {p.s6BodyAfter}
        </p>
      </div>
    </div>
  );
}
