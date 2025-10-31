# Outreach Tracking Workshop - Email Sending Implementation Guide (Part 2)
**Continuation from Part 1**

---

## **PART 5 (CONTINUED): REMAINING NEW NODES**

### **NODE 6: Random Delay (Wait)**

**Position**: After "Increment Email Counter"  
**Node Type**: Wait (n8n-nodes-base.wait)  
**Name**: "Random Delay"

```json
{
  "parameters": {
    "unit": "seconds",
    "amount": "={{ Math.floor(Math.random() * 61) + 30 }}"
  },
  "type": "n8n-nodes-base.wait",
  "typeVersion": 1.1,
  "position": [1000, -300],
  "id": "NEW_NODE_ID_6",
  "name": "Random Delay"
}
```

**Explanation**:
- Generates random delay between 30-90 seconds
- Formula: `Math.floor(Math.random() * 61) + 30`
  - `Math.random() * 61` → 0 to 60.99
  - `Math.floor()` → 0 to 60
  - `+ 30` → 30 to 90 seconds

---

### **NODE 7: IF - Provider Check (IF Node)**

**Position**: After "Random Delay"  
**Node Type**: IF (n8n-nodes-base.if)  
**Name**: "IF - Provider Check"

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
          "id": "CONDITION_ID_2",
          "leftValue": "={{ $json.senderProvider }}",
          "rightValue": "gmail",
          "operator": {
            "type": "string",
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
  "position": [1200, -300],
  "id": "NEW_NODE_ID_7",
  "name": "IF - Provider Check"
}
```

**TRUE Branch**: Send via Gmail  
**FALSE Branch**: Send via Hotmail (Outlook)

---

### **NODE 8: Send Gmail (Gmail Node)**

**Position**: After "IF - Provider Check" (TRUE branch)  
**Node Type**: Gmail (n8n-nodes-base.gmail)  
**Name**: "Send Gmail"

```json
{
  "parameters": {
    "resource": "message",
    "operation": "send",
    "sendTo": "={{ $('Outreach Input Processing').item.json.contact.email }}",
    "subject": "={{ $json.emailSubject }}",
    "message": "={{ $json.emailBody }}",
    "options": {
      "attachmentsUi": {
        "attachmentsBinary": [
          {
            "property": "resume"
          }
        ]
      }
    }
  },
  "type": "n8n-nodes-base.gmail",
  "typeVersion": 2.1,
  "position": [1400, -400],
  "id": "NEW_NODE_ID_8",
  "name": "Send Gmail",
  "webhookId": "NEW_WEBHOOK_ID_1",
  "credentials": {
    "gmailOAuth2": {
      "id": "rEDqr1LkX2ZgxHLO",
      "name": "Gmail OAuth - dachevivo"
    }
  }
}
```

---

### **NODE 9: Send Hotmail (Outlook Node)**

**Position**: After "IF - Provider Check" (FALSE branch)  
**Node Type**: Microsoft Outlook (n8n-nodes-base.microsoftOutlook)  
**Name**: "Send Hotmail"

```json
{
  "parameters": {
    "resource": "message",
    "operation": "send",
    "toRecipients": "={{ $('Outreach Input Processing').item.json.contact.email }}",
    "subject": "={{ $json.emailSubject }}",
    "bodyContent": "={{ $json.emailBody }}",
    "additionalFields": {
      "attachments": {
        "attachmentsBinary": [
          {
            "property": "resume"
          }
        ]
      }
    }
  },
  "type": "n8n-nodes-base.microsoftOutlook",
  "typeVersion": 2.2,
  "position": [1400, -200],
  "id": "NEW_NODE_ID_9",
  "name": "Send Hotmail",
  "credentials": {
    "microsoftOutlookOAuth2": {
      "id": "YOUR_HOTMAIL_CREDENTIAL_ID",
      "name": "Microsoft OAuth - Hotmail"
    }
  }
}
```

**REPLACE**: `YOUR_HOTMAIL_CREDENTIAL_ID` with your actual Hotmail credential ID from Step 2B

---

### **NODE 10: Merge Email Outputs (Merge Node)**

**Position**: After "Send Gmail" and "Send Hotmail"  
**Node Type**: Merge (n8n-nodes-base.merge)  
**Name**: "Merge Email Outputs"

```json
{
  "parameters": {
    "mode": "combine",
    "combineBy": "combineAll"
  },
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3.2,
  "position": [1600, -300],
  "id": "NEW_NODE_ID_10",
  "name": "Merge Email Outputs"
}
```

---

### **NODE 11: Queue for Tomorrow (Code)**

**Position**: After "IF - Under Daily Limit?" (FALSE branch)  
**Node Type**: Code (n8n-nodes-base.code)  
**Name**: "Queue for Tomorrow"

```json
{
  "parameters": {
    "jsCode": "// Queue for Tomorrow - Daily limit reached\n// This email will be processed tomorrow when limits reset\n\nconst today = new Date().toISOString().split('T')[0];\nconst tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];\n\nreturn {\n  json: {\n    ...item.json,\n    queuedForDate: tomorrow,\n    queuedAt: new Date().toISOString(),\n    queueReason: 'DAILY_LIMIT_REACHED',\n    dailyLimitInfo: {\n      date: today,\n      gmailSent: $json.dailyLimits.gmailSent,\n      hotmailSent: $json.dailyLimits.hotmailSent,\n      gmailLimit: $json.dailyLimits.gmailLimit,\n      hotmailLimit: $json.dailyLimits.hotmailLimit\n    }\n  }\n};\n"
  },
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [600, -500],
  "id": "NEW_NODE_ID_11",
  "name": "Queue for Tomorrow"
}
```

---

## **PART 6: UPDATED STATUS UPDATE NODE**

### **Modify Existing "Status Update" Node**

**Current Node ID**: ab2bff18-f152-4160-ae3c-f5e2d546b94a

**Update the `columns.value` configuration to include new fields**:

```json
{
  "status": "={{ $if($('Send Gmail').isExecuted || $('Send Hotmail').isExecuted, 'EMAIL_SENT', $if($('Queue for Tomorrow').isExecuted, 'QUEUED', 'DUPLICATE_SKIPPED')) }}",
  "dedupeKey": "={{ $('Outreach Input Processing').item.json.tracking.dedupeKey }}",
  "emailSubject": "={{ $if($('AI Email Generation').isExecuted, JSON.parse($('AI Email Generation').item.json.content.parts[0].text)[0].emailSubject, '') }}",
  "emailBody": "={{ $if($('AI Email Generation').isExecuted, JSON.parse($('AI Email Generation').item.json.content.parts[0].text)[0].emailBody, '') }}",
  "emailTemplate": "={{ $if($('AI Email Generation').isExecuted, JSON.parse($('AI Email Generation').item.json.content.parts[0].text)[0].emailBody, '') }}",
  "estimatedResponseRate": "={{ $('Outreach Input Processing').item.json.tracking.dedupeKey }}",
  "draftStatus": "={{ $if($('Send Gmail').isExecuted || $('Send Hotmail').isExecuted, 'SENT', $if($('Queue for Tomorrow').isExecuted, 'QUEUED', 'SKIPPED')) }}",
  "draftCreatedTimestamp": "={{ $if($('Send Gmail').isExecuted || $('Send Hotmail').isExecuted, $now.toISO(), '') }}",
  "senderEmail": "={{ $if($('Account Selector').isExecuted, $('Account Selector').item.json.senderEmail, '') }}",
  "senderProvider": "={{ $if($('Account Selector').isExecuted, $('Account Selector').item.json.senderProvider, '') }}",
  "queuedForDate": "={{ $if($('Queue for Tomorrow').isExecuted, $('Queue for Tomorrow').item.json.queuedForDate, '') }}"
}
```

**Add these new columns to Google Sheets "Tracking" sheet**:
- `senderEmail` (Column header)
- `senderProvider` (Column header)
- `queuedForDate` (Column header)

---

## **PART 7: UPDATED CONNECTIONS**

### **Complete Connections Object**

Replace the existing `connections` object in the workflow with this updated version:

```json
{
  "Execute Workflow Trigger - From Orchestrator": {
    "main": [
      [
        {
          "node": "Outreach Input Processing",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Outreach Input Processing": {
    "main": [
      [
        {
          "node": "If - Duplicate or not",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "If - Duplicate or not": {
    "main": [
      [
        {
          "node": "Merge Duplicate and Email",
          "type": "main",
          "index": 0
        }
      ],
      [
        {
          "node": "AI Email Generation",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "AI Email Generation": {
    "main": [
      [
        {
          "node": "Create Resume Document",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Create Resume Document": {
    "main": [
      [
        {
          "node": "Update a document",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Update a document": {
    "main": [
      [
        {
          "node": "Export Resume as PDF",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Export Resume as PDF": {
    "main": [
      [
        {
          "node": "Resume Filename Customizer",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Resume Filename Customizer": {
    "main": [
      [
        {
          "node": "Get Daily Limits",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Get Daily Limits": {
    "main": [
      [
        {
          "node": "Check Daily Limits",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Check Daily Limits": {
    "main": [
      [
        {
          "node": "IF - Under Daily Limit?",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "IF - Under Daily Limit?": {
    "main": [
      [
        {
          "node": "Account Selector",
          "type": "main",
          "index": 0
        }
      ],
      [
        {
          "node": "Queue for Tomorrow",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Account Selector": {
    "main": [
      [
        {
          "node": "Increment Email Counter",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Increment Email Counter": {
    "main": [
      [
        {
          "node": "Random Delay",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Random Delay": {
    "main": [
      [
        {
          "node": "IF - Provider Check",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "IF - Provider Check": {
    "main": [
      [
        {
          "node": "Send Gmail",
          "type": "main",
          "index": 0
        }
      ],
      [
        {
          "node": "Send Hotmail",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Send Gmail": {
    "main": [
      [
        {
          "node": "Merge Email Outputs",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Send Hotmail": {
    "main": [
      [
        {
          "node": "Merge Email Outputs",
          "type": "main",
          "index": 1
        }
      ]
    ]
  },
  "Merge Email Outputs": {
    "main": [
      [
        {
          "node": "Merge Duplicate and Email",
          "type": "main",
          "index": 1
        }
      ]
    ]
  },
  "Queue for Tomorrow": {
    "main": [
      [
        {
          "node": "Merge Duplicate and Email",
          "type": "main",
          "index": 1
        }
      ]
    ]
  },
  "Merge Duplicate and Email": {
    "main": [
      [
        {
          "node": "Status Update",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Status Update": {
    "main": [
      []
    ]
  }
}
```

---

## **PART 8: TESTING PROCEDURE**

### **Step 1: Initial Test (2 Emails)**

1. Set Google Sheets daily limits to: `gmail_limit: 1, hotmail_limit: 1`
2. Execute SEO Orchestrator with 2 jobs
3. Verify:
   - ✅ First email sent via Gmail
   - ✅ Second email sent via Hotmail
   - ✅ Google Sheets counter incremented correctly
   - ✅ Random delay applied (check execution time)
   - ✅ Emails received in inbox (not spam)

### **Step 2: Daily Limit Test**

1. Set Google Sheets daily limits to: `gmail_limit: 1, hotmail_limit: 1`
2. Execute SEO Orchestrator with 5 jobs
3. Verify:
   - ✅ First 2 emails sent (1 Gmail + 1 Hotmail)
   - ✅ Remaining 3 emails queued for tomorrow
   - ✅ Status Update shows "QUEUED" for queued emails

### **Step 3: Production Test (Day 1)**

1. Set Google Sheets daily limits to: `gmail_limit: 20, hotmail_limit: 20`
2. Execute SEO Orchestrator
3. Monitor:
   - ✅ Email distribution (should be ~10 Gmail + ~10 Hotmail)
   - ✅ Execution time (should include random delays)
   - ✅ Deliverability (check inbox placement)

---

## **PART 9: DAILY MONITORING CHECKLIST**

### **Daily Tasks (Days 1-10)**

**Morning (Before Execution)**:
- [ ] Update Google Sheets daily limits for today
- [ ] Check yesterday's deliverability metrics
- [ ] Review any bounce notifications

**After Execution**:
- [ ] Verify email count matches Google Sheets counter
- [ ] Check Gmail Postmaster Tools (sender reputation)
- [ ] Review any spam complaints
- [ ] Update daily log with metrics

**Metrics to Track**:
- Total emails sent (Gmail + Hotmail)
- Bounce rate (should be <2%)
- Spam complaint rate (should be <0.1%)
- Inbox placement rate (should be >95%)

---

## **PART 10: TROUBLESHOOTING**

### **Issue: "No email account has capacity" Error**

**Cause**: Both accounts reached daily limits  
**Solution**: Increase daily limits in Google Sheets or wait until tomorrow

### **Issue: Emails Going to Spam**

**Cause**: Sending too fast, poor sender reputation  
**Solution**: 
- Reduce daily volume
- Increase random delay range (60-120 seconds)
- Check SPF/DKIM/DMARC records

### **Issue: Hotmail OAuth Authentication Fails**

**Cause**: Incorrect scopes or expired token  
**Solution**: Re-authenticate Hotmail credential with correct scopes

---

## **NEXT STEPS**

After completing this implementation:

1. ✅ Execute Phase 1 (Days 1-10): Single-keyword warm-up with SEO campaign
2. ✅ Monitor deliverability daily
3. ✅ Reach 200 emails/day by Day 10
4. ✅ Proceed to Phase 2 (Days 11-14): Add Automation Specialist and GenAI campaigns

**See**: `Multi-Keyword-Campaign-Implementation-Guide.md` for Phase 2 instructions

