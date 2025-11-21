$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$headers = @{"X-N8N-API-KEY" = $apiKey}

Write-Output "Checking Main MCP Server Workflow..."
$mainWorkflow = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/kPhABZnv2pc7LMF0" -Headers $headers -Method GET

Write-Output ""
Write-Output "Main Workflow: $($mainWorkflow.name)"
Write-Output "Status: $(if ($mainWorkflow.active) { 'ACTIVE' } else { 'INACTIVE' })"
Write-Output ""

Write-Output "Checking Sub-Workflow..."
$subWorkflow = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/Q5pmP4961YnR9nJ9" -Headers $headers -Method GET

Write-Output "Sub-Workflow: $($subWorkflow.name)"
Write-Output "Status: $(if ($subWorkflow.active) { 'ACTIVE' } else { 'INACTIVE' })"

