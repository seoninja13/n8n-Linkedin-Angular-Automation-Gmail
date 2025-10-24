# Career Site Job Listing Feed Actor - Integration Guide

**Actor ID**: `Dn2KJLnaNC5vFGkEw`  
**Actor Path**: `fantastic-jobs/career-site-job-listing-feed`  
**Integration Target**: Job Discovery Workshop (N8N workflow)  
**Integration Type**: SUPPLEMENT (parallel to LinkedIn job discovery)  
**Estimated Time**: 2-4 hours  
**Last Updated**: 2025-10-20

---

## **⚠️ IMPORTANT: ANALYSIS-ONLY DOCUMENT**

**This is a reference guide for FUTURE implementation. DO NOT implement these changes without explicit approval.**

**Implementation Approach**:
1. DUPLICATE the current Job Discovery Workshop workflow
2. Test Career Site Feed actor in the DUPLICATE workflow
3. Keep original LinkedIn workflow unchanged and operational
4. Run parallel testing before any production deployment

---

## **📋 PREREQUISITES**

### **1. Apify Account Setup**

**Required**:
- ✅ Apify account (free tier available)
- ✅ Apify API token
- ✅ Sufficient credits for testing (200 jobs = $0.24)

**Setup Steps**:
1. Create account at https://apify.com/sign-up
2. Navigate to Settings → Integrations → API tokens
3. Click "Create new token"
4. Name: "N8N Job Discovery Integration"
5. Copy token (save securely)

### **2. N8N Apify Credentials**

**Required**:
- ✅ N8N instance with Apify node support
- ✅ Apify credentials configured in N8N

**Setup Steps**:
1. Open N8N → Credentials → Add Credential
2. Select "Apify API"
3. Name: "Apify - Job Discovery"
4. Paste API token from step 1
5. Test connection
6. Save credential

### **3. Job Discovery Workshop Schema**

**Required Fields** (verify your workshop accepts these):
- Job Title
- Company Name
- Location (city, state, country)
- Job Description
- Application URL
- Posting Date
- Salary (optional)
- Remote Status (optional)
- Employment Type (optional)
- Experience Level (optional)
- Company Size (optional)
- Company Industry (optional)

---

## **🔧 INTEGRATION STEPS**

### **STEP 1: Duplicate Current Workflow**

**Purpose**: Create isolated test environment without disrupting production

**Actions**:
1. Open current Job Discovery Workshop workflow in N8N
2. Click "Duplicate" button (top right)
3. Rename to: "Job Discovery Workshop - Career Site Test"
4. Add description: "Testing Career Site Job Listing Feed actor (2025-10-20)"
5. Save duplicate workflow

### **STEP 2: Add Apify Node**

**Purpose**: Add Career Site Feed actor to workflow

**Actions**:
1. In duplicate workflow, add new node after trigger
2. Search for "Apify" node
3. Select "Apify" node (n8n-nodes-base.apify)
4. Configure node:
   - **Credential**: Select "Apify - Job Discovery"
   - **Operation**: "Run Actor"
   - **Actor**: Select "By ID"
   - **Actor ID**: `Dn2KJLnaNC5vFGkEw`
   - **Wait for Finish**: ✅ Enabled
   - **Timeout**: 300 seconds (5 minutes)

### **STEP 3: Configure Input Parameters**

**Purpose**: Set filters to match your job search criteria

**Input Configuration** (JSON format):

```json
{
  "limit": 200,
  "includeAi": true,
  "includeLinkedIn": true,
  "descriptionType": "text",
  "titleSearch": [
    "Software Engineer:*",
    "Full Stack:*",
    "Backend:*",
    "Frontend:*",
    "DevOps:*"
  ],
  "locationSearch": [
    "United States",
    "Remote"
  ],
  "aiWorkArrangementFilter": [
    "Remote OK",
    "Remote Solely"
  ],
  "aiEmploymentTypeFilter": [
    "FULL_TIME"
  ],
  "aiExperienceLevelFilter": [
    "2-5",
    "5-10"
  ]
}
```

