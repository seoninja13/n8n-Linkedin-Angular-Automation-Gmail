# Email Sending Implementation - Quick Reference
**Fast lookup for key configurations and values**

---

## **CRITICAL VALUES TO REPLACE**

### **Google Sheets ID**
**Location**: Nodes 1, 5  
**Find**: `YOUR_GOOGLE_SHEETS_ID_HERE`  
**Replace with**: Your Google Sheets ID from URL  
**Example**: `1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g`

### **Hotmail Email Address**
**Location**: Node 4 (Account Selector)  
**Find**: `YOUR_HOTMAIL_EMAIL@hotmail.com`  
**Replace with**: Your actual Hotmail email  
**Example**: `ivodachev@hotmail.com`

### **Hotmail Credential ID**
**Location**: Nodes 4, 9  
**Find**: `YOUR_HOTMAIL_CREDENTIAL_ID`  
**Replace with**: Credential ID from N8N  
**How to find**: N8N → Credentials → "Microsoft OAuth - Hotmail" → Copy ID

---

## **DAILY LIMITS SCHEDULE (10-DAY WARM-UP)**

| Day | Gmail Limit | Hotmail Limit | Total | Update Google Sheets |
|-----|-------------|---------------|-------|----------------------|
| 1-2 | 20 | 20 | 40 | `gmail_limit: 20, hotmail_limit: 20` |
| 3-4 | 35 | 35 | 70 | `gmail_limit: 35, hotmail_limit: 35` |
| 5-6 | 55 | 55 | 110 | `gmail_limit: 55, hotmail_limit: 55` |
| 7-8 | 75 | 75 | 150 | `gmail_limit: 75, hotmail_limit: 75` |
| 9-10 | 100 | 100 | 200 | `gmail_limit: 100, hotmail_limit: 100` |

**Update Google Sheets every 2 days BEFORE running orchestrator**

---

## **NODE INSERTION ORDER**

**After "Resume Filename Customizer", add these nodes in order**:

1. Get Daily Limits (Google Sheets)
2. Check Daily Limits (Code)
3. IF - Under Daily Limit? (IF)
4. Account Selector (Code) - TRUE branch
5. Increment Email Counter (Google Sheets)
6. Random Delay (Wait)
7. IF - Provider Check (IF)
8. Send Gmail (Gmail) - TRUE branch
9. Send Hotmail (Outlook) - FALSE branch
10. Merge Email Outputs (Merge)
11. Queue for Tomorrow (Code) - FALSE branch from node 3

**Connect to existing**: Merge Email Outputs → Merge Duplicate and Email → Status Update

---

## **GOOGLE SHEETS SETUP**

### **Sheet Name**: `Email_Queue_Daily_Limits`

### **Headers (Row 1)**:
```
date | gmail_sent | hotmail_sent | gmail_limit | hotmail_limit | total_sent
```

### **Initial Row (Row 2)**:
```
2025-10-28 | 0 | 0 | 20 | 20 | 0
```

### **Add New Row Each Day**:
```
2025-10-29 | 0 | 0 | 20 | 20 | 0
2025-10-30 | 0 | 0 | 20 | 20 | 0
...
```

**OR** just update the limits in the existing row for today

---

## **CREDENTIAL SETUP**

### **Gmail (Already Exists)**
- **Name**: Gmail OAuth - dachevivo
- **ID**: rEDqr1LkX2ZgxHLO
- **Scopes**: `https://www.googleapis.com/auth/gmail.send`

### **Hotmail (Create New)**
- **Type**: Microsoft Outlook OAuth2 API
- **Name**: Microsoft OAuth - Hotmail
- **Scopes**: `Mail.Send`, `Mail.ReadWrite`, `offline_access`
- **Copy ID after creation** → Use in Node 4 and Node 9

---

## **TESTING COMMANDS**

### **Test 1: Single Email (Gmail)**
```
1. Set limits: gmail_limit: 1, hotmail_limit: 0
2. Run orchestrator with 1 job
3. Verify: Email sent via Gmail
```

### **Test 2: Single Email (Hotmail)**
```
1. Set limits: gmail_limit: 0, hotmail_limit: 1
2. Run orchestrator with 1 job
3. Verify: Email sent via Hotmail
```

### **Test 3: Round-Robin (2 Emails)**
```
1. Set limits: gmail_limit: 1, hotmail_limit: 1
2. Run orchestrator with 2 jobs
3. Verify: First email Gmail, second email Hotmail
```

