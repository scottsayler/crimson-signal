"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BusinessEvent } from "@/lib/types";
import type { HomepageFeaturedReview } from "@/lib/homepage";
import { getHomepageEventTitle } from "@/lib/homepage";
import {
  HOME_HEADLINE,
  HOME_SUBHEAD,
  HOME_HERO_PRIMARY_CTA,
  HOME_HERO_SECONDARY_CTA,
  HOME_BUSINESS_EVENTS_EYEBROW,
  HOME_BUSINESS_EVENTS_HEADING,
  HOME_BUSINESS_EVENTS_SUBHEAD,
  HOME_HOW_IT_WORKS_EYEBROW,
  HOME_HOW_IT_WORKS_HEADING,
  HOME_HOW_IT_WORKS_STEPS,
  HOME_SAMPLE_REVIEWS_EYEBROW,
  HOME_SAMPLE_REVIEWS_HEADING,
  HOME_SAMPLE_REVIEWS_SUBHEAD,
  HOME_WHY_EYEBROW,
  HOME_WHY_HEADING,
  HOME_WHY_POINTS,
  HOME_FOOTER_CTA_HEADING,
  HOME_FOOTER_CTA_BUTTON,
} from "@/lib/copy";
import { trackEvent } from "@/lib/analytics";
import { CTAButton } from "./CTAButton";

interface HomeLandingProps {
  events: BusinessEvent[];
  featuredReviews: HomepageFeaturedReview[];
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HomeLanding({ events, featuredReviews }: HomeLandingProps) {
  const router = useRouter();

  useEffect(() => {
    trackEvent("landing");
  }, []);

  const startAssessment = () => scrollToSection("business-events");

  const selectEvent = (slug: string) => {
    trackEvent("event_selected", { eventSlug: slug });
    router.push(`/?event=${slug}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(155,27,48,0.08),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
              Technology Impact Review
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
              {HOME_HEADLINE}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {HOME_SUBHEAD}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTAButton onClick={startAssessment}>{HOME_HERO_PRIMARY_CTA}</CTAButton>
              <CTAButton
                variant="secondary"
                onClick={() => scrollToSection("sample-reviews")}
              >
                {HOME_HERO_SECONDARY_CTA}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      <section id="business-events" className="scroll-mt-20 border-b border-border/60 bg-border-light/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-crimson">
              {HOME_BUSINESS_EVENTS_EYEBROW}
            </p>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {HOME_BUSINESS_EVENTS_HEADING}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {HOME_BUSINESS_EVENTS_SUBHEAD}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <button
                key={event.slug}
                type="button"
                onClick={() => selectEvent(event.slug)}
                className="group flex min-h-[180px] flex-col rounded-2xl border border-border bg-surface p-6 text-left transition-all duration-200 hover:border-crimson/30 hover:shadow-[0_8px_32px_rgba(155,27,48,0.08)] active:scale-[0.99]"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-light text-lg text-crimson transition-colors group-hover:bg-crimson group-hover:text-white">
                  {event.icon}
                </span>
                <span className="text-[17px] font-semibold tracking-tight text-foreground">
                  {getHomepageEventTitle(event.slug, event.title)}
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {event.shortDescription}
                </span>
                <span className="mt-4 text-sm font-medium text-crimson opacity-0 transition-opacity group-hover:opacity-100">
                  Start review →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-crimson">
              {HOME_HOW_IT_WORKS_EYEBROW}
            </p>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {HOME_HOW_IT_WORKS_HEADING}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {HOME_HOW_IT_WORKS_STEPS.map((step, index) => (
              <div key={step.title} className="relative text-center md:text-left">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-crimson text-sm font-semibold text-white md:mx-0">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sample-reviews" className="scroll-mt-20 border-b border-border/60 bg-border-light/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-crimson">
                {HOME_SAMPLE_REVIEWS_EYEBROW}
              </p>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                {HOME_SAMPLE_REVIEWS_HEADING}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {HOME_SAMPLE_REVIEWS_SUBHEAD}
              </p>
            </div>
            <Link
              href="/sample-reviews"
              className="hidden shrink-0 text-sm text-muted transition-colors hover:text-foreground sm:inline"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredReviews.map((review) => (
              <Link
                key={review.slug}
                href={`/sample-reviews/${review.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-crimson/30 hover:bg-crimson-light/30"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-crimson">
                  Technology Impact Review
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-crimson">
                  {review.title}
                </h3>
                <p className="mt-2 text-xs text-muted-light">
                  {review.businessEvent} · {review.industry}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {review.summary}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/sample-reviews"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              View all sample reviews →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-crimson">
              {HOME_WHY_EYEBROW}
            </p>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {HOME_WHY_HEADING}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {HOME_WHY_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-crimson-light/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {HOME_FOOTER_CTA_HEADING}
            </h2>
            <div className="mt-8">
              <CTAButton onClick={startAssessment}>{HOME_FOOTER_CTA_BUTTON}</CTAButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
