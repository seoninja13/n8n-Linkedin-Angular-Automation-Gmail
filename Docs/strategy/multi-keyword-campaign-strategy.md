# Multi-Keyword Campaign Strategy
**LinkedIn Automation - Parallel Job Search Campaigns**

**Document Version**: 1.0.0  
**Created**: 2025-10-28  
**Last Updated**: 2025-10-28  
**Status**: APPROVED - Ready for Implementation

---

## Executive Summary

This document outlines the strategic approach for scaling the LinkedIn automation system to support multiple parallel job search campaigns targeting different keywords simultaneously. The architecture leverages a **2-tier shared sub-workflow approach** that minimizes code duplication while enabling independent keyword-specific campaigns.

**Key Architectural Decision**: Use shared sub-workflows across all keyword campaigns, duplicating ONLY the orchestrator and Job Discovery workflows per keyword. This approach provides a **single point of fix** - when an issue is identified in one keyword campaign, fixing the shared sub-workflow automatically resolves it for ALL keywords.

---

## Campaign Overview

### Target Keywords (Initial Phase)

| Keyword | Priority | Target Volume | Status |
|---------|----------|---------------|--------|
| **SEO Specialist** | HIGH | 100 emails/day | ✅ ACTIVE (existing) |
| **Automation Specialist** | HIGH | 100 emails/day | 🔄 PLANNED |
| **GenAI Engineer** | HIGH | 100 emails/day | 🔄 PLANNED |
| **Marketing Manager** | MEDIUM | 50 emails/day | ⏳ FUTURE |
| **Data Analyst** | MEDIUM | 50 emails/day | ⏳ FUTURE |

### Campaign Goals

**Phase 1 (Weeks 1-4)**: Establish 3 parallel keyword campaigns
- SEO Specialist: 100 emails/day
- Automation Specialist: 100 emails/day
- GenAI Engineer: 100 emails/day
- **Total**: 300 emails/day across 3 keywords

**Phase 2 (Weeks 5-8)**: Expand to 5 keyword campaigns
- Add Marketing Manager: 50 emails/day
- Add Data Analyst: 50 emails/day
- **Total**: 400 emails/day across 5 keywords

---

## Architecture Decision: Shared Sub-Workflows Approach

### 2-Tier Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIER 1: ORCHESTRATOR LAYER                    │
│                     (ONE PER KEYWORD)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LinkedIn-SEO-Gmail-Orchestrator--Augment                       │
│  LinkedIn-Automation-Specialist-Gmail-Orchestrator--Augment     │
│  LinkedIn-GenAI-Gmail-Orchestrator--Augment                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              TIER 2: JOB DISCOVERY LAYER                         │
│                     (ONE PER KEYWORD)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LinkedIn-SEO-Gmail-sub-flow-Workshop-JobDiscovery--Augment     │
│  LinkedIn-Automation-Specialist-Gmail-sub-flow-Workshop-        │
│    JobDiscovery--Augment                                         │
│  LinkedIn-GenAI-Gmail-sub-flow-Workshop-JobDiscovery--Augment   │
│                                                                  │
│  Each contains keyword-specific LinkedIn search URL              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│           SHARED SUB-WORKFLOWS (KEYWORD-AGNOSTIC)                │
│              (SHARED ACROSS ALL KEYWORDS)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ LinkedIn-SEO-Gmail-sub-flow-Workshop-JobMatchingScoring--   │
│     Augment (SHARED)                                             │
│  ✅ LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactEnrichment--    │
│     Augment (SHARED)                                             │
│  ✅ LinkedIn-SEO-Gmail-sub-flow-Workshop-ResumeGeneration--     │
│     Augment (SHARED)                                             │
│  ✅ LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--      │
│     Augment (SHARED)                                             │
│  ✅ LinkedIn-SEO-Gmail-sub-flow-Workshop-OutreachTracking--     │
│     Augment (SHARED)                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Benefits of Shared Sub-Workflows