### **Test 4: Daily Limit Enforcement**
```
1. Set limits: gmail_limit: 1, hotmail_limit: 1
2. Run orchestrator with 5 jobs
3. Verify: 2 emails sent, 3 queued
```

---

## **MONITORING CHECKLIST**

### **Daily (Before Execution)**
- [ ] Update Google Sheets daily limits
- [ ] Check yesterday's metrics
- [ ] Review bounce notifications

### **Daily (After Execution)**
- [ ] Verify email count matches Google Sheets
- [ ] Check inbox placement (not spam)
- [ ] Review execution logs for errors
- [ ] Update daily log

### **Weekly**
- [ ] Check Gmail Postmaster Tools
- [ ] Review sender reputation score
- [ ] Analyze bounce rate trend
- [ ] Adjust strategy if needed

---

## **TROUBLESHOOTING QUICK FIXES**

### **"No email account has capacity"**
→ Increase daily limits in Google Sheets

### **Emails going to spam**
→ Reduce daily volume, increase delay range

### **Hotmail authentication fails**
→ Re-authenticate credential with correct scopes

### **Google Sheets not updating**
→ Check credential permissions, verify sheet ID

### **Random delay not working**
→ Verify Wait node formula: `={{ Math.floor(Math.random() * 61) + 30 }}`

---

## **KEY FORMULAS**

### **Random Delay (30-90 seconds)**
```javascript
={{ Math.floor(Math.random() * 61) + 30 }}
```

### **Round-Robin Account Selection**
```javascript
accounts[$itemIndex % accounts.length]
```

### **Check If Under Limit**
```javascript
gmailSent < gmailLimit || hotmailSent < hotmailLimit
```

### **Increment Counter**
```javascript
$json.senderProvider === 'gmail' ? gmailSent + 1 : gmailSent
```

---

## **EXECUTION TIME ESTIMATES**

### **Single Email**
- Without delay: ~30 seconds
- With delay (avg 60s): ~90 seconds

### **20 Emails (Day 1)**
- Total time: ~30 minutes
- Includes: 20 × 60s delays + processing time

### **100 Emails (Day 10)**
- Total time: ~2 hours
- Includes: 100 × 60s delays + processing time

### **200 Emails (3 Campaigns)**
- Total time: ~4 hours
- Includes: 200 × 60s delays + processing time

---

## **PHASE 1 TIMELINE (SINGLE KEYWORD)**

**Day 1 (Today)**: Implementation (3 hours) + Test (30 min) + Execute (20 emails)  
**Days 2-10**: Daily execution with increasing volume  
**Day 10**: Reach 200 emails/day ✅

---

## **PHASE 2 TIMELINE (MULTI-KEYWORD)**

**Day 11**: Configure Automation Specialist (2 hours)  
**Day 12**: Create GenAI Engineer (2 hours)  
**Days 13-14**: Run all 3 campaigns (200 emails/day total) ✅

---

## **SUCCESS CRITERIA**

### **Phase 1 Complete When**:
- ✅ 200 emails/day sent (100 Gmail + 100 Hotmail)
- ✅ Bounce rate <2%
- ✅ Spam complaint rate <0.1%
- ✅ Inbox placement >95%
- ✅ No account warnings or suspensions

### **Phase 2 Complete When**:
- ✅ All 3 orchestrators running
- ✅ 200 emails/day total across campaigns
- ✅ Daily limits enforced correctly
- ✅ Account rotation working (50/50 distribution)

---

## **SUPPORT DOCUMENTS**

- **Full Implementation**: `Outreach-Tracking-Email-Sending-Implementation-Guide.md`
- **Part 2 (Nodes)**: `Outreach-Tracking-Email-Sending-Implementation-Guide-Part2.md`
- **Multi-Keyword Setup**: `Multi-Keyword-Campaign-Implementation-Guide.md` (to be created)
- **Knowledge Transfer**: `Docs/handover/conversation-handover-knowledge-transfer.md`

---

## **CONTACT INFORMATION**

**Gmail Account**: dachevivo@gmail.com  
**Hotmail Account**: [YOUR_HOTMAIL_EMAIL]  
**N8N Instance**: https://n8n.srv972609.hstgr.cloud  
**Workflow ID**: Vp9DpKF3xT2ysHhx

