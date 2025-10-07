# Leads Scraper Actor - Test Log

**Actor ID**: `T1XDXWc1L92AfIJtd`  
**Actor URL**: https://console.apify.com/actors/T1XDXDWc1L92AfIJtd

---

## 📊 Test Summary

| Test # | Date | Input Source | Companies | Email Yield | Status |
|--------|------|--------------|-----------|-------------|--------|
| 1 | 2025-01-06 | Manual (Tech Giants) | 5 | 1/8 (12.5%) | ⚠️ Low Yield |
| 2 | 2025-01-06 | Real Job Scrape | 8 | TBD | 🔄 In Progress |

---

## Test #1: Manual Test with Tech Giants

### **Test Configuration**
- **Date**: 2025-01-06
- **Run URL**: https://console.apify.com/actors/T1XDXDWc1L92AfIJtd/runs/Z8GnVaRW1D2SyDo0p#output
- **Input Type**: Manually created test data
- **Goal**: Validate actor functionality with well-known companies

### **Input Parameters**
```json
{
  "companyDomain": [
    "notion.so",
    "stripe.com",
    "shopify.com",
    "figma.com",
    "linear.app"
  ],
  "companyEmployeeSize": [
    "201 - 500",
    "501 - 1000",
    "1001 - 5000",
    "5001 - 10000"
  ],
  "emailStatus": "verified",
  "functional": [
    "HR",
    "Hiring"
  ],
  "includeEmails": true,
  "personTitle": [
    "Head of Talent",
    "VP People",
    "HR Manager",
    "Director of Recruiting",
    "Talent Acquisition Manager",
    "Chief People Officer",
    "Head of People",
    "VP Human Resources"
  ],
  "seniority": [
    "Vice President",
    "Director",
    "Head",
    "Manager"
  ],
  "totalResults": 1000
}
```

### **Results**
- **Total Results**: 8 contacts
- **Emails Found**: 1 email
- **Email Yield**: 12.5%
- **Status**: ⚠️ **INSUFFICIENT** - Need higher email yield

### **Analysis**
- ❌ Very low email enrichment rate (12.5% vs expected 65-70%)
- ⚠️ Possible causes:
  - Large tech companies may have better email privacy
  - HR/Talent roles may have lower email availability
  - Filters may be too restrictive
- 📋 **Action**: Test with real job data and broader functional areas

---

## Test #2: Real Job Data Test

### **Test Configuration**
- **Date**: 2025-01-06
- **Run URL**: TBD
- **Input Type**: Real LinkedIn job scrape data
- **Goal**: Test with actual job posting data to improve email yield

### **Input Source**
- **File**: `.augment/Sample Outputs/jobs-output.json`
- **Jobs**: 10 real job postings
- **Companies**: 8 unique companies (GaggleAMP appears 3x)

### **Company Details**
| Company | Domain | Employees | Industry |
|---------|--------|-----------|----------|
| Qencode | cloud.qencode.com | 14 | Video Tech |
| Owlet Baby Care | owletcare.com | 304 | Healthcare |
| GrowForce | growforce.agency | 12 | Digital Marketing |
| GaggleAMP | gaggleamp.com | 30 | SaaS/Marketing |
| Hungry Minds | howtorebuildcivilization.com | 36 | Publishing |
| Fête | fete.com | 1 | E-commerce/AI |
| Digitive | godigitive.com | 127 | IT Staffing |
| JRD Systems | jrdsi.com | 224 | IT Services |

### **Input Parameters**
**File**: `.augment/Sample Outputs/apify-actor-input.json`

```json
{
  "companyDomain": [
    "cloud.qencode.com",
    "owletcare.com",
    "growforce.agency",
    "gaggleamp.com",
    "howtorebuildcivilization.com",
    "fete.com",
    "godigitive.com",
    "jrdsi.com"
  ],
  "companyEmployeeSize": [
    "1 - 10",
    "11 - 50",
    "51 - 200",
    "201 - 500"
  ],
  "emailStatus": "verified",
  "functional": [
    "Marketing",
    "HR",
    "Hiring",
    "Business Development",
    "Strategy",
    "Sales",
    "Public Relations",
    "Advertising",
    "Communications"
  ],
  "includeEmails": true,
  "personTitle": [
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
  "seniority": [
    "Vice President",
    "Director",
    "Head",
    "Manager",
    "Senior",
    "Entry Level",
    "Executive"
  ],
  "totalResults": 1000
}
```

