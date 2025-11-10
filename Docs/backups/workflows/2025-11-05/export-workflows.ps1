# N8N Workflow Export Script - 2025-11-05
# Exports all 8 LinkedIn automation workflows using N8N API

$ErrorActionPreference = "Stop"
$backupDir = "Docs/backups/workflows/2025-11-05"

Write-Host "N8N Workflow Export - 2025-11-05" -ForegroundColor Cyan
Write-Host "=" * 80
Write-Host ""

# N8N API Configuration
$n8nUrl = "https://n8n.srv972609.hstgr.cloud"
$n8nApiKey = $env:N8N_API_KEY

if (-not $n8nApiKey) {
    Write-Host "ERROR: N8N_API_KEY environment variable not set" -ForegroundColor Red
    Write-Host "Please set: `$env:N8N_API_KEY = 'your-api-key'" -ForegroundColor Yellow
    exit 1
}

# Workflow IDs
$workflows = @(
    @{ id = "fGpR7xvrOO7PBa0c"; name = "LinkedIn-SEO-GmailOutlook-Orchestrator--Augment" },
    @{ id = "wbkQo6X2R8XQOYgG"; name = "LinkedIn-SEO-GmailOutlook-sub-flow-Workshop-JobDiscovery--Augment" },
    @{ id = "bpfuL3HjZuD27Ca3"; name = "LinkedIn-GmailOutlook-sub-flow-Workshop-JobMatchingScoring--Augment" },
    @{ id = "rClUELDAK9f4mgJx"; name = "LinkedIn-GmailOutlook-sub-flow-Workshop-ContactEnrichment--Augment" },
    @{ id = "zTtSVmTg3UaV9tPG"; name = "LinkedIn-GmailOutlook-sub-flow-Workshop-ResumeGeneration--Augment" },
    @{ id = "wZyxRjWShhnSFbSV"; name = "LinkedIn-GmailOutlook-sub-flow-Workshop-ContactTracking--Augment" },
    @{ id = "Vp9DpKF3xT2ysHhx"; name = "LinkedIn-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment" },
    @{ id = "Xkk3TA9tXqcJfwsc"; name = "LinkedIn-SEO-Gmail-sub-flow-Workshop-ValidationReporting--Augment" }
)

$successCount = 0
$failureCount = 0

Write-Host "Total workflows: $($workflows.Count)" -ForegroundColor Yellow
Write-Host ""

foreach ($workflow in $workflows) {
    $fileName = "$($workflow.name)_$($workflow.id)_2025-11-05.json"
    $filePath = Join-Path $backupDir $fileName
    
    Write-Host "Exporting: $($workflow.name)..." -NoNewline
    
    try {
        $headers = @{
            "X-N8N-API-KEY" = $n8nApiKey
            "Accept" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri "$n8nUrl/api/v1/workflows/$($workflow.id)" -Headers $headers -Method Get
        $response | ConvertTo-Json -Depth 100 | Out-File -FilePath $filePath -Encoding UTF8
        
        $successCount++
        Write-Host " SUCCESS" -ForegroundColor Green
    }
    catch {
        $failureCount++
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=" * 80
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 80
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failureCount" -ForegroundColor $(if ($failureCount -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($successCount -eq $workflows.Count) {
    Write-Host "BACKUP COMPLETE!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "BACKUP INCOMPLETE" -ForegroundColor Yellow
    exit 1
}

