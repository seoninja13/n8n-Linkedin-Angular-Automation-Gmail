# Run All N8N-MCP Diagnostics in Sequence
# This script runs all diagnostic tests and provides a comprehensive report

Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║           N8N-MCP COMPREHENSIVE DIAGNOSTIC SUITE               ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

$results = @{
    Step1_APIConnection = $null
    Step2_MCPManual = $null
    Step3_VersionCheck = $null
}

# ============================================================================
# STEP 1: Test N8N API Connection
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  STEP 1: Testing N8N API Connection                           ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$apiUrl = "https://n8n.srv972609.hstgr.cloud"
$headers = @{ "X-N8N-API-KEY" = $apiKey }

try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/v1/workflows" -Headers $headers -Method GET -ErrorAction Stop
    
    Write-Host "✅ STEP 1 PASSED: N8N API Connection Successful" -ForegroundColor Green
    Write-Host "   Found $($response.data.Count) workflows`n" -ForegroundColor Green
    
    $results.Step1_APIConnection = "PASSED"
    
    # Display first 5 workflows
    Write-Host "Sample workflows:" -ForegroundColor Gray
    $response.data | Select-Object -First 5 | Select-Object id, name, active | Format-Table -AutoSize
    
} catch {
    Write-Host "❌ STEP 1 FAILED: N8N API Connection Failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
    
    $results.Step1_APIConnection = "FAILED"
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   HTTP Status Code: $statusCode" -ForegroundColor Red
        
        switch ($statusCode) {
            401 { Write-Host "   → API key is INVALID or EXPIRED" -ForegroundColor Yellow }
            403 { Write-Host "   → API key lacks permissions" -ForegroundColor Yellow }
            404 { Write-Host "   → N8N instance URL is incorrect" -ForegroundColor Yellow }
        }
    }
    
    Write-Host "`n⚠️  CANNOT PROCEED: Fix API connection before continuing`n" -ForegroundColor Red
    exit 1
}

Write-Host "Press Enter to continue to STEP 2..." -ForegroundColor Cyan
Read-Host

# ============================================================================
# STEP 2: Check n8n-mcp Package Version
# ============================================================================

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  STEP 2: Checking n8n-mcp Package Version                     ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

try {
    $latestVersion = npm view n8n-mcp version 2>$null
    
    if ($latestVersion) {
        Write-Host "✅ Latest n8n-mcp version on npm: $latestVersion" -ForegroundColor Green
        $results.Step3_VersionCheck = "PASSED"
    } else {
        Write-Host "⚠️  Could not retrieve version from npm" -ForegroundColor Yellow
        $results.Step3_VersionCheck = "WARNING"
    }
    
} catch {
    Write-Host "❌ Error checking npm version" -ForegroundColor Red
    $results.Step3_VersionCheck = "FAILED"
}

Write-Host "`nNode.js version: $(node --version)" -ForegroundColor Gray
Write-Host "npm version: $(npm --version)" -ForegroundColor Gray
Write-Host "npx version: $(npx --version)`n" -ForegroundColor Gray

Write-Host "Press Enter to continue to STEP 3..." -ForegroundColor Cyan
Read-Host

# ============================================================================
# STEP 3: Test n8n-mcp Server Manually
# ============================================================================

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  STEP 3: Testing n8n-mcp Server with Environment Variables    ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

Write-Host "⚠️  IMPORTANT: This will start the n8n-mcp server." -ForegroundColor Yellow
Write-Host "   Look for the initialization message in the first few lines." -ForegroundColor Yellow
Write-Host "   Press Ctrl+C to stop the server after you see the message.`n" -ForegroundColor Yellow

Write-Host "Expected messages:" -ForegroundColor Cyan
Write-Host "  ✅ [INFO] MCP server initialized with 41 tools (n8n API: configured)" -ForegroundColor Green
Write-Host "  ❌ [INFO] MCP server initialized with 23 tools (n8n API: not configured)`n" -ForegroundColor Red

Write-Host "Press Enter to start the n8n-mcp server..." -ForegroundColor Cyan
Read-Host

Write-Host "`nSetting environment variables..." -ForegroundColor Gray
$env:N8N_API_URL = $apiUrl
$env:N8N_API_KEY = $apiKey
$env:LOG_LEVEL = "debug"
$env:MCP_MODE = "stdio"

Write-Host "Starting n8n-mcp server...`n" -ForegroundColor Gray
npx -y n8n-mcp

# Note: The script will pause here until user presses Ctrl+C

Write-Host "`n`nServer stopped." -ForegroundColor Gray

