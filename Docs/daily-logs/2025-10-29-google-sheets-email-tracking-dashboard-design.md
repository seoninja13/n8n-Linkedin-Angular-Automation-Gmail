# Google Sheets Email Tracking Dashboard - Design & Implementation Guide
**Centralized Email Sending Metrics and Ramp-Up Progress Tracking**

**Date Created**: 2025-10-29  
**Status**: DESIGN SPECIFICATION  
**Related Document**: `2025-10-29-comprehensive-testing-production-deployment-plan.md`

---

## 📋 EXECUTIVE SUMMARY

### Purpose
Create a centralized Google Sheets dashboard to track all email sending metrics, ramp-up progress, account health, and deliverability statistics for the LinkedIn automation pipeline.

### Key Features
- **Real-time logging**: Automated data capture after each orchestrator execution
- **Historical tracking**: Minimum 30-day rolling view of all metrics
- **Account-specific metrics**: Separate tracking for Gmail and Outlook
- **Bounce rate monitoring**: Per-account and overall bounce rate calculations
- **Visual dashboards**: Charts and conditional formatting for trend analysis
- **Alert thresholds**: Automatic highlighting of concerning metrics

### Integration Point
- **Workflow**: Outreach Tracking Workshop (ID: Vp9DpKF3xT2ysHhx)
- **Node**: New "Log to Email Tracking Dashboard" Google Sheets node
- **Timing**: After email sending completes, before workflow ends
- **Frequency**: Once per orchestrator execution (daily aggregate logging)

---

## 📊 GOOGLE SHEETS STRUCTURE

### Sheet 1: Daily Email Metrics (Main Dashboard)

**Purpose**: Track daily email sending volume, distribution, and bounce rates

**Column Structure:**

| Column | Field Name | Data Type | Description | Formula/Source |
|--------|-----------|-----------|-------------|----------------|
| A | Date | Date (YYYY-MM-DD) | Execution date | `{{ $now.format('yyyy-MM-dd') }}` |
| B | Total_Emails_Sent | Integer | Total emails sent today | `{{ $json.gmailCount + $json.outlookCount }}` |
| C | Gmail_Emails_Sent | Integer | Gmail emails sent today | Count from weighted round-robin |
| D | Outlook_Emails_Sent | Integer | Outlook emails sent today | Count from weighted round-robin |
| E | Gmail_Percentage | Percentage | Gmail % of total | `=C2/B2` (auto-calculated) |
| F | Outlook_Percentage | Percentage | Outlook % of total | `=D2/B2` (auto-calculated) |
| G | Gmail_Bounces | Integer | Gmail bounce count | From bounce tracking |
| H | Outlook_Bounces | Integer | Outlook bounce count | From bounce tracking |
| I | Gmail_Bounce_Rate | Percentage | Gmail bounce rate % | `=G2/C2` (auto-calculated) |
| J | Outlook_Bounce_Rate | Percentage | Outlook bounce rate % | `=H2/D2` (auto-calculated) |
| K | Overall_Bounce_Rate | Percentage | Overall bounce rate % | `=(G2+H2)/B2` (auto-calculated) |
| L | Gmail_Account_Health | Text | Gmail account status | "OK" / "WARNING" / "ERROR" |
| M | Outlook_Account_Health | Text | Outlook account status | "OK" / "WARNING" / "ERROR" |
| N | Execution_ID | Text | N8N execution ID | `{{ $execution.id }}` |
| O | Execution_Status | Text | Execution result | "success" / "error" |
| P | Notes | Text | Manual observations | User-entered |

**Conditional Formatting Rules:**
- **Bounce Rate > 10%**: Yellow background (warning)
- **Bounce Rate > 15%**: Red background (critical)
- **Account Health = "WARNING"**: Orange background
- **Account Health = "ERROR"**: Red background
- **Execution Status = "error"**: Red text

### Sheet 2: Per-Email Details (Detailed Log)

**Purpose**: Track individual email sends for debugging and analysis

**Column Structure:**

| Column | Field Name | Data Type | Description |
|--------|-----------|-----------|-------------|
| A | Timestamp | DateTime | Email send timestamp |
| B | Date | Date | Email send date |
| C | Email_Account | Text | "gmail" or "outlook" |
| D | Recipient_Email | Email | Recipient email address |
| E | Recipient_Name | Text | Recipient name |
| F | Company_Name | Text | Company name |
| G | Job_Title | Text | Job title |
| H | Email_Status | Text | "sent" / "bounced" / "failed" |
| I | Bounce_Reason | Text | Bounce error message (if applicable) |
| J | Message_ID | Text | Email message ID |
| K | Execution_ID | Text | N8N execution ID |

