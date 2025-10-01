# Outreach Tracking Workflow - Duplicate Rows and Missing Email Data Fix

**Workflow ID**: Vp9DpKF3xT2ysHhx  
**Workflow Name**: LinkedIn-SEO-Gmail-sub-flow-Workshop-OutreachTracking--Augment  
**Date**: 2025-09-30  
**Priority**: CRITICAL

---

## 🔍 **ROOT CAUSE ANALYSIS**

### **ISSUE #1: Duplicate Rows Being Created**

**Problem**: The "Status Update" Google Sheets node is creating NEW rows instead of UPDATING existing rows.

**Root Cause**: The `matchingColumns` parameter is in the WRONG location.

**Current Configuration (BROKEN):**
```json
{
  "operation": "appendOrUpdate",
  "columns": {
    "mappingMode": "defineBelow",
    "matchingColumns": ["dedupeKey"],  // ❌ WRONG LOCATION
    "value": { ... }
  }
}
```

**Why This Fails:**
- N8N Google Sheets v4.7 requires `columnToMatchOn` at the ROOT parameters level
- When `columnToMatchOn` is missing, the node defaults to APPEND mode
- The `matchingColumns` parameter inside `columns` object is IGNORED
- Result: Every execution creates a NEW row instead of updating existing row

**Expected Behavior:**
- The node should MATCH existing rows by dedupeKey
- If match found: UPDATE the existing row
- If no match found: APPEND a new row

---

### **ISSUE #2: Email Data Not Populating in Google Sheets**

**Problem**: Email fields (emailBody, emailSubject, emailTemplate, estimatedResponseRate) remain EMPTY in Google Sheets for new applications.

**Root Cause**: The `schema` array in the node configuration has fields marked as `"removed": true`, which prevents them from being written.

**Current Configuration (BROKEN):**
```json
{
  "columns": {
    "schema": [
      {
        "id": "emailSubject",
        "removed": false  // ✅ Not removed
      },
      {
        "id": "emailBody",
        "removed": false  // ✅ Not removed
      },
      {
        "id": "timeStamp",
        "removed": true  // ❌ Removed
      }
    ]
  }
}
```

**Why This Might Fail:**
- The `schema` array controls which fields are visible/writable
- Fields marked as `"removed": true` are excluded from operations
- The schema array is auto-generated and can become stale
- **Best Practice**: Remove the entire `schema` array and let N8N auto-detect fields

**Additional Issue**: The field mappings use complex expressions that reference `$('AI Email Generation').item`, which is NULL when the duplicate path is taken. However, the ternary operators handle this correctly by returning empty strings.

---

## ✅ **COMPLETE FIX**

### **Status Update Node - Corrected Configuration**

