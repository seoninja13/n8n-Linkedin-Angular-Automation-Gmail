# Task Scheduler Setup Script
# Version: 1.0.0
# Purpose: Create scheduled tasks for automated system cleanup
# Safety: Creates conservative cleanup schedules with logging

param(
    [switch]$CreateTasks = $false,
    [switch]$RemoveTasks = $false,
    [switch]$ListTasks = $false,
    [string]$ScheduleType = "Weekly",  # Daily, Weekly, Monthly
    [string]$TaskTime = "02:00",       # 24-hour format
    [switch]$DryRun = $false
)

# Configuration
$LogFile = "$PSScriptRoot\..\logs\scheduler.log"
$TaskPrefix = "SystemResourceCleanup"

# Task definitions
$Tasks = @(
    @{
        Name = "$TaskPrefix-SafeCleanup"
        Description = "Safe process cleanup - runs conservative cleanup"
        Script = "$PSScriptRoot\safe-process-cleanup.ps1"
        Schedule = "Weekly"
        Time = "02:00"
        Arguments = "-Verbose"
    },
    @{
        Name = "$TaskPrefix-ComprehensiveCleanup"
        Description = "Comprehensive system cleanup - runs full optimization"
        Script = "$PSScriptRoot\comprehensive-cleanup.ps1"
        Schedule = "Monthly"
        Time = "03:00"
        Arguments = "-Verbose -CreateBackup"
    },
    @{
        Name = "$TaskPrefix-VSCodeOptimization"
        Description = "VS Code optimization - applies performance settings"
        Script = "$PSScriptRoot\apply-vscode-optimizations.ps1"
        Schedule = "Monthly"
        Time = "03:30"
        Arguments = "-Verbose -CreateBackup"
    }
)

# Ensure log directory exists
$LogDir = Split-Path $LogFile -Parent
if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

# Logging function
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

