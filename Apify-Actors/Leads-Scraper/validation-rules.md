# Leads Scraper - Field Validation Rules

**Actor ID**: `T1XDXDWc1L92AfIJtd`  
**Last Updated**: 2025-01-06

---

## 🚨 CRITICAL WARNING: This Actor's Validation is COMPLETELY UNRELIABLE

**⚠️ DO NOT TRUST THE ACTOR DOCUMENTATION OR THESE RULES WITHOUT TESTING!**

This actor has had **FOUR CONSECUTIVE VALIDATION ERRORS** where the actual validation rules differed from:
1. The actor's public documentation
2. Common sense formatting
3. Standard API conventions

**The ONLY reliable source of validation rules is the actual error messages from the actor itself.**

### Common Issues Found:
- Field values are case-sensitive
- Some fields require spaces, others don't (inconsistent)
- Some fields are strings, others are arrays (not documented)
- Allowed values differ from actor documentation
- Field names differ from what's documented

**ALWAYS test with a small dataset first and document actual validation errors!**

---

## 📋 Field Validation Reference

### 1. `seniority` (Array of Strings)

**Allowed Values** (13 total):
```json
[
  "Founder",
  "Chairman",
  "President",
  "CEO",
  "CXO",
  "Vice President",
  "Director",
  "Head",
  "Manager",
  "Senior",
  "Junior",
  "Entry Level",
  "Executive"
]
```

**Common Mistakes**:
- ❌ "Associate" (LinkedIn value, not valid)
- ❌ "Mid-Senior level" (LinkedIn value, not valid)
- ❌ "Entry level" (wrong capitalization, should be "Entry Level")
- ❌ "VP" (abbreviation not accepted, use "Vice President")

**Example Usage**:
```json
{
  "seniority": ["Vice President", "Director", "Head", "Manager"]
}
```

---

### 2. `functional` (Array of Strings)

**⚠️ CRITICAL: Actual validation differs from actor documentation!**

**Allowed Values** (37 total - from actual validation error):
```json
[
  "Admin", "Analytics", "Applications", "Cloud", "Compliance",
  "Controller", "Customer Service", "Cyber Security", "Data Engineering",
  "Devops", "Digital", "Distribution", "Engineering", "Finance",
  "Fraud", "Hiring", "HR", "Infrastructure", "Inside Sales", "IT",
  "Learning", "Legal", "Marketing", "Network Security", "Operations",
  "Product Management", "Product Security", "Production", "Purchase",
  "Research", "Risk", "Sales", "Security", "Support", "Testing", "Training"
]
```

**Common Mistakes**:
- ❌ "Human Resources" (NOT valid - use "HR" or "Hiring" instead!)
- ❌ "Management" (NOT valid - use "Operations" or "Admin")
- ❌ "Business Development" (NOT valid - use "Sales" or "Inside Sales")
- ❌ "Strategy" (NOT valid - use "Operations")
- ❌ "Public Relations" (NOT valid - use "Marketing")
- ❌ "Advertising" (NOT valid - use "Marketing")
- ❌ "Communications" (NOT valid - use "Marketing")
- ❌ "Customer Success" (NOT valid - use "Customer Service")

**Example Usage**:
```json
{
  "functional": ["HR", "Hiring", "Marketing", "Sales"]
}
```

---

### 3. `companyEmployeeSize` (Array of Strings)

**⚠️ CRITICAL: Spaces ARE REQUIRED (opposite of what we initially thought!)**

**Allowed Values** (9 total - from actual validation error):
```json
[
  "0 - 1",
  "2 - 10",
  "11 - 50",
  "51 - 200",
  "201 - 500",
  "501 - 1000",
  "1001 - 5000",
  "5001 - 10000",
  "10000+"
]
```

**Common Mistakes**:
- ❌ "1-10" (NO spaces - WRONG! Must use "2 - 10" with spaces)
- ❌ "201-500" (NO spaces - WRONG! Must use "201 - 500" with spaces)
- ❌ "1 - 10" (wrong range, use "0 - 1" or "2 - 10")
- ❌ "10,000+" (comma not allowed, use "10000+")

**Example Usage**:
```json
{
  "companyEmployeeSize": ["2 - 10", "11 - 50", "51 - 200", "201 - 500"]
}
```

---

### 4. `contactEmailStatus` (String - NOT Array!)

**⚠️ CRITICAL: This is a STRING, not an array! And "unknown" is WRONG!**

**Allowed Values** (3 total - from actual validation error):
```json
"verified"
"unverified"
"unavailable"
```

**Common Mistakes**:
- ❌ `["verified"]` (array format - WRONG! Must be string)
- ❌ "unknown" (NOT valid - use "unavailable")
- ❌ "Verified" (wrong capitalization, use lowercase "verified")
- ❌ "validated" (not a valid value, use "verified")

