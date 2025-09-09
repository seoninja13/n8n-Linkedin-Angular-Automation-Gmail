# 📋 N8N Workflow Duplication Plan: SEO → Automation Specialist

## 🎯 **Objective**
Create a duplicate of "Linkedin- SEO - Gmail Outreach" workflow with keyword changes from "SEO" to "automation specialist" while maintaining all other functionality.

## 📊 **Source Workflow Analysis**
- **Current Name**: "Linkedin- SEO - Gmail Outreach"
- **Workflow ID**: 6JebX2tkKaIikW6X
- **Total Nodes**: 30 nodes
- **Status**: Active
- **Last Updated**: 2025-09-08T15:51:23.000Z

## 🔧 **Required Modifications**

### 1. **Workflow Name Change**
- **Current**: "Linkedin- SEO - Gmail Outreach"
- **New**: "Linkedin Automation Specialist - Gmail"

### 2. **Critical Node Modifications**

#### **Node: "Apify Actor Get Linkedin Listings" (ID: 9b2dd13d-397e-44b2-a52c-68a08ab28255)**
**MOST IMPORTANT CHANGE**
- **Current URL**: 
  ```
  https://www.linkedin.com/jobs/search/?currentJobId=4295700879&distance=25&f_TPR=r86400&f_WT=2&geoId=103644278&keywords=seo&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true
  ```
- **New URL**: 
  ```
  https://www.linkedin.com/jobs/search/?currentJobId=4295700879&distance=25&f_TPR=r86400&f_WT=2&geoId=103644278&keywords=automation%20specialist&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true
  ```
- **Change**: Replace `keywords=seo` with `keywords=automation%20specialist`

#### **Node: "Sticky Note" (ID: c14fd89b-a7c2-4f7d-91c2-99905ef265f7)**
- **Current Content**: "This is for automated LinkedIn. The keyword is SEO outreach through Gmail. Only remote last 24 hours."
- **New Content**: "This is for automated LinkedIn. The keyword is automation specialist outreach through Gmail. Only remote last 24 hours."

### 3. **Nodes That Will Remain Identical**
All other 28 nodes will remain exactly the same, including:
- All AI nodes (Google Gemini configurations)
- Email automation (Gmail nodes)
- Contact enrichment (Apollo.io integration)
- Email verification (NeverBounce)
- Resume customization logic
- Document generation (Google Docs)
- All filters, merges, and processing nodes

## 📝 **Step-by-Step Implementation Plan**

### **Phase 1: Workflow Duplication**
1. **Create New Workflow**: Use N8N MCP server to create a new workflow with the target name
2. **Copy All Nodes**: Duplicate all 30 nodes with identical configurations
3. **Recreate Connections**: Maintain the exact same node connection structure
4. **Preserve Settings**: Keep the same execution order, timezone, and other settings

### **Phase 2: Keyword Modifications**
1. **Update Apify LinkedIn Jobs Scraper Node**:
   - Modify the `customBody` parameter
   - Change the LinkedIn search URL keyword from "seo" to "automation%20specialist"
   
2. **Update Sticky Note**:
   - Change the descriptive text to reflect "automation specialist" instead of "SEO"

### **Phase 3: Verification Steps**
1. **Validate Workflow Structure**: Ensure all connections are properly maintained
2. **Test Node Configurations**: Verify all nodes have correct parameters
3. **Check Credentials**: Confirm all credential references are preserved
4. **Validate Search URL**: Ensure the LinkedIn search URL is properly formatted

## 🔍 **Detailed Node Configuration Changes**

### **Apify LinkedIn Jobs Scraper Node**
```json
{
  "parameters": {
    "operation": "Run actor and get dataset",
    "actorSource": "store",
    "actorId": {
      "__rl": true,
      "value": "hKByXkMQaC5Qt9UMN",
      "mode": "list",
      "cachedResultName": "Linkedin Jobs Scraper - PPR (curious_coder/linkedin-jobs-scraper)",
      "cachedResultUrl": "https://console.apify.com/actors/hKByXkMQaC5Qt9UMN/input"
    },
    "customBody": "{\n    \"count\": 300,\n    \"scrapeCompany\": true,\n    \"urls\": [\n        \"https://www.linkedin.com/jobs/search/?currentJobId=4295700879&distance=25&f_TPR=r86400&f_WT=2&geoId=103644278&keywords=automation%20specialist&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true\"\n    ]\n}",
    "timeout": {}
  }
}
```

### **Sticky Note Node**
```json
{
  "parameters": {
    "content": "This is for automated LinkedIn. The keyword is automation specialist outreach through Gmail. Only remote last 24 hours.",
    "height": 128,
    "width": 368,
    "color": 4
  }
}
```

## ✅ **Expected Outcome**
- **New Workflow Name**: "Linkedin Automation Specialist - Gmail"
- **Functionality**: Identical to original workflow
- **Search Target**: LinkedIn jobs for "automation specialist" instead of "SEO"
- **All Integrations**: Preserved (Google Gemini, Apify, Gmail, Apollo.io, NeverBounce, Google Docs)
- **Email Automation**: Unchanged
- **Resume Customization**: Unchanged (will adapt to automation specialist jobs)

## 🚨 **Critical Success Factors**
1. **URL Encoding**: Ensure "automation specialist" is properly URL-encoded as "automation%20specialist"
2. **Node IDs**: Generate new unique IDs for all nodes in the duplicate workflow
3. **Credential References**: Maintain all existing credential connections
4. **Connection Structure**: Preserve the exact workflow flow and connections
5. **Position Coordinates**: Maintain node positioning for visual clarity

## 🔧 **Implementation Commands**
The implementation will use these N8N MCP server commands:
1. `n8n_create_workflow()` - Create the new workflow
2. `n8n_validate_workflow()` - Validate the configuration
3. `n8n_get_workflow()` - Verify the creation was successful

## 📊 **Risk Assessment**
- **Low Risk**: Most nodes remain identical
- **Medium Risk**: URL encoding and LinkedIn search parameters
- **Mitigation**: Thorough validation before activation

---

**Ready for Implementation**: This plan provides a complete roadmap for creating the duplicate workflow with minimal risk and maximum functionality preservation.
