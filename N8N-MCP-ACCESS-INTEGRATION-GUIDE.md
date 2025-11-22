# 🎯 N8N MCP Access Integration Guide

## **Executive Summary**

N8N's MCP Access feature allows external MCP clients (like Augment Code, Claude Desktop, etc.) to discover and execute N8N workflows through the Model Context Protocol. This is the **modern, recommended approach** for exposing N8N workflows to AI assistants.

---

## **Key Findings**

### **✅ What We've Confirmed**
1. **Admin Gateway workflow is MCP-enabled**: The workflow has `availableInMCP: true` setting (line 264 of workflow JSON)
2. **MCP Access is enabled**: Your N8N instance has MCP Access enabled at the instance level
3. **Authentication token is valid**: You have a valid MCP Access Token with audience `mcp-server-api`
4. **Workflow is active**: The Admin Gateway workflow is active and eligible for MCP access

### **❌ What Doesn't Work**
- **Direct HTTP requests to MCP endpoint fail**: The MCP endpoint (`/mcp-server/http`) requires MCP protocol communication via `supergateway` NPX package, not direct HTTP requests
- **PowerShell testing is not possible**: MCP protocol requires specialized client libraries (not raw HTTP)

---

## **N8N MCP Access Architecture**

### **How It Works**
```
MCP Client (Augment Code)
    ↓
MCP Protocol (via supergateway)
    ↓
N8N MCP Server (/mcp-server/http)
    ↓
Admin Gateway Workflow (availableInMCP: true)
    ↓
N8N Internal REST API
    ↓
Workflow Operations (List, Get, Create, Update)
```

### **Key Components**
1. **MCP Endpoint**: `https://n8n.srv972609.hstgr.cloud/mcp-server/http`
2. **Authentication**: Bearer token with `mcp-server-api` audience
3. **Transport**: HTTP via `supergateway` NPX package
4. **Protocol**: JSON-RPC 2.0 (MCP specification)

---

## **Authentication Details**

### **MCP Access Token**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjY4NTI4ODAzLTA4ODQtNGNlYi1hMjE5LWFiNjNkM2JmMGFmMyIsImlhdCI6MTc2Mzc4NzQ4NX0.6o5_FAQ54CAylQ2YRxtAoNrdYWSx7TTlA6ovNWCBQKY

Decoded Payload:
{
  "sub": "0aa3f394-4258-4544-8488-960d18baca6d",  // User ID
  "iss": "n8n",
  "aud": "mcp-server-api",  // MCP-specific audience
  "jti": "68528803-0884-4ceb-a219-ab63d3bf0af3",
  "iat": 1763787485
}
```

**Important**: This token is different from the REST API token (which has audience `public-api`)

---

## **Augment Code MCP Configuration**

### **Configuration File Location**
Augment Code uses MCP server configurations. The exact location depends on your Augment Code setup.

### **Required Configuration**
```json
{
  "mcpServers": {
    "n8n-admin-gateway": {
      "command": "npx",
      "args": [
        "-y",
        "supergateway",
        "--streamableHttp",
        "https://n8n.srv972609.hstgr.cloud/mcp-server/http",
        "--header",
        "authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjY4NTI4ODAzLTA4ODQtNGNlYi1hMjE5LWFiNjNkM2JmMGFmMyIsImlhdCI6MTc2Mzc4NzQ4NX0.6o5_FAQ54CAylQ2YRxtAoNrdYWSx7TTlA6ovNWCBQKY"
      ]
    }
  }
}
```

---

## **Admin Gateway Workflow Details**

### **Workflow ID**: `1Zl6AzNunb0ewnNh`
### **Workflow Name**: `Admin Gateway`
### **Status**: Active
### **MCP Access**: Enabled (`availableInMCP: true`)

### **Available Operations**
1. **list_workflows**: List all workflows in N8N instance
2. **get_workflow**: Get a specific workflow by ID
3. **create_workflow**: Create a new workflow
4. **update_workflow**: Update an existing workflow

### **Input Format**
```json
{
  "operation": "list_workflows|get_workflow|create_workflow|update_workflow",
  "payload": {
    // Operation-specific data
  }
}
```

---

## **Next Steps**

### **IMMEDIATE ACTION REQUIRED**

1. **Configure Augment Code MCP Server**
   - Add the N8N MCP server configuration to Augment Code's MCP settings
   - Use the configuration provided above
   - Restart Augment Code to load the new MCP server

2. **Test MCP Connection from Augment Code**
   - Ask Augment Code to list available MCP tools
   - Verify that "Admin Gateway" workflow appears in the list
   - Test calling the workflow operations via natural language

3. **Fix Webhook Response Mode** (for REST API fallback)
   - Open: https://n8n.srv972609.hstgr.cloud/workflow/1Zl6AzNunb0ewnNh
   - Click "Webhook Trigger" node
   - Change "Respond" from "Immediately" to "When Last Node Finishes"
   - Save workflow

---

## **Success Criteria**

✅ Augment Code can discover the Admin Gateway workflow via MCP  
✅ Augment Code can call workflow operations using natural language  
✅ Workflow operations return actual data (not just "Workflow was started")  
✅ All 4 operations work correctly (List, Get, Create, Update)  

---

## **Troubleshooting**

### **If MCP Connection Fails**
1. Verify Node.js is installed (required for `npx supergateway`)
2. Check that the MCP Access Token is correct
3. Confirm the N8N instance is publicly accessible
4. Review Augment Code logs for MCP connection errors

### **If Workflow Operations Return Empty Data**
1. Fix the webhook response mode (see "Fix Webhook Response Mode" above)
2. Verify the HTTP Request nodes have correct method configuration (POST/PATCH)
3. Check N8N execution logs for errors

---

## **Documentation References**

- **N8N MCP Access Docs**: https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/
- **MCP Specification**: https://modelcontextprotocol.io/
- **Supergateway Package**: https://www.npmjs.com/package/supergateway

