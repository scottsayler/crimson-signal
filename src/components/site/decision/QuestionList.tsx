interface QuestionListProps {
  questions: string[];
  numbered?: boolean;
  variant?: "evaluate" | "buy";
}

const VARIANT_STYLES = {
  evaluate: {
    item: "border-border bg-surface",
    marker: "border-blue-200 bg-blue-50 text-blue-700",
    text: "text-foreground",
  },
  buy: {
    item: "border-blue-200/60 bg-blue-50/30",
    marker: "border-blue-300 bg-blue-100 text-blue-800",
    text: "text-foreground",
  },
} as const;

export function QuestionList({
  questions,
  numbered = false,
  variant = "evaluate",
}: QuestionListProps) {
  if (questions.length === 0) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <ul className="space-y-2.5">
      {questions.map((question, index) => (
        <li
          key={question}
          className={`flex gap-3.5 rounded-xl border px-4 py-3.5 ${styles.item}`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-semibold ${styles.marker}`}
            aria-hidden="true"
          >
            {numbered ? (
              index + 1
            ) : (
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          <span className={`text-[15px] leading-[1.7] ${styles.text}`}>{question}</span>
        </li>
      ))}
    </ul>
  );
}
