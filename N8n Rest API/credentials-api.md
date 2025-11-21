# N8N Credentials API - Detailed Reference

**API Base:** `https://n8n.srv972609.hstgr.cloud/api/v1`

---

## ⚠️ CRITICAL LIMITATIONS

**Validation Date:** 2025-11-20

The N8N REST API has **severe limitations** for credential management:

| Operation | Status | Notes |
|-----------|--------|-------|
| ❌ List Credentials | **NOT SUPPORTED** | 405 Method Not Allowed |
| ❌ Get Credential by ID | **NOT SUPPORTED** | 405 Method Not Allowed |
| ✅ Create Credential | **SUPPORTED** | Works correctly |
| ❌ Update Credential | **NOT SUPPORTED** | 405 Method Not Allowed |
| ❌ Delete Credential | **NOT SUPPORTED** | Endpoint does not exist |

**For credential management, use:**
- **N8N Web UI** - Manual credential management
- **N8N MCP Server** - Programmatic control (if supported)

See [API Validation Report](./api-validation-report.md) for complete test results.

---

## 📋 Credentials Operations

### 1. ❌ List All Credentials (NOT SUPPORTED)

**Endpoint:** `GET /credentials`
**Status:** ❌ **405 Method Not Allowed**

**This operation is NOT supported by the N8N REST API.**

To view credentials, you must use the N8N Web UI.

**Query Parameters:**
- `filter` (optional): Filter credentials by name or type

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Gmail OAuth2",
      "type": "gmailOAuth2",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-20T14:00:00.000Z"
    },
    {
      "id": "2",
      "name": "Google Sheets OAuth2",
      "type": "googleSheetsOAuth2Api",
      "createdAt": "2025-01-15T10:05:00.000Z",
      "updatedAt": "2025-01-20T14:05:00.000Z"
    }
  ]
}
```

**PowerShell Example:**
```powershell
$credentials = Invoke-RestMethod -Uri "$baseUrl/credentials" -Headers $headers
$credentials.data | Format-Table id, name, type -AutoSize
```

---

### 2. Get Credential by ID

**Endpoint:** `GET /credentials/{credentialId}`

**Response:**
```json
{
  "id": "1",
  "name": "Gmail OAuth2",
  "type": "gmailOAuth2",
  "data": {
    "oauthTokenData": {
      "access_token": "[REDACTED]",
      "refresh_token": "[REDACTED]",
      "scope": "https://www.googleapis.com/auth/gmail.send",
      "token_type": "Bearer",
      "expiry_date": 1705747800000
    }
  },
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-20T14:00:00.000Z"
}
```

**Note:** Sensitive credential data is typically redacted or encrypted in API responses.

**PowerShell Example:**
```powershell
$credentialId = "1"
$credential = Invoke-RestMethod -Uri "$baseUrl/credentials/$credentialId" -Headers $headers
$credential | ConvertTo-Json -Depth 5
```

---

### 3. Create New Credential

**Endpoint:** `POST /credentials`

**Request Body:**
```json
{
  "name": "New API Key",
  "type": "httpHeaderAuth",
  "data": {
    "name": "X-API-Key",
    "value": "your-api-key-here"
  }
}
```

**PowerShell Example:**
```powershell
$newCredential = @{
    name = "Apollo.io API Key"
    type = "httpHeaderAuth"
    data = @{
        name = "X-API-Key"
        value = "your-apollo-api-key"
    }
} | ConvertTo-Json -Depth 5

$created = Invoke-RestMethod -Uri "$baseUrl/credentials" `
    -Method POST -Headers $headers -Body $newCredential -ContentType "application/json"
```

---

### 4. Update Credential

**Endpoint:** `PATCH /credentials/{credentialId}`

**Request Body:**
```json
{
  "name": "Updated Credential Name",
  "data": {
    "value": "new-api-key-value"
  }
}
```

**PowerShell Example:**
```powershell
$update = @{
    name = "Gmail OAuth2 - Updated"
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri "$baseUrl/credentials/$credentialId" `
    -Method PATCH -Headers $headers -Body $update -ContentType "application/json"
