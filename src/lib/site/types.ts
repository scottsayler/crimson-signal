export type ContentType =
  | "industry-hub"
  | "industry-topic"
  | "technology"
  | "problem"
  | "tool"
  | "buying-guide"
  | "comparison"
  | "checklist"
  | "research-report";

export type BuyerStage =
  | "awareness"
  | "consideration"
  | "evaluation"
  | "decision";

export type Persona =
  | "it-director"
  | "cfo"
  | "operations"
  | "franchise-leader"
  | "store-operations"
  | "cio"
  | "procurement";

export interface PageSection {
  heading: string;
  body: string;
}

export interface ClusterLink {
  href: string;
  title: string;
  description?: string;
}

export interface ClusterContent {
  problemFraming: string;
  whoItIsFor: string;
  buyingTriggers: string;
  relatedTechnologies: ClusterLink[];
  relatedProblems: ClusterLink[];
  recommendedTools: ClusterLink[];
}

export interface SitePage {
  slug: string;
  title: string;
  description: string;
  contentType: ContentType;
  industry?: string;
  technology?: string;
  problem?: string;
  persona?: Persona | Persona[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  buyerStage: BuyerStage;
  relatedPages: string[];
  recommendedTool?: string;
  ctaLabel?: string;
  ctaHref?: string;
  order?: number;
  sections: PageSection[];
  parentIndustry?: string;
  cluster?: ClusterContent;
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
  problems: "Problems",
  tools: "Tools",
  research: "Research",
  comparisons: "Comparisons",
  resources: "Resources",
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  "industry-hub": "Industry",
  "industry-topic": "Restaurant Research",
  technology: "Technology",
  problem: "Problem",
  tool: "Tool",
  "buying-guide": "Buying Guide",
  comparison: "Comparison",
  checklist: "Checklist",
  "research-report": "Research Report",
};

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
  const nested = path.match(
    /^\/industries\/([^/]+)\/([^/]+)\/?$/
  );
  if (nested) {
    return { section: "industries", slug: nested[1], topic: nested[2] };
  }

  const top = path.match(
    /^\/(industries|technologies|problems|tools|research|comparisons|resources)\/([^/]+)\/?$/
  );
  if (!top) return null;
  return { section: top[1] as SiteSection, slug: top[2] };
}
