# 🔧 Admin Gateway - Missing HTTP Request Credentials Fix

## **Problem Identified**

The Admin Gateway workflow is returning **500 Internal Server Error** because the HTTP Request nodes are missing authentication credentials to access N8N's internal REST API.

---

## **Root Cause Analysis**

### **Current Configuration**
All 4 HTTP Request nodes are configured to call N8N's internal REST API:
- **List Workflows**: `{{$env.N8N_HOST}}/rest/workflows`
- **Get Workflow**: `{{$env.N8N_HOST}}/rest/workflows/{{$json.payload.id}}`
- **Create Workflow**: `{{$env.N8N_HOST}}/rest/workflows`
- **Update Workflow**: `{{$env.N8N_HOST}}/rest/workflows/{{$json.payload.id}}`

### **Missing Component**
None of these HTTP Request nodes have authentication credentials configured. They need the N8N API key to access the REST API.

---

## **Solution: Add API Key Authentication**

### **Step 1: Configure HTTP Request Nodes**

For **EACH** of the 4 HTTP Request nodes (List Workflows, Get Workflow, Create Workflow, Update Workflow):

1. Open workflow: https://n8n.srv972609.hstgr.cloud/workflow/1Zl6AzNunb0ewnNh
2. Click on the HTTP Request node
3. Scroll down to **"Authentication"** section
4. Select **"Generic Credential Type"** → **"Header Auth"**
5. Click **"Create New Credential"** or select existing "N8N API Key" credential

### **Step 2: Create N8N API Key Credential** (if not exists)

**Credential Type**: Header Auth

**Configuration**:
- **Name**: `N8N API Key`
- **Header Name**: `X-N8N-API-KEY`
- **Header Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q`

### **Step 3: Apply Credential to All HTTP Request Nodes**

Apply the "N8N API Key" credential to:
1. ✅ **List Workflows** node
2. ✅ **Get Workflow** node
3. ✅ **Create Workflow** node
4. ✅ **Update Workflow** node

### **Step 4: Configure HTTP Methods**

While you're editing the nodes, also verify/set the correct HTTP methods:

- **List Workflows**: Method = `GET` (default, OK)
- **Get Workflow**: Method = `GET` (default, OK)
- **Create Workflow**: Method = `POST` ⚠️ **MUST SET**
- **Update Workflow**: Method = `PATCH` ⚠️ **MUST SET**

### **Step 5: Save Workflow**

Click **"Save"** in the top-right corner.

---

## **Alternative Solution: Use N8N Internal API (No Auth Required)**

If you want to avoid managing API credentials, you can use N8N's internal API which doesn't require authentication when called from within N8N workflows.

### **Change URLs from**:
```
{{$env.N8N_HOST}}/rest/workflows
```

### **To**:
```
{{$env.WEBHOOK_URL.split('/webhook')[0]}}/api/v1/workflows
```

**Note**: This approach uses the public API endpoint but accessed internally, which may still require authentication. The Header Auth approach above is more reliable.

---

## **Testing After Fix**

Once credentials are added, test with PowerShell:

```powershell
$headers = @{
    "Header-Auth" = "CpVT9i5oU3jtIMkUJEU6X8uowOw71Z2x"
    "Content-Type" = "application/json"
}

$payload = @{
    operation = "list_workflows"
    payload = @{}
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/webhook/admin-gateway" -Headers $headers -Method POST -Body $payload

# Should return actual workflow data, not error
$response | ConvertTo-Json -Depth 3
```

---

## **Expected Result After Fix**

✅ **list_workflows** returns array of workflows with names, IDs, status  
✅ **get_workflow** returns complete workflow details  
✅ **create_workflow** creates new workflow and returns its data  
✅ **update_workflow** updates workflow and returns updated data  

---

## **Summary**

**Issue**: HTTP Request nodes missing authentication credentials  
**Fix**: Add "N8N API Key" Header Auth credential to all 4 HTTP Request nodes  
**Time**: ~5 minutes  
**Priority**: HIGH - Blocks all workflow operations  