**Note**: This sheet is optional for Phase 1-2, but recommended for Phase 3 (production) to enable detailed analysis.

### Sheet 3: Weekly Summary (Aggregated View)

**Purpose**: Weekly rollup of metrics for trend analysis

**Column Structure:**

| Column | Field Name | Data Type | Description | Formula |
|--------|-----------|-----------|-------------|---------|
| A | Week_Start_Date | Date | Monday of the week | Manual or formula |
| B | Week_End_Date | Date | Sunday of the week | Manual or formula |
| C | Total_Emails_Week | Integer | Total emails sent this week | `=SUMIFS(Sheet1!B:B, Sheet1!A:A, ">="&A2, Sheet1!A:A, "<="&B2)` |
| D | Avg_Daily_Emails | Decimal | Average emails per day | `=C2/7` |
| E | Gmail_Total_Week | Integer | Gmail emails this week | `=SUMIFS(Sheet1!C:C, Sheet1!A:A, ">="&A2, Sheet1!A:A, "<="&B2)` |
| F | Outlook_Total_Week | Integer | Outlook emails this week | `=SUMIFS(Sheet1!D:D, Sheet1!A:A, ">="&A2, Sheet1!A:A, "<="&B2)` |
| G | Avg_Bounce_Rate_Week | Percentage | Average bounce rate | `=AVERAGE(Sheet1!K:K)` (filtered by date range) |
| H | Gmail_Avg_Bounce_Rate | Percentage | Gmail average bounce rate | `=AVERAGE(Sheet1!I:I)` (filtered by date range) |
| I | Outlook_Avg_Bounce_Rate | Percentage | Outlook average bounce rate | `=AVERAGE(Sheet1!J:J)` (filtered by date range) |
| J | Account_Warnings_Count | Integer | Number of warning days | Count of "WARNING" or "ERROR" statuses |

---

## 🔧 N8N INTEGRATION IMPLEMENTATION

### Option 1: Daily Aggregate Logging (RECOMMENDED)

**When to log**: Once per orchestrator execution, after all emails are sent

**Workflow**: Outreach Tracking Workshop (ID: Vp9DpKF3xT2ysHhx)

**Node Configuration**:

1. **Add "Aggregate Email Metrics" Code Node** (BEFORE Google Sheets node)
   - Position: After "Merge Gmail and Outlook Drafts" node
   - Purpose: Calculate daily totals and prepare data for Google Sheets

```javascript
// Aggregate Email Metrics Code Node
// Calculates daily totals for Gmail and Outlook

const items = $input.all();

// Count emails by account type
let gmailCount = 0;
let outlookCount = 0;
let gmailBounces = 0;
let outlookBounces = 0;

for (const item of items) {
  const accountType = item.json.emailAccount;
  const emailStatus = item.json.emailStatus || 'sent';
  
  if (accountType === 'gmail') {
    gmailCount++;
    if (emailStatus === 'bounced') gmailBounces++;
  } else if (accountType === 'outlook') {
    outlookCount++;
    if (emailStatus === 'bounced') outlookBounces++;
  }
}

const totalEmails = gmailCount + outlookCount;
const gmailPercentage = totalEmails > 0 ? (gmailCount / totalEmails) * 100 : 0;
const outlookPercentage = totalEmails > 0 ? (outlookCount / totalEmails) * 100 : 0;
const gmailBounceRate = gmailCount > 0 ? (gmailBounces / gmailCount) * 100 : 0;
const outlookBounceRate = outlookCount > 0 ? (outlookBounces / outlookCount) * 100 : 0;
const overallBounceRate = totalEmails > 0 ? ((gmailBounces + outlookBounces) / totalEmails) * 100 : 0;

// Determine account health status
const gmailHealth = gmailBounceRate > 15 ? 'ERROR' : (gmailBounceRate > 10 ? 'WARNING' : 'OK');
const outlookHealth = outlookBounceRate > 15 ? 'ERROR' : (outlookBounceRate > 10 ? 'WARNING' : 'OK');

// Return single aggregated item
return [{
  json: {
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    totalEmailsSent: totalEmails,
    gmailEmailsSent: gmailCount,
    outlookEmailsSent: outlookCount,
    gmailPercentage: gmailPercentage.toFixed(2),
    outlookPercentage: outlookPercentage.toFixed(2),
    gmailBounces: gmailBounces,
    outlookBounces: outlookBounces,
    gmailBounceRate: gmailBounceRate.toFixed(2),
    outlookBounceRate: outlookBounceRate.toFixed(2),
    overallBounceRate: overallBounceRate.toFixed(2),
    gmailAccountHealth: gmailHealth,
    outlookAccountHealth: outlookHealth,
    executionId: $execution.id,
    executionStatus: 'success',
    notes: ''
  }
}];
```

