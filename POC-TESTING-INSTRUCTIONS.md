# 🧪 Proof-of-Concept Testing Instructions

## **CURRENT BLOCKER: Webhook Authentication**

The Admin Gateway workflow is configured with Header Auth, but we don't know the correct header name/value to use for testing.

---

## **OPTION 1: Disable Authentication (Recommended for POC)**

### **Steps**:
1. Open the workflow: https://n8n.srv972609.hstgr.cloud/workflow/1Zl6AzNunb0ewnNh
2. Click on the "Webhook Trigger" node
3. Change **Authentication** from "Header Auth" to "None"
4. Click "Save"

### **Then test with PowerShell**:
```powershell
$payload = @{
    operation = "list_workflows"
    payload = @{}
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" -Headers $headers -Method POST -Body $payload
```

---

## **OPTION 2: Find the Correct Header Auth Credentials**

### **Steps**:
1. Open the workflow: https://n8n.srv972609.hstgr.cloud/workflow/1Zl6AzNunb0ewnNh
2. Click on the "Webhook Trigger" node
3. Click on the "Header Auth account" credential
4. Note the **Header Name** and **Header Value**
5. Use those values in the PowerShell test

### **Then test with PowerShell**:
```powershell
$payload = @{
    operation = "list_workflows"
    payload = @{}
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "<HEADER_NAME>" = "<HEADER_VALUE>"  # Replace with actual values
}

Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" -Headers $headers -Method POST -Body $payload
```

---

## **COMPLETE TEST SUITE (After Authentication is Fixed)**

### **Test 1: List Workflows**
```powershell
$payload = @{
    operation = "list_workflows"
    payload = @{}
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" -Headers $headers -Method POST -Body $payload
Write-Host "✅ List Workflows: Returned $($response.Count) workflows"
```

### **Test 2: Get Workflow**
```powershell
# Replace with an actual workflow ID from Test 1
$workflowId = "1Zl6AzNunb0ewnNh"

$payload = @{
    operation = "get_workflow"
    payload = @{
        id = $workflowId
    }
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" -Headers $headers -Method POST -Body $payload
Write-Host "✅ Get Workflow: Retrieved workflow '$($response.name)'"
```

### **Test 3: Create Workflow**
```powershell
$payload = @{
    operation = "create_workflow"
    payload = @{
        name = "Test Workflow POC"
        nodes = @(
            @{
                parameters = @{}
                id = "test-node-1"
                name = "Start"
                type = "n8n-nodes-base.start"
                typeVersion = 1
                position = @(250, 300)
            }
        )
        connections = @{}
        active = $false
        settings = @{}
    }
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" -Headers $headers -Method POST -Body $payload
Write-Host "✅ Create Workflow: Created workflow with ID '$($response.id)'"
```

### **Test 4: Update Workflow**
```powershell
# Use the workflow ID from Test 3
$workflowId = $response.id

$payload = @{
    operation = "update_workflow"
    payload = @{
        id = $workflowId
        name = "Test Workflow POC (Updated)"
        nodes = @(
            @{
                parameters = @{}
                id = "test-node-1"
                name = "Start"
                type = "n8n-nodes-base.start"
                typeVersion = 1
                position = @(250, 300)
            }
        )
        connections = @{}
        active = $false
        settings = @{}
    }
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" -Headers $headers -Method POST -Body $payload
Write-Host "✅ Update Workflow: Updated workflow name to '$($response.name)'"
```

---

## **SUCCESS CRITERIA**

✅ All 4 operations return successful responses (HTTP 200)  
✅ List Workflows returns an array of workflows  
✅ Get Workflow returns a complete workflow object  
✅ Create Workflow returns a new workflow with assigned ID  
✅ Update Workflow returns the updated workflow object  

---

## **NEXT STEPS AFTER POC SUCCESS**

1. Document the working configuration
2. Re-enable authentication (if disabled for testing)
3. Configure Augment Code to use the Admin Gateway MCP endpoint
4. Test MCP Access from Augment Code
5. Consider adding the 3 missing operations (Delete, Activate, Deactivate) if needed

