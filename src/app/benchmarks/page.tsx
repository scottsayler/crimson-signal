import type { Metadata } from "next";
import Link from "next/link";
import { getAllBenchmarks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "Directional industry benchmarks and operational observations for multi-location organizations.",
};

export default function BenchmarksPage() {
  const entries = getAllBenchmarks();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          Benchmarks
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          Directional industry benchmarks
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Operational ranges, maturity observations, and recurring patterns drawn
          from distributed organizations — organized by industry and business
          event. Reference points for executive planning, not precision scoring
          tools.
        </p>
      </div>

      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/benchmarks/${entry.slug}`}
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
                {entry.ranges.length > 0 && (
                  <p className="mt-3 text-xs text-muted-light">
                    {entry.ranges.length} directional benchmark
                    {entry.ranges.length === 1 ? "" : "s"}
                  </p>
                )}
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
