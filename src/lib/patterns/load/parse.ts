import type {
  ExecutivePattern,
  PatternCondition,
  RawPatternDefinition,
} from "../types";

function normalizeCondition(
  raw: NonNullable<RawPatternDefinition["conditions"]>[number]
): PatternCondition {
  return {
    questionId: raw.question_id,
    operator: raw.operator ?? "eq",
    value: raw.value,
  };
}

export function parsePatternDefinition(raw: RawPatternDefinition): ExecutivePattern {
  return {
    id: raw.id,
    version: raw.version ?? 1,
    section: raw.section,
    principle: raw.principle.trim(),
    content: raw.content.trim(),
    basePriority: raw.base_priority,
    events: raw.events,
    conditions: raw.conditions?.map(normalizeCondition),
    industries: raw.industries,
    theme: raw.theme,
    tags: raw.tags
      ? {
          technologyDomains: raw.tags.technology_domains,
          businessSignals: raw.tags.business_signals,
          reportSections: raw.tags.report_sections,
        }
      : undefined,
  };
}

export function buildEventIndex(
  patterns: Map<string, ExecutivePattern>
): Map<string, string[]> {
  const index = new Map<string, string[]>();

  for (const pattern of patterns.values()) {
    for (const eventSlug of pattern.events) {
      const existing = index.get(eventSlug) ?? [];
      if (!existing.includes(pattern.id)) {
        existing.push(pattern.id);
      }
      index.set(eventSlug, existing);
    }
  }

  return index;
}
