# N8N MCP Server - Smithery CLI Configuration Test Guide

## ✅ Configuration Status

**Your Configuration:**
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@smithery/cli@latest",
        "run",
        "@vincentmcleese/n8n-mcp",
        "--key",
        "b9d48b71-b4a2-4204-8d5b-bae73dea16b3",
        "--profile",
        "angry-hyena-RE0DI8"
      ]
    }
  }
}
```

**Configuration Details:**
- ✅ **Server**: `@vincentmcleese/n8n-mcp` (24,404+ uses)
- ✅ **Method**: Smithery CLI (correct approach)
- ✅ **Profile**: `angry-hyena-RE0DI8`
- ✅ **Key**: `b9d48b71-b4a2-4204-8d5b-bae73dea16b3`

## 🧪 Testing Steps

### Step 1: Verify Smithery CLI Installation
```bash
# Test if Smithery CLI is accessible
npx @smithery/cli@latest --version

# Test the specific server
npx @smithery/cli@latest run @vincentmcleese/n8n-mcp --help
```

### Step 2: Test MCP Server Connection
```bash
# Test the exact command from your configuration
cmd /c npx -y @smithery/cli@latest run @vincentmcleese/n8n-mcp --key b9d48b71-b4a2-4204-8d5b-bae73dea16b3 --profile angry-hyena-RE0DI8
```

### Step 3: Verify N8N Instance Connection
The server should automatically connect to your N8N instance. Expected output should show:
- Server initialization
- N8N API connection status
- Available tools count (should be 39 with API key, 22 without)

## 🎯 Expected Capabilities

### Documentation Tools (Always Available)
1. **`tools_documentation`** - Get help with MCP tools
2. **`search_nodes`** - Search 535+ N8N nodes
3. **`get_node_essentials`** - Get key properties (10-20 essential fields)
4. **`list_nodes`** - Browse nodes by category
5. **`validate_node_operation`** - Validate configurations
6. **`list_ai_tools`** - Access 263 AI-capable nodes

### Management Tools (Requires Valid API Key)
7. **`n8n_create_workflow`** - Create workflows
8. **`n8n_list_workflows`** - List existing workflows
9. **`n8n_health_check`** - Check N8N connectivity
10. **`n8n_trigger_webhook_workflow`** - Execute workflows

## 🔧 Troubleshooting

### Issue 1: Server Not Accessible in Augment Code
**Symptoms**: Can't access MCP tools through Augment Code interface
**Solutions**:
1. **Restart Augment Code** after configuration
2. **Check system-wide settings** are properly saved
3. **Verify Smithery CLI** is installed and accessible

### Issue 2: API Key Expiration (Critical)
**Your API Key Expires**: 2025-09-08 (TODAY!)
**Symptoms**: 401 Unauthorized errors, limited tools available

**Solution - Update API Key**:
1. **Get New API Key**:
   - Go to: https://n8n.srv972609.hstgr.cloud
   - Navigate: Settings → API Keys
   - Create new API key
   - Copy the new key

2. **Update Smithery Profile**:
   ```bash
   # Update your profile with new N8N credentials
   npx @smithery/cli@latest profile update angry-hyena-RE0DI8 \
     --n8n-api-url "https://n8n.srv972609.hstgr.cloud" \
     --n8n-api-key "YOUR_NEW_API_KEY"
   ```

### Issue 3: Connection Timeout
**Symptoms**: Server takes too long to respond
**Solutions**:
1. **Check N8N Instance**: Verify https://n8n.srv972609.hstgr.cloud is accessible
2. **Network Issues**: Test from different network
3. **Server Load**: Smithery servers might be busy

## 🧪 Manual Testing Commands

### Test 1: Basic Connection
```bash
# Test if the server starts
npx @smithery/cli@latest run @vincentmcleese/n8n-mcp \
  --key b9d48b71-b4a2-4204-8d5b-bae73dea16b3 \
  --profile angry-hyena-RE0DI8 \
  --test-connection
```

### Test 2: List Available Tools
```bash
# Should show all available MCP tools
npx @smithery/cli@latest run @vincentmcleese/n8n-mcp \
  --key b9d48b71-b4a2-4204-8d5b-bae73dea16b3 \
  --profile angry-hyena-RE0DI8 \
  --list-tools
```

## 🎯 Verification Checklist

### ✅ Basic Functionality
- [ ] Smithery CLI responds to commands
- [ ] MCP server starts without errors
- [ ] Server shows available tools count
- [ ] Documentation tools are accessible

### ✅ N8N Integration
- [ ] Connection to https://n8n.srv972609.hstgr.cloud succeeds
- [ ] API key authentication works (or shows 401 if expired)
- [ ] Can search N8N nodes
- [ ] Can get node configurations

### ✅ Augment Code Integration
- [ ] MCP server appears in Augment Code
- [ ] Tools are accessible through Augment Code interface
- [ ] Can execute MCP commands successfully

## 🚨 Critical Next Steps

### 1. API Key Renewal (URGENT)
Your API key expires TODAY. Get a new one immediately:
1. Login to N8N instance
2. Create new API key
3. Update Smithery profile

### 2. Test Documentation Tools
Even with expired API key, these should work:
- Search nodes
- Get configurations
- Validate workflows

### 3. Full Integration Test
Once API key is renewed:
- Test workflow creation
- Test workflow execution
- Verify all 39 tools are available

## 📞 Support Resources

- **Smithery Documentation**: https://smithery.ai/docs
- **N8N MCP Server**: https://smithery.ai/server/@vincentmcleese/n8n-mcp
- **N8N API Docs**: https://docs.n8n.io/api/

---

**Status**: Configuration looks correct. Main issue is likely the expired API key. Renew it first, then test the integration!
