import Link from "next/link";
import { RESTAURANT_CLUSTER_LINKS } from "@/lib/site/content";

interface RestaurantClusterNavProps {
  currentPath?: string;
}

export function RestaurantClusterNav({ currentPath }: RestaurantClusterNavProps) {
  return (
    <nav
      aria-label="Restaurant research topics"
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
        Restaurant research cluster
      </h3>
      <ul className="space-y-2">
        {RESTAURANT_CLUSTER_LINKS.map((link) => {
          const isActive = currentPath === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`block text-sm transition-colors ${
                  isActive
                    ? "font-medium text-crimson"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
