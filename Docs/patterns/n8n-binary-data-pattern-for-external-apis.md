# N8N Binary Data Pattern for External API Calls

**Pattern Name**: Binary Data Storage for Passthrough Context  
**Category**: N8N Workflow Patterns  
**Use Case**: Calling external APIs with strict input schemas while passing context data to downstream nodes  
**Date Documented**: 2025-10-15  
**Source**: Contact Enrichment Workflow Apify API Error Resolution

---

## Problem Statement

When calling external APIs (like Apify, Stripe, SendGrid, etc.) that have strict input schemas, N8N may merge `passthroughData` properties into the main `$json` object. This causes the external API to receive extra fields that it doesn't expect, resulting in validation errors.

**Example Error**:
```
HTTP 400 Bad Request
"Input is not valid: Property input.jobsByDomain is not allowed."
```

---

## Root Cause

N8N's `passthroughData` property is designed to pass context data between nodes. However, when a node (like the Apify node) uses `customBody: "={{ $json}}"` to send data to an external API, N8N may merge the `passthroughData` into the `$json` object, causing extra fields to be sent to the API.

**Example of Problematic Code**:
```javascript
// Node BEFORE external API call
return {
  json: {
    field1: value1,  // Required by API
    field2: value2,  // Required by API
    field3: value3   // Required by API
  },
  pairedItem: { item: 0 },
  passthroughData: {
    // Context data for downstream nodes
    contextField1: contextValue1,
    contextField2: contextValue2
  }
};

// External API node configuration
{
  "customBody": "={{ $json}}"  // May include passthroughData fields!
}
```

**Result**: External API receives `{ field1, field2, field3, contextField1, contextField2 }` and rejects the input.

---

## Solution: Binary Data Storage Pattern

Store passthrough context data in the `binary` property instead of `passthroughData`. The `binary` property is NOT merged into `$json`, ensuring the external API receives ONLY the required fields.

### Implementation

**Step 1: Store Context Data in Binary Property**

```javascript
// Node BEFORE external API call
return {
  json: {
    // ONLY the fields required by the external API
    field1: value1,
    field2: value2,
    field3: value3
  },
  pairedItem: { item: 0 },
  binary: {
    passthroughData: {
      data: Buffer.from(JSON.stringify({
        // Additional context data for downstream nodes
        contextField1: contextValue1,
        contextField2: contextValue2,
        contextField3: contextValue3
      })).toString('base64'),
      mimeType: 'application/json'
    }
  }
};
```

**Step 2: External API Node Configuration**

```javascript
// External API node (e.g., Apify, HTTP Request)
{
  "customBody": "={{ $json}}"  // Sends ONLY json property (no binary data)
}
```

**Step 3: Access Binary Data in Downstream Nodes**

```javascript
// Downstream node that needs the context data
const items = $input.all();
const firstItem = items[0] || {};

// Access binary passthrough data
const binaryData = firstItem.binary?.passthroughData?.data;
if (binaryData) {
  const contextData = JSON.parse(
    Buffer.from(binaryData, 'base64').toString()
  );
  
  // Use context data
  const contextField1 = contextData.contextField1;
  const contextField2 = contextData.contextField2;
}
```

---

## Benefits

✅ **External API receives ONLY required fields** - No validation errors  
✅ **Downstream nodes can still access context data** - From binary property  
✅ **Clean separation** - API input vs workflow context  
✅ **Prevents N8N from merging data** - Binary property is not merged into `$json`  
✅ **Reusable pattern** - Works with any external API with strict input schemas

---

## Real-World Example: Contact Enrichment Workflow

### Problem
The Contact Enrichment workflow was calling the Apify Lead Finder actor, which only accepts 5 specific fields:
- `organizationDomains` (array)
- `personTitles` (array)
- `maxResults` (number)
- `getEmails` (boolean)
- `includeRiskyEmails` (boolean)

However, the workflow also needed to pass context data (`jobsByDomain`, `originalJobs`, `batchMetadata`) to downstream nodes for mapping contacts back to jobs.

