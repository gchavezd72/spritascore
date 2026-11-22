import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { readLocaleCookie } from "@/lib/localePreference";
import type { Locale } from "@/types/calculator";

const COPY: Record<Locale, { title: string; body: string; home: string; es: string; pt: string }> = {
  en: {
    title: "Page not found",
    body: "This address is not on SpritaScore.",
    home: "English homepage",
    es: "Spanish homepage",
    pt: "Portuguese homepage",
  },
  es: {
    title: "Página no encontrada",
    body: "Esta dirección no está en SpritaScore.",
    home: "Portada en inglés",
    es: "Portada en español",
    pt: "Portada en portugués",
  },
  pt: {
    title: "Página não encontrada",
    body: "Este endereço não está no SpritaScore.",
    home: "Página em inglês",
    es: "Página em espanhol",
    pt: "Página em português",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = readLocaleCookie((await headers()).get("x-sprita-locale"));
  const copy = COPY[locale];
  return {
    title: { absolute: `${copy.title} | SpritaScore` },
    description: copy.body,
    robots: { index: false, follow: false },
    alternates: { canonical: "https://spritascore.com/404" },
    openGraph: {
      title: copy.title,
      description: copy.body,
      url: "https://spritascore.com/404",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: copy.title,
      description: copy.body,
    },
  };
}

export default async function NotFound() {
  const locale = readLocaleCookie((await headers()).get("x-sprita-locale"));
  const copy = COPY[locale];

  return (
    <div className="wrap py-24 text-center">
      <h1 className="text-3xl font-bold text-brand-navy">{copy.title}</h1>
      <p className="mt-4 text-muted-foreground">{copy.body}</p>
      <nav className="mt-8 flex flex-wrap justify-center gap-4 text-sm" aria-label={copy.title}>
        <Link href="/">{copy.home}</Link>
        <Link href="/es">{copy.es}</Link>
        <Link href="/pt">{copy.pt}</Link>
      </nav>
    </div>
  );
}
