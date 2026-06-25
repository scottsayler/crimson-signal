import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllResearch, getResearchArticle } from "@/lib/content";
import { getDomainLabel } from "@/lib/types";
import { MarkdownContent } from "@/components/MarkdownContent";
import { CTAButton } from "@/components/CTAButton";

export function generateStaticParams() {
  return getAllResearch().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getResearchArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ResearchArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getResearchArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-8">
        <Link
          href="/research"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Research
        </Link>
      </div>

      <article className="mx-auto max-w-3xl">
        <header className="mb-12 border-b border-border pb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {article.technologyDomains.map((domain) => (
              <span
                key={domain}
                className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-muted"
              >
                {getDomainLabel(domain)}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {article.excerpt}
          </p>
          <time className="mt-4 block text-sm text-muted-light">
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <MarkdownContent content={article.content} />

        <div className="mt-16 rounded-xl border border-crimson/20 bg-crimson-light p-8 text-center">
          <h3 className="mb-2 font-serif text-xl font-medium tracking-tight">
            How does this apply to your organization?
          </h3>
          <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted">
            Start with what changed in your business and receive a personalized
            Executive Brief.
          </p>
          <CTAButton href="/brief">What&apos;s changed?</CTAButton>
        </div>
      </article>
    </div>
  );
}