### **Key Differences from Test #1**
| Aspect | Test #1 | Test #2 |
|--------|---------|---------|
| **Companies** | 5 tech giants | 8 real companies (smaller) |
| **Employee Sizes** | 201-10,000 | 1-500 |
| **Functional Areas** | HR/Hiring only | Marketing + HR (9 areas) |
| **Job Titles** | 8 HR titles | 18 Marketing + HR titles |
| **Data Source** | Manual | Real job scrape |

### **Expected Improvements**
1. ✅ **Broader Functional Areas**: Marketing roles may have higher email availability
2. ✅ **Smaller Companies**: Less email privacy restrictions
3. ✅ **Real Data**: Actual companies hiring = higher contact availability
4. ✅ **More Job Titles**: Wider net for contact discovery

### **Results**
- **Status**: 🔄 **PENDING** - Test in progress
- **Total Results**: TBD
- **Emails Found**: TBD
- **Email Yield**: TBD

### **Next Steps**
1. Run actor with updated input file
2. Compare email yield to Test #1
3. If yield improves: Scale to larger dataset (50-100 jobs)
4. If yield doesn't improve: Investigate actor configuration or try alternative actors

---

## 🚨 Validation Errors Encountered

### Error #1: Invalid Seniority Values (2025-01-06)
**Error Message**:
```
Field "seniority.0" should be equal to one of the allowed values:
"Founder", "Chairman", "President", "CEO", "CXO", "Vice President",
"Director", "Head", "Manager", "Senior", "Junior", "Entry Level", "Executive"
```

**Root Cause**: Used LinkedIn seniority values instead of actor-specific values
- ❌ Wrong: "Associate", "Mid-Senior level", "Entry level"
- ✅ Correct: "Senior", "Entry Level", "Executive"

**Fix Applied**: Updated `.augment/Sample Outputs/apify-actor-input.json` with correct values

**Documentation Updated**: Added validation rules to `actor-info.md` line 234-257

---

### Error #2: Invalid Functional Values (2025-01-06) ⚠️ CRITICAL DISCOVERY
**Error Message**:
```
Field "functional.1" should be equal to one of the allowed values:
"Admin", "Analytics", "Applications", "Cloud", "Compliance", "Controller",
"Customer Service", "Cyber Security", "Data Engineering", "Devops", "Digital",
"Distribution", "Engineering", "Finance", "Fraud", "Hiring", "HR",
"Infrastructure", "Inside Sales", "IT", "Learning", "Legal", "Marketing",
"Network Security", "Operations", "Product Management", "Product Security",
"Production", "Purchase", "Research", "Risk", "Sales", "Security", "Support",
"Testing", "Training"
```

**Root Cause**: **ACTOR DOCUMENTATION WAS INCORRECT!**
- The actor's public documentation listed different allowed values than actual validation
- Documentation said: "Human Resources", "Management", "Customer Success"
- Actual validation requires: "HR", "Hiring", "Operations", "Customer Service"

**Wrong Values Used**:
- ❌ "Human Resources" (NOT valid - must use "HR" or "Hiring")
- ❌ "Management" (NOT valid - must use "Operations" or "Admin")

**Fix Applied**:
- Updated `.augment/Sample Outputs/apify-actor-input.json`: `["Marketing", "HR", "Hiring", "Sales"]`
- Updated `validation-rules.md` with actual 37 allowed values from validation error
- Added warning about documentation discrepancy

**Documentation Updated**:
- `validation-rules.md` - Complete rewrite of functional field section
- `test-log.md` - Added this error documentation
- Added conversion guide for common mistakes

**Lesson Learned**:
- ⚠️ **ALWAYS test with actual actor first** - documentation may be outdated
- ⚠️ **Trust validation errors over documentation** - they show actual requirements
- ⚠️ **Document actual validation rules** from error messages, not from actor docs

---

