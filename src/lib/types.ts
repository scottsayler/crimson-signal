export interface TechnologyDomain {
  id: string;
  label: string;
}

export interface ConversationQuestion {
  id: string;
  question: string;
  type: "select" | "text" | "multiselect";
  options?: string[];
  placeholder?: string;
}

export interface BusinessEvent {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  technologyDomains: string[];
  relatedIndustries: string[];
  questions: ConversationQuestion[];
  content: string;
  order: number;
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
