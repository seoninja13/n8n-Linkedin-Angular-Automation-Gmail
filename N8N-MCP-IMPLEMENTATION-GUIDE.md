# N8N MCP Server - Step-by-Step Implementation Guide

**Date:** 2025-11-22  
**Architecture:** Monolithic (Direct Node Connections)  
**Estimated Time:** 30-45 minutes

---

## 📋 PREREQUISITES

- ✅ N8N instance running at: `https://n8n.srv972609.hstgr.cloud`
- ✅ N8N API credential configured (ID: `8Mpie43lyRFyX4zw`)
- ✅ API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (already configured)

---

## 🎯 STEP 1: CREATE NEW WORKFLOW

1. **Open N8N Web UI**: https://n8n.srv972609.hstgr.cloud
2. **Create New Workflow**:
   - Click "New Workflow" button
   - Name: `Admin-MCP-Server-Monolithic--Augment`
   - Save the workflow

---

## 🎯 STEP 2: ADD MCP SERVER TRIGGER NODE

1. **Add Node**: Click "+" → Search "MCP Server Trigger"
2. **Configure**:
   - **Path**: `admin-mcp-monolithic` (or generate new UUID)
   - **Authentication**: 
     - Option A: Bearer Auth (recommended for production)
     - Option B: None (for testing only)
   - **WebhookId**: Auto-generated (keep default)

3. **Note the MCP URL**:
   - Test URL: `https://n8n.srv972609.hstgr.cloud/mcp-test/{webhookId}`
   - Production URL: `https://n8n.srv972609.hstgr.cloud/mcp/{webhookId}`

---

## 🎯 STEP 3: ADD N8N API NODES (7 TOOLS)

### **Tool 1: List Workflows**

1. **Add Node**: Click "+" → Search "N8N"
2. **Configure**:
   - **Credential**: Select "N8N API - Admin MCP" (ID: `8Mpie43lyRFyX4zw`)
   - **Resource**: `Workflow`
   - **Operation**: `Get Many`
   - **Return All**: `true`
   - **Filters**: Leave empty (return all workflows)

3. **Configure as AI Tool**:
   - **Node Name**: `List Workflows`
   - **Description**: `List all workflows in the N8N instance. Returns an array of workflow objects with id, name, active status, and metadata.`

4. **Connect to MCP Server Trigger**:
   - Connection type: `ai_tool` (NOT `main`)
   - Drag from MCP Server Trigger's `ai_tool` port to this node

---

### **Tool 2: Get Workflow**

1. **Add Node**: Click "+" → Search "N8N"
2. **Configure**:
   - **Credential**: Select "N8N API - Admin MCP"
   - **Resource**: `Workflow`
   - **Operation**: `Get`
   - **Workflow ID**: `={{ $json.workflowId }}`

3. **Configure as AI Tool**:
   - **Node Name**: `Get Workflow`
   - **Description**: `Get details of a specific workflow by ID. Requires workflowId parameter. Returns complete workflow object including nodes, connections, and settings.`

4. **Connect to MCP Server Trigger**: `ai_tool` connection

---

### **Tool 3: Create Workflow**

1. **Add Node**: Click "+" → Search "N8N"
2. **Configure**:
   - **Credential**: Select "N8N API - Admin MCP"
   - **Resource**: `Workflow`
   - **Operation**: `Create`
   - **Workflow Object**: `={{ $json.workflow }}`

3. **Configure as AI Tool**:
   - **Node Name**: `Create Workflow`
   - **Description**: `Create a new workflow in N8N. Requires workflow object with name, nodes, and connections. Returns the created workflow with assigned ID.`

4. **Connect to MCP Server Trigger**: `ai_tool` connection

---

### **Tool 4: Update Workflow**

1. **Add Node**: Click "+" → Search "N8N"
2. **Configure**:
   - **Credential**: Select "N8N API - Admin MCP"
   - **Resource**: `Workflow`
   - **Operation**: `Update`
   - **Workflow ID**: `={{ $json.workflowId }}`
   - **Update Fields**: `={{ $json.workflow }}`

3. **Configure as AI Tool**:
   - **Node Name**: `Update Workflow`
   - **Description**: `Update an existing workflow by ID. Requires workflowId and workflow object with updated properties. Returns the updated workflow.`

4. **Connect to MCP Server Trigger**: `ai_tool` connection

---

### **Tool 5: Delete Workflow**

1. **Add Node**: Click "+" → Search "N8N"
2. **Configure**:
   - **Credential**: Select "N8N API - Admin MCP"
   - **Resource**: `Workflow`
   - **Operation**: `Delete`
   - **Workflow ID**: `={{ $json.workflowId }}`

3. **Configure as AI Tool**:
   - **Node Name**: `Delete Workflow`
   - **Description**: `Delete a workflow by ID. Requires workflowId parameter. Returns success confirmation.`

