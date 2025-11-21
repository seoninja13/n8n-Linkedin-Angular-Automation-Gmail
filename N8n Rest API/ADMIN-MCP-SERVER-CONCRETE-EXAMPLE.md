# Admin MCP Server - Concrete Configuration Example

**Purpose:** Show exact configuration for "List All Workflows" tool to clarify permission model  
**Workflow ID:** 3002ab0f-0d07-4e9f-a731-6a8bee98c5e4  
**Date:** 2025-11-20

---

## 🎯 Core Concept: Instance-Level Access

**CRITICAL UNDERSTANDING:**

The n8n node (nodes-base.n8n) with n8nApi credential has **INSTANCE-LEVEL permissions**.

When configured with `resource: "workflow"` and `operation: "getAll"`, it returns **ALL workflows in your entire N8N instance**, not just the workflow it's part of.

---

## 📋 Exact Node Configuration: "List Workflows Tool"

### Node Type
```
nodes-base.n8n
```

### Node Configuration (Visual UI)

**Resource:** Workflow  
**Operation:** Get Many  
**Return All:** ✅ true  
**Filters:**
- Return Only Active Workflows: ❌ false (to see all workflows)

**Credential:** n8nApi
- API URL: `https://n8n.srv972609.hstgr.cloud`
- API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Node Configuration (JSON Export)

```json
{
  "id": "list-workflows-tool-node-id",
  "name": "List Workflows Tool",
  "type": "n8n-nodes-base.n8n",
  "typeVersion": 1,
  "position": [500, 300],
  "credentials": {
    "n8nApi": {
      "id": "your-n8n-api-credential-id",
      "name": "n8n API"
    }
  },
  "parameters": {
    "resource": "workflow",
    "operation": "getAll",
    "returnAll": true,
    "filters": {
      "activeWorkflows": false
    }
  }
}
```

---

## 🔍 What This Node Returns

### Example Response

When this node executes, it returns **ALL workflows** in your N8N instance:

```json
[
  {
    "id": "WUe4y8iYEXNAB6dq",
    "name": "LinkedIn-SEO-Gmail-Outreach-v2.0-EQUAL-DISTRIBUTION",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:45:00.000Z",
    "tags": [],
    "nodes": [...],
    "connections": {...}
  },
  {
    "id": "rClUELDAK9f4mgJx",
    "name": "LinkedIn-SEO-Gmail-sub-flow-Workshop-Contact-Enrichment--Augment",
    "active": true,
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-18T16:20:00.000Z",
    "tags": [],
    "nodes": [...],
    "connections": {...}
  },
  {
    "id": "3002ab0f-0d07-4e9f-a731-6a8bee98c5e4",
    "name": "Admin-MCP-Server--Augment",
    "active": true,
    "createdAt": "2024-11-20T12:00:00.000Z",
    "updatedAt": "2024-11-20T12:30:00.000Z",
    "tags": [],
    "nodes": [...],
    "connections": {...}
  }
  // ... ALL other workflows in your instance
]
```

**Key Point:** Notice that the response includes:
- ✅ The Admin MCP Server workflow itself (3002ab0f-0d07-4e9f-a731-6a8bee98c5e4)
- ✅ LinkedIn automation workflows
- ✅ Contact Enrichment workflows
- ✅ **EVERY workflow in your N8N instance**

---

## 🔐 Permission Model Deep Dive

### Why Does This Work?

**1. n8nApi Credential = Instance Admin Access**

The n8nApi credential you create is tied to your N8N API key, which has **full instance permissions**.

```
Your API Key → n8nApi Credential → n8n Node → Internal API → ALL Workflows
```

**2. Internal API vs. Public REST API**

| API Type | Access Level | Workflow Operations |
|----------|-------------|---------------------|
| **Public REST API** | Limited | ❌ Cannot update/delete workflows (405 errors) |
| **Internal API** (via n8n node) | Full | ✅ Can create/update/delete/list ALL workflows |

The n8n node uses N8N's internal API routing, which has elevated permissions.

**3. Scope is NOT Limited to Current Workflow**

Common misconception: "The n8n node can only access the workflow it's in"

**Reality:** The n8n node can access **ANY workflow** in the instance because:
- It authenticates with n8nApi credential (instance-level)
- It uses internal API (not public REST API)
- The `operation: "getAll"` explicitly requests ALL workflows

---

## 🏗️ Complete Admin MCP Server Workflow Structure

### Workflow Overview

```
Admin-MCP-Server--Augment (ID: 3002ab0f-0d07-4e9f-a731-6a8bee98c5e4)
│
├─ MCP Server Trigger Node
│  └─ Exposes tools via HTTP/SSE endpoint
│
├─ List Workflows Tool (n8n node)
│  └─ resource: workflow, operation: getAll
│  └─ Returns: ALL workflows in instance
│
├─ Get Workflow Tool (n8n node)
│  └─ resource: workflow, operation: get
│  └─ Input: workflowId
│  └─ Returns: Specific workflow details
│
├─ Create Workflow Tool (n8n node)
│  └─ resource: workflow, operation: create
│  └─ Input: workflowObject JSON
│  └─ Returns: New workflow ID
│
├─ Update Workflow Tool (n8n node)
│  └─ resource: workflow, operation: update
│  └─ Input: workflowId, workflowObject JSON
│  └─ Returns: Updated workflow
│
├─ Delete Workflow Tool (n8n node)
│  └─ resource: workflow, operation: delete
│  └─ Input: workflowId
│  └─ Returns: Success confirmation
│
├─ Activate Workflow Tool (n8n node)
│  └─ resource: workflow, operation: activate
│  └─ Input: workflowId
│  └─ Returns: Activated workflow
│
└─ Deactivate Workflow Tool (n8n node)
   └─ resource: workflow, operation: deactivate
   └─ Input: workflowId
   └─ Returns: Deactivated workflow
```

