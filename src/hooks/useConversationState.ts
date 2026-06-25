"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BusinessEvent, ConversationQuestion } from "@/lib/types";
import type { ConversationAnswers, ConversationStep } from "@/lib/conversation";
import {
  clearConversation,
  loadConversation,
  saveConversation,
} from "@/lib/conversation-storage";
import { resolveEvent } from "@/lib/resolve-event";

interface UseConversationStateOptions {
  events: BusinessEvent[];
  basePath?: string;
  onStepChange?: (step: ConversationStep) => void;
}

interface ConversationState {
  step: ConversationStep;
  selectedEvent: BusinessEvent | null;
  questionIndex: number;
  answers: ConversationAnswers;
}

function getInitialState(
  events: BusinessEvent[],
  urlEventSlug: string | null
): ConversationState {
  const event = resolveEvent(events, urlEventSlug);
  if (!event) {
    return { step: "select", selectedEvent: null, questionIndex: 0, answers: {} };
  }

  return {
    step: "intro",
    selectedEvent: event,
    questionIndex: 0,
    answers: {},
  };
}

export function useConversationState({
  events,
  basePath = "/",
  onStepChange,
}: UseConversationStateOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlEventSlug = searchParams.get("event");

  const [step, setStep] = useState<ConversationStep>(() =>
    getInitialState(events, urlEventSlug).step
  );
  const [selectedEvent, setSelectedEvent] = useState<BusinessEvent | null>(
    () => getInitialState(events, urlEventSlug).selectedEvent
  );
  const [questionIndex, setQuestionIndex] = useState(
    () => getInitialState(events, urlEventSlug).questionIndex
  );
  const [answers, setAnswers] = useState<ConversationAnswers>(
    () => getInitialState(events, urlEventSlug).answers
  );

  const stepRef = useRef(step);
  const selectedSlugRef = useRef(selectedEvent?.slug);
  stepRef.current = step;
  selectedSlugRef.current = selectedEvent?.slug;

  const setStepWithCallback = useCallback(
    (next: ConversationStep) => {
      setStep(next);
      onStepChange?.(next);
    },
    [onStepChange]
  );

  const buildPath = useCallback(
    (eventSlug?: string) => (eventSlug ? `${basePath}?event=${eventSlug}` : basePath),
    [basePath]
  );

  const resetConversation = useCallback(
    (eventSlugToClear?: string) => {
      if (eventSlugToClear) {
        clearConversation(eventSlugToClear);
      }
      setSelectedEvent(null);
      setQuestionIndex(0);
      setAnswers({});
      setStepWithCallback("select");
    },
    [setStepWithCallback]
  );

  const beginEvent = useCallback(
    (
      event: BusinessEvent,
      options?: {
        resetAnswers?: boolean;
        step?: ConversationStep;
        questionIndex?: number;
        answers?: ConversationAnswers;
      }
    ) => {
      const resetAnswers = options?.resetAnswers ?? true;

      setSelectedEvent(event);

      if (resetAnswers) {
        clearConversation(event.slug);
        setQuestionIndex(0);
        setAnswers({});
        setStepWithCallback(options?.step ?? "intro");
        return;
      }

      if (options?.step) setStepWithCallback(options.step);
      if (options?.questionIndex !== undefined) setQuestionIndex(options.questionIndex);
      if (options?.answers) setAnswers(options.answers);
    },
    [setStepWithCallback]
  );

  const selectEvent = useCallback(
    (event: BusinessEvent) => {
      beginEvent(event, { resetAnswers: true, step: "intro" });
      router.push(buildPath(event.slug), { scroll: false });
    },
    [router, buildPath, beginEvent]
  );

  const reset = useCallback(() => {
    const slug = selectedSlugRef.current;
    resetConversation(slug);
    router.replace(buildPath(), { scroll: false });
  }, [router, buildPath, resetConversation]);

  const continueFromIntro = useCallback(() => {
    setStepWithCallback("conversation");
  }, [setStepWithCallback]);

  const goBack = useCallback(() => {
    if (stepRef.current === "conversation") {
      if (questionIndex > 0) {
        setQuestionIndex((i) => i - 1);
      } else {
        setStepWithCallback("intro");
      }
      return;
    }

    if (stepRef.current === "intro") {
      reset();
    }
  }, [questionIndex, setStepWithCallback, reset]);

  const currentQuestion: ConversationQuestion | undefined =
    selectedEvent?.questions[questionIndex];

  const handleAnswer = useCallback(
    (value: string | string[]) => {
      if (!currentQuestion || !selectedEvent) return;

      const updated = { ...answers, [currentQuestion.id]: value };
      setAnswers(updated);

      if (questionIndex < selectedEvent.questions.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        setStepWithCallback("brief");
      }
    },
    [currentQuestion, selectedEvent, answers, questionIndex, setStepWithCallback]
  );

  const handleMultiselectToggle = useCallback(
    (option: string) => {
      if (!currentQuestion) return;
      const current = (answers[currentQuestion.id] as string[]) ?? [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      setAnswers({ ...answers, [currentQuestion.id]: updated });
    },
    [currentQuestion, answers]
  );

  const handleMultiselectContinue = useCallback(() => {
    if (!currentQuestion) return;
    const current = (answers[currentQuestion.id] as string[]) ?? [];
    if (current.length === 0) return;
    handleAnswer(current);
  }, [currentQuestion, answers, handleAnswer]);

  const hasRestoredRef = useRef(false);

  // Restore persisted progress after mount (sessionStorage is client-only)
  useEffect(() => {
    const event = resolveEvent(events, urlEventSlug);
    if (event) {
      const persisted = loadConversation(event.slug);
      if (persisted) {
        setSelectedEvent(event);
        setStep(persisted.step);
        setQuestionIndex(persisted.questionIndex);
        setAnswers(persisted.answers);
        onStepChange?.(persisted.step);
      }
    }

    hasRestoredRef.current = true;
  }, [events, urlEventSlug, onStepChange]);

  // Persist conversation progress for refresh and return visits
  useEffect(() => {
    if (!hasRestoredRef.current) return;
    if (!selectedEvent || step === "select") return;

    saveConversation(selectedEvent.slug, {
      step,
      questionIndex,
      answers,
    });
  }, [selectedEvent, step, questionIndex, answers]);

  // Keep conversation state aligned with ?event= for deep links, refresh, and browser navigation
  useEffect(() => {
    if (!urlEventSlug) {
      if (stepRef.current !== "select") {
        resetConversation(selectedSlugRef.current);
      }
      return;
    }

    const event = resolveEvent(events, urlEventSlug);
    if (!event) {
      if (stepRef.current !== "select") {
        resetConversation(selectedSlugRef.current);
      }
      router.replace(buildPath(), { scroll: false });
      return;
    }

    const canonicalPath = buildPath(event.slug);
    if (urlEventSlug !== event.slug) {
      router.replace(canonicalPath, { scroll: false });
    }

    if (selectedSlugRef.current === event.slug) {
      return;
    }

    const persisted = loadConversation(event.slug);
    if (persisted) {
      beginEvent(event, {
        resetAnswers: false,
        step: persisted.step,
        questionIndex: persisted.questionIndex,
        answers: persisted.answers,
      });
      return;
    }

    beginEvent(event, { resetAnswers: true, step: "intro" });
  }, [urlEventSlug, events, buildPath, router, resetConversation, beginEvent]);

  // Notify parent layout when conversation is entered directly from URL on first mount
  useEffect(() => {
    const event = resolveEvent(events, urlEventSlug);
    if (!event) return;

    onStepChange?.("intro");
  }, [urlEventSlug, events, onStepChange]);

  return {
    step,
    selectedEvent,
    questionIndex,
    answers,
    currentQuestion,
    selectEvent,
    reset,
    goBack,
    continueFromIntro,
    handleAnswer,
    handleMultiselectToggle,
    handleMultiselectContinue,
  };
}
