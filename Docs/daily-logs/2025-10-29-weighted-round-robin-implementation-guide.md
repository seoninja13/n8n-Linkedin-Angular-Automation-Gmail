# Weighted Round-Robin Implementation Guide
**Complete Code Snippets and Configuration for 80/20 Gmail/Outlook Distribution**

**Date Created**: 2025-10-29  
**Status**: IMPLEMENTATION READY  
**Related Documents**: 
- Main Plan: `2025-10-29-comprehensive-testing-production-deployment-plan.md`
- Dashboard Design: `2025-10-29-google-sheets-email-tracking-dashboard-design.md`

---

## 📋 OVERVIEW

This document provides **ready-to-use code snippets** and **step-by-step configuration guidance** for implementing weighted round-robin email account distribution (80% Gmail / 20% Outlook) in the LinkedIn automation pipeline.

### What You'll Find Here
1. **Weighted Round-Robin Code** (80/20 split) - Copy/paste ready
2. **Switch Node Configuration** - Exact settings
3. **Limit Node Management** - 3 options with detailed implementation
4. **Dynamic Limit Calculation Code** (Option C) - Fully automated
5. **Weighted Ratio Evolution Strategy** - When and how to adjust from 80/20 to other ratios

---

## 🎯 CODE SNIPPET 1: WEIGHTED ROUND-ROBIN (80% GMAIL / 20% OUTLOOK)

### Node Type: Code (n8n-nodes-base.code)
### Node Name: "Weighted Round-Robin Account Selector (80/20)"
### Position: After "Resume Filename Customizer" node in Outreach Tracking workflow

### Code (Copy/Paste Ready):

```javascript
// ============================================================
// WEIGHTED ROUND-ROBIN: 80% Gmail / 20% Outlook
// ============================================================
// Pattern: G G G G O G G G G O (repeats every 10 items)
// For every 10 emails: 8 Gmail, 2 Outlook
// ============================================================

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  
  // Calculate position in 10-item cycle
  const positionInCycle = i % 10;
  
  // Positions 4 and 9 go to Outlook (20%)
  // All other positions go to Gmail (80%)
  const accountType = (positionInCycle === 4 || positionInCycle === 9) ? 'outlook' : 'gmail';
  
  // Add metadata to item
  item.json.emailAccount = accountType;
  item.json.accountIndex = i;
  item.json.positionInCycle = positionInCycle;
  
  // Optional: Add timestamp for tracking
  item.json.assignedAt = new Date().toISOString();
}

return items;
```

### Expected Output:
```
Item 0: gmail
Item 1: gmail
Item 2: gmail
Item 3: gmail
Item 4: outlook  ← 20% position
Item 5: gmail
Item 6: gmail
Item 7: gmail
Item 8: gmail
Item 9: outlook  ← 20% position
Item 10: gmail (cycle repeats)
...
```

### Verification:
- For 10 items: 8 Gmail + 2 Outlook = 80/20 split ✅
- For 20 items: 16 Gmail + 4 Outlook = 80/20 split ✅
- For 100 items: 80 Gmail + 20 Outlook = 80/20 split ✅

---

## 🔀 CODE SNIPPET 2: SWITCH NODE CONFIGURATION

### Node Type: Switch (n8n-nodes-base.switch)
### Node Name: "Route to Gmail or Outlook"
### Position: After "Weighted Round-Robin Account Selector" node

### Configuration:

**Mode**: Rules

**Rule 1 (Gmail Route):**
- **Condition**: `{{ $json.emailAccount }}` equals `gmail`
- **Output**: Route 0 → Connect to Gmail send node

**Rule 2 (Outlook Route):**
- **Condition**: `{{ $json.emailAccount }}` equals `outlook`
- **Output**: Route 1 → Connect to Outlook send node

### JSON Configuration (for import):

```json
{
  "parameters": {
    "mode": "rules",
    "rules": {
      "rules": [
        {
          "operation": "equals",
          "value1": "={{ $json.emailAccount }}",
          "value2": "gmail",
          "output": 0
        },
        {
          "operation": "equals",
          "value1": "={{ $json.emailAccount }}",
          "value2": "outlook",
          "output": 1
        }
      ]
    },
    "options": {}
  },
  "name": "Route to Gmail or Outlook",
  "type": "n8n-nodes-base.switch"
}
```

