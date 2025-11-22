# N8N Operations Manual

**Version**: 2.0
**Last Updated**: 2025-11-22
**Status**: ✅ ACTIVE - HYBRID ARCHITECTURE

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [N8N Integration Architecture (HYBRID)](#n8n-integration-architecture-hybrid)
3. [Method 1: N8N Admin Gateway Webhook (Management)](#method-1-n8n-admin-gateway-webhook-management)
4. [Method 2: N8N MCP Access Gateway (Execution)](#method-2-n8n-mcp-access-gateway-execution)
5. [Method 3: N8N REST API (Advanced)](#method-3-n8n-rest-api-advanced)
6. [Method 4: n8n-mcp NPM Package (DISABLED)](#method-4-n8n-mcp-npm-package-disabled)
7. [MCP Eligibility Requirements](#mcp-eligibility-requirements)
8. [Enabling Workflows for MCP Access](#enabling-workflows-for-mcp-access)
9. [Decision Tree / Flowchart](#decision-tree--flowchart)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Quick Reference](#quick-reference)

---

## OVERVIEW

This manual provides comprehensive guidance on all available methods to connect to and operate with the N8N instance at `https://n8n.srv972609.hstgr.cloud`.

### **N8N Instance Information**
- **URL**: https://n8n.srv972609.hstgr.cloud
- **Total Workflows**: 100 workflows (6 active, 94 inactive, 54 archived)
- **MCP-Eligible Workflows**: ~30-40 workflows (30-40%)
- **API Version**: v1
- **Authentication**: Bearer token (JWT) + Header-Auth (webhook)

### **HYBRID ARCHITECTURE APPROACH**

**CRITICAL UNDERSTANDING**: Admin Gateway Webhook and MCP Access Gateway serve **DIFFERENT PURPOSES**:

| System | Purpose | Analogy |
|--------|---------|---------|
| **Admin Gateway Webhook** | Workflow MANAGEMENT | Building directory (list all apartments) |
| **MCP Access Gateway** | Workflow EXECUTION | Apartment access (enter specific apartments) |

**Integration Methods by Use Case**:
1. **Workflow Management** (List, Get, Create, Update): Use **Admin Gateway Webhook**
2. **Workflow Execution** (AI-driven, MCP protocol): Use **MCP Access Gateway**
3. **Advanced Operations** (Delete, Activate, Custom): Use **REST API**
4. **DISABLED**: n8n-mcp NPM Package (Augment Code bug)

---

## N8N INTEGRATION ARCHITECTURE (HYBRID)

### **Comparison Table**

| Method | Status | Read | Write | Scope | Performance | Convenience | Primary Use Case |
|--------|--------|------|-------|-------|-------------|-------------|------------------|
| **Admin Gateway Webhook** | ✅ ACTIVE | ✅ Yes | ✅ Yes | 100 workflows | 4.11s | Medium | Workflow MANAGEMENT |
| **MCP Access Gateway** | ✅ ACTIVE | ✅ Yes | ✅ Yes* | MCP-eligible only | Fast | High | Workflow EXECUTION |
| **N8N REST API** | ✅ AVAILABLE | ✅ Yes | ✅ Yes | All workflows | Fast | Low | Advanced operations |
| **n8n-mcp NPM Package** | ❌ DISABLED | ❌ No | ❌ No | N/A | N/A | N/A | DISABLED - Augment Code bug |

*MCP Access Gateway shows only workflows with "Available in MCP" toggle enabled (~30-40 workflows)

### **Pros & Cons Summary**

#### **N8N Admin Gateway Webhook**
**Purpose**: Workflow MANAGEMENT (CRUD operations)

**Pros**:
- ✅ Full CRUD operations (List, Get, Create, Update)
- ✅ Access to ALL 100 workflows (no restrictions)
- ✅ Optimized response format (46KB)
- ✅ Clean JSON structure
- ✅ Works with ALL workflow types (including sub-workflows)

**Cons**:
- ❌ Delete/Activate/Deactivate not fully implemented
- ❌ Requires webhook POST requests (less convenient)
- ❌ No native Augment Code integration

**Best For**: Listing workflows, retrieving workflow details, workflow metadata operations

#### **N8N MCP Access Gateway**
**Purpose**: Workflow EXECUTION (MCP protocol)

**Pros**:
- ✅ Native Augment Code integration
- ✅ Easy to call (MCP tools)
- ✅ MCP protocol support (AI-driven execution)
- ✅ Fast response
- ✅ Secure (per-workflow opt-in)

**Cons**:
- ❌ Only shows workflows with "Available in MCP" toggle enabled
- ❌ Requires eligible trigger nodes (Webhook, Schedule, Chat, Form)
- ❌ Sub-workflows with Execute Workflow Trigger are INELIGIBLE
- ❌ Limited scope (~30-40% of workflows)

**Best For**: AI-driven workflow execution, external client integration, MCP-native applications

#### **N8N REST API**
**Purpose**: Advanced operations

**Pros**:
- ✅ Complete API access
- ✅ All operations available
- ✅ Direct control
- ✅ Well-documented

**Cons**:
- ❌ Manual HTTP request construction
- ❌ No Augment Code integration
- ❌ More verbose
- ❌ Requires authentication management

**Best For**: Delete operations, activation/deactivation, custom operations not available in other methods

---

## METHOD 1: N8N ADMIN GATEWAY WEBHOOK (MANAGEMENT)

### **Overview**
The N8N Admin Gateway is a webhook-based management proxy that provides CRUD operations for ALL workflows in the N8N instance.

**Status**: ✅ **ACTIVE & VERIFIED** (2025-11-22)

### **Webhook Details**
- **Endpoint**: `https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway`
- **Method**: POST
- **Authentication**: Header-Auth
  - Header: `X-N8N-API-KEY`
  - Value: `n8n_api_1234567890abcdef` (example - use actual key)
- **Workflow ID**: `1Zl6AzNunb0ewnNh`
- **Workflow Name**: N8N Admin Gateway

### **Performance Metrics**
- **Response Time**: 4.11 seconds (verified)
- **Response Size**: 46,626 bytes (~46KB)
- **Total Workflows**: 100 workflows
- **Success Rate**: 100% (verified working)

### **Available Operations**

#### **1. List Workflows** ✅
**Request**:
```json
{
  "operation": "list_workflows"
}
```

**Response**:
```json
{
  "success": true,
  "count": 100,
  "workflows": [
    {
      "id": "1Zl6AzNunb0ewnNh",
      "name": "N8N Admin Gateway",
      "active": true,
      "isArchived": false,
      "updatedAt": "2025-11-22T19:04:39.000Z",
      "createdAt": "2025-11-22T04:52:15.701Z",
      "triggerCount": 1
    }
    // ... 99 more workflows
  ]
}
```

**Use Cases**:
- Get complete list of all workflows in N8N instance
- Discover workflow IDs for subsequent operations
- Monitor workflow status (active/inactive/archived)
- Audit workflow inventory

#### **2. Get Workflow** ✅
**Request**:
```json
{
  "operation": "get_workflow",
  "workflowId": "1Zl6AzNunb0ewnNh"
}
```

**Response**:
```json
{
  "success": true,
  "workflow": {
    "id": "1Zl6AzNunb0ewnNh",
    "name": "N8N Admin Gateway",
    "active": true,
    "nodes": [...],
    "connections": {...},
    "settings": {...}
    // Full workflow configuration
  }
}
```

**Use Cases**:
- Retrieve complete workflow configuration
- Inspect workflow nodes and connections
- Backup workflow before modifications
- Analyze workflow structure

#### **3. Create Workflow** ✅
**Request**:
```json
{
  "operation": "create_workflow",
  "workflow": {
    "name": "New Workflow Name",
    "nodes": [...],
    "connections": {...},
    "settings": {...}
  }
}
```

**Response**:
```json
{
  "success": true,
  "workflow": {
    "id": "newWorkflowId123",
    "name": "New Workflow Name",
    "active": false,
    "createdAt": "2025-11-22T19:00:00.000Z"
  }
}
```

**Use Cases**:
- Programmatically create new workflows
- Deploy workflow templates
- Automate workflow provisioning
- Clone workflows with modifications

#### **4. Update Workflow** ✅
**Request**:
```json
{
  "operation": "update_workflow",
  "workflowId": "1Zl6AzNunb0ewnNh",
  "workflow": {
    "name": "Updated Workflow Name",
    "nodes": [...],
    "connections": {...}
  }
}
```

**Response**:
```json
{
  "success": true,
  "workflow": {
    "id": "1Zl6AzNunb0ewnNh",
    "name": "Updated Workflow Name",
    "updatedAt": "2025-11-22T19:00:00.000Z"
  }
}
```

**Use Cases**:
- Modify existing workflow configurations
- Update workflow nodes/connections
- Rename workflows
- Apply configuration changes programmatically

#### **5. Delete Workflow** ⚠️
**Status**: Node exists but NOT connected to routing

**Request**:
```json
{
  "operation": "delete_workflow",
  "workflowId": "workflowIdToDelete"
}
```

**Current Status**: ⚠️ **NOT AVAILABLE** - Delete node exists but not connected to Route Operation Switch node

**Workaround**: Use N8N REST API (Method 3) for delete operations

#### **6. Activate Workflow** ❌
**Status**: NOT IMPLEMENTED

**Workaround**: Use N8N REST API (Method 3) for activation operations

#### **7. Deactivate Workflow** ❌
**Status**: NOT IMPLEMENTED

**Workaround**: Use N8N REST API (Method 3) for deactivation operations

### **PowerShell Example**

```powershell
# List all workflows
$headers = @{
    "X-N8N-API-KEY" = "n8n_api_1234567890abcdef"
    "Content-Type" = "application/json"
}

$body = @{
    operation = "list_workflows"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" `
    -Method POST `
    -Headers $headers `
    -Body $body

Write-Host "Total Workflows: $($response.count)"
$response.workflows | Format-Table id, name, active
```

### **Error Handling**

**Common Errors**:
1. **Authentication Failed**: Check X-N8N-API-KEY header value
2. **Timeout (>30s)**: Webhook may be processing large data - wait and retry
3. **Invalid Operation**: Check operation name spelling
4. **Workflow Not Found**: Verify workflowId exists using list_workflows

**Error Response Format**:
```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

### **When to Use Admin Gateway Webhook**
- ✅ Need to list ALL workflows (100 workflows)
- ✅ Need to create/update workflows programmatically
- ✅ Need optimized response format (46KB vs 234KB+)
- ✅ Performing bulk operations
- ✅ Building automation scripts
- ❌ Need delete/activate/deactivate operations (use REST API)
- ❌ Need quick read-only lookup in Augment Code (use MCP Access Gateway)

---

## METHOD 2: N8N MCP ACCESS GATEWAY (EXECUTION)

### **Overview**
The N8N MCP Access Gateway provides workflow execution through native Augment Code MCP tools using the MCP (Model Context Protocol).

**Status**: ✅ **ACTIVE**

**Purpose**: Workflow EXECUTION (AI-driven, MCP protocol)

**⚠️ IMPORTANT**: Only shows workflows with "Available in MCP" toggle enabled AND eligible trigger nodes (Webhook, Schedule, Chat, Form)

### **MCP Visibility Requirements**

For a workflow to be visible in MCP Access Gateway, it must meet **ALL** of these criteria:

1. ✅ **Be ACTIVE** (not inactive)
2. ✅ **Have eligible trigger node**: Webhook, Schedule, Chat, or Form
3. ✅ **Have "Available in MCP" toggle enabled** in workflow settings

**Current Status**: Only 1 workflow meets all criteria (N8N Admin Gateway)

**Estimated MCP-Eligible Workflows**: ~30-40 out of 100 workflows (30-40%)

### **Why Sub-Workflows Are Ineligible**

**Execute Workflow Trigger is NOT eligible for MCP access.**

Our LinkedIn automation architecture uses ~60-70 sub-workflows with Execute Workflow Trigger nodes. These workflows:
- ❌ Cannot be activated (by design)
- ❌ Are not eligible for MCP access
- ✅ Are internal implementation details, not public APIs
- ✅ Work perfectly with Admin Gateway Webhook

**Example Sub-Workflows (INELIGIBLE)**:
- Contact Enrichment Workshop (rClUELDAK9f4mgJx)
- Resume Generation Workshop (zTtSVmTg3UaV9tPG)
- Job Matching Workshop
- Outreach Tracking Workshop (WUe4y8iYEXNAB6dq)

**Example Orchestrators (ELIGIBLE)**:
- LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment (Schedule trigger)
- LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment (Schedule trigger)

### **Available Tools**

#### **1. search_workflows_N8N_MCP_Access_Gateway**
**Purpose**: Search/list MCP-enabled workflows with optional filters

**Parameters**:
- `query` (optional): Filter by name or description
- `projectId` (optional): Filter by project
- `limit` (optional): Max results (default 200)

**Example**:
```javascript
// In Augment Code
search_workflows_N8N_MCP_Access_Gateway({
  query: "LinkedIn",
  limit: 50
})
```

**Response**:
```json
{
  "workflows": [
    {
      "id": "1Zl6AzNunb0ewnNh",
      "name": "N8N Admin Gateway",
      "active": true,
      "createdAt": "2025-11-22T04:52:15.701Z"
    }
  ]
}
```

**Note**: Only returns workflows with "Available in MCP" toggle enabled

#### **2. get_workflow_details_N8N_MCP_Access_Gateway**
**Purpose**: Get detailed workflow configuration including trigger details

**Parameters**:
- `workflowId` (required): The workflow ID to retrieve

**Example**:
```javascript
// In Augment Code
get_workflow_details_N8N_MCP_Access_Gateway({
  workflowId: "1Zl6AzNunb0ewnNh"
})
```

**Response**:
```json
{
  "id": "1Zl6AzNunb0ewnNh",
  "name": "N8N Admin Gateway",
  "active": true,
  "nodes": [...],
  "connections": {...},
  "settings": {...},
  "triggers": [...]
}
```

### **When to Use MCP Access Gateway**
- ✅ AI-driven workflow execution
- ✅ External client integration via MCP protocol
- ✅ MCP-native applications
- ✅ Future workflows designed with eligible triggers
- ❌ Need to see ALL workflows (use Admin Gateway webhook)
- ❌ Need to manage sub-workflows (use Admin Gateway webhook)
- ❌ Need workflow CRUD operations (use Admin Gateway webhook)

### **Limitations**
1. **Eligibility Requirements**: Only shows workflows with eligible triggers (Webhook, Schedule, Chat, Form)
2. **Opt-In Required**: Workflows must have "Available in MCP" toggle enabled
3. **Sub-Workflows Excluded**: Execute Workflow Trigger is NOT eligible (~60-70 workflows excluded)
4. **Limited Scope**: ~30-40% of workflows are MCP-eligible

### **Comparison with Admin Gateway**
| Feature | MCP Access Gateway | Admin Gateway Webhook |
|---------|-------------------|----------------------|
| **Purpose** | Workflow EXECUTION | Workflow MANAGEMENT |
| **Workflow Count** | ~30-40 (MCP-eligible) | 100 (all workflows) |
| **Sub-Workflows** | ❌ Not visible | ✅ Visible |
| **Convenience** | High (native MCP) | Medium (webhook POST) |
| **Write Operations** | ✅ Execution | ✅ CRUD operations |
| **Use in Augment Code** | ✅ Easy | ⚠️ Manual |

---

## METHOD 3: N8N REST API (FALLBACK)

### **Overview**
Direct access to N8N REST API for advanced operations not available in Admin Gateway webhook.

**Status**: ✅ **AVAILABLE**

### **API Details**
- **Base URL**: `https://n8n.srv972609.hstgr.cloud/api/v1/`
- **Authentication**: Bearer token
  - Header: `Authorization: Bearer <JWT_TOKEN>`
  - Token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThhYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q`
- **Documentation**: https://docs.n8n.io/api/

### **Common API Endpoints**

#### **1. List Workflows**
```http
GET /api/v1/workflows
Authorization: Bearer <JWT_TOKEN>
```

**Response**: Array of all workflows with full configuration

#### **2. Get Workflow**
```http
GET /api/v1/workflows/{workflowId}
Authorization: Bearer <JWT_TOKEN>
```

#### **3. Create Workflow**
```http
POST /api/v1/workflows
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "New Workflow",
  "nodes": [...],
  "connections": {...}
}
```

#### **4. Update Workflow**
```http
PATCH /api/v1/workflows/{workflowId}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Updated Name",
  "nodes": [...]
}
```

#### **5. Delete Workflow** ✅
```http
DELETE /api/v1/workflows/{workflowId}
Authorization: Bearer <JWT_TOKEN>
```

**Use Case**: Delete operations not available in Admin Gateway

#### **6. Activate Workflow** ✅
```http
PATCH /api/v1/workflows/{workflowId}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "active": true
}
```

**Use Case**: Activation not implemented in Admin Gateway

#### **7. Deactivate Workflow** ✅
```http
PATCH /api/v1/workflows/{workflowId}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "active": false
}
```

**Use Case**: Deactivation not implemented in Admin Gateway

### **PowerShell Example**

```powershell
# Delete a workflow using REST API
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
$workflowId = "workflowIdToDelete"

$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod `
    -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/$workflowId" `
    -Method DELETE `
    -Headers $headers

Write-Host "Workflow $workflowId deleted successfully"
```

```powershell
# Activate a workflow using REST API
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
$workflowId = "1Zl6AzNunb0ewnNh"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    active = $true
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/$workflowId" `
    -Method PATCH `
    -Headers $headers `
    -Body $body

Write-Host "Workflow $workflowId activated successfully"
```

### **When to Use N8N REST API**
- ✅ Delete workflow operations (not available in Admin Gateway)
- ✅ Activate/Deactivate workflow operations (not implemented in Admin Gateway)
- ✅ Advanced operations not exposed via webhook
- ✅ Troubleshooting/debugging integration issues
- ✅ Need direct API control without intermediaries
- ❌ Standard CRUD operations (use Admin Gateway webhook - more convenient)
- ❌ Quick read-only lookups (use MCP Access Gateway - more convenient)

### **Error Handling**

**Common Errors**:
1. **401 Unauthorized**: Check Bearer token validity
2. **404 Not Found**: Verify workflow ID exists
3. **403 Forbidden**: Check API token permissions
4. **500 Internal Server Error**: N8N instance issue - check logs

**Error Response Format**:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

## MCP ELIGIBILITY REQUIREMENTS

### **Overview**
Not all N8N workflows are eligible for MCP access. Workflows must meet specific criteria to be visible in MCP Access Gateway.

### **Eligibility Criteria**

For a workflow to be MCP-accessible, it must meet **ALL** of these requirements:

1. ✅ **Be ACTIVE** (not inactive or archived)
2. ✅ **Have eligible trigger node**: One of the following:
   - Webhook Trigger
   - Schedule Trigger
   - Chat Trigger
   - Form Trigger
3. ✅ **Have "Available in MCP" toggle enabled** in workflow settings

### **Ineligible Trigger Nodes**

The following trigger nodes are **NOT eligible** for MCP access:

- ❌ **Execute Workflow Trigger** (used for sub-workflows)
- ❌ **Manual Trigger** (requires manual execution)
- ❌ **Error Trigger** (event-driven, not external)

### **Why Execute Workflow Trigger Is Ineligible**

Execute Workflow Trigger nodes are designed for **internal workflow orchestration**, not external access:

1. **No External Entry Point**: Sub-workflows are called by parent workflows, not by external clients
2. **Execution Context Dependency**: Sub-workflows expect specific data structures from parent workflows
3. **Security Model**: Sub-workflows are internal implementation details, not public APIs
4. **Activation Behavior**: Sub-workflows with Execute Workflow Trigger cannot be activated (by design)

### **Our Workflow Architecture**

**Total Workflows**: 100
- **Active Workflows**: 6 (6%)
- **Inactive Workflows**: 94 (94%)
  - Sub-Workflows (Execute Workflow Trigger): ~60-70 (❌ INELIGIBLE)
  - Archived Workflows: 54 (❌ INELIGIBLE)
  - Test/Other Workflows: ~20-30 (⚠️ MIXED)

**Estimated MCP-Eligible Workflows**: ~30-40 workflows (30-40%)

### **Example Workflows**

**MCP-Eligible (Schedule Triggers)**:
- ✅ LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment (gB6UEwFTeOdnAHPI)
- ✅ LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment (B2tNNaSkbLD8gDxw)
- ✅ N8N Admin Gateway (1Zl6AzNunb0ewnNh) - Webhook trigger

**MCP-Ineligible (Execute Workflow Triggers)**:
- ❌ Contact Enrichment Workshop (rClUELDAK9f4mgJx)
- ❌ Resume Generation Workshop (zTtSVmTg3UaV9tPG)
- ❌ Job Matching Workshop
- ❌ Outreach Tracking Workshop (WUe4y8iYEXNAB6dq)
- ❌ Contact Tracking Workshop (wZyxRjWShhnSFbSV)

### **Architectural Implications**

Our LinkedIn automation uses a **"General Contractor + Specialized Subcontractors"** architecture:

```
ORCHESTRATOR WORKFLOWS (MCP-Eligible ✅)
├── Schedule Trigger (Cron jobs)
└── Calls sub-workflows via Execute Workflow nodes

SUB-WORKFLOW WORKSHOPS (MCP-Ineligible ❌)
├── Execute Workflow Trigger
└── Called by orchestrator workflows
```

**Key Insight**: This architecture is **OPTIMAL** for our use case:
- Orchestrators can be MCP-accessible (if desired)
- Sub-workflows remain internal implementation details
- No need to retrofit sub-workflows with Webhook triggers
- Admin Gateway Webhook provides full access to ALL workflows

---

## ENABLING WORKFLOWS FOR MCP ACCESS

### **Overview**
To make a workflow visible in MCP Access Gateway, you must enable the "Available in MCP" toggle in workflow settings.

### **Prerequisites**

Before enabling MCP access, verify the workflow meets eligibility criteria:

1. ✅ Workflow is ACTIVE (or can be activated)
2. ✅ Workflow has eligible trigger node (Webhook, Schedule, Chat, Form)
3. ✅ Workflow is NOT a sub-workflow with Execute Workflow Trigger

### **Step-by-Step Instructions**

#### **Option 1: From the Workflow Editor (UI)**

1. Open the workflow in N8N workflow editor
2. Click **Settings** (gear icon in top-right corner)
3. Scroll to **MCP Access** section
4. Toggle **"Available in MCP"** to ON
5. Click **Save** to apply changes

#### **Option 2: Via API (Programmatic)**

**Using Admin Gateway Webhook**:
```json
{
  "operation": "update_workflow",
  "workflowId": "gB6UEwFTeOdnAHPI",
  "workflow": {
    "settings": {
      "availableInMCP": true
    }
  }
}
```

**Using N8N REST API**:
```http
PATCH /api/v1/workflows/gB6UEwFTeOdnAHPI
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "settings": {
    "availableInMCP": true
  }
}
```

### **Verification**

After enabling MCP access, verify the workflow is visible:

```javascript
// In Augment Code
search_workflows_N8N_MCP_Access_Gateway({
  limit: 200
})
```

The workflow should now appear in the results.

### **Recommended Workflows to Enable**

**High Priority** (Orchestrators):
- LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment (gB6UEwFTeOdnAHPI)
- LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment (B2tNNaSkbLD8gDxw)

**Medium Priority** (MCP Servers):
- Admin-MCP-Server--Augment (kPhABZnv2pc7LMF0)

**Low Priority** (Test Workflows):
- Test - MCP Calendar (HuZ10YOgOiTlYGrM)
- Test - Calendar Parent (mQodHXPxnKwkfp50)

**Do NOT Enable** (Sub-Workflows):
- Any workflow with Execute Workflow Trigger (ineligible)

### **Security Considerations**

**Important**: Enabling "Available in MCP" makes the workflow accessible to MCP clients. Only enable for workflows that:
- ✅ Are intended for external access
- ✅ Have proper authentication/authorization
- ✅ Do not expose sensitive operations
- ✅ Are production-ready and tested

**Do NOT enable** for:
- ❌ Internal sub-workflows
- ❌ Test/development workflows
- ❌ Workflows with sensitive operations
- ❌ Workflows without proper error handling

---

## METHOD 4: n8n-mcp NPM PACKAGE (DISABLED)

### **Overview**
The n8n-mcp NPM package (by czlonkowski) provides comprehensive N8N API access through MCP tools.

**Status**: ❌ **DISABLED - AUGMENT CODE BUG**

### **Why Disabled**

**Root Cause**: Augment Code environment variable bug
- Augment Code does NOT pass environment variables (`N8N_API_URL`, `N8N_API_KEY`) from MCP Settings Panel to spawned MCP server processes
- Without environment variables, n8n-mcp operates in Documentation Mode only (23 tools instead of 42 tools)
- No API management functionality available

**Evidence**:
- ✅ Manual PowerShell test with explicit environment variables: **42 tools** (n8n API: configured)
- ❌ Augment Code MCP server with configured environment variables: **23 tools** (n8n API: not configured)
- ✅ N8N API connection test: **PASSED** (API key is valid, instance is accessible)

### **Capabilities (if working)**
- 42 tools total:
  - 23 documentation tools (node search, documentation, validation)
  - 19 API management tools (workflow CRUD, execution management, credentials)
- Full N8N API access
- Native Augment Code integration
- Comprehensive workflow operations

### **Current Reality**
- Only 23 documentation tools available
- No API management functionality
- Redundant with Admin Gateway webhook for CRUD operations
- Blocked by Augment Code bug

### **Recommendation**
**DISABLE** - Redundant with Admin Gateway webhook and blocked by Augment Code bug

**Rationale**:
1. Admin Gateway webhook provides same CRUD functionality
2. Augment Code bug prevents full functionality
3. Maintaining multiple integration methods increases complexity
4. No unique value proposition over Admin Gateway + MCP Access Gateway combination

### **Re-enable Conditions**
Consider re-enabling if ALL of the following are true:
1. ✅ Augment Code fixes environment variable bug
2. ✅ n8n-mcp provides unique functionality not available via Admin Gateway
3. ✅ Performance/convenience benefits justify additional complexity

### **Bug Report Reference**
- **Bug Report**: Created 2025-11-21
- **Issue**: Augment Code not passing environment variables to MCP server processes
- **Diagnostic Suite**: 7 PowerShell scripts created for testing
- **Status**: Reported to Augment Code team

---

## DECISION TREE / FLOWCHART

### **Operation Decision Tree (HYBRID ARCHITECTURE)**

```
┌─────────────────────────────────────────────────────────────────┐
│         N8N INTEGRATION METHOD DECISION TREE (HYBRID)            │
└─────────────────────────────────────────────────────────────────┘

START: What operation do you need?
│
├─ 📋 WORKFLOW MANAGEMENT (List/Get/Create/Update)
│  │
│  ├─ List ALL workflows?
│  │  └─→ ✅ USE: N8N Admin Gateway Webhook
│  │      Operation: list_workflows
│  │      Returns: 100 workflows (including sub-workflows)
│  │      Time: 4.11s
│  │
│  ├─ Get specific workflow details?
│  │  └─→ ✅ USE: N8N Admin Gateway Webhook
│  │      Operation: get_workflow
│  │      Returns: Full workflow configuration
│  │      Works with: ALL workflows (including sub-workflows)
│  │
│  ├─ Create new workflow?
│  │  └─→ ✅ USE: N8N Admin Gateway Webhook
│  │      Operation: create_workflow
│  │      Status: WORKING
│  │
│  └─ Update existing workflow?
│     └─→ ✅ USE: N8N Admin Gateway Webhook
│         Operation: update_workflow
│         Status: WORKING
│
├─ 🚀 WORKFLOW EXECUTION (AI-driven, MCP protocol)
│  │
│  ├─ Execute MCP-enabled workflow?
│  │  └─→ ✅ USE: N8N MCP Access Gateway
│  │      Tools: search_workflows, get_workflow_details
│  │      Shows: Only workflows with "Available in MCP" toggle
│  │      Eligible: Webhook, Schedule, Chat, Form triggers
│  │      Ineligible: Execute Workflow Trigger (sub-workflows)
│  │
│  └─ Need to see which workflows are MCP-enabled?
│     └─→ ✅ USE: N8N MCP Access Gateway
│         Tool: search_workflows_N8N_MCP_Access_Gateway
│         Returns: ~30-40 MCP-eligible workflows
│
├─ ✏️ ADVANCED OPERATIONS (Delete/Activate/Deactivate)
│  │
│  ├─ Delete workflow?
│  │  └─→ ⚠️ USE: N8N REST API
│  │      Endpoint: DELETE /api/v1/workflows/{id}
│  │      Reason: Not implemented in Admin Gateway
│  │
│  ├─ Activate workflow?
│  │  └─→ ⚠️ USE: N8N REST API
│  │      Endpoint: PATCH /api/v1/workflows/{id}
│  │      Body: {"active": true}
│  │      Reason: Not implemented in Admin Gateway
│  │
│  ├─ Deactivate workflow?
│  │  └─→ ⚠️ USE: N8N REST API
│  │      Endpoint: PATCH /api/v1/workflows/{id}
│  │      Body: {"active": false}
│  │      Reason: Not implemented in Admin Gateway
│  │
│  └─ Enable "Available in MCP" toggle?
│     └─→ ⚠️ USE: N8N REST API or Admin Gateway Webhook
│         Endpoint: PATCH /api/v1/workflows/{id}
│         Body: {"settings": {"availableInMCP": true}}
│
├─ 🔧 TROUBLESHOOTING / DEBUGGING
│  └─→ ✅ USE: N8N REST API
│      Reason: Direct access, no intermediaries
│      Benefit: Full control, detailed error messages
│
└─ 🤔 UNSURE?
   └─→ HYBRID APPROACH:
       1. Workflow MANAGEMENT → Admin Gateway Webhook
       2. Workflow EXECUTION → MCP Access Gateway
       3. Advanced operations → N8N REST API
```

### **Method Selection Matrix**

| Scenario | Recommended Method | Alternative |
|----------|-------------------|-------------|
| List all workflows | Admin Gateway Webhook | REST API |
| Get single workflow | Admin Gateway Webhook | MCP Access Gateway* |
| Create workflow | Admin Gateway Webhook | REST API |
| Update workflow | Admin Gateway Webhook | REST API |
| Delete workflow | REST API | N/A |
| Activate workflow | REST API | N/A |
| Deactivate workflow | REST API | N/A |
| Quick lookup in Augment | MCP Access Gateway* | Admin Gateway Webhook |
| Troubleshooting | REST API | N/A |
| Bulk operations | Admin Gateway Webhook | REST API |

*MCP Access Gateway only shows 1 workflow due to API key restrictions

---

## TROUBLESHOOTING GUIDE

### **Common Issues & Solutions**

#### **Issue 1: Admin Gateway Webhook Timeout**
**Symptoms**: Webhook request times out (>30 seconds), no response received

**Possible Causes**:
1. N8N instance is processing large data
2. Network connectivity issues
3. Webhook workflow is not active

**Solutions**:
1. ✅ Verify workflow is ACTIVE: Check https://n8n.srv972609.hstgr.cloud/workflow/1Zl6AzNunb0ewnNh
2. ✅ Check N8N instance status: Visit https://n8n.srv972609.hstgr.cloud
3. ✅ Increase timeout setting in your HTTP client (default: 30s → 60s)
4. ✅ Retry request after 30 seconds
5. ⚠️ Fallback to N8N REST API if webhook continues to timeout

**Verification**:
```powershell
# Test webhook connectivity
$response = Invoke-RestMethod `
    -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" `
    -Method POST `
    -Headers @{"X-N8N-API-KEY"="your_key"; "Content-Type"="application/json"} `
    -Body '{"operation":"list_workflows"}' `
    -TimeoutSec 60

Write-Host "Response received in $($response.count) workflows"
```

#### **Issue 2: MCP Access Gateway Shows Only 1 Workflow**
**Symptoms**: `search_workflows_N8N_MCP_Access_Gateway` returns only 1 workflow instead of 100

**Root Cause**: API key permission restrictions

**This is EXPECTED BEHAVIOR** - Not a bug

**Solutions**:
1. ✅ Use N8N Admin Gateway Webhook for full workflow list (100 workflows)
2. ✅ Use MCP Access Gateway only for quick lookups of known workflows
3. ✅ Understand limitation: MCP Access Gateway is read-only discovery layer with restricted scope

**Comparison**:
- MCP Access Gateway: 1 workflow (API key restrictions)
- Admin Gateway Webhook: 100 workflows (full access)

#### **Issue 3: REST API Returns 401 Unauthorized**
**Symptoms**: REST API calls fail with 401 Unauthorized error

**Possible Causes**:
1. Invalid or expired Bearer token
2. Missing Authorization header
3. Incorrect token format

**Solutions**:
1. ✅ Verify Bearer token is correct:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThhYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q
   ```
2. ✅ Check Authorization header format: `Authorization: Bearer <token>`
3. ✅ Test token with simple GET request:
   ```powershell
   $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   Invoke-RestMethod `
       -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows" `
       -Headers @{"Authorization"="Bearer $token"}
   ```

#### **Issue 4: Admin Gateway Returns Error "Invalid Operation"**
**Symptoms**: Webhook returns error message "Invalid operation"

**Possible Causes**:
1. Misspelled operation name
2. Operation not implemented
3. Missing required parameters

**Solutions**:
1. ✅ Verify operation name spelling:
   - ✅ `list_workflows` (correct)
   - ❌ `listWorkflows` (incorrect)
   - ❌ `list-workflows` (incorrect)
2. ✅ Check available operations:
   - ✅ `list_workflows` (working)
   - ✅ `get_workflow` (working)
   - ✅ `create_workflow` (working)
   - ✅ `update_workflow` (working)
   - ⚠️ `delete_workflow` (not connected)
   - ❌ `activate_workflow` (not implemented)
   - ❌ `deactivate_workflow` (not implemented)
3. ✅ Include required parameters:
   - `get_workflow` requires `workflowId`
   - `create_workflow` requires `workflow` object
   - `update_workflow` requires `workflowId` and `workflow` object

#### **Issue 5: n8n-mcp NPM Package Shows Only 23 Tools**
**Symptoms**: n8n-mcp MCP server shows 23 tools instead of 42 tools

**Root Cause**: Augment Code environment variable bug

**This is EXPECTED BEHAVIOR** - Known Augment Code bug

**Solutions**:
1. ✅ Use N8N Admin Gateway Webhook instead (PRIMARY method)
2. ✅ Use N8N REST API for operations not available in Admin Gateway
3. ✅ Disable n8n-mcp MCP server (redundant and non-functional)
4. ⚠️ Wait for Augment Code to fix environment variable bug (no ETA)

**Status**: ❌ **DISABLED** - Use Admin Gateway Webhook instead

### **Connectivity Testing**

#### **Test 1: Verify N8N Instance is Accessible**
```powershell
# Test N8N instance connectivity
$response = Invoke-WebRequest -Uri "https://n8n.srv972609.hstgr.cloud" -UseBasicParsing
Write-Host "N8N Instance Status: $($response.StatusCode) $($response.StatusDescription)"
```

**Expected**: `200 OK`

#### **Test 2: Verify Admin Gateway Webhook is Active**
```powershell
# Test Admin Gateway webhook
$headers = @{
    "X-N8N-API-KEY" = "your_api_key"
    "Content-Type" = "application/json"
}

$body = @{
    operation = "list_workflows"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -TimeoutSec 30

    Write-Host "✅ Admin Gateway WORKING - $($response.count) workflows found"
} catch {
    Write-Host "❌ Admin Gateway FAILED - $($_.Exception.Message)"
}
```

**Expected**: `✅ Admin Gateway WORKING - 100 workflows found`

#### **Test 3: Verify REST API Access**
```powershell
# Test REST API connectivity
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

try {
    $response = Invoke-RestMethod `
        -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows" `
        -Headers @{"Authorization"="Bearer $token"}

    Write-Host "✅ REST API WORKING - $($response.data.Count) workflows found"
} catch {
    Write-Host "❌ REST API FAILED - $($_.Exception.Message)"
}
```

**Expected**: `✅ REST API WORKING - 100 workflows found`

#### **Test 4: Verify MCP Access Gateway**
```javascript
// In Augment Code
try {
    const result = await search_workflows_N8N_MCP_Access_Gateway({
        limit: 200
    });
    console.log(`✅ MCP Access Gateway WORKING - ${result.workflows.length} workflows found`);
} catch (error) {
    console.log(`❌ MCP Access Gateway FAILED - ${error.message}`);
}
```

**Expected**: `✅ MCP Access Gateway WORKING - 1 workflows found` (limitation)

### **Fallback Procedures**

#### **Scenario 1: Admin Gateway Webhook Unavailable**
**Fallback Chain**:
1. ✅ Try N8N REST API (direct access)
2. ✅ Check N8N instance status
3. ✅ Verify workflow is active
4. ✅ Contact N8N administrator

#### **Scenario 2: All Integration Methods Failing**
**Diagnostic Steps**:
1. ✅ Verify N8N instance is accessible: `https://n8n.srv972609.hstgr.cloud`
2. ✅ Check network connectivity
3. ✅ Verify authentication credentials (Bearer token, API key)
4. ✅ Check N8N instance logs for errors
5. ✅ Contact N8N administrator

#### **Scenario 3: Need Delete/Activate/Deactivate Operations**
**Solution**: Use N8N REST API (Method 3)
- Delete: `DELETE /api/v1/workflows/{id}`
- Activate: `PATCH /api/v1/workflows/{id}` with `{"active": true}`
- Deactivate: `PATCH /api/v1/workflows/{id}` with `{"active": false}`

---

## QUICK REFERENCE

### **Method Priority**
1. **PRIMARY**: N8N Admin Gateway Webhook (full CRUD)
2. **SECONDARY**: N8N MCP Access Gateway (quick lookups)
3. **FALLBACK**: N8N REST API (advanced operations)
4. **DISABLED**: n8n-mcp NPM Package (Augment Code bug)

### **Admin Gateway Webhook**
- **URL**: `https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway`
- **Auth**: Header `X-N8N-API-KEY`
- **Operations**: list_workflows, get_workflow, create_workflow, update_workflow
- **Performance**: 4.11s response, 46KB size, 100 workflows

### **MCP Access Gateway**
- **Tools**: `search_workflows_N8N_MCP_Access_Gateway`, `get_workflow_details_N8N_MCP_Access_Gateway`
- **Limitation**: Only shows 1 workflow (API key restrictions)
- **Use**: Quick lookups in Augment Code

### **REST API**
- **URL**: `https://n8n.srv972609.hstgr.cloud/api/v1/`
- **Auth**: Bearer token `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Use**: Delete, Activate, Deactivate operations

### **Quick Decision Guide**
- **List all workflows** → Admin Gateway Webhook
- **Get single workflow** → Admin Gateway Webhook (or MCP Access Gateway for quick lookup)
- **Create/Update workflow** → Admin Gateway Webhook
- **Delete workflow** → REST API
- **Activate/Deactivate workflow** → REST API
- **Quick lookup in Augment** → MCP Access Gateway (1 workflow only)
- **Troubleshooting** → REST API

### **Common Operations**

**List All Workflows**:
```powershell
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" `
    -Method POST -Headers @{"X-N8N-API-KEY"="key";"Content-Type"="application/json"} `
    -Body '{"operation":"list_workflows"}'
```

**Get Workflow**:
```powershell
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" `
    -Method POST -Headers @{"X-N8N-API-KEY"="key";"Content-Type"="application/json"} `
    -Body '{"operation":"get_workflow","workflowId":"1Zl6AzNunb0ewnNh"}'
```

**Delete Workflow** (REST API):
```powershell
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/workflowId" `
    -Method DELETE -Headers @{"Authorization"="Bearer token"}
```

**Activate Workflow** (REST API):
```powershell
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/workflowId" `
    -Method PATCH -Headers @{"Authorization"="Bearer token";"Content-Type"="application/json"} `
    -Body '{"active":true}'
```

---

## APPENDIX

### **Related Documentation**
- **N8N Admin Gateway Status Report**: `N8N-ADMIN-GATEWAY-STATUS-REPORT-2025-11-22.md`
- **Webhook Fix Success Report**: `WEBHOOK-FIX-SUCCESS-REPORT-2025-11-22.md`
- **Admin Gateway Analysis**: `ADMIN-GATEWAY-ANALYSIS-SUMMARY-2025-11-22.md`
- **Conversation Handover**: `Docs/handover/conversation-handover-knowledge-transfer.md`

### **Workflow Information**
- **Admin Gateway Workflow ID**: `1Zl6AzNunb0ewnNh`
- **Admin Gateway Workflow URL**: https://n8n.srv972609.hstgr.cloud/workflow/1Zl6AzNunb0ewnNh
- **Total Workflows in Instance**: 100 (6 active, 94 inactive, 54 archived)

### **Authentication Credentials**
- **Bearer Token (REST API)**: Stored in memories (JWT token)
- **API Key (Webhook)**: Contact administrator for current key
- **MCP Access Gateway**: Configured in Augment Code (no manual auth needed)

### **Support & Troubleshooting**
- **N8N Instance**: https://n8n.srv972609.hstgr.cloud
- **N8N Documentation**: https://docs.n8n.io/
- **N8N API Documentation**: https://docs.n8n.io/api/
- **Bug Reports**: See `Docs/handover/conversation-handover-knowledge-transfer.md`

---

**Document Version**: 1.0
**Last Updated**: 2025-11-22
**Next Review**: 2025-12-22 (or when Admin Gateway Delete/Activate/Deactivate operations are implemented)


