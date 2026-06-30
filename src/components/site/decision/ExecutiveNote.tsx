import type { ReactNode } from "react";
import { MarkdownContent } from "@/components/MarkdownContent";

type ExecutiveNoteVariant = "reality-check" | "worth-knowing" | "perspective";

interface ExecutiveNoteProps {
  title: string;
  children: string;
  variant?: ExecutiveNoteVariant;
  icon?: ReactNode;
}

const VARIANT_STYLES: Record<
  ExecutiveNoteVariant,
  { container: string; icon: string; title: string }
> = {
  "reality-check": {
    container:
      "border-amber-200/80 bg-amber-50/70 shadow-[inset_3px_0_0_0_#f59e0b] dark:border-amber-900/40 dark:bg-amber-950/20",
    icon: "text-amber-700 dark:text-amber-400",
    title: "text-amber-950 dark:text-amber-100",
  },
  "worth-knowing": {
    container:
      "border-border bg-[#f8f8f7] shadow-[inset_3px_0_0_0_#a8a29e] dark:border-border dark:bg-border-light/30",
    icon: "text-stone-600 dark:text-stone-400",
    title: "text-foreground",
  },
  perspective: {
    container:
      "border-border bg-[#fafaf9] shadow-[inset_3px_0_0_0_#d6d3d1]",
    icon: "text-muted",
    title: "text-foreground",
  },
};

function DefaultIcon({ variant }: { variant: ExecutiveNoteVariant }) {
  const iconClass = VARIANT_STYLES[variant].icon;

  if (variant === "perspective") {
    return (
      <svg
        aria-hidden="true"
        className={`h-5 w-5 ${iconClass}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18.75a6.75 6.75 0 0 0 6.75-6.75v-1.5m-6.75 7.5a6.75 6.75 0 0 1-6.75-6.75v-1.5m6.75 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
        />
      </svg>
    );
  }

  if (variant === "worth-knowing") {
    return (
      <svg
        aria-hidden="true"
        className={`h-5 w-5 ${iconClass}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 ${iconClass}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    </svg>
  );
}

export function ExecutiveNote({
  title,
  children,
  variant = "reality-check",
  icon,
}: ExecutiveNoteProps) {
  if (!children.trim()) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <aside
      aria-label={title}
      className={`scroll-mt-24 rounded-xl border px-6 py-5 ${styles.container}`}
    >
      <div className="mb-3 flex items-center gap-2.5">
        {icon ?? <DefaultIcon variant={variant} />}
        <h2 className={`font-serif text-xl font-medium tracking-tight ${styles.title}`}>
          {title}
        </h2>
      </div>
      <div className="max-w-3xl text-[15px] leading-[1.75] text-foreground/90">
        <MarkdownContent content={children} />
      </div>
    </aside>
  );
}
