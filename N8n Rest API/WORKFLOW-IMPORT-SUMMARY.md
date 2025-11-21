# Admin MCP Server Workflow - Import Summary

**File:** `admin-mcp-server-workflow-complete.json`  
**Status:** ✅ Ready to Import  
**Date:** 2025-11-20

---

## 🎯 Workflow Specifications

### Generated UUIDs

**MCP Server Trigger:**
- **Path UUID:** `7a8f3d2e-9c4b-4e1a-b5f6-8d7c9e2a1b3c`
- **Webhook ID:** `7a8f3d2e-9c4b-4e1a-b5f6-8d7c9e2a1b3c` (matches path)
- **Node ID:** `4f5e6d7c-8b9a-4c3d-9e2f-1a0b3c4d5e6f`

**MCP Endpoint URL (after activation):**
```
https://n8n.srv972609.hstgr.cloud/webhook/7a8f3d2e-9c4b-4e1a-b5f6-8d7c9e2a1b3c
```

### Node IDs

1. **MCP Server Trigger:** `4f5e6d7c-8b9a-4c3d-9e2f-1a0b3c4d5e6f`
2. **List Workflows Tool:** `1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d`
3. **Get Workflow Tool:** `2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e`
4. **Create Workflow Tool:** `3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f`
5. **Update Workflow Tool:** `4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8a`
6. **Delete Workflow Tool:** `5e6f7a8b-9c0d-4e1f-2a3b-4c5d6e7f8a9b`
7. **Activate Workflow Tool:** `6f7a8b9c-0d1e-4f2a-3b4c-5d6e7f8a9b0c`
8. **Deactivate Workflow Tool:** `7a8b9c0d-1e2f-4a3b-4c5d-6e7f8a9b0c1d`

---

## 📋 Quick Import Checklist

### Before Import

- [ ] **Create n8nApi credential:**
  - Name: `n8n API`
  - API URL: `https://n8n.srv972609.hstgr.cloud`
  - API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Test credential (should show ✅)

### Import Steps

1. **Copy JSON:**
   - File: `N8n Rest API/admin-mcp-server-workflow-complete.json`
   - Copy entire contents

2. **Import to N8N:**
   - N8N Web UI → Workflows → Add Workflow → Import from File
   - Select "Import from Text" tab
   - Paste JSON
   - Click "Import"

3. **Configure Credentials:**
   - For EACH of the 7 n8n tool nodes:
     - Click on node
     - Select "n8n API" credential from dropdown
     - Save node
   - Nodes to update:
     - List Workflows Tool
     - Get Workflow Tool
     - Create Workflow Tool
     - Update Workflow Tool
     - Delete Workflow Tool
     - Activate Workflow Tool
     - Deactivate Workflow Tool

4. **Save and Activate:**
   - Press Ctrl+S to save workflow
   - Toggle "Active" in top-right corner
   - Verify workflow status shows "Active"

### After Import

- [ ] **Test manually:**
  - Click "List Workflows Tool" node
  - Click "Execute Node"
  - Should return array of ALL workflows

- [ ] **Verify MCP endpoint:**
  - URL: `https://n8n.srv972609.hstgr.cloud/webhook/7a8f3d2e-9c4b-4e1a-b5f6-8d7c9e2a1b3c`
  - Should NOT return 404 error

---

## ⚙️ Claude Desktop Configuration

