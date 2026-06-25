"use client";

import type { BusinessEvent } from "@/lib/types";
import type { ConversationStep } from "@/lib/conversation";
import { generateTechnologyImpactReview } from "@/lib/brief";
import { useConversationState } from "@/hooks/useConversationState";
import { EventSelector } from "./EventSelector";
import { ConversationIntro } from "./ConversationIntro";
import { ConversationProgress } from "./ConversationProgress";
import { QuestionStep } from "./QuestionStep";
import { ExecutiveBriefDisplay } from "./ExecutiveBriefDisplay";

interface ConversationFlowProps {
  events: BusinessEvent[];
  basePath?: string;
  variant?: "home" | "page";
  onStepChange?: (step: ConversationStep) => void;
}

export function ConversationFlow({
  events,
  basePath = "/",
  variant = "home",
  onStepChange,
}: ConversationFlowProps) {
  const {
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
  } = useConversationState({ events, basePath, onStepChange });

  if (step === "brief" && selectedEvent) {
    const brief = generateTechnologyImpactReview(selectedEvent, answers);
    return (
      <div className="animate-fade-in">
        <button
          onClick={reset}
          className="mb-6 text-sm text-muted-light transition-colors hover:text-foreground"
        >
          ← Start over
        </button>
        <ExecutiveBriefDisplay brief={brief} />
      </div>
    );
  }

  if (step === "intro" && selectedEvent) {
    return (
      <ConversationIntro
        event={selectedEvent}
        onContinue={continueFromIntro}
        onBack={goBack}
      />
    );
  }

  if (step === "conversation" && selectedEvent && currentQuestion) {
    return (
      <div className="animate-fade-in">
        <ConversationProgress
          eventTitle={selectedEvent.title}
          questionIndex={questionIndex}
          questionCount={selectedEvent.questions.length}
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
