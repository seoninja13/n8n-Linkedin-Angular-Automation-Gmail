# Leads Finder - Output Schema & Field Mapping

## 📤 **Raw Output Format**

Based on the actor documentation, each lead is returned in this format:

```json
{
  "first_name": "Sarah",
  "last_name": "Johnson", 
  "full_name": "Sarah Johnson",
  "email": "sarah.johnson@notion.so",
  "job_title": "Head of Talent",
  "headline": "Head of Talent at Notion",
  "functional_level": "hr",
  "seniority_level": "head",
  "linkedin": "https://linkedin.com/in/sarah-johnson",
  "city": "San Francisco",
  "state": "California", 
  "country": "United States",
  "company_name": "Notion",
  "company_domain": "notion.so",
  "company_website": "https://notion.so",
  "company_linkedin": "https://linkedin.com/company/notion",
  "company_linkedin_uid": "123456789",
  "company_size": "501-1000",
  "industry": "Computer Software",
  "company_description": "Notion is a productivity platform...",
  "company_annual_revenue": "$50M-$100M",
  "company_annual_revenue_clean": 75000000,
  "company_total_funding": "$275M",
  "company_total_funding_clean": 275000000,
  "company_founded_year": "2016",
  "company_phone": "+1-555-0123",
  "company_street_address": "123 Main St",
  "company_city": "San Francisco",
  "company_state": "California",
  "company_country": "United States",
  "company_postal_code": "94105",
  "company_full_address": "123 Main St, San Francisco, CA 94105",
  "keywords": ["productivity", "collaboration"],
  "company_technologies": ["React", "Node.js", "AWS"]
}
```

## 🔄 **Field Mapping for Contact Enrichment Workshop**

### **Required Transformations**

| **Leads Finder Output** | **Contact Enrichment Expected** | **Transformation Logic** |
|-------------------------|----------------------------------|---------------------------|
| `first_name` | `firstName` | **snake_case to camelCase** |
| `last_name` | `lastName` | **snake_case to camelCase** |
| `email` | `email` | Direct mapping |
| `job_title` | `jobTitle` | **snake_case to camelCase** |
| `company_name` | `company` | **Field name change** |
| `linkedin` | `linkedinUrl` | **Field name change** |
| `company_domain` | `companyDomain` | **snake_case to camelCase** |
| `email` (presence) | `emailStatus` | **Always "Verified"** (when filtered) |

### **Additional Available Fields**

| **Leads Finder Field** | **Description** | **Use Case** |
|-----------------------|-----------------|--------------|
| `full_name` | Complete name | Display purposes |
| `headline` | Professional headline | Context |
| `functional_level` | Department | Validation |
| `seniority_level` | Seniority level | Validation |
| `city`, `state`, `country` | Person location | Geographic analysis |
| `company_website` | Company website URL | Company research |
| `company_linkedin` | Company LinkedIn URL | Company research |
| `company_size` | Employee count range | Company sizing |
| `industry` | Company industry | Industry analysis |
| `company_description` | Company description | Context |
| `company_annual_revenue` | Revenue information | Company insights |
| `company_total_funding` | Funding information | Company insights |
| `company_founded_year` | Founding year | Company age |
| `company_technologies` | Tech stack | Technology analysis |

## 🔧 **N8N Code Node Transformation**

### **Output Formatting Logic**

```javascript
// Transform Leads Finder output to Contact Enrichment format
const transformedContacts = items.map(lead => ({
  firstName: lead.first_name || '',
  lastName: lead.last_name || '', 
  email: lead.email || '',
  jobTitle: lead.job_title || '',
  company: lead.company_name || '',
  linkedinUrl: lead.linkedin || '',
  emailStatus: 'Verified', // Always verified when email_status filtered
  companyDomain: lead.company_domain || '',
  
  // Additional enrichment fields
  fullName: lead.full_name || '',
  headline: lead.headline || '',
  functionalLevel: lead.functional_level || '',
  seniorityLevel: lead.seniority_level || '',
  
  // Location data
  personLocation: {
    city: lead.city || '',
    state: lead.state || '', 
    country: lead.country || ''
  },
  
  // Rich company data
  companyWebsite: lead.company_website || '',
  companyLinkedin: lead.company_linkedin || '',
  companySize: lead.company_size || '',
  industry: lead.industry || '',
  companyDescription: lead.company_description || '',
  companyRevenue: lead.company_annual_revenue || '',
  companyFunding: lead.company_total_funding || '',
  companyFounded: lead.company_founded_year || '',
  companyTechnologies: lead.company_technologies || [],
  
  // Company location
  companyLocation: {
    street: lead.company_street_address || '',
    city: lead.company_city || '',
    state: lead.company_state || '',
    country: lead.company_country || '',
    postalCode: lead.company_postal_code || '',
    fullAddress: lead.company_full_address || ''
  }
}));

return transformedContacts.map(contact => ({ json: contact }));
```

## 📊 **Data Quality Expectations**

### **Email Quality**
- **Success Rate**: 100% verified when `email_status: ["validated"]` filter used
- **Quality**: All emails are verified and deliverable
- **Catch-all Filtering**: Can exclude catch-all domains for better deliverability

### **LinkedIn Coverage**
- **Person LinkedIn**: High availability (most leads include)
- **Company LinkedIn**: Excellent availability with company UID
- **URL Format**: Full LinkedIn profile URLs

### **Company Data Richness**
- **Basic Info**: Name, domain, website, size always available
- **Financial Data**: Revenue and funding information often available
- **Technology Stack**: Company technologies and tools used
- **Location**: Complete company address information

## ⚠️ **Important Considerations**

### **Field Validation Requirements**
- **Seniority Values**: Must use exact lowercase with underscores
  - `c_level`, `director`, `vice_president`, `head`, `manager`
- **Functional Values**: Must use exact lowercase values
  - `hr`, `operations`, `marketing`, `sales`, `engineering`
- **Size Values**: Must use exact range format
  - `201-500`, `501-1000`, `1001-2000`, `2001-5000`

### **Maintenance Status Impact**
- **Reliability**: Currently under maintenance (may fail)
- **Data Consistency**: May have intermittent issues
- **Response Time**: May be slower than normal

### **Error Handling**
- **Validation Errors**: Strict field value requirements
- **Maintenance Failures**: Actor may be temporarily unavailable
- **Rate Limiting**: May have capacity restrictions during maintenance

---

**Last Updated**: 2025-01-06  
**Integration Status**: Available as backup only (maintenance issues)
