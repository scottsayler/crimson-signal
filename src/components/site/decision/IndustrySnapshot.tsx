import type { IndustrySnapshotData } from "@/lib/site/types";

interface IndustrySnapshotProps {
  snapshot: IndustrySnapshotData;
}

export function IndustrySnapshot({ snapshot }: IndustrySnapshotProps) {
  return (
    <section aria-label="Industry snapshot" className="rounded-xl border border-border bg-surface p-6">
      <h2 className="mb-5 font-serif text-2xl font-medium tracking-tight text-foreground">
        Industry Snapshot
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-light">
            Top challenges
          </h3>
          <ul className="space-y-1.5 text-sm text-muted">
            {snapshot.topChallenges.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-light">
            Common priorities
          </h3>
          <ul className="space-y-1.5 text-sm text-muted">
            {snapshot.commonPriorities.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-light">
          Typical environment
        </h3>
        <p className="text-sm leading-relaxed text-muted">{snapshot.typicalEnvironment}</p>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-light">
          Buying triggers
        </h3>
        <ul className="space-y-1.5 text-sm text-muted">
          {snapshot.buyingTriggers.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