**1. Single Point of Fix (CRITICAL BENEFIT)**
- **Problem**: If one keyword campaign encounters an issue (e.g., NeverBounce API error, Resume Generation bug, Gmail sending failure), you need to fix it
- **Solution**: Fix the shared sub-workflow ONCE, and the fix automatically applies to ALL keyword campaigns
- **Impact**: Eliminates code duplication and maintenance overhead across multiple keyword campaigns

**2. Minimal Duplication**
- Only 2 workflows duplicated per keyword (orchestrator + Job Discovery)
- 5 sub-workflows shared across ALL keywords
- **Duplication Factor**: 2 workflows per keyword vs 7 workflows per keyword (65% reduction)

**3. Easy Maintenance**
- Changes to shared workflows automatically propagate to all keywords
- No need to manually update multiple copies of the same workflow
- Reduced risk of configuration drift between keyword campaigns

**4. Lower Storage Requirements**
- 3 keywords = 6 keyword-specific workflows + 5 shared workflows = 11 total workflows
- Alternative (full duplication) = 3 keywords × 7 workflows = 21 total workflows
- **Storage Savings**: 48% reduction in workflow count

**5. Faster Implementation**
- 80 minutes per keyword (vs 6-8 hours for full duplication)
- 4 hours total for 3 keywords
- Can scale to 10+ keywords in a single day

### Keyword Configuration Location

**ONLY ONE PLACE** requires keyword-specific configuration:

**Job Discovery Workshop → LinkedIn Jobs Scraper Node → URL Parameter**

```json
{
  "count": 999,
  "scrapeCompany": true,
  "urls": [
    "https://www.linkedin.com/jobs/search/?f_TPR=r86400&f_WT=2&geoId=103644278&keywords=[KEYWORD]&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true"
  ]
}
```

**Keyword Examples:**
- SEO: `keywords=seo`
- Automation Specialist: `keywords=automation%20specialist` (URL-encoded)
- GenAI Engineer: `keywords=gen%20ai%20engineer` (URL-encoded)

**All other sub-workflows are keyword-agnostic** and process whatever job data they receive.

---

## Implementation Roadmap

### Phase 1: Infrastructure Setup (Week 1)

**Day 1: Automation Specialist Campaign**
- [ ] Duplicate orchestrator workflow (15 minutes)
- [ ] Rename to: `LinkedIn-Automation-Specialist-Gmail-Orchestrator--Augment`
- [ ] Duplicate Job Discovery workflow (30 minutes)
- [ ] Rename to: `LinkedIn-Automation-Specialist-Gmail-sub-flow-Workshop-JobDiscovery--Augment`
- [ ] Update LinkedIn Jobs Scraper URL: `keywords=automation%20specialist`
- [ ] Update orchestrator to reference new Job Discovery workflow (5 minutes)
- [ ] Test workflow with manual execution (30 minutes)
- [ ] **Total Time**: 80 minutes

**Day 2: GenAI Engineer Campaign**
- [ ] Duplicate orchestrator workflow (15 minutes)
- [ ] Rename to: `LinkedIn-GenAI-Gmail-Orchestrator--Augment`
- [ ] Duplicate Job Discovery workflow (30 minutes)
- [ ] Rename to: `LinkedIn-GenAI-Gmail-sub-flow-Workshop-JobDiscovery--Augment`
- [ ] Update LinkedIn Jobs Scraper URL: `keywords=gen%20ai%20engineer`
- [ ] Update orchestrator to reference new Job Discovery workflow (5 minutes)
- [ ] Test workflow with manual execution (30 minutes)
- [ ] **Total Time**: 80 minutes

**Day 3: Monitoring Dashboard Setup**
- [ ] Create Google Sheets monitoring dashboard (2 hours)
- [ ] Add columns: Keyword, Workflow IDs, Last Execution, Jobs Discovered, Emails Sent, Success Rate
- [ ] Set up automated data collection (optional)

**Total Phase 1 Time**: 4-5 hours

---

### Phase 2: Production Deployment (Weeks 2-4)

**Week 2: Gmail Rate Limiting Ramp-Up (SEO Campaign)**
- Day 1-2: 10 emails/day
- Day 3-4: 15 emails/day
- Day 5-6: 20 emails/day
- Day 7: 25 emails/day