After workflow is active, add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "n8n-mcp-node-discovery": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "N8N_API_URL": "https://n8n.srv972609.hstgr.cloud",
        "N8N_API_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    },
    "n8n-admin-mcp-server": {
      "url": "https://n8n.srv972609.hstgr.cloud/webhook/7a8f3d2e-9c4b-4e1a-b5f6-8d7c9e2a1b3c",
      "headers": {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

**Important:** Replace `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your full API key.

---

## 🧪 Testing

### Test 1: Manual Execution in N8N

1. Open workflow in N8N Web UI
2. Click "List Workflows Tool" node
3. Click "Execute Node"
4. **Expected Result:**
   - Output shows array of workflows
   - Includes ALL workflows in your instance
   - Should see LinkedIn workflows, Contact Enrichment, Admin MCP Server, etc.

### Test 2: Claude Desktop Integration

1. Restart Claude Desktop
2. Ask: "List all workflows in my N8N instance"
3. **Expected Result:**
   - Claude calls `n8n-admin-mcp-server.list_workflows` tool
   - Returns complete list of workflows with names and IDs

### Test 3: Get Specific Workflow

1. In Claude Desktop, ask: "Show me details of the LinkedIn Outreach workflow"
2. **Expected Result:**
   - Claude calls list_workflows to find the workflow
   - Claude calls get_workflow with the workflow ID
   - Displays workflow details (nodes, connections, active status)

---

## 📊 Workflow Structure

```
Admin-MCP-Server--Augment
│
├─ MCP Server Trigger (@n8n/n8n-nodes-langchain.mcpTrigger v2)
│  ├─ Path: 7a8f3d2e-9c4b-4e1a-b5f6-8d7c9e2a1b3c
│  ├─ Webhook ID: 7a8f3d2e-9c4b-4e1a-b5f6-8d7c9e2a1b3c
│  └─ Position: [250, 300]
│
├─ List Workflows Tool (n8n-nodes-base.n8n v1)
│  ├─ Operation: getAll
│  ├─ Returns: ALL workflows
│  └─ Position: [500, 100]
│
├─ Get Workflow Tool (n8n-nodes-base.n8n v1)
│  ├─ Operation: get
│  ├─ Input: workflowId
│  └─ Position: [500, 200]
│
├─ Create Workflow Tool (n8n-nodes-base.n8n v1)
│  ├─ Operation: create
│  ├─ Input: workflowObject
│  └─ Position: [500, 300]
│
├─ Update Workflow Tool (n8n-nodes-base.n8n v1)
│  ├─ Operation: update
│  ├─ Input: workflowId, workflowObject
│  └─ Position: [500, 400]
│
├─ Delete Workflow Tool (n8n-nodes-base.n8n v1)
│  ├─ Operation: delete
│  ├─ Input: workflowId
│  └─ Position: [500, 500]
│
├─ Activate Workflow Tool (n8n-nodes-base.n8n v1)
│  ├─ Operation: activate
│  ├─ Input: workflowId
│  └─ Position: [500, 600]
│
└─ Deactivate Workflow Tool (n8n-nodes-base.n8n v1)
   ├─ Operation: deactivate
   ├─ Input: workflowId
   └─ Position: [500, 700]
```

---

## 🔑 Key Features

✅ **Complete JSON Structure:** All nodes, connections, and metadata included  
✅ **Unique UUIDs:** Generated for all nodes and MCP Server Trigger path  
✅ **Proper Type Versions:** MCP Server Trigger v2, n8n nodes v1  
✅ **Correct Connections:** All 7 tools connected to MCP Server Trigger  
✅ **Instance-Level Access:** All tools can access ANY workflow in your instance  
✅ **Ready to Import:** Valid JSON that can be directly imported  
✅ **Credential Placeholder:** Easy to replace after import  

---

## ⚠️ Important Notes

### Credential Configuration

**After import, you MUST configure credentials for all 7 n8n tool nodes.**

The JSON contains placeholder: `"id": "PLACEHOLDER_CREDENTIAL_ID"`

**To fix:**
1. Click on each n8n tool node
2. Select "n8n API" credential from dropdown
3. N8N will automatically replace the placeholder with the correct credential ID
4. Save the node

### MCP Endpoint URL

The MCP endpoint will be available at:
```
https://n8n.srv972609.hstgr.cloud/webhook/7a8f3d2e-9c4b-4e1a-b5f6-8d7c9e2a1b3c
```

**Use this URL in your Claude Desktop configuration.**

### Workflow Must Be Active

The MCP endpoint only works when the workflow is ACTIVE. Make sure to:
1. Save the workflow
2. Toggle "Active" in top-right corner
3. Verify the toggle shows green "Active" status

---

## ✅ Success Criteria

After completing the import and configuration:

- ✅ Workflow imported with 8 nodes (1 trigger + 7 tools)
- ✅ All 7 n8n tool nodes have n8nApi credential configured
- ✅ Workflow is saved and ACTIVE
- ✅ "List Workflows Tool" returns ALL workflows when tested manually
- ✅ MCP endpoint accessible (not 404)
- ✅ Claude Desktop configured with correct webhook URL
- ✅ Claude can list workflows from Claude Desktop
- ✅ Full programmatic workflow management enabled

---

**Status:** ✅ **READY FOR IMPORT**  
**Estimated Setup Time:** 15-20 minutes  
**Next Step:** Follow the Quick Import Checklist above

