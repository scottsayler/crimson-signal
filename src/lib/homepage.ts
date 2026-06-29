import type { BusinessEvent, SampleReviewListing } from "./types";

export interface HomepageEventConfig {
  slug: string;
  title: string;
}

export const HOMEPAGE_EVENTS: HomepageEventConfig[] = [
  { slug: "opening-locations", title: "Opening New Locations" },
  { slug: "acquisition", title: "Acquisition or Merger" },
  { slug: "ai-initiative", title: "AI Initiative" },
  { slug: "rising-costs", title: "Technology Cost Reduction" },
  { slug: "microsoft-modernization", title: "Technology Modernization" },
  { slug: "outages", title: "Recurring Outages" },
  { slug: "leadership-change", title: "Leadership Change" },
];

export interface HomepageFeaturedReview {
  slug: string;
  title: string;
  industry: string;
  businessEvent: string;
  summary: string;
}

export const HOMEPAGE_FEATURED_REVIEWS: HomepageFeaturedReview[] = [
  {
    slug: "restaurants-opening-locations",
    title: "Restaurant Expansion",
    industry: "Restaurants",
    businessEvent: "Opening New Locations",
    summary:
      "A 15-unit expansion exposed kitchen-POS integration gaps that risked guest experience from the first service.",
  },
  {
    slug: "healthcare-opening-locations",
    title: "Healthcare Merger",
    industry: "Healthcare",
    businessEvent: "Acquisition or Merger",
    summary:
      "A regional clinic integration revealed clinical system fragmentation and HIPAA gaps that threatened continuity of care.",
  },
  {
    slug: "retail-opening-locations",
    title: "Retail AI Initiative",
    industry: "Retail",
    businessEvent: "AI Initiative",
    summary:
      "A chain-wide AI pilot surfaced data quality and governance gaps that would have undermined production deployment.",
  },
];

export function getHomepageEvents(events: BusinessEvent[]): BusinessEvent[] {
  const bySlug = new Map(events.map((event) => [event.slug, event]));

  return HOMEPAGE_EVENTS.map((config) => bySlug.get(config.slug))
    .filter((event): event is BusinessEvent => event !== undefined);
}

export function getHomepageEventTitle(
  slug: string,
  fallback: string
): string {
  return HOMEPAGE_EVENTS.find((event) => event.slug === slug)?.title ?? fallback;
}

export function resolveHomepageFeaturedReviews(
  samples: SampleReviewListing[]
): HomepageFeaturedReview[] {
  const bySlug = new Map(samples.map((sample) => [sample.slug, sample]));

  return HOMEPAGE_FEATURED_REVIEWS.map((featured) => {
    const sample = bySlug.get(featured.slug);
    return {
      ...featured,
      summary: sample?.summary ?? featured.summary,
    };
  });
}
