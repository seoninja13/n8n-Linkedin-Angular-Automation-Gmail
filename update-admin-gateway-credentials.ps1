$workflowId = "1Zl6AzNunb0ewnNh"
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$baseUrl = "https://n8n.srv972609.hstgr.cloud"

Write-Host "========================================="
Write-Host "  UPDATING ADMIN GATEWAY WORKFLOW"
Write-Host "  Adding API Key Authentication"
Write-Host "========================================="

# Step 1: Get current workflow
Write-Host "`n[1/3] Retrieving current workflow..."
$headers = @{
    "X-N8N-API-KEY" = $apiKey
    "Content-Type" = "application/json"
}

try {
    $workflow = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows/$workflowId" -Headers $headers -Method GET
    Write-Host "✅ Workflow retrieved successfully"
    Write-Host "   Name: $($workflow.name)"
    Write-Host "   Nodes: $($workflow.nodes.Count)"
} catch {
    Write-Host "❌ Failed to retrieve workflow: $($_.Exception.Message)"
    exit 1
}

# Step 2: Modify HTTP Request nodes
Write-Host "`n[2/3] Modifying HTTP Request nodes..."

$modified = $false
foreach ($node in $workflow.nodes) {
    if ($node.type -eq "n8n-nodes-base.httpRequest") {
        Write-Host "   - Updating: $($node.name)"
        
        # Set HTTP method for Create and Update nodes
        if ($node.name -eq "Create Workflow") {
            $node.parameters.method = "POST"
            Write-Host "     → Set method to POST"
            $modified = $true
        }
        if ($node.name -eq "Update Workflow") {
            $node.parameters.method = "PATCH"
            Write-Host "     → Set method to PATCH"
            $modified = $true
        }
    }
}

if (-not $modified) {
    Write-Host "   ⚠️  No changes needed for HTTP methods"
}

# Step 3: Update workflow
Write-Host "`n[3/3] Saving updated workflow..."

try {
    $updatePayload = $workflow | ConvertTo-Json -Depth 20 -Compress
    $result = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows/$workflowId" -Headers $headers -Method PUT -Body $updatePayload -ContentType "application/json"
    Write-Host "✅ Workflow updated successfully!"
    Write-Host "   Version ID: $($result.versionId)"
} catch {
    Write-Host "❌ Failed to update workflow: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "   Details: $($_.ErrorDetails.Message)"
    }
    exit 1
}

Write-Host "`n========================================="
Write-Host "  IMPORTANT: MANUAL STEP REQUIRED"
Write-Host "========================================="
Write-Host "`nThe HTTP methods have been set, but you MUST manually"
Write-Host "add the Header Auth credential in the N8N UI:"
Write-Host ""
Write-Host "1. Open: https://n8n.srv972609.hstgr.cloud/workflow/$workflowId"
Write-Host "2. For EACH HTTP Request node (List/Get/Create/Update):"
Write-Host "   - Click the node"
Write-Host "   - Authentication → Generic Credential Type → Header Auth"
Write-Host "   - Create credential:"
Write-Host "     Name: N8N API Key"
Write-Host "     Header Name: X-N8N-API-KEY"
Write-Host "     Header Value: $apiKey"
Write-Host "3. Save workflow"
Write-Host ""
Write-Host "This cannot be automated via API due to N8N security restrictions."

