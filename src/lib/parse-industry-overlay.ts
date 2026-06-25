import type { IndustryOverlay, IndustryOverlayRoadmap } from "./context/types";

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
  return items.length > 0 ? items : undefined;
}

function parseRoadmap(value: unknown): IndustryOverlayRoadmap | undefined {
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  const roadmap: IndustryOverlayRoadmap = {};

  const immediate = asStringArray(record.immediate);
  const next30Days = asStringArray(record.next_30_days ?? record.next30Days);
  const next90Days = asStringArray(record.next_90_days ?? record.next90Days);

  if (immediate) roadmap.immediate = immediate;
  if (next30Days) roadmap.next30Days = next30Days;
  if (next90Days) roadmap.next90Days = next90Days;

  return Object.keys(roadmap).length > 0 ? roadmap : undefined;
}

export function parseIndustryOverlay(
  eventSlug: string,
  industrySlug: string,
  frontmatter: Record<string, unknown>
): IndustryOverlay | null {
  const event = asString(frontmatter.event) ?? eventSlug;
  const industry = asString(frontmatter.industry) ?? industrySlug;

  const framingSource = frontmatter.framing;
  const framing =
    framingSource && typeof framingSource === "object"
      ? {
          executiveSummaryPrefix: asString(
            (framingSource as Record<string, unknown>).executive_summary_prefix ??
              (framingSource as Record<string, unknown>).executiveSummaryPrefix
          ),
          executiveSummarySuffix: asString(
            (framingSource as Record<string, unknown>).executive_summary_suffix ??
              (framingSource as Record<string, unknown>).executiveSummarySuffix
          ),
        }
      : undefined;

  const overlay: IndustryOverlay = { event, industry };

  if (framing?.executiveSummaryPrefix || framing?.executiveSummarySuffix) {
    overlay.framing = framing;
  }

  const likelyImpacts = asStringArray(
    frontmatter.likely_impacts ?? frontmatter.likelyImpacts
  );
  if (likelyImpacts) overlay.likelyImpacts = likelyImpacts;

  const blindSpots = asStringArray(frontmatter.blind_spots ?? frontmatter.blindSpots);
  if (blindSpots) overlay.blindSpots = blindSpots;

  const questionsToExplore = asStringArray(
    frontmatter.questions_to_explore ?? frontmatter.questionsToExplore
  );
  if (questionsToExplore) overlay.questionsToExplore = questionsToExplore;

  const domainEmphasis = asStringArray(
    frontmatter.domain_emphasis ?? frontmatter.domainEmphasis
  );
  if (domainEmphasis) overlay.domainEmphasis = domainEmphasis;

  const roadmapAdjustments = parseRoadmap(
    frontmatter.roadmap_adjustments ?? frontmatter.roadmapAdjustments
  );
  if (roadmapAdjustments) overlay.roadmapAdjustments = roadmapAdjustments;

  const hasContent =
    overlay.framing ||
    overlay.likelyImpacts ||
    overlay.blindSpots ||
    overlay.questionsToExplore ||
    overlay.domainEmphasis ||
    overlay.roadmapAdjustments;

  return hasContent ? overlay : null;
}
