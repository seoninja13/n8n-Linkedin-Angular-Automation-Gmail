# N8N Workflow Backup System
**AI-Assisted Manual Backup Solution Using MCP Tools**

**Last Updated**: 2025-10-27

---

## 📋 Overview

This is a **manual, on-demand backup solution** for all N8N workflows in the LinkedIn automation project. Backups are performed by the AI agent using N8N MCP server tools exclusively (no REST API calls or PowerShell scripts).

**Key Features**:
- ✅ Uses N8N MCP server tools exclusively (follows MCP-only constraint)
- ✅ Retrieves all 83 workflows in full detail
- ✅ Saves to timestamped backup directories
- ✅ Generates backup index, summary, and log files
- ✅ Supports full, incremental, active-only, and selective backups
- ✅ Handles errors gracefully (continues on individual workflow failures)
- ✅ Displays progress indicators during execution

---

## 🚀 How to Request a Backup

Simply ask the AI agent to run a backup using one of the templates below. The AI agent will:
1. Retrieve all workflows using N8N MCP tools
2. Save each workflow to individual JSON files
3. Generate backup index, summary, and log files
4. Report completion status and any errors

---

## 📝 Backup Request Templates

### **Full Backup** (All 83 Workflows)
```
Run a full N8N workflow backup
```

**What It Does**:
- Retrieves all 83 workflows (active and inactive)
- Saves to `Docs/backups/workflows/YYYY-MM-DD/`
- Generates complete backup index and summary
- Estimated time: 10-15 minutes

---

### **Incremental Backup** (Only Modified Workflows)
```
Run an incremental N8N workflow backup (only modified since 2025-10-27)
```

**What It Does**:
- Retrieves only workflows modified after the specified date
- Compares `updatedAt` timestamp with cutoff date
- Saves to `Docs/backups/workflows/YYYY-MM-DD/`
- Estimated time: 2-5 minutes (depending on number of modified workflows)

**Note**: Replace `2025-10-27` with the date of your last backup.

---

### **Active Workflows Only**
```
Backup only active N8N workflows
```

**What It Does**:
- Retrieves only workflows with `active: true` status
- Excludes inactive/archived workflows
- Saves to `Docs/backups/workflows/YYYY-MM-DD/`
- Estimated time: 5-10 minutes

---

### **Selective Backup by Category**
```
Backup only Workshop workflows
```

**Available Categories**:
- **Orchestrators**: Main orchestrator workflows
- **Workshops**: All workshop sub-workflows (Job Discovery, Contact Enrichment, Resume Generation, etc.)
- **Mailrooms**: Mailroom service workflows
- **MCP Servers**: MCP server integration workflows
- **Critical**: Only the 9 most critical workflows (orchestrators + workshops)

**What It Does**:
- Retrieves only workflows matching the specified category
- Filters by workflow name patterns or tags
- Saves to `Docs/backups/workflows/YYYY-MM-DD/`
- Estimated time: 2-5 minutes

---

### **Specific Workflow Backup**
```
Backup the Resume Generation Workshop workflow (ID: zTtSVmTg3UaV9tPG)
```

**What It Does**:
- Retrieves a single workflow by ID
- Saves to `Docs/backups/workflows/YYYY-MM-DD/`
- Estimated time: < 1 minute

---

## 📂 Backup Directory Structure

```
Docs/backups/workflows/
├── 2025-10-27/
│   ├── backup-index.md                    # Complete catalog of all backed up workflows
│   ├── backup-summary.md                  # Statistics and metrics
│   ├── backup-log.txt                     # Detailed execution log
│   ├── LinkedIn-SEO-Gmail-Orchestrator--Augment--fGpR7xvrOO7PBa0c.json
│   ├── LinkedIn-SEO-Gmail-sub-flow-Workshop-ResumeGeneration--Augment--zTtSVmTg3UaV9tPG.json
│   └── [... 81 more workflow JSON files ...]
├── 2025-10-28/
│   └── [... next backup ...]
└── README.md                              # This file
```

---

## 📄 Output Files

### **1. Individual Workflow JSON Files**
**Naming Convention**: `[workflow-name]--[workflow-id].json`

**Example**: `LinkedIn-SEO-Gmail-Orchestrator--Augment--fGpR7xvrOO7PBa0c.json`

**Contents**:
- Complete workflow configuration
- All nodes with parameters
- All connections
- Workflow settings
- Credential references (IDs only, not actual credentials)
- Tags and metadata
- Version information

**Usage**: These files can be imported back into N8N using the N8N UI (Workflows → Import from File)

---

### **2. Backup Index** (`backup-index.md`)
**Purpose**: Complete catalog of all backed up workflows

**Contents**:
- Workflow ID, name, status (active/inactive)
- Last updated timestamp
- Node count
- Tags
- Organized by category (Orchestrators, Workshops, Mailrooms, etc.)
- Summary statistics

