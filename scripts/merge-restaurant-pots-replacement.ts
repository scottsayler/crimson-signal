/**
 * One-time merge helper: maps restaurant-pots-replacement-production.yaml
 * to content/site/problems/{slug}.yaml. Run: npx tsx scripts/merge-restaurant-pots-replacement.ts
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

const ROOT = path.join(import.meta.dirname, "..");
const SOURCE = path.join(
  ROOT,
  "content/site/drafts/restaurant-pots-replacement-production.yaml"
);
const PROBLEMS_DIR = path.join(ROOT, "content/site/problems");

type Prod = Record<string, unknown>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function block(text: string): string {
  return text.replace(/\n+$/, "");
}

function bulletLines(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function loadProduction(): Prod {
  return yaml.parse(fs.readFileSync(SOURCE, "utf8")) as Prod;
}

function buildEntry(prod: Prod) {
  const metadata = asRecord(prod.metadata);
  const seo = asRecord(prod.seo);
  const quickAnswer = asRecord(prod.quickAnswer);
  const shouldYouConsiderIt = asRecord(prod.shouldYouConsiderIt);
  const whyYoureHere = asRecord(prod.whyYoureHere);
  const whatProblemDoesItSolve = asRecord(prod.whatProblemDoesItSolve);
  const framework = asRecord(prod.proprietaryFramework);
  const realityCheck = asRecord(prod.realityCheck);
  const crimsonSignalPerspective = asRecord(prod.crimsonSignalPerspective);
  const industrySnapshot = asRecord(prod.industrySnapshot);
  const evidence = asRecord(prod.evidence);
  const researchSummary = asRecord(prod.researchSummary);
  const questionsByRole = asRecord(prod.questionsToAsk);

  const quickAnswerBullets = asArray<string>(quickAnswer.bullets);
  const quickAnswerText = block(
    [
      asString(quickAnswer.question),
      "",
      asString(quickAnswer.answer),
      quickAnswerBullets.length > 0 ? "" : "",
      ...quickAnswerBullets.map((b) => `- ${b}`),
    ]
      .filter((line, index, arr) => !(line === "" && index === arr.length - 1 && arr[index - 1] === ""))
      .join("\n")
  );

  const supportingPoints = asArray<string>(whyYoureHere.supportingPoints);
  const whyYoureHereText = block(
    [
      asString(whyYoureHere.headline),
      "",
      asString(whyYoureHere.body),
      supportingPoints.length > 0 ? "" : "",
      ...supportingPoints.map((p) => `- ${p}`),
    ]
      .filter(Boolean)
      .join("\n")
  );

  const problems = asArray<Record<string, unknown>>(whatProblemDoesItSolve.problems);
  const whatProblemSolvesText = block(
    [
      asString(whatProblemDoesItSolve.summary),
      problems.length > 0 ? "" : "",
      ...problems.map((p) => `- ${asString(p.name)}: ${asString(p.description)}`),
    ]
      .filter(Boolean)
      .join("\n")
  );

  const frameworkStages = asArray<Record<string, unknown>>(framework.stages);
  const frameworkBody = frameworkStages
    .map((stage, index) => {
      const questions = asArray<string>(stage.questions);
      const lines = [
        `${index + 1}. ${asString(stage.stage)}: ${asString(stage.focus)}`,
        ...questions.map((q) => `   - ${q}`),
      ];
      return lines.join("\n");
    })
    .join("\n\n");

  const commonCauses = asArray<Record<string, unknown>>(prod.commonCauses);
  const commonCausesBody = bulletLines(
    commonCauses.map((c) => `${asString(c.cause)}: ${asString(c.explanation)}`)
  );

  const operationalBenefits = asArray<Record<string, unknown>>(prod.operationalBenefits);
  const operationalBenefitsBody = bulletLines(
    operationalBenefits.map(
      (b) => `${asString(b.benefit)}: ${asString(b.description)}`
    )
  );

  const alternatives = asArray<Record<string, unknown>>(prod.alternatives).map((alt) => ({
    title: asString(alt.name),
    description: block(
      [`Best for: ${asString(alt.bestFor)}`, `Risks: ${asString(alt.risks)}`].join("\n\n")
    ),
  }));

  const questionsToAsk = Object.entries(questionsByRole).flatMap(([, value]) =>
    asArray<string>(value)
  );

  const buyingTriggerTimeline = asArray<Record<string, unknown>>(
    prod.buyingTriggerTimeline
  ).flatMap((window) => asArray<string>(window.events));

  const technologyStack = asArray<Record<string, unknown>>(prod.technologyStack).flatMap(
    (layer) => {
      const examples = asArray<string>(layer.examples);
      return [`${asString(layer.layer)}: ${examples.join(", ")}`];
    }
  );

  const worthKnowing = bulletLines(asArray<string>(prod.worthKnowing));

  const watchOuts = asArray<string>(realityCheck.watchOuts);
  const realityCheckText = block(
    [
      asString(realityCheck.title),
      "",
      asString(realityCheck.body),
      watchOuts.length > 0 ? "" : "",
      ...watchOuts.map((w) => `- ${w}`),
    ]
      .filter(Boolean)
      .join("\n")
  );

  const decisionMatrix = asArray<Record<string, unknown>>(prod.decisionMatrix).map(
    (row) => ({
      situation: `${asString(row.scenario)} (${asString(row.riskLevel)})`,
      recommendation: block(
        `${asString(row.likelyPath)}\n\n${asString(row.decisionNotes)}`
      ),
    })
  );

  const crimsonSignalPerspectiveText = block(
    [
      asString(crimsonSignalPerspective.title),
      "",
      asString(crimsonSignalPerspective.body),
      "",
      asString(crimsonSignalPerspective.position),
    ].join("\n")
  );

  const faqs = asArray<Record<string, unknown>>(prod.faqs).map((faq) => ({
    question: asString(faq.question),
    answer: asString(faq.answer),
  }));

  const evidencePoints = asArray<string>(evidence.points);
  const caseStudies = asArray<Record<string, unknown>>(evidence.publicCaseStudies);
  const evidenceItems = [
    ...evidencePoints.map((finding, index) => ({
      title: `Evidence ${index + 1}`,
      finding,
      whyItMatters: "",
      source: asString(researchSummary.source) || "Restaurant POTS Replacement.md",
    })),
    ...caseStudies.map((study) => ({
      title: asString(study.organization),
      finding: block(
        [
          `Problem: ${asString(study.problem)}`,
          `Solution: ${asString(study.solution)}`,
          `Outcome: ${asString(study.outcome)}`,
        ].join("\n\n")
      ),
      whyItMatters: asString(study.lesson),
      source: asString(researchSummary.source) || "Restaurant POTS Replacement.md",
    })),
  ];

  return {
    slug: "restaurant-pots-replacement",
    publish: true,
    title: asString(prod.title) || asString(metadata.title),
    description: asString(metadata.description),
    contentType: "problem",
    industry: "restaurants",
    businessProblem: "pots-replacement",
    persona: [
      "cio",
      "it-director",
      "operations",
      "security",
      "cfo",
      "franchise-leader",
      "executive-leadership",
    ],
    primaryKeyword: asString(seo.primaryKeyword),
    secondaryKeywords: asArray<string>(seo.secondaryKeywords),
    searchIntent: "decision-support",
    buyerStage: "awareness",
    readingTime: 8,
    order: 6,
    relatedGuides: [
      "/industries/restaurants/networking",
      "/industries/restaurants/managed-network",
      "/industries/restaurants/best-internet",
      "/industries/restaurants/pots-replacement",
    ],
    relatedProblems: [
      "/problems/restaurant-internet-outages",
      "/problems/restaurant-network-visibility",
      "/problems/restaurant-vendor-sprawl",
      "/problems/restaurant-technology-standardization",
    ],
    relatedTechnologies: [
      "/technologies/pots-replacement",
      "/technologies/sd-wan",
      "/technologies/managed-network",
      "/technologies/lte-5g-backup",
    ],
    relatedTools: ["/tools/pots-savings-calculator"],
    cta: {
      label: "Calculate POTS savings",
      href: "/tools/pots-savings-calculator",
    },
    sections: [
      {
        heading: asString(framework.name),
        body: block(frameworkBody),
      },
      {
        heading: "Common Causes",
        body: block(commonCausesBody),
      },
      {
        heading: "Operational Benefits",
        body: block(operationalBenefitsBody),
      },
    ],
    decisionGuide: {
      quickAnswer: quickAnswerText,
      shouldConsider: {
        evaluateIf: asArray<string>(shouldYouConsiderIt.signals),
        probablyNotIf: [],
      },
      whyYoureHere: whyYoureHereText,
      whatProblemSolves: whatProblemSolvesText,
      alternatives,
      questionsToAsk,
      buyingTriggerTimeline,
      industrySnapshot: {
        topChallenges: asArray<string>(industrySnapshot.impacts),
        typicalEnvironment: asString(industrySnapshot.summary),
        commonPriorities: [],
        buyingTriggers: [],
      },
      technologyStack,
      realityCheck: realityCheckText,
      worthKnowing,
      decisionMatrix,
      askBeforeYouBuy: asArray<string>(prod.askBeforeYouBuy),
      crimsonSignalPerspective: crimsonSignalPerspectiveText,
      faqs,
      evidence: evidenceItems,
      evidenceBehindGuide: {
        researchInputs: asArray<string>(researchSummary.majorThemes),
        recurringPatterns: [],
        methodology: asString(researchSummary.summary),
      },
    },
  };
}

function writeEntry(entry: Record<string, unknown>) {
  const slug = asString(entry.slug);
  if (!slug) {
    throw new Error("Entry is missing slug");
  }

  const target = path.join(PROBLEMS_DIR, `${slug}.yaml`);
  if (fs.existsSync(target)) {
    throw new Error(`Duplicate slug: ${slug}`);
  }

  fs.mkdirSync(PROBLEMS_DIR, { recursive: true });
  fs.writeFileSync(target, yaml.stringify(entry, { lineWidth: 0 }));
}

const prod = loadProduction();
const entry = buildEntry(prod);
writeEntry(entry);
console.log(`Merged restaurant-pots-replacement into content/site/problems/${entry.slug}.yaml`);
