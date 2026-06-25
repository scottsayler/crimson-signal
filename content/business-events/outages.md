---
title: Recurring outages
shortDescription: Downtime at one location can signal systemic technology risk across your network.
icon: "⊘"
order: 7
technologyDomains:
  - networking
  - operations
  - cloud
  - security
relatedIndustries:
  - retail
  - hospitality
  - healthcare
  - financial-services
questions:
  - id: outage-frequency
    question: How often are you experiencing outages?
    type: select
    options:
      - "First significant incident"
      - "Monthly disruptions"
      - "Weekly or more frequent"
      - "Chronic reliability problems"
  - id: impact
    question: What is the business impact?
    type: multiselect
    options:
      - "Revenue loss during downtime"
      - "Customer-facing service disruption"
      - "Employee productivity loss"
      - "Regulatory or compliance exposure"
      - "Reputational damage"
  - id: affected-systems
    question: Which systems are affected?
    type: multiselect
    options:
      - "Network and connectivity"
      - "Point of sale / transaction systems"
      - "Cloud applications"
      - "On-premises infrastructure"
      - "Communication systems"
  - id: recovery
    question: How quickly can you recover today?
    type: select
    options:
      - "Minutes with automated failover"
      - "Hours with manual intervention"
      - "Extended outages — no clear recovery path"
      - "Unknown — we lack visibility"
---

## Technology implications of outages

Outages in multi-location organizations rarely stay local. A failure pattern at one site often exists — undetected — at others. Reliability is an architecture question, not a support ticket.

### What changes

- **Resilience architecture** must account for location-specific failure modes.
- **Monitoring and alerting** need to operate across the full footprint, not site by site.
- **Vendor and carrier dependencies** create single points of failure that require explicit management.
- **Recovery procedures** must be tested, documented, and location-aware.

### Strategic questions

- Do you know your actual uptime across all locations?
- Are outages isolated incidents or symptoms of architectural debt?
- What is your recovery time objective, and can you meet it today?
