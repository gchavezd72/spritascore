import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showScore?: boolean;
  variant?: "dark" | "light";
}

export function Logo({ className, showScore = true, variant = "dark" }: LogoProps) {
  const wordmark = variant === "light" ? "text-white" : "text-brand-navy";
  const secondary = variant === "light" ? "text-white/60" : "text-slate-400";
  const divider = variant === "light" ? "bg-white/25" : "bg-slate-300";

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center font-bold tracking-tight leading-none transition-opacity hover:opacity-80",
        className
      )}
    >
      <span className={wordmark}>Sprita</span>
      <span className="relative inline-flex items-baseline">
        <span className={cn("font-semibold", secondary)}>iT</span>
      </span>
      {showScore && (
        <>
          <span className={cn("mx-1.5 h-4 w-px", divider)} aria-hidden />
          <span className="text-brand-green">Score</span>
        </>
      )}
    </Link>
  );
}
