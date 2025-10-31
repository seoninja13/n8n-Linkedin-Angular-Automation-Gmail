# Project Operations Manual
**LinkedIn Automation Project - Standard Operating Procedures & Troubleshooting**

**Last Updated**: 2025-10-30  
**Version**: 1.0

---

## 📋 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Standard Operating Procedures](#standard-operating-procedures)
3. [Troubleshooting Guide](#troubleshooting-guide)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [Best Practices](#best-practices)
6. [Emergency Procedures](#emergency-procedures)

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
- **Gmail**: Email draft creation
- **AI Services**: Google Gemini, Claude (resume customization, email generation)

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

### **ISSUE-002: Apify Actor Memory Parameters Not Working**

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

### **ISSUE-002: HTTP Request Node Authentication Errors**

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

### **ISSUE-003: Apify Actor Not Waiting for Completion**

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

### **ISSUE-004: N8N Code Node "Invalid Output Format" Error**

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

**Last Updated**: 2025-10-31
**Version**: 1.1
**Next Review**: 2025-11-30