**Parameter Customization**:

| Parameter | Description | Example Values | Notes |
|-----------|-------------|----------------|-------|
| `limit` | Max jobs per run | 200-5000 | Start with 200 for testing |
| `titleSearch` | Job titles (array) | `["Engineer:*", "Developer:*"]` | Use `:*` for prefix matching |
| `locationSearch` | Locations (array) | `["United States", "Remote"]` | City, state, or country |
| `organizationSearch` | Company names (array) | `["Google", "Microsoft"]` | Optional filter |
| `domainFilter` | Company domains (array) | `["google.com", "microsoft.com"]` | Exact match only |
| `ats` | ATS platforms (array) | `["greenhouse", "lever", "workday"]` | Optional filter |
| `aiWorkArrangementFilter` | Work arrangement | `["Remote OK", "Hybrid", "On-site"]` | AI-enriched field |
| `aiEmploymentTypeFilter` | Employment type | `["FULL_TIME", "PART_TIME"]` | AI-enriched field |
| `aiExperienceLevelFilter` | Experience level | `["0-2", "2-5", "5-10", "10+"]` | Years of experience |
| `aiHasSalary` | Has salary info | `true` or `false` | Filter for salary transparency |
| `aiVisaSponsorshipFilter` | Visa sponsorship | `true` or `false` | Filter for visa support |
| `liOrganizationEmployeesGte` | Min company size | `100` | LinkedIn data |
| `liOrganizationEmployeesLte` | Max company size | `10000` | LinkedIn data |
| `liIndustryFilter` | LinkedIn industry | `["Computer Software", "Internet"]` | LinkedIn data |
| `includeAi` | Include AI fields | `true` or `false` | Recommended: true |
| `includeLinkedIn` | Include LinkedIn fields | `true` or `false` | Recommended: true |
| `descriptionType` | Description format | `"text"` or `"html"` | Recommended: text |

**Advanced Filtering Tips**:

1. **Prefix Matching**: Use `:*` suffix for prefix matching
   - `"Soft:*"` matches "Software", "Softball", "Soft Skills"
   - `"Engineer:*"` matches "Engineer", "Engineering", "Engineers"

2. **Exclusion Filters**: Use exclusion parameters to filter out unwanted results
   - `titleExclusionSearch`: Exclude job titles
   - `locationExclusionSearch`: Exclude locations
   - `organizationExclusionSearch`: Exclude companies
   - `domainExclusionFilter`: Exclude domains

3. **Description Search**: VERY intensive, use with other filters
   - `descriptionSearch`: Keywords in description
   - `descriptionExclusionSearch`: Exclude keywords
   - ⚠️ May timeout if used alone

4. **Combining Filters**: Use multiple filters for precision
   - Example: `titleSearch` + `locationSearch` + `aiWorkArrangementFilter`
   - More filters = fewer results but higher relevance

### **STEP 4: Add Data Transformation Node**

**Purpose**: Map Career Site Feed output to Job Discovery Workshop schema

**Actions**:
1. Add "Code" node after Apify node
2. Name: "Transform Career Site Data"
3. Mode: "Run Once for All Items"
4. JavaScript code:

```javascript
// Transform Career Site Feed output to Job Discovery Workshop schema
const transformedItems = [];

for (const item of $input.all()) {
  const job = item.json;
  
  // Extract primary location (first location in array)
  const primaryLocation = job.locations_derived?.[0] || {};
  
  // Parse salary data
  const salaryMin = job.ai_salary_minvalue || null;
  const salaryMax = job.ai_salary_maxvalue || null;
  const salaryCurrency = job.ai_salary_currency || 'USD';
  const salaryText = salaryMin && salaryMax 
    ? `${salaryCurrency} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`
    : job.salary_raw || null;
  
  // Determine remote status
  const isRemote = job.remote_derived || 
                   job.ai_work_arrangement === 'Remote Solely' ||
                   job.ai_work_arrangement === 'Remote OK';
  
  // Transform to workshop schema
  transformedItems.push({
    json: {
      // Core fields
      jobTitle: job.title,
      companyName: job.organization,
      location: {
        city: primaryLocation.city || null,
        state: primaryLocation.admin || null,
        country: primaryLocation.country || null,
        raw: job.locations_raw || null
      },
      jobDescription: job.description_text,
      applicationUrl: job.url,
      postingDate: job.date_posted,
      
      // Salary fields
      salary: salaryText,
      salaryMin: salaryMin,
      salaryMax: salaryMax,
      salaryCurrency: salaryCurrency,
      
      // Job metadata
      remote: isRemote,
      workArrangement: job.ai_work_arrangement || null,
      employmentType: job.ai_employment_type?.[0] || job.employment_type?.[0] || null,
      experienceLevel: job.ai_experience_level || null,
      
      // Company metadata
      companyUrl: job.organization_url,
      companyLogo: job.organization_logo,
      companyDomain: job.domain_derived || job.source_domain,
      companySize: job.linkedin_org_employees || null,
      companyIndustry: job.linkedin_org_industry || null,
      
      // Source metadata
      source: 'career_site',
      sourceType: job.source_type,
      atsplatform: job.source,
      
      // Additional enrichment
      keySkills: job.ai_key_skills || [],
      benefits: job.ai_benefits || [],
      visaSponsorship: job.ai_visa_sponsorship || false,
      
      // Tracking fields
      jobId: job.id,
      dateIndexed: job.date_created,
      dateModified: job.date_modified || null,
      
      // LinkedIn company data (if available)
      linkedinCompanyUrl: job.linkedin_org_url || null,
      linkedinCompanySize: job.linkedin_org_size || null,
      linkedinCompanyFollowers: job.linkedin_org_followers || null
    }
  });
}

return transformedItems;
```

**Field Mapping Reference**:

| Workshop Field | Career Site Field | Transformation |
|----------------|-------------------|----------------|
| `jobTitle` | `title` | Direct |
| `companyName` | `organization` | Direct |
| `location.city` | `locations_derived[0].city` | Extract first location |
| `location.state` | `locations_derived[0].admin` | Extract first location |
| `location.country` | `locations_derived[0].country` | Extract first location |
| `jobDescription` | `description_text` | Direct |
| `applicationUrl` | `url` | Direct |
| `postingDate` | `date_posted` | Direct |
| `salary` | `ai_salary_*` fields | Combine min/max/currency |
| `remote` | `remote_derived`, `ai_work_arrangement` | Boolean logic |
| `employmentType` | `ai_employment_type[0]` | Extract first type |
| `experienceLevel` | `ai_experience_level` | Direct |
| `companySize` | `linkedin_org_employees` | Direct |
| `companyIndustry` | `linkedin_org_industry` | Direct |

### **STEP 5: Add Deduplication Node**

**Purpose**: Remove duplicate jobs (same title + company + location)

**Actions**:
1. Add "Remove Duplicates" node after transformation
2. Name: "Deduplicate Jobs"
3. Configuration:
   - **Compare**: "All Fields Below"
   - **Fields to Compare**: 
     - `jobTitle`
     - `companyName`
     - `location.city`
     - `location.state`

**Alternative: Code-Based Deduplication**:

```javascript
// Advanced deduplication with fuzzy matching
const seen = new Set();
const uniqueItems = [];

for (const item of $input.all()) {
  const job = item.json;
  
  // Create deduplication key
  const dedupeKey = [
    job.jobTitle?.toLowerCase().trim(),
    job.companyName?.toLowerCase().trim(),
    job.location?.city?.toLowerCase().trim(),
    job.location?.state?.toLowerCase().trim()
  ].join('|');
  
  // Check if already seen
  if (!seen.has(dedupeKey)) {
    seen.add(dedupeKey);
    uniqueItems.push(item);
  }
}

return uniqueItems;
```

### **STEP 6: Merge with LinkedIn Results (Optional)**

**Purpose**: Combine Career Site jobs with LinkedIn jobs for comprehensive coverage

