# N8N REST API Integration Examples

**Last Updated:** 2025-01-20

---

## 🎯 LinkedIn Automation Integration

### Complete Orchestration Flow

```powershell
# LinkedIn Automation Orchestrator Script
$apiKey = $env:N8N_API_KEY
$baseUrl = "https://n8n.srv972609.hstgr.cloud"
$headers = @{
    "X-N8N-API-KEY" = $apiKey
    "Content-Type" = "application/json"
}

# Step 1: Trigger Job Discovery
Write-Host "🔍 Step 1: Discovering Jobs..." -ForegroundColor Cyan
$jobDiscovery = @{
    keywords = "SEO"
    location = "Remote"
    maxResults = 313
} | ConvertTo-Json

$jobResponse = Invoke-RestMethod -Uri "$baseUrl/webhook/job-discovery" `
    -Method POST -Body $jobDiscovery -ContentType "application/json"

Write-Host "✅ Found $($jobResponse.jobsFound) jobs" -ForegroundColor Green

# Step 2: Monitor Job Discovery Execution
$workflowId = "qWMubgbQCCk8CrII"
Start-Sleep -Seconds 5
$executions = Invoke-RestMethod -Uri "$baseUrl/api/v1/executions?workflowId=$workflowId&limit=1" -Headers $headers
$latestExecution = $executions.data[0]

Write-Host "📊 Job Discovery Status: $($latestExecution.status)" -ForegroundColor Cyan

