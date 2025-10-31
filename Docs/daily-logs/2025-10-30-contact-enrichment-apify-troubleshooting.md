# Daily Log: Contact Enrichment Workshop - Apify Lead Finder Troubleshooting

**Date**: 2025-10-30  
**Workflow**: Contact Enrichment Workshop (ID: rClUELDAK9f4mgJx)  
**Actor**: Apify Lead Finder (ID: IoSHqwTR9YGhzccez)  
**Issue**: Actor consistently returns only 19 contacts instead of expected 200+  
**Status**: **UNRESOLVED** - Root cause identified as Apify account free tier limit

---

## Problem Summary

The Contact Enrichment Workshop workflow integrates with the Apify Lead Finder Actor to discover hiring manager contacts for job applications. Despite multiple troubleshooting attempts, the actor consistently returns only 19 contacts when 200+ contacts are expected based on successful tests in the Apify Console.

**Key Evidence**:
- **N8N Executions**: All return exactly 19 contacts
- **Apify Console Test**: Successfully returned 200+ contacts (Dataset ID: 1vLK1VT4VsB4zYt8G)
- **Billing Data**: Shows `"lead-fetched": 0` in all N8N executions (19 leads fetched but not billed)
- **Input Payload**: Identical across all tests (12 domains, `fetch_count: 100`)

---

## Troubleshooting Timeline

### Attempt 1: Memory Parameter in Request Body (Execution 6029)
**Hypothesis**: Actor needs more memory (4096 MB) to process all domains  
**Implementation**: Added `memory: 4096` to JSON request body  
**Result**: ❌ FAILED - Still returned 19 contacts, memory remained at 512 MB  
**Execution URL**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx/executions/6029

### Attempt 2: Memory Parameter as URL Query (Execution 6039)
**Hypothesis**: Memory parameter should be in URL query string, not request body  
**Implementation**: Added `&memory=4096` to URL query parameter  
**Result**: ❌ FAILED - Still returned 19 contacts, memory remained at 512 MB  
**Execution URL**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx/executions/6039

### Attempt 3: Replace HTTP Request Node with Native Apify Node (Execution 6058)
**Hypothesis**: HTTP Request node doesn't call Apify API correctly; native N8N Apify node will use proper SDK integration  
**Implementation**: Replaced HTTP Request node with `@apify/n8n-nodes-apify.apify` node  
**Result**: ❌ FAILED - Execution failed with "Dataset ID is required" error  
**Execution URL**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx/executions/6058

### Attempt 4: Fix Dataset ID Path (Execution 6061)
**Hypothesis**: Native Apify node outputs dataset ID at different path than HTTP Request node  
**Implementation**: Changed dataset ID reference from `$json.data.defaultDatasetId` to `$json.defaultDatasetId`  
**Result**: ❌ FAILED - Still returned 19 contacts  
**Execution URL**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx/executions/6061

### Attempt 5: Exclude `_metadata` Field from Actor Input (Execution 6067)
**Hypothesis**: The `_metadata` field is contaminating the actor input, causing it to fail silently and return cached data  
**Implementation**: Changed `customBody` from `={{ $json }}` to explicit JSON.stringify excluding `_metadata`:
```javascript
={{ JSON.stringify({
  company_domain: $json.company_domain,
  contact_job_title: $json.contact_job_title,
  fetch_count: $json.fetch_count,
  email_status: $json.email_status,
  seniority_level: $json.seniority_level,
  functional_level: $json.functional_level
}) }}
```
**Result**: ❌ FAILED - Still returned 19 contacts  
**Execution URL**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx/executions/6067

---

## Critical Discovery: Free Tier Limit

### Execution 6067 Analysis

**Actor Run Response**:
```json
{
  "chargedEventCounts": {
    "apify-actor-start": 1,
    "lead-fetched": 19  // ← Actor fetched 19 leads
  },
  "accountedChargedEventCounts": {
    "apify-actor-start": 1,
    "lead-fetched": 0   // ← But 0 leads were billed
  },
  "options": {
    "memoryMbytes": 512  // ← Memory still 512 MB despite requesting 4096 MB
  }
}
```

