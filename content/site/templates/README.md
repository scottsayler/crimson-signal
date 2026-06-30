# Crimson Signal page templates

Official schemas for new page authoring. Do not copy `_page-template.yaml` (deprecated).

## Quick start

```bash
npm run new:page -- industry-topic --slug my-topic --title "My Topic" --industry restaurants
npm run new:page -- problem --slug my-problem --title "My Problem"
npm run new:page -- technology --slug my-tech --title "My Technology"
```

Generated drafts are written to `content/site/drafts/`. Merge the page block into the target file listed in the draft header.

## Canonical templates

| Template | Target file | URL |
|----------|-------------|-----|
| `industry-topic.yaml` | `industries/{industry}.yaml` | `/industries/{industry}/{slug}` |
| `technology.yaml` | `technologies.yaml` | `/technologies/{slug}` |
| `problem.yaml` | `problems.yaml` | `/problems/{slug}` |
| `tool.yaml` | `tools.yaml` | `/tools/{slug}` |
| `comparison.yaml` | `comparisons.yaml` | `/comparisons/{slug}` |
| `research-report.yaml` | `research.yaml` | `/research/{slug}` |

## Reference examples

See `examples/` for completed reference pages:

- `restaurant-managed-network.yaml`
- `internet-outages.yaml`
- `downtime-cost-calculator.yaml`

Full workflow: `/docs/PAGE_AUTHORING.md`
