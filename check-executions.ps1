$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNjg5MDc0fQ.CPTnEXKOdANnBKGlHTx8AdnDrjysjVBEAJVN3p5at6Q"
$headers = @{"X-N8N-API-KEY" = $apiKey}
$workflowId = "kPhABZnv2pc7LMF0"

Write-Output "Checking recent executions for MCP Server workflow..."
Write-Output ""

try {
    $executions = Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/executions?workflowId=$workflowId&limit=5" -Headers $headers -Method GET
    
    if ($executions.data.Count -eq 0) {
        Write-Output "No executions found for this workflow."
    } else {
        Write-Output "Recent Executions:"
        Write-Output ""
        foreach ($exec in $executions.data) {
            Write-Output "Execution ID: $($exec.id)"
            Write-Output "  Status: $($exec.status)"
            Write-Output "  Started: $($exec.startedAt)"
            Write-Output "  Finished: $($exec.finishedAt)"
            if ($exec.status -eq "error") {
                Write-Output "  Error: $($exec.data.resultData.error.message)"
            }
            Write-Output ""
        }
    }
} catch {
    Write-Output "Error retrieving executions: $($_.Exception.Message)"
}

