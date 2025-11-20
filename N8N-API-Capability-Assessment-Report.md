# N8N REST API COMPREHENSIVE CAPABILITY ASSESSMENT

**Assessment Date:** 2025-01-19  
**N8N Instance:** https://n8n.srv972609.hstgr.cloud/api/v1  
**Total Endpoints Tested:** 45  
**Assessment Method:** PowerShell REST API calls with X-N8N-API-KEY authentication

---

## Executive Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ **Fully Supported** | 11 | 24.4% |
| ⚠️ **Partially Supported / Errors** | 17 | 37.8% |
| ❌ **Not Supported** | 17 | 37.8% |

**Key Finding:** PowerShell REST API provides **full support for core workflow and execution monitoring operations**, which are the most critical capabilities for debugging and workflow management. However, many advanced features (node management, health checks, workflow triggering) are not available via the public REST API.

---

## Detailed Capability Matrix

### ✅ FULLY SUPPORTED OPERATIONS (11)

These operations work perfectly via PowerShell REST API:

#### **Workflow Management (2)**
| Operation | Method | Endpoint |
|-----------|--------|----------|
| List all workflows | GET | `/workflows` |
| Get workflow by ID | GET | `/workflows/{id}` |

#### **Execution Monitoring (4)**
| Operation | Method | Endpoint |
|-----------|--------|----------|
| List executions for workflow | GET | `/executions?workflowId={id}&limit={n}` |
| List all executions | GET | `/executions?limit={n}` |
| Get execution by ID | GET | `/executions/{id}` |
| Filter executions by status | GET | `/executions?status={status}&limit={n}` |

#### **Workflow Triggering (1)**
| Operation | Method | Endpoint |
|-----------|--------|----------|
| Retry failed execution | POST | `/executions/{id}/retry` |

#### **Credentials (1)**
| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create credential | POST | `/credentials` |

#### **User Management (1)**
| Operation | Method | Endpoint |
|-----------|--------|----------|
| List users | GET | `/users` |

#### **Tags (2)**
| Operation | Method | Endpoint |
|-----------|--------|----------|
| List tags | GET | `/tags` |
| Create tag | POST | `/tags` |

---

### ⚠️ PARTIALLY SUPPORTED / ERRORS (17)

These endpoints exist but have issues (405 Method Not Allowed, 400 Bad Request, 403 Forbidden):

#### **Workflow Management (3)**
| Operation | Method | Endpoint | Issue |
|-----------|--------|----------|-------|
| Create new workflow | POST | `/workflows` | 400 Bad Request - likely missing required fields |
| Update workflow | PATCH | `/workflows/{id}` | 405 Method Not Allowed - may require PUT instead |
| Activate/Deactivate workflow | PATCH | `/workflows/{id}` | 405 Method Not Allowed - may require PUT instead |

#### **Execution Monitoring (1)**
| Operation | Method | Endpoint | Issue |
|-----------|--------|----------|-------|
| Delete execution | DELETE | `/executions/{id}` | 400 Bad Request - endpoint exists but request format invalid |

#### **Credentials (3)**
| Operation | Method | Endpoint | Issue |
|-----------|--------|----------|-------|
| List credentials | GET | `/credentials` | 405 Method Not Allowed |
| Get credential by ID | GET | `/credentials/{id}` | 405 Method Not Allowed |
| Update credential | PATCH | `/credentials/{id}` | 405 Method Not Allowed |

#### **User Management (4)**
| Operation | Method | Endpoint | Issue |
|-----------|--------|----------|-------|
| Get current user | GET | `/users/me` | 400 Bad Request |
| Create user | POST | `/users` | 400 Bad Request - likely missing required fields |
| Update user | PATCH | `/users/{id}` | 405 Method Not Allowed |
| Delete user | DELETE | `/users/{id}` | 400 Bad Request |

#### **Audit (1)**
| Operation | Method | Endpoint | Issue |
|-----------|--------|----------|-------|
| Get audit logs | GET | `/audit` | 405 Method Not Allowed |

