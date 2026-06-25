import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  BusinessEvent,
  Industry,
  ResearchArticle,
  ExecutiveBriefSample,
  ConversationQuestion,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readMarkdownFiles(dir: string): { slug: string; data: matter.GrayMatterFile<string> }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      return { slug, data: matter(raw) };
    });
}

export function getAllBusinessEvents(): BusinessEvent[] {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "business-events"));
  return files
    .map(({ slug, data }) => ({
      slug,
      title: data.data.title as string,
      shortDescription: data.data.shortDescription as string,
      icon: (data.data.icon as string) ?? "→",
      technologyDomains: (data.data.technologyDomains as string[]) ?? [],
      relatedIndustries: (data.data.relatedIndustries as string[]) ?? [],
      questions: (data.data.questions as ConversationQuestion[]) ?? [],
      content: data.content,
      order: (data.data.order as number) ?? 99,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getBusinessEvent(slug: string): BusinessEvent | null {
  return getAllBusinessEvents().find((e) => e.slug === slug) ?? null;
}

export function getAllIndustries(): Industry[] {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "industries"));
  return files
    .map(({ slug, data }) => ({
      slug,
      title: data.data.title as string,
      shortDescription: data.data.shortDescription as string,
      technologyDomains: (data.data.technologyDomains as string[]) ?? [],
      relatedEvents: (data.data.relatedEvents as string[]) ?? [],
      content: data.content,
      order: (data.data.order as number) ?? 99,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getIndustry(slug: string): Industry | null {
  return getAllIndustries().find((i) => i.slug === slug) ?? null;
}

export function getAllResearch(): ResearchArticle[] {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "research"));
  return files
    .map(({ slug, data }) => ({
      slug,
      title: data.data.title as string,
      excerpt: data.data.excerpt as string,
      publishedAt: data.data.publishedAt as string,
      technologyDomains: (data.data.technologyDomains as string[]) ?? [],
      content: data.content,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getResearchArticle(slug: string): ResearchArticle | null {
  return getAllResearch().find((r) => r.slug === slug) ?? null;
}

export function getAllExecutiveBriefSamples(): ExecutiveBriefSample[] {
  const files = readMarkdownFiles(path.join(CONTENT_DIR, "executive-briefs"));
  return files
    .map(({ slug, data }) => ({
      slug,
      title: data.data.title as string,
      eventSlug: data.data.eventSlug as string,
      industrySlug: data.data.industrySlug as string | undefined,
      excerpt: data.data.excerpt as string,
      publishedAt: data.data.publishedAt as string,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
