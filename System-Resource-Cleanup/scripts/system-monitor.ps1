# System Resource Monitor
# Version: 1.0.0
# Purpose: Real-time monitoring of system resources and process counts
# Usage: Run continuously to monitor system performance

param(
    [int]$RefreshInterval = 30,
    [switch]$SaveToFile = $false,
    [string]$OutputFile = "$PSScriptRoot\..\logs\system-monitor.log",
    [switch]$ShowDetails = $false
)

# Configuration
$MonitorDuration = 0  # 0 = infinite, set to number of seconds for limited monitoring

# Ensure log directory exists if saving to file
if ($SaveToFile) {
    $LogDir = Split-Path $OutputFile -Parent
    if (!(Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
}

# Function to get system resource information
function Get-SystemResourceInfo {
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # Process counts
    $NodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    $VSCodeProcesses = Get-Process -Name "Code" -ErrorAction SilentlyContinue
    $TotalProcesses = (Get-Process).Count
    
    # Memory information
    $NodeMemory = if ($NodeProcesses) { ($NodeProcesses | Measure-Object WorkingSet -Sum).Sum } else { 0 }
    $VSCodeMemory = if ($VSCodeProcesses) { ($VSCodeProcesses | Measure-Object WorkingSet -Sum).Sum } else { 0 }
    $TotalMemory = (Get-Process | Measure-Object WorkingSet -Sum).Sum
    
    # System memory
    $SystemMemory = Get-WmiObject -Class Win32_ComputerSystem
    $TotalRAM = $SystemMemory.TotalPhysicalMemory
    $MemoryUsagePercent = [math]::Round(($TotalMemory / $TotalRAM) * 100, 2)
    
    # CPU information (average over last interval)
    $CPUUsage = (Get-WmiObject win32_processor | Measure-Object -Property LoadPercentage -Average).Average
    
    return @{
        Timestamp = $Timestamp
        NodeProcessCount = if ($NodeProcesses) { $NodeProcesses.Count } else { 0 }
        VSCodeProcessCount = if ($VSCodeProcesses) { $VSCodeProcesses.Count } else { 0 }
        TotalProcessCount = $TotalProcesses
        NodeMemoryMB = [math]::Round($NodeMemory / 1MB, 2)
        VSCodeMemoryMB = [math]::Round($VSCodeMemory / 1MB, 2)
        TotalMemoryGB = [math]::Round($TotalMemory / 1GB, 2)
        MemoryUsagePercent = $MemoryUsagePercent
        CPUUsagePercent = $CPUUsage
        NodeProcesses = $NodeProcesses
        VSCodeProcesses = $VSCodeProcesses
    }
}

# Function to display system information
function Show-SystemInfo {
    param($Info)
    
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                    SYSTEM RESOURCE MONITOR                   ║" -ForegroundColor Cyan
    Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║ Timestamp: $($Info.Timestamp)                    ║" -ForegroundColor White
    Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    
    # Process counts
    Write-Host "║ PROCESS COUNTS                                               ║" -ForegroundColor Yellow
    Write-Host "║ • Node.js Processes:     $($Info.NodeProcessCount.ToString().PadLeft(3)) processes                    ║" -ForegroundColor White
    Write-Host "║ • VS Code Processes:     $($Info.VSCodeProcessCount.ToString().PadLeft(3)) processes                    ║" -ForegroundColor White
    Write-Host "║ • Total System Processes: $($Info.TotalProcessCount.ToString().PadLeft(3)) processes                  ║" -ForegroundColor White
    Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    
    # Memory usage
    Write-Host "║ MEMORY USAGE                                                 ║" -ForegroundColor Yellow
    Write-Host "║ • Node.js Memory:        $($Info.NodeMemoryMB.ToString().PadLeft(7)) MB                    ║" -ForegroundColor White
    Write-Host "║ • VS Code Memory:        $($Info.VSCodeMemoryMB.ToString().PadLeft(7)) MB                    ║" -ForegroundColor White
    Write-Host "║ • Total Memory Usage:    $($Info.TotalMemoryGB.ToString().PadLeft(5)) GB                      ║" -ForegroundColor White
    Write-Host "║ • Memory Usage Percent:  $($Info.MemoryUsagePercent.ToString().PadLeft(5))%                       ║" -ForegroundColor White
    Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    
    # CPU usage
    Write-Host "║ CPU USAGE                                                    ║" -ForegroundColor Yellow
    Write-Host "║ • CPU Usage:             $($Info.CPUUsagePercent.ToString().PadLeft(5))%                       ║" -ForegroundColor White
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    # Performance indicators
    Write-Host ""
    if ($Info.NodeProcessCount -gt 20) {
        Write-Host "⚠️  HIGH NODE.JS PROCESS COUNT - Consider running cleanup" -ForegroundColor Red
    } elseif ($Info.NodeProcessCount -gt 15) {
        Write-Host "⚡ MODERATE NODE.JS PROCESS COUNT - Monitor closely" -ForegroundColor Yellow
    } else {
        Write-Host "✅ NODE.JS PROCESS COUNT - Normal" -ForegroundColor Green
    }
    
    if ($Info.VSCodeProcessCount -gt 15) {
        Write-Host "⚠️  HIGH VS CODE PROCESS COUNT - Consider restarting VS Code" -ForegroundColor Red
    } elseif ($Info.VSCodeProcessCount -gt 10) {
        Write-Host "⚡ MODERATE VS CODE PROCESS COUNT - Monitor closely" -ForegroundColor Yellow
    } else {
        Write-Host "✅ VS CODE PROCESS COUNT - Normal" -ForegroundColor Green
    }
    
    if ($Info.MemoryUsagePercent -gt 85) {
        Write-Host "🔥 HIGH MEMORY USAGE - Cleanup recommended" -ForegroundColor Red
    } elseif ($Info.MemoryUsagePercent -gt 70) {
        Write-Host "⚡ MODERATE MEMORY USAGE - Monitor closely" -ForegroundColor Yellow
    } else {
        Write-Host "✅ MEMORY USAGE - Normal" -ForegroundColor Green
    }
    
    # Show detailed process information if requested
    if ($ShowDetails) {
        Write-Host ""
        Write-Host "═══ DETAILED PROCESS INFORMATION ═══" -ForegroundColor Cyan
        
        if ($Info.NodeProcesses) {
            Write-Host ""
            Write-Host "Node.js Processes:" -ForegroundColor Yellow
            $Info.NodeProcesses | Sort-Object WorkingSet -Descending | Select-Object -First 10 | ForEach-Object {
                $MemMB = [math]::Round($_.WorkingSet/1MB, 2)
                Write-Host "  PID $($_.Id.ToString().PadLeft(5)): ${MemMB} MB" -ForegroundColor White
            }
        }
        
        if ($Info.VSCodeProcesses) {
            Write-Host ""
            Write-Host "VS Code Processes:" -ForegroundColor Yellow
            $Info.VSCodeProcesses | Sort-Object WorkingSet -Descending | Select-Object -First 10 | ForEach-Object {
                $MemMB = [math]::Round($_.WorkingSet/1MB, 2)
                Write-Host "  PID $($_.Id.ToString().PadLeft(5)): ${MemMB} MB" -ForegroundColor White
            }
        }
    }
    
    Write-Host ""
    Write-Host "Press Ctrl+C to stop monitoring | Refresh every $RefreshInterval seconds" -ForegroundColor Gray
    
    # Save to file if requested
    if ($SaveToFile) {
        $LogEntry = "$($Info.Timestamp),Node:$($Info.NodeProcessCount),VSCode:$($Info.VSCodeProcessCount),Total:$($Info.TotalProcessCount),NodeMem:$($Info.NodeMemoryMB),VSCodeMem:$($Info.VSCodeMemoryMB),TotalMem:$($Info.TotalMemoryGB),MemPercent:$($Info.MemoryUsagePercent),CPU:$($Info.CPUUsagePercent)"
        Add-Content -Path $OutputFile -Value $LogEntry
    }
}

# Main monitoring loop
Write-Host "Starting System Resource Monitor..." -ForegroundColor Green
Write-Host "Refresh Interval: $RefreshInterval seconds" -ForegroundColor Gray
if ($SaveToFile) {
    Write-Host "Logging to: $OutputFile" -ForegroundColor Gray
}
Write-Host ""

$StartTime = Get-Date
$IterationCount = 0

try {
    while ($true) {
        $Info = Get-SystemResourceInfo
        Show-SystemInfo -Info $Info
        
        $IterationCount++
        
        # Check if we should stop (if duration is set)
        if ($MonitorDuration -gt 0) {
            $ElapsedSeconds = ((Get-Date) - $StartTime).TotalSeconds
            if ($ElapsedSeconds -ge $MonitorDuration) {
                break
            }
        }
        
        Start-Sleep -Seconds $RefreshInterval
    }
} catch {
    Write-Host ""
    Write-Host "Monitoring stopped." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "System Resource Monitor completed. Total iterations: $IterationCount" -ForegroundColor Green
