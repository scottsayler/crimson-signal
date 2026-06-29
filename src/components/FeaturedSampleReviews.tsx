import Link from "next/link";
import type { SampleReviewListing } from "@/lib/types";

interface FeaturedSampleReviewsProps {
  samples: SampleReviewListing[];
}

export function FeaturedSampleReviews({ samples }: FeaturedSampleReviewsProps) {
  if (samples.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-crimson">
            Sample Reviews
          </p>
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            See Sample Technology Impact Reviews
          </h2>
        </div>
        <Link
          href="/sample-reviews"
          className="hidden shrink-0 text-sm text-muted transition-colors hover:text-foreground sm:inline"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {samples.map((sample) => (
          <Link
            key={sample.slug}
            href={`/sample-reviews/${sample.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-crimson/30 hover:bg-crimson-light/30"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-crimson">
              Technology Impact Review
            </p>
            <h3 className="mt-2 font-medium tracking-tight text-foreground group-hover:text-crimson">
              {sample.title}
            </h3>
            <p className="mt-2 text-xs text-muted-light">
              {sample.businessEvent} · {sample.industry}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {sample.summary}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-4 text-center sm:hidden">
        <Link
          href="/sample-reviews"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          View all sample reviews →
        </Link>
      </div>
    </section>
  );
}
