# N8N REST API Comprehensive Capability Assessment
# This script systematically tests all N8N REST API endpoints and generates a capability matrix

$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjA4MzczfQ.9mwAZdBkH_9xZ2AGkAXqDZCkZHBPH8daFVwyfm0fMMU"
$baseUrl = "https://n8n.srv972609.hstgr.cloud/api/v1"
$headers = @{"X-N8N-API-KEY" = $apiKey }

# Results storage
$results = @()

function Test-Endpoint {
    param(
        [string]$Category,
        [string]$Operation,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Notes = ""
    )
    
    Write-Host "`n=== Testing: $Category - $Operation ===" -ForegroundColor Cyan
    Write-Host "Method: $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri         = "$baseUrl$Endpoint"
            Method      = $Method
            Headers     = $headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        $status = "[OK] Fully Supported"
        $resultNotes = "Success"
        Write-Host "SUCCESS" -ForegroundColor Green
        
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.Exception.Message
        
        if ($statusCode -eq 404) {
            $status = "[FAIL] Not Supported"
            $resultNotes = "Endpoint not found (404)"
        }
        elseif ($statusCode -eq 403) {
            $status = "[WARN] Requires Permissions"
            $resultNotes = "Forbidden (403)"
        }
        elseif ($statusCode -eq 401) {
            $status = "[WARN] Authentication Issue"
            $resultNotes = "Unauthorized (401)"
        }
        elseif ($statusCode -eq 400) {
            $status = "[WARN] Partially Supported"
            $resultNotes = "Bad Request (400) - endpoint exists but request invalid"
        }
        else {
            $status = "[WARN] Error"
            $resultNotes = "Status: $statusCode - $errorMessage"
        }
        
        Write-Host "$status - $resultNotes" -ForegroundColor Yellow
    }
    
    $script:results += [PSCustomObject]@{
        Category  = $Category
        Operation = $Operation
        Method    = $Method
        Endpoint  = $Endpoint
        Status    = $status
        Notes     = "$resultNotes $Notes"
    }
}

Write-Host "`n================================================================" -ForegroundColor Magenta
Write-Host "  N8N REST API COMPREHENSIVE CAPABILITY ASSESSMENT" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta

# ============================================================================
# PART 1: WORKFLOW MANAGEMENT OPERATIONS
# ============================================================================
Write-Host "`n`n===== PART 1: WORKFLOW MANAGEMENT OPERATIONS =====" -ForegroundColor Magenta

Test-Endpoint -Category "Workflow Management" -Operation "List all workflows" `
    -Method "GET" -Endpoint "/workflows" `
    -Notes "Retrieves list of all workflows in the instance"

Test-Endpoint -Category "Workflow Management" -Operation "Get workflow by ID" `
    -Method "GET" -Endpoint "/workflows/WUe4y8iYEXNAB6dq" `
    -Notes "Retrieves complete workflow definition including nodes and connections"

Test-Endpoint -Category "Workflow Management" -Operation "Create new workflow" `
    -Method "POST" -Endpoint "/workflows" `
    -Body @{
    name        = "API-Test-Workflow-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    nodes       = @()
    connections = @{}
    active      = $false
    settings    = @{}
} `
    -Notes "Creates a new workflow programmatically"

Test-Endpoint -Category "Workflow Management" -Operation "Update workflow" `
    -Method "PATCH" -Endpoint "/workflows/WUe4y8iYEXNAB6dq" `
    -Body @{
    name = "Updated-Test-Workflow"
} `
    -Notes "Updates existing workflow properties"

Test-Endpoint -Category "Workflow Management" -Operation "Delete workflow" `
    -Method "DELETE" -Endpoint "/workflows/test-delete-id" `
    -Notes "Deletes a workflow - using non-existent ID to avoid accidental deletion"

Test-Endpoint -Category "Workflow Management" -Operation "Activate workflow" `
    -Method "PATCH" -Endpoint "/workflows/WUe4y8iYEXNAB6dq" `
    -Body @{ active = $true } `
    -Notes "Activates a workflow"

Test-Endpoint -Category "Workflow Management" -Operation "Deactivate workflow" `
    -Method "PATCH" -Endpoint "/workflows/WUe4y8iYEXNAB6dq" `
    -Body @{ active = $false } `
    -Notes "Deactivates a workflow"

# ============================================================================
# PART 2: EXECUTION MONITORING AND DEBUGGING
# ============================================================================
Write-Host "`n`n===== PART 2: EXECUTION MONITORING AND DEBUGGING =====" -ForegroundColor Magenta

Test-Endpoint -Category "Execution Monitoring" -Operation "List executions for workflow" `
    -Method "GET" -Endpoint "/executions?workflowId=WUe4y8iYEXNAB6dq`&limit=5" `
    -Notes "Retrieves execution history for specific workflow"

Test-Endpoint -Category "Execution Monitoring" -Operation "List all executions" `
    -Method "GET" -Endpoint "/executions?limit=10" `
    -Notes "Retrieves execution history across all workflows"

