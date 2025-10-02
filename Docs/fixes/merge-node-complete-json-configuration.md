# Complete N8N Merge Node JSON Configuration - Manual Import

**Date**: 2025-10-01  
**Workflow ID**: Vp9DpKF3xT2ysHhx  
**Node ID**: d94927ee-5c79-4c14-9044-d7efc9a826e4  
**Issue**: UI not saving mode configuration, parameters field remains empty

---

## **COMPLETE MERGE NODE JSON CONFIGURATION**

### **Copy This Entire Node Configuration**

```json
{
  "parameters": {
    "mode": "append"
  },
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3.2,
  "position": [
    -368,
    -624
  ],
  "id": "d94927ee-5c79-4c14-9044-d7efc9a826e4",
  "name": "Merge Duplicate and Email"
}
```

---

## **WHY THE PARAMETERS FIELD WAS EMPTY**

### **N8N's Default Value Behavior**

According to N8N's Merge node documentation:
- The **default mode** for the Merge node is `"append"`
- When you select "Append" in the UI, N8N doesn't save it in the JSON because it's the default value
- N8N only saves parameters that differ from the default

**However**, this causes a validation issue:
- N8N's validation system doesn't recognize the implicit default
- The validation requires an EXPLICIT `mode` parameter to recognize the Merge node as a valid merge point
- Without the explicit parameter, the validation fails with the node reference error

### **The Solution**

**Explicitly set `mode: "append"` in the parameters**, even though it's the default value. This makes it explicit in the JSON and resolves the validation issue.

---

## **HOW TO MANUALLY EDIT THE WORKFLOW JSON**

### **Step 1: Export the Workflow**
1. Open the Outreach Tracking workflow in N8N
2. Click the **"..."** menu in the top-right corner
3. Select **"Download"** or **"Export"**
4. Save the JSON file to your computer

### **Step 2: Open the JSON File**
1. Open the downloaded JSON file in a text editor (VS Code, Notepad++, etc.)
2. Search for the Merge node by its ID: `"d94927ee-5c79-4c14-9044-d7efc9a826e4"`
3. You should find a node configuration that looks like this:

```json
{
  "parameters": {},
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3.2,
  "position": [-368, -624],
  "id": "d94927ee-5c79-4c14-9044-d7efc9a826e4",
  "name": "Merge Duplicate and Email"
}
```

### **Step 3: Replace the Parameters Field**

**Find this line**:
```json
"parameters": {},
```

**Replace it with**:
```json
"parameters": {
  "mode": "append"
},
```

**The complete node should now look like**:
```json
{
  "parameters": {
    "mode": "append"
  },
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3.2,
  "position": [-368, -624],
  "id": "d94927ee-5c79-4c14-9044-d7efc9a826e4",
  "name": "Merge Duplicate and Email"
}
```

### **Step 4: Save the JSON File**
1. Save the edited JSON file
2. Make sure the JSON is valid (no syntax errors)

### **Step 5: Import the Workflow**
1. Go back to N8N
2. Click **"Workflows"** in the left sidebar
3. Click **"Import from File"** or **"Import from URL"**
4. Select the edited JSON file
5. N8N will ask if you want to replace the existing workflow
6. Click **"Yes"** or **"Replace"**

### **Step 6: Verify the Configuration**
1. Open the imported workflow
2. Click on the "Merge Duplicate and Email" node
3. Verify that **Mode** is set to **"Append"**
4. Save the workflow

---

## **ALTERNATIVE: DIRECT JSON EDIT IN N8N (If Available)**

Some N8N versions allow direct JSON editing:

1. Open the workflow in N8N
2. Click the **"..."** menu
3. Look for **"Edit JSON"** or **"View JSON"** option
4. If available, edit the JSON directly in N8N
5. Find the Merge node and update the `parameters` field
6. Save the changes

---

## **VERIFICATION AFTER IMPORT**

### **Step 1: Check the Merge Node Configuration**
1. Open the Merge node
2. Verify **Mode** shows **"Append"**
3. Close the configuration panel

### **Step 2: Check the Workflow JSON**
1. Export the workflow again
2. Open the JSON file
3. Find the Merge node
4. Verify the `parameters` field now contains:
```json
"parameters": {
  "mode": "append"
}
```

### **Step 3: Test the Workflow**
1. Execute the workflow with a duplicate record
2. Verify no node reference error
3. Verify Status Update executes successfully
4. Check that status="DUPLICATE_SKIPPED"

### **Step 4: Test Non-Duplicate Path**
1. Execute the workflow with a non-duplicate record
2. Verify no node reference error
3. Verify Status Update executes successfully
4. Check that status="EMAIL_DRAFT_CREATED"

---

## **COMPLETE WORKFLOW NODES ARRAY EXAMPLE**

Here's how the Merge node should appear in the complete `nodes` array:

