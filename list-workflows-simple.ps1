# List N8N Workflows - Simple Version
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$apiUrl = "https://n8n.srv972609.hstgr.cloud"

Write-Host "`nN8N WORKFLOW LIST" -ForegroundColor Cyan
Write-Host "==================`n" -ForegroundColor Cyan

$headers = @{ "X-N8N-API-KEY" = $apiKey }

try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/v1/workflows" -Headers $headers -Method GET
    
    $count = $response.data.Count
    Write-Host "Total Workflows: $count`n" -ForegroundColor Green
    
    if ($count -eq 0) {
        Write-Host "No workflows found in this N8N instance." -ForegroundColor Yellow
        exit 0
    }
    
    $response.data | Select-Object id, name, active, @{
        Name='Created'; Expression={ 
            if($_.createdAt) { [DateTime]::Parse($_.createdAt).ToString("yyyy-MM-dd HH:mm") } else { "N/A" }
        }
    }, @{
        Name='Updated'; Expression={
            if($_.updatedAt) { [DateTime]::Parse($_.updatedAt).ToString("yyyy-MM-dd HH:mm") } else { "N/A" }
        }
    } | Format-Table -AutoSize
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

