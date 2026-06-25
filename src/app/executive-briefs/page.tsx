import type { Metadata } from "next";
import Link from "next/link";
import { getAllExecutiveBriefSamples } from "@/lib/content";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Sample Technology Impact Reviews",
  description:
    "Sample Technology Impact Reviews generated from guided technology strategy conversations.",
};

export default function ExecutiveBriefsPage() {
  const briefs = getAllExecutiveBriefSamples();

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
          These samples show what executives receive after a guided conversation —
          structured implications, blind spots, and sequencing — before any vendor
          evaluation begins.
        </p>
      </div>

      <div className="mb-12 grid gap-4">
        {briefs.map((brief) => (
          <Link
            key={brief.slug}
            href={`/executive-briefs/${brief.slug}`}
            className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-crimson/30 hover:bg-crimson-light/30"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-crimson">
                  Technology Impact Review
                </p>
                <h2 className="mt-1 font-serif text-xl font-medium tracking-tight text-foreground group-hover:text-crimson">
                  {brief.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {brief.excerpt}
                </p>
                <time className="mt-3 block text-xs text-muted-light">
                  {new Date(brief.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <span className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted capitalize">
                  {brief.eventSlug.replace(/-/g, " ")}
                </span>
                {brief.industrySlug && (
                  <span className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted capitalize">
                    {brief.industrySlug.replace(/-/g, " ")}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-crimson/20 bg-crimson-light px-8 py-12 text-center">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">
          Generate your own Technology Impact Review
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Answer a few questions about what changed in your organization and
          receive a personalized review in minutes.
        </p>
        <div className="mt-6">
          <CTAButton href="/">What&apos;s changed?</CTAButton>
        </div>
      </div>
    </div>
  );
}