**File**: `Docs/troubleshooting/outreach-tracking-status-update-node-fixed.json`

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
  },
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4.7,
  "position": [-48, -384],
  "id": "ab2bff18-f152-4160-ae3c-f5e2d546b94a",
  "name": "Status Update",
  "credentials": {
    "googleSheetsOAuth2Api": {
      "id": "HnVkHdxofZiUvnda",
      "name": "Google Sheets account"
    }
  }
}
```

---

## 🔧 **KEY CHANGES**

### **Change #1: Move columnToMatchOn to Root Level**

**Before:**
```json
{
  "columns": {
    "matchingColumns": ["dedupeKey"]  // ❌ WRONG
  }
}
```

**After:**
```json
{
  "columnToMatchOn": "dedupeKey",  // ✅ CORRECT (at root level)
  "columns": {
    // No matchingColumns here
  }
}
```

### **Change #2: Remove Schema Array**

**Before:**
```json
{
  "columns": {
    "schema": [ ... ]  // ❌ Can cause field visibility issues
  }
}
```

**After:**
```json
{
  "columns": {
    // No schema array - let N8N auto-detect fields
  }
}
```

### **Change #3: Keep Field Mappings (Already Correct)**

The field mappings are actually CORRECT and don't need changes:
```json
{
  "emailSubject": "={{ $('AI Email Generation').item ? JSON.parse(...).emailSubject : '' }}"
}
```

**Why This Works:**
- For NEW applications: `$('AI Email Generation').item` exists → Parses and returns email subject
- For DUPLICATES: `$('AI Email Generation').item` is NULL → Returns empty string ''
- The ternary operator handles both paths correctly

---

## 📋 **IMPLEMENTATION STEPS**

### **Step 1: Open the Status Update Node**

1. Open N8N workflow: LinkedIn-SEO-Gmail-sub-flow-Workshop-OutreachTracking--Augment
2. Locate the "Status Update" node
3. Double-click to open node configuration

### **Step 2: Fix the Column to Match On Parameter**

1. Scroll to the **"Column to Match On"** dropdown (should be near the top)
2. Select **"dedupeKey"** from the dropdown
3. This adds `columnToMatchOn: "dedupeKey"` at the root parameters level

### **Step 3: Verify Field Mappings**

1. Scroll to the **"Values to Send"** section
2. Verify these 6 fields are present:
   - status
   - dedupeKey
   - emailSubject
   - emailBody
   - emailTemplate
   - estimatedResponseRate
3. Verify the expressions match the configuration above

### **Step 4: Remove Schema Array (If Present)**

1. Switch to **"JSON"** view (if available)
2. Look for `"schema": [...]` inside the `columns` object
3. If present, remove the entire schema array
4. Switch back to **"Form"** view

### **Step 5: Save and Activate**

1. Click **"Save"** to save the node configuration
2. Click **"Save"** again to save the workflow
3. **Activate** the workflow (toggle switch at top)

---

## ✅ **VERIFICATION STEPS**

### **Test 1: Duplicate Application (Should Skip Email)**

**Setup:**
1. Find an existing application in Google Sheets (note the dedupeKey)
2. Trigger the workflow with the same company/job combination

**Expected Results:**
- ✅ IF node takes TRUE branch (Output 0)
- ✅ Skips AI Email Generation and Draft Gmail
- ✅ Goes directly to Status Update
- ✅ Status Update UPDATES the existing row (does NOT create new row)
- ✅ Status field updated to "DUPLICATE_SKIPPED"
- ✅ Email fields remain empty (or unchanged)
- ✅ Only ONE row exists for this dedupeKey in Google Sheets

**Verification:**
```sql
-- Check Google Sheets
-- Should have only ONE row with this dedupeKey
-- Status should be "DUPLICATE_SKIPPED"
```

---

### **Test 2: New Application (Should Generate Email)**

**Setup:**
1. Trigger the workflow with a NEW company/job combination (not in Google Sheets)

**Expected Results:**
- ✅ IF node takes FALSE branch (Output 1)
- ✅ Executes AI Email Generation → Draft Gmail → Status Update
- ✅ Status Update UPDATES the existing row created by Contact Tracking
- ✅ Status field updated to "EMAIL_DRAFT_CREATED"
- ✅ emailSubject field populated with generated subject line
- ✅ emailBody field populated with generated email content
- ✅ emailTemplate field populated (e.g., "job-application-outreach")
- ✅ estimatedResponseRate field populated with AI score
- ✅ Only ONE row exists for this dedupeKey in Google Sheets

**Verification:**
```sql
-- Check Google Sheets
-- Should have only ONE row with this dedupeKey
-- Status should be "EMAIL_DRAFT_CREATED"
-- emailSubject should have content (not empty)
-- emailBody should have content (not empty)
-- emailTemplate should be "job-application-outreach"
-- estimatedResponseRate should be a number
```

---

### **Test 3: Check for Duplicate Rows**

**Setup:**
1. After running both tests above, check Google Sheets

**Expected Results:**
- ✅ Each dedupeKey appears only ONCE in the sheet
- ✅ No duplicate rows with the same dedupeKey
- ✅ Contact Tracking creates the initial row
- ✅ Outreach Tracking UPDATES that same row (doesn't create new row)

**Verification:**
```sql
-- Run this query in Google Sheets (or manually check)
-- =COUNTIF(G:G, G2)  (where G is the dedupeKey column)
-- Result should be 1 for all rows
```

---

## 🎯 **EXPECTED BEHAVIOR AFTER FIX**

### **Workflow Flow:**

```
Contact Tracking Workflow:
  ↓
  Creates Row in Google Sheets (with job/contact data)
  ↓
  Passes data to Outreach Tracking Workflow
  ↓
Outreach Tracking Workflow:
  ↓
  IF Node checks isDuplicate
  ↓
  ├─ TRUE (Duplicate) → Status Update → Updates existing row (status: DUPLICATE_SKIPPED)
  └─ FALSE (New) → AI Email Gen → Draft Gmail → Status Update → Updates existing row (status: EMAIL_DRAFT_CREATED + email data)
```

### **Google Sheets Result:**

| dedupeKey | companyName | jobTitle | status | emailSubject | emailBody |
|-----------|-------------|----------|--------|--------------|-----------|
| acme-engineer | Acme Corp | Engineer | EMAIL_DRAFT_CREATED | Application for... | Dear Hiring... |

**ONE row per application** (not two rows)

---

## 📊 **BEFORE/AFTER COMPARISON**

### **BEFORE (BROKEN):**

**Google Sheets:**
| Row | dedupeKey | companyName | jobTitle | status | emailSubject | emailBody |
|-----|-----------|-------------|----------|--------|--------------|-----------|
| 1 | acme-engineer | Acme Corp | Engineer | PREPARED | | |
| 2 | acme-engineer | | | EMAIL_DRAFT_CREATED | | |

**Problems:**
- ❌ TWO rows for the same application
- ❌ Email data missing (empty emailSubject, emailBody)
- ❌ Second row has no company/job data

---

### **AFTER (FIXED):**

**Google Sheets:**
| Row | dedupeKey | companyName | jobTitle | status | emailSubject | emailBody |
|-----|-----------|-------------|----------|--------|--------------|-----------|
| 1 | acme-engineer | Acme Corp | Engineer | EMAIL_DRAFT_CREATED | Application for... | Dear Hiring... |

**Results:**
- ✅ ONE row per application
- ✅ Email data populated correctly
- ✅ All data in a single row

---

**END OF DOCUMENT**

