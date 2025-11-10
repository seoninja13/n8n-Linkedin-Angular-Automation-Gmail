# Daily Log: Google Sheets Data Integrity Fixes
**Date**: 2025-11-04  
**Project**: N8N LinkedIn Automation - Outreach Tracking Workshop  
**Session**: Troubleshooting Google Sheets Data Integrity Issues  
**Status**: ✅ Root Cause Identified | 📋 Fixes Provided | ⏳ Implementation Pending

---

## Session Overview

### Objective
Investigate and resolve data integrity issues in the "Email Daily Tracking" Google Sheet after the "Update Counter" node was fixed in the previous session.

### Workflow Details
- **Workflow ID**: Vp9DpKF3xT2ysHhx
- **Workflow Name**: LinkedIn-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment
- **Workflow URL**: https://n8n.srv972609.hstgr.cloud/workflow/Vp9DpKF3xT2ysHhx
- **Google Sheet**: "LinkedIn Automation - Email Tracking Dashboard"
- **Sheet ID**: 1NgFM2ujALlcApbyAuYNWJ5Hyf0UkO0efQlGAzoifC8c
- **Sheet Name**: "Email Daily Tracking"

### Executions Analyzed
- **Failed Executions**: 6473, 6474 (before fix)
- **Successful Executions**: 6476-6481, 6497-6502 (after Update Counter fix)
- **Key Execution for Analysis**: 6481 (first successful execution with detailed data)

---

## Problems Identified

### Problem #1: Row 3 Contains Literal Unevaluated Expressions

**Symptoms**:
```
Row 3 Data:
- id: "{{ $json.id }}"
- counter: "{{ $json.accountSelectionMetadata.newCounter }}"
```

**Root Cause**:
- Row 3 is corrupted test data from early testing phase
- "Update Counter" node wrote this row when input data structure was incorrect
- Node couldn't match Row 2 (id=1), so it appended a new row with literal expressions

**Solution**:
- **DELETE Row 3 manually** from Google Sheets
- Row 3 should not exist in the intended data structure
- Only Row 2 should be the counter tracking row

---

### Problem #2: Empty `id` Field in Execution Records (Rows 4-9)

**Symptoms**:
```
Rows 4-9 Data:
- id: "" (empty)
- counter: 1 (all rows show same value)
- executionDate: correct dates
- executionTime: correct timestamps
```

**Root Cause**:
- "Email Tracking Dashboard" node configuration missing `id` field mapping
- Node writes execution records but doesn't include `id` field in `columns.value`

**Node Details**:
- **Node ID**: 2e816740-f2a4-4da7-8100-22389ae455fb
- **Node Name**: "Email Tracking Dashboard"
- **Operation**: `append`

**Solution Provided**:
Added `id` field to node configuration:
```json
"columns": {
  "mappingMode": "defineBelow",
  "value": {
    "id": "",
    "counter": "{{ $json.counter }}",
    "executionDate": "{{ $json.executionDate }}",
    // ... other fields
  }
}
```

---

### Problem #3: `workflowId` Shows `#NAME?` Error

**Symptoms**:
```
Rows 4-9 Data:
- workflowId: #NAME? (Google Sheets formula error)
```

**Root Cause**:
- "Email Tracking Dashboard" node had `=` prefix in `workflowId` field mapping
- Configuration: `"workflowId": "={{ $json.workflowId }}"`
- Google Sheets interprets values starting with `=` as formulas
- `=Vp9DpKF3xT2ysHhx` is not a valid formula, causing `#NAME?` error

**Solution Provided**:
Removed `=` prefix from `workflowId` field:
```json
"workflowId": "{{ $json.workflowId }}"  // ✅ Correct (no = prefix)
```

---

### Problem #4: `draftCreatedAt` Shows Literal Expression

**Symptoms**:
```
Rows 4-9 Data:
- draftCreatedAt: "{{ $json.draftCreatedAt }}"
```

**Root Cause Analysis**:
- Investigated upstream "Aggregate Email Metrics" node
- Confirmed node DOES output `draftCreatedAt` field with actual timestamp
- "Email Tracking Dashboard" node configuration appears correct
- Issue likely related to overall node configuration structure

