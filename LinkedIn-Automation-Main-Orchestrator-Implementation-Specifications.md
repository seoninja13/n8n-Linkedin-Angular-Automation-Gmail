# LinkedIn Automation Main Orchestrator - Implementation Specifications

**Project**: LinkedIn Automation Hybrid Architecture  
**Component**: Main Orchestrator Workflow (Tier 1)  
**Date**: 2025-01-13  
**Status**: Implementation Ready

---

## 🎯 **WORKFLOW OVERVIEW**

**Workflow Name**: `LinkedIn-Automation-Main-Orchestrator`  
**Total Nodes**: 35+ nodes across 7 functional phases  
**Execution Pattern**: Sequential MCP Client Tool calls with comprehensive error handling  
**Expected Duration**: 15-30 minutes for complete automation cycle

---

## 🔧 **DETAILED NODE CONFIGURATIONS**

### **PHASE 1: INITIALIZATION (4 Nodes)**

#### **Node 1: Manual Trigger**
```json
{
  "id": "manual-trigger",
  "type": "n8n-nodes-base.manualTrigger",
  "parameters": {},
  "position": [240, 300],
  "name": "Start LinkedIn Automation"
}
```

#### **Node 2: Session Initialization**
```json
{
  "id": "session-init",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Initialize automation session\nconst crypto = require('crypto');\nconst sessionId = crypto.randomUUID();\nconst startTime = new Date().toISOString();\n\n// Load input parameters with defaults\nconst config = {\n  sessionId,\n  startTime,\n  keywords: $input.first()?.keywords || 'software engineer',\n  location: $input.first()?.location || 'United States',\n  maxResults: parseInt($input.first()?.maxResults) || 50,\n  experienceLevel: $input.first()?.experienceLevel || 'mid',\n  companySize: $input.first()?.companySize || 'any',\n  resumeTemplate: $input.first()?.resumeTemplate || 'modern',\n  messageTemplate: $input.first()?.messageTemplate || 'professional',\n  validationLevel: $input.first()?.validationLevel || 'comprehensive'\n};\n\nconsole.log('Session initialized:', sessionId);\nreturn [config];"
  },
  "position": [460, 300],
  "name": "Session Initialization"
}
```

#### **Node 3: Parameter Validation**
```json
{
  "id": "param-validation",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Validate input parameters\nconst data = $input.first();\n\n// Validation rules\nconst validations = {\n  keywords: data.keywords && data.keywords.length > 0,\n  location: data.location && data.location.length > 0,\n  maxResults: data.maxResults > 0 && data.maxResults <= 100,\n  experienceLevel: ['entry', 'mid', 'senior', 'executive'].includes(data.experienceLevel),\n  companySize: ['startup', 'small', 'medium', 'large', 'enterprise', 'any'].includes(data.companySize)\n};\n\n// Check for validation failures\nconst failures = Object.entries(validations)\n  .filter(([key, valid]) => !valid)\n  .map(([key]) => key);\n\nif (failures.length > 0) {\n  throw new Error(`Parameter validation failed for: ${failures.join(', ')}`);\n}\n\nconsole.log('Parameters validated successfully');\nreturn [{ ...data, validated: true, validatedAt: new Date().toISOString() }];"
  },
  "position": [680, 300],
  "name": "Parameter Validation"
}
```

