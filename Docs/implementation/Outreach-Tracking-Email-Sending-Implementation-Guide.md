# Outreach Tracking Workshop - Email Sending Implementation Guide
**Multi-Account Email Sending with Daily Limit Enforcement and Account Rotation**

**Date**: 2025-10-28  
**Workflow ID**: Vp9DpKF3xT2ysHhx  
**Workflow URL**: https://n8n.srv972609.hstgr.cloud/workflow/Vp9DpKF3xT2ysHhx

---

## **OVERVIEW**

This guide provides complete implementation instructions for modifying the Outreach Tracking Workshop to:
1. ✅ Send actual emails (Gmail + Hotmail) instead of creating drafts
2. ✅ Implement round-robin account rotation (50/50 distribution)
3. ✅ Enforce daily email limits (100 Gmail + 100 Hotmail = 200 total)
4. ✅ Add random delays (30-90 seconds) between emails
5. ✅ Support 3 parallel orchestrator campaigns sharing the same email accounts

---

## **ARCHITECTURE OVERVIEW**

### **Current Flow (Draft Mode)**
```
Execute Workflow Trigger → Outreach Input Processing → IF (Duplicate Check)
├─ TRUE → Skip (Merge)
└─ FALSE → AI Email Generation → Create Resume → Update Document → Export PDF 
           → Resume Filename Customizer → Draft Gmail → Merge → Status Update
```

### **New Flow (Production Email Sending)**
```
Execute Workflow Trigger → Outreach Input Processing → IF (Duplicate Check)
├─ TRUE → Skip (Merge)
└─ FALSE → AI Email Generation → Create Resume → Update Document → Export PDF 
           → Resume Filename Customizer 
           → [NEW] Get Daily Limits (Google Sheets)
           → [NEW] Check Daily Limits (Code)
           → [NEW] IF (Under Daily Limit?)
              ├─ TRUE → [NEW] Account Selector (Code)
              │         → [NEW] Increment Counter (Google Sheets)
              │         → [NEW] Random Delay (Wait)
              │         → [NEW] IF (Provider Check)
              │            ├─ Gmail → [NEW] Send Gmail
              │            └─ Hotmail → [NEW] Send Hotmail (Outlook)
              │                         → [NEW] Merge Email Outputs
              │                         → Status Update (EMAIL_SENT)
              │
              └─ FALSE → [NEW] Queue for Tomorrow (Code)
                         → Status Update (QUEUED)
```

---

## **PART 1: GOOGLE SHEETS SETUP**

### **Step 1: Create Email Queue Management Sheet**

1. Create new Google Sheet: **"LinkedIn-Email-Queue-Management"**
2. Create sheet tab: **"Email_Queue_Daily_Limits"**
3. Add headers in Row 1:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| date | gmail_sent | hotmail_sent | gmail_limit | hotmail_limit | total_sent |

4. Add initial row (Row 2):
```
2025-10-28    0    0    20    20    0
```