2. **Add "Log to Email Tracking Dashboard" Google Sheets Node**
   - Node type: Google Sheets (n8n-nodes-base.googleSheets)
   - Position: After "Aggregate Email Metrics" Code node
   - Operation: "Append or Update Row"

**Google Sheets Node Configuration:**

```json
{
  "authentication": "oAuth2",
  "resource": "sheet",
  "operation": "appendOrUpdate",
  "documentId": {
    "__rl": true,
    "value": "YOUR_SPREADSHEET_ID_HERE",
    "mode": "list",
    "cachedResultName": "LinkedIn Email Tracking Dashboard"
  },
  "sheetName": {
    "__rl": true,
    "value": "gid=0",
    "mode": "list",
    "cachedResultName": "Daily Email Metrics"
  },
  "columnToMatchOn": "Date",
  "dataMode": "defineBelow",
  "fieldsUi": {
    "values": [
      {
        "fieldId": "Date",
        "fieldValue": "={{ $json.date }}"
      },
      {
        "fieldId": "Total_Emails_Sent",
        "fieldValue": "={{ $json.totalEmailsSent }}"
      },
      {
        "fieldId": "Gmail_Emails_Sent",
        "fieldValue": "={{ $json.gmailEmailsSent }}"
      },
      {
        "fieldId": "Outlook_Emails_Sent",
        "fieldValue": "={{ $json.outlookEmailsSent }}"
      },
      {
        "fieldId": "Gmail_Bounces",
        "fieldValue": "={{ $json.gmailBounces }}"
      },
      {
        "fieldId": "Outlook_Bounces",
        "fieldValue": "={{ $json.outlookBounces }}"
      },
      {
        "fieldId": "Gmail_Account_Health",
        "fieldValue": "={{ $json.gmailAccountHealth }}"
      },
      {
        "fieldId": "Outlook_Account_Health",
        "fieldValue": "={{ $json.outlookAccountHealth }}"
      },
      {
        "fieldId": "Execution_ID",
        "fieldValue": "={{ $json.executionId }}"
      },
      {
        "fieldId": "Execution_Status",
        "fieldValue": "={{ $json.executionStatus }}"
      }
    ]
  },
  "options": {}
}
```

**Note**: Percentage columns (E, F, I, J, K) are auto-calculated by Google Sheets formulas, so they are NOT included in the N8N node configuration.

### Option 2: Per-Email Logging (OPTIONAL - For Detailed Analysis)

**When to log**: After each individual email is sent

**Workflow**: Outreach Tracking Workshop (ID: Vp9DpKF3xT2ysHhx)

**Node Configuration**:

1. Add Google Sheets node after EACH email send node (Gmail and Outlook)
2. Log individual email details to "Per-Email Details" sheet
3. Use "Append" operation (not "Append or Update")

**Pros**: Detailed per-email tracking, easier debugging
**Cons**: More API calls, slower execution, more complex setup

**RECOMMENDATION**: Start with Option 1 (Daily Aggregate) for Phase 1-2. Add Option 2 (Per-Email) in Phase 3 if detailed analysis is needed.

---

## 📈 DASHBOARD VISUALIZATION RECOMMENDATIONS

### Chart 1: Daily Email Volume Trend (Line Chart)
- **X-axis**: Date
- **Y-axis**: Total_Emails_Sent
- **Series**: Gmail_Emails_Sent (blue), Outlook_Emails_Sent (orange)
- **Purpose**: Visualize ramp-up progression over time

### Chart 2: Account Distribution (Stacked Bar Chart)
- **X-axis**: Date
- **Y-axis**: Email count
- **Series**: Gmail_Emails_Sent (stacked), Outlook_Emails_Sent (stacked)
- **Purpose**: Show weighted distribution (80/20 split)

### Chart 3: Bounce Rate Trend (Line Chart with Threshold)
- **X-axis**: Date
- **Y-axis**: Bounce rate %
- **Series**: Gmail_Bounce_Rate (blue), Outlook_Bounce_Rate (orange), Overall_Bounce_Rate (black)
- **Threshold lines**: 10% (yellow), 15% (red)
- **Purpose**: Monitor deliverability and account health

