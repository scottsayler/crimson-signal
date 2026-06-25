"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BusinessEvent, ConversationQuestion, Industry } from "@/lib/types";
import type { IndustryContext } from "@/lib/context/types";
import type { ConversationAnswers, ConversationStep } from "@/lib/conversation";
import {
  clearConversation,
  loadConversation,
  saveConversation,
} from "@/lib/conversation-storage";
import { resolveEvent } from "@/lib/resolve-event";
import { resolveIndustry } from "@/lib/resolve-industry";

interface UseConversationStateOptions {
  events: BusinessEvent[];
  contextIndustries: Industry[];
  basePath?: string;
  onStepChange?: (step: ConversationStep) => void;
}

interface ConversationState {
  step: ConversationStep;
  selectedEvent: BusinessEvent | null;
  industrySlug: string | null;
  questionIndex: number;
  answers: ConversationAnswers;
}

function toIndustryContext(industry: Industry): IndustryContext {
  return { slug: industry.slug, title: industry.title };
}

function getInitialState(
  events: BusinessEvent[],
  contextIndustries: Industry[],
  urlEventSlug: string | null,
  urlIndustrySlug: string | null
): ConversationState {
  const event = resolveEvent(events, urlEventSlug);
  if (!event) {
    return {
      step: "select",
      selectedEvent: null,
      industrySlug: null,
      questionIndex: 0,
      answers: {},
    };
  }

  const industry = resolveIndustry(contextIndustries, urlIndustrySlug);

  return {
    step: industry ? "intro" : "industry",
    selectedEvent: event,
    industrySlug: industry?.slug ?? null,
    questionIndex: 0,
    answers: {},
  };
}

