# Google Sheets - Email Tracking Dashboard Fix

## Problem
The "Google Sheets - Email Tracking Dashboard" node is showing error:
```
The 'Column to Match On' parameter is required
```

## Root Cause
The node has an empty `matchingColumns` array in its configuration. The "Append or Update" operation requires at least one column to match on for duplicate detection.

## Solution

### Step 1: Open the Node
1. Click on "Google Sheets - Email Tracking Dashboard" node
2. Click the "Edit" button to open the node configuration

### Step 2: Set the Column to Match On
1. In the node editor, look for the **"Column to Match On"** field
2. Click the dropdown and select: **`executionDate`**
3. This will use the execution date as the unique identifier for matching rows

### Step 3: Verify the Configuration
The node should now have:
- **Operation**: "Append or Update"
- **Document ID**: `1NgFM2ujALlcApbyAuYNWJ5Hyf0UkO0efQlGAzoifC8c`
- **Sheet Name**: "Email Daily Tracking"
- **Column to Match On**: `executionDate` ✅
- **Columns to Write**: All 13 fields (executionDate, executionTime, totalEmails, etc.)

### Step 4: Save and Test
1. Click "Save" to apply the changes
2. Run a test execution to verify the fix works

## Why executionDate?
- Each execution has a unique date/time
- Using `executionDate` ensures that metrics from the same day are updated (not duplicated)
- If you run multiple times on the same day, the row will be updated instead of creating duplicates

## Alternative: Use executionId
If you prefer to track each execution separately (never update, always append):
- Set **"Column to Match On"** to: `executionId`
- This will create a new row for every execution (no updates)

## Expected Result
After the fix:
- ✅ Node validation passes
- ✅ Workflow can be activated
- ✅ Metrics are logged to Google Sheets correctly
- ✅ No "Column to Match On" error

