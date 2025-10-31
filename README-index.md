# Augment Agent Documentation Index (Central Navigation)

This is the single, authoritative entry point for all project documentation. Every document should link back here for navigation continuity.

Last updated: 2025-10-30

---

## Quick Links
- Handover / Knowledge Transfer docs
- Architecture
- Implementation Plans
- Code Fixes
- Project Status & Milestones

---

## Current Issues
- 🚫 **BLOCKER**: Contact Enrichment Workflow - Apify Account Free Tier Limit (2025-10-30 - UPDATED)
  - Apify account has free tier limit restricting Lead Finder Actor to 19 free leads per run
  - Billing shows `chargedEventCounts.lead-fetched: 19` but `accountedChargedEventCounts.lead-fetched: 0` (not billed)
  - All technical fixes failed (memory parameters, node types, input formats)
  - Apify Console test returned 200+ contacts with same input (different account/plan)
  - **Solution**: Upgrade Apify account to paid plan or add credits ($0.002 per lead)
  - Blocks entire job application pipeline
  - See: Docs/daily-logs/2025-10-30-contact-enrichment-apify-troubleshooting.md

---

## Handover / Knowledge Transfer
Use these documents to understand session outcomes and next steps. Each entry includes a brief description and date.

- 2025-10-31 — **❌ CONTACT ENRICHMENT WORKSHOP SIMPLIFICATION - REVIEW FINDINGS (NO-GO)**
  - Description: Comprehensive review of Contact Enrichment Workshop simplification effort identified **2 CRITICAL CODE ISSUES** preventing testing. While architectural changes (node deletions and reconnections) were implemented correctly, code was accidentally pasted into wrong nodes during implementation. **Issue #1**: "Output Formatting Split By Job" node still has OLD CODE with chunk aggregation logic that references deleted "Domain chunker - 15 per batch" node (will fail at runtime). **Issue #2**: "Domain extraction and Apify input builder - 100 recs" node has WRONG CODE (output formatting instead of domain extraction). **Root Cause**: User accidentally pasted simplified "Output Formatting Split By Job" code into wrong node. **Key Discovery**: Apify Lead Finder Actor processes ALL domains in a single API call when using `{"0": {...}}` wrapper format, making chunking/batching architecture unnecessary. **Benefits Once Fixed**: 95 fewer lines of code, 2 fewer nodes, simpler architecture, same functionality.
  - Review Document: Docs/reviews/contact-enrichment-simplification-review-2025-10-31.md
  - Knowledge Transfer Document: Docs/handover/conversation-handover-knowledge-transfer.md (Section: Contact Enrichment Workshop Simplification - Review Findings)
  - Project Operations Manual: Docs/project-operations-manual.md (Section: Contact Enrichment Workshop Architecture Simplification)
  - Workflow ID: rClUELDAK9f4mgJx (Contact Enrichment Workshop)
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
  - Status: ❌ NO-GO - 2 critical code issues must be fixed before testing
  - Next Steps: (1) Fix "Output Formatting Split By Job" node code, (2) Fix "Domain extraction and Apify input builder - 100 recs" node code, (3) Save workflow, (4) Request AI review to verify fixes, (5) Test simplified workflow end-to-end

- 2025-10-30 — **🚫 CONTACT ENRICHMENT WORKFLOW - APIFY ACCOUNT FREE TIER LIMIT (BLOCKER - UPDATED)**
  - Description: After 5+ troubleshooting attempts, identified the root cause of why the Contact Enrichment Workflow consistently returns only 19 contacts instead of 200+. The issue is NOT with N8N configuration or actor parameters - it's an **Apify account free tier limit** that restricts the Lead Finder Actor to 19 free leads per run. **Critical Evidence**: Billing data shows `chargedEventCounts.lead-fetched: 19` but `accountedChargedEventCounts.lead-fetched: 0` (19 leads fetched but NOT billed = free tier). **All Technical Fixes Failed**: Memory parameters (6029, 6039), native Apify node (6058), dataset ID path (6061), excluding _metadata field (6067) - nothing changed the 19-contact result. **Apify Console Success**: Same input returned 200+ contacts in Console (different account/plan?). **Solution**: Upgrade Apify account to paid plan or add credits ($0.002 per lead, 200 leads = $0.40). **Alternative Solutions**: Use different service (Apollo.io, Hunter.io, RocketReach), implement 19-lead batch processing, or contact Apify support for higher free tier.
  - Daily Log: Docs/daily-logs/2025-10-30-contact-enrichment-apify-troubleshooting.md
  - Knowledge Transfer Document: Docs/handover/conversation-handover-knowledge-transfer.md (Section: Contact Enrichment Workflow - Apify Free Tier Limit)
  - Project Operations Manual: Docs/project-operations-manual.md (ISSUE-001: Apify Actor Returns Limited Results, BP-005: Apify Integration Best Practices)
  - Workflow ID: rClUELDAK9f4mgJx (Contact Enrichment Workshop)
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
  - Execution IDs: 6029, 6039, 6058, 6061, 6067 (all troubleshooting attempts)
  - Status: 🚫 BLOCKED - Apify account free tier limit
  - Next Steps: (1) Verify Apify account plan and limits, (2) Upgrade to paid plan or add credits, (3) Re-test Contact Enrichment Workshop, (4) Verify billing shows accountedChargedEventCounts > 0

