import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Crimson Signal is independent technology advisory for multi-location organizations.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
          About
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          Independent technology advisory for organizations that operate in more
          than one place.
        </h1>

        <div className="mt-12 space-y-8 text-[15px] leading-relaxed text-muted">
          <p>
            Crimson Signal exists because business change creates technology
            implications — and most organizations are not structured to see
            them clearly.
          </p>
          <p>
            Multi-location organizations face technology decisions that
            single-site playbooks cannot address. Expansion, acquisition, cost
            pressure, compliance mandates, and customer experience failures all
            trace back to architecture, governance, and investment choices made
            across a distributed footprint.
          </p>
          <p>
            This is not a vendor website. Crimson Signal does not sell
            technology products or represent carriers. The goal is to help
            leadership teams understand what changed, what it means for
            technology, and what to do next.
          </p>
        </div>

        <section className="mt-16 border-t border-border pt-16">
          <h2 className="mb-6 font-serif text-2xl font-medium tracking-tight text-foreground">
            How Crimson Signal works
          </h2>
          <div className="space-y-6 text-[15px] leading-relaxed text-muted">
            <p>
              <strong className="text-foreground">Business Events</strong> are
              the starting point. Every engagement begins with what changed in
              the business — not with a technology product or vendor evaluation.
            </p>
            <p>
              <strong className="text-foreground">Industries</strong> provide
              context. Retail, healthcare, financial services, and other sectors
              have distinct regulatory, operational, and customer experience
              pressures that shape technology strategy.
            </p>
            <p>
              <strong className="text-foreground">Technology domains</strong>{" "}
              are metadata — cloud, security, networking, data, AI, and others —
              used to organize implications, not to sell solutions.
            </p>
          </div>
        </section>

        <section className="mt-16 border-t border-border pt-16">
          <h2 className="mb-6 font-serif text-2xl font-medium tracking-tight text-foreground">
            About Scott
          </h2>
          <p className="text-[15px] leading-relaxed text-muted">
            Scott helps multi-location organizations navigate technology strategy
            — from architecture and governance to vendor evaluation and
            implementation planning. With deep experience across retail,
            healthcare, financial services, and hospitality, the focus is always
            on business outcomes, not technology for its own sake.
          </p>
        </section>

        <div className="mt-16 rounded-2xl border border-crimson/20 bg-crimson-light p-8 text-center">
          <h3 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Technology Strategy Session
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Ready to go deeper? Schedule a conversation to develop a
            location-aware technology roadmap for your organization.
          </p>
          <div className="mt-6">
            <CTAButton href="mailto:scott@crimsonsignal.com?subject=Technology%20Strategy%20Session">
              Schedule a Strategy Session
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}
