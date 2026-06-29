import type { SiteSection } from "@/lib/site/types";
import { SECTION_LABELS } from "@/lib/site/types";
import { getPagesBySection } from "@/lib/site/content";
import { ContentCard } from "./ContentCard";

interface HubPageProps {
  section: SiteSection;
  title?: string;
  description?: string;
}

export function HubPage({ section, title, description }: HubPageProps) {
  const pages = getPagesBySection(section);
  const hubTitle = title ?? SECTION_LABELS[section];
  const hubDescription =
    description ??
    `Independent research and resources for multi-location organizations — organized by ${hubTitle.toLowerCase()}.`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          {hubTitle}
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          {hubTitle}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{hubDescription}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <ContentCard key={page.slug} page={page} />
        ))}
      </div>
    </div>
  );
}
