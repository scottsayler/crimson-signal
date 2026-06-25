import Link from "next/link";
import { getAllBusinessEvents } from "@/lib/content";
import { BusinessEventCard } from "@/components/BusinessEventCard";
import { CTAButton } from "@/components/CTAButton";

export default function HomePage() {
  const events = getAllBusinessEvents();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="animate-fade-in-up mb-6 text-xs font-semibold uppercase tracking-widest text-crimson">
            Independent Technology Advisory
          </p>
          <h1 className="animate-fade-in-up animation-delay-100 max-w-3xl font-serif text-4xl font-medium leading-[1.15] tracking-tight text-foreground md:text-6xl">
            Business change creates technology implications.
          </h1>
          <p className="animate-fade-in-up animation-delay-200 mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Crimson Signal helps multi-location organizations navigate the
            technology decisions that follow business change — without vendor
            bias.
          </p>
          <div className="animate-fade-in-up animation-delay-300 mt-10">
            <CTAButton href="/brief">What&apos;s changed?</CTAButton>
          </div>
        </div>
      </section>

      {/* What's changed */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
                What&apos;s changed?
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
                Select a business event to start a guided conversation and
                receive a personalized Executive Brief.
              </p>
            </div>
            <Link
              href="/business-events"
              className="text-sm font-medium text-crimson transition-colors hover:text-crimson-dark"
            >
              View all events →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <BusinessEventCard
                key={event.slug}
                slug={event.slug}
                title={event.title}
                shortDescription={event.shortDescription}
                icon={event.icon}
                technologyDomains={event.technologyDomains}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h2 className="mb-16 text-center font-serif text-3xl font-medium tracking-tight text-foreground">
            From business event to strategy
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Identify what changed",
                description:
                  "Select the business event driving your technology conversation — expansion, acquisition, cost pressure, or something else.",
              },
              {
                step: "02",
                title: "Answer guided questions",
                description:
                  "A short conversation tailored to your situation helps surface the technology implications that matter most.",
              },
              {
                step: "03",
                title: "Receive your Executive Brief",
                description:
                  "Get a structured brief with priorities, implications, and recommended next steps — then go deeper with a strategy session.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <span className="mb-4 inline-block font-serif text-4xl font-medium text-crimson/20">
                  {item.step}
                </span>
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="rounded-2xl border border-crimson/20 bg-crimson-light px-8 py-16 text-center md:px-16">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
              Ready for a deeper conversation?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              Schedule a Technology Strategy Session with Scott to develop a
              location-aware technology roadmap for your organization.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CTAButton href="/brief">Get Your Executive Brief</CTAButton>
              <CTAButton
                href="mailto:scott@crimsonsignal.com?subject=Technology%20Strategy%20Session"
                variant="secondary"
              >
                Schedule a Strategy Session
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