#### **Node 4: Configuration Loading**
```json
{
  "id": "config-loading",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Load system configuration\nconst data = $input.first();\n\n// MCP Server endpoints configuration\nconst mcpServers = {\n  jobDiscovery: {\n    id: 'qWMubgbQCCk8CrII',\n    url: 'https://n8n.srv972609.hstgr.cloud/webhook/mcp-server/qWMubgbQCCk8CrII',\n    tool: 'linkedin-job-discovery-analysis',\n    timeout: 300\n  },\n  resumeGeneration: {\n    id: 'UD4BXHqXgheWDBB4',\n    url: 'https://n8n.srv972609.hstgr.cloud/webhook/mcp-server/UD4BXHqXgheWDBB4',\n    tool: 'resume-generation-optimizer',\n    timeout: 300\n  },\n  contactEnrichment: {\n    id: 'Ccj3e5fuNnEVT7et',\n    url: 'https://n8n.srv972609.hstgr.cloud/webhook/mcp-server/Ccj3e5fuNnEVT7et',\n    tool: 'contact-enrichment-processor',\n    timeout: 300\n  },\n  outreachTracking: {\n    id: '0ZJ84RLQXxuYKLyE',\n    url: 'https://n8n.srv972609.hstgr.cloud/webhook/mcp-server/0ZJ84RLQXxuYKLyE',\n    tool: 'outreach-tracking-manager',\n    timeout: 300\n  },\n  validationReporting: {\n    id: '5LfnNVYjb5XeIGKB',\n    url: 'https://n8n.srv972609.hstgr.cloud/webhook/mcp-server/5LfnNVYjb5XeIGKB',\n    tool: 'validation-reporting-engine',\n    timeout: 300\n  }\n};\n\n// System configuration\nconst systemConfig = {\n  retryAttempts: 3,\n  retryDelay: 2000,\n  maxExecutionTime: 1800, // 30 minutes\n  monitoringEnabled: true,\n  loggingLevel: 'info'\n};\n\nreturn [{ ...data, mcpServers, systemConfig, configLoaded: true }];"
  },
  "position": [900, 300],
  "name": "Configuration Loading"
}
```

### **PHASE 2: SESSION MANAGEMENT SETUP (2 Nodes)**

#### **Node 5: Session State Persistence**
```json
{
  "id": "session-persistence",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "append",
    "documentId": "1ifR-7wSQLmiIbk8IyPSSkcfe4_DZec_kLF63B83Ub78",
    "sheetName": "Session_Tracking",
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "Session_ID": "={{ $json.sessionId }}",
        "Start_Time": "={{ $json.startTime }}",
        "Keywords": "={{ $json.keywords }}",
        "Location": "={{ $json.location }}",
        "Max_Results": "={{ $json.maxResults }}",
        "Status": "INITIALIZED",
        "Progress": "0%"
      }
    }
  },
  "position": [1120, 300],
  "name": "Session State Persistence"
}
```

#### **Node 6: Progress Tracking Initialization**
```json
{
  "id": "progress-init",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Initialize progress tracking\nconst data = $input.first();\n\nconst progressTracking = {\n  totalSteps: 5,\n  completedSteps: 0,\n  currentStep: 'job-discovery',\n  stepStatus: {\n    'job-discovery': 'pending',\n    'resume-generation': 'pending',\n    'contact-enrichment': 'pending',\n    'outreach-tracking': 'pending',\n    'validation-reporting': 'pending'\n  },\n  stepResults: {},\n  errors: [],\n  warnings: []\n};\n\nconsole.log('Progress tracking initialized');\nreturn [{ ...data, progressTracking, progressInitialized: true }];"
  },
  "position": [1340, 300],
  "name": "Progress Tracking Init"
}
```

### **PHASE 3: MCP CLIENT TOOL CONFIGURATIONS**

#### **MCP Client Tool 1: Job Discovery**
```json
{
  "id": "mcp-job-discovery",
  "type": "@n8n/n8n-nodes-langchain.mcpClient",
  "parameters": {
    "serverUrl": "={{ $json.mcpServers.jobDiscovery.url }}",
    "toolName": "={{ $json.mcpServers.jobDiscovery.tool }}",
    "parameters": {
      "keywords": "={{ $json.keywords }}",
      "location": "={{ $json.location }}",
      "maxResults": "={{ $json.maxResults }}",
      "experienceLevel": "={{ $json.experienceLevel }}",
      "companySize": "={{ $json.companySize }}",
      "sessionId": "={{ $json.sessionId }}"
    },
    "timeout": "={{ $json.mcpServers.jobDiscovery.timeout }}",
    "retryAttempts": "={{ $json.systemConfig.retryAttempts }}",
    "retryDelay": "={{ $json.systemConfig.retryDelay }}"
  },
  "position": [1560, 300],
  "name": "MCP Client: Job Discovery"
}
```

