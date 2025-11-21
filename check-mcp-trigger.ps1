$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$headers = @{"X-N8N-API-KEY" = $apiKey}

Write-Output "Retrieving Main MCP Server Workflow..."
$mainWorkflow = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/kPhABZnv2pc7LMF0" -Headers $headers -Method GET

Write-Output ""
Write-Output "Looking for MCP Server Trigger node..."
$mcpTrigger = $mainWorkflow.nodes | Where-Object { $_.type -eq "@n8n/n8n-nodes-langchain.mcpTrigger" }

if ($mcpTrigger) {
    Write-Output ""
    Write-Output "MCP Trigger Node Found: $($mcpTrigger.name)"
    Write-Output ""
    Write-Output "Node Parameters:"
    $mcpTrigger.parameters | ConvertTo-Json -Depth 5
    Write-Output ""
    Write-Output "Node Credentials:"
    $mcpTrigger.credentials | ConvertTo-Json -Depth 5
} else {
    Write-Output "ERROR: MCP Trigger node not found!"
}

