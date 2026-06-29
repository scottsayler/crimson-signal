import type { SitePage, SiteSection } from "@/lib/site/types";
import { getSitePageUrl } from "@/lib/site/types";
import { getIndustryTopics, isRestaurantClusterPage } from "@/lib/site/content";
import { PageHero } from "../PageHero";
import { PageSections, PageSidebar } from "../PageSections";
import { TopicClusterBody } from "../TopicClusterTemplate";
import { RestaurantClusterNav } from "../RestaurantClusterNav";
import { ContentCard } from "../ContentCard";

interface TemplateProps {
  page: SitePage & { section: SiteSection };
}

function ClusterTemplate({ page, eyebrow }: TemplateProps & { eyebrow?: string }) {
  if (!page.cluster) {
    return <BaseTemplate page={page} eyebrow={eyebrow} />;
  }

  const showClusterNav = isRestaurantClusterPage(page);
  const currentPath = getSitePageUrl(page);

  return (
    <div className="grid gap-16 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PageHero page={page} eyebrow={eyebrow} />
        <TopicClusterBody cluster={page.cluster} sections={page.sections} />
      </div>
      <aside className="space-y-6">
        {showClusterNav && <RestaurantClusterNav currentPath={currentPath} />}
        <PageSidebar page={page} />
      </aside>
    </div>
  );
}

function BaseTemplate({ page, eyebrow }: TemplateProps & { eyebrow?: string }) {
  const showClusterNav = isRestaurantClusterPage(page);
  const currentPath = getSitePageUrl(page);

  return (
    <div className="grid gap-16 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PageHero page={page} eyebrow={eyebrow} />
        <PageSections sections={page.sections} />
      </div>
      <aside className="space-y-6">
        {showClusterNav && <RestaurantClusterNav currentPath={currentPath} />}
        <PageSidebar page={page} />
      </aside>
    </div>
  );
}

export function IndustryHubTemplate({ page }: TemplateProps) {
  const topics = getIndustryTopics(page.slug);
  const showClusterNav = isRestaurantClusterPage(page);
  const currentPath = getSitePageUrl(page);

  if (page.cluster) {
    return (
      <div className="grid gap-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PageHero page={page} eyebrow="Industry Research" />
          <TopicClusterBody cluster={page.cluster} sections={page.sections} />
          {topics.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 font-serif text-2xl font-medium tracking-tight text-foreground">
                Restaurant research topics
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
          {showClusterNav && <RestaurantClusterNav currentPath={currentPath} />}
          <PageSidebar page={page} />
        </aside>
      </div>
    );
  }

  return <ClusterTemplate page={page} eyebrow="Industry Research" />;
}

export function IndustryTopicTemplate({ page }: TemplateProps) {
  return <ClusterTemplate page={page} eyebrow="Restaurant Research" />;
}

export function TechnologyPageTemplate({ page }: TemplateProps) {
  return <ClusterTemplate page={page} eyebrow="Technology" />;
}

export function ProblemPageTemplate({ page }: TemplateProps) {
  return <ClusterTemplate page={page} eyebrow="Problem" />;
}

export function ToolPageTemplate({ page }: TemplateProps) {
  return <ClusterTemplate page={page} eyebrow="Tool" />;
}

export function BuyingGuideTemplate({ page }: TemplateProps) {
  return <BaseTemplate page={page} eyebrow="Buying Guide" />;
}

export function ComparisonPageTemplate({ page }: TemplateProps) {
  return <BaseTemplate page={page} eyebrow="Comparison" />;
}

export function ChecklistPageTemplate({ page }: TemplateProps) {
  return <BaseTemplate page={page} eyebrow="Checklist" />;
}

export function ResearchReportTemplate({ page }: TemplateProps) {
  return <BaseTemplate page={page} eyebrow="Research Report" />;
}
