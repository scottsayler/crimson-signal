import type { SitePage, SiteSection } from "@/lib/site/types";
import { MarkdownContent } from "@/components/MarkdownContent";

interface PageSectionsProps {
  sections: SitePage["sections"];
}

export function PageSections({ sections }: PageSectionsProps) {
  return (
    <div className="max-w-3xl space-y-10">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
            {section.heading}
          </h2>
          <MarkdownContent content={section.body} />
        </section>
      ))}
    </div>
  );
}

interface PageSidebarProps {
  page: SitePage & { section: SiteSection };
}

export function PageSidebar({ page }: PageSidebarProps) {
  const tags: { label: string; value: string }[] = [];

  if (page.industry) tags.push({ label: "Industry", value: page.industry });
  if (page.technology) tags.push({ label: "Technology", value: page.technology });
  if (page.problem) tags.push({ label: "Problem", value: page.problem });
  tags.push({ label: "Buyer stage", value: page.buyerStage });
  if (page.primaryKeyword) tags.push({ label: "Primary keyword", value: page.primaryKeyword });

  return (
    <aside className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
          Page metadata
        </h3>
        <dl className="space-y-3">
          {tags.map((tag) => (
            <div key={tag.label}>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-light">
                {tag.label}
              </dt>
              <dd className="mt-0.5 text-sm capitalize text-muted">{tag.value.replace(/-/g, " ")}</dd>
            </div>
          ))}
        </dl>
      </div>

      {page.secondaryKeywords.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
            Related topics
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {page.secondaryKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-border-light px-2.5 py-0.5 text-[11px] font-medium text-muted"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
