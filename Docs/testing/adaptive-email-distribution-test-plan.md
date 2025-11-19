# 🧪 ADAPTIVE EMAIL DISTRIBUTION - TEST EXECUTION PLAN

**Test Date**: 2025-11-19  
**Workflow**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment  
**Workflow ID**: WUe4y8iYEXNAB6dq  
**Version**: 193 (v6.0-ADAPTIVE-MODULO-BASE)  
**Test Objective**: Verify adaptive modulo base is working correctly with Week 1 configuration (moduloBase = 10)

---

## **TEST SCENARIO: WEEK 1 CONFIGURATION**

**Configuration**:
- **Weekly Email Volume**: 20-25 emails
- **Modulo Base**: 10
- **Active Accounts**: 3 Gmail accounts
- **Priority Distribution**: P1: 70%, P2: 20%, P99: 10%

**Expected Slot Allocation**:
- **gmail-dachevivo** (Priority 1): Slots 0-6 (7 slots = 70%)
- **gmail-ivoddachev** (Priority 2): Slot 7 (1 slot = 10%)
- **gmail-ivodachevd** (Priority 2): Slots 8-9 (2 slots = 20%)

---

## **TEST EXECUTION STEPS**

### **Step 1: Verify Current Counter Value**

1. Open Google Sheets: [Email Daily Tracking](https://docs.google.com/spreadsheets/d/1NgFM2ujALlcApbyAuYNWJ5Hyf0UkO0efQlGAzoifC8c/edit#gid=0)
2. Check Row 2, Column "counter"
3. Note the current counter value: **_______**

### **Step 2: Trigger Test Execution**

1. Navigate to the main orchestrator workflow
2. Trigger a manual execution with 1-3 test jobs
3. Wait for execution to complete
4. Note the execution ID: **_______**

### **Step 3: Verify Console Logs**

Check the "Dynamic Priority-Based Account Selector" node logs for:

**Expected Log Output**:
```
📊 Dynamic Priority-Based Account Selector (Adaptive Modulo)
   Active accounts: 3
   📅 Weekly Modulo Base: 10  ← VERIFY THIS IS 10
   Priority 1 accounts: 1
   Priority 2 accounts: 2
   Priority 99 accounts: 0
   gmail-dachevivo: 70.0% (Priority 1)
   gmail-ivoddachev: 10.0% (Priority 2)
   gmail-ivodachevd: 20.0% (Priority 2)
   Modulo base: 10  ← VERIFY THIS IS 10
   gmail-dachevivo: slots 0-6 (7 slots)
   gmail-ivoddachev: slots 7-7 (1 slot)
   gmail-ivodachevd: slots 8-9 (2 slots)
   Current counter: [X]
   Modulo value: [X % 10]
   ✅ Selected account: [account name]
   Email address: [email]
   Priority: [1 or 2]
   Percentage: [70.0% or 10.0% or 20.0%]
```

**Verification Checklist**:
- [ ] Weekly Modulo Base shows 10
- [ ] Modulo base shows 10
- [ ] Slot allocation matches expected (0-6, 7, 8-9)
- [ ] Account selection is based on modulo value
- [ ] Metadata includes `weeklyModuloBase: 10`
- [ ] Fix version shows `v6.0-ADAPTIVE-MODULO-BASE`

### **Step 4: Verify Account Selection Logic**

Test with different counter values to verify correct account selection:

| Counter Value | Modulo Value (counter % 10) | Expected Account | Actual Account | ✅/❌ |
|---------------|------------------------------|------------------|----------------|-------|
| 0 | 0 | gmail-dachevivo | | |
| 1 | 1 | gmail-dachevivo | | |
| 5 | 5 | gmail-dachevivo | | |
| 7 | 7 | gmail-ivoddachev | | |
| 8 | 8 | gmail-ivodachevd | | |
| 9 | 9 | gmail-ivodachevd | | |
| 10 | 0 | gmail-dachevivo | | |
| 15 | 5 | gmail-dachevivo | | |
| 17 | 7 | gmail-ivoddachev | | |
| 20 | 0 | gmail-dachevivo | | |

### **Step 5: Verify Email Metrics Aggregation**

Check the "Aggregate Email Metrics" node output:

**Expected Metadata**:
```json
{
  "accountSelectionMetadata": {
    "moduloBase": 10,
    "weeklyModuloBase": 10,
    "distributionStrategy": "ADAPTIVE-PRIORITY-BASED-WEIGHTED",
    "tierRules": "P1:70% P2:20% P99:10%",
    "fixVersion": "v6.0-ADAPTIVE-MODULO-BASE"
  }
}
```

**Verification Checklist**:
- [ ] `moduloBase` is 10
- [ ] `weeklyModuloBase` is 10
- [ ] `distributionStrategy` is "ADAPTIVE-PRIORITY-BASED-WEIGHTED"
- [ ] `fixVersion` is "v6.0-ADAPTIVE-MODULO-BASE"

### **Step 6: Verify Google Sheets Update**

Check the Email Daily Tracking sheet:

**Expected Row**:
- Counter incremented by 1
- Email metrics logged correctly
- Account selection matches console logs

---

## **TEST RESULTS**

### **Test Execution Summary**

| Metric | Expected | Actual | Status |
|--------|----------|--------|--------|
| Modulo Base | 10 | | |
| Slot Allocation | 0-6, 7, 8-9 | | |
| Account Selection Logic | Correct | | |
| Counter Increment | +1 | | |
| Metadata Version | v6.0 | | |

### **Issues Found**

| Issue # | Description | Severity | Resolution |
|---------|-------------|----------|------------|
| | | | |

### **Test Conclusion**

- [ ] **PASS**: All verification steps completed successfully
- [ ] **FAIL**: Issues found (see above)
- [ ] **PARTIAL**: Some issues found but non-critical

---

## **NEXT STEPS**

### **If Test PASSES**:
1. ✅ Mark this test as complete
2. ✅ Document the baseline for Week 1
3. ✅ Schedule next test for Week 2 (when volume increases to 40 emails)
4. ✅ Set calendar reminder for Monday to adjust modulo base

### **If Test FAILS**:
1. ❌ Document all issues found
2. ❌ Investigate root cause
3. ❌ Apply fixes to the workflow
4. ❌ Re-run test execution
5. ❌ Update this document with new test results

---

## **WEEK 2 TEST PLAN (FUTURE)**

**When to Execute**: When weekly volume reaches 40 emails

**Configuration Changes**:
- Keep `moduloBase = 10` (no change from Week 1)
- Expected distribution: 70% / 10% / 20% (same as Week 1)

**Test Focus**:
- Verify distribution holds at higher volume
- Check daily limit compliance
- Monitor Priority 2 account usage

---

## **WEEK 3 TEST PLAN (FUTURE)**

**When to Execute**: When weekly volume reaches 60 emails

**Configuration Changes**:
- Change `moduloBase = 20`
- Expected slot allocation: 0-13, 14-15, 16-19

**Test Focus**:
- Verify new modulo base is applied
- Check slot allocation matches expectations
- Verify distribution percentages remain 70% / 10% / 20%

---

## **TEST EXECUTION LOG**

| Date | Week # | Volume | Modulo Base | Execution ID | Result | Notes |
|------|--------|--------|-------------|--------------|--------|-------|
| 2025-11-19 | Week 1 | 25 | 10 | | | Initial test |
| | Week 2 | 40 | 10 | | | |
| | Week 3 | 60 | 20 | | | |
| | Week 4+ | 100+ | 100 | | | |

---

**Test Prepared By**: Augment Agent  
**Test Approved By**: [Your Name]  
**Test Execution Date**: [Fill in after execution]

