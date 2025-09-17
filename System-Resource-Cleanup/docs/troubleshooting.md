# System Resource Cleanup - Troubleshooting Guide

**Version**: 1.0.0  
**Last Updated**: 2025-09-16

## 🔧 **COMMON ISSUES AND SOLUTIONS**

This guide helps you diagnose and resolve common issues when using the System Resource Cleanup tools.

---

## 🚨 **SCRIPT EXECUTION ISSUES**

### **Issue: "Execution Policy" Error**
```
cannot be loaded because running scripts is disabled on this system
```

#### **Cause**
PowerShell execution policy prevents script execution.

#### **Solution**
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run script with bypass (one-time)
PowerShell -ExecutionPolicy Bypass -File ".\scripts\safe-process-cleanup.ps1"
```

#### **Verification**
```powershell
Get-ExecutionPolicy -List
```

---

### **Issue: "Access Denied" or "Permission Denied"**
```
Access to the path 'C:\...' is denied
```

#### **Cause**
Insufficient permissions to terminate processes or modify files.

#### **Solutions**

**For Process Cleanup:**
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → "Run as Administrator"
```

**For File Operations:**
```powershell
# Check file permissions
Get-Acl "path\to\file" | Format-List

# Take ownership if needed (advanced)
takeown /f "path\to\file" /r /d y
```

#### **Prevention**
- Run cleanup scripts as Administrator when needed
- Ensure antivirus isn't blocking script execution
- Close applications that might lock files

---

### **Issue: Scripts Don't Start or Hang**
```
Script appears to start but nothing happens
```

#### **Diagnosis**
```powershell
# Check if script is actually running
Get-Process | Where-Object { $_.ProcessName -eq "powershell" }

# Check for hung processes
Get-Process | Where-Object { $_.Responding -eq $false }
```

#### **Solutions**
1. **Kill hung PowerShell processes**:
   ```powershell
   Stop-Process -Name "powershell" -Force
   ```

2. **Restart with verbose logging**:
   ```powershell
   .\scripts\safe-process-cleanup.ps1 -Verbose
   ```

3. **Check system resources**:
   ```powershell
   Get-Counter "\Memory\Available MBytes"
   Get-Counter "\Processor(_Total)\% Processor Time"
   ```

---

## 🔄 **PROCESS CLEANUP ISSUES**

### **Issue: "No Processes Terminated"**
```
Script runs but doesn't terminate any processes
```

#### **Cause**
All processes are protected by safety checks.

#### **Diagnosis**
```powershell
# Check current process counts
Get-Process -Name "node" | Measure-Object
Get-Process -Name "Code" | Measure-Object

# Run with verbose to see why processes are preserved
.\scripts\safe-process-cleanup.ps1 -Verbose -DryRun
```

#### **Solutions**
1. **Adjust retention settings**:
   ```powershell
   .\scripts\safe-process-cleanup.ps1 -KeepNodeProcesses 3 -KeepVSCodeProcesses 2
   ```

2. **Check for active connections**:
   ```powershell
   netstat -ano | findstr ESTABLISHED
   ```

3. **Manual process review**:
   ```powershell
   Get-Process -Name "node" | Select-Object Id, WorkingSet, StartTime | Sort-Object WorkingSet
   ```

---

### **Issue: Important Process Terminated**
```
Development server or important process was terminated
```

#### **Immediate Recovery**
1. **Restart the terminated process**:
   ```powershell
   # Navigate to project directory
   cd "path\to\project"
   
   # Restart development server
   npm start
   # or
   ng serve
   # or
   node server.js
   ```

2. **Check process status**:
   ```powershell
   .\scripts\system-monitor.ps1
   ```

#### **Prevention**
1. **Use more conservative settings**:
   ```powershell
   .\scripts\safe-process-cleanup.ps1 -KeepNodeProcesses 8 -KeepVSCodeProcesses 5
   ```

