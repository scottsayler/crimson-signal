import type { EvidenceEntry, EvidenceReviewedItem } from "./types";

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
}

function parseEvidenceReviewed(value: unknown): EvidenceReviewedItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === "string") {
      return [{ source: item }];
    }

    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const source = asString(record.source);
      if (!source) return [];
      const note = asString(record.note);
      return note ? [{ source, note }] : [{ source }];
    }

    return [];
  });
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

export function parseEvidenceEntry(
  slug: string,
  frontmatter: Record<string, unknown>,
  content: string
): EvidenceEntry {
  return {
    slug: firstString(frontmatter.slug, slug) ?? slug,
    title: frontmatter.title as string,
    excerpt: firstString(frontmatter.excerpt, frontmatter.summary) as string,
    publishedAt: firstString(frontmatter.publishedAt, frontmatter.published_at) as string,
    industrySlug: firstString(frontmatter.industrySlug, frontmatter.industry_slug) as string,
    eventSlug: firstString(frontmatter.eventSlug, frontmatter.event_slug, frontmatter.businessEventSlug) as string,
    industryLabel: asString(frontmatter.industry),
    businessEventLabel: firstString(frontmatter.businessEvent, frontmatter.business_event),
    evidenceReviewed: parseEvidenceReviewed(
      frontmatter.evidenceReviewed ?? frontmatter.evidence_reviewed
    ),
    executivePatterns: firstStringArray(
      frontmatter.executivePatterns,
      frontmatter.executive_patterns,
      frontmatter.recurringExecutivePatterns,
      frontmatter.recurring_executive_patterns
    ),
    blindSpots: firstStringArray(frontmatter.blindSpots, frontmatter.blind_spots),
    outcomes: firstStringArray(
      frontmatter.outcomes,
      frontmatter.representativeOutcomes,
      frontmatter.representative_outcomes
    ),
    leadershipQuestions: firstStringArray(
      frontmatter.leadershipQuestions,
      frontmatter.leadership_questions,
      frontmatter.keyLeadershipQuestions,
      frontmatter.key_leadership_questions
    ),
    technologyDomains: firstStringArray(
      frontmatter.technologyDomains,
      frontmatter.technology_domains
    ),
    content,
    order: typeof frontmatter.order === "number" ? frontmatter.order : 99,
  };
}
