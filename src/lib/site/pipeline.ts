import type { ClusterContent, DecisionGuide, SitePage, SiteSection } from "./types";
import {
  completeDecisionGuide,
  scaffoldDecisionGuide,
  type DecisionGuideSource,
} from "./decision-guide";
import { enrichRelatedEntities } from "./knowledge-graph";
import { requiresDecisionGuide } from "./standards";
import type { PageQualityReport } from "./validate";
import { validatePage } from "./validate";

type CachedPage = SitePage & {
  section: SiteSection;
  decisionGuideSource?: DecisionGuideSource;
  quality?: PageQualityReport;
};

function parseBulletList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function clusterToDecisionGuide(
  cluster: ClusterContent,
  page: SitePage
): DecisionGuide {
  return {
    quickAnswer: page.description,
    whyYoureHere: cluster.buyingTriggers,
    shouldConsider: {
      evaluateIf: parseBulletList(cluster.whoItIsFor),
      probablyNotIf: [],
    },
    whatProblemSolves: cluster.problemFraming,
    realityCheck:
      "Many organizations researching this topic do not need a major technology change. Start with the business problem and outage cost before evaluating vendors.",
    alternatives: [],
    questionsToAsk: [],
    buyingTriggerTimeline: parseBulletList(cluster.buyingTriggers),
  };
}

function inferSearchIntent(page: SitePage): SitePage["searchIntent"] {
  if (page.searchIntent) return page.searchIntent;

  switch (page.contentType) {
    case "problem":
      return "decision-support";
    case "tool":
    case "assessment":
      return "decision-support";
    case "comparison":
      return "commercial-investigation";
    case "checklist":
    case "resource":
      return "implementation";
    case "research-report":
      return "informational";
    default:
      return "decision-support";
  }
}

function normalizeCta(page: SitePage): SitePage["cta"] {
  if (page.cta) return page.cta;
  if (page.ctaLabel && page.ctaHref) {
    return { label: page.ctaLabel, href: page.ctaHref };
  }
  if (page.recommendedTool) {
    return { label: "Explore recommended tool", href: page.recommendedTool };
  }
  return undefined;
}

function collectRelatedPaths(page: SitePage): string[] {
  return [
    ...(page.relatedEntities ?? []),
    ...(page.relatedPages ?? []),
    ...(page.relatedGuides ?? []),
    ...(page.relatedProblems ?? []),
    ...(page.relatedTechnologies ?? []),
    ...(page.relatedTools ?? []),
    ...(page.relatedComparisons ?? []),
    ...(page.relatedResearch ?? []),
    ...(page.cluster?.relatedTechnologies.map((l) => l.href) ?? []),
    ...(page.cluster?.relatedProblems.map((l) => l.href) ?? []),
    ...(page.cluster?.recommendedTools.map((l) => l.href) ?? []),
  ];
}

function estimateReadingTime(guide?: DecisionGuide, sections?: SitePage["sections"]): number {
  const text = [
    guide?.quickAnswer,
    guide?.whyYoureHere,
    guide?.whatProblemSolves,
    guide?.realityCheck,
    guide?.worthKnowing,
    guide?.bottomLine,
    ...(guide?.shouldConsider.evaluateIf ?? []),
    ...(guide?.shouldConsider.probablyNotIf ?? []),
    ...(guide?.questionsToAsk ?? []),
    ...(guide?.faqs?.map((f) => f.answer) ?? []),
    ...(sections?.map((s) => s.body) ?? []),
  ]
    .filter(Boolean)
    .join(" ");

  const words = text.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

function resolveDecisionGuide(
  page: SitePage
): { guide?: DecisionGuide; source?: DecisionGuideSource } {
  if (page.decisionGuide) {
    return { guide: page.decisionGuide, source: "explicit" };
  }

  if (page.cluster) {
    return { guide: clusterToDecisionGuide(page.cluster, page), source: "cluster" };
  }

  if (requiresDecisionGuide(page.contentType)) {
    return { guide: scaffoldDecisionGuide(page), source: "scaffold" };
  }

  return {};
}

/**
 * Full content pipeline: normalize metadata, complete decision guides,
 * enrich knowledge graph links, and attach quality validation.
 */
export function processSitePage(
  page: SitePage,
  section: SiteSection,
  allPages: CachedPage[],
  resolvePath: (path: string) => CachedPage | null,
  toRelatedItem: (page: CachedPage) => { href: string }
): CachedPage {
  const businessProblem = page.businessProblem ?? page.problem;
  const { guide: rawGuide, source } = resolveDecisionGuide(page);

  const decisionGuide =
    rawGuide && requiresDecisionGuide(page.contentType)
      ? completeDecisionGuide(rawGuide, page)
      : rawGuide;

  const baseRelated = [...new Set(collectRelatedPaths(page))];
  const selfUrl = page.parentIndustry
    ? `/industries/${page.parentIndustry}/${page.slug}`
    : `/${section}/${page.slug}`;

  const interim: CachedPage = {
    ...page,
    section,
    businessProblem,
    searchIntent: inferSearchIntent(page),
    relatedEntities: baseRelated,
    secondaryKeywords: page.secondaryKeywords ?? [],
    sections: page.sections ?? [],
    decisionGuide,
    decisionGuideSource: source,
    readingTime: page.readingTime ?? estimateReadingTime(decisionGuide, page.sections),
    cta: normalizeCta(page),
    publish: page.publish ?? source === "explicit",
    cluster: page.cluster
      ? {
          ...page.cluster,
          relatedTechnologies: page.cluster.relatedTechnologies ?? [],
          relatedProblems: page.cluster.relatedProblems ?? [],
          recommendedTools: page.cluster.recommendedTools ?? [],
        }
      : undefined,
  };

  interim.relatedEntities = enrichRelatedEntities(interim, allPages, selfUrl);
  interim.quality = validatePage(interim, resolvePath, toRelatedItem);

  return interim;
}

export type { CachedPage };
