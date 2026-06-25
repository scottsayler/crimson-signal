"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { BusinessEvent, ConversationQuestion } from "@/lib/types";
import { generateExecutiveBrief } from "@/lib/brief";
import { ExecutiveBriefDisplay } from "./ExecutiveBriefDisplay";
import { CTAButton } from "./CTAButton";

type Step = "select" | "conversation" | "brief";

interface ConversationFlowProps {
  events: BusinessEvent[];
  initialEventSlug?: string;
}

export function ConversationFlow({ events, initialEventSlug }: ConversationFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialEventSlug ? "conversation" : "select");
  const [selectedEvent, setSelectedEvent] = useState<BusinessEvent | null>(
    initialEventSlug ? events.find((e) => e.slug === initialEventSlug) ?? null : null
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const selectEvent = useCallback(
    (event: BusinessEvent) => {
      setSelectedEvent(event);
      setQuestionIndex(0);
      setAnswers({});
      setStep("conversation");
      router.replace(`/brief?event=${event.slug}`, { scroll: false });
    },
    [router]
  );

  const currentQuestion: ConversationQuestion | undefined =
    selectedEvent?.questions[questionIndex];

  const handleAnswer = (value: string | string[]) => {
    if (!currentQuestion) return;
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    if (selectedEvent && questionIndex < selectedEvent.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setStep("brief");
    }
  };

  const handleMultiselectToggle = (option: string) => {
    if (!currentQuestion) return;
    const current = (answers[currentQuestion.id] as string[]) ?? [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswers({ ...answers, [currentQuestion.id]: updated });
  };

  const handleMultiselectContinue = () => {
    if (!currentQuestion) return;
    const current = (answers[currentQuestion.id] as string[]) ?? [];
    if (current.length === 0) return;
    handleAnswer(current);
  };

  const reset = () => {
    setStep("select");
    setSelectedEvent(null);
    setQuestionIndex(0);
    setAnswers({});
    router.replace("/brief", { scroll: false });
  };

  if (step === "brief" && selectedEvent) {
    const brief = generateExecutiveBrief(selectedEvent, answers);
    return (
      <div>
        <button
          onClick={reset}
          className="mb-8 text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Start over
        </button>
        <ExecutiveBriefDisplay brief={brief} />
      </div>
    );
  }

  if (step === "conversation" && selectedEvent && currentQuestion) {
    const progress = ((questionIndex + 1) / selectedEvent.questions.length) * 100;

    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <button
            onClick={() => {
              if (questionIndex > 0) {
                setQuestionIndex(questionIndex - 1);
              } else {
                reset();
              }
            }}
            className="mb-4 text-sm text-muted transition-colors hover:text-foreground"
          >
            ← Back
          </button>

          <div className="mb-2 flex items-center justify-between text-xs text-muted-light">
            <span>{selectedEvent.title}</span>
            <span>
              {questionIndex + 1} of {selectedEvent.questions.length}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-border-light">
            <div
              className="h-full rounded-full bg-crimson transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="mb-8 font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          {currentQuestion.question}
        </h2>

        {currentQuestion.type === "multiselect" ? (
          <div>
            <div className="mb-6 space-y-2">
              {currentQuestion.options?.map((option) => {
                const selected = (
                  (answers[currentQuestion.id] as string[]) ?? []
                ).includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleMultiselectToggle(option)}
                    className={`w-full rounded-xl border px-5 py-4 text-left text-sm transition-all duration-200 ${
                      selected
                        ? "border-crimson bg-crimson-light text-foreground"
                        : "border-border bg-surface text-muted hover:border-crimson/30 hover:bg-crimson-light/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? "border-crimson bg-crimson text-white"
                            : "border-border"
                        }`}
                      >
                        {selected && (
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M10.28 2.28a1 1 0 0 1 0 1.42l-5.5 5.5a1 1 0 0 1-1.42 0l-2.5-2.5a1 1 0 1 1 1.42-1.42L4.5 7.15l4.79-4.79a1 1 0 0 1 1.42 0z" />
                          </svg>
                        )}
                      </span>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
            <CTAButton
              onClick={handleMultiselectContinue}
              className={
                ((answers[currentQuestion.id] as string[]) ?? []).length === 0
                  ? "pointer-events-none opacity-40"
                  : ""
              }
            >
              Continue
            </CTAButton>
          </div>
        ) : (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="w-full rounded-xl border border-border bg-surface px-5 py-4 text-left text-sm text-muted transition-all duration-200 hover:border-crimson/30 hover:bg-crimson-light/50 hover:text-foreground"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12 text-center">
        <h1 className="animate-fade-in-up font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          What&apos;s changed?
        </h1>
        <p className="animate-fade-in-up animation-delay-100 mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          Business change creates technology implications. Select the event
          driving your organization&apos;s technology conversation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event, i) => (
          <button
            key={event.slug}
            onClick={() => selectEvent(event)}
            className={`animate-fade-in-up group flex flex-col rounded-xl border border-border bg-surface p-6 text-left transition-all duration-300 hover:border-crimson/30 hover:shadow-[0_4px_24px_rgba(155,27,48,0.06)] animation-delay-${Math.min((i + 2) * 100, 400)}`}
            style={{ animationDelay: `${Math.min((i + 1) * 50, 400)}ms`, opacity: 0 }}
          >
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-crimson-light text-lg text-crimson transition-colors group-hover:bg-crimson group-hover:text-white">
              {event.icon}
            </span>
            <span className="mb-2 text-[17px] font-semibold tracking-tight text-foreground">
              {event.title}
            </span>
            <span className="text-sm leading-relaxed text-muted">
              {event.shortDescription}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
