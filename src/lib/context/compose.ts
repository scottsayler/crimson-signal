import type { TechnologyImpactReview } from "../brief";
import type { IndustryOverlay } from "./types";

function dedupeItems(items: string[]): string[] {
  return Array.from(new Set(items));
}

function mergeCapped(
  primary: string[],
  secondary: string[],
  max: number
): string[] {
  return dedupeItems([...secondary, ...primary]).slice(0, max);
}

function prependRoadmapItems(
  base: string[],
  additions: string[] | undefined,
  max: number
): string[] {
  if (!additions?.length) return base.slice(0, max);
  return dedupeItems([...additions, ...base]).slice(0, max);
}

export function applyIndustryOverlay(
  review: TechnologyImpactReview,
  overlay: IndustryOverlay | null
): TechnologyImpactReview {
  if (!overlay) return review;

  const likelyImpacts = mergeCapped(
    review.likelyImpacts,
    overlay.likelyImpacts ?? [],
    6
  );

  const blindSpots = mergeCapped(review.blindSpots, overlay.blindSpots ?? [], 5);

  const questionsToExplore = mergeCapped(
    review.questionsToExplore,
    overlay.questionsToExplore ?? [],
    6
  );

  let areasToExploreNext = review.areasToExploreNext;
  if (overlay.domainEmphasis?.length) {
    const emphasized = overlay.domainEmphasis;
    const remaining = areasToExploreNext.filter((area) => !emphasized.includes(area));
    areasToExploreNext = [...emphasized, ...remaining].slice(0, 6);
  }

  const roadmap = {
    immediate: prependRoadmapItems(
      review.roadmap.immediate,
      overlay.roadmapAdjustments?.immediate,
      4
    ),
    next30Days: prependRoadmapItems(
      review.roadmap.next30Days,
      overlay.roadmapAdjustments?.next30Days,
      4
    ),
    next90Days: prependRoadmapItems(
      review.roadmap.next90Days,
      overlay.roadmapAdjustments?.next90Days,
      4
    ),
  };

  return {
    ...review,
    likelyImpacts,
    blindSpots,
    questionsToExplore,
    areasToExploreNext,
    roadmap,
  };
}
