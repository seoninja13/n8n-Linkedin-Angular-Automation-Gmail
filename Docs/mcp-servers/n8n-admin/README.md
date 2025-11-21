# N8N Admin MCP Server Documentation

**MCP Server for N8N Workflow Management via Augment Code**

---

## 📋 **Overview**

The N8N Admin MCP Server exposes 7 workflow management tools through the Model Context Protocol (MCP), enabling natural language control of N8N workflows directly from Augment Code.

**Status**: ⚠️ IN PROGRESS - MCP server connected, sub-workflows need conversion

---

## 🔧 **Configuration**

### **MCP Server Details**

- **Environment:** Augment Code (VS Code extension)
- **Server Name:** `n8n-admin`
- **Endpoint URL:** https://n8n.srv972609.hstgr.cloud/mcp/280d443c-acac-4af8-8ac6-8851f16ab1af
- **Authentication:** Bearer token in Authorization header
- **Protocol:** Server-Sent Events (SSE)

### **N8N Workflow Details**

- **Main Workflow Name:** Admin-MCP-Server--Augment
- **Main Workflow ID:** `kPhABZnv2pc7LMF0`
- **Workflow URL:** https://n8n.srv972609.hstgr.cloud/workflow/kPhABZnv2pc7LMF0
- **Status:** ✅ Activated

### **Credentials**

- **Bearer Token Credential ID:** `pQBC7RW51UVjpdA8`
  - Name: "neverbounce APi Key"
  - Type: HTTP Bearer Auth
  - Current Token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q`

- **N8N API Credential ID:** `8Mpie43lyRFyX4zw`
  - Name: "N8N API - Admin MCP"
  - Type: N8N API
  - Used by all sub-workflows for N8N REST API calls

---

## 🛠️ **Available Tools**

The MCP server exposes 7 workflow management tools:

### **1. List_Workflows_N8N_Admin_MCP_Server**
- **Purpose:** List all N8N workflows
- **Parameters:** None
- **Sub-Workflow:** MCP-Get Many Workflows (ID: Q5pmP4961YnR9nJ9)
- **Status:** ⚠️ Accessible but returns error (sub-workflow needs conversion)

### **2. Get_Workflow_N8N_Admin_MCP_Server**
- **Purpose:** Get specific workflow details
- **Parameters:** `workflowId` (string)
- **Sub-Workflow:** MCP-Get One Workflow (ID: TBD)
- **Status:** ⚠️ Accessible but returns error (sub-workflow needs conversion)

### **3. Create_Workflow_N8N_Admin_MCP_Server**
- **Purpose:** Create new workflow
- **Parameters:** `workflow` (object)
- **Sub-Workflow:** MCP-Create Workflow (ID: TBD)
- **Status:** ⚠️ Not tested (sub-workflow needs conversion)

### **4. Update_Workflow_N8N_Admin_MCP_Server**
- **Purpose:** Update existing workflow
- **Parameters:** `workflowId` (string), `workflow` (object)
- **Sub-Workflow:** MCP-Update Workflow (ID: TBD)
- **Status:** ⚠️ Not tested (sub-workflow needs conversion)

### **5. Delete_Workflow_N8N_Admin_MCP_Server**
- **Purpose:** Delete workflow
- **Parameters:** `workflowId` (string)
- **Sub-Workflow:** MCP-Delete Workflow (ID: TBD)
- **Status:** ⚠️ Not tested (sub-workflow needs conversion)

### **6. Activate_Workflow_N8N_Admin_MCP_Server**
- **Purpose:** Activate workflow
- **Parameters:** `workflowId` (string)
- **Sub-Workflow:** MCP-Activate Workflow (ID: TBD)
- **Status:** ⚠️ Not tested (sub-workflow needs conversion)

### **7. Deactivate_Workflow_N8N_Admin_MCP_Server**
- **Purpose:** Deactivate workflow
- **Parameters:** `workflowId` (string)
- **Sub-Workflow:** MCP-Deactivate Workflow (ID: TBD)
- **Status:** ⚠️ Not tested (sub-workflow needs conversion)

---

## 🔴 **Current Issue**

### **Problem: Sub-Workflows Using Manual Trigger**

All 7 sub-workflows are using `n8n-nodes-base.manualTrigger` instead of `n8n-nodes-base.executeWorkflowTrigger`, preventing them from being called by the parent MCP Server workflow.

**Error Messages:**
- `List_Workflows`: "The resource you are requesting could not be found"
- `Get_Workflow`: "Workflow does not exist."

**Root Cause:**
Sub-workflows with `manualTrigger` cannot accept parameters from parent workflows and cannot be called programmatically via the "Call n8n Workflow Tool" node.

**Solution:**
Convert all 7 sub-workflows to use `executeWorkflowTrigger` and add required parameters to N8N nodes.

---

## 🔧 **Sub-Workflow Conversion Guide**

### **Required Changes**

For each sub-workflow, make these changes:

1. **Replace Trigger Node:**
   - ❌ Remove: `n8n-nodes-base.manualTrigger`
   - ✅ Add: `n8n-nodes-base.executeWorkflowTrigger`

2. **Update Node Name:**
   - ❌ Old: "When clicking 'Execute workflow'"
   - ✅ New: "Workflow Input"

3. **Update Connections:**
   - Change connection source from "When clicking 'Execute workflow'" to "Workflow Input"

4. **Add N8N Node Parameters:**
   - Add `resource: "workflow"`
   - Add `operation: "getMany"` (or appropriate operation)
   - Add operation-specific parameters (e.g., `returnAll: true`, `workflowId: "={{ $json.workflowId }}"`)

### **Example: MCP-Get Many Workflows**

**Before (WRONG):**
```json
{
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.manualTrigger",
      "name": "When clicking 'Execute workflow'"
    },
    {
      "parameters": {
        "filters": {},
        "requestOptions": {}
      },
      "type": "n8n-nodes-base.n8n",
      "name": "Get many workflows"
    }
  ]
}
```

**After (CORRECT):**
```json
{
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "name": "Workflow Input"
    },
    {
      "parameters": {
        "resource": "workflow",
        "operation": "getMany",
        "returnAll": true,
        "filters": {},
        "requestOptions": {}
      },
      "type": "n8n-nodes-base.n8n",
      "name": "Get many workflows"
    }
  ]
}
```

---

## 🧪 **Testing Guide**

### **Prerequisites**

1. ✅ MCP server activated in N8N
2. ✅ Bearer token configured in Augment Code
3. ✅ Augment Code restarted
4. ❌ All sub-workflows converted to use `executeWorkflowTrigger`

### **Test Commands**

Once sub-workflows are converted, test each tool:

```
1. List all workflows:
   "Can you list all my N8N workflows?"

