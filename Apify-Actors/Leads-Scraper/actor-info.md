# Leads Scraper - Primary Contact Enrichment Actor

## 📋 **Basic Information**

- **Actor Name**: Leads Scraper - ✅ $1.4/1k | 30K+ with EMAILS ✅ just like Apollo
- **Actor ID**: `T1XDXWc1L92AfIJtd`
- **Developer**: Peaky Dev (`peakydev`)
- **Apify Store URL**: https://console.apify.com/actors/T1XDXWc1L92AfIJtd
- **Support Email**: peakydev00@gmail.com

## 🚦 **Current Status**

- **Maintenance Status**: ✅ **ACTIVE** (No maintenance warnings)
- **Last Modified**: 1 day ago
- **Success Rate**: **>99%** (Excellent)
- **User Rating**: 3.0/5 (10 reviews)
- **Total Users**: 395 active users
- **Open Issues**: 1 (Very low)

## 💰 **Pricing Structure**

### **Paid Apify Users**
- **Rate**: $1.4 per 1,000 leads
- **Minimum Charge**: 100 leads per run (even if fewer found)
- **Maximum Capacity**: 30,000 leads per run

### **Free Apify Users**
- **Rate**: $2.0 per 1,000 leads  
- **Limit**: 100 leads maximum per run
- **Recommendation**: Upgrade to paid plan for production use

### **Alternative Pricing**
- **Rental Option**: $35/month for up to 550K leads

## ✅ **Batch Processing Support**

### **Company Domain Batching**
- **Field**: `companyDomain` 
- **Type**: Array of strings
- **Example**: `["google.com", "apify.com", "notion.so"]`
- **Capacity**: Process multiple companies in single execution

### **Progress Tracking**
- **Feature**: Automatic progress tracking across runs
- **Benefit**: Resumes from last scraped page, avoids duplicates
- **Duration**: Progress stored for 30 days
- **Use Case**: Perfect for large batch processing

## 🎯 **Target Filtering Capabilities**

### **Person Targeting**
- **Job Titles**: `personTitle` (array)
- **Seniority**: `seniority` (array) 
- **Department**: `functional` (array)
- **Location**: `personState`, `personCountry`

### **Company Targeting**  
- **Domains**: `companyDomain` (array) - **KEY FOR BATCH PROCESSING**
- **Size**: `companyEmployeeSize` (array)
- **Location**: `companyState`, `companyCountry`

### **Email Quality**
- **Status**: `contactEmailStatus`
- **Enrichment**: `includeEmails` (boolean)
- **Success Rate**: 65-70% email enrichment

## 📊 **Performance Metrics**

### **Speed**
- **Rate**: 15-20 minutes per 1,000 leads
- **Timeout**: Configure run limit accordingly
- **Capacity**: Up to 30K leads per run

### **Data Quality**
- **Email Enrichment**: 65-70% success rate
- **LinkedIn URLs**: Included for person and organization
- **Verification**: Verified emails when available

## 🔧 **Integration Notes for Contact Enrichment Workshop**

### **Advantages**
- ✅ **Excellent Reliability**: >99% success rate
- ✅ **Active Development**: Modified 1 day ago
- ✅ **Batch Processing**: Native array support for company domains
- ✅ **Progress Tracking**: Automatic resume capability
- ✅ **Cost Effective**: $1.4/1k leads (cheaper than Leads Finder)
- ✅ **High Capacity**: 30K leads per run vs 10K limit elsewhere

### **Considerations**
- ⚠️ **Minimum Charge**: 100 leads per run (cost control needed)
- ⚠️ **Email Rate**: 65-70% (vs 100% verified in other actors)
- ⚠️ **Limited Reviews**: Only 10 reviews (vs 29 for Leads Finder)

### **Recommended Configuration**
- **Batch Size**: 10-20 companies per run
- **Lead Limit**: 500-1000 total leads per batch
- **Email Requirement**: Set `includeEmails: true`
- **Progress Tracking**: Leverage automatic resume for large batches

## 📊 **Batch Processing Strategy for Contact Enrichment**

### **Use Case: 100 Job Postings → Contact Enrichment**

