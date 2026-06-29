import Link from "next/link";
import type { SiteSection } from "@/lib/site/types";
import { SECTION_LABELS } from "@/lib/site/types";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-muted-light">
              /
            </span>
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function breadcrumbsForPage(
  section: SiteSection,
  pageTitle: string
): BreadcrumbItem[] {
  return [
    { label: SECTION_LABELS[section], href: `/${section}` },
    { label: pageTitle },
  ];
}
