import type { Metadata } from "next";
import { HubPage } from "@/components/site/HubPage";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Interactive tools and assessments for multi-location technology planning — calculators, assessments, and evaluation frameworks.",
};

export default function ToolsPage() {
  return (
    <HubPage
      section="tools"
      description="Practical tools to quantify risk, estimate costs, and assess readiness — built for operators and IT leaders."
    />
  );
}
