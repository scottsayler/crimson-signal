import type { ResolvedRelatedContent, SitePage, SiteSection } from "./types";
import { getSitePageUrl, parsePagePath, sectionFromPath } from "./types";
import { LINK_QUOTAS, SECTION_TO_GRAPH_CATEGORY } from "./standards";

type CachedPage = SitePage & { section: SiteSection };

function entityScore(source: CachedPage, candidate: CachedPage): number {
  if (source.slug === candidate.slug && source.section === candidate.section) {
    return -1;
  }

  let score = 0;

  if (source.industry && candidate.industry === source.industry) score += 3;
  if (source.technology && candidate.technology === source.technology) score += 4;
  const sourceProblem = source.businessProblem ?? source.problem;
  const candidateProblem = candidate.businessProblem ?? candidate.problem;
  if (sourceProblem && candidateProblem === sourceProblem) score += 4;
  if (source.parentIndustry && candidate.parentIndustry === source.parentIndustry) {
    score += 2;
  }
  if (source.parentIndustry && candidate.slug === source.parentIndustry) score += 3;

  const sharedKeywords = source.secondaryKeywords.filter((k) =>
    candidate.secondaryKeywords.some(
      (c) => c.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(c.toLowerCase())
    )
  );
  score += sharedKeywords.length;

  return score;
}

function categorizePath(pathStr: string): keyof ResolvedRelatedContent | null {
  const section = sectionFromPath(pathStr);
  if (!section) return null;
  return SECTION_TO_GRAPH_CATEGORY[section];
}

/**
 * Merges author-defined links with knowledge-graph recommendations
 * so every page meets minimum internal linking quotas.
 */
export function enrichRelatedEntities(
  page: CachedPage,
  allPages: CachedPage[],
  selfUrl: string
): string[] {
  const explicit = [...new Set(page.relatedEntities ?? [])];
  const explicitSet = new Set(explicit);

  const counts: Record<keyof ResolvedRelatedContent, number> = {
    guides: 0,
    problems: 0,
    technologies: 0,
    tools: 0,
    comparisons: 0,
    research: 0,
  };

  for (const path of explicit) {
    const category = categorizePath(path);
    if (category) counts[category]++;
  }

  const candidates = allPages
    .map((candidate) => ({
      href: getSitePageUrl(candidate),
      score: entityScore(page, candidate),
      category: categorizePath(getSitePageUrl(candidate)),
    }))
    .filter((c) => c.score > 0 && c.href !== selfUrl && c.category)
    .sort((a, b) => b.score - a.score);

  const enriched = [...explicit];

  for (const quota of Object.entries(LINK_QUOTAS) as [
    keyof ResolvedRelatedContent,
    number,
  ][]) {
    const [category, minimum] = quota;
    if (counts[category] >= minimum) continue;

    for (const candidate of candidates) {
      if (candidate.category !== category) continue;
      if (explicitSet.has(candidate.href)) continue;

      enriched.push(candidate.href);
      explicitSet.add(candidate.href);
      counts[category]++;

      if (counts[category] >= minimum) break;
    }
  }

  if (page.industry) {
    const hub = `/industries/${page.industry}`;
    if (!explicitSet.has(hub)) {
      enriched.unshift(hub);
      explicitSet.add(hub);
    }
  }

  return [...new Set(enriched)];
}

export function resolveRelatedContentFromPaths(
  paths: string[],
  resolvePath: (path: string) => CachedPage | null,
  toRelatedItem: (page: CachedPage) => ResolvedRelatedContent["guides"][number]
): ResolvedRelatedContent {
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

    const related = resolvePath(pathStr);
    if (!related) continue;

    const category = categorizePath(pathStr);
    if (!category) continue;

    result[category].push(toRelatedItem(related));
  }

  return result;
}

export function pathExistsInGraph(pathStr: string, allPages: CachedPage[]): boolean {
  const parsed = parsePagePath(pathStr);
  if (!parsed) return false;

  return allPages.some((page) => getSitePageUrl(page) === pathStr);
}
