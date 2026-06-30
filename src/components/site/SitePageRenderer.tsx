import type { CachedPage } from "@/lib/site/pipeline";
import { SECTION_LABELS } from "@/lib/site/types";
import { resolveRelatedContent } from "@/lib/site/content";
import { buildPageSchemas, JsonLd } from "@/lib/site/seo";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";
import { ContinueResearch } from "./decision";
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
  page: CachedPage;
}

function renderTemplate(page: CachedPage) {
  switch (page.contentType) {
    case "industry-hub":
      return <IndustryHubTemplate page={page} />;
    case "industry-topic":
      return <IndustryTopicTemplate page={page} />;
    case "technology":
    case "decision-guide":
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

function breadcrumbsForSitePage(page: CachedPage): BreadcrumbItem[] {
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
  if (page.publish && page.quality && page.quality.errors.length > 0) {
    throw new Error(
      `Page "${page.title}" is marked publish but failed quality validation: ${page.quality.errors.map((e) => e.message).join("; ")}`
    );
  }

  const related = resolveRelatedContent(page);
  const breadcrumbs = breadcrumbsForSitePage(page);
  const schemas = buildPageSchemas(page, breadcrumbs, page.decisionGuide);
  const cta = page.cta;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <JsonLd data={schemas} />
      <Breadcrumbs items={breadcrumbs} />
      {renderTemplate(page)}
      {cta && (
        <PageCTA
          label={cta.label}
          href={cta.href}
          title="Next step"
          description="Independent research is most useful when it leads to a concrete decision. Start here."
        />
      )}
      <ContinueResearch related={related} />
    </div>
  );
}
