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
- **Allowed Values**: "founder", "owner", "c_level", "director", "partner", "vice_president", "head", "manager", "senior", "entry_level", "trainee"
- **Correct Usage**: `"seniority_level": ["c_level", "director", "vice_president"]`
- **Date Discovered**: 2025-01-06

### Field: `functional_level`
- **Error**: Functional areas must use exact lowercase values
- **Allowed Values**: "c_level", "finance", "product", "engineering", "design", "hr", "it", "legal", "marketing", "operations", "sales", "support"
- **Correct Usage**: `"functional_level": ["hr", "operations"]`
- **Date Discovered**: 2025-01-06

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

**Last Updated**: 2025-01-06  
**Status**: ⚠️ **BACKUP ONLY - NOT RECOMMENDED FOR PRIMARY USE**
