# Daily Log - 2025-11-24 - Duplicate Email Incident Investigation

**Session Type**: Critical Incident Investigation - Duplicate Email Sending
**Duration**: ~1.5 hours
**Status**: 🔍 **IN PROGRESS** - Root cause partially identified, investigation ongoing

---

## 📋 **SESSION OVERVIEW**

### **Incident Report**

User reported critical issue: **Multiple duplicate emails sent to same contacts** (6+ emails to same person within 1 minute)

**Visual Evidence**:
- 6+ emails to `yvemulapalli@company.com` - ALL identical
- 6+ emails to `ranjith@company.com` - ALL identical
- 1 email to `adam.roth@company.com`
- All sent at **6:57 PM** on 2025-11-23

**Expected Behavior**: System should be in TEST MODE creating DRAFTS, NOT sending emails

**Actual Behavior**: System sent 11 emails in production mode

---

## 🔍 **INVESTIGATION FINDINGS**

### **Execution Analysis**

**Orchestrator Execution**: 12991
- **Workflow**: LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment
- **Started**: 2025-11-24T02:51:12.837Z
- **Stopped**: 2025-11-24T02:57:28.781Z
- **Status**: SUCCESS
- **Sub-Executions**: 11 (Outreach Tracking: 13006, 13009, 13012, 13016, 13018, 13021, 13023, 13026, +3 more)

**Key Finding**: All 11 sub-executions completed successfully and sent emails (not drafts)

---

### **Initial Hypothesis (INCORRECT)**

**Hypothesis 1**: testMode = FALSE in Google Sheets
- **Investigated**: Checked Email-Account-Config sheet structure
- **Result**: ❌ **WRONG** - testMode is TRUE for all accounts

**Google Sheets Configuration** (CONFIRMED CORRECT):
```
gmail-dachevivo     | enabled: TRUE | testMode: TRUE | priority: 1
gmail-ivoddachev    | enabled: TRUE | testMode: TRUE | priority: 2
gmail-ivodachevd    | enabled: TRUE | testMode: TRUE | priority: 2
outlook-dachevivo   | enabled: TRUE | testMode: TRUE | priority: 99 (DISABLED)
outlook-dachevivo2  | enabled: TRUE | testMode: TRUE | priority: 99 (DISABLED)
outlook-dachevivo3  | enabled: TRUE | testMode: TRUE | priority: 99 (DISABLED)
```

**Conclusion**: Google Sheets configuration is CORRECT. Problem is elsewhere.

---

### **Revised Investigation Plan**

If testMode = TRUE in Google Sheets but emails are still being SENT, then:

**Possible Root Causes**:
1. **Test Mode Router Switch node is broken** - Routing logic may be inverted or misconfigured
2. **testMode value corrupted in transit** - Data loss between nodes
3. **Workflow connections are wrong** - Router bypassed entirely
4. **"Test Node Boolean Conversion Fix" is interfering** - Introduced bug instead of fixing
5. **Switch node version issue** - N8N v3.2 Switch node behavior change

**Next Investigation Steps** (for next session):
- [ ] Get actual execution data from sub-execution 13006
- [ ] Check testMode value at "Dynamic Priority-Based Account Selector" output
- [ ] Check testMode value at "Test Mode Router" input
- [ ] Verify which output the Switch node routed to (0=Drafts, 1=Send)
- [ ] Check if "Gmail MIME Builder" nodes executed (production path)
- [ ] Check if "Gmail MIME Builder - Draft1/2/3" nodes executed (test path)

---

### **Workflow Architecture Review**

From code analysis (workflow-WUe4y8iYEXNAB6dq.json):

**Dynamic Priority-Based Account Selector** (Code Node):
```javascript
// Reads testMode from Google Sheets
const testMode = selectedAccountData.testMode;
const isTestMode = testMode === true || testMode === 'TRUE' || testMode === 'true' || testMode === 1;
const testModeValue = (testMode === undefined || testMode === null) ? false : isTestMode;

// Outputs testMode
return {
  json: {
    testMode: testModeValue,  // Should be TRUE based on Google Sheets
    ...
  }
};
```

**Test Mode Router** (Switch Node v3.2):
```javascript
Output 0: testMode === true  → Draft Creation Router → Create Gmail DRAFTS
Output 1: testMode === false → 6-Account Email Router → SEND emails
```

**Expected Flow** (with testMode=TRUE):
```
Dynamic Priority-Based Account Selector (outputs testMode: true)
  ↓
Test Mode Router (receives testMode: true)
  ↓ (routes to Output 0)
Draft Creation Router
  ↓
Gmail MIME Builder - Draft1/2/3
  ↓
Create Gmail DRAFTS (NOT send)
```

