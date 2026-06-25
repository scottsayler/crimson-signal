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

Add a file to `content/business-events/`:

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

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage with "What's changed?" |
| `/brief` | Guided conversation → Executive Brief |
| `/business-events` | All business events |
| `/industries` | Industry context |
| `/research` | Independent research |
| `/executive-briefs` | Sample briefs |
| `/about` | About Crimson Signal |
