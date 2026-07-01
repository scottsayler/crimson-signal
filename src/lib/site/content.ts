import fs from "fs";
import path from "path";
import yaml from "yaml";
import type {
  RelatedContentItem,
  ResolvedRelatedContent,
  SitePage,
  SiteSection,
} from "./types";
import {
  CONTENT_TYPE_LABELS,
  getSitePageUrl,
  parsePagePath,
  sectionFromPath,
} from "./types";
import { processSitePage, type CachedPage } from "./pipeline";
import { isPagePublic } from "./publish";
import { formatQualityReport, validateAllPages } from "./validate";

const SITE_CONTENT_DIR = path.join(process.cwd(), "content", "site");

const SECTION_FILES: SiteSection[] = [
  "industries",
  "technologies",
  "tools",
  "research",
  "comparisons",
  "resources",
];

function readSectionPages(section: SiteSection): (SitePage & { section: SiteSection })[] {
  const filePath = path.join(SITE_CONTENT_DIR, `${section}.yaml`);
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = yaml.parse(raw) as { pages: SitePage[] };
  return (data.pages ?? []).map((page) => ({ ...page, section }));
}

function readIndustryClusterPages(): (SitePage & { section: SiteSection })[] {
  const clusterDir = path.join(SITE_CONTENT_DIR, "industries");
  if (!fs.existsSync(clusterDir)) return [];

  return fs
    .readdirSync(clusterDir)
    .filter((f) => f.endsWith(".yaml"))
    .flatMap((filename) => {
      const parentIndustry = filename.replace(/\.yaml$/, "");
      const raw = fs.readFileSync(path.join(clusterDir, filename), "utf-8");
      const data = yaml.parse(raw) as { pages: SitePage[] };
      return (data.pages ?? []).map((page) => ({
        ...page,
        section: "industries" as const,
        parentIndustry,
        industry: page.industry ?? parentIndustry,
      }));
    });
}

