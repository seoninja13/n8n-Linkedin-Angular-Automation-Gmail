# N8N Workflow Backup Script
# Date: 2025-11-05
# Purpose: Save workflow JSON data to individual files

$backupDir = "Docs/backups/workflows/2025-11-05"
$date = "2025-11-05"

# Workflow metadata
$workflows = @(
    @{
        id          = "fGpR7xvrOO7PBa0c"
        name        = "LinkedIn-SEO-GmailOutlook-Orchestrator--Augment"
        nodeCount   = 14
        lastUpdated = "2025-11-05T16:49:04.000Z"
        notes       = "Main orchestrator with Data Validation Layer v1.1.0"
    },
    @{
        id          = "wbkQo6X2R8XQOYgG"
        name        = "LinkedIn-SEO-GmailOutlook-sub-flow-Workshop-JobDiscovery--Augment"
        nodeCount   = 5
        lastUpdated = "2025-10-29T15:57:35.000Z"
        notes       = "Job Discovery Workshop"
    },
    @{
        id          = "bpfuL3HjZuD27Ca3"
        name        = "LinkedIn-GmailOutlook-sub-flow-Workshop-JobMatchingScoring--Augment"
        nodeCount   = 7
        lastUpdated = "2025-10-29T16:04:11.000Z"
        notes       = "Job Matching Workshop"
    },
    @{
        id          = "Xkk3TA9tXqcJfwsc"
        name        = "LinkedIn-SEO-Gmail-sub-flow-Workshop-ValidationReporting--Augment"
        nodeCount   = 6
        lastUpdated = "2025-09-16T15:56:07.000Z"
        notes       = "Validation Reporting Workshop"
    },
    @{
        id          = "rClUELDAK9f4mgJx"
        name        = "LinkedIn-GmailOutlook-sub-flow-Workshop-ContactEnrichment--Augment"
        nodeCount   = 12
        lastUpdated = "TBD"
        notes       = "Contact Enrichment Workshop"
    },
    @{
        id          = "zTtSVmTg3UaV9tPG"
        name        = "LinkedIn-GmailOutlook-sub-flow-Workshop-ResumeGeneration--Augment"
        nodeCount   = 9
        lastUpdated = "TBD"
        notes       = "Resume Generation Workshop"
    },
    @{
        id          = "wZyxRjWShhnSFbSV"
        name        = "LinkedIn-GmailOutlook-sub-flow-Workshop-ContactTracking--Augment"
        nodeCount   = 13
        lastUpdated = "2025-11-05T14:21:32.000Z"
        notes       = "Contact Tracking Workshop (has pinned data)"
    },
    @{
        id          = "Vp9DpKF3xT2ysHhx"
        name        = "LinkedIn-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment"
        nodeCount   = 20
        lastUpdated = "2025-11-05T03:00:25.000Z"
        notes       = "Outreach Tracking Workshop"
    }
)

Write-Host "N8N Workflow Backup Script - $date" -ForegroundColor Cyan
Write-Host "=" * 80
Write-Host ""
Write-Host "Total workflows to backup: $($workflows.Count)" -ForegroundColor Green
Write-Host "Backup directory: $backupDir" -ForegroundColor Yellow
Write-Host ""

# Create manifest
$manifest = @{
    backupDate      = $date
    backupTimestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    totalWorkflows  = $workflows.Count
    workflows       = $workflows
}

$manifestPath = Join-Path $backupDir "backup-manifest_$date.json"
$manifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $manifestPath -Encoding UTF8

Write-Host "✓ Manifest file created: backup-manifest_$date.json" -ForegroundColor Green
Write-Host ""
Write-Host "Workflow files will be saved with naming convention:" -ForegroundColor Yellow
Write-Host "  workflow-name_workflow-id_$date.json" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Use N8N MCP tools to retrieve each workflow JSON" -ForegroundColor Gray
Write-Host "2. Save each workflow to its respective file" -ForegroundColor Gray
Write-Host "3. Verify all files are created successfully" -ForegroundColor Gray
Write-Host ""

