import type { ContentType, SiteSection } from "./types";

/** Editorial System + Quality Checklist */
export const QUICK_ANSWER_MIN_WORDS = 40;
export const QUICK_ANSWER_MAX_WORDS = 80;
export const FAQ_MIN_COUNT = 4;
export const FAQ_MAX_COUNT = 8;

export const FORBIDDEN_PHRASES = [
  "best-in-class",
  "industry-leading",
  "enterprise-grade",
  "powerful",
  "robust",
  "innovative",
  "revolutionary",
  "comprehensive",
  "seamless",
  "cutting-edge",
  "game-changing",
  "world-class",
  "leverage",
  "utilize",
  "facilitate",
] as const;

/** KNOWLEDGE_GRAPH.md + SEO_SYSTEM.md internal linking quotas */
export const LINK_QUOTAS = {
  guides: 3,
  problems: 2,
  technologies: 2,
  tools: 1,
  comparisons: 1,
  research: 1,
} as const;

/** CONTENT_ARCHITECTURE.md required metadata fields */
export const REQUIRED_METADATA_FIELDS = [
  "title",
  "slug",
  "description",
  "contentType",
  "primaryKeyword",
  "secondaryKeywords",
  "buyerStage",
] as const;

export const RECOMMENDED_METADATA_FIELDS = [
  "searchIntent",
  "readingTime",
  "persona",
  "industry",
  "technology",
  "businessProblem",
  "cta",
] as const;

/** Content types that use the full Decision Guide template */
export const DECISION_GUIDE_CONTENT_TYPES: ContentType[] = [
  "industry-hub",
  "industry-topic",
  "technology",
  "decision-guide",
  "problem",
  "tool",
  "buying-guide",
  "comparison",
  "checklist",
  "assessment",
  "research-report",
  "resource",
];

export function requiresDecisionGuide(contentType: ContentType): boolean {
  return DECISION_GUIDE_CONTENT_TYPES.includes(contentType);
}

/** DESIGN_SYSTEM.md + EDITORIAL_SYSTEM.md section order */
export const EDITORIAL_SECTIONS = [
  "quickAnswer",
  "decisionBox",
  "whyYoureHere",
  "whatProblemSolves",
  "alternatives",
  "questionsToAsk",
  "realityCheck",
  "worthKnowing",
  "decisionMatrix",
  "askBeforeYouBuy",
  "bottomLine",
  "faqs",
] as const;

export const EMPTY_SECTION_MESSAGE = "More research is being added.";

export const SECTION_TO_GRAPH_CATEGORY: Record<SiteSection, keyof typeof LINK_QUOTAS | null> = {
  industries: "guides",
  problems: "problems",
  technologies: "technologies",
  tools: "tools",
  comparisons: "comparisons",
  research: "research",
  resources: "guides",
};
