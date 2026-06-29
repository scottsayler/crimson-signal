import type { TechnologyImpactReview } from "../../brief";
import type { PatternEngineResult, WriteContext } from "../types";
import { getDomainLabel } from "../../types";
import { getAnswerMap } from "../engine/signals";
import { resolvePatternContent } from "./resolve";

function buildWriteVariables(ctx: WriteContext): Record<string, string> {
  return {
    ...getAnswerMap(ctx.event, ctx.answers),
    event_title: ctx.event.title.toLowerCase(),
    industry_title: ctx.industryTitle?.toLowerCase() ?? "",
    event_mindset: ctx.event.executiveMindset ?? "",
    event_problem: ctx.event.businessProblem ?? "",
  };
}

function resolveList(
  patterns: { content: string }[],
  variables: Record<string, string>
): string[] {
  return patterns.map((p) => resolvePatternContent(p.content, variables));
}

function buildReviewTitle(eventTitle: string, industryTitle?: string): string {
  if (industryTitle) {
    return `Technology Impact Review — ${eventTitle} (${industryTitle})`;
  }
  return `Technology Impact Review — ${eventTitle}`;
}

function fallbackObservation(ctx: WriteContext): string {
  const answeredCount = Object.keys(ctx.answers).length;
  if (answeredCount === 0) {
    return `The technology implications of ${ctx.event.title.toLowerCase()} are not yet visible enough to interpret — which is itself a signal that architecture, ownership, and readiness criteria need definition before the business timeline forces tactical commitments.`;
  }

  if (ctx.event.businessProblem) {
    return ctx.event.businessProblem;
  }

  return `The combination of ${ctx.event.title.toLowerCase()} and the current planning posture suggests a gap between business momentum and technology architecture — one that will surface at the next milestone if decision rights and readiness criteria remain implicit.`;
}

function fallbackNextConversation(ctx: WriteContext): string {
  const variables = getAnswerMap(ctx.event, ctx.answers);
  const focus =
    variables.concern ??
    variables.catalyst ??
    ctx.event.title.toLowerCase();

  return `A working session focused on ${focus.toLowerCase()} would be the logical next step — to pressure-test assumptions, sequence what to evaluate, and agree what must be standardized before the business timeline narrows the options. This is evaluative preparation, not vendor selection.`;
}

function supplementAreas(
  selected: string[],
  ctx: WriteContext
): string[] {
  if (selected.length > 0) return selected;

  const areas = new Set<string>();
  for (const domain of ctx.event.technologyDomains.slice(0, 3)) {
    areas.add(getDomainLabel(domain));
  }
  return Array.from(areas);
}

export function composeReport(
  engineResult: PatternEngineResult,
  ctx: WriteContext
): TechnologyImpactReview {
  const { selected } = engineResult;
  const variables = buildWriteVariables(ctx);

  const executiveObservation = selected.executiveObservation
    ? resolvePatternContent(selected.executiveObservation.content, variables)
    : fallbackObservation(ctx);

  const whatWeHeard = resolveList(selected.whatWeHeard, variables);
  const likelyImpacts = resolveList(selected.likelyImpacts, variables);
  const blindSpots = resolveList(selected.blindSpots, variables);
  const questionsToExplore = resolveList(
    selected.questionsToExplore,
    variables
  );

  const areasFromPatterns = selected.areasToExploreNext.flatMap((p) => {
    const labels = p.tags?.reportSections ?? [];
    if (labels.length > 0) return labels;
    return [resolvePatternContent(p.content, variables)];
  });
  const areasToExploreNext = supplementAreas(
    areasFromPatterns.length > 0
      ? areasFromPatterns
      : selected.areasToExploreNext.map((p) =>
          resolvePatternContent(p.content, variables)
        ),
    ctx
  ).slice(0, 6);

  const roadmap = {
    immediate: resolveList(selected.roadmap.immediate, variables),
    next30Days: resolveList(selected.roadmap.next30Days, variables),
    next90Days: resolveList(selected.roadmap.next90Days, variables),
  };

  if (
    roadmap.immediate.length === 0 &&
    roadmap.next30Days.length === 0 &&
    roadmap.next90Days.length === 0
  ) {
    roadmap.immediate = [
      "Confirm executive ownership for technology decisions tied to this change",
      "Document what was deployed at the most recent location opening or integration — not the ideal state",
    ];
    roadmap.next30Days = [
      "Define non-negotiable technology standards versus acceptable local variation",
      "Inventory connectivity, tooling, and support contracts that will repeat at each location",
    ];
    roadmap.next90Days = [
      "Establish a location readiness checklist tied to the business opening or integration timeline",
      "Build cost and risk visibility by location before the next major commitment",
    ];
  }

  const nextConversation = selected.nextConversation
    ? resolvePatternContent(selected.nextConversation.content, variables)
    : fallbackNextConversation(ctx);

  return {
    title: buildReviewTitle(ctx.event.title, ctx.industryTitle),
    eventTitle: ctx.event.title,
    industryTitle: ctx.industryTitle,
    generatedAt: new Date().toISOString(),
    executiveObservation,
    whatWeHeard:
      whatWeHeard.length > 0
        ? whatWeHeard.slice(0, 5)
        : [
            `Active planning is underway for ${ctx.event.title.toLowerCase()}, with technology implications that cut across operations, governance, and vendor relationships.`,
          ],
    likelyImpacts:
      likelyImpacts.length > 0
        ? likelyImpacts.slice(0, 6)
        : [
            `${ctx.event.title} affects how standards are set, how costs are visible, and who owns technology decisions across locations — not merely which tools are deployed.`,
          ],
    blindSpots: blindSpots.slice(0, 5),
    questionsToExplore:
      questionsToExplore.length > 0
        ? questionsToExplore.slice(0, 6)
        : [
            `Who owns the technology implications of ${ctx.event.title.toLowerCase()} — and do they have visibility across the full footprint?`,
          ],
    areasToExploreNext,
    roadmap: {
      immediate: roadmap.immediate.slice(0, 4),
      next30Days: roadmap.next30Days.slice(0, 4),
      next90Days: roadmap.next90Days.slice(0, 4),
    },
    nextConversation,
    ctaLabel: ctx.event.cta ?? "Request a collaborative session",
  };
}
