# N8N Workflow Development Best Practices

Essential guidelines for working with N8N workflows in this project.

## 1. Always Read Workflow JSON Before Modifying

**Why**: Understand current state before making changes

**How**:
- Use Admin Gateway Webhook: `.\check-workflow-current-state.ps1`
- Use N8N MCP Server (after instance restart)
- Or export from N8N UI

**Never**:
- Make changes based on assumptions
- Modify workflows without seeing current configuration

---

## 2. Preserve Binary Data

**Why**: Resume attachments and file data require special handling

**Correct Pattern**:
```javascript
// Reference binary data from source node
$('Node Name').item.binary
```

**Example**:
```javascript
// Get resume from Resume Generation Workshop
const resumeData = $('Resume Generation Workshop').item.binary.resume;
```

**Never**:
- Convert binary to text/JSON
- Lose binary data in transformations
- Forget to pass binary through intermediate nodes

---

## 3. Test Routing Logic Carefully

**Why**: Switch node routing rules are case-sensitive and whitespace-sensitive

**Critical Details**:
- Trailing newlines break routing
- Case must match exactly
- Whitespace matters

**Testing Checklist**:
```
✓ Copy/paste routing values exactly
✓ Check for trailing spaces/newlines
✓ Verify case sensitivity
✓ Test both positive and negative paths
```

**Example Issue**:
```
❌ "Draft Mode\n" (trailing newline)
✅ "Draft Mode" (no trailing newline)
```

---

## 4. Verify Google Sheets Parameters

**Why**: N8N v4.7 has serialization bugs with Google Sheets nodes

**Always Check**:
- `resource` parameter (must be set)
- `operation` parameter (must be set)
- Operation-specific parameters (documentId, range, values)

**Common Bug**:
```json
{
  "parameters": {
    "operation": "append"
    // ❌ Missing "resource": "sheet"
  }
}
```

**Fix**:
1. Open node in N8N UI
2. Re-select dropdown value
3. Save workflow

---

## 5. Check Execution Data for Root Cause

**Why**: Error messages can be misleading

**Don't Rely On**:
- Error message text alone
- First error in logs
- Assumptions about failure point

**Do Instead**:
1. Download full execution JSON
2. Trace data flow through all nodes
3. Check each node's input/output
4. Verify routing paths taken

**Example**:
```
❌ Error says "Test Mode Router broken"
✅ Reality: Draft nodes using wrong API endpoint
```

---

## 6. Use Sub-Workflow Architecture Correctly

**Why**: Parent workflows call sub-workflows via Execute Workflow nodes

**Critical Understanding**:
- Sub-workflows with Execute Workflow Trigger nodes are DESIGNED to remain INACTIVE
- Inactive sub-workflow = CORRECT behavior, not a bug
- Parent workflow activation triggers sub-workflow execution

**Check Trigger Type**:
```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      // ✅ This workflow should be INACTIVE
    }
  ]
}
```

---

## 7. Default to Sequential Processing

**Why**: N8N does NOT support native parallel execution

**Critical Limitation**:
- Code nodes with multiple output connections only execute the FIRST connection
- True parallel execution requires webhook-triggered sub-workflows (complex, 4-6 hours)
- Sequential processing is the default N8N behavior

**Impact**:
- Resume Generation Workshop's 4-Agent Architecture requires sequential execution
- Don't try to parallelize within a single workflow
- Use separate orchestrated workflows for parallel tasks

**See**: [n8n-parallel-execution-limitations.md](../architecture/n8n-parallel-execution-limitations.md)

---

## 8. Apply Quality Gates Before Deployment

**Why**: Prevent low-quality emails from being sent

**4 Critical Quality Gates**:
1. Would you actually send this email?
2. Would this get a response?
3. Does this represent the candidate professionally?
4. Is this better than a manual application?

**Decision Rule**: If ANY answer is "NO", system FAILS and deployment is BLOCKED.

**See**: [linkedin-automation-testing-criteria.md](../testing/linkedin-automation-testing-criteria.md)

---

## 9. Update Documentation After Significant Changes

**Why**: Maintain knowledge continuity across sessions

**Update These Files**:
- `Docs/handover/conversation-handover-knowledge-transfer.md` - Session knowledge
- `CLAUDE.md` - If architectural changes
- `Docs/troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md` - If new issues discovered

**Use Command**:
```bash
/cd-update-docs
```

---

## Quick Reference Checklist

**Before Modifying Workflow**:
- [ ] Read current workflow JSON
- [ ] Understand data flow
- [ ] Identify binary data nodes
- [ ] Check routing logic

**During Development**:
- [ ] Preserve binary data references
- [ ] Verify Google Sheets parameters
- [ ] Test all routing paths
- [ ] Use sequential processing (no parallel attempts)

**Before Deployment**:
- [ ] Apply 4 quality gates
- [ ] Test with testMode=true (drafts only)
- [ ] Check execution data for errors
- [ ] Update documentation

**After Deployment**:
- [ ] Monitor first few executions
- [ ] Verify email quality
- [ ] Check for errors
- [ ] Document any issues

---

## Common Anti-Patterns

### ❌ Don't Do This

**1. Parallel Execution Attempts**
```
Code Node → Output 1 → Node A
          → Output 2 → Node B
// ❌ Only Node A will execute
```

**2. Ignoring Binary Data**
```javascript
// ❌ Converting binary to JSON
const resume = JSON.stringify($('Resume Workshop').item.binary);
```

**3. Trusting Error Messages Alone**
```
// ❌ "Test Mode Router broken" → assume router is the problem
// ✅ Check entire data flow, router might be working fine
```

**4. Modifying Without Reading**
```
// ❌ User reports issue → immediately modify workflow
// ✅ Read current state → understand issue → then modify
```

---

## Related Documentation

- **Common Tasks**: [COMMON-TASKS.md](COMMON-TASKS.md)
- **Architecture**: [Architecture Index](../architecture/)
- **Troubleshooting**: [COMMON-ERRORS-KNOWN-ISSUES.md](../troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md)
- **Testing Criteria**: [linkedin-automation-testing-criteria.md](../testing/linkedin-automation-testing-criteria.md)
- **N8N Operations Manual**: [n8n-operations-manual.md](../n8n-operations-manual.md)

## Last Updated

2025-11-24
