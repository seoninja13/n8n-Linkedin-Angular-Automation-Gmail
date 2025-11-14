# Shared Sub-workflow Architecture
**LinkedIn Automation Project - Orchestrator and Sub-workflow Relationships**  
**Last Updated**: 2025-11-14  
**Status**: ✅ PRODUCTION

---

## 📋 **OVERVIEW**

The LinkedIn automation system uses a modular "General Contractor + Specialized Subcontractors" architecture where orchestrator workflows delegate specialized tasks to sub-workflows. This document defines which sub-workflows are **SHARED** (used by multiple orchestrators) vs **SEPARATE** (dedicated to specific orchestrators).

---

## 🏗️ **ORCHESTRATOR WORKFLOWS**

### **1. LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment**

**Workflow ID**: gB6UEwFTeOdnAHPI  
**URL**: https://n8n.srv972609.hstgr.cloud/workflow/gB6UEwFTeOdnAHPI  
**Purpose**: SEO keyword campaign automation  
**Schedule**: Daily at 04:30 AM PST (12:30 PM UTC)  
**Status**: ✅ ACTIVE

**Sub-workflows Used**:
- Job Discovery: LinkedIn-SEO-sub-flow-Workshop-JobDiscovery--Augment (SEPARATE)
- Job Matching: LinkedIn-4-GmailOutlook-sub-flow-Workshop-JobMatching--Augment (SHARED)
- Contact Enrichment: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ContactEnrichment--Augment (SHARED)
- Resume Generation: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ResumeGeneration--Augment (SHARED)
- Outreach Tracking: LinkedIn-4-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment (SHARED)
- Contact Tracking: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ContactTracking--Augment (SHARED)

### **2. LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment**

**Workflow ID**: B2tNNaSkbLD8gDxw  
**URL**: https://n8n.srv972609.hstgr.cloud/workflow/B2tNNaSkbLD8gDxw  
**Purpose**: Gen AI keyword campaign automation  
**Schedule**: Daily at 05:00 AM PST (01:00 PM UTC)  
**Status**: ✅ ACTIVE

**Sub-workflows Used**:
- Job Discovery: LinkedIn-GenAI-sub-flow-Workshop-JobDiscovery--Augment (SEPARATE)
- Job Matching: LinkedIn-4-GmailOutlook-sub-flow-Workshop-JobMatching--Augment (SHARED)
- Contact Enrichment: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ContactEnrichment--Augment (SHARED)
- Resume Generation: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ResumeGeneration--Augment (SHARED)
- Outreach Tracking: LinkedIn-4-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment (SHARED)
- Contact Tracking: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ContactTracking--Augment (SHARED)

---

## 🔗 **SHARED SUB-WORKFLOWS**

### **1. Outreach Tracking Workshop** ⭐ CRITICAL

**Workflow Name**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment  
**Workflow ID**: WUe4y8iYEXNAB6dq  
**URL**: https://n8n.srv972609.hstgr.cloud/workflow/WUe4y8iYEXNAB6dq  
**Status**: ✅ ACTIVE (shared by both orchestrators)

**Used By**:
- LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment (gB6UEwFTeOdnAHPI)
- LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment (B2tNNaSkbLD8gDxw)

**Key Features**:
- 4-Account Email Router Switch node (gmail, outlook1, outlook2, outlook3)
- Weighted round-robin allocation (65.4% Gmail, 11.5% each Outlook)
- Modulo 26 counter logic
- Gmail MIME Builder for API-based sending
- 3 Microsoft Outlook nodes for draft creation
- Email metrics aggregation
- Google Sheets tracking dashboard integration

**Critical Nodes**:
- "4-Account Email Router" Switch node (ID: 4account-email-router-switch)
- "Weighted Round-Robin Account Selector (80/20)" Code node
- "Gmail MIME Builder" Code node
- "Gmail API Send" HTTP Request node
- "Inbox Outlook", "dachevivo2@outlook", "dachevivo3@outlook.com" Microsoft Outlook nodes

**Recent Fixes**:
- 2025-11-13: Removed trailing newline characters from Gmail routing rule (`"rightValue": "gmail"`)
- Verified in execution #7850 (11 emails sent successfully)

### **2. Contact Enrichment Workshop**

**Workflow Name**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ContactEnrichment--Augment  
**Workflow ID**: rClUELDAK9f4mgJx  
**Status**: ✅ ACTIVE (shared by both orchestrators)

**Used By**:
- LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment
- LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment

