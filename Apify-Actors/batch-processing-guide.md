# Batch Processing Guide for Contact Enrichment

## 🎯 **Use Case Overview**

**Our Specific Workflow:**
- **Input**: ~100 job postings from LinkedIn automation
- **Goal**: Find 1-2 hiring manager contacts per job posting
- **Requirement**: Process efficiently with minimal actor runs
- **Target**: HR, Talent Acquisition, Operations decision-makers

**This is NOT general lead scraping** (e.g., "find all plumbers in San Francisco")

## 📊 **Batch Processing Strategies**

### **Strategy 1: Large Single Batch (RECOMMENDED)**

**Approach**: Process all 100 companies in one actor execution

**Advantages:**
- ✅ **Minimum Cost**: Single execution = minimum charge only
- ✅ **Maximum Efficiency**: Leverages 30K lead capacity
- ✅ **Progress Tracking**: Automatic resume if interrupted
- ✅ **Simplest Logic**: One input, one output to process

**JSON Example:**
```json
{
  "companyDomain": ["company1.com", "company2.com", ..., "company100.com"],
  "totalResults": 200,
  "personTitle": ["Head of Talent", "VP People", "HR Manager"],
  "seniority": ["Manager", "Director", "VP", "Head"],
  "functional": ["Human Resources", "Operations"],
  "contactEmailStatus": ["verified"],
  "includeEmails": true
}
```

**Cost Analysis:**
- **Leads Requested**: 200 (2 per company average)
- **Minimum Charge**: 100 leads
- **Actual Cost**: $0.20 (200 leads × $1.4/1k)
- **Execution Time**: 15-20 minutes

**Challenges:**
- ⚠️ **Uneven Distribution**: Popular companies may get 10+ leads, others 0
- ⚠️ **No Per-Company Limits**: Can't guarantee 2 leads per company
- ⚠️ **Result Mapping**: Need to map contacts back to job postings

### **Strategy 2: Medium Batches (BALANCED)**

**Approach**: Split into 5 batches of 20 companies each

**Advantages:**
- ✅ **Better Control**: More predictable results per batch
- ✅ **Error Handling**: Easier to retry failed batches
- ✅ **Faster Individual Runs**: 5-8 minutes per batch
- ✅ **Progress Visibility**: Can monitor batch-by-batch progress

**Cost Analysis:**
- **Batches**: 5 batches × 100 leads minimum = 500 leads charged
- **Actual Cost**: $0.70 (500 leads × $1.4/1k)
- **Trade-off**: 3.5x more expensive but better control

### **Strategy 3: Small Test Batches**

**Approach**: Process 5-10 companies per batch for testing

**Use Cases:**
- Initial testing and validation
- High-priority companies only
- Troubleshooting specific companies

## 🔄 **Lead Distribution Challenge**

### **The Problem**
Apify actors don't support per-company lead limits. With `totalResults: 200`:
- **Scenario A**: 10 popular companies get 20 leads each, 90 companies get 0
- **Scenario B**: Even distribution of 2 leads per company (unlikely)
- **Reality**: Unpredictable distribution based on data availability

### **Solutions**

#### **Multi-Pass Approach**
1. **Pass 1**: Broad search with target lead count
2. **Pass 2**: Identify companies with 0 results
3. **Pass 3**: Retry with relaxed filters for missing companies
4. **Pass 4**: Fallback to alternative actor if needed

#### **Progressive Filtering**
```javascript
// Pass 1: Strict filters
const strictResults = await runActor({
  companyDomain: allCompanies,
  totalResults: 200,
  seniority: ["Director", "VP", "Head"],
  functional: ["Human Resources"]
});

// Pass 2: Relaxed filters for companies with 0 results
const missingCompanies = findCompaniesWithNoResults(strictResults);
const relaxedResults = await runActor({
  companyDomain: missingCompanies,
  totalResults: 100,
  seniority: ["Manager", "Director", "VP", "Head"],
  functional: ["Human Resources", "Operations", "Management"]
});
```

## 🔧 **N8N Integration Implementation**