### Original Code (Caused Error)
```javascript
// Build Lead Finder input node
return {
  json: {
    organizationDomains: organizationDomains,
    personTitles: personTitles,
    maxResults: 1000,
    getEmails: true,
    includeRiskyEmails: false
  },
  pairedItem: { item: 0 },
  passthroughData: {
    batchMetadata: batchMetadata,
    jobsByDomain: jobsByDomain,
    originalJobs: originalJobs,
    jobsWithoutDomain: jobsWithoutDomain,
    organizationDomains: organizationDomains
  }
};
```

**Error**: `"Property input.jobsByDomain is not allowed."`

### Fixed Code (Works Correctly)
```javascript
// Build Lead Finder input node
return {
  json: {
    organizationDomains: organizationDomains,
    personTitles: personTitles,
    maxResults: 1000,
    getEmails: true,
    includeRiskyEmails: false
  },
  pairedItem: { item: 0 },
  binary: {
    passthroughData: {
      data: Buffer.from(JSON.stringify({
        batchMetadata: batchMetadata,
        jobsByDomain: jobsByDomain,
        originalJobs: originalJobs,
        jobsWithoutDomain: jobsWithoutDomain,
        organizationDomains: organizationDomains
      })).toString('base64'),
      mimeType: 'application/json'
    }
  }
};
```

**Result**: Apify API receives ONLY the 5 required fields. Workflow executes successfully end-to-end.

---

## When to Use This Pattern

Use this pattern when:
1. ✅ Calling external APIs with strict input schemas (only specific fields allowed)
2. ✅ You need to pass additional context data to downstream nodes
3. ✅ You want to avoid external API validation errors due to extra fields
4. ✅ You're using N8N nodes that send `$json` to external APIs (Apify, HTTP Request, etc.)

Do NOT use this pattern when:
1. ❌ The external API accepts arbitrary fields (flexible schema)
2. ❌ You don't need to pass context data to downstream nodes
3. ❌ You're only working with internal N8N nodes (no external API calls)

---

## Alternative Approaches (Not Recommended)

### Alternative 1: Explicit Field Extraction in API Node
Instead of storing data in binary, you could modify the API node's `customBody` to explicitly extract only required fields:

```javascript
// Apify node customBody
={{
  {
    "organizationDomains": $json.organizationDomains,
    "personTitles": $json.personTitles,
    "maxResults": $json.maxResults,
    "getEmails": $json.getEmails,
    "includeRiskyEmails": $json.includeRiskyEmails
  }
}}
```

**Why Not Recommended**:
- ❌ More verbose and error-prone
- ❌ Requires updating API node configuration (not just code node)
- ❌ Harder to maintain (field list duplicated in two places)
- ❌ Less reusable (specific to each API's schema)

### Alternative 2: Intermediate Code Node to Strip Data
Add a code node between the data preparation node and the API node to strip extra fields:

```javascript
// Intermediate "Strip Extra Fields" node
return {
  json: {
    organizationDomains: $json.organizationDomains,
    personTitles: $json.personTitles,
    maxResults: $json.maxResults,
    getEmails: $json.getEmails,
    includeRiskyEmails: $json.includeRiskyEmails
  },
  pairedItem: { item: 0 }
};
```

**Why Not Recommended**:
- ❌ Adds extra node to workflow (more complexity)
- ❌ Loses passthrough data (downstream nodes can't access it)
- ❌ Requires additional node maintenance

---

## Related Patterns

- **N8N Passthrough Data Best Practices** (to be documented)
- **Apify Actor Integration Pattern** (to be documented)
- **N8N Error Handling Patterns** (to be documented)

---

## References

- **Source Workflow**: Contact Enrichment Workshop (ID: rClUELDAK9f4mgJx)
- **Successful Execution**: Execution #4203 (2025-10-15)
- **Documentation**: `Docs/handover/conversation-handover-knowledge-transfer.md`
- **README Index**: `README-index.md`

---

**Back to**: [README-index.md](../../README-index.md)

