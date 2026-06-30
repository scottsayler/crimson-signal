import type { DecisionGuide, SitePage } from "./types";
import { EMPTY_SECTION_MESSAGE } from "./standards";

export type DecisionGuideSource = "explicit" | "cluster" | "scaffold";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function deriveBottomLine(guide: DecisionGuide, page: SitePage): string {
  if (guide.bottomLine?.trim()) return guide.bottomLine.trim();

  const evaluate = guide.shouldConsider.evaluateIf[0];
  const avoid = guide.shouldConsider.probablyNotIf[0];

  if (evaluate && avoid) {
    return `Evaluate ${page.title.toLowerCase()} if ${evaluate.charAt(0).toLowerCase()}${evaluate.slice(1)}. It is probably not the right focus if ${avoid.charAt(0).toLowerCase()}${avoid.slice(1)}.`;
  }

  if (evaluate) {
    return `${page.title} is worth your time when ${evaluate.charAt(0).toLowerCase()}${evaluate.slice(1)}.`;
  }

  return `Use this guide to decide whether ${page.title.toLowerCase()} deserves further evaluation based on your location count, outage history, and IT capacity.`;
}

/**
 * Ensures every Decision Guide exposes all Editorial System components.
 * Missing author content receives neutral placeholders so templates never skip sections.
 */
export function completeDecisionGuide(
  guide: DecisionGuide,
  page: SitePage
): DecisionGuide {
  const askBeforeYouBuy =
    guide.askBeforeYouBuy && guide.askBeforeYouBuy.length > 0
      ? guide.askBeforeYouBuy
      : guide.questionsToAsk.length > 0
        ? guide.questionsToAsk
        : [EMPTY_SECTION_MESSAGE];

  const worthKnowing = guide.worthKnowing?.trim() || EMPTY_SECTION_MESSAGE;

  const decisionMatrix =
    guide.decisionMatrix && guide.decisionMatrix.length > 0
      ? guide.decisionMatrix
      : [
          {
            situation: "Early research",
            recommendation: EMPTY_SECTION_MESSAGE,
          },
        ];

  const faqs =
    guide.faqs && guide.faqs.length > 0
      ? guide.faqs
      : [
          {
            question: `What question does this page help me answer about ${page.title}?`,
            answer: EMPTY_SECTION_MESSAGE,
          },
        ];

  const alternatives =
    guide.alternatives.length > 0 ? guide.alternatives : [EMPTY_SECTION_MESSAGE];

  const questionsToAsk =
    guide.questionsToAsk.length > 0
      ? guide.questionsToAsk
      : [EMPTY_SECTION_MESSAGE];

  const probablyNotIf =
    guide.shouldConsider.probablyNotIf.length > 0
      ? guide.shouldConsider.probablyNotIf
      : [EMPTY_SECTION_MESSAGE];

  const completed: DecisionGuide = {
    ...guide,
    shouldConsider: {
      evaluateIf:
        guide.shouldConsider.evaluateIf.length > 0
          ? guide.shouldConsider.evaluateIf
          : [EMPTY_SECTION_MESSAGE],
      probablyNotIf,
    },
    alternatives,
    questionsToAsk,
    worthKnowing,
    askBeforeYouBuy,
    decisionMatrix,
    faqs,
    bottomLine: deriveBottomLine({ ...guide, bottomLine: guide.bottomLine }, page),
  };

  return completed;
}

export function scaffoldDecisionGuide(page: SitePage): DecisionGuide {
  const sectionBody = (page.sections ?? []).map((s) => s.body).join("\n\n");

  return {
    quickAnswer: page.description,
    whyYoureHere: sectionBody || EMPTY_SECTION_MESSAGE,
    shouldConsider: {
      evaluateIf: [EMPTY_SECTION_MESSAGE],
      probablyNotIf: [EMPTY_SECTION_MESSAGE],
    },
    whatProblemSolves: sectionBody || page.description,
    realityCheck: EMPTY_SECTION_MESSAGE,
    alternatives: [],
    questionsToAsk: [],
  };
}

export function isPlaceholderText(text: string): boolean {
  return text.trim() === EMPTY_SECTION_MESSAGE;
}

export function quickAnswerWordCount(guide: DecisionGuide): number {
  return wordCount(guide.quickAnswer);
}
