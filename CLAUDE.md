# Claude Code Guidelines

Quick navigation index for N8N LinkedIn Automation Project.

## Project Overview

LinkedIn job application automation via N8N workflows using "General Contractor + Specialized Subcontractors" architecture.
**Stack**: N8N, Apify, Google Sheets, Gmail/Outlook, Google Gemini, Claude AI
**Capacity**: 16 emails/day (current), scaling to 40 emails/day
**Details**: [n8n-operations-manual.md](Docs/n8n-operations-manual.md)

## Architecture

Two-tier orchestrator → sub-workflow design. Orchestrators delegate to specialized sub-workflows.
**Details**: [shared-sub-workflow-architecture.md](Docs/architecture/shared-sub-workflow-architecture.md)

### Key Workflows

- **SEO Orchestrator** (gB6UEwFTeOdnAHPI) - Daily 04:30 AM PST
- **GenAI Orchestrator** (B2tNNaSkbLD8gDxw) - Daily 05:00 AM PST
- **Outreach Tracking** (WUe4y8iYEXNAB6dq) - Sub-workflow (email routing)
- **Contact Enrichment** (rClUELDAK9f4mgJx) - Sub-workflow

**Sub-workflow state**: Workflows with Execute Workflow Trigger nodes remain INACTIVE by design (not a bug).

## Development

### N8N Integration

Three methods: Admin Gateway Webhook, MCP Server, REST API.
**Details**: [n8n-operations-manual.md](Docs/n8n-operations-manual.md)

### Common Tasks

Workflow access, diagnostics, testing, backups.
**Details**: [COMMON-TASKS.md](Docs/guides/COMMON-TASKS.md)

### Best Practices

N8N workflow development guidelines (9 essential practices).
**Details**: [N8N-BEST-PRACTICES.md](Docs/guides/N8N-BEST-PRACTICES.md)

### Development Philosophy

KISS, YAGNI, SOLID principles. 500-line file limit, 50-line function limit.
**Details**: [DEVELOPMENT-PHILOSOPHY.md](Docs/guides/DEVELOPMENT-PHILOSOPHY.md)

## Tools & Commands

### Gemini CLI

Large-scale codebase analysis (100+ workflow JSONs, entire Docs/ directory).
**Syntax**: `gemini -p "@workflow-*.json Analyze routing logic"`
**Details**: [reddit-gemini-indode-claude.md](Docs/Integrations/reddit-gemini-indode-claude.md)

### Model Usage Tracking

`/cd-usage` - Track Gemini vs Claude work distribution
`/cd-update-docs` - End-of-session documentation + git commit + Linear sync
**Details**: [MODEL-USAGE-COMMANDS.md](Docs/guides/MODEL-USAGE-COMMANDS.md)

## Critical References

### Architectural Principles

- **24-hour job discovery** (MUST use `datePosted: "past-24h"`, never "past-week")
- **No parallel execution** (N8N limitation, use sequential processing)
- **Sequential campaigns** (prevent counter race conditions)

**Details**:
- [job-discovery-timeframe-strategy.md](Docs/architecture/job-discovery-timeframe-strategy.md)
- [n8n-parallel-execution-limitations.md](Docs/architecture/n8n-parallel-execution-limitations.md)
- [multi-keyword-campaign-implementation-strategy.md](Docs/architecture/multi-keyword-campaign-implementation-strategy.md)

### Critical Nodes

Outreach Tracking workflow key nodes (Test Mode Router, Draft Creation, Gmail MIME Builder).
**Details**: [CRITICAL-NODES.md](Docs/workflows/CRITICAL-NODES.md)

### Quality Gates

4-question production readiness checklist (MUST pass all before deployment).
**Details**: [linkedin-automation-testing-criteria.md](Docs/testing/linkedin-automation-testing-criteria.md)

## MCP Servers

### N8N MCP Server

**Status**: ✅ Installed (2025-11-24) - Available after instance restart
**Capabilities**: Direct workflow manipulation, node editing, bypass REST API limitations
**Scope**: All workflows (management), ~30-40 workflows (execution)

### Context7 MCP Server

**Status**: ✅ Installed (2025-11-24)
**Purpose**: Advanced context management, long-term memory, knowledge graphs
**API Key**: `ctx7sk-d73fc6c6-82fc-4e3e-b7cc-af1c41aa7b94`

### Linear MCP Server

**Status**: ⏳ Pending Installation
**Purpose**: Issue tracking, cloud backup, dual persistence (local git + cloud)
**Use**: Track issues with `1BU-` prefix, sync session handovers

## Known Issues

### Recently Resolved (2025-11-24)

1. **Draft Mode Sending Emails** ✅ RESOLVED
   - Root Cause: Draft nodes using `/messages/send` instead of `/drafts`
   - Fix: Updated 3 Gmail draft nodes in Outreach Tracking workflow

2. **Duplicate Emails** 🟡 FIX READY, DEPLOYMENT PENDING
   - Root Cause: No deduplication logic in orchestrators
   - Fix: Deduplication Code node created (user to add via UI, ~10 min)

### Active Issues

Check [COMMON-ERRORS-KNOWN-ISSUES.md](Docs/troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md) for latest status.

**Issue Tracking**:
- Linear tickets: `1BU-` prefix (e.g., `1BU-476`)
- Documentation: `Docs/bugs/`
- Central navigation: See above troubleshooting link

## Documentation Index

| Category | Location | Purpose |
|----------|----------|---------|
| Architecture | `Docs/architecture/` | System design, workflow structure |
| Guides | `Docs/guides/` | How-to docs, best practices |
| Workflows | `Docs/workflows/` | Workflow-specific reference |
| Testing | `Docs/testing/` | Quality gates, testing procedures |
| Troubleshooting | `Docs/troubleshooting/` | Known issues, error patterns |
| Daily Logs | `Docs/daily-logs/` | Session summaries |
| Handovers | `Docs/handover/` | Knowledge transfer docs |
| Incidents | `Docs/incidents/` | Execution diagnostics |
| Fixes | `Docs/fixes/` | Fix documentation |

## Git Workflow

**Main Branch**: `main`

**Commit Style**:
```
docs: Add execution diagnostics for 12400 and 12567
✅ N8N Admin Gateway Webhook Fix Complete - 100 Workflows Verified
```

**Details**: [GIT-WORKFLOW.md](Docs/guides/GIT-WORKFLOW.md)

## Quick Links

**N8N Instance**: https://n8n.srv972609.hstgr.cloud

**Key Workflows**:
- [SEO Orchestrator](https://n8n.srv972609.hstgr.cloud/workflow/gB6UEwFTeOdnAHPI)
- [GenAI Orchestrator](https://n8n.srv972609.hstgr.cloud/workflow/B2tNNaSkbLD8gDxw)
- [Outreach Tracking](https://n8n.srv972609.hstgr.cloud/workflow/WUe4y8iYEXNAB6dq)

**Google Sheets Config**: [Email-Account-Config](https://docs.google.com/spreadsheets/d/1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g)

## Last Updated

2025-11-24 (Refactored to lean index structure)
