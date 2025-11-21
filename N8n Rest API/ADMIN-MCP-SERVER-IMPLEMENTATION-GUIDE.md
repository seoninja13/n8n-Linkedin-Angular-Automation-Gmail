# Admin MCP Server Implementation Guide

**Purpose:** Step-by-step guide to create N8N workflow that exposes workflow management tools via MCP  
**Estimated Time:** 2-4 hours  
**Difficulty:** Medium  
**Prerequisites:** N8N instance access, Claude Desktop installed

---

## 📋 Overview

This guide will help you create an "Admin MCP Server" workflow in N8N that exposes workflow management operations as MCP tools, enabling programmatic workflow control from Claude Desktop.

**What You'll Build:**
- N8N workflow with MCP Server Trigger node
- 7 workflow management tools (create, update, delete, activate, deactivate, list, get)
- HTTP/SSE MCP endpoint accessible from Claude Desktop

**What You'll Achieve:**
- Programmatic workflow creation from Claude
- Programmatic workflow updates from Claude
- Programmatic workflow activation/deactivation from Claude
- Full workflow management without N8N Web UI

---

## 🔧 Phase 1: Create Admin MCP Server Workflow

### Step 1: Create New Workflow

1. **Open N8N Web UI:** https://n8n.srv972609.hstgr.cloud
2. **Click "New Workflow"**
3. **Name the workflow:** `Admin-MCP-Server--Augment`
4. **Save the workflow** (Ctrl+S or click Save button)

### Step 2: Add MCP Server Trigger Node

1. **Click "+" to add node**
2. **Search for:** "MCP Server Trigger"
3. **Select:** MCP Server Trigger (@n8n/n8n-nodes-langchain.mcpTrigger)
4. **Configure:**
   - **Path:** `/mcp-server/admin`
   - **Authentication:** Select "N8N API Key" (create if needed)
   - **Transport:** HTTP/SSE (default)
5. **Save node**

### Step 3: Create n8nApi Credential (If Not Exists)

1. **Click on MCP Server Trigger node**
2. **Click "Create New Credential"** for Authentication
3. **Select:** n8nApi
4. **Configure:**
   - **API URL:** `https://n8n.srv972609.hstgr.cloud`
   - **API Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your existing key)
5. **Test credential** (should show green checkmark)
6. **Save credential**

### Step 4: Add Workflow Management Tools

For each tool below, follow this pattern:

#### Tool 1: List Workflows

1. **Add n8n node** (nodes-base.n8n)
2. **Configure:**
   - **Resource:** Workflow
   - **Operation:** Get Many
   - **Return All:** true
   - **Filters:**
     - Return Only Active Workflows: false (to see all workflows)
3. **Connect to MCP Server Trigger** (drag from MCP Server Trigger output to n8n node input)
4. **Rename node:** "List Workflows Tool"

#### Tool 2: Get Workflow

1. **Add n8n node** (nodes-base.n8n)
2. **Configure:**
   - **Resource:** Workflow
   - **Operation:** Get
   - **Workflow:** Select "ID" mode
   - **ID:** `={{ $json.workflowId }}` (parameter from MCP call)
3. **Connect to MCP Server Trigger**
4. **Rename node:** "Get Workflow Tool"

#### Tool 3: Create Workflow

1. **Add n8n node** (nodes-base.n8n)
2. **Configure:**
   - **Resource:** Workflow
   - **Operation:** Create
   - **Workflow Object:**
     ```json
     {
       "name": "={{ $json.name }}",
       "nodes": "={{ $json.nodes }}",
       "connections": "={{ $json.connections }}",
       "settings": "={{ $json.settings || {} }}"
     }
     ```
3. **Connect to MCP Server Trigger**
4. **Rename node:** "Create Workflow Tool"

#### Tool 4: Update Workflow

1. **Add n8n node** (nodes-base.n8n)
2. **Configure:**
   - **Resource:** Workflow
   - **Operation:** Update
   - **Workflow:** Select "ID" mode
   - **ID:** `={{ $json.workflowId }}`
   - **Workflow Object:**
     ```json
     {
       "name": "={{ $json.name }}",
       "nodes": "={{ $json.nodes }}",
       "connections": "={{ $json.connections }}",
       "settings": "={{ $json.settings || {} }}"
     }
     ```
3. **Connect to MCP Server Trigger**
4. **Rename node:** "Update Workflow Tool"

#### Tool 5: Delete Workflow

1. **Add n8n node** (nodes-base.n8n)
2. **Configure:**
   - **Resource:** Workflow
   - **Operation:** Delete
   - **Workflow:** Select "ID" mode
   - **ID:** `={{ $json.workflowId }}`
3. **Connect to MCP Server Trigger**
4. **Rename node:** "Delete Workflow Tool"

#### Tool 6: Activate Workflow

1. **Add n8n node** (nodes-base.n8n)
2. **Configure:**
   - **Resource:** Workflow
   - **Operation:** Activate
   - **Workflow:** Select "ID" mode
   - **ID:** `={{ $json.workflowId }}`
3. **Connect to MCP Server Trigger**
4. **Rename node:** "Activate Workflow Tool"

#### Tool 7: Deactivate Workflow

