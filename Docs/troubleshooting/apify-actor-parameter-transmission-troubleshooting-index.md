# Apify Actor Parameter Transmission Troubleshooting Index

**Last Updated**: 2025-10-30  
**Status**: 🔴 ACTIVE INVESTIGATION  
**Workflow**: Contact Enrichment Workshop (ID: `rClUELDAK9f4mgJx`)  
**Actor**: Apify Lead Finder (ID: `IoSHqwTR9YGhzccez`)

---

## Problem Description

Apify Lead Finder Actor returns only **19 contacts** instead of the configured **200+ contacts** when called from N8N Contact Enrichment Workshop, despite all input parameters being correctly transmitted to Apify.

### Symptoms
- Actor returns exactly **19 contacts** consistently across multiple executions
- All input parameters are correctly received by Apify (verified via Apify Console)
- `fetch_count: 200` is present in actor input
- Same configuration allegedly works in Apify Console direct testing (needs re-verification)
- 19 contacts appears to be a default/fallback behavior

---

## Current Status: PARAMETER TRANSMISSION CONFIRMED WORKING ✅

**CRITICAL DISCOVERY (2025-10-30)**: We have confirmed that ALL input parameters are being correctly transmitted from N8N to Apify. The issue is **NOT with N8N configuration**.

### Verified Input Parameters (Apify Console - Execution #6075)

```json
{
  "company_domain": [
    "sajtech.com", "applause.com", "jobgether.com", "odoo.com",
    "luxurypresence.com", "twine.net", "attisglobal.com", "exmox.com",
    "growthx.ai", "prosum.com", "remotehunter.com", "luxurypresence.com"
  ],
  "contact_job_title": [
    "Marketing Manager", "Director of Marketing", "VP Marketing",
    "CMO", "Chief Marketing Officer", "HR Manager",
    "Director of Recruiting", "Talent Acquisition Manager",
    "Head of People", "VP of Human Resources"
  ],
  "fetch_count": 200,
  "email_status": ["validated"],
  "seniority_level": ["c_suite", "vp", "director", "head", "manager"],
  "functional_level": ["marketing", "human_resources", "c_suite"],
  "file_name": "Prospects"
}
```

**This confirms**: N8N → Apify parameter transmission is working correctly.

---

## Root Cause Analysis

### Confirmed Facts
1. ✅ N8N → Apify parameter transmission is working correctly
2. ✅ `fetch_count: 200` is being received by the actor
3. ✅ All filter parameters (job titles, seniority, functional levels) are being received
4. ✅ N8N "Input JSON" parameter syntax is correct (`JSON.stringify()` wrapper required)
5. ❓ Actor behavior differs between N8N execution and Apify Console direct testing

### Hypotheses Under Investigation

#### Hypothesis #1: Actor-Side Logic Issue (HIGH PROBABILITY)
**Description**: The Apify Lead Finder Actor may have internal logic that overrides or ignores the `fetch_count` parameter under certain conditions.

**Evidence**:
- Actor receives `fetch_count: 200` but returns only 19 contacts
- 19 is a suspiciously specific number (not 10, 20, 25, 50, 100)
- Suggests a default/fallback behavior rather than random failure

**Investigation Steps**:
- [ ] Review Apify Lead Finder Actor documentation for `fetch_count` parameter behavior
- [ ] Check if actor has maximum limits or conditional logic for `fetch_count`
- [ ] Search for actor changelog/release notes mentioning `fetch_count` changes
- [ ] Contact Apify support to clarify `fetch_count` parameter behavior

#### Hypothesis #2: Data Availability Constraint (MEDIUM PROBABILITY)
**Description**: The actor cannot find 200 contacts matching the specified filter criteria.

**Evidence**:
- 12 domains × 10 job titles × 5 seniority levels × 3 functional levels = potentially restrictive
- Duplicate domain ("luxurypresence.com" appears twice) may indicate data quality issues
- Combination of filters may be too restrictive

**Investigation Steps**:
- [ ] Test with single domain to isolate data availability vs. configuration issue
- [ ] Test with broader filter criteria (remove seniority/functional filters)
- [ ] Calculate theoretical maximum contacts available for current filter combination
- [ ] Check if actor logs indicate "no more contacts found" vs. "stopped at 19"

#### Hypothesis #3: Missing Required Parameters (LOW PROBABILITY)
**Description**: Additional parameters may be required for `fetch_count` to work correctly.

