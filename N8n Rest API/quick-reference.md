# N8N REST API Quick Reference Cheat Sheet

**API Base:** `https://n8n.srv972609.hstgr.cloud/api/v1`  
**Auth Header:** `X-N8N-API-KEY: your-api-key`

---

## 🚀 Most Common Operations

### List Workflows
```bash
GET /workflows
```

### Get Workflow Details
```bash
GET /workflows/{workflowId}
```

### Create Workflow
```bash
POST /workflows
Content-Type: application/json

{
  "name": "My Workflow",
  "nodes": [...],
  "connections": {...},
  "active": false
}
```

### Update Workflow
```bash
PATCH /workflows/{workflowId}
Content-Type: application/json

{
  "name": "Updated Name",
  "active": true
}
```

### Delete Workflow
```bash
DELETE /workflows/{workflowId}
```

---

## 📊 Execution Monitoring

### List Executions
```bash
GET /executions?workflowId={id}&limit=10&status=error
```

### Get Execution Details
```bash
GET /executions/{executionId}
```

### Get Running Executions
```bash
GET /executions-current
```

---

## 🌐 Webhooks

### Trigger Webhook
```bash
POST /webhook/{webhookPath}
Content-Type: application/json

{
  "data": "your payload"
}
```

**Note:** Workflow must be active!

---

## 🔑 Credentials

### List Credentials
```bash
GET /credentials
```

### Get Credential
```bash
GET /credentials/{credentialId}
```

---

## 💻 PowerShell Quick Start

```powershell
# Setup
$apiKey = "your-api-key"
$baseUrl = "https://n8n.srv972609.hstgr.cloud/api/v1"
$headers = @{
    "X-N8N-API-KEY" = $apiKey
    "Content-Type" = "application/json"
}

# List workflows
$workflows = Invoke-RestMethod -Uri "$baseUrl/workflows" -Headers $headers

# Get workflow
$workflow = Invoke-RestMethod -Uri "$baseUrl/workflows/WUe4y8iYEXNAB6dq" -Headers $headers

# List executions
$executions = Invoke-RestMethod -Uri "$baseUrl/executions?limit=10" -Headers $headers

# Trigger webhook
$data = @{ test = "data" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/test" `
    -Method POST -Body $data -ContentType "application/json"
```

---

## 🐚 cURL Quick Start

```bash
# Setup
API_KEY="your-api-key"
BASE_URL="https://n8n.srv972609.hstgr.cloud/api/v1"

# List workflows
curl -H "X-N8N-API-KEY: $API_KEY" $BASE_URL/workflows

# Get workflow
curl -H "X-N8N-API-KEY: $API_KEY" $BASE_URL/workflows/WUe4y8iYEXNAB6dq

# List executions
curl -H "X-N8N-API-KEY: $API_KEY" "$BASE_URL/executions?limit=10"

# Trigger webhook
curl -X POST https://n8n.srv972609.hstgr.cloud/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## 🔍 Common Query Parameters

| Parameter | Endpoints | Description |
|-----------|-----------|-------------|
| `limit` | /workflows, /executions | Number of results (default: 20) |
| `cursor` | /workflows, /executions | Pagination cursor |
| `workflowId` | /executions | Filter by workflow |
| `status` | /executions | Filter by status (success, error, running) |
| `includeData` | /executions | Include full execution data |
| `active` | /workflows | Filter by active status |

---

## 📊 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## 🎯 LinkedIn Automation Workflow IDs

| Workflow | ID | Webhook Path |
|----------|----|--------------| 
| Job Discovery | `qWMubgbQCCk8CrII` | `/webhook/job-discovery` |
| Resume Generation | `UD4BXHqXgheWDBB4` | `/webhook/resume-generation` |
| Contact Enrichment | `Ccj3e5fuNnEVT7et` | `/webhook/contact-enrichment` |
| Outreach Tracking | `0ZJ84RLQXxuYKLyE` | `/webhook/outreach-tracking` |
| Validation Reporting | `5LfnNVYjb5XeIGKB` | `/webhook/validation-reporting` |

---

## ⚡ One-Liners

### PowerShell
```powershell
# Count active workflows
(Invoke-RestMethod -Uri "$baseUrl/workflows" -Headers $headers).data | Where-Object { $_.active } | Measure-Object | Select-Object -ExpandProperty Count

# Get recent errors
(Invoke-RestMethod -Uri "$baseUrl/executions?status=error&limit=5" -Headers $headers).data | Format-Table id, workflowId, startedAt

# Backup all workflows
(Invoke-RestMethod -Uri "$baseUrl/workflows" -Headers $headers).data | ForEach-Object { Invoke-RestMethod -Uri "$baseUrl/workflows/$($_.id)" -Headers $headers | ConvertTo-Json -Depth 100 | Out-File "backup-$($_.id).json" }
```

### Bash
```bash
# Count active workflows
curl -s -H "X-N8N-API-KEY: $API_KEY" $BASE_URL/workflows | jq '.data | map(select(.active == true)) | length'

# Get recent errors
curl -s -H "X-N8N-API-KEY: $API_KEY" "$BASE_URL/executions?status=error&limit=5" | jq '.data[] | {id, workflowId, startedAt}'

# List workflow names
curl -s -H "X-N8N-API-KEY: $API_KEY" $BASE_URL/workflows | jq -r '.data[] | .name'
```

---

## 🔗 Full Documentation

For detailed documentation, see:
- [Workflow Management API](./workflow-management-api.md)
- [Execution Monitoring API](./execution-monitoring-api.md)
- [Webhook API](./webhook-api.md)
- [Credentials API](./credentials-api.md)
- [Testing Guide](./testing-guide.md)
- [Integration Examples](./integration-examples.md)

