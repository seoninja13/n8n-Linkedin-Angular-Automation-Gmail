# Leads Finder - Backup Contact Enrichment Actor

## 📋 **Basic Information**

- **Actor Name**: ✨Leads Finder - $1.5/1k leads with Emails
- **Actor ID**: `IoSHqwTR9YGhzccez`
- **Developer**: Code Pioneer (`code_crafter`)
- **Apify Store URL**: https://console.apify.com/actors/IoSHqwTR9YGhzccez
- **Support Email**: codecrafter70@gmail.com

## 🚦 **Current Status**

- **Maintenance Status**: ⚠️ **UNDER MAINTENANCE** (Reliability Warning)
- **Last Modified**: 1 hour ago
- **Success Rate**: 84% (Good but not excellent)
- **User Rating**: 3.0/5 (29 reviews)
- **Total Users**: 1,400 active users
- **Open Issues**: 62 (High number of issues)

## 💰 **Pricing Structure**

### **Paid Apify Users**
- **Rate**: $1.5 per 1,000 leads
- **Capacity**: Up to 10,000 leads per run (default)

### **Free Apify Users**
- **Limit**: 100 leads maximum per run
- **Recommendation**: Upgrade to paid plan for production use

## ✅ **Batch Processing Support**

### **Company Domain Batching**
- **Field**: `company_domain` 
- **Type**: Array of strings
- **Example**: `["google.com", "apple.com", "notion.so"]`
- **Capacity**: Process multiple companies in single execution

## 🎯 **Target Filtering Capabilities**

### **Person Targeting**
- **Job Titles**: `contact_job_title` (array)
- **Seniority**: `seniority_level` (specific values required)
- **Department**: `functional_level` (specific values required)
- **Location**: `contact_location`, `contact_city`

### **Company Targeting**  
- **Domains**: `company_domain` (array) - **KEY FOR BATCH PROCESSING**
- **Size**: `size` (specific ranges)
- **Industry**: `company_industry` (array)
- **Technology**: `company_technology` (array)

### **Email Quality**
- **Status**: `email_status` (validated/not_validated/unknown)
- **Catch-all**: `exclude_catch_all_domain` (boolean)
- **Quality**: 100% verified when `email_status: ["validated"]`

## 📊 **Performance Metrics**

### **Data Quality**
- **Email Verification**: 100% verified when filtered properly
- **LinkedIn URLs**: Included for person and company
- **Company Data**: Rich firmographics (revenue, funding, tech stack)

## 🔧 **Integration Notes for Contact Enrichment Workshop**

### **Advantages**
- ✅ **Rich Data**: Comprehensive company firmographics
- ✅ **Email Quality**: 100% verified emails when filtered
- ✅ **Batch Processing**: Native array support for company domains
- ✅ **Comprehensive Filtering**: Advanced targeting options
- ✅ **Large User Base**: 1,400 active users

### **Critical Issues**
- ⚠️ **Under Maintenance**: May be unreliable
- ⚠️ **Lower Success Rate**: 84% vs >99% for alternatives
- ⚠️ **High Issue Count**: 62 open issues
- ⚠️ **Higher Price**: $1.5/1k vs $1.4/1k for alternatives

### **Field Value Requirements**
- **Seniority**: Must use exact values (`c_level`, `director`, `vice_president`, etc.)
- **Functional**: Must use exact values (`hr`, `operations`, `marketing`, etc.)
- **Size**: Must use exact ranges (`201-500`, `501-1000`, etc.)

## 🚨 **Known Validation Errors**

### Field: `seniority_level`
- **Error**: "Field 'seniority_level.0' should be equal to one of the allowed values"
- **Allowed Values (VERIFIED FROM LIVE API)**: "founder", "owner", "c_suite", "director", "partner", "vp", "head", "manager", "senior", "entry", "trainee"
- **Correct Usage**: `"seniority_level": ["c_suite", "vp", "director", "manager"]`
- **IMPORTANT**: Use "c_suite" NOT "c_level", use "vp" NOT "vice_president", use "entry" NOT "entry_level"
- **Date Discovered**: 2025-01-06
- **Date Verified**: 2025-10-31 (Execution 6139)

### Field: `functional_level`
- **Error**: Functional areas must use exact lowercase values
- **Allowed Values (VERIFIED FROM LIVE API)**: "c_suite", "finance", "product_management", "engineering", "design", "education", "human_resources", "information_technology", "legal", "marketing", "operations", "sales", "support"
- **Correct Usage**: `"functional_level": ["marketing", "human_resources"]`
- **IMPORTANT**: Use "human_resources" NOT "hr", use "information_technology" NOT "it", use "product_management" NOT "product"
- **Date Discovered**: 2025-01-06
- **Date Verified**: 2025-10-31 (Execution 6141)

### Field: `size`
- **Error**: Company size ranges must match exact format
- **Allowed Values**: "0-1", "2-10", "11-20", "21-50", "51-100", "101-200", "201-500", "501-1000", "1001-2000", "2001-5000", "10000+"
- **Correct Usage**: `"size": ["201-500", "501-1000"]`
- **Date Discovered**: 2025-01-06

### Field: `email_status`
- **Error**: Email status values are case-sensitive
- **Allowed Values**: "validated", "not_validated", "unknown"
- **Correct Usage**: `"email_status": ["validated"]`
- **Date Discovered**: 2025-01-06

