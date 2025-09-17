# VS Code Optimization Script
# Version: 1.0.0
# Purpose: Apply performance optimizations to VS Code configuration
# Safety: Creates backups before making changes

param(
    [switch]$DryRun = $false,
    [switch]$CreateBackup = $true,
    [switch]$RestoreFromBackup = $false,
    [string]$BackupPath = "",
    [switch]$Verbose = $false
)

# Configuration
$LogFile = "$PSScriptRoot\..\logs\vscode-optimization.log"
$BackupDir = "$PSScriptRoot\..\backups\vscode-$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
$ConfigDir = "$PSScriptRoot\..\config"

# VS Code paths
$VSCodeUserDir = "$env:USERPROFILE\AppData\Roaming\Code\User"
$SettingsPath = "$VSCodeUserDir\settings.json"
$KeybindingsPath = "$VSCodeUserDir\keybindings.json"
$ExtensionsPath = "$env:USERPROFILE\.vscode\extensions"

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
function Backup-VSCodeConfig {
    param([string]$SourcePath, [string]$BackupName)
    
    if (Test-Path $SourcePath) {
        $BackupPath = Join-Path $BackupDir $BackupName
        try {
            Copy-Item -Path $SourcePath -Destination $BackupPath -Force
            Write-Log "Backed up $SourcePath to $BackupPath" "SUCCESS"
            return $true
        } catch {
            Write-Log "Failed to backup $SourcePath : $($_.Exception.Message)" "ERROR"
            return $false
        }
    } else {
        Write-Log "Source path not found: $SourcePath" "WARN"
        return $true  # Not an error if file doesn't exist
    }
}

# Restore function
function Restore-VSCodeConfig {
    param([string]$BackupPath, [string]$TargetPath)
    
    if (Test-Path $BackupPath) {
        try {
            Copy-Item -Path $BackupPath -Destination $TargetPath -Force
            Write-Log "Restored $BackupPath to $TargetPath" "SUCCESS"
            return $true
        } catch {
            Write-Log "Failed to restore $BackupPath : $($_.Exception.Message)" "ERROR"
            return $false
        }
    } else {
        Write-Log "Backup file not found: $BackupPath" "ERROR"
        return $false
    }
}

# Get VS Code process information
function Get-VSCodeProcessInfo {
    $VSCodeProcesses = Get-Process -Name "Code" -ErrorAction SilentlyContinue
    if ($VSCodeProcesses) {
        $TotalMemory = ($VSCodeProcesses | Measure-Object WorkingSet -Sum).Sum
        return @{
            ProcessCount = $VSCodeProcesses.Count
            TotalMemoryMB = [math]::Round($TotalMemory / 1MB, 2)
            Processes = $VSCodeProcesses
        }
    } else {
        return @{
            ProcessCount = 0
            TotalMemoryMB = 0
            Processes = @()
        }
    }
}

Write-Log "=== VS CODE OPTIMIZATION STARTED ===" "INFO"
Write-Log "DryRun: $DryRun, CreateBackup: $CreateBackup, RestoreFromBackup: $RestoreFromBackup" "INFO"

# Handle restore operation
if ($RestoreFromBackup) {
    Write-Log "=== RESTORE FROM BACKUP ===" "INFO"
    
    if (-not $BackupPath) {
        Write-Log "BackupPath parameter required for restore operation" "ERROR"
        exit 1
    }
    
    if (!(Test-Path $BackupPath)) {
        Write-Log "Backup directory not found: $BackupPath" "ERROR"
        exit 1
    }
    
    # Restore settings
    $BackupSettingsPath = Join-Path $BackupPath "settings.json"
    if (Test-Path $BackupSettingsPath) {
        if ($DryRun) {
            Write-Log "[DRY RUN] Would restore settings from $BackupSettingsPath" "INFO"
        } else {
            Restore-VSCodeConfig -BackupPath $BackupSettingsPath -TargetPath $SettingsPath
        }
    }
    
    Write-Log "=== RESTORE COMPLETED ===" "SUCCESS"
    exit 0
}

