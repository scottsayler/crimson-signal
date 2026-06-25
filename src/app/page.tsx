import { getAllBusinessEvents } from "@/lib/content";
import { getContextIndustries } from "@/lib/context/industry-options";
import { loadIndustryOverlayRegistry } from "@/lib/context/overlays";
import { HomeExperience } from "@/components/HomeExperience";

export default function HomePage() {
  const events = getAllBusinessEvents();
  const contextIndustries = getContextIndustries();
  const overlayRegistry = loadIndustryOverlayRegistry();

  return (
    <HomeExperience
      events={events}
      contextIndustries={contextIndustries}
      overlayRegistry={overlayRegistry}
    />
  );
}
