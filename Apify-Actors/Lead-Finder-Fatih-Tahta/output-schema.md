# Lead Finder Output Schema

**Actor**: Lead Finder | With Emails | $1.4 / 1k  
**Actor ID**: `aihL2lJmGDt9XFCGg`  
**Developer**: Fatih Tahta (fatihtahta)

---

## 📦 **Output Structure**

Each saved item represents a **contact + organization** record with the following fields:

---

## 👤 **Contact Fields**

### **Basic Information**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `firstName` | String | Contact's first name | `"Victoria"` |
| `lastName` | String | Contact's last name | `"Smith"` |
| `fullName` | String | Contact's full name | `"Victoria Smith"` |
| `title` | String | Current job title | `"Head of Talent Management"` |
| `headline` | String | LinkedIn headline | `"Talent Leader at Stripe"` |

### **Contact Information**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `email` | String | Professional email address | `"smithvictoria@stripe.com"` |
| `emailStatus` | String | Email verification status | `"verified"` or `"risky"` |

### **Social Media**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `linkedinUrl` | String | LinkedIn profile URL | `"https://linkedin.com/in/victoria-m-smith"` |
| `photoUrl` | String | Profile photo URL | `"https://..."` |
| `twitterUrl` | String | Twitter profile URL | `"https://twitter.com/..."` |
| `githubUrl` | String | GitHub profile URL | `"https://github.com/..."` |
| `facebookUrl` | String | Facebook profile URL | `"https://facebook.com/..."` |

### **Location**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `city` | String | City | `"Toronto"` |
| `state` | String | State/Province | `"Ontario"` |
| `country` | String | Country | `"Canada"` |

### **Employment History**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `employmentHistory` | Array | Array of employment records | See below |

**Employment History Object**:
```json
{
  "organizationName": "Stripe",
  "title": "Head of Talent Management",
  "startDate": "2020-01-01",
  "endDate": null,
  "isCurrent": true
}
```

---

## 🏢 **Organization Fields**

### **Basic Information**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `organizationName` | String | Company name | `"Stripe"` |
| `organizationWebsite` | String | Company website | `"https://www.stripe.com/"` |
| `organizationLinkedinUrl` | String | Company LinkedIn URL | `"https://www.linkedin.com/company/2135371"` |
| `organizationFoundedYear` | Number | Year company was founded | `2010` |

### **Contact Information**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `organizationPhone` | String | Company phone number | `"+1-555-123-4567"` |

### **Company Details**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `organizationIndustries` | Array | Array of industry names | `["Technology", "Financial Services"]` |
| `organizationEmployeeCount` | Number | Number of employees | `5000` |
| `organizationRevenueRange` | String | Revenue range | `"$100M - $500M"` |
| `organizationAlexaRank` | Number | Alexa ranking | `1234` |
| `organizationTicker` | String | Stock ticker symbol | `"STRP"` |
| `organizationOwnership` | String | Ownership type | `"Private"` or `"Public"` |

### **Location**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `organizationCity` | String | Company HQ city | `"South San Francisco"` |
| `organizationState` | String | Company HQ state | `"California"` |
| `organizationCountry` | String | Company HQ country | `"United States"` |
| `organizationAddress` | String | Full address | `"510 Townsend St, San Francisco, CA 94103"` |

### **Social Media**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `organizationTwitterUrl` | String | Company Twitter URL | `"https://twitter.com/stripe"` |
| `organizationFacebookUrl` | String | Company Facebook URL | `"https://facebook.com/stripe"` |
| `organizationCrunchbaseUrl` | String | Crunchbase profile URL | `"https://crunchbase.com/organization/stripe"` |

### **Technologies**:
| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `organizationTechnologies` | Array | Array of technology names | `["Salesforce", "HubSpot", "Google Analytics"]` |

---

## 📋 **Complete Example Output**

