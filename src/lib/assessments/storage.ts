import type { AssessmentAnswers, PersistedAssessmentState } from "./types";

const STORAGE_PREFIX = "crimson-signal:assessment:";

function storageKey(assessmentId: string): string {
  return `${STORAGE_PREFIX}${assessmentId}`;
}

export function loadAssessmentState(assessmentId: string): PersistedAssessmentState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(storageKey(assessmentId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedAssessmentState;
    if (
      !parsed ||
      typeof parsed.currentIndex !== "number" ||
      typeof parsed.answers !== "object" ||
      typeof parsed.showResults !== "boolean"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveAssessmentState(
  assessmentId: string,
  state: PersistedAssessmentState
): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(storageKey(assessmentId), JSON.stringify(state));
  } catch {
    // Ignore quota or privacy mode errors
  }
}

export function clearAssessmentState(assessmentId: string): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(storageKey(assessmentId));
  } catch {
    // Ignore
  }
}

export type { AssessmentAnswers, PersistedAssessmentState };