Our specific workflow differs from general lead scraping:
- **Input**: ~100 job postings from LinkedIn automation
- **Goal**: Find 1-2 hiring managers per job posting
- **Requirement**: Process all jobs in minimal actor runs (not 100 separate runs)

### **Optimal Batch Processing Approach**

#### **Strategy 1: Large Single Batch (Recommended)**
```json
{
  "companyDomain": [
    "company1.com", "company2.com", ..., "company100.com"
  ],
  "totalResults": 200,
  "personTitle": ["Head of Talent", "VP People", "HR Manager"],
  "seniority": ["Manager", "Director", "VP", "Head"],
  "includeEmails": true
}
```

**Advantages:**
- ✅ Single actor execution (minimum cost)
- ✅ Leverages 30K lead capacity
- ✅ Progress tracking across entire batch
- ✅ Optimal cost efficiency

**Considerations:**
- ⚠️ Uneven distribution (some companies may get 0 leads, others 10+)
- ⚠️ No per-company lead limits
- ⚠️ Harder to map results back to specific job postings

#### **Strategy 2: Medium Batches (Balanced)**
Split 100 companies into 5 batches of 20 companies each:
```json
{
  "companyDomain": [
    "company1.com", "company2.com", ..., "company20.com"
  ],
  "totalResults": 40,
  "includeEmails": true
}
```

**Advantages:**
- ✅ Better lead distribution control
- ✅ Easier error handling and retry logic
- ✅ More predictable results per batch
- ✅ Faster individual batch execution

**Cost Analysis:**
- 5 batches × 100 leads minimum = 500 leads charged
- Same cost as single large batch but better control

### **Lead Distribution Strategy**

#### **Challenge: Even Distribution**
The actor doesn't support per-company lead limits, so results may be skewed:
- Popular companies (Google, Apple) may return 50+ leads
- Smaller companies may return 0-2 leads
- Total 200 leads might come from only 10-15 companies

#### **Solution: Multi-Pass Approach**
1. **Pass 1**: Broad search with `totalResults: 200`
2. **Pass 2**: Target companies with 0 results using relaxed filters
3. **Pass 3**: Fallback to alternative data sources if needed

### **N8N Integration Pattern**

#### **Input Builder Logic**
```javascript
// Collect unique company domains from job batch
const uniqueDomains = [...new Set(
  jobPostings.map(job => job.organizationDomain)
)];

// Build actor input
const actorInput = {
  companyDomain: uniqueDomains,
  totalResults: Math.min(uniqueDomains.length * 2, 500),
  personTitle: [
    "Head of Talent", "VP People", "Director of Recruiting",
    "Talent Acquisition Manager", "HR Manager"
  ],
  seniority: ["Manager", "Director", "VP", "Head"],
  functional: ["Human Resources", "Operations"],
  contactEmailStatus: ["verified"],
  includeEmails: true
};
```

#### **Output Mapping Logic**
```javascript
// Map contacts back to job postings
const enrichedJobs = jobPostings.map(job => {
  const companyContacts = actorResults.filter(
    contact => contact.organization?.website === job.organizationDomain
  );

  return {
    ...job,
    contacts: companyContacts.slice(0, 2), // Limit to 2 contacts per job
    contactsFound: companyContacts.length
  };
});
```

### **Error Handling Strategy**

#### **Batch Failure Recovery**
```javascript
// Pseudo-code for batch processing with fallback
async function processContactEnrichment(jobPostings) {
  try {
    // Try large batch first
    return await runLeadsScraper(buildLargeBatch(jobPostings));
  } catch (error) {
    // Fallback to medium batches
    return await runMediumBatches(jobPostings, 20);
  }
}
```

#### **Zero Results Handling**
- **Detection**: Track companies with 0 contacts found
- **Retry**: Use broader filters (remove seniority/functional filters)
- **Fallback**: Switch to backup actor (Leads Finder) for missing companies
- **Logging**: Record companies with no contacts for manual review

## 🚨 **Known Validation Errors**

