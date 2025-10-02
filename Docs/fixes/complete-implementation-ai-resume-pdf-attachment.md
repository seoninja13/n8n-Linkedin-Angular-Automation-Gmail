# Complete Implementation Guide: AI-Customized Resume PDF Attachments

**Date**: 2025-10-01  
**Workflow**: Outreach Tracking Workshop (ID: `Vp9DpKF3xT2ysHhx`)  
**Objective**: Convert AI-generated resume TEXT to PDF and attach to Gmail drafts  
**Method**: Google Docs API (Create → Export → Delete)

---

## 📋 IMPLEMENTATION OVERVIEW

**Total Changes**: 5 modifications + 4 new nodes
- **Modify**: 1 existing Code node (Outreach Input Processing)
- **Modify**: 1 existing Gmail node (Draft Gmail)
- **Add**: 4 new nodes (Create Doc, Export PDF, Filename Customizer, Delete Doc)
- **Update**: Workflow connections

**Estimated Time**: 2.5 - 3 hours  
**Complexity**: Medium-High

---

## 🔧 STEP 1: MODIFY EXISTING NODE - Outreach Input Processing

**Node Type**: EXISTING - MODIFY  
**Node ID**: `07d5b054-0fb8-4068-91e8-0384059fdf29`  
**Node Name**: `Outreach Input Processing`  
**Action**: Add resume data extraction from Resume Generation Workshop output

### **Complete JavaScript Code**:

```javascript
// OUTREACH TRACKING - INPUT PROCESSING (ENHANCED FOR AI RESUME)
// Processes contact tracking data for outreach email creation
// ENHANCED: Extracts AI-generated customized resume from Resume Generation Workshop

const inputData = $json;
console.log('🔍 Outreach Input Debug:');
console.log('   Input keys:', Object.keys(inputData));
console.log('   ContactRecord keys:', inputData.contactRecord ? Object.keys(inputData.contactRecord) : 'No contactRecord');
console.log('   ResumeGeneration keys:', inputData.resumeGeneration ? Object.keys(inputData.resumeGeneration) : 'No resumeGeneration');

// Extract data from Contact Tracking workflow output structure
const contactRecord = inputData.contactRecord || {};
const outreachData = inputData.outreachData || {};
const processingMetadata = inputData.processingMetadata || {};

// ENHANCED: Extract resume data from Resume Generation Workshop (via Merge node)
const resumeGeneration = inputData.resumeGeneration || {};
console.log('📄 Resume Generation Data:', resumeGeneration ? 'FOUND' : 'MISSING');

// Extract AI-generated customized resume TEXT
const customizedResumeText = resumeGeneration.customizedResume || '';
const resumeAtsScore = resumeGeneration.atsScore || 0;
const resumeRelevanceScore = resumeGeneration.relevanceScore || 0;
const resumeQualityPassed = resumeGeneration.qualityPassed || false;

console.log('📄 AI-Generated Resume Extracted:');
console.log(`   Content Length: ${customizedResumeText.length} characters`);
console.log(`   ATS Score: ${resumeAtsScore}%`);
console.log(`   Relevance Score: ${resumeRelevanceScore}%`);
console.log(`   Quality Passed: ${resumeQualityPassed}`);

// Validate resume content exists
if (!customizedResumeText || customizedResumeText.length < 100) {
  console.error('❌ AI-generated resume content is missing or too short');
  throw new Error('Invalid resume data: AI-generated resume content is missing');
}

// Handle field name differences from Contact Tracking workflow
const jobTitle = contactRecord.jobTitle;
const companyName = contactRecord.companyName;
const jobLocation = contactRecord.jobLocation || 'Not specified';
const jobUrl = contactRecord.jobUrl || '';
const jobDescription = contactRecord.jobDescription || '';

// Validate required inputs
if (!jobTitle || !companyName) {
  console.error('❌ Validation failed:');
  console.error('   JobTitle:', jobTitle);
  console.error('   CompanyName:', companyName);
  throw new Error(`Invalid job data: missing required fields (jobTitle: ${!!jobTitle}, companyName: ${!!companyName})`);
}

// Extract contact information
const contactName = contactRecord.contactName || 'Unknown Contact';
const contactFirstName = contactRecord.contactFirstName || '';
const contactLastName = contactRecord.contactLastName || '';
const contactTitle = contactRecord.contactTitle || '';
const recepientEmail = contactRecord.recepientEmail || '';

// Extract email template information
const emailTemplate = contactRecord.emailTemplate || {};
const emailSubject = emailTemplate.subject || outreachData.emailSubject || '';
const emailBody = emailTemplate.emailBody || outreachData.emailBody || '';

// Extract duplicate detection fields
const isDuplicate = Boolean(contactRecord.isDuplicate || false);
const duplicateCount = contactRecord.duplicateCount || 0;
const duplicateReason = contactRecord.duplicateReason || '';
const originalApplicationDate = contactRecord.originalApplicationDate || '';
const duplicateDetectedAt = contactRecord.duplicateDetectedAt || '';

// Validate contact email
if (!recepientEmail) {
  throw new Error('Invalid contact data: missing recipient email');
}

// Create properly structured outreach data
const outreachComponents = {
  job: {
    title: jobTitle,
    company: companyName,
    location: jobLocation,
    jobUrl: jobUrl,
    description: jobDescription
  },
  contact: {
    name: contactName,
    firstName: contactFirstName,
    lastName: contactLastName,
    email: recepientEmail,
    jobTitle: contactTitle,
    company: companyName
  },
  resume: {
    customizedContent: customizedResumeText,
    matchScore: resumeAtsScore,
    qualificationScore: resumeRelevanceScore,
    atsScore: resumeAtsScore,
    relevanceScore: resumeRelevanceScore,
    qualityPassed: resumeQualityPassed
  },
  email: {
    subject: emailSubject,
    body: emailBody,
    template: emailTemplate.emailTemplate || 'job-application-outreach',
    estimatedResponseRate: emailTemplate.estimatedResponseRate || 0
  },
  tracking: {
    dedupeKey: contactRecord.dedupeKey || '',
    trackingId: contactRecord.trackingId || '',
    status: contactRecord.status || 'PREPARED',
    priorityLevel: contactRecord.priorityLevel || 'MEDIUM',
    processedAt: contactRecord.processedAt || new Date().toISOString()
  },
  isDuplicate: isDuplicate,
  duplicateCount: duplicateCount,
  duplicateReason: duplicateReason,
  originalApplicationDate: originalApplicationDate,
  duplicateDetectedAt: duplicateDetectedAt,
  outreachType: 'job-application-email',
  timestamp: new Date().toISOString(),
  originalInput: inputData
};

console.log('✅ Outreach Input Processing Success:');
console.log(`   Job: ${jobTitle} at ${companyName}`);
console.log(`   Contact: ${contactName} (${recepientEmail})`);
console.log(`   Resume ATS Score: ${resumeAtsScore}%`);
console.log(`   Resume Content Length: ${customizedResumeText.length} characters`);
console.log(`   Email Subject: ${emailSubject}`);
console.log(`   Tracking Status: ${contactRecord.status}`);
console.log(`   🔍 Duplicate Detection: isDuplicate=${isDuplicate}, duplicateCount=${duplicateCount}`);
console.log(`   📋 Processing Path: ${isDuplicate ? 'DUPLICATE_DETECTED - Skip Email' : 'NEW_APPLICATION - Generate Email + Resume PDF'}`);

return [{ json: outreachComponents }];
```

### **Node Configuration** (No changes to structure, only code):
```json
{
  "parameters": {
    "jsCode": "[USE COMPLETE CODE ABOVE]"
  },
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [-1280, -384],
  "id": "07d5b054-0fb8-4068-91e8-0384059fdf29",
  "name": "Outreach Input Processing"
}
```

---

## 🔧 STEP 2: ADD NEW NODE - Create Temporary Resume Doc

**Node Type**: NEW - CREATE  
**Node Name**: `Create Temporary Resume Doc`  
**Position**: Between "AI Email Generation" and "Draft Gmail"  
**Purpose**: Creates a temporary Google Doc with AI-generated resume content

### **Complete Node Configuration**:

```json
{
  "parameters": {
    "operation": "create",
    "title": "={{ 'TempResume_' + $('Outreach Input Processing').item.json.job.title.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now() }}",
    "content": "={{ $('Outreach Input Processing').item.json.resume.customizedContent }}",
    "options": {}
  },
  "type": "n8n-nodes-base.googleDocs",
  "typeVersion": 2,
  "position": [-720, -384],
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Create Temporary Resume Doc",
  "credentials": {
    "googleDocsOAuth2Api": {
      "id": "nrRB0AHydhQRDsRy",
      "name": "Google Docs account"
    }
  }
}
```

