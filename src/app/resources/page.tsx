import type { Metadata } from "next";
import { HubPage } from "@/components/site/HubPage";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Checklists, playbooks, and evaluation templates for multi-location technology planning.",
};

export default function ResourcesPage() {
  return (
    <HubPage
      section="resources"
      description="Actionable checklists, playbooks, and templates to support technology decisions across your location footprint."
    />
  );
}
