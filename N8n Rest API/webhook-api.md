# N8N Webhook API - Detailed Reference

**Webhook Base:** `https://n8n.srv972609.hstgr.cloud/webhook`

---

## 📋 Webhook Operations

### 1. Trigger Webhook Workflow

**Endpoint:** `POST /webhook/{webhookPath}`  
**Alternative:** `GET /webhook/{webhookPath}` (for GET-based webhooks)

**Headers:**
- `Content-Type: application/json` (for POST requests)
- No authentication required (webhooks are public by default)

**Request Body (POST):**
```json
{
  "jobTitle": "SEO Specialist",
  "company": "Tech Corp",
  "location": "Remote",
  "customData": {
    "field1": "value1"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "processed": true,
    "result": "Workflow executed successfully"
  }
}
```

---

## 🔧 Webhook Configuration in N8N

### Webhook Node Setup
1. Add a **Webhook** node to your workflow
2. Configure the webhook path (e.g., `job-discovery`)
3. Set HTTP method (GET, POST, PUT, DELETE, PATCH)
4. Configure response options
5. **Activate the workflow** (webhooks only work when workflow is active)

### Webhook Node Parameters
```json
{
  "httpMethod": "POST",
  "path": "job-discovery",
  "responseMode": "onReceived",
  "responseData": "firstEntryJson",
  "options": {
    "rawBody": false
  }
}
```

---

## 🎯 LinkedIn Automation Webhook Endpoints

### Job Discovery Webhook
**Path:** `/webhook/job-discovery`  
**Method:** POST  
**Workflow ID:** `qWMubgbQCCk8CrII`

**Request:**
```json
{
  "keywords": "SEO",
  "location": "Remote",
  "maxResults": 313
}
```

**Response:**
```json
{
  "status": "success",
  "jobsFound": 313,
  "executionId": "12345"
}
```

---

### Resume Generation Webhook
**Path:** `/webhook/resume-generation`  
**Method:** POST  
**Workflow ID:** `UD4BXHqXgheWDBB4`

**Request:**
```json
{
  "jobData": {
    "title": "SEO Specialist",
    "description": "Job description...",
    "company": "Tech Corp"
  },
  "templateType": "modern"
}
```

---

### Contact Enrichment Webhook
**Path:** `/webhook/contact-enrichment`  
**Method:** POST  
**Workflow ID:** `Ccj3e5fuNnEVT7et`

**Request:**
```json
{
  "companies": ["techcorp.com", "example.com"],
  "enrichmentLevel": "comprehensive"
}
```

---

### Outreach Tracking Webhook
**Path:** `/webhook/outreach-tracking`  
**Method:** POST  
**Workflow ID:** `0ZJ84RLQXxuYKLyE`

**Request:**
```json
{
  "jobData": {...},
  "resumeData": {...},
  "contactData": {...}
}
```

---

### Validation Reporting Webhook
**Path:** `/webhook/validation-reporting`  
**Method:** POST  
**Workflow ID:** `5LfnNVYjb5XeIGKB`

**Request:**
```json
{
  "sessionId": "session-123",
  "validationType": "full"
}
```

---

## 💻 Code Examples

### PowerShell
```powershell
# Trigger Job Discovery
$webhookUrl = "https://n8n.srv972609.hstgr.cloud/webhook/job-discovery"
$body = @{
    keywords = "SEO"
    location = "Remote"
    maxResults = 313
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $webhookUrl -Method POST `
    -Body $body -ContentType "application/json"
```

### cURL
```bash
curl -X POST https://n8n.srv972609.hstgr.cloud/webhook/job-discovery \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "SEO",
    "location": "Remote",
    "maxResults": 313
  }'
```

### JavaScript/Node.js
```javascript
const axios = require('axios');

const triggerWebhook = async () => {
  const response = await axios.post(
    'https://n8n.srv972609.hstgr.cloud/webhook/job-discovery',
    {
      keywords: 'SEO',
      location: 'Remote',
      maxResults: 313
    }
  );
  console.log(response.data);
};
```

### Python
```python
import requests

url = "https://n8n.srv972609.hstgr.cloud/webhook/job-discovery"
payload = {
    "keywords": "SEO",
    "location": "Remote",
    "maxResults": 313
}

response = requests.post(url, json=payload)
print(response.json())
```

---

## 🔒 Webhook Security

### Authentication Options
1. **No Authentication** (default): Public webhook accessible to anyone
2. **Header Auth**: Require specific header value
3. **Basic Auth**: Username/password authentication
4. **Custom Validation**: Validate request in Code node

### Example: Header Authentication
```json
{
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "X-Webhook-Token",
    "value": "your-secret-token"
  }
}
```

**Request with Auth:**
```bash
curl -X POST https://n8n.srv972609.hstgr.cloud/webhook/secure-endpoint \
  -H "X-Webhook-Token: your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"data": "value"}'
```

---

## 📊 Webhook Response Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `onReceived` | Respond immediately | Quick acknowledgment |
| `lastNode` | Wait for workflow completion | Return processed data |
| `responseNode` | Use specific Respond to Webhook node | Custom responses |

---

## ⚠️ Important Notes

1. **Workflow Must Be Active:** Webhooks only work when the workflow is activated
2. **Unique Paths:** Each webhook path must be unique across all workflows
3. **Timeout:** Webhooks have a 120-second timeout by default
4. **Data Access:** Webhook data is available in `$json.body` for POST requests
5. **Testing:** Use the "Test URL" in N8N UI to get the webhook URL before activation

---

## 🔍 Debugging Webhooks

### Check Webhook Status
```powershell
# List all workflows with webhooks
$workflows = Invoke-RestMethod -Uri "$baseUrl/workflows" -Headers $headers
$workflows.data | Where-Object { $_.active -eq $true } | ForEach-Object {
    Write-Host "Workflow: $($_.name) - ID: $($_.id)"
}
```

### View Recent Webhook Executions
```powershell
$workflowId = "qWMubgbQCCk8CrII"
$executions = Invoke-RestMethod -Uri "$baseUrl/executions?workflowId=$workflowId&limit=10" -Headers $headers
$executions.data | Format-Table id, status, startedAt
```

---

## 🔗 Related Documentation

- [Workflow Management API](./workflow-management-api.md)
- [Execution Monitoring API](./execution-monitoring-api.md)
- [Main README](./README.md)

