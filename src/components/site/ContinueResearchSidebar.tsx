import type { CachedPage } from "@/lib/site/pipeline";
import type { ResolvedRelatedContent } from "@/lib/site/types";
import { resolveRelatedContent } from "@/lib/site/content";
import { ResearchNavCard } from "./decision/ResearchNavCard";

interface ContinueResearchSidebarProps {
  page: CachedPage;
  currentPath: string;
}

type SidebarGroupKey = "guides" | "problems" | "technologies" | "tools";

const SIDEBAR_GROUPS: { key: SidebarGroupKey; title: string }[] = [
  { key: "guides", title: "Guides" },
  { key: "problems", title: "Business Problems" },
  { key: "technologies", title: "Technologies" },
  { key: "tools", title: "Tools" },
];

function SidebarLinkGroup({
  title,
  items,
  currentPath,
}: {
  title: string;
  items: ResolvedRelatedContent[SidebarGroupKey];
  currentPath: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-light">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <ResearchNavCard
              item={item}
              isActive={currentPath === item.href}
              compact
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContinueResearchSidebar({ page, currentPath }: ContinueResearchSidebarProps) {
  const related = resolveRelatedContent(page);
  const hasContent = SIDEBAR_GROUPS.some(({ key }) => related[key].length > 0);

  if (!hasContent) return null;

  return (
    <nav
      aria-label="Continue your research"
      className="rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24"
    >
      <h2 className="mb-5 font-serif text-lg font-medium tracking-tight text-foreground">
        Continue Your Research
      </h2>
      <div className="space-y-6">
        {SIDEBAR_GROUPS.map(({ key, title }) => (
          <SidebarLinkGroup
            key={key}
            title={title}
            items={related[key]}
            currentPath={currentPath}
          />
        ))}
      </div>
    </nav>
  );
}
