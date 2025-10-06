# ROOT CAUSE ANALYSIS: AI Generating Placeholder Names ("Alice Wonderland")

**Date**: 2025-10-03  
**Workflow**: LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment (ID: wZyxRjWShhnSFbSV)  
**Issue**: AI Email Template Generator producing identical placeholder content for all job applications  
**Severity**: CRITICAL - All emails contain wrong candidate information  

---

## EXECUTIVE SUMMARY

The AI Email Template Generator node contains **Data Flattener JavaScript code** in its prompt field instead of the actual AI email generation prompt. This causes the AI model to receive JavaScript code as instructions, resulting in generic placeholder emails with "Alice Wonderland", "Software Engineer", "Acme Corp", etc., regardless of the actual job data.

---

## DETAILED ROOT CAUSE

### **Issue 1: Wrong Content in AI Prompt Field**

**Node**: AI Email Template Generator (ID: bad444f7-d57a-4c31-a4da-cabc43bb322b)  
**Field**: `parameters.messages.values[0].content`  
**Current Content**: Data Flattener v3.0 JavaScript code (starts with `/*\n  Data Flattener for Google Sheets...`)  
**Expected Content**: AI email generation prompt (starts with `You are an expert Email Outreach AI...`)

**Evidence from Workflow Configuration**:
```javascript
"parameters": {
  "messages": {
    "values": [
      {
        "content": "=/*\n  Data Flattener for Google Sheets - CORRECTED v3.0\n  Workflow: Contact Tracking (ID: wZyxRjWShhnSFbSV)\n  ..."
      }
    ]
  }
}
```

**Impact**:
- AI model receives JavaScript code as its prompt
- AI interprets the code as a template and generates example values
- All executions produce identical placeholder content:
  - Candidate: "Alice Wonderland" (instead of "Ivo Dachev")
  - Job: "Software Engineer at Acme Corp" (instead of actual job data)
  - Contact: "Dear Bob," (instead of actual hiring manager name)
  - Phone: "555-123-4567" (instead of "+1 (650)-222-7923")
  - Email: "alice.wonderland@email.com" (instead of "dachevivo@gmail.com")

---

## DATA FLOW VERIFICATION

### **Upstream Data (Contact Data Merger & Processing) - ✅ CORRECT**

The Contact Data Merger & Processing node outputs CORRECT data with all nested objects populated:

```json
{
  "companyName": "Tharp Ventures",
  "jobTitle": "Ecommerce Copywriter",
  "contactEmail": "markus.fischer@sibelco.com",
  "candidate": {
    "name": "Ivo Dachev",
    "firstName": "Ivo",
    "lastName": "Dachev",
    "email": "dachevivo@gmail.com",
    "phone": "+1 (650)-222-7923"
  },
  "job": {
    "title": "Ecommerce Copywriter",
    "company": "Tharp Ventures",
    "location": "United States"
  },
  "contact": {
    "firstName": "Markus",
    "lastName": "Fischer",
    "name": "Markus Fischer",
    "email": "markus.fischer@sibelco.com"
  }
}
```

**Verification**: Execution 4020 (timestamp: 2025-10-03T20:38:46.867Z) shows correct input data.

### **AI Email Template Generator Input - ✅ CORRECT DATA, ❌ WRONG PROMPT**

- **Input Data**: CORRECT (receives nested objects from Contact Data Merger)
- **Prompt**: WRONG (contains Data Flattener JavaScript code)
- **Result**: AI generates placeholder content because it's confused by JavaScript code

### **Data Flattener Output - ✅ CORRECT (After v3.0 Fix)**

The Data Flattener v3.0 fix successfully extracts job data from the Contact Data Merger node:

```json
{
  "companyName": "Tharp Ventures",
  "jobTitle": "Ecommerce Copywriter",
  "recipientEmail": "markus.fischer@sibelco.com",
  "dedupeKey": "tharpventures-ecommercecopywriter"
}
```

**Verification**: Google Sheets tracking records show correct company names and job titles.

---

## ISSUE CATEGORIZATION

### **Category 1: Missing Critical Data Fields - ✅ RESOLVED**
- **Status**: FIXED by Data Flattener v3.0
- **Evidence**: Google Sheets shows correct company names, job titles, and recipient emails

### **Category 2: AI Generating Placeholder Names - ❌ NOT RESOLVED**
- **Status**: ROOT CAUSE IDENTIFIED - Wrong prompt in AI node
- **Fix Required**: Replace Data Flattener code with correct AI prompt

