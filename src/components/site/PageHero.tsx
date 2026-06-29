import type { SitePage, SiteSection } from "@/lib/site/types";
import { CONTENT_TYPE_LABELS } from "@/lib/site/types";

interface PageHeroProps {
  page: SitePage & { section: SiteSection };
  eyebrow?: string;
}

export function PageHero({ page, eyebrow }: PageHeroProps) {
  const label = eyebrow ?? CONTENT_TYPE_LABELS[page.contentType];

  return (
    <header className="mb-10 max-w-3xl">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
        {label}
      </p>
      <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-[2.75rem] md:leading-tight">
        {page.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{page.description}</p>
    </header>
  );
}
