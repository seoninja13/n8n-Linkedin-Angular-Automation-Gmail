# Daily Log: N8N MCP Authentication Fix

**Date**: 2025-11-19  
**Session Time**: 23:30 - 00:00 UTC  
**Focus**: Resolving N8N MCP server authentication failure  
**Status**: ✅ **COMPLETE - AWAITING CLAUDE DESKTOP RESTART**

---

## **SESSION SUMMARY**

Successfully diagnosed and resolved the N8N MCP server authentication failure that was blocking all workflow verification and management operations. Root cause identified as expired JWT token (expired 2025-11-19 23:00:00 UTC). New API key obtained from user and both project config and Claude Desktop config updated. Awaiting Claude Desktop restart to activate N8N MCP server.

---

## **WORK COMPLETED**

### **1. Root Cause Analysis**

**Symptom**: All N8N MCP tool operations failing with "Failed to authenticate with n8n. Please check your API key" error

**Investigation Steps**:
1. ✅ Checked N8N MCP diagnostic tool - reported "configured" and "connected" but actual operations failed
2. ✅ Checked environment variables - N8N_API_KEY NOT set in PowerShell session
3. ✅ Checked Claude Desktop config - Found config only contains Perplexity MCP, NOT N8N MCP
4. ✅ Found project-local config - Located `claude_desktop_config.json` in project root with N8N MCP configuration
5. ✅ Tested API key directly - Received 401 Unauthorized from N8N REST API
6. ✅ Decoded JWT token - Discovered expiration timestamp

**Root Cause Identified**:
- **Issue**: N8N API key (JWT token) expired on 2025-11-19 23:00:00 UTC
- **Token Details**:
  - Issued At: 2025-10-21 18:29:39 UTC (Unix: 1761071379)
  - Expires: 2025-11-19 23:00:00 UTC (Unix: 1763593200)
  - Lifetime: ~29 days
  - Subject ID: 0aa3f394-4258-4544-8488-960d18baca6d

**Secondary Issue**:
- N8N MCP server configuration exists in project directory but NOT in Claude Desktop config location
- Claude Desktop was not loading N8N MCP server at all

### **2. Solution Implementation**

**Step 1: New API Key Obtained**
- User generated new N8N API key at: https://n8n.srv972609.hstgr.cloud/settings/api
- New API key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNTk1NDM2fQ.s8nyh35tgs2m7PO76zUVUVlCCDWoV4oZWep341vZbrg`
- Issued At: 1763595436 (Unix timestamp)
- **Note**: This token does NOT have an expiration field (`exp`), suggesting it may be a long-lived or non-expiring token

**Step 2: Verified New API Key**
- ✅ Tested new API key with direct REST API call to N8N
- ✅ Successfully retrieved workflow list (5 workflows)
- ✅ Confirmed API key is valid and working

**Step 3: Updated Project Config**
- ✅ Updated `claude_desktop_config.json` in project root with new API key
- File: `c:\Users\IvoD\repos\N8N\Linkedin-Angular-Automation-Gmail\n8n-Linkedin-Angular-Automation-Gmail\claude_desktop_config.json`

**Step 4: Updated Claude Desktop Config**
- ✅ Added N8N MCP server configuration to `%APPDATA%\Claude\claude_desktop_config.json`
- File: `C:\Users\JR\AppData\Roaming\Claude\claude_desktop_config.json`
- ✅ Verified config now contains both Perplexity MCP and N8N MCP servers

**Step 5: Created Automation Script**
- ✅ Created `Scripts/update-claude-config.ps1` for future API key updates
- Script automates the process of updating Claude Desktop config with new N8N API key

### **3. Configuration Details**

**N8N MCP Server Configuration**:
```json
{
  "command": "npx",
  "args": ["-y", "n8n-mcp"],
  "env": {
    "MCP_MODE": "stdio",
    "LOG_LEVEL": "error",
    "DISABLE_CONSOLE_OUTPUT": "true",
    "N8N_API_URL": "https://n8n.srv972609.hstgr.cloud",
    "N8N_API_KEY": "<NEW_API_KEY>"
  }
}
```

---

## **NEXT STEPS**

### **Immediate (User Action Required)**:
1. ⏳ **Restart Claude Desktop** (close completely and reopen)
2. ⏳ **Start new conversation** or continue this one after restart
3. ⏳ **Verify N8N MCP tools are available** (I will test authentication)

### **After Restart (Automated)**:
1. ✅ Verify N8N MCP authentication using `n8n_list_workflows`
2. ✅ Retrieve workflow structure using `n8n_get_workflow_structure` (ID: WUe4y8iYEXNAB6dq)
3. ✅ Verify dual-path test mode architecture implementation
4. ✅ Generate comprehensive verification report

---

## **KEY LEARNINGS**

### **N8N API Key Lifecycle**:
- N8N API keys are JWT tokens with expiration dates
- Default lifetime: ~29 days
- Newer API keys may not have expiration (long-lived tokens)
- API keys must be renewed before expiration to avoid service disruption

### **Troubleshooting N8N MCP Authentication**:
1. Check if API key has expired by decoding JWT token
2. Verify Claude Desktop config contains N8N MCP server configuration
3. Test API key directly with REST API before updating configs
4. Always update both project config and Claude Desktop config
5. Restart Claude Desktop after config changes

### **JWT Token Decoding**:
```powershell
# Decode JWT token to check expiration
$token = "<JWT_TOKEN>"
$parts = $token.Split('.')
$payload = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($parts[1]))
$payloadObj = $payload | ConvertFrom-Json
$exp = $payloadObj.exp
$iat = $payloadObj.iat
```

---

## **DOCUMENTATION UPDATED**

- ✅ Daily Log: `Docs/daily-logs/2025-11-19-n8n-mcp-authentication-fix.md` (this file)
- ⏳ Knowledge Transfer: `Docs/handover/conversation-handover-knowledge-transfer.md` (pending)
- ⏳ Project Operations Manual: `Docs/project-operations-manual.md` (pending)
- ⏳ Linear Ticket: Create ticket for dual-path architecture verification (pending)

---

## **REFERENCES**

- **N8N Instance**: https://n8n.srv972609.hstgr.cloud
- **N8N API Settings**: https://n8n.srv972609.hstgr.cloud/settings/api
- **Target Workflow**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment (ID: WUe4y8iYEXNAB6dq)
- **Automation Script**: `Scripts/update-claude-config.ps1`

