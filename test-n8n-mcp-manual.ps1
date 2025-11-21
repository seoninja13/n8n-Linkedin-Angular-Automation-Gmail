# Test n8n-mcp Server Manually with Explicit Environment Variables
# This script runs n8n-mcp with environment variables set to verify if N8N API tools become available

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "N8N-MCP MANUAL TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Setting environment variables..." -ForegroundColor Yellow
$env:N8N_API_URL = "https://n8n.srv972609.hstgr.cloud"
$env:N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$env:LOG_LEVEL = "debug"
$env:MCP_MODE = "stdio"

Write-Host "✅ N8N_API_URL = $env:N8N_API_URL" -ForegroundColor Green
Write-Host "✅ N8N_API_KEY = $($env:N8N_API_KEY.Substring(0, 20))..." -ForegroundColor Green
Write-Host "✅ LOG_LEVEL = $env:LOG_LEVEL" -ForegroundColor Green
Write-Host "✅ MCP_MODE = $env:MCP_MODE`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EXPECTED OUTPUT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "If environment variables are working correctly, you should see:" -ForegroundColor Yellow
Write-Host "  ✅ [INFO] MCP server initialized with 41 tools (n8n API: configured)`n" -ForegroundColor Green

Write-Host "If environment variables are NOT working, you will see:" -ForegroundColor Yellow
Write-Host "  ❌ [INFO] MCP server initialized with 23 tools (n8n API: not configured)`n" -ForegroundColor Red

Write-Host "If there's a connection error, you will see:" -ForegroundColor Yellow
Write-Host "  ❌ [ERROR] Failed to connect to n8n API: <error details>`n" -ForegroundColor Red

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STARTING N8N-MCP SERVER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Running: npx -y n8n-mcp`n" -ForegroundColor Gray
Write-Host "NOTE: The server will start and wait for MCP client connections." -ForegroundColor Yellow
Write-Host "      Look for the initialization message in the first few lines." -ForegroundColor Yellow
Write-Host "      Press Ctrl+C to stop the server after you see the initialization message.`n" -ForegroundColor Yellow

# Run npx n8n-mcp
npx -y n8n-mcp

