# 📅 WEEKLY EMAIL DISTRIBUTION ADJUSTMENT GUIDE

**Last Updated**: 2025-11-19
**Workflow**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment
**Node**: Dynamic Priority-Based Account Selector
**Current Version**: v6.0-ADAPTIVE-MODULO-BASE
**Architecture Version**: v1.0.0-COUNTER-INCREMENT-FIX (2025-11-19)

---

## **🔧 IMPORTANT: COUNTER INCREMENT FIX (2025-11-19)**

**What Changed**: A new node "Assign Counter to Each Item" was added to the orchestrator workflow to fix the counter increment failure. This ensures each email receives a unique sequential counter value.

**Impact on This Guide**: No changes needed to the weekly adjustment process. The counter increment fix works seamlessly with the adaptive modulo base strategy.

**For Details**: See `Docs/architecture/counter-increment-fix-documentation.md`

---

## **⏰ WHEN TO ADJUST: EVERY MONDAY MORNING (5 MINUTES)**

Set a recurring calendar reminder for **Monday 9:00 AM** to perform this weekly adjustment.

---

## **📊 STEP 1: CALCULATE YOUR WEEKLY EMAIL VOLUME**

Check your planned email volume for the upcoming week:

- **Week 1 (Current)**: ~20-25 emails/week (~3-4 emails/day)
- **Week 2**: ~40 emails/week (~6 emails/day)
- **Week 3**: ~60 emails/week (~9 emails/day)
- **Week 4+**: 100+ emails/week (14+ emails/day)

**How to Calculate**:
```
Weekly Volume = Daily Capacity × 7 days
Example: 13 emails/day × 7 = 91 emails/week
```

---

## **🔢 STEP 2: DETERMINE MODULO BASE**

Use this simple decision tree:

| Weekly Email Volume | Modulo Base | Reason |
|---------------------|-------------|--------|
| **20-40 emails** | `moduloBase = 10` | Provides 2-4 full cycles through distribution pattern |
| **40-60 emails** | `moduloBase = 20` | Provides 2-3 full cycles through distribution pattern |
| **60-100 emails** | `moduloBase = 20` | Provides 3-5 full cycles through distribution pattern |
| **100+ emails** | `moduloBase = 100` | Original design - precise percentage distribution |

**Quick Formula** (if you prefer math):
```javascript
moduloBase = Math.max(10, Math.ceil(weeklyEmailVolume / 5));
```

---

## **🛠️ STEP 3: UPDATE THE N8N WORKFLOW**

### **3.1 Open the Workflow**

1. Navigate to: https://n8n.srv972609.hstgr.cloud/workflow/WUe4y8iYEXNAB6dq
2. Find the node: **"Dynamic Priority-Based Account Selector"**
3. Click to open the code editor

### **3.2 Locate the Configuration Line**

Find this section at the top of the code (around line 13):

```javascript
// 📅 WEEKLY CONFIGURATION (MANUAL ADJUSTMENT)
// Change this value every week based on your email volume:
// Week 1 (20-25 emails/week): moduloBase = 10
// Week 2 (40 emails/week): moduloBase = 10
// Week 3 (60 emails/week): moduloBase = 20
// Week 4+ (100+ emails/week): moduloBase = 100
const WEEKLY_MODULO_BASE = 10;  // ← CHANGE THIS VALUE WEEKLY
```

### **3.3 Update the Value**

Change the number on line 13 to your new modulo base:

**Example**:
```javascript
// Week 1: 25 emails
const WEEKLY_MODULO_BASE = 10;

// Week 2: 40 emails
const WEEKLY_MODULO_BASE = 10;

// Week 3: 60 emails
const WEEKLY_MODULO_BASE = 20;

// Week 4+: 100+ emails
const WEEKLY_MODULO_BASE = 100;
```

### **3.4 Save the Workflow**

1. Click **"Save"** button (top right)
2. Verify the workflow version number incremented
3. Note the new version number for your records

---

## **✅ STEP 4: VERIFY THE CHANGE**

### **4.1 Check Console Logs**

Run a test execution and check the console logs for:

