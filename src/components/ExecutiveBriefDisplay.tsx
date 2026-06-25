import type { ReactNode } from "react";
import type { TechnologyImpactReview } from "@/lib/brief";
import { AboutScott } from "./AboutScott";
import { StrategySessionCTA } from "./StrategySessionCTA";

interface ExecutiveBriefDisplayProps {
  brief: TechnologyImpactReview;
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-medium tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2.5 pl-5">
      {items.map((item) => (
        <li key={item} className="text-[15px] leading-relaxed text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ExecutiveBriefDisplay({ brief }: ExecutiveBriefDisplayProps) {
  const formattedDate = new Date(brief.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8 border-b border-border pb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-light">
          Technology Impact Review
        </p>
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          {brief.title}
        </h1>
        {brief.industryTitle && (
          <p className="mt-2 text-sm text-muted-light">
            Industry context: {brief.industryTitle}
          </p>
        )}
        <p className="mt-3 text-sm text-muted-light">{formattedDate}</p>
      </div>

      <ReviewSection title="Executive Summary">
        <p className="text-[15px] leading-relaxed text-muted">
          {brief.executiveSummary}
        </p>
      </ReviewSection>

      <StrategySessionCTA variant="prominent" label={brief.ctaLabel} />

      <ReviewSection title="Here's what we heard">
        <BulletList items={brief.whatWeHeard} />
      </ReviewSection>

      <ReviewSection title="What this likely impacts">
        <BulletList items={brief.likelyImpacts} />
      </ReviewSection>

      <ReviewSection title="Common blind spots">
        <BulletList items={brief.blindSpots} />
      </ReviewSection>

      <ReviewSection title="Questions we'd explore together">
        <BulletList items={brief.questionsToExplore} />
      </ReviewSection>

      <ReviewSection title="Areas we'd explore next">
        <BulletList items={brief.areasToExploreNext} />
      </ReviewSection>

      <ReviewSection title="Suggested sequencing">
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Immediate</h3>
            <BulletList items={brief.roadmap.immediate} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Next 30 days</h3>
            <BulletList items={brief.roadmap.next30Days} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Next 90 days</h3>
            <BulletList items={brief.roadmap.next90Days} />
          </div>
        </div>
      </ReviewSection>

      <ReviewSection title="Recommended next conversation">
        <p className="text-[15px] leading-relaxed text-muted">
          {brief.nextConversation}
        </p>
      </ReviewSection>

      <AboutScott />
      <StrategySessionCTA label={brief.ctaLabel} />
    </div>
  );
}
