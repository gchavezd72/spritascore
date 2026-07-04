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
        <span className="relative inline-block">
          <span className={cn("font-semibold", secondary)}>i</span>
          <span
            className="absolute bottom-full left-1/2 mb-0.5 h-[0.22em] w-[0.22em] -translate-x-1/2 rounded-[1px] bg-brand-green"
            aria-hidden
          />
        </span>
        <span className={cn("font-semibold", secondary)}>T</span>
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
