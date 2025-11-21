# Check n8n-mcp Package Version and Provide Update Commands
# This script checks if the n8n-mcp package is outdated

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "N8N-MCP VERSION CHECK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Checking latest version available on npm..." -ForegroundColor Yellow

try {
    $latestVersion = npm view n8n-mcp version 2>$null
    
    if ($latestVersion) {
        Write-Host "✅ Latest version on npm: $latestVersion`n" -ForegroundColor Green
        
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "UPDATE COMMANDS" -ForegroundColor Cyan
        Write-Host "========================================`n" -ForegroundColor Cyan
        
        Write-Host "To force reinstall the latest version, run these commands:`n" -ForegroundColor Yellow
        
        Write-Host "1. Clear npm cache:" -ForegroundColor White
        Write-Host "   npm cache clean --force`n" -ForegroundColor Gray
        
        Write-Host "2. Run n8n-mcp with latest version:" -ForegroundColor White
        Write-Host "   npx -y n8n-mcp@latest`n" -ForegroundColor Gray
        
        Write-Host "3. Or install globally:" -ForegroundColor White
        Write-Host "   npm install -g n8n-mcp@latest`n" -ForegroundColor Gray
        
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "KNOWN ISSUES CHECK" -ForegroundColor Cyan
        Write-Host "========================================`n" -ForegroundColor Cyan
        
        Write-Host "GitHub Repository: https://github.com/czlonkowski/n8n-mcp" -ForegroundColor Yellow
        Write-Host "Check for known issues related to environment variable handling:`n" -ForegroundColor Yellow
        Write-Host "   https://github.com/czlonkowski/n8n-mcp/issues`n" -ForegroundColor Gray
        
    } else {
        Write-Host "❌ Could not retrieve version information from npm" -ForegroundColor Red
        Write-Host "   Make sure npm is installed and accessible`n" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error checking npm version: $($_.Exception.Message)`n" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTIC INFORMATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Node.js version:" -ForegroundColor Yellow
node --version

Write-Host "`nnpm version:" -ForegroundColor Yellow
npm --version

Write-Host "`nnpx version:" -ForegroundColor Yellow
npx --version

Write-Host "`n"

