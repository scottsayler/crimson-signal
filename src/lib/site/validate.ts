import type { DecisionGuide, SitePage, SiteSection } from "./types";
import { getSitePageUrl } from "./types";
import {
  isPlaceholderText,
  quickAnswerWordCount,
  type DecisionGuideSource,
} from "./decision-guide";
import {
  FAQ_MIN_COUNT,
  FORBIDDEN_PHRASES,
  LINK_QUOTAS,
  QUICK_ANSWER_MAX_WORDS,
  QUICK_ANSWER_MIN_WORDS,
  RECOMMENDED_METADATA_FIELDS,
  REQUIRED_METADATA_FIELDS,
  requiresDecisionGuide,
} from "./standards";
import { resolveRelatedContentFromPaths } from "./knowledge-graph";

export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  code: string;
  message: string;
  severity: ValidationSeverity;
  field?: string;
}

export interface PageQualityReport {
  pageKey: string;
  title: string;
  publish: boolean;
  readyToPublish: boolean;
  issueCount: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

type CachedPage = SitePage & {
  section: SiteSection;
  decisionGuideSource?: DecisionGuideSource;
};

function collectGuideText(guide?: DecisionGuide): string {
  if (!guide) return "";

  return [
    guide.quickAnswer,
    guide.whyYoureHere,
    guide.whatProblemSolves,
    guide.realityCheck,
    guide.worthKnowing,
    guide.bottomLine,
    guide.crimsonSignalPerspective,
    ...(guide.evidenceBehindGuide?.researchInputs ?? []),
    ...(guide.evidenceBehindGuide?.recurringPatterns ?? []),
    guide.evidenceBehindGuide?.methodology,
    ...(guide.shouldConsider.evaluateIf ?? []),
    ...(guide.shouldConsider.probablyNotIf ?? []),
    ...(guide.questionsToAsk ?? []),
    ...(guide.askBeforeYouBuy ?? []),
    ...(guide.faqs?.map((f) => `${f.question} ${f.answer}`) ?? []),
    ...(guide.alternatives.map((a) =>
      typeof a === "string" ? a : `${a.title} ${a.description}`
    ) ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function collectPageMetaText(page: SitePage): string {
  return [page.title, page.description, page.primaryKeyword, ...page.secondaryKeywords]
    .filter(Boolean)
    .join(" ");
}

function checkForbiddenLanguage(
  page: SitePage,
  guide?: DecisionGuide,
  decisionGuideSource?: DecisionGuideSource
): ValidationIssue[] {
  const guideText = collectGuideText(guide);
  const metaText = collectPageMetaText(page);
  const issues: ValidationIssue[] = [];
  const skipGuideStyleRules = decisionGuideSource === "cluster";

  for (const phrase of FORBIDDEN_PHRASES) {
    if (!skipGuideStyleRules && guideText.toLowerCase().includes(phrase)) {
      issues.push({
        code: "forbidden-phrase",
        message: `Decision Guide contains forbidden phrase: "${phrase}"`,
        severity: "error",
        field: "decisionGuide",
      });
    } else if (metaText.toLowerCase().includes(phrase)) {
      issues.push({
        code: "forbidden-phrase-meta",
        message: `Metadata contains forbidden phrase: "${phrase}"`,
        severity: "warning",
        field: "description",
      });
    }
  }

  if (!skipGuideStyleRules && guideText.includes("—")) {
    issues.push({
      code: "em-dash",
      message: "Decision Guide contains em dash. Use a period or comma instead.",
      severity: "error",
      field: "decisionGuide",
    });
  }

  if (metaText.includes("—")) {
    issues.push({
      code: "em-dash-meta",
      message: "Metadata contains em dash. Update description when editing the page.",
      severity: "warning",
      field: "description",
    });
  }

  return issues;
}

function checkMetadata(page: SitePage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const field of REQUIRED_METADATA_FIELDS) {
    const value = page[field as keyof SitePage];
    if (value === undefined || value === null || value === "") {
      issues.push({
        code: "missing-metadata",
        message: `Missing required metadata: ${field}`,
        severity: "error",
        field,
      });
    }
  }

  for (const field of RECOMMENDED_METADATA_FIELDS) {
    if (
      field === "technology" &&
      page.presentationMode === "cornerstone"
    ) {
      continue;
    }

    const value = page[field as keyof SitePage];
    if (value === undefined || value === null || value === "") {
      issues.push({
        code: "missing-recommended-metadata",
        message: `Missing recommended metadata: ${field}`,
        severity: "warning",
        field,
      });
    }
  }

  if (!page.searchIntent) {
    issues.push({
      code: "missing-search-intent",
      message: "searchIntent is not set",
      severity: "warning",
      field: "searchIntent",
    });
  }

  return issues;
}

function checkDecisionGuide(
  guide: DecisionGuide | undefined,
  source: DecisionGuideSource | undefined
): ValidationIssue[] {
  if (!guide) {
    return [
      {
        code: "missing-decision-guide",
        message: "Decision Guide content is required for this content type",
        severity: "error",
        field: "decisionGuide",
      },
    ];
  }

  const issues: ValidationIssue[] = [];
  const words = quickAnswerWordCount(guide);

  if (words < QUICK_ANSWER_MIN_WORDS || words > QUICK_ANSWER_MAX_WORDS) {
    issues.push({
      code: "quick-answer-length",
      message: `Quick Answer is ${words} words. Target ${QUICK_ANSWER_MIN_WORDS} to ${QUICK_ANSWER_MAX_WORDS}.`,
      severity: source === "explicit" ? "warning" : "warning",
      field: "decisionGuide.quickAnswer",
    });
  }

  if (source !== "explicit") {
    issues.push({
      code: "scaffolded-guide",
      message: `Decision Guide is ${source ?? "scaffolded"}. Author a complete decisionGuide in YAML.`,
      severity: "warning",
      field: "decisionGuide",
    });
  }

  const placeholderChecks: { field: string; value: string | undefined }[] = [
    { field: "worthKnowing", value: guide.worthKnowing },
    { field: "realityCheck", value: guide.realityCheck },
    { field: "bottomLine", value: guide.bottomLine },
  ];

  for (const check of placeholderChecks) {
    if (check.value && isPlaceholderText(check.value)) {
      issues.push({
        code: "placeholder-content",
        message: `${check.field} still uses placeholder content`,
        severity: "warning",
        field: check.field,
      });
    }
  }

  if (guide.shouldConsider.probablyNotIf.some(isPlaceholderText)) {
    issues.push({
      code: "placeholder-probably-not",
      message: "Should You Consider It? needs real 'probably not if' criteria",
      severity: "warning",
      field: "decisionGuide.shouldConsider.probablyNotIf",
    });
  }

  if ((guide.faqs?.length ?? 0) < FAQ_MIN_COUNT) {
    issues.push({
      code: "faq-count",
      message: `Include ${FAQ_MIN_COUNT} to 8 FAQs. Found ${guide.faqs?.length ?? 0}.`,
      severity: "warning",
      field: "decisionGuide.faqs",
    });
  }

  if (guide.faqs?.some((f) => isPlaceholderText(f.answer))) {
    issues.push({
      code: "placeholder-faq",
      message: "One or more FAQ answers use placeholder content",
      severity: "warning",
      field: "decisionGuide.faqs",
    });
  }

  if (guide.decisionMatrix?.some((r) => isPlaceholderText(r.recommendation))) {
    issues.push({
      code: "placeholder-matrix",
      message: "Decision Matrix contains placeholder rows",
      severity: "warning",
      field: "decisionGuide.decisionMatrix",
    });
  }

  return issues;
}

function checkKnowledgeGraph(
  page: CachedPage,
  resolvePath: (path: string) => CachedPage | null,
  toRelatedItem: (page: CachedPage) => { href: string }
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const related = resolveRelatedContentFromPaths(
    page.relatedEntities ?? [],
    resolvePath,
    (p) => ({
      href: getSitePageUrl(p),
      title: p.title,
      description: p.description,
      contentType: p.contentType,
      section: p.section,
      readingTime: p.readingTime,
    })
  );

  for (const [category, minimum] of Object.entries(LINK_QUOTAS)) {
    const count = related[category as keyof typeof related].length;
    if (count < minimum) {
      issues.push({
        code: "link-quota",
        message: `Knowledge graph requires ${minimum} ${category} link(s). Found ${count}.`,
        severity: "warning",
        field: "relatedEntities",
      });
    }
  }

  const hasEntityLink =
    !!page.industry ||
    !!page.technology ||
    !!(page.businessProblem ?? page.problem);

  if (!hasEntityLink) {
    issues.push({
      code: "missing-entity",
      message: "Page should declare at least one of industry, technology, or businessProblem",
      severity: "warning",
      field: "entity",
    });
  }

  return issues;
}

export function validatePage(
  page: CachedPage,
  resolvePath: (path: string) => CachedPage | null,
  toRelatedItem: (page: CachedPage) => { href: string }
): PageQualityReport {
  const pageKey = page.parentIndustry
    ? `industries/${page.parentIndustry}/${page.slug}`
    : `${page.section}/${page.slug}`;

  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const push = (issues: ValidationIssue[]) => {
    for (const issue of issues) {
      if (issue.severity === "error") errors.push(issue);
      else warnings.push(issue);
    }
  };

  push(checkMetadata(page));
  push(checkForbiddenLanguage(page, page.decisionGuide, page.decisionGuideSource));

  if (requiresDecisionGuide(page.contentType)) {
    push(checkDecisionGuide(page.decisionGuide, page.decisionGuideSource));
  }

  push(checkKnowledgeGraph(page, resolvePath, toRelatedItem));

  if (!page.cta) {
    warnings.push({
      code: "missing-cta",
      message: "No CTA defined. Add cta with label and href.",
      severity: "warning",
      field: "cta",
    });
  }

  const publish = page.publish ?? false;
  const readyToPublish = publish && errors.length === 0;

  return {
    pageKey,
    title: page.title,
    publish,
    readyToPublish,
    issueCount: errors.length + warnings.length,
    errors,
    warnings,
  };
}

export function validateAllPages(
  pages: CachedPage[],
  resolvePath: (path: string) => CachedPage | null,
  toRelatedItem: (page: CachedPage) => { href: string }
): PageQualityReport[] {
  return pages.map((page) => validatePage(page, resolvePath, toRelatedItem));
}

export function formatQualityReport(report: PageQualityReport): string {
  const lines = [`[${report.pageKey}] ${report.title}`];

  for (const issue of [...report.errors, ...report.warnings]) {
    lines.push(`  ${issue.severity.toUpperCase()} ${issue.code}: ${issue.message}`);
  }

  return lines.join("\n");
}
