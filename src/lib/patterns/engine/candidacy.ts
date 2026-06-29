import type { PatternCondition, ExecutivePattern } from "../types";
import type { ConversationAnswers } from "../../conversation";

function formatAnswer(value: string | string[]): string {
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function matchCondition(
  answer: string | undefined,
  condition: PatternCondition
): boolean {
  if (answer === undefined) return false;

  const values = Array.isArray(condition.value)
    ? condition.value
    : [condition.value];

  switch (condition.operator) {
    case "eq":
      return values.includes(answer);
    case "in":
      return values.some((v) => answer.includes(v));
    case "contains":
      return values.some((v) =>
        answer.toLowerCase().includes(v.toLowerCase())
      );
    case "matches":
      return values.some((v) => new RegExp(v, "i").test(answer));
    default:
      return false;
  }
}

export function patternPassesConditions(
  pattern: ExecutivePattern,
  answers: ConversationAnswers
): { passes: boolean; matched: string[] } {
  if (!pattern.conditions?.length) {
    return { passes: true, matched: [] };
  }

  const matched: string[] = [];
  for (const condition of pattern.conditions) {
    if (answers[condition.questionId] === undefined) {
      return { passes: false, matched };
    }
    if (
      !matchCondition(
        formatAnswer(answers[condition.questionId]),
        condition
      )
    ) {
      return { passes: false, matched };
    }
    matched.push(`${condition.questionId}:${condition.operator}`);
  }

  return { passes: true, matched };
}

export function isPatternCandidate(
  pattern: ExecutivePattern,
  eventSlug: string,
  industrySlug: string | undefined,
  answers: ConversationAnswers
): { eligible: boolean; matchedConditions: string[] } {
  if (!pattern.events.includes(eventSlug)) {
    return { eligible: false, matchedConditions: [] };
  }

  if (pattern.industries?.length) {
    if (!industrySlug || !pattern.industries.includes(industrySlug)) {
      return { eligible: false, matchedConditions: [] };
    }
  }

  const { passes, matched } = patternPassesConditions(pattern, answers);
  return { eligible: passes, matchedConditions: matched };
}
