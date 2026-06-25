import Link from "next/link";
import { getDomainLabel } from "@/lib/types";

interface BusinessEventCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  technologyDomains: string[];
  compact?: boolean;
}

export function BusinessEventCard({
  slug,
  title,
  shortDescription,
  icon,
  technologyDomains,
  compact = false,
}: BusinessEventCardProps) {
  return (
    <Link
      href={`/brief?event=${slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-crimson/30 hover:shadow-[0_4px_24px_rgba(155,27,48,0.06)]"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson-light text-lg text-crimson transition-colors group-hover:bg-crimson group-hover:text-white">
          {icon}
        </span>
        <span className="text-muted-light opacity-0 transition-opacity group-hover:opacity-100">
          →
        </span>
      </div>

      <h3 className="mb-2 text-[17px] font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      {!compact && (
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">
          {shortDescription}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-1.5">
        {technologyDomains.slice(0, 3).map((domain) => (
          <span
            key={domain}
            className="rounded-full bg-border-light px-2.5 py-0.5 text-[11px] font-medium text-muted"
          >
            {getDomainLabel(domain)}
          </span>
        ))}
      </div>
    </Link>
  );
}
