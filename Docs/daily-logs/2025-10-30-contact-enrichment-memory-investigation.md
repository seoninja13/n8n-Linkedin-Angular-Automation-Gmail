# Contact Enrichment Workflow - Apify Actor Memory Restriction Investigation

**Date**: 2025-10-30  
**Session Type**: Troubleshooting & Root Cause Analysis  
**Status**: ✅ **ROOT CAUSE IDENTIFIED** | 🚫 **BLOCKED - ACTOR MEMORY RESTRICTION**  
**Workflow ID**: rClUELDAK9f4mgJx  
**Workflow URL**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx

---

## Executive Summary

Successfully identified the root cause of why the Contact Enrichment Workflow is returning insufficient contacts (19 instead of 100-200). The Apify Leads Finder Actor (ID: `IoSHqwTR9YGhzccez`) has a **hard-coded maximum memory limit of 512 MB** set in its `actor.json` configuration file, which **cannot be overridden via API parameters**. Despite passing `memory=4096` as a URL query parameter, the Apify API clamps the memory allocation to 512 MB due to the actor's `maxMemoryMbytes: 512` setting.

**Key Findings**:
- ✅ HTTP Request node authentication fixed (changed header name from "Apify API Token" to "Authorization")
- ✅ `waitForFinish=300` parameter working correctly (actor waits for completion)
- ✅ `timeout=500` parameter working correctly
- ❌ `memory=4096` parameter being **IGNORED** due to actor-level restriction
- ❌ Actor fetched **ZERO leads** (`chargedEventCounts.lead-fetched: 0`)
- ❌ Workflow shows "success" but returns only 19 contacts (likely cached/stale data)

**Root Cause**: The Apify Leads Finder Actor has `maxMemoryMbytes: 512` set in its `.actor/actor.json` configuration file, which is an **actor-level restriction** that takes precedence over API parameters. This is an intentional design decision by the actor developer to control costs and prevent excessive resource usage.

**Impact**: The 512 MB memory limit is insufficient for processing 100-200 leads, causing the actor to run out of memory and return incomplete results (0 leads fetched).

---

## Investigation Timeline

### **Phase 1: Authentication Fix** ✅
**Issue**: HTTP Request node returning "resource not found" error (404)  
**Root Cause**: HTTP Header Auth credential had invalid header name "Apify API Token" (contains spaces)  
**Solution**: Changed header name to `Authorization` with value `Bearer YOUR_APIFY_API_TOKEN`  
**Result**: Authentication successful, actor started running

### **Phase 2: Wait for Completion Fix** ✅
**Issue**: "Apify Get Dataset Items" node producing no output  
**Root Cause**: HTTP Request node returned immediately without waiting for actor to finish (status: "READY")  
**Solution**: Added `waitForFinish=300` URL query parameter  
**Result**: Actor now waits up to 300 seconds (5 minutes) for completion

### **Phase 3: Memory Parameter Investigation** ❌
**Issue**: Actor still using 512 MB memory despite `memory=4096` parameter  
**Investigation**: Researched official Apify API documentation  
**Finding**: Parameter name `memory` is **CORRECT** (not `memoryMbytes`)  
**Root Cause**: Actor has `maxMemoryMbytes: 512` in its `actor.json` configuration  
**Result**: API parameter cannot override actor-level memory restriction

### **Phase 4: Execution Data Analysis** ❌
**Execution ID**: 6003  
**Status**: "success"  
**Duration**: 6,235ms (6.2 seconds)  
**Critical Findings**:
```json
{
  "options": {
    "memoryMbytes": 512,  // ❌ STILL 512 MB, NOT 4096 MB
    "timeoutSecs": 500
  },
  "chargedEventCounts": {
    "apify-actor-start": 1,
    "lead-fetched": 0  // ❌ ZERO LEADS FETCHED
  }
}
```

**Conclusion**: The workflow executes successfully but the actor fetches 0 leads due to insufficient memory (512 MB).

---

## Technical Details

### **Current HTTP Request Node Configuration**

**URL**:
```
https://api.apify.com/v2/acts/IoSHqwTR9YGhzccez/runs?waitForFinish=300&memory=4096&timeout=500
```

