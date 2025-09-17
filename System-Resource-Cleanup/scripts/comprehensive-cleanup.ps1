# Comprehensive System Cleanup Script
# Version: 1.0.0
# Purpose: Full system optimization including processes, temp files, and configurations
# Safety: Includes backup and rollback capabilities

param(
    [switch]$DryRun = $false,
    [switch]$IncludeTempFiles = $true,
    [switch]$OptimizeVSCode = $true,
    [switch]$CreateBackup = $true,
    [switch]$Verbose = $false
)

# Configuration
$LogFile = "$PSScriptRoot\..\logs\comprehensive-cleanup.log"
$BackupDir = "$PSScriptRoot\..\backups\$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"

# Ensure directories exist
$LogDir = Split-Path $LogFile -Parent
if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

if ($CreateBackup -and !(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

# Logging function
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

# Backup function
function Backup-Configuration {
    param([string]$SourcePath, [string]$BackupName)
    
    if ($CreateBackup -and (Test-Path $SourcePath)) {
        $BackupPath = Join-Path $BackupDir $BackupName
        try {
            Copy-Item -Path $SourcePath -Destination $BackupPath -Recurse -Force
            Write-Log "Backed up $SourcePath to $BackupPath" "INFO"
            return $true
        } catch {
            Write-Log "Failed to backup $SourcePath : $($_.Exception.Message)" "ERROR"
            return $false
        }
    }
    return $true
}

Write-Log "=== COMPREHENSIVE SYSTEM CLEANUP STARTED ===" "INFO"
Write-Log "DryRun: $DryRun, IncludeTempFiles: $IncludeTempFiles, OptimizeVSCode: $OptimizeVSCode" "INFO"

# Get initial system state
$InitialState = @{
    NodeProcesses = (Get-Process -Name "node" -ErrorAction SilentlyContinue).Count
    VSCodeProcesses = (Get-Process -Name "Code" -ErrorAction SilentlyContinue).Count
    TotalMemory = (Get-Process | Measure-Object WorkingSet -Sum).Sum
    TotalProcesses = (Get-Process).Count
}

Write-Log "Initial State - Node: $($InitialState.NodeProcesses), VSCode: $($InitialState.VSCodeProcesses), Memory: $([math]::Round($InitialState.TotalMemory/1GB,2))GB" "INFO"

# Phase 1: Safe Process Cleanup
Write-Log "=== PHASE 1: PROCESS CLEANUP ===" "INFO"
try {
    $CleanupParams = @{
        DryRun = $DryRun
        Verbose = $Verbose
    }
    
    $CleanupResult = & "$PSScriptRoot\safe-process-cleanup.ps1" @CleanupParams
    Write-Log "Process cleanup completed - Freed $($CleanupResult.MemoryFreedMB) MB" "SUCCESS"
} catch {
    Write-Log "Process cleanup failed: $($_.Exception.Message)" "ERROR"
}

# Phase 2: Temporary Files Cleanup
if ($IncludeTempFiles) {
    Write-Log "=== PHASE 2: TEMPORARY FILES CLEANUP ===" "INFO"
    
    $TempPaths = @(
        $env:TEMP,
        "$env:USERPROFILE\AppData\Local\Temp",
        "$env:USERPROFILE\AppData\Local\Microsoft\Windows\Temporary Internet Files",
        "$env:USERPROFILE\.vscode\logs",
        "$env:USERPROFILE\.npm\_logs"
    )
    
    $TotalFreedSpace = 0
    
    foreach ($TempPath in $TempPaths) {
        if (Test-Path $TempPath) {
            try {
                $InitialSize = (Get-ChildItem -Path $TempPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                
                if ($DryRun) {
                    Write-Log "[DRY RUN] Would clean $TempPath - $([math]::Round($InitialSize/1MB,2)) MB" "INFO"
                } else {
                    # Clean files older than 7 days
                    $OldFiles = Get-ChildItem -Path $TempPath -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
                    
                    foreach ($File in $OldFiles) {
                        try {
                            Remove-Item -Path $File.FullName -Force -ErrorAction SilentlyContinue
                        } catch {
                            # Ignore individual file errors
                        }
                    }
                    
                    $FinalSize = (Get-ChildItem -Path $TempPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                    $FreedSpace = $InitialSize - $FinalSize
                    $TotalFreedSpace += $FreedSpace
                    
                    Write-Log "Cleaned $TempPath - Freed $([math]::Round($FreedSpace/1MB,2)) MB" "SUCCESS"
                }
            } catch {
                Write-Log "Failed to clean $TempPath : $($_.Exception.Message)" "ERROR"
            }
        }
    }
    
    Write-Log "Total disk space freed: $([math]::Round($TotalFreedSpace/1MB,2)) MB" "SUCCESS"
}

# Phase 3: VS Code Optimization
if ($OptimizeVSCode) {
    Write-Log "=== PHASE 3: VS CODE OPTIMIZATION ===" "INFO"
    
    $VSCodeSettingsPath = "$env:USERPROFILE\AppData\Roaming\Code\User\settings.json"
    
    # Backup existing settings
    if (Backup-Configuration -SourcePath $VSCodeSettingsPath -BackupName "vscode-settings-backup.json") {
        
        # Apply optimized settings
        $OptimizedSettings = Get-Content "$PSScriptRoot\..\config\vscode-settings.json" -Raw -ErrorAction SilentlyContinue
        
        if ($OptimizedSettings -and !$DryRun) {
            try {
                Set-Content -Path $VSCodeSettingsPath -Value $OptimizedSettings -Force
                Write-Log "Applied optimized VS Code settings" "SUCCESS"
            } catch {
                Write-Log "Failed to apply VS Code settings: $($_.Exception.Message)" "ERROR"
            }
        } elseif ($DryRun) {
            Write-Log "[DRY RUN] Would apply optimized VS Code settings" "INFO"
        }
    }
    
    # Clean VS Code workspace storage
    $WorkspaceStoragePath = "$env:USERPROFILE\AppData\Roaming\Code\User\workspaceStorage"
    if (Test-Path $WorkspaceStoragePath) {
        try {
            $OldWorkspaces = Get-ChildItem -Path $WorkspaceStoragePath -Directory | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) }
            
            foreach ($Workspace in $OldWorkspaces) {
                if ($DryRun) {
                    Write-Log "[DRY RUN] Would remove old workspace: $($Workspace.Name)" "INFO"
                } else {
                    Remove-Item -Path $Workspace.FullName -Recurse -Force -ErrorAction SilentlyContinue
                    Write-Log "Removed old workspace storage: $($Workspace.Name)" "SUCCESS"
                }
            }
        } catch {
            Write-Log "Failed to clean workspace storage: $($_.Exception.Message)" "ERROR"
        }
    }
}

# Phase 4: System Registry Cleanup (Safe operations only)
Write-Log "=== PHASE 4: REGISTRY CLEANUP ===" "INFO"

# Clean Windows prefetch files
$PrefetchPath = "$env:SystemRoot\Prefetch"
if (Test-Path $PrefetchPath) {
    try {
        $PrefetchFiles = Get-ChildItem -Path $PrefetchPath -Filter "*.pf" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) }
        
        foreach ($File in $PrefetchFiles) {
            if ($DryRun) {
                Write-Log "[DRY RUN] Would remove prefetch file: $($File.Name)" "INFO"
            } else {
                Remove-Item -Path $File.FullName -Force -ErrorAction SilentlyContinue
            }
        }
        
        Write-Log "Cleaned $($PrefetchFiles.Count) old prefetch files" "SUCCESS"
    } catch {
        Write-Log "Failed to clean prefetch files: $($_.Exception.Message)" "ERROR"
    }
}

