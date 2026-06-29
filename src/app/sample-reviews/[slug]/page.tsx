import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSampleReviews, getSampleReview } from "@/lib/content";
import { SampleReviewDisplay } from "@/components/SampleReviewDisplay";
import { GenerateSampleReviewCTA } from "@/components/GenerateSampleReviewCTA";

export function generateStaticParams() {
  return getAllSampleReviews().map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sample = getSampleReview(slug);
  if (!sample) return { title: "Sample Not Found" };

  return {
    title: sample.title,
    description: sample.summary,
  };
}

export default async function SampleReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sample = getSampleReview(slug);
  if (!sample) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Link
        href="/sample-reviews"
        className="mb-8 inline-block text-sm text-muted-light transition-colors hover:text-foreground"
      >
        ← Sample Technology Impact Reviews
      </Link>
      <SampleReviewDisplay sample={sample} />
      <div className="mt-12">
        <GenerateSampleReviewCTA />
      </div>
    </div>
  );
}
