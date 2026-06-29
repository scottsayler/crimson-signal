import { UNEXPECTED_QUESTION } from "@/lib/copy";

export type UnexpectedResponse = "yes" | "somewhat" | "no";

interface UnexpectedFeedbackProps {
  value: UnexpectedResponse | null;
  onChange: (value: UnexpectedResponse) => void;
}

const OPTIONS: { value: UnexpectedResponse; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "somewhat", label: "Somewhat" },
  { value: "no", label: "No" },
];

export function UnexpectedFeedback({ value, onChange }: UnexpectedFeedbackProps) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-[15px] font-medium text-foreground">
        {UNEXPECTED_QUESTION}
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                selected
                  ? "border-crimson/40 bg-crimson text-white"
                  : "border-border bg-surface text-muted hover:border-foreground/15 hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
