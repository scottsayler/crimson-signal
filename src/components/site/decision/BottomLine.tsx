import { MarkdownContent } from "@/components/MarkdownContent";

interface BottomLineProps {
  children: string;
}

export function BottomLine({ children }: BottomLineProps) {
  if (!children.trim()) return null;

  return (
    <section
      aria-label="Bottom line"
      className="scroll-mt-24 rounded-2xl border border-foreground/10 bg-foreground px-8 py-8 text-background shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-background/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
        <h2 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Bottom Line
        </h2>
      </div>
      <div className="max-w-3xl text-[16px] leading-[1.8] text-background/90">
        <MarkdownContent content={children} />
      </div>
    </section>
  );
}
