# Plan: Add Email Tracking and Duplicate Prevention to LinkedIn Automation Specialist (qsOwrB0ngdZVEqmO) using ONLY n8n MCP tools

This document is an executable plan to implement Google Sheets–based duplicate prevention and email tracking on workflow `qsOwrB0ngdZVEqmO` using only the n8n MCP tools (no browser automation). It includes precise tool calls, configuration payloads, batching strategy, error-handling workarounds, and verification steps.

Reference index: See README-index.md for navigation.

---

## Goals
- Enforce limits: Apify results = 20; Matched resumes = 10
- Insert duplicate-prevention check between `Wait` → `Write the custom Email body`
- Log sent emails after `Send Email`, then continue the loop
- Use Google Sheets Spreadsheet ID: `1SvaDTMITBlYreEF-xVdh9KyDNlMK8j7jZfytUMLe6yo`, sheet/tab: `Tracking`
- Use existing credential named: `Google Sheets account`

## Node names to reference (existing)
- "Limit Apify results - 313"
- "Limit Matched Resumes - 313"
- "Wait"
- "Write the custom Email body"
- "Send Email"
- "Loop Over Items"

## New nodes to add
- Build Tracking Fields (n8n-nodes-base.set)
- Email Tracking - Upsert (precheck) (n8n-nodes-base.googleSheets)
- Duplicate Found? (n8n-nodes-base.if)
- Email Tracking - Upsert (log sent) (n8n-nodes-base.googleSheets)

---

## 1) Exact MCP tool calls

Always prefer `n8n_update_partial_workflow` in <=5-op batches. Use `validateOnly: true` first to catch schema issues, then re-run with `validateOnly: false`.

### 1.1 Update testing limits (Batch L1)
```
functions.n8n_update_partial_workflow_n8n-mcp {
  id: "qsOwrB0ngdZVEqmO",
  operations: [
    { type: "updateNode", nodeName: "Limit Apify results - 313", changes: { "parameters.maxItems": 20 } },
    { type: "updateNode", nodeName: "Limit Matched Resumes - 313", changes: { "parameters.maxItems": 10 } }
  ]
}
```

### 1.2 Insert duplicate precheck chain (Batch D1)
Add 3 nodes and the first two connections; remove direct Wait→EmailBody.
```
functions.n8n_update_partial_workflow_n8n-mcp {
  id: "qsOwrB0ngdZVEqmO",
  validateOnly: true,
  operations: [
    { type: "addNode", node: {
        name: "Build Tracking Fields", type: "n8n-nodes-base.set", typeVersion: 3.4, position: [1500,-2350],
        parameters: { assignments: { assignments: [
          { id: "t1", name: "timestamp", type: "string", value: "={{ $now }}" },
          { id: "t2", name: "companyName", type: "string", value: "={{ $json.companyName || $json.company || $json.organization || '' }}" },
          { id: "t3", name: "jobTitle", type: "string", value: "={{ $json.title || $json.jobTitle || '' }}" },
          { id: "t4", name: "jobUrl", type: "string", value: "={{ $json.link || $json.jobUrl || $json.url || '' }}" },
          { id: "t5", name: "recipientEmail", type: "string", value: "={{ $json.email || $json.recipient || '' }}" },
          { id: "t6", name: "status", type: "string", value: "=precheck" },
          { id: "t7", name: "dedupeKey", type: "string",
            value: "={{ ( ($json.companyName || $json.company || '').toString().toLowerCase().trim() ) + '|' + ( ($json.title || $json.jobTitle || '').toString().toLowerCase().trim() ) }}" }
        ]}} }
    },
    { type: "addNode", node: {
        name: "Email Tracking - Upsert (precheck)", type: "n8n-nodes-base.googleSheets", typeVersion: 4, position: [1660,-2350],
        parameters: {
          operation: "appendOrUpdate",
          documentId: "1SvaDTMITBlYreEF-xVdh9KyDNlMK8j7jZfytUMLe6yo",
          sheetName: "Tracking",
          columnToMatchOn: "G",
          valueInputMode: "RAW",
          columns: [
            { column: "A", value: "={{ $json.timestamp }}" },
            { column: "B", value: "={{ $json.companyName }}" },
            { column: "C", value: "={{ $json.jobTitle }}" },
            { column: "D", value: "={{ $json.jobUrl }}" },
            { column: "E", value: "={{ $json.recipientEmail }}" },
            { column: "F", value: "={{ $json.status }}" },
            { column: "G", value: "={{ $json.dedupeKey }}" }
          ]
        },
        continueOnFail: true,
        credentials: { googleSheetsOAuth2Api: { name: "Google Sheets account" } }
    } },
    { type: "addNode", node: {
        name: "Duplicate Found?", type: "n8n-nodes-base.if", typeVersion: 2, position: [1840,-2350],
        parameters: { conditions: { boolean: [ { value1: "={{ $json.updated }}", operation: "isTrue" } ] } }
    } },
    { type: "removeConnection", source: "Wait", target: "Write the custom Email body", sourceOutput: "main", targetInput: "main" },
    { type: "addConnection", source: "Wait", target: "Build Tracking Fields", sourceOutput: "main", targetInput: "main" }
  ]
}
```
Apply with `validateOnly: false` if validation passes.