**Input Connection**: From "AI Email Generation"  
**Output Connection**: To "Export Resume as PDF"  
**Output Data**: `$json.id` (Google Doc ID)

---

## 🔧 STEP 3: ADD NEW NODE - Export Resume as PDF

**Node Type**: NEW - CREATE  
**Node Name**: `Export Resume as PDF`  
**Position**: After "Create Temporary Resume Doc"  
**Purpose**: Exports the Google Doc as PDF binary data

### **Complete Node Configuration**:

```json
{
  "parameters": {
    "resource": "file",
    "operation": "download",
    "fileId": {
      "__rl": true,
      "value": "={{ $json.id }}",
      "mode": "id"
    },
    "options": {
      "googleFileConversion": {
        "conversion": {
          "docsToFormat": "application/pdf"
        }
      }
    }
  },
  "type": "n8n-nodes-base.googleDrive",
  "typeVersion": 3,
  "position": [-544, -384],
  "id": "b2c3d4e5-f6g7-8901-bcde-f12345678901",
  "name": "Export Resume as PDF",
  "credentials": {
    "googleDriveOAuth2Api": {
      "id": "nrRB0AHydhQRDsRy",
      "name": "Google Drive account"
    }
  }
}
```

**Input Connection**: From "Create Temporary Resume Doc"  
**Output Connection**: To "Resume Filename Customizer"  
**Output Data**: `binary.data` (PDF binary)

---

## 🔧 STEP 4: ADD NEW NODE - Resume Filename Customizer

**Node Type**: NEW - CREATE  
**Node Name**: `Resume Filename Customizer`  
**Position**: After "Export Resume as PDF"  
**Purpose**: Renames PDF binary with dynamic filename and stores temp doc ID for cleanup

### **Complete JavaScript Code**:

```javascript
// RESUME FILENAME CUSTOMIZER
// Generates dynamic filename: Resume_IvoDachev_[JobTitle]_[CompanyName].pdf
// Renames the binary data from Google Drive export and stores temp doc ID for cleanup

const jobTitle = $('Outreach Input Processing').item.json.job.title;
const companyName = $('Outreach Input Processing').item.json.job.company;
const candidateName = "Ivo Dachev";

// Clean strings for filename (remove special characters, replace with underscores)
const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_');
const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
const cleanCandidateName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');

// Generate dynamic filename
const filename = `Resume_${cleanCandidateName}_${cleanJobTitle}_${cleanCompanyName}.pdf`;

console.log('📄 AI-Customized Resume Filename Generated:', filename);
console.log(`   Job: ${jobTitle}`);
console.log(`   Company: ${companyName}`);
console.log(`   Filename: ${filename}`);

// Get binary data from Google Drive export
const binaryData = $input.item.binary.data;

if (!binaryData) {
  console.error('❌ No binary data found from Google Drive export');
  throw new Error('No binary data found from Google Drive export');
}

console.log('✅ Binary data found, size:', binaryData.data ? 'present' : 'missing');

// Get document ID from Create Temporary Resume Doc node for cleanup
const tempDocId = $('Create Temporary Resume Doc').item.json.id;

if (!tempDocId) {
  console.error('❌ No temp document ID found for cleanup');
  throw new Error('No temp document ID found for cleanup');
}

console.log('📝 Temp Document ID stored for cleanup:', tempDocId);

// Get AI Email Generation data to pass through
const aiEmailData = $('AI Email Generation').item.json;

// Return with renamed binary property and temp doc ID for cleanup
return {
  json: {
    ...aiEmailData,
    tempDocId: tempDocId,
    resumeFilename: filename,
    resumeGenerated: true,
    resumeGeneratedAt: new Date().toISOString()
  },
  binary: {
    resume: {
      data: binaryData.data,
      mimeType: 'application/pdf',
      fileName: filename,
      fileExtension: 'pdf'
    }
  }
};
```

### **Complete Node Configuration**:

```json
{
  "parameters": {
    "jsCode": "[USE COMPLETE CODE ABOVE]"
  },
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [-368, -384],
  "id": "c3d4e5f6-g7h8-9012-cdef-123456789012",
  "name": "Resume Filename Customizer"
}
```

