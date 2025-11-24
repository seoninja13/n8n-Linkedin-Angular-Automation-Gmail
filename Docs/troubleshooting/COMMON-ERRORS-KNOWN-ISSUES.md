# 🔧 COMMON ERRORS & KNOWN ISSUES

**LinkedIn Automation N8N Project**  
**Last Updated**: 2025-11-23

---

## **📋 TABLE OF CONTENTS**

1. [N8N Architecture & Design Patterns](#n8n-architecture--design-patterns)
2. [Workflow Execution Issues](#workflow-execution-issues)
3. [Data Flow & Integration Issues](#data-flow--integration-issues)
4. [Google Sheets Integration Issues](#google-sheets-integration-issues)
5. [Email Provider Issues](#email-provider-issues)
6. [Duplicate Detection Issues](#duplicate-detection-issues)

---

## **N8N ARCHITECTURE & DESIGN PATTERNS**

### **Issue 1: Sub-Workflow is INACTIVE - Is This a Problem?**

**Status**: ❌ **NOT AN ISSUE** - This is CORRECT N8N architecture

**Symptoms**:
- Sub-workflow shows "Active: False" in N8N UI
- Sub-workflow uses Execute Workflow Trigger node
- Concern that inactive sub-workflow won't execute

**Root Cause**:
- Sub-workflows with Execute Workflow Trigger nodes are **DESIGNED to be INACTIVE**
- They are triggered by parent workflows, not by external events (webhooks, schedules, etc.)
- N8N architecture requires them to remain inactive

**Solution**:
- ✅ **DO NOTHING** - This is correct behavior
- ❌ **DO NOT activate the sub-workflow** - it doesn't need to be active
- Sub-workflows will execute correctly when called by parent workflows

**Reference**: N8N documentation on Execute Workflow Trigger nodes

---

### **Issue 2: Test Mode Fix Nodes Not Executing**

**Status**: ⚠️ **WORKFLOW DESIGN ISSUE** - Not a bug, but a design consideration

**Symptoms**:
- Test Mode fix nodes (Test Node Boolean Conversion Fix, Test Mode Router, Draft Creation Router) do NOT execute
- No drafts created
- No emails sent

**Root Cause**:
- Test Mode fix nodes are on the "Not Duplicate" path (Output 1) in the Outreach Tracking sub-workflow
- If items are detected as DUPLICATES, they take the "Duplicate" path (Output 0) and bypass the Test Mode fix nodes entirely
- Duplicate path: If - Duplicate or not → Merge Duplicate and Email → Status Update → STOP

**Solution**:
1. **Clear tracking sheet** to remove duplicate records
2. **Trigger new test execution** with fresh (non-duplicate) items
3. **Verify items are NOT duplicates** before expecting Test Mode fix to execute

**Workflow Flow**:
```
If - Duplicate or not (Switch Node)
    ├─ Output 0 (Duplicate) → Merge Duplicate and Email → Status Update → STOP ❌
    └─ Output 1 (Not Duplicate) → AI Email Generation → ... → Test Mode Fix → Test Mode Router → Draft Creation ✅
```

**Reference**: Execution 12400 analysis (Docs/incidents/EXECUTION-12400-CORRECT-DIAGNOSTIC-REPORT.md)

---

## **WORKFLOW EXECUTION ISSUES**

### **Issue 3: N8N REST API Returns 401 Unauthorized**

**Status**: ✅ **RESOLVED** - API key expiration issue

**Symptoms**:
- All N8N REST API calls return 401 Unauthorized
- API key was working previously
- No recent configuration changes

**Root Cause**:
- N8N API keys are JWT tokens with expiration dates
- Old API key expired on 2025-11-19 23:00:00 UTC
- Default token lifetime: ~29 days

**Solution**:
1. Generate new API key in N8N UI (Settings → API)
2. Update all scripts/tools with new API key
3. Verify new API key has no expiration or longer expiration

**API Keys**:
- ❌ OLD (EXPIRED): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxMDcxMzc5LCJleHAiOjE3NjM1OTMyMDB9...`
- ✅ NEW (VALID): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWEzZjM5NC00MjU4LTQ1NDQtODQ4OC05NjBkMThiYWNhNmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzNTk1NDM2fQ.s8nyh35tgs2m7PO76zUVUVlCCDWoV4oZWep341vZbrg`

**Reference**: Execution 12354 analysis

---

## **DATA FLOW & INTEGRATION ISSUES**

### **Issue 4: Pinned Data Blocking Pipeline**

**Status**: ⚠️ **DESIGN CONSIDERATION** - Pinned data can block live execution

**Symptoms**:
- Workflow executes successfully but uses old/stale data
- Changes to upstream nodes don't affect downstream nodes
- Data doesn't flow through the pipeline

**Root Cause**:
- Pinned nodes in N8N save data and reuse it on subsequent executions
- Pinned data blocks live execution of upstream nodes
- Useful for saving costs but can cause confusion during testing

**Solution**:
1. **Unpin nodes** during testing to enable live data flow
2. **Re-pin nodes** after testing to save costs
3. **Clear pinned data** if you need to refresh with new data

**Best Practice**:
- Pin most nodes in production to save costs
- Keep only critical nodes unpinned (Contact Tracking, Outreach Tracking)
- Document which nodes should remain unpinned

**Reference**: LinkedIn automation architecture documentation

---

## **GOOGLE SHEETS INTEGRATION ISSUES**

### **Issue 5: Google Sheets Node Missing 'resource' Parameter**

**Status**: ⚠️ **N8N BUG** - Google Sheets v4.7 serialization bug

**Symptoms**:
- Google Sheets node appears correctly configured in UI
- Exported JSON missing `resource` and sometimes `operation` parameters
- Workflow execution returns 404 errors

**Root Cause**:
- N8N Google Sheets v4.7 has a serialization bug
- Node configuration is correct in UI but exports incomplete JSON
- Missing parameters cause execution failures

**Solution**:
1. **Verify exported JSON** contains all required parameters
2. **Manually add missing parameters** to JSON if needed
3. **Use N8N MCP tools** to programmatically fix workflows

**Example Fix**:
```json
{
  "parameters": {
    "resource": "sheet",  // ← ADD THIS
    "operation": "read",  // ← ADD THIS
    "documentId": "...",
    "sheetName": "..."
  }
}
```

**Reference**: Email Tracking Dashboard node fix

---

## **EMAIL PROVIDER ISSUES**

### **Issue 6: Microsoft Outlook OAuth2 Authentication**

**Status**: ✅ **RESOLVED** - Personal Microsoft accounts CAN work with N8N

**Symptoms**:
- Concern that personal Microsoft accounts won't work with N8N Microsoft Outlook node
- Only Microsoft 365 / Azure AD accounts are documented

**Root Cause**:
- N8N documentation primarily covers Microsoft 365 accounts
- Personal Microsoft accounts (outlook.com, hotmail.com) are also supported

**Solution**:
- ✅ **Personal Microsoft accounts work** with N8N Microsoft Outlook OAuth2 credential
- Use same OAuth2 credential for multiple Outlook mailboxes
- Configure different "From" addresses in each Outlook node

**Verified Configuration**:
- Client ID: b99df04f-32d3-4aa8-8989-a1ee375bfed0
- Accounts: dachevivo@outlook.com, dachevivo2@outlook.com, dachevivo3@outlook.com
- All use the SAME OAuth2 credential

**Reference**: Outlook account rotation implementation

---

## **DUPLICATE DETECTION ISSUES**

### **Issue 7: All Items Detected as Duplicates**

**Status**: ⚠️ **EXPECTED BEHAVIOR** - Tracking sheet contains previous records

**Symptoms**:
- All job applications detected as duplicates
- No new emails or drafts created
- Workflow completes successfully but no output

**Root Cause**:
- Contact Tracking Workshop checks Google Sheets for existing records
- If `dedupeKey` matches an existing record, item is flagged as duplicate
- Duplicate items bypass email generation to prevent duplicate outreach

**Solution**:
1. **Clear tracking sheet** to remove all previous records
2. **Reset email account counters** to 0
3. **Trigger new test execution** with fresh items

**Best Practice**:
- Clear tracking sheet before testing new features
- Use test mode (testMode=TRUE) to create drafts instead of sending emails
- Keep tracking sheet intact in production to prevent duplicate outreach

**Reference**: Execution 12400 analysis

---

## **📚 ADDITIONAL RESOURCES**

- **Architecture Documentation**: `Docs/architecture/architecture-documentation.md`
- **Project Operations Manual**: `Docs/project-operations-manual.md`
- **Testing Strategy**: `Docs/testing/testing-strategy.md`
- **Incident Reports**: `Docs/incidents/`

---

---

## **TEST MODE & EMAIL ROUTING ISSUES**

### **Issue 8: Test Mode Not Working - Emails Sent Instead of Drafts**

**Status**: 🔴 **CRITICAL BUG** - Under investigation

**Symptoms**:
- testMode = TRUE in Google Sheets Email-Account-Config
- Emails are SENT to recipients (production mode)
- Expected behavior: Create Gmail DRAFTS (test mode)
- No drafts created in Gmail Drafts folder

**Root Cause**:
- ❓ **UNKNOWN** - Investigation incomplete (as of 2025-11-24)
- testMode configuration is CORRECT in Google Sheets (all accounts have testMode=TRUE)
- Test Mode Router Switch node may be broken or misconfigured
- OR testMode value is corrupted/lost between nodes
- OR workflow routing connections are incorrect

**Workflow Flow** (Expected):
```
Dynamic Priority-Based Account Selector (outputs testMode: true)
  ↓
Test Mode Router (Switch Node)
  ├─ Output 0 (testMode=true)  → Draft Creation Router → CREATE DRAFTS ✅
  └─ Output 1 (testMode=false) → 6-Account Email Router → SEND EMAILS ❌
```

**Workflow Flow** (Actual - Execution 12991):
```
Dynamic Priority-Based Account Selector (outputs testMode: ???)
  ↓
Test Mode Router (routes to Output 1 instead of Output 0) ← PROBLEM
  ↓
6-Account Email Router
  ↓
Gmail MIME Builder (production)
  ↓
EMAILS SENT (not drafts) ❌
```

**Investigation Status**:
- ✅ Confirmed Google Sheets configuration is correct (testMode=TRUE for all accounts)
- ✅ Confirmed execution 12991 sent 11 emails (via sub-executions 13006-13026+)
- ✅ Analyzed workflow code (Account Selector should output testMode=true)
- ❌ Unable to retrieve execution data to verify testMode values at each node
- ❌ Root cause not yet identified

**Next Steps**:
1. Retrieve sub-execution 13006 data to check testMode values
2. Verify testMode at Account Selector output
3. Verify testMode at Test Mode Router input
4. Check which Switch output was used (0=Draft, 1=Send)
5. Identify exact point where routing failed
6. Fix routing logic
7. Test with manual execution

**Temporary Workaround**:
- **DEACTIVATE orchestrators** until issue is fixed
- Manually create drafts for each job application
- Review and send drafts manually

**Impact**:
- 🔴 **CRITICAL** - System is UNSAFE
- User has NO safety net to prevent bad emails
- Risk of sending more duplicate/incorrect emails
- User reputation damage (6+ duplicate emails sent to same contacts)

**Reference**:
- Execution 12991 analysis
- Docs/incidents/EXECUTION-12991-DUPLICATE-EMAIL-DIAGNOSTIC.md
- Docs/daily-logs/2025-11-24-duplicate-email-incident-investigation.md

---

**Document Version**: 1.1
**Last Updated**: 2025-11-24
**Maintainer**: AI Agent (Augment Code)

