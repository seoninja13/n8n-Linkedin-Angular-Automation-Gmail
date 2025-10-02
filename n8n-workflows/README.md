# N8N Workflow Backup System

This directory contains automated backup and version control for all N8N workflows in the LinkedIn-Angular-Automation-Gmail project.

## Directory Structure

```
n8n-workflows/
├── README.md                    # This file
├── backups/                     # Timestamped workflow backups
│   ├── YYYY-MM-DD_HHmmss/      # Daily backup folders
│   │   ├── workflow-name.json   # Individual workflow files
│   │   └── backup-manifest.json # Backup metadata
├── exports/                     # Latest workflow exports
│   ├── active/                  # Currently active workflows
│   ├── inactive/                # Inactive workflows
│   └── archived/                # Archived workflows
├── scripts/                     # Backup automation scripts
│   ├── backup-all-workflows.js  # Main backup script
│   ├── restore-workflow.js      # Workflow restoration script
│   └── compare-versions.js      # Version comparison utility
└── logs/                        # Backup operation logs
    └── backup-YYYY-MM-DD.log    # Daily backup logs
```

## Quick Start

### Create a Full Backup
```bash
node n8n-workflows/scripts/backup-all-workflows.js
```

### Restore a Workflow
```bash
node n8n-workflows/scripts/restore-workflow.js --workflow-id "abc123" --backup-date "2025-01-02"
```

### Compare Workflow Versions
```bash
node n8n-workflows/scripts/compare-versions.js --workflow-id "abc123" --date1 "2025-01-01" --date2 "2025-01-02"
```

## Features

- **Automated Export**: Exports all workflows with proper naming conventions
- **Timestamped Versions**: Each backup includes timestamp for version tracking
- **Organized Storage**: Separates active, inactive, and archived workflows
- **Metadata Tracking**: Includes workflow metadata and backup manifests
- **Git Integration**: All backups are stored in Git for version control
- **On-Demand Execution**: Run backups manually whenever needed
- **Restoration Support**: Easy workflow restoration from backup files

## Backup Naming Convention

- **Backup Folders**: `YYYY-MM-DD_HHmmss` (e.g., `2025-01-02_143022`)
- **Workflow Files**: `{workflow-name}_{workflow-id}.json`
- **Manifest Files**: `backup-manifest.json` (contains backup metadata)

## Workflow Categories

- **Active**: Currently running workflows (`active: true`)
- **Inactive**: Stopped workflows (`active: false, isArchived: false`)
- **Archived**: Archived workflows (`isArchived: true`)

## Integration with Git

All backup files are automatically included in Git version control:
- Backup files are tracked for complete history
- `.gitignore` excludes temporary files and logs
- Commit messages include backup timestamps and workflow counts

## Automation Options

### Manual Execution (Current)
Run backup script manually when needed

### Scheduled Automation (Future)
- Daily automated backups via cron job
- Pre-deployment backups via CI/CD hooks
- Webhook-triggered backups on workflow changes

## Security Notes

- Workflow credentials are NOT included in backups for security
- Sensitive data is excluded from version control
- Backup files contain workflow structure and logic only
