import type { BenchmarkEntry, BenchmarkRange } from "./types";

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    const parsed = asString(value);
    if (parsed) return parsed;
  }
  return undefined;
}

function firstStringArray(...values: unknown[]): string[] {
  for (const value of values) {
    const parsed = asStringArray(value);
    if (parsed) return parsed;
  }
  return [];
}

function parseBenchmarkRanges(value: unknown): BenchmarkRange[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === "string") {
      const [metric, range] = item.split(" — ").map((part) => part.trim());
      if (!metric || !range) return [];
      return [{ metric, range }];
    }

    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const metric = firstString(record.metric, record.label, record.name);
      const range = firstString(record.range, record.value, record.observation);
      if (!metric || !range) return [];
      const note = firstString(record.note, record.context, record.detail);
      return note ? [{ metric, range, note }] : [{ metric, range }];
    }

    return [];
  });
}

export function parseBenchmarkEntry(
  slug: string,
  frontmatter: Record<string, unknown>,
  content: string
): BenchmarkEntry {
  return {
    slug: firstString(frontmatter.slug, slug) ?? slug,
    title: frontmatter.title as string,
    excerpt: firstString(frontmatter.excerpt, frontmatter.summary) as string,
    publishedAt: firstString(frontmatter.publishedAt, frontmatter.published_at) as string,
    industrySlug: firstString(frontmatter.industrySlug, frontmatter.industry_slug) as string,
    eventSlug: firstString(frontmatter.eventSlug, frontmatter.event_slug, frontmatter.businessEventSlug) as string,
    industryLabel: asString(frontmatter.industry),
    businessEventLabel: firstString(frontmatter.businessEvent, frontmatter.business_event),
    ranges: parseBenchmarkRanges(
      frontmatter.ranges ??
        frontmatter.benchmarkRanges ??
        frontmatter.benchmark_ranges ??
        frontmatter.directionalBenchmarks ??
        frontmatter.directional_benchmarks
    ),
    maturityObservations: firstStringArray(
      frontmatter.maturityObservations,
      frontmatter.maturity_observations
    ),
    operationalPatterns: firstStringArray(
      frontmatter.operationalPatterns,
      frontmatter.operational_patterns,
      frontmatter.recurringOperationalPatterns,
      frontmatter.recurring_operational_patterns
    ),
    technologyDomains: firstStringArray(
      frontmatter.technologyDomains,
      frontmatter.technology_domains
    ),
    content,
    order: typeof frontmatter.order === "number" ? frontmatter.order : 99,
  };
}
