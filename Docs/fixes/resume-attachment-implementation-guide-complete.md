# Resume Attachment Implementation Guide - Complete Step-by-Step Instructions

**Date**: 2025-10-01  
**Workflow**: Outreach Tracking Workshop (ID: `Vp9DpKF3xT2ysHhx`)  
**Objective**: Add resume PDF attachments to Gmail drafts  
**Approach**: Option A - Static Resume from Google Drive (MVP Solution)

---

## 🎯 IMPLEMENTATION OVERVIEW

This guide provides step-by-step instructions to integrate resume attachments into the Outreach Tracking workflow. We'll use a **static resume from Google Drive** as the MVP solution, with dynamic filename generation.

**Total Changes Required**: 4 modifications to Outreach Tracking workflow
1. Update Input Processing Code node
2. Add Google Drive node
3. Add Resume Filename Customizer Code node
4. Update Draft Gmail node attachment configuration
5. Update workflow connections

---

## 📝 STEP 1: UPDATE INPUT PROCESSING CODE NODE

### **Node**: `Outreach Input Processing` (ID: `07d5b054-0fb8-4068-91e8-0384059fdf29`)

**Action**: Add resume data extraction from merged orchestrator output

**Find this section** (around line 20):
```javascript
// FIXED: Extract data from Contact Tracking workflow output structure
const contactRecord = inputData.contactRecord || {};
const outreachData = inputData.outreachData || {};
const processingMetadata = inputData.processingMetadata || {};
```

**Add AFTER it**:
```javascript
// ENHANCED: Extract resume data from Resume Generation Workshop (via Merge node)
const resumeGeneration = inputData.resumeGeneration || {};
console.log('📄 Resume Generation Data:', resumeGeneration ? 'FOUND' : 'MISSING');
```

**Find this section** (around line 60):
```javascript
// FIXED: Extract resume/content information
const resumeContent = contactRecord.content || '';
const resumeMatchScore = contactRecord.resumeMatchScore || 0;
const qualificationScore = contactRecord.qualificationScore || 0;
```

**Replace with**:
```javascript
// ENHANCED: Extract resume/content information from Resume Generation Workshop
const resumeContent = resumeGeneration.customizedResume || contactRecord.content || '';
const resumeMatchScore = resumeGeneration.atsScore || contactRecord.resumeMatchScore || 0;
const qualificationScore = resumeGeneration.relevanceScore || contactRecord.qualificationScore || 0;
const resumeQualityPassed = resumeGeneration.qualityPassed || false;

console.log('📄 Resume Data Extracted:');
console.log(`   Content Length: ${resumeContent.length} characters`);
console.log(`   ATS Score: ${resumeMatchScore}%`);
console.log(`   Relevance Score: ${qualificationScore}%`);
console.log(`   Quality Passed: ${resumeQualityPassed}`);
```

**Find this section** (around line 90):
```javascript
  resume: {
    customizedContent: resumeContent,
    matchScore: resumeMatchScore,
    qualificationScore: qualificationScore
  },
```

**Replace with**:
```javascript
  resume: {
    customizedContent: resumeContent,
    matchScore: resumeMatchScore,
    qualificationScore: qualificationScore,
    atsScore: resumeMatchScore,  // NEW: For consistency
    relevanceScore: qualificationScore,  // NEW: For consistency
    qualityPassed: resumeQualityPassed  // NEW: Quality gate status
  },
```

---

## 📝 STEP 2: ADD GOOGLE DRIVE NODE

### **New Node**: `Fetch Resume from Google Drive`

**Position**: Between "AI Email Generation" and "Draft Gmail"  
**Type**: `n8n-nodes-base.googleDrive`  
**Version**: 3

**Configuration**:
```json
{
  "parameters": {
    "resource": "file",
    "operation": "download",
    "fileId": {
      "__rl": true,
      "value": "1_ipN7oOtDQlytBARapdxjJytUNuyCb4CvZfzfA8gAFs",
      "mode": "id"
    },
    "options": {}
  },
  "type": "n8n-nodes-base.googleDrive",
  "typeVersion": 3,
  "position": [-720, -384],
  "id": "NEW_NODE_ID_1",
  "name": "Fetch Resume from Google Drive",
  "credentials": {
    "googleDriveOAuth2Api": {
      "id": "nrRB0AHydhQRDsRy",
      "name": "Google Drive account"
    }
  }
}
```

