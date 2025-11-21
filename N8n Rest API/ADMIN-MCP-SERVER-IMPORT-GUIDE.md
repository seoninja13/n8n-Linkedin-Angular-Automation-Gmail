# Admin MCP Server - Import & Configuration Guide

**Workflow File:** `admin-mcp-server-workflow.json`  
**Workflow Name:** Admin-MCP-Server--Augment  
**Purpose:** Enable programmatic workflow management from Claude Desktop  
**Date:** 2025-11-20

---

## 📋 Prerequisites

Before importing the workflow, you need:

1. **N8N Instance Access:**
   - URL: https://n8n.srv972609.hstgr.cloud
   - Admin/Owner permissions

2. **N8N API Key:**
   - Your existing API key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - This key must have workflow management permissions

3. **MCP Server Trigger Node Available:**
   - Node type: `@n8n/n8n-nodes-langchain.mcpTrigger`
   - This is a built-in node in recent N8N versions
   - If not available, update your N8N instance

---

## 🔧 Step 1: Create n8nApi Credential

**IMPORTANT:** Create this credential BEFORE importing the workflow.

### 1.1 Navigate to Credentials

1. Open N8N Web UI: https://n8n.srv972609.hstgr.cloud
2. Click on **"Credentials"** in the left sidebar
3. Click **"Add Credential"** button

### 1.2 Create n8nApi Credential

1. **Search for:** "n8n"
2. **Select:** "n8n API"
3. **Configure:**
   - **Credential Name:** `n8n API` (exactly this name)
   - **API URL:** `https://n8n.srv972609.hstgr.cloud`
   - **API Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full API key)
4. **Click "Test"** - Should show green checkmark ✅
5. **Click "Save"**

### 1.3 Note the Credential ID

After saving, the credential will have an ID (visible in the URL or credential list).

**Example:** If the credential ID is `abc123def456`, you'll need this for the next step.

**How to Find Credential ID:**
1. Click on the saved credential to edit it
2. Look at the URL: `https://n8n.srv972609.hstgr.cloud/credentials/abc123def456`
3. The ID is the last part: `abc123def456`

---

## 📥 Step 2: Import Workflow

### 2.1 Download Workflow JSON

1. **File Location:** `N8n Rest API/admin-mcp-server-workflow.json`
2. **Copy the entire JSON content** from the file

### 2.2 Import into N8N

**Method 1: Import from Clipboard**

1. Open N8N Web UI
2. Click **"Workflows"** in left sidebar
3. Click **"Add Workflow"** dropdown
4. Select **"Import from File"**
5. Click **"Import from Text"** tab
6. **Paste the JSON** from `admin-mcp-server-workflow.json`
7. Click **"Import"**

**Method 2: Import from File**

1. Save `admin-mcp-server-workflow.json` to your local machine
2. Open N8N Web UI
3. Click **"Workflows"** in left sidebar
4. Click **"Add Workflow"** dropdown
5. Select **"Import from File"**
6. Click **"Select File"** and choose the JSON file
7. Click **"Import"**

### 2.3 Expected Result

After import, you should see:
- ✅ Workflow named "Admin-MCP-Server--Augment"
- ✅ 8 nodes total (1 MCP Server Trigger + 7 n8n nodes)
- ✅ All nodes connected to MCP Server Trigger
- ⚠️ Red warning icons on all n8n nodes (credential not configured yet)

---

## 🔧 Step 3: Configure Credentials in Workflow

**CRITICAL:** The imported workflow has placeholder credential IDs that need to be replaced.

### 3.1 Update Each n8n Node

For **EACH of the 7 n8n nodes** (List Workflows Tool, Get Workflow Tool, etc.):

1. **Click on the node** to open its configuration
2. **Look for "Credential to connect with"** section
3. **Click the dropdown** (may show "Select Credential" or an error)
4. **Select:** "n8n API" (the credential you created in Step 1)
5. **Click "Save"** or click outside the node panel

**Nodes to Update:**
- ✅ List Workflows Tool
- ✅ Get Workflow Tool
- ✅ Create Workflow Tool
- ✅ Update Workflow Tool
- ✅ Delete Workflow Tool
- ✅ Activate Workflow Tool
- ✅ Deactivate Workflow Tool

### 3.2 Verify Credential Configuration

After updating all nodes:
- ❌ Red warning icons should disappear
- ✅ All nodes should show green/normal status
- ✅ No "Missing credential" errors

---

## 🔧 Step 4: Configure MCP Server Trigger

### 4.1 Check MCP Server Trigger Settings

1. **Click on "MCP Server Trigger" node**
2. **Verify configuration:**
   - **Path:** `/mcp-server/admin`
   - **Authentication:** n8nApi (should auto-select the credential)
3. **If authentication not set:**
   - Select "n8n API" credential from dropdown
4. **Save the node**

### 4.2 Note the MCP Endpoint URL

The MCP Server Trigger will create an endpoint at:

```
https://n8n.srv972609.hstgr.cloud/mcp-server/admin
```

**Save this URL** - you'll need it for Claude Desktop configuration.

---

## 🔧 Step 5: Save and Activate Workflow

### 5.1 Save Workflow

1. **Press Ctrl+S** or click **"Save"** button in top-right
2. **Verify:** Workflow name is "Admin-MCP-Server--Augment"

### 5.2 Activate Workflow

1. **Click the "Inactive" toggle** in top-right corner
2. **Toggle should turn to "Active"** with green indicator
3. **Verify:** Workflow status shows "Active"

