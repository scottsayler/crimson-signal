import Link from "next/link";
import type { ClusterContent } from "@/lib/site/types";
import { MarkdownContent } from "@/components/MarkdownContent";

interface ClusterLinkListProps {
  title: string;
  links: ClusterContent["relatedTechnologies"];
}

function ClusterLinkList({ title, links }: ClusterLinkListProps) {
  if (links.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
        {title}
      </h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group block rounded-xl border border-border bg-surface p-4 transition-all hover:border-crimson/30"
            >
              <p className="font-medium text-foreground transition-colors group-hover:text-crimson">
                {link.title}
              </p>
              {link.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted">{link.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface TopicClusterTemplateProps {
  cluster: ClusterContent;
  sections?: { heading: string; body: string }[];
}

export function TopicClusterBody({ cluster, sections = [] }: TopicClusterTemplateProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
          The problem
        </h2>
        <MarkdownContent content={cluster.problemFraming} />
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
          Who this is for
        </h2>
        <MarkdownContent content={cluster.whoItIsFor} />
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
          Common buying triggers
        </h2>
        <MarkdownContent content={cluster.buyingTriggers} />
      </section>

      <ClusterLinkList title="Related technologies" links={cluster.relatedTechnologies} />
      <ClusterLinkList title="Related problems" links={cluster.relatedProblems} />
      <ClusterLinkList title="Recommended tools" links={cluster.recommendedTools} />

      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
            {section.heading}
          </h2>
          <MarkdownContent content={section.body} />
        </section>
      ))}
    </div>
  );
}
