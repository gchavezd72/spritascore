import Link from "next/link";
import { getAuditCopy } from "@/i18n/audit";
import { auditMatch, auditPath } from "@/lib/auditRoutes";
import type { Locale } from "@/types/calculator";

export function AuditOffer({
  calculatorId,
  locale,
}: {
  calculatorId: string;
  locale: Locale;
}) {
  const copy = getAuditCopy(locale);
  const match = auditMatch(calculatorId);
  const primary = copy.offers[match.primary];
  const alt = match.alt ? copy.offers[match.alt] : null;
  const reason =
    calculatorId in copy.reasons
      ? copy.reasons[calculatorId as keyof typeof copy.reasons]
      : copy.disclaimer;

  return (
    <section className="rounded-xl border border-brand-green/30 bg-white p-6 md:p-8" aria-labelledby="audit-offer-title">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">{copy.cardEyebrow}</p>
      <h2 id="audit-offer-title" className="mt-2 text-xl font-bold text-foreground">
        {match.primary} · {primary.title}
      </h2>
      <p className="mt-3 text-foreground/85">{reason}</p>
      <p className="mt-2 text-sm text-muted-foreground">{primary.body}</p>
      <p className="mt-3 text-sm font-medium text-foreground">{copy.notAFinding}</p>
      {alt && match.alt && (
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{copy.alsoLabel}: </span>
          {match.alt} · {alt.title}
        </p>
      )}
      <Link
        href={auditPath(locale, calculatorId)}
        className="mt-5 inline-flex items-center rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        {copy.cardCta}
      </Link>
    </section>
  );
}
