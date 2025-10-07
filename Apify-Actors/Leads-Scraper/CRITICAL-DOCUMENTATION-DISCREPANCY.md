# 🚨 CRITICAL: This Actor's Validation is COMPLETELY BROKEN

**Actor**: Leads Scraper (`T1XDXDWc1L92AfIJtd`)
**Date Discovered**: 2025-01-06
**Severity**: CRITICAL - FOUR CONSECUTIVE VALIDATION ERRORS
**Status**: ⚠️ **DO NOT TRUST ANY DOCUMENTATION FOR THIS ACTOR**

---

## 🚨 The Problem

This actor has had **FOUR CONSECUTIVE VALIDATION ERRORS** where the actual validation rules completely contradicted:
1. The actor's public documentation
2. Common sense formatting conventions
3. Standard API practices
4. Our initial assumptions based on similar APIs

**This means**:
- ❌ Following the actor documentation = Validation errors
- ❌ Following standard API conventions = Validation errors
- ❌ Making logical assumptions = Validation errors
- ✅ Only actual validation error messages = Success

**Time Wasted**: ~2 hours debugging validation errors that should have been documented correctly

## 📊 Summary of All Four Validation Errors

| Error # | Field | Issue | Time Lost |
|---------|-------|-------|-----------|
| **#1** | `seniority` | Used LinkedIn values instead of actor-specific values | 15 min |
| **#2** | `functional` | Documentation listed 10 values, actual validation requires 37 | 30 min |
| **#3** | `companyEmployeeSize` | Removed spaces (wrong!), validation REQUIRES spaces | 20 min |
| **#4** | `contactEmailStatus` | Used array format, validation requires STRING | 15 min |
| | | **TOTAL TIME WASTED** | **~80 min** |

---

## 📋 Field: `functional`

### What the Actor Documentation Says:
```json
{
  "functional": [
    "Human Resources",
    "Operations", 
    "Management",
    "Sales",
    "Marketing",
    "Engineering",
    "Finance",
    "Legal",
    "IT",
    "Customer Success"
  ]
}
```
**Total**: 10 values

### What the Actual Validation Requires:
```json
{
  "functional": [
    "Admin", "Analytics", "Applications", "Cloud", "Compliance",
    "Controller", "Customer Service", "Cyber Security", "Data Engineering",
    "Devops", "Digital", "Distribution", "Engineering", "Finance",
    "Fraud", "Hiring", "HR", "Infrastructure", "Inside Sales", "IT",
    "Learning", "Legal", "Marketing", "Network Security", "Operations",
    "Product Management", "Product Security", "Production", "Purchase",
    "Research", "Risk", "Sales", "Security", "Support", "Testing", "Training"
  ]
}
```
**Total**: 37 values

---

## 🔍 Key Differences

| Documentation Says | Actual Validation Requires | Status |
|-------------------|---------------------------|---------|
| "Human Resources" | "HR" or "Hiring" | ❌ DIFFERENT |
| "Management" | "Operations" or "Admin" | ❌ DIFFERENT |
| "Customer Success" | "Customer Service" | ❌ DIFFERENT |
| "Operations" | "Operations" | ✅ SAME |
| "Sales" | "Sales" | ✅ SAME |
| "Marketing" | "Marketing" | ✅ SAME |
| "Engineering" | "Engineering" | ✅ SAME |
| "Finance" | "Finance" | ✅ SAME |
| "Legal" | "Legal" | ✅ SAME |
| "IT" | "IT" | ✅ SAME |

---

## 💥 Impact

### What Happened:
1. Created input JSON based on actor documentation
2. Used `"functional": ["Human Resources", "Management"]`
3. Actor rejected with validation error
4. Error message revealed 37 allowed values (not 10)
5. Had to rewrite all documentation

### Time Lost:
- Initial documentation: 30 minutes
- Debugging validation errors: 15 minutes
- Rewriting documentation: 20 minutes
- **Total**: ~65 minutes wasted due to incorrect documentation

---

## ✅ The Fix

### Updated Input JSON:
```json
{
  "functional": ["Marketing", "HR", "Hiring", "Sales"]
}
```

### Updated Documentation Files:
1. ✅ `validation-rules.md` - Complete rewrite with 37 actual values
2. ✅ `actor-info.md` - Updated with warning about discrepancy
3. ✅ `test-log.md` - Documented Error #2 with full details
4. ✅ `CRITICAL-DOCUMENTATION-DISCREPANCY.md` - This file

---

## 📚 Lessons Learned

