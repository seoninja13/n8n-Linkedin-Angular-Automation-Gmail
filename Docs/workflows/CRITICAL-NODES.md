# Critical Workflow Nodes Reference

Key nodes in the Outreach Tracking workflow and other critical workflows.

## Outreach Tracking Workflow (WUe4y8iYEXNAB6dq)

**Purpose**: Email routing, draft creation, and email delivery
**Type**: Sub-workflow (triggered by orchestrators)
**URL**: https://n8n.srv972609.hstgr.cloud/workflow/WUe4y8iYEXNAB6dq

---

### Key Nodes

#### 1. Dynamic Priority-Based Account Selector

**Type**: Code Node
**Purpose**: Select email account based on priority and daily limits

**Inputs**:
- Contact data (firstName, lastName, email)
- Job data (title, company)
- Email content (subject, body)

**Outputs**:
- `testMode` flag (boolean)
- `selectedAccount` (string: gmail-dachevivo, gmail-ivoddachev, etc.)
- Email data package

**Configuration Source**: Google Sheets ([Email-Account-Config](https://docs.google.com/spreadsheets/d/1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g))

**Account Priority**:
1. gmail-dachevivo (10/day)
2. gmail-ivoddachev (3/day)
3. gmail-ivodachevd (3/day)
4. Outlook accounts (DISABLED due to rate limits)

---

#### 2. Test Mode Router (Switch)

**Type**: Switch Node
**Purpose**: Route to Draft Creation or Email Sending based on testMode

**Routing Rules**:
- **Output 0** (testMode=TRUE): → Draft Creation Router
- **Output 1** (testMode=FALSE): → 6-Account Email Router

**Critical**: Routing rules are case-sensitive and whitespace-sensitive
- Trailing newlines break routing
- Exact match required

**Data Flow**:
```
Dynamic Priority-Based Account Selector
    ↓ (outputs: testMode + selectedAccount + email data)
Test Mode Router (Switch)
    ├─ Output 0 (testMode=TRUE) → Draft Creation Router
    └─ Output 1 (testMode=FALSE) → 6-Account Email Router
```

---

#### 3. Draft Creation Router (Switch)

**Type**: Switch Node
**Purpose**: Route to correct Gmail draft creation node based on selectedAccount

**Routing Rules**:
- gmail-dachevivo → Gmail - dachevivo - Draft
- gmail-ivoddachev → Gmail - ivoddachev - Draft
- gmail-ivodachevd → Gmail - ivodachevd - Draft
- (3 more Outlook accounts - DISABLED)

**Outputs**: 6 outputs (one per account)

---

#### 4. Draft Creation Nodes (Gmail)

**Nodes**:
- Gmail - dachevivo - Draft (ID: `2e363c08-82d6-435b-bf0a-f7c90ca2706f`)
- Gmail - ivoddachev - Draft (ID: `0a6ac39a-9760-47d9-ac4c-0d57bd941a6f`)
- Gmail - ivodachevd - Draft (ID: `83490d5c-551f-4705-9aa9-71e2884f1fed`)

**Type**: HTTP Request Node
**Purpose**: Create draft emails in Gmail

**Critical Configuration**:
- **URL**: `https://gmail.googleapis.com/gmail/v1/users/me/drafts` ✅ CORRECT
- **NOT**: `/messages/send` ❌ WRONG
- **Method**: POST
- **Body**: `{ "message": { "raw": "<base64EncodedEmail>" } }`

**Common Issue** (2025-11-24):
- Draft nodes were using `/messages/send` endpoint
- This caused emails to be sent instead of drafts created
- Fix: Change URL to `/drafts` endpoint

---

#### 5. 6-Account Email Router (Switch)

**Type**: Switch Node
**Purpose**: Route to correct email send node based on selectedAccount

**Routing Rules**:
- gmail-dachevivo → Gmail Send (dachevivo)
- gmail-ivoddachev → Gmail Send (ivoddachev)
- gmail-ivodachevd → Gmail Send (ivodachevd)
- (3 more Outlook accounts - DISABLED)

**Outputs**: 6 outputs (one per account)

---

#### 6. Gmail MIME Builder

**Type**: Code Node (likely)
**Purpose**: Construct MIME messages for Gmail API

**Functionality**:
- Builds RFC 2822 formatted email
- Includes headers (From, To, Subject)
- Encodes body as quoted-printable or base64
- Attaches resume PDF (binary data)
- Base64 encodes final message

**Example Output**:
```
From: Ivo Dachev <dachevivo@gmail.com>
To: contact@example.com
Subject: Application for Senior Engineer

<email body>

--boundary
Content-Type: application/pdf
Content-Disposition: attachment; filename="resume.pdf"

<base64 encoded PDF>
```

---

#### 7. Aggregate Email Metrics

**Type**: Merge Node
**Purpose**: Merge point for all email paths (drafts + sends)

**Inputs**: All 6 draft creation nodes + all 6 send nodes
**Output**: Aggregated email metrics for tracking

**Configuration**:
- Mode: "Wait for all incoming messages"
- Ensures all email paths complete before proceeding

---

#### 8. Email Tracking Dashboard (Google Sheets)

**Type**: Google Sheets Node (v4.7)
**Purpose**: Update tracking spreadsheet with email sent data

**Critical Configuration** (Common Bug):
- **`resource`**: Must be set to `"sheet"`
- **`operation`**: Must be set (e.g., `"append"`, `"update"`)
- **N8N v4.7 Bug**: Serialization sometimes drops `resource` parameter

**Fix Procedure**:
1. Open node in N8N UI
2. Re-select `resource` dropdown (even if it looks correct)
3. Re-select `operation` dropdown
4. Save workflow

**Watch for**: "Could not get parameter" errors

---

## Critical Fix Locations

### 1. Draft Node Endpoint Fix (2025-11-24)

**Nodes Fixed**:
- Gmail - dachevivo - Draft
- Gmail - ivoddachev - Draft
- Gmail - ivodachevd - Draft

**Change**:
```json
// BEFORE (❌ WRONG)
{
  "url": "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
  "body": { "raw": "..." }
}

// AFTER (✅ CORRECT)
{
  "url": "https://gmail.googleapis.com/gmail/v1/users/me/drafts",
  "body": { "message": { "raw": "..." } }
}
```

---

### 2. 4-Account Email Router Switch Rules

**Critical**: Routing rules must match EXACTLY

**Common Issues**:
- Trailing newlines in routing values
- Case sensitivity
- Whitespace differences

**Verification**:
```powershell
.\check-draft-router-params.ps1
```

**Fix**:
- Copy/paste routing values from working nodes
- Check for hidden characters (Ctrl+A in editor)
- Verify case matches exactly

---

## Related Workflows

### SEO Orchestrator (gB6UEwFTeOdnAHPI)

**Calls**: Outreach Tracking as sub-workflow
**Schedule**: Daily 04:30 AM PST
**Keywords**: SEO-focused job search terms

### GenAI Orchestrator (B2tNNaSkbLD8gDxw)

**Calls**: Outreach Tracking as sub-workflow
**Schedule**: Daily 05:00 AM PST
**Keywords**: Gen AI-focused job search terms

### Contact Enrichment (rClUELDAK9f4mgJx)

**Type**: Sub-workflow
**Purpose**: Enrich contact data (firstName, lastName, email)
**Called By**: Both orchestrators

---

## Troubleshooting Guide

### Draft Emails Being Sent Instead

**Symptoms**:
- testMode=TRUE but emails sent
- Drafts not appearing in Gmail

**Root Cause**: Draft nodes using `/messages/send` endpoint

**Fix**: Change URL to `/drafts` endpoint (see Critical Fix #1)

**Verify**:
```powershell
.\verify-draft-fix.ps1
```

---

### Routing Not Working

**Symptoms**:
- Emails always go to same account
- Wrong account selected

**Root Cause**: Switch node routing rules mismatch

**Fix**: Re-enter routing values exactly (see Critical Fix #2)

**Verify**:
```powershell
.\check-draft-router-outputs.ps1
```

---

### Google Sheets "Could not get parameter"

**Symptoms**:
- Workflow fails at Email Tracking Dashboard node
- Error: "Could not get parameter 'resource'"

**Root Cause**: N8N v4.7 serialization bug

**Fix**:
1. Open Email Tracking Dashboard node
2. Re-select `resource` dropdown → "Sheet"
3. Re-select `operation` dropdown → "Append"
4. Save workflow

---

## Architecture Documentation

**For detailed architecture**:
- [dual-path-test-mode-architecture.md](../architecture/dual-path-test-mode-architecture.md)
- [shared-sub-workflow-architecture.md](../architecture/shared-sub-workflow-architecture.md)

**For troubleshooting**:
- [COMMON-ERRORS-KNOWN-ISSUES.md](../troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md)

## Last Updated

2025-11-24 (after Draft Mode fix)
