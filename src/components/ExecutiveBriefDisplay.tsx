import type { ExecutiveBrief } from "@/lib/brief";
import { CTAButton } from "./CTAButton";

interface ExecutiveBriefDisplayProps {
  brief: ExecutiveBrief;
}

export function ExecutiveBriefDisplay({ brief }: ExecutiveBriefDisplayProps) {
  const formattedDate = new Date(brief.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8 border-b border-border pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-crimson">
          Executive Brief
        </p>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          {brief.title}
        </h1>
        <p className="mt-3 text-sm text-muted">Generated {formattedDate}</p>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl font-medium tracking-tight">
          Situation
        </h2>
        <p className="text-[15px] leading-relaxed text-muted">{brief.situation}</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl font-medium tracking-tight">
          Technology Implications
        </h2>
        <ul className="space-y-3">
          {brief.implications.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] leading-relaxed text-muted"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl font-medium tracking-tight">
          Recommended Priorities
        </h2>
        <div className="space-y-4">
          {brief.priorities.map((priority, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-crimson-light text-xs font-semibold text-crimson">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-foreground">{priority.title}</h3>
              </div>
              <p className="pl-9 text-sm leading-relaxed text-muted">
                {priority.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl font-medium tracking-tight">
          Technology Domains
        </h2>
        <div className="flex flex-wrap gap-2">
          {brief.domains.map((domain) => (
            <span
              key={domain}
              className="rounded-full border border-border bg-border-light px-3 py-1 text-xs font-medium text-muted"
            >
              {domain}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-serif text-xl font-medium tracking-tight">
          Recommended Next Steps
        </h2>
        <ol className="space-y-2">
          {brief.nextSteps.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] leading-relaxed text-muted"
            >
              <span className="font-semibold text-foreground">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <div className="rounded-2xl border border-crimson/20 bg-crimson-light p-8 text-center">
        <h3 className="mb-2 font-serif text-xl font-medium tracking-tight text-foreground">
          Ready to go deeper?
        </h3>
        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted">
          Schedule a Technology Strategy Session with Scott to turn this brief
          into a location-aware roadmap for your organization.
        </p>
        <CTAButton href="mailto:scott@crimsonsignal.com?subject=Technology%20Strategy%20Session">
          Schedule a Technology Strategy Session
        </CTAButton>
      </div>
    </div>
  );
}
