import type { BusinessEvent } from "../../types";
import type { ConversationAnswers } from "../../conversation";

function formatAnswer(value: string | string[]): string {
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

export function collectSignalsFromAnswers(
  event: BusinessEvent,
  answers: ConversationAnswers
): string[] {
  const signals = new Set<string>();

  for (const question of event.questions) {
    const raw = answers[question.id];
    if (raw === undefined) continue;

    const answer = formatAnswer(raw);
    if (question.scoringLogic) {
      for (const [option, signal] of Object.entries(question.scoringLogic)) {
        if (answer === option || answer.includes(option)) {
          signals.add(signal);
        }
      }
    }
  }

  return Array.from(signals);
}

export function getAnswerMap(
  event: BusinessEvent,
  answers: ConversationAnswers
): Record<string, string> {
  const map: Record<string, string> = {
    event_title: event.title,
    event_slug: event.slug,
  };

  for (const question of event.questions) {
    const raw = answers[question.id];
    if (raw === undefined) continue;
    map[question.id.replace(/-/g, "_")] = formatAnswer(raw);
  }

  const aliasMap: Record<string, string[]> = {
    scale: ["location_count", "entity_count"],
    timeline: ["expansion_scale", "timeline"],
    catalyst: ["expansion_catalyst"],
    model: ["model"],
    concern: ["challenge", "priority"],
    systems: ["systems"],
    stage: ["deal_stage"],
  };

  for (const [alias, keys] of Object.entries(aliasMap)) {
    for (const key of keys) {
      if (map[key]) {
        map[alias] = map[key];
        break;
      }
    }
  }

  return map;
}
