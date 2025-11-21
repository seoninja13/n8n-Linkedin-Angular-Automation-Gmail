# Complete Implementation Guide: MCP Server with Sub-Workflows

**Goal:** Create a working MCP Server endpoint that exposes N8N workflow management operations

---

## 📋 **Prerequisites**

- ✅ N8N instance running at https://n8n.srv972609.hstgr.cloud
- ✅ n8nApi credential configured ("N8N API - Admin MCP")
- ✅ Access to N8N Web UI

---

## 🏗️ **Architecture Overview**

You will create **TWO workflows**:

1. **Main Workflow:** "Admin-MCP-Server--Augment"
   - Contains: MCP Server Trigger + Call n8n Workflow Tool nodes
   - Purpose: Exposes MCP endpoint and routes requests

2. **Sub-Workflow:** "List-Workflows-Operation"
   - Contains: n8n node that performs "Get Many Workflows" operation
   - Purpose: Actually executes the workflow management operation

---

## 🚀 **Implementation Steps**

### **STEP 1: Create the Sub-Workflow**

1. **Open N8N Web UI:** https://n8n.srv972609.hstgr.cloud

2. **Create New Workflow:**
   - Click "Add Workflow" button
   - Name it: **"List-Workflows-Operation"**

3. **Add n8n Node:**
   - Click the `+` button on canvas
   - Search for: `n8n`
   - Select: "n8n" node (nodes-base.n8n)

4. **Configure the n8n Node:**
   - **Resource:** Select "Workflow" from dropdown
   - **Operation:** Select "Get Many" from dropdown
   - **Return All:** Toggle ON (to get all workflows)
   - **Credential:** Select "N8N API - Admin MCP"

5. **Save the Workflow:**
   - Click "Save" button (top-right)
   - Confirm the name: "List-Workflows-Operation"

6. **Copy the Workflow ID:**
   - Look at the URL in your browser
   - Example: `https://n8n.srv972609.hstgr.cloud/workflow/ABC123XYZ`
   - **Copy the ID:** `ABC123XYZ` (the part after `/workflow/`)
   - **Save this ID** - you'll need it in Step 2

---

### **STEP 2: Create the Main MCP Server Workflow**

#### **Option A: Import from JSON (Recommended)**

1. **Open the JSON file:** `admin-mcp-server-SINGLE-TOOL-example.json`

2. **Replace the placeholder:**
   - Find: `REPLACE_WITH_LIST_WORKFLOWS_SUB_WORKFLOW_ID`
   - Replace with: The workflow ID you copied in Step 1

3. **Import into N8N:**
   - Go to: Workflows → Add Workflow → Import from File
   - Select: "Import from Text" tab
   - Paste the modified JSON
   - Click "Import"

4. **Verify the connection:**
   - You should see a line connecting MCP Server Trigger → Call n8n Workflow Tool
   - If not, manually connect them (see Option B below)

5. **Save and Activate:**
   - Click "Save"
   - Toggle to "Active"

#### **Option B: Build Manually in Visual Editor**

1. **Create New Workflow:**
   - Click "Add Workflow"
   - Name it: **"Admin-MCP-Server--Augment"**

2. **Add MCP Server Trigger:**
   - Click `+` button
   - Search: `mcp trigger`
   - Select: "MCP Server Trigger"
   - Configure:
     - **Path:** Leave the auto-generated UUID
     - **Authentication:** Optional (can leave as "None" for testing)
   - Save the node

3. **Add Call n8n Workflow Tool:**
   - Click `+` button
   - Search: `workflow tool`
   - Select: "Call n8n Workflow Tool" (NOT "Execute Workflow")
   - Configure:
     - **Name:** `list_workflows`
     - **Description:** `List all workflows in the N8N instance. Returns an array of workflow objects with id, name, active status, and metadata.`
     - **Source:** Select "Database"
     - **Workflow:** Select "List-Workflows-Operation" from dropdown
       - If you don't see it, click the refresh icon
       - Or manually enter the workflow ID from Step 1
   - Save the node

4. **Connect the Nodes:**
   - Hover over the MCP Server Trigger node
   - Click and drag from the output dot (right side)
   - Drop on the "Call n8n Workflow Tool" node
   - You should see a connection line appear