### Node Connections:
```
Weighted Round-Robin Code Node
    ↓
Switch Node
    ├─ Route 0 → Gmail Send Node
    └─ Route 1 → Outlook Send Node
         ↓           ↓
         └───────────┘
              ↓
         Merge Node
```

---

## 📊 CODE SNIPPET 3: LIMIT NODE MANAGEMENT OPTIONS

### Option A: Manual Limit Node Updates (SIMPLEST - RECOMMENDED FOR PHASE 3 START)

**Implementation:**

1. **Node Type**: Limit (n8n-nodes-base.limit)
2. **Node Name**: "Daily Email Limit"
3. **Position**: BEFORE "Weighted Round-Robin Account Selector" node
4. **Configuration**:
   - **Max Items**: 10 (Day 1-2), then update every 2 days according to ramp-up schedule
   - **Keep**: First

**Update Schedule** (Manual - Every 2 Days):

| Days | Update Limit To | Notes |
|------|----------------|-------|
| 1-2 | 10 | Initial baseline |
| 3-4 | 15 | +50% increase |
| 5-6 | 20 | +33% increase |
| 7-8 | 25 | +25% increase |
| 9-10 | 30 | +20% increase |
| ... | ... | Continue per ramp-up schedule |

**Pros**: Simple, full control, easy to pause
**Cons**: Requires manual intervention every 2 days

---

### Option B: Workflow Variables (MODERATE COMPLEXITY)

**Implementation:**

1. **Add Workflow Variable**:
   - Variable name: `dailyEmailLimit`
   - Default value: `10`
   - Type: Number

2. **Modify Limit Node**:
   - **Max Items**: `{{ $workflow.settings.dailyEmailLimit }}`
   - **Keep**: First

3. **Update Process** (Every 2 Days):
   - Open workflow settings
   - Update `dailyEmailLimit` variable
   - Save workflow

**Pros**: Easier than finding node, can be changed via API
**Cons**: Still requires manual updates, N8N version compatibility

---

### Option C: Dynamic Limit Calculation Based on Date (MOST AUTOMATED)

**Implementation:**

1. **Add Code Node BEFORE Limit Node**:
   - **Node Name**: "Calculate Dynamic Email Limit"
   - **Position**: Before "Daily Email Limit" node

2. **Code** (Copy/Paste Ready):

```javascript
// ============================================================
// DYNAMIC EMAIL LIMIT CALCULATOR
// ============================================================
// Automatically calculates daily email limit based on:
// - Current date
// - Phase 3 start date
// - Ramp-up schedule
// ============================================================

// CONFIGURATION: Set your Phase 3 start date here
const PHASE_3_START_DATE = '2025-11-01'; // YYYY-MM-DD format

// Ramp-up schedule (days since start → email limit)
const RAMP_UP_SCHEDULE = {
  0: 10,   // Days 1-2
  2: 10,
  3: 15,   // Days 3-4
  4: 15,
  5: 20,   // Days 5-6
  6: 20,
  7: 25,   // Days 7-8
  8: 25,
  9: 30,   // Days 9-10
  10: 30,
  11: 35,  // Days 11-12
  12: 35,
  13: 40,  // Days 13-14
  14: 40,
  15: 45,  // Days 15-16
  16: 45,
  17: 50,  // Days 17-18
  18: 50,
  19: 55,  // Days 19-20
  20: 55,
  21: 60,  // Days 21-22
  22: 60,
  23: 65,  // Days 23-24
  24: 65,
  25: 75   // Days 25+ (target reached)
};

// Calculate days since Phase 3 start
const startDate = new Date(PHASE_3_START_DATE);
const currentDate = new Date();
const daysSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));

// Get limit from schedule (default to max if beyond schedule)
let dailyLimit = RAMP_UP_SCHEDULE[daysSinceStart] || 75;

// Safety check: Never exceed 75 emails/day
if (dailyLimit > 75) dailyLimit = 75;

// Return limit value
return [{
  json: {
    dailyEmailLimit: dailyLimit,
    daysSinceStart: daysSinceStart,
    calculatedDate: currentDate.toISOString().split('T')[0],
    phase3StartDate: PHASE_3_START_DATE
  }
}];
```

