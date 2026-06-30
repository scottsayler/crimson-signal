import type {
  AssessmentDefinition,
  AssessmentRelatedContent,
  RawAssessmentYaml,
} from "./types";

export function normalizeAssessment(raw: RawAssessmentYaml): AssessmentDefinition {
  const toolSlug = raw.toolSlug ?? raw.id;
  const choiceSets = raw.choiceSets ?? {};

  const relatedContent = Object.fromEntries(
    Object.entries(raw.relatedContent).map(([id, content]) => [
      id,
      { id, ...content } satisfies AssessmentRelatedContent,
    ])
  );

  const categoryMap = new Map(raw.categories.map((category) => [category.id, category]));

  const questions = raw.questions.map((question) => {
    const category = categoryMap.get(question.category);
    if (!category) {
      throw new Error(
        `Assessment "${raw.id}": question "${question.id}" references unknown category "${question.category}"`
      );
    }

    let choices = question.choices;
    if (!choices && question.choiceSet) {
      choices = choiceSets[question.choiceSet];
      if (!choices) {
        throw new Error(
          `Assessment "${raw.id}": question "${question.id}" references unknown choiceSet "${question.choiceSet}"`
        );
      }
    }

    if (!choices || choices.length === 0) {
      throw new Error(`Assessment "${raw.id}": question "${question.id}" has no choices`);
    }

    return {
      id: question.id,
      category: question.category,
      prompt: question.prompt,
      choices,
      weight: question.weight,
    };
  });

  for (const [categoryId, contentIds] of Object.entries(raw.recommendations.byCategory)) {
    if (!categoryMap.has(categoryId)) {
      throw new Error(
        `Assessment "${raw.id}": recommendation rule references unknown category "${categoryId}"`
      );
    }

    for (const contentId of contentIds) {
      if (!relatedContent[contentId]) {
        throw new Error(
          `Assessment "${raw.id}": recommendation references unknown related content "${contentId}"`
        );
      }
    }
  }

  if (raw.recommendations.fallback && !relatedContent[raw.recommendations.fallback]) {
    throw new Error(
      `Assessment "${raw.id}": fallback recommendation references unknown content "${raw.recommendations.fallback}"`
    );
  }

  const resultProfiles = [...raw.resultProfiles].sort((a, b) => b.minScore - a.minScore);

  return {
    id: raw.id,
    toolSlug,
    title: raw.title,
    scoreLabel: raw.scoreLabel,
    resultsDisclaimer: raw.resultsDisclaimer,
    categories: raw.categories,
    questions,
    relatedContent,
    resultProfiles,
    recommendations: {
      maxResults: raw.recommendations.maxResults,
      requireCategoryComplete: raw.recommendations.requireCategoryComplete ?? true,
      reasonTemplate: raw.recommendations.reasonTemplate,
      fallback: raw.recommendations.fallback,
      byCategory: raw.recommendations.byCategory,
    },
    insights: {
      strengthsCount: raw.insights?.strengthsCount ?? 3,
      risksCount: raw.insights?.risksCount ?? 3,
    },
  };
}
