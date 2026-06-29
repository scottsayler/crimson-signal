export interface TechnologyDomain {
  id: string;
  label: string;
}

export type QuestionType = "select" | "text" | "multiselect";

export type QuestionWeight = "low" | "medium" | "high" | string;

export interface ConversationQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  /** Optional guidance shown alongside the question (not rendered yet) */
  description?: string;
  required?: boolean;
  purpose?: string;
  businessSignal?: string[];
  technologyDomains?: string[];
  reportSection?: string;
  weight?: QuestionWeight;
  followUp?: string;
  executiveInsight?: string;
  scoringLogic?: Record<string, string>;
}

export interface BusinessEvent {
  slug: string;
  title: string;
  /** Populated from `summary` or legacy `shortDescription` */
  shortDescription: string;
  icon: string;
  technologyDomains: string[];
  relatedIndustries: string[];
  questions: ConversationQuestion[];
  content: string;
  order: number;

  // Extended schema (all optional)
  category?: string;
  summary?: string;
  executiveMindset?: string;
  businessProblem?: string;
  triggerLevel?: string;
  targetPersonas?: string[];
  industries?: string[];
  relatedEvents?: string[];
  relatedArticles?: string[];
  relatedResearch?: string[];
  interactiveTool?: string;
  reportTemplate?: string;
  strategySession?: boolean | string;
  cta?: string;
  searchIntent?: string[];
}

export interface Industry {
  slug: string;
  title: string;
  shortDescription: string;
  technologyDomains: string[];
  relatedEvents: string[];
  content: string;
  order: number;
}

export interface ResearchArticle {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  technologyDomains: string[];
  content: string;
}

export interface ExecutiveBriefSample {
  slug: string;
  title: string;
  eventSlug: string;
  industrySlug?: string;
  excerpt: string;
  publishedAt: string;
}

export interface SampleReviewListing {
  slug: string;
  title: string;
  industry: string;
  businessEvent: string;
  summary: string;
  publishedDate: string;
  featured: boolean;
}

export interface SampleReviewContent {
  executiveSummary: string;
  executiveObservations: string[];
  commonBlindSpots: string[];
  technologyImplications: string[];
  questionsToExplore: string[];
  suggestedSequencing: {
    immediate: string[];
    next30Days: string[];
    next90Days: string[];
  };
  recommendedNextConversation: string;
}

export interface SampleReview extends SampleReviewListing {
  review: SampleReviewContent;
}

export interface BriefAnswers {
  eventSlug: string;
  answers: Record<string, string | string[]>;
}

export const TECHNOLOGY_DOMAINS: TechnologyDomain[] = [
  { id: "cloud", label: "Cloud & Infrastructure" },
  { id: "security", label: "Security & Compliance" },
  { id: "networking", label: "Networking & Connectivity" },
  { id: "collaboration", label: "Collaboration & Productivity" },
  { id: "data", label: "Data & Analytics" },
  { id: "ai", label: "AI & Automation" },
  { id: "operations", label: "IT Operations" },
  { id: "customer-experience", label: "Customer Experience" },
];

export function getDomainLabel(id: string): string {
  return TECHNOLOGY_DOMAINS.find((d) => d.id === id)?.label ?? id;
}