**Actual Flow** (based on user evidence):
```
Dynamic Priority-Based Account Selector (outputs testMode: ???)
  ↓
Test Mode Router (routes to Output 1 ??)
  ↓
6-Account Email Router
  ↓
Gmail MIME Builder (production)
  ↓
Gmail - dachevivo / ivoddachev / ivodachevd
  ↓
EMAILS SENT (not drafts)
```

**Critical Question**: Why did Test Mode Router route to Output 1 (Send) instead of Output 0 (Draft)?

---

## 📚 **DOCUMENTATION CREATED**

### **Files Created**

1. ✅ `Docs/incidents/EXECUTION-12991-DUPLICATE-EMAIL-DIAGNOSTIC.md` (220 lines)
   - Comprehensive diagnostic report
   - Root cause analysis (initial hypothesis - later proven wrong)
   - 6 fix recommendations (immediate + short-term + long-term)
   - Verification steps

**Note**: This report contains INCORRECT root cause analysis (testMode=FALSE). Will need to update in next session with correct findings.

---

## 🎯 **KEY LEARNINGS**

### **1. Always Verify Configuration Before Assuming**

**Mistake**: Assumed testMode=FALSE without checking Google Sheets directly
**Lesson**: Always ask user to verify configuration before investigating code

### **2. Duplicate Contact Detection is Separate from Duplicate Email Sending**

**Understanding**:
- System correctly identified contacts for 6 different jobs
- Each job matched to same hiring manager (yvemulapalli, ranjith)
- Duplicate detection checks `(contactEmail + jobId)` uniqueness
- System behavior is TECHNICALLY CORRECT (6 different jobs = 6 emails)
- BUT user experience is TERRIBLE (6 identical emails in 1 minute)

**Recommendation**: Add "Best Job Match" logic to prevent multiple emails to same contact within short time window

### **3. Test Mode Router May Have Bug**

**Critical Finding**: testMode=TRUE in config, but emails still sent
**Hypothesis**: Switch node routing logic may be broken or inverted

**Investigation Required** (next session):
- Get actual execution data showing testMode values
- Verify Switch node routing decision
- Check if N8N v3.2 Switch node has known issues

---

## 🚨 **BLOCKED ISSUES**

### **Cannot Complete Investigation Without Execution Data**

**Blocker**: Need to retrieve sub-execution 13006 data to see:
- testMode value at Account Selector output
- testMode value at Test Mode Router input
- Which output the Switch node routed to
- Which nodes actually executed (draft vs send path)

**Resolution** (next session):
- Use working PowerShell script to get execution data
- Or manually check execution in N8N UI
- Or use N8N MCP Admin Gateway to retrieve execution details

---

## 📊 **IMPACT ASSESSMENT**

### **Immediate Impact**

1. **User Reputation Damage**: 6 identical emails to same hiring manager
2. **Email Account Health Risk**: Gmail may flag for spam behavior
3. **Lost Job Opportunities**: Recipients may blacklist candidate
4. **System Trust Loss**: User cannot trust automation in current state

### **Production Risk**

**CRITICAL**: System is currently in BROKEN state
- testMode=TRUE but emails are still being sent
- User has NO safety net to prevent bad emails
- Next scheduled execution (tomorrow 04:30 AM PST) will send more emails

**Recommendation**: User should manually deactivate orchestrators until issue is resolved

---

## ✅ **FIX RECOMMENDATIONS** (Partial - To Be Completed)

### **Fix 1: EMERGENCY - Deactivate Orchestrators**

**Priority**: 🔴 **CRITICAL** - Do this IMMEDIATELY

**Reason**: Until we understand why Test Mode is broken, we cannot trust the system

**Implementation**:
```powershell
# Deactivate SEO Orchestrator
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/gB6UEwFTeOdnAHPI" `
  -Headers @{'X-N8N-API-KEY'='n8n_api_xYWlG4mwJ22ktejCDXYgjblcwNckjWHI7mmK'} `
  -Method PATCH -Body '{"active":false}' -ContentType 'application/json'

# Deactivate GenAI Orchestrator
Invoke-RestMethod -Uri "https://n8n.srv972609.hstgr.cloud/api/v1/workflows/B2tNNaSkbLD8gDxw" `
  -Headers @{'X-N8N-API-KEY'='n8n_api_xYWlG4mwJ22ktejCDXYgjblcwNckjWHI7mmK'} `
  -Method PATCH -Body '{"active":false}' -ContentType 'application/json'
```