#### **MCP Client Tool 2: Resume Generation**
```json
{
  "id": "mcp-resume-generation",
  "type": "@n8n/n8n-nodes-langchain.mcpClient",
  "parameters": {
    "serverUrl": "={{ $json.mcpServers.resumeGeneration.url }}",
    "toolName": "={{ $json.mcpServers.resumeGeneration.tool }}",
    "parameters": {
      "jobData": "={{ $json.stepResults['job-discovery'] }}",
      "templateType": "={{ $json.resumeTemplate }}",
      "skillsOptimization": true,
      "experienceLevel": "={{ $json.experienceLevel }}",
      "sessionId": "={{ $json.sessionId }}"
    },
    "timeout": "={{ $json.mcpServers.resumeGeneration.timeout }}",
    "retryAttempts": "={{ $json.systemConfig.retryAttempts }}",
    "retryDelay": "={{ $json.systemConfig.retryDelay }}"
  },
  "position": [1780, 300],
  "name": "MCP Client: Resume Generation"
}
```

#### **MCP Client Tool 3: Contact Enrichment**
```json
{
  "id": "mcp-contact-enrichment",
  "type": "@n8n/n8n-nodes-langchain.mcpClient",
  "parameters": {
    "serverUrl": "={{ $json.mcpServers.contactEnrichment.url }}",
    "toolName": "={{ $json.mcpServers.contactEnrichment.tool }}",
    "parameters": {
      "companies": "={{ $json.stepResults['job-discovery'].jobs.map(job => job.company) }}",
      "enrichmentLevel": "comprehensive",
      "verifyEmails": true,
      "sessionId": "={{ $json.sessionId }}"
    },
    "timeout": "={{ $json.mcpServers.contactEnrichment.timeout }}",
    "retryAttempts": "={{ $json.systemConfig.retryAttempts }}",
    "retryDelay": "={{ $json.systemConfig.retryDelay }}"
  },
  "position": [2000, 300],
  "name": "MCP Client: Contact Enrichment"
}
```

#### **MCP Client Tool 4: Outreach Tracking**
```json
{
  "id": "mcp-outreach-tracking",
  "type": "@n8n/n8n-nodes-langchain.mcpClient",
  "parameters": {
    "serverUrl": "={{ $json.mcpServers.outreachTracking.url }}",
    "toolName": "={{ $json.mcpServers.outreachTracking.tool }}",
    "parameters": {
      "jobData": "={{ $json.stepResults['job-discovery'] }}",
      "resumeData": "={{ $json.stepResults['resume-generation'] }}",
      "contactData": "={{ $json.stepResults['contact-enrichment'] }}",
      "messageTemplate": "={{ $json.messageTemplate }}",
      "joiningStrategy": "semantic",
      "trackingEnabled": true,
      "sessionId": "={{ $json.sessionId }}"
    },
    "timeout": "={{ $json.mcpServers.outreachTracking.timeout }}",
    "retryAttempts": "={{ $json.systemConfig.retryAttempts }}",
    "retryDelay": "={{ $json.systemConfig.retryDelay }}"
  },
  "position": [2220, 300],
  "name": "MCP Client: Outreach Tracking"
}
```

#### **MCP Client Tool 5: Validation Reporting**
```json
{
  "id": "mcp-validation-reporting",
  "type": "@n8n/n8n-nodes-langchain.mcpClient",
  "parameters": {
    "serverUrl": "={{ $json.mcpServers.validationReporting.url }}",
    "toolName": "={{ $json.mcpServers.validationReporting.tool }}",
    "parameters": {
      "sessionData": "={{ $json }}",
      "validationLevel": "={{ $json.validationLevel }}",
      "generateReport": true,
      "includeMetrics": true,
      "sessionId": "={{ $json.sessionId }}"
    },
    "timeout": "={{ $json.mcpServers.validationReporting.timeout }}",
    "retryAttempts": "={{ $json.systemConfig.retryAttempts }}",
    "retryDelay": "={{ $json.systemConfig.retryDelay }}"
  },
  "position": [2440, 300],
  "name": "MCP Client: Validation Reporting"
}
```

### **PHASE 4: SESSION UPDATE NODES (5 Nodes)**

Each MCP Client Tool is followed by a Session Update node to store results and update progress:

