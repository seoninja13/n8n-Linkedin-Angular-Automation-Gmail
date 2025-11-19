# N8N Code Caching Troubleshooting Guide

**Created**: 2025-11-19  
**Purpose**: Troubleshoot issues where N8N Code node changes don't take effect immediately  
**Applies To**: All N8N workflows using Code nodes

---

## **ISSUE: CODE CHANGES NOT TAKING EFFECT IMMEDIATELY**

### **Symptoms**
- Code changes are saved successfully in N8N UI
- Workflow version number increments
- But executions still show errors from old code
- Error messages reference old code patterns that have been fixed

### **Example**
- **Fix Applied**: Changed `.item` to `.first()` at 05:13 UTC
- **Execution Failed**: Execution at 05:18 UTC (5 minutes later) still shows `.item` error
- **Code Verification**: Workflow code shows `.first()` is present (fix was applied)
- **Conclusion**: N8N is using cached compiled code from before the fix

---

## **ROOT CAUSE**

### **N8N Code Compilation and Caching**

N8N compiles Code nodes into executable JavaScript for performance optimization. This compiled code may be cached in:
1. **Memory**: In-memory cache for active workflows
2. **Disk**: Persistent cache for inactive workflows
3. **Process**: Node.js process-level cache

When a workflow is updated:
- The workflow JSON is saved to the database ✅
- The workflow version number increments ✅
- But the compiled code cache may NOT be invalidated ❌

This causes the execution engine to use old compiled code even though the workflow JSON contains the new code.

---

## **SOLUTION 1: FORCE RECOMPILATION (RECOMMENDED)**

### **Method A: Add Timestamp Comment**

Add a comment with the current timestamp to force N8N to recognize the code as "new":

```javascript
// ============================================
// NODE NAME
// Version: 1.0.2 (Force recompilation)
// Recompile: 2025-11-19 05:30 UTC  // ← ADD THIS LINE
// ============================================

// Your existing code here...
```

**Why This Works**:
- N8N detects the code has changed (different string content)
- Forces recompilation of the Code node
- No functional changes to the code

**Steps**:
1. Open the Code node in N8N UI
2. Add a timestamp comment at the top
3. Save the workflow
4. Wait 5-10 minutes before executing
5. Test with new execution

---

### **Method B: Increment Version Number**

Change the version number in the code comments:

```javascript
// Version: 1.0.1  →  Version: 1.0.2
```

**Why This Works**:
- Same principle as Method A
- Forces N8N to recognize code as changed
- Provides version tracking

---

## **SOLUTION 2: RESTART N8N SERVER**

If force recompilation doesn't work, restart the N8N server to clear all caches:

```bash
# Stop N8N
pm2 stop n8n

# Start N8N
pm2 start n8n
```

**Why This Works**:
- Clears all in-memory caches
- Forces N8N to reload all workflows from database
- Recompiles all Code nodes

**When to Use**:
- Force recompilation didn't work
- Multiple workflows are affected
- You have server access

---

## **SOLUTION 3: WAIT LONGER**

Sometimes N8N's cache invalidation is delayed. Wait 10-15 minutes after deploying a fix before testing.

**Why This Works**:
- N8N may have a background process that invalidates caches periodically
- Gives N8N time to detect the workflow change
- Allows any pending compilations to complete

**When to Use**:
- You can't restart the server
- Force recompilation didn't work immediately
- You're not in a hurry

---

## **PREVENTION TIPS**

### **1. Always Add Version Numbers**
```javascript
// Version: 1.0.0
// Version: 1.0.1
// Version: 1.0.2
```

**Benefits**:
- Forces cache invalidation on every change
- Provides clear version tracking
- Makes debugging easier

---

### **2. Wait After Deploying Fixes**

**Best Practice**: Wait 5-10 minutes after deploying Code node changes before testing

**Why**:
- Gives N8N time to invalidate caches
- Allows background processes to complete
- Reduces false negatives in testing

---

### **3. Use Defensive Coding Patterns**

Instead of relying on N8N's data accessors, use defensive patterns:

**Instead of**:
```javascript
const data = $('Node Name').first().json;
```

**Use**:
```javascript
let data = null;
try {
  const items = $('Node Name').all();
  if (items && items.length > 0) {
    data = items[0].json;
  }
} catch (error) {
  console.error('Error reading data:', error);
  // Use default fallback
}
```

**Benefits**:
- More robust error handling
- Works with pinned data
- Provides fallback values

---

### **4. Test in Stages**

**Best Practice**: Test each fix separately with sufficient wait time between tests

**Steps**:
1. Deploy fix
2. Wait 10 minutes
3. Test execution
4. Verify fix worked
5. Deploy next fix

**Why**:
- Isolates issues to specific fixes
- Reduces confusion about which fix worked
- Provides clear cause-and-effect

---

## **RELATED ISSUES**

### **Pinned Data Compatibility**
- See: `Docs/architecture/counter-increment-fix-documentation.md`
- Issue: `.item` accessor doesn't work with pinned data
- Solution: Use `.first()` or `.all()` instead

### **Workflow Version Caching**
- See: `Docs/daily-logs/2025-11-17-n8n-execution-8407-workflow-caching-issue.md`
- Issue: N8N uses cached workflow version instead of latest
- Solution: Restart N8N server or activate/deactivate workflow

---

## **REFERENCES**

- **Daily Log**: `Docs/daily-logs/2025-11-19-pinned-data-error-investigation.md`
- **Architecture Docs**: `Docs/architecture/counter-increment-fix-documentation.md`
- **Fix Summary**: `Docs/fixes/2025-11-19-pinned-data-fix-summary.md`

