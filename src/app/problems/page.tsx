import type { Metadata } from "next";
import { HubPage } from "@/components/site/HubPage";

export const metadata: Metadata = {
  title: "Problems",
  description:
    "Business problems that drive technology decisions for multi-location organizations — outages, downtime, compliance, and more.",
};

export default function ProblemsPage() {
  return (
    <HubPage
      section="problems"
      description="The business problems that trigger technology strategy conversations — framed for leadership teams, not vendor sales cycles."
    />
  );
}
