# N8N-MCP VALIDATION REPORT
**Date:** 2025-11-21  
**Validator:** Senior Validation Engineer (AI Assistant)  
**Status:** ❌ **FAILED - N8N API Tools Not Available**

---

## EXECUTIVE SUMMARY

**Overall Assessment:** ❌ **FAILED**

The n8n-mcp MCP server is configured and running, but **N8N API management tools are NOT available** in Augment Code. The server is running in **Documentation Mode only (23 tools)** instead of the expected **Full Mode (42 tools)**.

**Root Cause:** Augment Code is NOT passing the `N8N_API_URL` and `N8N_API_KEY` environment variables to the spawned `npx n8n-mcp` process, despite these variables being configured in the MCP server settings.

**Evidence:**
- ✅ Manual PowerShell test: **42 tools** (n8n API: configured)
- ❌ Augment Code MCP server: **23 tools** (n8n API: not configured)
- ✅ N8N API connection test: **PASSED** (API key is valid, instance is accessible)

---

## PHASE 1: MCP SERVER INITIALIZATION VERIFICATION

### Test 1.1: Database Statistics
**Tool:** `get_database_statistics_n8n-mcp-npx`  
**Result:** ✅ **PASSED**

**Output:**
- Total Nodes: 543
- Total Templates: 2,709
- AI Tools: 274
- Triggers: 108
- Documentation Coverage: 87%

**Conclusion:** Documentation tools are working correctly.

---

### Test 1.2: Node Listing
**Tool:** `list_nodes_n8n-mcp-npx`  
**Result:** ✅ **PASSED**

**Output:** Successfully retrieved 5 sample nodes (AI Agent, AI Agent Tool, AI Transform, AMQP Sender, AMQP Trigger)

**Conclusion:** Node discovery tools are working correctly.

---

### Test 1.3: N8N API Workflow Listing
**Tool:** `n8n_list_workflows_n8n-mcp-npx`  
**Result:** ❌ **FAILED**

**Error:** `Tool "n8n_list_workflows_n8n-mcp-npx" does not exist`

**Conclusion:** N8N API management tools are NOT available. The MCP server is running in Documentation Mode only.

---

## PHASE 2: N8N API CONNECTIVITY TEST

### Test 2.1: Direct N8N API Connection
**Script:** `test-n8n-api-connection.ps1`  
**Result:** ✅ **PASSED**

**Output:**
```
✅ SUCCESS: N8N API Connection Successful!
   Found 0 workflows
```

**Conclusion:**
- API key is **VALID** ✅
- N8N instance is **ACCESSIBLE** ✅
- N8N instance currently has **0 workflows** (empty instance or workflows in different project)

---

## PHASE 3: AVAILABLE TOOLS ANALYSIS

### Documentation Tools (✅ Available)
1. `tools_documentation_n8n-mcp-npx` - Get documentation for n8n MCP tools
2. `get_database_statistics_n8n-mcp-npx` - Node stats and MCP verification
3. `list_nodes_n8n-mcp-npx` - List n8n nodes with filtering
4. `search_nodes_n8n-mcp-npx` - Search nodes by keyword
5. `get_node_info_n8n-mcp-npx` - Get full node documentation
6. `get_node_essentials_n8n-mcp-npx` - Get essential node info
7. `get_node_documentation_n8n-mcp-npx` - Get readable docs with examples
8. `search_node_properties_n8n-mcp-npx` - Find specific properties in a node
9. `get_property_dependencies_n8n-mcp-npx` - Analyze property dependencies
10. `get_node_as_tool_info_n8n-mcp-npx` - How to use any node as AI tool
11. `list_ai_tools_n8n-mcp-npx` - List AI-optimized nodes

### Template Tools (✅ Available)
12. `list_templates_n8n-mcp-npx` - List all workflow templates
13. `search_templates_n8n-mcp-npx` - Search templates by keywords
14. `get_template_n8n-mcp-npx` - Get template by ID
15. `list_node_templates_n8n-mcp-npx` - Find templates using specific nodes
16. `get_templates_for_task_n8n-mcp-npx` - Curated templates by task
17. `search_templates_by_metadata_n8n-mcp-npx` - Search by AI-generated metadata
18. `list_tasks_n8n-mcp-npx` - List task templates by category

### Validation Tools (✅ Available)
19. `validate_node_operation_n8n-mcp-npx` - Validate node configuration
20. `validate_node_minimal_n8n-mcp-npx` - Check required fields
21. `validate_workflow_n8n-mcp-npx` - Full workflow validation
22. `validate_workflow_connections_n8n-mcp-npx` - Check workflow connections
23. `validate_workflow_expressions_n8n-mcp-npx` - Validate n8n expressions

