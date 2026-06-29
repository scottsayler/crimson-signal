"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { BusinessEvent, Industry, SampleReviewListing } from "@/lib/types";
import type { IndustryOverlayRegistry } from "@/lib/context/types";
import type { PatternRegistry } from "@/lib/patterns";
import type { ConversationStep } from "@/lib/conversation";
import {
  getHomepageEvents,
  resolveHomepageFeaturedReviews,
} from "@/lib/homepage";
import { HomeLanding } from "./HomeLanding";
import { ConversationFlow } from "./ConversationFlow";

export function HomeExperience({
  events,
  contextIndustries,
  overlayRegistry,
  patternRegistry,
  featuredSamples,
}: {
  events: BusinessEvent[];
  contextIndustries: Industry[];
  overlayRegistry: IndustryOverlayRegistry;
  patternRegistry: PatternRegistry;
  featuredSamples: SampleReviewListing[];
}) {
  return (
    <Suspense fallback={<HomeExperienceFallback events={events} />}>
      <HomeExperienceInner
        events={events}
        contextIndustries={contextIndustries}
        overlayRegistry={overlayRegistry}
        patternRegistry={patternRegistry}
        featuredSamples={featuredSamples}
      />
    </Suspense>
  );
}

function HomeExperienceInner({
  events,
  contextIndustries,
  overlayRegistry,
  patternRegistry,
  featuredSamples,
}: {
  events: BusinessEvent[];
  contextIndustries: Industry[];
  overlayRegistry: IndustryOverlayRegistry;
  patternRegistry: PatternRegistry;
  featuredSamples: SampleReviewListing[];
}) {
  const searchParams = useSearchParams();
  const urlEventSlug = searchParams.get("event");
  const [step, setStep] = useState<ConversationStep>("select");

  const homepageEvents = getHomepageEvents(events);
  const featuredReviews = resolveHomepageFeaturedReviews(featuredSamples);
  const inAssessment = step !== "select" || !!urlEventSlug;

  if (!inAssessment) {
    return (
      <HomeLanding events={homepageEvents} featuredReviews={featuredReviews} />
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col justify-start px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto w-full max-w-xl animate-fade-in">
        <ConversationFlow
          events={events}
          contextIndustries={contextIndustries}
          overlayRegistry={overlayRegistry}
          patternRegistry={patternRegistry}
          basePath="/"
          showEventSelector={false}
          onStepChange={setStep}
        />
      </div>
    </div>
  );
}

function HomeExperienceFallback({ events }: { events: BusinessEvent[] }) {
  const homepageEvents = getHomepageEvents(events);

  return (
    <div className="animate-pulse">
      <div className="border-b border-border/60 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto mb-4 h-3 w-32 rounded bg-border-light" />
          <div className="mx-auto h-10 w-full max-w-lg rounded bg-border-light" />
          <div className="mx-auto mt-4 h-16 w-full max-w-md rounded bg-border-light" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homepageEvents.map((event) => (
            <div
              key={event.slug}
              className="h-44 rounded-2xl border border-border bg-border-light/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