**Evidence**:
- `file_name: "Prospects"` parameter is present but purpose is unclear
- Actor documentation may specify additional required parameters

**Investigation Steps**:
- [ ] Review complete actor input schema for all available parameters
- [ ] Compare current input with actor's example/default input
- [ ] Test removing `file_name` parameter to see if it affects behavior
- [ ] Test adding additional parameters (e.g., `max_results`, `limit`, etc.)

#### Hypothesis #4: Resource Constraints (LOW PROBABILITY)
**Description**: Memory/timeout limits may cause premature termination.

**Evidence**:
- Current configuration: 4096 MB memory, 500s timeout
- Should be sufficient for 200 contacts, but may not be

**Investigation Steps**:
- [ ] Review actor execution logs for memory/timeout warnings
- [ ] Test with increased memory (8192 MB) and timeout (900s)
- [ ] Check if actor logs show premature termination

#### Hypothesis #5: Rate Limiting (LOW PROBABILITY)
**Description**: Data source API rate limits may restrict results.

**Evidence**:
- Actor may be hitting LinkedIn or data provider rate limits
- 19 contacts could represent the limit before rate limiting kicks in

**Investigation Steps**:
- [ ] Review actor logs for rate limit warnings
- [ ] Test with smaller domain list (3-5 domains) to reduce API calls
- [ ] Check if actor has rate limiting configuration parameters

---

## Solutions Attempted

### 2025-10-30 - Attempt #1: Increase fetch_count in Builder Node
**Action**: Changed `fetch_count` from 100 to 200 in "Domain extraction and Apify input builder - 100 recs" node  
**Result**: ✅ SUCCESSFUL - Parameter now correctly set to 200  
**Outcome**: ❌ FAILED - Still returns 19 contacts  
**Conclusion**: Increasing `fetch_count` alone is insufficient; actor-side issue suspected

### 2025-10-30 - Attempt #2: Verify JSON.stringify() Syntax
**Action**: Confirmed "Input JSON" parameter uses correct `={{ JSON.stringify({...}) }}` syntax  
**Result**: ✅ CONFIRMED CORRECT  
**Outcome**: ℹ️ NO CHANGE - Configuration was already correct  
**Conclusion**: N8N configuration is not the issue

### 2025-10-30 - Attempt #3: Test Plain Object Expression
**Action**: Attempted to remove JSON.stringify() and use plain object expression  
**Result**: ❌ SYNTAX ERROR - Confirmed JSON.stringify() is required  
**Outcome**: ℹ️ LEARNING - "Input JSON" parameter requires string, not object  
**Conclusion**: Must use `JSON.stringify()` wrapper for "Input JSON" parameter

### 2025-10-30 - Attempt #4: Verify Input Data Presence
**Action**: Checked that all parameters exist in $json input data before Apify node  
**Result**: ✅ CONFIRMED - All parameters present  
**Outcome**: ℹ️ NO CHANGE - Data was already correct  
**Conclusion**: Data flow from builder node to Apify node is working correctly

### 2025-10-30 - Attempt #5: Search for Alternative Parameter Fields
**Action**: Looked for "Input", "Actor Input", or "Run Input" parameter fields in native Apify node  
**Result**: ℹ️ NOT APPLICABLE - "Input JSON" is the correct parameter field  
**Outcome**: ℹ️ NO CHANGE - Using correct parameter field  
**Conclusion**: Native Apify node uses "Input JSON" parameter (not "customBody")

### 2025-10-30 - Attempt #6: Verify Apify Console Direct Testing
**Action**: User reported actor works correctly in Apify Console with same parameters  
**Result**: ⚠️ NEEDS RE-VERIFICATION - Exact input parameters need to be compared  
**Outcome**: 🔄 PENDING - Need to identify differences between N8N input and Console test input  
**Conclusion**: Must obtain exact input from successful Console test for comparison

### 2025-10-30 - Attempt #7: Verify Parameter Transmission to Apify
**Action**: Checked Apify Console to see actual input received by actor  
**Result**: ✅ CONFIRMED - All parameters including `fetch_count: 200` are being received correctly  
**Outcome**: ✅ MAJOR DISCOVERY - Issue is NOT with N8N configuration; issue is with actor behavior  
**Conclusion**: Focus investigation on actor-side logic, data availability, or missing parameters

---

## Known Working Solutions
**None identified yet** - All attempts have failed to increase contact count beyond 19

---

