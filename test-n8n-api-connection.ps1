# Test N8N API Connection
# This script verifies the N8N API key is valid and the instance is accessible

$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$apiUrl = "https://n8n.srv972609.hstgr.cloud"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "N8N API CONNECTION TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Testing connection to: $apiUrl" -ForegroundColor Yellow
Write-Host "API Key: $($apiKey.Substring(0, 20))...`n" -ForegroundColor Yellow

$headers = @{
    "X-N8N-API-KEY" = $apiKey
}

try {
    Write-Host "Sending GET request to /api/v1/workflows..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$apiUrl/api/v1/workflows" -Headers $headers -Method GET -ErrorAction Stop
    
    Write-Host "`n✅ SUCCESS: N8N API Connection Successful!" -ForegroundColor Green
    Write-Host "   Found $($response.data.Count) workflows`n" -ForegroundColor Green
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "WORKFLOW LIST" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    $response.data | Select-Object @{
        Name='ID'; Expression={$_.id}
    }, @{
        Name='Name'; Expression={$_.name}
    }, @{
        Name='Active'; Expression={if($_.active){"✅ Yes"}else{"❌ No"}}
    }, @{
        Name='Created'; Expression={
            if($_.createdAt) {
                [DateTime]::Parse($_.createdAt).ToString("yyyy-MM-dd HH:mm")
            } else {
                "N/A"
            }
        }
    }, @{
        Name='Updated'; Expression={
            if($_.updatedAt) {
                [DateTime]::Parse($_.updatedAt).ToString("yyyy-MM-dd HH:mm")
            } else {
                "N/A"
            }
        }
    } | Format-Table -AutoSize
    
    Write-Host "`n✅ RESULT: API key is VALID and N8N instance is ACCESSIBLE" -ForegroundColor Green
    Write-Host "   The issue is likely with how Augment Code passes environment variables to n8n-mcp`n" -ForegroundColor Yellow
    
    exit 0
    
} catch {
    Write-Host "`n❌ FAILED: N8N API Connection Failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   HTTP Status Code: $statusCode" -ForegroundColor Red
        
        switch ($statusCode) {
            401 {
                Write-Host "`n   DIAGNOSIS: 401 Unauthorized - API key is INVALID or EXPIRED" -ForegroundColor Yellow
                Write-Host "   ACTION: Generate a new API key in N8N Settings → API" -ForegroundColor Yellow
            }
            403 {
                Write-Host "`n   DIAGNOSIS: 403 Forbidden - API key lacks permissions" -ForegroundColor Yellow
                Write-Host "   ACTION: Check API key permissions in N8N" -ForegroundColor Yellow
            }
            404 {
                Write-Host "`n   DIAGNOSIS: 404 Not Found - N8N instance URL is incorrect" -ForegroundColor Yellow
                Write-Host "   ACTION: Verify the N8N instance URL: $apiUrl" -ForegroundColor Yellow
            }
            default {
                Write-Host "`n   DIAGNOSIS: Unexpected HTTP error" -ForegroundColor Yellow
                Write-Host "   ACTION: Check N8N server logs for details" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "`n   DIAGNOSIS: Network connection failed" -ForegroundColor Yellow
        Write-Host "   POSSIBLE CAUSES:" -ForegroundColor Yellow
        Write-Host "   - N8N instance is not running" -ForegroundColor Yellow
        Write-Host "   - Firewall blocking connection" -ForegroundColor Yellow
        Write-Host "   - DNS resolution failed" -ForegroundColor Yellow
        Write-Host "   - SSL/TLS certificate issue" -ForegroundColor Yellow
    }
    
    Write-Host "`n❌ RESULT: Cannot proceed with n8n-mcp configuration until API connection is fixed`n" -ForegroundColor Red
    
    exit 1
}

