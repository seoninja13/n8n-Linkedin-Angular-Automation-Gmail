# Lead Finder N8N Integration Analysis

**Date**: 2025-10-06  
**Workflow**: Contact Enrichment Workshop (`rClUELDAK9f4mgJx`)  
**Current Actor**: Apollo Scraper (`jljBwyyQakqrL1wae`)  
**Target Actor**: Lead Finder (`aihL2lJmGDt9XFCGg`)

---

## 🔍 **CURRENT WORKFLOW ANALYSIS**

### **Current Architecture**:
```
[Trigger] → [Domain Processing] → [Build Apollo URL (Gemini AI)] → [Apollo Scraper] → [Email Filters] → [Output]
```

### **Current Data Flow**:

**Node 1: Company Domain Processing**
- **Input**: Job object from orchestrator
- **Output**:
```json
{
  "organizationDomainList": ["domain1.com", "domain2.com"],
  "originalJobData": { /* job object */ }
}
```

**Node 2: Build Apollo URL (Gemini AI)**
- **Input**: `organizationDomainList` array
- **Output**:
```json
{
  "content": {
    "parts": [
      {
        "text": "{\"clean_output\": false, \"URL\": \"https://app.apollo.io/#/people?...\", \"total_records\": 500}"
      }
    ]
  }
}
```

**Node 3: Run Apollo Actor**
- **Input**: `{{ $json.content.parts[0].text }}` (Apollo URL JSON)
- **Actor ID**: `jljBwyyQakqrL1wae` (Apollo Scraper)
- **Output**: Contact data from Apollo.io scraping

---

## 🎯 **LEAD FINDER REQUIREMENTS**

### **Required Input Schema**:
```json
{
  "organizationDomains": ["domain1.com", "domain2.com"],
  "personTitles": ["Marketing Manager", "HR Manager", "Director of Marketing"],
  "employeeRanges": ["1,10", "11,50", "51,200", "201,500"],
  "maxResults": 1000,
  "getEmails": true,
  "includeRiskyEmails": false
}
```

### **Key Differences from Apollo Scraper**:

| **Aspect** | **Apollo Scraper** | **Lead Finder** |
|------------|-------------------|-----------------|
| **Input Type** | Apollo.io URL (string) | JSON object with domains + filters |
| **Domain Field** | Part of URL | `organizationDomains` array |
| **Job Titles** | Part of URL | `personTitles` array |
| **Employee Size** | Part of URL | `employeeRanges` array (format: `"min,max"`) |
| **URL Generation** | Required (Gemini AI) | **NOT NEEDED** |
| **Keywords** | Supported in URL | ❌ **NOT SUPPORTED** (causes validation error) |

---

## ⚠️ **CRITICAL ISSUES IDENTIFIED**

### **Issue #1: Unnecessary "Build Apollo URL" Node**
- **Problem**: Lead Finder doesn't need an Apollo.io URL
- **Impact**: Wasting Gemini API credits and adding latency
- **Solution**: Replace with direct JSON transformation

### **Issue #2: Wrong Input Format**
- **Current**: `{{ $json.content.parts[0].text }}` (expects Gemini output)
- **Required**: Direct JSON object with `organizationDomains`, `personTitles`, etc.
- **Solution**: Create transformation node to build Lead Finder input

### **Issue #3: Missing Job Title Mapping**
- **Problem**: Current workflow doesn't extract job titles from job data
- **Impact**: Lead Finder won't know which roles to search for
- **Solution**: Add logic to extract hiring manager roles from job description

### **Issue #4: Wrong Actor ID**
- **Current**: `jljBwyyQakqrL1wae` (Apollo Scraper)
- **Required**: `aihL2lJmGDt9XFCGg` (Lead Finder)
- **Solution**: Update actor ID in Apify node

---

## 🔧 **PROPOSED SOLUTION**

### **New Architecture**:
```
[Trigger] → [Domain Processing] → [Build Lead Finder Input] → [Lead Finder Actor] → [Email Filters] → [Output]
```

