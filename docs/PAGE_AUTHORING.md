# Crimson Signal Page Authoring

This document is the official guide for creating new pages. The rendering system reads YAML from `content/site/`. Templates in `content/site/templates/` are the canonical starting point.

## Quick start

```bash
# Generate a draft from the canonical template
npm run new:page -- industry-topic \
  --slug my-topic \
  --title "My Topic" \
  --industry restaurants

# Edit the draft in content/site/drafts/
# Merge the page block into the target YAML file
# Validate before publishing
npm run validate:content
```

## Which YAML file to edit

| Content type | `contentType` value | Edit this file | URL pattern |
|--------------|---------------------|----------------|-------------|
| Industry Topic | `industry-topic` | `content/site/industries/{industry}.yaml` | `/industries/{industry}/{slug}` |
| Technology Guide | `technology` | `content/site/technologies.yaml` | `/technologies/{slug}` |
| Business Problem | `problem` | `content/site/problems.yaml` | `/problems/{slug}` |
| Tool | `tool` | `content/site/tools.yaml` | `/tools/{slug}` |
| Comparison | `comparison` | `content/site/comparisons.yaml` | `/comparisons/{slug}` |
| Research Report | `research-report` | `content/site/research.yaml` | `/research/{slug}` |

Industry hub pages (e.g. Restaurants overview) live in `content/site/industries.yaml` with `contentType: industry-hub`.

### New industry cluster file

If `{industry}.yaml` does not exist under `content/site/industries/`, create it:

```yaml
pages:
  - slug: my-first-topic
    # ... page fields
```

The loader picks up any `*.yaml` file in that directory automatically.

## Canonical templates

Official schemas live in `content/site/templates/`:

| File | Use for |
|------|---------|
| `industry-topic.yaml` | Industry-specific decision guides |
| `technology.yaml` | Technology evaluation guides |
| `problem.yaml` | Business problem pages |
| `tool.yaml` | Calculators and assessments |
| `comparison.yaml` | Technology comparisons |
| `research-report.yaml` | Research and benchmark reports |

Reference examples with realistic structure:

| File | Live page |
|------|-----------|
| `examples/restaurant-managed-network.yaml` | `/industries/restaurants/managed-it` |
| `examples/internet-outages.yaml` | `/problems/internet-outages` |
| `examples/downtime-cost-calculator.yaml` | `/industries/restaurants/downtime-cost-calculator` |

Do not use `content/site/_page-template.yaml`. It is deprecated.

## Required fields

Every page must include these fields. Validation treats missing values as errors.

| Field | Description |
|-------|-------------|
| `slug` | URL segment. Lowercase, hyphenated. |
| `title` | Page H1 and browser title. |
| `description` | Meta description. No em dashes. No vendor language. |
| `contentType` | One of the types in the table above. |
| `primaryKeyword` | Primary search phrase for the page. |
| `secondaryKeywords` | Array of supporting phrases. |
| `buyerStage` | `awareness`, `consideration`, `evaluation`, or `decision`. |
| `decisionGuide` | Full decision-support content (see below). |

The pipeline scaffolds a minimal `decisionGuide` if omitted, but published pages require an explicit author-written guide.

## Recommended fields

Strongly recommended for knowledge graph, SEO, and sidebar metadata.

| Field | Description |
|-------|-------------|
| `searchIntent` | `informational`, `commercial-investigation`, `decision-support`, or `implementation`. Auto-inferred if omitted. |
| `persona` | Reader role(s): `it-director`, `cio`, `cfo`, `operations`, etc. |
| `industry` | Industry entity slug when relevant. |
| `technology` | Technology entity slug when relevant. |
| `businessProblem` | Problem entity slug when relevant. |
| `relatedEntities` | Array of internal paths. Auto-enriched to meet quotas if incomplete. |
| `cta` | `label` and `href` for the next-step CTA. |
| `publish` | `true` when the page is ready for production. Default `false`. |
| `order` | Sort order in hub navigation. Lower numbers appear first. |

## Decision Guide fields

Every decision page includes these sections in the rendered layout. Author all of them before setting `publish: true`.

| Field | Editorial purpose |
|-------|-------------------|
| `quickAnswer` | 40 to 80 words. Answer the primary question immediately. |
| `whyYoureHere` | Business situation that brought the reader to this page. |
| `shouldConsider.evaluateIf` | When to keep researching this topic. |
| `shouldConsider.probablyNotIf` | When to stop or choose a simpler path. |
| `whatProblemSolves` | Business outcomes before technical features. |
| `realityCheck` | One honest statement that challenges assumptions. |
| `alternatives` | Reasonable alternative paths with tradeoffs. |
| `questionsToAsk` | Practical internal evaluation questions. |
| `decisionMatrix` | Situation-to-recommendation table. |
| `worthKnowing` | One practical field insight. |
| `askBeforeYouBuy` | Vendor or partner evaluation checklist. |
| `bottomLine` | Clear summary of when to pursue and when to stop. |
| `faqs` | 4 to 8 useful questions with direct answers. |

