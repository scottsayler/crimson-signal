import type { BusinessEvent } from "./types";

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve a URL event parameter to a Business Event.
 * Tries exact slug match first, then slugified title (e.g. opening-new-locations).
 */
export function resolveEvent(
  events: BusinessEvent[],
  urlSlug: string | null | undefined
): BusinessEvent | null {
  if (!urlSlug) return null;

  const normalized = urlSlug.trim().toLowerCase();
  if (!normalized) return null;

  const exact = events.find((event) => event.slug.toLowerCase() === normalized);
  if (exact) return exact;

  const byTitle = events.find(
    (event) => slugifyTitle(event.title) === normalized
  );
  if (byTitle) return byTitle;

  return null;
}

export function isValidEventSlug(
  events: BusinessEvent[],
  urlSlug: string | null | undefined
): boolean {
  return resolveEvent(events, urlSlug) !== null;
}