**Week 3: Continue Ramp-Up + Add Second Keyword**
- SEO Campaign: 30-50 emails/day
- Automation Specialist Campaign: Start at 10 emails/day, ramp up
- Monitor bounce rates, spam complaints, deliverability

**Week 4: Add Third Keyword + Reach Target Volume**
- SEO Campaign: 75-100 emails/day
- Automation Specialist Campaign: 50-75 emails/day
- GenAI Engineer Campaign: Start at 10 emails/day, ramp up

**End of Week 4 Target**: 200-250 emails/day across 3 keywords

---

## Naming Conventions

### Orchestrator Workflows

**Format**: `LinkedIn-[KEYWORD]-Gmail-Orchestrator--Augment`

**Rules**:
- Use hyphens for multi-word keywords
- Capitalize each word (Title Case)
- Always end with `--Augment` suffix

**Examples**:
- `LinkedIn-SEO-Gmail-Orchestrator--Augment`
- `LinkedIn-Automation-Specialist-Gmail-Orchestrator--Augment`
- `LinkedIn-GenAI-Gmail-Orchestrator--Augment`
- `LinkedIn-Marketing-Manager-Gmail-Orchestrator--Augment`

---

### Job Discovery Workflows

**Format**: `LinkedIn-[KEYWORD]-Gmail-sub-flow-Workshop-JobDiscovery--Augment`

**Rules**:
- Match keyword from orchestrator workflow
- Always include `sub-flow-Workshop-JobDiscovery` suffix
- Always end with `--Augment` suffix

**Examples**:
- `LinkedIn-SEO-Gmail-sub-flow-Workshop-JobDiscovery--Augment`
- `LinkedIn-Automation-Specialist-Gmail-sub-flow-Workshop-JobDiscovery--Augment`
- `LinkedIn-GenAI-Gmail-sub-flow-Workshop-JobDiscovery--Augment`

---

### Shared Sub-Workflows (NO CHANGES)

**Keep existing names** - these workflows are shared across ALL keywords:
- `LinkedIn-SEO-Gmail-sub-flow-Workshop-JobMatchingScoring--Augment`
- `LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactEnrichment--Augment`
- `LinkedIn-SEO-Gmail-sub-flow-Workshop-ResumeGeneration--Augment`
- `LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment`
- `LinkedIn-SEO-Gmail-sub-flow-Workshop-OutreachTracking--Augment`

**⚠️ DO NOT RENAME OR DUPLICATE** - these are intentionally shared

---

## Timeline and Resource Estimates

### Per-Keyword Implementation Time

| Task | Time | Complexity |
|------|------|------------|
| Duplicate Orchestrator | 15 min | Low |
| Duplicate Job Discovery | 30 min | Low |
| Update References | 5 min | Low |
| Test Workflow | 30 min | Medium |
| **Total per Keyword** | **80 min** | **Low-Medium** |

### Multi-Keyword Campaign Timeline

| Keywords | Setup Time | Ramp-Up Time | Total Time |
|----------|------------|--------------|------------|
| 3 keywords | 4 hours | 3-4 weeks | 3-4 weeks |
| 5 keywords | 7 hours | 4-6 weeks | 4-6 weeks |
| 10 keywords | 14 hours | 6-8 weeks | 6-8 weeks |

**Note**: Ramp-up time is for Gmail rate limiting (15-20 days per keyword to reach 100 emails/day)

---

## Monitoring Strategy

### Performance Metrics Dashboard

**Google Sheets Dashboard Columns**:
1. **Keyword**: Campaign keyword
2. **Orchestrator Workflow ID**: N8N workflow ID
3. **Job Discovery Workflow ID**: N8N workflow ID
4. **Last Execution Date**: Timestamp of last run
5. **Jobs Discovered**: Total jobs found by LinkedIn scraper
6. **Jobs Passed Filter**: Jobs that passed Job Matching filter
7. **Resumes Generated**: Number of resumes customized
8. **Emails Sent**: Number of Gmail drafts/emails created
9. **Success Rate**: Percentage of jobs that resulted in emails
10. **Errors/Warnings**: Any issues encountered

