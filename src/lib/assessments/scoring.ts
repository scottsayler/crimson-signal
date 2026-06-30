import type {
  AssessmentAnswers,
  AssessmentDefinition,
  AssessmentInsight,
  AssessmentPriority,
  AssessmentResults,
  CategoryScore,
} from "./types";

function getCategoryLabel(definition: AssessmentDefinition, categoryId: string): string {
  return definition.categories.find((category) => category.id === categoryId)?.label ?? categoryId;
}

function getCategoryWeight(definition: AssessmentDefinition, categoryId: string): number {
  const category = definition.categories.find((item) => item.id === categoryId);
  return category?.weight ?? 1;
}

function getQuestionWeight(definition: AssessmentDefinition, questionId: string): number {
  const question = definition.questions.find((item) => item.id === questionId);
  if (!question) return 1;
  return (question.weight ?? 1) * getCategoryWeight(definition, question.category);
}

function getMaxChoiceScore(choices: { score: number }[]): number {
  return Math.max(...choices.map((choice) => choice.score));
}

function resolveResultProfile(
  definition: AssessmentDefinition,
  score: number
): { level: string; summary: string } {
  const profile =
    definition.resultProfiles.find((item) => score >= item.minScore) ??
    definition.resultProfiles[definition.resultProfiles.length - 1];

  return {
    level: profile?.level ?? "Unscored",
    summary: profile?.summary ?? "",
  };
}

function scoreCategory(
  definition: AssessmentDefinition,
  categoryId: string,
  answers: AssessmentAnswers
): CategoryScore {
  const category = definition.categories.find((item) => item.id === categoryId);
  const questions = definition.questions.filter((question) => question.category === categoryId);
  const categoryWeight = category?.weight ?? 1;

  let earned = 0;
  let possible = 0;
  let answered = 0;

  for (const question of questions) {
    const weight = (question.weight ?? 1) * categoryWeight;
    const maxChoice = getMaxChoiceScore(question.choices);
    possible += maxChoice * weight;

    const answer = answers[question.id];
    if (answer !== undefined) {
      answered += 1;
      earned += answer * weight;
    }
  }

  return {
    id: categoryId,
    label: category?.label ?? categoryId,
    score: possible > 0 ? Math.round((earned / possible) * 100) : 0,
    answered,
    total: questions.length,
    weight: categoryWeight,
  };
}

function buildInsights(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
  mode: "strength" | "risk"
): AssessmentInsight[] {
  const count =
    mode === "strength"
      ? definition.insights.strengthsCount
      : definition.insights.risksCount;

  const insights = definition.questions.flatMap((question) => {
    const answer = answers[question.id];
    if (answer === undefined) return [];

    const maxScore = getMaxChoiceScore(question.choices);
    const normalized = Math.round((answer / maxScore) * 100);

    return [
      {
        label: question.prompt,
        score: normalized,
        category: getCategoryLabel(definition, question.category),
      },
    ];
  });

  insights.sort((a, b) => (mode === "strength" ? b.score - a.score : a.score - b.score));

  return insights.slice(0, count);
}

function formatRecommendationReason(
  template: string,
  values: { category: string; score: number; description: string }
): string {
  return template
    .replaceAll("{category}", values.category)
    .replaceAll("{score}", String(values.score))
    .replaceAll("{description}", values.description);
}

function buildPriorities(
  definition: AssessmentDefinition,
  categoryScores: CategoryScore[],
  answers: AssessmentAnswers
): AssessmentPriority[] {
  const { recommendations, relatedContent } = definition;
  const sortedCategories = [...categoryScores].sort((a, b) => a.score - b.score);
  const priorities: AssessmentPriority[] = [];
  const seen = new Set<string>();

  for (const category of sortedCategories) {
    if (recommendations.requireCategoryComplete && category.answered < category.total) {
      continue;
    }

    const contentIds = recommendations.byCategory[category.id] ?? [];

    for (const contentId of contentIds) {
      if (seen.has(contentId)) continue;

      const content = relatedContent[contentId];
      if (!content) continue;

      seen.add(contentId);
      priorities.push({
        title: content.title,
        href: content.href,
        reason: formatRecommendationReason(recommendations.reasonTemplate, {
          category: category.label.toLowerCase(),
          score: category.score,
          description: content.description,
        }),
      });

      if (priorities.length >= recommendations.maxResults) {
        return priorities;
      }
    }
  }

  if (priorities.length === 0 && Object.keys(answers).length > 0 && recommendations.fallback) {
    const fallback = relatedContent[recommendations.fallback];
    if (fallback) {
      priorities.push({
        title: fallback.title,
        href: fallback.href,
        reason: fallback.description,
      });
    }
  }

  return priorities;
}

export function calculateAssessmentResults(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers
): AssessmentResults {
  const answeredCount = Object.keys(answers).length;
  let earned = 0;
  let possible = 0;

  for (const question of definition.questions) {
    const weight = getQuestionWeight(definition, question.id);
    const maxChoice = getMaxChoiceScore(question.choices);
    possible += maxChoice * weight;

    const answer = answers[question.id];
    if (answer !== undefined) {
      earned += answer * weight;
    }
  }

  const overallScore = answeredCount === 0 ? 0 : Math.round((earned / possible) * 100);
  const maturity = resolveResultProfile(definition, overallScore);
  const categoryScores = definition.categories.map((category) =>
    scoreCategory(definition, category.id, answers)
  );

  return {
    overallScore,
    maturityLevel: maturity.level,
    maturitySummary: maturity.summary,
    categoryScores,
    strengths: buildInsights(definition, answers, "strength"),
    risks: buildInsights(definition, answers, "risk"),
    priorities: buildPriorities(definition, categoryScores, answers),
    answeredCount,
    totalQuestions: definition.questions.length,
  };
}
