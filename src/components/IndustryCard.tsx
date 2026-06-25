import Link from "next/link";
import { getDomainLabel } from "@/lib/types";

interface IndustryCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  technologyDomains: string[];
}

export function IndustryCard({
  slug,
  title,
  shortDescription,
  technologyDomains,
}: IndustryCardProps) {
  return (
    <Link
      href={`/industries/${slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-crimson/30 hover:shadow-[0_4px_24px_rgba(155,27,48,0.06)]"
    >
      <h3 className="mb-2 text-[17px] font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">
        {shortDescription}
      </p>
      <div className="flex flex-wrap gap-1.5">
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
