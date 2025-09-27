# N8N Contact Tracking Workflow – Debugging Handover (2025-09-27)

Main index: README-index.md

Workflow: LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment  
Workflow ID: wZyxRjWShhnSFbSV

Google Sheet: Tracking (Document ID: 1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g)

---

## 1) Problem Summary & Root Cause Analysis

- Symptom: Workflow executions complete without errors but no rows are written to the Google Sheets “Tracking” sheet.
- Confirmed state before fix:
  - Data Flattener → IF node (Insert OR Update) is the only input (Rows lookup disconnected from IF input).
  - Rows lookup is used solely as a reference (Always Output Data = OFF).
- Root cause: The IF condition used `{{ $('Rows lookup').json.dedupeKey }}` with operator “is not empty”. When Rows lookup returns zero items (no match), `$('Rows lookup').json` is undefined, making the condition brittle. In practice this can cause the IF node to fail to forward an item to either branch, resulting in no write despite a successful execution.

---

## 2) Technical Solution – Exact Configuration Changes

- IF node: Insert OR Update
  - Left value (Expression): `{{ $items('Rows lookup').length }}`
  - Operator: `Larger` (greater than)
  - Right value: `0` (numeric)
  - Options: Convert types = ON (harmless); Ignore Case = OFF (irrelevant for numbers)

- Rows lookup
  - Keep “Always Output Data” = OFF.
  - Lookup: column = `dedupeKey`, value = `{{$json.dedupeKey}}`, range = `A:Z`.

- Data flow wiring (correct and required):
  - Data Flattener for Google Sheets → Rows lookup (for reference)
  - Data Flattener for Google Sheets → IF (Insert OR Update)
  - IF → true: Google Sheets Tracking – Duplicate Update (appendOrUpdate, defineBelow)
  - IF → false: Google Sheets Tracking – Insert (append, autoMapInputData)

Why this works:
- The IF evaluates count of matches from Rows lookup robustly:
  - count > 0 → duplicate exists → route to Update branch
  - count = 0 → new record → route to Insert branch
- The item forwarded to Sheets always comes from Data Flattener, ensuring all template expressions resolve with real values.

---

## 3) Workflow Architecture & Data Flow

- Canonical path:
  - When Executed by Another Workflow → Contact Data Merger & Processing → AI Email Template Generator → Data Flattener for Google Sheets → [Rows lookup, IF Insert OR Update] → Google Sheets nodes → Output formatting

- Data Flattener v2.2 (Code node) outputs a complete, Sheets-ready record:
  - Required: `timeStamp`, `companyName`, `jobTitle`, `jobUrl`, `recipientEmail`, `recepientEmail` (legacy), `status`, `dedupeKey`, `emailSubject`, `emailBody`
  - Extras: `content`, `finishReason`, `avgLogprobs`, processing metadata and duplicate scaffolding.

- Routing logic (post-fix):
  - `$items('Rows lookup').length > 0` → Duplicate → Update branch
  - `$items('Rows lookup').length = 0` → New → Insert branch

---

## 4) Verification Steps & Testing Protocol

1) Sanity checks on Sheet
- Tab name exactly `Tracking` (no trailing/leading spaces)
- Header row includes `dedupeKey` (Plain text format recommended)

2) Functional tests
- Test A (duplicate): use a dedupeKey known to exist
  - Expect IF=true (count > 0) → Duplicate Update node runs
  - Node output should show `updatedRows`/`updatedRange`/`updatedCells`
- Test B (new): use a brand-new dedupeKey
  - Expect IF=false (count = 0) → Insert node runs
  - Node output should show `tableRange`; new row visible in Sheet

3) Temporary debug (remove after validation)
- Add a small Code node immediately before each Sheets node:
  - `console.log('Keys to Sheets:', Object.keys($json)); return { json: $json };`
  - Confirms flattened payload contains expected keys (e.g., `timeStamp`, `companyName`, `jobTitle`, `recipientEmail`, `recepientEmail`, `status`, `dedupeKey`).

4) Expected success signals
- Insert: response includes `tableRange` and shows a new row in `Tracking`
- Update: response includes `updatedRange`/`updatedRows` and the existing row is modified

---

## 5) Critical Files & Code References

- Data Flattener (v2.2) Code Node Source:
  - `nodes/contact-tracking-workflow/data-flattener-v2.2-content-json-parser.js`
- Workflow name & ID:
  - LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment (ID: wZyxRjWShhnSFbSV)
- Google Sheets:
  - Document ID: `1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g`
  - Sheet name: `Tracking`
- IF condition (final, authoritative): `{{ $items('Rows lookup').length }}` `Larger` `0`

---

## 6) Implementation Status & Next Actions

- Status: Solution identified; requires applying the IF node condition change.
- Next steps:
  1. Update IF node to the count-based condition exactly as specified.
  2. Run Test A (existing dedupeKey) and Test B (new dedupeKey).
  3. Confirm Sheets node outputs (`updatedRange` / `tableRange`) and visible Sheet changes.
  4. Remove temporary debug nodes.

- Acceptance criteria:
  - New items are appended with all fields populated.
  - Duplicates update in place (or append when using appendOrUpdate) with correct field mapping.

---

## 7) Risks, Gotchas, and Notes

- If “Always Output Data” on Rows lookup is turned ON, the count check still works, but pass-through items can confuse other patterns; keeping it OFF aligns with precise duplicate detection.
- Ensure the IF node input remains ONLY from Data Flattener. Do not reconnect Rows lookup as an IF input.
- Mapping modes:
  - Insert: `autoMapInputData` leverages header names — ensure headers match flattened field names.
  - Duplicate Update: `defineBelow` must reference fields via `{{$json.fieldName}}`; ensure `matchingColumns=["dedupeKey"]`.
- DedupeKey column should be Plain text to prevent any unintended formatting.

---

## 8) Decision Log (Key Changes)

- Replaced brittle IF condition based on `$('Rows lookup').json.*` with robust count-based condition using `$items('Rows lookup').length > 0`.
- Maintained Rows lookup as a reference-only node (AOD=OFF) while forwarding the Data Flattener item to Sheets nodes.
- Validated Data Flattener v2.2 outputs a complete and stable schema.

---

## 9) Appendix – Snippets

- IF condition (final): `{{ $items('Rows lookup').length }}` Larger `0`
- Temporary debug code:
  - `console.log('Keys to Sheets:', Object.keys($json)); return { json: $json };`

---

Back to main index: README-index.md