### 1.3 Wire precheck to IF branches (Batch D2)
```
functions.n8n_update_partial_workflow_n8n-mcp {
  id: "qsOwrB0ngdZVEqmO",
  validateOnly: true,
  operations: [
    { type: "addConnection", source: "Build Tracking Fields", target: "Email Tracking - Upsert (precheck)", sourceOutput: "main", targetInput: "main" },
    { type: "addConnection", source: "Email Tracking - Upsert (precheck)", target: "Duplicate Found?", sourceOutput: "main", targetInput: "main" },
    { type: "addConnection", source: "Duplicate Found?", target: "Write the custom Email body", sourceOutput: "false", targetInput: "main" },
    { type: "addConnection", source: "Duplicate Found?", target: "Loop Over Items", sourceOutput: "true", targetInput: "main" },
    { type: "removeConnection", source: "Send Email", target: "Loop Over Items", sourceOutput: "main", targetInput: "main" }
  ]
}
```
Apply with `validateOnly: false` if validation passes.

### 1.4 Add sent-logging and rewire loop end (Batch D3)
```
functions.n8n_update_partial_workflow_n8n-mcp {
  id: "qsOwrB0ngdZVEqmO",
  validateOnly: true,
  operations: [
    { type: "addNode", node: {
        name: "Email Tracking - Upsert (log sent)", type: "n8n-nodes-base.googleSheets", typeVersion: 4, position: [1750,-2200],
        parameters: {
          operation: "appendOrUpdate",
          documentId: "1SvaDTMITBlYreEF-xVdh9KyDNlMK8j7jZfytUMLe6yo",
          sheetName: "Tracking",
          columnToMatchOn: "G",
          valueInputMode: "RAW",
          columns: [
            { column: "A", value: "={{ $now }}" },
            { column: "B", value: "={{ $('Build Tracking Fields').item.json.companyName }}" },
            { column: "C", value: "={{ $('Build Tracking Fields').item.json.jobTitle }}" },
            { column: "D", value: "={{ $('Build Tracking Fields').item.json.jobUrl }}" },
            { column: "E", value: "={{ $('Build Tracking Fields').item.json.recipientEmail }}" },
            { column: "F", value: "=sent" },
            { column: "G", value: "={{ $('Build Tracking Fields').item.json.dedupeKey }}" }
          ]
        },
        continueOnFail: true,
        credentials: { googleSheetsOAuth2Api: { name: "Google Sheets account" } }
    } },
    { type: "addConnection", source: "Send Email", target: "Email Tracking - Upsert (log sent)", sourceOutput: "main", targetInput: "main" },
    { type: "addConnection", source: "Email Tracking - Upsert (log sent)", target: "Loop Over Items", sourceOutput: "main", targetInput: "main" }
  ]
}
```
Apply with `validateOnly: false` if validation passes.

---