**Example Usage**:
```json
{
  "contactEmailStatus": "verified"
}
```

---

### 5. `personTitle` (Array of Strings)

**Validation**: Free-form text, no strict validation
**Recommendation**: Use specific job titles for better targeting

**Example Usage**:
```json
{
  "personTitle": [
    "Head of Talent",
    "VP People",
    "Director of Recruiting",
    "Marketing Manager",
    "Growth Marketing Manager"
  ]
}
```

---

### 6. `companyDomain` (Array of Strings)

**Validation**: Must be valid domain names (no http://, no www.)
**Format**: `domain.com` or `subdomain.domain.com`

**Common Mistakes**:
- ❌ "https://example.com" (no protocol)
- ❌ "www.example.com" (no www prefix)
- ✅ "example.com" (correct)
- ✅ "cloud.example.com" (subdomain is OK)

**Example Usage**:
```json
{
  "companyDomain": [
    "google.com",
    "stripe.com",
    "cloud.qencode.com"
  ]
}
```

---

### 7. `includeEmails` (Boolean)

**Allowed Values**: `true` or `false`
**Recommendation**: Always set to `true` for contact enrichment

**Example Usage**:
```json
{
  "includeEmails": true
}
```

---

### 8. `totalResults` (Number)

**Allowed Range**: 1 to 30,000
**Minimum Charge**: 100 leads (even if fewer results)
**Recommendation**: Set to 2x number of companies for even distribution

**Example Usage**:
```json
{
  "totalResults": 500
}
```

---

## 🔄 Quick Conversion Guide

### LinkedIn Seniority → Actor Seniority

| LinkedIn Value | Actor Value |
|----------------|-------------|
| "Associate" | "Senior" or "Junior" |
| "Mid-Senior level" | "Manager" or "Senior" |
| "Entry level" | "Entry Level" |
| "Director" | "Director" ✅ |
| "Executive" | "Executive" ✅ |

### LinkedIn Job Function → Actor Functional

| LinkedIn Value | Actor Value |
|----------------|-------------|
| "Human Resources" | "HR" or "Hiring" |
| "Hiring" | "Hiring" ✅ |
| "Business Development" | "Sales" or "Inside Sales" |
| "Strategy/Planning" | "Operations" |
| "Public Relations" | "Marketing" |
| "Advertising" | "Marketing" |
| "Communications" | "Marketing" |
| "Management" | "Operations" or "Admin" |
| "Customer Success" | "Customer Service" |
| "Marketing" | "Marketing" ✅ |
| "Sales" | "Sales" ✅ |

### Company Employee Count → Actor Size Range

**⚠️ SPACES ARE REQUIRED!**

| Employee Count | Actor Size Range |
|----------------|------------------|
| 1 employee | "0 - 1" |
| 2-10 employees | "2 - 10" |
| 11-50 employees | "11 - 50" |
| 51-200 employees | "51 - 200" |
| 201-500 employees | "201 - 500" |
| 501-1000 employees | "501 - 1000" |
| 1001-5000 employees | "1001 - 5000" |
| 5001-10000 employees | "5001 - 10000" |
| 10000+ employees | "10000+" |

---

## ✅ Complete Valid Example

```json
{
  "companyDomain": [
    "google.com",
    "stripe.com",
    "shopify.com"
  ],
  "companyEmployeeSize": [
    "201 - 500",
    "501 - 1000",
    "1001 - 5000"
  ],
  "contactEmailStatus": "verified",
  "functional": [
    "HR",
    "Hiring",
    "Marketing",
    "Sales"
  ],
  "includeEmails": true,
  "personTitle": [
    "Head of Talent",
    "VP People",
    "Marketing Manager",
    "Director of Recruiting"
  ],
  "seniority": [
    "Vice President",
    "Director",
    "Head",
    "Manager"
  ],
  "totalResults": 500
}
```

---

## 🚨 Validation Error Troubleshooting

### Error: "Field 'seniority.0' should be equal to one of the allowed values"
**Cause**: Using invalid seniority value  
**Fix**: Check seniority values against allowed list above

### Error: "Field 'functional.0' should be equal to one of the allowed values"
**Cause**: Using invalid functional area value  
**Fix**: Map LinkedIn job functions to actor functional values using conversion guide

### Error: "Field 'companyEmployeeSize.0' should be equal to one of the allowed values"
**Cause**: NOT using spaces in size ranges (e.g., "201-500")
**Fix**: ADD spaces (e.g., "201 - 500") - spaces are REQUIRED!

---

**Last Updated**: 2025-01-06