**Actions**:
1. Add "Merge" node after both Career Site and LinkedIn branches
2. Name: "Merge Job Sources"
3. Configuration:
   - **Mode**: "Append"
   - **Input 1**: Career Site jobs
   - **Input 2**: LinkedIn jobs
4. Add "Remove Duplicates" node after merge
5. Configure to deduplicate across both sources

**Merge Strategy**:

```
[Career Site Branch]     [LinkedIn Branch]
        ↓                        ↓
   Transform Data          Transform Data
        ↓                        ↓
   Deduplicate             Deduplicate
        ↓                        ↓
        └────────→ MERGE ←───────┘
                     ↓
            Cross-Source Deduplicate
                     ↓
              Continue Workflow
```

### **STEP 7: Connect to Existing Workshop Logic**

**Purpose**: Feed transformed jobs into existing Job Matching, Resume Generation, etc.

**Actions**:
1. Connect merged/deduplicated output to existing workshop nodes
2. Verify field names match expected schema
3. Test data flow through entire pipeline

---

## **🧪 TESTING AND VALIDATION**

### **Test 1: Small Batch Test (200 jobs)**

**Purpose**: Verify actor execution and data quality

**Steps**:
1. Set `limit: 200` in Apify node
2. Execute workflow manually
3. Check execution log for errors
4. Verify 200 jobs returned
5. Inspect sample job data (first 5 jobs)
6. Validate required fields are populated
7. Check application URLs are valid
8. Calculate actual cost (should be $0.24)

**Success Criteria**:
- ✅ Workflow executes without errors
- ✅ 200 jobs returned
- ✅ All required fields populated (>95%)
- ✅ Application URLs are valid (100%)
- ✅ Cost matches expected ($0.24)

### **Test 2: Data Quality Validation**

**Purpose**: Verify data accuracy and completeness

**Steps**:
1. Export 10 random jobs to CSV
2. Manually verify each job:
   - Click application URL (should load company career page)
   - Verify job title matches
   - Verify company name matches
   - Verify location matches
   - Check if job is still active
3. Calculate accuracy rate

**Success Criteria**:
- ✅ Application URLs work (100%)
- ✅ Job data is accurate (>90%)
- ✅ Jobs are still active (>80%)

### **Test 3: Deduplication Validation**

**Purpose**: Verify duplicate removal works correctly

**Steps**:
1. Run workflow with `limit: 500`
2. Count total jobs before deduplication
3. Count total jobs after deduplication
4. Manually check for obvious duplicates
5. Verify no false positives (unique jobs removed)

**Success Criteria**:
- ✅ Duplicates removed (>95%)
- ✅ No false positives (<5%)
- ✅ Deduplication key works correctly

### **Test 4: Integration Test (End-to-End)**

**Purpose**: Verify entire pipeline works with Career Site jobs

**Steps**:
1. Run workflow with `limit: 200`
2. Verify jobs flow through Job Matching
3. Verify jobs flow through Resume Generation
4. Verify jobs flow through Contact Enrichment
5. Check final output in Google Sheets
6. Verify no data loss

**Success Criteria**:
- ✅ Jobs flow through entire pipeline
- ✅ No errors in downstream nodes
- ✅ Data appears in Google Sheets
- ✅ No data loss (all fields preserved)

### **Test 5: Parallel Testing (LinkedIn vs. Career Site)**

**Purpose**: Compare job quality and application success rates

**Steps**:
1. Run LinkedIn workflow for 1 week
2. Run Career Site workflow for 1 week
3. Track metrics:
   - Total jobs discovered
   - Jobs matching criteria (after filtering)
   - Applications submitted
   - Interview requests received
   - Cost per job
   - Cost per interview
4. Compare results

**Success Criteria**:
- ✅ Career Site provides additional jobs (not in LinkedIn)
- ✅ Career Site jobs have lower competition
- ✅ Career Site jobs have higher response rate
- ✅ Career Site cost is competitive

---

## **🔍 TROUBLESHOOTING**