#### **Session Update Template**
```json
{
  "id": "session-update-{step}",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Update session state with step results\nconst data = $input.first();\nconst stepName = '{step}';\nconst stepResult = data.mcpResponse || data;\n\n// Update progress tracking\ndata.progressTracking.completedSteps += 1;\ndata.progressTracking.stepStatus[stepName] = 'completed';\ndata.progressTracking.stepResults[stepName] = stepResult;\ndata.progressTracking.currentStep = getNextStep(stepName);\n\n// Calculate progress percentage\nconst progressPercent = Math.round((data.progressTracking.completedSteps / data.progressTracking.totalSteps) * 100);\ndata.progressTracking.progressPercent = progressPercent;\n\n// Log progress\nconsole.log(`Step ${stepName} completed. Progress: ${progressPercent}%`);\n\nfunction getNextStep(currentStep) {\n  const steps = ['job-discovery', 'resume-generation', 'contact-enrichment', 'outreach-tracking', 'validation-reporting'];\n  const currentIndex = steps.indexOf(currentStep);\n  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : 'completed';\n}\n\nreturn [data];"
  },
  "position": [1600, 400],
  "name": "Session Update: {Step}"
}
```

### **PHASE 5: ERROR HANDLING SYSTEM (5 Nodes)**

#### **Error Detection Node**
```json
{
  "id": "error-detection",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Monitor MCP responses for errors\nconst data = $input.first();\nconst errors = [];\nconst warnings = [];\n\n// Check for MCP response errors\nif (data.error || data.statusCode >= 400) {\n  errors.push({\n    type: 'MCP_ERROR',\n    message: data.error?.message || 'MCP call failed',\n    statusCode: data.statusCode,\n    timestamp: new Date().toISOString(),\n    step: data.progressTracking?.currentStep\n  });\n}\n\n// Check for data validation errors\nif (data.mcpResponse && !data.mcpResponse.success) {\n  errors.push({\n    type: 'VALIDATION_ERROR',\n    message: 'MCP response validation failed',\n    details: data.mcpResponse.error,\n    timestamp: new Date().toISOString(),\n    step: data.progressTracking?.currentStep\n  });\n}\n\n// Check for timeout errors\nif (data.timeout || data.executionTime > 300000) {\n  errors.push({\n    type: 'TIMEOUT_ERROR',\n    message: 'MCP call timed out',\n    executionTime: data.executionTime,\n    timestamp: new Date().toISOString(),\n    step: data.progressTracking?.currentStep\n  });\n}\n\nif (errors.length > 0) {\n  data.progressTracking.errors.push(...errors);\n  console.error('Errors detected:', errors);\n  throw new Error(`${errors.length} error(s) detected in step ${data.progressTracking?.currentStep}`);\n}\n\nif (warnings.length > 0) {\n  data.progressTracking.warnings.push(...warnings);\n  console.warn('Warnings detected:', warnings);\n}\n\nreturn [data];"
  },
  "position": [1800, 500],
  "name": "Error Detection"
}
```

#### **Retry Logic Node**
```json
{
  "id": "retry-logic",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Implement exponential backoff retry logic\nconst data = $input.first();\nconst maxRetries = data.systemConfig.retryAttempts || 3;\nconst baseDelay = data.systemConfig.retryDelay || 2000;\n\n// Initialize retry counter if not exists\nif (!data.retryCount) {\n  data.retryCount = 0;\n}\n\ndata.retryCount += 1;\n\nif (data.retryCount > maxRetries) {\n  throw new Error(`Maximum retry attempts (${maxRetries}) exceeded for step ${data.progressTracking?.currentStep}`);\n}\n\n// Calculate exponential backoff delay\nconst delay = baseDelay * Math.pow(2, data.retryCount - 1);\ndata.retryDelay = delay;\n\nconsole.log(`Retry attempt ${data.retryCount}/${maxRetries} for step ${data.progressTracking?.currentStep}. Delay: ${delay}ms`);\n\n// Add delay before retry\nsetTimeout(() => {\n  console.log(`Retrying step ${data.progressTracking?.currentStep}`);\n}, delay);\n\nreturn [data];"
  },
  "position": [2000, 500],
  "name": "Retry Logic"
}
```

### **PHASE 6: FINAL PROCESSING (6 Nodes)**

