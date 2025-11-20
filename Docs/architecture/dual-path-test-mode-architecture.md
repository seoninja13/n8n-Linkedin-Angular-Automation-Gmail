# Dual-Path Test Mode Architecture

## Overview
This document describes the dual-path architecture for per-account test mode control in the LinkedIn automation workflow. The architecture allows each email account to independently operate in either TEST mode (create drafts) or PRODUCTION mode (send emails directly).

## Architecture Diagram

```
Dynamic Priority-Based Account Selector (v7.0)
    ↓ (outputs: testMode flag + selectedAccount + email data + binary)
    |
Test Mode Router (Switch Node)
    ├─ Output 0 (testMode=TRUE) → Draft Creation Router (Switch Node)
    │                                  ├─ Output 0 (gmail-dachevivo) → Gmail Draft - dachevivo
    │                                  ├─ Output 1 (gmail-ivoddachev) → Gmail Draft - ivoddachev
    │                                  ├─ Output 2 (gmail-ivodachevd) → Gmail Draft - ivodachevd
    │                                  ├─ Output 3 (outlook-dachevivo) → Outlook Draft - dachevivo
    │                                  ├─ Output 4 (outlook-dachevivo2) → Outlook Draft - dachevivo2
    │                                  └─ Output 5 (outlook-dachevivo3) → Outlook Draft - dachevivo3
    │
    └─ Output 1 (testMode=FALSE) → 6-Account Email Router (Existing Switch Node)
                                       ├─ Output 0 (gmail accounts) → Gmail MIME Builders → Gmail Send Nodes
                                       ├─ Output 1 (outlook-dachevivo) → Inbox Outlook (Send)
                                       ├─ Output 2 (outlook-dachevivo2) → dachevivo2@outlook (Send)
                                       └─ Output 3 (outlook-dachevivo3) → dachevivo3@outlook.com (Send)
```

## Node Specifications

### 1. Test Mode Router (Switch Node)
- **Purpose**: Routes items based on testMode flag
- **Input**: Output from "Dynamic Priority-Based Account Selector"
- **Routing Logic**:
  - Output 0: testMode=TRUE → Route to Draft Creation Router
  - Output 1: testMode=FALSE → Route to 6-Account Email Router (existing)
- **Node Type**: `n8n-nodes-base.switch`
- **Version**: 3.2

### 2. Draft Creation Router (Switch Node)
- **Purpose**: Routes to specific Draft creation nodes based on selectedAccount
- **Input**: Output 0 from Test Mode Router
- **Routing Logic**:
  - Output 0: selectedAccount="gmail-dachevivo" → Gmail Draft - dachevivo
  - Output 1: selectedAccount="gmail-ivoddachev" → Gmail Draft - ivoddachev
  - Output 2: selectedAccount="gmail-ivodachevd" → Gmail Draft - ivodachevd
  - Output 3: selectedAccount="outlook-dachevivo" → Outlook Draft - dachevivo
  - Output 4: selectedAccount="outlook-dachevivo2" → Outlook Draft - dachevivo2
  - Output 5: selectedAccount="outlook-dachevivo3" → Outlook Draft - dachevivo3
- **Node Type**: `n8n-nodes-base.switch`
- **Version**: 3.2

### 3. Draft Creation Nodes (6 nodes)

#### Gmail Draft Nodes (3 nodes)
- **Gmail Draft - dachevivo**: Creates draft in dachevivo@gmail.com
- **Gmail Draft - ivoddachev**: Creates draft in ivoddachev@gmail.com
- **Gmail Draft - ivodachevd**: Creates draft in ivodachevd@gmail.com
- **Configuration**: All use Gmail MIME Builder pattern + Gmail node with `operation: "createDraft"`

#### Outlook Draft Nodes (3 nodes)
- **Outlook Draft - dachevivo**: Creates draft in dachevivo@outlook.com
- **Outlook Draft - dachevivo2**: Creates draft in dachevivo2@outlook.com
- **Outlook Draft - dachevivo3**: Creates draft in dachevivo3@outlook.com
- **Configuration**: All use Microsoft Outlook node with `operation: "createDraft"`

## Data Flow

### Input Data Structure (from Dynamic Priority-Based Account Selector)
```json
{
  "emailSubject": "Application for [Job Title] - Ivo Dachev",
  "emailBody": "[Email body content]",
  "counter": 123,
  "selectedAccount": "gmail-dachevivo",
  "emailAccount": "gmail-dachevivo",
  "emailAddress": "dachevivo@gmail.com",
  "credentialName": "Gmail - Primary",
  "priority": 1,
  "testMode": true,
  "accountSelectionMetadata": {
    "testMode": true,
    "testModeSource": "GOOGLE_SHEETS",
    "fixVersion": "v7.0-TEST-MODE-SUPPORT",
    ...
  }
}
```

### Binary Data Preservation
All routing paths MUST preserve the binary data (resume PDF attachment) from the "Daily Email Volume Control" node.

## Implementation Notes

1. **Preserve Existing Nodes**: Do NOT modify existing Send nodes (Gmail - dachevivo, Gmail - ivoddachev, Gmail - ivodachevd, Inbox Outlook, dachevivo2@outlook, dachevivo3@outlook.com)

2. **Credential Reuse**: Draft creation nodes use the SAME credentials as their corresponding Send nodes

3. **Binary Data**: All nodes must preserve binary data using `$('Daily Email Volume Control').item.binary`

4. **Merge Point**: Both Draft and Send paths converge at the "Aggregate Email Metrics" node

5. **Testing Strategy**: 
   - Phase 1: Set all accounts to testMode=TRUE in Google Sheets
   - Phase 2: Verify drafts are created (not sent)
   - Phase 3: Set one account to testMode=FALSE and verify email is sent
   - Phase 4: Gradually enable production mode for all accounts

## Configuration Files

Complete JSON configurations for all new nodes are provided in:
- `Docs/n8n-configs/test-mode-router-switch-node.json`
- `Docs/n8n-configs/draft-creation-router-switch-node.json`
- `Docs/n8n-configs/gmail-draft-nodes.json`
- `Docs/n8n-configs/outlook-draft-nodes.json`

