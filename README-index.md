# Augment Agent Documentation Index (Central Navigation)

This is the single, authoritative entry point for all project documentation. Every document should link back here for navigation continuity.

Last updated: 2025-01-10

---

## Quick Links
- Handover / Knowledge Transfer docs
- Architecture
- Implementation Plans
- Code Fixes
- Project Status & Milestones

---

## Handover / Knowledge Transfer
Use these documents to understand session outcomes and next steps. Each entry includes a brief description and date.

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

---

## Documentation Conventions
- This README-index.md is the main index. All documentation should reference this file for navigation.
- Keep entries concise here; place full content in the linked documents.
- When adding new docs, update this index with:
  1) A short description
  2) A direct path link
  3) Date/context for quick discovery

Back to top: README-index.md

