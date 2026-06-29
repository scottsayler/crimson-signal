import type { WriteContext } from "../types";

const CONCERN_PHRASES: Record<string, string> = {
  "Speed of deployment": "rollout speed",
  "Consistency and quality": "consistency across locations",
  "Cost predictability": "cost predictability",
  "Integration with existing systems": "integration with existing systems",
  "Speed to unified operations": "pressure to unify operations quickly",
  "Minimize disruption": "pressure to minimize disruption",
  "Cost reduction": "cost reduction",
  "Security and compliance": "security and compliance",
};

const CATALYST_PHRASES: Record<string, string> = {
  "Market or geographic growth": "geographic expansion",
  "Customer demand or revenue opportunity": "revenue opportunity",
  "Competitive pressure": "competitive pressure",
  "Acquisition of locations or franchise growth": "acquisition or franchise growth",
  "Portfolio optimization": "portfolio optimization",
};

const SCALE_PHRASES: Record<string, string> = {
  "1–5 locations": "one to five locations",
  "6–20 locations": "six to twenty locations",
  "21–50 locations": "twenty-one to fifty locations",
  "50+ locations": "more than fifty locations",
  "Two organizations": "two organizations",
  "3–5 entities": "three to five entities",
  "More than 5": "more than five entities",
};

const TIMELINE_PHRASES: Record<string, string> = {
  "Next 3 months": "the next three months",
  "3–12 months": "the next three to twelve months",
  "12–24 months": "the next twelve to twenty-four months",
  "Ongoing rollout": "an ongoing rollout",
};

const STAGE_PHRASES: Record<string, string> = {
  "Due diligence": "due diligence",
  "Day 1 planning": "day-one planning",
  "Active integration": "active integration",
  "Post-integration optimization": "post-integration optimization",
};

function phraseFromMap(value: string, map: Record<string, string>): string {
  if (map[value]) return map[value];
  for (const [key, phrase] of Object.entries(map)) {
    if (value.includes(key) || key.includes(value)) return phrase;
  }
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function humanizeSystems(value: string): string {
  if (!value.includes(",")) {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }
  const parts = value.split(",").map((p) => p.trim().toLowerCase());
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

export function buildEditorialVariables(
  ctx: WriteContext,
  raw: Record<string, string>
): Record<string, string> {
  const concern = raw.concern ?? raw.challenge ?? raw.priority;
  const catalyst = raw.catalyst ?? raw.expansion_catalyst;
  const scale = raw.scale ?? raw.location_count ?? raw.entity_count;
  const timeline = raw.timeline ?? raw.expansion_scale;
  const stage = raw.stage ?? raw.deal_stage;
  const systems = raw.systems;

  const vars: Record<string, string> = {
    ...raw,
    event_title: ctx.event.title.toLowerCase(),
    industry_title: ctx.industryTitle?.toLowerCase() ?? "",
    event_mindset: ctx.event.executiveMindset ?? "",
    event_problem: ctx.event.businessProblem ?? "",
  };

  if (concern) {
    vars.concern = phraseFromMap(concern, CONCERN_PHRASES);
    vars.concern_topic = vars.concern;
  }
  if (catalyst) vars.catalyst = phraseFromMap(catalyst, CATALYST_PHRASES);
  if (scale) vars.scale = phraseFromMap(scale, SCALE_PHRASES);
  if (timeline) vars.timeline = phraseFromMap(timeline, TIMELINE_PHRASES);
  if (stage) vars.stage = phraseFromMap(stage, STAGE_PHRASES);
  if (systems) vars.systems = humanizeSystems(systems);

  return vars;
}

const TEMPLATE_SENTENCES: Array<{
  test: (content: string) => boolean;
  render: (vars: Record<string, string>) => string | null;
}> = [
  {
    test: (c) => c.includes("{{concern}}") && c.includes("forcing function"),
    render: (v) =>
      v.concern
        ? `${capitalize(v.concern)} is forcing the pace of decisions. The question is whether architecture can keep up without accumulating location-level exceptions that compound over time.`
        : null,
  },
  {
    test: (c) => c.includes("{{scale}}") && c.includes("{{timeline}}"),
    render: (v) =>
      v.scale && v.timeline
        ? `Opening ${v.scale} over ${v.timeline} only works with repeatable deployment. Bespoke approaches at each site will not sustain the cadence leadership expects.`
        : null,
  },
  {
    test: (c) => c.includes("The scope of {{scale}}"),
    render: (v) =>
      v.scale
        ? `At ${v.scale}, this is no longer a pilot. It is an operating model question that will define cost, risk, and speed for years.`
        : null,
  },
  {
    test: (c) => c.includes("{{stage}}"),
    render: (v) =>
      v.stage
        ? `You are in ${v.stage}, which means technology choices made now will narrow integration options at later milestones.`
        : null,
  },
  {
    test: (c) =>
      c.includes("{{systems}}") &&
      (c.includes("Integration sequencing") || c.includes("Sequencing")),
    render: (v) =>
      v.systems
        ? `Integration sequencing will center on ${v.systems}. These are the domains where trade-offs become executive decisions, not technical preferences.`
        : null,
  },
  {
    test: (c) => c.includes("{{event_title}}") && c.includes("Who owns"),
    render: (v) =>
      v.event_title
        ? `Who owns the technology implications of ${v.event_title}, and do they have visibility across the full footprint?`
        : null,
  },
  {
    test: (c) => c.includes("{{event_problem}}"),
    render: (v) => (v.event_problem ? v.event_problem : null),
  },
  {
    test: (c) => c.includes("{{concern}}") && c.includes("working session"),
    render: (v) => {
      const focus = v.concern ?? v.catalyst ?? v.event_title;
      if (!focus) return null;
      return `A working session on ${focus} would pressure-test assumptions, sequence what to evaluate, and clarify what must be standardized before the business timeline narrows options. This is preparation for decision-making, not vendor selection.`;
    },
  },
];

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function renderEditorialTemplate(
  content: string,
  variables: Record<string, string>
): string | null {
  for (const template of TEMPLATE_SENTENCES) {
    if (template.test(content)) {
      const rendered = template.render(variables);
      if (rendered) return rendered;
    }
  }
  return null;
}
