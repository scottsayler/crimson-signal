import type { BusinessEvent } from "../types";
import type { ConversationAnswers } from "../conversation";

export type PatternId = string;

export type ReportSection =
  | "executiveObservation"
  | "whatWeHeard"
  | "likelyImpacts"
  | "blindSpots"
  | "questionsToExplore"
  | "areasToExploreNext"
  | "roadmap.immediate"
  | "roadmap.next30Days"
  | "roadmap.next90Days"
  | "nextConversation";

export type PatternConditionOperator = "eq" | "in" | "contains" | "matches";

export interface PatternCondition {
  questionId: string;
  operator: PatternConditionOperator;
  value: string | string[];
}

export interface PatternTags {
  technologyDomains?: string[];
  businessSignals?: string[];
  reportSections?: string[];
}

/** Atomic advisory unit: principle (reasoning) + content (report prose). */
export interface ExecutivePattern {
  id: PatternId;
  version: number;
  section: ReportSection;
  /** Enduring executive principle — used by the engine, not concatenated into prose. */
  principle: string;
  /** Report-facing prose; may include {{variable}} placeholders. */
  content: string;
  basePriority: number;
  events: string[];
  conditions?: PatternCondition[];
  /** Restrict candidacy to specific industries when set. */
  industries?: string[];
  theme?: string;
  tags?: PatternTags;
}

export interface PatternGroupFile {
  family: string;
  patterns: RawPatternDefinition[];
}

export interface RawPatternDefinition {
  id: string;
  version?: number;
  section: ReportSection;
  principle: string;
  content: string;
  base_priority: number;
  events: string[];
  conditions?: Array<{
    question_id: string;
    operator?: PatternConditionOperator;
    value: string | string[];
  }>;
  industries?: string[];
  theme?: string;
  tags?: {
    technology_domains?: string[];
    business_signals?: string[];
    report_sections?: string[];
  };
}

export interface IndustryWeightFile {
  industry: string;
  patterns: Record<PatternId, number>;
}

export interface SignalWeightFile {
  signals: Record<string, Record<PatternId, number>>;
}

export interface AnswerWeightEntry {
  question_id: string;
  answer: string | string[];
  adjustments: Record<PatternId, number>;
}

export interface AnswerWeightFile {
  event: string;
  adjustments: AnswerWeightEntry[];
}

export interface PatternRegistry {
  patterns: Map<PatternId, ExecutivePattern>;
  /** Built automatically from pattern.events metadata. */
  eventIndex: Map<string, PatternId[]>;
  industryWeights: Map<string, Map<PatternId, number>>;
  signalWeights: Map<string, Map<PatternId, number>>;
  answerWeights: Map<string, AnswerWeightEntry[]>;
}

export interface PatternEngineInput {
  event: BusinessEvent;
  answers: ConversationAnswers;
  industry?: { slug: string; title: string } | null;
}

export interface PatternConfidenceBreakdown {
  patternId: PatternId;
  section: ReportSection;
  finalScore: number;
  selected: boolean;
  selectionReason?: string;
  factors: {
    basePriority: number;
    industryMultiplier: number;
    answerDelta: number;
    matchedSignals: string[];
    matchedConditions: string[];
  };
}

export interface PatternScore {
  pattern: ExecutivePattern;
  finalScore: number;
  basePriority: number;
  industryMultiplier: number;
  answerDelta: number;
  matchedSignals: string[];
  matchedConditions: string[];
}

export interface SelectedPatterns {
  executiveObservation: ExecutivePattern | null;
  dominantPrinciple: string | null;
  whatWeHeard: ExecutivePattern[];
  likelyImpacts: ExecutivePattern[];
  blindSpots: ExecutivePattern[];
  questionsToExplore: ExecutivePattern[];
  areasToExploreNext: ExecutivePattern[];
  roadmap: {
    immediate: ExecutivePattern[];
    next30Days: ExecutivePattern[];
    next90Days: ExecutivePattern[];
  };
  nextConversation: ExecutivePattern | null;
}

export interface PatternEngineResult {
  input: PatternEngineInput;
  candidates: PatternId[];
  scores: PatternScore[];
  selected: SelectedPatterns;
  confidence: PatternConfidenceBreakdown[];
}

export interface WriteContext {
  event: BusinessEvent;
  answers: ConversationAnswers;
  industryTitle?: string;
  dominantPrinciple?: string | null;
}