### **Issue 1: Actor Execution Timeout**

**Symptoms**: Workflow fails with timeout error

**Causes**:
- `limit` too high (>5000)
- `descriptionSearch` used without other filters
- Apify platform issues

**Solutions**:
1. Reduce `limit` to 1000 or less
2. Remove `descriptionSearch` or add `titleSearch`
3. Increase timeout in Apify node (max 900 seconds)
4. Check Apify status page

### **Issue 2: No Jobs Returned**

**Symptoms**: Actor succeeds but returns 0 jobs

**Causes**:
- Filters too restrictive
- No jobs match criteria
- Incorrect filter syntax

**Solutions**:
1. Remove filters one by one to identify issue
2. Check filter syntax (arrays, prefix matching)
3. Verify `titleSearch` uses correct format
4. Test with minimal filters first

### **Issue 3: Missing Fields in Output**

**Symptoms**: Required fields are null or missing

**Causes**:
- `includeAi: false` (AI fields missing)
- `includeLinkedIn: false` (LinkedIn fields missing)
- Job data incomplete in source

**Solutions**:
1. Set `includeAi: true` and `includeLinkedIn: true`
2. Check field availability in actor output
3. Add fallback logic in transformation code
4. Use alternative fields (e.g., `employment_type` vs. `ai_employment_type`)

### **Issue 4: Duplicate Jobs Not Removed**

**Symptoms**: Same job appears multiple times

**Causes**:
- Deduplication key incorrect
- Field names don't match
- Case sensitivity issues

**Solutions**:
1. Verify deduplication fields exist
2. Add `.toLowerCase().trim()` to deduplication key
3. Use code-based deduplication for more control
4. Check for null values in deduplication fields

### **Issue 5: High Cost**

**Symptoms**: Cost exceeds budget

**Causes**:
- `limit` too high
- Running too frequently
- Not using incremental API version

**Solutions**:
1. Reduce `limit` to minimum needed
2. Run less frequently (daily vs. hourly)
3. Switch to API version for incremental updates
4. Use more restrictive filters

---

## **📊 MONITORING AND OPTIMIZATION**

### **Metrics to Track**

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Jobs per Run** | 200-1000 | Count output items |
| **Cost per Run** | $0.24-$1.20 | Check Apify billing |
| **Execution Time** | <5 minutes | Check workflow execution log |
| **Success Rate** | 100% | Track failed runs |
| **Data Quality** | >90% | Manual validation |
| **Duplicate Rate** | <5% | Before/after deduplication count |
| **Application Success** | >10% | Track interview requests |

### **Optimization Tips**

1. **Reduce Cost**:
   - Use more restrictive filters
   - Reduce `limit` to minimum needed
   - Run less frequently
   - Switch to API version for incremental updates

2. **Improve Data Quality**:
   - Enable AI enrichment (`includeAi: true`)
   - Enable LinkedIn data (`includeLinkedIn: true`)
   - Use `aiHasSalary: true` for salary transparency
   - Filter by company size for better matches

3. **Increase Job Relevance**:
   - Use prefix matching for job titles
   - Add exclusion filters for unwanted terms
   - Filter by experience level
   - Filter by work arrangement (remote, hybrid, on-site)

4. **Speed Up Execution**:
   - Reduce `limit` to 500 or less
   - Avoid `descriptionSearch` (very intensive)
   - Use domain filters instead of organization search

---

## **📚 ADDITIONAL RESOURCES**

- **Actor Documentation**: https://apify.com/fantastic-jobs/career-site-job-listing-feed.md
- **Actor Console**: https://console.apify.com/actors/Dn2KJLnaNC5vFGkEw
- **Apify API Docs**: https://docs.apify.com/api/v2
- **N8N Apify Node Docs**: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.apify/
- **Evaluation Report**: `Career-Site-Job-Listing-Feed-Actor-Evaluation.md`

---

**Last Updated**: 2025-10-20  
**Version**: 1.0.0  
**Status**: ANALYSIS-ONLY (No implementation without approval)

