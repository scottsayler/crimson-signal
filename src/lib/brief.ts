import type { BusinessEvent, ConversationQuestion } from "./types";
import { getDomainLabel } from "./types";
import type { ConversationAnswers } from "./conversation";
import { applyIndustryOverlay } from "./context/compose";
import { getIndustryOverlay } from "./context/resolve-overlay";
import type { IndustryOverlayRegistry, ReportContext } from "./context/types";

export interface TechnologyImpactReview {
  title: string;
  eventTitle: string;
  industryTitle?: string;
  generatedAt: string;
  executiveSummary: string;
  whatWeHeard: string[];
  likelyImpacts: string[];
  blindSpots: string[];
  questionsToExplore: string[];
  areasToExploreNext: string[];
  roadmap: {
    immediate: string[];
    next30Days: string[];
    next90Days: string[];
  };
  nextConversation: string;
  ctaLabel: string;
}

/** @deprecated Use TechnologyImpactReview */
export type ExecutiveBrief = TechnologyImpactReview;

type AnsweredQuestion = { question: ConversationQuestion; answer: string };

interface SituationContext {
  catalyst?: string;
  scale?: string;
  timeline?: string;
  model?: string;
  concern?: string;
  systems?: string;
  stage?: string;
}

function formatAnswer(value: string | string[]): string {
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function resolveDomainLabel(domain: string): string {
  return getDomainLabel(domain) === domain ? domain : getDomainLabel(domain);
}

function getAnsweredQuestions(
  event: BusinessEvent,
  answers: ConversationAnswers
): AnsweredQuestion[] {
  return event.questions
    .filter((question) => answers[question.id] !== undefined)
    .map((question) => ({
      question,
      answer: formatAnswer(answers[question.id]),
    }));
}

function findAnswer(answered: AnsweredQuestion[], id: string): string | undefined {
  return answered.find((item) => item.question.id === id)?.answer;
}

function extractSituation(answered: AnsweredQuestion[]): SituationContext {
  return {
    catalyst: findAnswer(answered, "expansion-catalyst"),
    scale: findAnswer(answered, "location-count") ?? findAnswer(answered, "entity-count"),
    timeline: findAnswer(answered, "expansion-scale") ?? findAnswer(answered, "timeline"),
    model: findAnswer(answered, "model"),
    concern: findAnswer(answered, "challenge") ?? findAnswer(answered, "priority"),
    systems: findAnswer(answered, "systems"),
    stage: findAnswer(answered, "deal-stage"),
  };
}

function collectDomains(event: BusinessEvent, answered: AnsweredQuestion[]): string[] {
  const domains = new Set<string>();
  for (const domain of event.technologyDomains) domains.add(resolveDomainLabel(domain));
  for (const { question } of answered) {
    question.technologyDomains?.forEach((domain) => domains.add(resolveDomainLabel(domain)));
  }
  return Array.from(domains);
}

function getTriggeredInsights(answered: AnsweredQuestion[]): string[] {
  const insights: string[] = [];
  for (const { question, answer } of answered) {
    if (!question.executiveInsight) continue;
    if (question.scoringLogic && !question.scoringLogic[answer]) continue;
    insights.push(question.executiveInsight);
  }
  return Array.from(new Set(insights));
}

function includesAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function buildExecutiveSummary(
  event: BusinessEvent,
  ctx: SituationContext,
  answered: AnsweredQuestion[]
): string {
  if (answered.length === 0) {
    return `Organizations facing ${event.title.toLowerCase()} often discover that business timelines and technology readiness are misaligned. The immediate priority is clarifying scope, ownership, and what must be standardized before commitments narrow the options.`;
  }

  const parts: string[] = [];

  let opening = `This is a ${event.title.toLowerCase()} initiative`;
  if (ctx.catalyst) opening += ` driven by ${ctx.catalyst.toLowerCase()}`;
  if (ctx.scale) opening += `, spanning ${ctx.scale.toLowerCase()}`;
  if (ctx.timeline) opening += ` over ${ctx.timeline.toLowerCase()}`;
  opening += ".";
  parts.push(opening);

  if (ctx.concern) {
    parts.push(
      `${ctx.concern} is compressing the planning window — a signal that the business case may be advancing faster than technology architecture can support.`
    );
  }

  if (event.executiveMindset) {
    parts.push(event.executiveMindset);
  }

  if (ctx.scale && includesAny(ctx.scale, ["21", "50"])) {
    parts.push(
      "At this scale, the question is not whether individual locations can open — it is whether each opening strengthens or erodes the operating model."
    );
  } else {
    parts.push(
      "The implications extend beyond any single site: standards, cost visibility, and decision rights across the footprint will determine whether this change is manageable or compounding."
    );
  }

  return parts.join(" ");
}

function buildWhatWeHeard(event: BusinessEvent, ctx: SituationContext): string[] {
  const heard: string[] = [];

  if (ctx.catalyst) {
    if (includesAny(ctx.catalyst, ["competitive"])) {
      heard.push(
        "Competitive dynamics are shaping the pace of expansion — technology standardization is running behind market pressure."
      );
    } else if (includesAny(ctx.catalyst, ["acquisition", "franchise"])) {
      heard.push(
        "Growth through acquisition or franchising will inherit heterogeneous technology estates — early standardization decisions determine how much integration work follows."
      );
    } else if (includesAny(ctx.catalyst, ["customer demand", "revenue"])) {
      heard.push(
        "Revenue opportunity is the primary driver, which means customer-facing technology consistency will be scrutinized before internal teams fully align."
      );
    } else if (includesAny(ctx.catalyst, ["portfolio"])) {
      heard.push(
        "Portfolio optimization is the catalyst — duplicate spend and incompatible systems across locations are likely limiting the savings the business expects."
      );
    } else if (includesAny(ctx.catalyst, ["market", "geographic"])) {
      heard.push(
        "Geographic expansion is the strategic intent, multiplying connectivity, compliance, and operational variables that rarely transfer cleanly between markets."
      );
    }
  }

  if (ctx.scale && ctx.timeline) {
    heard.push(
      `A rollout of ${ctx.scale.toLowerCase()} across ${ctx.timeline.toLowerCase()} demands repeatable deployment — bespoke approaches at each site will not sustain the cadence.`
    );
  } else if (ctx.scale) {
    heard.push(
      `The scope of ${ctx.scale.toLowerCase()} moves this beyond a pilot exercise into an operating model question.`
    );
  }

  if (ctx.model) {
    if (includesAny(ctx.model, ["flexibility"])) {
      heard.push(
        "The target posture is core standards with local flexibility — workable only if the boundary between standard and local is explicit and enforced."
      );
    } else if (includesAny(ctx.model, ["independent"])) {
      heard.push(
        "Locations are expected to operate with significant independence — which reduces short-term friction but increases integration and audit complexity over time."
      );
    } else if (includesAny(ctx.model, ["identical", "every site"])) {
      heard.push(
        "Full standardization across sites is the ambition — which raises the bar for blueprint definition, testing, and governance before the first opening."
      );
    }
  }

  if (ctx.concern) {
    if (includesAny(ctx.concern, ["cost"])) {
      heard.push(
        "Cost predictability is the executive priority — fragmented contracts and per-location provisioning will make forecasting difficult without deliberate architecture."
      );
    } else if (includesAny(ctx.concern, ["speed"])) {
      heard.push(
        "Rollout speed is the binding constraint — without a location blueprint, each opening will inherit whatever worked last time, including accumulated technical debt."
      );
    } else if (includesAny(ctx.concern, ["consistency"])) {
      heard.push(
        "Consistency is the stated pressure point — which typically reflects gaps in standards, monitoring, or handoff between real estate, operations, and technology."
      );
    } else {
      heard.push(
        `${ctx.concern} is where leadership attention is focused — the technology implications of that priority deserve explicit ownership before commitments are made.`
      );
    }
  }

  if (ctx.stage) {
    heard.push(
      `The organization is in ${ctx.stage.toLowerCase()} — technology decisions made now will constrain integration options at later stages.`
    );
  }

  if (heard.length === 0) {
    heard.push(
      `Active planning is underway for ${event.title.toLowerCase()}, with technology implications that cut across operations, governance, and vendor relationships.`
    );
  }

  return heard.slice(0, 5);
}

function buildLikelyImpacts(
  event: BusinessEvent,
  ctx: SituationContext,
  domains: string[]
): string[] {
  const impacts: string[] = [];

  if (ctx.catalyst && includesAny(ctx.catalyst, ["competitive"])) {
    impacts.push(
      "Accelerated timelines tend to defer standards definition — creating short-term openings that become long-term integration debt."
    );
  } else if (ctx.catalyst && includesAny(ctx.catalyst, ["acquisition", "franchise"])) {
    impacts.push(
      "Inherited technology from acquired or franchised sites will require explicit rationalization — deferring that work multiplies support cost and security exposure."
    );
  } else if (ctx.catalyst && includesAny(ctx.catalyst, ["customer demand", "revenue"])) {
    impacts.push(
      "Customer-facing systems at new locations will be compared against existing sites immediately — inconsistencies become visible to the market before internal teams reconcile them."
    );
  }

  if (ctx.model && includesAny(ctx.model, ["independent"])) {
    impacts.push(
      "Location-level independence expands the audit surface and makes enterprise-wide reporting, security policy, and vendor negotiation harder to centralize."
    );
  }

  if (ctx.concern && includesAny(ctx.concern, ["cost"])) {
    impacts.push(
      "Without location-level cost visibility, renewal cycles will lock in fragmented spend before leadership can negotiate from a consolidated position."
    );
  } else if (ctx.concern && includesAny(ctx.concern, ["speed"])) {
    impacts.push(
      "Speed-driven deployments default to replication of the last opening — including undocumented workarounds that become undocumented standards."
    );
  }

  if (ctx.systems) {
    impacts.push(
      `Integration sequencing will center on ${ctx.systems.toLowerCase()} — these are the domains where executive trade-offs become unavoidable first.`
    );
  }

  if (ctx.stage) {
    impacts.push(
      "Identity, data boundaries, and operational tooling choices made during this phase will be expensive to unwind once integration milestones are set."
    );
  }

  const domainNotes: Record<string, string> = {
    "Networking & Connectivity":
      "Connectivity is rarely constrained at headquarters — it becomes the bottleneck at the edge, where landlord requirements and carrier options vary by site.",
    "IT Operations":
      "Operational tooling designed for a single campus does not automatically support provisioning, monitoring, and supporting a distributed footprint.",
    "Security & Compliance":
      "Security scope expands with every new site and integration path — particularly where local staff, contractors, and third parties touch production systems.",
    "Customer Experience":
      "A technology inconsistency at one location often signals a standards gap that already exists across the portfolio.",
    "Data & Analytics":
      "Reporting and analytics built for a centralized model will not reflect location-level reality until data ownership and pipelines are explicitly designed.",
    "AI & Automation":
      "Automation initiatives that depend on clean, accessible data will stall until governance and access models are defined for the distributed footprint.",
  };

  for (const domain of domains.slice(0, 3)) {
    const note = domainNotes[domain];
    if (note && !impacts.some((impact) => impact.includes(note.slice(0, 30)))) {
      impacts.push(note);
    }
  }

  if (impacts.length === 0 && event.businessProblem) {
    impacts.push(event.businessProblem);
  }

  if (impacts.length === 0) {
    impacts.push(
      `${event.title} affects how standards are set, how costs are visible, and who owns technology decisions across locations — not merely which tools are deployed.`
    );
  }

  return impacts.slice(0, 6);
}

function buildBlindSpots(
  event: BusinessEvent,
  ctx: SituationContext,
  insights: string[]
): string[] {
  const spots: string[] = [...insights];

  if (ctx.scale && includesAny(ctx.scale, ["50", "21"])) {
    spots.push(
      "Past the second or third opening, organizations at this scale typically discover whether a repeatable playbook exists — or whether each site remains a custom project."
    );
  }

  if (ctx.model && includesAny(ctx.model, ["independent"])) {
    spots.push(
      "Location-level independence often masks duplicate spend and incompatible integrations until consolidation is far more expensive."
    );
  }

  const contextual = [
    "Total technology cost by location is frequently unknown until renewal cycles — after commitments are already locked in.",
    "The last successful opening is often treated as the template, even when its technology choices were accidental rather than deliberate.",
    "Business milestones and technology readiness are rarely tracked on the same plan.",
    "Vendor contracts signed at individual locations can constrain enterprise architecture decisions for years.",
  ];

  for (const spot of contextual) {
    if (spots.length >= 5) break;
    if (!spots.includes(spot)) spots.push(spot);
  }

  return spots.slice(0, 5);
}

function buildQuestionsToExplore(
  event: BusinessEvent,
  ctx: SituationContext,
  domains: string[]
): string[] {
  const questions: string[] = [];

  if (ctx.catalyst) {
    questions.push(
      "What business assumptions behind the expansion still need validation before technology commitments are made?"
    );
  }

  if (ctx.concern) {
    questions.push(
      "Where does the current pressure manifest first — in budgets, in operations, or in customer-facing performance?"
    );
  }

  if (ctx.model) {
    questions.push(
      "What is explicitly standardized today, and what remains at local discretion without central review?"
    );
  }

  if (ctx.scale) {
    questions.push(
      "What would need to be true for the next opening to proceed without a dedicated technology project team?"
    );
  }

  if (ctx.stage) {
    questions.push(
      "Which integration decisions must be made during the current phase to preserve options at later milestones?"
    );
  }

  const domainQuestions: Record<string, string> = {
    "Networking & Connectivity":
      "Where are connectivity decisions made today — centrally, by region, or by each opening team?",
    "IT Operations":
      "Is there a documented location playbook, or does each site inherit the preferences of whoever managed the last opening?",
    "Security & Compliance":
      "Can security and compliance requirements be described the same way at every location — or only at headquarters?",
    "Customer Experience":
      "Which customer-facing capabilities must match flagship standards, and which can legitimately vary by location?",
    "Data & Analytics":
      "Who owns data quality and access authorization across locations — and is that ownership reflected in governance?",
  };

  for (const domain of domains.slice(0, 2)) {
    const question = domainQuestions[domain];
    if (question) questions.push(question);
  }

  questions.push(
    `Who owns the technology implications of ${event.title.toLowerCase()} — and do they have visibility across the full footprint?`
  );

  return Array.from(new Set(questions)).slice(0, 6);
}

function buildAreasToExploreNext(
  event: BusinessEvent,
  answered: AnsweredQuestion[],
  domains: string[]
): string[] {
  const areas = new Set<string>();

  for (const { question } of answered) {
    if (question.reportSection) areas.add(question.reportSection);
  }

  for (const domain of domains.slice(0, 4)) {
    areas.add(domain);
  }

  if (areas.size === 0) {
    event.technologyDomains.slice(0, 3).forEach((domain) => areas.add(resolveDomainLabel(domain)));
  }

  return Array.from(areas).slice(0, 6);
}

function buildRoadmap(
  event: BusinessEvent,
  ctx: SituationContext
): TechnologyImpactReview["roadmap"] {
  const urgent =
    ctx.timeline?.toLowerCase().includes("3 month") ||
    ctx.timeline?.toLowerCase().includes("due diligence") ||
    event.triggerLevel === "high";

  const immediate: string[] = [
    "Confirm executive ownership for technology decisions tied to this change",
    "Document what was deployed at the most recent location opening or integration — not the ideal state",
  ];

  const next30Days: string[] = [
    "Define non-negotiable technology standards versus acceptable local variation",
    "Inventory connectivity, tooling, and support contracts that will repeat at each location",
  ];

  const next90Days: string[] = [
    "Establish a location readiness checklist tied to the business opening or integration timeline",
    "Build cost and risk visibility by location before the next major commitment",
  ];

  if (urgent) {
    immediate.unshift(
      "Identify the next location or integration milestone and work backward from its date"
    );
  }

  if (ctx.concern && includesAny(ctx.concern, ["cost"])) {
    next30Days.push("Map recurring technology spend by location and contract renewal date");
  }
  if (ctx.concern && includesAny(ctx.concern, ["consistency"])) {
    next30Days.push(
      "Compare technology stack and configuration across three representative locations"
    );
  }

  if (ctx.systems) {
    next90Days.unshift(
      `Sequence integration or deployment priorities for ${ctx.systems.toLowerCase()}`
    );
  }

  if (event.reportTemplate === "expansion-brief") {
    immediate.push(
      "Validate whether a location technology blueprint exists — or whether each opening remains bespoke"
    );
  }

  return {
    immediate: immediate.slice(0, 4),
    next30Days: next30Days.slice(0, 4),
    next90Days: next90Days.slice(0, 4),
  };
}

function buildNextConversation(event: BusinessEvent, ctx: SituationContext): string {
  const focus = ctx.concern
    ? ctx.concern.toLowerCase()
    : ctx.catalyst
      ? ctx.catalyst.toLowerCase()
      : event.title.toLowerCase();

  return `A working session focused on ${focus} would be the logical next step — to pressure-test assumptions, sequence what to evaluate, and agree what must be standardized before the business timeline narrows the options. This is evaluative preparation, not vendor selection.`;
}

function buildReviewTitle(event: BusinessEvent, industryTitle?: string): string {
  if (industryTitle) {
    return `Technology Impact Review — ${event.title} (${industryTitle})`;
  }
  return `Technology Impact Review — ${event.title}`;
}

function generateBaseTechnologyImpactReview(
  event: BusinessEvent,
  answers: ConversationAnswers
): TechnologyImpactReview {
  const answered = getAnsweredQuestions(event, answers);
  const ctx = extractSituation(answered);
  const domains = collectDomains(event, answered);
  const insights = getTriggeredInsights(answered);

  return {
    title: buildReviewTitle(event),
    eventTitle: event.title,
    generatedAt: new Date().toISOString(),
    executiveSummary: buildExecutiveSummary(event, ctx, answered),
    whatWeHeard: buildWhatWeHeard(event, ctx),
    likelyImpacts: buildLikelyImpacts(event, ctx, domains),
    blindSpots: buildBlindSpots(event, ctx, insights),
    questionsToExplore: buildQuestionsToExplore(event, ctx, domains),
    areasToExploreNext: buildAreasToExploreNext(event, answered, domains),
    roadmap: buildRoadmap(event, ctx),
    nextConversation: buildNextConversation(event, ctx),
    ctaLabel: event.cta ?? "Request a collaborative session",
  };
}

export function generateTechnologyImpactReview(
  reportContext: ReportContext,
  overlayRegistry: IndustryOverlayRegistry = {}
): TechnologyImpactReview {
  const { event, answers, context } = reportContext;
  const industry = context.industry ?? null;

  const base = generateBaseTechnologyImpactReview(event, answers);
  const overlay = getIndustryOverlay(
    overlayRegistry,
    event.slug,
    industry?.slug
  );

  const review = applyIndustryOverlay(base, overlay);

  if (industry) {
    return {
      ...review,
      title: buildReviewTitle(event, industry.title),
      industryTitle: industry.title,
    };
  }

  return review;
}

/** @deprecated Use generateTechnologyImpactReview */
export const generateExecutiveBrief = generateTechnologyImpactReview;
