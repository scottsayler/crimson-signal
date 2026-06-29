import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBenchmarks, getBenchmarkEntry } from "@/lib/content";
import { BenchmarkDisplay } from "@/components/BenchmarkDisplay";
import { CTAButton } from "@/components/CTAButton";

export function generateStaticParams() {
  return getAllBenchmarks().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getBenchmarkEntry(slug);
  if (!entry) return { title: "Benchmark Not Found" };
  return {
    title: entry.title,
    description: entry.excerpt,
  };
}

export default async function BenchmarkEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getBenchmarkEntry(slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-8">
        <Link
          href="/benchmarks"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Benchmarks
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <BenchmarkDisplay entry={entry} />

        <div className="mt-16 rounded-xl border border-crimson/20 bg-crimson-light p-8 text-center">
          <h3 className="mb-2 font-serif text-xl font-medium tracking-tight">
            Where does your organization sit?
          </h3>
          <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted">
            Benchmarks provide context. A Technology Impact Review applies that
            context to your specific industry and business situation.
          </p>
          <CTAButton href={`/?event=${entry.eventSlug}`}>
            Start Your Technology Impact Review
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
