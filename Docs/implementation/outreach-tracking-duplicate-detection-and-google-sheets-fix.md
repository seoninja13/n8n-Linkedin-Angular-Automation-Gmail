# Outreach Tracking Workflow - Duplicate Detection & Google Sheets Fix

**Date**: 2025-09-30  
**Workflow ID**: Vp9DpKF3xT2ysHhx  
**Workflow Name**: LinkedIn-SEO-Gmail-sub-flow-Workshop-OutreachTracking--Augment  
**Status**: 🚨 **CRITICAL FIXES REQUIRED**

---

## 🎯 **EXECUTIVE SUMMARY**

After implementing the initial fixes for the Outreach Tracking workflow, end-to-end testing revealed THREE critical issues:

1. **IF Node Condition Hardcoded to FALSE** - The IF node is comparing `false === true` (always FALSE), causing ALL applications to generate emails, including duplicates
2. **Status Update Node Missing columnToMatchOn** - The node has `matchingColumns` in the wrong location, causing it to APPEND new rows instead of UPDATING existing rows
3. **Duplicate Rows in Google Sheets** - Each application creates TWO rows (one from Contact Tracking, one from Outreach Tracking) instead of updating the same row

**Impact**: 
- ❌ Duplicate applications are generating AI emails (wasting API costs)
- ❌ Google Sheets has duplicate rows for each application (data integrity issue)
- ❌ The workflow is not functioning as designed

---

## 🔍 **PROBLEM #1: IF NODE CONDITION HARDCODED**

### **Current Configuration (BROKEN):**

```json
{
  "parameters": {
    "conditions": {
      "conditions": [
        {
          "leftValue": false,        // ❌ HARDCODED FALSE
          "rightValue": true,         // ❌ HARDCODED TRUE
          "operator": {
            "type": "boolean",
            "operation": "equals"
          }
        }
      ]
    }
  }
}
```

### **The Problem:**

The IF node is comparing the **hardcoded boolean** `false` to the **hardcoded boolean** `true`. This condition is **ALWAYS FALSE**, which means:

- **ALL applications** go through Output 1 (FALSE branch) → AI Email Generation → Draft Gmail
- **NO applications** go through Output 0 (TRUE branch) → Status Update directly
- **Duplicates are NOT being filtered** - they generate emails just like new applications

### **Root Cause:**

The IF node condition was supposed to be `{{ $json.isDuplicate }} equals {{ true }}`, but it was configured as `false equals true` instead. This is likely due to:
1. Manual configuration error in the N8N UI
2. The expression fields were not properly set to reference `$json.isDuplicate`
3. The values were entered as static booleans instead of expressions

### **Expected Behavior:**

- When `isDuplicate = true` → IF node TRUE branch (Output 0) → Skip email generation → Go directly to Status Update
- When `isDuplicate = false` → IF node FALSE branch (Output 1) → Generate AI email → Create Gmail draft → Go to Status Update

### **Actual Behavior:**

- **ALL applications** → IF node FALSE branch (Output 1) → Generate AI email (including duplicates)

---

## 🔍 **PROBLEM #2: STATUS UPDATE NODE MISSING columnToMatchOn**

### **Current Configuration (BROKEN):**

```json
{
  "operation": "appendOrUpdate",
  "documentId": "1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g",
  "sheetName": "Tracking",
  "columns": {
    "mappingMode": "defineBelow",
    "matchingColumns": ["dedupeKey"],  // ❌ WRONG LOCATION
    "value": {
      "status": "...",
      "dedupeKey": "...",
      "emailSubject": "...",
      ...
    }
  }
}
```

### **The Problem:**

The node has `"matchingColumns": ["dedupeKey"]` **inside the columns object**, but N8N's Google Sheets node requires `"columnToMatchOn": "dedupeKey"` at the **ROOT parameters level** for the `appendOrUpdate` operation.

**Result**: The node cannot match existing rows, so it **APPENDS** a new row every time instead of **UPDATING** the existing row created by Contact Tracking.

### **Root Cause:**

This is the same parameter structure error that was fixed in the archived Outreach Tracking workflow (UaKYKKLTlzSZkm2d). The parameter was placed in the wrong location in the JSON structure.