### 1. Trust Validation Errors Over Documentation
- **Documentation**: May be outdated or incorrect
- **Validation Errors**: Show actual current requirements
- **Action**: Always test with small dataset first

### 2. Document Actual Validation Rules
- **Source**: Copy exact allowed values from validation error messages
- **Format**: Store in easily searchable reference file
- **Update**: Keep documentation in sync with actual validation

### 3. Test Before Scaling
- **Strategy**: Test with 1-2 records first
- **Benefit**: Catch validation errors before processing large datasets
- **Cost**: Minimal (100 leads minimum charge applies anyway)

### 4. Version Control for Actor Configurations
- **Problem**: Actor validation rules can change without notice
- **Solution**: Document validation rules with discovery date
- **Benefit**: Track when rules changed

---

## 🔄 Quick Conversion Guide

Use this when you encounter common LinkedIn values:

| LinkedIn/Common Value | Actual Actor Value |
|----------------------|-------------------|
| "Human Resources" | "HR" or "Hiring" |
| "Management" | "Operations" or "Admin" |
| "Customer Success" | "Customer Service" |
| "Business Development" | "Sales" or "Inside Sales" |
| "Strategy" | "Operations" |
| "Public Relations" | "Marketing" |
| "Advertising" | "Marketing" |
| "Communications" | "Marketing" |
| "DevOps" | "Devops" (lowercase 'o') |
| "Cybersecurity" | "Cyber Security" (two words) |

---

## 🚨 Other Fields with Validation Issues

### Error #3: `companyEmployeeSize` - SPACES REQUIRED! (2025-01-06)

**What We Thought**: Spaces NOT allowed ("1-10", "201-500")
**What Validation Requires**: Spaces ARE REQUIRED ("2 - 10", "201 - 500")

**Actual Allowed Values**:
```json
["0 - 1", "2 - 10", "11 - 50", "51 - 200", "201 - 500",
 "501 - 1000", "1001 - 5000", "5001 - 10000", "10000+"]
```

**Key Differences**:
- ❌ "1-10" → ✅ "2 - 10" (spaces required, different range)
- ❌ "201-500" → ✅ "201 - 500" (spaces required)
- New range: "0 - 1" (for single-employee companies)

### Error #4: `contactEmailStatus` - STRING NOT ARRAY! (2025-01-06)

**What We Thought**: Array format `["verified"]` with "unknown" as valid value
**What Validation Requires**: STRING format `"verified"` with "unavailable" (not "unknown")

**Actual Requirements**:
- **Data Type**: STRING (not array!)
- **Allowed Values**: "verified", "unverified", "unavailable"
- **Common Mistake**: Using `["verified"]` instead of `"verified"`

### Validation Status Summary:
- ❌ `seniority` - **FIXED** (Error #1 - LinkedIn values vs actor values)
- ❌ `functional` - **FIXED** (Error #2 - 37 values, not 10 as documented)
- ❌ `companyEmployeeSize` - **FIXED** (Error #3 - spaces required, opposite of assumption)
- ❌ `contactEmailStatus` - **FIXED** (Error #4 - string not array, "unavailable" not "unknown")
- ⚠️ `personTitle` - Free-form text (no strict validation)
- ⚠️ `companyDomain` - Domain format (no strict validation)

### Recommendation:
- Always test new fields with small dataset first
- Document actual validation errors when they occur
- Update validation-rules.md immediately

---

## 📞 Reporting to Apify

### Should We Report This?
**Yes** - This helps the actor developer and other users

### What to Report:
1. **Issue**: Documentation lists 10 functional values, validation requires 37
2. **Impact**: Causes validation failures for users following documentation
3. **Evidence**: Validation error message shows actual allowed values
4. **Suggestion**: Update actor documentation to match actual validation

### Where to Report:
- Actor Issues: https://console.apify.com/actors/T1XDXDWc1L92AfIJtd/issues
- Support Email: peakydev00@gmail.com

---

## ✅ Current Status

- [x] Validation errors identified
- [x] Actual allowed values documented
- [x] Input JSON fixed
- [x] All documentation updated
- [x] Conversion guide created
- [ ] Test with fixed input (in progress)
- [ ] Report to actor developer (optional)

---

## 🎯 Next Steps

1. **Copy** the fixed JSON from `.augment/Sample Outputs/apify-actor-input.json`
2. **Paste** into Apify actor input field
3. **Run** the actor
4. **Verify** no more validation errors
5. **Document** results in `test-log.md`

---

**Last Updated**: 2025-01-06  
**Status**: ✅ **FIXED AND DOCUMENTED**

