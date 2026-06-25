import type { Metadata } from "next";
import Link from "next/link";
import { getAllResearch } from "@/lib/content";
import { getDomainLabel } from "@/lib/types";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Independent research on technology strategy for multi-location organizations.",
};

export default function ResearchPage() {
  const articles = getAllResearch();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          Research
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          Independent technology research
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Analysis and frameworks for multi-location technology strategy — without
          vendor bias.
        </p>
      </div>

      <div className="divide-y divide-border">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/research/${article.slug}`}
            className="group block py-8 transition-colors first:pt-0"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <time className="text-xs font-medium text-muted-light">
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-crimson">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {article.excerpt}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 md:max-w-xs md:justify-end">
                {article.technologyDomains.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-full bg-border-light px-2.5 py-0.5 text-[11px] font-medium text-muted"
                  >
                    {getDomainLabel(domain)}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
