# N8N REST API - Complete Reference Guide

**Last Updated:** 2025-01-20
**N8N Instance:** https://n8n.srv972609.hstgr.cloud
**API Base URL:** https://n8n.srv972609.hstgr.cloud/api/v1
**Authentication:** Bearer token via `X-N8N-API-KEY` header

---

## ✅ SOLUTION: N8N MCP SERVER FOR WORKFLOW MANAGEMENT

**The N8N REST API is READ-ONLY for workflow management**, but the **N8N MCP Server provides COMPLETE programmatic control**.

### Recommended Approach
- **Use N8N MCP Server** (n8n-mcp-czlon) for ALL workflow write operations:
  - ✅ Create workflows
  - ✅ Update workflows (name, nodes, connections)
  - ✅ Delete workflows
  - ✅ Activate/deactivate workflows
  - ✅ Validate workflows

- **Use N8N REST API** for monitoring and read operations:
  - ✅ List workflows
  - ✅ Get workflow details
  - ✅ Monitor executions
  - ✅ Track errors

See **[N8N Operations Index](./n8n-operations-index.md)** for complete tool comparison and usage guide.

---

## 📚 Documentation Index

This directory contains comprehensive documentation for the N8N REST API:

### 🔴 Critical Documents (Read First!)
1. **[n8n-operations-index.md](./n8n-operations-index.md)** - 🔴 **START HERE: Complete tool comparison (MCP Server vs REST API)**
2. **[VALIDATION-SUMMARY.md](./VALIDATION-SUMMARY.md)** - 🔴 **Quick overview of what works and what doesn't**
3. **[api-validation-report.md](./api-validation-report.md)** - 🔴 **Detailed REST API validation results**

### 📖 API Reference Documentation
4. **[README.md](./README.md)** (this file) - Overview and quick reference
5. **[quick-reference.md](./quick-reference.md)** - ⚡ Cheat sheet for common operations
6. **[workflow-management-api.md](./workflow-management-api.md)** - ⚠️ Read workflows (UPDATE/DELETE not supported)
7. **[execution-monitoring-api.md](./execution-monitoring-api.md)** - ✅ Monitor and analyze workflow executions
8. **[webhook-api.md](./webhook-api.md)** - Trigger workflows via HTTP webhooks
9. **[credentials-api.md](./credentials-api.md)** - ⚠️ Create credentials (LIST not supported)

### 🧪 Testing & Examples
10. **[testing-guide.md](./testing-guide.md)** - Test scripts and validation procedures
11. **[integration-examples.md](./integration-examples.md)** - Real-world integration examples

**💡 New to N8N?** Start with the [N8N Operations Index](./n8n-operations-index.md) to see which tool to use for each operation!

---

## 📋 Quick Reference

### Current API Configuration
- **API Key Status:** ✅ Active (expires 2025-12-18)
- **API Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxMDcxMzc5LCJleHAiOjE3NjM1OTMyMDB9.gS4cZZ8ZHv_80XNpLsgTJYpBG97ecX19ol42uB-kNGQ`
- **Authentication Method:** `X-N8N-API-KEY` header
- **Content Type:** `application/json`

---

## 🔧 Core API Endpoints

### Workflow Management

#### List All Workflows
```http
GET /api/v1/workflows
```
**Status:** ✅ Fully Supported  
**Returns:** Array of workflow objects with metadata

#### Get Workflow by ID
```http
GET /api/v1/workflows/{workflowId}
```
**Status:** ✅ Fully Supported  
**Returns:** Complete workflow definition including nodes and connections

#### Create Workflow
```http
POST /api/v1/workflows
Content-Type: application/json

{
  "name": "My Workflow",
  "nodes": [],
  "connections": {},
  "active": false,
  "settings": {}
}
```
**Status:** ✅ Fully Supported

#### Update Workflow
```http
PATCH /api/v1/workflows/{workflowId}
Content-Type: application/json

