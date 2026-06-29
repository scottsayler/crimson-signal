import { CTAButton } from "./CTAButton";

export function GenerateSampleReviewCTA() {
  return (
    <div className="rounded-2xl border border-crimson/20 bg-crimson-light px-8 py-12 text-center">
      <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">
        Generate Your Own Technology Impact Review
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        Answer a short set of questions about what changed in your organization and
        receive a personalized review in minutes.
      </p>
      <div className="mt-6">
        <CTAButton href="/#business-events">
          Start Your Technology Impact Review
        </CTAButton>
      </div>
    </div>
  );
}