```json
{
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1.1,
      "position": [-1472, -400],
      "id": "f662a488-a907-4e71-acde-95bed2697272",
      "name": "Execute Workflow Trigger - From Orchestrator"
    },
    {
      "parameters": {
        "jsCode": "// ... code ..."
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-1280, -400],
      "id": "07d5b054-0fb8-4068-91e8-0384059fdf29",
      "name": "Outreach Input Processing"
    },
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
              "rightValue": true,
              "operator": {
                "type": "boolean",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [-1088, -560],
      "id": "03417c6d-588d-4f0f-9288-98538174c26b",
      "name": "If - Duplicate or not"
    },
    {
      "parameters": {
        "mode": "append"
      },
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3.2,
      "position": [-368, -624],
      "id": "d94927ee-5c79-4c14-9044-d7efc9a826e4",
      "name": "Merge Duplicate and Email"
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "models/gemini-2.0-flash",
          "mode": "list",
          "cachedResultName": "models/gemini-2.0-flash"
        },
        "messages": {
          "values": [
            {
              "content": "=You are an expert Email Outreach AI..."
            }
          ]
        },
        "jsonOutput": true,
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.googleGemini",
      "typeVersion": 1,
      "position": [-896, -384],
      "id": "2474af28-806f-4168-9a25-20c2f6fed5a9",
      "name": "AI Email Generation",
      "retryOnFail": true,
      "credentials": {
        "googlePalmApi": {
          "id": "J1a6B3PrYjoBMN32",
          "name": "Google Gemini(PaLM) Api account"
        }
      }
    },
    {
      "parameters": {
        "resource": "draft",
        "subject": "={{ JSON.parse($json.content.parts[0].text)[0].emailSubject }}",
        "message": "={{ JSON.parse($json.content.parts[0].text)[0].emailSubject }}",
        "options": {}
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [-544, -384],
      "id": "ce9f62db-a8f5-42ae-b169-27922f6b065c",
      "name": "Draft Gmail",
      "webhookId": "7a97ea05-8017-420d-b85c-fadc1dc6a8dc",
      "credentials": {
        "gmailOAuth2": {
          "id": "rEDqr1LkX2ZgxHLO",
          "name": "Gmail account"
        }
      }
    },
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
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "status": "={{ $('AI Email Generation').item ? 'EMAIL_DRAFT_CREATED' : 'DUPLICATE_SKIPPED' }}",
            "dedupeKey": "={{ $('Outreach Input Processing').item.json.tracking.dedupeKey }}",
            "emailSubject": "={{ $('AI Email Generation').item ? JSON.parse($('AI Email Generation').item.json.content.parts[0].text)[0].emailSubject : '' }}",
            "emailBody": "={{ $('AI Email Generation').item ? JSON.parse($('AI Email Generation').item.json.content.parts[0].text)[0].emailBody : '' }}",
            "emailTemplate": "={{ $('AI Email Generation').item ? JSON.parse($('AI Email Generation').item.json.content.parts[0].text)[0].emailMetadata.template : 'job-application-outreach' }}",
            "estimatedResponseRate": "={{ $('AI Email Generation').item ? JSON.parse($('AI Email Generation').item.json.content.parts[0].text)[0].emailMetadata.estimatedResponseRate : 0 }}"
          },
          "matchingColumns": ["dedupeKey"],
          "schema": []
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [-128, -384],
      "id": "ab2bff18-f152-4160-ae3c-f5e2d546b94a",
      "name": "Status Update",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "HnVkHdxofZiUvnda",
          "name": "Google Sheets account"
        }
      }
    }
  ]
}
```

---

## **TROUBLESHOOTING**

### **Issue 1: JSON Syntax Error After Edit**
**Cause**: Missing comma, bracket, or quote  
**Solution**: Use a JSON validator (jsonlint.com) to check for syntax errors

### **Issue 2: Import Fails**
**Cause**: Invalid JSON structure  
**Solution**: Re-download the original workflow and try editing again carefully

### **Issue 3: Mode Still Shows Empty After Import**
**Cause**: N8N might be stripping the default value again  
**Solution**: Try setting a different mode (e.g., "combine"), save, then change back to "append"

### **Issue 4: Error Still Persists After Import**
**Cause**: Workflow cache or validation cache  
**Solution**: 
1. Restart N8N server
2. Clear browser cache
3. Re-import the workflow

---

## **SUMMARY**

**Complete Merge Node Configuration**:
```json
{
  "parameters": {
    "mode": "append"
  },
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3.2,
  "position": [-368, -624],
  "id": "d94927ee-5c79-4c14-9044-d7efc9a826e4",
  "name": "Merge Duplicate and Email"
}
```

**Key Change**: `"parameters": {}` → `"parameters": {"mode": "append"}`

**Why This Works**: Explicitly setting the mode parameter (even though it's the default) tells N8N's validation system that the Merge node is a properly configured merge point, allowing it to recognize the connection path from AI Email Generation to Status Update.

**Expected Result**: After importing the corrected workflow, the node reference error will be resolved, and the workflow will execute successfully for both duplicate and non-duplicate records.