5. Share with N8N service account (same account used for other Google Sheets operations)
6. **Copy the Google Sheets ID** from the URL (you'll need this for node configurations)

**Google Sheets ID Location**:
```
https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit
```

---

## **PART 2: CREDENTIAL SETUP**

### **Step 2A: Gmail OAuth Credential**

**You already have this credential**: `Gmail OAuth - dachevivo` (ID: rEDqr1LkX2ZgxHLO)

**Verify it's configured for sending**:
1. Go to N8N → Credentials → "Gmail OAuth - dachevivo"
2. Verify scopes include: `https://www.googleapis.com/auth/gmail.send`
3. If not, re-authenticate with correct scopes

---

### **Step 2B: Hotmail/Outlook OAuth Credential (NEW)**

**Create new credential**:
1. Go to N8N → Credentials → Add Credential
2. Select: **"Microsoft Outlook OAuth2 API"**
3. Name: **"Microsoft OAuth - Hotmail"**
4. Follow OAuth flow to authenticate your Hotmail account
5. **Copy the Credential ID** (you'll need this for Account Selector node)

**Required Scopes**:
- `Mail.Send`
- `Mail.ReadWrite`
- `offline_access`

---

## **PART 3: NEW NODE CONFIGURATIONS**

### **NODE 1: Get Daily Limits (Google Sheets)**

**Position**: After "Resume Filename Customizer", before "Check Daily Limits"  
**Node Type**: Google Sheets (n8n-nodes-base.googleSheets)  
**Name**: "Get Daily Limits"

**Configuration**:
```json
{
  "parameters": {
    "operation": "read",
    "documentId": {
      "__rl": true,
      "value": "YOUR_GOOGLE_SHEETS_ID_HERE",
      "mode": "id"
    },
    "sheetName": {
      "__rl": true,
      "value": "Email_Queue_Daily_Limits",
      "mode": "name"
    },
    "options": {
      "range": "A:F"
    }
  },
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4.7,
  "position": [0, -384],
  "id": "NEW_NODE_ID_1",
  "name": "Get Daily Limits",
  "credentials": {
    "googleSheetsOAuth2Api": {
      "id": "HnVkHdxofZiUvnda",
      "name": "Google Sheets account"
    }
  }
}
```

**REPLACE**: `YOUR_GOOGLE_SHEETS_ID_HERE` with your actual Google Sheets ID

---

### **NODE 2: Check Daily Limits (Code)**

**Position**: After "Get Daily Limits"  
**Node Type**: Code (n8n-nodes-base.code)  
**Name**: "Check Daily Limits"

**Configuration**:
```json
{
  "parameters": {
    "jsCode": "// Check Daily Email Limits - Prevents exceeding 100 emails/day per account\n\nconst today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format\n\n// Get current counts from Google Sheets\nconst dailyLimitsData = $('Get Daily Limits').all();\n\n// Find today's row\nconst todayRow = dailyLimitsData.find(row => row.json.date === today);\n\nlet gmailSent = 0;\nlet hotmailSent = 0;\nlet gmailLimit = 20; // Day 1 default\nlet hotmailLimit = 20; // Day 1 default\n\nif (todayRow) {\n  gmailSent = parseInt(todayRow.json.gmail_sent) || 0;\n  hotmailSent = parseInt(todayRow.json.hotmail_sent) || 0;\n  gmailLimit = parseInt(todayRow.json.gmail_limit) || 20;\n  hotmailLimit = parseInt(todayRow.json.hotmail_limit) || 20;\n}\n\n// Determine which account has capacity\nconst gmailHasCapacity = gmailSent < gmailLimit;\nconst hotmailHasCapacity = hotmailSent < hotmailLimit;\nconst anyAccountHasCapacity = gmailHasCapacity || hotmailHasCapacity;\n\n// Determine which account to use (prefer account with more capacity)\nlet preferredProvider = 'gmail';\nif (!gmailHasCapacity && hotmailHasCapacity) {\n  preferredProvider = 'hotmail';\n} else if (gmailHasCapacity && !hotmailHasCapacity) {\n  preferredProvider = 'gmail';\n} else if (gmailHasCapacity && hotmailHasCapacity) {\n  // Both have capacity - use round-robin based on item index\n  preferredProvider = $itemIndex % 2 === 0 ? 'gmail' : 'hotmail';\n}\n\nreturn {\n  json: {\n    ...item.json,\n    dailyLimits: {\n      date: today,\n      gmailSent: gmailSent,\n      hotmailSent: hotmailSent,\n      gmailLimit: gmailLimit,\n      hotmailLimit: hotmailLimit,\n      gmailHasCapacity: gmailHasCapacity,\n      hotmailHasCapacity: hotmailHasCapacity,\n      canSendToday: anyAccountHasCapacity,\n      preferredProvider: preferredProvider\n    }\n  }\n};\n"
  },
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [200, -384],
  "id": "NEW_NODE_ID_2",
  "name": "Check Daily Limits"
}
```

---

### **NODE 3: IF - Under Daily Limit? (IF Node)**

**Position**: After "Check Daily Limits"  
**Node Type**: IF (n8n-nodes-base.if)  
**Name**: "IF - Under Daily Limit?"

**Configuration**:
```json
{
  "parameters": {
    "conditions": {
      "options": {
        "version": 2,
        "leftValue": "",
        "caseSensitive": true,
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "id": "CONDITION_ID_1",
          "leftValue": "={{ $json.dailyLimits.canSendToday }}",
          "rightValue": true,
          "operator": {
            "type": "boolean",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    },
    "options": {}
  },
  "type": "n8n-nodes-base.if",
  "typeVersion": 2.2,
  "position": [400, -384],
  "id": "NEW_NODE_ID_3",
  "name": "IF - Under Daily Limit?"
}
```

**TRUE Branch**: Proceed to Account Selector  
**FALSE Branch**: Queue for Tomorrow

---

### **NODE 4: Account Selector (Code)**

**Position**: After "IF - Under Daily Limit?" (TRUE branch)  
**Node Type**: Code (n8n-nodes-base.code)  
**Name**: "Account Selector"

**Configuration** (PART 1 - see next section for complete code):
```json
{
  "parameters": {
    "jsCode": "// SEE NEXT SECTION FOR COMPLETE CODE"
  },
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [600, -300],
  "id": "NEW_NODE_ID_4",
  "name": "Account Selector"
}
```

---

## **PART 4: ACCOUNT SELECTOR CODE (COMPLETE)**

**Replace the jsCode parameter in NODE 4 with this complete code**:

```javascript
// Account Selector - Round-Robin Rotation with Daily Limit Awareness
// Ensures exactly 50/50 distribution when both accounts have capacity
// Falls back to available account when one reaches daily limit

const accounts = [
  {
    provider: 'gmail',
    email: 'dachevivo@gmail.com',
    credentialId: 'rEDqr1LkX2ZgxHLO',
    credentialName: 'Gmail OAuth - dachevivo'
  },
  {
    provider: 'hotmail',
    email: 'YOUR_HOTMAIL_EMAIL@hotmail.com', // REPLACE WITH YOUR HOTMAIL EMAIL
    credentialId: 'YOUR_HOTMAIL_CREDENTIAL_ID', // REPLACE WITH YOUR HOTMAIL CREDENTIAL ID
    credentialName: 'Microsoft OAuth - Hotmail'
  }
];

// Get daily limits info from previous node
const dailyLimits = $json.dailyLimits;

// Determine which account to use
let selectedAccount;

if (dailyLimits.gmailHasCapacity && dailyLimits.hotmailHasCapacity) {
  // Both accounts have capacity - use round-robin for 50/50 distribution
  selectedAccount = accounts[$itemIndex % accounts.length];
} else if (dailyLimits.gmailHasCapacity && !dailyLimits.hotmailHasCapacity) {
  // Only Gmail has capacity
  selectedAccount = accounts[0]; // Gmail
} else if (!dailyLimits.gmailHasCapacity && dailyLimits.hotmailHasCapacity) {
  // Only Hotmail has capacity
  selectedAccount = accounts[1]; // Hotmail
} else {
  // Neither account has capacity (should not reach here due to IF node)
  throw new Error('No email account has capacity - daily limits reached');
}

return {
  json: {
    ...item.json,
    selectedAccount: selectedAccount,
    senderEmail: selectedAccount.email,
    senderProvider: selectedAccount.provider,
    senderCredentialId: selectedAccount.credentialId
  }
};
```

**IMPORTANT**: Replace these placeholders:
- `YOUR_HOTMAIL_EMAIL@hotmail.com` → Your actual Hotmail email address
- `YOUR_HOTMAIL_CREDENTIAL_ID` → The credential ID from Step 2B

---

## **PART 5: REMAINING NEW NODES**

### **NODE 5: Increment Email Counter (Google Sheets)**

**Position**: After "Account Selector"  
**Node Type**: Google Sheets  
**Name**: "Increment Email Counter"

```json
{
  "parameters": {
    "operation": "appendOrUpdate",
    "documentId": {
      "__rl": true,
      "value": "YOUR_GOOGLE_SHEETS_ID_HERE",
      "mode": "id"
    },
    "sheetName": {
      "__rl": true,
      "value": "Email_Queue_Daily_Limits",
      "mode": "name"
    },
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "date": "={{ $now.toFormat('yyyy-MM-dd') }}",
        "gmail_sent": "={{ $json.senderProvider === 'gmail' ? $json.dailyLimits.gmailSent + 1 : $json.dailyLimits.gmailSent }}",
        "hotmail_sent": "={{ $json.senderProvider === 'hotmail' ? $json.dailyLimits.hotmailSent + 1 : $json.dailyLimits.hotmailSent }}",
        "gmail_limit": "={{ $json.dailyLimits.gmailLimit }}",
        "hotmail_limit": "={{ $json.dailyLimits.hotmailLimit }}",
        "total_sent": "={{ $json.dailyLimits.gmailSent + $json.dailyLimits.hotmailSent + 1 }}"
      },
      "matchingColumns": ["date"]
    },
    "options": {}
  },
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4.7,
  "position": [800, -300],
  "id": "NEW_NODE_ID_5",
  "name": "Increment Email Counter",
  "credentials": {
    "googleSheetsOAuth2Api": {
      "id": "HnVkHdxofZiUvnda",
      "name": "Google Sheets account"
    }
  }
}
```

---

**DOCUMENT CONTINUES IN NEXT FILE DUE TO 300 LINE LIMIT**

See: `Outreach-Tracking-Email-Sending-Implementation-Guide-Part2.md`

