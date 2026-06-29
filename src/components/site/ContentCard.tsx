import Link from "next/link";
import type { SitePage, SiteSection } from "@/lib/site/types";
import { CONTENT_TYPE_LABELS, getSitePageUrl } from "@/lib/site/types";

interface ContentCardProps {
  page: SitePage & { section: SiteSection };
}

export function ContentCard({ page }: ContentCardProps) {
  return (
    <Link
      href={getSitePageUrl(page)}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-crimson/30 hover:shadow-[0_4px_24px_rgba(155,27,48,0.06)]"
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-light">
        {CONTENT_TYPE_LABELS[page.contentType]}
      </p>
      <h3 className="mb-2 text-[17px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-crimson">
        {page.title}
      </h3>
      <p className="flex-1 text-sm leading-relaxed text-muted">{page.description}</p>
    </Link>
  );
}