### **Expected Behavior:**

- Contact Tracking creates row with status "PREPARED"
- Outreach Tracking **UPDATES** that row with email fields
- **ONE row per application** in Google Sheets

### **Actual Behavior:**

- Contact Tracking creates row with status "PREPARED"
- Outreach Tracking **APPENDS** a new row with email fields
- **TWO rows per application** in Google Sheets (duplicate rows)

---

## 🔍 **PROBLEM #3: DATA FLOW VERIFICATION**

### **Current Data Structure (CORRECT):**

The Outreach Input Processing node correctly outputs:

```javascript
{
  job: {...},
  contact: {...},
  resume: {...},
  email: {...},
  tracking: {
    dedupeKey: "company-name-jobtitle",
    trackingId: "...",
    status: "PREPARED",
    ...
  },
  isDuplicate: true/false,        // ✅ At root level
  duplicateCount: 0,
  duplicateReason: "",
  ...
}
```

**Verification**: The `isDuplicate` field IS at the root level and IS a boolean. The data structure is correct.

### **IF Node Should Access:**

- `$json.isDuplicate` → Returns `true` or `false`

### **Status Update Node Should Access:**

- `$('Outreach Input Processing').item.json.tracking.dedupeKey` → Returns the dedupeKey string

**Verification**: The field paths are correct. The issue is NOT with data structure, but with the IF node condition configuration and Status Update node parameter structure.

---

## 🔧 **COMPLETE FIXES**

### **FIX #1: IF NODE CONDITION**

**File: `if-node-corrected-configuration.json`**

```json
{
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict",
        "version": 2
      },
      "conditions": [
        {
          "id": "38159f4e-c431-4295-952d-ca66a5bb6dbb",
          "leftValue": "={{ $json.isDuplicate }}",
          "rightValue": "={{ true }}",
          "operator": {
            "type": "boolean",
            "operation": "equals",
            "name": "filter.operator.equals"
          }
        }
      ],
      "combinator": "and"
    },
    "options": {}
  }
}
```

**Key Changes:**
- `leftValue`: Changed from `false` to `"={{ $json.isDuplicate }}"` (field reference)
- `rightValue`: Changed from `true` to `"={{ true }}"` (expression-wrapped boolean)

---

### **FIX #2: STATUS UPDATE NODE CONFIGURATION**

**File: `status-update-node-corrected-configuration.json`**

```json
{
  "parameters": {
    "operation": "appendOrUpdate",
    "documentId": {
      "__rl": true,
      "value": "1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g",
      "mode": "id"
    },
    "sheetName": {
      "__rl": true,
      "value": "Tracking",
      "mode": "name"
    },
    "columnToMatchOn": "dedupeKey",
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "status": "={{ $('AI Email Generation').item ? 'EMAIL_DRAFT_CREATED' : 'DUPLICATE_SKIPPED' }}",
        "dedupeKey": "={{ $('Outreach Input Processing').item.json.tracking.dedupeKey }}",
        "emailSubject": "={{ $('AI Email Generation').item ? JSON.parse($('AI Email Generation').item.json.content.parts[0].text).emailSubject : '' }}",
        "emailBody": "={{ $('AI Email Generation').item ? JSON.parse($('AI Email Generation').item.json.content.parts[0].text).emailBody : '' }}",
        "emailTemplate": "={{ $('AI Email Generation').item ? JSON.parse($('AI Email Generation').item.json.content.parts[0].text).emailMetadata.template : 'job-application-outreach' }}",
        "estimatedResponseRate": "={{ $('AI Email Generation').item ? JSON.parse($('AI Email Generation').item.json.content.parts[0].text).estimatedResponseRate : 0 }}"
      }
    },
    "options": {}
  }
}
```

**Key Changes:**
- **ADDED**: `"columnToMatchOn": "dedupeKey"` at root parameters level
- **REMOVED**: `"matchingColumns": ["dedupeKey"]` from inside columns object
- **REMOVED**: Schema array (not needed with defineBelow mode)

---

## 📋 **IMPLEMENTATION INSTRUCTIONS**

### **Step 1: Fix IF Node Condition**

**Manual Configuration (Recommended):**

