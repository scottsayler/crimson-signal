import type { SitePage, SiteSection } from "@/lib/site/types";
import { SECTION_LABELS } from "@/lib/site/types";
import { resolveRelatedPages } from "@/lib/site/content";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";
import { RelatedContent } from "./RelatedContent";
import { PageCTA } from "./PageCTA";
import {
  IndustryHubTemplate,
  IndustryTopicTemplate,
  TechnologyPageTemplate,
  ProblemPageTemplate,
  ToolPageTemplate,
  BuyingGuideTemplate,
  ComparisonPageTemplate,
  ChecklistPageTemplate,
  ResearchReportTemplate,
} from "./templates";

interface SitePageRendererProps {
  page: SitePage & { section: SiteSection };
}

function renderTemplate(page: SitePage & { section: SiteSection }) {
  switch (page.contentType) {
    case "industry-hub":
      return <IndustryHubTemplate page={page} />;
    case "industry-topic":
      return <IndustryTopicTemplate page={page} />;
    case "technology":
      return <TechnologyPageTemplate page={page} />;
    case "problem":
      return <ProblemPageTemplate page={page} />;
    case "tool":
      return <ToolPageTemplate page={page} />;
    case "buying-guide":
      return <BuyingGuideTemplate page={page} />;
    case "comparison":
      return <ComparisonPageTemplate page={page} />;
    case "checklist":
      return <ChecklistPageTemplate page={page} />;
    case "research-report":
      return <ResearchReportTemplate page={page} />;
    default:
      return <IndustryHubTemplate page={page} />;
  }
}

function breadcrumbsForSitePage(page: SitePage & { section: SiteSection }): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: SECTION_LABELS[page.section], href: `/${page.section}` },
  ];

  if (page.parentIndustry) {
    const parent = page.parentIndustry.replace(/-/g, " ");
    items.push({
      label: parent.charAt(0).toUpperCase() + parent.slice(1),
      href: `/industries/${page.parentIndustry}`,
    });
  }

  items.push({ label: page.title });
  return items;
}

export function SitePageRenderer({ page }: SitePageRendererProps) {
  const related = resolveRelatedPages(page);
  const ctaLabel = page.ctaLabel ?? (page.recommendedTool ? "Explore recommended tool" : undefined);
  const ctaHref = page.ctaHref ?? page.recommendedTool;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <Breadcrumbs items={breadcrumbsForSitePage(page)} />
      {renderTemplate(page)}
      {ctaLabel && ctaHref && (
        <PageCTA
          label={ctaLabel}
          href={ctaHref}
          title="Next step"
          description="Independent research is most useful when it leads to a concrete decision. Start here."
        />
      )}
      <RelatedContent pages={related} />
    </div>
  );
}