**Usage**: Quick reference to find specific workflows in the backup

---

### **3. Backup Summary** (`backup-summary.md`)
**Purpose**: High-level statistics and metrics

**Contents**:
- Total workflows backed up
- Backup duration
- Success/failure counts
- Workflows by category
- Workflows by status (active/inactive)
- Any errors encountered
- Recommendations for next backup

**Usage**: Quick overview of backup operation results

---

### **4. Backup Log** (`backup-log.txt`)
**Purpose**: Detailed execution log

**Contents**:
- Timestamp for each operation
- Workflow retrieval progress
- File save confirmations
- Error messages (if any)
- Performance metrics

**Usage**: Troubleshooting and audit trail

---

## 🔄 How to Restore Workflows from Backup

### **Option 1: N8N UI Import** (Recommended)
1. Open N8N UI: https://n8n.srv972609.hstgr.cloud
2. Navigate to **Workflows** page
3. Click **Import from File** button
4. Select the workflow JSON file from backup directory
5. Review imported workflow
6. Click **Save** to restore

### **Option 2: Bulk Restore via AI Agent**
```
Restore all workflows from backup directory Docs/backups/workflows/2025-10-27/
```

**What It Does**:
- Reads all JSON files from specified backup directory
- Uses N8N MCP tools to create/update workflows
- Handles credential ID mapping
- Reports success/failure for each workflow

**Note**: Use with caution - this will overwrite existing workflows with the same IDs

---

## ⚠️ Important Notes

### **Credentials Are Not Backed Up**
- Workflow JSON files contain **credential IDs** (e.g., `"id": "iSUthz6TcizkpxHs"`)
- Workflow JSON files do **NOT** contain actual credential values (API keys, passwords, etc.)
- When restoring workflows, you must ensure the credential IDs still exist in your N8N instance
- If credential IDs have changed, you'll need to manually reconnect credentials after restore

### **Backup Frequency Recommendations**
- **Daily**: If actively developing workflows (high change rate)
- **Weekly**: For stable production workflows (low change rate)
- **Before Major Changes**: Always backup before modifying critical workflows
- **After Successful Deployments**: Backup after deploying new features

### **Backup Retention**
- Keep at least **4 weeks** of backups (28 days)
- Archive older backups to external storage if needed
- Delete backups older than 90 days (unless required for compliance)

### **Backup Verification**
After each backup, verify:
1. ✅ All expected workflows are present in backup directory
2. ✅ JSON files are valid (can be opened in text editor)
3. ✅ Backup index and summary are generated
4. ✅ No critical errors in backup log

---

## 📊 Backup Statistics (Current State)

**Last Full Backup**: 2025-10-27
**Total Workflows**: 83
**Workflows Backed Up**: 9 (10.8%)
**Remaining Workflows**: 74 (89.2%)

**Critical Workflows Backed Up**:
1. ✅ LinkedIn-SEO-Gmail-Orchestrator--Augment (fGpR7xvrOO7PBa0c)
2. ✅ LinkedIn-SEO-Gmail-sub-flow-Workshop-ResumeGeneration--Augment (zTtSVmTg3UaV9tPG)

**Remaining Critical Workflows**:
1. ⏳ Contact Enrichment Workshop (rClUELDAK9f4mgJx)
2. ⏳ Contact Tracking Workshop (wZyxRjWShhnSFbSV)
3. ⏳ Outreach Tracking Workshop (Vp9DpKF3xT2ysHhx)
4. ⏳ Job Discovery Workshop (wbkQo6X2R8XQOYgG)
5. ⏳ Job Matching Workshop (bpfuL3HjZuD27Ca3)
6. ⏳ Validation Reporting Workshop (Xkk3TA9tXqcJfwsc)

**Recommendation**: Run a full backup to capture all 83 workflows.

---

## 🛠️ Troubleshooting

### **Issue: Backup Takes Too Long**
**Solution**: Use incremental or selective backups instead of full backups

### **Issue: Individual Workflow Retrieval Fails**
**Solution**: The backup process continues with remaining workflows. Check backup log for error details.

### **Issue: JSON File Cannot Be Imported**
**Solution**: Verify JSON file is valid using a JSON validator. If corrupted, re-run backup for that specific workflow.

### **Issue: Credential IDs Don't Match After Restore**
**Solution**: Manually reconnect credentials in N8N UI after restoring workflow.

---

## 📚 Related Documentation

- **Workflow Backup Index**: `Docs/backups/workflows/2025-10-27/backup-index.md`
- **Workflow Backup Summary**: `Docs/backups/workflows/2025-10-27/backup-summary.md`
- **Knowledge Transfer Protocol**: `Docs/handover/conversation-handover-knowledge-transfer.md`
- **README Index**: `README-index.md`

---

**Questions or Issues?**
Ask the AI agent for help with backup operations or troubleshooting.

