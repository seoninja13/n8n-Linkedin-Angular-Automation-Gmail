# Dual-Path Test Mode Architecture - Complete Implementation Guide

## Overview
This guide provides complete step-by-step instructions for implementing the dual-path test mode architecture in the N8N LinkedIn automation workflow.

## Architecture Summary

```
Dynamic Priority-Based Account Selector (v7.0)
    ↓
Test Mode Router (Switch)
    ├─ Output 0 (testMode=TRUE) → Draft Creation Router (Switch)
    │                                  ├─ Output 0 → Gmail MIME Builder (Draft) - dachevivo → Gmail Draft - dachevivo
    │                                  ├─ Output 1 → Gmail MIME Builder (Draft) - ivoddachev → Gmail Draft - ivoddachev
    │                                  ├─ Output 2 → Gmail MIME Builder (Draft) - ivodachevd → Gmail Draft - ivodachevd
    │                                  ├─ Output 3 → Outlook Draft - dachevivo
    │                                  ├─ Output 4 → Outlook Draft - dachevivo2
    │                                  └─ Output 5 → Outlook Draft - dachevivo3
    │
    └─ Output 1 (testMode=FALSE) → 6-Account Email Router (Existing)
                                       └─ (Routes to existing Send nodes)
```

## Implementation Steps

### STEP 1: Create "Test Mode Router" Switch Node

**Node Configuration:**
- **Name**: `Test Mode Router`
- **Type**: `n8n-nodes-base.switch`
- **Version**: 3.2
- **Position**: [-80, -480]

**Parameters:**
```json
{
  "mode": "expression",
  "output": "input2",
  "rules": {
    "rules": [
      {
        "operation": "equal",
        "value1": "={{ $json.testMode }}",
        "value2": true,
        "output": 0
      },
      {
        "operation": "equal",
        "value1": "={{ $json.testMode }}",
        "value2": false,
        "output": 1
      }
    ]
  },
  "options": {}
}
```

**Connection:**
- **Input**: Connect from "Dynamic Priority-Based Account Selector" node
- **Output 0**: Will connect to "Draft Creation Router" (create in Step 2)
- **Output 1**: Connect to existing "6-Account Email Router" node

---

### STEP 2: Create "Draft Creation Router" Switch Node

**Node Configuration:**
- **Name**: `Draft Creation Router`
- **Type**: `n8n-nodes-base.switch`
- **Version**: 3.2
- **Position**: [120, -400]

**Parameters:**
```json
{
  "mode": "expression",
  "output": "input2",
  "rules": {
    "rules": [
      {
        "operation": "equal",
        "value1": "={{ $json.selectedAccount }}",
        "value2": "gmail-dachevivo",
        "output": 0
      },
      {
        "operation": "equal",
        "value1": "={{ $json.selectedAccount }}",
        "value2": "gmail-ivoddachev",
        "output": 1
      },
      {
        "operation": "equal",
        "value1": "={{ $json.selectedAccount }}",
        "value2": "gmail-ivodachevd",
        "output": 2
      },
      {
        "operation": "equal",
        "value1": "={{ $json.selectedAccount }}",
        "value2": "outlook-dachevivo",
        "output": 3
      },
      {
        "operation": "equal",
        "value1": "={{ $json.selectedAccount }}",
        "value2": "outlook-dachevivo2",
        "output": 4
      },
      {
        "operation": "equal",
        "value1": "={{ $json.selectedAccount }}",
        "value2": "outlook-dachevivo3",
        "output": 5
      }
    ]
  },
  "options": {}
}
```

**Connection:**
- **Input**: Connect from "Test Mode Router" Output 0
- **Outputs 0-5**: Will connect to Draft creation nodes (create in Steps 3-4)

---

### STEP 3: Create Gmail Draft Nodes (6 nodes total: 3 MIME Builders + 3 HTTP Request nodes)

Each Gmail account requires TWO nodes:
1. **Gmail MIME Builder (Draft)** - Code node that constructs the MIME message
2. **Gmail Draft** - HTTP Request node that creates the draft via Gmail API

#### Account 1: dachevivo@gmail.com

**Node 1: Gmail MIME Builder (Draft) - dachevivo**
- **Type**: `n8n-nodes-base.code`
- **Version**: 2
- **Position**: [320, -600]
- **Code**: See `gmail-mime-builder-draft-code.js` (change `senderEmail` to `dachevivo@gmail.com`)

**Node 2: Gmail Draft - dachevivo**
- **Type**: `n8n-nodes-base.httpRequest`
- **Version**: 4.2
- **Position**: [520, -600]
- **Method**: POST
- **URL**: `https://gmail.googleapis.com/gmail/v1/users/me/drafts`
- **Authentication**: Predefined Credential Type (googleOAuth2Api)
- **Credential**: Google account (ID: w8nTWzWPswftVYqH)
- **Headers**: `Content-Type: application/json`
- **JSON Body**: `={{ { "message": { "raw": $json.raw } } }}`

**Connections:**
- Draft Creation Router Output 0 → Gmail MIME Builder (Draft) - dachevivo
- Gmail MIME Builder (Draft) - dachevivo → Gmail Draft - dachevivo
- Gmail Draft - dachevivo → Aggregate Email Metrics

#### Account 2: ivoddachev@gmail.com

**Node 3: Gmail MIME Builder (Draft) - ivoddachev**
- Same configuration as Node 1, but:
  - **Position**: [320, -400]
  - **Code**: Change `senderEmail` to `ivoddachev@gmail.com`

**Node 4: Gmail Draft - ivoddachev**
- Same configuration as Node 2, but:
  - **Position**: [520, -400]

