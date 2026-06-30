#!/usr/bin/env npx tsx
/**
 * Generate a new Crimson Signal page from canonical YAML templates.
 *
 * Usage:
 *   npm run new:page -- industry-topic --slug managed-it --title "Restaurant Managed Network" --industry restaurants
 *   npm run new:page -- problem --slug internet-outages --title "Internet Outages"
 *   npm run new:page -- technology --slug sd-wan --title "SD-WAN"
 *   npm run new:page -- tool --slug downtime-cost-calculator --title "Downtime Cost Calculator"
 *   npm run new:page -- comparison --slug sd-wan-vs-mpls --title "SD-WAN vs MPLS"
 *   npm run new:page -- research-report --slug my-report --title "My Report"
 */
import fs from "fs";
import path from "path";

const CONTENT_TYPES = {
  "industry-topic": {
    template: "industry-topic.yaml",
    target: (opts: { industry?: string }) =>
      `content/site/industries/${opts.industry ?? "{industry}"}.yaml`,
    url: (opts: { industry?: string; slug?: string }) =>
      `/industries/${opts.industry ?? "{industry}"}/${opts.slug ?? "{slug}"}`,
  },
  technology: {
    template: "technology.yaml",
    target: () => "content/site/technologies.yaml",
    url: (opts: { slug?: string }) => `/technologies/${opts.slug ?? "{slug}"}`,
  },
  problem: {
    template: "problem.yaml",
    target: () => "content/site/problems.yaml",
    url: (opts: { slug?: string }) => `/problems/${opts.slug ?? "{slug}"}`,
  },
  tool: {
    template: "tool.yaml",
    target: () => "content/site/tools.yaml",
    url: (opts: { slug?: string }) => `/tools/${opts.slug ?? "{slug}"}`,
  },
  comparison: {
    template: "comparison.yaml",
    target: () => "content/site/comparisons.yaml",
    url: (opts: { slug?: string }) => `/comparisons/${opts.slug ?? "{slug}"}`,
  },
  "research-report": {
    template: "research-report.yaml",
    target: () => "content/site/research.yaml",
    url: (opts: { slug?: string }) => `/research/${opts.slug ?? "{slug}"}`,
  },
} as const;

type ContentType = keyof typeof CONTENT_TYPES;

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string> = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--") continue;
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for --${key}`);
      }
      flags[key] = value;
      i++;
    } else {
      positional.push(arg);
    }
  }

  const contentType = positional[0] as ContentType | undefined;
  return { contentType, flags, positional };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fillTemplate(
  template: string,
  values: Record<string, string>
): string {
  let output = template;
  for (const [key, value] of Object.entries(values)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  return output;
}

function main() {
  const { contentType, flags } = parseArgs(process.argv.slice(2));

  if (!contentType || !(contentType in CONTENT_TYPES)) {
    console.error(`Usage: npm run new:page -- <type> --slug <slug> --title <title> [options]

Types:
  industry-topic   (requires --industry)
  technology
  problem
  tool
  comparison
  research-report

Options:
  --slug <slug>
  --title <title>
  --description <text>   (optional)
  --industry <slug>      (required for industry-topic)
  --keyword <text>       (optional, defaults from title)
`);
    process.exit(1);
  }

  const slug = flags.slug ?? slugify(flags.title ?? "");
  const title = flags.title;

  if (!slug) {
    console.error("Error: provide --slug or --title");
    process.exit(1);
  }
  if (!title) {
    console.error("Error: provide --title");
    process.exit(1);
  }

  if (contentType === "industry-topic" && !flags.industry) {
    console.error("Error: industry-topic requires --industry (e.g. restaurants)");
    process.exit(1);
  }

  const config = CONTENT_TYPES[contentType];
  const templatePath = path.join(
    process.cwd(),
    "content/site/templates",
    config.template
  );

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  const description =
    flags.description ??
    `Independent decision support for ${title.toLowerCase()}. Replace this with a specific meta description.`;

  const values: Record<string, string> = {
    slug,
    title,
    description,
    industry: flags.industry ?? "",
    technology: flags.technology ?? slug,
    businessProblem: flags.problem ?? slug,
    primaryKeyword: flags.keyword ?? slug.replace(/-/g, " "),
  };

  const pageBlock = fillTemplate(template, values);
  const targetFile = config.target({ industry: flags.industry });
  const url = config.url({ industry: flags.industry, slug });

  const draftsDir = path.join(process.cwd(), "content/site/drafts");
  fs.mkdirSync(draftsDir, { recursive: true });

  const draftFilename = `${slug}.yaml`;
  const draftPath = path.join(draftsDir, draftFilename);

  const draftContents = `# =============================================================================
# GENERATED PAGE DRAFT — ${title}
# =============================================================================
#
# Content type: ${contentType}
# Target file:  ${targetFile}
# Live URL:     ${url}
#
# NEXT STEPS:
#   1. Edit the page block below. Replace placeholder prose.
#   2. Copy the page block (from the first "- slug:" through the end) into:
#      ${targetFile}
#   3. Run: npm run validate:content
#   4. Set publish: true when validation passes
#   5. Delete this draft file after merging
#
# Docs: /docs/PAGE_AUTHORING.md
# =============================================================================

${pageBlock}`;

  fs.writeFileSync(draftPath, draftContents, "utf-8");

  console.log(`Created draft: ${draftPath}`);
  console.log(`Merge into:    ${targetFile}`);
  console.log(`URL:           ${url}`);
  console.log("");
  console.log("See /docs/PAGE_AUTHORING.md for the full publishing workflow.");
}

main();