### **Changes Required**:

**1. REMOVE**: "Build Apollo URL - Multiple companies" node (Gemini AI)
   - No longer needed for Lead Finder
   - Saves Gemini API credits
   - Reduces latency by ~2-3 seconds

**2. ADD**: "Build Lead Finder Input" node (Code/Function)
   - Transforms domain list into Lead Finder input schema
   - Adds default job titles for hiring managers
   - Formats employee ranges correctly
   - Sets email verification flags

**3. UPDATE**: "Run Apollo Actor" node
   - Change actor ID from `jljBwyyQakqrL1wae` to `aihL2lJmGDt9XFCGg`
   - Change input from `{{ $json.content.parts[0].text }}` to `{{ $json }}`
   - Rename to "Run Lead Finder Actor"

**4. UPDATE**: Output formatting node
   - Adjust field mappings for Lead Finder output schema
   - Map `emailStatus` (Lead Finder) vs `email_status` (Apollo Scraper)
   - Handle new fields: `organizationEmployeeCount`, `organizationRevenueRange`, etc.

---

## 📋 **DETAILED IMPLEMENTATION PLAN**

### **Step 1: Create "Build Lead Finder Input" Node**

**Node Type**: Code (JavaScript)  
**Position**: Replace "Build Apollo URL" node  
**Purpose**: Transform domain list into Lead Finder input schema

**Code**:
```javascript
// BUILD LEAD FINDER INPUT
// Transforms company domain data into Lead Finder actor input schema

const domainData = $json;
const organizationDomains = domainData.organizationDomainList || [];
const originalJobData = domainData.originalJobData || {};

// Default job titles for hiring managers (marketing + HR roles)
const defaultPersonTitles = [
  "Marketing Specialist",
  "Senior Copywriter",
  "Social Media Manager",
  "Growth Marketing Manager",
  "Content Marketing Manager",
  "Head of Marketing",
  "Director of Marketing",
  "Head of Communications",
  "Content Editor",
  "Social Content Specialist",
  "Marketing Manager",
  "VP Marketing",
  "Chief Marketing Officer",
  "Head of Talent",
  "VP People",
  "HR Manager",
  "Director of Recruiting",
  "Talent Acquisition Manager"
];

// Employee size ranges (format: "min,max" with comma, no spaces)
const employeeRanges = ["1,10", "11,50", "51,200", "201,500"];

// Build Lead Finder input
const leadFinderInput = {
  organizationDomains: organizationDomains,
  personTitles: defaultPersonTitles,
  employeeRanges: employeeRanges,
  maxResults: 1000,
  getEmails: true,
  includeRiskyEmails: false  // Only verified emails
};

console.log(`Lead Finder input prepared for ${organizationDomains.length} domain(s)`);
console.log(`Searching for ${defaultPersonTitles.length} job titles`);
console.log(`Original job: ${originalJobData.title} at ${originalJobData.companyName}`);

return [{
  json: leadFinderInput,
  passthroughData: {
    originalJobData: originalJobData
  }
}];
```

---

### **Step 2: Update "Run Apollo Actor" Node**

**Changes**:
1. **Actor ID**: Change from `jljBwyyQakqrL1wae` to `aihL2lJmGDt9XFCGg`
2. **Input JSON**: Change from `{{ $json.content.parts[0].text }}` to `{{ $json }}`
3. **Node Name**: Rename to "Run Lead Finder Actor - Contact Discovery"

**Updated Configuration**:
```json
{
  "parameters": {
    "operation": "Run actor and get dataset",
    "actorSource": "store",
    "actorId": {
      "__rl": true,
      "value": "aihL2lJmGDt9XFCGg",
      "mode": "list",
      "cachedResultName": "Lead Finder | With Emails | $1.4 / 1k (fatihtahta/lead-finder)",
      "cachedResultUrl": "https://console.apify.com/actors/aihL2lJmGDt9XFCGg/input"
    },
    "customBody": "={{ $json }}",
    "timeout": {}
  },
  "type": "@apify/n8n-nodes-apify.apify",
  "typeVersion": 1,
  "position": [120, -48],
  "id": "apify-lead-finder",
  "name": "Run Lead Finder Actor - Contact Discovery"
}
```

