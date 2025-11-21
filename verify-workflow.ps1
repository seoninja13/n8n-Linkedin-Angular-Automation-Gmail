$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$headers = @{"X-N8N-API-KEY" = $apiKey}

Write-Output "Checking current workflow state..."
$workflow = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/Q5pmP4961YnR9nJ9" -Headers $headers -Method GET

$n8nNode = $workflow.nodes | Where-Object { $_.type -eq "n8n-nodes-base.n8n" }

Write-Output ""
Write-Output "Current Node Parameters:"
$n8nNode.parameters | ConvertTo-Json -Depth 5