# Get initial VS Code state
$InitialState = Get-VSCodeProcessInfo
Write-Log "Initial VS Code state - Processes: $($InitialState.ProcessCount), Memory: $($InitialState.TotalMemoryMB) MB" "INFO"

# Phase 1: Backup existing configuration
if ($CreateBackup) {
    Write-Log "=== PHASE 1: BACKUP CONFIGURATION ===" "INFO"
    
    $BackupSuccess = $true
    $BackupSuccess = $BackupSuccess -and (Backup-VSCodeConfig -SourcePath $SettingsPath -BackupName "settings.json")
    $BackupSuccess = $BackupSuccess -and (Backup-VSCodeConfig -SourcePath $KeybindingsPath -BackupName "keybindings.json")
    
    if ($BackupSuccess) {
        Write-Log "Configuration backup completed successfully" "SUCCESS"
        Write-Log "Backup location: $BackupDir" "INFO"
    } else {
        Write-Log "Backup failed - aborting optimization" "ERROR"
        exit 1
    }
}

# Phase 2: Apply optimized settings
Write-Log "=== PHASE 2: APPLY OPTIMIZED SETTINGS ===" "INFO"

$OptimizedSettingsPath = "$ConfigDir\vscode-settings.json"
if (Test-Path $OptimizedSettingsPath) {
    try {
        $OptimizedSettings = Get-Content $OptimizedSettingsPath -Raw
        
        if ($DryRun) {
            Write-Log "[DRY RUN] Would apply optimized settings to $SettingsPath" "INFO"
        } else {
            # Ensure VS Code user directory exists
            if (!(Test-Path $VSCodeUserDir)) {
                New-Item -ItemType Directory -Path $VSCodeUserDir -Force | Out-Null
                Write-Log "Created VS Code user directory: $VSCodeUserDir" "INFO"
            }
            
            Set-Content -Path $SettingsPath -Value $OptimizedSettings -Force
            Write-Log "Applied optimized settings to VS Code" "SUCCESS"
        }
    } catch {
        Write-Log "Failed to apply optimized settings: $($_.Exception.Message)" "ERROR"
    }
} else {
    Write-Log "Optimized settings file not found: $OptimizedSettingsPath" "ERROR"
}

# Phase 3: Clean VS Code cache and temporary files
Write-Log "=== PHASE 3: CLEAN CACHE AND TEMPORARY FILES ===" "INFO"

$CachePaths = @(
    "$env:USERPROFILE\AppData\Roaming\Code\logs",
    "$env:USERPROFILE\AppData\Roaming\Code\CachedExtensions",
    "$env:USERPROFILE\AppData\Roaming\Code\User\workspaceStorage",
    "$env:USERPROFILE\.vscode\extensions\.obsolete"
)

$TotalCleaned = 0

foreach ($CachePath in $CachePaths) {
    if (Test-Path $CachePath) {
        try {
            $InitialSize = (Get-ChildItem -Path $CachePath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            
            if ($CachePath -like "*workspaceStorage*") {
                # Clean old workspace storage (older than 30 days)
                $OldWorkspaces = Get-ChildItem -Path $CachePath -Directory -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) }
                
                foreach ($Workspace in $OldWorkspaces) {
                    if ($DryRun) {
                        Write-Log "[DRY RUN] Would remove old workspace: $($Workspace.Name)" "INFO"
                    } else {
                        Remove-Item -Path $Workspace.FullName -Recurse -Force -ErrorAction SilentlyContinue
                    }
                }
            } else {
                # Clean log files and cache (older than 7 days)
                $OldFiles = Get-ChildItem -Path $CachePath -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
                
                foreach ($File in $OldFiles) {
                    if ($DryRun) {
                        Write-Log "[DRY RUN] Would remove file: $($File.Name)" "INFO"
                    } else {
                        Remove-Item -Path $File.FullName -Force -ErrorAction SilentlyContinue
                    }
                }
            }
            
            if (!$DryRun) {
                $FinalSize = (Get-ChildItem -Path $CachePath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                $CleanedSize = $InitialSize - $FinalSize
                $TotalCleaned += $CleanedSize
                Write-Log "Cleaned $CachePath - Freed $([math]::Round($CleanedSize/1MB,2)) MB" "SUCCESS"
            }
        } catch {
            Write-Log "Failed to clean $CachePath : $($_.Exception.Message)" "ERROR"
        }
    }
}

