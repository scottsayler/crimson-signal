import type { CachedPage } from "@/lib/site/pipeline";
import { getSitePageUrl } from "@/lib/site/types";
import { getIndustryTopics } from "@/lib/site/content";
import { PageHero } from "../PageHero";
import { PageDevQualityPanel } from "../PageSections";
import { DecisionGuideBody } from "../DecisionGuideBody";
import { ToolDecisionGuideBody } from "../ToolDecisionGuideBody";
import { ContinueResearchSidebar } from "../ContinueResearchSidebar";
import { ContentCard } from "../ContentCard";

interface TemplateProps {
  page: CachedPage;
}

function DecisionGuideTemplate({
  page,
  eyebrow,
}: TemplateProps & { eyebrow?: string }) {
  const currentPath = getSitePageUrl(page);

  return (
    <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
      <div className="min-w-0 lg:col-span-2">
        <PageHero page={page} eyebrow={eyebrow} />
        {page.decisionGuide && (
          <DecisionGuideBody
            guide={page.decisionGuide}
            sections={page.sections}
            presentationMode={page.presentationMode}
          />
        )}
      </div>
      <aside className="space-y-6">
        <ContinueResearchSidebar page={page} currentPath={currentPath} />
        <PageDevQualityPanel page={page} />
      </aside>
    </div>
  );
}

export function IndustryHubTemplate({ page }: TemplateProps) {
  const topics = getIndustryTopics(page.slug);
  const currentPath = getSitePageUrl(page);

  return (
    <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
      <div className="min-w-0 lg:col-span-2">
        <PageHero page={page} eyebrow="Industry Hub" />
        {page.decisionGuide && (
          <DecisionGuideBody
            guide={page.decisionGuide}
            sections={page.sections}
            presentationMode={page.presentationMode}
          />
        )}
        {topics.length > 0 && (
          <section className="mt-14 scroll-mt-24">
            <h2 className="mb-6 font-serif text-2xl font-medium tracking-tight text-foreground">
              Research topics
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {topics.map((topic) => (
                <ContentCard key={topic.slug} page={topic} />
              ))}
            </div>
          </section>
        )}
      </div>
      <aside className="space-y-6">
        <ContinueResearchSidebar page={page} currentPath={currentPath} />
        <PageDevQualityPanel page={page} />
      </aside>
    </div>
  );
}

export function IndustryTopicTemplate({ page }: TemplateProps) {
  const eyebrow =
    page.presentationMode === "cornerstone" ? "Cornerstone Guide" : "Decision Guide";
  return <DecisionGuideTemplate page={page} eyebrow={eyebrow} />;
}

export function TechnologyPageTemplate({ page }: TemplateProps) {
  return <DecisionGuideTemplate page={page} eyebrow="Decision Guide" />;
}

export function ProblemPageTemplate({ page }: TemplateProps) {
  return <DecisionGuideTemplate page={page} eyebrow="Business Problem" />;
}

function ToolGuideBody({ page }: TemplateProps) {
  if (!page.decisionGuide) return null;

  return (
    <ToolDecisionGuideBody
      guide={page.decisionGuide}
      sections={page.sections}
      toolSlug={page.slug}
    />
  );
}

export function ToolPageTemplate({ page }: TemplateProps) {
  const currentPath = getSitePageUrl(page);

  return (
    <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
      <div className="min-w-0 lg:col-span-2">
        <PageHero page={page} eyebrow="Tool" />
        <ToolGuideBody page={page} />
      </div>
      <aside className="space-y-6">
        <ContinueResearchSidebar page={page} currentPath={currentPath} />
        <PageDevQualityPanel page={page} />
      </aside>
    </div>
  );
}

export function BuyingGuideTemplate({ page }: TemplateProps) {
  return <DecisionGuideTemplate page={page} eyebrow="Buying Guide" />;
}

export function ComparisonPageTemplate({ page }: TemplateProps) {
  return <DecisionGuideTemplate page={page} eyebrow="Comparison" />;
}

export function ChecklistPageTemplate({ page }: TemplateProps) {
  return <DecisionGuideTemplate page={page} eyebrow="Checklist" />;
}

export function ResearchReportTemplate({ page }: TemplateProps) {
  return <DecisionGuideTemplate page={page} eyebrow="Research Report" />;
}