## Known Non-Working Solutions
1. ❌ Increasing `fetch_count` parameter alone (without addressing actor-side issue)
2. ❌ Modifying N8N "Input JSON" parameter syntax (already correct)
3. ❌ Using plain object expression instead of JSON.stringify() (causes syntax error)
4. ❌ Verifying input data presence (data was already correct)
5. ❌ Searching for alternative parameter fields (using correct field)

---

## Next Steps to Investigate

### Priority 1: Analyze Apify Actor Behavior 🔴 CRITICAL
- [ ] Review Apify Lead Finder Actor documentation for `fetch_count` parameter behavior
- [ ] Check actor run logs in Apify Console for warnings/errors/rate limit messages
- [ ] Identify if actor has maximum limits or conditional logic for `fetch_count`
- [ ] Verify if additional parameters are required for `fetch_count` to work
- [ ] Contact Apify support with specific question about `fetch_count` parameter

### Priority 2: Compare with Working Apify Console Test 🟡 HIGH
- [ ] Obtain EXACT input parameters from successful Apify Console test (if it exists)
- [ ] Compare line-by-line with current N8N input parameters
- [ ] Identify ANY differences (parameter order, extra fields, missing fields, data types)
- [ ] Test if differences affect actor behavior
- [ ] **RE-VERIFY** that Console test actually returns 200+ contacts with same input

### Priority 3: Investigate Data Availability 🟡 HIGH
- [ ] Test with single domain (e.g., "odoo.com") to isolate data availability issue
- [ ] Test with broader filter criteria (remove seniority_level and functional_level filters)
- [ ] Test with only 2-3 job titles instead of 10
- [ ] Calculate theoretical maximum contacts available for current filter combination
- [ ] Check actor logs for "no more contacts found" messages

### Priority 4: Review Actor Resource Constraints 🟢 MEDIUM
- [ ] Check if 4GB memory is sufficient for 200 contacts
- [ ] Verify if 500s timeout is sufficient for actor execution
- [ ] Review actor logs for resource constraint warnings
- [ ] Test with increased memory (8192 MB) and timeout (900s) if needed

### Priority 5: Test Alternative Actor Configurations 🟢 MEDIUM
- [ ] Test removing `file_name: "Prospects"` parameter
- [ ] Test with different `email_status` values (e.g., ["validated", "unvalidated"])
- [ ] Test with actor's default/example input to establish baseline
- [ ] Check if actor has version or build tag that affects parameter handling

---

## References

### N8N Workflow
- **Workflow URL**: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx/executions/6075
- **Workflow ID**: `rClUELDAK9f4mgJx`
- **Execution ID**: `6075`
- **Node**: "Run an Actor" (ID: `900ee9f0-8962-4e20-aefd-b30ef5dde090`)

### Apify Actor
- **Actor ID**: `IoSHqwTR9YGhzccez`
- **Actor Name**: Apify Lead Finder (assumed)
- **Console URL**: https://console.apify.com/actors/IoSHqwTR9YGhzccez
- **Documentation**: [To be added after research]

### Related Documentation
- [Contact Enrichment Workshop Documentation] (to be created)
- [Apify Integration Best Practices] (to be created)
- [N8N Apify Node Documentation] (to be added)

---

## Lessons Learned

1. **Always verify parameter transmission first**: Check Apify Console input logs before assuming N8N configuration issues
2. **"Input JSON" parameter requires JSON.stringify()**: The @apify/n8n-nodes-apify node's "Input JSON" parameter expects a string, not a plain object
3. **Parameter transmission ≠ parameter respect**: Just because parameters are transmitted correctly doesn't mean the actor will respect their values
4. **19 is a suspiciously specific number**: Suggests default/fallback behavior rather than random failure or data availability constraint
5. **Actor-side investigation is critical**: When N8N configuration is confirmed correct, focus on actor documentation, logs, and support

---

## Troubleshooting Workflow

**For all future troubleshooting attempts, follow this workflow:**

1. **Document the attempt** in this index BEFORE implementation
2. **Specify the hypothesis** being tested
3. **Define success criteria** (what result would confirm/reject the hypothesis)
4. **Execute the test** and document the exact result
5. **Update the hypothesis** based on the result
6. **Add to "Known Non-Working Solutions"** if the attempt fails
7. **Add to "Known Working Solutions"** if the attempt succeeds

This ensures we don't repeat failed attempts and build institutional knowledge.

---

**END OF TROUBLESHOOTING INDEX**

