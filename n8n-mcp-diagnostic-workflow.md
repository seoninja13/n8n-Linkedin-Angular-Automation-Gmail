# N8N-MCP Diagnostic Workflow

## Problem Statement

The n8n-mcp MCP server is showing:
```
[INFO] MCP server initialized with 23 tools (n8n API: not configured)
```

This means the server is running in **Documentation Mode only** and N8N API management tools are disabled.

---

## Diagnostic Workflow

### STEP 1: Test N8N API Connection

**Purpose:** Verify the N8N API key is valid and the instance is accessible.

**Command:**
```powershell
.\test-n8n-api-connection.ps1
```

**Expected Results:**

✅ **SUCCESS:** 
```
✅ SUCCESS: N8N API Connection Successful!
   Found X workflows
```
→ **Proceed to STEP 2**

❌ **FAILURE:**
```
❌ FAILED: N8N API Connection Failed!
   Error: <details>
```
→ **STOP: Fix the API connection issue first**

**Common Failures:**
- **401 Unauthorized:** API key is invalid or expired → Generate new API key in N8N Settings → API
- **404 Not Found:** N8N instance URL is incorrect → Verify URL
- **Network error:** N8N instance not accessible → Check firewall, DNS, SSL certificate

---

### STEP 2: Test n8n-mcp Server Manually

**Purpose:** Verify if n8n-mcp CAN expose N8N API tools when environment variables are set correctly.

**Command:**
```powershell
.\test-n8n-mcp-manual.ps1
```

**Expected Results:**

✅ **SUCCESS:**
```
[INFO] MCP server initialized with 41 tools (n8n API: configured)
```
→ **DIAGNOSIS: Augment Code is NOT passing environment variables correctly**
→ **Proceed to STEP 3**

❌ **FAILURE (23 tools):**
```
[INFO] MCP server initialized with 23 tools (n8n API: not configured)
```
→ **DIAGNOSIS: n8n-mcp server cannot detect environment variables**
→ **Proceed to STEP 4**

❌ **FAILURE (Connection error):**
```
[ERROR] Failed to connect to n8n API: <error details>
```
→ **DIAGNOSIS: Environment variables are set but connection failed**
→ **Go back to STEP 1 and verify API connection**

---

### STEP 3: Fix Augment Code MCP Configuration

**Purpose:** Update Augment Code configuration to properly pass environment variables.

**Steps:**

1. **Open Augment Settings Panel:**
   - Click gear icon (⚙️) in Augment panel
   - Navigate to MCP section

2. **Delete existing n8nmcp-npx server:**
   - Click "..." menu next to n8nmcp-npx
   - Select "Delete"

3. **Import corrected configuration:**
   - Click "Import from JSON"
   - Open `augment-n8n-mcp-config.json` in this directory
   - Copy the entire JSON content
   - Paste into the import dialog
   - Click "Save"

4. **Restart VS Code:**
   - Press `Ctrl+Shift+P`
   - Type "Reload Window"
   - Press Enter

5. **Verify:**
   - Check Augment Output panel (View → Output → Select "Augment")
   - Look for: `[INFO] MCP server initialized with 41 tools (n8n API: configured)`

**Configuration Changes:**
- Changed `LOG_LEVEL` from `error` to `debug` for better diagnostics
- Changed `DISABLE_CONSOLE_OUTPUT` from `true` to `false` to see initialization messages
- Ensured exact spelling: `N8N_API_URL` and `N8N_API_KEY` (case-sensitive)

---

### STEP 4: Check n8n-mcp Package Version

**Purpose:** Verify if the n8n-mcp package is outdated or has known issues.

**Command:**
```powershell
.\check-n8n-mcp-version.ps1
```

**Actions:**

1. **Check latest version on npm**
2. **Clear npm cache and reinstall:**
   ```powershell
   npm cache clean --force
   npx -y n8n-mcp@latest
   ```

3. **Check GitHub issues:**
   - Visit: https://github.com/czlonkowski/n8n-mcp/issues
   - Search for: "environment variables", "API not configured", "N8N_API_URL"

---

## Success Criteria

After completing the diagnostic workflow, the n8n-mcp server should show:

```
✅ [INFO] MCP server initialized with 41 tools (n8n API: configured)
```

And the following N8N API management tools should be available in Augment Code:
- `n8n_list_workflows_n8n-mcp-npx`
- `n8n_get_workflow_n8n-mcp-npx`
- `n8n_create_workflow_n8n-mcp-npx`
- `n8n_update_partial_workflow_n8n-mcp-npx`
- `n8n_validate_workflow_n8n-mcp-npx`
- `n8n_trigger_webhook_workflow_n8n-mcp-npx`
- And 12+ more N8N API tools

---

## Troubleshooting Matrix

| Symptom | Diagnosis | Solution |
|---------|-----------|----------|
| STEP 1 fails with 401 | API key invalid | Generate new API key in N8N |
| STEP 1 fails with 404 | Wrong URL | Verify N8N instance URL |
| STEP 1 fails with network error | N8N not accessible | Check firewall, DNS, SSL |
| STEP 2 shows 41 tools | Augment not passing env vars | Fix Augment config (STEP 3) |
| STEP 2 shows 23 tools | n8n-mcp can't detect env vars | Update n8n-mcp package (STEP 4) |
| STEP 2 shows connection error | API connection issue | Go back to STEP 1 |

---

## Alternative Solution: Use N8N REST API Directly

If all diagnostic steps fail and n8n-mcp cannot be configured, you can use the N8N REST API directly via PowerShell scripts.

**Example:** The `test-n8n-api-connection.ps1` script already demonstrates how to list workflows using the REST API directly.

**Advantages:**
- No dependency on n8n-mcp MCP server
- Direct control over API calls
- Easier to debug

**Disadvantages:**
- Cannot use MCP tools in Augment Code
- Requires manual PowerShell script execution
- No integration with Augment's AI assistant

---

## Files Created

1. **test-n8n-api-connection.ps1** - Test N8N API connection independently
2. **test-n8n-mcp-manual.ps1** - Test n8n-mcp server with explicit environment variables
3. **check-n8n-mcp-version.ps1** - Check n8n-mcp package version and update commands
4. **augment-n8n-mcp-config.json** - Corrected Augment Code MCP configuration
5. **n8n-mcp-diagnostic-workflow.md** - This document

---

## Next Steps

1. Run `.\test-n8n-api-connection.ps1` first
2. If successful, run `.\test-n8n-mcp-manual.ps1`
3. Based on results, follow the appropriate step in the diagnostic workflow
4. Report back with the results from each step