---

### **Step 3: Update Output Formatting Node**

**Field Mapping Changes**:

| **Apollo Scraper Field** | **Lead Finder Field** | **Change Required** |
|--------------------------|----------------------|---------------------|
| `first_name` | `firstName` | ✅ Update |
| `last_name` | `lastName` | ✅ Update |
| `email` | `email` | ✅ Same |
| `title` | `title` | ✅ Same |
| `organization_name` | `organizationName` | ✅ Update |
| `linkedin_url` | N/A | ⚠️ Not available |
| `email_status` | `emailStatus` | ✅ Update (camelCase) |
| `organization_id` | `identifier` | ✅ Update |
| N/A | `companyPhone` | ✅ New field |
| N/A | `organizationEmployeeCount` | ✅ New field |
| N/A | `organizationRevenueRange` | ✅ New field |

**Updated Code** (partial):
```javascript
// Format successful contact enrichment results
const finalOutput = {
  jobData: {
    title: originalJobData.title,
    companyName: originalJobData.companyName,
    companyWebsite: originalJobData.companyWebsite,
    location: originalJobData.location,
    descriptionHtml: originalJobData.descriptionHtml,
    descriptionText: originalJobData.descriptionText,
    jobUrl: originalJobData.jobUrl
  },
  contactEnrichment: {
    primaryContact: {
      firstName: contactData.firstName,           // Changed from first_name
      lastName: contactData.lastName,             // Changed from last_name
      email: contactData.email,
      jobTitle: contactData.title,
      company: contactData.organizationName,      // Changed from organization_name
      companyPhone: contactData.companyPhone,     // NEW FIELD
      emailStatus: contactData.emailStatus,       // Changed from email_status (camelCase)
      confidence: "high",
      organizationId: contactData.identifier      // Changed from organization_id
    },
    enrichmentMetadata: {
      searchMethod: "lead-finder-apify-integration",  // Updated
      totalFound: 1,
      verificationMethod: "lead-finder-verified",     // Updated (no NeverBounce needed)
      processedAt: new Date().toISOString(),
      apifyCreditsUsed: 1,
      neverBounceCreditsUsed: 0                       // No longer needed
    }
  },
  // ... rest of output
};
```

---

## ✅ **VALIDATION CHECKLIST**

### **Before Deployment**:
- [ ] "Build Lead Finder Input" node created with correct code
- [ ] Actor ID updated to `aihL2lJmGDt9XFCGg`
- [ ] Input JSON updated to `{{ $json }}`
- [ ] Output formatting updated for Lead Finder field names
- [ ] Workflow validated with `n8n_validate_workflow`
- [ ] No validation errors reported

### **After Deployment**:
- [ ] Test with single job from orchestrator
- [ ] Verify Lead Finder returns contacts (expected: 66.7% email yield)
- [ ] Confirm email verification (all should be "verified")
- [ ] Check output format matches orchestrator expectations
- [ ] Monitor Apify credits usage (~$0.01-0.02 per run)

---

## 📊 **EXPECTED IMPROVEMENTS**

| **Metric** | **Before (Apollo Scraper)** | **After (Lead Finder)** | **Improvement** |
|------------|----------------------------|------------------------|-----------------|
| **Email Yield** | 12.5% (1/8) | **66.7%** (10/15) | **+433%** |
| **API Calls** | 2 (Gemini + Apify) | 1 (Apify only) | **-50%** |
| **Latency** | ~5-7 seconds | ~2-4 seconds | **-40%** |
| **Cost per Email** | ~$0.02 | ~$0.001-0.002 | **-90%** |
| **Email Verification** | NeverBounce required | Built-in | **Simpler** |

---

**Next Steps**: Implement changes in N8N workflow using MCP tools

