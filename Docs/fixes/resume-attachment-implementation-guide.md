# Resume Attachment Implementation Guide

## Quick Start: Static Resume Attachment

This guide provides step-by-step instructions for adding a resume attachment to the Draft Gmail node.

---

## 🎯 APPROACH 1: Static Resume from Google Drive (RECOMMENDED)

### Prerequisites
- Resume PDF uploaded to Google Drive
- Google Drive API access configured in N8N

### Step 1: Get Resume File ID from Google Drive

1. Upload your resume to Google Drive
2. Right-click the file → "Get link"
3. Extract the file ID from the URL:
   ```
   https://drive.google.com/file/d/1ABC123XYZ456/view
                                  ^^^^^^^^^^^^ (This is the file ID)
   ```

### Step 2: Add Google Drive Node

**Insert Between**: AI Email Generation → Draft Gmail

**Node Configuration**:
```json
{
  "parameters": {
    "resource": "file",
    "operation": "download",
    "fileId": {
      "__rl": true,
      "value": "YOUR_FILE_ID_HERE",
      "mode": "id"
    },
    "options": {}
  },
  "type": "n8n-nodes-base.googleDrive",
  "name": "Fetch Resume from Google Drive",
  "position": [-720, -384]
}
```

### Step 3: Update Draft Gmail Attachment Configuration

**Current Configuration**:
```json
{
  "options": {
    "attachmentsUi": {
      "attachmentsBinary": [
        {}
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
          "property": "data"
        }
      ]
    },
    "sendTo": "={{ $('Outreach Input Processing').item.json.contact.email }}"
  }
}
```

### Step 4: Update Workflow Connections

**New Flow**:
```
AI Email Generation 
  → Fetch Resume from Google Drive 
  → Draft Gmail
```

**Connection Configuration**:
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
          "node": "Draft Gmail",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

---

## 🎯 APPROACH 2: Static Resume from URL

### Prerequisites
- Resume PDF hosted at a public URL

### Step 1: Add HTTP Request Node

**Insert Between**: AI Email Generation → Draft Gmail

**Node Configuration**:
```json
{
  "parameters": {
    "method": "GET",
    "url": "https://your-domain.com/resumes/Ivo_Dachev_Resume.pdf",
    "options": {
      "response": {
        "response": {
          "responseFormat": "file"
        }
      }
    }
  },
  "type": "n8n-nodes-base.httpRequest",
  "name": "Fetch Resume from URL",
  "position": [-720, -384]
}
```

### Step 2: Update Draft Gmail (Same as Approach 1)

Use the same attachment configuration as Approach 1.

---

## 🎯 APPROACH 3: Dynamic Resume with Custom Filename

### Use Case
You want the resume filename to include the job title and company name.

### Step 1: Add Code Node to Rename Binary

**Insert Between**: Resume Fetch Node → Draft Gmail

**Node Configuration**:
```javascript
// RESUME FILENAME CUSTOMIZER
// Renames the resume binary with dynamic filename

const jobTitle = $('Outreach Input Processing').item.json.job.title;
const companyName = $('Outreach Input Processing').item.json.job.company;
const candidateName = "Ivo Dachev";

// Clean strings for filename (remove special characters)
const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_');
const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
const cleanCandidateName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');

// Create dynamic filename
const filename = `Resume_${cleanCandidateName}_${cleanJobTitle}_${cleanCompanyName}.pdf`;

// Get the binary data from previous node
const binaryData = $input.item.binary.data;

// Return with renamed binary
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

### Step 2: Update Draft Gmail Attachment

```json
{
  "options": {
    "attachmentsUi": {
      "attachmentsBinary": [
        {
          "property": "resume"  // Changed from "data" to "resume"
        }
      ]
    },
    "sendTo": "={{ $('Outreach Input Processing').item.json.contact.email }}"
  }
}
```

---

## 🎯 APPROACH 4: Multiple Attachments (Resume + Cover Letter)

### Use Case
Attach both resume and cover letter to the email.

### Step 1: Fetch Both Files

Use two separate nodes (Google Drive or HTTP Request) to fetch:
1. Resume PDF
2. Cover Letter PDF

### Step 2: Merge Binary Data

**Add Code Node**:
```javascript
// MERGE MULTIPLE ATTACHMENTS
// Combines resume and cover letter into single output