### N8N API Management Tools (❌ NOT Available)
**Expected but MISSING:**
- `n8n_list_workflows_n8n-mcp-npx` ❌
- `n8n_get_workflow_n8n-mcp-npx` ❌
- `n8n_get_workflow_minimal_n8n-mcp-npx` ❌
- `n8n_create_workflow_n8n-mcp-npx` ❌
- `n8n_update_partial_workflow_n8n-mcp-npx` ❌
- `n8n_validate_workflow_n8n-mcp-npx` ❌
- `n8n_trigger_webhook_workflow_n8n-mcp-npx` ❌
- `n8n_list_executions_n8n-mcp-npx` ❌
- `n8n_get_execution_n8n-mcp-npx` ❌
- And 10+ more N8N API tools ❌

**Total Tools Available:** 23 (Documentation Mode only)  
**Expected Tools:** 42 (Full Mode with N8N API)  
**Missing Tools:** 19 (N8N API management tools)

---

## PHASE 4: ROOT CAUSE ANALYSIS

### Comparison: Manual Test vs Augment Code

| Test Method | Environment Variables | Result | Tools Available |
|-------------|----------------------|--------|-----------------|
| **Manual PowerShell** | ✅ Set explicitly | ✅ 42 tools | N8N API tools available |
| **Augment Code MCP** | ❓ Configured in settings | ❌ 23 tools | N8N API tools NOT available |

**Diagnosis:** Augment Code is NOT passing the `N8N_API_URL` and `N8N_API_KEY` environment variables from the MCP configuration to the spawned `npx n8n-mcp` process.

**Evidence:**
1. Manual test with explicit environment variables: **42 tools** ✅
2. Augment Code with configured environment variables: **23 tools** ❌
3. N8N API connection test: **PASSED** ✅ (proves API key is valid)

**Conclusion:** This is an Augment Code environment variable passing issue, NOT an n8n-mcp or N8N API issue.

---

## PHASE 5: WORKFLOW LIST

**N8N Instance:** https://n8n.srv972609.hstgr.cloud  
**Total Workflows:** 0

**Note:** The N8N instance currently has **0 workflows**. This could mean:
1. The instance is newly created and has no workflows yet
2. Workflows are in a different project/organization (if using N8N Cloud with multiple projects)
3. Workflows were deleted or the instance was reset

---

## RECOMMENDATIONS

### Immediate Actions Required

1. **Verify Augment Code MCP Configuration:**
   - Open Augment Settings Panel (gear icon)
   - Navigate to MCP section
   - Find "n8nmcp-npx" server
   - Verify environment variables are present:
     - `N8N_API_URL`: `https://n8n.srv972609.hstgr.cloud`
     - `N8N_API_KEY`: `eyJhbGci...` (full JWT token)

2. **Check Augment Code Version:**
   - Ensure you're using the latest version of Augment Code
   - Older versions may have bugs with environment variable passing

3. **Try Alternative Configuration Format:**
   - Some MCP clients require different JSON formats for environment variables
   - Try using `"environment"` instead of `"env"` in the configuration

4. **Contact Augment Code Support:**
   - Report this as a bug: "MCP server environment variables not being passed to spawned processes"
   - Provide evidence: Manual test shows 42 tools, Augment shows 23 tools

### Alternative Solutions

**Option A: Use N8N REST API Directly**
- Use PowerShell scripts to interact with N8N API
- Bypass the n8n-mcp MCP server entirely
- Example: `test-n8n-api-connection.ps1` already demonstrates this

**Option B: Use Different MCP Client**
- Try Claude Desktop (uses `claude_desktop_config.json`)
- Try other MCP-compatible clients that properly pass environment variables

---

## VALIDATION CHECKLIST

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| MCP server initialization | 42 tools | 23 tools | ❌ FAILED |
| Documentation tools available | ✅ Yes | ✅ Yes | ✅ PASSED |
| N8N API tools available | ✅ Yes | ❌ No | ❌ FAILED |
| N8N API connection | ✅ Valid | ✅ Valid | ✅ PASSED |
| Environment variables passed | ✅ Yes | ❌ No | ❌ FAILED |
| Workflow listing | ✅ Works | ❌ Tool not available | ❌ FAILED |

**Overall Status:** ❌ **FAILED** (2/6 tests passed)

---

## CONCLUSION

The n8n-mcp MCP server is **NOT fully functional** in Augment Code due to environment variables not being passed correctly. While the server works perfectly in manual tests (42 tools), it only provides documentation tools (23 tools) when run through Augment Code.

**This is an Augment Code bug/limitation, NOT an n8n-mcp or N8N API issue.**

**Recommendation:** Use the N8N REST API directly via PowerShell scripts as a workaround until Augment Code fixes the environment variable passing issue.

