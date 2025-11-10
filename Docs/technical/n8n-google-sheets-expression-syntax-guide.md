# N8N Google Sheets Expression Syntax Guide
**Last Updated**: 2025-11-04  
**Project**: N8N LinkedIn Automation  
**Purpose**: Document correct expression syntax for Google Sheets nodes to prevent data integrity issues

---

## Overview

This guide documents the correct expression syntax for N8N Google Sheets nodes based on troubleshooting sessions where incorrect syntax caused data integrity issues, formula errors, and literal unevaluated expressions in Google Sheets.

---

## Expression Syntax Rules

### ✅ CORRECT Syntax: `{{ $json.field }}`

**Use this syntax for ALL Google Sheets node field mappings:**

```json
{
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "id": "{{ $json.id }}",
      "counter": "{{ $json.counter }}",
      "executionDate": "{{ $json.executionDate }}",
      "workflowId": "{{ $json.workflowId }}"
    }
  }
}
```

**Why This Works**:
- N8N evaluates the expression and writes the **plain value** to Google Sheets
- Google Sheets receives: `"1"`, `"2025-11-04"`, `"Vp9DpKF3xT2ysHhx"` (plain strings/numbers)
- No formula interpretation, no errors

---

### ❌ INCORRECT Syntax: `={{ $json.field }}`

**DO NOT use `=` prefix in Google Sheets node field mappings:**

```json
{
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "id": "={{ $json.id }}",              // ❌ WRONG
      "counter": "={{ $json.counter }}",    // ❌ WRONG
      "workflowId": "={{ $json.workflowId }}" // ❌ WRONG
    }
  }
}
```

**Why This Fails**:
- N8N prepends `=` to the evaluated value
- Google Sheets receives: `"=1"`, `"=Vp9DpKF3xT2ysHhx"` (values starting with `=`)
- Google Sheets interprets these as **formulas**
- Results in errors: `#NAME?`, `#ERROR!`, `#REF!`

---

## Common Issues and Solutions

### Issue #1: `#NAME?` Error in Google Sheets

**Symptom**:
```
Google Sheets Cell Value: #NAME?
```

**Root Cause**:
Field mapping has `=` prefix: `"workflowId": "={{ $json.workflowId }}"`

**Solution**:
Remove `=` prefix: `"workflowId": "{{ $json.workflowId }}"`

---

### Issue #2: Literal Unevaluated Expressions

**Symptom**:
```
Google Sheets Cell Value: {{ $json.id }}
```

**Root Cause**:
- Expression syntax is correct, but input data doesn't have the expected field
- Or node configuration has other issues (e.g., wrong operation type)

**Solution**:
1. Verify input data structure using N8N execution logs
2. Check that upstream nodes output the expected fields
3. Verify node operation type (append vs appendOrUpdate)

---

### Issue #3: Empty Fields in Google Sheets

**Symptom**:
```
Google Sheets Cell Value: (empty)
```

**Root Cause**:
Field mapping is missing from node configuration

**Solution**:
Add field mapping to `columns.value` object:
```json
"columns": {
  "mappingMode": "defineBelow",
  "value": {
    "id": "",  // ✅ Add missing field (empty string for execution records)
    "counter": "{{ $json.counter }}"
  }
}
```

---

### Issue #4: Incorrect Date "1899-12-31"

**Symptom**:
```
Google Sheets Cell Value: 1899-12-31
```

**Root Cause**:
- Google Sheets epoch date (day 0) = 1899-12-31
- Occurs when numeric value `0` is written to date-formatted column
- Or when formula error returns `0`

**Solution**:
1. Verify upstream node outputs correct date string (e.g., "2025-11-04")
2. Check that field mapping uses correct expression syntax
3. Ensure date field is not empty or `0`

---

## Google Sheets Node Operations

### Operation: `append`

**Purpose**: Always create a new row

**Use Case**: Writing execution records, logs, history

**Configuration**:
```json
{
  "operation": "append",
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "id": "",
      "executionDate": "{{ $json.executionDate }}",
      "executionTime": "{{ $json.executionTime }}"
    }
  }
}
```

**Behavior**:
- Creates new row for each execution
- Does NOT check for duplicates
- Does NOT update existing rows

---

### Operation: `appendOrUpdate`

**Purpose**: Update existing row if match found, otherwise append new row

**Use Case**: Updating counter tracking row, maintaining persistent state

**Configuration**:
```json
{
  "operation": "appendOrUpdate",
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "id": "{{ $json.id }}",
      "counter": "{{ $json.counter }}"
    },
    "matchingColumns": ["id"]
  }
}
```

**Behavior**:
- Searches for row where `id` matches the value in `matchingColumns`
- If match found: Updates that row
- If no match: Appends new row
- **CRITICAL**: `matchingColumns` must reference a field in `columns.value`

---

## Two-Node Architecture Pattern

### Pattern: Counter Tracking + Execution Records

**Use Case**: Maintain persistent counter in Row 2, write execution history in Rows 3+

**Node 1: "Update Counter"** (appendOrUpdate)
```json
{
  "operation": "appendOrUpdate",
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "id": "{{ $json.id }}",
      "counter": "{{ $json.counter }}"
    },
    "matchingColumns": ["id"]
  }
}
```

**Purpose**: Update Row 2 (id=1) with incremented counter value

---

**Node 2: "Email Tracking Dashboard"** (append)
```json
{
  "operation": "append",
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "id": "",
      "counter": "{{ $json.counter }}",
      "executionDate": "{{ $json.executionDate }}",
      "executionTime": "{{ $json.executionTime }}",
      "totalEmails": "{{ $json.totalEmails }}"
    }
  }
}
```

**Purpose**: Append new row (Row 3, Row 4, ...) with execution metrics

---

**Google Sheets Structure**:
```
Row 1: Headers (id, counter, executionDate, executionTime, totalEmails, ...)
Row 2: Counter Tracking (id=1, counter=<0-4>, all other fields empty)
Row 3+: Execution Records (id="", counter=<1-5>, executionDate, executionTime, totalEmails, ...)
```

---

## Troubleshooting Checklist

### When Google Sheets Data is Incorrect:

1. **Check Expression Syntax**:
   - ✅ Use `{{ $json.field }}` (no `=` prefix)
   - ❌ Avoid `={{ $json.field }}` (causes formula errors)

2. **Verify Input Data Structure**:
   - Use N8N execution logs to inspect input data
   - Confirm upstream nodes output expected fields
   - Check field names match exactly (case-sensitive)

3. **Check Node Operation Type**:
   - `append`: Always creates new row
   - `appendOrUpdate`: Updates existing row or creates new row
   - Verify `matchingColumns` references correct field

4. **Verify Field Mappings**:
   - All required fields included in `columns.value`
   - Field names match Google Sheets column headers
   - Empty string `""` used for fields that should be blank

5. **Check Google Sheets Column Formatting**:
   - Date columns: Use "Date" format (not "Number")
   - Number columns: Use "Number" format (not "Plain text")
   - Text columns: Use "Plain text" format

---

## Related Documentation

- **Daily Log**: `Docs/daily-logs/2025-11-04-google-sheets-data-integrity-fixes.md`
- **Knowledge Transfer**: `Docs/handover/conversation-handover-knowledge-transfer.md`
- **Workflow**: LinkedIn-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment (ID: Vp9DpKF3xT2ysHhx)

---

**End of Guide**

