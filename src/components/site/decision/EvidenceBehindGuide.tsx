import type { EvidenceBehindGuideData } from "@/lib/site/types";
import { MarkdownContent } from "@/components/MarkdownContent";

interface EvidenceBehindGuideProps {
  data: EvidenceBehindGuideData;
}

export function EvidenceBehindGuide({ data }: EvidenceBehindGuideProps) {
  const { researchInputs, recurringPatterns, methodology } = data;
  const hasContent =
    researchInputs.length > 0 || recurringPatterns.length > 0 || methodology.trim();

  if (!hasContent) return null;

  return (
    <section aria-label="Evidence behind this guide" className="scroll-mt-24">
      <h2 className="mb-2 font-serif text-2xl font-medium tracking-tight text-foreground">
        Evidence Behind This Guide
      </h2>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted">
        How this guide was developed. Editorial transparency, not a citation list.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {researchInputs.length > 0 && (
          <div className="rounded-xl border border-border bg-surface px-5 py-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-light">
              Research inputs
            </h3>
            <ul className="space-y-2">
              {researchInputs.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recurringPatterns.length > 0 && (
          <div className="rounded-xl border border-border bg-surface px-5 py-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-light">
              Recurring patterns
            </h3>
            <ul className="space-y-2">
              {recurringPatterns.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {methodology.trim() && (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-border-light/30 px-5 py-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-light">
            Independent methodology
          </h3>
          <div className="max-w-3xl text-sm leading-[1.75] text-muted">
            <MarkdownContent content={methodology} />
          </div>
        </div>
      )}
    </section>
  );
}
