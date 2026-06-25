# Crimson Signal

Independent technology advisory platform for multi-location organizations.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content Model

All content is markdown-driven. Add new pages without code changes.

### Business Events (primary content)

Business Events live in `content/business-events/`. The filename becomes the default slug (`opening-locations.md` → `opening-locations`).

#### Legacy schema (still supported)

Existing events continue to work with no changes required:

```markdown
---
title: Your Event Title
shortDescription: One-line description
icon: "◈"
order: 9
technologyDomains:
  - cloud
  - security
relatedIndustries:
  - retail
questions:
  - id: unique-id
    question: Your question?
    type: select
    options:
      - Option A
      - Option B
---

## Your content here
```

#### Extended schema (optional fields)

All extended fields are optional. Use snake_case in markdown; the parser also accepts legacy camelCase aliases.

```markdown
---
title: Opening new locations
slug: opening-locations
category: Growth
summary: One-line description shown in listings and cards.
executive_mindset: How executives typically frame this change.
business_problem: The underlying problem this event surfaces.
trigger_level: high
target_personas:
  - CIO
  - VP Operations
industries:
  - retail
  - hospitality
technology_domains:
  - networking
  - cloud
related_events:
  - rising-costs
related_articles: []
related_research:
  - multi-location-technology-tax
interactive_tool: guided-conversation
report_template: expansion-brief
strategy_session: true
cta: Schedule a Technology Strategy Session
search_intent:
  - opening new locations technology
icon: "◈"
order: 1
questions:
  - id: location-count
    question: How many new locations are you opening?
    description: Optional context for the question.
    type: select
    required: true
    options:
      - "1–5 locations"
      - "6–20 locations"
    purpose: Measure expansion complexity
    business_signal:
      - Growth
    technology_domains:
      - networking
    report_section: Expansion Risk
    weight: high
    follow_up: expansion-scale
    executive_insight: Organizations expanding beyond 20 locations often experience operational inconsistency without early standards.
    scoring_logic:
      "21–50 locations": expansion_elevated
      "50+ locations": expansion_high
---

## Body content (markdown)
```

**Field reference**

| Markdown field | TypeScript property | Notes |
|----------------|---------------------|-------|
| `title` | `title` | Display name |
| `slug` | `slug` | Optional; defaults to filename |
| `category` | `category` | Grouping metadata |
| `summary` | `summary`, `shortDescription` | `summary` preferred; `shortDescription` legacy alias |
| `executive_mindset` | `executiveMindset` | |
| `business_problem` | `businessProblem` | |
| `trigger_level` | `triggerLevel` | |
| `target_personas` | `targetPersonas` | |
| `industries` | `industries`, `relatedIndustries` | `industries` preferred; `relatedIndustries` legacy alias |
| `technology_domains` | `technologyDomains` | `technology_domains` preferred; `technologyDomains` legacy alias |
| `related_events` | `relatedEvents` | Slugs of other business events |
| `related_articles` | `relatedArticles` | |
| `related_research` | `relatedResearch` | Research article slugs |
| `interactive_tool` | `interactiveTool` | |
| `report_template` | `reportTemplate` | |
| `strategy_session` | `strategySession` | Boolean or string |
| `cta` | `cta` | |
| `search_intent` | `searchIntent` | |
| `icon` | `icon` | Legacy; used by secondary pages |
| `order` | `order` | Sort order on homepage |

**Question metadata (all optional except `id`, `question`, `type`)**

| Markdown field | TypeScript property |
|----------------|---------------------|
| `description` | `description` |
| `required` | `required` |
| `purpose` | `purpose` |
| `business_signal` | `businessSignal` |
| `technology_domains` | `technologyDomains` |
| `report_section` | `reportSection` |
| `weight` | `weight` |
| `follow_up` | `followUp` |
| `executive_insight` | `executiveInsight` |
| `scoring_logic` | `scoringLogic` |

Reference implementation: `content/business-events/opening-locations.md`

Parser: `src/lib/parse-business-event.ts`

### Industries

Add a file to `content/industries/` with frontmatter: `title`, `shortDescription`, `order`, `technologyDomains`, `relatedEvents`.

### Research

Add a file to `content/research/` with frontmatter: `title`, `excerpt`, `publishedAt`, `technologyDomains`.

### Technology Domains

Defined in `src/lib/types.ts`. Used as metadata tags across content.

## Architecture

- **Next.js 16** with App Router
- **Tailwind CSS 4** for styling
- **gray-matter** for markdown frontmatter
- **react-markdown** for content rendering

### Conversation flow

- `src/hooks/useConversationState.ts` — guided conversation state and URL sync
- `src/components/ConversationFlow.tsx` — composes EventSelector, QuestionStep, ConversationProgress
- `src/lib/copy.ts` — homepage headline and subhead copy

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Primary entry — event selection, guided conversation, Executive Brief (`?event=` deep links) |
| `/brief` | Redirects to `/` (preserves legacy links) |
| `/business-events` | All business events |
| `/industries` | Industry context |
| `/research` | Independent research |
| `/executive-briefs` | Sample briefs (not in primary navigation) |
| `/about` | About Crimson Signal |
