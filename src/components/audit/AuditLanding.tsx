import { AuditScopeForm } from "@/components/audit/AuditScopeForm";
import { getAuditCopy } from "@/i18n/audit";
import { AUDIT_IDS } from "@/lib/auditRoutes";
import type { Locale } from "@/types/calculator";

export function AuditLanding({ locale, model }: { locale: Locale; model?: string }) {
  const copy = getAuditCopy(locale);

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">{copy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{copy.h1}</h1>
        <p className="mt-4 text-lg text-foreground/85">{copy.lead}</p>
        <p className="mt-4 rounded-lg border bg-white p-4 text-sm text-muted-foreground">{copy.disclaimer}</p>

        <h2 className="mt-12 text-2xl font-bold text-foreground">{copy.levelsTitle}</h2>
        <ol className="mt-4 space-y-3">
          {copy.levels.map((level, index) => (
            <li key={level.title} className="rounded-lg border bg-white p-4">
              <p className="font-semibold text-foreground">
                {index + 1}. {level.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{level.body}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-2xl font-bold text-foreground">{copy.offersTitle}</h2>
        <ul className="mt-4 space-y-3">
          {AUDIT_IDS.map((id) => (
            <li key={id} id={id} className="rounded-lg border bg-white p-4">
              <p className="font-semibold text-foreground">
                {id} · {copy.offers[id].title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{copy.offers[id].body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <AuditScopeForm locale={locale} model={model} />
        </div>
      </div>
    </div>
  );
}
