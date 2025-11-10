# Daily Execution Cap - Manual Implementation Guide

**Workflow**: LinkedIn-SEO-GmailOutlook-Orchestrator--Augment (ID: fGpR7xvrOO7PBa0c)  
**Implementation Date**: 2025-11-06  
**Total Nodes to Add**: 6  
**Total Connections to Create**: 8 (7 new + 1 removal)

---

## **STEP 1: Add 6 Nodes Using N8N UI**

For each node below, follow these steps in N8N UI:
1. Click the **"+"** button to add a new node
2. Search for the node type (e.g., "Google Sheets" or "Code")
3. Click **"Paste JSON"** in the node configuration panel
4. Paste the JSON configuration provided below
5. Click **"Save"**

---

### **NODE 1: Read Daily Execution Counter**

**Node Type**: Google Sheets (n8n-nodes-base.googleSheets v4.7)
**Position**: X: -1200, Y: 128

```json
{
  "nodes": [
    {
      "id": "cap-read-counter",
      "name": "Read Daily Execution Counter",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [-1200, 128],
      "parameters": {
        "operation": "read",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1aIEqn8Dz6sKchrcTf6imEgs3KTzI2Q6CMj46KsgChHA/edit?gid=0#gid=0",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "Logs-Execution-Cap",
          "mode": "name"
        },
        "filtersUI": {
          "values": [
            {
              "lookupColumn": "date",
              "lookupValue": "={{ $now.toFormat('yyyy-MM-dd') }}"
            }
          ]
        }
      },
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "HnVkHdxofZiUvnda",
          "name": "Google Sheets account"
        }
      }
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "a02c5ffd88865af83d53faf4becd2bff31912fb1f816639f33606241c691c12b"
  }
}
```

---

### **NODE 2: Calculate Remaining Capacity**

**Node Type**: Code (n8n-nodes-base.code v2)
**Position**: X: -1000, Y: 128

```json
{
  "nodes": [
    {
      "id": "cap-calculate-capacity",
      "name": "Calculate Remaining Capacity",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-1000, 128],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "// Calculate remaining capacity for today\nconst dailyLimit = 30;\nconst timezone = 'America/Los_Angeles';\n\n// Get current count from Google Sheets read\nconst counterData = $input.first().json;\nconst currentCount = parseInt(counterData.executionCount) || 0;\nconst timesLimitReached = parseInt(counterData.timesLimitReached) || 0;\n\n// Calculate remaining capacity\nconst remainingCapacity = Math.max(0, dailyLimit - currentCount);\n\n// Get jobs from previous node (Job Matching Workshop output)\nconst allJobs = $input.all().slice(1); // Skip first item (counter data)\nconst totalJobsAvailable = allJobs.length;\n\n// Determine how many jobs we can process\nconst jobsToProcess = Math.min(remainingCapacity, totalJobsAvailable);\nconst jobsToBlock = totalJobsAvailable - jobsToProcess;\n\n// Prepare output\nreturn {\n  json: {\n    currentCount: currentCount,\n    dailyLimit: dailyLimit,\n    remainingCapacity: remainingCapacity,\n    totalJobsAvailable: totalJobsAvailable,\n    jobsToProcess: jobsToProcess,\n    jobsToBlock: jobsToBlock,\n    hasCapacity: remainingCapacity > 0,\n    timesLimitReached: timesLimitReached,\n    timezone: timezone,\n    calculatedAt: new Date().toISOString()\n  }\n};"
      }
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "a02c5ffd88865af83d53faf4becd2bff31912fb1f816639f33606241c691c12b"
  }
}
```

---

### **NODE 3: Route Based on Capacity**

**Node Type**: Switch (n8n-nodes-base.switch v3.3)
**Position**: X: -800, Y: 128