**Expected Result**: No more automatic executions until issue is fixed

---

### **Fix 2: Add Duplicate Contact Prevention**

**Problem**: Same contact matched to 6 different jobs → 6 emails sent

**Solution**: Add "Unique Contact Email" filter in orchestrator BEFORE calling Outreach Tracking

**Implementation** (Code Node in Orchestrator):
```javascript
// After Contact Enrichment, BEFORE Resume Generation
const items = $input.all();
const seenEmails = new Set();
const uniqueContacts = [];

items.forEach(item => {
  const contactEmail = item.json.contact?.email;
  if (contactEmail && !seenEmails.has(contactEmail)) {
    seenEmails.add(contactEmail);
    uniqueContacts.push(item);
  } else {
    console.log(`⚠️ Duplicate contact: ${contactEmail} - SKIPPING (already processed in this execution)`);
  }
});

console.log(`✅ Unique contacts: ${uniqueContacts.length} / ${items.length} (filtered ${items.length - uniqueContacts.length} duplicates)`);
return uniqueContacts;
```

**Expected Result**: Each contact receives max 1 email per execution, even if matched to multiple jobs

---

### **Fix 3: Investigate Test Mode Router** (Next Session)

**Steps**:
1. Get execution 13006 data
2. Check testMode value throughout workflow
3. Verify Switch node routing decision
4. Fix routing logic if broken
5. Test with manual execution
6. Verify drafts are created (not sent)

---

## 🔗 **REFERENCE LINKS**

**N8N Workflows**:
- SEO Orchestrator: https://n8n.srv972609.hstgr.cloud/workflow/gB6UEwFTeOdnAHPI
- GenAI Orchestrator: https://n8n.srv972609.hstgr.cloud/workflow/B2tNNaSkbLD8gDxw
- Outreach Tracking: https://n8n.srv972609.hstgr.cloud/workflow/WUe4y8iYEXNAB6dq

**Executions**:
- Orchestrator (12991): https://n8n.srv972609.hstgr.cloud/workflow/B2tNNaSkbLD8gDxw/executions/12991
- Sub-Execution (13006): https://n8n.srv972609.hstgr.cloud/workflow/WUe4y8iYEXNAB6dq/executions/13006

**Google Sheets**:
- Email-Account-Config: https://docs.google.com/spreadsheets/d/1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g/edit

**Documentation**:
- Previous Handover (2025-11-23): Docs/handover/2025-11-23-session-handover.md
- Diagnostic Report (INCOMPLETE): Docs/incidents/EXECUTION-12991-DUPLICATE-EMAIL-DIAGNOSTIC.md

---

## 📝 **NEXT SESSION TASKS**

### **High Priority**

1. **Get Sub-Execution Data** - Retrieve execution 13006 to see testMode values
2. **Identify Test Mode Router Bug** - Why did it route to Send instead of Draft?
3. **Fix Test Mode Router** - Correct routing logic
4. **Test Fix** - Manual execution to verify drafts are created
5. **Update Diagnostic Report** - Correct root cause analysis (currently wrong)

### **Medium Priority**

6. **Implement Duplicate Contact Prevention** - Add unique email filter in orchestrator
7. **Add Best Job Match Logic** - If same contact matches multiple jobs, send only 1 email
8. **Add Email Throttling** - Max 1 email per contact per 7 days

### **Documentation**

9. **Update COMMON-ERRORS-KNOWN-ISSUES.md** - Add Issue #7: Test Mode Router Not Working
10. **Create Handover Doc** - Session summary for next session
11. **Update CLAUDE.md** - Add "Duplicate Contact Prevention" principles

---

## 📊 **METRICS**

- **Executions Analyzed**: 1 (Orchestrator 12991)
- **Sub-Executions Identified**: 11 (13006-13026+)
- **Emails Sent (Should Have Been Drafts)**: 11
- **Duplicate Emails to Same Contact**: 6+ (yvemulapalli, ranjith)
- **Documentation Created**: 2 files (~250 lines)
- **Root Cause Identified**: ❌ **NO** (initial hypothesis was wrong)
- **Fix Implemented**: ❌ **NO** (investigation incomplete)
- **Session Duration**: ~1.5 hours

---

**Session Status**: 🟡 **PARTIAL PROGRESS** - Investigation ongoing
**Next Session Priority**: 🔴 **CRITICAL** - Must fix Test Mode Router before re-enabling orchestrators
**Blocker**: Need execution data to complete investigation
**Last Updated**: 2025-11-24