```
📊 Dynamic Priority-Based Account Selector (Adaptive Modulo)
   Active accounts: 3
   📅 Weekly Modulo Base: 10  ← Should show your new value
```

### **4.2 Verify Distribution**

Check that the slot allocation matches your expectations:

**For moduloBase = 10**:
```
   gmail-dachevivo: slots 0-6 (7 slots)
   gmail-ivoddachev: slots 7-7 (1 slot)
   gmail-ivodachevd: slots 8-9 (2 slots)
```

**For moduloBase = 20**:
```
   gmail-dachevivo: slots 0-13 (14 slots)
   gmail-ivoddachev: slots 14-15 (2 slots)
   gmail-ivodachevd: slots 16-19 (4 slots)
```

---

## **📈 EXPECTED DISTRIBUTION BY WEEK**

### **Week 1: 25 Emails (moduloBase = 10)**

| Account | Expected Emails | Percentage | Daily Average | Limit Compliance |
|---------|-----------------|------------|---------------|------------------|
| gmail-dachevivo | 18 emails | 72% | 2.6/day | ✅ (under 10/day) |
| gmail-ivoddachev | 2 emails | 8% | 0.3/day | ✅ (under 3/day) |
| gmail-ivodachevd | 5 emails | 20% | 0.7/day | ✅ (under 3/day) |

### **Week 2: 40 Emails (moduloBase = 10)**

| Account | Expected Emails | Percentage | Daily Average | Limit Compliance |
|---------|-----------------|------------|---------------|------------------|
| gmail-dachevivo | 28 emails | 70% | 4/day | ✅ (under 10/day) |
| gmail-ivoddachev | 4 emails | 10% | 0.6/day | ✅ (under 3/day) |
| gmail-ivodachevd | 8 emails | 20% | 1.1/day | ✅ (under 3/day) |

### **Week 3: 60 Emails (moduloBase = 20)**

| Account | Expected Emails | Percentage | Daily Average | Limit Compliance |
|---------|-----------------|------------|---------------|------------------|
| gmail-dachevivo | 42 emails | 70% | 6/day | ✅ (under 10/day) |
| gmail-ivoddachev | 6 emails | 10% | 0.9/day | ✅ (under 3/day) |
| gmail-ivodachevd | 12 emails | 20% | 1.7/day | ✅ (under 3/day) |

### **Week 4+: 100+ Emails (moduloBase = 100)**

| Account | Expected Emails | Percentage | Daily Average | Limit Compliance |
|---------|-----------------|------------|---------------|------------------|
| gmail-dachevivo | 70 emails | 70% | 10/day | ✅ (at 10/day limit) |
| gmail-ivoddachev | 10 emails | 10% | 1.4/day | ✅ (under 3/day) |
| gmail-ivodachevd | 20 emails | 20% | 2.9/day | ✅ (under 3/day) |

---

## **📝 ADJUSTMENT LOG**

Keep track of your weekly adjustments:

| Date | Week # | Email Volume | Modulo Base | Version # | Notes |
|------|--------|--------------|-------------|-----------|-------|
| 2025-11-19 | Week 1 | 25 emails | 10 | 193 | Initial adaptive implementation |
| | Week 2 | | | | |
| | Week 3 | | | | |
| | Week 4 | | | | |

---

## **🚨 TROUBLESHOOTING**

### **Issue: Distribution doesn't match expectations**

**Solution**: Check the counter value in execution logs. If counter is stuck at the same value, investigate the "Update Counter" node.

### **Issue: Priority 2 accounts getting too many emails**

**Solution**: Reduce the modulo base. Example: If using 20, try 10 instead.

### **Issue: Priority 1 account hitting daily limit**

**Solution**: Increase Priority 2 account daily limits in Email-Account-Config sheet.

---

## **📞 SUPPORT**

If you encounter issues with the weekly adjustment:

1. Check the N8N execution logs for error messages
2. Verify the Email-Account-Config sheet has correct priority values
3. Review the console logs for the "Dynamic Priority-Based Account Selector" node
4. Contact support with the workflow version number and execution ID

---

**Next Adjustment Due**: [Set your calendar reminder for next Monday]

