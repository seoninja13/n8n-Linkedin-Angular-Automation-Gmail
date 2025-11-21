$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$headers = @{"X-N8N-API-KEY" = $apiKey}
$workflowId = "kPhABZnv2pc7LMF0"

Write-Output "Restarting MCP Server Workflow..."
Write-Output ""

# Deactivate
Write-Output "[1/3] Deactivating workflow..."
$deactivatePayload = @{ active = $false } | ConvertTo-Json
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/$workflowId" -Headers $headers -Method PATCH -Body $deactivatePayload -ContentType "application/json" | Out-Null
Write-Output "      Workflow deactivated"

# Wait a moment
Start-Sleep -Seconds 2

# Activate
Write-Output "[2/3] Activating workflow..."
$activatePayload = @{ active = $true } | ConvertTo-Json
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/$workflowId" -Headers $headers -Method PATCH -Body $activatePayload -ContentType "application/json" | Out-Null
Write-Output "      Workflow activated"

# Verify
Write-Output "[3/3] Verifying status..."
$workflow = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/$workflowId" -Headers $headers -Method GET
Write-Output "      Status: $(if ($workflow.active) { 'ACTIVE' } else { 'INACTIVE' })"
Write-Output ""
Write-Output "MCP Server restarted successfully!"
Write-Output "MCP Endpoint: https://n8n.srv972609.hstgr.cloud/mcp/280d443c-acac-4af8-8ac6-8851f16ab1af"

