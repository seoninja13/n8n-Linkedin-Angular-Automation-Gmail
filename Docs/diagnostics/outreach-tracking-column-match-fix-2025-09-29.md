# Outreach Tracking Workflow - "Column to Match On" Parameter Fix

**Date**: 2025-09-29
**Workflow ID**: UaKYKKLTlzSZkm2d
**Workflow Name**: LinkedIn-SEO-Gmail-Outreach-Tracking-MCP-Server
**Node ID**: sheets-tracking-update
**Node Name**: "Google Sheets Update"
**Status**: ✅ DIAGNOSED - FIX READY FOR DEPLOYMENT

---

## 🚨 **PROBLEM IDENTIFIED**

### **Error Message:**
```
Problem in node 'Status Update'
The 'Column to Match On' parameter is required
```

### **Root Cause:**
The Google Sheets node is using **INCORRECT parameter structure** for the column matching configuration.

**Current (INCORRECT) Configuration:**
```json
{
  "operation": "appendOrUpdate",
  "columns": {
    "mappingMode": "autoMapInputData",
    "matchingColumns": ["DedupeKey"],  // ❌ WRONG PARAMETER NAME
    "schema": [...]
  }
}
```

**The Issue:**
- The node uses `"matchingColumns"` (plural, inside the `columns` object)
- N8N Google Sheets node expects `"columnToMatchOn"` (singular, at the root parameters level)
- This mismatch causes the validation error

---

## ✅ **SOLUTION**

### **Corrected Configuration:**
```json
{
  "operation": "appendOrUpdate",
  "documentId": "1BQiMc9xOAFzXVMRuHdXzFX4ppbgMxo2fBHwySw2oIiI",
  "sheetName": "Tracking",
  "columnToMatchOn": "DedupeKey",  // ✅ CORRECT: Singular, root-level parameter
  "columns": {
    "mappingMode": "autoMapInputData",
    "schema": [
      // ... existing schema fields ...
    ]
  },
  "options": {}
}
```

### **Key Changes:**
1. **Add** `"columnToMatchOn": "DedupeKey"` at the root parameters level
2. **Remove** `"matchingColumns": ["DedupeKey"]` from inside the `columns` object
3. Keep all other configuration unchanged

---

## 📋 **COMPARISON WITH WORKING CONTACT TRACKING WORKFLOW**

### **Contact Tracking (WORKING) - Node Configuration:**
```json
{
  "operation": "update",
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
  "columnToMatchOn": "dedupeKey",  // ✅ CORRECT PARAMETER
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "timeStamp": "={{ $json.timeStamp }}",
      "duplicateCount": "={{ $json.duplicateCount }}",
      // ... other fields ...
    }
  }
}
```

**Key Observation:**
- Contact Tracking uses `"columnToMatchOn"` (singular) at the root level ✅
- Outreach Tracking uses `"matchingColumns"` (plural) inside `columns` object ❌

---

## 🔧 **DEPLOYMENT INSTRUCTIONS**

### **Option 1: Manual Fix via N8N UI (RECOMMENDED)**
1. Navigate to: https://n8n.srv972609.hstgr.cloud
2. Open workflow: "LinkedIn-SEO-Gmail-Outreach-Tracking-MCP-Server" (ID: UaKYKKLTlzSZkm2d)
3. Locate node: "Google Sheets Update" (ID: sheets-tracking-update)
4. In the node parameters:
   - Find the "Column to Match On" dropdown
   - Select: **"DedupeKey"**
   - Save the node
5. Save the workflow
6. Test execution

### **Option 2: Programmatic Fix via N8N MCP**
Use the `n8n_update_partial_workflow` tool with the following operation:

```json
{
  "id": "UaKYKKLTlzSZkm2d",
  "operations": [
    {
      "type": "updateNode",
      "nodeId": "sheets-tracking-update",
      "changes": {
        "parameters": {
          "operation": "appendOrUpdate",
          "documentId": "1BQiMc9xOAFzXVMRuHdXzFX4ppbgMxo2fBHwySw2oIiI",
          "sheetName": "Tracking",
          "columnToMatchOn": "DedupeKey",
          "columns": {
            "mappingMode": "autoMapInputData",
            "schema": [
              {"id": "Timestamp", "displayName": "Timestamp", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Company", "displayName": "Company", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Job Title", "displayName": "Job Title", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Job URL", "displayName": "Job URL", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Company Website", "displayName": "Company Website", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "DedupeKey", "displayName": "DedupeKey", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Contact Email", "displayName": "Contact Email", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Contact Name", "displayName": "Contact Name", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Email Status", "displayName": "Email Status", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Resume URL", "displayName": "Resume URL", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Resume Status", "displayName": "Resume Status", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Outreach Status", "displayName": "Outreach Status", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Email Subject", "displayName": "Email Subject", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Outreach Executed", "displayName": "Outreach Executed", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Outreach Timestamp", "displayName": "Outreach Timestamp", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Semantic Join Status", "displayName": "Semantic Join Status", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Processing Timestamp", "displayName": "Processing Timestamp", "required": false, "type": "string", "canBeUsedToMatch": true},
              {"id": "Data Loss Prevention", "displayName": "Data Loss Prevention", "required": false, "type": "string", "canBeUsedToMatch": true}
            ]
          },
          "options": {}
        }
      }
    }
  ]
}
```

---

## 🧪 **VERIFICATION CHECKLIST**

After applying the fix:

- [ ] **Node Configuration**: Verify "Column to Match On" parameter is set to "DedupeKey"
- [ ] **Workflow Validation**: Run N8N workflow validation (no errors)
- [ ] **Test Execution**: Execute workflow with test data
- [ ] **Google Sheets Update**: Verify records are updated (not duplicated)
- [ ] **Duplicate Handling**: Confirm existing records are updated by DedupeKey match
- [ ] **New Records**: Confirm new records are appended when no DedupeKey match

---

## 📊 **EXPECTED BEHAVIOR AFTER FIX**

### **Scenario 1: Existing Record (DedupeKey Match)**
- **Input**: Record with `DedupeKey: "oralsu rgerypartners-communicationandbrandstrategist"`
- **Expected**: UPDATE existing row in Google Sheets
- **Fields Updated**: Email status, outreach timestamp, email subject, etc.

### **Scenario 2: New Record (No DedupeKey Match)**
- **Input**: Record with new `DedupeKey: "newcompany-newjobtitle"`
- **Expected**: APPEND new row to Google Sheets
- **Fields Created**: All tracking fields populated

---

## 🎯 **SUMMARY**

**Problem**: Missing `"columnToMatchOn"` parameter in Google Sheets Update node
**Root Cause**: Incorrect parameter structure (`matchingColumns` vs `columnToMatchOn`)
**Solution**: Add `"columnToMatchOn": "DedupeKey"` at root parameters level
**Impact**: Enables proper UPDATE operations for duplicate records
**Status**: Fix ready for deployment via manual UI update or programmatic MCP update

**This fix aligns the Outreach Tracking workflow with the working Contact Tracking workflow configuration pattern.**