export function useConversationState({
  events,
  contextIndustries,
  basePath = "/",
  onStepChange,
}: UseConversationStateOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlEventSlug = searchParams.get("event");
  const urlIndustrySlug = searchParams.get("industry");

  const [step, setStep] = useState<ConversationStep>(() =>
    getInitialState(events, contextIndustries, urlEventSlug, urlIndustrySlug).step
  );
  const [selectedEvent, setSelectedEvent] = useState<BusinessEvent | null>(
    () => getInitialState(events, contextIndustries, urlEventSlug, urlIndustrySlug).selectedEvent
  );
  const [industrySlug, setIndustrySlug] = useState<string | null>(
    () => getInitialState(events, contextIndustries, urlEventSlug, urlIndustrySlug).industrySlug
  );
  const [questionIndex, setQuestionIndex] = useState(
    () => getInitialState(events, contextIndustries, urlEventSlug, urlIndustrySlug).questionIndex
  );
  const [answers, setAnswers] = useState<ConversationAnswers>(
    () => getInitialState(events, contextIndustries, urlEventSlug, urlIndustrySlug).answers
  );

  const stepRef = useRef(step);
  const selectedSlugRef = useRef(selectedEvent?.slug);
  const industrySlugRef = useRef(industrySlug);
  stepRef.current = step;
  selectedSlugRef.current = selectedEvent?.slug;
  industrySlugRef.current = industrySlug;

  const setStepWithCallback = useCallback(
    (next: ConversationStep) => {
      setStep(next);
      onStepChange?.(next);
    },
    [onStepChange]
  );

  const buildPath = useCallback(
    (eventSlug?: string, nextIndustrySlug?: string | null) => {
      if (!eventSlug) return basePath;

      const params = new URLSearchParams();
      params.set("event", eventSlug);
      if (nextIndustrySlug) {
        params.set("industry", nextIndustrySlug);
      }

      return `${basePath}?${params.toString()}`;
    },
    [basePath]
  );

  const selectedIndustry = industrySlug
    ? (contextIndustries.find((industry) => industry.slug === industrySlug) ?? null)
    : null;

  const resetConversation = useCallback(
    (eventSlugToClear?: string) => {
      if (eventSlugToClear) {
        clearConversation(eventSlugToClear);
      }
      setSelectedEvent(null);
      setIndustrySlug(null);
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
        industrySlug?: string | null;
      }
    ) => {
      const resetAnswers = options?.resetAnswers ?? true;

      setSelectedEvent(event);

      if (resetAnswers) {
        clearConversation(event.slug);
        setQuestionIndex(0);
        setAnswers({});
        setIndustrySlug(options?.industrySlug ?? null);
        setStepWithCallback(options?.step ?? "industry");
        return;
      }

      if (options?.step) setStepWithCallback(options.step);
      if (options?.questionIndex !== undefined) setQuestionIndex(options.questionIndex);
      if (options?.answers) setAnswers(options.answers);
      if (options?.industrySlug !== undefined) setIndustrySlug(options.industrySlug);
    },
    [setStepWithCallback]
  );

  const selectEvent = useCallback(
    (event: BusinessEvent) => {
      beginEvent(event, { resetAnswers: true, step: "industry", industrySlug: null });
      router.push(buildPath(event.slug), { scroll: false });
    },
    [router, buildPath, beginEvent]
  );

  const selectIndustry = useCallback(
    (industry: Industry) => {
      if (!selectedEvent) return;

      setIndustrySlug(industry.slug);
      setStepWithCallback("intro");
      router.push(buildPath(selectedEvent.slug, industry.slug), { scroll: false });
    },
    [selectedEvent, setStepWithCallback, router, buildPath]
  );

  const skipIndustry = useCallback(() => {
    if (!selectedEvent) return;

    setIndustrySlug(null);
    setStepWithCallback("intro");
    router.push(buildPath(selectedEvent.slug), { scroll: false });
  }, [selectedEvent, setStepWithCallback, router, buildPath]);

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
      setStepWithCallback("industry");
      return;
    }

    if (stepRef.current === "industry") {
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

  useEffect(() => {
    const event = resolveEvent(events, urlEventSlug);
    if (event) {
      const persisted = loadConversation(event.slug);
      if (persisted) {
        setSelectedEvent(event);
        setStep(persisted.step);
        setQuestionIndex(persisted.questionIndex);
        setAnswers(persisted.answers);
        setIndustrySlug(persisted.industrySlug ?? null);
        onStepChange?.(persisted.step);
      }
    }

    hasRestoredRef.current = true;
  }, [events, urlEventSlug, onStepChange]);

  useEffect(() => {
    if (!hasRestoredRef.current) return;
    if (!selectedEvent || step === "select") return;

    saveConversation(selectedEvent.slug, {
      step,
      questionIndex,
      answers,
      industrySlug,
    });
  }, [selectedEvent, step, questionIndex, answers, industrySlug]);

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

    const canonicalPath = buildPath(event.slug, urlIndustrySlug);
    if (urlEventSlug !== event.slug) {
      router.replace(canonicalPath, { scroll: false });
    }

    const resolvedIndustry = resolveIndustry(contextIndustries, urlIndustrySlug);
    if (urlIndustrySlug && !resolvedIndustry) {
      router.replace(buildPath(event.slug), { scroll: false });
      return;
    }

    if (selectedSlugRef.current === event.slug && industrySlugRef.current === (resolvedIndustry?.slug ?? null)) {
      return;
    }

    const persisted = loadConversation(event.slug);
    if (persisted) {
      beginEvent(event, {
        resetAnswers: false,
        step: persisted.step,
        questionIndex: persisted.questionIndex,
        answers: persisted.answers,
        industrySlug: persisted.industrySlug ?? resolvedIndustry?.slug ?? null,
      });
      return;
    }

    beginEvent(event, {
      resetAnswers: true,
      step: resolvedIndustry ? "intro" : "industry",
      industrySlug: resolvedIndustry?.slug ?? null,
    });
  }, [
    urlEventSlug,
    urlIndustrySlug,
    events,
    contextIndustries,
    buildPath,
    router,
    resetConversation,
    beginEvent,
  ]);

  useEffect(() => {
    const event = resolveEvent(events, urlEventSlug);
    if (!event) return;

    onStepChange?.(resolveIndustry(contextIndustries, urlIndustrySlug) ? "intro" : "industry");
  }, [urlEventSlug, urlIndustrySlug, events, contextIndustries, onStepChange]);

  return {
    step,
    selectedEvent,
    selectedIndustry,
    industryContext: selectedIndustry ? toIndustryContext(selectedIndustry) : null,
    questionIndex,
    answers,
    currentQuestion,
    selectEvent,
    selectIndustry,
    skipIndustry,
    reset,
    goBack,
    continueFromIntro,
    handleAnswer,
    handleMultiselectToggle,
    handleMultiselectContinue,
  };
}
