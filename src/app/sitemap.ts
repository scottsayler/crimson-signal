import type { MetadataRoute } from "next";
import { getPublishedSitePages } from "@/lib/site/content";
import { SITE_URL } from "@/lib/site/seo";
import { getSitePageUrl } from "@/lib/site/types";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/industries",
  "/technologies",
  "/problems",
  "/tools",
  "/research",
  "/comparisons",
  "/resources",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const publishedEntries: MetadataRoute.Sitemap = getPublishedSitePages().map(
    (page) => ({
      url: `${SITE_URL}${getSitePageUrl(page)}`,
      changeFrequency: "monthly" as const,
      priority: page.parentIndustry ? 0.7 : 0.6,
    })
  );

  return [...staticEntries, ...publishedEntries];
}
