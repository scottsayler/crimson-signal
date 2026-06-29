import type { TechnologyImpactReview } from "../../brief";
import type { PatternEngineResult, WriteContext } from "../types";
import { getDomainLabel } from "../../types";
import { getAnswerMap } from "../engine/signals";
import { buildEditorialVariables } from "./humanize";
import {
  editorializeList,
  editorializeParagraph,
  editorializeRoadmapItem,
} from "./editorialize";
import { resolvePatternContent } from "./resolve";

function buildWriteVariables(ctx: WriteContext): Record<string, string> {
  return buildEditorialVariables(ctx, getAnswerMap(ctx.event, ctx.answers));
}

function resolveList(
  patterns: { content: string }[],
  variables: Record<string, string>
): string[] {
  return patterns
    .map((p) => resolvePatternContent(p.content, variables))
    .filter((item): item is string => item !== null);
}

function buildReviewTitle(eventTitle: string, industryTitle?: string): string {
  if (industryTitle) {
    return `Technology Impact Review: ${eventTitle} (${industryTitle})`;
  }
  return `Technology Impact Review: ${eventTitle}`;
}

function fallbackObservation(ctx: WriteContext): string {
  const answeredCount = Object.keys(ctx.answers).length;
  if (answeredCount === 0) {
    return editorializeParagraph(
      "The technology implications of this change are not yet visible enough to interpret. That ambiguity is itself a signal. Architecture, ownership, and readiness criteria need definition before the business timeline forces tactical commitments."
    );
  }

  if (ctx.event.businessProblem) {
    return editorializeParagraph(ctx.event.businessProblem);
  }

  return editorializeParagraph(
    `The combination of ${ctx.event.title.toLowerCase()} and the current planning posture suggests a gap between business momentum and technology architecture. That gap will surface at the next milestone if decision rights and readiness criteria remain implicit.`
  );
}

function fallbackNextConversation(ctx: WriteContext): string {
  const variables = buildWriteVariables(ctx);
  const focus =
    variables.concern ??
    variables.catalyst ??
    ctx.event.title.toLowerCase();

  return editorializeParagraph(
    `A working session on ${focus} would pressure-test assumptions, sequence what to evaluate, and clarify what must be standardized before the business timeline narrows options. The goal is preparation for decision-making, not vendor selection.`
  );
}

function supplementAreas(selected: string[], ctx: WriteContext): string[] {
  if (selected.length > 0) return selected;

  const areas = new Set<string>();
  for (const domain of ctx.event.technologyDomains.slice(0, 3)) {
    areas.add(getDomainLabel(domain));
  }
  return Array.from(areas);
}

function defaultWhatWeHeard(ctx: WriteContext): string[] {
  return editorializeList([
    `Planning is active for ${ctx.event.title.toLowerCase()}. The open question is whether technology decisions are keeping pace with business commitments across operations, governance, and vendor relationships.`,
  ]);
}

function defaultLikelyImpacts(ctx: WriteContext): string[] {
  return editorializeList([
    `${ctx.event.title} will reshape how standards are set, how costs are visible, and who owns technology decisions across the footprint. Those structural shifts matter more than any single tool choice.`,
  ]);
}

function defaultQuestions(ctx: WriteContext): string[] {
  return editorializeList([
    `Who owns the technology implications of ${ctx.event.title.toLowerCase()}, and do they have visibility across the full footprint?`,
  ]);
}

function defaultRoadmap(): TechnologyImpactReview["roadmap"] {
  return {
    immediate: editorializeList([
      "Confirm executive ownership for technology decisions tied to this change",
      "Document what was deployed at the most recent location opening or integration, not the ideal state",
    ]),
    next30Days: editorializeList([
      "Define non-negotiable technology standards versus acceptable local variation",
      "Inventory connectivity, tooling, and support contracts that will repeat at each location",
    ]),
    next90Days: editorializeList([
      "Establish a location readiness checklist tied to the business opening or integration timeline",
      "Build cost and risk visibility by location before the next major commitment",
    ]),
  };
}