**Input Connection**: From "Export Resume as PDF"  
**Output Connection**: To "Draft Gmail"  
**Output Data**: `binary.resume` (renamed PDF), `$json.tempDocId` (for cleanup)

---

## 🔧 STEP 5: MODIFY EXISTING NODE - Draft Gmail

**Node Type**: EXISTING - MODIFY  
**Node ID**: `ce9f62db-a8f5-42ae-b169-27922f6b065c`  
**Node Name**: `Draft Gmail`  
**Action**: Update attachment configuration to use AI-generated resume PDF

### **Complete Node Configuration**:

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
  "webhookId": "7a97ea05-8017-420d-b85c-fadc1dc6a8dc",
  "credentials": {
    "gmailOAuth2": {
      "id": "rEDqr1LkX2ZgxHLO",
      "name": "Gmail account"
    }
  }
}
```

**Input Connection**: From "Resume Filename Customizer"  
**Output Connection**: To "Delete Temporary Resume Doc"

---

## 🔧 STEP 6: ADD NEW NODE - Delete Temporary Resume Doc

**Node Type**: NEW - CREATE  
**Node Name**: `Delete Temporary Resume Doc`  
**Position**: After "Draft Gmail"  
**Purpose**: Cleanup - deletes the temporary Google Doc created for PDF export

### **Complete Node Configuration**:

```json
{
  "parameters": {
    "resource": "file",
    "operation": "delete",
    "fileId": {
      "__rl": true,
      "value": "={{ $json.tempDocId }}",
      "mode": "id"
    }
  },
  "type": "n8n-nodes-base.googleDrive",
  "typeVersion": 3,
  "position": [64, -384],
  "id": "d4e5f6g7-h8i9-0123-defg-234567890123",
  "name": "Delete Temporary Resume Doc",
  "credentials": {
    "googleDriveOAuth2Api": {
      "id": "nrRB0AHydhQRDsRy",
      "name": "Google Drive account"
    }
  }
}
```

**Input Connection**: From "Draft Gmail"  
**Output Connection**: To "Merge Duplicate and Email"

---

## 🔧 STEP 7: UPDATE WORKFLOW CONNECTIONS

### **Complete Updated Connections Object**:

```json
{
  "connections": {
    "Execute Workflow Trigger - From Orchestrator": {
      "main": [
        [
          {
            "node": "Outreach Input Processing",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Outreach Input Processing": {
      "main": [
        [
          {
            "node": "If - Duplicate or not",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If - Duplicate or not": {
      "main": [
        [
          {
            "node": "Merge Duplicate and Email",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Email Generation",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Email Generation": {
      "main": [
        [
          {
            "node": "Create Temporary Resume Doc",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Temporary Resume Doc": {
      "main": [
        [
          {
            "node": "Export Resume as PDF",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Export Resume as PDF": {
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
    },
    "Draft Gmail": {
      "main": [
        [
          {
            "node": "Delete Temporary Resume Doc",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Delete Temporary Resume Doc": {
      "main": [
        [
          {
            "node": "Merge Duplicate and Email",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Merge Duplicate and Email": {
      "main": [
        [
          {
            "node": "Status Update",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Status Update": {
      "main": [
        []
      ]
    }
  }
}
```

---

## 📊 COMPLETE WORKFLOW FLOW DIAGRAM

```
Execute Workflow Trigger
    ↓
Outreach Input Processing (MODIFIED - extracts AI resume TEXT)
    ↓
If - Duplicate or not
    ├── TRUE (Duplicate) → Merge Duplicate and Email (Input 0)
    └── FALSE (Not Duplicate) → AI Email Generation
                                    ↓
                                Create Temporary Resume Doc (NEW)
                                    ↓
                                Export Resume as PDF (NEW)
                                    ↓
                                Resume Filename Customizer (NEW)
                                    ↓
                                Draft Gmail (MODIFIED - attachment config)
                                    ↓
                                Delete Temporary Resume Doc (NEW)
                                    ↓
                                Merge Duplicate and Email (Input 1)
    ↓
Status Update
```

---

## ✅ IMPLEMENTATION COMPLETE

**Total Changes**:
- ✅ 1 Code node modified (Outreach Input Processing)
- ✅ 1 Gmail node modified (Draft Gmail)
- ✅ 4 New nodes added (Create Doc, Export PDF, Customizer, Delete Doc)
- ✅ Workflow connections updated

**Ready for deployment** 🚀