#### **Tags (1)**
| Operation | Method | Endpoint | Issue |
|-----------|--------|----------|-------|
| Update tag | PATCH | `/tags/{id}` | 405 Method Not Allowed |

#### **Workflow Import (1)**
| Operation | Method | Endpoint | Issue |
|-----------|--------|----------|-------|
| Import workflow from JSON | POST | `/workflows/import` | 405 Method Not Allowed |

#### **Variables (2)**
| Operation | Method | Endpoint | Issue |
|-----------|--------|----------|-------|
| List environment variables | GET | `/variables` | 403 Forbidden - requires admin permissions |
| Create variable | POST | `/variables` | 403 Forbidden - requires admin permissions |

#### **Permissions Note:**
The 403 Forbidden errors for Variables endpoints suggest these operations require elevated permissions (instance owner or admin role) beyond the API key used in testing.

---

### ❌ NOT SUPPORTED OPERATIONS (17)

These endpoints return 404 Not Found and are not available in the N8N REST API:

#### **Workflow Management (1)**
- Delete workflow: `DELETE /workflows/{id}`

#### **Workflow Triggering (2)**
- Trigger workflow execution: `POST /workflows/{id}/execute`
- Stop running execution: `POST /executions/{id}/stop`

#### **Credentials (2)**
- Delete credential: `DELETE /credentials/{id}`
- Test credential: `POST /credentials/{id}/test`

#### **Node Management (2)**
- List available node types: `GET /node-types`
- Get node type details: `GET /node-types/{type}`

#### **Configuration (1)**
- Get instance settings: `GET /settings`

#### **Tags (1)**
- Delete tag: `DELETE /tags/{id}`

#### **Additional Endpoints (8)**
- Export workflow to JSON: `GET /workflows/{id}/export`
- Duplicate workflow: `POST /workflows/{id}/duplicate`
- Get execution logs: `GET /executions/{id}/logs`
- Trigger webhook workflow: `POST /webhook/{path}`
- Get source control status: `GET /source-control/status`
- Get license information: `GET /license`
- Health check: `GET /health`

---

## Comparison: PowerShell REST API vs MCP Servers

| Capability | PowerShell REST API | N8N MCP Servers (n8n-mcp-czlon) |
|-----------|---------------------|----------------------------------|
| **Retrieve workflow definitions** | ✅ Yes (GET /workflows/{id}) | ❌ No |
| **Retrieve execution history** | ✅ Yes (GET /executions) | ❌ No |
| **Retrieve execution error logs** | ✅ Yes (GET /executions/{id}) | ❌ No |
| **Create/update/delete workflows** | ⚠️ Partial (create/update have issues) | ❌ No |
| **Trigger workflows** | ❌ No (404 Not Found) | ✅ Yes (if MCP enabled in N8N settings) |
| **Manage credentials** | ⚠️ Partial (create works, list/get/update have 405 errors) | ❌ No |
| **Manage users** | ⚠️ Partial (list works, others have issues) | ❌ No |
| **Node documentation** | ❌ No | ✅ Yes (22 documentation tools) |
| **Workflow validation** | ❌ No | ✅ Yes (validate_workflow tools) |
| **Template search** | ❌ No | ✅ Yes (search_templates, list_templates) |

**Conclusion:** PowerShell REST API and MCP servers are **complementary tools**:
- **PowerShell REST API**: Best for workflow management, execution monitoring, and debugging
- **N8N MCP Servers**: Best for node documentation, workflow validation, and template discovery

---

## Recommendations

### For Workflow Management
✅ **USE PowerShell REST API**
- List workflows: `GET /workflows`
- Get workflow details: `GET /workflows/{id}`
- ⚠️ Create workflows: `POST /workflows` (requires correct request format)