- 2025-10-29 — **🔍 CONTACT ENRICHMENT FILTERING STRATEGY ANALYSIS: Multi-Contact Outreach Implementation**
  - Description: Successfully completed comprehensive analysis of the Contact Enrichment Workshop's filtering strategy to implement multi-contact outreach (3-5 contacts per job). **CRITICAL BUG IDENTIFIED**: The "Limit - 10" node is limiting to 10 contacts TOTAL across ALL jobs, not 10 contacts per job, causing only ~1 contact per job to be processed instead of the intended 3-5 contacts per job (75% reduction in email reach). **Root Cause**: N8N Limit node applies global limit, not per-job limit. **Available Metadata**: `seniorityLevel`, `functionalLevel`, `jobTitle` fields available for intelligent prioritization. **Optimal Node Location**: AFTER "Filter Verified Emails", BEFORE "If - Has a Domain1". **Recommended Solution**: (1) Remove "Limit - 10" node, (2) Add "Contact Prioritization & Limiting" node with scoring algorithm (seniority 0-100 + functional 0-20 + job title keywords 0-30), (3) Increase Lead Finder Actor `fetch_count` from 100 to 500. **Cost-Benefit**: +$0.32 per 10 jobs (+400% cost), but +40 emails per 10 jobs (+400% reach). **Implementation Time**: ~30 minutes (3 phases: remove node, add prioritization, test).
  - Daily Log: Docs/daily-logs/2025-10-29-contact-enrichment-filtering-strategy-analysis.md
  - Knowledge Transfer Document: Docs/handover/conversation-handover-knowledge-transfer.md (Section: Contact Enrichment Filtering Strategy Analysis)
  - Workflow ID: rClUELDAK9f4mgJx (Contact Enrichment Workshop)
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
  - Status: ✅ ANALYSIS COMPLETE - Ready for implementation
  - Next Steps: (1) Remove "Limit - 10" node, (2) Increase `fetch_count` to 500, (3) Add "Contact Prioritization & Limiting" node, (4) Test with pinned data

