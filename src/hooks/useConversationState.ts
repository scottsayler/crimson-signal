"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BusinessEvent, ConversationQuestion } from "@/lib/types";
import type { ConversationAnswers, ConversationStep } from "@/lib/conversation";
import { resolveEvent } from "@/lib/resolve-event";

interface UseConversationStateOptions {
  events: BusinessEvent[];
  basePath?: string;
  onStepChange?: (step: ConversationStep) => void;
}

export function useConversationState({
  events,
  basePath = "/",
  onStepChange,
}: UseConversationStateOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlEventSlug = searchParams.get("event");

  const resolvedFromUrl = resolveEvent(events, urlEventSlug);

  const [step, setStep] = useState<ConversationStep>(() =>
    resolvedFromUrl ? "conversation" : "select"
  );
  const [selectedEvent, setSelectedEvent] = useState<BusinessEvent | null>(
    () => resolvedFromUrl
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ConversationAnswers>({});

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

  const resetConversation = useCallback(() => {
    setSelectedEvent(null);
    setQuestionIndex(0);
    setAnswers({});
    setStepWithCallback("select");
  }, [setStepWithCallback]);

  const startConversation = useCallback(
    (event: BusinessEvent, options?: { resetAnswers?: boolean }) => {
      const resetAnswers = options?.resetAnswers ?? true;
      setSelectedEvent(event);
      if (resetAnswers) {
        setQuestionIndex(0);
        setAnswers({});
      }
      setStepWithCallback("conversation");
    },
    [setStepWithCallback]
  );

  const selectEvent = useCallback(
    (event: BusinessEvent) => {
      startConversation(event, { resetAnswers: true });
      router.push(buildPath(event.slug), { scroll: false });
    },
    [router, buildPath, startConversation]
  );

  const reset = useCallback(() => {
    resetConversation();
    router.replace(buildPath(), { scroll: false });
  }, [router, buildPath, resetConversation]);

  const goBack = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else {
      reset();
    }
  }, [questionIndex, reset]);

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

  // Keep conversation state aligned with ?event= for deep links, refresh, and browser navigation
  useEffect(() => {
    if (!urlEventSlug) {
      if (stepRef.current !== "select") {
        resetConversation();
      }
      return;
    }

    const event = resolveEvent(events, urlEventSlug);
    if (!event) {
      if (stepRef.current !== "select") {
        resetConversation();
      }
      router.replace(buildPath(), { scroll: false });
      return;
    }

    const canonicalPath = buildPath(event.slug);
    if (urlEventSlug !== event.slug) {
      router.replace(canonicalPath, { scroll: false });
    }

    if (stepRef.current === "brief") {
      if (selectedSlugRef.current !== event.slug) {
        startConversation(event, { resetAnswers: true });
      }
      return;
    }

    if (selectedSlugRef.current !== event.slug) {
      startConversation(event, { resetAnswers: true });
      return;
    }

    if (stepRef.current === "select") {
      startConversation(event, { resetAnswers: false });
    }
  }, [
    urlEventSlug,
    events,
    basePath,
    buildPath,
    router,
    resetConversation,
    startConversation,
  ]);

  // Notify parent layout when conversation is entered directly from URL on first mount
  useEffect(() => {
    if (resolvedFromUrl) {
      onStepChange?.("conversation");
    }
  }, [resolvedFromUrl, onStepChange]);

  return {
    step,
    selectedEvent,
    questionIndex,
    answers,
    currentQuestion,
    selectEvent,
    reset,
    goBack,
    handleAnswer,
    handleMultiselectToggle,
    handleMultiselectContinue,
  };
}
