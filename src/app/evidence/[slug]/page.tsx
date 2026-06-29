import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEvidence, getEvidenceEntry } from "@/lib/content";
import { EvidenceDisplay } from "@/components/EvidenceDisplay";
import { CTAButton } from "@/components/CTAButton";

export function generateStaticParams() {
  return getAllEvidence().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEvidenceEntry(slug);
  if (!entry) return { title: "Evidence Not Found" };
  return {
    title: entry.title,
    description: entry.excerpt,
  };
}

export default async function EvidenceEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEvidenceEntry(slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-8">
        <Link
          href="/evidence"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Evidence Library
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <EvidenceDisplay entry={entry} />

        <div className="mt-16 rounded-xl border border-crimson/20 bg-crimson-light p-8 text-center">
          <h3 className="mb-2 font-serif text-xl font-medium tracking-tight">
            How does this apply to your organization?
          </h3>
          <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted">
            Start with what changed in your business and receive a Technology Impact
            Review tailored to your industry and situation.
          </p>
          <CTAButton href={`/?event=${entry.eventSlug}`}>
            Start Your Technology Impact Review
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