Test-Endpoint -Category "Execution Monitoring" -Operation "Get execution by ID" `
    -Method "GET" -Endpoint "/executions/11711" `
    -Notes "Retrieves detailed execution data including input/output and errors"

Test-Endpoint -Category "Execution Monitoring" -Operation "Filter executions by status" `
    -Method "GET" -Endpoint "/executions?status=error`&limit=5" `
    -Notes "Filters executions by status: success, error, waiting"

Test-Endpoint -Category "Execution Monitoring" -Operation "Delete execution" `
    -Method "DELETE" -Endpoint "/executions/test-delete-id" `
    -Notes "Deletes execution data - using non-existent ID"

# ============================================================================
# PART 3: WORKFLOW TRIGGERING AND CONTROL
# ============================================================================
Write-Host "`n`n===== PART 3: WORKFLOW TRIGGERING AND CONTROL =====" -ForegroundColor Magenta

Test-Endpoint -Category "Workflow Triggering" -Operation "Trigger workflow execution" `
    -Method "POST" -Endpoint "/workflows/WUe4y8iYEXNAB6dq/execute" `
    -Notes "Manually triggers workflow execution"

Test-Endpoint -Category "Workflow Triggering" -Operation "Trigger with custom data" `
    -Method "POST" -Endpoint "/workflows/WUe4y8iYEXNAB6dq/execute" `
    -Body @{ data = @{ test = "value" } } `
    -Notes "Triggers workflow with custom input parameters"

Test-Endpoint -Category "Workflow Triggering" -Operation "Stop running execution" `
    -Method "POST" -Endpoint "/executions/11711/stop" `
    -Notes "Stops a currently running execution"

Test-Endpoint -Category "Workflow Triggering" -Operation "Retry failed execution" `
    -Method "POST" -Endpoint "/executions/11711/retry" `
    -Notes "Retries a failed execution"

# ============================================================================
# PART 4: CREDENTIALS AND AUTHENTICATION
# ============================================================================
Write-Host "`n`n===== PART 4: CREDENTIALS AND AUTHENTICATION =====" -ForegroundColor Magenta

Test-Endpoint -Category "Credentials" -Operation "List credentials" `
    -Method "GET" -Endpoint "/credentials" `
    -Notes "Retrieves list of stored credentials"

Test-Endpoint -Category "Credentials" -Operation "Get credential by ID" `
    -Method "GET" -Endpoint "/credentials/test-id" `
    -Notes "Retrieves specific credential details"

Test-Endpoint -Category "Credentials" -Operation "Create credential" `
    -Method "POST" -Endpoint "/credentials" `
    -Body @{
    name = "API-Test-Credential"
    type = "httpBasicAuth"
    data = @{ user = "test"; password = "test" }
} `
    -Notes "Creates new credential"

Test-Endpoint -Category "Credentials" -Operation "Update credential" `
    -Method "PATCH" -Endpoint "/credentials/test-id" `
    -Body @{ name = "Updated-Credential" } `
    -Notes "Updates existing credential"

Test-Endpoint -Category "Credentials" -Operation "Delete credential" `
    -Method "DELETE" -Endpoint "/credentials/test-id" `
    -Notes "Deletes a credential"

Test-Endpoint -Category "Credentials" -Operation "Test credential" `
    -Method "POST" -Endpoint "/credentials/test-id/test" `
    -Notes "Tests credential validity"

# ============================================================================
# PART 5: NODE AND CONFIGURATION MANAGEMENT
# ============================================================================
Write-Host "`n`n===== PART 5: NODE AND CONFIGURATION MANAGEMENT =====" -ForegroundColor Magenta

Test-Endpoint -Category "Node Management" -Operation "List available node types" `
    -Method "GET" -Endpoint "/node-types" `
    -Notes "Retrieves list of available node types"

Test-Endpoint -Category "Node Management" -Operation "Get node type details" `
    -Method "GET" -Endpoint "/node-types/n8n-nodes-base.httpRequest" `
    -Notes "Retrieves node configuration schema"

Test-Endpoint -Category "Configuration" -Operation "Get instance settings" `
    -Method "GET" -Endpoint "/settings" `
    -Notes "Retrieves N8N instance settings"

# ============================================================================
# PART 6: USER AND ACCESS MANAGEMENT
# ============================================================================
Write-Host "`n`n===== PART 6: USER AND ACCESS MANAGEMENT =====" -ForegroundColor Magenta

Test-Endpoint -Category "User Management" -Operation "List users" `
    -Method "GET" -Endpoint "/users" `
    -Notes "Retrieves list of users"

Test-Endpoint -Category "User Management" -Operation "Get current user" `
    -Method "GET" -Endpoint "/users/me" `
    -Notes "Retrieves current authenticated user details"

Test-Endpoint -Category "User Management" -Operation "Create user" `
    -Method "POST" -Endpoint "/users" `
    -Body @{
    email     = "test@example.com"
    firstName = "Test"
    lastName  = "User"
    password  = "TestPassword123!"
} `
    -Notes "Creates new user"

