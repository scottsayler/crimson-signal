# Crimson Signal Research to Content Workflow v1

## Purpose

This document defines the standard publishing workflow for Crimson Signal.

The goal is to transform independent research into high-quality, decision-focused content through a repeatable process.

Every published page should follow the same workflow regardless of industry or technology.

This workflow is the official publishing process for Crimson Signal.

---

# Guiding Principle

Research first.

Content second.

Technology last.

Never begin by asking, "What should we write?"

Begin by asking, "What problem are people trying to solve?"

---

# Publishing Workflow

```
Research

↓

Evidence Collection

↓

Knowledge Extraction

↓

Content Creation

↓

Validation

↓

Publishing

↓

Monitoring

↓

Continuous Improvement
```

---

# Step 1: Research

Primary Tool

Perplexity

Objective

Collect independent evidence.

Examples

- Public case studies
- Industry reports
- Vendor documentation
- Regulatory guidance
- Public statistics
- Technology trends

Never copy vendor marketing.

Always identify recurring patterns.

Deliverable

Research Markdown

---

# Step 2: Evidence Collection

Objective

Extract useful information.

Capture

Business problems

Buying triggers

Operational impacts

Technologies used

Business outcomes

Lessons learned

Ignore

Marketing language

Product claims

Vendor hype

Deliverable

Structured research notes

---

# Step 3: Knowledge Extraction

Primary Tool

ChatGPT

Objective

Transform research into Crimson Signal knowledge.

Output

Business problems

Decision points

Tradeoffs

Alternatives

Reality Checks

Worth Knowing insights

Decision Matrix

Questions to Ask

Related entities

Do not create page content yet.

Create structured knowledge.

---

# Step 4: Content Creation

Primary Tool

ChatGPT

Objective

Generate production-ready YAML.

The output should follow:

EDITORIAL_SYSTEM.md

CONTENT_ARCHITECTURE.md

KNOWLEDGE_GRAPH.md

SEO_SYSTEM.md

DESIGN_SYSTEM.md

QUALITY_CHECKLIST.md

Do not generate JSX.

Do not generate HTML.

Only generate structured content.

Deliverable

Production-ready YAML

---

# Step 5: Validation

Primary Tool

Cursor

Run

npm run validate:content

Confirm

Required metadata

Required editorial sections

Knowledge graph relationships

Internal links

Schema

SEO metadata

Decision components

Publishing status

Every page should pass validation before publishing.

---

# Step 6: Editorial Review

Primary Reviewer

Human

Review using

QUALITY_CHECKLIST.md

Ask

Would I bookmark this?

Would I send this to a coworker?

Does this reduce uncertainty?

Does it sound independent?

Does it avoid vendor language?

Only approve pages that pass every review.

---

# Step 7: Publish

Deploy

Publish only after validation.

Never publish draft research.

---

# Step 8: Monitor

Track

Organic traffic

Search impressions

Average ranking

Internal link depth

Calculator usage

Assessment completion

Time on page

Returning visitors

Research downloads

Look for pages that deserve expansion.

---

# Continuous Improvement

Review cornerstone pages every six months.

Review research pages quarterly.

Update vendor profiles after significant announcements.

Expand pages when new evidence becomes available.

Never update content simply to change dates.

---

# Standard Research Inputs

Every research project should answer:

What business problem exists?

Who experiences it?

What triggers technology evaluation?

Which technologies are most common?

What alternatives exist?

What outcomes improve?

What public evidence supports this?

What misconceptions exist?

What executive questions remain unanswered?

---

# Standard YAML Output

Every page should include:

Quick Answer

Decision Box

Why You're Here

Business Problem

Reality Check

Alternatives

Worth Knowing

Questions to Ask

Decision Matrix

FAQs

Related Entities

Related Guides

Related Problems

Related Technologies

Related Tools

Related Comparisons

Related Research

Bottom Line

Continue Your Research

---

# Page Creation Workflow

```
Perplexity Research

↓

Research Summary

↓

ChatGPT YAML Generation

↓

Cursor Validation

↓

Quality Review

↓

Deploy
```

Never skip a step.

---

# Roles

## Perplexity

Responsible for:

Finding evidence

Finding case studies

Finding statistics

Finding trends

Finding public documentation

---

## ChatGPT

Responsible for:

Synthesizing research

Building decision frameworks

Writing YAML

Maintaining editorial consistency

Building knowledge graph relationships

Applying SEO strategy

Applying the Editorial System

Applying the Quality Checklist

---

## Cursor

Responsible for:

Rendering pages

Validation

Templates

Components

SEO implementation

Internal linking

Knowledge graph rendering

Deployment

Cursor should never invent editorial direction.

It should implement the Crimson Signal system.

---

## Human Editor

Responsible for:

Final approval

Accuracy

Clarity

Originality

Publishing decisions

Topic prioritization

Strategic direction

---

# Crimson Signal Publishing Philosophy

The objective is not to publish the most pages.

The objective is to publish the most useful page on the internet for each topic.

Quality always outweighs quantity.

A single exceptional page strengthens the knowledge graph more than ten average pages.

Every page should make the platform more valuable.

Never publish content simply because a keyword exists.

Publish because someone has an important decision to make.

---

# Final Principle

Crimson Signal is not a content website.

It is a decision support platform.

Every workflow, template, component, and page should reinforce that mission.