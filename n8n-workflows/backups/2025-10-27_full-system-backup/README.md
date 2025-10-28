# Full N8N Workflow System Backup

**Backup Date**: 2025-10-27  
**Backup Time**: 01:43:00 UTC  
**Backup Type**: Complete System Backup (All 83 Workflows)

---

## Backup Summary

This is a comprehensive backup of all N8N workflows in the system, created to bring the backup system up to date after the last backup on 2025-10-02 (24 days ago).

### Workflow Count
- **Total Workflows**: 83
- **Active Workflows**: 2
- **Inactive Workflows**: 54
- **Archived Workflows**: 27

---

## Backup Structure

```
2025-10-27_full-system-backup/
├── README.md (this file)
├── backup-manifest.json (metadata for all workflows)
├── active/ (2 workflows)
├── inactive/ (54 workflows)
└── archived/ (27 workflows)
```

---

## Recent Changes

### Resume Generation Workshop Fix (Applied Before This Backup)
- **Workflow**: LinkedIn-SEO-Gmail-sub-flow-Workshop-ResumeGeneration--Augment
- **Workflow ID**: zTtSVmTg3UaV9tPG
- **Fix Applied**: 2025-10-27T01:42:54.189Z
- **Change**: Updated AI Resume Customization node prompt to correctly reference Google Docs content field
- **Pre-Fix Backup**: Available in `2025-10-26_CRITICAL-BACKUP/` directory
- **Pre-Fix Version ID**: 2d1dbdc7-ab29-41f4-83d6-de40c1cdecc8
- **Post-Fix Version ID**: 92573b62-1ec1-434d-9e24-75cd4cbca3cf

---

## Backup Progress

Backup started: 2025-10-27T01:43:00.000Z

**Status**: IN PROGRESS

Progress will be updated as workflows are backed up...

---

## Restoration Procedures

### Restore Single Workflow
1. Locate the workflow JSON file in the appropriate directory (active/inactive/archived)
2. Use N8N UI: Workflows → Import from File → Select JSON file
3. Or use N8N MCP tools: `n8n_create_workflow` or `n8n_update_full_workflow`

### Restore All Workflows
1. Use the backup manifest to identify all workflow IDs
2. Import each workflow JSON file individually
3. Verify workflow connections and credentials after import

---

## Backup Integrity

- **Backup Method**: N8N MCP Server Tools (`n8n_get_workflow`)
- **Data Included**: Complete workflow configuration (nodes, connections, settings, metadata)
- **Credentials**: Credential IDs included (credentials themselves NOT backed up for security)
- **Static Data**: Included if present
- **Pinned Data**: Included if present

---

## Notes

- This backup was created as part of implementing a comprehensive N8N workflow backup system
- Previous backup: 2025-10-02 (24 days old)
- Backup frequency: Daily automated backups will be implemented after this initial backup
- Backup retention: Keep last 30 days of daily backups, plus monthly archives

---

## Contact Information

**Backup Created By**: Augment Agent  
**User**: Ivo Dachev (dachevivo@gmail.com)  
**Project**: LinkedIn-Angular-Automation-Gmail  
**Repository**: n8n-Linkedin-Angular-Automation-Gmail

