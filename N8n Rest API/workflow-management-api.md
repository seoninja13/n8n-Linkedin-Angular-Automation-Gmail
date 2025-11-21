# N8N Workflow Management API - Detailed Reference

**API Base:** `https://n8n.srv972609.hstgr.cloud/api/v1`

---

## ⚠️ CRITICAL LIMITATIONS

**Validation Date:** 2025-11-20

The N8N REST API has **severe limitations** for workflow management:

| Operation | Status | Notes |
|-----------|--------|-------|
| ✅ List Workflows | **SUPPORTED** | Full read access |
| ✅ Get Workflow Details | **SUPPORTED** | Complete workflow JSON |
| ⚠️ Create Workflow | **PARTIAL** | Works but requires exact node structure |
| ❌ Update Workflow | **NOT SUPPORTED** | 405 Method Not Allowed |
| ❌ Delete Workflow | **NOT SUPPORTED** | Endpoint does not exist |
| ❌ Activate/Deactivate | **NOT SUPPORTED** | Must use N8N UI |
| ❌ Duplicate Workflow | **NOT SUPPORTED** | 404 Not Found |

**For write operations, use:**
- **N8N Web UI** - Manual workflow management
- **N8N MCP Server** - Programmatic control (n8n-mcp package)

See [API Validation Report](./api-validation-report.md) for complete test results.

---

## 📋 Workflow Operations

### 1. List All Workflows

**Endpoint:** `GET /workflows`

**Query Parameters:**
- `limit` (optional): Number of workflows to return (default: 100)
- `cursor` (optional): Pagination cursor for next page
- `active` (optional): Filter by active status (true/false)

**Response:**
```json
{
  "data": [
    {
      "id": "WUe4y8iYEXNAB6dq",
      "name": "LinkedIn-SEO-Gmail-Outreach",
      "active": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-20T14:22:00.000Z",
      "tags": [],
      "versionId": "abc123"
    }
  ],
  "nextCursor": "eyJpZCI6IjEyMyJ9"
}
```

**PowerShell Example:**
```powershell
$headers = @{ "X-N8N-API-KEY" = $apiKey }
$workflows = Invoke-RestMethod -Uri "$baseUrl/workflows?limit=50" -Headers $headers
$workflows.data | Format-Table id, name, active
```

---

### 2. Get Workflow by ID

**Endpoint:** `GET /workflows/{workflowId}`

**Response:**
```json
{
  "id": "WUe4y8iYEXNAB6dq",
  "name": "LinkedIn-SEO-Gmail-Outreach",
  "active": true,
  "nodes": [
    {
      "id": "node-1",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [100, 100],
      "parameters": {}
    }
  ],
  "connections": {
    "node-1": {
      "main": [[{"node": "node-2", "type": "main", "index": 0}]]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": {},
  "tags": [],
  "versionId": "abc123"
}
```

**PowerShell Example:**
```powershell
$workflowId = "WUe4y8iYEXNAB6dq"
$workflow = Invoke-RestMethod -Uri "$baseUrl/workflows/$workflowId" -Headers $headers
$workflow.nodes | Format-Table name, type
```

---

### 3. Create New Workflow

**Endpoint:** `POST /workflows`

**Request Body:**
```json
{
  "name": "My New Workflow",
  "nodes": [
    {
      "id": "trigger-node",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [100, 100],
      "parameters": {},
      "typeVersion": 1
    },
    {
      "id": "code-node",
      "name": "Process Data",
      "type": "n8n-nodes-base.code",
      "position": [300, 100],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "return $input.all();"
      },
      "typeVersion": 2
    }
  ],
  "connections": {
    "trigger-node": {
      "main": [[{"node": "code-node", "type": "main", "index": 0}]]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  }
}
```

**PowerShell Example:**
```powershell
$newWorkflow = @{
    name = "API-Created-Workflow"
    nodes = @(
        @{
            id = "trigger"
            name = "Start"
            type = "n8n-nodes-base.manualTrigger"
            position = @(100, 100)
            parameters = @{}
            typeVersion = 1
        }
    )
    connections = @{}
    active = $false
} | ConvertTo-Json -Depth 10

$created = Invoke-RestMethod -Uri "$baseUrl/workflows" `
    -Method POST -Headers $headers -Body $newWorkflow -ContentType "application/json"
```

---

### 4. ❌ Update Workflow (NOT SUPPORTED)

**Endpoint:** `PATCH /workflows/{workflowId}`
**Status:** ❌ **405 Method Not Allowed**

**This operation is NOT supported by the N8N REST API.**

To update workflows, you must:
1. Use the N8N Web UI
2. Use the N8N MCP Server (n8n-mcp package)
3. Delete and recreate the workflow (not recommended)

---

### 5. ❌ Delete Workflow (NOT SUPPORTED)

**Endpoint:** `DELETE /workflows/{workflowId}`
**Status:** ❌ **Endpoint does not exist**

**This operation is NOT supported by the N8N REST API.**

To delete workflows, you must use the N8N Web UI.

---

### 6. ❌ Activate/Deactivate Workflow (NOT SUPPORTED)

**Endpoint:** `PATCH /workflows/{workflowId}`
**Status:** ❌ **405 Method Not Allowed**

**This operation is NOT supported by the N8N REST API.**

To activate/deactivate workflows, you must use the N8N Web UI.

---

## 🔍 Advanced Operations

### ❌ Duplicate Workflow (NOT SUPPORTED)

**Endpoint:** `POST /workflows/{workflowId}/duplicate`
**Status:** ❌ **404 Not Found**

**This operation is NOT supported by the N8N REST API.**

To duplicate workflows, you must use the N8N Web UI.

---

## ⚠️ Important Notes

1. **Workflow Activation:** Workflows with trigger nodes (Webhook, Schedule, etc.) must be activated to run automatically
2. **Node IDs:** Must be unique within a workflow
3. **Type Versions:** Each node type has a version number that must match the installed version
4. **Connections:** Must reference valid node IDs in the workflow
5. **Credentials:** Referenced credentials must exist and be accessible

---

## 📊 Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | Success | Operation completed successfully |
| 201 | Created | Workflow created successfully |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 404 | Not Found | Workflow ID does not exist |
| 500 | Server Error | Internal server error |

---

## 🔗 Related Documentation

- [Execution Monitoring API](./execution-monitoring-api.md)
- [Webhook API](./webhook-api.md)
- [Main README](./README.md)

