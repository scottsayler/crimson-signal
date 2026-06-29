import fs from "fs";
import path from "path";
import yaml from "yaml";
import type { SitePage, SiteSection } from "./types";
import { getSitePageUrl, parsePagePath } from "./types";

const SITE_CONTENT_DIR = path.join(process.cwd(), "content", "site");

const SECTION_FILES: SiteSection[] = [
  "industries",
  "technologies",
  "problems",
  "tools",
  "research",
  "comparisons",
  "resources",
];

type CachedPage = SitePage & { section: SiteSection };

function normalizePage(page: SitePage): SitePage {
  return {
    ...page,
    relatedPages: page.relatedPages ?? [],
    secondaryKeywords: page.secondaryKeywords ?? [],
    sections: page.sections ?? [],
    cluster: page.cluster
      ? {
          ...page.cluster,
          relatedTechnologies: page.cluster.relatedTechnologies ?? [],
          relatedProblems: page.cluster.relatedProblems ?? [],
          recommendedTools: page.cluster.recommendedTools ?? [],
        }
      : undefined,
  };
}

function readSectionPages(section: SiteSection): SitePage[] {
  const filePath = path.join(SITE_CONTENT_DIR, `${section}.yaml`);
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = yaml.parse(raw) as { pages: SitePage[] };
  return (data.pages ?? []).map(normalizePage);
}

function readIndustryClusterPages(): SitePage[] {
  const clusterDir = path.join(SITE_CONTENT_DIR, "industries");
  if (!fs.existsSync(clusterDir)) return [];

  return fs
    .readdirSync(clusterDir)
    .filter((f) => f.endsWith(".yaml"))
    .flatMap((filename) => {
      const parentIndustry = filename.replace(/\.yaml$/, "");
      const raw = fs.readFileSync(path.join(clusterDir, filename), "utf-8");
      const data = yaml.parse(raw) as { pages: SitePage[] };
      return (data.pages ?? []).map((page) =>
        normalizePage({ ...page, parentIndustry, industry: page.industry ?? parentIndustry })
      );
    });
}

function cacheKey(page: SitePage & { section: SiteSection }): string {
  if (page.parentIndustry) {
    return `industries/${page.parentIndustry}/${page.slug}`;
  }
  return `${page.section}/${page.slug}`;
}

let pageCache: Map<string, CachedPage> | null = null;

function buildPageCache(): Map<string, CachedPage> {
  const cache = new Map<string, CachedPage>();

  for (const section of SECTION_FILES) {
    for (const page of readSectionPages(section)) {
      const cached = { ...page, section };
      cache.set(cacheKey(cached), cached);
    }
  }

  for (const page of readIndustryClusterPages()) {
    const cached = { ...page, section: "industries" as const };
    cache.set(cacheKey(cached), cached);
  }

  return cache;
}

function getCache(): Map<string, CachedPage> {
  if (!pageCache) pageCache = buildPageCache();
  return pageCache;
}

export function getPagesBySection(section: SiteSection): CachedPage[] {
  return Array.from(getCache().values())
    .filter((page) => page.section === section && !page.parentIndustry)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getIndustryTopics(industrySlug: string): CachedPage[] {
  return Array.from(getCache().values())
    .filter((page) => page.parentIndustry === industrySlug)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getSitePage(
  section: SiteSection,
  slug: string
): CachedPage | null {
  return getCache().get(`${section}/${slug}`) ?? null;
}

export function getIndustryTopic(
  industrySlug: string,
  topicSlug: string
): CachedPage | null {
  return getCache().get(`industries/${industrySlug}/${topicSlug}`) ?? null;
}

export function getAllSitePages(): CachedPage[] {
  return Array.from(getCache().values());
}

export function resolveRelatedPages(
  page: SitePage
): { href: string; title: string; section: SiteSection }[] {
  const cache = getCache();

  return page.relatedPages
    .map((relatedPath) => {
      const parsed = parsePagePath(relatedPath);
      if (!parsed) return null;

      const key = parsed.topic
        ? `industries/${parsed.slug}/${parsed.topic}`
        : `${parsed.section}/${parsed.slug}`;

      const related = cache.get(key);
      if (!related) return null;

      return {
        href: getSitePageUrl(related),
        title: related.title,
        section: related.section,
      };
    })
    .filter((item): item is { href: string; title: string; section: SiteSection } => item !== null);
}

export function buildPageMetadata(page: CachedPage) {
  return {
    title: page.title,
    description: page.description,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article" as const,
    },
  };
}

export const RESTAURANT_CLUSTER_LINKS = [
  { href: "/industries/restaurants", title: "Restaurants" },
  { href: "/industries/restaurants/networking", title: "Restaurant Networking" },
  {
    href: "/industries/restaurants/downtime-cost-calculator",
    title: "Restaurant Downtime Calculator",
  },
  { href: "/industries/restaurants/best-internet", title: "Best Internet for Restaurants" },
  {
    href: "/industries/restaurants/pots-replacement",
    title: "POTS Replacement for Restaurants",
  },
  {
    href: "/industries/restaurants/opening-technology-checklist",
    title: "Opening Technology Checklist",
  },
  { href: "/industries/restaurants/managed-it", title: "Restaurant Managed IT" },
  { href: "/problems/internet-outages", title: "Internet Outages" },
  { href: "/technologies/sd-wan", title: "SD-WAN" },
  { href: "/technologies/managed-network", title: "Managed Network" },
  { href: "/technologies/pots-replacement", title: "POTS Replacement" },
  { href: "/tools/downtime-cost-calculator", title: "Downtime Cost Calculator" },
] as const;

export function isRestaurantClusterPage(page: SitePage): boolean {
  return (
    page.industry === "restaurants" ||
    page.parentIndustry === "restaurants" ||
    page.relatedPages.some((p) => p.includes("/restaurants"))
  );
}
