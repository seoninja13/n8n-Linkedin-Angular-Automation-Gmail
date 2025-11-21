# N8N-MCP Diagnostic & Fix Guide

## Quick Start

Run the comprehensive diagnostic suite:
```powershell
.\run-all-diagnostics.ps1
```

Or run individual tests:
```powershell
# Test 1: Verify N8N API connection
.\test-n8n-api-connection.ps1

# Test 2: Test n8n-mcp server manually
.\test-n8n-mcp-manual.ps1

# Test 3: Check package version
.\check-n8n-mcp-version.ps1
```

---

## Problem Description

The n8n-mcp MCP server shows:
```
❌ [INFO] MCP server initialized with 23 tools (n8n API: not configured)
```

**Expected:**
```
✅ [INFO] MCP server initialized with 41 tools (n8n API: configured)
```

---

## Root Cause

The n8n-mcp server requires BOTH:
1. ✅ Environment variables set (`N8N_API_URL` and `N8N_API_KEY`)
2. ✅ Successful connection test to N8N instance

If either fails, the server runs in **Documentation Mode only** (23 tools) and disables N8N API management tools.

---

## Diagnostic Workflow

### STEP 1: Test N8N API Connection ✅

**Purpose:** Verify API key is valid and N8N instance is accessible.

**Command:**
```powershell
.\test-n8n-api-connection.ps1
```

**Success:** Shows list of workflows
**Failure:** Shows HTTP error code and diagnosis

---

### STEP 2: Test n8n-mcp Server Manually 🔧

**Purpose:** Verify if n8n-mcp CAN expose N8N API tools when environment variables are set correctly.

**Command:**
```powershell
.\test-n8n-mcp-manual.ps1
```

**Success (41 tools):** Environment variables work → Fix Augment Code config
**Failure (23 tools):** Environment variables not detected → Update n8n-mcp package
**Failure (connection error):** API connection issue → Go back to STEP 1

---

### STEP 3: Fix Augment Code Configuration 🔧

**If STEP 2 shows 41 tools**, the issue is with Augment Code not passing environment variables correctly.

**Steps:**

1. Open Augment Settings Panel (gear icon ⚙️)
2. Navigate to MCP section
3. Delete existing "n8nmcp-npx" server
4. Click "Import from JSON"
5. Copy content from `augment-n8n-mcp-config.json`
6. Paste and save
7. Restart VS Code (Ctrl+Shift+P → "Reload Window")

**Configuration Changes:**
- `LOG_LEVEL`: `error` → `debug` (for better diagnostics)
- `DISABLE_CONSOLE_OUTPUT`: `true` → `false` (to see initialization messages)
- Verified exact spelling: `N8N_API_URL` and `N8N_API_KEY` (case-sensitive)

---

### STEP 4: Update n8n-mcp Package 📦

**If STEP 2 shows 23 tools**, the n8n-mcp package may be outdated or have issues.

**Command:**
```powershell
.\check-n8n-mcp-version.ps1
```

**Update commands:**
```powershell
npm cache clean --force
npx -y n8n-mcp@latest
```

**Check for known issues:**
https://github.com/czlonkowski/n8n-mcp/issues

---

## Files Created

| File | Purpose |
|------|---------|
| `run-all-diagnostics.ps1` | Run all tests in sequence |
| `test-n8n-api-connection.ps1` | Test N8N API connection independently |
| `test-n8n-mcp-manual.ps1` | Test n8n-mcp with explicit environment variables |
| `check-n8n-mcp-version.ps1` | Check package version and update commands |
| `augment-n8n-mcp-config.json` | Corrected Augment Code MCP configuration |
| `n8n-mcp-diagnostic-workflow.md` | Detailed diagnostic workflow documentation |
| `README-n8n-mcp-diagnostics.md` | This file (quick reference) |

---

## Expected N8N API Tools (When Configured)

When n8n-mcp is properly configured, these tools should be available:

- `n8n_list_workflows_n8n-mcp-npx` - List all workflows
- `n8n_get_workflow_n8n-mcp-npx` - Get workflow details
- `n8n_get_workflow_minimal_n8n-mcp-npx` - Get minimal workflow info
- `n8n_create_workflow_n8n-mcp-npx` - Create new workflow
- `n8n_update_partial_workflow_n8n-mcp-npx` - Update workflow using diff operations
- `n8n_validate_workflow_n8n-mcp-npx` - Validate workflow from n8n instance
- `n8n_trigger_webhook_workflow_n8n-mcp-npx` - Trigger workflow execution
- `n8n_list_executions_n8n-mcp-npx` - List workflow executions
- `n8n_get_execution_n8n-mcp-npx` - Get execution details
- And 9+ more N8N API management tools

---

## Success Criteria

After completing diagnostics and fixes:

1. ✅ `test-n8n-api-connection.ps1` shows workflows list
2. ✅ `test-n8n-mcp-manual.ps1` shows "41 tools (n8n API: configured)"
3. ✅ Augment Code Output panel shows "41 tools (n8n API: configured)"
4. ✅ N8N API tools appear in Augment Code's tool list

---

## Alternative Solution

If all diagnostics fail, use N8N REST API directly via PowerShell:

```powershell
# The test-n8n-api-connection.ps1 script demonstrates this approach
$headers = @{ "X-N8N-API-KEY" = "your-api-key" }
$workflows = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows" -Headers $headers
$workflows.data | Format-Table
```

---

## Troubleshooting Matrix

| STEP 1 Result | STEP 2 Result | Diagnosis | Solution |
|---------------|---------------|-----------|----------|
| ✅ PASS | 41 tools | Augment config issue | Fix Augment config (STEP 3) |
| ✅ PASS | 23 tools | n8n-mcp package issue | Update package (STEP 4) |
| ✅ PASS | Connection error | Intermittent API issue | Retry or check N8N logs |
| ❌ FAIL (401) | N/A | Invalid API key | Generate new API key |
| ❌ FAIL (404) | N/A | Wrong URL | Verify N8N instance URL |
| ❌ FAIL (network) | N/A | N8N not accessible | Check firewall/DNS/SSL |

---

## Next Steps

1. Run `.\run-all-diagnostics.ps1` (or individual tests)
2. Follow the diagnostic workflow based on results
3. Report back with:
   - STEP 1 result (PASS/FAIL + error details)
   - STEP 2 result (41 tools / 23 tools / connection error)
   - Any error messages from Augment Code Output panel

---

## Configuration Details

**N8N Instance:**
- URL: `https://n8n.srv972609.hstgr.cloud`
- API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (configured in scripts)

**MCP Server:**
- Name: `n8nmcp-npx`
- Command: `npx -y n8n-mcp`
- Required Environment Variables:
  - `N8N_API_URL`
  - `N8N_API_KEY`
  - `LOG_LEVEL` (optional, default: error)
  - `MCP_MODE` (optional, default: stdio)

