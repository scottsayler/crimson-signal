import type {
  PatternEngineInput,
  PatternEngineResult,
  PatternRegistry,
} from "../types";
import { isPatternCandidate } from "./candidacy";
import { scoreCandidates } from "./score";
import { selectPatterns } from "./select";

export function runPatternEngine(
  input: PatternEngineInput,
  registry: PatternRegistry
): PatternEngineResult {
  const { event, answers, industry } = input;
  const industrySlug = industry?.slug;

  const patternIds = registry.eventIndex.get(event.slug) ?? [];
  const candidates = [];
  const conditionMatches = new Map<string, string[]>();

  for (const id of patternIds) {
    const pattern = registry.patterns.get(id);
    if (!pattern) continue;

    const { eligible, matchedConditions } = isPatternCandidate(
      pattern,
      event.slug,
      industrySlug,
      answers
    );

    if (eligible) {
      candidates.push(pattern);
      conditionMatches.set(pattern.id, matchedConditions);
    }
  }

  const scores = scoreCandidates(
    candidates,
    event,
    answers,
    industrySlug,
    registry,
    conditionMatches
  );

  const { selected, confidence } = selectPatterns(scores);

  return {
    input,
    candidates: candidates.map((p) => p.id),
    scores,
    selected,
    confidence,
  };
}
