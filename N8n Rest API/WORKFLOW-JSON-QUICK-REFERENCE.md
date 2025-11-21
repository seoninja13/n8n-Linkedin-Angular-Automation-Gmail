# Admin MCP Server Workflow - Quick Reference

**File:** `admin-mcp-server-workflow.json`  
**Status:** ✅ Ready to Import  
**Date:** 2025-11-20

---

## 📦 Workflow Contents

### Nodes Included (8 Total)

1. **MCP Server Trigger** (@n8n/n8n-nodes-langchain.mcpTrigger)
   - Path: `/mcp-server/admin`
   - Authentication: n8nApi
   - Position: [250, 300]

2. **List Workflows Tool** (n8n-nodes-base.n8n)
   - Resource: workflow
   - Operation: getAll
   - Returns: ALL workflows in instance
   - Position: [500, 100]

3. **Get Workflow Tool** (n8n-nodes-base.n8n)
   - Resource: workflow
   - Operation: get
   - Input: workflowId
   - Position: [500, 200]

4. **Create Workflow Tool** (n8n-nodes-base.n8n)
   - Resource: workflow
   - Operation: create
   - Input: workflowObject JSON
   - Position: [500, 300]

5. **Update Workflow Tool** (n8n-nodes-base.n8n)
   - Resource: workflow
   - Operation: update
   - Input: workflowId, workflowObject JSON
   - Position: [500, 400]

6. **Delete Workflow Tool** (n8n-nodes-base.n8n)
   - Resource: workflow
   - Operation: delete
   - Input: workflowId
   - Position: [500, 500]

7. **Activate Workflow Tool** (n8n-nodes-base.n8n)
   - Resource: workflow
   - Operation: activate
   - Input: workflowId
   - Position: [500, 600]

8. **Deactivate Workflow Tool** (n8n-nodes-base.n8n)
   - Resource: workflow
   - Operation: deactivate
   - Input: workflowId
   - Position: [500, 700]

---

## 🔗 Connections

All 7 n8n nodes are connected to the MCP Server Trigger:

```
MCP Server Trigger → List Workflows Tool
MCP Server Trigger → Get Workflow Tool
MCP Server Trigger → Create Workflow Tool
MCP Server Trigger → Update Workflow Tool
MCP Server Trigger → Delete Workflow Tool
MCP Server Trigger → Activate Workflow Tool
MCP Server Trigger → Deactivate Workflow Tool
```

---

## ⚙️ Configuration Required After Import

### 1. Create n8nApi Credential FIRST

**Before importing:**
- Credential Type: n8nApi
- Credential Name: `n8n API`
- API URL: `https://n8n.srv972609.hstgr.cloud`
- API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Update Credential References in Workflow

**After importing, for EACH of the 7 n8n nodes:**
- Click on node
- Select "n8n API" credential from dropdown
- Save node

**Placeholder in JSON:**
```json
"credentials": {
  "n8nApi": {
    "id": "REPLACE_WITH_YOUR_N8N_API_CREDENTIAL_ID",
    "name": "n8n API"
  }
}
```

**After import, N8N will:**
- Show credential selection dropdown
- Allow you to select the "n8n API" credential you created
- Automatically replace the placeholder ID

---

## 📋 Import Checklist

**Before Import:**
- [ ] Create n8nApi credential
- [ ] Test credential (green checkmark)
- [ ] Note credential ID (optional)

**During Import:**
- [ ] Copy JSON from `admin-mcp-server-workflow.json`
- [ ] Import via "Import from File" or "Import from Text"
- [ ] Verify 8 nodes imported

**After Import:**
- [ ] Update credential on all 7 n8n nodes
- [ ] Verify MCP Server Trigger authentication
- [ ] Save workflow
- [ ] Activate workflow
- [ ] Test "List Workflows Tool" manually

**Claude Desktop Setup:**
- [ ] Add HTTP MCP server to claude_desktop_config.json
- [ ] Restart Claude Desktop
- [ ] Test "List all workflows" command

---

## 🎯 Expected MCP Endpoint

After activation, the workflow creates this endpoint:

```
https://n8n.srv972609.hstgr.cloud/mcp-server/admin
```

**Use in Claude Desktop config:**
```json
{
  "mcpServers": {
    "n8n-admin-mcp-server": {
      "url": "https://n8n.srv972609.hstgr.cloud/mcp-server/admin",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
      }
    }
  }
}
```

---

## 🧪 Quick Test

**After import and configuration:**

1. **Manual Test in N8N:**
   - Click "List Workflows Tool" node
   - Click "Execute Node"
   - Should return array of ALL workflows

2. **Claude Desktop Test:**
   - Ask: "List all workflows in my N8N instance"
   - Should return complete list

**If both tests pass:** ✅ Setup is complete and working

---

## 📊 Visual Layout

```
                    MCP Server Trigger
                         (250, 300)
                              |
        ┌─────────────────────┼─────────────────────┐
        |                     |                     |
        v                     v                     v
List Workflows Tool   Get Workflow Tool   Create Workflow Tool
    (500, 100)           (500, 200)           (500, 300)
        
        |                     |                     |
        v                     v                     v
Update Workflow Tool  Delete Workflow Tool  Activate Workflow Tool
    (500, 400)           (500, 500)           (500, 600)
        
                              |
                              v
                   Deactivate Workflow Tool
                         (500, 700)
```

---

## 🔑 Key Features

✅ **Instance-Level Access:** All tools can access ANY workflow in your N8N instance  
✅ **Complete CRUD Operations:** Create, Read, Update, Delete workflows  
✅ **Activation Control:** Activate/Deactivate any workflow  
✅ **MCP Integration:** Exposes tools via HTTP/SSE for Claude Desktop  
✅ **Ready to Import:** No manual node creation required  
✅ **Proper Connections:** All nodes pre-connected to MCP Server Trigger  

---

## 📝 Files in This Package

1. **admin-mcp-server-workflow.json** - The importable workflow JSON
2. **ADMIN-MCP-SERVER-IMPORT-GUIDE.md** - Complete step-by-step import instructions
3. **WORKFLOW-JSON-QUICK-REFERENCE.md** - This quick reference (you are here)
4. **N8N-NATIVE-MCP-ANALYSIS.md** - Architecture analysis and rationale
5. **ADMIN-MCP-SERVER-CONCRETE-EXAMPLE.md** - Detailed configuration examples
6. **ARCHITECTURE-CLARIFICATION-SUMMARY.md** - Permission model explanation

---

**Status:** ✅ Ready for Import  
**Estimated Setup Time:** 15-30 minutes  
**Difficulty:** Medium  
**Prerequisites:** N8N instance access, API key, Claude Desktop installed

