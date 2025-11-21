# N8N REST API Validation Script
# Comprehensive testing of all documented API operations

$ErrorActionPreference = "Continue"
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjA4MzczfQ.9mwAZdBkH_9xZ2AGkAXqDZCkZHBPH8daFVwyfm0fMMU"
$baseUrl = "https://n8n.srv972609.hstgr.cloud/api/v1"
$headers = @{
    "X-N8N-API-KEY" = $apiKey
    "Content-Type" = "application/json"
}

$results = @()
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

function Test-APIEndpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Cyan
    
    try {
        $uri = "$baseUrl$Endpoint"
        $params = @{
            Uri = $uri
            Method = $Method
            Headers = $headers
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        $script:results += [PSCustomObject]@{
            Operation = $Name
            Method = $Method
            Endpoint = $Endpoint
            Status = "PASS"
            StatusCode = 200
            Notes = "Success"
        }
        
        Write-Host "  [PASS] $Name" -ForegroundColor Green
        return $true
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMsg = $_.Exception.Message
        
        $status = switch ($statusCode) {
            404 { "FAIL - Not Found" }
            405 { "FAIL - Method Not Allowed" }
            400 { "WARN - Bad Request" }
            403 { "FAIL - Forbidden" }
            401 { "FAIL - Unauthorized" }
            default { "FAIL - Error" }
        }
        
        $script:results += [PSCustomObject]@{
            Operation = $Name
            Method = $Method
            Endpoint = $Endpoint
            Status = $status
            StatusCode = $statusCode
            Notes = $errorMsg
        }
        
        Write-Host "  [$status] $Name - $statusCode" -ForegroundColor $(if ($statusCode -eq 400) { "Yellow" } else { "Red" })
        return $false
    }
}

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "N8N REST API VALIDATION TEST" -ForegroundColor Magenta
Write-Host "Started: $timestamp" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

# WORKFLOW MANAGEMENT
Write-Host "`n=== WORKFLOW MANAGEMENT ===" -ForegroundColor Yellow
Test-APIEndpoint "List Workflows" "GET" "/workflows"
Test-APIEndpoint "Get Workflow by ID" "GET" "/workflows/WUe4y8iYEXNAB6dq"
Test-APIEndpoint "Create Workflow" "POST" "/workflows" @{
    name = "API-Test-$(Get-Date -Format 'HHmmss')"
    nodes = @()
    connections = @{}
    active = $false
}
Test-APIEndpoint "Update Workflow" "PATCH" "/workflows/WUe4y8iYEXNAB6dq" @{ name = "Test-Update" }
Test-APIEndpoint "Duplicate Workflow" "POST" "/workflows/WUe4y8iYEXNAB6dq/duplicate"

# EXECUTION MONITORING
Write-Host "`n=== EXECUTION MONITORING ===" -ForegroundColor Yellow
Test-APIEndpoint "List Executions" "GET" "/executions?limit=5"
Test-APIEndpoint "Get Execution by ID" "GET" "/executions/11711"
Test-APIEndpoint "Filter by Status" "GET" "/executions?status=error&limit=5"
Test-APIEndpoint "Get Current Executions" "GET" "/executions-current"

# CREDENTIALS
Write-Host "`n=== CREDENTIALS ===" -ForegroundColor Yellow
Test-APIEndpoint "List Credentials" "GET" "/credentials"
Test-APIEndpoint "Create Credential" "POST" "/credentials" @{
    name = "Test-Cred"
    type = "httpBasicAuth"
    data = @{ user = "test"; password = "test" }
}

# WEBHOOKS
Write-Host "`n=== WEBHOOKS ===" -ForegroundColor Yellow
Test-APIEndpoint "Trigger Webhook" "POST" "/webhook/test-path" @{ test = "data" }

# SUMMARY
Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "VALIDATION SUMMARY" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$warned = ($results | Where-Object { $_.Status -like "WARN*" }).Count
$failed = ($results | Where-Object { $_.Status -like "FAIL*" }).Count
$total = $results.Count

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Warnings: $warned" -ForegroundColor Yellow
Write-Host "Failed: $failed" -ForegroundColor Red

# Export results
$results | Export-Csv "api-validation-results.csv" -NoTypeInformation
Write-Host "`nResults saved to: api-validation-results.csv" -ForegroundColor Cyan

$results | Format-Table Operation, Method, Status, StatusCode -AutoSize