**Notes**:
- Uses the same Google Drive file ID as Resume Generation Workshop
- Downloads the base resume PDF
- Outputs binary data in `binary.data` property
- Credentials should already exist (same as used in Resume Generation Workshop)

---

## 📝 STEP 3: ADD RESUME FILENAME CUSTOMIZER CODE NODE

### **New Node**: `Resume Filename Customizer`

**Position**: Between "Fetch Resume from Google Drive" and "Draft Gmail"  
**Type**: `n8n-nodes-base.code`  
**Version**: 2

**Code**:
```javascript
// RESUME FILENAME CUSTOMIZER
// Generates dynamic filename: Resume_IvoDachev_[JobTitle]_[CompanyName].pdf
// Renames the binary data from Google Drive with job-specific filename

const jobTitle = $('Outreach Input Processing').item.json.job.title;
const companyName = $('Outreach Input Processing').item.json.job.company;
const candidateName = "Ivo Dachev";

// Clean strings for filename (remove special characters)
const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_');
const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
const cleanCandidateName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');

// Generate dynamic filename
const filename = `Resume_${cleanCandidateName}_${cleanJobTitle}_${cleanCompanyName}.pdf`;

console.log('📄 Resume Filename Generated:', filename);

// Get binary data from Google Drive node
const binaryData = $input.item.binary.data;

if (!binaryData) {
  throw new Error('No binary data found from Google Drive node');
}

// Return with renamed binary property
return {
  json: $json,
  binary: {
    resume: {
      data: binaryData.data,
      mimeType: binaryData.mimeType || 'application/pdf',
      fileName: filename,
      fileExtension: 'pdf'
    }
  }
};
```

**Configuration**:
```json
{
  "parameters": {
    "jsCode": "// [CODE FROM ABOVE]"
  },
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [-544, -384],
  "id": "NEW_NODE_ID_2",
  "name": "Resume Filename Customizer"
}
```

---

## 📝 STEP 4: UPDATE DRAFT GMAIL NODE

### **Node**: `Draft Gmail` (ID: `ce9f62db-a8f5-42ae-b169-27922f6b065c`)

**Current Configuration**:
```json
{
  "options": {
    "attachmentsUi": {
      "attachmentsBinary": [
        {}  // ❌ EMPTY - NO ATTACHMENT
      ]
    },
    "sendTo": "={{ $('Outreach Input Processing').item.json.contact.email }}"
  }
}
```

**Updated Configuration**:
```json
{
  "options": {
    "attachmentsUi": {
      "attachmentsBinary": [
        {
          "property": "resume"  // ✅ References binary.resume from Resume Filename Customizer
        }
      ]
    },
    "sendTo": "={{ $('Outreach Input Processing').item.json.contact.email }}"
  }
}
```

**Full Node Configuration**:
```json
{
  "parameters": {
    "resource": "draft",
    "subject": "={{ JSON.parse($json.content.parts[0].text)[0].emailSubject }}",
    "message": "={{ JSON.parse($json.content.parts[0].text)[0].emailBody }}",
    "options": {
      "attachmentsUi": {
        "attachmentsBinary": [
          {
            "property": "resume"
          }
        ]
      },
      "sendTo": "={{ $('Outreach Input Processing').item.json.contact.email }}"
    }
  },
  "type": "n8n-nodes-base.gmail",
  "typeVersion": 2.1,
  "position": [-128, -384],
  "id": "ce9f62db-a8f5-42ae-b169-27922f6b065c",
  "name": "Draft Gmail",
  "credentials": {
    "gmailOAuth2": {
      "id": "rEDqr1LkX2ZgxHLO",
      "name": "Gmail account"
    }
  }
}
```

---

## 📝 STEP 5: UPDATE WORKFLOW CONNECTIONS

