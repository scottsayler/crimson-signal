import type { CachedPage } from "@/lib/site/pipeline";

interface PageDevQualityPanelProps {
  page: CachedPage;
}

/** Development-only quality checklist — never shown in production UI. */
export function PageDevQualityPanel({ page }: PageDevQualityPanelProps) {
  if (process.env.NODE_ENV !== "development" || !page.quality || page.quality.issueCount === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-800">
        Quality checklist
      </h3>
      <ul className="space-y-2 text-xs text-amber-900">
        {[...page.quality.errors, ...page.quality.warnings].map((issue) => (
          <li key={`${issue.code}-${issue.field}`}>
            <span className="font-medium">{issue.severity}:</span> {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
