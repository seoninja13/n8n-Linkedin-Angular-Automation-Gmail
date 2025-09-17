# Safe Process Cleanup Script
# Version: 1.0.0
# Purpose: Conservative cleanup of redundant Node.js and VS Code processes
# Safety: Preserves active development work and essential processes

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false,
    [int]$KeepNodeProcesses = 5,
    [int]$KeepVSCodeProcesses = 3
)

# Configuration
$LogFile = "$PSScriptRoot\..\logs\cleanup-history.log"
$ConfigFile = "$PSScriptRoot\..\config\cleanup-config.json"

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

# Safety check function
function Test-ProcessSafety {
    param([System.Diagnostics.Process]$Process)
    
    try {
        # Check if process has active network connections
        $Connections = netstat -ano | Where-Object { $_ -match $Process.Id -and $_ -match "ESTABLISHED" }
        if ($Connections) {
            return $false  # Not safe to terminate - has active connections
        }
        
        # Check if process is a parent of other important processes
        $ChildProcesses = Get-WmiObject Win32_Process | Where-Object { $_.ParentProcessId -eq $Process.Id }
        if ($ChildProcesses -and $ChildProcesses.Count -gt 0) {
            return $false  # Not safe to terminate - has child processes
        }
        
        return $true  # Safe to terminate
    }
    catch {
        return $false  # Error checking - err on side of caution
    }
}

Write-Log "=== SAFE PROCESS CLEANUP STARTED ===" "INFO"
Write-Log "DryRun: $DryRun, Verbose: $Verbose" "INFO"

# Get current process counts
$InitialNodeCount = (Get-Process -Name "node" -ErrorAction SilentlyContinue).Count
$InitialVSCodeCount = (Get-Process -Name "Code" -ErrorAction SilentlyContinue).Count
$InitialTotalMemory = (Get-Process | Measure-Object WorkingSet -Sum).Sum

Write-Log "Initial State - Node.js: $InitialNodeCount, VS Code: $InitialVSCodeCount" "INFO"
Write-Log "Initial Memory Usage: $([math]::Round($InitialTotalMemory/1GB,2)) GB" "INFO"

# Node.js Process Cleanup
Write-Log "=== NODE.JS PROCESS ANALYSIS ===" "INFO"
$NodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Sort-Object WorkingSet -Descending

if ($NodeProcesses) {
    Write-Log "Found $($NodeProcesses.Count) Node.js processes" "INFO"
    
    # Keep the largest processes (likely active servers)
    $NodesToKeep = $NodeProcesses | Select-Object -First $KeepNodeProcesses
    $NodesToTerminate = $NodeProcesses | Where-Object { $_.Id -notin $NodesToKeep.Id }
    
    Write-Log "Keeping $($NodesToKeep.Count) largest Node.js processes" "INFO"
    Write-Log "Analyzing $($NodesToTerminate.Count) processes for safe termination" "INFO"
    
    foreach ($Process in $NodesToTerminate) {
        $MemoryMB = [math]::Round($Process.WorkingSet/1MB, 2)
        
        if (Test-ProcessSafety -Process $Process) {
            if ($DryRun) {
                Write-Log "[DRY RUN] Would terminate Node.js PID $($Process.Id) - ${MemoryMB}MB" "INFO"
            } else {
                try {
                    Stop-Process -Id $Process.Id -Force -ErrorAction Stop
                    Write-Log "Terminated Node.js PID $($Process.Id) - ${MemoryMB}MB" "SUCCESS"
                } catch {
                    Write-Log "Failed to terminate Node.js PID $($Process.Id): $($_.Exception.Message)" "ERROR"
                }
            }
        } else {
            Write-Log "Skipping Node.js PID $($Process.Id) - ${MemoryMB}MB (active connections or child processes)" "WARN"
        }
    }
} else {
    Write-Log "No Node.js processes found" "INFO"
}

# VS Code Process Cleanup
Write-Log "=== VS CODE PROCESS ANALYSIS ===" "INFO"
$VSCodeProcesses = Get-Process -Name "Code" -ErrorAction SilentlyContinue | Sort-Object WorkingSet -Descending

if ($VSCodeProcesses) {
    Write-Log "Found $($VSCodeProcesses.Count) VS Code processes" "INFO"
    
    # Keep the largest processes (likely main windows)
    $VSCodesToKeep = $VSCodeProcesses | Select-Object -First $KeepVSCodeProcesses
    $VSCodesToTerminate = $VSCodeProcesses | Where-Object { $_.Id -notin $VSCodesToKeep.Id }
    
    Write-Log "Keeping $($VSCodesToKeep.Count) largest VS Code processes" "INFO"
    Write-Log "Analyzing $($VSCodesToTerminate.Count) processes for safe termination" "INFO"
    
    foreach ($Process in $VSCodesToTerminate) {
        $MemoryMB = [math]::Round($Process.WorkingSet/1MB, 2)
        
        # More conservative approach for VS Code - only terminate very small processes
        if ($MemoryMB -lt 50 -and (Test-ProcessSafety -Process $Process)) {
            if ($DryRun) {
                Write-Log "[DRY RUN] Would terminate VS Code PID $($Process.Id) - ${MemoryMB}MB" "INFO"
            } else {
                try {
                    Stop-Process -Id $Process.Id -Force -ErrorAction Stop
                    Write-Log "Terminated VS Code PID $($Process.Id) - ${MemoryMB}MB" "SUCCESS"
                } catch {
                    Write-Log "Failed to terminate VS Code PID $($Process.Id): $($_.Exception.Message)" "ERROR"
                }
            }
        } else {
            Write-Log "Skipping VS Code PID $($Process.Id) - ${MemoryMB}MB (too large or unsafe)" "WARN"
        }
    }
} else {
    Write-Log "No VS Code processes found" "INFO"
}

# Final status report
Start-Sleep -Seconds 2  # Allow processes to fully terminate

$FinalNodeCount = (Get-Process -Name "node" -ErrorAction SilentlyContinue).Count
$FinalVSCodeCount = (Get-Process -Name "Code" -ErrorAction SilentlyContinue).Count
$FinalTotalMemory = (Get-Process | Measure-Object WorkingSet -Sum).Sum

$NodeReduction = $InitialNodeCount - $FinalNodeCount
$VSCodeReduction = $InitialVSCodeCount - $FinalVSCodeCount
$MemoryFreed = $InitialTotalMemory - $FinalTotalMemory

Write-Log "=== CLEANUP RESULTS ===" "INFO"
Write-Log "Node.js processes: $InitialNodeCount → $FinalNodeCount (reduced by $NodeReduction)" "INFO"
Write-Log "VS Code processes: $InitialVSCodeCount → $FinalVSCodeCount (reduced by $VSCodeReduction)" "INFO"
Write-Log "Memory freed: $([math]::Round($MemoryFreed/1MB,2)) MB" "INFO"
Write-Log "Final memory usage: $([math]::Round($FinalTotalMemory/1GB,2)) GB" "INFO"
Write-Log "=== SAFE PROCESS CLEANUP COMPLETED ===" "INFO"

# Return results for automation
return @{
    NodeProcessesTerminated = $NodeReduction
    VSCodeProcessesTerminated = $VSCodeReduction
    MemoryFreedMB = [math]::Round($MemoryFreed/1MB,2)
    Success = $true
}
