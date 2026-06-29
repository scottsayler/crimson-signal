import type { Metadata } from "next";
import Link from "next/link";
import { getAllSampleReviews } from "@/lib/content";
import { GenerateSampleReviewCTA } from "@/components/GenerateSampleReviewCTA";

export const metadata: Metadata = {
  title: "Sample Technology Impact Reviews",
  description:
    "Curated Technology Impact Reviews for executives evaluating business change and technology consequences.",
};

export default function SampleReviewsPage() {
  const reviews = getAllSampleReviews();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          Sample Reviews
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          Technology Impact Reviews
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Curated reviews that show what executives receive after a guided assessment —
          structured implications, blind spots, and sequencing before vendor evaluation
          begins.
        </p>
      </div>

      <div className="mb-12 grid gap-4">
        {reviews.map((review) => (
          <Link
            key={review.slug}
            href={`/sample-reviews/${review.slug}`}
            className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-crimson/30 hover:bg-crimson-light/30"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium tracking-tight text-foreground group-hover:text-crimson">
                  {review.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{review.summary}</p>
                <time className="mt-3 block text-xs text-muted-light">
                  {new Date(review.publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex shrink-0 flex-col gap-2 text-sm text-muted">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-light">
                    Industry
                  </span>
                  <p className="mt-0.5 font-medium text-foreground">{review.industry}</p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-light">
                    Business Event
                  </span>
                  <p className="mt-0.5 font-medium text-foreground">{review.businessEvent}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <GenerateSampleReviewCTA />
    </div>
  );
}
