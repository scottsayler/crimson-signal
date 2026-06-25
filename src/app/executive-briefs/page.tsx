import type { Metadata } from "next";
import Link from "next/link";
import { getAllExecutiveBriefSamples } from "@/lib/content";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Executive Briefs",
  description:
    "Sample executive briefs generated from guided technology strategy conversations.",
};

export default function ExecutiveBriefsPage() {
  const briefs = getAllExecutiveBriefSamples();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          Executive Briefs
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          Structured technology intelligence
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Executive Briefs translate business events into technology
          implications, priorities, and recommended next steps. Generate your own
          through a guided conversation.
        </p>
      </div>

      <div className="mb-12 grid gap-4">
        {briefs.map((brief) => (
          <div
            key={brief.slug}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-crimson">
                  Executive Brief
                </p>
                <h2 className="mt-1 font-serif text-xl font-medium tracking-tight text-foreground">
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
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/business-events/${brief.eventSlug}`}
                  className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted capitalize transition-colors hover:bg-crimson-light hover:text-crimson"
                >
                  {brief.eventSlug.replace(/-/g, " ")}
                </Link>
                {brief.industrySlug && (
                  <Link
                    href={`/industries/${brief.industrySlug}`}
                    className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted capitalize transition-colors hover:bg-crimson-light hover:text-crimson"
                  >
                    {brief.industrySlug.replace(/-/g, " ")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-crimson/20 bg-crimson-light px-8 py-12 text-center">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">
          Generate your own Executive Brief
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Answer a few questions about what changed in your organization and
          receive a personalized brief in minutes.
        </p>
        <div className="mt-6">
          <CTAButton href="/">What&apos;s changed?</CTAButton>
        </div>
      </div>
    </div>
  );
}
