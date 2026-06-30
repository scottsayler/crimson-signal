interface BuyingTriggerTimelineProps {
  steps: string[];
}

export function BuyingTriggerTimeline({ steps }: BuyingTriggerTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <section aria-label="Buying trigger timeline">
      <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
        How Organizations Get Here
      </h2>
      <ol className="relative space-y-0">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-border text-xs font-semibold text-muted">
                {index + 1}
              </span>
              {index < steps.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
              )}
            </div>
            <p className="pt-1 text-sm leading-relaxed text-muted">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
