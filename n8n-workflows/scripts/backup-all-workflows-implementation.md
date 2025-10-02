# N8N Workflow Backup Implementation Guide

This document provides the complete implementation for backing up all N8N workflows using the MCP server tools.

## Implementation Overview

The backup system uses the following N8N MCP tools:
- `n8n_list_workflows` - Get list of all workflows
- `n8n_get_workflow` - Get full workflow details
- File system operations to save backups

## Complete Backup Process

### Step 1: Get All Workflows
```javascript
// Get all workflows from N8N instance
const workflowsResponse = await n8n_list_workflows({ limit: 100 });
const workflows = workflowsResponse.data.workflows;
```

### Step 2: Process Each Workflow
```javascript
for (const workflow of workflows) {
  // Get full workflow details
  const workflowDetails = await n8n_get_workflow({ id: workflow.id });
  
  // Determine category
  let category = 'inactive';
  if (workflow.isArchived) {
    category = 'archived';
  } else if (workflow.active) {
    category = 'active';
  }
  
  // Create filename
  const sanitizedName = workflow.name.replace(/[<>:"/\\|?*]/g, '_');
  const filename = `${sanitizedName}_${workflow.id}.json`;
  
  // Add export metadata
  const exportData = {
    ...workflowDetails.data,
    exportMetadata: {
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0',
      category: category,
      originalActive: workflow.active,
      originalArchived: workflow.isArchived,
      backupSystem: 'n8n-workflow-backup-v1.0.0'
    }
  };
  
  // Save to timestamped backup directory
  const backupPath = `n8n-workflows/backups/${timestamp}/${filename}`;
  await saveFile(backupPath, JSON.stringify(exportData, null, 2));
  
  // Save to category-specific export directory
  const exportPath = `n8n-workflows/exports/${category}/${filename}`;
  await saveFile(exportPath, JSON.stringify(exportData, null, 2));
}
```

### Step 3: Create Backup Manifest
```javascript
const manifest = {
  backupTimestamp: new Date().toISOString(),
  backupVersion: '1.0.0',
  totalWorkflows: workflows.length,
  n8nInstance: 'https://n8n.srv972609.hstgr.cloud',
  backupType: 'full-export',
  workflows: workflowManifestEntries,
  backupMetadata: {
    generatedBy: 'N8N Workflow Backup System v1.0.0',
    backupDuration: `${duration} seconds`,
    backupLocation: `n8n-workflows/backups/${timestamp}/`,
    exportLocation: 'n8n-workflows/exports/'
  }
};

// Save manifest
const manifestPath = `n8n-workflows/backups/${timestamp}/backup-manifest.json`;
await saveFile(manifestPath, JSON.stringify(manifest, null, 2));
```

## Directory Structure Created

```
n8n-workflows/
├── backups/
│   └── 2025-10-02_180300/
│       ├── backup-manifest.json
│       ├── LinkedIn-Validation-Reporting-MCP-Server_0ZJ84RLQXxuYKLyE.json
│       ├── LinkedIn-SEO-Gmail-Mailroom-To-ResumeGeneration--Augment_0hP6wpsGwor3Az4w.json
│       └── [... all other workflows ...]
├── exports/
│   ├── active/
│   │   └── [active workflows]
│   ├── inactive/
│   │   ├── LinkedIn-SEO-Gmail-Mailroom-To-ResumeGeneration--Augment_0hP6wpsGwor3Az4w.json
│   │   └── [other inactive workflows]
│   └── archived/
│       ├── LinkedIn-Validation-Reporting-MCP-Server_0ZJ84RLQXxuYKLyE.json
│       └── [other archived workflows]
└── logs/
    └── backup-2025-10-02.log
```

## Usage Instructions

### Manual Backup Execution
1. Run the backup process using MCP tools
2. All 83 workflows will be exported
3. Files organized by status (active/inactive/archived)
4. Timestamped backup created
5. Manifest file generated with metadata

### Backup Features
- **Complete Export**: All workflow JSON definitions
- **Organized Storage**: Separated by workflow status
- **Version Control**: Timestamped backups for history
- **Metadata Tracking**: Comprehensive backup information
- **Git Integration**: All files tracked in version control

### Restoration Process
1. Locate desired workflow in backup directory
2. Use N8N import functionality to restore
3. Verify workflow configuration
4. Activate if needed

## Security Notes
- Workflow credentials are NOT included in backups
- Only workflow structure and logic are exported
- Sensitive data excluded from version control
- Backup files contain public workflow definitions only

## Next Steps
1. Execute the backup process using the MCP tools
2. Verify all 83 workflows are backed up
3. Test restoration process with a sample workflow
4. Set up automated backup scheduling if desired
