import { getAllBusinessEvents } from "@/lib/content";
import { HomeExperience } from "@/components/HomeExperience";

export default function HomePage() {
  const events = getAllBusinessEvents();

  return <HomeExperience events={events} />;
}
