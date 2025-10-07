# Leads Scraper - Output Schema & Field Mapping

## 📤 **Raw Output Format**

Based on the actor documentation, each lead is returned in this format:

```json
{
  "personId": "3557430229683143330",
  "firstName": "Robert",
  "lastName": "Volfman", 
  "fullName": "Robert Volfman",
  "email": "robert@scalingwithacquisition.com",
  "position": "CEO",
  "city": "Dublin",
  "state": "",
  "country": "Ireland",
  "linkedinUrl": "https://ie.linkedin.com/in/robert-volfman",
  "seniority": ["Founder"],
  "organization": {
    "id": "3510420734641963245",
    "name": "Scaling With Acquisition",
    "website": "scalingwithacquisition.com",
    "linkedinUrl": "https://www.linkedin.com/company/101150972",
    "foundedYear": "2023",
    "industry": "Marketing Services",
    "size": "2 - 10",
    "description": "We help Coaches, Consultants, Agency Owners...",
    "specialities": null,
    "location": {
      "city": "Sandyford",
      "state": "",
      "country": "Ireland"
    }
  },
  "functional": [],
  "source": null
}
```

## 🔄 **Field Mapping for Contact Enrichment Workshop**

### **Required Transformations**

| **Leads Scraper Output** | **Contact Enrichment Expected** | **Transformation Logic** |
|--------------------------|----------------------------------|---------------------------|
| `firstName` | `firstName` | Direct mapping |
| `lastName` | `lastName` | Direct mapping |
| `email` | `email` | Direct mapping |
| `position` | `jobTitle` | **Field name change** |
| `organization.name` | `company` | **Nested field extraction** |
| `linkedinUrl` | `linkedinUrl` | Direct mapping |
| `organization.website` | `companyDomain` | **Nested field extraction** |
| `email` (presence) | `emailStatus` | **Derived field**: "Verified" if email exists |

### **Additional Available Fields**

| **Leads Scraper Field** | **Description** | **Use Case** |
|------------------------|-----------------|--------------|
| `personId` | Unique person identifier | Deduplication |
| `fullName` | Complete name | Display purposes |
| `city`, `state`, `country` | Person location | Geographic filtering |
| `seniority` | Seniority level array | Validation |
| `organization.id` | Company identifier | Company deduplication |
| `organization.linkedinUrl` | Company LinkedIn | Company research |
| `organization.foundedYear` | Company founding year | Company insights |
| `organization.industry` | Company industry | Industry analysis |
| `organization.size` | Employee count | Company sizing |
| `organization.description` | Company description | Context |
| `functional` | Functional areas | Department validation |

## 🔧 **N8N Code Node Transformation**

### **Output Formatting Logic**

```javascript
// Transform Leads Scraper output to Contact Enrichment format
const transformedContacts = items.map(lead => ({
  firstName: lead.firstName || '',
  lastName: lead.lastName || '', 
  email: lead.email || '',
  jobTitle: lead.position || '',
  company: lead.organization?.name || '',
  linkedinUrl: lead.linkedinUrl || '',
  emailStatus: lead.email ? 'Verified' : 'Not Available',
  companyDomain: lead.organization?.website || '',
  
  // Additional fields for enrichment
  personId: lead.personId,
  fullName: lead.fullName,
  seniority: lead.seniority || [],
  companySize: lead.organization?.size || '',
  companyIndustry: lead.organization?.industry || '',
  companyLinkedin: lead.organization?.linkedinUrl || '',
  personLocation: {
    city: lead.city || '',
    state: lead.state || '', 
    country: lead.country || ''
  },
  companyLocation: {
    city: lead.organization?.location?.city || '',
    state: lead.organization?.location?.state || '',
    country: lead.organization?.location?.country || ''
  }
}));

return transformedContacts.map(contact => ({ json: contact }));
```

## 📊 **Data Quality Expectations**

### **Email Availability**
- **Success Rate**: 65-70% of leads include email
- **Quality**: Emails are verified when available
- **Missing Emails**: ~30-35% of leads may not have email data

### **LinkedIn Coverage**
- **Person LinkedIn**: High availability (most leads include)
- **Company LinkedIn**: Good availability through organization object
- **URL Format**: Full LinkedIn profile URLs

### **Company Data Richness**
- **Basic Info**: Name, website, size always available
- **Extended Info**: Industry, description, founding year often available
- **Location**: Company headquarters location included

## ⚠️ **Important Considerations**

### **Data Completeness**
- Not all fields guaranteed for every lead
- Email availability varies (65-70% success rate)
- Some organization fields may be null/empty

### **Deduplication Strategy**
- Use `personId` for person-level deduplication
- Use `organization.id` for company-level deduplication  
- Fallback to `email` + `organization.website` combination

### **Error Handling**
- Check for null/undefined values in nested objects
- Provide fallback values for missing data
- Log missing critical fields (email, company name)

---

**Last Updated**: 2025-01-06  
**Integration Status**: Ready for Contact Enrichment Workshop