## 2) Google Sheets node configuration details
- Node type: `n8n-nodes-base.googleSheets` (typeVersion: 4)
- Credentials: `{ googleSheetsOAuth2Api: { name: "Google Sheets account" } }` (for partial updates). If using full updates, MUST be the credential UUID string (see §3.2).
- Shared parameters for both nodes:
  - `parameters.operation`: `appendOrUpdate`
  - `parameters.documentId`: `1SvaDTMITBlYreEF-xVdh9KyDNlMK8j7jZfytUMLe6yo`
  - `parameters.sheetName`: `Tracking`
  - `parameters.columnToMatchOn`: `G`
  - `parameters.valueInputMode`: `RAW`
  - `parameters.columns`: A..G as mapped above
  - `continueOnFail`: `true`

Expressions used:
- timestamp: `={{ $now }}`
- companyName: `={{ $json.companyName || $json.company || $json.organization || '' }}`
- jobTitle: `={{ $json.title || $json.jobTitle || '' }}`
- jobUrl: `={{ $json.link || $json.jobUrl || $json.url || '' }}`
- recipientEmail: `={{ $json.email || $json.recipient || '' }}`
- status (precheck): `=precheck`; status (log): `=sent`
- dedupeKey:
  `={{ ( ($json.companyName || $json.company || '').toString().toLowerCase().trim() ) + '|' + ( ($json.title || $json.jobTitle || '').toString().toLowerCase().trim() ) }}`

Duplicate detection logic:
- IF node checks: `={{ $json.updated }}` is true on output of the precheck upsert.
  - true → duplicate → jump to `Loop Over Items`
  - false → new → continue to `Write the custom Email body`

---

## 3) Execution strategy and fallbacks

### 3.1 If partial updates fail with `settings must NOT have additional properties`
- Retry the same batch with `validateOnly: false` (some instances mis-handle validateOnly)
- Split batches further (1–3 ops) to isolate the failing operation
- If still failing, proceed to §3.2 full update path

### 3.2 Full update path (requires credential UUIDs)
- Use `functions.n8n_get_workflow_n8n-mcp` to fetch the current workflow
- Reconstruct a full payload for `functions.n8n_update_full_workflow_n8n-mcp`:
  - Keep all existing nodes as-is BUT transform each `node.credentials.<type>` from an object to a string equal to its credential **id** (UUID)
  - Add the 4 new nodes and updated connections
  - Update the two limit nodes’ `parameters.maxItems`
- Caveat: You must know the UUID for the `Google Sheets account` credential to attach it in the full update. If unknown, first add the Sheets nodes **without** credentials via partial updates (if allowed), then attach credentials via a subsequent partial update by name.

### 3.3 Sheet/tab provisioning (optional)
- If the `Tracking` tab is missing, add a temporary Google Sheets `createSheet` node and execute it once manually; or run a one-off `append` (Sheets will auto-create columns if needed). Keep `continueOnFail: true` on workflow runs.

---

## 4) Verification plan (MCP-only friendly)
1. Validate structure
```
functions.n8n_validate_workflow_n8n-mcp { id: "qsOwrB0ngdZVEqmO" }
```
- Expect no connection errors; warnings for community nodes are OK.

2. Manual execution (UI action required to run a Manual Trigger workflow)
- Run the workflow once; then fetch executions:
```
functions.n8n_list_executions_n8n-mcp { limit: 1, workflowId: "qsOwrB0ngdZVEqmO", includeData: true }
```
- Inspect the latest execution graph:
  - Path A (duplicate): "Duplicate Found?" → true → no draft/send; loop continues
  - Path B (new): draft → send → "Email Tracking - Upsert (log sent)" → loop continues

3. Validate Sheets logging
- Confirm rows exist in `Tracking` with expected A..G values.

4. Confirm limits effective
- Check that Apify items processed ≤ 20 and matched resumes ≤ 10.

---

## 5) Rollback
- To remove the feature, delete the three added connections and two Google Sheets nodes; reconnect `Wait` → `Write the custom Email body`; restore `Send Email` → `Loop Over Items`.

## 6) Operational notes
- Keep `continueOnFail: true` on both Sheets nodes to avoid halting the loop on transient Sheets errors.
- If the IF node cannot rely on `$json.updated`, insert a Sheets `getRows` filtered by dedupeKey and change the IF condition to `rows.length > 0`.

