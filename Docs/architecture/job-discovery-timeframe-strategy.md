# Job Discovery Timeframe Strategy
**LinkedIn Automation - 24-Hour Window Architecture**

**Document Version**: 1.0.0  
**Created**: 2025-11-11  
**Last Updated**: 2025-11-11  
**Status**: APPROVED - Architectural Standard

---

## Executive Summary

This document establishes the **mandatory 24-hour timeframe** for all Job Discovery operations and explains the architectural rationale for this decision. This is a **non-negotiable design principle** that must be maintained across all keyword campaigns.

**Key Principle**: Quality (fresh 24-hour jobs) > Quantity (stale 7-day jobs). Scale through multiple targeted campaigns, not broader time windows.

---

## Architectural Decision

### **DECISION: Maintain "Last 24 Hours" Timeframe**

All Job Discovery Workshop Apify actors MUST be configured with `datePosted: "past-24h"` (or equivalent 24-hour filter).

**DO NOT** expand to 7-day, 3-day, or any multi-day windows.

---

## Rationale

### **1. Avoid Duplicate Scraping**

**Problem with Multi-Day Windows:**

Expanding to 7-day windows causes the system to repeatedly scrape the same jobs:

```
Day 1: Scrape jobs from past 7 days (Jobs A, B, C, D, E, F, G)
Day 2: Scrape jobs from past 7 days (Jobs B, C, D, E, F, G, H) ← 6 duplicates!
Day 3: Scrape jobs from past 7 days (Jobs C, D, E, F, G, H, I) ← 6 duplicates!
```

**Impact:**
- Wastes Apify API credits scraping duplicate jobs
- Increases Google Sheets duplicate detection load
- Processes same jobs through expensive AI pipeline multiple times
- Creates unnecessary data bloat

**24-Hour Window Solution:**

```
Day 1: Scrape jobs from past 24 hours (Jobs A)
Day 2: Scrape jobs from past 24 hours (Jobs B) ← No duplicates!
Day 3: Scrape jobs from past 24 hours (Jobs C) ← No duplicates!
```

### **2. Data Freshness Priority**

**Competitive Advantage:**
- Jobs posted in last 24 hours have **fewer applicants** (10-50 vs 200-500)
- Hiring managers are **actively reviewing applications** for fresh postings
- Response rates are **3-5x higher** for applications submitted within 48 hours of posting

**Stale Data Problem:**
- Jobs older than 24 hours are considered "garbage" for our use case
- Lower response rates due to high applicant volume
- Positions may already be filled (but posting still active)

### **3. Eliminate Stale Data**

**Quality Control:**
- 24-hour filter ensures we only process **actively hiring** companies
- Reduces wasted effort on positions that are no longer available
- Maintains high-quality candidate experience (timely applications)

---

## Volume Scaling Strategy

### **Multi-Campaign Architecture**

**If SEO jobs < 100/day:** This is **EXPECTED and ACCEPTABLE**.

**Solution:** Run multiple campaigns with different keyword sets (not just "SEO").

### **Campaign Examples**

| Campaign | Keywords | Expected Jobs/Day | Expected Emails/Day |
|----------|----------|-------------------|---------------------|
| Campaign 1 | "SEO" | 20 jobs | 2-3 emails |
| Campaign 2 | "Search Engine Optimization" | 15 jobs | 2 emails |
| Campaign 3 | "Digital Marketing" | 25 jobs | 3-4 emails |
| Campaign 4 | "Content Marketing" | 30 jobs | 4-5 emails |
| Campaign 5 | "Growth Marketing" | 25 jobs | 3-4 emails |
| **TOTAL** | **5 campaigns** | **115 jobs** | **15-18 emails** ✅ |

### **Goal**

Achieve **13-15 total emails/day across ALL keyword campaigns combined** (not per campaign).

---

## Implementation Standards

### **Apify Actor Configuration**

**Required Parameter:**
```json
{
  "datePosted": "past-24h"
}
```

**LinkedIn Jobs Scraper URL Format:**
```
https://www.linkedin.com/jobs/search/?f_TPR=r86400&f_WT=2&geoId=103644278&keywords=[KEYWORD]&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true
```

**Key Parameter:** `f_TPR=r86400` (86400 seconds = 24 hours)

### **Workflow Naming Convention**

Each keyword campaign requires:
1. **Orchestrator Workflow**: `LinkedIn-[KEYWORD]-GmailOutlook-Orchestrator--Augment`
2. **Job Discovery Workshop**: `LinkedIn-[KEYWORD]-sub-flow-Workshop-JobDiscovery--Augment`

All other workshops are **shared across campaigns** (no duplication).

---

## Funnel Math with 24-Hour Window

### **Expected Conversion Rates**

Based on execution 7210 data:

| Stage | Pass Rate | Example |
|-------|-----------|---------|
| Job Discovery | 100% | 20 jobs scraped |
| Job Matching | 10% | 2 jobs passed |
| Contact Enrichment | 58% | 1.2 jobs (round to 1) |
| Resume Generation | 50% | 1 job passed |
| **Final Output** | - | **1 job × 3 contacts = 3 emails** |

### **Multi-Campaign Scaling**

To achieve 15 emails/day:
- Need **5 jobs** at final output (5 × 3 contacts = 15 emails)
- Need **5 campaigns** running in parallel
- Each campaign contributes **1 job** (3 emails)

---

## Cost Implications

### **24-Hour Window Costs**

**Per Campaign Per Day:**
- Apify Job Discovery: $0.15
- Apify Lead Finder: $0.50
- NeverBounce: $0.24
- Google Gemini AI: $0.90
- **Total:** $1.79/day per campaign

**5 Campaigns:**
- Daily cost: $1.79 × 5 = **$8.95/day**
- Monthly cost: $8.95 × 30 = **$268.50/month**
- Cost per email: $8.95 ÷ 15 = **$0.60/email**

**Industry Benchmark:** $0.50-2.00 per B2B cold email
**Our Cost:** $0.60/email ✅ (within acceptable range)

---

## Prohibited Actions

### **DO NOT:**

1. ❌ Change `datePosted` to "past-week" or "past-3-days"
2. ❌ Expand timeframe to increase job volume per campaign
3. ❌ Remove date filters to get "all available jobs"
4. ❌ Use different timeframes for different keyword campaigns

### **INSTEAD:**

1. ✅ Add more keyword campaigns to increase total volume
2. ✅ Maintain 24-hour freshness across all campaigns
3. ✅ Accept lower job volume per campaign as expected behavior
4. ✅ Scale horizontally (more campaigns) not vertically (longer timeframes)

---

## Related Documentation

- **Multi-Keyword Campaign Strategy**: `Docs/strategy/multi-keyword-campaign-strategy.md`
- **Job Discovery Workshop Implementation**: `Docs/implementation/Job-Discovery-Workshop-Implementation-Guide.md`
- **Architecture Overview**: `README-index.md` (Section: LinkedIn Automation Architecture)

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-11-11 | Initial document creation | Augment Agent |

