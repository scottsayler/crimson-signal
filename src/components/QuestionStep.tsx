import type { ConversationQuestion } from "@/lib/types";
import type { ConversationAnswers } from "@/lib/conversation";
import { CTAButton } from "./CTAButton";

interface QuestionStepProps {
  question: ConversationQuestion;
  answers: ConversationAnswers;
  onAnswer: (value: string | string[]) => void;
  onMultiselectToggle: (option: string) => void;
  onMultiselectContinue: () => void;
}

export function QuestionStep({
  question,
  answers,
  onAnswer,
  onMultiselectToggle,
  onMultiselectContinue,
}: QuestionStepProps) {
  return (
    <>
      <h2 className="mb-6 text-xl font-medium tracking-tight text-foreground md:text-2xl">
        {question.question}
      </h2>

      {question.type === "multiselect" ? (
        <div>
          <div className="mb-4 space-y-1.5">
            {question.options?.map((option) => {
              const selected = ((answers[question.id] as string[]) ?? []).includes(
                option
              );
              return (
                <button
                  key={option}
                  onClick={() => onMultiselectToggle(option)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150 ${
                    selected
                      ? "border-crimson/40 bg-crimson-light text-foreground"
                      : "border-border bg-surface text-muted hover:border-border hover:bg-border-light/60 hover:text-foreground"
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
            onClick={onMultiselectContinue}
            className={
              ((answers[question.id] as string[]) ?? []).length === 0
                ? "pointer-events-none opacity-40"
                : ""
            }
          >
            Continue
          </CTAButton>
        </div>
      ) : (
        <div className="space-y-1.5">
          {question.options?.map((option) => (
            <button
              key={option}
              onClick={() => onAnswer(option)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm text-foreground transition-all duration-150 hover:border-border hover:bg-border-light/60"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
