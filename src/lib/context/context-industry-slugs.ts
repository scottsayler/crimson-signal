/** Industries available in the guided conversation context step (MVP). */
export const CONTEXT_INDUSTRY_SLUGS = [
  "restaurants",
  "retail",
  "healthcare",
  "financial-services",
] as const;

export type ContextIndustrySlug = (typeof CONTEXT_INDUSTRY_SLUGS)[number];

export function isContextIndustrySlug(slug: string): slug is ContextIndustrySlug {
  return CONTEXT_INDUSTRY_SLUGS.includes(slug as ContextIndustrySlug);
}
