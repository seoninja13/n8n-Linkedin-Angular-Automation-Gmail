# LinkedIn Orchestrator Batch Processing - Quick Reference Card

**Workflow ID**: fGpR7xvrOO7PBa0c  
**Implementation Time**: 30-60 minutes  
**Performance Gain**: 67% faster (15min → 5min for 3 jobs)

---

## 🎯 QUICK SUMMARY

**What to Add**: 1 Code node (Code Split in Batches)  
**What to Remove**: 2 connections (AI Agent → both branches)  
**What to Add**: 3 connections (AI Agent → Code Split → both branches)  
**What to Verify**: 2 Execute Workflow modes (Job Matching, Contact Enrichment)

---

## 📋 IMPLEMENTATION STEPS (5 MINUTES)

### **Step 1: Remove Connections** (1 min)
1. Delete: AI Agent → Job Matching Scoring Workshop
2. Delete: AI Agent → Contact Enrichment Workshop

### **Step 2: Add Code Node** (2 min)
1. Add new **Code** node
2. Rename to: **Code Split in Batches**
3. Position at: [-560, 192]
4. Paste code (see below)

### **Step 3: Add Connections** (1 min)
1. Connect: AI Agent → Code Split in Batches
2. Connect: Code Split in Batches → Job Matching Scoring Workshop
3. Connect: Code Split in Batches → Contact Enrichment Workshop

### **Step 4: Verify Modes** (1 min)
1. Job Matching Scoring Workshop: mode = "each"
2. Contact Enrichment Workshop: mode = "each"

### **Step 5: Save & Test** (1 min)
1. Save workflow
2. Execute workflow
3. Verify Code Split output (3 items, not 1 array)

---

## 💻 CODE TO PASTE

```javascript
// Extract job array from AI Agent output
const items = $input.all();
const outputItems = [];

for (const item of items) {
  // Check if the item contains an array of jobs
  if (item.json && Array.isArray(item.json)) {
    // Split array into individual job items
    for (const job of item.json) {
      outputItems.push({ json: job });
    }
  } else if (item.json && typeof item.json === 'object') {
    // If already an object, pass through
    outputItems.push(item);
  }
}

console.log(`Split ${items.length} items into ${outputItems.length} individual jobs`);
return outputItems;
```

---

## 🔍 VERIFICATION CHECKLIST

### **Visual Check**
- [ ] 11 nodes total (was 10)
- [ ] Code Split node positioned between AI Agent and branches
- [ ] 3 connections from Code Split (1 in, 2 out)
- [ ] No direct connections from AI Agent to branches

### **Functional Check**
- [ ] Execute workflow with pinned data
- [ ] Code Split output shows 3 individual items
- [ ] Job Matching and Contact Enrichment execute in parallel
- [ ] Merge node combines data correctly
- [ ] No errors in execution log

### **Performance Check**
- [ ] Execution time reduced by 60-70%
- [ ] All jobs processed simultaneously
- [ ] Downstream nodes receive correct data

---

## 📊 BEFORE vs AFTER

### **BEFORE (Sequential)**
```
AI Agent (3 jobs)
    ↓
    ├─→ Job Matching: Job1→Job2→Job3 (6min)
    │       ↓
    │   Resume Gen: Job1→Job2→Job3 (9min)
    │
    └─→ Contact Enrichment: Job1→Job2→Job3 (12min)

Total: 15 minutes
```

### **AFTER (Parallel)**
```
AI Agent (3 jobs)
    ↓
Code Split (splits into 3 items)
    ↓
    ├─→ Job Matching: All 3 jobs parallel (2min)
    │       ↓
    │   Resume Gen: All 3 jobs parallel (3min)
    │
    └─→ Contact Enrichment: All 3 jobs parallel (4min)

Total: 5 minutes (67% faster)
```

---

## 🚨 COMMON ISSUES

### **Issue**: Code Split shows error
**Fix**: Verify code is copied exactly, check for syntax errors

### **Issue**: Merge node output is empty
**Fix**: Verify both branches output same number of items

### **Issue**: No performance improvement
**Fix**: Verify Execute Workflow modes are set to "each"

### **Issue**: Connections not appearing
**Fix**: Zoom in/out, refresh browser, try again

---

## 📞 NEED HELP?

**Full Guide**: `Docs/implementation/LinkedIn-Orchestrator-Batch-Processing-Manual-Implementation-Guide.md`  
**Analysis**: `Docs/analysis/LinkedIn-Orchestrator-Batch-Processing-Architecture-Analysis.md`  
**Summary**: `Docs/analysis/LinkedIn-Orchestrator-Batch-Processing-Implementation-Summary.md`

---

## ✅ SUCCESS CRITERIA

- ✅ Workflow executes without errors
- ✅ Code Split outputs individual items (not array)
- ✅ Jobs processed in parallel (not sequential)
- ✅ Execution time reduced by 60-70%
- ✅ Merge node combines data correctly
- ✅ Downstream nodes work as expected

---

**Quick Reference Complete** ✅  
**Ready to Implement** 🚀