Test-Endpoint -Category "User Management" -Operation "Update user" `
    -Method "PATCH" -Endpoint "/users/test-id" `
    -Body @{ firstName = "Updated" } `
    -Notes "Updates user details"

Test-Endpoint -Category "User Management" -Operation "Delete user" `
    -Method "DELETE" -Endpoint "/users/test-id" `
    -Notes "Deletes a user"

Test-Endpoint -Category "Audit" -Operation "Get audit logs" `
    -Method "GET" -Endpoint "/audit" `
    -Notes "Retrieves audit logs of user actions"

# ============================================================================
# PART 7: TAGS AND ORGANIZATION
# ============================================================================
Write-Host "`n`n===== PART 7: TAGS AND ORGANIZATION =====" -ForegroundColor Magenta

Test-Endpoint -Category "Tags" -Operation "List tags" `
    -Method "GET" -Endpoint "/tags" `
    -Notes "Retrieves workflow tags"

Test-Endpoint -Category "Tags" -Operation "Create tag" `
    -Method "POST" -Endpoint "/tags" `
    -Body @{ name = "API-Test-Tag" } `
    -Notes "Creates new tag"

Test-Endpoint -Category "Tags" -Operation "Update tag" `
    -Method "PATCH" -Endpoint "/tags/test-id" `
    -Body @{ name = "Updated-Tag" } `
    -Notes "Updates tag"

Test-Endpoint -Category "Tags" -Operation "Delete tag" `
    -Method "DELETE" -Endpoint "/tags/test-id" `
    -Notes "Deletes a tag"

# ============================================================================
# PART 8: ADDITIONAL ENDPOINTS
# ============================================================================
Write-Host "`n`n===== PART 8: ADDITIONAL ENDPOINTS =====" -ForegroundColor Magenta

Test-Endpoint -Category "Workflow" -Operation "Export workflow to JSON" `
    -Method "GET" -Endpoint "/workflows/WUe4y8iYEXNAB6dq/export" `
    -Notes "Exports workflow as JSON"

Test-Endpoint -Category "Workflow" -Operation "Import workflow from JSON" `
    -Method "POST" -Endpoint "/workflows/import" `
    -Body @{
    workflow = @{
        name        = "Imported-Workflow"
        nodes       = @()
        connections = @{}
    }
} `
    -Notes "Imports workflow from JSON"

Test-Endpoint -Category "Workflow" -Operation "Duplicate workflow" `
    -Method "POST" -Endpoint "/workflows/WUe4y8iYEXNAB6dq/duplicate" `
    -Notes "Duplicates an existing workflow"

Test-Endpoint -Category "Execution" -Operation "Get execution logs" `
    -Method "GET" -Endpoint "/executions/11711/logs" `
    -Notes "Retrieves execution logs"

Test-Endpoint -Category "Webhook" -Operation "Trigger webhook workflow" `
    -Method "POST" -Endpoint "/webhook/test-webhook-path" `
    -Body @{ test = "data" } `
    -Notes "Triggers webhook-based workflow"

Test-Endpoint -Category "Variables" -Operation "List environment variables" `
    -Method "GET" -Endpoint "/variables" `
    -Notes "Retrieves environment variables"

Test-Endpoint -Category "Variables" -Operation "Create variable" `
    -Method "POST" -Endpoint "/variables" `
    -Body @{ key = "TEST_VAR"; value = "test" } `
    -Notes "Creates environment variable"

Test-Endpoint -Category "Source Control" -Operation "Get source control status" `
    -Method "GET" -Endpoint "/source-control/status" `
    -Notes "Retrieves source control status"

Test-Endpoint -Category "License" -Operation "Get license information" `
    -Method "GET" -Endpoint "/license" `
    -Notes "Retrieves license information"

Test-Endpoint -Category "Health" -Operation "Health check" `
    -Method "GET" -Endpoint "/health" `
    -Notes "Checks instance health status"

# ============================================================================
# GENERATE RESULTS REPORT
# ============================================================================
Write-Host "`n`n================================================================" -ForegroundColor Green
Write-Host "  GENERATING COMPREHENSIVE CAPABILITY MATRIX" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green

# Export results to CSV
$csvPath = "n8n-api-capability-results.csv"
$results | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
Write-Host "`n[OK] Results exported to CSV: $csvPath" -ForegroundColor Green

# Display summary
Write-Host "`n`n================================================================" -ForegroundColor Cyan
Write-Host "  ASSESSMENT COMPLETE" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "`nTotal Endpoints Tested: $($results.Count)" -ForegroundColor White

$fullySupported = ($results | Where-Object { $_.Status -eq '[OK] Fully Supported' } | Measure-Object).Count
$partiallySupported = ($results | Where-Object { $_.Status -like '[WARN]*' } | Measure-Object).Count
$notSupported = ($results | Where-Object { $_.Status -eq '[FAIL] Not Supported' } | Measure-Object).Count

Write-Host "[OK] Fully Supported: $fullySupported" -ForegroundColor Green
Write-Host "[WARN] Partially Supported: $partiallySupported" -ForegroundColor Yellow
Write-Host "[FAIL] Not Supported: $notSupported" -ForegroundColor Red
Write-Host "`nDetailed results saved to: $csvPath" -ForegroundColor Cyan

