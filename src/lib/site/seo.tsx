import type { Metadata } from "next";
import type { BreadcrumbItem } from "@/components/site/Breadcrumbs";
import type { DecisionGuide, SitePage, SiteSection } from "./types";
import { getSitePageUrl } from "./types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crimsonsignal.co";

export function getCanonicalUrl(page: SitePage & { section: SiteSection }): string {
  return `${SITE_URL}${getSitePageUrl(page)}`;
}

export function buildPageMetadata(page: SitePage & { section: SiteSection }): Metadata {
  const canonical = getCanonicalUrl(page);
  const title = page.title;
  const description = page.description;

  return {
    title,
    description,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function breadcrumbSchema(
  items: BreadcrumbItem[],
  pageUrl: string
): Record<string, unknown> {
  const listItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : { item: pageUrl }),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listItems,
  };
}

export function articleSchema(
  page: SitePage & { section: SiteSection }
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    url: getCanonicalUrl(page),
    keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(", "),
    ...(page.readingTime
      ? { timeRequired: `PT${page.readingTime}M` }
      : {}),
  };
}

export function faqSchema(faqs: DecisionGuide["faqs"]): Record<string, unknown> | null {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildPageSchemas(
  page: SitePage & { section: SiteSection },
  breadcrumbs: BreadcrumbItem[],
  decisionGuide?: DecisionGuide
): Record<string, unknown>[] {
  const pageUrl = getCanonicalUrl(page);
  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url: pageUrl,
    },
    breadcrumbSchema(breadcrumbs, pageUrl),
    articleSchema(page),
  ];

  const faq = faqSchema(decisionGuide?.faqs);
  if (faq) schemas.push(faq);

  return schemas;
}

export function JsonLd({ data }: { data: Record<string, unknown>[] }) {
  return (
    <>
      {data.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
