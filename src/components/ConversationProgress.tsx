import {
  CONVERSATION_SECONDS_FOR_REVIEW,
  CONVERSATION_SECONDS_PER_QUESTION,
} from "@/lib/copy";

interface ConversationProgressProps {
  eventTitle: string;
  questionIndex: number;
  questionCount: number;
  totalSteps: number;
  currentStep: number;
  questionPurpose?: string;
  onBack: () => void;
}

function formatEstimatedTime(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `~${totalSeconds} sec remaining`;
  }

  const minutes = Math.ceil(totalSeconds / 60);
  return `~${minutes} min remaining`;
}

export function ConversationProgress({
  eventTitle,
  questionIndex,
  questionCount,
  totalSteps,
  currentStep,
  questionPurpose,
  onBack,
}: ConversationProgressProps) {
  const currentQuestion = questionIndex + 1;
  const remainingQuestions = questionCount - currentQuestion;
  const isLast = currentQuestion === questionCount;

  const estimatedSeconds =
    remainingQuestions * CONVERSATION_SECONDS_PER_QUESTION +
    CONVERSATION_SECONDS_FOR_REVIEW;

  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="mb-5 text-sm text-muted-light transition-colors hover:text-foreground"
      >
        ← Back
      </button>

      <div className="mb-3 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-crimson">
            Building your review
          </p>
          <p className="mt-1 truncate text-sm text-foreground">{eventTitle}</p>
        </div>
        <p className="shrink-0 text-sm font-medium text-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <div
        className="mb-2 flex gap-1"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index < currentStep ? "bg-crimson" : "bg-border-light"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-light">
        <span>
          Question {currentQuestion} of {questionCount}
          {questionPurpose ? ` — ${questionPurpose}` : ""}
        </span>
        <span>
          {isLast
            ? `Review next · ${formatEstimatedTime(CONVERSATION_SECONDS_FOR_REVIEW)}`
            : formatEstimatedTime(estimatedSeconds)}
        </span>
      </div>
    </div>
  );
}