if (!$DryRun) {
    Write-Log "Total cache space freed: $([math]::Round($TotalCleaned/1MB,2)) MB" "SUCCESS"
}

# Phase 4: Extension optimization recommendations
Write-Log "=== PHASE 4: EXTENSION ANALYSIS ===" "INFO"

if (Test-Path $ExtensionsPath) {
    $Extensions = Get-ChildItem -Path $ExtensionsPath -Directory | Where-Object { $_.Name -notlike ".*" }
    Write-Log "Found $($Extensions.Count) installed extensions" "INFO"
    
    # Identify potentially resource-heavy extensions
    $HeavyExtensions = @(
        "ms-python.python",
        "ms-vscode.cpptools",
        "ms-dotnettools.csharp",
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode"
    )
    
    $InstalledHeavyExtensions = $Extensions | Where-Object { $HeavyExtensions -contains ($_.Name -split '-')[0..1] -join '.' }
    
    if ($InstalledHeavyExtensions) {
        Write-Log "Resource-intensive extensions detected:" "WARN"
        foreach ($Extension in $InstalledHeavyExtensions) {
            Write-Log "  - $($Extension.Name)" "WARN"
        }
        Write-Log "Consider disabling unused heavy extensions to improve performance" "INFO"
    }
}

# Phase 5: Final analysis and recommendations
Write-Log "=== PHASE 5: FINAL ANALYSIS ===" "INFO"

if (!$DryRun) {
    Write-Log "Waiting for VS Code to apply changes..." "INFO"
    Start-Sleep -Seconds 5
}

$FinalState = Get-VSCodeProcessInfo
$MemoryChange = $InitialState.TotalMemoryMB - $FinalState.TotalMemoryMB

Write-Log "=== VS CODE OPTIMIZATION RESULTS ===" "SUCCESS"
Write-Log "VS Code processes: $($InitialState.ProcessCount) → $($FinalState.ProcessCount)" "INFO"
Write-Log "Memory usage: $($InitialState.TotalMemoryMB) MB → $($FinalState.TotalMemoryMB) MB" "INFO"
Write-Log "Memory change: $([math]::Round($MemoryChange,2)) MB" "INFO"

if ($CreateBackup) {
    Write-Log "Backup created at: $BackupDir" "INFO"
    Write-Log "To restore: .\apply-vscode-optimizations.ps1 -RestoreFromBackup -BackupPath '$BackupDir'" "INFO"
}

Write-Log "=== RECOMMENDATIONS ===" "INFO"
Write-Log "1. Restart VS Code to apply all optimizations" "INFO"
Write-Log "2. Monitor performance and re-enable features as needed" "INFO"
Write-Log "3. Run system monitor to verify improvements" "INFO"

Write-Log "=== VS CODE OPTIMIZATION COMPLETED ===" "SUCCESS"

# Return results for automation
return @{
    Success = $true
    MemoryChangeMB = [math]::Round($MemoryChange, 2)
    CacheCleanedMB = [math]::Round($TotalCleaned/1MB, 2)
    BackupLocation = if ($CreateBackup) { $BackupDir } else { $null }
    ProcessCountChange = $InitialState.ProcessCount - $FinalState.ProcessCount
}
