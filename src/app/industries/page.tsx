import type { Metadata } from "next";
import { getAllIndustries } from "@/lib/content";
import { IndustryCard } from "@/components/IndustryCard";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Technology context for multi-location organizations across key industries.",
};

export default function IndustriesPage() {
  const industries = getAllIndustries();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          Industries
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          Industry context for technology strategy
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Industries provide context for how business events create technology
          implications. Each sector has distinct pressures, regulations, and
          operational patterns.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <IndustryCard
            key={industry.slug}
            slug={industry.slug}
            title={industry.title}
            shortDescription={industry.shortDescription}
            technologyDomains={industry.technologyDomains}
          />
        ))}
      </div>
    </div>
  );
}