### Chart 4: Weekly Summary (Column Chart)
- **X-axis**: Week_Start_Date
- **Y-axis**: Total_Emails_Week
- **Purpose**: High-level view of weekly progress

### Conditional Formatting (Applied to Daily Email Metrics Sheet)

**Rule 1: Bounce Rate Warning (10-15%)**
- **Range**: Columns I, J, K (bounce rate columns)
- **Condition**: Cell value between 10% and 15%
- **Format**: Yellow background, bold text

**Rule 2: Bounce Rate Critical (>15%)**
- **Range**: Columns I, J, K (bounce rate columns)
- **Condition**: Cell value > 15%
- **Format**: Red background, white bold text

**Rule 3: Account Health Warning**
- **Range**: Columns L, M (account health columns)
- **Condition**: Cell value = "WARNING"
- **Format**: Orange background, bold text

**Rule 4: Account Health Error**
- **Range**: Columns L, M (account health columns)
- **Condition**: Cell value = "ERROR"
- **Format**: Red background, white bold text

**Rule 5: Execution Error**
- **Range**: Column O (execution status)
- **Condition**: Cell value = "error"
- **Format**: Red text, bold

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Create Google Sheets Spreadsheet (15 minutes)

1. Create new Google Sheets document
2. Name it: "LinkedIn Email Tracking Dashboard"
3. Create 3 sheets:
   - Sheet 1: "Daily Email Metrics"
   - Sheet 2: "Per-Email Details" (optional)
   - Sheet 3: "Weekly Summary"
4. Add column headers according to schema above
5. Add formulas for calculated columns (E, F, I, J, K in Sheet 1)
6. Apply conditional formatting rules
7. Share spreadsheet with N8N service account (or use OAuth2)

### Step 2: Implement N8N Integration (30-45 minutes)

1. Open Outreach Tracking workflow: https://n8n.srv972609.hstgr.cloud/workflow/Vp9DpKF3xT2ysHhx
2. Add "Aggregate Email Metrics" Code node (see code above)
3. Add "Log to Email Tracking Dashboard" Google Sheets node
4. Configure Google Sheets node with spreadsheet ID and field mappings
5. Connect nodes: Merge node → Aggregate Code node → Google Sheets node
6. Test with pinned data (verify data appears in spreadsheet)
7. Save workflow

### Step 3: Create Dashboard Charts (15-20 minutes)

1. Open Google Sheets spreadsheet
2. Create new sheet: "Dashboard"
3. Add Chart 1: Daily Email Volume Trend
4. Add Chart 2: Account Distribution
5. Add Chart 3: Bounce Rate Trend
6. Add Chart 4: Weekly Summary
7. Arrange charts in dashboard layout

### Step 4: Test End-to-End (15 minutes)

1. Execute orchestrator workflow with live data
2. Verify data appears in "Daily Email Metrics" sheet
3. Check that formulas calculate correctly
4. Verify conditional formatting applies
5. Review dashboard charts for accuracy

---

## 📝 MAINTENANCE AND MONITORING

### Daily Tasks
- [ ] Review dashboard for new data
- [ ] Check bounce rates (must be < 10%)
- [ ] Verify account health status (must be "OK")
- [ ] Add manual notes if any issues observed

### Weekly Tasks
- [ ] Update "Weekly Summary" sheet (if not automated)
- [ ] Review weekly trends in charts
- [ ] Calculate average bounce rate for the week
- [ ] Adjust ramp-up schedule if needed

### Monthly Tasks
- [ ] Archive data older than 30 days (optional)
- [ ] Review overall ramp-up progress
- [ ] Analyze response rates and engagement
- [ ] Document lessons learned

---

## ✅ SUCCESS CRITERIA

**Dashboard is considered successful if:**
1. ✅ Data logs automatically after each orchestrator execution
2. ✅ All formulas calculate correctly
3. ✅ Conditional formatting highlights concerning metrics
4. ✅ Charts visualize trends clearly
5. ✅ Historical data is preserved (30+ days)
6. ✅ Dashboard provides actionable insights for ramp-up decisions

---

**END OF GOOGLE SHEETS EMAIL TRACKING DASHBOARD DESIGN**

**RELATED DOCUMENTS**:
- Main Plan: `2025-10-29-comprehensive-testing-production-deployment-plan.md`
- Weighted Round-Robin Code: See Phase 1, Step 0 in main plan

