import type { ResolvedRelatedContent } from "@/lib/site/types";
import { ResearchNavCard } from "./ResearchNavCard";

interface ContinueResearchProps {
  related: ResolvedRelatedContent;
}

function ResearchGroup({
  title,
  items,
}: {
  title: string;
  items: ResolvedRelatedContent[keyof ResolvedRelatedContent];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <ResearchNavCard key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}

export function ContinueResearch({ related }: ContinueResearchProps) {
  const comparisonsAndResearch = [...related.comparisons, ...related.research];
  const hasBottomContent = comparisonsAndResearch.length > 0;

  if (!hasBottomContent) return null;

  return (
    <section aria-label="More research" className="mt-20 border-t border-border pt-14">
      <h2 className="mb-8 font-serif text-2xl font-medium tracking-tight text-foreground">
        More Research
      </h2>

      <div className="space-y-8">
        <ResearchGroup title="Comparisons" items={related.comparisons} />
        <ResearchGroup title="Research" items={related.research} />
      </div>
    </section>
  );
}