5. **Save and Activate:**
   - Click "Save"
   - Toggle to "Active"

---

### **STEP 3: Test the MCP Endpoint**

1. **Get the MCP Endpoint URL:**
   - Look at the MCP Server Trigger node's path parameter
   - Example path: `280d443c-acac-4af8-8ac6-8851f16ab1af`
   - **Full URL:** `https://n8n.srv972609.hstgr.cloud/webhook/280d443c-acac-4af8-8ac6-8851f16ab1af`

2. **Test with cURL (Optional):**
   ```bash
   curl https://n8n.srv972609.hstgr.cloud/webhook/280d443c-acac-4af8-8ac6-8851f16ab1af
   ```
   - You should get a response (not a 404 error)

3. **Configure Claude Desktop:**
   - Add the MCP endpoint URL to your Claude Desktop configuration
   - Test by asking Claude to list workflows

---

## 🔄 **Adding More Operations (Get, Create, Update, Delete, etc.)**

Once you have the "List Workflows" operation working, repeat the process for other operations:

### **For Each Additional Operation:**

1. **Create a new sub-workflow:**
   - Name: "Get-Workflow-Operation", "Create-Workflow-Operation", etc.
   - Add n8n node with appropriate operation
   - Save and copy the workflow ID

2. **Add a new "Call n8n Workflow Tool" node to main workflow:**
   - Configure with appropriate name and description
   - Point to the new sub-workflow
   - Connect to MCP Server Trigger

3. **Save and test**

---

## 📊 **Final Architecture**

### **Main Workflow: Admin-MCP-Server--Augment**
```
[MCP Server Trigger]
    ↓
[Call n8n Workflow Tool: list_workflows] → Points to "List-Workflows-Operation"
```

### **Sub-Workflow: List-Workflows-Operation**
```
[Get many workflows (n8n node)]
```

---

## ✅ **Verification Checklist**

After completing the steps:

- [ ] Sub-workflow "List-Workflows-Operation" exists and is saved
- [ ] Sub-workflow contains n8n node with "Get Many" operation
- [ ] n8n node has n8nApi credential configured
- [ ] Main workflow "Admin-MCP-Server--Augment" exists and is active
- [ ] Main workflow has MCP Server Trigger node
- [ ] Main workflow has "Call n8n Workflow Tool" node
- [ ] "Call n8n Workflow Tool" points to "List-Workflows-Operation" sub-workflow
- [ ] Connection exists between MCP Server Trigger and Call n8n Workflow Tool
- [ ] MCP endpoint URL is accessible (not 404)

---

## 🐛 **Troubleshooting**

### **Issue: "Call n8n Workflow Tool" doesn't show my sub-workflow in dropdown**
**Solution:**
1. Make sure the sub-workflow is saved
2. Click the refresh icon next to the Workflow dropdown
3. Or manually enter the workflow ID

### **Issue: Connection line doesn't appear when dragging**
**Solution:**
1. Make sure you're dragging FROM MCP Server Trigger TO Call n8n Workflow Tool
2. Make sure you're using the correct node type (@n8n/n8n-nodes-langchain.toolWorkflow)
3. Try deleting and re-adding the Call n8n Workflow Tool node

### **Issue: MCP endpoint returns 404**
**Solution:**
1. Make sure the main workflow is ACTIVE (toggle in top-right)
2. Check that the MCP Server Trigger has a valid path UUID
3. Verify the URL format: `https://n8n.srv972609.hstgr.cloud/webhook/{path-uuid}`

### **Issue: "Get many workflows" node returns empty array**
**Solution:**
1. Check that the n8nApi credential is configured correctly
2. Verify the credential has the correct API URL and API key
3. Test the credential by clicking "Test" in the credential configuration

---

## 📚 **Files Reference**

- **Main Workflow JSON:** `admin-mcp-server-SINGLE-TOOL-example.json`
- **Sub-Workflow JSON:** `list-workflows-operation-SUB-WORKFLOW.json`
- **Full 7-Tool Workflow JSON:** `admin-mcp-server-workflow-CORRECTED.json`
- **Workflow ID Replacement Guide:** `WORKFLOW-ID-REPLACEMENT-GUIDE.md`

---

**Status:** Ready for implementation
**Estimated Time:** 10-15 minutes for single operation, 30-45 minutes for all 7 operations