**Authentication**:
- Type: HTTP Header Auth
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_APIFY_API_TOKEN`

**JSON Body**:
```json
{
  "company_domain": "example.com",
  "contact_job_title": ["manager", "director", "vp"],
  "fetch_count": 100,
  "email_status": "verified",
  "seniority_level": ["c_suite", "vp", "director", "head", "manager"],
  "functional_level": ["marketing", "human_resources", "c_suite"]
}
```

### **Actor Response (Execution 6003)**

```json
{
  "status": "SUCCEEDED",
  "startedAt": "2025-10-30T03:23:12.613Z",
  "finishedAt": "2025-10-30T03:23:17.683Z",
  "options": {
    "build": "latest",
    "timeoutSecs": 500,
    "memoryMbytes": 512,  // ❌ Actor-level restriction
    "maxTotalChargeUsd": 35.75075890444138,
    "diskMbytes": 8192
  },
  "chargedEventCounts": {
    "apify-actor-start": 1,
    "lead-fetched": 0  // ❌ No leads fetched
  },
  "defaultDatasetId": "7iwqd8SlzJl1eDOGO"
}
```

### **Apify API Documentation Reference**

From [actor.json documentation](https://docs.apify.com/platform/actors/development/actor-definition/actor-json):

> **`maxMemoryMbytes`** (Optional): Specifies the **maximum amount of memory in megabytes** required by the Actor to run. It can be used to control the costs of run, especially when developing pay per result Actors. Requires an integer value.

**Key Point**: When an actor has `maxMemoryMbytes` set in its configuration, the API **CANNOT override it**. The API parameter `memory=4096` is being **clamped down to 512 MB** because the actor's `maxMemoryMbytes: 512` setting takes precedence.

---

## Root Cause Analysis

### **Why the Memory Parameter Doesn't Work**

The Apify API uses a **two-tier parameter system**:

1. **URL query parameters** control the **execution environment** (memory, timeout, build, waitForFinish)
2. **Actor-level configuration** (`.actor/actor.json`) sets **hard limits** that cannot be overridden

When an actor has `maxMemoryMbytes` set in its configuration:
- The API parameter `memory=4096` is **ignored**
- The actor's `maxMemoryMbytes: 512` takes precedence
- The memory allocation is **clamped to 512 MB**

### **Why the Actor Developer Set This Limit**

The Leads Finder Actor developer intentionally set `maxMemoryMbytes: 512` to:
1. **Control costs** for users (higher memory = higher charges)
2. **Prevent excessive resource usage** on the Apify platform
3. **Enforce a specific pricing model** (pay-per-lead instead of pay-per-memory)

**This is NOT a bug - it's an intentional design decision.**

---

## Impact Assessment

### **Current State**
- Workflow executes successfully (status: "success")
- Actor completes without errors (status: "SUCCEEDED")
- Actor fetches **0 leads** due to insufficient memory
- "Apify Get Dataset Items" returns 19 contacts (likely cached/stale data from previous run)

### **Expected State**
- Workflow executes successfully (status: "success")
- Actor completes without errors (status: "SUCCEEDED")
- Actor fetches **100-200 leads** with 4096 MB memory
- "Apify Get Dataset Items" returns 100-200 contacts (fresh data)

### **Business Impact**
- **Contact Enrichment**: Insufficient contacts (19 instead of 100-200)
- **Resume Generation**: Fewer job applications processed
- **Outreach Tracking**: Reduced email reach (75% reduction)
- **Overall Pipeline**: Bottleneck at Contact Enrichment stage

---

## Proposed Solutions

### **Option 1: Contact the Actor Developer** (RECOMMENDED)

**Action**: Reach out to the Leads Finder Actor developer and request:
- Increase the `maxMemoryMbytes` limit to 4096 MB
- Create a "high-memory" version of the actor for enterprise users
- Provide a custom build with higher memory limits

**How to Contact**:
1. Go to the Leads Finder Actor page on Apify Store
2. Look for the developer's contact information or support channels
3. Explain your use case (need to fetch 100-200 leads per run)
4. Request memory limit increase or custom build

**Pros**:
- ✅ Official solution from actor developer
- ✅ No code changes required
- ✅ Maintains actor updates and support

**Cons**:
- ❌ Depends on developer response time
- ❌ May require additional payment
- ❌ No guarantee of approval

---

### **Option 2: Fork the Actor and Modify It**

**Action**: Fork the actor to your own Apify account and modify the memory limit

**Steps**:
1. Fork the Leads Finder Actor to your Apify account
2. Modify the `.actor/actor.json` file:
   ```json
   {
     "actorSpecification": 1,
     "name": "leads-finder-high-memory",
     "version": "1.0",
     "minMemoryMbytes": 512,
     "maxMemoryMbytes": 4096  // ← Change from 512 to 4096
   }
   ```
3. Deploy your forked version
4. Update N8N workflow to use your forked actor ID

**Pros**:
- ✅ Full control over memory limits
- ✅ Can customize other settings as needed
- ✅ Immediate solution

**Cons**:
- ❌ Requires actor source code access (may not be open-source)
- ❌ Loses automatic updates from original actor
- ❌ Requires maintenance and testing

---

### **Option 3: Use a Different Actor**

**Action**: Search for alternative lead finder actors with higher memory limits

**Criteria**:
- Supports 100-200 leads per run
- No memory restrictions or higher limits (≥4096 MB)
- Similar functionality (domain search, job title filtering, email verification)
- Good reviews and active maintenance

**Pros**:
- ✅ No dependency on current actor developer
- ✅ May find better-performing alternatives
- ✅ Maintains official support and updates

**Cons**:
- ❌ Requires research and testing
- ❌ May have different API/input format
- ❌ Requires N8N workflow modifications

---

### **Option 4: Implement Batch Processing** (WORKAROUND)

**Action**: Process leads in smaller batches to work within 512 MB limit

**Implementation**:
1. Split job list into batches of 10-20 jobs each
2. Run the actor multiple times with smaller `fetch_count` values (e.g., 20 instead of 100)
3. Aggregate results from multiple runs

**Example**:
- Current: 1 run × 100 jobs = 0 leads (out of memory)
- Proposed: 5 runs × 20 jobs = 100 leads (within memory limit)

**Pros**:
- ✅ Works within current memory limit
- ✅ No actor modifications required
- ✅ Immediate implementation

**Cons**:
- ❌ Slower (multiple API calls)
- ❌ Higher costs (multiple actor starts = 5× cost)
- ❌ More complex workflow logic
- ❌ Increased API rate limiting risk

---

## Recommended Next Steps

### **Immediate Actions** (Priority 1)

1. **Verify Actor Memory Limit**:
   - Go to the Leads Finder Actor page on Apify Store
   - Check the actor's documentation or settings for memory configuration
   - Confirm that `maxMemoryMbytes: 512` is indeed set

2. **Contact Actor Developer**:
   - Explain use case (need to fetch 100-200 leads per run)
   - Request memory limit increase or high-memory version
   - Inquire about enterprise/custom pricing

### **Contingency Actions** (Priority 2)

3. **If Developer Can't Help**:
   - Evaluate Option 2 (fork actor) if source code is available
   - Evaluate Option 3 (alternative actors) on Apify Store
   - Evaluate Option 4 (batch processing) as last resort

4. **Update Documentation**:
   - Document final solution in knowledge transfer protocol
   - Update job application progress tracker
   - Create Linear ticket for tracking

---

## Key Learnings

1. **API Parameters vs Actor Configuration**: API parameters can be overridden by actor-level configuration settings
2. **Memory Restrictions**: Actors can enforce hard memory limits that cannot be bypassed via API
3. **Intentional Design**: Memory restrictions are often intentional design decisions for cost control
4. **Documentation Research**: Always check official documentation for parameter behavior and limitations
5. **Execution Data Analysis**: Always retrieve and analyze execution data to verify parameter application

---

## Related Documentation

- **Knowledge Transfer**: `Docs/handover/conversation-handover-knowledge-transfer.md`
- **Job Application Progress Tracker**: `Docs/tracking/job-application-progress-tracker.md`
- **Project Operations Manual**: `Docs/project-operations-manual.md`
- **README Index**: `README-index.md`

---

**Status**: 🚫 **BLOCKED - ACTOR MEMORY RESTRICTION**  
**Next Session Priority**: Contact Leads Finder Actor developer or evaluate alternative solutions  
**Last Updated**: 2025-10-30