# Check if running as administrator
function Test-Administrator {
    $CurrentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $Principal = New-Object Security.Principal.WindowsPrincipal($CurrentUser)
    return $Principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Create scheduled task
function New-CleanupTask {
    param($TaskInfo)
    
    try {
        # Create task action
        $Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$($TaskInfo.Script)`" $($TaskInfo.Arguments)"
        
        # Create task trigger based on schedule type
        switch ($TaskInfo.Schedule) {
            "Daily" {
                $Trigger = New-ScheduledTaskTrigger -Daily -At $TaskInfo.Time
            }
            "Weekly" {
                $Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At $TaskInfo.Time
            }
            "Monthly" {
                $Trigger = New-ScheduledTaskTrigger -Weekly -WeeksInterval 4 -DaysOfWeek Sunday -At $TaskInfo.Time
            }
            default {
                $Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At $TaskInfo.Time
            }
        }
        
        # Create task settings
        $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable:$false
        
        # Create task principal (run as current user)
        $Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive
        
        if ($DryRun) {
            Write-Log "[DRY RUN] Would create task: $($TaskInfo.Name)" "INFO"
            Write-Log "[DRY RUN] Schedule: $($TaskInfo.Schedule) at $($TaskInfo.Time)" "INFO"
            Write-Log "[DRY RUN] Script: $($TaskInfo.Script)" "INFO"
        } else {
            # Register the task
            Register-ScheduledTask -TaskName $TaskInfo.Name -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal -Description $TaskInfo.Description -Force
            Write-Log "Created scheduled task: $($TaskInfo.Name)" "SUCCESS"
        }
        
        return $true
    } catch {
        Write-Log "Failed to create task $($TaskInfo.Name): $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Remove scheduled task
function Remove-CleanupTask {
    param($TaskName)
    
    try {
        if ($DryRun) {
            Write-Log "[DRY RUN] Would remove task: $TaskName" "INFO"
        } else {
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction Stop
            Write-Log "Removed scheduled task: $TaskName" "SUCCESS"
        }
        return $true
    } catch {
        Write-Log "Failed to remove task $TaskName : $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# List existing cleanup tasks
function Get-CleanupTasks {
    try {
        $ExistingTasks = Get-ScheduledTask | Where-Object { $_.TaskName -like "$TaskPrefix*" }
        
        if ($ExistingTasks) {
            Write-Log "=== EXISTING CLEANUP TASKS ===" "INFO"
            foreach ($Task in $ExistingTasks) {
                $NextRun = (Get-ScheduledTaskInfo -TaskName $Task.TaskName).NextRunTime
                Write-Log "Task: $($Task.TaskName)" "INFO"
                Write-Log "  State: $($Task.State)" "INFO"
                Write-Log "  Next Run: $NextRun" "INFO"
                Write-Log "  Description: $($Task.Description)" "INFO"
                Write-Log "" "INFO"
            }
        } else {
            Write-Log "No existing cleanup tasks found" "INFO"
        }
        
        return $ExistingTasks
    } catch {
        Write-Log "Failed to list tasks: $($_.Exception.Message)" "ERROR"
        return @()
    }
}

Write-Log "=== TASK SCHEDULER SETUP STARTED ===" "INFO"
Write-Log "CreateTasks: $CreateTasks, RemoveTasks: $RemoveTasks, ListTasks: $ListTasks" "INFO"

# Check administrator privileges
if (($CreateTasks -or $RemoveTasks) -and !(Test-Administrator)) {
    Write-Log "Administrator privileges required for task creation/removal" "ERROR"
    Write-Log "Please run PowerShell as Administrator and try again" "ERROR"
    exit 1
}

# Handle list tasks operation
if ($ListTasks) {
    Get-CleanupTasks
    exit 0
}

# Handle remove tasks operation
if ($RemoveTasks) {
    Write-Log "=== REMOVING SCHEDULED TASKS ===" "INFO"
    
    $ExistingTasks = Get-ScheduledTask | Where-Object { $_.TaskName -like "$TaskPrefix*" }
    
    if ($ExistingTasks) {
        foreach ($Task in $ExistingTasks) {
            Remove-CleanupTask -TaskName $Task.TaskName
        }
        Write-Log "Task removal completed" "SUCCESS"
    } else {
        Write-Log "No cleanup tasks found to remove" "INFO"
    }
    
    exit 0
}

# Handle create tasks operation
if ($CreateTasks) {
    Write-Log "=== CREATING SCHEDULED TASKS ===" "INFO"
    
    # Check if scripts exist
    $MissingScripts = @()
    foreach ($Task in $Tasks) {
        if (!(Test-Path $Task.Script)) {
            $MissingScripts += $Task.Script
        }
    }
    
    if ($MissingScripts) {
        Write-Log "Missing script files:" "ERROR"
        foreach ($Script in $MissingScripts) {
            Write-Log "  - $Script" "ERROR"
        }
        Write-Log "Please ensure all scripts are present before creating tasks" "ERROR"
        exit 1
    }
    
    # Remove existing tasks first
    $ExistingTasks = Get-ScheduledTask | Where-Object { $_.TaskName -like "$TaskPrefix*" }
    foreach ($Task in $ExistingTasks) {
        Write-Log "Removing existing task: $($Task.TaskName)" "INFO"
        Remove-CleanupTask -TaskName $Task.TaskName
    }
    
    # Create new tasks
    $SuccessCount = 0
    foreach ($Task in $Tasks) {
        if (New-CleanupTask -TaskInfo $Task) {
            $SuccessCount++
        }
    }
    
    Write-Log "=== TASK CREATION RESULTS ===" "SUCCESS"
    Write-Log "Successfully created $SuccessCount of $($Tasks.Count) tasks" "INFO"
    
    if ($SuccessCount -eq $Tasks.Count) {
        Write-Log "All scheduled tasks created successfully" "SUCCESS"
        Write-Log "" "INFO"
        Write-Log "=== SCHEDULED CLEANUP SUMMARY ===" "INFO"
        Write-Log "• Safe Cleanup: Weekly on Sunday at 02:00" "INFO"
        Write-Log "• Comprehensive Cleanup: Monthly (every 4 weeks) at 03:00" "INFO"
        Write-Log "• VS Code Optimization: Monthly (every 4 weeks) at 03:30" "INFO"
        Write-Log "" "INFO"
        Write-Log "Tasks will run automatically according to schedule" "INFO"
        Write-Log "Check logs in: $LogDir" "INFO"
    } else {
        Write-Log "Some tasks failed to create - check logs for details" "WARN"
    }
    
    exit 0
}

# Default behavior - show usage
Write-Log "=== TASK SCHEDULER SETUP USAGE ===" "INFO"
Write-Log "" "INFO"
Write-Log "USAGE:" "INFO"
Write-Log "  .\schedule-cleanup.ps1 -CreateTasks    # Create all scheduled tasks" "INFO"
Write-Log "  .\schedule-cleanup.ps1 -RemoveTasks    # Remove all scheduled tasks" "INFO"
Write-Log "  .\schedule-cleanup.ps1 -ListTasks      # List existing tasks" "INFO"
Write-Log "  .\schedule-cleanup.ps1 -DryRun -CreateTasks  # Preview task creation" "INFO"
Write-Log "" "INFO"
Write-Log "EXAMPLES:" "INFO"
Write-Log "  # Create scheduled tasks (requires admin)" "INFO"
Write-Log "  .\schedule-cleanup.ps1 -CreateTasks" "INFO"
Write-Log "" "INFO"
Write-Log "  # List current cleanup tasks" "INFO"
Write-Log "  .\schedule-cleanup.ps1 -ListTasks" "INFO"
Write-Log "" "INFO"
Write-Log "  # Remove all cleanup tasks (requires admin)" "INFO"
Write-Log "  .\schedule-cleanup.ps1 -RemoveTasks" "INFO"
Write-Log "" "INFO"
Write-Log "SCHEDULED TASKS:" "INFO"
Write-Log "• Safe Cleanup: Weekly process cleanup (conservative)" "INFO"
Write-Log "• Comprehensive Cleanup: Monthly full system optimization" "INFO"
Write-Log "• VS Code Optimization: Monthly VS Code performance tuning" "INFO"
Write-Log "" "INFO"
Write-Log "NOTE: Task creation/removal requires Administrator privileges" "INFO"

Write-Log "=== TASK SCHEDULER SETUP COMPLETED ===" "INFO"