{
  "name": "Updated Name",
  "active": true
}
```
**Status:** ✅ Fully Supported

#### Delete Workflow
```http
DELETE /api/v1/workflows/{workflowId}
```
**Status:** ✅ Fully Supported

---

### Execution Monitoring

#### List Executions
```http
GET /api/v1/executions?workflowId={workflowId}&limit=10
```
**Status:** ✅ Fully Supported  
**Query Parameters:**
- `workflowId` (optional): Filter by workflow
- `limit` (optional): Number of results (default: 20)
- `status` (optional): Filter by status (success, error, waiting)

#### Get Execution Details
```http
GET /api/v1/executions/{executionId}
```
**Status:** ✅ Fully Supported  
**Returns:** Complete execution data including node outputs

---

### Credentials Management

#### List Credentials
```http
GET /api/v1/credentials
```
**Status:** ✅ Fully Supported  
**Returns:** Array of credential objects (sensitive data excluded)

#### Get Credential by ID
```http
GET /api/v1/credentials/{credentialId}
```
**Status:** ✅ Fully Supported

---

### Webhook Triggers

#### Trigger Webhook Workflow
```http
POST /webhook/{webhookPath}
Content-Type: application/json

{
  "data": "your payload"
}
```
**Status:** ✅ Fully Supported  
**Note:** Workflow must be active and contain a Webhook node

---

## 🔐 Authentication Examples

### PowerShell
```powershell
$apiKey = "your-api-key-here"
$headers = @{
    "X-N8N-API-KEY" = $apiKey
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows" `
    -Method GET -Headers $headers
```

### cURL
```bash
curl -H "X-N8N-API-KEY: your-api-key-here" \
     -H "Content-Type: application/json" \
     https://n8n.srv972609.hstgr.cloud/api/v1/workflows
```

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://n8n.srv972609.hstgr.cloud/api/v1',
  headers: {
    'X-N8N-API-KEY': 'your-api-key-here',
    'Content-Type': 'application/json'
  }
});

const workflows = await api.get('/workflows');
```

---

## 📊 API Capability Matrix

| Category | Endpoint | Method | Status | Notes |
|----------|----------|--------|--------|-------|
| **Workflow Management** | `/workflows` | GET | ✅ | List all workflows |
| | `/workflows/{id}` | GET | ✅ | Get workflow details |
| | `/workflows` | POST | ✅ | Create workflow |
| | `/workflows/{id}` | PATCH | ✅ | Update workflow |
| | `/workflows/{id}` | DELETE | ✅ | Delete workflow |
| **Execution** | `/executions` | GET | ✅ | List executions |
| | `/executions/{id}` | GET | ✅ | Get execution details |
| **Credentials** | `/credentials` | GET | ✅ | List credentials |
| | `/credentials/{id}` | GET | ✅ | Get credential |
| **Webhooks** | `/webhook/{path}` | POST | ✅ | Trigger webhook |
| **Health** | `/health` | GET | ✅ | Instance health check |

---

## 📁 Related Documentation

- **[API Capability Assessment](../N8N-API-Capability-Assessment-Report.md)** - Full endpoint testing results
- **[MCP Server Configuration](../N8N_MCP_SERVER_CONFIGURATION_UPDATED.md)** - MCP integration setup
- **[Test Scripts](../test-n8n-api-capabilities.ps1)** - PowerShell testing suite

---

## 🚀 LinkedIn Automation Integration

The N8N REST API is used in the LinkedIn automation system for:
- **Workflow Management:** Creating and updating automation workflows
- **Execution Monitoring:** Tracking job discovery, resume generation, and outreach
- **Webhook Triggers:** Initiating workflow chains via HTTP endpoints
- **Credential Management:** Securely storing API keys for Gmail, Google Sheets, Apollo.io

**Key Workflows:**
- Job Discovery (ID: `qWMubgbQCCk8CrII`)
- Resume Generation (ID: `UD4BXHqXgheWDBB4`)
- Contact Enrichment (ID: `Ccj3e5fuNnEVT7et`)
- Outreach Tracking (ID: `0ZJ84RLQXxuYKLyE`)
- Validation Reporting (ID: `5LfnNVYjb5XeIGKB`)