export function composeReport(
  engineResult: PatternEngineResult,
  ctx: WriteContext
): TechnologyImpactReview {
  const { selected } = engineResult;
  const variables = buildWriteVariables(ctx);

  const rawObservation = selected.executiveObservation
    ? resolvePatternContent(selected.executiveObservation.content, variables)
    : null;

  const executiveObservation = editorializeParagraph(
    rawObservation ?? fallbackObservation(ctx)
  );

  const priorForDedup = [executiveObservation];

  const whatWeHeard = editorializeList(
    resolveList(selected.whatWeHeard, variables),
    priorForDedup
  );
  const whatWeHeardFinal =
    whatWeHeard.length > 0 ? whatWeHeard.slice(0, 5) : defaultWhatWeHeard(ctx);

  const likelyImpacts = editorializeList(
    resolveList(selected.likelyImpacts, variables),
    [...priorForDedup, ...whatWeHeardFinal]
  );
  const likelyImpactsFinal =
    likelyImpacts.length > 0
      ? likelyImpacts.slice(0, 6)
      : defaultLikelyImpacts(ctx);

  const blindSpots = editorializeList(
    resolveList(selected.blindSpots, variables),
    [...priorForDedup, ...whatWeHeardFinal, ...likelyImpactsFinal]
  ).slice(0, 5);

  const questionsToExplore = editorializeList(
    resolveList(selected.questionsToExplore, variables),
    [...priorForDedup, ...whatWeHeardFinal, ...likelyImpactsFinal, ...blindSpots]
  );
  const questionsFinal =
    questionsToExplore.length > 0
      ? questionsToExplore.slice(0, 6)
      : defaultQuestions(ctx);

  const areasFromPatterns = selected.areasToExploreNext.flatMap((p) => {
    const labels = p.tags?.reportSections ?? [];
    if (labels.length > 0) return labels;
    const resolved = resolvePatternContent(p.content, variables);
    return resolved ? [resolved] : [];
  });
  const areasToExploreNext = supplementAreas(
    areasFromPatterns.length > 0
      ? areasFromPatterns
      : selected.areasToExploreNext
          .map((p) => resolvePatternContent(p.content, variables))
          .filter((item): item is string => item !== null),
    ctx
  ).slice(0, 6);

  const roadmapResolved = {
    immediate: resolveList(selected.roadmap.immediate, variables)
      .map((item) => editorializeRoadmapItem(item))
      .filter((item): item is string => item !== null),
    next30Days: resolveList(selected.roadmap.next30Days, variables)
      .map((item) => editorializeRoadmapItem(item))
      .filter((item): item is string => item !== null),
    next90Days: resolveList(selected.roadmap.next90Days, variables)
      .map((item) => editorializeRoadmapItem(item))
      .filter((item): item is string => item !== null),
  };

  const roadmap =
    roadmapResolved.immediate.length === 0 &&
    roadmapResolved.next30Days.length === 0 &&
    roadmapResolved.next90Days.length === 0
      ? defaultRoadmap()
      : {
          immediate: roadmapResolved.immediate.slice(0, 4),
          next30Days: roadmapResolved.next30Days.slice(0, 4),
          next90Days: roadmapResolved.next90Days.slice(0, 4),
        };

  const rawNextConversation = selected.nextConversation
    ? resolvePatternContent(selected.nextConversation.content, variables)
    : null;

  const nextConversation = editorializeParagraph(
    rawNextConversation ?? fallbackNextConversation(ctx)
  );

  return {
    title: buildReviewTitle(ctx.event.title, ctx.industryTitle),
    eventTitle: ctx.event.title,
    industryTitle: ctx.industryTitle,
    generatedAt: new Date().toISOString(),
    executiveObservation,
    whatWeHeard: whatWeHeardFinal,
    likelyImpacts: likelyImpactsFinal,
    blindSpots,
    questionsToExplore: questionsFinal,
    areasToExploreNext,
    roadmap,
    nextConversation,
    ctaLabel: ctx.event.cta ?? "Request a collaborative session",
  };
}