2. Get specific workflow:
   "Can you get the details of workflow ID kPhABZnv2pc7LMF0?"

3. Create test workflow:
   "Can you create a simple test workflow with a manual trigger and no-op node?"

4. Update workflow:
   "Can you update workflow [ID] to change its name to [NEW_NAME]?"

5. Activate workflow:
   "Can you activate workflow [ID]?"

6. Deactivate workflow:
   "Can you deactivate workflow [ID]?"

7. Delete workflow:
   "Can you delete workflow [ID]?"
```

---

## 🐛 **Troubleshooting**

### **Issue: Tools Not Appearing in Augment Code**

**Symptoms:**
- MCP tools not visible in Augment Code
- Error: "Tool does not exist"

**Solutions:**
1. Verify MCP server configuration in Augment Code settings
2. Check bearer token is correct (no extra spaces)
3. Restart Augment Code completely
4. Verify N8N workflow is activated

### **Issue: HTTP 403 Forbidden**

**Symptoms:**
- Endpoint returns 403 Forbidden error
- Authentication failing

**Solutions:**
1. Verify bearer token matches N8N credential ID `pQBC7RW51UVjpdA8`
2. Check token hasn't expired
3. Update N8N credential with new token
4. Update Augment Code MCP configuration with new token

### **Issue: "Resource Not Found" Error**

**Symptoms:**
- Tool executes but returns "The resource you are requesting could not be found"
- Sub-workflow execution fails

**Solutions:**
1. Verify sub-workflow exists and has correct ID
2. Check sub-workflow uses `executeWorkflowTrigger` (not `manualTrigger`)
3. Verify N8N API credential is configured correctly
4. Check N8N node has required parameters (`resource`, `operation`)

---

## 📚 **Related Documentation**

- **Daily Log:** `Docs/daily-logs/2025-01-20-n8n-admin-mcp-server-integration.md`
- **Knowledge Transfer:** `Docs/handover/conversation-handover-knowledge-transfer.md`
- **Project Operations Manual:** `Docs/project-operations-manual.md`
- **Main Workflow:** https://n8n.srv972609.hstgr.cloud/workflow/kPhABZnv2pc7LMF0
- **Executions:** https://n8n.srv972609.hstgr.cloud/workflow/kPhABZnv2pc7LMF0/executions

---

**Last Updated:** 2025-01-20  
**Status:** IN PROGRESS - Sub-workflows need conversion