```json
{
  "nodes": [
    {
      "id": "cap-route-capacity",
      "name": "Route Based on Capacity",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.3,
      "position": [-800, 128],
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "cap-condition-has-capacity",
                    "leftValue": "={{ $json.hasCapacity }}",
                    "rightValue": true,
                    "operator": {
                      "type": "boolean",
                      "operation": "true"
                    }
                  }
                ],
                "combinator": "and"
              }
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "cap-condition-no-capacity",
                    "leftValue": "={{ $json.hasCapacity }}",
                    "rightValue": false,
                    "operator": {
                      "type": "boolean",
                      "operation": "false"
                    }
                  }
                ],
                "combinator": "and"
              }
            }
          ]
        },
        "options": {}
      }
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "a02c5ffd88865af83d53faf4becd2bff31912fb1f816639f33606241c691c12b"
  }
}
```

---

### **NODE 4: Slice Jobs Array**

**Node Type**: Code (n8n-nodes-base.code v2)
**Position**: X: -600, Y: 50

```json
{
  "nodes": [
    {
      "id": "cap-slice-jobs",
      "name": "Slice Jobs Array",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-600, 50],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "// Get capacity calculation from previous node\nconst capacityData = $input.first().json;\nconst jobsToProcess = capacityData.jobsToProcess;\n\n// Get all jobs from Job Matching Workshop\n// Jobs are in items starting from index 1 (index 0 is capacity data)\nconst allJobItems = $input.all().slice(1);\n\n// Slice to only process the allowed number of jobs\nconst jobsToProcessArray = allJobItems.slice(0, jobsToProcess);\n\n// Return the sliced jobs array\nreturn jobsToProcessArray.map(item => ({\n  json: item.json,\n  pairedItem: { item: 0 }\n}));"
      }
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "a02c5ffd88865af83d53faf4becd2bff31912fb1f816639f33606241c691c12b"
  }
}
```

---

### **NODE 5: Increment Counter**

**Node Type**: Google Sheets (n8n-nodes-base.googleSheets v4.7)
**Position**: X: -400, Y: 50

```json
{
  "nodes": [
    {
      "id": "cap-increment-counter",
      "name": "Increment Counter",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [-400, 50],
      "parameters": {
        "operation": "update",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1aIEqn8Dz6sKchrcTf6imEgs3KTzI2Q6CMj46KsgChHA/edit?gid=0#gid=0",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "Logs-Execution-Cap",
          "mode": "name"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "executionCount": "={{ $('Calculate Remaining Capacity').item.json.currentCount + $('Slice Jobs Array').all().length }}"
          }
        },
        "filtersUI": {
          "values": [
            {
              "lookupColumn": "date",
              "lookupValue": "={{ $now.toFormat('yyyy-MM-dd') }}"
            }
          ]
        }
      },
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "HnVkHdxofZiUvnda",
          "name": "Google Sheets account"
        }
      }
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "a02c5ffd88865af83d53faf4becd2bff31912fb1f816639f33606241c691c12b"
  }
}
```

---

### **NODE 6: Log Limit Reached**

**Node Type**: Google Sheets (n8n-nodes-base.googleSheets v4.7)
**Position**: X: -600, Y: 200

```json
{
  "nodes": [
    {
      "id": "cap-log-limit-reached",
      "name": "Log Limit Reached",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [-600, 200],
      "parameters": {
        "operation": "update",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1aIEqn8Dz6sKchrcTf6imEgs3KTzI2Q6CMj46KsgChHA/edit?gid=0#gid=0",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "Logs-Execution-Cap",
          "mode": "name"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "timesLimitReached": "={{ $json.timesLimitReached + 1 }}",
            "lastBlockedAt": "={{ $now.toISO() }}"
          }
        },
        "filtersUI": {
          "values": [
            {
              "lookupColumn": "date",
              "lookupValue": "={{ $now.toFormat('yyyy-MM-dd') }}"
            }
          ]
        }
      },
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "HnVkHdxofZiUvnda",
          "name": "Google Sheets account"
        }
      }
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "a02c5ffd88865af83d53faf4becd2bff31912fb1f816639f33606241c691c12b"
  }
}
```

---

## **STEP 2: Create 8 Connections Using N8N UI**

After adding all 6 nodes, create the following connections by dragging from the output port of the source node to the input port of the target node.

### **Connection Instructions**

**IMPORTANT**: Before creating new connections, you must first **REMOVE** the existing direct connection from "Job Matching Scoring Workshop" to "Contact Enrichment Workshop".

---