1. **Add n8n node** (nodes-base.n8n)
2. **Configure:**
   - **Resource:** Workflow
   - **Operation:** Deactivate
   - **Workflow:** Select "ID" mode
   - **ID:** `={{ $json.workflowId }}`
3. **Connect to MCP Server Trigger**
4. **Rename node:** "Deactivate Workflow Tool"

### Step 5: Activate Workflow

1. **Save workflow** (Ctrl+S)
2. **Click "Active" toggle** in top-right corner
3. **Verify:** Workflow status shows "Active"

### Step 6: Get MCP Endpoint URL

1. **Click on MCP Server Trigger node**
2. **Copy the webhook URL** (should be: `https://n8n.srv972609.hstgr.cloud/mcp-server/admin`)
3. **Save this URL** for Claude Desktop configuration

---

## 🔧 Phase 2: Configure Claude Desktop

### Step 1: Locate Configuration File

**Windows:**
```
C:\Users\<YourUsername>\AppData\Roaming\Claude\claude_desktop_config.json
```

**Mac:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Step 2: Update Configuration

1. **Open claude_desktop_config.json** in text editor
2. **Add new MCP server entry:**

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
      "url": "https://n8n.srv972609.hstgr.cloud/mcp-server/admin",
      "headers": {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

3. **Save file**

### Step 3: Restart Claude Desktop

1. **Close Claude Desktop completely**
2. **Reopen Claude Desktop**
3. **Wait for MCP servers to initialize** (check status bar)

---

## 🧪 Phase 3: Test Workflow Management Tools

### Test 1: List Workflows

**In Claude Desktop, type:**
```
List all workflows in my N8N instance
```

**Expected Result:**
- Claude calls `n8n-admin-mcp-server` list_workflows tool
- Returns list of all workflows with IDs, names, and active status

### Test 2: Create Workflow

**In Claude Desktop, type:**
```
Create a test workflow named "test-mcp-1" with a manual trigger node
```

**Expected Result:**
- Claude calls `n8n-admin-mcp-server` create_workflow tool
- Returns new workflow ID
- Workflow appears in N8N Web UI

### Test 3: Activate Workflow

**In Claude Desktop, type:**
```
Activate workflow test-mcp-1
```

**Expected Result:**
- Claude calls `n8n-admin-mcp-server` activate_workflow tool
- Workflow status changes to "Active" in N8N Web UI

### Test 4: Update Workflow

**In Claude Desktop, type:**
```
Update workflow test-mcp-1 to add a Set node
```

**Expected Result:**
- Claude calls `n8n-admin-mcp-server` update_workflow tool
- Workflow updated in N8N Web UI

### Test 5: Deactivate Workflow

**In Claude Desktop, type:**
```
Deactivate workflow test-mcp-1
```

**Expected Result:**
- Claude calls `n8n-admin-mcp-server` deactivate_workflow tool
- Workflow status changes to "Inactive" in N8N Web UI

### Test 6: Delete Workflow

**In Claude Desktop, type:**
```
Delete workflow test-mcp-1
```

**Expected Result:**
- Claude calls `n8n-admin-mcp-server` delete_workflow tool
- Workflow removed from N8N Web UI

---

## ⚠️ Troubleshooting

### Issue: MCP Server Not Appearing in Claude Desktop

**Solution:**
1. Check claude_desktop_config.json syntax (valid JSON)
2. Verify URL is correct: `https://n8n.srv972609.hstgr.cloud/mcp-server/admin`
3. Restart Claude Desktop completely
4. Check Claude Desktop logs for errors

### Issue: Authentication Failed

**Solution:**
1. Verify API key is correct in both:
   - N8N n8nApi credential
   - Claude Desktop config Authorization header
2. Ensure API key has workflow management permissions
3. Test API key with curl:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://n8n.srv972609.hstgr.cloud/api/v1/workflows
   ```

### Issue: Tools Not Executing

**Solution:**
1. Verify Admin MCP Server workflow is ACTIVE
2. Check N8N execution logs for errors
3. Verify all n8n nodes are properly connected to MCP Server Trigger
4. Test individual tools manually in N8N Web UI

### Issue: Workflow Creation Fails

**Solution:**
1. Verify workflow JSON structure is valid
2. Check that all required fields are present (name, nodes, connections, settings)
3. Review N8N execution logs for specific error messages

---

## ✅ Success Criteria

- ✅ Admin MCP Server workflow created and active in N8N
- ✅ Claude Desktop shows "n8n-admin-mcp-server" in MCP servers list
- ✅ Can list workflows from Claude Desktop
- ✅ Can create workflows from Claude Desktop
- ✅ Can update workflows from Claude Desktop
- ✅ Can activate/deactivate workflows from Claude Desktop
- ✅ Can delete workflows from Claude Desktop

---

## 📚 Additional Resources

- **N8N MCP Server Trigger Documentation:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.mcptrigger/
- **N8N n8n Node Documentation:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n/
- **N8N API Reference:** https://docs.n8n.io/api/
- **Claude Desktop MCP Documentation:** https://modelcontextprotocol.io/

---

**Implementation Status:** Ready for deployment  
**Last Updated:** 2025-11-20

