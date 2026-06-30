import type { DecisionMatrixRow } from "@/lib/site/types";
import { SectionPlaceholder } from "./SectionPlaceholder";

interface DecisionMatrixProps {
  rows: DecisionMatrixRow[];
}

export function DecisionMatrix({ rows }: DecisionMatrixProps) {
  return (
    <section aria-label="Decision matrix" className="scroll-mt-24">
      <h2 className="mb-5 font-serif text-2xl font-medium tracking-tight text-foreground">
        Decision Matrix
      </h2>
      {rows.length === 0 ? (
        <SectionPlaceholder />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full min-w-[360px] text-left">
            <thead>
              <tr className="border-b border-border bg-border-light/60">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  Situation
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.situation}
                  className={`border-b border-border last:border-0 ${
                    index % 2 === 0 ? "bg-surface" : "bg-border-light/25"
                  }`}
                >
                  <td className="px-5 py-4 text-[15px] leading-relaxed text-muted">
                    {row.situation}
                  </td>
                  <td className="px-5 py-4 text-[15px] font-medium leading-relaxed text-foreground">
                    {row.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
