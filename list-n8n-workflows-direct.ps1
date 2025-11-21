# List N8N Workflows Directly via REST API
# This script bypasses the n8n-mcp MCP server and uses the N8N REST API directly

$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$apiUrl = "https://n8n.srv972609.hstgr.cloud"

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║              N8N WORKFLOW LIST (Direct REST API)               ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "X-N8N-API-KEY" = $apiKey
}

try {
    Write-Host "Fetching workflows from: $apiUrl" -ForegroundColor Yellow
    Write-Host "Endpoint: /api/v1/workflows`n" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$apiUrl/api/v1/workflows" -Headers $headers -Method GET -ErrorAction Stop
    
    $workflowCount = $response.data.Count
    
    if ($workflowCount -eq 0) {
        Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
        Write-Host "║                                                                ║" -ForegroundColor Yellow
        Write-Host "║                    NO WORKFLOWS FOUND                          ║" -ForegroundColor Yellow
        Write-Host "║                                                                ║" -ForegroundColor Yellow
        Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Your N8N instance currently has 0 workflows." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "This could mean:" -ForegroundColor Gray
        Write-Host "  1. The instance is newly created and has no workflows yet" -ForegroundColor Gray
        Write-Host "  2. Workflows are in a different project/organization" -ForegroundColor Gray
        Write-Host "  3. Workflows were deleted or the instance was reset" -ForegroundColor Gray
        Write-Host ""
        exit 0
    }
    
    Write-Host "✅ SUCCESS: Found $workflowCount workflow(s)`n" -ForegroundColor Green
    
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                        WORKFLOW LIST                           ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    # Create formatted table
    $workflows = $response.data | Select-Object @{
        Name = 'ID'; Expression = { $_.id }
    }, @{
        Name = 'Name'; Expression = { $_.name }
    }, @{
        Name = 'Active'; Expression = {
            if ($_.active) { "Yes" } else { "No" }
        }
    }, @{
        Name = 'Nodes'; Expression = {
            if ($_.nodes) {
                $_.nodes.Count
            }
            else {
                "N/A"
            }
        }
    }, @{
        Name = 'Created'; Expression = {
            if ($_.createdAt) {
                [DateTime]::Parse($_.createdAt).ToString("yyyy-MM-dd HH:mm")
            }
            else {
                "N/A"
            }
        }
    }, @{
        Name = 'Updated'; Expression = {
            if ($_.updatedAt) {
                [DateTime]::Parse($_.updatedAt).ToString("yyyy-MM-dd HH:mm")
            }
            else {
                "N/A"
            }
        }
    }, @{
        Name = 'Tags'; Expression = {
            if ($_.tags -and $_.tags.Count -gt 0) {
                $_.tags -join ", "
            }
            else {
                "None"
            }
        }
    }
    
    $workflows | Format-Table -AutoSize
    
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                         SUMMARY                                ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Total Workflows: $workflowCount" -ForegroundColor Green
    Write-Host "Active Workflows: $(($response.data | Where-Object {$_.active}).Count)" -ForegroundColor Green
    Write-Host "Inactive Workflows: $(($response.data | Where-Object {-not $_.active}).Count)" -ForegroundColor Yellow
    Write-Host ""
    
    # Export to JSON file
    $exportPath = "n8n-workflows-export-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').json"
    $response.data | ConvertTo-Json -Depth 10 | Out-File -FilePath $exportPath -Encoding UTF8
    Write-Host "✅ Workflows exported to: $exportPath" -ForegroundColor Green
    Write-Host ""
    
}
catch {
    Write-Host "❌ FAILED: Could not retrieve workflows" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)`n" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "HTTP Status Code: $statusCode" -ForegroundColor Red
        
        switch ($statusCode) {
            401 {
                Write-Host "`nDIAGNOSIS: 401 Unauthorized - API key is INVALID or EXPIRED" -ForegroundColor Yellow
                Write-Host "ACTION: Generate a new API key in N8N Settings → API" -ForegroundColor Yellow
            }
            403 {
                Write-Host "`nDIAGNOSIS: 403 Forbidden - API key lacks permissions" -ForegroundColor Yellow
                Write-Host "ACTION: Check API key permissions in N8N" -ForegroundColor Yellow
            }
            404 {
                Write-Host "`nDIAGNOSIS: 404 Not Found - N8N instance URL is incorrect" -ForegroundColor Yellow
                Write-Host "ACTION: Verify the N8N instance URL: $apiUrl" -ForegroundColor Yellow
            }
            default {
                Write-Host "`nDIAGNOSIS: Unexpected HTTP error" -ForegroundColor Yellow
                Write-Host "ACTION: Check N8N server logs for details" -ForegroundColor Yellow
            }
        }
    }
    
    exit 1
}

