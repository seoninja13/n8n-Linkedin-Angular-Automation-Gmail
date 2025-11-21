# N8N REST API Testing Guide

**Last Updated:** 2025-01-20

---

## 🧪 Quick Start Testing

### Prerequisites
- N8N API Key (configured in environment or script)
- PowerShell 5.1+ or PowerShell Core 7+
- Network access to N8N instance

### Environment Setup
```powershell
# Set environment variables
$env:N8N_API_URL = "https://n8n.srv972609.hstgr.cloud/api/v1"
$env:N8N_API_KEY = "your-api-key-here"

# Or use inline variables
$apiKey = "your-api-key-here"
$baseUrl = "https://n8n.srv972609.hstgr.cloud/api/v1"
$headers = @{
    "X-N8N-API-KEY" = $apiKey
    "Content-Type" = "application/json"
}
```

---

## 🔍 Basic Health Check

### Test 1: API Connectivity
```powershell
# Test basic connection
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/workflows?limit=1" -Headers $headers
    Write-Host "✅ API Connection: SUCCESS" -ForegroundColor Green
    Write-Host "Found $($response.data.Count) workflow(s)" -ForegroundColor Green
} catch {
    Write-Host "❌ API Connection: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

### Test 2: Authentication Validation
```powershell
# Test with invalid API key
$invalidHeaders = @{ "X-N8N-API-KEY" = "invalid-key" }
try {
    Invoke-RestMethod -Uri "$baseUrl/workflows" -Headers $invalidHeaders
    Write-Host "⚠️ WARNING: Invalid key accepted (security issue)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Authentication: Working correctly" -ForegroundColor Green
    }
}
```

---

## 📋 Workflow Management Tests

### Test 3: List Workflows
```powershell
$workflows = Invoke-RestMethod -Uri "$baseUrl/workflows" -Headers $headers
Write-Host "`n📊 Workflows Found: $($workflows.data.Count)" -ForegroundColor Cyan
$workflows.data | Format-Table id, name, active -AutoSize
```

### Test 4: Get Specific Workflow
```powershell
$workflowId = "WUe4y8iYEXNAB6dq"
$workflow = Invoke-RestMethod -Uri "$baseUrl/workflows/$workflowId" -Headers $headers
Write-Host "`n📄 Workflow: $($workflow.name)" -ForegroundColor Cyan
Write-Host "Nodes: $($workflow.nodes.Count)" -ForegroundColor Cyan
Write-Host "Active: $($workflow.active)" -ForegroundColor Cyan
```

### Test 5: Create Test Workflow
```powershell
$testWorkflow = @{
    name = "API-Test-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    nodes = @(
        @{
            id = "trigger"
            name = "Manual Trigger"
            type = "n8n-nodes-base.manualTrigger"
            position = @(100, 100)
            parameters = @{}
            typeVersion = 1
        }
    )
    connections = @{}
    active = $false
} | ConvertTo-Json -Depth 10