**Key Findings**:
1. **19 leads fetched but NOT billed**: The difference between `chargedEventCounts` (19) and `accountedChargedEventCounts` (0) indicates these are free/trial leads
2. **Consistent 19-contact limit**: Not a random number - suggests a hard limit
3. **Memory parameter ignored**: All attempts to increase memory to 4096 MB failed; actor always uses 512 MB
4. **Input parameters correct**: All 6 required fields properly formatted, 12 domains provided, `fetch_count: 100`

### Comparison with Apify Console Test

| Metric | Apify Console | N8N Execution 6067 | Expected |
|--------|---------------|-------------------|----------|
| **Contacts Returned** | 200+ | 19 | 200+ |
| **Data Size** | 7,739 lines | ~800 lines | 7,739 lines |
| **Billing (lead-fetched)** | 200+ | 0 | 200+ |
| **Memory Allocated** | Unknown | 512 MB | 4096 MB |
| **Dataset ID** | 1vLK1VT4VsB4zYt8G | EFQfCA3VyJizIiLfr | N/A |
| **Input Payload** | Same | Same | Same |
| **Actor Status** | SUCCEEDED | SUCCEEDED | SUCCEEDED |

---

## Root Cause Analysis

### Hypothesis: Apify Account Free Tier Limit

**Evidence Supporting This Hypothesis**:
1. **Consistent 19-contact limit**: Every execution returns exactly 19 contacts, not a random number
2. **Zero billing**: `accountedChargedEventCounts` shows 0 leads billed, indicating free/trial leads
3. **All configuration fixes failed**: Memory, input format, node type - nothing changed the result
4. **Actor succeeds but returns limited data**: Status is "SUCCEEDED" but output is truncated
5. **Apify Console test worked**: May have used a different account with paid credits or higher limits

**Conclusion**: The Apify account likely has a free tier or trial restriction that limits the Lead Finder Actor to 19 free leads per run, regardless of the `fetch_count` parameter or memory allocation.

---

## Recommended Next Steps

### 1. Verify Apify Account Plan
- Log into Apify Console: https://console.apify.com/
- Check account billing plan and usage limits
- Review Lead Finder Actor pricing: https://console.apify.com/actors/IoSHqwTR9YGhzccez
- Confirm if there's a free tier limit of 19 leads

### 2. Upgrade Apify Account (If Confirmed)
- Add credits to Apify account
- Upgrade to paid plan if necessary
- Verify pricing: $0.002 per lead fetched (200 leads = $0.40)

### 3. Test After Upgrade
- Run Contact Enrichment Workshop again
- Verify billing shows `"lead-fetched": 200+` instead of 0
- Confirm 200+ contacts are returned

### 4. Alternative Solutions (If Upgrade Not Possible)
- **Option A**: Use a different contact enrichment service (e.g., Apollo.io, Hunter.io, RocketReach)
- **Option B**: Implement batch processing with 19-lead chunks (inefficient but workable)
- **Option C**: Contact Apify support to request higher free tier limits for testing

---

## Lessons Learned

1. **Check account limits first**: Before troubleshooting technical issues, verify service account limits and billing plans
2. **Billing data is critical**: The difference between `chargedEventCounts` and `accountedChargedEventCounts` was the key clue
3. **Consistent results indicate limits, not bugs**: When the same number appears repeatedly (19), it's likely a hard limit, not a random failure
4. **Test in production environment**: Apify Console tests may use different accounts or settings than API calls
5. **Document all attempts**: Comprehensive documentation prevents circular troubleshooting

---

## Files Referenced

- **Sample Input**: `.augment/Sample Outputs/sample-apify-inpyt-enrich.json`
- **Workflow**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
- **Successful Dataset**: https://console.apify.com/storage/datasets/1vLK1VT4VsB4zYt8G
- **Actor**: https://console.apify.com/actors/IoSHqwTR9YGhzccez

---

## Status: UNRESOLVED

**Blocker**: Apify account free tier limit (suspected)  
**Action Required**: Verify account plan and upgrade if necessary  
**Impact**: HIGH - Blocks contact enrichment for all job applications  
**Next Session**: Verify Apify account limits and implement solution

