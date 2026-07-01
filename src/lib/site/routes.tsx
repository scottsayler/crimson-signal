import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  buildPageMetadata,
  getAllSitePages,
  getIndustryTopic,
  getPagesBySection,
  getSitePage,
} from "@/lib/site/content";
import { isPagePublic } from "@/lib/site/publish";
import type { SiteSection } from "@/lib/site/types";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";

export function createSectionStaticParams(section: SiteSection) {
  return getPagesBySection(section).map((page) => ({ slug: page.slug }));
}

export function createIndustryTopicStaticParams() {
  return getAllSitePages()
    .filter((page) => page.parentIndustry && isPagePublic(page))
    .map((page) => ({
      slug: page.parentIndustry!,
      topic: page.slug,
    }));
}

export function createSectionMetadata(
  section: SiteSection,
  slug: string
): Metadata {
  const page = getSitePage(section, slug);
  if (!page) return { title: "Page Not Found" };
  return buildPageMetadata(page);
}

export function createIndustryTopicMetadata(
  industrySlug: string,
  topicSlug: string
): Metadata {
  const page = getIndustryTopic(industrySlug, topicSlug);
  if (!page) return { title: "Page Not Found" };
  return buildPageMetadata(page);
}

export function createSectionPage(section: SiteSection) {
  return async function SectionSlugPage({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    const page = getSitePage(section, slug);
    if (!page) notFound();
    return <SitePageRenderer page={page} />;
  };
}

export function createIndustryTopicPage() {
  return async function IndustryTopicPage({
    params,
  }: {
    params: Promise<{ slug: string; topic: string }>;
  }) {
    const { slug, topic } = await params;
    const page = getIndustryTopic(slug, topic);
    if (!page) notFound();
    return <SitePageRenderer page={page} />;
  };
}
