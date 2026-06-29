import Link from "next/link";
import type { EvidenceEntryResolved } from "@/lib/types";
import { getDomainLabel } from "@/lib/types";
import { MarkdownContent } from "./MarkdownContent";
import { BulletList, ReviewSection } from "./review-display-parts";

interface EvidenceDisplayProps {
  entry: EvidenceEntryResolved;
}

export function EvidenceDisplay({ entry }: EvidenceDisplayProps) {
  const formattedDate = new Date(entry.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="animate-fade-in">
      <header className="mb-12 border-b border-border pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-crimson">
          Synthesized Evidence
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          {entry.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{entry.excerpt}</p>
        <time className="mt-4 block text-sm text-muted-light">{formattedDate}</time>

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
          sector-specific regulatory, operational, and customer experience constraints
          shape how this business event surfaces technology consequences.
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
          the organizational change that triggers technology implications across
          distributed operations.
        </p>
      </ReviewSection>

      <ReviewSection title="Evidence Reviewed">
        <ul className="space-y-4">
          {entry.evidenceReviewed.map((item) => (
            <li
              key={item.source}
              className="rounded-xl border border-border bg-border-light/40 px-5 py-4"
            >
              <p className="text-[15px] font-medium text-foreground">{item.source}</p>
              {item.note && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
              )}
            </li>
          ))}
        </ul>
      </ReviewSection>

      <ReviewSection title="Recurring Executive Patterns">
        <BulletList items={entry.executivePatterns} />
      </ReviewSection>

      <ReviewSection title="Common Blind Spots">
        <BulletList items={entry.blindSpots} />
      </ReviewSection>

      <ReviewSection title="Representative Outcomes">
        <BulletList items={entry.outcomes} />
      </ReviewSection>

      <ReviewSection title="Key Leadership Questions">
        <BulletList items={entry.leadershipQuestions} />
      </ReviewSection>

      {entry.content.trim() && (
        <ReviewSection title="Synthesis Notes">
          <MarkdownContent content={entry.content} />
        </ReviewSection>
      )}
    </article>
  );
}
