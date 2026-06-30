import type { EvidenceItem } from "@/lib/site/types";

interface EvidenceCardProps {
  items: EvidenceItem[];
}

export function EvidenceCard({ items }: EvidenceCardProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label="Evidence">
      <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
        Research Summary
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <h3 className="text-[15px] font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.finding}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              <span className="font-medium">Why it matters: </span>
              {item.whyItMatters}
            </p>
            {item.source && (
              <p className="mt-2 text-xs text-muted-light">Source: {item.source}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
