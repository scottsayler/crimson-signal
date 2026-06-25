interface ConversationProgressProps {
  eventTitle: string;
  questionIndex: number;
  questionCount: number;
  onBack: () => void;
}

export function ConversationProgress({
  eventTitle,
  questionIndex,
  questionCount,
  onBack,
}: ConversationProgressProps) {
  const progress = ((questionIndex + 1) / questionCount) * 100;

  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-muted-light transition-colors hover:text-foreground"
      >
        ← Back
      </button>

      <div className="mb-2 flex items-center justify-between text-xs text-muted-light">
        <span>{eventTitle}</span>
        <span>
          {questionIndex + 1} / {questionCount}
        </span>
      </div>
      <div className="h-0.5 overflow-hidden rounded-full bg-border-light">
        <div
          className="h-full rounded-full bg-crimson transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
