#!/usr/bin/env node

/**
 * N8N Workflow Backup System
 * Exports all workflows from N8N instance with proper versioning and organization
 * 
 * Usage: node backup-all-workflows.js [--dry-run] [--verbose]
 * 
 * Features:
 * - Exports all workflows with timestamps
 * - Organizes by active/inactive/archived status
 * - Creates backup manifest with metadata
 * - Supports dry-run mode for testing
 * - Comprehensive logging
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  baseDir: path.join(__dirname, '..'),
  backupDir: path.join(__dirname, '..', 'backups'),
  exportDir: path.join(__dirname, '..', 'exports'),
  logsDir: path.join(__dirname, '..', 'logs'),
  timestamp: new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5), // YYYY-MM-DDTHH-mm-ss
  dateOnly: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isVerbose = args.includes('--verbose') || args.includes('-v');

// Logging utility
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  return logMessage;
}

function verbose(message) {
  if (isVerbose) {
    log(message, 'VERBOSE');
  }
}

// Create directory structure
async function createDirectories() {
  const dirs = [
    CONFIG.backupDir,
    CONFIG.exportDir,
    CONFIG.logsDir,
    path.join(CONFIG.exportDir, 'active'),
    path.join(CONFIG.exportDir, 'inactive'),
    path.join(CONFIG.exportDir, 'archived'),
    path.join(CONFIG.backupDir, CONFIG.timestamp)
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      verbose(`Created directory: ${dir}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

// Sanitize filename for safe file system storage
function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .trim();
}

// Mock N8N MCP functions for this script
// In actual implementation, these would use the MCP server
async function mockListWorkflows() {
  // This would be replaced with actual MCP call
  // For now, return empty array - the actual implementation will use MCP
  log('⚠️  Mock function - replace with actual MCP call to n8n_list_workflows');
  return { success: true, data: { workflows: [], total: 0 } };
}

async function mockGetWorkflow(workflowId) {
  // This would be replaced with actual MCP call
  // For now, return empty workflow - the actual implementation will use MCP
  log(`⚠️  Mock function - replace with actual MCP call to n8n_get_workflow for ${workflowId}`);
  return { success: true, data: { id: workflowId, name: 'Mock Workflow', nodes: [], connections: {} } };
}

// Main backup function
async function backupAllWorkflows() {
  const startTime = Date.now();
  const logMessages = [];
  
  try {
    log('🚀 Starting N8N Workflow Backup Process');
    log(`📁 Backup Directory: ${path.join(CONFIG.backupDir, CONFIG.timestamp)}`);
    log(`🔧 Mode: ${isDryRun ? 'DRY RUN' : 'LIVE BACKUP'}`);
    
    // Create directory structure
    await createDirectories();
    
    // Get all workflows
    log('📋 Fetching workflow list from N8N...');
    const workflowsResponse = await mockListWorkflows();
    
    if (!workflowsResponse.success) {
      throw new Error('Failed to fetch workflows from N8N');
    }
    
    const workflows = workflowsResponse.data.workflows;
    log(`✅ Found ${workflows.length} workflows to backup`);
    
    // Initialize counters and manifest
    const stats = {
      total: workflows.length,
      active: 0,
      inactive: 0,
      archived: 0,
      successful: 0,
      failed: 0
    };
    
    const manifest = {
      backupTimestamp: new Date().toISOString(),
      backupVersion: '1.0.0',
      totalWorkflows: workflows.length,
      n8nInstance: 'https://n8n.srv972609.hstgr.cloud',
      backupType: 'full-export',
      workflows: []
    };
    
    // Process each workflow
    for (const workflow of workflows) {
      try {
        verbose(`Processing workflow: ${workflow.name} (${workflow.id})`);
        
        // Categorize workflow
        let category = 'inactive';
        if (workflow.isArchived) {
          category = 'archived';
          stats.archived++;
        } else if (workflow.active) {
          category = 'active';
          stats.active++;
        } else {
          stats.inactive++;
        }
        
        // Get full workflow details
        const workflowDetails = await mockGetWorkflow(workflow.id);
        
        if (!workflowDetails.success) {
          throw new Error(`Failed to fetch details for workflow ${workflow.id}`);
        }
        
        // Prepare filename
        const sanitizedName = sanitizeFilename(workflow.name);
        const filename = `${sanitizedName}_${workflow.id}.json`;
        
        // Prepare workflow data for export
        const exportData = {
          ...workflowDetails.data,
          exportMetadata: {
            exportedAt: new Date().toISOString(),
            exportVersion: '1.0.0',
            category: category,
            originalActive: workflow.active,
            originalArchived: workflow.isArchived
          }
        };
        
        if (!isDryRun) {
          // Save to timestamped backup directory
          const backupPath = path.join(CONFIG.backupDir, CONFIG.timestamp, filename);
          await fs.writeFile(backupPath, JSON.stringify(exportData, null, 2));
          
          // Save to category-specific export directory
          const exportPath = path.join(CONFIG.exportDir, category, filename);
          await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));
        }
        
        // Add to manifest
        manifest.workflows.push({
          id: workflow.id,
          name: workflow.name,
          filename: filename,
          category: category,
          active: workflow.active,
          archived: workflow.isArchived,
          nodeCount: workflowDetails.data.nodes?.length || 0,
          lastUpdated: workflow.updatedAt,
          tags: workflow.tags?.map(tag => tag.name) || []
        });
        
        stats.successful++;
        verbose(`✅ Backed up: ${workflow.name}`);
        
      } catch (error) {
        stats.failed++;
        const errorMsg = `❌ Failed to backup workflow ${workflow.name} (${workflow.id}): ${error.message}`;
        log(errorMsg, 'ERROR');
        logMessages.push(errorMsg);
      }
    }
    
    // Save manifest
    if (!isDryRun) {
      const manifestPath = path.join(CONFIG.backupDir, CONFIG.timestamp, 'backup-manifest.json');
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
      
      // Also save latest manifest in exports directory
      const latestManifestPath = path.join(CONFIG.exportDir, 'latest-backup-manifest.json');
      await fs.writeFile(latestManifestPath, JSON.stringify(manifest, null, 2));
    }
    
    // Generate summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const summary = [
      '🎉 Backup Process Complete!',
      `⏱️  Duration: ${duration} seconds`,
      `📊 Total Workflows: ${stats.total}`,
      `✅ Successful: ${stats.successful}`,
      `❌ Failed: ${stats.failed}`,
      `🟢 Active: ${stats.active}`,
      `⚪ Inactive: ${stats.inactive}`,
      `📦 Archived: ${stats.archived}`,
      `💾 Backup Location: ${path.join(CONFIG.backupDir, CONFIG.timestamp)}`,
      isDryRun ? '🧪 DRY RUN - No files were actually saved' : '💾 Files saved successfully'
    ];
    
    summary.forEach(line => log(line));
    
    // Save log file
    if (!isDryRun) {
      const logPath = path.join(CONFIG.logsDir, `backup-${CONFIG.dateOnly}.log`);
      const logContent = logMessages.join('\n') + '\n' + summary.join('\n');
      await fs.writeFile(logPath, logContent);
    }
    
    return {
      success: true,
      stats,
      manifest,
      duration: parseFloat(duration)
    };
    
  } catch (error) {
    const errorMsg = `💥 Backup process failed: ${error.message}`;
    log(errorMsg, 'ERROR');
    throw error;
  }
}

// Run the backup if this script is executed directly
if (require.main === module) {
  backupAllWorkflows()
    .then(result => {
      log('🏁 Backup script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      log(`💥 Backup script failed: ${error.message}`, 'ERROR');
      process.exit(1);
    });
}

module.exports = { backupAllWorkflows, CONFIG };