try {
    $created = Invoke-RestMethod -Uri "$baseUrl/workflows" `
        -Method POST -Headers $headers -Body $testWorkflow
    Write-Host "✅ Workflow Created: $($created.id)" -ForegroundColor Green
    
    # Clean up
    Invoke-RestMethod -Uri "$baseUrl/workflows/$($created.id)" -Method DELETE -Headers $headers
    Write-Host "✅ Test workflow deleted" -ForegroundColor Green
} catch {
    Write-Host "❌ Workflow Creation Failed: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## 🔄 Execution Monitoring Tests

### Test 6: List Recent Executions
```powershell
$executions = Invoke-RestMethod -Uri "$baseUrl/executions?limit=10" -Headers $headers
Write-Host "`n📊 Recent Executions: $($executions.data.Count)" -ForegroundColor Cyan
$executions.data | Format-Table id, workflowId, status, startedAt -AutoSize
```

### Test 7: Get Execution Details
```powershell
if ($executions.data.Count -gt 0) {
    $executionId = $executions.data[0].id
    $execution = Invoke-RestMethod -Uri "$baseUrl/executions/$executionId" -Headers $headers
    Write-Host "`n📄 Execution: $executionId" -ForegroundColor Cyan
    Write-Host "Status: $($execution.status)" -ForegroundColor Cyan
    Write-Host "Duration: $((Get-Date $execution.stoppedAt) - (Get-Date $execution.startedAt))" -ForegroundColor Cyan
}
```

### Test 8: Filter Executions by Status
```powershell
# Get failed executions
$errors = Invoke-RestMethod -Uri "$baseUrl/executions?status=error&limit=5" -Headers $headers
Write-Host "`n❌ Failed Executions: $($errors.data.Count)" -ForegroundColor Red
$errors.data | Format-Table id, workflowId, startedAt -AutoSize
```

---

## 🌐 Webhook Tests

### Test 9: Trigger Webhook (if available)
```powershell
$webhookUrl = "https://n8n.srv972609.hstgr.cloud/webhook/test-endpoint"
$webhookData = @{
    test = "data"
    timestamp = Get-Date -Format "o"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method POST `
        -Body $webhookData -ContentType "application/json"
    Write-Host "✅ Webhook Triggered Successfully" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "⚠️ Webhook not available or workflow not active" -ForegroundColor Yellow
}
```

---

## 📊 Performance Tests

### Test 10: API Response Time
```powershell
$iterations = 5
$times = @()

Write-Host "`n⏱️ Testing API Response Time ($iterations iterations)..." -ForegroundColor Cyan

for ($i = 1; $i -le $iterations; $i++) {
    $start = Get-Date
    Invoke-RestMethod -Uri "$baseUrl/workflows?limit=1" -Headers $headers | Out-Null
    $end = Get-Date
    $duration = ($end - $start).TotalMilliseconds
    $times += $duration
    Write-Host "Iteration $i: $([math]::Round($duration, 2))ms"
}

$avgTime = ($times | Measure-Object -Average).Average
Write-Host "`n📊 Average Response Time: $([math]::Round($avgTime, 2))ms" -ForegroundColor Green
```

---

## 🔐 Credentials Tests

### Test 11: List Credentials
```powershell
try {
    $credentials = Invoke-RestMethod -Uri "$baseUrl/credentials" -Headers $headers
    Write-Host "`n🔑 Credentials Found: $($credentials.data.Count)" -ForegroundColor Cyan
    $credentials.data | Format-Table id, name, type -AutoSize
} catch {
    Write-Host "❌ Credentials Access Failed: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## 📈 Comprehensive Test Suite

### Run All Tests
```powershell
# Complete test suite script
$testResults = @()

function Test-Endpoint {
    param($Name, $ScriptBlock)
    
    Write-Host "`n🧪 Testing: $Name" -ForegroundColor Yellow
    try {
        & $ScriptBlock
        $testResults += [PSCustomObject]@{
            Test = $Name
            Status = "✅ PASS"
        }
    } catch {
        $testResults += [PSCustomObject]@{
            Test = $Name
            Status = "❌ FAIL: $($_.Exception.Message)"
        }
    }
}

# Run all tests
Test-Endpoint "API Connectivity" { Invoke-RestMethod -Uri "$baseUrl/workflows?limit=1" -Headers $headers | Out-Null }
Test-Endpoint "List Workflows" { Invoke-RestMethod -Uri "$baseUrl/workflows" -Headers $headers | Out-Null }
Test-Endpoint "List Executions" { Invoke-RestMethod -Uri "$baseUrl/executions?limit=5" -Headers $headers | Out-Null }
Test-Endpoint "List Credentials" { Invoke-RestMethod -Uri "$baseUrl/credentials" -Headers $headers | Out-Null }

# Display results
Write-Host "`n📊 Test Results Summary:" -ForegroundColor Cyan
$testResults | Format-Table -AutoSize
```

---

## 🔗 Related Documentation

- [Main README](./README.md)
- [Workflow Management API](./workflow-management-api.md)
- [Execution Monitoring API](./execution-monitoring-api.md)
- [Webhook API](./webhook-api.md)

---

## 📝 Test Scripts Location

All test scripts are located in the project root:
- `test-n8n-connection.ps1` - Basic connectivity test
- `test-n8n-api-simple.ps1` - Simple API tests
- `test-n8n-api-capabilities.ps1` - Comprehensive capability assessment

