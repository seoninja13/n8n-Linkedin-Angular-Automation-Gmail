# 🔧 Admin Gateway - Switch Node Configuration Fix

## **MANUAL FIX INSTRUCTIONS**

The N8N REST API is rejecting the Switch node configuration. You need to manually configure the Switch node in the N8N UI.

### **STEP 1: Open the Admin Gateway Workflow**

1. Go to: https://n8n.srv972609.hstgr.cloud/workflow/1Zl6AzNunb0ewnNh
2. Click on the "Route Operation" Switch node

### **STEP 2: Configure Switch Node Settings**

**Mode**: Rules

**Add 7 Rules** (one for each operation):

#### **Rule 1: list_workflows**
- **Condition**: String
  - **Value 1**: `{{ $json.operation }}`
  - **Operation**: equals
  - **Value 2**: `list_workflows`
- **Output Name**: list_workflows

#### **Rule 2: get_workflow**
- **Condition**: String
  - **Value 1**: `{{ $json.operation }}`
  - **Operation**: equals
  - **Value 2**: `get_workflow`
- **Output Name**: get_workflow

#### **Rule 3: create_workflow**
- **Condition**: String
  - **Value 1**: `{{ $json.operation }}`
  - **Operation**: equals
  - **Value 2**: `create_workflow`
- **Output Name**: create_workflow

#### **Rule 4: update_workflow**
- **Condition**: String
  - **Value 1**: `{{ $json.operation }}`
  - **Operation**: equals
  - **Value 2**: `update_workflow`
- **Output Name**: update_workflow

#### **Rule 5: delete_workflow**
- **Condition**: String
  - **Value 1**: `{{ $json.operation }}`
  - **Operation**: equals
  - **Value 2**: `delete_workflow`
- **Output Name**: delete_workflow

#### **Rule 6: activate_workflow**
- **Condition**: String
  - **Value 1**: `{{ $json.operation }}`
  - **Operation**: equals
  - **Value 2**: `activate_workflow`
- **Output Name**: activate_workflow

#### **Rule 7: deactivate_workflow**
- **Condition**: String
  - **Value 1**: `{{ $json.operation }}`
  - **Operation**: equals
  - **Value 2**: `deactivate_workflow`
- **Output Name**: deactivate_workflow

### **STEP 3: Connect Switch Outputs to Nodes**

After configuring the rules, connect each Switch output to the corresponding HTTP Request node:

1. **list_workflows** output → "List Workflows" node
2. **get_workflow** output → "Get Workflow" node
3. **create_workflow** output → "Create Workflow" node
4. **update_workflow** output → "Update Workflow" node
5. **delete_workflow** output → "Delete Workflow (Safe Mode)" node
6. **activate_workflow** output → (NEW NODE - see Step 4)
7. **deactivate_workflow** output → (NEW NODE - see Step 5)

### **STEP 4: Add "Activate Workflow" HTTP Request Node**

1. Add a new HTTP Request node
2. Name: "Activate Workflow"
3. Configuration:
   - **Method**: POST
   - **URL**: `{{ $env.N8N_HOST }}/rest/workflows/{{ $json.payload.id }}/activate`
   - **Authentication**: None (uses internal N8N API)
4. Connect this node to:
   - **Input**: Switch node output 5 (activate_workflow)
   - **Output**: "Return Response" node

### **STEP 5: Add "Deactivate Workflow" HTTP Request Node**

1. Add a new HTTP Request node
2. Name: "Deactivate Workflow"
3. Configuration:
   - **Method**: POST
   - **URL**: `{{ $env.N8N_HOST }}/rest/workflows/{{ $json.payload.id }}/deactivate`
   - **Authentication**: None (uses internal N8N API)
4. Connect this node to:
   - **Input**: Switch node output 6 (deactivate_workflow)
   - **Output**: "Return Response" node

### **STEP 6: Save and Test**

1. Click "Save" in the workflow editor
2. The workflow should now have 11 nodes total:
   - 1 Webhook Trigger
   - 1 Parse Operation (Function)
   - 1 Route Operation (Switch) ← NOW CONFIGURED
   - 7 HTTP Request nodes (List, Get, Create, Update, Delete, Activate, Deactivate)
   - 1 Return Response

---

## **VERIFICATION**

After completing the manual configuration, test the workflow using PowerShell:

```powershell
$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
    "Content-Type" = "application/json"
}

$testPayload = @{
    operation = "list_workflows"
    payload = @{}
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" -Headers $headers -Method POST -Body $testPayload
```

**Expected Result**: Array of all workflows in your N8N instance.

