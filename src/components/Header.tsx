import Link from "next/link";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-navy">
          <Shield className="h-6 w-6 text-brand-orange" />
          <span>Spritascore</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/#calculadoras" className="hover:text-brand-navy transition-colors">Calculadoras</Link>
          <Link href="/#como-funciona" className="hover:text-brand-navy transition-colors">Cómo funciona</Link>
          <Link href="/#contacto" className="hover:text-brand-navy transition-colors">Contacto</Link>
        </nav>
        <Link
          href="/#calculadoras"
          className="bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors"
        >
          Calcular ahora
        </Link>
      </div>
    </header>
  );
}