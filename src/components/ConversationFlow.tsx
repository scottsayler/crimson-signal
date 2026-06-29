"use client";

import type { BusinessEvent, Industry } from "@/lib/types";
import type { IndustryOverlayRegistry } from "@/lib/context/types";
import type { PatternRegistry } from "@/lib/patterns";
import type { ConversationStep } from "@/lib/conversation";
import { generateTechnologyImpactReview } from "@/lib/brief";
import { useConversationState } from "@/hooks/useConversationState";
import { EventSelector } from "./EventSelector";
import { IndustrySelector } from "./IndustrySelector";
import { ConversationIntro } from "./ConversationIntro";
import { ConversationProgress } from "./ConversationProgress";
import { QuestionStep } from "./QuestionStep";
import { ExecutiveBriefDisplay } from "./ExecutiveBriefDisplay";

interface ConversationFlowProps {
  events: BusinessEvent[];
  contextIndustries: Industry[];
  overlayRegistry: IndustryOverlayRegistry;
  patternRegistry: PatternRegistry;
  basePath?: string;
  variant?: "home" | "page";
  onStepChange?: (step: ConversationStep) => void;
}

export function ConversationFlow({
  events,
  contextIndustries,
  overlayRegistry,
  patternRegistry,
  basePath = "/",
  variant = "home",
  onStepChange,
}: ConversationFlowProps) {
  const {
    step,
    selectedEvent,
    industryContext,
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
  } = useConversationState({ events, contextIndustries, basePath, onStepChange });

  if (step === "brief" && selectedEvent) {
    const brief = generateTechnologyImpactReview(
      {
        event: selectedEvent,
        answers,
        context: { industry: industryContext },
      },
      patternRegistry,
      overlayRegistry
    );

    return (
      <div className="animate-fade-in">
        <button
          onClick={reset}
          className="mb-6 text-sm text-muted-light transition-colors hover:text-foreground"
        >
          ← Start over
        </button>
        <ExecutiveBriefDisplay
          brief={brief}
          eventSlug={selectedEvent.slug}
          industrySlug={industryContext?.slug ?? null}
        />
      </div>
    );
  }

  if (step === "intro" && selectedEvent) {
    return (
      <ConversationIntro
        event={selectedEvent}
        industryTitle={industryContext?.title}
        onContinue={continueFromIntro}
        onBack={goBack}
      />
    );
  }

  if (step === "industry" && selectedEvent) {
    return (
      <IndustrySelector
        eventTitle={selectedEvent.title}
        industries={contextIndustries}
        onSelect={selectIndustry}
        onSkip={skipIndustry}
        onBack={goBack}
      />
    );
  }

  if (step === "conversation" && selectedEvent && currentQuestion) {
    const questionCount = selectedEvent.questions.length;
    const totalSteps = 2 + questionCount + 1;
    const currentStep = 2 + questionIndex + 1;

    return (
      <div className="animate-fade-in">
        <ConversationProgress
          eventTitle={selectedEvent.title}
          questionIndex={questionIndex}
          questionCount={questionCount}
          totalSteps={totalSteps}
          currentStep={currentStep}
          questionPurpose={currentQuestion.purpose}
          onBack={goBack}
        />
        <QuestionStep
          question={currentQuestion}
          answers={answers}
          onAnswer={handleAnswer}
          onMultiselectToggle={handleMultiselectToggle}
          onMultiselectContinue={handleMultiselectContinue}
        />
      </div>
    );
  }

  return (
    <EventSelector events={events} variant={variant} onSelect={selectEvent} />
  );
}
