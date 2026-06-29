"use client";

import { Suspense, useState } from "react";
import type { BusinessEvent, Industry } from "@/lib/types";
import type { IndustryOverlayRegistry } from "@/lib/context/types";
import type { PatternRegistry } from "@/lib/patterns";
import type { ConversationStep } from "@/lib/conversation";
import { HOME_HEADLINE, HOME_SUBHEAD } from "@/lib/copy";
import { HomeBanner } from "./HomeBanner";
import { ConversationFlow } from "./ConversationFlow";

export function HomeExperience({
  events,
  contextIndustries,
  overlayRegistry,
  patternRegistry,
}: {
  events: BusinessEvent[];
  contextIndustries: Industry[];
  overlayRegistry: IndustryOverlayRegistry;
  patternRegistry: PatternRegistry;
}) {
  const [step, setStep] = useState<ConversationStep>("select");

  return (
    <div
      className={`flex min-h-[calc(100dvh-3.5rem)] flex-col px-4 sm:px-6 ${
        step === "select" ? "justify-start pt-10 pb-8 md:pt-14" : "justify-start py-10 md:py-14"
      }`}
    >
      <div className="mx-auto w-full max-w-xl">
        <Suspense fallback={<HomeExperienceFallback events={events} />}>
          <ConversationFlow
            events={events}
            contextIndustries={contextIndustries}
            overlayRegistry={overlayRegistry}
            patternRegistry={patternRegistry}
            basePath="/"
            variant="home"
            onStepChange={setStep}
          />
        </Suspense>
      </div>
    </div>
  );
}

function HomeExperienceFallback({ events }: { events: BusinessEvent[] }) {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-[1.75rem]">
        {HOME_HEADLINE}
      </h1>
      <p className="mx-auto mt-3 mb-8 max-w-md text-sm text-muted">{HOME_SUBHEAD}</p>
      <HomeBanner />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {events.map((event) => (
          <div
            key={event.slug}
            className="h-12 animate-pulse rounded-xl border border-border bg-border-light/50"
          />
        ))}
      </div>
    </div>
  );
}