### **Category 3: Identical Contact Email Across Records - ⚠️ NEEDS INVESTIGATION**
- **Status**: SUSPICIOUS - All 3 records show same contact (markus.fischer@sibelco.com)
- **Possible Causes**:
  - Contact Enrichment workflow caching issue
  - Contact lookup logic bug
  - Test data issue
- **Next Steps**: Investigate Contact Enrichment workflow execution data

---

## SOLUTION

### **Fix for Issue 2: Replace AI Prompt**

**File**: `Docs/fixes/ai-email-generator-CORRECTED-PROMPT-v4.0.txt`

**Manual Update Steps**:
1. Open N8N workflow: `LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment`
2. Click on the **"AI Email Template Generator"** node
3. In the `messages.values[0].content` field:
   - **DELETE** all the Data Flattener JavaScript code
   - **PASTE** the corrected prompt from `Docs/fixes/ai-email-generator-CORRECTED-PROMPT-v4.0.txt`
4. Click **"Save"**
5. Run the workflow with a test job application

**Key Changes in Corrected Prompt**:
- Uses correct N8N expression syntax: `{{ $json.candidate.name }}`
- Explicitly instructs AI to use ACTUAL values from input data
- Removes all example placeholder names that were confusing the AI
- Includes verification checklist to ensure no placeholder data is generated
- Emphasizes that candidate information is in the Candidate Information section

---

## VERIFICATION STEPS

After applying the fix, verify:

1. **Run the workflow** with a test job application
2. **Check Google Sheets** tracking record:
   - ✅ `emailSubject` shows actual candidate name (not "Alice Wonderland")
   - ✅ `emailBody` greeting uses actual contact first name (not "Dear Bob,")
   - ✅ `emailBody` references actual job title and company (not "Software Engineer at Acme Corp")
   - ✅ `emailBody` signature shows "Ivo Dachev" (not "Alice Wonderland")
   - ✅ `emailBody` signature shows "+1 (650)-222-7923" (not "555-123-4567")
   - ✅ `emailBody` signature shows "dachevivo@gmail.com" (not "alice.wonderland@email.com")

3. **Check N8N execution logs**:
   - Review AI Email Template Generator output
   - Verify that the AI received the correct prompt (not JavaScript code)
   - Confirm that the AI output contains actual candidate information

---

## LESSONS LEARNED

1. **Always verify node configuration after copy-paste operations**
   - The Data Flattener code was likely accidentally pasted into the AI prompt field
   - This type of error is not caught by N8N's validation

2. **Use version control for N8N workflows**
   - Export workflows to JSON files and commit to Git
   - This allows tracking changes and identifying when errors were introduced

3. **Implement automated testing**
   - Create test executions that verify AI output contains expected values
   - Alert if placeholder names appear in production emails

4. **Add validation nodes**
   - Insert a validation node after AI Email Template Generator
   - Check for placeholder names/emails before sending to Google Sheets
   - Fail the workflow if placeholder data is detected

---

## NEXT STEPS

1. ✅ **IMMEDIATE**: Apply the AI prompt fix (manual update required)
2. ⚠️ **HIGH PRIORITY**: Investigate Contact Enrichment caching issue (Issue 3)
3. 📋 **MEDIUM PRIORITY**: Add validation node to detect placeholder data
4. 📋 **LOW PRIORITY**: Export workflow to Git for version control

---

## RELATED FILES

- **Corrected AI Prompt**: `Docs/fixes/ai-email-generator-CORRECTED-PROMPT-v4.0.txt`
- **Data Flattener Fix**: `Docs/fixes/data-flattener-CORRECTED-v3.0.js` (already applied)
- **Execution Data**: Execution 4020 (timestamp: 2025-10-03T20:38:46.867Z)
- **Workflow**: LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment (ID: wZyxRjWShhnSFbSV)

---

## APPENDIX: Why the AI Generated "Alice Wonderland"

The Data Flattener JavaScript code contains example fallback values:

```javascript
var fallback = {
  companyName: "Company Name Missing",
  jobTitle: "Job Title Missing",
  recipientEmail: "contact-missing@placeholder.com",
  emailSubject: "Application for Position - Ivo Dachev",
  emailBody: "Email content not generated"
};
```

When the AI model received this JavaScript code as its prompt, it interpreted these as template examples and generated similar placeholder values:
- "Alice Wonderland" (similar pattern to "Ivo Dachev")
- "Software Engineer" (similar to "Position")
- "Acme Corp" (generic company name like "Company Name Missing")
- "555-123-4567" (placeholder phone number)
- "alice.wonderland@email.com" (placeholder email)

The AI was essentially following the pattern it saw in the JavaScript code, not realizing it was supposed to be generating actual personalized emails.

