/**
 * Run: npx tsx scripts/test-network-assessment.ts
 */
import assert from "node:assert/strict";
import { calculateAssessmentResults } from "../src/lib/assessments/scoring";
import { readAllAssessmentsFromDisk } from "../src/lib/assessments/reader";
import type { AssessmentQuestion, AssessmentResultProfile } from "../src/lib/assessments/types";

const EXPECTED_CATEGORY_IDS = [
  "connectivity-reliability",
  "backup-resilience",
  "network-visibility",
  "standardization",
  "security",
  "store-operations",
  "documentation",
  "vendor-management",
  "growth-readiness",
] as const;

const EXPECTED_RESULT_PROFILES = [
  { minScore: 0, level: "Reactive", maxScore: 30 },
  { minScore: 31, level: "Foundational", maxScore: 50 },
  { minScore: 51, level: "Operational", maxScore: 70 },
  { minScore: 71, level: "Standardized", maxScore: 85 },
  { minScore: 86, level: "Optimized", maxScore: 100 },
] as const;

const definition = readAllAssessmentsFromDisk().find((item) => item.id === "network-assessment");
assert.ok(definition, "network-assessment definition should load from YAML");

assert.equal(definition.questions.length, 27, "expected 27 questions");
assert.equal(definition.categories.length, 9, "expected 9 categories");

for (const categoryId of EXPECTED_CATEGORY_IDS) {
  const category = definition.categories.find((item) => item.id === categoryId);
  assert.ok(category, `expected category "${categoryId}"`);

  const categoryQuestions: AssessmentQuestion[] = definition.questions.filter(
    (question) => question.category === categoryId
  );
  assert.equal(
    categoryQuestions.length,
    3,
    `category "${categoryId}" should have 3 questions`
  );
}

for (const question of definition.questions) {
  assert.equal(question.choices.length, 5, `${question.id} should have 5 choices`);

  const scores = question.choices.map((choice) => choice.score).sort((a, b) => a - b);
  assert.deepEqual(scores, [0, 1, 2, 3, 4], `${question.id} should use scores 0 through 4`);
}

for (const profile of EXPECTED_RESULT_PROFILES) {
  const match: AssessmentResultProfile | undefined = definition.resultProfiles.find(
    (item) => item.level === profile.level
  );
  assert.ok(match, `expected result profile "${profile.level}"`);
  assert.equal(match.minScore, profile.minScore, `${profile.level} minScore should match YAML`);
}

const empty = calculateAssessmentResults(definition, {});
assert.equal(empty.overallScore, 0);
assert.equal(empty.answeredCount, 0);

const allMin: Record<string, number> = {};
const allMax: Record<string, number> = {};

for (const question of definition.questions) {
  allMin[question.id] = 0;
  allMax[question.id] = 4;
}

const minResults = calculateAssessmentResults(definition, allMin);
const maxResults = calculateAssessmentResults(definition, allMax);

assert.equal(minResults.overallScore, 0, "lowest answers should score 0/100");
assert.equal(maxResults.overallScore, 100, "highest answers should score 100/100");
assert.equal(minResults.maturityLevel, "Reactive");
assert.equal(maxResults.maturityLevel, "Optimized");
assert.equal(minResults.categoryScores.length, 9);
assert.equal(minResults.risks.length, 3);
assert.equal(maxResults.strengths.length, 3);

for (const categoryScore of minResults.categoryScores) {
  assert.equal(categoryScore.score, 0, `${categoryScore.id} should score 0 at minimum answers`);
  assert.equal(categoryScore.total, 3, `${categoryScore.id} should have 3 questions`);
}

for (const categoryScore of maxResults.categoryScores) {
  assert.equal(categoryScore.score, 100, `${categoryScore.id} should score 100 at maximum answers`);
}

const foundationalAnswers: Record<string, number> = {};
for (const question of definition.questions) {
  foundationalAnswers[question.id] = 2;
}

const foundationalResults = calculateAssessmentResults(definition, foundationalAnswers);
assert.equal(foundationalResults.overallScore, 50, "uniform score 2 answers should score 50/100");
assert.equal(foundationalResults.maturityLevel, "Foundational");

const operationalAnswers: Record<string, number> = {};
definition.questions.forEach((question, index) => {
  operationalAnswers[question.id] = index % 2 === 0 ? 2 : 3;
});

const operationalResults = calculateAssessmentResults(definition, operationalAnswers);
assert.ok(
  operationalResults.overallScore >= 51 && operationalResults.overallScore <= 70,
  `midrange answers should land in Operational band, got ${operationalResults.overallScore}`
);
assert.equal(operationalResults.maturityLevel, "Operational");

assert.ok(minResults.priorities.length > 0, "priorities should be suggested for low scores");
assert.ok(
  minResults.priorities.length <= definition.recommendations.maxResults,
  "priorities should respect maxResults"
);

const relatedHrefs = new Set(
  Object.values(definition.relatedContent).map((content) => content.href)
);

for (const priority of minResults.priorities) {
  assert.ok(
    relatedHrefs.has(priority.href),
    `priority href should map to related content: ${priority.href}`
  );
  assert.ok(priority.reason.length > 0, "priority reason should be populated");
}

const priorityHrefs = minResults.priorities.map((priority) => priority.href);
assert.ok(
  priorityHrefs.includes("/industries/restaurants/networking"),
  "low scores should recommend Restaurant Networking"
);
assert.ok(
  priorityHrefs.includes("/industries/restaurants/best-internet"),
  "low scores should recommend Best Internet for Restaurants"
);
assert.ok(
  priorityHrefs.includes("/tools/downtime-cost-calculator"),
  "low scores should recommend Downtime Cost Calculator"
);

console.log("All network assessment scenarios passed.");
