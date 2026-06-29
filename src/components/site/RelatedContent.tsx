import Link from "next/link";
import type { SiteSection } from "@/lib/site/types";
import { SECTION_LABELS } from "@/lib/site/types";

interface RelatedContentProps {
  pages: { href: string; title: string; section: SiteSection }[];
}

export function RelatedContent({ pages }: RelatedContentProps) {
  if (pages.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-6 font-serif text-2xl font-medium tracking-tight text-foreground">
        Related research
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-crimson/30 hover:shadow-[0_4px_24px_rgba(155,27,48,0.06)]"
          >
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-light">
              {SECTION_LABELS[page.section]}
            </p>
            <p className="text-[15px] font-medium text-foreground transition-colors group-hover:text-crimson">
              {page.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
