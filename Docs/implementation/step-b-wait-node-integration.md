# Step B: Wait Node Integration Instructions

**Purpose**: Add 1.5-second delay to ensure <60 requests/minute compliance  
**Location**: Between "Data Flattener for Google Sheets" and "Duplicate Detection & Logging"  
**Expected Impact**: Guaranteed quota compliance with minimal execution time impact  

---

## **🔧 N8N WORKFLOW MODIFICATION INSTRUCTIONS**

### **1. Add Wait Node**

#### **Step 1.1: Create New Wait Node**
- In your N8N Contact Tracking workflow editor
- Click the **"+"** button to add a new node
- Search for **"Wait"** in the node library
- Select **"Wait"** node (n8n-nodes-base.wait)

#### **Step 1.2: Configure Wait Node**
**Node Settings:**
- **Node Name**: `Quota Compliance Wait`
- **Wait Time**: `1500` (1.5 seconds)
- **Resume On**: `After Time Interval`
- **Unit**: `Milliseconds`

**Advanced Settings:**
- **Continue on Fail**: `false` (disabled)
- **Retry on Fail**: `false` (disabled)
- **Notes**: `1.5s delay to ensure Google Sheets API quota compliance (<60 requests/minute)`

#### **Step 1.3: Position Wait Node**
- **Drag the Wait node** to position it between:
  - **Source**: "Data Flattener for Google Sheets" node
  - **Target**: "Duplicate Detection & Logging" node
- **Suggested Position**: Approximately halfway between the two nodes

---

### **2. Update Workflow Connections**

#### **Step 2.1: Remove Direct Connection**
- **Locate the connection** from "Data Flattener for Google Sheets" → "Duplicate Detection & Logging"
- **Click on the connection line** to select it
- **Press Delete** or right-click and select "Delete Connection"

#### **Step 2.2: Add New Connections**
**Connection 1: Data Flattener → Wait Node**
- **From**: "Data Flattener for Google Sheets" node output
- **To**: "Quota Compliance Wait" node input
- **Drag from the output dot** of Data Flattener to the input dot of Wait node

**Connection 2: Wait Node → Duplicate Detection**
- **From**: "Quota Compliance Wait" node output  
- **To**: "Duplicate Detection & Logging" node input
- **Drag from the output dot** of Wait node to the input dot of Duplicate Detection

---

### **3. Verify New Workflow Flow**

#### **Updated Flow Diagram:**
```
Data Flattener for Google Sheets
           ↓
    Quota Compliance Wait (1.5s)
           ↓
  Duplicate Detection & Logging
           ↓
    [Rest of workflow unchanged]
```

#### **Verification Steps:**
1. **Visual Check**: Ensure the flow shows the correct sequence
2. **Connection Check**: Verify all connections are properly established
3. **No Orphaned Nodes**: Ensure no nodes are disconnected
4. **Save Workflow**: Click "Save" to save the workflow changes

---

## **📊 EXPECTED BEHAVIOR**

### **Execution Flow:**
1. **Data Flattener** processes job application data (unchanged)
2. **Wait Node** introduces 1.5-second delay
3. **Duplicate Detection** runs with cached API calls (from Step A)
4. **Remaining workflow** continues normally

### **Performance Impact:**
- **Additional Time**: +1.5 seconds per workflow execution
- **Quota Compliance**: Ensures maximum 40 requests/minute (well below 60 limit)
- **Reliability**: Prevents quota exceeded errors during high-volume processing

### **Monitoring:**
- **Execution Logs**: Will show 1.5-second pause between Data Flattener and Duplicate Detection
- **Total Execution Time**: Slight increase acceptable for quota compliance
- **Error Rate**: Should eliminate quota exceeded errors

---

## **🧪 TESTING INSTRUCTIONS**

### **Test 1: Single Execution**
1. **Execute the workflow** with one job application
2. **Monitor execution time** - should see 1.5s delay
3. **Check logs** for proper flow sequence
4. **Verify output** - all data should pass through correctly

### **Test 2: Rapid Execution**
1. **Execute workflow multiple times** in quick succession
2. **Monitor Google Cloud Console** API usage
3. **Verify quota compliance** - should stay well below 60/minute
4. **Check for errors** - should see zero quota exceeded errors

---

## **⚠️ TROUBLESHOOTING**

### **Common Issues:**
1. **Connection Errors**: Ensure all connections are properly established
2. **Node Configuration**: Verify Wait node settings are correct (1500ms)
3. **Workflow Saving**: Make sure to save workflow after changes

### **Rollback Procedure:**
If issues occur:
1. **Remove Wait node** from workflow
2. **Reconnect Data Flattener** directly to Duplicate Detection
3. **Save workflow** to restore original flow
4. **Test functionality** to ensure rollback successful

---

## **✅ COMPLETION CHECKLIST**

- [ ] **Wait node created** with correct settings (1500ms delay)
- [ ] **Positioned correctly** between Data Flattener and Duplicate Detection
- [ ] **Connections updated** - old direct connection removed, new connections added
- [ ] **Workflow saved** with new configuration
- [ ] **Single execution tested** - 1.5s delay confirmed
- [ ] **Flow verified** - all data passes through correctly

**Step B Status**: 📋 INSTRUCTIONS READY - AWAITING IMPLEMENTATION
