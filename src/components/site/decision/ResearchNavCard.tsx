import Link from "next/link";
import type { RelatedContentItem } from "@/lib/site/types";
import { CONTENT_TYPE_LABELS } from "@/lib/site/types";

interface ResearchNavCardProps {
  item: RelatedContentItem;
  isActive?: boolean;
  compact?: boolean;
}

export function ResearchNavCard({ item, isActive = false, compact = false }: ResearchNavCardProps) {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`group block rounded-lg border px-3.5 py-3 transition-all ${
        isActive
          ? "border-crimson/30 bg-crimson-light shadow-[inset_2px_0_0_0_var(--crimson)]"
          : "border-border bg-background hover:border-crimson/20 hover:bg-surface"
      }`}
    >
      <p
        className={`text-sm font-medium leading-snug ${
          isActive ? "text-crimson" : "text-foreground group-hover:text-crimson"
        }`}
      >
        {item.title}
      </p>
      {!compact && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{item.description}</p>
      )}
      <div className="mt-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-light">
        <span>{CONTENT_TYPE_LABELS[item.contentType]}</span>
        {item.readingTime && (
          <>
            <span aria-hidden="true">·</span>
            <span>{item.readingTime} min</span>
          </>
        )}
      </div>
    </Link>
  );
}
