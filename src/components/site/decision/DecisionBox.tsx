import type { PagePresentationMode, ShouldConsider } from "@/lib/site/types";

interface DecisionBoxProps {
  shouldConsider: ShouldConsider;
  mode?: PagePresentationMode;
}

export function DecisionBox({ shouldConsider, mode = "decision-guide" }: DecisionBoxProps) {
  const { evaluateIf, probablyNotIf } = shouldConsider;
  const isCornerstone = mode === "cornerstone";
  const title = isCornerstone ? "Executive Summary" : "Should You Consider It?";
  const evaluateLabel = isCornerstone
    ? "This guide is for you if:"
    : "You should evaluate this if:";
  const excludeLabel = isCornerstone ? "Pause or simplify if:" : "Probably not if:";

  return (
    <section
      aria-label={isCornerstone ? "Executive summary" : "Decision box"}
      className="rounded-xl border border-blue-200 bg-blue-50/40 p-6 dark:border-blue-900/40 dark:bg-blue-950/15"
    >
      <h2 className="mb-5 font-serif text-2xl font-medium tracking-tight text-foreground">
        {title}
      </h2>

      {evaluateIf.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{evaluateLabel}</h3>
          <ul className="space-y-2">
            {evaluateIf.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                <span className="mt-0.5 shrink-0 text-green-600" aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {probablyNotIf.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">{excludeLabel}</h3>
          <ul className="space-y-2">
            {probablyNotIf.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                <span className="mt-0.5 shrink-0 text-red-500" aria-hidden="true">
                  ✗
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