#### **Data Aggregation Node**
```json
{
  "id": "data-aggregation",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Aggregate all results from MCP steps\nconst data = $input.first();\nconst results = data.progressTracking.stepResults;\n\n// Combine all step results\nconst aggregatedData = {\n  sessionId: data.sessionId,\n  executionSummary: {\n    startTime: data.startTime,\n    endTime: new Date().toISOString(),\n    totalSteps: data.progressTracking.totalSteps,\n    completedSteps: data.progressTracking.completedSteps,\n    successRate: (data.progressTracking.completedSteps / data.progressTracking.totalSteps) * 100,\n    errors: data.progressTracking.errors.length,\n    warnings: data.progressTracking.warnings.length\n  },\n  jobDiscovery: {\n    totalJobs: results['job-discovery']?.jobs?.length || 0,\n    qualifiedJobs: results['job-discovery']?.jobs?.filter(job => job.qualificationScore > 70).length || 0,\n    averageScore: results['job-discovery']?.jobs?.reduce((sum, job) => sum + (job.qualificationScore || 0), 0) / (results['job-discovery']?.jobs?.length || 1)\n  },\n  resumeGeneration: {\n    resumesGenerated: results['resume-generation']?.resumes?.length || 0,\n    optimizationScore: results['resume-generation']?.averageOptimizationScore || 0\n  },\n  contactEnrichment: {\n    contactsEnriched: results['contact-enrichment']?.contacts?.length || 0,\n    emailsVerified: results['contact-enrichment']?.contacts?.filter(contact => contact.emailVerified).length || 0,\n    verificationRate: ((results['contact-enrichment']?.contacts?.filter(contact => contact.emailVerified).length || 0) / (results['contact-enrichment']?.contacts?.length || 1)) * 100\n  },\n  outreachTracking: {\n    emailsSent: results['outreach-tracking']?.outreach?.emailsSent || 0,\n    trackingSetup: results['outreach-tracking']?.outreach?.trackingEnabled || false,\n    semanticJoiningSuccess: results['outreach-tracking']?.outreach?.semanticJoiningSuccess || false\n  },\n  validation: {\n    dataCompleteness: results['validation-reporting']?.validation?.completeness || 0,\n    qualityScore: results['validation-reporting']?.validation?.qualityScore || 0,\n    complianceStatus: results['validation-reporting']?.validation?.complianceStatus || 'unknown'\n  }\n};\n\n// Calculate overall execution time\nconst executionTime = new Date(aggregatedData.executionSummary.endTime) - new Date(aggregatedData.executionSummary.startTime);\naggregatedData.executionSummary.executionTimeMs = executionTime;\naggregatedData.executionSummary.executionTimeFormatted = formatDuration(executionTime);\n\nfunction formatDuration(ms) {\n  const minutes = Math.floor(ms / 60000);\n  const seconds = Math.floor((ms % 60000) / 1000);\n  return `${minutes}m ${seconds}s`;\n}\n\nconsole.log('Data aggregation completed:', aggregatedData.executionSummary);\nreturn [{ ...data, aggregatedData }];"
  },
  "position": [2660, 300],
  "name": "Data Aggregation"
}
```

#### **Quality Assessment Node**
```json
{
  "id": "quality-assessment",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "// Calculate comprehensive quality metrics\nconst data = $input.first();\nconst aggregated = data.aggregatedData;\n\n// Quality assessment criteria\nconst qualityMetrics = {\n  dataCompleteness: {\n    score: calculateCompleteness(aggregated),\n    threshold: 95,\n    status: 'pending'\n  },\n  processSuccess: {\n    score: aggregated.executionSummary.successRate,\n    threshold: 100,\n    status: 'pending'\n  },\n  errorRate: {\n    score: 100 - ((aggregated.executionSummary.errors / aggregated.executionSummary.totalSteps) * 100),\n    threshold: 95,\n    status: 'pending'\n  },\n  performanceScore: {\n    score: calculatePerformanceScore(aggregated),\n    threshold: 80,\n    status: 'pending'\n  }\n};\n\n// Evaluate quality metrics\nObject.keys(qualityMetrics).forEach(metric => {\n  const m = qualityMetrics[metric];\n  m.status = m.score >= m.threshold ? 'pass' : 'fail';\n});\n\n// Calculate overall quality score\nconst overallScore = Object.values(qualityMetrics).reduce((sum, metric) => sum + metric.score, 0) / Object.keys(qualityMetrics).length;\nconst overallStatus = Object.values(qualityMetrics).every(metric => metric.status === 'pass') ? 'pass' : 'fail';\n\nfunction calculateCompleteness(data) {\n  const requiredFields = [\n    data.jobDiscovery.totalJobs > 0,\n    data.resumeGeneration.resumesGenerated > 0,\n    data.contactEnrichment.contactsEnriched > 0,\n    data.outreachTracking.emailsSent > 0,\n    data.validation.dataCompleteness > 0\n  ];\n  return (requiredFields.filter(Boolean).length / requiredFields.length) * 100;\n}\n\nfunction calculatePerformanceScore(data) {\n  const executionTimeMs = data.executionSummary.executionTimeMs;\n  const maxExpectedTime = 30 * 60 * 1000; // 30 minutes\n  return Math.max(0, 100 - ((executionTimeMs / maxExpectedTime) * 100));\n}\n\nconst qualityAssessment = {\n  overallScore: Math.round(overallScore),\n  overallStatus,\n  metrics: qualityMetrics,\n  assessedAt: new Date().toISOString()\n};\n\nconsole.log('Quality assessment completed:', qualityAssessment);\nreturn [{ ...data, qualityAssessment }];"
  },
  "position": [2880, 300],
  "name": "Quality Assessment"
}
```