```

---

### 5. Delete Credential

**Endpoint:** `DELETE /credentials/{credentialId}`

**Response:**
```json
{
  "success": true
}
```

**PowerShell Example:**
```powershell
Invoke-RestMethod -Uri "$baseUrl/credentials/$credentialId" -Method DELETE -Headers $headers
```

---

## 🔑 Common Credential Types

### Gmail OAuth2
```json
{
  "name": "Gmail OAuth2",
  "type": "gmailOAuth2",
  "data": {
    "oauthTokenData": {
      "access_token": "...",
      "refresh_token": "...",
      "scope": "https://www.googleapis.com/auth/gmail.send",
      "token_type": "Bearer"
    }
  }
}
```

### Google Sheets OAuth2
```json
{
  "name": "Google Sheets OAuth2",
  "type": "googleSheetsOAuth2Api",
  "data": {
    "oauthTokenData": {
      "access_token": "...",
      "refresh_token": "...",
      "scope": "https://www.googleapis.com/auth/spreadsheets"
    }
  }
}
```

### HTTP Header Authentication
```json
{
  "name": "API Key Auth",
  "type": "httpHeaderAuth",
  "data": {
    "name": "X-API-Key",
    "value": "your-api-key"
  }
}
```

### Basic Authentication
```json
{
  "name": "Basic Auth",
  "type": "httpBasicAuth",
  "data": {
    "user": "username",
    "password": "password"
  }
}
```

---

## 🎯 LinkedIn Automation Credentials

### Required Credentials
1. **Gmail OAuth2** - For sending outreach emails
2. **Google Sheets OAuth2** - For tracking and data storage
3. **Google Docs OAuth2** - For resume generation
4. **Apollo.io API Key** - For contact enrichment
5. **NeverBounce API Key** - For email verification
6. **Apify API Token** - For LinkedIn job scraping

### Credential Verification Script
```powershell
# Check all required credentials
$requiredTypes = @(
    "gmailOAuth2",
    "googleSheetsOAuth2Api",
    "googleDocsOAuth2Api",
    "httpHeaderAuth"  # For Apollo.io, NeverBounce, Apify
)

$credentials = Invoke-RestMethod -Uri "$baseUrl/credentials" -Headers $headers

Write-Host "`n🔑 Credential Status Check:" -ForegroundColor Cyan
foreach ($type in $requiredTypes) {
    $found = $credentials.data | Where-Object { $_.type -eq $type }
    if ($found) {
        Write-Host "✅ $type - Found ($($found.Count) credential(s))" -ForegroundColor Green
    } else {
        Write-Host "❌ $type - Missing" -ForegroundColor Red
    }
}
```

---

## ⚠️ Security Best Practices

1. **Never Log Credentials:** Do not log or print credential data
2. **Use Environment Variables:** Store API keys in environment variables
3. **Rotate Regularly:** Update credentials periodically
4. **Limit Scope:** Use minimum required OAuth scopes
5. **Monitor Usage:** Track credential usage in execution logs

### Secure Credential Storage
```powershell
# Store API key securely
$secureKey = Read-Host "Enter API Key" -AsSecureString
$encryptedKey = ConvertFrom-SecureString $secureKey
$encryptedKey | Out-File "secure-key.txt"

# Retrieve API key
$encryptedKey = Get-Content "secure-key.txt"
$secureKey = ConvertTo-SecureString $encryptedKey
$apiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
)
```

---

## 🔍 Troubleshooting

### Check Credential Validity
```powershell
# Test Gmail credential
$gmailCred = $credentials.data | Where-Object { $_.type -eq "gmailOAuth2" } | Select-Object -First 1
if ($gmailCred) {
    Write-Host "Testing Gmail credential: $($gmailCred.name)"
    # Trigger a test workflow that uses Gmail
}
```

### Refresh OAuth Tokens
OAuth tokens expire and need to be refreshed. N8N handles this automatically, but you can check token expiry:

```powershell
$credential = Invoke-RestMethod -Uri "$baseUrl/credentials/$credentialId" -Headers $headers
$expiryDate = [DateTimeOffset]::FromUnixTimeMilliseconds($credential.data.oauthTokenData.expiry_date)
Write-Host "Token expires: $($expiryDate.LocalDateTime)"
```

---

## 📊 Credential Usage Tracking

### Find Workflows Using Credential
```powershell
$credentialId = "1"
$workflows = Invoke-RestMethod -Uri "$baseUrl/workflows" -Headers $headers

$usingCredential = $workflows.data | Where-Object {
    $workflow = Invoke-RestMethod -Uri "$baseUrl/workflows/$($_.id)" -Headers $headers
    $workflow.nodes | Where-Object { $_.credentials -and $_.credentials.PSObject.Properties.Value.id -eq $credentialId }
}

Write-Host "`n📊 Workflows using credential $credentialId :" -ForegroundColor Cyan
$usingCredential | Format-Table id, name -AutoSize
```

---

## 🔗 Related Documentation

- [Main README](./README.md)
- [Workflow Management API](./workflow-management-api.md)
- [Testing Guide](./testing-guide.md)

