import type { Metadata } from "next";
import Link from "next/link";
import { getAllEvidence } from "@/lib/content";

export const metadata: Metadata = {
  title: "Evidence Library",
  description:
    "Synthesized research from publicly available implementation evidence and recurring industry observations.",
};

export default function EvidencePage() {
  const entries = getAllEvidence();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          Evidence Library
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          Synthesized implementation evidence
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Publicly available regulatory guidance, industry standards, and recurring
          observations from distributed organizations — synthesized into executive
          patterns, blind spots, and decision frameworks. This is not a vendor case
          study library.
        </p>
      </div>

      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/evidence/${entry.slug}`}
            className="group block py-8 transition-colors first:pt-0"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <time className="text-xs font-medium text-muted-light">
                  {new Date(entry.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-crimson">
                  {entry.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {entry.excerpt}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 md:max-w-xs md:justify-end">
                <span className="rounded-full bg-border-light px-2.5 py-0.5 text-[11px] font-medium text-muted">
                  {entry.industry}
                </span>
                <span className="rounded-full bg-border-light px-2.5 py-0.5 text-[11px] font-medium text-muted">
                  {entry.businessEvent}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
