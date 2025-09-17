# System Resource Cleanup - Usage Guide

**Version**: 1.0.0  
**Last Updated**: 2025-09-16

## 🎯 **OVERVIEW**

This guide provides detailed instructions for using the System Resource Cleanup tools to optimize your development environment performance.

---

## 🚀 **QUICK START**

### **Immediate Performance Issues**
When your system becomes sluggish due to excessive processes:

```powershell
# Navigate to the project directory
cd "System-Resource-Cleanup"

# Run safe cleanup (conservative approach)
.\scripts\safe-process-cleanup.ps1

# Monitor the results
.\scripts\system-monitor.ps1
```

### **Weekly Maintenance**
For regular system optimization:

```powershell
# Run comprehensive cleanup
.\scripts\comprehensive-cleanup.ps1

# Apply VS Code optimizations
.\scripts\apply-vscode-optimizations.ps1
```

---

## 📋 **DETAILED SCRIPT USAGE**

### **1. Safe Process Cleanup**
**File**: `scripts/safe-process-cleanup.ps1`  
**Purpose**: Conservative cleanup of redundant Node.js and VS Code processes

#### **Basic Usage**
```powershell
# Standard cleanup
.\scripts\safe-process-cleanup.ps1

# Preview what would be cleaned (no changes made)
.\scripts\safe-process-cleanup.ps1 -DryRun

# Verbose output with detailed logging
.\scripts\safe-process-cleanup.ps1 -Verbose

# Custom process retention
.\scripts\safe-process-cleanup.ps1 -KeepNodeProcesses 3 -KeepVSCodeProcesses 2
```

#### **Parameters**
- `-DryRun`: Preview mode - shows what would be cleaned without making changes
- `-Verbose`: Detailed output and logging
- `-KeepNodeProcesses`: Number of largest Node.js processes to preserve (default: 5)
- `-KeepVSCodeProcesses`: Number of largest VS Code processes to preserve (default: 3)

#### **Safety Features**
- ✅ Preserves processes with active network connections
- ✅ Protects parent processes with child processes
- ✅ Conservative approach - errs on side of keeping processes
- ✅ Detailed logging of all actions

---

### **2. System Monitor**
**File**: `scripts/system-monitor.ps1`  
**Purpose**: Real-time monitoring of system resources and process counts

#### **Basic Usage**
```powershell
# Start monitoring (Ctrl+C to stop)
.\scripts\system-monitor.ps1

# Monitor with detailed process information
.\scripts\system-monitor.ps1 -ShowDetails

# Save monitoring data to file
.\scripts\system-monitor.ps1 -SaveToFile

# Custom refresh interval (default: 30 seconds)
.\scripts\system-monitor.ps1 -RefreshInterval 15
```

#### **Parameters**
- `-RefreshInterval`: Seconds between updates (default: 30)
- `-SaveToFile`: Save monitoring data to log file
- `-OutputFile`: Custom log file path
- `-ShowDetails`: Show detailed process information

#### **Monitoring Dashboard**
The monitor displays:
- **Process Counts**: Node.js, VS Code, and total system processes
- **Memory Usage**: Per-category and total system memory
- **CPU Usage**: Current CPU utilization
- **Performance Indicators**: Color-coded alerts for high resource usage

---

### **3. Comprehensive Cleanup**
**File**: `scripts/comprehensive-cleanup.ps1`  
**Purpose**: Full system optimization including processes, temp files, and configurations

#### **Basic Usage**
```powershell
# Full cleanup with all features
.\scripts\comprehensive-cleanup.ps1

# Preview comprehensive cleanup
.\scripts\comprehensive-cleanup.ps1 -DryRun

# Cleanup without temporary files
.\scripts\comprehensive-cleanup.ps1 -IncludeTempFiles:$false

# Skip VS Code optimization
.\scripts\comprehensive-cleanup.ps1 -OptimizeVSCode:$false
```

#### **Parameters**
- `-DryRun`: Preview mode
- `-IncludeTempFiles`: Clean temporary files (default: true)
- `-OptimizeVSCode`: Apply VS Code optimizations (default: true)
- `-CreateBackup`: Create configuration backups (default: true)
- `-Verbose`: Detailed logging

#### **Cleanup Phases**
1. **Process Cleanup**: Redundant Node.js and VS Code processes
2. **Temporary Files**: Old cache and log files
3. **VS Code Optimization**: Performance settings and cache cleanup
4. **Registry Cleanup**: Safe system registry operations
5. **Final Analysis**: Performance impact reporting

---

### **4. VS Code Optimization**
**File**: `scripts/apply-vscode-optimizations.ps1`  
**Purpose**: Apply performance optimizations to VS Code configuration

#### **Basic Usage**
```powershell
# Apply optimizations with backup
.\scripts\apply-vscode-optimizations.ps1

# Preview optimizations
.\scripts\apply-vscode-optimizations.ps1 -DryRun

# Apply without creating backup
.\scripts\apply-vscode-optimizations.ps1 -CreateBackup:$false

# Restore from previous backup
.\scripts\apply-vscode-optimizations.ps1 -RestoreFromBackup -BackupPath "backups\vscode-2025-09-16_14-30-00"
```

