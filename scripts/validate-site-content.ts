/**
 * Validates all site content against docs/QUALITY_CHECKLIST.md
 * Run: npm run validate:content
 * Strict (fails on published page errors): SITE_CONTENT_STRICT=true npm run validate:content
 */
import {
  formatQualityReport,
  getAllSitePages,
  validateAllPages,
} from "../src/lib/site/content";
import { getSitePageUrl } from "../src/lib/site/types";

process.env.SITE_CONTENT_STRICT = process.env.SITE_CONTENT_STRICT ?? "true";

const pages = getAllSitePages();
const cache = new Map(pages.map((p) => [p.parentIndustry ? `industries/${p.parentIndustry}/${p.slug}` : `${p.section}/${p.slug}`, p]));

const resolvePath = (pathStr: string) => {
  const match = pathStr.match(/^\/industries\/([^/]+)\/([^/]+)\/?$/);
  if (match) return cache.get(`industries/${match[1]}/${match[2]}`) ?? null;
  const top = pathStr.match(/^\/(industries|technologies|problems|tools|research|comparisons|resources)\/([^/]+)\/?$/);
  if (!top) return null;
  return cache.get(`${top[1]}/${top[2]}`) ?? null;
};

const reports = validateAllPages(
  pages,
  resolvePath,
  (page) => ({ href: getSitePageUrl(page) })
);

const published = reports.filter((r) => r.publish);
const draftIssues = reports.filter((r) => !r.publish && r.issueCount > 0);
const publishedErrors = published.filter((r) => r.errors.length > 0);

console.log(`Validated ${reports.length} pages (${published.length} published, ${draftIssues.length} drafts with warnings)\n`);

for (const report of publishedErrors) {
  console.log(formatQualityReport(report));
  console.log("");
}

if (publishedErrors.length > 0) {
  console.error(`Failed: ${publishedErrors.length} published page(s) have errors.`);
  process.exit(1);
}

console.log("All published pages passed quality validation.");
