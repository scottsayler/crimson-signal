import type { ExecutivePattern, PatternRegistry, PatternScore } from "../types";
import { DEFAULT_INDUSTRY_MULTIPLIER } from "../config";
import { collectSignalsFromAnswers } from "./signals";
import type { BusinessEvent } from "../../types";
import type { ConversationAnswers } from "../../conversation";

function formatAnswer(value: string | string[]): string {
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function answerMatches(
  answer: string,
  expected: string | string[]
): boolean {
  const values = Array.isArray(expected) ? expected : [expected];
  return values.some((v) => answer === v || answer.includes(v));
}

function computeAnswerDelta(
  patternId: string,
  eventSlug: string,
  answers: ConversationAnswers,
  signals: string[],
  registry: PatternRegistry
): { delta: number; matchedSignals: string[] } {
  let delta = 0;
  const matchedSignals: string[] = [];

  for (const signal of signals) {
    const adjustments = registry.signalWeights.get(signal);
    const patternDelta = adjustments?.get(patternId);
    if (patternDelta !== undefined) {
      delta += patternDelta;
      matchedSignals.push(signal);
    }
  }

  const eventAdjustments = registry.answerWeights.get(eventSlug) ?? [];
  for (const entry of eventAdjustments) {
    const raw = answers[entry.question_id];
    if (raw === undefined) continue;
    const answer = formatAnswer(raw);
    if (!answerMatches(answer, entry.answer)) continue;
    const patternDelta = entry.adjustments[patternId];
    if (patternDelta !== undefined) {
      delta += patternDelta;
      matchedSignals.push(`answer:${entry.question_id}`);
    }
  }

  return { delta, matchedSignals };
}

export function scorePattern(
  pattern: ExecutivePattern,
  event: BusinessEvent,
  answers: ConversationAnswers,
  industrySlug: string | undefined,
  registry: PatternRegistry,
  matchedConditions: string[]
): PatternScore {
  const industryMap = industrySlug
    ? registry.industryWeights.get(industrySlug)
    : undefined;
  const industryMultiplier =
    industryMap?.get(pattern.id) ?? DEFAULT_INDUSTRY_MULTIPLIER;

  const signals = collectSignalsFromAnswers(event, answers);
  const { delta: answerDelta, matchedSignals } = computeAnswerDelta(
    pattern.id,
    event.slug,
    answers,
    signals,
    registry
  );

  const finalScore = pattern.basePriority * industryMultiplier + answerDelta;

  return {
    pattern,
    finalScore,
    basePriority: pattern.basePriority,
    industryMultiplier,
    answerDelta,
    matchedSignals,
    matchedConditions,
  };
}

export function scoreCandidates(
  candidates: ExecutivePattern[],
  event: BusinessEvent,
  answers: ConversationAnswers,
  industrySlug: string | undefined,
  registry: PatternRegistry,
  conditionMatches: Map<string, string[]>
): PatternScore[] {
  return candidates
    .map((pattern) =>
      scorePattern(
        pattern,
        event,
        answers,
        industrySlug,
        registry,
        conditionMatches.get(pattern.id) ?? []
      )
    )
    .sort((a, b) => b.finalScore - a.finalScore);
}