4. **Connect to MCP Server Trigger**: `ai_tool` connection

---

### **Tool 6: Activate Workflow**

1. **Add Node**: Click "+" → Search "N8N"
2. **Configure**:
   - **Credential**: Select "N8N API - Admin MCP"
   - **Resource**: `Workflow`
   - **Operation**: `Activate`
   - **Workflow ID**: `={{ $json.workflowId }}`

3. **Configure as AI Tool**:
   - **Node Name**: `Activate Workflow`
   - **Description**: `Activate a workflow by ID to make it run automatically. Requires workflowId parameter. Returns success confirmation.`

4. **Connect to MCP Server Trigger**: `ai_tool` connection

---

### **Tool 7: Deactivate Workflow**

1. **Add Node**: Click "+" → Search "N8N"
2. **Configure**:
   - **Credential**: Select "N8N API - Admin MCP"
   - **Resource**: `Workflow`
   - **Operation**: `Deactivate`
   - **Workflow ID**: `={{ $json.workflowId }}`

3. **Configure as AI Tool**:
   - **Node Name**: `Deactivate Workflow`
   - **Description**: `Deactivate a workflow by ID to stop it from running automatically. Requires workflowId parameter. Returns success confirmation.`

4. **Connect to MCP Server Trigger**: `ai_tool` connection

---

## 🎯 STEP 4: VERIFY CONNECTIONS

**Visual Check**:
```
MCP Server Trigger
    ├─ ai_tool → List Workflows (N8N API)
    ├─ ai_tool → Get Workflow (N8N API)
    ├─ ai_tool → Create Workflow (N8N API)
    ├─ ai_tool → Update Workflow (N8N API)
    ├─ ai_tool → Delete Workflow (N8N API)
    ├─ ai_tool → Activate Workflow (N8N API)
    └─ ai_tool → Deactivate Workflow (N8N API)
```

**Important**: All connections MUST be `ai_tool` type, NOT `main` type.

---

## 🎯 STEP 5: ACTIVATE WORKFLOW

1. **Save Workflow**: Click "Save" button
2. **Activate Workflow**: Toggle the "Active" switch to ON
3. **Note Production URL**: Copy the production MCP URL from the MCP Server Trigger node

---

## 🎯 STEP 6: TEST THE MCP ENDPOINT

### **Option A: Test with Augment Code**

1. **Open Augment Code MCP Settings**
2. **Update Endpoint URL**:
   - Old: `https://n8n.srv972609.hstgr.cloud/mcp/3b6fbdc8-a9ea-4b3e-ba22-19d67c02bef5`
   - New: `https://n8n.srv972609.hstgr.cloud/mcp/{your-new-webhookId}`
3. **Test Connection**: Use `List_Workflows_N8N_MCP_Server_Triger_Admin` tool

### **Option B: Test with PowerShell**

```powershell
$mcpUrl = "https://n8n.srv972609.hstgr.cloud/mcp/{your-webhookId}"
$headers = @{
    "Content-Type" = "application/json"
}

# Test List Workflows tool
$body = @{
    "jsonrpc" = "2.0"
    "id" = 1
    "method" = "tools/call"
    "params" = @{
        "name" = "List Workflows"
        "arguments" = @{}
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri $mcpUrl -Method POST -Headers $headers -Body $body
```

---

## ✅ SUCCESS CRITERIA

- ✅ Workflow is active
- ✅ MCP endpoint responds to requests
- ✅ All 7 tools are available
- ✅ Tools return expected data (not "resource not found" errors)

---

## 🐛 TROUBLESHOOTING

### **Issue: "Resource not found" errors**

**Cause**: N8N API nodes not properly connected to MCP Server Trigger

**Solution**:
1. Check all connections are `ai_tool` type (NOT `main`)
2. Verify N8N API credential is configured correctly
3. Ensure workflow is activated

### **Issue: "Workflow not found" errors**

**Cause**: Workflow ID doesn't exist

**Solution**:
1. Use "List Workflows" tool first to get valid workflow IDs
2. Verify workflow ID format (alphanumeric string)

### **Issue: MCP endpoint not responding**

**Cause**: Workflow not activated or wrong URL

**Solution**:
1. Verify workflow is active (toggle switch is ON)
2. Use production URL (not test URL)
3. Check webhook ID matches the URL

---

## 📚 NEXT STEPS

1. ✅ **Test all 7 tools** with Augment Code or Claude Desktop
2. ✅ **Update Augment Code MCP configuration** with new endpoint URL
3. ✅ **Retire old sub-workflow architecture** (delete old workflows)
4. ✅ **Document the new architecture** for team reference

---

**Files Created**:
- `N8N-MCP-ARCHITECTURE-REDESIGN-COMPLETE.md` - Architecture analysis
- `N8N-MCP-IMPLEMENTATION-GUIDE.md` - This implementation guide