### **Current Connections** (Relevant Section):
```json
{
  "AI Email Generation": {
    "main": [
      [
        {
          "node": "Draft Gmail",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

### **Updated Connections**:
```json
{
  "AI Email Generation": {
    "main": [
      [
        {
          "node": "Fetch Resume from Google Drive",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Fetch Resume from Google Drive": {
    "main": [
      [
        {
          "node": "Resume Filename Customizer",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Resume Filename Customizer": {
    "main": [
      [
        {
          "node": "Draft Gmail",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

### **Complete Updated Flow**:
```
Execute Workflow Trigger
    ↓
Outreach Input Processing
    ↓
If - Duplicate or not
    ├── TRUE (Duplicate) → Merge Duplicate and Email
    └── FALSE (Not Duplicate) → AI Email Generation
                                    ↓
                                Fetch Resume from Google Drive (NEW)
                                    ↓
                                Resume Filename Customizer (NEW)
                                    ↓
                                Draft Gmail (UPDATED)
                                    ↓
                                Merge Duplicate and Email
    ↓
Status Update
```

---

## 🧪 TESTING INSTRUCTIONS

### **Test Case 1: Non-Duplicate Application (With Attachment)**

**Expected Behavior**:
1. Outreach Input Processing extracts resume data from merged input
2. IF node routes to AI Email Generation (isDuplicate = false)
3. AI Email Generation creates email content
4. Fetch Resume from Google Drive downloads base resume PDF
5. Resume Filename Customizer renames to `Resume_IvoDachev_[JobTitle]_[CompanyName].pdf`
6. Draft Gmail creates draft with:
   - ✅ Recipient email
   - ✅ Subject line
   - ✅ Email body
   - ✅ Resume attachment with dynamic filename

**Verification**:
- Check Gmail drafts folder
- Verify attachment is present
- Verify filename matches pattern
- Verify attachment opens as PDF

### **Test Case 2: Duplicate Application (No Attachment)**

**Expected Behavior**:
1. Outreach Input Processing detects isDuplicate = true
2. IF node routes directly to Merge (skips AI Email Generation)
3. No Gmail draft created
4. Status Update records "DUPLICATE_SKIPPED"

**Verification**:
- No Gmail draft created
- Google Sheets shows status = "DUPLICATE_SKIPPED"
- No email fields populated

---

## 📊 EXPECTED RESULTS

### **Gmail Draft Output**:
```
To: markus.fischer@tharpventures.com
Subject: Application for Ecommerce Copywriter - Ivo Dachev
Body: [Full personalized email content]
Attachments: Resume_IvoDachev_Ecommerce_Copywriter_Tharp_Ventures.pdf (1 file)
```

### **Google Sheets Tracking**:
```
status: EMAIL_DRAFT_CREATED
dedupeKey: Tharp Ventures|Ecommerce Copywriter
emailSubject: Application for Ecommerce Copywriter - Ivo Dachev
emailBody: [Full email content]
```

---

## ⚠️ IMPORTANT NOTES

1. **Google Drive Credentials**: Ensure the Google Drive OAuth2 credentials (`nrRB0AHydhQRDsRy`) have access to the resume file
2. **Binary Data Flow**: The binary data must flow through all nodes - do NOT use "Set" nodes that might strip binary data
3. **Filename Sanitization**: Special characters are replaced with underscores to ensure valid filenames
4. **Duplicate Path**: Duplicates skip the entire email generation + attachment flow for cost optimization
5. **Error Handling**: If Google Drive node fails, the entire workflow will fail - consider adding error handling in production

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Backup current Outreach Tracking workflow
- [ ] Update Input Processing Code node
- [ ] Add Fetch Resume from Google Drive node
- [ ] Add Resume Filename Customizer Code node
- [ ] Update Draft Gmail node attachment configuration
- [ ] Update workflow connections
- [ ] Save workflow
- [ ] Test with single execution
- [ ] Verify Gmail draft has attachment
- [ ] Verify filename is correct
- [ ] Deploy to production

---

**Implementation Guide Complete** ✅  
**Ready for Execution** 🚀

