import type { BusinessEvent, ConversationQuestion } from "./types";

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value;
  return undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  return undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  return undefined;
}

function asRecord(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string"
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function firstStringArray(...values: unknown[]): string[] {
  for (const value of values) {
    const parsed = asStringArray(value);
    if (parsed) return parsed;
  }
  return [];
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    const parsed = asString(value);
    if (parsed) return parsed;
  }
  return undefined;
}

function parseQuestion(raw: unknown): ConversationQuestion | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const data = raw as Record<string, unknown>;
  const id = asString(data.id);
  const question = asString(data.question);
  const type = asString(data.type);

  if (!id || !question || !type) return null;
  if (type !== "select" && type !== "text" && type !== "multiselect") return null;

  const parsed: ConversationQuestion = { id, question, type };

  const options = asStringArray(data.options);
  if (options) parsed.options = options;

  const placeholder = asString(data.placeholder);
  if (placeholder) parsed.placeholder = placeholder;

  const description = asString(data.description);
  if (description) parsed.description = description;

  if (typeof data.required === "boolean") parsed.required = data.required;

  const purpose = asString(data.purpose);
  if (purpose) parsed.purpose = purpose;

  const businessSignal = asStringArray(data.business_signal ?? data.businessSignal);
  if (businessSignal) parsed.businessSignal = businessSignal;

  const technologyDomains = asStringArray(
    data.technology_domains ?? data.technologyDomains
  );
  if (technologyDomains) parsed.technologyDomains = technologyDomains;

  const reportSection = asString(data.report_section ?? data.reportSection);
  if (reportSection) parsed.reportSection = reportSection;

  const weight = asString(data.weight);
  if (weight) parsed.weight = weight;

  const followUp = asString(data.follow_up ?? data.followUp);
  if (followUp) parsed.followUp = followUp;

  const executiveInsight = asString(data.executive_insight ?? data.executiveInsight);
  if (executiveInsight) parsed.executiveInsight = executiveInsight;

  const scoringLogic = asRecord(data.scoring_logic ?? data.scoringLogic);
  if (scoringLogic) parsed.scoringLogic = scoringLogic;

  return parsed;
}

function parseQuestions(raw: unknown): ConversationQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => parseQuestion(item))
    .filter((item): item is ConversationQuestion => item !== null);
}

export function parseBusinessEvent(
  fileSlug: string,
  frontmatter: Record<string, unknown>,
  content: string
): BusinessEvent {
  const slug = asString(frontmatter.slug) ?? fileSlug;
  const title = asString(frontmatter.title) ?? slug;
  const summary = firstString(frontmatter.summary, frontmatter.shortDescription);
  const industries = firstStringArray(frontmatter.industries, frontmatter.relatedIndustries);
  const technologyDomains = firstStringArray(
    frontmatter.technology_domains,
    frontmatter.technologyDomains
  );

  const event: BusinessEvent = {
    slug,
    title,
    shortDescription: summary ?? "",
    icon: asString(frontmatter.icon) ?? "→",
    technologyDomains,
    relatedIndustries: industries,
    questions: parseQuestions(frontmatter.questions),
    content,
    order: asNumber(frontmatter.order) ?? 99,
  };

  const category = asString(frontmatter.category);
  if (category) event.category = category;

  if (summary) event.summary = summary;

  const executiveMindset = asString(
    frontmatter.executive_mindset ?? frontmatter.executiveMindset
  );
  if (executiveMindset) event.executiveMindset = executiveMindset;

  const businessProblem = asString(
    frontmatter.business_problem ?? frontmatter.businessProblem
  );
  if (businessProblem) event.businessProblem = businessProblem;

  const triggerLevel = asString(frontmatter.trigger_level ?? frontmatter.triggerLevel);
  if (triggerLevel) event.triggerLevel = triggerLevel;

  const targetPersonas = asStringArray(
    frontmatter.target_personas ?? frontmatter.targetPersonas
  );
  if (targetPersonas) event.targetPersonas = targetPersonas;

  if (industries.length > 0) event.industries = industries;

  const relatedEvents = asStringArray(
    frontmatter.related_events ?? frontmatter.relatedEvents
  );
  if (relatedEvents) event.relatedEvents = relatedEvents;

  const relatedArticles = asStringArray(
    frontmatter.related_articles ?? frontmatter.relatedArticles
  );
  if (relatedArticles) event.relatedArticles = relatedArticles;

  const relatedResearch = asStringArray(
    frontmatter.related_research ?? frontmatter.relatedResearch
  );
  if (relatedResearch) event.relatedResearch = relatedResearch;

  const interactiveTool = asString(
    frontmatter.interactive_tool ?? frontmatter.interactiveTool
  );
  if (interactiveTool) event.interactiveTool = interactiveTool;

  const reportTemplate = asString(
    frontmatter.report_template ?? frontmatter.reportTemplate
  );
  if (reportTemplate) event.reportTemplate = reportTemplate;

  const strategySession =
    asBoolean(frontmatter.strategy_session ?? frontmatter.strategySession) ??
    asString(frontmatter.strategy_session ?? frontmatter.strategySession);
  if (strategySession !== undefined) event.strategySession = strategySession;

  const cta = asString(frontmatter.cta);
  if (cta) event.cta = cta;

  const searchIntent = asStringArray(
    frontmatter.search_intent ?? frontmatter.searchIntent
  );
  if (searchIntent) event.searchIntent = searchIntent;

  return event;
}
