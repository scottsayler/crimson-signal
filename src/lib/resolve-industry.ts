import type { Industry } from "./types";
import {
  isContextIndustrySlug,
} from "./context/context-industry-slugs";

export function resolveIndustry(
  industries: Industry[],
  urlSlug: string | null | undefined
): Industry | null {
  if (!urlSlug) return null;

  const normalized = urlSlug.trim().toLowerCase();
  if (!normalized || !isContextIndustrySlug(normalized)) {
    return null;
  }

  return industries.find((industry) => industry.slug === normalized) ?? null;
}

export function isValidIndustrySlug(
  industries: Industry[],
  urlSlug: string | null | undefined
): boolean {
  return resolveIndustry(industries, urlSlug) !== null;
}
