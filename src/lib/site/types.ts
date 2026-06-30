export type ContentType =
  | "industry-hub"
  | "industry-topic"
  | "technology"
  | "decision-guide"
  | "problem"
  | "tool"
  | "buying-guide"
  | "comparison"
  | "checklist"
  | "assessment"
  | "research-report"
  | "resource";

export type BuyerStage =
  | "awareness"
  | "consideration"
  | "evaluation"
  | "decision";

export type SearchIntent =
  | "informational"
  | "commercial-investigation"
  | "decision-support"
  | "implementation";

export type Persona =
  | "it-director"
  | "cfo"
  | "operations"
  | "franchise-leader"
  | "store-operations"
  | "cio"
  | "procurement"
  | "security"
  | "executive-leadership";

export interface PageSection {
  heading: string;
  body: string;
}

export interface ClusterLink {
  href: string;
  title: string;
  description?: string;
}

/** @deprecated Use DecisionGuide instead */
export interface ClusterContent {
  problemFraming: string;
  whoItIsFor: string;
  buyingTriggers: string;
  relatedTechnologies: ClusterLink[];
  relatedProblems: ClusterLink[];
  recommendedTools: ClusterLink[];
}

export interface ShouldConsider {
  evaluateIf: string[];
  probablyNotIf: string[];
}

export interface DecisionMatrixRow {
  situation: string;
  recommendation: string;
}

export interface EvidenceItem {
  title: string;
  finding: string;
  whyItMatters: string;
  source?: string;
}

export interface IndustrySnapshotData {
  topChallenges: string[];
  typicalEnvironment: string;
  commonPriorities: string[];
  buyingTriggers: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AlternativeItem {
  title: string;
  description: string;
}

export type PagePresentationMode = "cornerstone" | "decision-guide";

export interface EvidenceBehindGuideData {
  researchInputs: string[];
  recurringPatterns: string[];
  methodology: string;
}

export interface DecisionGuide {
  quickAnswer: string;
  whyYoureHere: string;
  shouldConsider: ShouldConsider;
  whatProblemSolves: string;
  realityCheck: string;
  alternatives: (string | AlternativeItem)[];
  questionsToAsk: string[];
  decisionMatrix?: DecisionMatrixRow[];
  worthKnowing?: string;
  askBeforeYouBuy?: string[];
  buyingTriggerTimeline?: string[];
  technologyStack?: string[];
  industrySnapshot?: IndustrySnapshotData;
  evidence?: EvidenceItem[];
  faqs?: FaqItem[];
  bottomLine?: string;
  crimsonSignalPerspective?: string;
  evidenceBehindGuide?: EvidenceBehindGuideData;
}

export interface PageCta {
  label: string;
  href: string;
}

export interface SitePage {
  slug: string;
  title: string;
  description: string;
  contentType: ContentType;
  industry?: string;
  technology?: string;
  businessProblem?: string;
  /** @deprecated Use businessProblem */
  problem?: string;
  persona?: Persona | Persona[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent?: SearchIntent;
  buyerStage: BuyerStage;
  readingTime?: number;
  relatedEntities?: string[];
  /** @deprecated Use relatedEntities and typed relations */
  relatedPages?: string[];
  relatedGuides?: string[];
  relatedProblems?: string[];
  relatedTechnologies?: string[];
  relatedTools?: string[];
  relatedComparisons?: string[];
  relatedResearch?: string[];
  cta?: PageCta;
  /** @deprecated Use cta */
  ctaLabel?: string;
  /** @deprecated Use cta */
  ctaHref?: string;
  recommendedTool?: string;
  order?: number;
  sections?: PageSection[];
  decisionGuide?: DecisionGuide;
  /** @deprecated Use decisionGuide */
  cluster?: ClusterContent;
  parentIndustry?: string;
  /** Cornerstone pillar pages use Executive Summary; decision guides use Decision Box */
  presentationMode?: PagePresentationMode;
  /** When true, page must pass full quality validation */
  publish?: boolean;
}

export type SiteSection =
  | "industries"
  | "technologies"
  | "problems"
  | "tools"
  | "research"
  | "comparisons"
  | "resources";

export const SECTION_LABELS: Record<SiteSection, string> = {
  industries: "Industries",
  technologies: "Technologies",
  problems: "Business Problems",
  tools: "Tools",
  research: "Research",
  comparisons: "Comparisons",
  resources: "Resources",
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  "industry-hub": "Industry Hub",
  "industry-topic": "Decision Guide",
  technology: "Decision Guide",
  "decision-guide": "Decision Guide",
  problem: "Business Problem",
  tool: "Tool",
  "buying-guide": "Buying Guide",
  comparison: "Comparison",
  checklist: "Checklist",
  assessment: "Assessment",
  "research-report": "Research Report",
  resource: "Resource",
};

export interface RelatedContentItem {
  href: string;
  title: string;
  description: string;
  contentType: ContentType;
  section: SiteSection;
  readingTime?: number;
}

export interface ResolvedRelatedContent {
  guides: RelatedContentItem[];
  problems: RelatedContentItem[];
  technologies: RelatedContentItem[];
  tools: RelatedContentItem[];
  comparisons: RelatedContentItem[];
  research: RelatedContentItem[];
}

export function getPageHref(section: SiteSection, slug: string): string {
  return `/${section}/${slug}`;
}

export function getSitePageUrl(page: SitePage & { section: SiteSection }): string {
  if (page.parentIndustry) {
    return `/industries/${page.parentIndustry}/${page.slug}`;
  }
  return `/${page.section}/${page.slug}`;
}

export function parsePagePath(
  path: string
): { section: SiteSection; slug: string; topic?: string } | null {
  const nested = path.match(/^\/industries\/([^/]+)\/([^/]+)\/?$/);
  if (nested) {
    return { section: "industries", slug: nested[1], topic: nested[2] };
  }

  const top = path.match(
    /^\/(industries|technologies|problems|tools|research|comparisons|resources)\/([^/]+)\/?$/
  );
  if (!top) return null;
  return { section: top[1] as SiteSection, slug: top[2] };
}

export function sectionFromPath(path: string): SiteSection | null {
  return parsePagePath(path)?.section ?? null;
}
