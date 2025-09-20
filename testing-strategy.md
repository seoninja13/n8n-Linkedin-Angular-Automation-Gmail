# N8N DUPLICATE PREVENTION TESTING STRATEGY

## Test Scenario 1: New Application (Baseline)
**Input:** Unique job never seen before
- Company: "TestCorp Inc"
- Job Title: "Senior Developer"
- Expected dedupeKey: "testcorpinc|seniordeveloper"

**Expected Results:**
- ✅ status = "PREPARED"
- ✅ isDuplicate = false
- ✅ duplicateCount = 1
- ✅ duplicateDetectedAt = null
- ✅ New row created in Google Sheets
- ✅ Workflow continues to Outreach Tracking
- ✅ Final status = "DRAFTED"

**Validation Steps:**
1. Check Google Sheets for new row with correct data
2. Verify Outreach Tracking workflow executes
3. Confirm Gmail draft is created
4. Validate status progression: PREPARED → DRAFTED

## Test Scenario 2: First Duplicate Detection
**Input:** Same job as Test Scenario 1
- Company: "TestCorp Inc"
- Job Title: "Senior Developer"
- Expected dedupeKey: "testcorpinc|seniordeveloper"

**Expected Results:**
- ✅ status = "DUPLICATE"
- ✅ isDuplicate = true
- ✅ duplicateCount = 2
- ✅ duplicateDetectedAt = current timestamp
- ✅ originalApplicationDate = timestamp from first application
- ✅ New row created in Google Sheets (marked as DUPLICATE)
- ✅ Workflow terminates (Outreach Tracking skipped)
- ✅ Cost savings achieved

**Validation Steps:**
1. Check Google Sheets for second row with DUPLICATE status
2. Verify Outreach Tracking workflow is NOT executed
3. Confirm no Gmail draft is created
4. Validate termination signal in orchestrator logs

## Test Scenario 3: Multiple Duplicate Attempts
**Input:** Same job submitted 3rd time
- Company: "TestCorp Inc"
- Job Title: "Senior Developer"

**Expected Results:**
- ✅ status = "DUPLICATE"
- ✅ isDuplicate = true
- ✅ duplicateCount = 3
- ✅ Third row created in Google Sheets
- ✅ Consistent termination behavior

**Validation Steps:**
1. Check Google Sheets for third row
2. Verify duplicate count increments correctly
3. Confirm consistent termination behavior

## Test Scenario 4: Similar but Different Jobs
**Input:** Same company, different job title
- Company: "TestCorp Inc"
- Job Title: "Junior Developer"
- Expected dedupeKey: "testcorpinc|juniordeveloper"

**Expected Results:**
- ✅ status = "PREPARED" (treated as new application)
- ✅ isDuplicate = false
- ✅ Different dedupeKey generated
- ✅ Normal processing continues

**Validation Steps:**
1. Verify different dedupeKey is generated
2. Confirm treated as new application
3. Check normal workflow execution

## Test Scenario 5: Data Integrity Validation
**Input:** Various job applications over time

**Expected Results:**
- ✅ All applications tracked in Google Sheets
- ✅ No data loss
- ✅ Proper status progression
- ✅ Accurate duplicate detection

**Validation Steps:**
1. Review complete Google Sheets data
2. Verify no missing applications
3. Check status consistency
4. Validate duplicate detection accuracy

## Test Scenario 6: Error Handling
**Input:** Malformed data, Google Sheets API failures

**Expected Results:**
- ✅ Graceful fallbacks
- ✅ Error logging
- ✅ System continues operating
- ✅ No workflow crashes

**Validation Steps:**
1. Test with missing required fields
2. Simulate Google Sheets API failures
3. Verify error handling and logging
4. Confirm system resilience

## Performance Testing
**Metrics to Monitor:**
- Execution time comparison (before/after)
- Google Sheets API call frequency
- Memory usage during duplicate detection
- Cost savings from terminated workflows

## Success Criteria
- ✅ 100% duplicate detection accuracy
- ✅ 50-80% reduction in AI processing costs for duplicates
- ✅ Complete audit trail of all applications
- ✅ <1% error rate in duplicate detection
- ✅ No data loss or corruption
- ✅ Proper workflow termination for duplicates
