# N8N Execution Monitoring API - Detailed Reference

**API Base:** `https://n8n.srv972609.hstgr.cloud/api/v1`

---

## 📋 Execution Operations

### 1. List Executions

**Endpoint:** `GET /executions`

**Query Parameters:**
- `workflowId` (optional): Filter by specific workflow
- `limit` (optional): Number of results (default: 20, max: 250)
- `status` (optional): Filter by status (`success`, `error`, `waiting`, `running`)
- `includeData` (optional): Include execution data (default: false)
- `cursor` (optional): Pagination cursor

**Response:**
```json
{
  "data": [
    {
      "id": "11711",
      "workflowId": "WUe4y8iYEXNAB6dq",
      "mode": "manual",
      "status": "success",
      "startedAt": "2025-01-20T10:30:00.000Z",
      "stoppedAt": "2025-01-20T10:30:45.000Z",
      "finished": true,
      "retryOf": null,
      "retrySuccessId": null
    }
  ],
  "nextCursor": "eyJpZCI6IjExNzExIn0="
}
```

**PowerShell Example:**
```powershell
# List all executions for a workflow
$workflowId = "WUe4y8iYEXNAB6dq"
$executions = Invoke-RestMethod -Uri "$baseUrl/executions?workflowId=$workflowId&limit=10" -Headers $headers

# Filter by status
$errors = Invoke-RestMethod -Uri "$baseUrl/executions?status=error&limit=50" -Headers $headers
```

---

### 2. Get Execution Details

**Endpoint:** `GET /executions/{executionId}`

**Query Parameters:**
- `includeData` (optional): Include full execution data (default: true)

**Response:**
```json
{
  "id": "11711",
  "workflowId": "WUe4y8iYEXNAB6dq",
  "workflowData": {
    "id": "WUe4y8iYEXNAB6dq",
    "name": "LinkedIn-SEO-Gmail-Outreach"
  },
  "mode": "manual",
  "status": "success",
  "startedAt": "2025-01-20T10:30:00.000Z",
  "stoppedAt": "2025-01-20T10:30:45.000Z",
  "finished": true,
  "data": {
    "resultData": {
      "runData": {
        "Manual Trigger": [
          {
            "startTime": 1705747800000,
            "executionTime": 5,
            "data": {
              "main": [
                [
                  {
                    "json": {},
                    "pairedItem": {"item": 0}
                  }
                ]
              ]
            }
          }
        ],
        "Code Node": [
          {
            "startTime": 1705747805000,
            "executionTime": 120,
            "data": {
              "main": [
                [
                  {
                    "json": {
                      "result": "processed data"
                    },
                    "pairedItem": {"item": 0}
                  }
                ]
              ]
            }
          }
        ]
      }
    }
  }
}
```

**PowerShell Example:**
```powershell
$executionId = "11711"
$execution = Invoke-RestMethod -Uri "$baseUrl/executions/$executionId" -Headers $headers

# Access node outputs
$execution.data.resultData.runData | Get-Member -MemberType NoteProperty
```

---

### 3. Delete Execution

**Endpoint:** `DELETE /executions/{executionId}`

**Response:**
```json
{
  "success": true
}
```

**PowerShell Example:**
```powershell
$executionId = "11711"
Invoke-RestMethod -Uri "$baseUrl/executions/$executionId" -Method DELETE -Headers $headers
```

---

### 4. Get Current Executions (Running)

**Endpoint:** `GET /executions-current`

**Response:**
```json
{
  "data": [
    {
      "id": "temp-execution-id",
      "workflowId": "WUe4y8iYEXNAB6dq",
      "mode": "manual",
      "startedAt": "2025-01-20T10:30:00.000Z",
      "status": "running"
    }
  ]
}
```

**PowerShell Example:**
```powershell
$running = Invoke-RestMethod -Uri "$baseUrl/executions-current" -Headers $headers
$running.data | Format-Table workflowId, startedAt, status
```

---

## 🔍 Execution Data Structure

### Node Run Data
Each node in an execution contains:
- **startTime:** Timestamp when node started (milliseconds)
- **executionTime:** Duration in milliseconds
- **data:** Output data organized by connection type (main, error)
- **error:** Error information if node failed

### Data Format
```json
{
  "main": [
    [
      {
        "json": {
          "field1": "value1",
          "field2": "value2"
        },
        "binary": {},
        "pairedItem": {"item": 0}
      }
    ]
  ]
}
```

---

## 📊 Execution Status Values

| Status | Description |
|--------|-------------|
| `success` | Execution completed successfully |
| `error` | Execution failed with error |
| `waiting` | Execution waiting for external event (webhook, wait node) |
| `running` | Execution currently in progress |
| `canceled` | Execution was manually canceled |
| `crashed` | Execution crashed unexpectedly |

---

## 🎯 Common Use Cases

### 1. Monitor Recent Failures
```powershell
$errors = Invoke-RestMethod -Uri "$baseUrl/executions?status=error&limit=20" -Headers $headers
$errors.data | ForEach-Object {
    Write-Host "Workflow: $($_.workflowId) - Failed at: $($_.stoppedAt)"
}
```

### 2. Get Execution Output Data
```powershell
$execution = Invoke-RestMethod -Uri "$baseUrl/executions/$executionId" -Headers $headers
$nodeData = $execution.data.resultData.runData.'Code Node'[0].data.main[0]
$nodeData | ConvertTo-Json -Depth 10
```

### 3. Track Workflow Performance
```powershell
$executions = Invoke-RestMethod -Uri "$baseUrl/executions?workflowId=$workflowId&limit=100" -Headers $headers
$executions.data | ForEach-Object {
    $duration = (Get-Date $_.stoppedAt) - (Get-Date $_.startedAt)
    [PSCustomObject]@{
        ExecutionId = $_.id
        Status = $_.status
        Duration = $duration.TotalSeconds
    }
} | Sort-Object Duration -Descending
```

### 4. Clean Up Old Executions
```powershell
# Get executions older than 30 days
$cutoffDate = (Get-Date).AddDays(-30)
$oldExecutions = Invoke-RestMethod -Uri "$baseUrl/executions?limit=250" -Headers $headers

$oldExecutions.data | Where-Object {
    (Get-Date $_.stoppedAt) -lt $cutoffDate
} | ForEach-Object {
    Write-Host "Deleting execution: $($_.id)"
    Invoke-RestMethod -Uri "$baseUrl/executions/$($_.id)" -Method DELETE -Headers $headers
}
```

---

## ⚠️ Important Notes

1. **Data Size:** Execution data can be very large. Use `includeData=false` when listing executions
2. **Pagination:** Use cursor-based pagination for large result sets
3. **Retention:** Executions are retained based on N8N instance settings
4. **Performance:** Fetching execution data for many executions can be slow
5. **Binary Data:** Binary data (files, images) is stored separately and may not be included in API responses

---

## 🔗 Related Documentation

- [Workflow Management API](./workflow-management-api.md)
- [Webhook API](./webhook-api.md)
- [Main README](./README.md)