### **PHASE 7: WORKFLOW CONNECTIONS**

```json
{
  "connections": {
    "manual-trigger": {
      "main": [["session-init"]]
    },
    "session-init": {
      "main": [["param-validation"]]
    },
    "param-validation": {
      "main": [["config-loading"]]
    },
    "config-loading": {
      "main": [["session-persistence"]]
    },
    "session-persistence": {
      "main": [["progress-init"]]
    },
    "progress-init": {
      "main": [["mcp-job-discovery"]]
    },
    "mcp-job-discovery": {
      "main": [["session-update-job-discovery"]],
      "error": [["error-detection"]]
    },
    "session-update-job-discovery": {
      "main": [["mcp-resume-generation"]]
    },
    "mcp-resume-generation": {
      "main": [["session-update-resume-generation"]],
      "error": [["error-detection"]]
    },
    "session-update-resume-generation": {
      "main": [["mcp-contact-enrichment"]]
    },
    "mcp-contact-enrichment": {
      "main": [["session-update-contact-enrichment"]],
      "error": [["error-detection"]]
    },
    "session-update-contact-enrichment": {
      "main": [["mcp-outreach-tracking"]]
    },
    "mcp-outreach-tracking": {
      "main": [["session-update-outreach-tracking"]],
      "error": [["error-detection"]]
    },
    "session-update-outreach-tracking": {
      "main": [["mcp-validation-reporting"]]
    },
    "mcp-validation-reporting": {
      "main": [["session-update-validation-reporting"]],
      "error": [["error-detection"]]
    },
    "session-update-validation-reporting": {
      "main": [["data-aggregation"]]
    },
    "data-aggregation": {
      "main": [["quality-assessment"]]
    },
    "error-detection": {
      "main": [["retry-logic"]]
    },
    "retry-logic": {
      "main": [["mcp-job-discovery"]]
    }
  }
}
```

## 🎯 **IMPLEMENTATION CHECKLIST**

### **Pre-Implementation Requirements**
- [ ] N8N instance with MCP Client node support (`@n8n/n8n-nodes-langchain.mcpClient`)
- [ ] Google Sheets API credentials configured
- [ ] Google Docs API credentials configured
- [ ] All 5 MCP Server endpoints operational and accessible
- [ ] Monitoring dashboard endpoint configured

### **Implementation Steps**
1. [ ] Create new workflow: `LinkedIn-Automation-Main-Orchestrator`
2. [ ] Add and configure all 35+ nodes according to specifications
3. [ ] Set up node connections as per connection schema
4. [ ] Configure Google Sheets for session tracking
5. [ ] Test individual MCP Client Tool connections
6. [ ] Validate error handling and retry mechanisms
7. [ ] Perform end-to-end testing with sample data
8. [ ] Deploy to production environment

### **Success Criteria**
- [ ] All 5 MCP Client Tools execute successfully
- [ ] Session state is properly tracked and persisted
- [ ] Error handling and retry logic function correctly
- [ ] Quality assessment passes all thresholds
- [ ] Complete automation cycle completes within 30 minutes
- [ ] Final report is generated and exported successfully

This implementation specification provides the complete technical foundation for building the LinkedIn Automation Main Orchestrator workflow in N8N, ensuring full integration with the hybrid architecture's MCP Server endpoints.
```