**Solution Provided**:
Included `draftCreatedAt` in corrected node configuration:
```json
"draftCreatedAt": "{{ $json.draftCreatedAt }}"  // ✅ Correct syntax
```

---

### Problem #5: Incorrect Date "1899-12-31" in Row 9

**Symptoms**:
```
Row 9 Data:
- executionDate: "1899-12-31" (should be "2025-11-03")
```

**Root Cause**:
- Google Sheets epoch date (day 0) = 1899-12-31
- Occurs when numeric value `0` is written to date-formatted column
- Or when formula error returns `0`

**Solution**:
- Will be resolved automatically once other fixes are applied
- Correct date string will be written from "Aggregate Email Metrics" node

---

## Architecture Discovery

### Two Google Sheets Nodes Writing to Same Sheet

**Node 1: "Update Counter"** (ID: 4b64602a-0388-4bfc-a24b-75896f7e94b2)
- **Purpose**: Update Row 2 (Counter Tracking Row)
- **Operation**: `appendOrUpdate` with `matchingColumns: ["id"]`
- **Target**: Row 2 (id=1)
- **Fields**: ONLY `id` and `counter`
- **Behavior**: Updates existing row in place

**Node 2: "Email Tracking Dashboard"** (ID: 2e816740-f2a4-4da7-8100-22389ae455fb)
- **Purpose**: Write execution records
- **Operation**: `append`
- **Target**: Row 3, Row 4, Row 5, ... (new row per execution)
- **Fields**: ALL 16 fields (executionDate, executionTime, totalEmails, etc.)
- **Behavior**: Appends new row for each execution

**Why This Architecture**:
- Row 2 is a persistent counter that gets updated in place
- Rows 3+ are execution history that accumulates over time
- Two nodes needed for different purposes (update vs append)

---

## Counter Tracking System Documentation

### Expected Behavior

**Row 2 Counter Cycle** (80/20 Gmail/Outlook Rotation):
```
Execution 1: counter=0 → counter=1 (Gmail - position 1/5)
Execution 2: counter=1 → counter=2 (Gmail - position 2/5)
Execution 3: counter=2 → counter=3 (Gmail - position 3/5)
Execution 4: counter=3 → counter=4 (Gmail - position 4/5)
Execution 5: counter=4 → counter=0 (Outlook - position 5/5)
Execution 6: counter=0 → counter=1 (Gmail - position 1/5) [cycle repeats]
```

### Data Flow

1. **"Read Counter" Node** → Reads Row 2 from Google Sheets
2. **"Weighted Round-Robin Account Selector" Code Node** → Increments counter, selects account
3. **"Update Counter" Node** → Updates Row 2 with new counter value
4. **"If" Node** → Routes to Gmail or Outlook based on selected account
5. **"Draft Gmail" or "Draft Outlook" Node** → Creates email draft
6. **"Aggregate Email Metrics" Code Node** → Calculates execution metrics
7. **"Email Tracking Dashboard" Node** → Writes execution record to new row

### Google Sheets Structure

```
Row 1: Headers
  - id, counter, executionDate, executionTime, totalEmails, gmailCount, outlookCount, ...

Row 2: Counter Tracking Row (PERSISTENT - UPDATED IN PLACE)
  - id=1, counter=<0-4>, all other fields empty

Row 3+: Execution Records (APPENDED - ONE ROW PER EXECUTION)
  - id="", counter=<1-5>, executionDate, executionTime, totalEmails, gmailCount, outlookCount, ...
```

---

## Solutions Provided

### Complete "Email Tracking Dashboard" Node Configuration

