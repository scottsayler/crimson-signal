import type { DecisionGuideSource } from "./decision-guide";
import type { PageStatus, SitePage } from "./types";

export type PublishablePage = SitePage & {
  decisionGuideSource?: DecisionGuideSource;
};

/** Resolves whether a page is published from YAML flags and decision-guide source. */
export function resolvePagePublish(
  page: SitePage,
  decisionGuideSource?: DecisionGuideSource
): boolean {
  if (page.status === "draft") return false;
  if (page.publish === false) return false;
  if (page.publish === true) return true;
  return decisionGuideSource === "explicit";
}

/** Whether a processed page is publicly routable and indexable. */
export function isPagePublic(page: PublishablePage): boolean {
  if (page.status === "draft") return false;
  return page.publish === true;
}

/** Whether a page contains scaffold or placeholder body content. */
export function hasPlaceholderContent(page: PublishablePage): boolean {
  if (page.sections?.some((section) => section.body.includes("[Placeholder]"))) {
    return true;
  }
  return page.decisionGuideSource === "scaffold";
}

/** Whether a page may be added as an auto-enriched internal link target. */
export function isEligibleForAutoLink(page: PublishablePage): boolean {
  return isPagePublic(page) && !hasPlaceholderContent(page);
}

export function filterPublicPaths(
  paths: string[],
  pathToPage: Map<string, PublishablePage>
): string[] {
  return paths.filter((path) => {
    const target = pathToPage.get(path);
    return target ? isPagePublic(target) : false;
  });
}
