import type { ReportSection } from "./types";

export const DEFAULT_INDUSTRY_MULTIPLIER = 1;

export const SECTION_LIMITS: Record<ReportSection, number> = {
  executiveObservation: 1,
  whatWeHeard: 5,
  likelyImpacts: 6,
  blindSpots: 5,
  questionsToExplore: 6,
  areasToExploreNext: 6,
  "roadmap.immediate": 4,
  "roadmap.next30Days": 4,
  "roadmap.next90Days": 4,
  nextConversation: 1,
};
