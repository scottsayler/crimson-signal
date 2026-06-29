import type { SampleReview, SampleReviewListing } from "@/lib/types";
import { BulletList, ReviewSection } from "./review-display-parts";

interface SampleReviewDisplayProps {
  sample: SampleReview | SampleReviewListing & { review: SampleReview["review"] };
}

export function SampleReviewDisplay({ sample }: SampleReviewDisplayProps) {
  const formattedDate = new Date(sample.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { review } = sample;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 border-b border-border pb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-light">
          Technology Impact Review
        </p>
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          {sample.title}
        </h1>
        <p className="mt-2 text-sm text-muted-light">
          {sample.businessEvent} · {sample.industry}
        </p>
        <p className="mt-3 text-sm text-muted-light">{formattedDate}</p>
      </div>

      <ReviewSection title="Executive Summary">
        <p className="text-[15px] leading-relaxed text-muted">{review.executiveSummary}</p>
      </ReviewSection>

      <ReviewSection title="Executive Observations">
        <BulletList items={review.executiveObservations} />
      </ReviewSection>

      <ReviewSection title="Common Blind Spots">
        <BulletList items={review.commonBlindSpots} />
      </ReviewSection>

      <ReviewSection title="Technology Implications">
        <BulletList items={review.technologyImplications} />
      </ReviewSection>

      <ReviewSection title="Questions We'd Explore Together">
        <BulletList items={review.questionsToExplore} />
      </ReviewSection>

      <ReviewSection title="Suggested Sequencing">
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Immediate</h3>
            <BulletList items={review.suggestedSequencing.immediate} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Next 30 days</h3>
            <BulletList items={review.suggestedSequencing.next30Days} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Next 90 days</h3>
            <BulletList items={review.suggestedSequencing.next90Days} />
          </div>
        </div>
      </ReviewSection>

      <ReviewSection title="Recommended Next Conversation">
        <p className="text-[15px] leading-relaxed text-muted">
          {review.recommendedNextConversation}
        </p>
      </ReviewSection>
    </div>
  );
}
