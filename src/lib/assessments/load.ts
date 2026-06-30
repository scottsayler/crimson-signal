import "server-only";

import type { AssessmentDefinition } from "./types";
import { readAllAssessmentsFromDisk } from "./reader";

let assessmentCache: Map<string, AssessmentDefinition> | null = null;
let toolSlugIndex: Map<string, string> | null = null;

function buildAssessmentCache(): Map<string, AssessmentDefinition> {
  const cache = new Map<string, AssessmentDefinition>();
  const slugIndex = new Map<string, string>();

  for (const definition of readAllAssessmentsFromDisk()) {
    cache.set(definition.id, definition);
    slugIndex.set(definition.toolSlug, definition.id);

    if (definition.toolSlug !== definition.id) {
      slugIndex.set(definition.id, definition.id);
    }
  }

  assessmentCache = cache;
  toolSlugIndex = slugIndex;
  return cache;
}

function getCache(): Map<string, AssessmentDefinition> {
  if (!assessmentCache) {
    return buildAssessmentCache();
  }
  return assessmentCache;
}

function getSlugIndex(): Map<string, string> {
  if (!toolSlugIndex) {
    buildAssessmentCache();
  }
  return toolSlugIndex ?? new Map();
}

export function getAllAssessments(): AssessmentDefinition[] {
  return Array.from(getCache().values());
}

export function getAssessmentById(id: string): AssessmentDefinition | null {
  return getCache().get(id) ?? null;
}

export function getAssessmentByToolSlug(toolSlug: string): AssessmentDefinition | null {
  const assessmentId = getSlugIndex().get(toolSlug);
  if (!assessmentId) return null;
  return getAssessmentById(assessmentId);
}

export function hasAssessmentForTool(toolSlug: string): boolean {
  return getSlugIndex().has(toolSlug);
}