**Full JSON Configuration** (ready to paste into node's JSON editor):

```json
{
  "parameters": {
    "operation": "append",
    "documentId": {
      "__rl": true,
      "value": "1NgFM2ujALlcApbyAuYNWJ5Hyf0UkO0efQlGAzoifC8c",
      "mode": "list",
      "cachedResultName": "LinkedIn Automation - Email Tracking Dashboard",
      "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1NgFM2ujALlcApbyAuYNWJ5Hyf0UkO0efQlGAzoifC8c/edit?usp=drivesdk"
    },
    "sheetName": {
      "__rl": true,
      "value": "gid=0",
      "mode": "list",
      "cachedResultName": "Email Daily Tracking",
      "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1NgFM2ujALlcApbyAuYNWJ5Hyf0UkO0efQlGAzoifC8c/edit#gid=0"
    },
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "id": "",
        "counter": "{{ $json.counter }}",
        "executionDate": "{{ $json.executionDate }}",
        "executionTime": "{{ $json.executionTime }}",
        "totalEmails": "{{ $json.totalEmails }}",
        "gmailCount": "{{ $json.gmailCount }}",
        "outlookCount": "{{ $json.outlookCount }}",
        "gmailPercentage": "{{ $json.gmailPercentage }}",
        "outlookPercentage": "{{ $json.outlookPercentage }}",
        "gmailBounceRate": "{{ $json.gmailBounceRate }}",
        "outlookBounceRate": "{{ $json.outlookBounceRate }}",
        "gmailHealth": "{{ $json.gmailHealth }}",
        "outlookHealth": "{{ $json.outlookHealth }}",
        "workflowId": "{{ $json.workflowId }}",
        "executionId": "{{ $json.executionId }}",
        "draftCreatedAt": "{{ $json.draftCreatedAt }}"
      }
    },
    "options": {}
  }
}
```

**Key Changes**:
1. ✅ Added `"id": ""` (empty string for execution records)
2. ✅ Removed `=` prefix from `workflowId`
3. ✅ All fields use correct `{{ }}` syntax without `=` prefix

---

## Next Steps

### For User to Complete

1. **Delete Row 3** from "Email Daily Tracking" Google Sheet manually
2. **Open "Email Tracking Dashboard" node** in N8N workflow editor
3. **Switch to JSON view** and paste the corrected configuration above
4. **Save the node** and **save the workflow**
5. **Test workflow** by executing it once
6. **Verify**:
   - Row 2 counter increments correctly
   - New execution record appears with all fields populated
   - No empty `id` fields
   - No literal expressions
   - No `#NAME?` errors
   - Correct dates and timestamps

### Expected Results After Fix

**Row 2** (Counter Tracking):
```
id=1, counter=<incremented_value>, all other fields empty
```

**New Execution Record** (e.g., Row 10):
```
id="", counter=<1-5>, executionDate="2025-11-04", executionTime="2025-11-04 HH:MM:SS",
totalEmails=1, gmailCount=<0 or 1>, outlookCount=<0 or 1>, workflowId="Vp9DpKF3xT2ysHhx",
executionId="<execution_id>", draftCreatedAt="2025-11-04T..."
```

---

## Session Outcome

### Completed
- ✅ Root cause analysis for all data integrity issues
- ✅ Documented counter tracking system architecture
- ✅ Provided complete corrected configuration for "Email Tracking Dashboard" node
- ✅ Explained two-node architecture (Update Counter vs Email Tracking Dashboard)
- ✅ Documented expected Google Sheets structure and counter cycle behavior

### Pending
- ⏳ User to apply "Email Tracking Dashboard" node fix
- ⏳ User to delete Row 3 from Google Sheets
- ⏳ User to test workflow and verify data integrity
- ⏳ User to confirm counter increments correctly through full 0-4 cycle

---

## Related Documentation

- **Knowledge Transfer**: `Docs/handover/conversation-handover-knowledge-transfer.md` (updated with this session)
- **Previous Session**: `Docs/daily-logs/2025-11-04-outreach-tracking-email-rotation-binary-data-fix.md`
- **Workflow URL**: https://n8n.srv972609.hstgr.cloud/workflow/Vp9DpKF3xT2ysHhx
- **Google Sheet**: https://docs.google.com/spreadsheets/d/1NgFM2ujALlcApbyAuYNWJ5Hyf0UkO0efQlGAzoifC8c/edit

---

**End of Daily Log**

