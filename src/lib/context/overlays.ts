import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { parseIndustryOverlay } from "../parse-industry-overlay";
import type { IndustryOverlay, IndustryOverlayRegistry } from "./types";

const OVERLAYS_DIR = path.join(process.cwd(), "content", "context", "overlays");

export function loadIndustryOverlayRegistry(): IndustryOverlayRegistry {
  if (!fs.existsSync(OVERLAYS_DIR)) return {};

  const registry: IndustryOverlayRegistry = {};

  for (const eventSlug of fs.readdirSync(OVERLAYS_DIR)) {
    const eventDir = path.join(OVERLAYS_DIR, eventSlug);
    if (!fs.statSync(eventDir).isDirectory()) continue;

    const eventOverlays: Record<string, IndustryOverlay> = {};

    for (const filename of fs.readdirSync(eventDir)) {
      if (!filename.endsWith(".md")) continue;

      const industrySlug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(eventDir, filename), "utf-8");
      const { data } = matter(raw);
      const overlay = parseIndustryOverlay(
        eventSlug,
        industrySlug,
        data as Record<string, unknown>
      );

      if (overlay) {
        eventOverlays[industrySlug] = overlay;
      }
    }

    if (Object.keys(eventOverlays).length > 0) {
      registry[eventSlug] = eventOverlays;
    }
  }

  return registry;
}