### Error #3: Invalid Employee Size Format (2025-01-06) ⚠️ ANOTHER CRITICAL DISCOVERY
**Error Message**:
```
Field "companyEmployeeSize.0" should be equal to one of the allowed values:
"0 - 1", "2 - 10", "11 - 50", "51 - 200", "201 - 500", "501 - 1000",
"1001 - 5000", "5001 - 10000", "10000+"
```

**Root Cause**: **SPACES ARE REQUIRED (opposite of initial assumption!)**
- We initially removed spaces thinking they caused errors
- Actual validation REQUIRES spaces in the format
- Also discovered "0 - 1" and "2 - 10" ranges (not "1-10")

**Wrong Values Used**:
- ❌ "1-10" (NO spaces - must use "2 - 10" WITH spaces)
- ❌ "11-50" (NO spaces - must use "11 - 50" WITH spaces)
- ❌ "51-200" (NO spaces - must use "51 - 200" WITH spaces)
- ❌ "201-500" (NO spaces - must use "201 - 500" WITH spaces)

**Fix Applied**:
- Updated `.augment/Sample Outputs/apify-actor-input.json`: `["0 - 1", "2 - 10", "11 - 50", "51 - 200", "201 - 500"]`
- Updated `validation-rules.md` with correct format (spaces required)
- Updated all examples to use spaces

**Documentation Updated**:
- `validation-rules.md` - Complete rewrite of companyEmployeeSize section
- `test-log.md` - Added this error documentation
- `actor-info.md` - Updated with correct format

**Lesson Learned**:
- ⚠️ **Don't assume format rules** - test each field individually
- ⚠️ **Validation rules can be inconsistent** - some fields need spaces, others don't
- ⚠️ **Always copy exact format from error messages** - don't try to "fix" the format

---

### Error #4: Invalid Email Status Field Format (2025-01-06) 🤦 FOURTH ERROR IN A ROW!
**Error Message**:
```
Field "contactEmailStatus" should be equal to one of the allowed values:
"verified", "unverified", "unavailable"
```

**Root Cause**: **FIELD IS A STRING, NOT AN ARRAY! And "unknown" is WRONG!**
- We used array format `["verified"]` based on other fields being arrays
- Actual validation requires STRING format `"verified"`
- Documentation said "unknown" is valid, but actual validation requires "unavailable"

**Wrong Values Used**:
- ❌ `["verified"]` (array format - must be STRING)
- ❌ "unknown" (NOT valid - must use "unavailable")

**Fix Applied**:
- Updated `.augment/Sample Outputs/apify-actor-input.json`: `"contactEmailStatus": "verified"` (string, not array)
- Updated `validation-rules.md` with correct format (string) and values ("unavailable" not "unknown")
- Updated all examples to use string format

**Documentation Updated**:
- `validation-rules.md` - Complete rewrite of contactEmailStatus section
- `test-log.md` - Added this error documentation
- `actor-info.md` - Updated with correct format and values
- Added CRITICAL WARNING about actor's unreliable validation

**Lesson Learned**:
- ⚠️ **This actor's validation is COMPLETELY UNRELIABLE**
- ⚠️ **FOUR consecutive validation errors** - documentation is useless
- ⚠️ **ALWAYS test with small dataset first** - expect validation errors
- ⚠️ **Document EVERY actual validation error** - don't trust any documentation

---

## 📝 Lessons Learned

### 1. Field Validation is Strict
- All field values are **case-sensitive**
- Must match **exact allowed values** from actor documentation
- Common mistake: Using LinkedIn field values instead of actor-specific values

### 2. Email Yield Varies by Company Type
- Large tech companies: Lower email availability
- Smaller companies: Potentially higher email availability
- Functional area matters: Marketing vs HR roles

### 3. Input File Management
- Store test inputs in `.augment/Sample Outputs/` for easy reference
- Document the source of test data (manual vs real scrape)
- Track which input file was used for each test run

---

## 🔄 Future Tests

### Test #3: Large Dataset (Planned)
- **Input**: 50-100 real job postings
- **Goal**: Validate scalability and cost efficiency
- **Trigger**: If Test #2 shows improved email yield

### Test #4: Alternative Actor Comparison (Planned)
- **Actors**: Leads Scraper vs Leads Finder
- **Goal**: Compare email yield and cost
- **Trigger**: If Test #2 doesn't improve email yield

---

**Last Updated**: 2025-01-06

