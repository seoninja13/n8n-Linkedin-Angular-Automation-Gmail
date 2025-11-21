# Workflow ID Replacement Guide

**File:** `admin-mcp-server-workflow-CORRECTED.json`

---

## 📋 **Before Importing: Replace These Placeholder IDs**

The JSON file contains 7 placeholder workflow IDs that you need to replace with your actual sub-workflow IDs.

### **How to Find Your Sub-Workflow IDs**

1. **Open N8N Web UI:** https://n8n.srv972609.hstgr.cloud
2. **Go to:** Workflows page
3. **Click on each sub-workflow** (e.g., "Get Many workflows")
4. **Look at the URL in your browser:**
   - Example: `https://n8n.srv972609.hstgr.cloud/workflow/ABC123XYZ`
   - The workflow ID is: `ABC123XYZ` (the part after `/workflow/`)
5. **Copy the ID**

---

## 🔄 **Replacement Mapping**

Open `admin-mcp-server-workflow-CORRECTED.json` in a text editor and replace these placeholders:

### **1. List Workflows Tool**
**Find:** `REPLACE_WITH_LIST_WORKFLOWS_SUB_WORKFLOW_ID`  
**Replace with:** Your "Get Many workflows" sub-workflow ID  
**Example:** If your workflow URL is `https://n8n.srv972609.hstgr.cloud/workflow/w1a2b3c4`, replace with `w1a2b3c4`

### **2. Get Workflow Tool**
**Find:** `REPLACE_WITH_GET_WORKFLOW_SUB_WORKFLOW_ID`  
**Replace with:** Your "Get One workflow" sub-workflow ID

### **3. Create Workflow Tool**
**Find:** `REPLACE_WITH_CREATE_WORKFLOW_SUB_WORKFLOW_ID`  
**Replace with:** Your "Create workflow" sub-workflow ID

### **4. Update Workflow Tool**
**Find:** `REPLACE_WITH_UPDATE_WORKFLOW_SUB_WORKFLOW_ID`  
**Replace with:** Your "Update workflow" sub-workflow ID

### **5. Delete Workflow Tool**
**Find:** `REPLACE_WITH_DELETE_WORKFLOW_SUB_WORKFLOW_ID`  
**Replace with:** Your "Delete workflow" sub-workflow ID

### **6. Activate Workflow Tool**
**Find:** `REPLACE_WITH_ACTIVATE_WORKFLOW_SUB_WORKFLOW_ID`  
**Replace with:** Your "Activate workflow" sub-workflow ID

### **7. Deactivate Workflow Tool**
**Find:** `REPLACE_WITH_DEACTIVATE_WORKFLOW_SUB_WORKFLOW_ID`  
**Replace with:** Your "Deactivate workflow" sub-workflow ID

---

## ✅ **After Replacement: Import Steps**

1. **Save the modified JSON file**
2. **Open N8N Web UI**
3. **Go to:** Workflows → Add Workflow → Import from File
4. **Select:** "Import from Text" tab
5. **Paste the modified JSON**
6. **Click "Import"**
7. **Verify all connections are present** (you should see lines connecting MCP Server Trigger to all 7 tool nodes)
8. **Save and Activate the workflow**

---

## 🔑 **MCP Endpoint URL**

After activation, your MCP endpoint will be:

```
https://n8n.srv972609.hstgr.cloud/webhook/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d
```

Use this URL in your Claude Desktop configuration or other MCP clients.

---

## 🐛 **Troubleshooting**

### **Issue: "Workflow not found" error after import**
**Solution:** Double-check that all 7 workflow IDs are correct and that the sub-workflows exist in your N8N instance.

### **Issue: Nodes still not connected after import**
**Solution:** 
1. Verify you replaced ALL 7 placeholder IDs
2. Make sure you're using the CORRECTED JSON file (not the old one)
3. Check that the connection type is "ai_tool" (not "main")

### **Issue: Can't find sub-workflow ID**
**Solution:** 
1. Make sure the sub-workflow is saved
2. Check the URL bar when viewing the sub-workflow
3. The ID is the alphanumeric string after `/workflow/` in the URL

---

## 📝 **Quick Checklist**

Before importing:
- [ ] Created all 7 sub-workflows
- [ ] Configured n8nApi credential in each sub-workflow's n8n node
- [ ] Copied all 7 workflow IDs from the URLs
- [ ] Replaced all 7 placeholders in the JSON file
- [ ] Saved the modified JSON file

After importing:
- [ ] All 7 tool nodes are connected to MCP Server Trigger
- [ ] Workflow is saved
- [ ] Workflow is activated
- [ ] MCP endpoint URL is accessible

---

**Status:** Ready for import after workflow ID replacement

