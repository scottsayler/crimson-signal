import {
  STRATEGY_SESSION_CTA_BODY,
  STRATEGY_SESSION_CTA_HEADING,
  STRATEGY_SESSION_CTA_LABEL,
  STRATEGY_SESSION_CTA_SUMMARY_HOOK,
  STRATEGY_SESSION_MAILTO,
} from "@/lib/copy";
import { CTAButton } from "./CTAButton";

interface StrategySessionCTAProps {
  label?: string;
  variant?: "prominent" | "standard";
}

export function StrategySessionCTA({
  label,
  variant = "standard",
}: StrategySessionCTAProps) {
  if (variant === "prominent") {
    return (
      <div className="mb-10 rounded-xl border border-crimson/25 bg-crimson-light px-5 py-6 md:px-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-crimson">
          {STRATEGY_SESSION_CTA_HEADING}
        </p>
        <p className="mb-5 text-[15px] leading-relaxed text-foreground">
          {STRATEGY_SESSION_CTA_SUMMARY_HOOK}
        </p>
        <CTAButton href={STRATEGY_SESSION_MAILTO}>
          {label ?? STRATEGY_SESSION_CTA_LABEL}
        </CTAButton>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-8">
      <h2 className="mb-3 text-lg font-medium tracking-tight text-foreground">
        {STRATEGY_SESSION_CTA_HEADING}
      </h2>
      <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-muted">
        {STRATEGY_SESSION_CTA_BODY}
      </p>
      <CTAButton href={STRATEGY_SESSION_MAILTO}>
        {label ?? STRATEGY_SESSION_CTA_LABEL}
      </CTAButton>
    </div>
  );
}
