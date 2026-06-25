import type { Industry } from "../types";
import { getAllIndustries } from "../content";
import {
  CONTEXT_INDUSTRY_SLUGS,
  type ContextIndustrySlug,
} from "./context-industry-slugs";

export function getContextIndustries(): Industry[] {
  const industries = getAllIndustries();
  const order = new Map(CONTEXT_INDUSTRY_SLUGS.map((slug, index) => [slug, index]));

  return industries
    .filter((industry): industry is Industry & { slug: ContextIndustrySlug } =>
      CONTEXT_INDUSTRY_SLUGS.includes(industry.slug as ContextIndustrySlug)
    )
    .sort(
      (a, b) =>
        (order.get(a.slug as ContextIndustrySlug) ?? 99) -
        (order.get(b.slug as ContextIndustrySlug) ?? 99)
    );
}