function parseProblemPageFile(
  data: unknown,
  filename: string
): SitePage {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid problem page file: content/site/problems/${filename}`);
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.pages)) {
    const pages = record.pages as SitePage[];
    if (pages.length !== 1) {
      throw new Error(
        `Problem file content/site/problems/${filename} must contain exactly one page entry`
      );
    }
    return pages[0];
  }

  if (typeof record.slug === "string") {
    return record as unknown as SitePage;
  }

  throw new Error(`Invalid problem page file: content/site/problems/${filename}`);
}

function readProblemPages(): (SitePage & { section: SiteSection })[] {
  const problemsDir = path.join(SITE_CONTENT_DIR, "problems");
  if (!fs.existsSync(problemsDir)) return [];

  const slugSources = new Map<string, string>();
  const pages: (SitePage & { section: SiteSection })[] = [];

  for (const filename of fs
    .readdirSync(problemsDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort()) {
    const filePath = path.join(problemsDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const page = parseProblemPageFile(yaml.parse(raw), filename);
    const expectedFilename = `${page.slug}.yaml`;

    if (filename !== expectedFilename) {
      throw new Error(
        `Problem file content/site/problems/${filename} slug "${page.slug}" does not match filename (expected ${expectedFilename})`
      );
    }

    const prior = slugSources.get(page.slug);
    if (prior) {
      throw new Error(
        `Duplicate problem slug "${page.slug}" in content/site/problems/${prior} and content/site/problems/${filename}`
      );
    }

    slugSources.set(page.slug, filename);
    pages.push({ ...page, section: "problems" });
  }

  return pages;
}

function readAllRawPages(): (SitePage & { section: SiteSection })[] {
  const pages: (SitePage & { section: SiteSection })[] = [];

  for (const section of SECTION_FILES) {
    pages.push(...readSectionPages(section));
  }

  pages.push(...readProblemPages());
  pages.push(...readIndustryClusterPages());
  return pages;
}

function cacheKey(page: SitePage & { section: SiteSection }): string {
  if (page.parentIndustry) {
    return `industries/${page.parentIndustry}/${page.slug}`;
  }
  return `${page.section}/${page.slug}`;
}

let pageCache: Map<string, CachedPage> | null = null;

function buildPageCache(): Map<string, CachedPage> {
  const rawPages = readAllRawPages();
  const cache = new Map<string, CachedPage>();

  const pageKeys = new Map<string, string>();
  for (const raw of rawPages) {
    const key = cacheKey(raw);
    const prior = pageKeys.get(key);
    if (prior) {
      throw new Error(`Duplicate site page slug "${key}"`);
    }
    pageKeys.set(key, key);
  }

  const resolvePath = (pathStr: string): CachedPage | null => {
    const parsed = parsePagePath(pathStr);
    if (!parsed) return null;

    const key = parsed.topic
      ? `industries/${parsed.slug}/${parsed.topic}`
      : `${parsed.section}/${parsed.slug}`;

    return cache.get(key) ?? null;
  };

  const toRelatedItem = (page: CachedPage): RelatedContentItem => ({
    href: getSitePageUrl(page),
    title: page.title,
    description: page.description,
    contentType: page.contentType,
    section: page.section,
    readingTime: page.readingTime,
  });

  for (const raw of rawPages) {
    const processed = processSitePage(
      raw,
      raw.section,
      rawPages as CachedPage[],
      resolvePath,
      toRelatedItem
    );
    cache.set(cacheKey(processed), processed);
  }

  runQualityGate(Array.from(cache.values()), resolvePath, toRelatedItem);

  return cache;
}

function runQualityGate(
  pages: CachedPage[],
  resolvePath: (path: string) => CachedPage | null,
  toRelatedItem: (page: CachedPage) => RelatedContentItem
): void {
  const reports = validateAllPages(pages, resolvePath, toRelatedItem);
  const strict = process.env.SITE_CONTENT_STRICT === "true";
  const published = reports.filter((r) => r.publish);
  const failures = published.filter((r) => r.errors.length > 0);

  if (failures.length > 0) {
    const message = failures.map(formatQualityReport).join("\n\n");
    if (strict) {
      throw new Error(
        `Site content quality gate failed for ${failures.length} published page(s):\n\n${message}`
      );
    }
    console.warn(
      `[crimson-signal] ${failures.length} published page(s) have quality issues:\n\n${message}`
    );
  }

  const warnings = reports.filter((r) => r.issueCount > 0 && !r.publish);
  if (warnings.length > 0 && process.env.NODE_ENV !== "production") {
    console.info(
      `[crimson-signal] ${warnings.length} draft page(s) have quality warnings (expected during authoring).`
    );
  }
}

function getCache(): Map<string, CachedPage> {
  if (!pageCache) pageCache = buildPageCache();
  return pageCache;
}

export function getPagesBySection(section: SiteSection): CachedPage[] {
  return Array.from(getCache().values())
    .filter(
      (page) =>
        page.section === section && !page.parentIndustry && isPagePublic(page)
    )
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getIndustryTopics(industrySlug: string): CachedPage[] {
  return Array.from(getCache().values())
    .filter(
      (page) => page.parentIndustry === industrySlug && isPagePublic(page)
    )
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getSitePage(
  section: SiteSection,
  slug: string
): CachedPage | null {
  const page = getCache().get(`${section}/${slug}`) ?? null;
  return page && isPagePublic(page) ? page : null;
}

export function getIndustryTopic(
  industrySlug: string,
  topicSlug: string
): CachedPage | null {
  const page = getCache().get(`industries/${industrySlug}/${topicSlug}`) ?? null;
  return page && isPagePublic(page) ? page : null;
}

export function getAllSitePages(): CachedPage[] {
  return Array.from(getCache().values());
}

export function getPublishedSitePages(): CachedPage[] {
  return getAllSitePages().filter((page) => isPagePublic(page));
}

export function resolveRelatedContent(page: SitePage): ResolvedRelatedContent {
  const cache = getCache();
  const cached = Array.from(cache.values()).find(
    (p) => p.slug === page.slug && p.section === (page as CachedPage).section
  );

  const paths = cached?.relatedEntities ?? page.relatedEntities ?? [];

  const result: ResolvedRelatedContent = {
    guides: [],
    problems: [],
    technologies: [],
    tools: [],
    comparisons: [],
    research: [],
  };

  const seen = new Set<string>();

  for (const pathStr of paths) {
    if (seen.has(pathStr)) continue;
    seen.add(pathStr);

    const parsed = parsePagePath(pathStr);
    if (!parsed) continue;

    const key = parsed.topic
      ? `industries/${parsed.slug}/${parsed.topic}`
      : `${parsed.section}/${parsed.slug}`;

    const related = cache.get(key);
    if (!related || !isPagePublic(related)) continue;

    const section = sectionFromPath(pathStr);
    if (!section) continue;

    const item: RelatedContentItem = {
      href: getSitePageUrl(related),
      title: related.title,
      description: related.description,
      contentType: related.contentType,
      section: related.section,
      readingTime: related.readingTime,
    };

    switch (section) {
      case "industries":
        result.guides.push(item);
        break;
      case "problems":
        result.problems.push(item);
        break;
      case "technologies":
        result.technologies.push(item);
        break;
      case "tools":
        result.tools.push(item);
        break;
      case "comparisons":
        result.comparisons.push(item);
        break;
      case "research":
        result.research.push(item);
        break;
      default:
        result.guides.push(item);
    }
  }

  return result;
}

/** @deprecated Use resolveRelatedContent */
export function resolveRelatedPages(
  page: SitePage
): { href: string; title: string; section: SiteSection }[] {
  const related = resolveRelatedContent(page);
  return [
    ...related.guides,
    ...related.problems,
    ...related.technologies,
    ...related.tools,
    ...related.comparisons,
    ...related.research,
  ].map((item) => ({
    href: item.href,
    title: item.title,
    section: item.section,
  }));
}

export { buildPageMetadata, getCanonicalUrl } from "./seo";
export { validateAllPages, formatQualityReport } from "./validate";
export type { PageQualityReport } from "./validate";

export const RESTAURANT_CLUSTER_LINKS = [
  { href: "/industries/restaurants", title: "Restaurants" },
  { href: "/industries/restaurants/networking", title: "Restaurant Networking" },
  { href: "/industries/restaurants/sd-wan", title: "Restaurant SD-WAN" },
  {
    href: "/industries/restaurants/downtime-cost-calculator",
    title: "Restaurant Downtime Cost Calculator",
  },
  {
    href: "/industries/restaurants/bandwidth-calculator",
    title: "Restaurant Bandwidth Calculator",
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
  { href: "/industries/restaurants/managed-it", title: "Restaurant Managed Network" },
  { href: "/problems/restaurant-internet-outages", title: "Internet Outages" },
  { href: "/technologies/sd-wan", title: "SD-WAN" },
  { href: "/technologies/managed-network", title: "Managed Network" },
  { href: "/technologies/pots-replacement", title: "POTS Replacement" },
  { href: "/tools/downtime-cost-calculator", title: "Downtime Cost Calculator" },
] as const;

export function isRestaurantClusterPage(page: SitePage): boolean {
  return (
    page.industry === "restaurants" ||
    page.parentIndustry === "restaurants" ||
    (page.relatedEntities ?? page.relatedPages ?? []).some((p) =>
      p.includes("/restaurants")
    )
  );
}

export function getContentTypeLabel(contentType: SitePage["contentType"]): string {
  return CONTENT_TYPE_LABELS[contentType] ?? "Guide";
}