2. **Modify configuration**:
   Edit `config/cleanup-config.json`:
   ```json
   {
     "processCleanup": {
       "nodeJs": {
         "keepLargestProcesses": 8,
         "blacklistedPorts": [3000, 8080, 5000, 9000, 4200]
       }
     }
   }
   ```

---

## 💻 **VS CODE OPTIMIZATION ISSUES**

### **Issue: VS Code Won't Start After Optimization**
```
VS Code fails to launch or crashes on startup
```

#### **Immediate Recovery**
1. **Restore from backup**:
   ```powershell
   .\scripts\apply-vscode-optimizations.ps1 -RestoreFromBackup -BackupPath "backups\vscode-YYYY-MM-DD_HH-mm-ss"
   ```

2. **Reset to defaults**:
   ```powershell
   # Backup current settings first
   Copy-Item "$env:USERPROFILE\AppData\Roaming\Code\User\settings.json" "settings-backup.json"
   
   # Delete settings to reset to defaults
   Remove-Item "$env:USERPROFILE\AppData\Roaming\Code\User\settings.json"
   ```

#### **Diagnosis**
```powershell
# Check VS Code process status
Get-Process -Name "Code" -ErrorAction SilentlyContinue

# Check for error logs
Get-Content "$env:USERPROFILE\AppData\Roaming\Code\logs\*\main.log" -Tail 20
```

---

### **Issue: Extensions Not Working**
```
VS Code extensions disabled or not functioning
```

#### **Solutions**
1. **Re-enable extensions**:
   - Open VS Code
   - Press `Ctrl+Shift+X`
   - Enable disabled extensions

2. **Reset extension settings**:
   ```json
   {
     "extensions.autoUpdate": true,
     "extensions.autoCheckUpdates": true,
     "extensions.ignoreRecommendations": false
   }
   ```

3. **Reinstall problematic extensions**:
   - Uninstall extension
   - Restart VS Code
   - Reinstall extension

---

### **Issue: Performance Worse After Optimization**
```
VS Code slower or less responsive after applying optimizations
```

#### **Diagnosis**
```powershell
# Check VS Code memory usage
Get-Process -Name "Code" | Select-Object Id, WorkingSet, CPU | Sort-Object WorkingSet -Descending

# Monitor system resources
.\scripts\system-monitor.ps1 -ShowDetails
```

#### **Solutions**
1. **Selective optimization**:
   Edit `config/vscode-settings.json` to re-enable specific features:
   ```json
   {
     "editor.quickSuggestions": {
       "other": true,
       "comments": false,
       "strings": false
     },
     "editor.minimap.enabled": true
   }
   ```

2. **Gradual rollback**:
   ```powershell
   # Restore original settings
   .\scripts\apply-vscode-optimizations.ps1 -RestoreFromBackup -BackupPath "path\to\backup"
   
   # Apply optimizations selectively
   # Edit config/vscode-settings.json to enable only specific optimizations
   .\scripts\apply-vscode-optimizations.ps1
   ```

---

## 📊 **MONITORING AND LOGGING ISSUES**

### **Issue: System Monitor Not Updating**
```
Monitor shows same data or stops refreshing
```

#### **Solutions**
1. **Restart monitor**:
   ```powershell
   # Press Ctrl+C to stop
   # Restart with different interval
   .\scripts\system-monitor.ps1 -RefreshInterval 15
   ```

2. **Check system performance**:
   ```powershell
   # Verify system isn't overloaded
   Get-Counter "\Processor(_Total)\% Processor Time"
   Get-Counter "\Memory\Available MBytes"
   ```

---

### **Issue: Log Files Too Large or Missing**
```
Log files consuming too much space or not being created
```

#### **Solutions**
1. **Rotate log files**:
   ```powershell
   # Archive old logs
   $LogDir = "logs"
   $ArchiveDir = "logs\archive\$(Get-Date -Format 'yyyy-MM')"
   New-Item -ItemType Directory -Path $ArchiveDir -Force
   Move-Item "$LogDir\*.log" $ArchiveDir
   ```

2. **Check log permissions**:
   ```powershell
   # Verify write permissions
   Test-Path "logs" -PathType Container
   New-Item -ItemType File -Path "logs\test.log" -Force
   Remove-Item "logs\test.log"
   ```

