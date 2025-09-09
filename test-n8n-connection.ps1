# Test N8N MCP Server Connection
# This script tests the connection to your N8N instance on Hostinger VPS

Write-Host "🚀 Testing N8N MCP Server Connection..." -ForegroundColor Green

# Set environment variables
$env:N8N_API_URL = "https://n8n.srv972609.hstgr.cloud"
$env:N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3MzQ0MzcxLCJleHAiOjE3NTk4NzQ0MDB9.oh6kxmmzjdDGr6E8BS2xdhBMasIKkH2QFTLDCZchvtw"

Write-Host "📡 N8N Instance: $env:N8N_API_URL" -ForegroundColor Cyan
Write-Host "🔑 API Key: Configured" -ForegroundColor Cyan

# Test basic HTTP connection to N8N instance
Write-Host "`n🌐 Testing HTTP connection to N8N instance..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$env:N8N_API_URL/api/v1/workflows" -Headers @{
        "Authorization" = "Bearer $env:N8N_API_KEY"
        "Content-Type"  = "application/json"
    } -Method GET -TimeoutSec 10

    if ($response.StatusCode -eq 200) {
        Write-Host "✅ HTTP Connection: SUCCESS" -ForegroundColor Green
        $workflows = $response.Content | ConvertFrom-Json
        Write-Host "📊 Found $($workflows.data.Count) workflows in your N8N instance" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ HTTP Connection: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🔧 Testing N8N MCP Server..." -ForegroundColor Yellow

# Test if npx n8n-mcp can detect the API configuration
Write-Host "Starting N8N MCP Server (this may take a moment)..." -ForegroundColor Cyan

# Note: This will start the server but we'll need to stop it manually
Write-Host "⚠️  The MCP server will start in stdio mode." -ForegroundColor Yellow
Write-Host "⚠️  You'll see log messages indicating successful initialization." -ForegroundColor Yellow
Write-Host "⚠️  Press Ctrl+C to stop the server when you see it's running." -ForegroundColor Yellow
Write-Host "`n🎯 Look for: 'MCP server initialized with 39 tools (n8n API: configured)'" -ForegroundColor Magenta

Write-Host "`nStarting server in 3 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start the MCP server
npx n8n-mcp
