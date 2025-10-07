# Apify Actors for Contact Enrichment - Tracking System

**Last Test Date**: 2025-10-06
**Actors Tested**: 6
**Actors Suitable**: 2
**Recommended**: Lead Finder by Fatih Tahta ($1.4/1k, 0 issues)

---

## 📊 **Actor Comparison Table** (6 Actors Tested)

| **Actor Name** | **Actor ID** | **Status** | **Pricing** | **Email Yield** | **Open Issues** | **Success Rate** | **Rating** | **Suitable?** |
|----------------|--------------|------------|-------------|-----------------|-----------------|------------------|------------|---------------|
| **Lead Finder (Fatih Tahta)** | `aihL2lJmGDt9XFCGg` | ✅ Active | **$1.4/1k** | **66.7%** ✅ | **0** | >99% | 3.3/5 (4) | ✅ **YES** |
| Leads Scraper (Peaky Dev) | `T1XDXWc1L92AfIJtd` | ✅ Active | $1.4/1k | **12.5%** | 1 | >99% | 3.0/5 (10) | ⚠️ Backup |
| Extract Emails | `1wNLsaKfczSnPKJYw` | ✅ Active | $20/mo | N/A | Unknown | Unknown | 5.0/5 (2) | ❌ NO (URL-based) |
| Pipeline Labs | `VYRyEF4ygTTkaIghe` | ⚠️ Rented | $29.99/mo | **0%** | 2 | Unknown | 3.6/5 (7) | ❌ NO (Failed) |
| Deep Scraper | `dfkStIAbOQHuqIhaa` | ✅ Active | $8.00/1k | N/A | 0 | >99% | 3.6/5 (9) | ❌ NO (URL-based) |
| Leads Finder (Code Pioneer) | `IoSHqwTR9YGhzccez` | ⚠️ Maintenance | $1.5/1k | N/A | **62** | 84% | 3.0/5 (29) | ❌ NO (Maintenance) |

---

## 🎯 **Current Recommendations** (Updated 2025-10-06)

### 🏆 **Primary Actor (Production)** - **CONFIRMED!**
- **Actor**: **Lead Finder | With Emails | $1.4 / 1k** by Fatih Tahta
- **ID**: `aihL2lJmGDt9XFCGg`
- **Test Results**: ✅ **Test #2 Complete** (2025-10-06)
  - **Email Yield**: **66.7%** (10 verified emails from 15 contacts)
  - **Improvement**: **+433%** better than Leads Scraper (12.5%)
  - **Verification**: 100% of emails marked as "verified"
  - **Data Quality**: Excellent (no duplicates, rich company data)
- **Reasons**:
  - ✅ **Lowest cost**: $1.4 per 1,000 leads (tied with Leads Scraper)
  - ✅ **Zero open issues**: Most reliable actor (0 issues vs 1-62 for competitors)
  - ✅ **Active development**: 36 builds shows ongoing maintenance
  - ✅ **Perfect input format**: Company domain-based (exactly what we need)
  - ✅ **Built-in features**: Deduplication, verified emails, rich company context
  - ✅ **PROVEN RESULTS**: 66.7% email yield (433% better than Leads Scraper!)
- **Status**: ✅ **Ready for N8N Integration** (analysis complete, awaiting implementation)

### ⚠️ **Backup Actor (Fallback)**
- **Actor**: Leads Scraper by Peaky Dev
- **ID**: `T1XDXWc1L92AfIJtd`
- **Reasons**:
  - ⚠️ **Low email yield**: Only 12.5% (1 out of 8 contacts had email)
  - ⚠️ **Unreliable**: 66% failure rate (2 out of 3 runs returned 0 results)
  - ⚠️ **Validation complexity**: 4 documented validation errors
- **Use Only If**: Actor #1 fails or produces poor results

## 📋 **Integration Status**

### **Contact Enrichment Workshop Integration**
- **Current Actor**: Apollo Scraper (`jljBwyyQakqrL1wae`) - needs replacement
- **Target Actor**: Lead Finder (`aihL2lJmGDt9XFCGg`)
- **Integration Approach**: ✅ **REVISED** (2025-10-06)
  - **Strategy**: Update node configurations, NOT delete nodes
  - **Architecture**: All 8 nodes in Contact Enrichment Workshop are PRESERVED
  - **Updates Required**: 4 node configuration updates
  - **Verification**: Two-stage verification (Lead Finder + NeverBounce) MAINTAINED
- **Status**: ⏳ **Analysis Complete, Ready for Implementation**
- **Documentation**: See `Lead-Finder-Fatih-Tahta/` directory for complete integration plan
- **Batch Processing**: Supported (up to 30k leads per run)
- **Expected Volume**: ~100 job postings = ~500-1000 contacts

### **Required Changes**
1. **Input Builder Node**: Implement batch domain collection
2. **Output Formatting Node**: Handle snake_case to camelCase mapping
3. **Error Handling**: Implement fallback to backup actor
4. **Cost Control**: Limit to 10-15 contacts per company

## 🚀 **Quick Start Guide**

### Before Running Any Actor:
1. **READ**: `Leads-Scraper/validation-rules.md` - Avoid validation errors
2. **CHECK**: `Leads-Scraper/test-log.md` - Learn from previous tests
3. **USE**: `Leads-Scraper/input-schema.json` - Copy working example
4. **VALIDATE**: All field values are case-sensitive and must match exact allowed values

