import type { Industry } from "@/lib/types";
import { CTAButton } from "./CTAButton";

interface IndustrySelectorProps {
  eventTitle: string;
  industries: Industry[];
  onSelect: (industry: Industry) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function IndustrySelector({
  eventTitle,
  industries,
  onSelect,
  onSkip,
  onBack,
}: IndustrySelectorProps) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-muted-light transition-colors hover:text-foreground"
      >
        ← Back
      </button>

      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-light">
        Industry context
      </p>

      <h2 className="mb-2 text-xl font-medium tracking-tight text-foreground md:text-2xl">
        What industry are you in?
      </h2>

      <p className="mb-8 text-[15px] leading-relaxed text-muted">
        This helps tailor the Technology Impact Review for{" "}
        <span className="text-foreground">{eventTitle.toLowerCase()}</span>.
        You can skip if you prefer a general review.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-2">
        {industries.map((industry) => (
          <button
            key={industry.slug}
            onClick={() => onSelect(industry)}
            className="group flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3.5 text-left transition-all duration-150 hover:border-foreground/15 hover:bg-border-light/50 active:scale-[0.99]"
          >
            <span>
              <span className="block text-sm font-medium text-foreground">
                {industry.title}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                {industry.shortDescription}
              </span>
            </span>
            <span className="ml-3 shrink-0 text-muted-light transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-muted">
              →
            </span>
          </button>
        ))}
      </div>

      <CTAButton variant="secondary" onClick={onSkip} className="w-full">
        Skip — use general context
      </CTAButton>
    </div>
  );
}
