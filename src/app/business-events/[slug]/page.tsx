import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBusinessEvents, getBusinessEvent } from "@/lib/content";
import { getDomainLabel } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { CTAButton } from "@/components/CTAButton";

export function generateStaticParams() {
  return getAllBusinessEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getBusinessEvent(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.shortDescription,
  };
}

export default async function BusinessEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getBusinessEvent(slug);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-8">
        <Link
          href="/business-events"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Business Events
        </Link>
      </div>

      <div className="grid gap-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-light text-2xl text-crimson">
              {event.icon}
            </span>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
              {event.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {event.shortDescription}
            </p>
          </div>

          <MarkdownContent content={event.content} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
              Technology Domains
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.technologyDomains.map((domain) => (
                <span
                  key={domain}
                  className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted"
                >
                  {getDomainLabel(domain)}
                </span>
              ))}
            </div>
          </div>

          {event.relatedIndustries.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
                Related Industries
              </h3>
              <ul className="space-y-2">
                {event.relatedIndustries.map((industry) => (
                  <li key={industry}>
                    <Link
                      href={`/industries/${industry}`}
                      className="text-sm text-muted capitalize transition-colors hover:text-crimson"
                    >
                      {industry.replace(/-/g, " ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-crimson/20 bg-crimson-light p-6">
            <h3 className="mb-2 font-semibold text-foreground">
              Get your Executive Brief
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted">
              Answer a few questions about your situation and receive a
              personalized brief.
            </p>
            <CTAButton href={`/?event=${event.slug}`} className="w-full">
              Start guided conversation
            </CTAButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