3. **Modify Limit Node**:
   - **Max Items**: `{{ $json.dailyEmailLimit }}`
   - **Keep**: First

**Pros**: Fully automated, no manual intervention, consistent schedule
**Cons**: Less flexible, requires code changes to pause/adjust

---

## 🔄 WEIGHTED RATIO EVOLUTION STRATEGY

### When to Adjust the Weighted Ratio

**Current Ratio**: 80% Gmail / 20% Outlook

**Adjustment Timeline**:

| Phase | Days | Gmail % | Outlook % | Gmail/Day | Outlook/Day | Total/Day | Trigger |
|-------|------|---------|-----------|-----------|-------------|-----------|---------|
| **Initial** | 1-10 | 80% | 20% | 8-24 | 2-6 | 10-30 | Start of Phase 3 |
| **Transition 1** | 11-15 | 75% | 25% | 26-34 | 9-11 | 35-45 | Outlook reaches 10/day consistently |
| **Transition 2** | 16-20 | 70% | 30% | 35-39 | 15-17 | 50-56 | Outlook reaches 15/day consistently |
| **Transition 3** | 21-25 | 65% | 35% | 39-43 | 21-24 | 60-67 | Outlook reaches 20/day consistently |
| **Target** | 25+ | 67% | 33% | 50 | 25 | 75 | Both accounts stable |

### How to Adjust the Weighted Ratio

**Method 1: Modify Code Node Pattern**

**Current Pattern (80/20)**: Positions 4 and 9 → Outlook (2 out of 10)

**New Pattern (75/25)**: Positions 3, 6, 9 → Outlook (3 out of 12)
```javascript
const positionInCycle = i % 12;
const accountType = (positionInCycle === 3 || positionInCycle === 6 || positionInCycle === 9) ? 'outlook' : 'gmail';
```

**New Pattern (70/30)**: Positions 2, 5, 8 → Outlook (3 out of 10)
```javascript
const positionInCycle = i % 10;
const accountType = (positionInCycle === 2 || positionInCycle === 5 || positionInCycle === 8) ? 'outlook' : 'gmail';
```

**New Pattern (67/33)**: Positions 2, 5 → Outlook (2 out of 6)
```javascript
const positionInCycle = i % 6;
const accountType = (positionInCycle === 2 || positionInCycle === 5) ? 'outlook' : 'gmail';
```

**Method 2: Percentage-Based Calculation (More Flexible)**

```javascript
// ============================================================
// FLEXIBLE WEIGHTED ROUND-ROBIN (CONFIGURABLE PERCENTAGE)
// ============================================================

// CONFIGURATION: Set desired Outlook percentage (0-100)
const OUTLOOK_PERCENTAGE = 20; // 20% = 80/20 split

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  
  // Calculate threshold for Outlook assignment
  const threshold = OUTLOOK_PERCENTAGE / 100;
  
  // Use modulo to create repeating pattern
  const cycleLength = 100; // Use 100 for precise percentage
  const positionInCycle = i % cycleLength;
  
  // Assign to Outlook if position is within threshold
  const accountType = (positionInCycle < (threshold * cycleLength)) ? 'outlook' : 'gmail';
  
  item.json.emailAccount = accountType;
  item.json.accountIndex = i;
}

return items;
```

**To adjust**: Simply change `OUTLOOK_PERCENTAGE` value:
- 20 = 80/20 split
- 25 = 75/25 split
- 30 = 70/30 split
- 33 = 67/33 split

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Weighted Round-Robin in Draft Mode

- [ ] Open Outreach Tracking workflow: https://n8n.srv972609.hstgr.cloud/workflow/Vp9DpKF3xT2ysHhx
- [ ] Add "Weighted Round-Robin Account Selector (80/20)" Code node
- [ ] Paste Code Snippet 1 (weighted round-robin code)
- [ ] Add "Route to Gmail or Outlook" Switch node
- [ ] Configure Switch node with Code Snippet 2 settings
- [ ] Connect Switch Route 0 to Gmail draft node
- [ ] Connect Switch Route 1 to Outlook draft node
- [ ] Add Merge node after both draft nodes
- [ ] Test with pinned data (10 items)
- [ ] Verify output: 8 Gmail drafts + 2 Outlook drafts
- [ ] Save workflow