# Phase 5: Final System State Analysis
Write-Log "=== PHASE 5: FINAL ANALYSIS ===" "INFO"

Start-Sleep -Seconds 3  # Allow system to settle

$FinalState = @{
    NodeProcesses = (Get-Process -Name "node" -ErrorAction SilentlyContinue).Count
    VSCodeProcesses = (Get-Process -Name "Code" -ErrorAction SilentlyContinue).Count
    TotalMemory = (Get-Process | Measure-Object WorkingSet -Sum).Sum
    TotalProcesses = (Get-Process).Count
}

# Calculate improvements
$Improvements = @{
    NodeProcessReduction = $InitialState.NodeProcesses - $FinalState.NodeProcesses
    VSCodeProcessReduction = $InitialState.VSCodeProcesses - $FinalState.VSCodeProcesses
    MemoryFreed = $InitialState.TotalMemory - $FinalState.TotalMemory
    ProcessReduction = $InitialState.TotalProcesses - $FinalState.TotalProcesses
}

Write-Log "=== COMPREHENSIVE CLEANUP RESULTS ===" "SUCCESS"
Write-Log "Node.js processes: $($InitialState.NodeProcesses) → $($FinalState.NodeProcesses) (reduced by $($Improvements.NodeProcessReduction))" "INFO"
Write-Log "VS Code processes: $($InitialState.VSCodeProcesses) → $($FinalState.VSCodeProcesses) (reduced by $($Improvements.VSCodeProcessReduction))" "INFO"
Write-Log "Total processes: $($InitialState.TotalProcesses) → $($FinalState.TotalProcesses) (reduced by $($Improvements.ProcessReduction))" "INFO"
Write-Log "Memory freed: $([math]::Round($Improvements.MemoryFreed/1MB,2)) MB" "INFO"
Write-Log "Final memory usage: $([math]::Round($FinalState.TotalMemory/1GB,2)) GB" "INFO"

if ($CreateBackup) {
    Write-Log "Backup created at: $BackupDir" "INFO"
}

Write-Log "=== COMPREHENSIVE CLEANUP COMPLETED ===" "SUCCESS"

# Return results for automation
return @{
    Success = $true
    NodeProcessesReduced = $Improvements.NodeProcessReduction
    VSCodeProcessesReduced = $Improvements.VSCodeProcessReduction
    MemoryFreedMB = [math]::Round($Improvements.MemoryFreed/1MB,2)
    BackupLocation = if ($CreateBackup) { $BackupDir } else { $null }
    ProcessesReduced = $Improvements.ProcessReduction
}