### Key Performance Indicators (KPIs)

| Metric | Target | Warning Threshold | Action Required |
|--------|--------|-------------------|-----------------|
| **Jobs Discovered** | 50-200/day | <20/day | Review LinkedIn search parameters |
| **Filter Pass Rate** | 30-50% | <20% | Adjust Job Matching criteria |
| **Resume Generation Success** | 100% | <95% | Investigate Resume Generation errors |
| **Email Send Success** | 100% | <95% | Check Gmail credentials/limits |
| **Bounce Rate** | <5% | >10% | Verify email list quality |
| **Response Rate** | 1-5% | <0.5% | Review email content |

### Monitoring Frequency

- **Daily**: Check execution logs, error rates, email send success
- **Weekly**: Review KPIs, adjust campaigns as needed
- **Monthly**: Analyze response rates, optimize email templates

---

## Risk Management

### Risk 1: Shared Sub-Workflow Failure

**Risk**: If a shared sub-workflow fails, ALL keyword campaigns are affected

**Mitigation**:
- Maintain workflow backups before making changes
- Test changes on one keyword first before deploying to all
- Implement rollback procedures
- Monitor all campaigns after shared workflow changes

**Severity**: HIGH  
**Likelihood**: LOW (workflows are stable)

---

### Risk 2: Google Sheets Duplicate Detection Shared Across Keywords

**Risk**: All keywords share the same Contact Tracking Google Sheets, so duplicate detection works across ALL keywords (not per-keyword)

**Impact**: If the same company posts jobs for multiple keywords, only the first application will be sent

**Mitigation**:
- This is actually a FEATURE, not a bug (prevents multiple applications to same company)
- If per-keyword duplicate detection is needed, implement separate Google Sheets per keyword

**Severity**: LOW  
**Likelihood**: MEDIUM

---

### Risk 3: Gmail Rate Limiting Across Multiple Keywords

**Risk**: All keywords share the same Gmail account, so sending limits apply across ALL campaigns

**Impact**: 3 keywords × 100 emails/day = 300 emails/day (within 500/day personal Gmail limit)

**Mitigation**:
- Monitor total daily send volume across all keywords
- Implement staggered sending schedules (morning/afternoon/evening)
- Consider Google Workspace upgrade if exceeding 500/day

**Severity**: MEDIUM  
**Likelihood**: HIGH (when scaling to 5+ keywords)

---

## Success Criteria

### Phase 1 Success Criteria (Week 4)

- [ ] 3 keyword campaigns operational (SEO, Automation Specialist, GenAI Engineer)
- [ ] 200-250 emails/day total across all keywords
- [ ] <5% bounce rate
- [ ] <0.1% spam complaint rate
- [ ] 100% workflow execution success rate
- [ ] Monitoring dashboard operational

### Phase 2 Success Criteria (Week 8)

- [ ] 5 keyword campaigns operational
- [ ] 400 emails/day total across all keywords
- [ ] 1-5% response rate
- [ ] Zero Gmail account warnings/suspensions
- [ ] Automated monitoring and alerting

---

## Appendix: Alternative Approaches Considered

### Alternative 1: Fully Duplicated Workflows (REJECTED)

**Approach**: Duplicate ALL 7 workflows per keyword

**Pros**:
- Complete isolation per keyword
- Can customize each workflow independently

**Cons**:
- High duplication (6 sub-workflows × 3 keywords = 18 workflows)
- Difficult to maintain (changes must be applied to all copies)
- High risk of configuration drift
- 6-8 hours implementation time per keyword

**Decision**: REJECTED due to maintenance overhead

---

### Alternative 2: Single Orchestrator with Keyword Parameter (REJECTED)

**Approach**: One orchestrator that accepts keyword as parameter

**Pros**:
- Zero duplication
- Single source of truth

**Cons**:
- Cannot schedule different keywords independently
- More complex to implement
- Requires manual execution with different parameters

**Decision**: REJECTED due to scheduling limitations

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-28 | Augment Agent | Initial document creation |

---

**Document Status**: ✅ APPROVED - Ready for Implementation  
**Next Review Date**: 2025-11-28 (1 month)