**Key Features**:
- NeverBounce email verification (batch processing)
- Apify LinkedIn contact extraction
- Verified contacts filtering (verifiedCount > 0)
- Output formatting with contact data

### **3. Resume Generation Workshop**

**Workflow Name**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ResumeGeneration--Augment  
**Workflow ID**: zTtSVmTg3UaV9tPG  
**Status**: ✅ ACTIVE (shared by both orchestrators)

**Used By**:
- LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment
- LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment

**Key Features**:
- AI-powered resume customization (80-90% keyword alignment)
- Google Docs resume generation
- PDF export via Google Drive
- Job-specific keyword extraction

### **4. Job Matching Workshop**

**Workflow Name**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-JobMatching--Augment  
**Status**: ✅ ACTIVE (shared by both orchestrators)

**Used By**:
- LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment
- LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment

**Key Features**:
- AI-powered job matching
- Qualification scoring
- Job filtering based on criteria

### **5. Contact Tracking Workshop**

**Workflow Name**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-ContactTracking--Augment  
**Status**: ✅ ACTIVE (shared by both orchestrators)

**Used By**:
- LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment
- LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment

**Key Features**:
- Google Sheets integration for contact tracking
- Duplicate detection via dedupeKey
- Application status tracking

---

## 🔀 **SEPARATE SUB-WORKFLOWS**

### **1. SEO Job Discovery Workshop**

**Workflow Name**: LinkedIn-SEO-sub-flow-Workshop-JobDiscovery--Augment  
**Used By**: LinkedIn-SEO-4-GmailOutlook-Orchestrator--Augment ONLY

**Purpose**: Discover jobs using SEO-related keywords (e.g., "SEO", "Search Engine Optimization")

### **2. Gen AI Job Discovery Workshop**

**Workflow Name**: LinkedIn-GenAI-sub-flow-Workshop-JobDiscovery--Augment  
**Used By**: LinkedIn-GenAI-4-GmailOutlook-Orchestrator--Augment ONLY

**Purpose**: Discover jobs using Gen AI-related keywords (e.g., "Generative AI", "LLM", "ChatGPT")

---

## ✅ **BENEFITS OF SHARED ARCHITECTURE**

1. **Automatic Synchronization**: Any fix or update to a shared sub-workflow automatically applies to all orchestrators that use it
2. **Consistent Behavior**: All campaigns use the same logic for contact enrichment, resume generation, and outreach tracking
3. **Reduced Maintenance**: Single source of truth for shared functionality
4. **Easier Testing**: Test once, deploy everywhere
5. **Lower Risk**: Changes to shared sub-workflows are tested across multiple campaigns

---

## ❌ **DEPRECATED WORKFLOWS**

### **LinkedIn-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment**

**Workflow ID**: Vp9DpKF3xT2ysHhx  
**Status**: ❌ DEPRECATED (old 2-account architecture)  
**Reason**: Replaced by 4-account architecture (WUe4y8iYEXNAB6dq)

**Architecture Differences**:
- OLD: 2 email accounts (1 Gmail + 1 Outlook), If node routing, modulo 5 counter
- NEW: 4 email accounts (1 Gmail + 3 Outlook), Switch node routing, modulo 26 counter

**Migration Status**: ✅ COMPLETE - All orchestrators upgraded to use WUe4y8iYEXNAB6dq

---

## 📝 **NAMING CONVENTION**

**Shared Sub-workflows**: Include "4-GmailOutlook" in the name to indicate 4-account architecture  
**Example**: LinkedIn-4-GmailOutlook-sub-flow-Workshop-OutreachTracking--Augment

**Separate Sub-workflows**: Include campaign-specific prefix (SEO, GenAI, etc.)  
**Example**: LinkedIn-SEO-sub-flow-Workshop-JobDiscovery--Augment

---

## 🎯 **SYNCHRONIZATION RULES**

1. **Shared Sub-workflows**: Changes automatically apply to all orchestrators → NO manual synchronization needed
2. **Separate Sub-workflows**: Changes must be manually synchronized if needed across campaigns
3. **Critical Fixes**: Always verify which orchestrators use the affected sub-workflow before applying fixes

---

## 📚 **RELATED DOCUMENTATION**

- Knowledge Transfer: `Docs/handover/conversation-handover-knowledge-transfer.md`
- Daily Log: `Docs/daily-logs/2025-11-14-switch-node-synchronization-cron-jobs.md`
- Multi-Keyword Campaign Strategy: `Docs/architecture/multi-keyword-campaign-implementation-strategy.md`

