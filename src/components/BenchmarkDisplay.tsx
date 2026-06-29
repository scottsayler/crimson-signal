import Link from "next/link";
import type { BenchmarkEntryResolved } from "@/lib/types";
import { getDomainLabel } from "@/lib/types";
import { MarkdownContent } from "./MarkdownContent";
import { BulletList, ReviewSection } from "./review-display-parts";

interface BenchmarkDisplayProps {
  entry: BenchmarkEntryResolved;
}

export function BenchmarkDisplay({ entry }: BenchmarkDisplayProps) {
  const formattedDate = new Date(entry.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="animate-fade-in">
      <header className="mb-12 border-b border-border pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-crimson">
          Industry Benchmark
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          {entry.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{entry.excerpt}</p>
        <time className="mt-4 block text-sm text-muted-light">{formattedDate}</time>

        <p className="mt-6 rounded-xl border border-border bg-border-light/40 px-5 py-4 text-sm leading-relaxed text-muted">
          Directional ranges based on recurring observations across comparable
          organizations. These are operational reference points — not precision
          benchmarks or calculators.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/industries/${entry.industrySlug}`}
            className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            {entry.industry}
          </Link>
          <Link
            href={`/business-events/${entry.eventSlug}`}
            className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            {entry.businessEvent}
          </Link>
          {entry.technologyDomains.map((domain) => (
            <span
              key={domain}
              className="rounded-full bg-crimson-light px-3 py-1 text-xs font-medium text-crimson"
            >
              {getDomainLabel(domain)}
            </span>
          ))}
        </div>
      </header>

      <ReviewSection title="Industry">
        <p className="text-[15px] leading-relaxed text-muted">
          <Link
            href={`/industries/${entry.industrySlug}`}
            className="font-medium text-foreground transition-colors hover:text-crimson"
          >
            {entry.industry}
          </Link>
          {" — "}
          sector norms and operational constraints that shape how these ranges
          apply across distributed footprints.
        </p>
      </ReviewSection>

      <ReviewSection title="Business Event">
        <p className="text-[15px] leading-relaxed text-muted">
          <Link
            href={`/business-events/${entry.eventSlug}`}
            className="font-medium text-foreground transition-colors hover:text-crimson"
          >
            {entry.businessEvent}
          </Link>
          {" — "}
          the organizational change that defines which operational metrics and
          maturity signals matter most.
        </p>
      </ReviewSection>

      <ReviewSection title="Directional Benchmarks">
        <div className="space-y-3">
          {entry.ranges.map((item) => (
            <div
              key={item.metric}
              className="rounded-xl border border-border bg-surface px-5 py-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="text-[15px] font-medium text-foreground">{item.metric}</p>
                <p className="shrink-0 font-serif text-lg font-medium tracking-tight text-crimson">
                  {item.range}
                </p>
              </div>
              {item.note && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
              )}
            </div>
          ))}
        </div>
      </ReviewSection>

      <ReviewSection title="Maturity Observations">
        <BulletList items={entry.maturityObservations} />
      </ReviewSection>

      <ReviewSection title="Recurring Operational Patterns">
        <BulletList items={entry.operationalPatterns} />
      </ReviewSection>

      {entry.content.trim() && (
        <ReviewSection title="Observations">
          <MarkdownContent content={entry.content} />
        </ReviewSection>
      )}
    </article>
  );
}