### Phase 2: Add Limit Node and Switch to Send Mode

- [ ] Add "Daily Email Limit" Limit node BEFORE weighted round-robin node
- [ ] Set limit: 10
- [ ] Switch Gmail draft node to Gmail send node (resource: "message", operation: "send")
- [ ] Switch Outlook draft node to Outlook send node (resource: "message", operation: "send")
- [ ] Test with live data (10 emails)
- [ ] Verify output: 8 Gmail sent + 2 Outlook sent
- [ ] Save workflow

### Phase 3: Production Ramp-Up

- [ ] Choose Limit node management strategy (Option A, B, or C)
- [ ] If Option C: Add "Calculate Dynamic Email Limit" Code node
- [ ] If Option C: Paste Code Snippet 3 (dynamic limit calculator)
- [ ] If Option C: Update PHASE_3_START_DATE in code
- [ ] Set calendar reminders for Limit node updates (if Option A or B)
- [ ] Implement Google Sheets Email Tracking Dashboard (see separate document)
- [ ] Add "Aggregate Email Metrics" Code node (see dashboard document)
- [ ] Add "Log to Email Tracking Dashboard" Google Sheets node
- [ ] Test end-to-end with live data
- [ ] Monitor dashboard daily
- [ ] Adjust Limit node every 2 days per ramp-up schedule

---

## 🔧 TROUBLESHOOTING

### Issue: Distribution is not 80/20

**Symptoms**: Getting 50/50 or other unexpected distribution

**Causes**:
1. Weighted round-robin code not implemented correctly
2. Switch node routing to wrong accounts
3. Limit node cutting off before full cycle completes

**Solutions**:
1. Verify Code Snippet 1 is pasted exactly (check positions 4 and 9)
2. Check Switch node routes: Route 0 = Gmail, Route 1 = Outlook
3. Ensure Limit value is multiple of 10 (10, 20, 30, etc.) for exact 80/20 split

### Issue: Limit node not working

**Symptoms**: More emails sent than expected

**Causes**:
1. Limit node positioned incorrectly (should be BEFORE weighted round-robin)
2. Limit value not saved
3. Multiple execution paths bypassing limit

**Solutions**:
1. Move Limit node to correct position (before weighted round-robin)
2. Save workflow after changing limit value
3. Check workflow structure - ensure all paths go through Limit node

### Issue: Dynamic limit calculator not working (Option C)

**Symptoms**: Always getting same limit value, or incorrect limit

**Causes**:
1. PHASE_3_START_DATE not set correctly
2. Date format incorrect (must be YYYY-MM-DD)
3. System date/time incorrect

**Solutions**:
1. Update PHASE_3_START_DATE to actual Phase 3 start date
2. Verify date format: '2025-11-01' (with quotes, YYYY-MM-DD)
3. Check N8N server date/time settings

---

## 📚 RELATED DOCUMENTS

1. **Main Plan**: `2025-10-29-comprehensive-testing-production-deployment-plan.md`
   - Full 3-phase testing and deployment strategy
   - Ramp-up schedule and success criteria
   - Risk mitigation and rollback procedures

2. **Dashboard Design**: `2025-10-29-google-sheets-email-tracking-dashboard-design.md`
   - Google Sheets structure and schema
   - Automated logging implementation
   - Visualization and monitoring guidance

3. **N8N Workflow URLs**:
   - Orchestrator: https://n8n.srv972609.hstgr.cloud/workflow/fGpR7xvrOO7PBa0c
   - Outreach Tracking: https://n8n.srv972609.hstgr.cloud/workflow/Vp9DpKF3xT2ysHhx

---

**END OF WEIGHTED ROUND-ROBIN IMPLEMENTATION GUIDE**

**All code snippets are ready to copy/paste directly into N8N nodes.**

