# Common Development Tasks

Quick reference for frequent N8N workflow operations.

## Accessing N8N Workflows

### Via Web UI

**N8N Instance**: https://n8n.srv972609.hstgr.cloud

**URL Patterns**:
- Workflow editor: `/workflow/{workflowId}`
- Executions list: `/workflow/{workflowId}/executions`
- Specific execution: `/workflow/{workflowId}/executions/{executionId}`

**Example**:
```
https://n8n.srv972609.hstgr.cloud/workflow/WUe4y8iYEXNAB6dq
https://n8n.srv972609.hstgr.cloud/workflow/WUe4y8iYEXNAB6dq/executions/12991
```

### Via PowerShell Scripts

**List all workflows**:
```powershell
.\list-workflows-simple.ps1
```

**Get workflow details**:
```powershell
.\check-workflow-current-state.ps1
```

**Diagnose execution errors**:
```powershell
.\diagnose-execution-{executionId}.ps1
```

## Diagnosing Workflow Failures

### Step 1: Get Execution Data

**Download full execution JSON**:
```powershell
.\get-execution-{id}-full.ps1
```

This creates: `execution-{id}-full-data.json`

### Step 2: Check Sub-Executions

For parent-child workflow analysis:
```powershell
.\find-subexecution-ids.ps1
```

### Step 3: Analyze Error Patterns

Check known issues: [COMMON-ERRORS-KNOWN-ISSUES.md](../troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md)

**Common Error Patterns**:

1. **Google Sheets "Could not get parameter"**
   - **Cause**: Missing `resource` parameter (N8N v4.7 serialization bug)
   - **Fix**: Re-select dropdown value in UI and save

2. **Sub-workflow "inactive" confusion**
   - **Cause**: Misunderstanding of Execute Workflow Trigger behavior
   - **Reality**: Sub-workflows with Execute Workflow Trigger nodes are DESIGNED to remain inactive
   - **Fix**: This is expected behavior, not a bug

3. **Duplicate detection bypassing logic**
   - **Cause**: Workflow routing paths incorrectly configured
   - **Fix**: Check Switch node routing rules (Duplicate vs Not Duplicate paths)

### Step 4: Trace Data Flow

**Analyze node execution sequence**:
```powershell
.\trace-execution-flow.ps1
```

**Check specific node outputs**:
```powershell
.\list-executed-nodes.ps1
```

## Testing Email Delivery

### Test Mode (Creates Drafts)

**Enable test mode**:
1. Open Google Sheets: [Email-Account-Config](https://docs.google.com/spreadsheets/d/1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g)
2. Set `testMode: true` in configuration sheet

**Verify test mode**:
```powershell
.\test-testmode-fix.ps1
```

**Expected behavior**:
- Emails NOT sent
- Drafts created in Gmail Drafts folder
- Draft nodes use `/drafts` endpoint

### Production Mode (Sends Emails)

**Enable production mode**:
1. Open Google Sheets: [Email-Account-Config](https://docs.google.com/spreadsheets/d/1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g)
2. Set `testMode: false` in configuration sheet

**Expected behavior**:
- Emails sent via Gmail/Outlook
- Send nodes use `/messages/send` endpoint
- Email tracking updated in Google Sheets

## Workflow Backup and Version Control

### Manual Backup

Workflows are backed up in `n8n-workflows/backups/` with timestamp folders.

**Backup all workflows** (if scripts are updated):
```bash
node n8n-workflows/scripts/backup-all-workflows.js
```

**Note**: Scripts may need updates. Use N8N Admin Gateway Webhook or MCP Server for reliable backups.

### Export Single Workflow

**Via N8N UI**:
1. Open workflow
2. Click workflow menu (three dots)
3. Select "Download"
4. Save as `workflow-{workflowId}-{description}.json`

**Via PowerShell**:
```powershell
.\check-workflow-current-state.ps1
# Outputs workflow JSON to console
# Copy to file: workflow-{workflowId}-current.json
```

## Working with N8N MCP Server

### Check MCP Server Status

**Verify MCP tools available**:
```powershell
.\n8n-diagnostic.ps1
```

**List available N8N tools**:
```powershell
.\n8n-list-available-tools.ps1
```

### Execute Workflow via MCP

**Prerequisites**:
- Workflow must have "Available in MCP" toggle enabled
- N8N MCP server installed and configured

**Example usage** (via Claude Code):
- Use N8N MCP tools directly
- No manual JSON import/export needed

## Updating Workflows

### Via N8N UI (Recommended)

1. Export workflow JSON from N8N
2. Make changes locally
3. Import workflow JSON back to N8N
4. Test manually

**Pros**: Reliable, visual feedback
**Cons**: Manual steps required

### Via N8N MCP Server

**Pros**: Programmatic updates, no UI needed
**Cons**: Requires MCP server setup

See: [n8n-operations-manual.md](../n8n-operations-manual.md) for MCP details

### Via REST API

**Warning**: Complex workflows may fail with 500 errors

**Use REST API for**:
- GET operations (list, read)
- Simple workflow updates
- Activate/deactivate workflows

**Avoid REST API for**:
- Complex workflow updates (40+ nodes)
- Workflows with OAuth credentials
- Workflows with binary data

See: [n8n-operations-manual.md](../n8n-operations-manual.md) for API details

## Checking Workflow State

### Is Workflow Active?

**Via PowerShell**:
```powershell
.\check-workflow-current-state.ps1
```

Look for `"active": true` or `"active": false`

### Is Sub-Workflow Supposed to be Inactive?

**Sub-workflows with Execute Workflow Trigger nodes are DESIGNED to remain INACTIVE**.

**Check trigger type**:
```powershell
# Open workflow JSON
# Look for: "type": "n8n-nodes-base.executeWorkflowTrigger"
```

If found → Inactive is CORRECT behavior

### Check Schedule

**Via N8N UI**:
1. Open workflow
2. Look for Schedule Trigger node
3. Check cron expression

**Via PowerShell**:
```powershell
.\check-workflow-current-state.ps1
# Search for: "type": "n8n-nodes-base.scheduleTrigger"
```

## Monitoring Executions

### List Recent Executions

**Via PowerShell**:
```powershell
.\get-latest-genai-execution.ps1
```

**Via N8N UI**:
1. Navigate to workflow
2. Click "Executions" tab
3. View execution list with status

### Filter Executions

**By status**:
- Success: Green checkmark
- Error: Red X
- Running: Blue spinner

**By date**:
- N8N UI has date range filter
- PowerShell scripts can filter by execution ID

## Quick Reference: Key Workflow IDs

| Workflow | ID | Schedule |
|----------|-----|----------|
| SEO Orchestrator | gB6UEwFTeOdnAHPI | 04:30 AM PST |
| GenAI Orchestrator | B2tNNaSkbLD8gDxw | 05:00 AM PST |
| Outreach Tracking | WUe4y8iYEXNAB6dq | Sub-workflow |
| Contact Enrichment | rClUELDAK9f4mgJx | Sub-workflow |

## Related Documentation

- **N8N Integration Methods**: [n8n-operations-manual.md](../n8n-operations-manual.md)
- **Troubleshooting**: [COMMON-ERRORS-KNOWN-ISSUES.md](../troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md)
- **Architecture**: [Architecture Index](../architecture/)
- **Testing**: [linkedin-automation-testing-criteria.md](../testing/linkedin-automation-testing-criteria.md)

## Last Updated

2025-11-24