**IMPORTANT:** The workflow MUST be active for the MCP endpoint to work.

---

## 🧪 Step 6: Test Workflow

### 6.1 Test Individual Nodes

**Test "List Workflows Tool":**

1. **Click on "List Workflows Tool" node**
2. **Click "Execute Node"** button
3. **Expected Result:**
   - Output shows array of workflows
   - Includes ALL workflows in your instance
   - Should see LinkedIn workflows, Contact Enrichment, etc.
4. **If successful:** ✅ Instance-level access is working

**Test "Get Workflow Tool":**

1. **Click on "Get Workflow Tool" node**
2. **Click "Execute Node"** button
3. **You'll get an error** (expected - needs workflowId parameter)
4. **This is normal** - the node will work when called via MCP with parameters

### 6.2 Verify MCP Endpoint

**Check that the endpoint is accessible:**

1. **Open a new browser tab**
2. **Navigate to:** `https://n8n.srv972609.hstgr.cloud/mcp-server/admin`
3. **Expected Result:**
   - Should NOT show 404 error
   - May show authentication required or MCP protocol response
4. **If 404 error:**
   - Verify workflow is ACTIVE
   - Verify MCP Server Trigger path is `/mcp-server/admin`

---

## 🔧 Step 7: Configure Claude Desktop

### 7.1 Locate Configuration File

**Windows:**
```
C:\Users\IvoD\AppData\Roaming\Claude\claude_desktop_config.json
```

### 7.2 Update Configuration

1. **Open `claude_desktop_config.json`** in text editor
2. **Add the new MCP server entry:**

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

3. **Replace the API key** with your full JWT token
4. **Save the file**

### 7.3 Restart Claude Desktop

1. **Close Claude Desktop completely**
2. **Reopen Claude Desktop**
3. **Wait for MCP servers to initialize** (check status bar)

---

## 🧪 Step 8: Test from Claude Desktop

### Test 1: List Workflows

**In Claude Desktop, type:**
```
List all workflows in my N8N instance
```

**Expected Result:**
- Claude calls `n8n-admin-mcp-server.list_workflows` tool
- Returns list of ALL workflows with names and IDs
- Should include LinkedIn workflows, Contact Enrichment, Admin MCP Server, etc.

### Test 2: Count Workflows

**In Claude Desktop, type:**
```
How many workflows are in my N8N instance?
```

**Expected Result:**
- Claude calls list_workflows tool
- Counts the workflows
- Responds with accurate count

### Test 3: Get Specific Workflow

**In Claude Desktop, type:**
```
Show me details of the LinkedIn Outreach workflow
```

**Expected Result:**
- Claude calls list_workflows to find the workflow
- Claude calls get_workflow with the workflow ID
- Displays workflow details (nodes, connections, active status)

---

## ✅ Success Criteria

After completing all steps, you should have:

- ✅ n8nApi credential created and tested
- ✅ Admin MCP Server workflow imported
- ✅ All 7 n8n nodes configured with n8nApi credential
- ✅ MCP Server Trigger configured with path `/mcp-server/admin`
- ✅ Workflow saved and ACTIVE
- ✅ "List Workflows Tool" returns ALL workflows when tested manually
- ✅ MCP endpoint accessible (not 404)
- ✅ Claude Desktop configured with HTTP MCP server
- ✅ Claude can list workflows from Claude Desktop
- ✅ Claude can get workflow details from Claude Desktop

---

## ⚠️ Troubleshooting

### Issue: "Missing credential" errors on n8n nodes

**Solution:**
1. Click on each n8n node
2. Select "n8n API" credential from dropdown
3. Save the node
4. Repeat for all 7 nodes

### Issue: MCP Server Trigger shows error

**Solution:**
1. Verify n8nApi credential is created
2. Click on MCP Server Trigger node
3. Select "n8n API" credential for Authentication
4. Verify Path is `/mcp-server/admin`
5. Save the node

### Issue: "List Workflows Tool" returns empty array

**Solution:**
1. Verify n8nApi credential has correct API URL and key
2. Test credential (should show green checkmark)
3. Verify API key has workflow management permissions
4. Check N8N execution logs for errors

### Issue: 404 error when accessing MCP endpoint

**Solution:**
1. Verify workflow is ACTIVE (toggle in top-right)
2. Verify MCP Server Trigger path is `/mcp-server/admin`
3. Save workflow and reactivate
4. Wait 10-30 seconds for endpoint to register

### Issue: Claude Desktop can't connect to MCP server

**Solution:**
1. Verify claude_desktop_config.json syntax is valid JSON
2. Verify URL is correct: `https://n8n.srv972609.hstgr.cloud/mcp-server/admin`
3. Verify Authorization header has "Bearer " prefix
4. Restart Claude Desktop completely
5. Check Claude Desktop logs for connection errors

---

## 📚 Additional Resources

- **Architecture Documentation:** `N8N-NATIVE-MCP-ANALYSIS.md`
- **Concrete Examples:** `ADMIN-MCP-SERVER-CONCRETE-EXAMPLE.md`
- **Architecture Clarification:** `ARCHITECTURE-CLARIFICATION-SUMMARY.md`
- **Implementation Guide:** `ADMIN-MCP-SERVER-IMPLEMENTATION-GUIDE.md`

---

**Import Status:** Ready for deployment  
**Last Updated:** 2025-11-20

