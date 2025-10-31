# Microsoft 365 Family Multi-Account Email Sending Strategy
**Scaling from 2 Accounts to 7 Accounts for LinkedIn Automation**

**Date**: 2025-10-28  
**Context**: User has Microsoft 365 Family subscription with 6 Outlook.com accounts + 1 Gmail account

---

## **CRITICAL FINDING: Azure AD App Registration IS Required**

### **Answer to Your Question**

**YES**, N8N's "Microsoft Outlook OAuth2 API" credential **REQUIRES** Azure AD app registration, even for personal Microsoft accounts (Outlook.com, Hotmail).

**However**, you CAN create a new FREE Azure account using any Microsoft account to register apps for OAuth2 authentication.

---

## **AUTHENTICATION REQUIREMENTS**

### **What You Need**

1. **Azure Account** (FREE)
   - Sign up at: https://portal.azure.com
   - Use any Microsoft account (Outlook.com, Hotmail, etc.)
   - No credit card required for app registration
   - No Azure AD tenant subscription required

2. **Azure AD App Registration** (FREE)
   - Create ONE app registration in Azure Portal
   - Configure for "Personal Microsoft accounts"
   - Add all 6 Outlook.com accounts using the SAME app registration
   - No per-account registration needed

3. **N8N Credentials** (One per account)
   - Create 6 separate N8N credentials (one per Outlook.com account)
   - All 6 credentials use the SAME Azure app Client ID and Client Secret
   - Each credential authenticates a different Outlook.com account

---

## **STEP-BY-STEP: AZURE AD APP REGISTRATION**

### **Step 1: Create Azure Account (5 minutes)**

1. Go to: https://portal.azure.com
2. Click "Create a free account"
3. Sign in with any Microsoft account (e.g., your primary Outlook.com account)
4. Complete registration (no credit card required)

### **Step 2: Create App Registration (10 minutes)**

1. In Azure Portal, search for "App registrations"
2. Click "New registration"
3. Configure:
   - **Name**: "N8N LinkedIn Automation"
   - **Supported account types**: Select **"Personal Microsoft accounts only"**
   - **Redirect URI**: 
     - Platform: Web
     - URI: `https://n8n.srv972609.hstgr.cloud/rest/oauth2-credential/callback`
4. Click "Register"

### **Step 3: Configure API Permissions (5 minutes)**

1. In your app registration, go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Select "Delegated permissions"
5. Add these permissions:
   - `Mail.Send`
   - `Mail.ReadWrite`
   - `offline_access`
6. Click "Add permissions"
7. **IMPORTANT**: Click "Grant admin consent" (if available)

