# Project Operations Manual
**LinkedIn Automation Project - Standard Operating Procedures & Troubleshooting**

**Last Updated**: 2025-11-19
**Version**: 1.4

---

## 📋 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Email Infrastructure](#email-infrastructure)
3. [Standard Operating Procedures](#standard-operating-procedures)
4. [Troubleshooting Guide](#troubleshooting-guide)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Best Practices](#best-practices)
7. [Emergency Procedures](#emergency-procedures)

---

## 📖 **OVERVIEW**

This manual provides standard operating procedures, troubleshooting guides, and best practices for the LinkedIn Automation Project. It serves as a reference for common tasks, known issues, and their solutions.

**Project Architecture**:
- **6 Workshops**: Job Discovery, Contact Enrichment, Resume Generation, Contact Tracking, Outreach Tracking, Validation Reporting
- **Orchestrator Workflow**: Coordinates all workshops
- **Data Flow**: Job Discovery → Contact Enrichment → Resume Generation → Outreach Tracking → Contact Tracking

**Key Technologies**:
- **N8N**: Workflow automation platform
- **Apify**: Web scraping and data extraction actors
- **Google Sheets**: Data storage and tracking
- **Gmail/Outlook**: Email draft creation
- **AI Services**: Google Gemini, Claude (resume customization, email generation)

---

## 📧 **EMAIL INFRASTRUCTURE**

### **3-Gmail Account Email System (Current - 2025-11-18)**

**Email Accounts**:
- **Gmail #1**: dachevivo@gmail.com (10 emails/day, priority 1, established sender reputation)
- **Gmail #2**: ivoddachev@gmail.com (3 emails/day, priority 2, warmup phase Week 1)
- **Gmail #3**: ivodachevd@gmail.com (3 emails/day, priority 2, warmup phase Week 1) ✅ NEW
- **Outlook #1**: dachevivo@outlook.com (DISABLED - rate limited 5-10 emails/day)
- **Outlook #2**: dachevivo2@outlook.com (DISABLED - rate limited 5-10 emails/day)
- **Outlook #3**: dachevivo3@outlook.com (DISABLED - rate limited 5-10 emails/day)

**Daily Capacity**: 16 emails/day (current), 40 emails/day (after 4-week warmup)

**Architecture Decision - Outlook Retirement (2025-11-18)**:
Microsoft Outlook personal accounts have strict daily sending limits (5-10 emails/day), which blocked the system from scaling to the target volume of 13-15 emails/day. All Outlook accounts have been disabled in favor of a 3-Gmail account system, which provides:
- Higher sending limits (100-500 emails/day after warmup)
- Better deliverability for job application cold outreach
- More trustworthy sender reputation (personal Gmail addresses)
- Gradual warmup strategy (3/day → 15/day over 4 weeks)

**Account Rotation Strategy**:
- **Algorithm**: Google Sheets-based dynamic priority routing
- **Configuration Storage**: Google Sheets "Email-Account-Config" sheet
- **Selection Logic**: Priority-based (lower number = higher priority) with daily limit enforcement
- **Distribution Logic**:
  - Priority 1: gmail-dachevivo (10/day limit)
  - Priority 2: gmail-ivoddachev (3/day limit)
  - Priority 2: gmail-ivodachevd (3/day limit)
  - When multiple accounts have same priority, first in Google Sheets table is selected
  - Automatic daily counter reset based on lastResetDate field

**N8N Credentials**:
- **Gmail #1**: "Google account" (ID: w8nTWzWPswftVYqH) - dachevivo@gmail.com
- **Gmail #2**: "Gmail - ivoddachev" - ivoddachev@gmail.com
- **Gmail #3**: "Gmail - ivodachevd" - ivodachevd@gmail.com ✅ NEW
- **Outlook #1**: "Microsoft Outlook account" (ID: nfaK9aEhGOnLLHC4) - dachevivo@outlook.com (DISABLED)
- **Outlook #2**: "Microsoft Outlook account 2" - dachevivo2@outlook.com (DISABLED)
- **Outlook #3**: "Microsoft Outlook account 3" - dachevivo3@outlook.com (DISABLED)

**Google Sheets Configuration**:
- **Document ID**: 1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g
- **Document Name**: LinkedIn Outreach Tracking Dashboard
- **Sheet Tab**: "Email-Account-Config"
- **URL**: https://docs.google.com/spreadsheets/d/1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g/edit?gid=360476080#gid=360476080
- **Columns**: 9 columns (accountName, enabled, dailyLimit, currentCount, lastResetDate, priority, emailAddress, credentialName, notes)
- **Purpose**: Dynamic email account management - allows easy enable/disable and daily limit adjustments without workflow editing

**Workflows**:
- **Current Orchestrator**: LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment (ID: gB6UEwFTeOdnAHPI)
- **Current Outreach Tracking Workshop**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment (ID: WUe4y8iYEXNAB6dq)
- **Status**: Active, being upgraded to 3-Gmail account system (Steps 1-2 complete, Step 3 pending)

**Weekly Warmup Schedule**:
| Week | Gmail #1 (dachevivo) | Gmail #2 (ivoddachev) | Gmail #3 (ivodachevd) | Total Capacity |
|------|----------------------|-----------------------|-----------------------|----------------|
| 1 (Current) | 10/day | 3/day | 3/day | 16/day |
| 2 | 12/day | 5/day | 5/day | 22/day |
| 3 | 15/day | 8/day | 8/day | 31/day |
| 4+ | 15/day | 15/day | 15/day | 45/day |

**Action**: Update `dailyLimit` column in Google Sheets "Email-Account-Config" weekly - NO workflow changes needed

### **Legacy 4-Account Email System (Deprecated - 2025-11-18)**

**Email Accounts**:
- **Gmail**: dachevivo@gmail.com (65.4% of emails, 17/26 positions)
- **Outlook #1**: dachevivo@outlook.com (11.5% of emails, 3/26 positions)
- **Outlook #2**: dachevivo2@outlook.com (11.5% of emails, 3/26 positions)
- **Outlook #3**: dachevivo3@outlook.com (11.5% of emails, 3/26 positions)

**Daily Capacity**: 20 emails/day

**Deprecation Reason**: Outlook accounts hit rate limits (5-10 emails/day), blocking scale to 13-15 emails/day target. Replaced with 3-Gmail account system for higher capacity and better deliverability.

**Status**: DEPRECATED - Outlook accounts disabled in Google Sheets "Email-Account-Config"

---

## 🔧 **STANDARD OPERATING PROCEDURES**

### **SOP-001: Starting a New Conversation Session**

**Purpose**: Ensure proper context loading and knowledge transfer  
**Frequency**: Every new conversation session

**Steps**:
1. Read `Docs/handover/conversation-handover-knowledge-transfer.md` (MANDATORY)
2. Read `Docs/project-operations-manual.md` (this file)
3. Check `Docs/tracking/job-application-progress-tracker.md` for current status
4. Review most recent daily log in `Docs/daily-logs/`
5. Use Sequential Thinking MCP tool for all tasks and subtasks

**Expected Outcome**: Full context of project state, current issues, and next steps

---

### **SOP-002: Troubleshooting N8N Workflows**

**Purpose**: Systematic approach to diagnosing N8N workflow issues  
**Frequency**: When workflow errors occur

**Steps**:
1. **Retrieve Execution Data**: Use `n8n_get_execution` with execution ID
2. **Analyze Error Messages**: Check node-level error messages and stack traces
3. **Verify Node Configuration**: Use `n8n_get_workflow` to inspect node parameters
4. **Check Credentials**: Verify authentication credentials are valid
5. **Test Upstream Nodes**: Verify data flow from previous nodes
6. **Review Documentation**: Check N8N MCP server documentation for node-specific issues
7. **Document Solution**: Update this manual with new troubleshooting entry

**Expected Outcome**: Root cause identified and documented solution

---

### **SOP-003: Updating Project Documentation**

**Purpose**: Maintain accurate and up-to-date project documentation  
**Frequency**: After every significant change or discovery

**Steps**:
1. **Update Knowledge Transfer**: Add new section to `Docs/handover/conversation-handover-knowledge-transfer.md`
2. **Create Daily Log**: Create new file in `Docs/daily-logs/YYYY-MM-DD-*.md`
3. **Update Progress Tracker**: Update `Docs/tracking/job-application-progress-tracker.md`
4. **Update Operations Manual**: Add new troubleshooting entry to this file (if applicable)
5. **Update README Index**: Add reference to new documentation in `README-index.md`

**Expected Outcome**: Complete documentation trail for knowledge transfer

---

## 🔍 **TROUBLESHOOTING GUIDE**

### **ISSUE-001: Apify Actor Returns Limited Results (Free Tier Limit)**

**Symptom**: Apify Lead Finder Actor consistently returns only 19 contacts instead of 200+
**Affected Component**: Contact Enrichment Workshop, Apify "Run an Actor" node
**Severity**: CRITICAL - BLOCKER
**Date Identified**: 2025-10-30

**Root Cause**:
Apify account has a **free tier limit** that restricts the Lead Finder Actor to 19 free leads per run, regardless of `fetch_count` parameter or memory allocation. This is NOT a technical configuration issue - it's an account billing limitation.

**Evidence**:
- **Billing Data**: `chargedEventCounts.lead-fetched: 19` but `accountedChargedEventCounts.lead-fetched: 0`
- **Consistent Limit**: Every execution returns exactly 19 contacts (not random)
- **All Technical Fixes Failed**: Memory parameters, node types, input formats - nothing changed the result
- **Apify Console Success**: Same input returned 200+ contacts (different account/plan)

**Solution**:
1. Log into Apify Console: https://console.apify.com/
2. Check account billing plan and usage limits
3. Add credits or upgrade to paid plan
4. Pricing: $0.002 per lead (200 leads = $0.40)
5. Re-run Contact Enrichment Workshop
6. Verify `accountedChargedEventCounts.lead-fetched` > 0

**Alternative Solutions**:
- Use different contact enrichment service (Apollo.io, Hunter.io, RocketReach)
- Implement 19-lead batch processing (inefficient but workable)
- Contact Apify support for higher free tier limits

**Reference**: `Docs/daily-logs/2025-10-30-contact-enrichment-apify-troubleshooting.md`

---

### **ISSUE-002: Data Validation v1.2.0 - Orchestrator Routing Logic Fix**

**Symptom**: Orchestrator routing DUPLICATE applications to Outreach Tracking Workshop instead of filtering them out
**Affected Component**: LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment, Data Validation node
**Severity**: CRITICAL - BLOCKER (100% email delivery failure)
**Date Identified**: 2025-11-13
**Date Resolved**: 2025-11-13

**Root Cause**:
The **Data Validation** node (ID: 7a81cda8-7136-4be7-a6f3-c5157e15caf8, v1.1.0) was checking for required fields (firstName, lastName, email, jobTitle, companyName) but was **NOT checking for `outreachReady: true`**. This caused DUPLICATE applications with `outreachReady: false` to pass validation and get routed to Outreach Tracking Workshop, while NON-DUPLICATE applications with `outreachReady: true` were also routed to Outreach Tracking. The Switch node couldn't distinguish between them because both had `validationStatus: "PASSED"`.

**Evidence**:
- **Execution 7604**: Outreach Tracking Workshop received DUPLICATE application (Plaid with `outreachReady: false`)
- **Execution 7604**: NON-DUPLICATE application (Bask Health with `outreachReady: true`) did NOT reach Outreach Tracking
- **Result**: ZERO emails sent (100% delivery failure)

**Solution Applied**:
Updated Data Validation node to v1.2.0 which adds `outreachReady === true` check BEFORE field validation:

```javascript
// STEP 1: CHECK OUTREACH READY STATUS (NEW IN v1.2.0)
const outreachReady = contactRecord.outreachReady;

if (outreachReady === false) {
  // DUPLICATE APPLICATION - Skip expensive operations
  return {
    json: {
      validationStatus: 'FAILED',
      reason: 'Duplicate application - outreach not ready',
      validationMetadata: {
        validationVersion: '1.2.0',
        failureReason: 'outreachReady: false (duplicate)',
        costSavings: { estimatedSavingsUSD: 0.10 }
      }
    }
  };
}

// STEP 2: VALIDATE REQUIRED FIELDS (EXISTING LOGIC)
```

**Deployment Details**:
- **Workflow**: LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment (gB6UEwFTeOdnAHPI)
- **Node Updated**: Data Validation (7a81cda8-7136-4be7-a6f3-c5157e15caf8)
- **Version**: 1.2.0-OUTREACH-READY-CHECK
- **Deployment Timestamp**: 2025-11-13 03:34:50 UTC
- **Deployment Method**: N8N MCP tool `n8n_update_partial_workflow`

**Validation Results (Execution 7609)**:
- ✅ 2 DUPLICATE applications correctly marked as `validationStatus: "FAILED"`
- ✅ 0 DUPLICATE applications reached Outreach Tracking Workshop
- ✅ Both DUPLICATE applications logged to "Logs-Failures-Validation" sheet
- ✅ Cost savings: $0.20 (2 duplicates × $0.10 per duplicate)
- ✅ 100% filtering accuracy

**Key Improvements**:
1. **Early Termination**: Duplicates filtered out BEFORE expensive AI email generation and draft creation
2. **Cost Savings**: $0.10 saved per duplicate (estimated $73/year for 2 duplicates/day)
3. **Clear Audit Trail**: Failure reason explicitly states "Duplicate application - outreach not ready"
4. **Architectural Soundness**: Leverages existing Switch node routing without workflow restructuring

**Troubleshooting Similar Issues**:
1. **Retrieve orchestrator workflow structure** using `n8n_get_workflow`
2. **Analyze data flow path** from Contact Tracking Workshop to Outreach Tracking Workshop
3. **Identify filtering/routing nodes** (Data Validation, Switch, If nodes)
4. **Check validation logic** for missing checks (e.g., `outreachReady`, `isDuplicate`)
5. **Retrieve execution data** using `n8n_get_execution` with `mode: "filtered"` for specific nodes
6. **Verify routing decisions** by checking Switch node outputs and downstream node inputs

**Reference**:
- Daily Log: `Docs/daily-logs/2025-11-13-data-validation-fix-deployment.md`
- Execution 7609: https://n8n.srv972609.hstgr.cloud/workflow/gB6UEwFTeOdnAHPI/executions/7609

---

### **ISSUE-003: Apify Actor Memory Parameters Not Working**

**Symptom**: Actor uses default memory (512 MB) despite passing `memory=4096` parameter
**Affected Component**: Contact Enrichment Workshop, HTTP Request node
**Severity**: MEDIUM (superseded by ISSUE-001)

**Root Cause**:
Apify actors can have `maxMemoryMbytes` settings in their `.actor/actor.json` configuration file that **override API parameters**. When an actor has this setting, the API parameter `memory=4096` is **clamped down** to the actor's maximum limit.

**NOTE**: This was initially thought to be the root cause of the 19-contact limit, but further investigation revealed it's actually a free tier billing limit (see ISSUE-001).

**Diagnosis Steps**:
1. Retrieve execution data using `n8n_get_execution`
2. Check `options.memoryMbytes` in the response
3. If value is lower than requested, actor has memory restriction
4. Check actor's Apify Store page for memory configuration

**Solution Options**:
1. **Contact Actor Developer** (RECOMMENDED): Request memory limit increase
2. **Fork Actor**: Modify `.actor/actor.json` to increase `maxMemoryMbytes`
3. **Use Alternative Actor**: Find actor without memory restrictions
4. **Batch Processing**: Process data in smaller batches

**Prevention**:
- Always check actor documentation for memory restrictions before integration
- Test actors with expected data volumes during evaluation phase
- Monitor `chargedEventCounts` in execution data to verify actor performance

**Related Documentation**:
- Daily Log: `Docs/daily-logs/2025-10-30-contact-enrichment-memory-investigation.md`
- Knowledge Transfer: `Docs/handover/conversation-handover-knowledge-transfer.md` (Section: Contact Enrichment Memory Restriction)

---

### **ISSUE-002: N8N Code Node Cannot Use Credentials Directly**

**Symptom**: "Node type 'n8n-nodes-base.code' does not have any credentials defined" error
**Affected Component**: Any workflow using Code nodes with `this.helpers.httpRequestWithAuthentication.call()`
**Severity**: HIGH - BLOCKER

**Root Cause**:
N8N Code nodes do NOT support direct credential assignment in their node configuration. When a Code node tries to use `this.helpers.httpRequestWithAuthentication.call()` with a credential ID, N8N throws a validation error because the Code node type does not have a credentials dropdown or credential assignment mechanism.

**Example Case (Execution #9171)**:
- **Error Message**: "Node type 'n8n-nodes-base.code' does not have any credentials defined"
- **Workflow**: LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment (B2tNNaSkbLD8gDxw)
- **Node**: "Assign Counter to Each Item" Code node (ID: assign-counter-to-items)
- **Attempted Code**: `this.helpers.httpRequestWithAuthentication.call(this, 'googleSheetsOAuth2Api', { ... })`
- **Result**: Workflow execution failed before reaching the Code node

**Diagnosis Steps**:
1. Retrieve execution data using `n8n_get_execution`
2. Check error message for "does not have any credentials defined"
3. Identify Code nodes attempting to use `this.helpers.httpRequestWithAuthentication.call()`
4. Verify if Code node is trying to make API calls with credentials

**Solution**:
Restructure workflow to use **native N8N nodes for API calls** and **Code nodes ONLY for data transformation**:

1. **Add native N8N nodes for API calls** (Google Sheets, HTTP Request, etc.)
   - These nodes have credential dropdowns and support authentication
   - Place them BEFORE or AFTER Code nodes in the workflow

2. **Update Code nodes to remove API calls**
   - Remove all `this.helpers.httpRequestWithAuthentication.call()` calls
   - Use node references to access data from other nodes: `$('Node Name').all()`
   - Focus Code nodes on data transformation logic only

3. **Update workflow connections**
   - Connect native nodes to Code nodes
   - Ensure data flows correctly through the pipeline

**Example Architecture (Counter Management Fix)**:
```
BEFORE (BROKEN):
Switch → Code node (reads counter via API, assigns values, writes counter via API) → Outreach Tracking

AFTER (FIXED):
Switch → Google Sheets node (reads counter) → Code node (extracts counter row) → Code node (assigns values) → Google Sheets node (writes counter) → Outreach Tracking
```

**Key Architectural Pattern**:
- ✅ **Use native N8N nodes for API calls** (Google Sheets, HTTP Request, Apify, etc.)
- ✅ **Use Code nodes ONLY for data transformation** (no API calls, no credentials)
- ✅ **Use node references to access non-connected data** (`$('Node Name').all()` syntax)

**Prevention**:
- Never attempt to use `this.helpers.httpRequestWithAuthentication.call()` in Code nodes
- Always use native N8N nodes for API calls that require credentials
- Design workflows with clear separation: API calls in native nodes, data transformation in Code nodes

**Related Documentation**:
- Daily Log: `Docs/daily-logs/2025-11-18-counter-management-fix.md`
- Knowledge Transfer: `Docs/handover/conversation-handover-knowledge-transfer.md` (Section: Counter Management Fix)
- Execution #9171: https://n8n.srv972609.hstgr.cloud/workflow/B2tNNaSkbLD8gDxw/executions/9171

---

### **ISSUE-003: HTTP Request Node Authentication Errors**

**Symptom**: "Resource not found" (404) or "Unauthorized" (401) errors
**Affected Component**: Any workflow using HTTP Request nodes
**Severity**: HIGH

**Root Cause**:
HTTP Header Auth credentials may have invalid header names (e.g., names containing spaces like "Apify API Token") or incorrect header values.

**Diagnosis Steps**:
1. Retrieve execution data using `n8n_get_execution`
2. Check error message for authentication-related keywords
3. Verify HTTP Header Auth credential configuration
4. Check if header name contains spaces or special characters

**Solution**:
1. Update HTTP Header Auth credential:
   - Header Name: `Authorization` (no spaces)
   - Header Value: `Bearer YOUR_API_TOKEN`
2. Test with a simple API call to verify authentication

**Prevention**:
- Use standard header names (`Authorization`, `X-API-Key`, etc.)
- Avoid spaces and special characters in header names
- Test authentication immediately after credential creation

---

### **ISSUE-004: Apify Actor Not Waiting for Completion**

**Symptom**: "Apify Get Dataset Items" node returns empty results
**Affected Component**: Contact Enrichment Workshop
**Severity**: HIGH

**Root Cause**:
HTTP Request node returns immediately after starting the actor (status: "READY") without waiting for completion. The dataset is empty because the actor is still running.

**Diagnosis Steps**:
1. Retrieve execution data using `n8n_get_execution`
2. Check actor status in HTTP Request node output
3. If status is "READY" or "RUNNING", actor hasn't finished

**Solution**:
Add `waitForFinish=300` URL query parameter to HTTP Request node:
```
https://api.apify.com/v2/acts/{ACTOR_ID}/runs?waitForFinish=300
```

**Prevention**:
- Always use `waitForFinish` parameter when calling Apify actors via HTTP Request
- Set timeout value based on expected actor execution time (300 seconds = 5 minutes)
- Monitor actor execution times to optimize timeout values

---

### **ISSUE-005: N8N Code Node "Invalid Output Format" Error**

**Symptom**: Code node fails with "Invalid output format" validation error  
**Affected Component**: Any workflow using Code nodes with `runOnceForEachItem` mode  
**Severity**: MEDIUM

**Root Cause**:
Code nodes configured with `mode: 'runOnceForEachItem'` must include `pairedItem` property in return object to maintain item linking.

**Solution**:
Update Code node return statement:
```javascript
return {
  json: { /* your data */ },
  pairedItem: { item: 0 }  // ← Add this
};
```

**Prevention**:
- Always include `pairedItem` property when using `runOnceForEachItem` mode
- Use `mode: 'runOnceForAllItems'` if item linking is not required

---

## 💡 **BEST PRACTICES**

### **BP-001: Always Use N8N MCP Server Tools**

**Rule**: N8N MCP Server is the ONLY approved method for N8N workflow operations  
**Prohibited**: Terminal commands with manual API calls (PowerShell `Invoke-RestMethod`, `launch-process`)

**Rationale**:
- N8N MCP Server provides structured, validated API interactions
- Reduces risk of malformed requests and authentication errors
- Maintains consistent error handling and logging

**Approved Tools**:
- `n8n_list_workflows`
- `n8n_get_workflow`
- `n8n_update_full_workflow`
- `n8n_update_partial_workflow`
- `n8n_get_execution`
- `n8n_list_executions`

---

### **BP-002: Always Use Sequential Thinking MCP Tool**

**Rule**: Sequential Thinking MCP tool is MANDATORY for all tasks and subtasks without exception

**Rationale**:
- Ensures systematic approach to problem-solving
- Maintains clear thought process and decision trail
- Prevents overlooking critical steps

**Usage**:
- Use at the start of every task
- Break down complex tasks into smaller subtasks
- Document thought process and decision points

---

### **BP-003: Never Add Console Logging to N8N Workflows**

**Rule**: NEVER add `console.log()`, `console.warn()`, `console.error()`, or `console.info()` statements to N8N workflow code

**Rationale**:
- No mechanism to read console logs in N8N environment
- Adds unnecessary code bloat
- Use N8N's built-in execution data instead

**Alternative**:
- Use `n8n_get_execution` to retrieve execution data
- Inspect node outputs and error messages
- Use N8N's built-in logging and debugging features

---

### **BP-004: Always Retrieve Live N8N Workflow Data**

**Rule**: Always retrieve live N8N workflow data using MCP server tools before analysis

**Rationale**:
- Local JSON files are outdated and unreliable
- Workflow configurations change frequently
- Execution data provides real-time insights

**Prohibited**:
- Using local JSON files as source of truth
- Assuming workflow configuration based on old data

**Approved**:
- `n8n_get_workflow` for current workflow configuration
- `n8n_get_execution` for execution data
- `n8n_list_executions` for execution history

---

### **BP-005: Apify Integration Best Practices**

**Rule**: Follow systematic approach when integrating Apify actors into N8N workflows

**Best Practices**:

1. **Use Native N8N Apify Node**:
   - Prefer `@apify/n8n-nodes-apify.apify` over HTTP Request node
   - Native node uses proper SDK integration
   - Handles authentication and error handling automatically

2. **Check Account Limits First**:
   - Verify Apify account billing plan before troubleshooting
   - Check `chargedEventCounts` vs `accountedChargedEventCounts` in execution data
   - If `accountedChargedEventCounts` is 0, likely hitting free tier limit

3. **Monitor Billing Events**:
   - Always check `chargedEventCounts` in actor run response
   - Key events: `apify-actor-start`, `lead-fetched`, `compute-units`
   - Zero billing events indicate actor didn't execute properly

4. **Verify Dataset IDs**:
   - HTTP Request node: `$json.data.defaultDatasetId`
   - Native Apify node: `$json.defaultDatasetId` (no `data` wrapper)
   - Always verify dataset ID path when switching node types

5. **Handle Actor Parameters**:
   - Use `customBody` parameter for actor input
   - Exclude N8N metadata fields (`_metadata`, `pairedItem`, etc.)
   - Use explicit JSON.stringify for complex objects

6. **Test in Apify Console First**:
   - Always test actor with exact input payload in Apify Console
   - Compare Console results with N8N results
   - Helps isolate N8N integration issues from actor issues

**Debugging Checklist**:
- [ ] Check account billing plan and limits
- [ ] Verify `chargedEventCounts` vs `accountedChargedEventCounts`
- [ ] Confirm dataset ID path matches node type
- [ ] Validate actor input parameters (no extra fields)
- [ ] Compare with Apify Console test results
- [ ] Check actor status and error messages

**Common Pitfalls**:
- ❌ Assuming technical issue when it's actually account limit
- ❌ Using HTTP Request node instead of native Apify node
- ❌ Passing entire `$json` object including metadata fields
- ❌ Not checking billing data to verify actor execution
- ❌ Ignoring difference between `chargedEventCounts` and `accountedChargedEventCounts`

---

## 🚨 **EMERGENCY PROCEDURES**

### **EP-001: Critical Workflow Failure**

**Trigger**: Workflow execution fails with critical error affecting job application pipeline

**Immediate Actions**:
1. Retrieve execution data using `n8n_get_execution`
2. Identify failing node and error message
3. Check if issue affects other workflows
4. Document error in daily log
5. Update progress tracker with BLOCKED status

**Escalation**:
- If issue cannot be resolved within 2 hours, document findings and escalate to user
- Provide detailed root cause analysis and proposed solutions

---

### **EP-002: Data Integrity Issue**

**Trigger**: Duplicate records, missing data, or incorrect data in Google Sheets

**Immediate Actions**:
1. Stop all workflow executions
2. Retrieve recent execution data
3. Identify data corruption source
4. Document affected records
5. Provide data recovery plan

**Prevention**:
- Implement duplicate detection (dedupeKey)
- Use semantic joining for zero data loss
- Validate data at each workflow stage

---

## Contact Enrichment Workshop Architecture Simplification

### Overview
The Contact Enrichment Workshop (ID: rClUELDAK9f4mgJx) underwent architecture simplification on 2025-10-31 to remove unnecessary chunking/batching logic after discovering that Apify Lead Finder Actor processes ALL domains in a single API call.

### Key Discovery: Apify Batch Processing Behavior
**Discovery**: Apify Lead Finder Actor processes ALL domains in a single API call when using the `{"0": {...}}` wrapper format, regardless of how many domains are provided.

**Impact**: The previous chunking/batching architecture (splitting 12 domains into batches of 15) was unnecessary and added complexity without benefit.

**Evidence**: Testing showed that providing 12 domains in a single call returned 600 contacts, confirming that Apify processes all domains in one batch.

### Simplified Architecture (Target State)

**Previous Architecture (Complex)**:
```
Execute Workflow Trigger
  ↓
Domain extraction and Apify input builder
  ↓
❌ Domain chunker - 15 per batch (REMOVED)
  ↓
❌ Loop Over Domain Chunks (REMOVED)
  ↓
If - Has a Domain
  ↓
Run an Actor
  ↓
Apify Get Dataset Items
  ↓
Contacts Quality Filter
  ↓
Limit Contacts - 40
  ↓
Filter Verified Emails
  ↓
If - Has a Domain1
  ↓
HTTP Request - Neverbounce
  ↓
Output Formatting Split By Job (with chunk aggregation)
```

**Simplified Architecture (Target)**:
```
Execute Workflow Trigger
  ↓
Domain extraction and Apify input builder
  ↓
If - Has a Domain
  ↓
Run an Actor (processes ALL domains in one call)
  ↓
Apify Get Dataset Items
  ↓
Contacts Quality Filter
  ↓
Limit Contacts - 40
  ↓
Filter Verified Emails
  ↓
If - Has a Domain1
  ↓
HTTP Request - Neverbounce
  ↓
Output Formatting Split By Job (simplified, no chunk aggregation)
```

### Changes Made
1. ✅ **Removed "Domain chunker - 15 per batch" node** (ID: dbabffe2-5852-44fc-80c6-f69681981958)
2. ✅ **Removed "Loop Over Domain Chunks" node** (ID: 9971a7cf-9fa3-47a3-8454-3e7da7b9a9a3)
3. ✅ **Reconnected "Domain extraction" directly to "If - Has a Domain"**
4. ⚠️ **Simplified "Output Formatting Split By Job" node** (PENDING - code not yet updated)

### Current Status (2025-10-31)
**Status**: INCOMPLETE - 2 critical code issues found during review

**Issues**:
1. ❌ "Output Formatting Split By Job" node still has OLD CODE with chunk aggregation logic
2. ❌ "Domain extraction and Apify input builder - 100 recs" node has WRONG CODE (output formatting instead of domain extraction)

**Next Steps**:
1. Fix both code issues (complete code provided in review document)
2. Save workflow
3. Request AI review to verify fixes
4. Test simplified workflow end-to-end

### Benefits of Simplification
- 🎉 **95 fewer lines of code** (removed chunk aggregation logic)
- 🎉 **2 fewer nodes** (removed chunking and looping nodes)
- 🎉 **Simpler architecture** (direct processing, no batching)
- 🎉 **Same functionality** (all features preserved)
- 🎉 **Easier maintenance** (less code to understand and debug)

### Reference
- **Workflow URL**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
- **Review Document**: `Docs/reviews/contact-enrichment-simplification-review-2025-10-31.md`
- **Date**: 2025-10-31

---

### **ISSUE-008: N8N Workflow Version Caching**

**Symptom**: Workflow executions fail with OLD errors despite fixes being applied minutes earlier
**Affected Component**: Any inactive N8N workflow triggered by orchestrator
**Severity**: HIGH - Blocks validation of workflow fixes

**Root Cause**:
N8N workflows can be **cached in memory** when they are inactive. When an orchestrator triggers an inactive sub-workflow, N8N may use the cached version instead of loading the latest version from the database. This causes executions to fail with OLD errors even after fixes have been applied.

**Example Case (Execution #8407)**:
- **TypeVersion 4.7 fix applied**: 2025-11-17T02:38:08.927Z (workflow version 160)
- **Execution #8407 started**: 2025-11-17T02:52:41.763Z (**14 minutes AFTER fix**)
- **Sub-executions failed**: "Could not get parameter 'columns.schema'" (OLD error from typeVersion 4.5)
- **Conclusion**: Execution #8407 used a cached OLD version (159 or earlier) instead of version 160

**Diagnosis Steps**:
1. Retrieve execution data using `n8n_get_execution` with `mode: "summary"`
2. Check error message and compare with known fixed issues
3. Retrieve current workflow configuration using `n8n_get_workflow`
4. Compare workflow version in execution vs. current workflow version
5. Check workflow `updatedAt` timestamp vs. execution `startedAt` timestamp
6. If execution started AFTER fix was applied but still shows OLD error → workflow caching issue

**Solution**:
1. **Restart N8N Server** to clear all workflow caches:
   ```bash
   # Stop N8N
   pm2 stop n8n

   # Start N8N
   pm2 start n8n
   ```

2. **Activate Inactive Workflows** to force version reload:
   - Go to N8N UI
   - Open the affected workflow
   - Click "Active" toggle to activate the workflow
   - This forces N8N to load the latest version from the database

3. **Wait 5 Minutes** after restarting N8N before triggering new executions

4. **Trigger New Test Execution** to verify the fix is working

**Prevention**:
- **Activate workflows immediately after applying fixes** to force N8N to reload the latest version
- **Restart N8N server after critical fixes** to clear all workflow caches
- **Wait 5 minutes after restarting N8N** before triggering test executions
- **Monitor execution errors** for patterns indicating cached versions (OLD errors after fixes)

**Why This Happens**:
- Inactive workflows are cached in memory for performance optimization
- When a workflow is triggered, N8N may use the cached version instead of reloading from database
- Workflow version updates don't automatically invalidate the cache
- Activating a workflow forces N8N to reload the latest version from database

**Related Documentation**:
- Daily Log: `Docs/daily-logs/2025-11-17-n8n-execution-8407-workflow-caching-issue.md`
- Knowledge Transfer: `Docs/handover/conversation-handover-knowledge-transfer.md` (Section: Email Volume Tracking System)
- Execution #8407: https://n8n.srv972609.hstgr.cloud/workflow/B2tNNaSkbLD8gDxw/executions/8407

---

## 🔐 **N8N MCP SERVER AUTHENTICATION**

### **Overview**

The N8N MCP (Model Context Protocol) server provides programmatic access to N8N workflows through Augment Code's AI assistant. It uses JWT-based API key authentication to interact with the N8N instance.

### **Configuration**

**N8N Instance**: https://n8n.srv972609.hstgr.cloud

**MCP Server Package**: `n8n-mcp` (NPM package by czlonkowski)

**Configuration Files**:
1. **Project Config**: `claude_desktop_config.json` (project root)
2. **Claude Desktop Config**: `%APPDATA%\Claude\claude_desktop_config.json`

**MCP Server Configuration**:
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://n8n.srv972609.hstgr.cloud",
        "N8N_API_KEY": "<API_KEY_HERE>"
      }
    }
  }
}
```

### **API Key Management**

**API Key Type**: JWT (JSON Web Token)

**Lifecycle**:
- Default lifetime: ~29 days
- Newer API keys may not have expiration (long-lived tokens)
- API keys must be renewed before expiration to avoid service disruption

**Generate New API Key**:
1. Navigate to: https://n8n.srv972609.hstgr.cloud/settings/api
2. Click "Create API Key"
3. Copy the generated API key
4. Update both configuration files (see below)

**Update API Key**:
1. **Manual Method**:
   - Edit `claude_desktop_config.json` in project root
   - Edit `%APPDATA%\Claude\claude_desktop_config.json`
   - Replace `N8N_API_KEY` value with new API key
   - Restart Claude Desktop

2. **Automated Method**:
   - Run `Scripts/update-claude-config.ps1` (provide new API key when prompted)
   - Restart Claude Desktop

### **Troubleshooting Authentication Failures**

**Symptom**: All N8N MCP tool operations fail with "Failed to authenticate with n8n. Please check your API key" error

**Diagnosis**:
1. Check if API key has expired by decoding JWT token:
   ```powershell
   $token = "<JWT_TOKEN>"
   $parts = $token.Split('.')
   $payload = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($parts[1]))
   $payloadObj = $payload | ConvertFrom-Json
   $exp = $payloadObj.exp  # Expiration timestamp (Unix)
   $iat = $payloadObj.iat  # Issued at timestamp (Unix)
   ```

2. Verify Claude Desktop config contains N8N MCP server configuration

3. Test API key directly with REST API:
   ```powershell
   $apiKey = "<API_KEY>"
   $headers = @{ "X-N8N-API-KEY" = $apiKey; "Accept" = "application/json" }
   Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows?limit=5" -Method GET -Headers $headers
   ```

**Solution**:
1. Generate new N8N API key (see above)
2. Update both configuration files
3. Restart Claude Desktop

**Prevention**:
- Monitor API key expiration dates
- Set calendar reminders to renew keys before expiration
- Use automation script for updates

**Last Occurrence**: 2025-11-19 23:00:00 UTC (API key expired)
**Resolution**: New API key generated and configs updated (2025-11-19 23:30 UTC)
**Documentation**: `Docs/daily-logs/2025-11-19-n8n-mcp-authentication-fix.md`

---

**Last Updated**: 2025-11-19
**Version**: 1.4
**Next Review**: 2025-12-19

