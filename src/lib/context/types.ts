import type { BusinessEvent } from "../types";
import type { ConversationAnswers } from "../conversation";

export interface IndustryContext {
  slug: string;
  title: string;
}

/**
 * Extensible context dimensions for report generation.
 * MVP collects industry only; additional dimensions are stubbed for future sprints.
 */
export interface ReportContextDimensions {
  industry?: IndustryContext | null;
  // role?: ExecutiveRoleContext | null;
  // priorities?: BusinessPriorityContext | null;
  // organization?: OrganizationContext | null;
}

export interface ReportContext {
  event: BusinessEvent;
  answers: ConversationAnswers;
  context: ReportContextDimensions;
}

export interface IndustryOverlayFraming {
  executiveSummaryPrefix?: string;
  executiveSummarySuffix?: string;
}

export interface IndustryOverlayRoadmap {
  immediate?: string[];
  next30Days?: string[];
  next90Days?: string[];
}

export interface IndustryOverlay {
  event: string;
  industry: string;
  framing?: IndustryOverlayFraming;
  likelyImpacts?: string[];
  blindSpots?: string[];
  questionsToExplore?: string[];
  domainEmphasis?: string[];
  roadmapAdjustments?: IndustryOverlayRoadmap;
}

/** event slug → industry slug → overlay */
export type IndustryOverlayRegistry = Record<string, Record<string, IndustryOverlay>>;