### **Step 4: Create Client Secret (5 minutes)**

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Description: "N8N OAuth2"
4. Expires: 24 months (maximum)
5. Click "Add"
6. **COPY THE SECRET VALUE IMMEDIATELY** (you can't see it again)

### **Step 5: Copy Application IDs (2 minutes)**

1. Go to "Overview"
2. Copy these values:
   - **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **Client secret**: (from Step 4)

---

## **N8N CREDENTIAL SETUP (6 ACCOUNTS)**

### **Create 6 Separate N8N Credentials**

**For each Outlook.com account, create a new credential**:

1. Go to N8N → Credentials → Add Credential
2. Select: "Microsoft Outlook OAuth2 API"
3. Configure:
   - **Name**: "Microsoft OAuth - Outlook1" (or Outlook2, Outlook3, etc.)
   - **Grant Type**: "Authorization Code"
   - **Authorization URL**: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
   - **Access Token URL**: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
   - **Client ID**: (from Step 5 - SAME for all 6 accounts)
   - **Client Secret**: (from Step 5 - SAME for all 6 accounts)
   - **Scope**: `https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Mail.ReadWrite offline_access`
   - **Auth URI Query Parameters**: Leave empty
   - **Authentication**: "Body"
4. Click "Connect my account"
5. Sign in with the specific Outlook.com account
6. Grant permissions
7. **Copy the Credential ID** (you'll need this for Account Selector node)

**Repeat for all 6 Outlook.com accounts**

---

## **SCALING STRATEGY: 2 ACCOUNTS VS 7 ACCOUNTS**

### **Option A: Start with 2 Accounts (RECOMMENDED)**

**Accounts**: Gmail + 1 Outlook.com  
**Daily Capacity**: 200 emails/day (100 Gmail + 100 Outlook)  
**Warm-Up Timeline**: 10 days (20 → 100 emails/day per account)

**Advantages**:
- ✅ Simpler initial implementation
- ✅ Easier to test and validate warm-up process
- ✅ Lower risk if something goes wrong
- ✅ Meets current requirement (100-200 emails/day)
- ✅ Only need to authenticate 1 Outlook.com account initially

**Disadvantages**:
- ⚠️ Limited to 200 emails/day total
- ⚠️ No redundancy if one account has issues
- ⚠️ May need to scale later if requirements increase

**Implementation Time**: 3 hours (same as current plan)

---

### **Option B: Scale to 7 Accounts Immediately**

**Accounts**: Gmail + 6 Outlook.com  
**Daily Capacity**: 340 emails/day (100 Gmail + 40 per Outlook × 6 = 240 Outlook)  
**Warm-Up Timeline**: 10 days (20 → 100 Gmail, 10 → 40 per Outlook)

**Advantages**:
- ✅ Higher total capacity (340 emails/day)
- ✅ Better redundancy (7 accounts vs 2)
- ✅ Lower per-account volume (safer for sender reputation)
- ✅ Can support 3 campaigns more easily
- ✅ Future-proof for scaling

**Disadvantages**:
- ⚠️ More complex initial implementation
- ⚠️ Harder to troubleshoot if issues arise
- ⚠️ Need to authenticate 6 Outlook.com accounts
- ⚠️ More complex account rotation logic

**Implementation Time**: 5 hours (2 hours additional for 6 accounts)

---

## **RECOMMENDATION: PHASED APPROACH**

### **Phase 1: Start with 2 Accounts (Days 1-10)**

**Why**:
1. Your current requirement is 100-200 emails/day (2 accounts sufficient)
2. Simpler to test and validate warm-up process
3. Lower risk for first deployment
4. Can establish baseline deliverability metrics

**Implementation**:
- Use existing implementation plan (Gmail + 1 Outlook.com)
- Complete 10-day warm-up to 200 emails/day
- Monitor deliverability and sender reputation

---

### **Phase 2: Add 5 More Accounts (Days 11-20) - IF NEEDED**

**When to scale**:
- If you need more than 200 emails/day
- If you want better redundancy
- If you're adding more campaigns (4+ keywords)

**Implementation**:
- Authenticate 5 additional Outlook.com accounts
- Update Account Selector node to support 7 accounts
- Update Google Sheets to track 7 accounts
- Warm up new accounts gradually (10 → 40 emails/day over 10 days)

---

## **UPDATED IMPLEMENTATION PLAN (7 ACCOUNTS)**

### **Account Selector Node Code (7 Accounts)**

```javascript
// Account Selector - Round-Robin Rotation (7 Accounts)
// Gmail + 6 Outlook.com accounts

const accounts = [
  {
    provider: 'gmail',
    email: 'dachevivo@gmail.com',
    credentialId: 'rEDqr1LkX2ZgxHLO',
    credentialName: 'Gmail OAuth - dachevivo',
    dailyLimit: 100
  },
  {
    provider: 'outlook',
    email: 'YOUR_OUTLOOK1_EMAIL@outlook.com',
    credentialId: 'YOUR_OUTLOOK1_CREDENTIAL_ID',
    credentialName: 'Microsoft OAuth - Outlook1',
    dailyLimit: 40
  },
  {
    provider: 'outlook',
    email: 'YOUR_OUTLOOK2_EMAIL@outlook.com',
    credentialId: 'YOUR_OUTLOOK2_CREDENTIAL_ID',
    credentialName: 'Microsoft OAuth - Outlook2',
    dailyLimit: 40
  },
  {
    provider: 'outlook',
    email: 'YOUR_OUTLOOK3_EMAIL@outlook.com',
    credentialId: 'YOUR_OUTLOOK3_CREDENTIAL_ID',
    credentialName: 'Microsoft OAuth - Outlook3',
    dailyLimit: 40
  },
  {
    provider: 'outlook',
    email: 'YOUR_OUTLOOK4_EMAIL@outlook.com',
    credentialId: 'YOUR_OUTLOOK4_CREDENTIAL_ID',
    credentialName: 'Microsoft OAuth - Outlook4',
    dailyLimit: 40
  },
  {
    provider: 'outlook',
    email: 'YOUR_OUTLOOK5_EMAIL@outlook.com',
    credentialId: 'YOUR_OUTLOOK5_CREDENTIAL_ID',
    credentialName: 'Microsoft OAuth - Outlook5',
    dailyLimit: 40
  },
  {
    provider: 'outlook',
    email: 'YOUR_OUTLOOK6_EMAIL@outlook.com',
    credentialId: 'YOUR_OUTLOOK6_CREDENTIAL_ID',
    credentialName: 'Microsoft OAuth - Outlook6',
    dailyLimit: 40
  }
];

// Get daily limits info from previous node
const dailyLimits = $json.dailyLimits;

// Filter accounts that have capacity
const availableAccounts = accounts.filter(account => {
  const accountKey = account.provider === 'gmail' ? 'gmail' : `outlook${accounts.indexOf(account)}`;
  const sent = dailyLimits[`${accountKey}Sent`] || 0;
  return sent < account.dailyLimit;
});

if (availableAccounts.length === 0) {
  throw new Error('No email account has capacity - daily limits reached for all accounts');
}

// Round-robin selection from available accounts
const selectedAccount = availableAccounts[$itemIndex % availableAccounts.length];

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

---

## **GOOGLE SHEETS STRUCTURE (7 ACCOUNTS)**

### **Email_Queue_Daily_Limits Sheet**

**Headers**:
```
date | gmail_sent | outlook1_sent | outlook2_sent | outlook3_sent | outlook4_sent | outlook5_sent | outlook6_sent | gmail_limit | outlook1_limit | outlook2_limit | outlook3_limit | outlook4_limit | outlook5_limit | outlook6_limit | total_sent
```

**Initial Row (Day 1)**:
```
2025-10-28 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 100 | 40 | 40 | 40 | 40 | 40 | 40 | 0
```

---

## **DAILY LIMITS SCHEDULE (7 ACCOUNTS)**

### **10-Day Warm-Up**

| Day | Gmail | Outlook1-6 (each) | Total Daily |
|-----|-------|-------------------|-------------|
| 1-2 | 20 | 10 | 80 emails |
| 3-4 | 35 | 15 | 125 emails |
| 5-6 | 55 | 25 | 205 emails |
| 7-8 | 75 | 35 | 285 emails |
| 9-10 | 100 | 40 | **340 emails** ✅ |

---

## **NEXT STEPS**

### **Immediate (Today)**

1. **Decide**: 2 accounts or 7 accounts?
2. **Create Azure account** (5 min)
3. **Create Azure AD app registration** (25 min)
4. **Authenticate N8N credentials** (5 min per account)

### **If 2 Accounts (Recommended)**

- Follow existing implementation plan
- Use 1 Outlook.com account + Gmail
- Complete 10-day warm-up to 200 emails/day

### **If 7 Accounts**

- Authenticate all 6 Outlook.com accounts
- Update Account Selector node (7 accounts)
- Update Google Sheets structure (7 accounts)
- Complete 10-day warm-up to 340 emails/day

---

## **SUMMARY**

**Question**: Can N8N authenticate Microsoft 365 Family Outlook.com accounts without Azure AD?  
**Answer**: **NO** - Azure AD app registration is required, but it's FREE and easy to set up.

**Question**: Should we scale to 7 accounts immediately or start with 2?  
**Answer**: **Start with 2 accounts** (Gmail + 1 Outlook.com), then add 5 more later if needed.

**Reason**: Your current requirement is 100-200 emails/day, which 2 accounts can handle. Simpler implementation, easier testing, lower risk.

**Next Step**: Create Azure account and app registration (30 minutes total).