### **🔴 CONNECTION 0: REMOVE EXISTING CONNECTION**

**Action**: Delete the existing connection
**From**: "Job Matching Scoring Workshop" (main output, port 0)
**To**: "Contact Enrichment Workshop" (main input, port 0)

**How to Remove**:
1. Click on the connection line between these two nodes
2. Press **Delete** key or click the trash icon

---

### **✅ CONNECTION 1: Job Matching → Read Counter**

**From**: "Job Matching Scoring Workshop" (main output, port 0)
**To**: "Read Daily Execution Counter" (main input, port 0)

---

### **✅ CONNECTION 2: Read Counter → Calculate Capacity**

**From**: "Read Daily Execution Counter" (main output, port 0)
**To**: "Calculate Remaining Capacity" (main input, port 0)

---

### **✅ CONNECTION 3: Calculate Capacity → Route**

**From**: "Calculate Remaining Capacity" (main output, port 0)
**To**: "Route Based on Capacity" (main input, port 0)

---

### **✅ CONNECTION 4: Route → Slice Jobs (Branch 1: Has Capacity)**

**From**: "Route Based on Capacity" (output port 0 - "Has Capacity" branch)
**To**: "Slice Jobs Array" (main input, port 0)

**Note**: This is the FIRST output port (top branch) of the Switch node

---

### **✅ CONNECTION 5: Route → Log Limit (Branch 2: No Capacity)**

**From**: "Route Based on Capacity" (output port 1 - "No Capacity" branch)
**To**: "Log Limit Reached" (main input, port 0)

**Note**: This is the SECOND output port (bottom branch) of the Switch node

---

### **✅ CONNECTION 6: Slice Jobs → Increment Counter**

**From**: "Slice Jobs Array" (main output, port 0)
**To**: "Increment Counter" (main input, port 0)

---

### **✅ CONNECTION 7: Increment Counter → Contact Enrichment**

**From**: "Increment Counter" (main output, port 0)
**To**: "Contact Enrichment Workshop" (main input, port 0)

---

## **STEP 3: Verify Implementation**

After completing all connections, verify the workflow structure:

### **Expected Node Count**: 20 nodes
- 14 original nodes
- 6 new Daily Execution Cap nodes

### **Expected Connection Count**: 18 connections
- 11 original connections
- 7 new connections (8 operations: 1 removal + 7 additions)

### **Expected Data Flow**:
```
Job Matching Scoring Workshop
    ↓
Read Daily Execution Counter
    ↓
Calculate Remaining Capacity
    ↓
Route Based on Capacity
    ├─ Branch 0 (Has Capacity)
    │   ↓
    │   Slice Jobs Array
    │   ↓
    │   Increment Counter
    │   ↓
    │   Contact Enrichment Workshop
    │
    └─ Branch 1 (No Capacity)
        ↓
        Log Limit Reached
        ↓
        [Workflow terminates]
```

---

## **STEP 4: Save and Test**

1. Click **"Save"** in the N8N UI to persist all changes
2. Activate the workflow if needed
3. Test with the following scenarios:
   - First execution of the day (counter = 0)
   - Mid-day execution (counter = 25)
   - Execution at limit (counter = 30)
   - Execution after daily reset
   - Multiple rapid executions

---

## **Troubleshooting**

### **Issue: "Node not found" error when creating connections**
**Solution**: Ensure all 6 nodes were successfully added before creating connections

### **Issue: Switch node only shows 1 output port**
**Solution**: The Switch node should automatically create 2 output ports based on the 2 rules configured. If not, check the node configuration JSON was pasted correctly.

### **Issue: Google Sheets credential error**
**Solution**: Ensure the credential ID "HnVkHdxofZiUvnda" exists in your N8N instance. If not, update the credential reference in Nodes 1, 5, and 6.

---

## **Next Steps After Implementation**

1. ✅ Confirm all 6 nodes are visible in the workflow
2. ✅ Confirm all 8 connections are created correctly
3. ✅ Save the workflow
4. ✅ Test the Daily Execution Cap functionality
5. ✅ Report back with test results

---

**Implementation Guide Version**: 1.0
**Last Updated**: 2025-11-06
**Author**: Augment Agent

