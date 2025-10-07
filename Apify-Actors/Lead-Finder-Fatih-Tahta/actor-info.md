# Lead Finder | With Emails | $1.4 / 1k - Actor Information

**🏆 PRIMARY ACTOR** (Recommended as of 2025-10-06)

---

## 📋 **Basic Information**

| **Field** | **Value** |
|-----------|-----------|
| **Actor Name** | Lead Finder \| With Emails \| $1.4 / 1k |
| **Actor ID** | `aihL2lJmGDt9XFCGg` |
| **Developer** | Fatih Tahta (fatihtahta) |
| **Slug** | `fatihtahta/lead-finder-with-emails-scraper` |
| **Status** | ✅ **ACTIVE** |
| **Rating** | 3.3/5 (4 reviews) |
| **Pricing** | **$1.39 - $1.99 per 1,000 contacts** (average $1.4/1k) |
| **Success Rate** | 91% |
| **Open Issues** | **0** (excellent!) |
| **Total Users** | 48 |
| **Monthly Active Users** | 48 |
| **Builds** | 36 (active development) |
| **Created** | September 2025 |
| **Last Modified** | 6 hours ago (as of 2025-10-06) |
| **Issue Response Time** | 0.79 hours (very fast!) |

---

## 🎯 **Why This Is Our Primary Actor**

### **Advantages Over Leads Scraper**:
1. ✅ **Zero open issues** (vs 1 for Leads Scraper)
2. ✅ **Better rating** (3.3/5 vs 3.0/5)
3. ✅ **Active development** (36 builds vs 24)
4. ✅ **Fast support** (0.79 hours vs unknown)
5. ✅ **Built-in deduplication** (saves processing time)
6. ✅ **Verified emails** (higher quality)
7. ✅ **Rich company context** (more data fields)
8. ✅ **Same pricing** ($1.4/1k)

### **Expected Improvements**:
- **Higher email yield** (target: >12.5% from Leads Scraper)
- **More reliable results** (91% success rate)
- **Better data quality** (verified emails, deduplication)
- **Faster support** (0.79 hours response time)

---

## 🚀 **Key Features**

### **Targeted Lead Discovery**:
- Filter by job title, seniority, location, industry, headcount, technologies
- Broad keyword search support
- Company domain-based filtering

### **Professional Email Enrichment**:
- Automatically reveals professional emails when available
- Email status included (verified/risky)
- Control over risky email inclusion

### **Company Context**:
- Company name, website, LinkedIn
- Founding year, phone, industries, headcount
- Social media profiles, technologies used
- Revenue range, ticker, ownership

### **Quality-First Output**:
- **Deduplicated** results (no duplicate contacts)
- Normalized data (ready for CRMs)
- Multiple export formats (JSON, CSV, Excel, HTML)

---

## 📥 **Input Schema**

### **Field Mapping** (from Leads Scraper to Lead Finder):

| **Leads Scraper Field** | **Lead Finder Field** | **Format** | **Notes** |
|-------------------------|----------------------|------------|-----------|
| `companyDomain` | `organizationDomains` | Array of strings | Same values |
| `personTitle` | `personTitles` | Array of strings | Same values |
| `companyEmployeeSize` | `employeeRanges` | Array of strings | Format: `"201,500"` (comma, no spaces) |
| `totalResults` | `maxResults` | Number | Same value |
| `includeEmails` | `getEmails` | Boolean | Same value |
| `contactEmailStatus` | `includeRiskyEmails` | Boolean | `verified` → `false`, `all` → `true` |
| `functional` | ❌ **NOT SUPPORTED** | N/A | `keywords` field is **REJECTED** by API (documentation bug) |
| `seniority` | N/A | N/A | Not directly supported (use `personTitles` instead) |

### **Additional Fields** (not in Leads Scraper):

| **Field** | **Type** | **Description** | **Example** |
|-----------|----------|-----------------|-------------|
| `keywords` | String | Broad text filter (company, industry, location) | `"fintech, payments"` |
| `locations` | Array | Where people live (city, state, country) | `["United States", "United Kingdom"]` |
| `industries` | Array | Industry keywords | `["Financial Services", "Payments"]` |
| `organizationLocations` | Array | Company HQ locations | `["San Francisco", "London"]` |
| `revenueMin` | Number | Minimum annual revenue (USD) | `20000000` |
| `revenueMax` | Number | Maximum annual revenue (USD) | `500000000` |
| `currentlyUsingAnyOfTechnologyUids` | Array | Tech stack slugs | `["salesforce", "hubspot"]` |

---

## 📤 **Output Schema**

### **Contact Fields**:
- `firstName`, `lastName`, `fullName`
- `title`, `headline`
- `email`, `emailStatus` (verified/risky)
- `linkedinUrl`, `photoUrl`
- `twitterUrl`, `githubUrl`, `facebookUrl`
- `city`, `state`, `country`
- `employmentHistory` (array of employment records)

### **Organization Fields**:
- `organizationName`, `organizationWebsite`, `organizationLinkedinUrl`
- `organizationFoundedYear`
- `organizationPhone`, `organizationIndustries[]`, `organizationEmployeeCount`
- `organizationRevenueRange`, `organizationAlexaRank`, `organizationTicker`
- `organizationOwnership`, `organizationCity`, `organizationState`, `organizationCountry`
- `organizationAddress`, `organizationTwitterUrl`, `organizationFacebookUrl`
- `organizationCrunchbaseUrl`, `organizationTechnologies[]`

---

## 🧪 **Test Input JSON** (✅ Validated)