```json
{
  "firstName": "Victoria",
  "lastName": "Smith",
  "fullName": "Victoria Smith",
  "title": "Head of Talent Management",
  "headline": "Talent Leader at Stripe",
  "email": "smithvictoria@stripe.com",
  "emailStatus": "verified",
  "linkedinUrl": "https://ca.linkedin.com/in/victoria-m-smith",
  "photoUrl": "https://media.licdn.com/dms/image/...",
  "twitterUrl": null,
  "githubUrl": null,
  "facebookUrl": null,
  "city": "Toronto",
  "state": "Ontario",
  "country": "Canada",
  "employmentHistory": [
    {
      "organizationName": "Stripe",
      "title": "Head of Talent Management",
      "startDate": "2020-01-01",
      "endDate": null,
      "isCurrent": true
    },
    {
      "organizationName": "Google",
      "title": "Senior Recruiter",
      "startDate": "2017-06-01",
      "endDate": "2019-12-31",
      "isCurrent": false
    }
  ],
  "organizationName": "Stripe",
  "organizationWebsite": "https://www.stripe.com/",
  "organizationLinkedinUrl": "https://www.linkedin.com/company/2135371",
  "organizationFoundedYear": 2010,
  "organizationPhone": "+1-888-926-2289",
  "organizationIndustries": [
    "Technology, Information and Internet",
    "Financial Services"
  ],
  "organizationEmployeeCount": 7000,
  "organizationRevenueRange": "$1B - $5B",
  "organizationAlexaRank": 1234,
  "organizationTicker": null,
  "organizationOwnership": "Private",
  "organizationCity": "South San Francisco",
  "organizationState": "California",
  "organizationCountry": "United States",
  "organizationAddress": "510 Townsend St, San Francisco, CA 94103",
  "organizationTwitterUrl": "https://twitter.com/stripe",
  "organizationFacebookUrl": "https://facebook.com/stripe",
  "organizationCrunchbaseUrl": "https://crunchbase.com/organization/stripe",
  "organizationTechnologies": [
    "Salesforce",
    "HubSpot",
    "Google Analytics",
    "Slack",
    "Zoom"
  ]
}
```

---

## 🔄 **Field Mapping to Contact Enrichment Workshop**

### **Required Workshop Fields**:

| **Workshop Field** | **Lead Finder Field** | **Transformation** |
|--------------------|-----------------------|--------------------|
| `contactId` | Generate UUID | New field |
| `firstName` | `firstName` | Direct mapping |
| `lastName` | `lastName` | Direct mapping |
| `fullName` | `fullName` | Direct mapping |
| `email` | `email` | Direct mapping |
| `emailStatus` | `emailStatus` | Direct mapping |
| `jobTitle` | `title` | Direct mapping |
| `linkedinUrl` | `linkedinUrl` | Direct mapping |
| `city` | `city` | Direct mapping |
| `state` | `state` | Direct mapping |
| `country` | `country` | Direct mapping |
| `companyName` | `organizationName` | Direct mapping |
| `companyWebsite` | `organizationWebsite` | Direct mapping |
| `companyLinkedin` | `organizationLinkedinUrl` | Direct mapping |
| `companySize` | `organizationEmployeeCount` | Convert to range string |
| `companyIndustry` | `organizationIndustries[0]` | Take first industry |
| `companyLocation` | Combine fields | `${organizationCity}, ${organizationState}, ${organizationCountry}` |
| `source` | Static value | `"Lead Finder (Fatih Tahta)"` |
| `enrichedAt` | Current timestamp | `new Date().toISOString()` |

---

## 📊 **Data Quality Indicators**

### **Email Status Values**:
- `"verified"` - Email has been verified and is deliverable
- `"risky"` - Email may be a catch-all domain (lower deliverability)
- `null` - No email found

### **Field Availability**:
- **Always Present**: `firstName`, `lastName`, `fullName`, `title`, `organizationName`
- **Usually Present**: `email`, `linkedinUrl`, `organizationWebsite`, `city`, `country`
- **Sometimes Present**: `emailStatus`, `organizationPhone`, `organizationIndustries`, `organizationEmployeeCount`
- **Rarely Present**: `organizationTechnologies`, `organizationRevenueRange`, `organizationTicker`

---

## 🎯 **Expected Data Quality**

### **Compared to Leads Scraper**:

| **Metric** | **Leads Scraper** | **Lead Finder** |
|------------|-------------------|-----------------|
| **Email Yield** | 12.5% | **Expected: >20%** |
| **Email Quality** | Mixed | **Verified + Status** |
| **Deduplication** | Manual | **Built-in** |
| **Company Fields** | 10 fields | **20+ fields** |
| **Social Media** | LinkedIn only | **LinkedIn, Twitter, GitHub, Facebook** |
| **Employment History** | No | **Yes (array)** |
| **Technologies** | No | **Yes (array)** |

---

**Last Updated**: 2025-10-06  
**Next Action**: Run test to validate output schema and data quality