---

## 🔧 **SCHEDULED TASK ISSUES**

### **Issue: Scheduled Tasks Not Running**
```
Tasks created but don't execute on schedule
```

#### **Diagnosis**
```powershell
# Check task status
Get-ScheduledTask | Where-Object { $_.TaskName -like "SystemResourceCleanup*" }

# Check task history
Get-ScheduledTaskInfo -TaskName "SystemResourceCleanup-SafeCleanup"
```

#### **Solutions**
1. **Verify task configuration**:
   ```powershell
   # List tasks with details
   .\scripts\schedule-cleanup.ps1 -ListTasks
   ```

2. **Check system requirements**:
   - User must be logged in (for Interactive tasks)
   - System must be awake at scheduled time
   - PowerShell execution policy allows scripts

3. **Recreate tasks**:
   ```powershell
   # Remove and recreate tasks
   .\scripts\schedule-cleanup.ps1 -RemoveTasks
   .\scripts\schedule-cleanup.ps1 -CreateTasks
   ```

---

## 🔍 **DIAGNOSTIC COMMANDS**

### **System Health Check**
```powershell
# Complete system overview
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory

# Process overview
Get-Process | Group-Object ProcessName | Sort-Object Count -Descending | Select-Object -First 10

# Memory usage
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10 ProcessName, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet/1MB,2)}}

# Disk space
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size/1GB,2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}}
```

### **PowerShell Environment**
```powershell
# PowerShell version
$PSVersionTable

# Execution policy
Get-ExecutionPolicy -List

# Module availability
Get-Module -ListAvailable | Where-Object { $_.Name -like "*ScheduledTasks*" }
```

### **Network and Process Analysis**
```powershell
# Active network connections
netstat -ano | findstr LISTENING

# Process tree
Get-WmiObject Win32_Process | Select-Object ProcessId, ParentProcessId, Name | Sort-Object ParentProcessId

# Resource usage over time
Get-Counter "\Processor(_Total)\% Processor Time", "\Memory\Available MBytes" -SampleInterval 5 -MaxSamples 12
```

---

## 📋 **TROUBLESHOOTING CHECKLIST**

When experiencing issues:

### **Initial Diagnosis**
- [ ] Check PowerShell execution policy
- [ ] Verify administrator privileges (if needed)
- [ ] Review recent log files
- [ ] Check available disk space
- [ ] Verify system isn't overloaded

### **Script-Specific Issues**
- [ ] Run with `-DryRun` to preview actions
- [ ] Use `-Verbose` for detailed output
- [ ] Check configuration files for errors
- [ ] Verify all required files are present

### **Recovery Actions**
- [ ] Stop all running cleanup scripts
- [ ] Restore from backups if available
- [ ] Restart affected applications
- [ ] Review and adjust configuration
- [ ] Test with minimal settings

---

## 📞 **GETTING ADDITIONAL HELP**

### **Information to Collect**
When seeking help, gather:
1. **PowerShell version**: `$PSVersionTable.PSVersion`
2. **Windows version**: `Get-ComputerInfo | Select WindowsProductName, WindowsVersion`
3. **Error messages**: From console and log files
4. **System state**: Output from system monitor
5. **Configuration**: Contents of `config/cleanup-config.json`

### **Log File Locations**
- **Cleanup History**: `logs/cleanup-history.log`
- **System Monitor**: `logs/system-monitor.log`
- **VS Code Optimization**: `logs/vscode-optimization.log`
- **Scheduler**: `logs/scheduler.log`

### **Safe Mode Recovery**
If all else fails:
1. **Restart system** in safe mode
2. **Restore from system restore point**
3. **Reset VS Code** by deleting user settings
4. **Reinstall PowerShell modules** if corrupted

---

**🔧 REMEMBER**: Most issues can be resolved by running scripts with `-DryRun` first, checking log files, and using the backup/restore functionality. When in doubt, prioritize system stability over optimization.