### Key Connections

**All n8n nodes connect to MCP Server Trigger:**

```
MCP Server Trigger (output) → List Workflows Tool (input)
MCP Server Trigger (output) → Get Workflow Tool (input)
MCP Server Trigger (output) → Create Workflow Tool (input)
MCP Server Trigger (output) → Update Workflow Tool (input)
MCP Server Trigger (output) → Delete Workflow Tool (input)
MCP Server Trigger (output) → Activate Workflow Tool (input)
MCP Server Trigger (output) → Deactivate Workflow Tool (input)
```

---

## 🧪 Testing: Verify Instance-Level Access

### Test 1: List All Workflows

**In N8N Web UI:**
1. Open Admin MCP Server workflow
2. Click on "List Workflows Tool" node
3. Click "Execute Node"
4. Check output

**Expected Result:**
- Output shows array of ALL workflows
- Includes workflows you didn't create
- Includes the Admin MCP Server workflow itself

**If you see this:** ✅ Instance-level access is working

### Test 2: Count Workflows

**In Claude Desktop (after MCP setup):**
```
How many workflows are in my N8N instance?
```

**Expected Behavior:**
1. Claude calls `n8n-admin-mcp-server.list_workflows` tool
2. Tool executes "List Workflows Tool" n8n node
3. Node returns ALL workflows
4. Claude counts and responds: "You have X workflows in your N8N instance"

**If Claude can answer:** ✅ MCP integration is working

### Test 3: List Specific Workflow

**In Claude Desktop:**
```
Show me details of workflow "LinkedIn-SEO-Gmail-Outreach-v2.0-EQUAL-DISTRIBUTION"
```

**Expected Behavior:**
1. Claude calls `list_workflows` to find workflow ID
2. Claude calls `get_workflow` with ID: WUe4y8iYEXNAB6dq
3. Claude displays workflow details (nodes, connections, active status)

**If Claude can show details:** ✅ Full workflow management is working

---

## ❓ Answering Your Specific Questions

### Q1: Workflow Listing Mechanism

**Answer: Option A - Instance-Level Access** ✅

The Admin MCP Server lists **ALL workflows in the N8N instance**, not just MCP-enabled workflows.

### Q2: Tool Exposure vs. Workflow Management

**Clarification:**

- **MCP Server Trigger** exposes TOOLS (operations like "list_workflows", "create_workflow")
- **Each tool** is an n8n node that performs a workflow management operation
- **The n8n node** with `operation: "getAll"` returns ALL workflows (not just MCP workflows)

**Analogy:**
- MCP Server Trigger = API Gateway
- n8n nodes = API Endpoints
- Each endpoint can access the entire N8N instance

### Q3: Architecture Verification

**What to Check in Your Workflow:**

1. **Does it have MCP Server Trigger node?** ✅ Yes (you mentioned "admin mcp tserver trigger")
2. **Does it have n8n nodes connected to MCP Server Trigger?** ❓ Need to verify
3. **Are n8n nodes configured with resource="workflow"?** ❓ Need to verify
4. **Do n8n nodes have n8nApi credential?** ❓ Need to verify

**Gap Analysis Needed:**
- If missing n8n nodes → Add them following this guide
- If n8n nodes not connected → Connect them to MCP Server Trigger
- If missing n8nApi credential → Create credential with your API key

### Q4: Expected Behavior

**When you ask Claude: "List all workflows"**

**Step-by-step:**
1. Claude identifies MCP tool: `n8n-admin-mcp-server.list_workflows`
2. Claude calls tool via HTTP/SSE
3. MCP Server Trigger receives request
4. Routes to "List Workflows Tool" n8n node
5. n8n node executes: `GET /api/v1/workflows` (internal API)
6. Returns: Array of ALL workflows in instance
7. Claude receives response and displays list

**Scope:** Instance-wide (ALL workflows, not just MCP-enabled)

---

## ✅ Verification Checklist

To verify your current implementation:

- [ ] MCP Server Trigger node exists in workflow
- [ ] MCP Server Trigger is configured with path `/mcp-server/admin`
- [ ] n8nApi credential exists with correct API URL and key
- [ ] "List Workflows Tool" n8n node exists
- [ ] "List Workflows Tool" configured: resource=workflow, operation=getAll
- [ ] "List Workflows Tool" connected to MCP Server Trigger
- [ ] Workflow is ACTIVE
- [ ] Claude Desktop config has HTTP MCP server entry
- [ ] Can execute "List Workflows Tool" manually in N8N Web UI
- [ ] Manual execution returns ALL workflows (not empty array)

**Next Step:** Check your workflow against this checklist to identify gaps.

---

**Key Takeaway:** The n8n node with n8nApi credential has **instance-level permissions** and can list/create/update/delete ANY workflow in your N8N instance, not just the workflow it's part of.

