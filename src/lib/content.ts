import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { parseBusinessEvent } from "./parse-business-event";
import type { TechnologyImpactReview } from "./brief";
import type {
  BusinessEvent,
  Industry,
  ResearchArticle,
  ExecutiveBriefSample,
  SampleReview,
  SampleReviewContent,
  SampleReviewListing,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readMarkdownFiles(dir: string): { slug: string; data: matter.GrayMatterFile<string> }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      return { slug, data: matter(raw) };
    });
}

export function getAllBusinessEvents(): BusinessEvent[] {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "business-events"));
  return files
    .map(({ slug, data }) =>
      parseBusinessEvent(slug, data.data as Record<string, unknown>, data.content)
    )
    .sort((a, b) => a.order - b.order);
}

export function getBusinessEvent(slug: string): BusinessEvent | null {
  return getAllBusinessEvents().find((e) => e.slug === slug) ?? null;
}

export function getAllIndustries(): Industry[] {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "industries"));
  return files
    .map(({ slug, data }) => ({
      slug,
      title: data.data.title as string,
      shortDescription: data.data.shortDescription as string,
      technologyDomains: (data.data.technologyDomains as string[]) ?? [],
      relatedEvents: (data.data.relatedEvents as string[]) ?? [],
      content: data.content,
      order: (data.data.order as number) ?? 99,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getIndustry(slug: string): Industry | null {
  return getAllIndustries().find((i) => i.slug === slug) ?? null;
}

export function getAllResearch(): ResearchArticle[] {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "research"));
  return files
    .map(({ slug, data }) => ({
      slug,
      title: data.data.title as string,
      excerpt: data.data.excerpt as string,
      publishedAt: data.data.publishedAt as string,
      technologyDomains: (data.data.technologyDomains as string[]) ?? [],
      content: data.content,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getResearchArticle(slug: string): ResearchArticle | null {
  return getAllResearch().find((r) => r.slug === slug) ?? null;
}

function parsePublishedReview(data: Record<string, unknown>): TechnologyImpactReview {
  const review = data.review as Record<string, unknown>;
  const roadmap = review.roadmap as Record<string, string[]>;

  return {
    title: review.title as string,
    eventTitle: review.eventTitle as string,
    industryTitle: review.industryTitle as string | undefined,
    generatedAt: review.generatedAt as string,
    executiveObservation:
      (review.executiveObservation as string | undefined) ??
      (review.executiveSummary as string),
    whatWeHeard: review.whatWeHeard as string[],
    likelyImpacts: review.likelyImpacts as string[],
    blindSpots: review.blindSpots as string[],
    questionsToExplore: review.questionsToExplore as string[],
    areasToExploreNext: review.areasToExploreNext as string[],
    roadmap: {
      immediate: roadmap.immediate,
      next30Days: roadmap.next30Days,
      next90Days: roadmap.next90Days,
    },
    nextConversation: review.nextConversation as string,
    ctaLabel: review.ctaLabel as string,
  };
}

export function getAllExecutiveBriefSamples(): ExecutiveBriefSample[] {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "executive-briefs"));
  return files
    .map(({ slug, data }) => ({
      slug,
      title: data.data.title as string,
      eventSlug: data.data.eventSlug as string,
      industrySlug: data.data.industrySlug as string | undefined,
      excerpt: data.data.excerpt as string,
      publishedAt: data.data.publishedAt as string,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getExecutiveBriefSample(
  slug: string
): (ExecutiveBriefSample & { review: TechnologyImpactReview }) | null {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "executive-briefs"));
  const match = files.find((file) => file.slug === slug);
  if (!match || !match.data.data.review) return null;

  return {
    slug: match.slug,
    title: match.data.data.title as string,
    eventSlug: match.data.data.eventSlug as string,
    industrySlug: match.data.data.industrySlug as string | undefined,
    excerpt: match.data.data.excerpt as string,
    publishedAt: match.data.data.publishedAt as string,
    review: parsePublishedReview(match.data.data as Record<string, unknown>),
  };
}

function parseSampleReviewListing(
  filenameSlug: string,
  data: Record<string, unknown>
): SampleReviewListing {
  return {
    slug: (data.slug as string | undefined) ?? filenameSlug,
    title: data.title as string,
    industry: data.industry as string,
    businessEvent: data.businessEvent as string,
    summary: data.summary as string,
    publishedDate: data.publishedDate as string,
    featured: Boolean(data.featured),
  };
}

function parseSampleReviewContent(data: Record<string, unknown>): SampleReviewContent {
  const review = data.review as Record<string, unknown>;
  const sequencing =
    (review.suggestedSequencing as Record<string, string[]> | undefined) ??
    (review.roadmap as Record<string, string[]> | undefined) ??
    { immediate: [], next30Days: [], next90Days: [] };

  return {
    executiveSummary:
      (review.executiveSummary as string | undefined) ??
      (review.executiveObservation as string),
    executiveObservations:
      (review.executiveObservations as string[] | undefined) ??
      (review.whatWeHeard as string[]),
    commonBlindSpots:
      (review.commonBlindSpots as string[] | undefined) ?? (review.blindSpots as string[]),
    technologyImplications:
      (review.technologyImplications as string[] | undefined) ??
      (review.likelyImpacts as string[]),
    questionsToExplore: review.questionsToExplore as string[],
    suggestedSequencing: {
      immediate: sequencing.immediate,
      next30Days: sequencing.next30Days,
      next90Days: sequencing.next90Days,
    },
    recommendedNextConversation:
      (review.recommendedNextConversation as string | undefined) ??
      (review.nextConversation as string),
  };
}

function readSampleReviewFiles() {
  return readMarkdownFiles(path.join(CONTENT_DIR, "sample-reviews"));
}

export function getAllSampleReviews(): SampleReviewListing[] {
  return readSampleReviewFiles()
    .map(({ slug, data }) => parseSampleReviewListing(slug, data.data as Record<string, unknown>))
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
}

export function getSampleReview(slug: string): SampleReview | null {
  const match = readSampleReviewFiles().find((file) => {
    const listing = parseSampleReviewListing(file.slug, file.data.data as Record<string, unknown>);
    return listing.slug === slug;
  });

  if (!match || !match.data.data.review) return null;

  const listing = parseSampleReviewListing(match.slug, match.data.data as Record<string, unknown>);

  return {
    ...listing,
    review: parseSampleReviewContent(match.data.data as Record<string, unknown>),
  };
}

export function getFeaturedSampleReviews(limit = 3): SampleReviewListing[] {
  return getAllSampleReviews()
    .filter((review) => review.featured)
    .slice(0, limit);
}