```json
{
  "organizationDomains": [
    "cloud.qencode.com",
    "owletcare.com",
    "growforce.agency",
    "gaggleamp.com",
    "howtorebuildcivilization.com",
    "fete.com",
    "godigitive.com",
    "jrdsi.com"
  ],
  "personTitles": [
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
  ],
  "employeeRanges": [
    "1,10",
    "11,50",
    "51,200",
    "201,500"
  ],
  "maxResults": 1000,
  "getEmails": true,
  "includeRiskyEmails": false
}
```

**Notes**:
- ✅ **Validated**: This input passed validation (after removing `keywords` field)
- `includeRiskyEmails: false` - Only verified emails (higher quality, lower yield)
- `employeeRanges` - Format is `"min,max"` with comma, no spaces
- ❌ **`keywords` field removed** - API rejects this field despite documentation showing it
- `maxResults: 1000` - Limit to 1,000 contacts for testing

---

## 📊 **Expected Test Results**

### **Comparison with Leads Scraper**:

| **Metric** | **Leads Scraper** | **Lead Finder (Expected)** |
|------------|-------------------|----------------------------|
| **Email Yield** | 12.5% (1/8) | **>20%** (target) |
| **Success Rate** | 33% (1/3 runs) | **91%** (documented) |
| **Data Quality** | Mixed | **Verified + Deduplicated** |
| **Company Context** | Basic | **Rich (20+ fields)** |
| **Support Response** | Unknown | **0.79 hours** |
| **Open Issues** | 1 | **0** |

---

## 🚨 **Known Validation Errors**

### **⚠️ CRITICAL: Documentation-Implementation Mismatch**

The actor's README documentation contains **INCORRECT** field examples. Always refer to `validation-rules.md`, not the actor's README.

### **Error #1: `keywords` Field Not Allowed**

**Date Discovered**: 2025-10-06
**Error Message**: `"Property input.keywords is not allowed."`

**Problem**:
- The actor's README shows `keywords` as a valid field in the example input
- The actual API **REJECTS** this field with a validation error
- This is a **documentation bug** in the actor's README

**Incorrect Documentation Example**:
```json
{
  "keywords": "fintech, payments",  // ❌ NOT ALLOWED!
  "organizationDomains": ["acme.com"]
}
```

**Correct Usage**:
```json
{
  "organizationDomains": ["acme.com"]  // ✅ CORRECT - No keywords field
}
```

**Root Cause**: Documentation-implementation mismatch
**Impact**: Wasted ~5 minutes debugging (vs 80 minutes for Leads Scraper)
**Fix**: Remove `keywords` field entirely from input JSON
**Status**: ✅ Fixed in `input-schema.json`

### **Validation Error Summary**:

| **Error #** | **Date** | **Field** | **Error Message** | **Status** |
|-------------|----------|-----------|-------------------|------------|
| **#1** | 2025-10-06 | `keywords` | `"Property input.keywords is not allowed."` | ✅ Fixed |

**Total Time Wasted**: ~5 minutes (much better than Leads Scraper's 80 minutes!)

---

## ⚠️ **Known Limitations**

1. **No Direct Seniority Filter**: Must use `personTitles` to filter by seniority
2. **Pricing Range**: $1.39-$1.99 per 1k (varies by data source)
3. **Risky Emails**: Setting `includeRiskyEmails: false` may reduce yield but improves quality
4. **Documentation Unreliable**: Actor's README contains incorrect field examples - always use `validation-rules.md`

---

## 🔄 **Test Status**

| **Test #** | **Date** | **Status** | **Results** | **Email Yield** | **Cost** | **Notes** |
|------------|----------|------------|-------------|-----------------|----------|-----------|
| #1 | 2025-10-06 | ❌ Failed | Validation Error | N/A | $0.00 | `keywords` field rejected by API |
| #2 | 2025-10-06 | ✅ **COMPLETE** | **15 contacts** | **66.7%** (10/15) | ~$0.01 | **EXCELLENT!** 433% better than Leads Scraper |

**Final Status**:
- ✅ **Validation**: Input JSON accepted by API (no errors)
- ✅ **Execution**: Actor completed successfully
- ✅ **Data Analysis**: **COMPLETE** - 66.7% email yield (10 verified emails)
- ✅ **Recommendation**: **KEEP AS PRIMARY ACTOR** (433% better than Leads Scraper)

---

## 📝 **Integration Notes**

### **For Contact Enrichment Workshop**:
1. **Input Builder**: Convert `companyDomain` array to `organizationDomains`
2. **Field Mapping**: Map `companyEmployeeSize` to `employeeRanges` (format: `"min,max"`)
3. **Keywords**: Combine `functional` array into comma-separated string
4. **Email Quality**: Set `includeRiskyEmails: false` for verified emails only
5. **Output Parsing**: Map output fields to workshop schema

### **Batch Processing**:
- **Max Results**: 50,000 per run (vs 30,000 for Leads Scraper)
- **Recommended Batch Size**: 10-20 company domains per run
- **Expected Contacts**: 10-50 per company (depending on filters)

---

## 🔗 **Links**

- **Actor Page**: https://console.apify.com/actors/aihL2lJmGDt9XFCGg
- **Input Page**: https://console.apify.com/actors/aihL2lJmGDt9XFCGg/input
- **Documentation**: https://console.apify.com/actors/aihL2lJmGDt9XFCGg/information/latest/readme
- **Reviews**: https://console.apify.com/actors/aihL2lJmGDt9XFCGg/reviews

---

**Last Updated**: 2025-10-06  
**Next Action**: Run Test #1 with 8 company domains to confirm email yield > 12.5%

