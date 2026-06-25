import type { ConversationAnswers, ConversationStep } from "./conversation";

const STORAGE_PREFIX = "crimson-signal-conversation:";

export interface PersistedConversation {
  step: ConversationStep;
  questionIndex: number;
  answers: ConversationAnswers;
  industrySlug?: string | null;
}

function storageKey(eventSlug: string): string {
  return `${STORAGE_PREFIX}${eventSlug}`;
}

export function loadConversation(eventSlug: string): PersistedConversation | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(storageKey(eventSlug));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedConversation;
    if (
      !parsed ||
      typeof parsed.questionIndex !== "number" ||
      typeof parsed.answers !== "object" ||
      !parsed.step
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveConversation(
  eventSlug: string,
  state: PersistedConversation
): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(storageKey(eventSlug), JSON.stringify(state));
  } catch {
    // Ignore quota or privacy mode errors
  }
}

export function clearConversation(eventSlug: string): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(storageKey(eventSlug));
  } catch {
    // Ignore
  }
}
