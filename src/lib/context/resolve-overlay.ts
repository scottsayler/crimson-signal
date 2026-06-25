import type { IndustryOverlay, IndustryOverlayRegistry } from "./types";

export function getIndustryOverlay(
  registry: IndustryOverlayRegistry,
  eventSlug: string,
  industrySlug: string | null | undefined
): IndustryOverlay | null {
  if (!industrySlug) return null;
  return registry[eventSlug]?.[industrySlug] ?? null;
}
