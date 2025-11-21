# N8N Node Parameter Fix Script
# This script directly updates the workflow JSON via REST API to add missing parameters

$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$workflowId = "Q5pmP4961YnR9nJ9"
$headers = @{"X-N8N-API-KEY" = $apiKey}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  N8N NODE PARAMETER FIX SCRIPT" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

try {
    # Step 1: Get current workflow
    Write-Host "[1/4] Retrieving workflow..." -ForegroundColor Yellow
    $workflow = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/$workflowId" -Headers $headers -Method GET
    
    # Backup
    $backupFile = "workflow-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $workflow | ConvertTo-Json -Depth 10 | Out-File $backupFile
    Write-Host "      ✅ Workflow retrieved and backed up to: $backupFile" -ForegroundColor Green
    Write-Host ""
    
    # Step 2: Find and modify N8N node
    Write-Host "[2/4] Modifying N8N node parameters..." -ForegroundColor Yellow
    $n8nNode = $workflow.nodes | Where-Object { $_.type -eq "n8n-nodes-base.n8n" }
    
    if (-not $n8nNode) {
        Write-Host "      ❌ N8N node not found in workflow" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "      Found node: $($n8nNode.name)" -ForegroundColor Gray
    
    # Add the missing parameters
    $n8nNode.parameters = @{
        resource = "workflow"
        operation = "getAll"
        returnAll = $true
        filters = @{}
        requestOptions = @{}
    }
    
    Write-Host "      ✅ Parameters added" -ForegroundColor Green
    Write-Host ""
    
    # Step 3: Update workflow
    Write-Host "[3/4] Updating workflow via REST API..." -ForegroundColor Yellow
    
    $updatePayload = @{
        name = $workflow.name
        nodes = $workflow.nodes
        connections = $workflow.connections
        settings = $workflow.settings
    }
    
    if ($workflow.staticData) {
        $updatePayload.staticData = $workflow.staticData
    }
    
    $updateJson = $updatePayload | ConvertTo-Json -Depth 10
    
    $result = Invoke-RestMethod `
        -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/$workflowId" `
        -Headers $headers `
        -Method PUT `
        -Body $updateJson `
        -ContentType "application/json"
    
    Write-Host "      ✅ Workflow updated successfully" -ForegroundColor Green
    Write-Host ""
    
    # Step 4: Verify
    Write-Host "[4/4] Verifying update..." -ForegroundColor Yellow
    $verifyWorkflow = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/$workflowId" -Headers $headers -Method GET
    $verifyNode = $verifyWorkflow.nodes | Where-Object { $_.type -eq "n8n-nodes-base.n8n" }
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  VERIFICATION RESULTS" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    if ($verifyNode.parameters.resource -eq "workflow" -and $verifyNode.parameters.operation -eq "getAll") {
        Write-Host "✅ SUCCESS: Parameters are now correctly set!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Node Parameters:" -ForegroundColor Yellow
        Write-Host "  resource: $($verifyNode.parameters.resource)" -ForegroundColor White
        Write-Host "  operation: $($verifyNode.parameters.operation)" -ForegroundColor White
        Write-Host "  returnAll: $($verifyNode.parameters.returnAll)" -ForegroundColor White
        Write-Host ""
        Write-Host "🎯 Next Step: Test the MCP connection" -ForegroundColor Cyan
    } else {
        Write-Host "❌ FAILED: Parameters are still missing" -ForegroundColor Red
        Write-Host ""
        Write-Host "Current Parameters:" -ForegroundColor Yellow
        $verifyNode.parameters | ConvertTo-Json | Write-Host -ForegroundColor White
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Response Body:" -ForegroundColor Yellow
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | Write-Host -ForegroundColor White
    }
}

