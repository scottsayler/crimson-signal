import type { IndustryOverlay, IndustryOverlayRegistry, ReportContext } from "./context/types";
import { applyIndustryOverlay } from "./context/compose";
import { getIndustryOverlay } from "./context/resolve-overlay";
import {
  composeReport,
  runPatternEngine,
  polishReview,
  type PatternEngineResult,
  type PatternRegistry,
} from "./patterns";

export interface TechnologyImpactReview {
  title: string;
  eventTitle: string;
  industryTitle?: string;
  generatedAt: string;
  executiveObservation: string;
  whatWeHeard: string[];
  likelyImpacts: string[];
  blindSpots: string[];
  questionsToExplore: string[];
  areasToExploreNext: string[];
  roadmap: {
    immediate: string[];
    next30Days: string[];
    next90Days: string[];
  };
  nextConversation: string;
  ctaLabel: string;
}

/** @deprecated Use TechnologyImpactReview */
export type ExecutiveBrief = TechnologyImpactReview;

export interface TechnologyImpactReviewResult {
  review: TechnologyImpactReview;
  engine: PatternEngineResult;
}

export function generateTechnologyImpactReviewWithTrace(
  reportContext: ReportContext,
  patternRegistry: PatternRegistry,
  overlayRegistry: IndustryOverlayRegistry = {}
): TechnologyImpactReviewResult {
  const { event, answers, context } = reportContext;
  const industry = context.industry ?? null;

  const engineResult = runPatternEngine(
    {
      event,
      answers,
      industry,
    },
    patternRegistry
  );

  let review = composeReport(engineResult, {
    event,
    answers,
    industryTitle: industry?.title,
    dominantPrinciple: engineResult.selected.dominantPrinciple,
  });

  const overlay = getIndustryOverlay(
    overlayRegistry,
    event.slug,
    industry?.slug
  );
  review = applyIndustryOverlay(review, overlay);
  review = polishReview(review);

  return { review, engine: engineResult };
}

export function generateTechnologyImpactReview(
  reportContext: ReportContext,
  patternRegistry: PatternRegistry,
  overlayRegistry: IndustryOverlayRegistry = {}
): TechnologyImpactReview {
  return generateTechnologyImpactReviewWithTrace(
    reportContext,
    patternRegistry,
    overlayRegistry
  ).review;
}

/** @deprecated Use generateTechnologyImpactReview */
export const generateExecutiveBrief = generateTechnologyImpactReview;
