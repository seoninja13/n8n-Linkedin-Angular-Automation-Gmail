# ACTION PLAN: Fix AI Placeholder Names Issue

**Date**: 2025-10-03  
**Workflow**: LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment  
**Priority**: CRITICAL  

---

## QUICK SUMMARY

**ROOT CAUSE IDENTIFIED**: The AI Email Template Generator node contains **Data Flattener JavaScript code** in its prompt field instead of the actual AI email generation prompt.

**IMPACT**: All emails show placeholder content:
- ❌ Candidate: "Alice Wonderland" (should be "Ivo Dachev")
- ❌ Job: "Software Engineer at Acme Corp" (should be actual job data)
- ❌ Contact: "Dear Bob," (should be actual hiring manager name)

**FIX**: Replace the Data Flattener code with the correct AI prompt (manual update required).

---

## IMMEDIATE ACTION REQUIRED

### **Step 1: Open the Workflow**

1. Open N8N in your browser
2. Navigate to: `LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment`
3. Click on the **"AI Email Template Generator"** node

### **Step 2: Replace the Prompt**

1. In the node configuration panel, find the `messages.values[0].content` field
2. You will see JavaScript code starting with:
   ```
   /*
     Data Flattener for Google Sheets - CORRECTED v3.0
     ...
   ```
3. **DELETE ALL THIS CODE** (select all and delete)
4. Open the file: `Docs/fixes/ai-email-generator-CORRECTED-PROMPT-v4.0.txt`
5. **COPY THE ENTIRE CONTENTS** of that file
6. **PASTE** into the `messages.values[0].content` field
7. The prompt should now start with:
   ```
   You are an expert Email Outreach AI that creates personalized job application emails...
   ```

### **Step 3: Save the Workflow**

1. Click **"Save"** in the N8N workflow editor
2. Verify that the save was successful (check for confirmation message)

### **Step 4: Test the Fix**

1. Run the workflow with a test job application
2. Wait for execution to complete
3. Check the Google Sheets tracking record

### **Step 5: Verify the Results**

Open the Google Sheets tracking sheet and verify the most recent record:

**Expected Results**:
- ✅ `emailSubject`: "Application for [Actual Job Title] - Ivo Dachev"
- ✅ `emailBody` greeting: "Dear [Actual Contact First Name]," or "Dear Hiring Manager,"
- ✅ `emailBody` content: References actual job title and company name
- ✅ `emailBody` signature:
  ```
  Sincerely,
  Ivo Dachev
  +1 (650)-222-7923
  dachevivo@gmail.com
  ```

**Failure Indicators** (if these appear, the fix was not applied correctly):
- ❌ "Alice Wonderland" appears anywhere
- ❌ "Software Engineer" or "Acme Corp" appears (unless that's the actual job)
- ❌ "Dear Bob," appears
- ❌ "555-123-4567" or "alice.wonderland@email.com" appears

---

## TROUBLESHOOTING

### **If the fix doesn't work:**

1. **Verify the prompt was saved correctly**:
   - Re-open the AI Email Template Generator node
   - Check that the prompt starts with "You are an expert Email Outreach AI..."
   - Check that there's NO JavaScript code in the prompt field

2. **Check N8N execution logs**:
   - Open the workflow execution details
   - Click on the AI Email Template Generator node
   - Review the input data (should show nested objects with actual values)
   - Review the output data (should show actual candidate information)

3. **Clear N8N cache**:
   - Sometimes N8N caches node configurations
   - Try deactivating and reactivating the workflow
   - Or restart the N8N server

4. **Verify upstream data**:
   - Check the Contact Data Merger & Processing node output
   - Ensure it contains the nested `candidate`, `job`, and `contact` objects
   - If these are missing, the Contact Data Merger code may need to be updated

---

## ADDITIONAL ISSUES TO INVESTIGATE

### **Issue 3: Identical Contact Email Across Records**

**Observation**: All 3 recent records show the same contact email: `markus.fischer@sibelco.com`

**Possible Causes**:
1. Contact Enrichment workflow is caching results
2. Contact lookup logic has a bug
3. Test data issue (all jobs are from the same company)

**Next Steps**:
1. Review the Contact Enrichment workflow execution logs
2. Check if different companies are returning the same contact
3. Verify the contact lookup logic in the Contact Enrichment workflow

**Priority**: MEDIUM (doesn't block email generation, but may cause incorrect recipient targeting)

---

## SUCCESS CRITERIA

The fix is successful when:

1. ✅ AI Email Template Generator node contains the correct prompt (not JavaScript code)
2. ✅ Workflow execution produces emails with actual candidate information
3. ✅ Google Sheets tracking records show:
   - Actual candidate name: "Ivo Dachev"
   - Actual candidate phone: "+1 (650)-222-7923"
   - Actual candidate email: "dachevivo@gmail.com"
   - Actual job title and company name
   - Actual contact first name in greeting
4. ✅ NO placeholder names appear in any field
5. ✅ NO placeholder phone numbers or emails appear

---

## RELATED DOCUMENTATION

- **Root Cause Analysis**: `Docs/fixes/ROOT-CAUSE-ANALYSIS-AI-Placeholder-Names.md`
- **Corrected AI Prompt**: `Docs/fixes/ai-email-generator-CORRECTED-PROMPT-v4.0.txt`
- **Data Flattener Fix**: `Docs/fixes/data-flattener-CORRECTED-v3.0.js` (already applied)

---

## TIMELINE

- **2025-10-03 20:36-20:38**: Issue discovered (3 executions with placeholder names)
- **2025-10-03 20:40**: Data Flattener v3.0 fix applied (resolved missing job data)
- **2025-10-03 [CURRENT]**: Root cause identified (wrong prompt in AI node)
- **2025-10-03 [PENDING]**: Manual fix to be applied by user
- **2025-10-03 [PENDING]**: Verification test execution

---

## CONTACT

If you encounter any issues or need assistance:
1. Review the Root Cause Analysis document
2. Check the N8N execution logs for error messages
3. Verify that all upstream nodes (Contact Data Merger & Processing) are working correctly
4. Request additional analysis if needed