#### **Parameters**
- `-DryRun`: Preview mode
- `-CreateBackup`: Create backup before changes (default: true)
- `-RestoreFromBackup`: Restore from backup
- `-BackupPath`: Path to backup directory for restoration
- `-Verbose`: Detailed logging

#### **Optimizations Applied**
- **Extension Management**: Disable auto-updates and recommendations
- **TypeScript Performance**: Reduce language server overhead
- **File Watching**: Optimize file system monitoring
- **Search Performance**: Exclude unnecessary directories
- **Memory Usage**: Disable resource-intensive features
- **Cache Cleanup**: Remove old logs and workspace storage

---

### **5. Task Scheduler**
**File**: `scripts/schedule-cleanup.ps1`  
**Purpose**: Create automated cleanup schedules

#### **Basic Usage**
```powershell
# Create all scheduled tasks (requires admin)
.\scripts\schedule-cleanup.ps1 -CreateTasks

# List existing cleanup tasks
.\scripts\schedule-cleanup.ps1 -ListTasks

# Remove all cleanup tasks (requires admin)
.\scripts\schedule-cleanup.ps1 -RemoveTasks

# Preview task creation
.\scripts\schedule-cleanup.ps1 -CreateTasks -DryRun
```

#### **Scheduled Tasks Created**
- **Safe Cleanup**: Weekly on Sunday at 2:00 AM
- **Comprehensive Cleanup**: Monthly (every 4 weeks) at 3:00 AM
- **VS Code Optimization**: Monthly (every 4 weeks) at 3:30 AM

---

## ⚙️ **CONFIGURATION**

### **Configuration File**
**File**: `config/cleanup-config.json`

Customize cleanup behavior by modifying the configuration file:

```json
{
  "processCleanup": {
    "nodeJs": {
      "keepLargestProcesses": 5,
      "minimumMemoryThresholdMB": 30
    },
    "vsCode": {
      "keepLargestProcesses": 3,
      "minimumMemoryThresholdMB": 50
    }
  }
}
```

### **VS Code Settings**
**File**: `config/vscode-settings.json`

Performance-optimized VS Code settings that can be applied automatically or manually.

---

## 📊 **PERFORMANCE EXPECTATIONS**

### **Typical Results**
- **Node.js processes**: 25-40% reduction
- **VS Code processes**: 30-50% reduction
- **Memory freed**: 500MB - 2GB
- **Disk space freed**: 100MB - 1GB
- **System responsiveness**: Significant improvement

### **Performance Indicators**
The system monitor provides color-coded alerts:
- 🟢 **Green**: Normal resource usage
- 🟡 **Yellow**: Moderate usage - monitor closely
- 🔴 **Red**: High usage - cleanup recommended

---

## 🔄 **WORKFLOW RECOMMENDATIONS**

### **Daily Development**
1. **Morning**: Check system monitor for overnight process accumulation
2. **During Development**: Monitor process counts when starting new projects
3. **End of Day**: Run safe cleanup if system feels sluggish

### **Weekly Maintenance**
1. **Run comprehensive cleanup** on weekends
2. **Review cleanup logs** for any issues
3. **Update configuration** based on usage patterns

### **Monthly Optimization**
1. **Apply VS Code optimizations** with fresh backup
2. **Review scheduled task performance**
3. **Clean up old backups and logs**

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **"Access Denied" Errors**
- **Cause**: Insufficient permissions
- **Solution**: Run PowerShell as Administrator

#### **Process Still Running After Cleanup**
- **Cause**: Process has active connections or child processes
- **Solution**: This is expected behavior - the script preserves active processes

#### **VS Code Settings Not Applied**
- **Cause**: VS Code was running during optimization
- **Solution**: Restart VS Code after applying optimizations

#### **Scheduled Tasks Not Running**
- **Cause**: User not logged in or system sleeping
- **Solution**: Configure tasks to wake system or run when user logs in

### **Log Files**
Check these log files for detailed troubleshooting information:
- `logs/cleanup-history.log`: Process cleanup details
- `logs/system-monitor.log`: System monitoring data
- `logs/vscode-optimization.log`: VS Code optimization results
- `logs/scheduler.log`: Scheduled task execution

---

## 📞 **SUPPORT**

### **Getting Help**
1. **Check logs** in the `logs/` directory
2. **Review configuration** in `config/cleanup-config.json`
3. **Run with `-Verbose`** flag for detailed output
4. **Use `-DryRun`** to preview changes safely

### **Reporting Issues**
When reporting issues, include:
- PowerShell version: `$PSVersionTable.PSVersion`
- Windows version: `Get-ComputerInfo | Select WindowsProductName, WindowsVersion`
- Error messages from log files
- System resource information from monitor

---

## 🔗 **RELATED DOCUMENTATION**

- **[Safety Guidelines](safety-guidelines.md)**: Essential safety practices and precautions
- **[Troubleshooting Guide](troubleshooting.md)**: Common issues and solutions
- **[Performance Analysis](performance-analysis.md)**: Understanding system performance metrics

---

**⚠️ IMPORTANT**: Always test scripts with `-DryRun` parameter before running in production environments. While designed to be safe, system cleanup operations should be performed with caution.