**Connections:**
- Draft Creation Router Output 1 → Gmail MIME Builder (Draft) - ivoddachev
- Gmail MIME Builder (Draft) - ivoddachev → Gmail Draft - ivoddachev
- Gmail Draft - ivoddachev → Aggregate Email Metrics

#### Account 3: ivodachevd@gmail.com

**Node 5: Gmail MIME Builder (Draft) - ivodachevd**
- Same configuration as Node 1, but:
  - **Position**: [320, -200]
  - **Code**: Change `senderEmail` to `ivodachevd@gmail.com`

**Node 6: Gmail Draft - ivodachevd**
- Same configuration as Node 2, but:
  - **Position**: [520, -200]

**Connections:**
- Draft Creation Router Output 2 → Gmail MIME Builder (Draft) - ivodachevd
- Gmail MIME Builder (Draft) - ivodachevd → Gmail Draft - ivodachevd
- Gmail Draft - ivodachevd → Aggregate Email Metrics

---

### STEP 4: Create Outlook Draft Nodes (3 nodes)

Each Outlook account requires ONE node (Outlook nodes handle MIME internally).

#### Account 1: dachevivo@outlook.com

**Node: Outlook Draft - dachevivo**
- **Type**: `n8n-nodes-base.microsoftOutlook`
- **Version**: 2
- **Position**: [320, 0]
- **Operation**: `createDraft`
- **Parameters**:
  - `from`: `dachevivo@outlook.com`
  - `toRecipients`: `={{ $json.recepientEmail }}`
  - `subject`: `={{ $json.emailSubject }}`
  - `bodyContent`: `={{ $json.emailBody }}`
  - `attachments`: `[{ "binaryPropertyName": "resume" }]`
- **Credential**: Microsoft Outlook account (ID: nrD1wFbznQD78xNa)

**Connection:**
- Draft Creation Router Output 3 → Outlook Draft - dachevivo
- Outlook Draft - dachevivo → Aggregate Email Metrics

#### Account 2: dachevivo2@outlook.com

**Node: Outlook Draft - dachevivo2**
- Same configuration as above, but:
  - **Position**: [320, 200]
  - `from`: `dachevivo2@outlook.com`
  - **Credential**: Microsoft Outlook account 2 (ID: nrD1wFbznQD78xNa)

**Connection:**
- Draft Creation Router Output 4 → Outlook Draft - dachevivo2
- Outlook Draft - dachevivo2 → Aggregate Email Metrics

#### Account 3: dachevivo3@outlook.com

**Node: Outlook Draft - dachevivo3**
- Same configuration as above, but:
  - **Position**: [320, 400]
  - `from`: `dachevivo3@outlook.com`
  - **Credential**: Microsoft Outlook account 3 (ID: wSLPm1S7vuBelc25)

**Connection:**
- Draft Creation Router Output 5 → Outlook Draft - dachevivo3
- Outlook Draft - dachevivo3 → Aggregate Email Metrics

---

## Complete Node Connection Summary

```
Dynamic Priority-Based Account Selector
    ↓
Test Mode Router
    ├─ Output 0 → Draft Creation Router
    │                 ├─ Output 0 → Gmail MIME Builder (Draft) - dachevivo → Gmail Draft - dachevivo → Aggregate Email Metrics
    │                 ├─ Output 1 → Gmail MIME Builder (Draft) - ivoddachev → Gmail Draft - ivoddachev → Aggregate Email Metrics
    │                 ├─ Output 2 → Gmail MIME Builder (Draft) - ivodachevd → Gmail Draft - ivodachevd → Aggregate Email Metrics
    │                 ├─ Output 3 → Outlook Draft - dachevivo → Aggregate Email Metrics
    │                 ├─ Output 4 → Outlook Draft - dachevivo2 → Aggregate Email Metrics
    │                 └─ Output 5 → Outlook Draft - dachevivo3 → Aggregate Email Metrics
    │
    └─ Output 1 → 6-Account Email Router (Existing)
                      └─ (Routes to existing Send nodes → Aggregate Email Metrics)
```

## Testing Strategy

### Phase 1: Initial Setup (All Accounts in Test Mode)
1. Set all 6 accounts to `testMode=TRUE` in Google Sheets "Email-Account-Config" tab
2. Trigger the orchestrator workflow
3. Verify that drafts are created (NOT sent) in all email accounts
4. Check "Email Daily Tracking" sheet for proper logging

### Phase 2: Test Mode Verification
1. Open Gmail/Outlook accounts and verify drafts exist
2. Check draft content (subject, body, resume attachment)
3. Verify no emails were actually sent

### Phase 3: Production Mode Testing (Single Account)
1. Set ONE account to `testMode=FALSE` in Google Sheets
2. Trigger the orchestrator workflow
3. Verify that account sends email directly (not draft)
4. Verify other accounts still create drafts

### Phase 4: Gradual Rollout
1. Week 1: All accounts in test mode
2. Week 2: Enable 1-2 accounts for production
3. Week 3: Enable 3-4 accounts for production
4. Week 4+: All accounts in production mode

## Files Reference

- Architecture documentation: `Docs/architecture/dual-path-test-mode-architecture.md`
- Test Mode Router config: `Docs/n8n-configs/test-mode-router-switch-node.json`
- Draft Creation Router config: `Docs/n8n-configs/draft-creation-router-switch-node.json`
- Gmail MIME Builder code: `Docs/n8n-configs/gmail-mime-builder-draft-code.js`
- Outlook Draft nodes config: `Docs/n8n-configs/outlook-draft-nodes.json`

