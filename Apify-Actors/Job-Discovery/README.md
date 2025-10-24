# Job Discovery Actors - Overview

**Category**: Job Discovery Actors  
**Purpose**: Actors for sourcing job postings from LinkedIn, company career pages, and other job platforms  
**Created**: 2025-10-20  
**Last Updated**: 2025-10-20

---

## **📋 CATEGORY DESCRIPTION**

This directory contains comprehensive evaluations and documentation for Apify actors that discover and extract job postings from various sources. Unlike contact enrichment actors (which find people), job discovery actors find job opportunities.

**Strategic Goal**: Diversify job sources beyond LinkedIn to include company career pages and alternative job platforms where competition is lower and candidates have higher visibility.

---

## **🎯 USE CASES**

### **Primary Use Case: Job Discovery Pipeline**
- **Current Limitation**: LinkedIn-only job discovery creates high competition (many applicants per job posting)
- **Solution**: Use multiple job discovery sources to find opportunities with lower competition
- **Integration Point**: Job Discovery Workshop (N8N workflow) processes job data from multiple sources

### **Secondary Use Cases**
- Job board backfill with high-quality real jobs
- Lead generation for recruitment agencies
- Market research on hiring trends
- Competitive intelligence on company hiring

---

## **📁 DIRECTORY STRUCTURE**

```
Apify-Actors/Job-Discovery/
├── README.md (this file)
├── Career-Site-Job-Listing-Feed-Actor-Evaluation.md
├── Career-Site-Job-Listing-Feed-Actor-Integration-Guide.md
└── Job-Discovery-Actors-Comparison.md
```

---

## **🔍 EVALUATED ACTORS**

### **1. Career Site Job Listing Feed** ⭐ RECOMMENDED
- **Actor ID**: `Dn2KJLnaNC5vFGkEw`
- **Actor Path**: `fantastic-jobs/career-site-job-listing-feed`
- **Status**: ✅ SUPPLEMENT (Use alongside LinkedIn job discovery)
- **Evaluation**: [Career-Site-Job-Listing-Feed-Actor-Evaluation.md](./Career-Site-Job-Listing-Feed-Actor-Evaluation.md)
- **Integration Guide**: [Career-Site-Job-Listing-Feed-Actor-Integration-Guide.md](./Career-Site-Job-Listing-Feed-Actor-Integration-Guide.md)

**Quick Stats**:
- **Job Sources**: 125k+ company career sites across 37 ATS platforms
- **Database Size**: 2+ million active jobs worldwide
- **Pricing**: $1.20 per 1,000 jobs (pay-per-result)
- **User Rating**: 4.85/5 stars (6 reviews)
- **Success Rate**: 100% runs succeeded
- **Total Users**: 243 users, 76 monthly active users

**Key Features**:
- ✅ Direct application URLs (no 3rd party required)
- ✅ AI-enriched job data (60+ fields per job)
- ✅ LinkedIn company data integration
- ✅ Supports 37 ATS platforms (Workday, Greenhouse, Ashby, Lever, etc.)
- ✅ Advanced filtering (title, location, company, salary, remote, experience level)
- ✅ Bulk processing (200-5,000 jobs per run)

---

## **📊 COMPARISON MATRIX**

For a detailed comparison of all job discovery actors, see: [Job-Discovery-Actors-Comparison.md](./Job-Discovery-Actors-Comparison.md)

| Criterion | Current LinkedIn Discovery | Career Site Job Listing Feed |
|-----------|---------------------------|------------------------------|
| **Job Sources** | LinkedIn only | 125k+ company career sites (37 ATS platforms) |
| **Competition Level** | High (many applicants) | Lower (direct company postings) |
| **Cost per Job** | Unknown | $0.0012 per job |
| **Bulk Processing** | Unknown | Yes (200-5,000 jobs/run) |
| **Application URLs** | Yes | Yes (direct to company) |
| **Job Metadata** | Basic | 60+ fields (AI-enriched) |
| **Data Quality** | High | Very High (100% success rate) |

---

## **🚀 QUICK START**

### **Step 1: Choose Your Actor**
- **For LinkedIn jobs**: Use existing LinkedIn job discovery actor
- **For company career page jobs**: Use Career Site Job Listing Feed actor
- **For maximum coverage**: Use both actors in parallel

### **Step 2: Review Evaluation**
Read the detailed evaluation for your chosen actor:
- [Career Site Job Listing Feed Evaluation](./Career-Site-Job-Listing-Feed-Actor-Evaluation.md)

### **Step 3: Follow Integration Guide**
Integrate the actor into your N8N workflow:
- [Career Site Job Listing Feed Integration Guide](./Career-Site-Job-Listing-Feed-Actor-Integration-Guide.md)

---

## **📚 DOCUMENTATION STANDARDS**

All actor evaluations in this directory follow these standards:

### **1. Evaluation Report Structure**
- Executive Summary with clear recommendation (ADOPT/SUPPLEMENT/TEST/REJECT)
- Core Functionality Analysis
- Output Schema Analysis
- Pricing and Cost Analysis
- Integration Feasibility Assessment
- Data Quality and Reliability Metrics
- Comparative Analysis vs. Current Solution
- Strategic Recommendation with Implementation Plan

### **2. Integration Guide Structure**
- Prerequisites and Requirements
- Step-by-Step Integration Instructions
- N8N Workflow Configuration
- Input Parameter Configuration
- Output Data Mapping
- Testing and Validation
- Troubleshooting Common Issues

### **3. Comparison Matrix Structure**
- Side-by-side comparison of all evaluated actors
- Quantified metrics for objective comparison
- Clear winner identification for each criterion
- Overall recommendation based on use case

---

## **🔗 RELATED DOCUMENTATION**

- **Contact Enrichment Actors**: `../` (parent directory)
- **N8N Workflow Documentation**: `../../Docs/workflows/`
- **Job Discovery Workshop**: `../../Docs/workflows/Job-Discovery-Workshop.md`
- **Central Documentation Index**: `../../README-index.md`

---

## **📝 MAINTENANCE NOTES**

- **Last Review**: 2025-10-20
- **Next Review**: 2025-11-20 (monthly review recommended)
- **Maintainer**: Automation Team
- **Update Frequency**: As new actors are evaluated or existing actors are updated

---

## **💡 TIPS FOR EVALUATION**

When evaluating new job discovery actors:

1. **Test with Real Data**: Run the actor with your actual search criteria
2. **Measure Cost**: Calculate cost per job posting for your use case
3. **Verify Data Quality**: Check that job URLs work and data is accurate
4. **Test Integration**: Ensure the output schema is compatible with your workflow
5. **Monitor Performance**: Track success rate, execution time, and error rate
6. **Compare Alternatives**: Always compare against existing solutions

---

## **🆘 SUPPORT**

For questions or issues:
- **Actor-Specific Issues**: Contact actor developer through Apify platform
- **Integration Issues**: Review integration guide or contact automation team
- **General Questions**: Refer to central documentation index

---

**Last Updated**: 2025-10-20  
**Version**: 1.0.0

