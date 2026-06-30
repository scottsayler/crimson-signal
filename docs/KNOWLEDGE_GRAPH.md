# Crimson Signal Knowledge Graph & Entity System v1

## Purpose

Crimson Signal is not a collection of independent web pages.

It is a connected knowledge graph.

Every page represents one or more entities and the relationships between them.

The goal is to help visitors move naturally from a business problem to an informed technology decision.

---

# Core Entity Types

The knowledge graph consists of the following entity types.

## Industry

Examples

- Restaurants
- Retail
- Healthcare
- Financial Services
- Automotive
- Manufacturing
- Franchise

Industries contain:

- Business Problems
- Technologies
- Research
- Decision Tools
- Checklists
- Comparisons

---

## Business Problem

Examples

- Internet Outages
- POS Downtime
- Guest Wi-Fi Performance
- Vendor Sprawl
- PCI Compliance
- Legacy Phone Lines
- Store Openings
- Network Visibility

Business Problems connect to:

- Industries
- Technologies
- Tools
- Research
- Comparisons

Business Problems are the starting point of the buyer journey.

---

## Technology

Examples

- SD-WAN
- Managed Network
- UCaaS
- CCaaS
- Microsoft Teams
- LTE Backup
- Starlink
- POTS Replacement
- SASE

Technologies connect to:

- Business Problems
- Industries
- Vendor Profiles
- Comparisons
- Decision Guides

Technologies are never isolated pages.

---

## Decision Tool

Examples

- Downtime Calculator
- Bandwidth Calculator
- Network Assessment
- Vendor Consolidation Calculator
- POTS Savings Calculator

Decision Tools connect to:

- Business Problems
- Technologies
- Industries

Every tool should support multiple industries.

---

## Research

Examples

- Industry Reports
- Benchmarks
- Trends
- Public Case Studies

Research connects to:

- Industries
- Technologies
- Business Problems

Research should support decisions instead of promoting vendors.

---

## Vendor

Examples

- Fusion Connect
- Comcast Business
- Cisco
- Fortinet
- Microsoft
- RingCentral
- Zoom

Vendor Profiles connect to:

- Technologies
- Public Case Studies
- Comparisons

Vendor Profiles should remain objective.

---

## Comparison

Examples

- SD-WAN vs MPLS
- Teams vs RingCentral
- LTE vs Starlink
- Broadband vs Dedicated Internet

Comparisons connect competing technologies.

---

## Checklist

Examples

- Opening Checklist
- Vendor Evaluation Checklist
- Network Audit Checklist

Checklists support implementation.

---

## Assessment

Examples

- Technology Maturity
- Network Readiness
- Business Continuity

Assessments support evaluation.

---

# Relationship Model

Every entity should connect to related entities.

Example

Restaurant

↓

Internet Outages

↓

SD-WAN

↓

Downtime Calculator

↓

Restaurant Case Studies

↓

Vendor Comparisons

↓

Implementation Checklist

The visitor should never reach a dead end.

---

# Buyer Journey

The knowledge graph follows a consistent journey.

Business Problem

↓

Education

↓

Technology

↓

Comparison

↓

Decision Tool

↓

Implementation

↓

Research

The website should encourage exploration instead of pushing products.

---

# Required Relationships

Every Business Problem should connect to:

- Related Industries
- Related Technologies
- Related Research
- Related Decision Tools
- Related Comparisons

---

Every Technology should connect to:

- Related Problems
- Related Industries
- Related Vendors
- Related Comparisons
- Related Tools

---

Every Industry should connect to:

- Core Problems
- Core Technologies
- Research
- Tools
- Checklists
- Comparisons

---

Every Tool should connect to:

- Problems
- Technologies
- Industries

---

Every Comparison should connect to:

- Both Technologies
- Related Problems
- Related Industries
- Decision Tools

---

# Metadata Requirements

Every entity should include:

Title

Slug

Entity Type

Description

Primary Industry

Primary Technology

Primary Problem

Primary Persona

Primary Keyword

Search Intent

Buyer Stage

Difficulty

Reading Time

Related Entities

---

# Recommendation Engine

Every page should automatically recommend related entities.

For example

Restaurant Networking

should recommend

- Internet Outages
- SD-WAN
- Managed Network
- Bandwidth Calculator
- Downtime Calculator
- Restaurant Technology Guide
- SD-WAN vs MPLS

Recommendations should be based on relationships, not manual links.

---

# Search Philosophy

Search should prioritize entities over pages.

Searching "SD-WAN"

should return

Decision Guide

Restaurant Guide

Retail Guide

Business Problems

Comparisons

Research

Decision Tools

Vendor Profiles

The visitor searches for a concept, not a URL.

---

# Future Expansion

The knowledge graph should support adding:

New Industries

New Technologies

New Business Problems

New Tools

New Research

without redesigning the website.

Every new page should strengthen the graph.

---

# Crimson Signal Principle

Pages are temporary.

Knowledge is permanent.

Build relationships first.

Pages are simply one way to display those relationships.