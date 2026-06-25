import type { BusinessEvent, BriefAnswers } from "./types";
import { getDomainLabel } from "./types";

export interface ExecutiveBrief {
  title: string;
  eventTitle: string;
  generatedAt: string;
  situation: string;
  implications: string[];
  priorities: { title: string; description: string }[];
  domains: string[];
  nextSteps: string[];
}

function formatAnswer(value: string | string[]): string {
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

export function generateExecutiveBrief(
  event: BusinessEvent,
  answers: BriefAnswers["answers"]
): ExecutiveBrief {
  const domains = event.technologyDomains.map(getDomainLabel);
  const answerSummary = Object.entries(answers)
    .map(([key, value]) => {
      const question = event.questions.find((q) => q.id === key);
      return question
        ? `${question.question} ${formatAnswer(value)}`
        : null;
    })
    .filter(Boolean)
    .join(". ");

  const situation = `Your organization is navigating ${event.title.toLowerCase()}. ${answerSummary ? `Based on your context: ${answerSummary}.` : ""} This business change creates technology implications that extend beyond a single system or vendor decision.`;

  const implications = [
    `Operational models designed for a previous state may not scale to your current reality.`,
    `Technology decisions made in isolation can create compounding costs across ${domains.slice(0, 2).join(" and ")}.`,
    `Leadership visibility into technology risk and investment trade-offs becomes critical at this stage.`,
    `Multi-location coordination adds complexity that single-site playbooks rarely address.`,
  ];

  const priorities = event.technologyDomains.slice(0, 3).map((domain, i) => ({
    title: `Assess ${getDomainLabel(domain)} readiness`,
    description:
      i === 0
        ? `Evaluate current capabilities against the demands of ${event.title.toLowerCase()}. Identify gaps before they become operational constraints.`
        : i === 1
          ? `Map dependencies between systems and locations. Understand where standardization creates leverage versus where local flexibility is required.`
          : `Establish governance for technology decisions tied to this business change. Ensure accountability spans IT, operations, and executive leadership.`,
  }));

  const nextSteps = [
    "Validate the technology implications identified in this brief with your leadership team.",
    "Prioritize the highest-risk gaps before committing to new investments.",
    "Schedule a Technology Strategy Session to develop a location-aware roadmap.",
  ];

  return {
    title: `Executive Brief: ${event.title}`,
    eventTitle: event.title,
    generatedAt: new Date().toISOString(),
    situation,
    implications,
    priorities,
    domains,
    nextSteps,
  };
}
