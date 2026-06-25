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

function collectDomains(event: BusinessEvent, answered: AnsweredQuestion[]): string[] {
  const domains = new Set<string>();
  for (const domain of event.technologyDomains) domains.add(resolveDomainLabel(domain));
  for (const { question } of answered) {
    question.technologyDomains?.forEach((domain) => domains.add(resolveDomainLabel(domain)));
  }
  return Array.from(domains);
}

function naturalizeResponse(question: ConversationQuestion, answer: string): string {
  const q = question.question.toLowerCase();

  if (q.includes("how many")) return `you are planning for **${answer}**`;
  if (q.includes("prompted") || q.includes("catalyst"))
    return `this expansion was driven by **${answer.toLowerCase()}**`;
  if (q.includes("timeline") || q.includes("when"))
    return `your timeline is **${answer}**`;
  if (q.includes("standardized") || q.includes("standard"))
    return `you are aiming for **${answer.toLowerCase()}**`;
  if (q.includes("concern") || q.includes("biggest") || q.includes("priority"))
    return `**${answer}** is the primary pressure point you raised`;
  if (q.includes("where are you") || q.includes("stage") || q.includes("process"))
    return `you are currently in **${answer.toLowerCase()}**`;
  if (q.includes("how many entities") || q.includes("brands"))
    return `the change involves **${answer.toLowerCase()}**`;
  if (question.type === "multiselect")
    return `you flagged **${answer}** as areas requiring attention`;

  return `on *${question.question.replace(/\?$/, "")}*, you said **${answer}**`;
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

function buildExecutiveSummary(event: BusinessEvent, answered: AnsweredQuestion[]): string {
  if (answered.length === 0) {
    return `You are evaluating technology implications related to ${event.title.toLowerCase()}. At this stage, the priority is clarifying scope, ownership, and what must be true before the business timeline forces tactical decisions.`;
  }

  const observations = answered
    .slice(0, 4)
    .map(({ question, answer }) => naturalizeResponse(question, answer).replace(/\*\*/g, ""));

  const concern = findAnswer(answered, "challenge") ?? findAnswer(answered, "priority");
  const scale = findAnswer(answered, "location-count") ?? findAnswer(answered, "entity-count");
  const catalyst = findAnswer(answered, "expansion-catalyst");

  let summary = `You are navigating ${event.title.toLowerCase()}`;

  if (catalyst) {
    summary += `, driven by ${catalyst.toLowerCase()}`;
  }

  if (scale) {
    summary += ` at a scale of ${scale.toLowerCase()}`;
  }

  const timeline = findAnswer(answered, "expansion-scale") ?? findAnswer(answered, "timeline");
  if (timeline) {
    summary += `, with a timeline of ${timeline.toLowerCase()}`;
  }

  summary += ". ";

  if (concern) {
    summary += `${concern} surfaced as the most immediate concern — which usually means the business case is moving faster than technology visibility. `;
  }

  if (event.executiveMindset) {
    summary += event.executiveMindset + " ";
  }

  if (observations.length > 1) {
    summary += `Taken together, your responses point to a change that will stress consistency, cost visibility, and how decisions are made across locations.`;
  }

  return summary.trim();
}

function buildWhatWeHeard(answered: AnsweredQuestion[]): string[] {
  return answered.map(({ question, answer }) => {
    const natural = naturalizeResponse(question, answer).replace(/\*\*/g, "");
    if (question.purpose) {
      return `${natural.charAt(0).toUpperCase()}${natural.slice(1)} — relevant because ${question.purpose.toLowerCase()}.`;
    }
    return `${natural.charAt(0).toUpperCase()}${natural.slice(1)}.`;
  });
}

function buildLikelyImpacts(
  event: BusinessEvent,
  answered: AnsweredQuestion[],
  domains: string[]
): string[] {
  const impacts: string[] = [];
  const catalyst = findAnswer(answered, "expansion-catalyst");
  const scale = findAnswer(answered, "location-count");
  const timeline = findAnswer(answered, "expansion-scale") ?? findAnswer(answered, "timeline");
  const model = findAnswer(answered, "model");
  const concern = findAnswer(answered, "challenge") ?? findAnswer(answered, "priority");
  const systems = findAnswer(answered, "systems");

  if (catalyst?.toLowerCase().includes("competitive")) {
    impacts.push(
      `Competitive pressure often accelerates opening timelines before technology standards are defined — creating short-term wins that become long-term integration debt.`
    );
  } else if (catalyst?.toLowerCase().includes("acquisition") || catalyst?.toLowerCase().includes("franchise")) {
    impacts.push(
      `Growth through acquired or franchised locations typically inherits heterogeneous technology — standardization decisions made early determine how much integration work follows.`
    );
  } else if (catalyst?.toLowerCase().includes("customer demand")) {
    impacts.push(
      `Revenue-driven expansion puts customer-facing technology under immediate scrutiny — inconsistencies between locations become visible to customers before internal teams align.`
    );
  } else if (catalyst?.toLowerCase().includes("portfolio")) {
    impacts.push(
      `Portfolio optimization usually surfaces duplicate spend and incompatible systems across locations — technology visibility is often the limiting factor in realizing savings.`
    );
  } else if (catalyst?.toLowerCase().includes("market") || catalyst?.toLowerCase().includes("geographic")) {
    impacts.push(
      `Geographic growth multiplies connectivity, compliance, and operational variables — what works in one market rarely transfers without deliberate adaptation.`
    );
  }

  if (scale && timeline) {
    impacts.push(
      `Opening ${scale.toLowerCase()} on a ${timeline.toLowerCase()} cadence leaves little room for one-off deployments — each delay at one site becomes a pattern unless standards are defined now.`
    );
  }

  if (model?.toLowerCase().includes("flexibility")) {
    impacts.push(
      `Your preference for core standards with local flexibility is workable, but it requires explicit boundaries — otherwise "flexibility" becomes unreviewed variation at each location.`
    );
  } else if (model?.toLowerCase().includes("independent")) {
    impacts.push(
      `Allowing each location to operate largely independently will reduce short-term friction but increase integration cost, support complexity, and audit surface over time.`
    );
  }

  if (concern?.toLowerCase().includes("cost")) {
    impacts.push(
      `With cost predictability as the stated concern, fragmented contracts and per-location provisioning will make it difficult to forecast spend before commitments are made.`
    );
  } else if (concern?.toLowerCase().includes("speed")) {
    impacts.push(
      `Speed-driven rollouts tend to reuse whatever worked last time — including technical debt — unless a location blueprint exists before the next opening.`
    );
  } else if (concern?.toLowerCase().includes("consistency")) {
    impacts.push(
      `Consistency concerns at this stage usually reflect gaps in standards, monitoring, or handoff between real estate, operations, and technology — not a single system failure.`
    );
  }

  if (systems) {
    impacts.push(
      `The systems you identified (${systems.toLowerCase()}) will drive integration sequencing, security boundaries, and where executive trade-offs are unavoidable.`
    );
  }

  const stage = findAnswer(answered, "deal-stage");
  if (stage) {
    impacts.push(
      `At the ${stage.toLowerCase()} stage, technology decisions made now will constrain integration options later — particularly identity, data, and operational tooling.`
    );
  }

  const domainNotes: Record<string, string> = {
    "Networking & Connectivity":
      "Connectivity is rarely the bottleneck at headquarters — it becomes one at the edge, where landlord constraints and carrier options vary by site.",
    "IT Operations":
      "Operational tooling built for a single campus does not automatically support opening, monitoring, and supporting remote locations.",
    "Security & Compliance":
      "Security scope expands with every new site and integration path — particularly where local staff, contractors, and third parties touch systems.",
    "Customer Experience":
      "Inconsistent customer-facing technology at one location often indicates a standards gap that already exists elsewhere.",
  };

  for (const domain of domains.slice(0, 3)) {
    const note = domainNotes[domain];
    if (note && !impacts.some((i) => i.includes(note.slice(0, 30)))) {
      impacts.push(note);
    }
  }

  if (impacts.length === 0 && event.businessProblem) {
    impacts.push(event.businessProblem);
  }

  if (impacts.length === 0) {
    impacts.push(
      `${event.title} typically affects how standards are set, how costs are visible, and who owns technology decisions across locations — not just which tools are in use.`
    );
  }

  return impacts.slice(0, 6);
}

function buildBlindSpots(
  event: BusinessEvent,
  answered: AnsweredQuestion[],
  insights: string[]
): string[] {
  const spots: string[] = [...insights];

  const model = findAnswer(answered, "model");
  const scale = findAnswer(answered, "location-count");

  if (scale?.includes("50") || scale?.includes("21")) {
    spots.push(
      "At your stated scale, the third and fourth openings often expose whether a playbook exists — or whether each site is still a custom project."
    );
  }

  if (model?.toLowerCase().includes("independent")) {
    spots.push(
      "Independence at the location level frequently masks duplicate spend and incompatible integrations until consolidation is far more expensive."
    );
  }

  if (event.executiveMindset && !spots.some((s) => s.includes(event.executiveMindset!))) {
    spots.push(event.executiveMindset);
  }

  const contextual = [
    "Total technology cost by location is often unknown until renewal cycles — after decisions are already locked in.",
    "The last successful opening is treated as the template, even when its technology choices were accidental rather than deliberate.",
    "Business timelines and technology readiness are rarely tracked on the same plan.",
  ];

  for (const spot of contextual) {
    if (spots.length >= 5) break;
    if (!spots.includes(spot)) spots.push(spot);
  }

  return spots.slice(0, 5);
}

function buildQuestionsToExplore(
  event: BusinessEvent,
  answered: AnsweredQuestion[],
  domains: string[]
): string[] {
  const questions: string[] = [];
  const catalyst = findAnswer(answered, "expansion-catalyst");
  const concern = findAnswer(answered, "challenge") ?? findAnswer(answered, "priority");
  const model = findAnswer(answered, "model");
  const scale = findAnswer(answered, "location-count");

  if (catalyst) {
    questions.push(
      `You cited ${catalyst.toLowerCase()} as the catalyst — what business assumptions behind that decision still need to be validated before technology commitments are made?`
    );
  }

  if (concern) {
    questions.push(
      `You raised ${concern.toLowerCase()} — where is that pressure showing up first: in budgets, in operations, or in customer-facing performance?`
    );
  }

  if (model) {
    questions.push(
      `You described your standardization approach as "${model.toLowerCase()}" — what is explicitly standardized today, and what is left to local discretion?`
    );
  }

  if (scale) {
    questions.push(
      `At ${scale.toLowerCase()}, what would need to be true for the next opening to require no special technology project team?`
    );
  }

  for (const { question } of answered) {
    if (question.reportSection) {
      questions.push(
        `On ${question.reportSection.toLowerCase()}: what has already been decided, and what still lacks a single owner?`
      );
    }
  }

  const domainQuestions: Record<string, string> = {
    "Networking & Connectivity":
      "Where do connectivity decisions get made today — centrally, by region, or by each opening team?",
    "IT Operations":
      "Do we have a documented location playbook, or does each site inherit the preferences of whoever managed the last opening?",
    "Security & Compliance":
      "Can we describe security and compliance requirements the same way at every location — or only at headquarters?",
  };

  for (const domain of domains.slice(0, 2)) {
    const q = domainQuestions[domain];
    if (q) questions.push(q);
  }

  questions.push(
    `Who in the organization owns the technology implications of ${event.title.toLowerCase()} — and do they have visibility across all locations?`
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
    if (question.purpose) areas.add(question.purpose);
  }

  for (const domain of domains.slice(0, 4)) {
    areas.add(domain);
  }

  if (areas.size === 0) {
    event.technologyDomains.slice(0, 3).forEach((d) => areas.add(resolveDomainLabel(d)));
  }

  return Array.from(areas).slice(0, 6);
}

function buildRoadmap(
  event: BusinessEvent,
  answered: AnsweredQuestion[]
): TechnologyImpactReview["roadmap"] {
  const timeline = findAnswer(answered, "expansion-scale") ?? findAnswer(answered, "timeline");
  const urgent =
    timeline?.toLowerCase().includes("3 months") ||
    timeline?.toLowerCase().includes("due diligence") ||
    event.triggerLevel === "high";

  const immediate: string[] = [
    "Confirm executive owner for technology decisions tied to this change",
    "Document what was deployed at the most recent location opening or integration — not the ideal state",
  ];

  const next30Days: string[] = [
    "Define non-negotiable technology standards vs. acceptable local variation",
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

  const concern = findAnswer(answered, "challenge");
  if (concern?.toLowerCase().includes("cost")) {
    next30Days.push("Map recurring technology spend by location and contract renewal date");
  }
  if (concern?.toLowerCase().includes("consistency")) {
    next30Days.push("Compare technology stack and configuration across three representative locations");
  }

  const systems = findAnswer(answered, "systems");
  if (systems) {
    next90Days.unshift(
      `Sequence integration or deployment priorities for: ${systems.toLowerCase()}`
    );
  }

  if (event.reportTemplate === "expansion-brief") {
    immediate.push("Validate whether a location technology blueprint exists — or whether each opening is still bespoke");
  }

  return {
    immediate: immediate.slice(0, 4),
    next30Days: next30Days.slice(0, 4),
    next90Days: next90Days.slice(0, 4),
  };
}

function buildNextConversation(event: BusinessEvent, answered: AnsweredQuestion[]): string {
  const concern = findAnswer(answered, "challenge") ?? findAnswer(answered, "priority");
  const catalyst = findAnswer(answered, "expansion-catalyst");
  const focus = concern
    ? `particularly around ${concern.toLowerCase()}`
    : catalyst
      ? `in the context of expansion driven by ${catalyst.toLowerCase()}`
      : `in the context of ${event.title.toLowerCase()}`;

  return `This review captures what you shared today. The useful next step is a working session ${focus} — to pressure-test assumptions, sequence what to evaluate, and agree what must be standardized before the business timeline narrows your options. That conversation is evaluative, not a vendor selection exercise.`;
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
  const domains = collectDomains(event, answered);
  const insights = getTriggeredInsights(answered);

  return {
    title: buildReviewTitle(event),
    eventTitle: event.title,
    generatedAt: new Date().toISOString(),
    executiveSummary: buildExecutiveSummary(event, answered),
    whatWeHeard: buildWhatWeHeard(answered),
    likelyImpacts: buildLikelyImpacts(event, answered, domains),
    blindSpots: buildBlindSpots(event, answered, insights),
    questionsToExplore: buildQuestionsToExplore(event, answered, domains),
    areasToExploreNext: buildAreasToExploreNext(event, answered, domains),
    roadmap: buildRoadmap(event, answered),
    nextConversation: buildNextConversation(event, answered),
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