### Common Validation Errors:
- ❌ Using "Associate" or "Mid-Senior level" for seniority
- ❌ Using "HR" instead of "Human Resources" for functional
- ❌ Using spaces in employee size ranges (e.g., "201 - 500")
- ✅ Always check `validation-rules.md` before creating input JSON

## 🔄 **Update History**

| **Date** | **Action** | **Details** |
|----------|------------|-------------|
| 2025-10-06 | **Comprehensive Testing** | Tested 6 actors with real job data |
| 2025-10-06 | **Primary Actor Change** | Changed from Leads Scraper to Lead Finder (Fatih Tahta) |
| 2025-10-06 | **Test Results** | Leads Scraper: 12.5% email yield, 66% failure rate |
| 2025-10-06 | **Actor Elimination** | Eliminated 4 actors (URL-based, under maintenance, failed) |
| 2025-10-06 | **Comparison Report** | Created comprehensive test-comparison.md |
| 2025-01-06 | Initial Analysis | Analyzed both Leads Finder and Leads Scraper actors |
| 2025-01-06 | Primary Selection | Selected Leads Scraper as primary due to reliability |
| 2025-01-06 | Error Documentation | Added validation error tracking system |
| 2025-01-06 | Batch Processing | Added comprehensive batch processing strategy |
| 2025-01-06 | Validation Rules | Created comprehensive validation rules reference |
| 2025-01-06 | Test Tracking | Added test log for tracking actor performance |

## 🚨 **Error Documentation System**

### **Purpose**
When switching between actors (primary → fallback), we need immediate access to correct JSON formats and field values to avoid repeated validation errors.

### **Error Tracking Location**
Each actor's `actor-info.md` file contains a "Known Validation Errors" section with:
- Field name that caused the error
- Complete list of allowed values
- Example of correct usage
- Date error was discovered

### **Quick Error Reference**

#### **Leads Scraper (Primary)**
- **Field Names**: camelCase (`companyDomain`, `contactEmailStatus`)
- **Seniority Values**: "Manager", "Director", "VP", "Head", "CEO"
- **Functional Values**: "Human Resources", "Operations", "Management"
- **Size Format**: "201-500", "501-1000" (with hyphens)

#### **Leads Finder (Backup)**
- **Field Names**: snake_case (`company_domain`, `email_status`)
- **Seniority Values**: "c_level", "director", "vice_president", "head", "manager"
- **Functional Values**: "hr", "operations", "marketing" (lowercase)
- **Size Format**: "201-500", "501-1000" (same as primary)

## 📁 **Directory Structure**

```
/Apify-Actors/
├── README.md                           # This file - Actor comparison and status
├── test-comparison.md                  # ⭐ Comprehensive test results for 6 actors
├── /Lead-Finder-Fatih-Tahta/          # 🏆 PRIMARY actor (recommended)
│   ├── actor-info.md                  # Detailed actor information
│   ├── input-schema.json              # Sample JSON input
│   └── output-schema.md               # Output field mapping
├── /Leads-Scraper/                    # ⚠️ BACKUP actor (low email yield)
│   ├── actor-info.md                  # Detailed actor information + test history
│   ├── input-schema.json              # Sample JSON input
│   ├── output-schema.md               # Output field mapping
│   ├── batch-processing-samples.json  # Batch processing examples for 100 jobs
│   ├── validation-rules.md            # ⭐ Field validation reference (MUST READ)
│   └── test-log.md                    # Test history and results tracking
└── /Leads-Finder/                     # ❌ NOT RECOMMENDED (under maintenance, 62 issues)
    ├── actor-info.md                  # Detailed actor information + validation errors
    ├── input-schema.json              # Sample JSON input
    └── output-schema.md               # Output field mapping
```

## 🚨 **Monitoring Alerts**

### **Check Weekly**
- [ ] Leads Finder maintenance status
- [ ] Leads Scraper success rate and issues
- [ ] New actor alternatives in Apify Store

### **Check Monthly**  
- [ ] Pricing changes
- [ ] Feature updates
- [ ] User ratings and reviews

---

## 📝 **Test Results Summary**

### **Actors Tested**: 6
- ✅ **Suitable**: 2 (Lead Finder by Fatih Tahta, Leads Scraper by Peaky Dev)
- ❌ **Not Suitable**: 4 (URL-based, under maintenance, failed runs)

### **Key Findings**:
1. **Lead Finder (Fatih Tahta)** - Best choice: $1.4/1k, 0 issues, active development
2. **Leads Scraper (Peaky Dev)** - Backup only: 12.5% email yield, 66% failure rate
3. **Pipeline Labs** - Failed: $29.99/month, 0 results after 1h 18m
4. **Leads Finder (Code Pioneer)** - Under maintenance: 62 open issues
5. **Extract Emails** - Not suitable: URL-based, not domain-based
6. **Deep Scraper** - Not suitable: URL-based, not domain-based

### **Detailed Report**: See `test-comparison.md` for full analysis

---

**Last Updated**: 2025-10-06
**Next Review**: 2025-10-13
**Next Action**: Test Lead Finder (Fatih Tahta) with our 8 company domains
