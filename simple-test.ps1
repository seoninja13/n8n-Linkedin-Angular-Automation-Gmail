Write-Host "Testing N8N API Connection..." -ForegroundColor Green

$apiUrl = "https://n8n.srv972609.hstgr.cloud/api/v1/workflows"
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3MzQ0MzcxLCJleHAiOjE3NTk4NzQ0MDB9.oh6kxmmzjdDGr6E8BS2xdhBMasIKkH2QFTLDCZchvtw"

try {
    $headers = @{
        "Authorization" = "Bearer $apiKey"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-WebRequest -Uri $apiUrl -Headers $headers -Method GET -TimeoutSec 10
    
    Write-Host "SUCCESS: Connected to N8N API" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
    
    $workflows = $response.Content | ConvertFrom-Json
    Write-Host "Found $($workflows.data.Count) workflows" -ForegroundColor Cyan
    
} catch {
    Write-Host "FAILED: Could not connect to N8N API" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