const resumeBinary = $('Fetch Resume').item.binary.data;
const coverLetterBinary = $('Fetch Cover Letter').item.binary.data;

return {
  json: $json,
  binary: {
    resume: resumeBinary,
    coverLetter: coverLetterBinary
  }
};
```

### Step 3: Update Draft Gmail Attachment

```json
{
  "options": {
    "attachmentsUi": {
      "attachmentsBinary": [
        {
          "property": "resume,coverLetter"  // Comma-separated list
        }
      ]
    },
    "sendTo": "={{ $('Outreach Input Processing').item.json.contact.email }}"
  }
}
```

---

## 🔧 TROUBLESHOOTING

### Issue 1: "Binary property not found"

**Cause**: The binary property name doesn't match the configuration.

**Solution**:
1. Check the output of the previous node
2. Look for the binary property name (usually `data`)
3. Update the `property` field in Draft Gmail to match

**Debug Code**:
```javascript
// Add this to a Code node to inspect binary data
console.log('Binary properties:', Object.keys($input.item.binary || {}));
return $input.all();
```

### Issue 2: "File size too large"

**Cause**: Gmail has a 25MB attachment limit.

**Solution**:
1. Compress the PDF
2. Use a link to the resume instead
3. Host the resume externally and include a download link in the email

### Issue 3: "Attachment appears as 'noname' or 'untitled'"

**Cause**: The binary data doesn't have a `fileName` property.

**Solution**: Use Approach 3 to add a custom filename.

### Issue 4: "Attachment is corrupted"

**Cause**: Binary data encoding issue.

**Solution**:
1. Ensure the fetch node uses `responseFormat: "file"`
2. Don't modify the binary data between fetch and attach
3. Check the MIME type is correct (`application/pdf`)

---

## 📋 IMPLEMENTATION CHECKLIST

### Pre-Implementation
- [ ] Decide on resume source (Google Drive, URL, or dynamic)
- [ ] Upload resume to chosen location
- [ ] Get file ID or URL
- [ ] Test file accessibility

### Implementation
- [ ] Add resume fetch node to workflow
- [ ] Position node between AI Email Generation and Draft Gmail
- [ ] Configure fetch node with correct file ID/URL
- [ ] Update Draft Gmail attachment configuration
- [ ] Update workflow connections
- [ ] Save workflow

### Testing
- [ ] Execute workflow with test data
- [ ] Verify resume fetch node outputs binary data
- [ ] Check Draft Gmail node input has binary property
- [ ] Open Gmail draft and verify attachment is present
- [ ] Download attachment from draft and verify it opens correctly
- [ ] Check filename is correct (if using dynamic naming)
- [ ] Verify file size is reasonable

### Production
- [ ] Test with multiple job applications
- [ ] Monitor for errors
- [ ] Verify all drafts have attachments
- [ ] Check attachment quality and formatting

---

## 🚀 QUICK IMPLEMENTATION (5 Minutes)

### Fastest Path: Static Resume from Google Drive

1. **Upload Resume**:
   - Go to Google Drive
   - Upload your resume PDF
   - Copy the file ID from the URL

2. **Add Node in N8N**:
   - Open workflow in N8N
   - Click between "AI Email Generation" and "Draft Gmail"
   - Add "Google Drive" node
   - Select "File" → "Download"
   - Paste file ID
   - Save

3. **Update Draft Gmail**:
   - Click "Draft Gmail" node
   - Expand "Options"
   - Find "Attachments"
   - Click "Add Attachment"
   - Set "Attachment Field Name" to `data`
   - Save

4. **Update Connections**:
   - Delete connection from "AI Email Generation" to "Draft Gmail"
   - Connect "AI Email Generation" → "Google Drive"
   - Connect "Google Drive" → "Draft Gmail"
   - Save workflow

5. **Test**:
   - Execute workflow
   - Check Gmail draft has attachment

**Done!** ✅

---

## 📞 SUPPORT

If you encounter issues:
1. Check the execution data for the resume fetch node
2. Verify binary data exists in the output
3. Confirm the property name matches the attachment configuration
4. Review the troubleshooting section above

**Common Property Names**:
- Google Drive: `data`
- HTTP Request: `data`
- Code Node: Custom (whatever you name it)

**Remember**: The `property` field in the attachment configuration must match the binary property name from the previous node!

