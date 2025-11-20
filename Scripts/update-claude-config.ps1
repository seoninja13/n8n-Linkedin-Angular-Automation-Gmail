# Update Claude Desktop Config with N8N MCP Server
# This script adds the N8N MCP server configuration to Claude Desktop's config file

$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"

Write-Host "📍 Config file location: $configPath" -ForegroundColor Cyan

# Check if config file exists
if (-not (Test-Path $configPath)) {
    Write-Host "❌ ERROR: Config file not found at: $configPath" -ForegroundColor Red
    exit 1
}

# Read existing config
try {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    Write-Host "✅ Successfully read existing config" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Failed to read config file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Add N8N MCP server configuration
$config.mcpServers | Add-Member -MemberType NoteProperty -Name "n8n-mcp" -Value @{
    command = "npx"
    args = @("-y", "n8n-mcp")
    env = @{
        MCP_MODE = "stdio"
        LOG_LEVEL = "error"
        DISABLE_CONSOLE_OUTPUT = "true"
        N8N_API_URL = "https://n8n.srv972609.hstgr.cloud"
        N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNTk1NDM2fQ.s8nyh35tgs2m7PO76zUVUVlCCDWoV4oZWep341vZbrg"
    }
} -Force

# Save updated config
try {
    $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
    Write-Host "✅ Successfully updated Claude Desktop config" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Failed to write config file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Display updated config
Write-Host "`n📋 Updated config:" -ForegroundColor Cyan
$config | ConvertTo-Json -Depth 10

Write-Host "`n⚠️  IMPORTANT: You must restart Claude Desktop for changes to take effect!" -ForegroundColor Yellow
Write-Host "   1. Close Claude Desktop completely" -ForegroundColor Yellow
Write-Host "   2. Reopen Claude Desktop" -ForegroundColor Yellow
Write-Host "   3. Verify N8N MCP tools are available" -ForegroundColor Yellow

