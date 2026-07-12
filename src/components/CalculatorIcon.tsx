import type { CalculatorCategory, CalculatorId } from "@/types/calculator";
import { cn } from "@/lib/utils";

interface CalculatorIconProps {
  id?: CalculatorId;
  category?: CalculatorCategory;
  className?: string;
}

function IconPaths({ id, category }: { id?: CalculatorId; category?: CalculatorCategory }) {
  const key = id ?? category;

  switch (key) {
    case "executive-software-risk-score":
      return (
        <>
          <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M8 10h8M8 13.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="17" cy="8" r="2.5" fill="currentColor" opacity="0.35" />
        </>
      );
    case "eu-ai-act-compliance":
      return (
        <>
          <path d="M12 3.5L5 6.5v5c0 3.9 3 6.9 7 8 4-1.1 7-4.1 7-8v-5L12 3.5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 9.5v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="7.4" r="0.95" fill="currentColor" />
        </>
      );
    case "owasp-web":
      return (
        <>
          <path d="M12 3.5L4 7v6c0 4.2 3.4 7.8 8 9 4.6-1.2 8-4.8 8-9V7l-8-3.5z" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="17" cy="8" r="2.5" fill="currentColor" opacity="0.35" />
        </>
      );
    case "owasp-mobile":
      return (
        <>
          <rect x="8" y="4" width="8" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="12" cy="17" r="0.9" fill="currentColor" />
          <path d="M10.5 7.5h3M10 10.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M16 6l3-1.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "sector":
      return (
        <>
          <path d="M4 18V8l8-4 8 4v10" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
          <path d="M8 18v-5h3v5M13 18v-8h3v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </>
      );
    case "iso-quality":
    case "calidad":
      return (
        <>
          <path d="M7 8l-2 2 2 2M17 8l2 2-2 2M10.5 16l3-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 18h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
          <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </>
      );
    case "aspm-cost":
    case "ahorros":
      return (
        <>
          <path d="M5 16l4-5 3 3 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="18" cy="7" r="3" stroke="currentColor" strokeWidth="1.4" fill="none" />
          <path d="M17 6.2v1.6M18.8 7h-1.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </>
      );
    case "cra-compliance":
    case "dora-compliance":
    case "compliance":
      return (
        <>
          <path d="M8 5h8l3 3v11H5V5h3z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 5V3M16 5V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "seguridad":
    default:
      return (
        <>
          <path d="M12 2.5l7 3.5v5.5c0 4.5-3 8.5-7 9.5-4-1-7-5-7-9.5V6l7-3.5z" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M8.5 12.5l2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 6v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
        </>
      );
  }
}

export function CalculatorIcon({ id, category, className }: CalculatorIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("h-6 w-6", className)}
    >
      <IconPaths id={id} category={category} />
    </svg>
  );
}