import { MarkdownContent } from "@/components/MarkdownContent";

interface QuickAnswerProps {
  children: string;
}

export function QuickAnswer({ children }: QuickAnswerProps) {
  return (
    <section
      aria-label="Quick answer"
      className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 dark:border-blue-900/40 dark:bg-blue-950/20"
    >
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-800 dark:text-blue-300">
        Quick Answer
      </h2>
      <div className="text-[15px] leading-relaxed text-foreground">
        <MarkdownContent content={children} />
      </div>
    </section>
  );
}
