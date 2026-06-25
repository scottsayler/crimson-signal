import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllIndustries, getIndustry } from "@/lib/content";
import { getDomainLabel } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { CTAButton } from "@/components/CTAButton";

export function generateStaticParams() {
  return getAllIndustries().map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Industry Not Found" };
  return {
    title: industry.title,
    description: industry.shortDescription,
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-8">
        <Link
          href="/industries"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Industries
        </Link>
      </div>

      <div className="grid gap-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
              {industry.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {industry.shortDescription}
            </p>
          </div>

          <MarkdownContent content={industry.content} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
              Technology Domains
            </h3>
            <div className="flex flex-wrap gap-2">
              {industry.technologyDomains.map((domain) => (
                <span
                  key={domain}
                  className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted"
                >
                  {getDomainLabel(domain)}
                </span>
              ))}
            </div>
          </div>

          {industry.relatedEvents.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
                Common Business Events
              </h3>
              <ul className="space-y-2">
                {industry.relatedEvents.map((event) => (
                  <li key={event}>
                    <Link
                      href={`/business-events/${event}`}
                      className="text-sm text-muted capitalize transition-colors hover:text-crimson"
                    >
                      {event.replace(/-/g, " ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-crimson/20 bg-crimson-light p-6">
            <h3 className="mb-2 font-semibold text-foreground">
              Facing a business change?
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted">
              Start with what changed and receive a personalized Executive
              Brief.
            </p>
            <CTAButton href="/" className="w-full">
              What&apos;s changed?
            </CTAButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