# Step 3: Trigger Resume Generation (if jobs found)
if ($jobResponse.jobsFound -gt 0) {
    Write-Host "`n📝 Step 2: Generating Resumes..." -ForegroundColor Cyan
    $resumeResponse = Invoke-RestMethod -Uri "$baseUrl/webhook/resume-generation" `
        -Method POST -Body "{}" -ContentType "application/json"
    Write-Host "✅ Resume generation initiated" -ForegroundColor Green
}

# Step 4: Trigger Contact Enrichment
Write-Host "`n👥 Step 3: Enriching Contacts..." -ForegroundColor Cyan
$contactResponse = Invoke-RestMethod -Uri "$baseUrl/webhook/contact-enrichment" `
    -Method POST -Body "{}" -ContentType "application/json"
Write-Host "✅ Contact enrichment initiated" -ForegroundColor Green

# Step 5: Trigger Outreach
Write-Host "`n📧 Step 4: Sending Outreach Emails..." -ForegroundColor Cyan
$outreachResponse = Invoke-RestMethod -Uri "$baseUrl/webhook/outreach-tracking" `
    -Method POST -Body "{}" -ContentType "application/json"
Write-Host "✅ Outreach initiated" -ForegroundColor Green

# Step 6: Generate Validation Report
Write-Host "`n📊 Step 5: Generating Validation Report..." -ForegroundColor Cyan
$validationResponse = Invoke-RestMethod -Uri "$baseUrl/webhook/validation-reporting" `
    -Method POST -Body "{}" -ContentType "application/json"
Write-Host "✅ Validation report generated" -ForegroundColor Green

Write-Host "`n🎉 LinkedIn Automation Complete!" -ForegroundColor Green
```

---

## 📊 Monitoring Dashboard Script

```powershell
# Real-time N8N Monitoring Dashboard
function Show-N8NDashboard {
    param(
        [int]$RefreshSeconds = 30
    )
    
    while ($true) {
        Clear-Host
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "           N8N LINKEDIN AUTOMATION DASHBOARD           " -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "Last Updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
        Write-Host ""
        
        # Get all workflows
        $workflows = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows" -Headers $headers
        
        # Workflow Status
        Write-Host "📋 WORKFLOW STATUS" -ForegroundColor Yellow
        Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray
        $workflows.data | ForEach-Object {
            $status = if ($_.active) { "🟢 ACTIVE" } else { "🔴 INACTIVE" }
            Write-Host "$status - $($_.name)" -ForegroundColor $(if ($_.active) { "Green" } else { "Red" })
        }
        
        # Recent Executions
        Write-Host "`n📊 RECENT EXECUTIONS (Last 10)" -ForegroundColor Yellow
        Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray
        $executions = Invoke-RestMethod -Uri "$baseUrl/api/v1/executions?limit=10" -Headers $headers
        $executions.data | ForEach-Object {
            $statusIcon = switch ($_.status) {
                "success" { "✅" }
                "error" { "❌" }
                "running" { "⏳" }
                default { "⚪" }
            }
            $workflow = $workflows.data | Where-Object { $_.id -eq $_.workflowId }
            Write-Host "$statusIcon $($workflow.name) - $(Get-Date $_.startedAt -Format 'HH:mm:ss')"
        }
        
        # Error Summary
        $errors = $executions.data | Where-Object { $_.status -eq "error" }
        if ($errors.Count -gt 0) {
            Write-Host "`n❌ ERRORS DETECTED: $($errors.Count)" -ForegroundColor Red
        }
        
        Write-Host "`n─────────────────────────────────────────────────────" -ForegroundColor Gray
        Write-Host "Press Ctrl+C to exit. Refreshing in $RefreshSeconds seconds..." -ForegroundColor Gray
        Start-Sleep -Seconds $RefreshSeconds
    }
}

# Run dashboard
Show-N8NDashboard -RefreshSeconds 30
```

---

## 🔄 Automated Workflow Backup

```powershell
# Backup all N8N workflows
function Backup-N8NWorkflows {
    param(
        [string]$BackupPath = ".\n8n-workflows\backups"
    )
    
    # Create backup directory
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $backupDir = Join-Path $BackupPath $timestamp
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    Write-Host "📦 Backing up N8N workflows..." -ForegroundColor Cyan
    
    # Get all workflows
    $workflows = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows" -Headers $headers
    
    foreach ($workflow in $workflows.data) {
        Write-Host "Backing up: $($workflow.name)" -ForegroundColor Gray
        
        # Get full workflow details
        $fullWorkflow = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows/$($workflow.id)" -Headers $headers
        
        # Save to file
        $filename = "$($workflow.name -replace '[^\w\-]', '_')-$($workflow.id).json"
        $filepath = Join-Path $backupDir $filename
        $fullWorkflow | ConvertTo-Json -Depth 100 | Out-File $filepath -Encoding UTF8
    }
    
    Write-Host "✅ Backup complete: $backupDir" -ForegroundColor Green
    Write-Host "Total workflows backed up: $($workflows.data.Count)" -ForegroundColor Green
}

# Run backup
Backup-N8NWorkflows
```

---

## 📈 Performance Analytics

```powershell
# Analyze workflow performance
function Get-WorkflowPerformance {
    param(
        [string]$WorkflowId,
        [int]$Days = 7
    )
    
    Write-Host "📊 Analyzing workflow performance..." -ForegroundColor Cyan
    
    # Get executions
    $executions = Invoke-RestMethod -Uri "$baseUrl/api/v1/executions?workflowId=$WorkflowId&limit=250" -Headers $headers
    
    # Filter by date range
    $cutoffDate = (Get-Date).AddDays(-$Days)
    $recentExecutions = $executions.data | Where-Object {
        (Get-Date $_.startedAt) -gt $cutoffDate
    }
    
    # Calculate statistics
    $totalExecutions = $recentExecutions.Count
    $successCount = ($recentExecutions | Where-Object { $_.status -eq "success" }).Count
    $errorCount = ($recentExecutions | Where-Object { $_.status -eq "error" }).Count
    $successRate = if ($totalExecutions -gt 0) { ($successCount / $totalExecutions) * 100 } else { 0 }
    
    # Calculate average duration
    $durations = $recentExecutions | ForEach-Object {
        if ($_.stoppedAt) {
            ((Get-Date $_.stoppedAt) - (Get-Date $_.startedAt)).TotalSeconds
        }
    } | Where-Object { $_ -ne $null }
    
    $avgDuration = if ($durations.Count -gt 0) { ($durations | Measure-Object -Average).Average } else { 0 }
    
    # Display results
    Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "           WORKFLOW PERFORMANCE REPORT                 " -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Period: Last $Days days" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Total Executions: $totalExecutions" -ForegroundColor White
    Write-Host "✅ Successful: $successCount" -ForegroundColor Green
    Write-Host "❌ Failed: $errorCount" -ForegroundColor Red
    Write-Host "📊 Success Rate: $([math]::Round($successRate, 2))%" -ForegroundColor $(if ($successRate -gt 90) { "Green" } else { "Yellow" })
    Write-Host "⏱️ Average Duration: $([math]::Round($avgDuration, 2)) seconds" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
}

# Analyze Job Discovery workflow
Get-WorkflowPerformance -WorkflowId "qWMubgbQCCk8CrII" -Days 7
```

---

## 🔔 Error Alert System

```powershell
# Monitor for errors and send alerts
function Start-ErrorMonitoring {
    param(
        [int]$CheckIntervalSeconds = 60,
        [string]$AlertEmail = "dachevivo@gmail.com"
    )
    
    $lastCheckedTime = Get-Date
    
    while ($true) {
        $executions = Invoke-RestMethod -Uri "$baseUrl/api/v1/executions?status=error&limit=50" -Headers $headers
        
        $newErrors = $executions.data | Where-Object {
            (Get-Date $_.startedAt) -gt $lastCheckedTime
        }
        
        if ($newErrors.Count -gt 0) {
            Write-Host "❌ NEW ERRORS DETECTED: $($newErrors.Count)" -ForegroundColor Red
            
            foreach ($error in $newErrors) {
                $workflow = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows/$($error.workflowId)" -Headers $headers
                Write-Host "  - $($workflow.name) at $(Get-Date $error.startedAt -Format 'HH:mm:ss')" -ForegroundColor Red
                
                # Here you could send email alert, Slack notification, etc.
            }
        }
        
        $lastCheckedTime = Get-Date
        Start-Sleep -Seconds $CheckIntervalSeconds
    }
}

# Start monitoring
Start-ErrorMonitoring -CheckIntervalSeconds 60
```

---

## 🔗 Related Documentation

- [Main README](./README.md)
- [Workflow Management API](./workflow-management-api.md)
- [Execution Monitoring API](./execution-monitoring-api.md)
- [Testing Guide](./testing-guide.md)