- 2025-10-29 — **✅ MILESTONE 4 COMPLETE: Compatibility Scoring Implementation + 5-Phase Incremental Testing Strategy**
  - Description: Successfully completed Milestone 4 (Compatibility Scoring Implementation) for the Job Matching Workshop. Fixed critical issue where Compatibility Score Validation node was outputting only 1 item instead of 123 items (99.2% data loss). **Root Cause**: Missing `mode: 'runOnceForEachItem'` configuration parameter + AI prompt contamination. **Fix**: (1) Configured node mode to "Run Once for Each Item" in N8N UI, (2) Updated AI Compatibility Scoring Agent prompt with explicit instructions to prevent N8N structure contamination. **Verification**: Execution 5876 confirmed 123 items → 12 approved jobs (≥70% compatibility). **Compatibility Scores**: Accurate scores ranging from 16% to 92% across all 123 jobs. **5-Phase Testing Strategy**: Approved incremental testing approach (Phase 1: Job Discovery → Job Matching, Phase 2: Contact Enrichment, Phase 3: Resume Generation, Phase 4: Contact Tracking + Outreach Tracking, Phase 5: Full Orchestrator). **Timeline**: ~60-85 minutes for complete validation.
  - Knowledge Transfer Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Linear Ticket (Milestone 4): [1BU-467](https://linear.app/1builder/issue/1BU-467) - Milestone 4: Compatibility Scoring Implementation - Job Matching Workshop
  - Linear Ticket (Phase 1-5): Pending creation - Phase 1-5: Incremental Testing Strategy - Complete Pipeline Validation
  - Workflow ID: bpfuL3HjZuD27Ca3 (Job Matching Workshop)
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/bpfuL3HjZuD27Ca3
  - Execution ID: 5876 (post-fix validation)
  - Status: ✅ MILESTONE 4 COMPLETE - Ready for Phase 1-5 incremental testing
  - Next Steps: (1) Update Linear ticket 1BU-467 to "Complete", (2) Create new Linear ticket for Phase 1-5 testing, (3) Begin Phase 1 testing (Job Discovery → Job Matching integration)

- 2025-10-28 — **🔴 CRITICAL FINDING: N8N Microsoft Outlook Node Does NOT Support Personal Microsoft Accounts**
  - Description: **BLOCKER DISCOVERED** - Microsoft Graph API's `Mail.Send` permission does NOT work with personal Microsoft accounts (Outlook.com, Hotmail, Microsoft 365 Family). N8N's Microsoft Outlook node uses Microsoft Graph API, which ONLY supports organizational accounts (Microsoft 365 Business/Enterprise with Azure AD). **Root Cause**: When attempting OAuth2 authentication with personal account (dachevivo@outlook.com), Microsoft rejects with error "You can't sign in here with a personal account. Use your work or school account instead." This is a fundamental Microsoft Graph API limitation, NOT a configuration error. **Evidence**: Microsoft official documentation confirms "Delegated (personal Microsoft account): Mail.Send - Not available". **Impact**: All 6 Microsoft 365 Family Outlook.com accounts CANNOT be used with N8N Microsoft Outlook node. **Solution**: Switch to Gmail-only strategy - Gmail OAuth2 works perfectly with personal accounts and N8N Gmail node.
  - Critical Finding Document: Docs/implementation/Microsoft-Outlook-Personal-Account-Limitation.md
  - Status: 🔴 BLOCKER - Personal Microsoft accounts incompatible with N8N Microsoft Outlook node
  - Affected Accounts: All personal Microsoft accounts (Outlook.com, Hotmail, Live.com, Microsoft 365 Family)
  - Alternative Solution: Use Gmail accounts instead (Gmail OAuth2 fully supported for personal accounts)
  - Recommended Strategy: Gmail-only implementation (1-3 Gmail accounts = 100-300 emails/day)
  - Next Steps: (1) Abandon Microsoft Outlook.com strategy, (2) Switch to Gmail-only strategy, (3) Set up Gmail OAuth2 credentials, (4) Proceed with Gmail-only implementation plan

- 2025-10-28 — **Microsoft 365 Family Multi-Account Strategy: Scaling to 7 Email Accounts** [OBSOLETE - See Critical Finding Above]
  - Description: Strategic analysis for scaling email sending from 2 accounts (Gmail + Hotmail) to 7 accounts (Gmail + 6 Outlook.com from Microsoft 365 Family subscription). **⚠️ OBSOLETE**: This strategy is no longer viable due to Microsoft Graph API limitation - personal Microsoft accounts cannot use N8N Microsoft Outlook node. See critical finding above for details.
  - Strategy Document: Docs/implementation/Microsoft-365-Family-Multi-Account-Strategy.md [OBSOLETE]
  - Status: ⚠️ OBSOLETE - Personal Microsoft accounts incompatible with N8N Microsoft Outlook node
  - Replacement Strategy: Gmail-only implementation (see Outreach Tracking Email Sending Implementation Guide)

- 2025-10-28 — **Email Sending Implementation: Multi-Account Rotation with Daily Limit Enforcement**
  - Description: Comprehensive implementation plan for switching Outreach Tracking Workshop from Gmail drafts to actual email sending with Gmail + Hotmail account rotation, daily limit enforcement (100 emails/day per account = 200 total), random delays (30-90 seconds), and support for 3 parallel orchestrator campaigns. **Key Architecture**: Centralized email queue using Google Sheets for cross-workflow coordination, round-robin account selection for 50/50 distribution, and graceful queuing when daily limits reached. **Implementation Timeline**: 3 hours Day 1 (single-keyword setup) + 10 days warm-up (20→100 emails/day per account) + 4 days multi-keyword scaling (3 campaigns) = 14 days total to 200 emails/day production.
  - Implementation Guide (Part 1): Docs/implementation/Outreach-Tracking-Email-Sending-Implementation-Guide.md
  - Implementation Guide (Part 2): Docs/implementation/Outreach-Tracking-Email-Sending-Implementation-Guide-Part2.md
  - Quick Reference: Docs/implementation/Email-Sending-Quick-Reference.md
  - Workflow ID: Vp9DpKF3xT2ysHhx (Outreach Tracking Workshop)
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/Vp9DpKF3xT2ysHhx
  - Email Accounts: Gmail (dachevivo@gmail.com) + Hotmail (established, 20+ years)
  - Daily Limits: Day 1-2: 40 emails → Day 9-10: 200 emails (100 Gmail + 100 Hotmail)
  - New Nodes: 11 nodes added (Get Daily Limits, Check Daily Limits, Account Selector, Increment Counter, Random Delay, Provider Check, Send Gmail, Send Hotmail, Merge, Queue for Tomorrow, updated Status Update)
  - Architecture: Google Sheets email queue + round-robin rotation + daily limit enforcement + random delays
  - Phase 1: Single-keyword (SEO) warm-up (Days 1-10)
  - Phase 2: Multi-keyword scaling (Automation Specialist + GenAI Engineer) (Days 11-14)
  - Status: 📋 IMPLEMENTATION GUIDE COMPLETE - Ready to implement
  - Next Steps: (1) Set up Gmail + Hotmail OAuth credentials (30 min), (2) Create Google Sheets Email_Queue_Daily_Limits (15 min), (3) Add 11 new nodes to Outreach Tracking Workshop (2.5 hours), (4) Test with 2 emails (30 min), (5) Begin 10-day warm-up (Day 1: 40 emails)

- 2025-10-28 — Production Scaling Analysis: Multi-Keyword Campaign Architecture & Gmail Rate Limiting Strategy
  - Description: Comprehensive strategic planning session addressing three critical questions for scaling LinkedIn automation to production: (1) Production readiness assessment (95-98% ready, pending Google Sheets fix), (2) Gmail rate limiting strategy (15-20 day gradual ramp-up to 100 emails/day to avoid account suspension), (3) Multi-keyword workflow architecture (2-tier shared sub-workflow approach). **Key Architectural Decision**: Duplicate ONLY orchestrator + Job Discovery per keyword, share all other sub-workflows across ALL keywords. **Key Benefit**: Single point of fix - if one keyword campaign has an issue, fixing the shared sub-workflow automatically fixes it for ALL keywords (eliminates code duplication).
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Daily Log: Docs/daily-logs/2025-10-28-production-scaling-analysis-three-critical-questions.md
  - Strategy Document: Docs/strategy/multi-keyword-campaign-strategy.md
  - Linear Issue: [1BU-462](https://linear.app/1builder/issue/1BU-462/production-scaling-strategy-multi-keyword-campaign-architecture-and) (In Progress)
  - Architecture: 2-tier shared sub-workflows (orchestrator + Job Discovery per keyword, 5 shared sub-workflows)
  - Production Readiness: 95-98% (pending Google Sheets fix in Contact Tracking Workshop)
  - Gmail Strategy: Gradual ramp-up over 15-20 days (10 → 15 → 20 → ... → 100 emails/day)
  - Multi-Keyword Timeline: 80 minutes per keyword, 4 hours for 3 keywords (SEO, Automation Specialist, GenAI Engineer)
  - Target: 300 emails/day across 3 keywords by Week 4
  - Status: ✅ STRATEGIC PLANNING COMPLETE - Ready for implementation
  - Next Steps: (1) Fix Contact Tracking Workshop Google Sheets issue (1-2 hours), (2) Set up email authentication (SPF, DKIM, DMARC) (1-2 hours), (3) Switch Outreach Tracking from draft to send (5 minutes), (4) Begin Gmail rate limiting ramp-up (Week 1)

- 2025-10-28 — Orchestrator Workflow Verification & Resume Generation Fix
  - Description: Successfully resolved critical bug in orchestrator workflow where Resume Generation Workshop Execute Workflow node was only triggering 1 sub-workflow execution instead of 6. Root cause: Missing explicit `mode: "each"` parameter. After implementing fix, conducted comprehensive end-to-end verification of orchestrator execution 5779, confirming ZERO DATA LOSS across all 6 jobs through entire pipeline (Contact Enrichment → Filter → Resume Generation → Contact Tracking → Outreach Tracking). All 6 Gmail drafts successfully created with customized resumes achieving 89% ATS score and 92% relevance score.
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Daily Log: Docs/daily-logs/2025-10-28-orchestrator-workflow-verification.md
  - Linear Issue: [1BU-461](https://linear.app/1builder/issue/1BU-461/resolved-resume-generation-workshop-only-triggering-1-sub-workflow) (Done)
  - Workflow ID: fGpR7xvrOO7PBa0c (Orchestrator)
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/fGpR7xvrOO7PBa0c
  - Key Node: "Resume Generation Workshop" Execute Workflow node (ID: 19aaecd6-e948-43d1-ba6d-47b5bbc5c7d5)
  - Fix Applied: Added explicit `mode: "each"` parameter to Execute Workflow node configuration
  - Verification Results: 6 jobs processed, 6 Resume Generation executions (5780-5785), 6 Gmail drafts created (5792-5797), 100% success rate
  - Performance: ~62 seconds per resume, 10 minutes total pipeline duration, 89% ATS score, 92% relevance score
  - Known Issues: (1) Contact Tracking Workshop Google Sheets operation failures (non-blocking), (2) Potential resume customization duplication (low priority)
  - Status: ✅ ORCHESTRATOR WORKFLOW PRODUCTION-READY - Data ready to be pinned for downstream testing
  - Next Steps: (1) Investigate Contact Tracking Workshop Google Sheets issue, (2) Pin Outreach Tracking output data for testing, (3) Optionally investigate resume customization duplication

- 2025-10-27 — Contact Enrichment Workshop Apify Parameter Validation Fix
  - Description: Successfully debugged and resolved Apify Lead Finder Actor "Bad Request" parameter validation errors in Contact Enrichment Workshop. Two cascading errors fixed: (1) Case sensitivity - parameter values must be lowercase (not Title Case), (2) Incorrect abbreviation - "hr" must be "human_resources" (full term, not abbreviation). After analyzing execution data from multiple test runs (Execution IDs: 5540, 5542, 5544), identified that Apify API strictly enforces lowercase parameter values and full term names for seniority_level and functional_level parameters.
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Daily Log: Docs/daily-logs/2025-10-27-contact-enrichment-apify-parameter-fix.md
  - Linear Issue: [1BU-460](https://linear.app/1builder/issue/1BU-460) (Done)
  - Workflow ID: rClUELDAK9f4mgJx
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
  - Key Node: "Domain extraction and Apify input builder - 100 recs" (ID: 65d4f583-d2ee-4fb3-b5f0-5539842ca824)
  - Errors Fixed: #1 Case sensitivity (seniority_level), #2 Incorrect abbreviation (functional_level)
  - Corrected Parameters: seniority_level: ["c_suite", "vp", "director", "head", "manager"], functional_level: ["marketing", "human_resources", "c_suite"]
  - Expected Results: ~100 high-quality contacts per run, 96% cost savings ($6.00+ → $0.25), decision-makers only
  - Status: ✅ PARAMETER VALIDATION FIXED - Ready for testing
  - Next Steps: (1) Update node code with corrected functional_level parameter, (2) Test workflow by executing LinkedIn Orchestrator, (3) Verify no API errors, (4) Confirm ~100 contacts returned

- 2025-10-27 — Resume Generation Workshop Keyword Extraction Failure
  - Description: Attempted to fix critical keyword extraction issue where AI Resume Customization node extracts keywords from candidate's base resume instead of target job description. Successfully fixed AI output inconsistency (temperature=0.0), but keyword extraction fix (prompt restructuring) COMPLETELY FAILED (0% success rate). Root cause: Fundamental prompt architecture flaw - AI has access to both sources simultaneously. Recommended solution: Implement two-stage prompt architecture (70% confidence).
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Daily Log: Docs/daily-logs/2025-10-27-resume-generation-keyword-extraction-troubleshooting.md
  - Workflow ID: zTtSVmTg3UaV9tPG
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/zTtSVmTg3UaV9tPG
  - Key Node: "AI Resume Customization" (ID: 05670670-fdb3-421e-9b9e-af04797024c9)
  - Fixes Applied: #1 Temperature=0.0 (✅ SUCCESS), #2 Prompt restructuring (❌ FAILED - 0% success), #3 Workflow validation fix (✅ SUCCESS)
  - Test Result: Resume for "Data Entry Assistant" contains 100% technical keywords (JavaScript, AWS, Angular) and 0% administrative keywords (data entry, attention to detail)
  - Status: ❌ BROKEN - Two-stage prompt architecture required
  - Next Steps: (1) Add "Keyword Extraction from Job Description" node, (2) Modify "AI Resume Customization" node to accept keywords as input, (3) Test with "Data Entry Assistant" job, (4) If fails, try Claude 3.5 Sonnet
  - Backup: N8N workflow backup complete (83 workflows cataloged) - Docs/backups/workflows/2025-10-27/

- 2025-10-26 — Contact Enrichment Workshop NeverBounce API Throttling Issue Resolution
  - Description: Diagnosed and resolved three sequential errors in Contact Enrichment Workshop NeverBounce polling logic. Root cause discovered: NeverBounce API throttling (10/10 active processing lists at account limit). Provided complete code fixes with throttle error handling (Version 5.4.0-throttle-handling). Workflow execution BLOCKED until NeverBounce jobs complete or account upgraded.
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Workflow ID: rClUELDAK9f4mgJx
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
  - Key Nodes: "Output Formatting Split By Job" (Version 3.2.1-complete-fix), "NeverBounce Poll And Retreive Results" (Version 5.4.0-throttle-handling)
  - Errors Fixed: #1 "Unexpected end of input [line 30]", #2 "running. Please wait longer and try again", #3 "Unexpected token '}' [line 9]", #4 "No job_id received from HTTP Request node"
  - Root Cause: NeverBounce API throttling - account at 10/10 active processing lists limit
  - Status: 🚫 BLOCKED - Code fixes complete, waiting for NeverBounce throttle resolution
  - Next Steps: (1) Check NeverBounce dashboard for completed jobs, (2) Apply Version 5.4.0-throttle-handling code, (3) Test workflow execution

- 2025-10-24 — NeverBounce Batch Verification Troubleshooting and Fix
  - Description: Comprehensive troubleshooting session for JSON validation errors in NeverBounce batch verification implementation. Root cause identified: Content Type field had `=json` instead of `json`, causing N8N to evaluate as expression instead of literal value. Documented complete troubleshooting journey including sequential errors (syntax error → validation error), N8N expression syntax rules, and Hybrid Architecture implementation (HTTP Request + Code node).
  - Document: Docs/daily-logs/2025-10-24-neverbounce-batch-verification-troubleshooting.md
  - Linear Issue: [1BU-454](https://linear.app/1builder/issue/1BU-454) (In Progress - Ready for Testing)
  - Workflow ID: rClUELDAK9f4mgJx
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
  - Key Nodes: "HTTP Request - Neverbounce", "NeverBounce poll And retreive Results", "Filter Verified Emails"
  - Critical Fix: Content Type field MUST be `json` (not `=json`) - literal value, not expression
  - Status: ✅ Root Cause Identified - ⏳ Awaiting User Implementation (Content Type fix)

- 2025-10-24 — Contact Enrichment Workshop Simplified Batch Processing Architecture
  - Description: Diagnosed and fixed critical batch processing architecture issue where redundant nodes and incorrect execution mode were breaking batch processing efficiency. Consolidated "Company Domain Processing" and "Build Lead Finder Input" into single "Domain Extraction & Apify Input Builder" node. Fixed critical configuration error: Mode MUST be "Run Once for All Items" (not "Run Once for Each Item") to enable batch processing. Reduced node count from 10 to 9 (10% reduction) while maintaining all functionality.
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Implementation Guide: Docs/implementation/Contact-Enrichment-Workshop-Complete-Implementation-Guide.md (PART 0 - SIMPLIFIED ARCHITECTURE)
  - Linear Issue: [1BU-454](https://linear.app/1builder/issue/1BU-454) (In Progress - Ready for Testing)
  - Workflow ID: rClUELDAK9f4mgJx
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
  - Key Changes: Consolidated 2 nodes into 1, fixed execution mode configuration, eliminated redundant code
  - Critical Fix: Mode MUST be "Run Once for All Items" for batch processing (1 API call vs 20 API calls)
  - Status: ✅ Architecture Simplified - ⏳ Ready for Testing

- 2025-10-23 — Contact Filtering Clarification and Implementation Planning
  - Description: Clarified business requirement for contact filtering: ONLY contacts with verified, valid emails (NeverBounce result = "valid") should proceed to downstream workflows. Diagnosed "Missing contactEmail" error and determined it was CORRECT behavior. Discarded previous fix analysis which incorrectly suggested including contact data for failed verifications. Confirmed implementation plan: Add IF node "Filter Valid Contacts Only" in Main Orchestrator workflow to drop contacts without verified emails at the contact level.
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Daily Log: Docs/daily-logs/2025-10-23-contact-filtering-clarification-and-planning.md
  - Implementation Guide: Docs/implementation/Contact-Enrichment-Workshop-Complete-Implementation-Guide.md (PART 6)
  - Linear Issue: [1BU-453](https://linear.app/1builder/issue/1BU-453) (In Progress - Ready for Implementation)
  - Main Orchestrator ID: fGpR7xvrOO7PBa0c
  - Main Orchestrator URL: https://n8n.srv972609.hstgr.cloud/workflow/fGpR7xvrOO7PBa0c
  - Status: ✅ Planning Complete - ⏳ Pending Implementation (needs IF node added to Main Orchestrator workflow)

- 2025-10-22 — Contact Enrichment Workshop IF Node Routing Fix
  - Description: Fixed critical timeout issue in Contact Enrichment Workshop by removing and recreating corrupted IF node. Root cause: Manual Merge node removal corrupted IF node internal routing state. Solution: Removed old IF node (ID: domain-check-filter), created new IF node (ID: domain-check-filter-new) using n8n_update_partial_workflow with 5 operations.
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Summary: Docs/handover/2025-10-22-contact-enrichment-if-node-fix-session-summary.md
  - Implementation Guide: Docs/implementation/Contact-Enrichment-Workshop-Complete-Implementation-Guide.md (PART 5)
  - Linear Issue: [1BU-453](https://linear.app/1builder/issue/1BU-453) (Backlog - Ready for Testing)
  - Workflow ID: rClUELDAK9f4mgJx
  - Workflow URL: https://n8n.srv972609.hstgr.cloud/workflow/rClUELDAK9f4mgJx
  - Status: ✅ Fix Applied - ⏳ Pending Testing (needs execution via Main Orchestrator to verify both TRUE and FALSE branches work correctly)

- 2025-10-20 — Career Site Job Listing Feed Actor Evaluation & N8N Workflow Duplication Strategy
  - Description: Comprehensive evaluation of Career Site Job Listing Feed actor (SUPPLEMENT recommendation). Created 5 documents (evaluation, integration guide, comparison matrix, duplication strategy, README). Analyzed N8N workflow duplication methods and sub-workflow reference behavior.
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Summary: Docs/handover/2025-10-20-career-site-actor-evaluation-conversation-summary.md
  - Linear Issues: [1BU-450](https://linear.app/1builder/issue/1BU-450) (Done), [1BU-451](https://linear.app/1builder/issue/1BU-451) (Todo), [1BU-452](https://linear.app/1builder/issue/1BU-452) (Todo)
  - Status: ✅ Analysis Complete - Ready for implementation testing

- 2025-10-15 — Contact Enrichment Workflow Apify API Error Resolution
  - Description: Resolved "Property input.jobsByDomain is not allowed" error by storing passthrough data in binary property instead of passthroughData. Workflow now executes successfully end-to-end (execution #4203). Documented reusable N8N binary data pattern for external API calls.
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md
  - Status: ✅ Complete - Workflow executing successfully

- 2025-01-10 — Job Matching Workflow Optimization & Batch Processing Implementation
  - Description: Contact Enrichment batch processing (99% cost savings), Job Matching simplification, Google Gemini HTTP Request workaround, AI Response Validation node creation
  - Document: Docs/daily-logs/2025-01-10-job-matching-workflow-optimization.md
  - Linear Issue: [1BU-449](https://linear.app/1builder/issue/1BU-449/continue-job-matching-workflow-implementation-ai-response-validation)
  - Status: 90% Complete - AI Response Validation error pending fix

- 2025-09-27 — Contact Tracking workflow debugging handover
  - Description: Root cause and exact fix for Google Sheets write failures; IF node count-based duplicate detection, wiring, tests
  - Document: Docs/handover/2025-09-27-contact-tracking-workflow-debugging-handover.md

- Conversation Handover — Knowledge Transfer (general)
  - Description: Central guide to conversation-based knowledge transfer and state handoff (UPDATED 2025-10-20)
  - Document: Docs/handover/conversation-handover-knowledge-transfer.md

---

## Patterns
Reusable patterns and best practices for N8N workflows and integrations.

- **N8N Binary Data Pattern for External API Calls** (2025-10-15)
  - Description: Store passthrough context data in binary property to prevent N8N from merging it into $json when calling external APIs with strict input schemas
  - Document: Docs/patterns/n8n-binary-data-pattern-for-external-apis.md
  - Use Case: Apify actors, Stripe API, SendGrid API, any external API with strict input validation
  - Status: ✅ Documented and tested in Contact Enrichment workflow

---

## Apify Actors Library
Comprehensive evaluations and documentation for Apify actors used in job discovery and contact enrichment workflows.

- **Job Discovery Actors** (2025-10-20)
  - Description: Job discovery actors for sourcing job postings from LinkedIn, company career pages, and other job platforms. Created to evaluate Career Site Job Listing Feed actor as alternative/supplement to LinkedIn job discovery.
  - Directory: Apify-Actors/Job-Discovery/
  - Actors Evaluated:
    - Career Site Job Listing Feed (fantastic-jobs/career-site-job-listing-feed) - ✅ SUPPLEMENT recommendation
  - Key Features: 125k+ company career sites, 37 ATS platforms, 2M+ active jobs, $0.0012 per job, 60+ fields per job
  - Status: ✅ Evaluation complete - Ready for implementation testing

- **Contact Enrichment Actors** (Existing)
  - Description: Actors for enriching contact information with email addresses, phone numbers, and LinkedIn profiles
  - Directory: Apify-Actors/
  - Actors Evaluated:
    - Lead Finder by Fatih Tahta (aihL2lJmGDt9XFCGg) - ✅ ADOPTED
    - Apollo Actor (jljBwyyQakqrL1wae) - Status unknown
    - Email & Phone Extractor (bxrabKhLv1c3fLmoj) - ❌ REJECTED (no job title filtering)

---

## Architecture
High-level and detailed architectural documentation.

- Directory: Docs/architecture/
  - Example: Docs/architecture/Merge-Node-Architecture-Specification.md
  - Example: Docs/architecture/outreach-tracking-architectural-gap-analysis.md

---

## Analysis & Strategy
Technical analysis documents and strategic planning for workflow optimization and integration.

- **Multi-Keyword Campaign Strategy** (2025-10-28)
  - Description: Strategic planning document for scaling LinkedIn automation to support multiple parallel job search campaigns targeting different keywords simultaneously. Documents the 2-tier shared sub-workflow architecture decision, implementation roadmap, naming conventions, and monitoring strategy. **Key Benefit**: Single point of fix - fix code once, applies to all keywords (eliminates code duplication).
  - Document: Docs/strategy/multi-keyword-campaign-strategy.md
  - Architecture: 2-tier approach (orchestrator + Job Discovery per keyword, 5 shared sub-workflows)
  - Target Keywords: SEO Specialist, Automation Specialist, GenAI Engineer (Phase 1)
  - Implementation Timeline: 80 minutes per keyword, 4 hours for 3 keywords
  - Target Volume: 300 emails/day across 3 keywords by Week 4
  - Status: ✅ Strategy approved - Ready for implementation

- **Contact Enrichment Workshop Batch Processing Analysis** (2025-10-21)
  - Description: Comprehensive analysis of Contact Enrichment Workshop sub-workflow (ID: rClUELDAK9f4mgJx) to implement NeverBounce batch email verification. Critical finding: Lead Finder Actor already uses batch processing, but NeverBounce verification is sequential (one email at a time), creating a bottleneck.
  - Document: Docs/analysis/Contact-Enrichment-Workshop-Batch-Processing-Analysis.md
  - Implementation Guide: Docs/implementation/Contact-Enrichment-Workshop-Batch-Processing-Implementation-Guide.md
  - Key Finding: NeverBounce sequential processing (600ms for 3 contacts). Target: Batch verification (250ms for 3 contacts, 58% faster, 99% cost reduction).
  - Status: ✅ Analysis complete - Ready for manual implementation
  - Performance Impact: 85% faster (2,000ms → 300ms for 10 contacts), 99% cost reduction ($0.08 → $0.0008 for 10 contacts)
  - Changes Required: Add 3 nodes (Filter, Batch Verify, Split), remove 5 nodes (2 IF, 1 HTTP, 2 NoOp), update 1 node (Merge)

- **LinkedIn Orchestrator Batch Processing Architecture Analysis** (2025-10-21) - SUPERSEDED
  - Description: [INCORRECT ANALYSIS] This analyzed the Main Orchestrator workflow (fGpR7xvrOO7PBa0c) instead of the Contact Enrichment Workshop sub-workflow. See "Contact Enrichment Workshop Batch Processing Analysis" above for correct analysis.
  - Document: Docs/analysis/LinkedIn-Orchestrator-Batch-Processing-Architecture-Analysis.md
  - Summary: Docs/analysis/LinkedIn-Orchestrator-Batch-Processing-Implementation-Summary.md
  - Status: ⚠️ SUPERSEDED - Incorrect workflow analyzed

- **N8N Workflow Duplication Strategy - Career Site Integration** (2025-10-20)
  - Description: Comprehensive analysis of N8N workflow duplication methods for integrating Career Site Job Listing Feed actor. Covers 5 duplication methods, sub-workflow reference behavior, step-by-step process, and risk assessment.
  - Document: Docs/analysis/N8N-Workflow-Duplication-Strategy-Career-Site-Integration.md
  - Key Finding: UI-based duplication is recommended (15-30 minutes, LOW risk). Duplicated orchestrator references SAME original sub-workflows (no automatic duplication).
  - Status: ✅ Analysis complete - Ready for implementation

---

## MCP Server Configuration
Configuration files and documentation for Model Context Protocol (MCP) servers used in the project.

- **N8N MCP Server Configuration** (2025-10-21)
  - Description: Standard MCP JSON configuration for N8N workflow automation server. Includes 39 tools (22 documentation + 17 management tools) for N8N workflow operations. Updated with valid API key (expires 2025-12-18).
  - Configuration File: claude_desktop_config.json
  - Documentation: N8N_MCP_SERVER_CONFIGURATION_UPDATED.md
  - N8N Instance: https://n8n.srv972609.hstgr.cloud
  - GitHub Repository: https://github.com/czlonkowski/n8n-mcp
  - Status: ✅ Configuration updated - Ready for MCP client integration
  - Key Features:
    - List, get, create, update, delete workflows
    - Execute workflows programmatically
    - Health check and connectivity monitoring
    - 535+ N8N node documentation database
    - 263 AI-capable nodes with examples

- **Additional MCP Server Documentation**
  - Setup Guide: N8N_MCP_SETUP_GUIDE.md
  - Installation Summary: N8N_MCP_INSTALLATION_SUMMARY.md
  - Connection Diagnostic: N8N_MCP_CONNECTION_DIAGNOSTIC.md
  - Smithery Test Guide: N8N_MCP_SMITHERY_TEST_GUIDE.md
  - Connection Test Results: n8n-mcp-connection-test.md

---

## Implementation Plans
Design docs and plans for implementing fixes or features.

- **Contact Enrichment Workshop Batch Processing Implementation** (2025-10-21)
  - Description: Comprehensive implementation guide for adding NeverBounce batch email verification to Contact Enrichment Workshop sub-workflow. Includes detailed justification, complete node inventory, step-by-step instructions, and visual diagrams.
  - **COMPREHENSIVE GUIDE**: Docs/implementation/Contact-Enrichment-Workshop-Complete-Implementation-Guide.md (2,228 lines)
    - PART 1: Architectural Justification (why remove 5 nodes)
    - PART 2: Complete Node Inventory (all 11 existing + 3 new nodes)
    - PART 3: Step-by-Step Implementation (11 detailed steps)
    - PART 4: Visual Flow Diagrams (6 Mermaid diagrams)
    - APPENDIX: Troubleshooting, performance metrics, cost calculator
  - Quick Guide: Docs/implementation/Contact-Enrichment-Workshop-Batch-Processing-Implementation-Guide.md (300 lines)
  - Workflow ID: rClUELDAK9f4mgJx (LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactEnrichment--Augment)
  - Changes Required: Add 3 nodes (Filter Verified Emails, NeverBounce Batch Verification, Split Batch Results), remove 5 nodes (2 IF, 1 HTTP, 2 NoOp), update 2 nodes (Merge, Output Formatting)
  - Estimated Time: 45-60 minutes
  - Performance Gain: 85% faster (2,000ms → 300ms for 10 contacts), 99% cost reduction ($0.08 → $0.0008)
  - Status: ✅ Ready for manual implementation in N8N UI

- **LinkedIn Orchestrator Batch Processing Implementation** (2025-10-21) - SUPERSEDED
  - Description: [INCORRECT IMPLEMENTATION] This guide was for the Main Orchestrator workflow (fGpR7xvrOO7PBa0c) instead of the Contact Enrichment Workshop sub-workflow. See "Contact Enrichment Workshop Batch Processing Implementation" above for correct guide.
  - Full Guide: Docs/implementation/LinkedIn-Orchestrator-Batch-Processing-Manual-Implementation-Guide.md
  - Quick Reference: Docs/implementation/LinkedIn-Orchestrator-Batch-Processing-Quick-Reference.md
  - Status: ⚠️ SUPERSEDED - Incorrect workflow targeted

- Directory: Docs/implementation/
  - Example: Docs/implementation/outreach-tracking-architectural-fix-checklist.md

---

## Code Fixes
Operational playbooks, node configuration details, and code samples.

### Recent Fixes (2025-10-01)
**Email Personalization Fixes for Outreach Tracking Workflow**

- **Implementation Summary**: Complete overview of all email personalization fixes
  - Document: Docs/fixes/IMPLEMENTATION-SUMMARY.md
  - Status: ⚠️ Pending user implementation (3 critical tasks)

- **Implementation Checklist**: Step-by-step guide for implementing all fixes
  - Document: Docs/pending-tasks/post-conversation-implementation-checklist.md
  - Estimated Time: 20 minutes
  - Priority: 🔴 CRITICAL

**Individual Fix Guides**:
1. **JavaScript Syntax Errors**:
   - Outreach Input Processing syntax error fix (Line 118)
     - Document: Docs/fixes/outreach-input-processing-syntax-error-fix.md
     - Code: Docs/fixes/outreach-input-processing-COMPLETE-FIXED-CODE.js
     - Status: ✅ Implemented by user

   - Template literal syntax error fix (Line 172)
     - Document: Docs/fixes/line-172-syntax-error-fix-explanation.md
     - Status: ✅ Implemented by user

2. **Gmail Draft Creation Issues**:
   - Draft Gmail trim() error diagnostic and fix
     - Document: Docs/fixes/draft-gmail-trim-error-diagnostic-fix.md
     - Code: Docs/fixes/resume-filename-customizer-FIXED-CODE.js
     - Status: ✅ Implemented by user

   - Complete Gmail draft fix guide (missing recipient, subject, body, attachment)
     - Document: Docs/fixes/gmail-draft-complete-fix-guide.md
     - Code: Docs/fixes/ai-email-generation-CORRECTED-PROMPT.txt
     - Status: ⚠️ Pending user implementation

3. **AI Email Signature Placeholder Fix**:
   - Signature placeholder replacement (Alice Wonderland → Ivo Dachev)
     - Document: Docs/fixes/signature-placeholder-fix-guide.md
     - Code: Docs/fixes/resume-filename-customizer-WITH-SIGNATURE-FIX.js
     - Status: ⚠️ Pending user implementation

**Key Lessons Learned**:
- N8N expression syntax: `{{ }}` (template mode) vs `${}` (JavaScript expression mode)
- N8N Code nodes use older JavaScript engine (ES5 compatibility required)
- AI models may generate placeholder content despite explicit instructions
- Always implement post-processing validation as a safety net

- Directory: Docs/code-fixes/
  - Example: Docs/code-fixes/Google-Sheets-Node-Configuration.md
  - Example: Docs/code-fixes/Simplified-Duplicate-Detection-Production.js

---

## Project Status & Milestones
Current status summaries and milestone tracking.

- Status: Docs/project-status/
  - Example: Docs/project-status/Contact-Tracking-5-Node-Architecture-Status.md
  - Example: Docs/project-status/Contact-Tracking-Duplicate-Detection-Fix-Status.md
- Milestones: Docs/project-milestones/
  - Example: Docs/project-milestones/contact-tracking-workflow-success-documentation.md
- **Job Application Progress Tracker**: Docs/tracking/job-application-progress-tracker.md
  - Central file for monitoring the status of all job applications and workshop workflows
  - Last Updated: 2025-10-27
  - Current Status: Resume Generation Workshop BROKEN (keyword extraction failure)
- **N8N Workflow Backups**: Docs/backups/
  - **README**: Docs/backups/README.md - Complete guide to requesting and managing backups
  - **Backup Directory**: Docs/backups/workflows/YYYY-MM-DD/ - Timestamped backup directories
  - **How to Request**: Ask AI agent using templates in README (e.g., "Run a full N8N workflow backup")
  - **Backup Types**: Full, incremental, active-only, selective by category
  - **Output Files**: Individual workflow JSON files, backup index, summary, and log
  - **Last Backup**: 2025-10-27 (9 workflows backed up, 74 remaining)

---

## 5. Quality Analysis and Testing

### Quality Issues Documentation
- **LinkedIn Automation Quality Issues (Oct 28, 2025)**: `Docs/quality-analysis/linkedin-automation-quality-issues-2025-10-28.md`
  - Comprehensive analysis of system quality failures discovered during Phase 1 email draft testing
  - Root cause: Job Matching Workshop not calculating compatibility scores (only validates job posting quality)
  - Evidence: Pinned test data proves issues existed in both Gmail and Outlook tests (system was always broken)
  - Impact: 70% of jobs are mismatched (<20% compatibility), 99%+ rejection rate expected if deployed to production
  - Key Finding: Previous "95% success" assessment only measured technical execution (drafts created), not content quality
  - Status: ⛔ PRODUCTION DEPLOYMENT BLOCKED until critical issues resolved
  - Linear Tickets: 1BU-463 (Job Matching), 1BU-464 (Resume Generation), 1BU-465 (Testing Framework)

### Testing Framework
- **Testing Criteria Framework**: `Docs/testing/linkedin-automation-testing-criteria.md`
  - 3-tier evaluation framework: Technical Execution + Content Quality + Production Readiness
  - Comprehensive checklist for validating system outputs before production deployment
  - **Tier 1: Technical Execution** - Workflow status, node execution, error count, data flow validation
  - **Tier 2: Content Quality** - Job compatibility ≥80%, resume quality (no keyword stuffing), email tone (confident, not defensive)
  - **Tier 3: Production Readiness** - 4 critical quality gates with YES/NO answers:
    1. Would you actually send this email?
    2. Would this get a response?
    3. Does this represent the candidate professionally?
    4. Is this better than a manual application?
  - **Decision Rule**: If ANY item in Production Readiness is "NO", system FAILS
  - "Would you send this?" test as final quality gate
  - Testing workflow: Phase 1 (Technical) → Phase 2 (Content Quality) → Phase 3 (Production Readiness) → Phase 4 (Batch Testing)

### Analysis Reports
- **Job Matching Failure Analysis (Oct 28, 2025)**: `Docs/analysis/job-matching-failure-analysis-2025-10-28.md`
  - Investigation of N8N execution ID 5858 (Main Orchestrator workflow)
  - Analysis of 10 sample jobs from Job Matching Workshop output:
    - 7 jobs (70%): Completely mismatched (<20% compatibility) - Should be REJECTED
    - 1 job (10%): Borderline match (40-50% compatibility) - Should be REJECTED
    - 2 jobs (20%): Strong match (80-90% compatibility) - Should be APPROVED
  - **Critical Finding**: Job Matching Workshop output missing compatibility scoring fields:
    - `compatibilityScore` (0-100)
    - `domainMatch` (technical vs marketing vs other)
    - `skillsOverlap` (percentage of required skills candidate has)
    - `experienceLevelMatch` (entry vs mid vs senior vs lead)
    - `compatibilityReasoning` (explanation of score)
  - **Actual Behavior**: 100% approval rate for all legitimate postings (regardless of compatibility)
  - **Expected Behavior**: 20-30% approval rate (only jobs with ≥80% compatibility)
  - Recommended fixes: Implement compatibility scoring algorithm with ≥80% threshold
  - Workflow ID: bpfuL3HXvMKWJsvrS (Job Matching Scoring Workshop)
  - Status: ⛔ CRITICAL - Compatibility scoring algorithm NOT IMPLEMENTED

---

## Documentation Conventions
- This README-index.md is the main index. All documentation should reference this file for navigation.
- Keep entries concise here; place full content in the linked documents.
- When adding new docs, update this index with:
  1) A short description
  2) A direct path link
  3) Date/context for quick discovery

Back to top: README-index.md

