# Dual-Path Test Mode Architecture - Visual Diagram

## Complete Node Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    UPSTREAM NODES (Existing - No Changes)                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Dynamic Priority-Based Account Selector (v7.0-TEST-MODE-SUPPORT)                   │
│  • Reads testMode flag from Google Sheets "Email-Account-Config"                    │
│  • Outputs: $json.testMode (boolean), $json.selectedAccount (string)                │
│  • Preserves binary data (resume PDF)                                               │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ⚡ NEW: Test Mode Router (Switch Node)                                             │
│  • Routes based on $json.testMode flag                                              │
│  • Output 0: testMode=TRUE → Draft Creation Router                                  │
│  • Output 1: testMode=FALSE → 6-Account Email Router (Existing)                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
                    ↓                                       ↓
        ┌───────────────────┐                 ┌───────────────────────┐
        │  testMode=TRUE    │                 │  testMode=FALSE       │
        │  (Create Drafts)  │                 │  (Send Emails)        │
        └───────────────────┘                 └───────────────────────┘
                    ↓                                       ↓
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│  ⚡ NEW: Draft Creation Router      │     │  6-Account Email Router (Existing)  │
│  (Switch Node)                      │     │  • Routes to existing Send nodes    │
│  • Routes based on selectedAccount  │     │  • Gmail MIME Builders → Gmail Send │
│  • 6 outputs (one per account)     │     │  • Outlook Send nodes               │
└─────────────────────────────────────┘     └─────────────────────────────────────┘
         ↓    ↓    ↓    ↓    ↓    ↓                          ↓
    ┌────┴────┴────┴────┴────┴────┴────┐                     ↓
    │  Draft Creation Nodes (NEW)      │                     ↓
    └──────────────────────────────────┘                     ↓
                                                              ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  GMAIL DRAFT NODES (6 nodes total: 3 MIME Builders + 3 HTTP Request nodes)          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Output 0: gmail-dachevivo                                                           │
│    ├─ Gmail MIME Builder (Draft) - dachevivo (Code node)                            │
│    └─ Gmail Draft - dachevivo (HTTP Request: POST /users/me/drafts)                 │
│                                                                                      │
│  Output 1: gmail-ivoddachev                                                          │
│    ├─ Gmail MIME Builder (Draft) - ivoddachev (Code node)                           │
│    └─ Gmail Draft - ivoddachev (HTTP Request: POST /users/me/drafts)                │
│                                                                                      │
│  Output 2: gmail-ivodachevd                                                          │
│    ├─ Gmail MIME Builder (Draft) - ivodachevd (Code node)                           │
│    └─ Gmail Draft - ivodachevd (HTTP Request: POST /users/me/drafts)                │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  OUTLOOK DRAFT NODES (3 nodes total)                                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Output 3: outlook-dachevivo                                                         │
│    └─ Outlook Draft - dachevivo (Microsoft Outlook node: createDraft)               │
│                                                                                      │
│  Output 4: outlook-dachevivo2                                                        │
│    └─ Outlook Draft - dachevivo2 (Microsoft Outlook node: createDraft)              │
│                                                                                      │
│  Output 5: outlook-dachevivo3                                                        │
│    └─ Outlook Draft - dachevivo3 (Microsoft Outlook node: createDraft)              │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  MERGE POINT: Aggregate Email Metrics (Existing - No Changes)                       │
│  • Both Draft and Send paths converge here                                          │
│  • Logs email metrics to "Email Daily Tracking" Google Sheet                        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Node Count Summary

### New Nodes (Total: 11 nodes)
- **2 Switch nodes**: Test Mode Router, Draft Creation Router
- **6 Gmail Draft nodes**: 3 MIME Builders + 3 HTTP Request nodes
- **3 Outlook Draft nodes**: 3 Microsoft Outlook nodes

### Existing Nodes (No Changes)
- **6-Account Email Router**: Existing Switch node
- **6 Gmail Send nodes**: 3 MIME Builders + 3 HTTP Request nodes (existing)
- **3 Outlook Send nodes**: 3 Microsoft Outlook nodes (existing)
- **Aggregate Email Metrics**: Existing Code node
- **All upstream nodes**: No changes

## Data Flow Summary

### Test Mode Path (testMode=TRUE)
```
Dynamic Priority-Based Account Selector
  → Test Mode Router (Output 0)
    → Draft Creation Router
      → Gmail/Outlook Draft nodes
        → Aggregate Email Metrics
          → Email Tracking Dashboard
```

### Production Mode Path (testMode=FALSE)
```
Dynamic Priority-Based Account Selector
  → Test Mode Router (Output 1)
    → 6-Account Email Router (Existing)
      → Gmail/Outlook Send nodes (Existing)
        → Aggregate Email Metrics
          → Email Tracking Dashboard
```

## Key Features

### ✅ Per-Account Control
- Each of the 6 email accounts can be independently configured
- Google Sheets "Email-Account-Config" tab controls testMode flag
- No code changes required to switch between test and production modes

### ✅ Binary Data Preservation
- Resume PDF attachments preserved through all routing paths
- Both Draft and Send paths maintain binary data integrity

### ✅ Backward Compatibility
- Existing Send nodes remain unchanged
- Production mode (testMode=FALSE) uses existing proven architecture
- No disruption to current working system

### ✅ Testing Safety
- Test mode creates drafts instead of sending emails
- No risk of accidentally sending emails during testing
- Easy to verify draft content before enabling production mode

### ✅ Gradual Rollout
- Can enable production mode one account at a time
- Week-by-week rollout strategy supported
- Easy rollback by changing Google Sheets flag

## Implementation Checklist

- [ ] Create Test Mode Router Switch node
- [ ] Create Draft Creation Router Switch node
- [ ] Create 3 Gmail MIME Builder (Draft) Code nodes
- [ ] Create 3 Gmail Draft HTTP Request nodes
- [ ] Create 3 Outlook Draft Microsoft Outlook nodes
- [ ] Connect Test Mode Router to Dynamic Priority-Based Account Selector
- [ ] Connect Test Mode Router Output 0 to Draft Creation Router
- [ ] Connect Test Mode Router Output 1 to 6-Account Email Router (Existing)
- [ ] Connect Draft Creation Router outputs to Draft nodes
- [ ] Connect all Draft nodes to Aggregate Email Metrics
- [ ] Test with all accounts in testMode=TRUE
- [ ] Verify drafts are created (not sent)
- [ ] Test with one account in testMode=FALSE
- [ ] Verify email is sent directly
- [ ] Gradual rollout to all accounts

## Testing Phases

### Phase 1: All Accounts in Test Mode (Week 1)
- Set all 6 accounts to testMode=TRUE
- Verify drafts created in all accounts
- Check draft content (subject, body, resume attachment)
- Confirm no emails sent

### Phase 2: Single Account Production Test (Week 2)
- Set 1 account to testMode=FALSE
- Verify that account sends emails
- Verify other 5 accounts still create drafts
- Monitor for any issues

### Phase 3: Gradual Rollout (Weeks 3-4)
- Enable 2-3 more accounts for production
- Monitor email delivery rates
- Check for bounce rates
- Verify tracking data accuracy

### Phase 4: Full Production (Week 5+)
- All accounts in production mode (testMode=FALSE)
- Monitor system performance
- Maintain ability to switch back to test mode if needed

