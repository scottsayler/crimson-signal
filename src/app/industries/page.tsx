import type { Metadata } from "next";
import { HubPage } from "@/components/site/HubPage";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Independent technology research organized by industry — restaurants, retail, healthcare, financial services, and more.",
};

export default function IndustriesPage() {
  return (
    <HubPage
      section="industries"
      description="Industry context for how business problems create technology implications. Each sector has distinct pressures, regulations, and operational patterns."
    />
  );
}
