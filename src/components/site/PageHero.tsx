import type { SitePage, SiteSection } from "@/lib/site/types";
import { CONTENT_TYPE_LABELS } from "@/lib/site/types";

interface PageHeroProps {
  page: SitePage & { section: SiteSection };
  eyebrow?: string;
}

export function PageHero({ page, eyebrow }: PageHeroProps) {
  const label = eyebrow ?? CONTENT_TYPE_LABELS[page.contentType];

  return (
    <header className="mb-12 max-w-3xl border-b border-border/60 pb-10">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
        {label}
      </p>
      <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-[2.75rem] md:leading-[1.15]">
        {page.title}
      </h1>
      <p className="mt-5 text-lg leading-[1.65] text-muted">{page.description}</p>
      {page.readingTime && (
        <p className="mt-4 text-sm text-muted-light">{page.readingTime} min read</p>
      )}
    </header>
  );
}
