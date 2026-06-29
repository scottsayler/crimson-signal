import { getAllBusinessEvents } from "@/lib/content";
import { getContextIndustries } from "@/lib/context/industry-options";
import { loadIndustryOverlayRegistry } from "@/lib/context/overlays";
import { loadPatternRegistry } from "@/lib/patterns/server";
import { HomeExperience } from "@/components/HomeExperience";

export default function HomePage() {
  const events = getAllBusinessEvents();
  const contextIndustries = getContextIndustries();
  const overlayRegistry = loadIndustryOverlayRegistry();
  const patternRegistry = loadPatternRegistry();

  return (
    <HomeExperience
      events={events}
      contextIndustries={contextIndustries}
      overlayRegistry={overlayRegistry}
      patternRegistry={patternRegistry}
    />
  );
}
