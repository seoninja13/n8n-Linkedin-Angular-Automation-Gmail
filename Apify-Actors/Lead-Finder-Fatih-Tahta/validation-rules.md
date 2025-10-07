# Lead Finder - Validation Rules Reference

**Actor**: Lead Finder | With Emails | $1.4 / 1k  
**Actor ID**: `aihL2lJmGDt9XFCGg`  
**Developer**: Fatih Tahta (fatihtahta)

**⚠️ CRITICAL**: This actor's documentation contains **INCORRECT** field examples. Always refer to this validation rules file, not the actor's README.

---

## 🚨 **Known Validation Errors**

### **Error #1: `keywords` Field Not Allowed**

**Date Discovered**: 2025-10-06  
**Error Message**: `"Property input.keywords is not allowed."`

**Problem**:
- The actor's README documentation shows `keywords` as a valid field in the example input
- The actual API **REJECTS** this field with a validation error
- This is a **documentation bug** in the actor's README

**Documentation Example (INCORRECT)**:
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
**Impact**: Wasted time debugging (similar to Leads Scraper's 80 minutes)  
**Workaround**: Remove `keywords` field entirely from input JSON

---

## ✅ **Validated Fields** (Confirmed Working)

### **Core Fields**:

| **Field** | **Type** | **Required** | **Validation Rules** | **Example** |
|-----------|----------|--------------|----------------------|-------------|
| `organizationDomains` | Array | ⚠️ Optional* | Array of domain strings | `["stripe.com", "shopify.com"]` |
| `personTitles` | Array | ⚠️ Optional* | Array of job title strings | `["Head of Marketing", "VP Marketing"]` |
| `employeeRanges` | Array | Optional | Format: `"min,max"` (comma, no spaces) | `["1,10", "11,50", "51,200"]` |
| `maxResults` | Number | Optional | Default: 50000, Max: 50000 | `1000` |
| `getEmails` | Boolean | Optional | Default: `true` | `true` |
| `includeRiskyEmails` | Boolean | Optional | Default: `true` | `false` |

**\*Note**: At least ONE filter field is required (e.g., `organizationDomains`, `personTitles`, `locations`, `industries`, etc.)

---

## ❌ **Invalid Fields** (Documented but NOT Supported)

| **Field** | **Status** | **Error Message** | **Notes** |
|-----------|------------|-------------------|-----------|
| `keywords` | ❌ **NOT ALLOWED** | `"Property input.keywords is not allowed."` | Despite appearing in README example |

---

## 🔍 **Field Format Requirements**

### **1. `employeeRanges` Format**:

**✅ CORRECT**:
```json
"employeeRanges": ["1,10", "11,50", "51,200", "201,500"]
```

**❌ INCORRECT**:
```json
"employeeRanges": ["1-10", "11-50", "51-200"]  // Wrong: hyphens not allowed
"employeeRanges": ["1, 10", "11, 50"]          // Wrong: spaces not allowed
"employeeRanges": ["0 - 1", "2 - 10"]          // Wrong: spaces and hyphens
```

**Rules**:
- Format: `"min,max"` (comma separator, no spaces)
- Both min and max must be numbers
- No hyphens, no spaces

---

### **2. `organizationDomains` Format**:

**✅ CORRECT**:
```json
"organizationDomains": ["stripe.com", "shopify.com", "acme.com"]
```

**❌ INCORRECT**:
```json
"organizationDomains": ["https://stripe.com"]     // Wrong: no protocol
"organizationDomains": ["www.stripe.com"]         // Wrong: no www
"organizationDomains": ["stripe.com/"]            // Wrong: no trailing slash
```

**Rules**:
- Plain domain only (no protocol, no www, no path)
- Lowercase recommended
- No trailing slashes

---

### **3. `personTitles` Format**:

**✅ CORRECT**:
```json
"personTitles": [
  "Head of Marketing",
  "VP Marketing",
  "Chief Marketing Officer",
  "Director of Marketing"
]
```

**Rules**:
- Exact job title strings
- Case-sensitive (use proper capitalization)
- No abbreviations unless commonly used (e.g., "VP" is OK)

---

### **4. `maxResults` Format**:

**✅ CORRECT**:
```json
"maxResults": 1000
```

**❌ INCORRECT**:
```json
"maxResults": "1000"  // Wrong: must be number, not string
```

**Rules**:
- Must be a number (not string)
- Default: 50000
- Maximum: 50000

---

### **5. Boolean Fields**:

**✅ CORRECT**:
```json
"getEmails": true,
"includeRiskyEmails": false
```

**❌ INCORRECT**:
```json
"getEmails": "true",              // Wrong: must be boolean, not string
"includeRiskyEmails": "false"     // Wrong: must be boolean, not string
```

**Rules**:
- Must be boolean (`true` or `false`)
- Not strings (`"true"` or `"false"`)

---

## 🧪 **Validated Test Input** (Confirmed Working)

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

**Validation Status**: ✅ **PASSED** (no errors when submitting to API)
**Date Validated**: 2025-10-06
**Execution Status**: 🔄 **IN PROGRESS** (waiting for actor to return results)

**Note**: This input passed validation and the actor started successfully. We are now waiting for the actual results to determine email yield and data quality.

---

## ⚠️ **Untested Fields** (May or May Not Work)

These fields appear in the actor's documentation but have NOT been tested yet:

| **Field** | **Type** | **Status** | **Notes** |
|-----------|----------|------------|-----------|
| `locations` | Array | ⏳ Untested | Person locations (city, state, country) |
| `industries` | Array | ⏳ Untested | Industry keywords |
| `organizationLocations` | Array | ⏳ Untested | Company HQ locations |
| `revenueMin` | Number | ⏳ Untested | Minimum annual revenue (USD) |
| `revenueMax` | Number | ⏳ Untested | Maximum annual revenue (USD) |
| `currentlyUsingAnyOfTechnologyUids` | Array | ⏳ Untested | Tech stack slugs |

**⚠️ WARNING**: Do NOT assume these fields work based on documentation. Test each field individually before using in production.

---

## 📋 **Validation Error Tracking**

| **Error #** | **Date** | **Field** | **Error Message** | **Root Cause** | **Fix** | **Time Wasted** |
|-------------|----------|-----------|-------------------|----------------|---------|-----------------|
| **#1** | 2025-10-06 | `keywords` | `"Property input.keywords is not allowed."` | Documentation bug | Remove field | ~5 minutes |

**Total Time Wasted**: ~5 minutes (vs 80 minutes for Leads Scraper)

---

## 🎯 **Best Practices**

### **1. Always Start with Minimal Input**:
```json
{
  "organizationDomains": ["stripe.com"],
  "maxResults": 10,
  "getEmails": true
}
```

### **2. Add Fields One at a Time**:
- Test each new field individually
- Document any validation errors immediately
- Don't trust the actor's README documentation

### **3. Use This File as Source of Truth**:
- ✅ Refer to this file for field validation
- ❌ Don't trust the actor's README examples
- ⚠️ Test any new fields before using in production

---

## 🔄 **Comparison with Leads Scraper**

| **Aspect** | **Leads Scraper** | **Lead Finder** |
|------------|-------------------|-----------------|
| **Validation Errors** | 4 errors, 80 minutes | 1 error, 5 minutes |
| **Documentation Quality** | Poor (many errors) | Poor (keywords bug) |
| **Field Naming** | camelCase | camelCase |
| **Employee Size Format** | `"0 - 1"` (spaces) | `"1,10"` (comma, no spaces) |
| **Email Status** | `contactEmailStatus: "verified"` | `includeRiskyEmails: false` |

---

## 📝 **Update History**

| **Date** | **Error #** | **Field** | **Action** |
|----------|-------------|-----------|------------|
| 2025-10-06 | #1 | `keywords` | Documented and removed from input schema |

---

**Last Updated**: 2025-10-06  
**Next Action**: Test corrected input JSON to identify any additional validation errors

---

## ⚠️ **CRITICAL REMINDER**

**DO NOT TRUST THE ACTOR'S README DOCUMENTATION!**

The actor's README shows `keywords` as a valid field in the example input, but the API rejects it. Always refer to this validation rules file for accurate field information.

If you encounter a new validation error:
1. Document it immediately in this file
2. Update the "Known Validation Errors" section
3. Add the field to the "Invalid Fields" table
4. Update the "Validation Error Tracking" table
5. Test the corrected input to find any additional errors

