import type { Metadata } from "next";
import Link from "next/link";
import { getAllBusinessEvents } from "@/lib/content";
import { BusinessEventCard } from "@/components/BusinessEventCard";

export const metadata: Metadata = {
  title: "Business Events",
  description:
    "Business events that create technology implications for multi-location organizations.",
};

export default function BusinessEventsPage() {
  const events = getAllBusinessEvents();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          Business Events
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          What&apos;s driving your technology conversation?
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Every business change creates technology implications. These are the
          events that most frequently trigger strategy conversations in
          multi-location organizations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <BusinessEventCard
            key={event.slug}
            slug={event.slug}
            title={event.title}
            shortDescription={event.shortDescription}
            icon={event.icon}
            technologyDomains={event.technologyDomains}
          />
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-sm text-muted">
          Not sure which event fits?{" "}
          <Link href="/" className="font-medium text-crimson hover:text-crimson-dark">
            Start the guided conversation →
          </Link>
        </p>
      </div>
    </div>
  );
}