### **Input Builder Node (Code)**
```javascript
// Extract unique company domains from job postings
const jobPostings = $input.all();
const uniqueDomains = [...new Set(
  jobPostings.map(job => job.json.organizationDomain)
)].filter(domain => domain && domain.length > 0);

// Build actor input for batch processing
const actorInput = {
  companyDomain: uniqueDomains,
  totalResults: Math.min(uniqueDomains.length * 2, 500), // 2 per company, max 500
  personTitle: [
    "Head of Talent", "VP People", "Director of Recruiting",
    "Talent Acquisition Manager", "HR Manager", "Chief People Officer",
    "Head of People", "VP Human Resources", "Director of People"
  ],
  seniority: ["Manager", "Director", "VP", "Head"],
  functional: ["Human Resources", "Operations"],
  contactEmailStatus: ["verified"],
  companyEmployeeSize: ["201-500", "501-1000", "1001-5000", "5001-10000"],
  personCountry: ["United States"],
  includeEmails: true
};

// Store original job data for later mapping
return [{
  json: {
    actorInput: actorInput,
    originalJobs: jobPostings.map(job => job.json),
    batchId: `batch_${Date.now()}`,
    companiesCount: uniqueDomains.length
  }
}];
```

### **Output Mapping Node (Code)**
```javascript
// Map actor results back to original job postings
const actorResults = $('Leads Scraper').all()[0].json;
const originalJobs = $input.first().json.originalJobs;

const enrichedJobs = originalJobs.map(job => {
  // Find contacts for this job's company
  const companyContacts = actorResults.filter(contact => {
    const contactDomain = contact.organization?.website || '';
    const jobDomain = job.organizationDomain || '';
    return contactDomain.toLowerCase() === jobDomain.toLowerCase();
  });

  // Limit to top 2 contacts per job
  const topContacts = companyContacts
    .slice(0, 2)
    .map(contact => ({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      jobTitle: contact.position || '',
      linkedinUrl: contact.linkedinUrl || '',
      emailStatus: contact.email ? 'Verified' : 'Not Available'
    }));

  return {
    ...job,
    contacts: topContacts,
    contactsFound: companyContacts.length,
    enrichmentStatus: topContacts.length > 0 ? 'Success' : 'No Contacts Found'
  };
});

return enrichedJobs.map(job => ({ json: job }));
```

## 🚨 **Error Handling Strategy**

### **Batch Failure Recovery**
```javascript
async function processWithFallback(jobPostings) {
  try {
    // Try primary actor (Leads Scraper) with large batch
    return await runLeadsScraper(buildLargeBatch(jobPostings));
  } catch (error) {
    console.log('Large batch failed, trying medium batches');
    try {
      // Fallback to medium batches
      return await runMediumBatches(jobPostings, 20);
    } catch (error2) {
      console.log('Medium batches failed, trying backup actor');
      // Final fallback to Leads Finder
      return await runLeadsFinder(transformToLeadsFinderFormat(jobPostings));
    }
  }
}
```

### **Zero Results Handling**
1. **Detection**: Track companies returning 0 contacts
2. **Retry Logic**: Use broader filters (more job titles, seniority levels)
3. **Alternative Sources**: Switch to backup actor for missing companies
4. **Manual Review**: Log companies requiring manual research

### **Data Quality Validation**
```javascript
// Validate enrichment results
const validationResults = enrichedJobs.map(job => ({
  ...job,
  validationStatus: {
    hasContacts: job.contacts.length > 0,
    hasEmails: job.contacts.some(c => c.email),
    hasLinkedIn: job.contacts.some(c => c.linkedinUrl),
    qualityScore: calculateQualityScore(job.contacts)
  }
}));
```

## 📈 **Performance Optimization**

### **Recommended Batch Sizes**
- **Testing**: 5 companies (validate setup)
- **Production Small**: 20 companies (better control)
- **Production Large**: 100 companies (maximum efficiency)

### **Cost Optimization**
- **Large Batch**: $0.20 for 100 companies (most efficient)
- **Medium Batches**: $0.70 for 100 companies (better control)
- **Small Batches**: $2.80 for 100 companies (testing only)

### **Time Optimization**
- **Parallel Processing**: Run multiple medium batches simultaneously
- **Progress Tracking**: Leverage actor's automatic resume feature
- **Caching**: Store results to avoid re-processing same companies

---

**Last Updated**: 2025-01-06  
**Status**: Ready for Contact Enrichment Workshop integration