1. Navigate to: https://n8n.srv972609.hstgr.cloud/workflow/Vp9DpKF3xT2ysHhx
2. Open the **"If - Duplicate or not"** node
3. Click on the existing condition to edit it
4. **Left Value**:
   - Click the **expression icon (fx)**
   - Clear any existing value
   - Enter: `$json.isDuplicate`
   - Press Enter (N8N will wrap it as `{{ $json.isDuplicate }}`)
5. **Operator**:
   - Ensure it's set to **"Boolean" → "Equal"**
6. **Right Value**:
   - Click the **expression icon (fx)**
   - Clear any existing value
   - Enter: `true`
   - Press Enter (N8N will wrap it as `{{ true }}`)
7. **Save** the node
8. **Verify**: The condition should show `{{ $json.isDuplicate }} equals {{ true }}`

---

### **Step 2: Fix Status Update Node**

**Manual Configuration (Recommended):**

1. Open the **"Status Update"** node
2. Scroll to the **"Column to Match On"** dropdown
3. Select **"dedupeKey"** from the dropdown
   - This will automatically add `columnToMatchOn: "dedupeKey"` at the root level
   - This will automatically remove `matchingColumns` from the columns object
4. **Verify** the "Values to Send" section still has all 6 fields:
   - status
   - dedupeKey
   - emailSubject
   - emailBody
   - emailTemplate
   - estimatedResponseRate
5. **Save** the node

---

### **Step 3: Activate and Test**

1. **Save** the workflow
2. **Activate** the workflow (toggle the "Active" switch)
3. **Test with duplicate application**:
   - Expected: No email generated, status = "DUPLICATE_SKIPPED"
   - Expected: Existing Google Sheets row updated (not new row created)
4. **Test with new application**:
   - Expected: Email generated, status = "EMAIL_DRAFT_CREATED"
   - Expected: Existing Google Sheets row updated (not new row created)

---

## ✅ **VERIFICATION CHECKLIST**

After implementing both fixes:

- [ ] IF node condition shows `{{ $json.isDuplicate }} equals {{ true }}`
- [ ] IF node operator type is "Boolean"
- [ ] Status Update node has "Column to Match On" set to "dedupeKey"
- [ ] Status Update node operation is "Append or Update Row"
- [ ] Workflow is activated
- [ ] Test duplicate application - no email generated
- [ ] Test duplicate application - Google Sheets row updated (not appended)
- [ ] Test new application - email generated
- [ ] Test new application - Google Sheets row updated (not appended)
- [ ] Only ONE row per application exists in Google Sheets

---

## 🎯 **EXPECTED RESULTS AFTER FIXES**

### **Duplicate Application Flow:**
```
Execute Workflow Trigger
  ↓
Outreach Input Processing (outputs: isDuplicate: true)
  ↓
IF Node (condition: true === true → TRUE)
  ↓ [Output 0 - TRUE branch]
Status Update (updates existing row with status: "DUPLICATE_SKIPPED")
  ↓
Outreach Tracking Output Formatting
```

**Result**: No email generated, Google Sheets row updated, ONE row total

### **New Application Flow:**
```
Execute Workflow Trigger
  ↓
Outreach Input Processing (outputs: isDuplicate: false)
  ↓
IF Node (condition: false === true → FALSE)
  ↓ [Output 1 - FALSE branch]
AI Email Generation
  ↓
Draft Gmail
  ↓
Status Update (updates existing row with status: "EMAIL_DRAFT_CREATED", email fields)
  ↓
Outreach Tracking Output Formatting
```

**Result**: Email generated, Google Sheets row updated, ONE row total

---

## 📊 **SUMMARY OF ISSUES AND FIXES**

| Issue | Current State | Impact | Fix |
|-------|--------------|--------|-----|
| **IF Node Condition** | Hardcoded `false === true` | ALL apps generate emails | Change to `{{ $json.isDuplicate }} === {{ true }}` |
| **Status Update Parameter** | `matchingColumns` in wrong location | Creates duplicate rows | Add `columnToMatchOn` at root level |
| **Data Structure** | ✅ Correct | None | No fix needed |

---

**END OF DOCUMENT**