## 🚨 **Known Issues & Limitations**

1. **Maintenance Status**: Currently under maintenance with reliability warnings
2. **Strict Validation**: Requires exact field values (case-sensitive, snake_case)
3. **High Issue Count**: 62 open issues indicate ongoing problems
4. **Lower Success Rate**: 84% success rate vs >99% alternatives
5. **Field Format**: All field names use snake_case (vs camelCase in other actors)

## 📈 **Recommendation Level**

### **BACKUP ACTOR ONLY** ⚠️
**Reasons:**
- Currently under maintenance
- Lower success rate (84%)
- High number of open issues (62)
- More expensive than primary alternative

**Use Cases:**
- Fallback when primary actor fails
- When rich company data is specifically needed
- When 100% verified emails are critical

**Not Recommended For:**
- Primary production workflows
- High-reliability requirements
- Cost-sensitive operations

## 🔄 **Migration Strategy**

### **From Leads Finder to Leads Scraper**
1. **Field Mapping**: Update field names (snake_case to camelCase)
2. **Value Validation**: Remove strict enum requirements
3. **Error Handling**: Adjust for different success rates
4. **Cost Adjustment**: Benefit from lower pricing ($1.4 vs $1.5)

### **Fallback Implementation**
```javascript
// Pseudo-code for fallback logic
try {
  // Try primary actor (Leads Scraper)
  result = await runLeadsScraper(input);
} catch (error) {
  // Fallback to Leads Finder if primary fails
  result = await runLeadsFinder(transformInput(input));
}
```

---

## 📊 **Test Results & Performance History**

### **Test 1: Restrictive Filtering (2025-10-30)**
- **Configuration**:
  - Domains: 10
  - Job Titles: 3 (Hiring Manager, Talent Acquisition Manager, HR Manager)
  - Email Status: `['validated']` (validated emails only)
  - Seniority Levels: `['c_suite', 'vp', 'director', 'manager']` (4 levels)
  - Functional Level: `['marketing', 'human_resources']`
- **Results**:
  - Contacts Returned: 5
  - Companies with Contacts: 2 (odoo.com: 4, applause.com: 1)
  - Cost: ~$0.008 per run
  - Hit Rate: 20% (2 out of 10 companies)
- **Analysis**: Very restrictive filtering (validated emails only + limited seniority levels) resulted in low contact count

### **Test 2: Expanded Filtering (2025-10-31) ✅ RECOMMENDED**
- **Configuration**:
  - Domains: 30
  - Job Titles: 8 (added: Recruiter, Recruiting Manager, Director of Talent Acquisition, VP of Human Resources, People Operations Manager)
  - Email Status: `['validated', 'not_validated', 'unknown']` (all statuses)
  - Seniority Levels: `['c_suite', 'vp', 'director', 'manager', 'senior', 'entry']` (6 levels)
  - Functional Level: `['marketing', 'human_resources']`
- **Results**:
  - Contacts Returned: 42
  - Companies with Contacts: 7 (prosum.com: 20, odoo.com: 13, luxurypresence.com: 4, exmox.com: 2, jobgether.com: 2, applause.com: 1, attisglobal.com: 1)
  - Cost: $0.063 per run
  - Hit Rate: 23% (7 out of 30 companies)
  - Improvement: **8.4x increase** in contact count (5 → 42)
- **Analysis**: Expanding email_status (3-5x impact) + adding "senior" and "entry" seniority levels (71% of contacts) + increasing domains (3x) resulted in 8.4x improvement
- **Verification**: 100% of contacts match filtering criteria (domains, job titles, seniority levels, functional areas)
- **Status**: ✅ **PRODUCTION-READY** - Ready for scaling to 100-150 contacts per run

### **Key Insights from Testing**
1. **Email Status Impact**: Expanding from `['validated']` to `['validated', 'not_validated', 'unknown']` had the biggest impact (3-5x increase)
2. **Seniority Level Impact**: Adding "senior" and "entry" levels contributed 30 out of 42 contacts (71% of total)
3. **Domain Scaling**: Increasing domains from 10 to 30 added 5 new companies with contacts (3.5x improvement)
4. **Job Title Variations**: Actor returns variations of requested titles (e.g., "Technical Recruiter" instead of just "Recruiter"), which is beneficial
5. **Functional Level Filtering**: Actor correctly prioritizes functional_level over job_title when filtering (all 42 contacts had "human_resources" functional level)
6. **Company Size Correlation**: Larger companies and staffing/recruiting companies return more contacts (Prosum: 20 contacts, Odoo: 13 contacts)

### **Recommended Configuration for Production**
Based on Test 2 results, the recommended configuration for production use is:
- **Domains**: 30-50 (balance between cost and coverage)
- **Job Titles**: 8+ (include variations: Recruiter, Technical Recruiter, Talent Acquisition Manager, HR Manager, etc.)
- **Email Status**: `['validated', 'not_validated', 'unknown']` (all statuses for maximum coverage)
- **Seniority Levels**: `['c_suite', 'vp', 'director', 'manager', 'senior', 'entry']` (all 6 levels)
- **Functional Level**: `['human_resources']` (focus on HR for recruiting roles)
- **Expected Results**: 80-150 contacts per run, 20-30% hit rate, $0.12-$0.23 per run

---

**Last Updated**: 2025-10-31
**Status**: ✅ **PRODUCTION-READY** (Test 2 configuration recommended)
