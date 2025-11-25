# Model Usage Tracking Commands

Documentation for `/cd-usage` and `/cd-update-docs` commands.

## `/cd-usage` Command

### Purpose

Track and report the distribution of work between Gemini CLI (Google Gemini) and Claude Code (Anthropic Sonnet) for any session.

### Usage

```bash
/cd-usage
```

### What It Does

1. Analyzes today's session documentation and conversation history
2. Identifies all Gemini CLI invocations and Claude Code tasks
3. Calculates time estimates and percentages for each model
4. Generates a comprehensive model usage report
5. Checks compliance with CLAUDE.md delegation strategy
6. Provides recommendations for optimal model distribution

### Example Output

```markdown
# 🤖 Model Usage Report - 2025-11-24

## Executive Summary
- Total Session Duration: 75 minutes
- Gemini CLI Work: 20 minutes (27%)
- Claude Code Work: 55 minutes (73%)

## Gemini CLI Contributions
1. Workflow architecture analysis - 5 min
2. Execution data trace - 3 min
3. Version comparison - 4 min
4. Cross-workflow verification - 8 min

## Claude Code Contributions
1. Code generation - 5 min
2. Documentation - 10 min
3. Script creation - 8 min
4. File editing - 7 min
5. Testing - 10 min
6. Handover docs - 15 min

## Compliance: ✅ COMPLIANT
All analysis tasks used Gemini, all implementation used Claude.
```

### When to Use

- End of session to verify optimal model distribution
- When user asks "how much work was done by Gemini vs Claude?"
- Before committing to review session efficiency
- To ensure compliance with delegation strategy

### Report Output

**Saved to**: `Docs/metrics/model-usage-YYYY-MM-DD.md`

---

## `/cd-update-docs` Command

### Purpose

Complete end-of-session documentation update with dual persistence (local git + Linear MCP cloud) to ensure seamless continuation tomorrow.

### Usage

```bash
/cd-update-docs           # Full documentation update
/cd-update-docs --quick   # Quick mode (essentials only)
/cd-update-docs --cloud-only  # Sync to Linear MCP only
```

### What It Does

1. Analyzes session work (files changed, tasks completed, decisions made)
2. Creates/updates daily log with comprehensive session summary
3. Creates session handover document with critical context
4. Updates CLAUDE.md if architectural changes were made
5. Updates troubleshooting docs if new issues/fixes discovered
6. Commits all documentation to local git repository
7. Syncs to Linear MCP (cloud backup)
8. Verifies dual persistence (local + cloud)
9. Generates tomorrow's startup checklist
10. Provides confirmation with all links

### Dual Persistence Strategy

- **Local**: All docs committed to git for version control
- **Cloud**: Session summary synced to Linear MCP for accessibility
- **Verification**: Both locations checked before completion

### Example Output

```markdown
# 📚 Documentation Update Complete

## ✅ Local Documentation Updated
- Docs/daily-logs/2025-11-24-duplicate-email-fix.md
- Docs/handover/2025-11-24-session-handover.md
- Docs/handover/2025-11-24-tomorrow-checklist.md
- CLAUDE.md (updated)

## ✅ Git Commit Created
Commit: a1b2c3d
Message: docs: Session handover for 2025-11-24
Files: 5 changed

## ✅ Linear MCP Synced
Issue: LIN-123
URL: https://linear.app/...
Status: Complete

## 🎯 Tomorrow's First Steps
1. Read: Docs/handover/2025-11-24-session-handover.md
2. Start with: Fix Test Mode Router routing logic
3. Context: Routing rules are inverted, need to swap Output 0/1

Dual Persistence: ✅ Local + Cloud
You can safely end the session.
```

### When to Use

- End of every work session
- Before committing to git manually
- When switching contexts/tasks
- Before ending the day
- When significant progress has been made

### Files Created/Updated

- `Docs/daily-logs/YYYY-MM-DD-[topic].md` - Session summary
- `Docs/handover/YYYY-MM-DD-session-handover.md` - Knowledge transfer
- `Docs/handover/YYYY-MM-DD-tomorrow-checklist.md` - Quick start guide
- `CLAUDE.md` - If architectural changes
- `Docs/troubleshooting/` - If new issues/fixes
- Linear MCP issue - Cloud backup

### Benefits

- Never lose context between sessions
- Always know where to start tomorrow
- Documentation always up-to-date
- Both local and cloud backup
- Clear handover for continuity

---

## Command Comparison

| Feature | `/cd-usage` | `/cd-update-docs` |
|---------|-------------|-------------------|
| **Purpose** | Track model distribution | End-of-session documentation |
| **Frequency** | End of session | End of session |
| **Output** | Metrics report | Git commit + Linear sync |
| **Duration** | 1-2 min | 3-5 min |
| **Required** | Optional (best practice) | Recommended for all sessions |
| **Cloud Sync** | No | Yes (Linear MCP) |
| **Git Commit** | No | Yes |

---

## Best Practices

### For `/cd-usage`

1. **Run at end of session** - Get accurate time distribution
2. **Check compliance** - Ensure Gemini used for analysis, Claude for implementation
3. **Archive reports** - Keep in `Docs/metrics/` for trend analysis
4. **Review trends** - Optimize model distribution over time

### For `/cd-update-docs`

1. **Run before ending session** - Ensure continuity
2. **Use `--quick` for minor changes** - Save time on small updates
3. **Verify dual persistence** - Check both local and cloud
4. **Read tomorrow's checklist** - Start next session efficiently
5. **Update CLAUDE.md manually** - If architectural changes not auto-detected

---

## Troubleshooting

### `/cd-usage` Not Generating Report

**Possible causes**:
- No session documentation found
- Metrics directory doesn't exist
- Permission issues

**Solutions**:
1. Create `Docs/metrics/` directory
2. Check file permissions
3. Ensure session work is documented

### `/cd-update-docs` Cloud Sync Failed

**Possible causes**:
- Linear MCP not installed
- API key invalid
- Network connectivity

**Solutions**:
1. Install Linear MCP server
2. Verify API key configuration
3. Check network connection
4. Use `--cloud-only` to retry sync

### Git Commit Failed

**Possible causes**:
- Uncommitted changes in working directory
- Git conflicts
- Permission issues

**Solutions**:
1. Commit or stash pending changes
2. Resolve merge conflicts
3. Check git user configuration

---

## Related Documentation

- **Gemini CLI Usage**: [reddit-gemini-indode-claude.md](../Integrations/reddit-gemini-indode-claude.md)
- **Documentation Structure**: See CLAUDE.md
- **Git Workflow**: [GIT-WORKFLOW.md](GIT-WORKFLOW.md)
- **Session Handovers**: `Docs/handover/`
- **Daily Logs**: `Docs/daily-logs/`

## Last Updated

2025-11-24
