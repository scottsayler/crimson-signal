import type { Metadata } from "next";
import { HubPage } from "@/components/site/HubPage";

export const metadata: Metadata = {
  title: "Comparisons",
  description:
    "Independent technology comparisons and buying guides for multi-location organizations.",
};

export default function ComparisonsPage() {
  return (
    <HubPage
      section="comparisons"
      title="Comparisons & Buying Guides"
      description="Side-by-side comparisons and buying guides to support technology evaluation — without vendor sponsorship."
    />
  );
}
