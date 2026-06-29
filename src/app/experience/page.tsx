import type { Metadata } from "next";
import Link from "next/link";
import { getAllIndustries } from "@/lib/content";
import {
  EXPERIENCE_CTA,
  EXPERIENCE_HERO,
  EXPERIENCE_INDUSTRIES_INTRO,
  EXPERIENCE_OUTCOMES,
  EXPERIENCE_PAGE_META,
  EXPERIENCE_PHILOSOPHY,
  EXPERIENCE_PRACTICE,
  EXPERIENCE_TECH_ECOSYSTEM,
  EXPERIENCE_WHY_EXISTS,
  getTechnologyEcosystemDomains,
} from "@/lib/experience-copy";
import { SCOTT_LINKEDIN_URL } from "@/lib/copy";
import { TECHNOLOGY_DOMAINS } from "@/lib/types";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: EXPERIENCE_PAGE_META.title,
  description: EXPERIENCE_PAGE_META.description,
};

const SECTIONS = [
  { id: "why", label: "Why Crimson Signal Exists" },
  { id: "experience", label: "Experience" },
  { id: "industries", label: "Industries" },
  { id: "outcomes", label: "Representative Outcomes" },
  { id: "ecosystem", label: "Technology Ecosystem" },
  { id: "philosophy", label: "Advisory Philosophy" },
] as const;

export default function ExperiencePage() {
  const industries = getAllIndustries();
  const techDomains = getTechnologyEcosystemDomains(TECHNOLOGY_DOMAINS);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid gap-16 lg:grid-cols-[12rem_1fr] lg:gap-20">
        <nav
          aria-label="Page sections"
          className="hidden lg:block"
        >
          <div className="sticky top-24">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
              On this page
            </p>
            <ul className="space-y-2">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-[13px] leading-snug text-muted transition-colors hover:text-foreground"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="min-w-0">
          <header className="mb-16 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">
              {EXPERIENCE_HERO.eyebrow}
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
              {EXPERIENCE_HERO.headline}
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-muted md:text-base">
              {EXPERIENCE_HERO.subhead}
            </p>
          </header>

          <section id="why" className="scroll-mt-24 border-t border-border pt-16">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {EXPERIENCE_WHY_EXISTS.heading}
            </h2>
            <div className="mt-6 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted">
              {EXPERIENCE_WHY_EXISTS.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section
            id="experience"
            className="scroll-mt-24 border-t border-border pt-16"
          >
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {EXPERIENCE_PRACTICE.heading}
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted">
              {EXPERIENCE_PRACTICE.intro}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {EXPERIENCE_PRACTICE.dimensions.map((dimension) => (
                <div
                  key={dimension.label}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-crimson">
                    {dimension.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {dimension.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-start gap-5 border-t border-border pt-10">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-border-light text-base font-medium text-muted"
                aria-label="Scott Sayler headshot placeholder"
              >
                SS
              </div>
              <div>
                <p className="text-lg font-medium tracking-tight text-foreground">
                  Scott Sayler
                </p>
                <p className="mt-1 text-sm font-medium text-crimson">
                  Independent Technology Advisor
                </p>
                <Link
                  href={SCOTT_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-crimson"
                >
                  View LinkedIn profile
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>

          <section
            id="industries"
            className="scroll-mt-24 border-t border-border pt-16"
          >
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              Industries
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted">
              {EXPERIENCE_INDUSTRIES_INTRO}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {industries.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-crimson/30 hover:bg-crimson-light/30"
                >
                  <h3 className="text-[17px] font-semibold tracking-tight text-foreground group-hover:text-crimson">
                    {industry.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {industry.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section
            id="outcomes"
            className="scroll-mt-24 border-t border-border pt-16"
          >
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {EXPERIENCE_OUTCOMES.heading}
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted">
              {EXPERIENCE_OUTCOMES.intro}
            </p>

            <div className="mt-10 space-y-4">
              {EXPERIENCE_OUTCOMES.items.map((item) => (
                <div
                  key={item.situation}
                  className="rounded-xl border border-border bg-border-light/40 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-crimson">
                    {item.situation}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.outcome}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="ecosystem"
            className="scroll-mt-24 border-t border-border pt-16"
          >
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {EXPERIENCE_TECH_ECOSYSTEM.heading}
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted">
              {EXPERIENCE_TECH_ECOSYSTEM.intro}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {techDomains.map((domain) => (
                <div
                  key={domain.id}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                    {domain.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {domain.context}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="philosophy"
            className="scroll-mt-24 border-t border-border pt-16"
          >
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {EXPERIENCE_PHILOSOPHY.heading}
            </h2>

            <div className="mt-10 space-y-6">
              {EXPERIENCE_PHILOSOPHY.principles.map((principle) => (
                <div key={principle.title}>
                  <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                    {principle.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
                    {principle.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-crimson/20 bg-crimson-light px-8 py-12 text-center">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {EXPERIENCE_CTA.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
              {EXPERIENCE_CTA.body}
            </p>
            <div className="mt-8">
              <CTAButton href="/">{EXPERIENCE_CTA.button}</CTAButton>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
