import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllExecutiveBriefSamples,
  getExecutiveBriefSample,
} from "@/lib/content";
import { ExecutiveBriefDisplay } from "@/components/ExecutiveBriefDisplay";
import { CTAButton } from "@/components/CTAButton";

export function generateStaticParams() {
  return getAllExecutiveBriefSamples().map((brief) => ({ slug: brief.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sample = getExecutiveBriefSample(slug);
  if (!sample) return { title: "Sample Not Found" };
  return {
    title: sample.title,
    description: sample.excerpt,
  };
}

export default async function ExecutiveBriefSamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sample = getExecutiveBriefSample(slug);
  if (!sample) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Link
        href="/executive-briefs"
        className="mb-8 inline-block text-sm text-muted-light transition-colors hover:text-foreground"
      >
        ← Sample Technology Impact Reviews
      </Link>
      <ExecutiveBriefDisplay brief={sample.review} />
      <div className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
          Generate your own review
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Answer a few questions about what changed in your organization and
          receive a personalized Technology Impact Review in minutes.
        </p>
        <div className="mt-6">
          <CTAButton href={`/?event=${sample.eventSlug}`}>
            What&apos;s changed?
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