### Field: `seniority`
- **Error**: Field values are case-sensitive and must match exact allowed values
- **Allowed Values**: "Founder", "Chairman", "President", "CEO", "CXO", "Vice President", "Director", "Head", "Manager", "Senior", "Junior", "Entry Level", "Executive"
- **Correct Usage**: `"seniority": ["CEO", "Vice President", "Director"]`
- **Date Discovered**: 2025-01-06

### Field: `functional`
- **⚠️ CRITICAL**: Actor documentation is INCORRECT - actual validation differs!
- **Allowed Values** (37 total): "Admin", "Analytics", "Applications", "Cloud", "Compliance", "Controller", "Customer Service", "Cyber Security", "Data Engineering", "Devops", "Digital", "Distribution", "Engineering", "Finance", "Fraud", "Hiring", "HR", "Infrastructure", "Inside Sales", "IT", "Learning", "Legal", "Marketing", "Network Security", "Operations", "Product Management", "Product Security", "Production", "Purchase", "Research", "Risk", "Sales", "Security", "Support", "Testing", "Training"
- **Common Mistakes**: "Human Resources" (use "HR"), "Management" (use "Operations"), "Customer Success" (use "Customer Service")
- **Correct Usage**: `"functional": ["HR", "Hiring", "Marketing", "Sales"]`
- **Date Discovered**: 2025-01-06 (Updated with actual validation rules)

### Field: `companyEmployeeSize`
- **⚠️ CRITICAL**: Spaces ARE REQUIRED in size ranges!
- **Allowed Values**: "0 - 1", "2 - 10", "11 - 50", "51 - 200", "201 - 500", "501 - 1000", "1001 - 5000", "5001 - 10000", "10000+"
- **Common Mistake**: Using "201-500" without spaces (WRONG!)
- **Correct Usage**: `"companyEmployeeSize": ["201 - 500", "501 - 1000"]`
- **Date Discovered**: 2025-01-06 (Updated with actual validation rules)

### Field: `contactEmailStatus`
- **⚠️ CRITICAL**: This is a STRING, not an array! And "unknown" is WRONG!
- **Allowed Values**: "verified", "unverified", "unavailable"
- **Common Mistake**: Using array format `["verified"]` (WRONG!)
- **Correct Usage**: `"contactEmailStatus": "verified"` (string, not array)
- **Date Discovered**: 2025-01-06 (Updated with actual validation rules)

## 🚨 **Known Issues & Limitations**

1. **Minimum Charge Policy**: Always charged for minimum 100 leads
2. **Email Availability**: Not all leads include emails (65-70% rate)
3. **Filter Sensitivity**: Narrow filters may yield zero results
4. **Progress Disruption**: Aborting runs can disrupt progress tracking
5. **Field Validation**: Strict case-sensitive field value requirements

## 📈 **Recommendation Level**

### **PRIMARY ACTOR** ✅
**Reasons:**
- Highest success rate (>99%)
- Active maintenance and development
- Excellent batch processing capabilities
- Cost-effective pricing
- Robust progress tracking system

**Best For:**
- Production Contact Enrichment workflows
- Large batch processing (100+ job postings)
- Cost-sensitive operations
- Long-running data collection projects

---

## 🧪 **Test History**

### Test #1: Manual Test with Tech Giants (2025-01-06)
- **Input**: 5 tech company domains (notion.so, stripe.com, shopify.com, figma.com, linear.app)
- **Target**: HR/Talent roles
- **Result**: 1 email out of 8 results (12.5% email yield)
- **Status**: ⚠️ Low email yield - needs investigation

### Test #2: Real Job Data Test (2025-01-06)
- **Input**: 8 company domains from real LinkedIn job scrape (10 jobs)
- **Companies**: Qencode, Owlet, GrowForce, GaggleAMP, Hungry Minds, Fête, Digitive, JRD Systems
- **Target**: Marketing + HR/Talent roles
- **Employee Sizes**: 1-500 (smaller companies than Test #1)
- **Input File**: `.augment/Sample Outputs/apify-actor-input.json`
- **Status**: 🔄 In Progress
- **Expected**: Better email yield due to real company data and broader functional areas

---

**Last Updated**: 2025-01-06
**Status**: ✅ **RECOMMENDED FOR PRODUCTION**
