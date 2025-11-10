# Daily Execution Cap - Visual Workflow Diagram

**Workflow**: LinkedIn-SEO-GmailOutlook-Orchestrator--Augment  
**Implementation Date**: 2025-11-06

---

## **COMPLETE WORKFLOW STRUCTURE (20 Nodes)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAIN ORCHESTRATOR WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

[Manual Trigger]
    ↓
[AI Agent - Dynamic Interface] ←─── [Google Gemini Chat Model]
    ↓
[SEO - Job Discovery Workshop]
    ↓
[Job Matching Scoring Workshop]
    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🆕 DAILY EXECUTION CAP NODES (6)                         │
└─────────────────────────────────────────────────────────────────────────────┘
    ↓
[Read Daily Execution Counter] ← Reads "Logs-Execution-Cap" sheet
    ↓
[Calculate Remaining Capacity] ← Calculates: dailyLimit (30) - currentCount
    ↓
[Route Based on Capacity] ← Switch node with 2 branches
    ├─ Branch 0: Has Capacity (remainingCapacity > 0)
    │   ↓
    │   [Slice Jobs Array] ← Limits jobs to remaining capacity
    │   ↓
    │   [Increment Counter] ← Updates executionCount in Google Sheets
    │   ↓
    │   [Contact Enrichment Workshop] ← Continues normal flow
    │   ↓
    │   [Filter - stop spawning new generations]
    │   ↓
    │   [Resume Generation Workshop]
    │   ↓
    │   [Contact Tracking Workshop]
    │   ↓
    │   [Data Validation]
    │   ↓
    │   [Switch]
    │   ├─ Valid → [Outreach Tracking Workshop]
    │   └─ Invalid → [Log Validation Failures]
    │
    └─ Branch 1: No Capacity (remainingCapacity = 0)
        ↓
        [Log Limit Reached] ← Updates timesLimitReached + lastBlockedAt
        ↓
        [WORKFLOW TERMINATES] ← No further processing
```

---

## **DETAILED NODE POSITIONS (Canvas Coordinates)**

### **Original 14 Nodes**
```
Node                                    X       Y       Type
─────────────────────────────────────────────────────────────────────
Manual Trigger                       -2016    -96     Trigger
AI Agent - Dynamic Interface         -1824    -96     AI Agent
Google Gemini Chat Model             -1904     96     LLM
SEO - Job Discovery Workshop         -1648    128     Execute Workflow
Job Matching Scoring Workshop        -1344    128     Execute Workflow
Contact Enrichment Workshop          -1040    128     Execute Workflow
Filter - stop spawning               -720     128     Filter
Resume Generation Workshop           -1600    480     Execute Workflow
Contact Tracking Workshop            -1296    480     Execute Workflow
Data Validation                      -1088    480     Code
Switch                               -880     480     Switch
Outreach Tracking Workshop           -624     400     Execute Workflow
Log Validation Failures              -592     592     Google Sheets
Sticky Note                          -1088   -176     UI Element
```

### **New 6 Daily Execution Cap Nodes**
```
Node                                    X       Y       Type
─────────────────────────────────────────────────────────────────────
Read Daily Execution Counter         -1200    128     Google Sheets
Calculate Remaining Capacity         -1000    128     Code
Route Based on Capacity              -800     128     Switch
Slice Jobs Array                     -600      50     Code
Increment Counter                    -400      50     Google Sheets
Log Limit Reached                    -600     200     Google Sheets
```

---

## **CONNECTION MAPPING (8 Operations)**

### **🔴 REMOVE (1 connection)**
```
FROM: Job Matching Scoring Workshop (output 0)
TO:   Contact Enrichment Workshop (input 0)
```

### **✅ ADD (7 connections)**

**Connection 1:**
```
FROM: Job Matching Scoring Workshop (output 0)
TO:   Read Daily Execution Counter (input 0)
```

**Connection 2:**
```
FROM: Read Daily Execution Counter (output 0)
TO:   Calculate Remaining Capacity (input 0)
```

**Connection 3:**
```
FROM: Calculate Remaining Capacity (output 0)
TO:   Route Based on Capacity (input 0)
```

**Connection 4 (Branch 0: Has Capacity):**
```
FROM: Route Based on Capacity (output 0)
TO:   Slice Jobs Array (input 0)
```

**Connection 5 (Branch 1: No Capacity):**
```
FROM: Route Based on Capacity (output 1)
TO:   Log Limit Reached (input 0)
```

**Connection 6:**
```
FROM: Slice Jobs Array (output 0)
TO:   Increment Counter (input 0)
```

**Connection 7:**
```
FROM: Increment Counter (output 0)
TO:   Contact Enrichment Workshop (input 0)
```

---

## **DATA FLOW EXAMPLE**

### **Scenario 1: First Execution of the Day (Counter = 0)**

```
Job Matching returns 50 jobs
    ↓
Read Counter: executionCount = 0
    ↓
Calculate Capacity: remainingCapacity = 30 (30 - 0)
    ↓
Route: hasCapacity = true → Branch 0
    ↓
Slice Jobs: Take first 30 jobs (out of 50)
    ↓
Increment Counter: executionCount = 30 (0 + 30)
    ↓
Contact Enrichment: Process 30 jobs
    ↓
[Continue normal workflow...]
```

### **Scenario 2: Mid-Day Execution (Counter = 25)**

```
Job Matching returns 50 jobs
    ↓
Read Counter: executionCount = 25
    ↓
Calculate Capacity: remainingCapacity = 5 (30 - 25)
    ↓
Route: hasCapacity = true → Branch 0
    ↓
Slice Jobs: Take first 5 jobs (out of 50)
    ↓
Increment Counter: executionCount = 30 (25 + 5)
    ↓
Contact Enrichment: Process 5 jobs
    ↓
[Continue normal workflow...]
```

### **Scenario 3: Limit Reached (Counter = 30)**

```
Job Matching returns 50 jobs
    ↓
Read Counter: executionCount = 30
    ↓
Calculate Capacity: remainingCapacity = 0 (30 - 30)
    ↓
Route: hasCapacity = false → Branch 1
    ↓
Log Limit Reached: 
  - timesLimitReached = 1 (0 + 1)
  - lastBlockedAt = "2025-11-06T14:30:00-08:00"
    ↓
[WORKFLOW TERMINATES - No jobs processed]
```

---

## **GOOGLE SHEETS INTEGRATION**

### **Document**: 1aIEqn8Dz6sKchrcTf6imEgs3KTzI2Q6CMj46KsgChHA
### **Sheet**: "Logs-Execution-Cap"

**Columns (7 total):**
```
A: date              (YYYY-MM-DD)
B: executionCount    (integer, counts individual jobs processed)
C: dailyLimit        (integer, e.g., 30)
D: lastResetAt       (ISO 8601 with timezone)
E: timezone          (IANA timezone, e.g., "America/Los_Angeles")
F: timesLimitReached (integer, tracks how many times limit was hit)
G: lastBlockedAt     (ISO 8601 timestamp, tracks when limit was last reached)
```

**Sample Data:**
```
date       | executionCount | dailyLimit | lastResetAt              | timezone            | timesLimitReached | lastBlockedAt
-----------|----------------|------------|--------------------------|---------------------|-------------------|---------------------------
2025-11-06 | 30             | 30         | 2025-11-06T00:00:00-08:00| America/Los_Angeles | 2                 | 2025-11-06T14:30:00-08:00
```

---

**Diagram Version**: 1.0  
**Last Updated**: 2025-11-06  
**Author**: Augment Agent