### Optional Decision Guide fields

| Field | When to use |
|-------|-------------|
| `buyingTriggerTimeline` | Show how organizations arrive at this decision. |
| `industrySnapshot` | Industry context for hub-style guides. |
| `technologyStack` | Layered technology relationships. |
| `evidence` | Supported findings with sources. |
| `sections` | Supplemental H2 sections (tools, research methodology). |

## Writing rules

Follow `/docs/EDITORIAL_SYSTEM.md` and `/docs/QUALITY_CHECKLIST.md`.

- No em dashes in Decision Guide content.
- No forbidden phrases: best-in-class, seamless, leverage, utilize, robust, etc.
- Write like an independent advisor, not a vendor.
- Explain the business problem before the technology.
- Include tradeoffs and alternatives.

## Publishing workflow

### 1. Generate or copy a template

```bash
npm run new:page -- problem --slug vendor-sprawl --title "Vendor Sprawl"
```

Or copy from `content/site/templates/` or `content/site/templates/examples/`.

### 2. Write the content

Edit the draft in `content/site/drafts/{slug}.yaml`. Replace every placeholder with original prose.

### 3. Merge into the target file

Copy the page block (from `- slug:` through the end of that entry) into the correct target file under the top-level `pages:` key.

If the target file does not exist, create it:

```yaml
pages:
  - slug: ...
```

### 4. Validate

```bash
npm run validate:content
```

Review errors and warnings. Fix all errors before publishing.

In development, the page sidebar shows a quality checklist panel for pages with issues.

### 5. Publish

Set `publish: true` on the page entry only when:

- Decision Guide content is complete (no placeholder text)
- Quick Answer is 40 to 80 words
- At least 4 FAQs are present
- No forbidden language in guide content
- `npm run validate:content` reports no errors for that page

Pages with `publish: true` and validation errors will fail at build time.

### 6. Build and verify

```bash
npm run build
```

Visit the page URL and confirm layout, internal links, metadata, and schema.

### 7. Clean up

Delete the draft file in `content/site/drafts/` after merging.

## Validation workflow

Validation runs automatically when content is loaded (dev and build).

| Command | Behavior |
|---------|----------|
| `npm run validate:content` | Validates all pages. Fails if any published page has errors. |
| `SITE_CONTENT_STRICT=true npm run build` | Build fails on published page quality errors. |

### What validation checks

**Errors (block published pages):**

- Missing required metadata
- Forbidden phrases in Decision Guide content
- Em dashes in Decision Guide content

**Warnings (fix before publishing):**

- Quick Answer word count outside 40 to 80
- Fewer than 4 FAQs
- Placeholder content in guide fields
- Missing recommended metadata
- Knowledge graph link quotas not met (partially auto-filled)
- Scaffolded or cluster-migrated guides

### Publish flag behavior

| `publish` value | Meaning |
|-----------------|---------|
| `false` | Draft. Renders with placeholders allowed. Shows dev warnings. |
| `true` | Production page. Must pass validation with zero errors. |
| omitted + explicit `decisionGuide` | Treated as published (`true`). |
| omitted + scaffolded guide | Treated as draft (`false`). |

## Pairing tools with guides

Calculators and assessments often need two pages:

1. **Industry topic or problem guide** explains the decision and methodology.
2. **Tool page** hosts the interactive experience.

Example:

| Guide | Tool |
|-------|------|
| `/industries/restaurants/downtime-cost-calculator` | `/tools/downtime-cost-calculator` |

Cross-link both in `relatedEntities` and point the guide CTA at the tool.

## Internal linking

Set `relatedEntities` with paths like `/technologies/sd-wan`. The pipeline auto-enriches links to meet minimum quotas:

- 3 guides (industry pages)
- 2 problems
- 2 technologies
- 1 tool
- 1 comparison
- 1 research report

Explicit links produce better graph quality than relying on auto-enrichment alone.

## Related documentation

| Document | Purpose |
|----------|---------|
| `/docs/EDITORIAL_SYSTEM.md` | Section order and writing rules |
| `/docs/DESIGN_SYSTEM.md` | UI components and layout |
| `/docs/CONTENT_ARCHITECTURE.md` | Content types and metadata model |
| `/docs/KNOWLEDGE_GRAPH.md` | Entity relationships and linking |
| `/docs/SEO_SYSTEM.md` | Metadata and schema |
| `/docs/QUALITY_CHECKLIST.md` | Pre-publish review checklist |
