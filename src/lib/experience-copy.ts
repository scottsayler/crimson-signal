import type { TechnologyDomain } from "@/lib/types";

export const EXPERIENCE_PAGE_META = {
  title: "Experience",
  description:
    "Independent technology advisory practice — methodology, industries served, representative outcomes, and advisory philosophy.",
} as const;

export const EXPERIENCE_HERO = {
  eyebrow: "Experience",
  headline: "Independent advisory for technology consequences of organizational change.",
  subhead:
    "Crimson Signal brings executive-level clarity to multi-location organizations facing expansion, integration, cost pressure, and compliance mandates — without a product to sell.",
} as const;

export const EXPERIENCE_WHY_EXISTS = {
  heading: "Why Crimson Signal Exists",
  paragraphs: [
    "Business decisions create technology consequences. Expansion, acquisition, leadership change, and regulatory pressure all reshape architecture, governance, and investment priorities — often before leadership teams have a shared view of what changed.",
    "Most technology guidance arrives through vendors, carriers, or integrators with products to position. Multi-location organizations need a different starting point: an independent read on what the business event means for technology, what must be decided, and in what sequence.",
    "Crimson Signal was built to fill that gap — structured advisory that begins with what changed in the business, not with a solution catalog.",
  ],
} as const;

export const EXPERIENCE_PRACTICE = {
  heading: "Experience",
  intro:
    "Scott Sayler advises executive teams on the technology implications of organizational change across distributed footprints. The practice is built on repeated engagement with the same class of problem: business change that outpaces technology governance.",
  dimensions: [
    {
      label: "Engagement depth",
      detail:
        "100+ cloud and infrastructure transformation programs — from executive alignment through governance design and sequencing decisions.",
    },
    {
      label: "Organizational context",
      detail:
        "Primary focus on multi-location organizations where single-site playbooks fail — retail, healthcare, financial services, hospitality, and manufacturing.",
    },
    {
      label: "Advisory scope",
      detail:
        "Technology strategy, architecture implications, integration sequencing, and executive decision support — not implementation sales or carrier representation.",
    },
    {
      label: "Methodology",
      detail:
        "Business-event-driven analysis: identify what changed, map technology consequences, surface blind spots, and sequence what leadership must decide before vendor conversations begin.",
    },
  ],
} as const;

export const EXPERIENCE_INDUSTRIES_INTRO =
  "Industry context shapes regulatory pressure, operational constraints, and customer experience requirements. Advisory work spans sectors where distributed operations are the norm.";

export const EXPERIENCE_OUTCOMES = {
  heading: "Representative Outcomes",
  intro:
    "Outcomes are measured by decision clarity and sequencing — not by product selection. The following reflect recurring patterns across engagements. Client identities are not disclosed.",
  items: [
    {
      situation: "Post-acquisition integration",
      outcome:
        "Executive team aligned on a 90-day technology integration sequence — separating must-decide-now items from deferrable investments across acquired sites.",
    },
    {
      situation: "Multi-site expansion",
      outcome:
        "Standardized technology governance model established before the tenth location opened — avoiding the fragmentation that typically accumulates across early expansion waves.",
    },
    {
      situation: "Cost reduction mandate",
      outcome:
        "Technology spend rationalized against business-critical capabilities — leadership gained a defensible investment framework rather than across-the-board cuts.",
    },
    {
      situation: "Compliance-driven architecture review",
      outcome:
        "Gap analysis across distributed sites identified architectural decisions that required executive sign-off before remediation work could be scoped.",
    },
    {
      situation: "Leadership transition",
      outcome:
        "New CIO inherited a prioritized technology agenda grounded in business events — not a vendor-driven roadmap left by the prior regime.",
    },
    {
      situation: "Operational outage response",
      outcome:
        "Root-cause analysis extended beyond the immediate failure to governance and architecture decisions that allowed a single-site incident to cascade.",
    },
  ],
} as const;

export const EXPERIENCE_TECH_ECOSYSTEM = {
  heading: "Technology Ecosystem",
  intro:
    "Technology domains are areas where business change surfaces consequences — not categories of products to recommend. Advisory work maps implications across these domains based on the business event and industry context.",
} as const;

export function getTechnologyEcosystemDomains(
  domains: TechnologyDomain[],
): { id: string; label: string; context: string }[] {
  const contextById: Record<string, string> = {
    cloud:
      "Infrastructure strategy, workload placement, and platform governance across distributed sites.",
    security:
      "Compliance posture, access control, and risk management tied to regulatory and operational requirements.",
    networking:
      "Site connectivity, WAN architecture, and reliability standards for multi-location operations.",
    collaboration:
      "Workforce productivity, communication platforms, and operational coordination across sites.",
    data:
      "Data architecture, analytics capability, and information governance across business units.",
    ai:
      "Automation opportunity assessment, governance frameworks, and operational readiness — not tool selection.",
    operations:
      "IT service delivery, monitoring, incident response, and operational maturity across the footprint.",
    "customer-experience":
      "Technology decisions that directly affect customer-facing operations at the point of service.",
  };

  return domains.map((domain) => ({
    id: domain.id,
    label: domain.label,
    context: contextById[domain.id] ?? "Technology implications relevant to the business event.",
  }));
}

export const EXPERIENCE_PHILOSOPHY = {
  heading: "Independent Advisory Philosophy",
  principles: [
    {
      title: "No products to sell",
      body: "Crimson Signal does not represent vendors, carriers, or technology products. There is no commission structure, referral arrangement, or implementation revenue that shapes recommendations.",
    },
    {
      title: "Business events first",
      body: "Every engagement begins with what changed in the organization — not with a technology category or vendor evaluation. The business event determines which technology domains matter and in what order.",
    },
    {
      title: "Implications before vendors",
      body: "Leadership teams need to understand consequences, blind spots, and decision sequencing before narrowing to specific solutions. Vendor conversations are more productive when the executive frame is already clear.",
    },
    {
      title: "Evidence over assertion",
      body: "Observations are grounded in patterns observed across comparable organizations and situations — not in generic industry platitudes or fear-based urgency.",
    },
    {
      title: "Executive-readable output",
      body: "Deliverables are structured for leadership decision-making: what changed, what it means, what is commonly missed, and what must be decided — not technical runbooks or vendor comparison matrices.",
    },
  ],
} as const;

export const EXPERIENCE_CTA = {
  heading: "Pressure-test your situation",
  body: "Start with a Technology Impact Review to understand the implications of what changed — then validate the assessment in a working conversation with someone who is not selling anything.",
  button: "Start Your Technology Impact Review",
} as const;
