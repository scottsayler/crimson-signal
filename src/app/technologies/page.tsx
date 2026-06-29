import type { Metadata } from "next";
import { HubPage } from "@/components/site/HubPage";
import {
  createSectionMetadata,
  createSectionPage,
  createSectionStaticParams,
} from "@/lib/site/routes";

export const metadata: Metadata = {
  title: "Technologies",
  description:
    "Independent technology research for multi-location organizations — SD-WAN, POTS replacement, managed networks, and more.",
};

export default function TechnologiesPage() {
  return (
    <HubPage
      section="technologies"
      description="Technology categories that matter most for distributed organizations — evaluated without vendor bias."
    />
  );
}