### For Execution Debugging
✅ **USE PowerShell REST API**
- List executions: `GET /executions?workflowId={id}&limit={n}`
- Get execution details: `GET /executions/{id}`
- Filter by status: `GET /executions?status=error&limit={n}`
- Retry failed execution: `POST /executions/{id}/retry`

### For Node Documentation
✅ **USE n8n-mcp-czlon MCP Server**
- `search_nodes`: Find nodes by keyword
- `get_node_documentation`: Get readable docs with examples
- `get_node_essentials`: Get node info with real-world examples

### For Workflow Validation
✅ **USE n8n-mcp-czlon MCP Server**
- `validate_workflow`: Full workflow validation
- `validate_workflow_connections`: Check connections only
- `validate_workflow_expressions`: Check N8N expressions

### For Template Discovery
✅ **USE n8n-mcp-czlon MCP Server**
- `search_templates`: Find templates by keyword
- `list_templates`: Browse all templates
- `get_template`: Get complete workflow JSON

---

## Known Limitations

### 1. PATCH Method Issues (405 Method Not Allowed)
Many endpoints return 405 errors for PATCH requests:
- `/workflows/{id}` (update/activate/deactivate)
- `/credentials/{id}` (update)
- `/users/{id}` (update)
- `/tags/{id}` (update)

**Possible Solutions:**
- Try using `PUT` instead of `PATCH`
- Check N8N API documentation for correct HTTP method
- Verify API version compatibility

### 2. Workflow Triggering Not Available
The endpoint `POST /workflows/{id}/execute` returns 404 Not Found.

**Alternative Solutions:**
- Use webhook triggers configured in workflows
- Use N8N MCP Server HTTP endpoint (if enabled in N8N settings)
- Use N8N CLI or UI for manual triggering

### 3. Node Management Not Available
Endpoints for node types (`/node-types`) return 404 Not Found.

**Alternative Solutions:**
- Use n8n-mcp-czlon MCP server for node documentation
- Access node information through N8N UI
- Use workflow JSON to inspect node configurations

### 4. No Health Check Endpoint
The `/health` endpoint returns 404 Not Found.

**Alternative Solutions:**
- Test API availability by calling `GET /workflows`
- Monitor workflow execution success rates
- Use external monitoring tools

---

## Technical Notes

### Authentication
All successful requests used:
```powershell
$headers = @{"X-N8N-API-KEY" = "your-api-key-here"}
```

### Error Codes Observed
- **200 OK**: Successful operation
- **400 Bad Request**: Endpoint exists but request format invalid
- **403 Forbidden**: Requires elevated permissions
- **404 Not Found**: Endpoint does not exist
- **405 Method Not Allowed**: HTTP method not supported for this endpoint

### PowerShell Example
```powershell
# List all workflows
$apiKey = "your-api-key"
$baseUrl = "https://n8n.srv972609.hstgr.cloud/api/v1"
$headers = @{"X-N8N-API-KEY" = $apiKey}

$workflows = Invoke-RestMethod -Uri "$baseUrl/workflows" -Method GET -Headers $headers
$workflows | Format-Table id, name, active

# Get execution details
$execution = Invoke-RestMethod -Uri "$baseUrl/executions/11711" -Method GET -Headers $headers
$execution | ConvertTo-Json -Depth 10
```

---

## Conclusion

The N8N REST API via PowerShell provides **robust support for the most critical operations**:
- ✅ **Workflow retrieval and inspection**
- ✅ **Execution monitoring and debugging**
- ✅ **Execution retry functionality**
- ✅ **User and tag management**

However, it has **significant gaps** in:
- ❌ **Workflow triggering** (must use webhooks or MCP server)
- ❌ **Node management** (must use MCP server for documentation)
- ❌ **Advanced operations** (export, duplicate, health checks)

**For comprehensive N8N automation**, use **both PowerShell REST API and n8n-mcp-czlon MCP server** as complementary tools.

---

**Assessment completed:** 2025-01-19
**Raw data:** `n8n-api-capability-results.csv`
**Test script:** `test-n8n-api-simple.ps1`

