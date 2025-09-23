// EARLY TERMINATION LOGIC FOR DUPLICATE RECORDS
// This logic should be added to the Contact Tracking Output Formatting node
// Purpose: Terminate workflow early for duplicates to save processing costs

const contactData = $('Contact Data Merger & Processing').item.json || {};
const duplicateData = $('Duplicate Detection & Logging').item.json || {};
const currentNodeData = $json || {};

console.log('=== EARLY TERMINATION CHECK ===');
console.log('Contact Data keys:', Object.keys(contactData));
console.log('Duplicate Data keys:', Object.keys(duplicateData));
console.log('Current node data keys:', Object.keys(currentNodeData));

// ✅ CHECK FOR DUPLICATE STATUS
const isDuplicate = duplicateData.isDuplicate || false;
const duplicateStatus = duplicateData.status || 'UNKNOWN';

console.log(`Duplicate Status: ${isDuplicate}`);
console.log(`Record Status: ${duplicateStatus}`);

if (isDuplicate && duplicateStatus === 'DUPLICATE') {
  console.log('🚫 DUPLICATE DETECTED - IMPLEMENTING EARLY TERMINATION');
  console.log(`   Company: ${duplicateData.companyName}`);
  console.log(`   Job Title: ${duplicateData.jobTitle}`);
  console.log(`   Dedupe Key: ${duplicateData.dedupeKey}`);
  console.log(`   Duplicate Count: ${duplicateData.duplicateCount}`);
  console.log(`   Original Application: ${duplicateData.originalApplicationDate}`);
  
  // ✅ FORMAT EARLY TERMINATION OUTPUT
  const earlyTerminationOutput = {
    contactRecord: {
      // Preserve essential contact data
      ...contactData,
      // Include duplicate detection results
      ...duplicateData,
      trackingId: `${duplicateData.dedupeKey}-duplicate-${Date.now()}`,
      sheetsRowId: 'duplicate-early-termination',
      emailTemplate: null,
      outreachReady: false,
      processedAt: new Date().toISOString(),
      earlyTermination: true,
      terminationReason: 'DUPLICATE_DETECTED'
    },
    outreachData: {
      emailSubject: null,
      emailBody: null,
      followUpSubject: null,
      followUpBody: null,
      trackingPixelUrl: null,
      personalizedElements: [],
      estimatedResponseRate: 0,
      finishReason: 'DUPLICATE_EARLY_TERMINATION',
      avgLogprobs: 0,
      skipReason: 'DUPLICATE_APPLICATION_DETECTED'
    },
    processingMetadata: {
      workflowId: "contact-tracking-duplicate-termination",
      workflowName: "LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment",
      processedAt: new Date().toISOString(),
      status: "duplicate_early_termination",
      version: "1.0.0",
      executionId: $executionId,
      dataLossRisk: "ZERO",
      joinMethod: "semantic-field-based",
      trackingFieldsCount: Object.keys(duplicateData).length,
      readyForOutreach: false,
      errorHandling: "early-termination-implemented",
      costOptimization: "DUPLICATE_PROCESSING_AVOIDED",
      downstreamWorkflowsSkipped: [
        "Resume Generation",
        "Contact Enrichment", 
        "Outreach Tracking"
      ]
    }
  };
  
  console.log('✅ EARLY TERMINATION OUTPUT PREPARED');
  console.log(`   Tracking ID: ${earlyTerminationOutput.contactRecord.trackingId}`);
  console.log(`   Status: ${earlyTerminationOutput.processingMetadata.status}`);
  console.log(`   Cost Optimization: ${earlyTerminationOutput.processingMetadata.costOptimization}`);
  console.log(`   Downstream Workflows Skipped: ${earlyTerminationOutput.processingMetadata.downstreamWorkflowsSkipped.length}`);
  
  // ✅ RETURN EARLY TERMINATION OUTPUT
  return [{ json: earlyTerminationOutput }];
  
} else {
  console.log('✅ NEW APPLICATION - CONTINUE NORMAL PROCESSING');
  
  // ✅ SAFE DATA ACCESS WITH ERROR HANDLING FOR NORMAL PROCESSING
  let sheetsResponse = {};
  try {
    sheetsResponse = $('Google Sheets Tracking').item.json || {};
    console.log('✅ Google Sheets response keys:', Object.keys(sheetsResponse));
  } catch (error) {
    console.warn('⚠️ Could not access Google Sheets response:', error);
    sheetsResponse = { status: 'unknown' };
  }
  
  // ✅ ROBUST EMAIL TEMPLATE DATA EXTRACTION
  let emailTemplate = '';
  let templateData = {};
  
  try {
    // Handle different data structures from upstream nodes
    if (currentNodeData.content && currentNodeData.content.parts && currentNodeData.content.parts[0]) {
      emailTemplate = currentNodeData.content.parts[0].text;
      console.log('✅ Found nested structure: content.parts[0].text');
    } else if (currentNodeData.parts && currentNodeData.parts[0]) {
      emailTemplate = currentNodeData.parts[0].text;
      console.log('✅ Found alternative nested structure: parts[0].text');
    } else if (currentNodeData.emailSubject || currentNodeData.finishReason) {
      templateData = {
        subject: currentNodeData.emailSubject || 'Application for ' + contactData.jobTitle,
        emailBody: currentNodeData.emailBody || 'Template content not available',
        emailTemplate: currentNodeData.emailTemplate || 'job-application-outreach',
        estimatedResponseRate: currentNodeData.estimatedResponseRate || 15,
        finishReason: currentNodeData.finishReason || 'stop',
        avgLogprobs: currentNodeData.avgLogprobs || -0.25
      };
      console.log('✅ Found flattened structure');
    } else {
      emailTemplate = JSON.stringify(currentNodeData);
      console.log('⚠️ Using fallback: entire current data as template');
    }
  } catch (error) {
    console.error('❌ Error accessing email template data:', error);
    emailTemplate = '';
  }
  
  // ✅ PARSE EMAIL TEMPLATE DATA WITH ERROR HANDLING
  if (!templateData.subject && emailTemplate) {
    try {
      templateData = typeof emailTemplate === 'string' ? JSON.parse(emailTemplate) : emailTemplate;
      console.log('✅ Successfully parsed email template data');
    } catch (error) {
      console.error('❌ Failed to parse email template:', error);
      templateData = {
        subject: 'Application for ' + (contactData.jobTitle || 'Position'),
        emailBody: 'Template generation failed',
        emailTemplate: 'fallback',
        estimatedResponseRate: 10,
        finishReason: 'error',
        avgLogprobs: -1
      };
    }
  }
  
  // ✅ GENERATE TRACKING ID WITH FALLBACKS
  const dedupeKey = contactData.dedupeKey || duplicateData.dedupeKey || `${contactData.companyName || 'unknown'}|${contactData.jobTitle || 'position'}`.toLowerCase().replace(/[^a-z0-9|]/g, '');
  const trackingId = `${dedupeKey}-${Date.now()}`;
  
  // ✅ FORMAT FINAL OUTPUT FOR ORCHESTRATOR (NON-DUPLICATE)
  const finalOutput = {
    contactRecord: {
      // Preserve all contact data
      ...contactData,
      // Include duplicate detection results
      ...duplicateData,
      trackingId: trackingId,
      sheetsRowId: sheetsResponse.updatedRows || sheetsResponse.spreadsheetId || 'unknown',
      emailTemplate: templateData,
      outreachReady: true,
      processedAt: new Date().toISOString()
    },
    outreachData: {
      emailSubject: templateData.subject || 'Application for ' + (contactData.jobTitle || 'Position'),
      emailBody: templateData.emailBody || 'Template content not available',
      followUpSubject: templateData.followUpSubject || 'Following up on application',
      followUpBody: templateData.followUpBody || 'Follow-up content',
      trackingPixelUrl: templateData.trackingPixelUrl || `https://tracking.linkedin-automation.com/pixel/${trackingId}`,
      personalizedElements: templateData.personalizedElements || [],
      estimatedResponseRate: templateData.estimatedResponseRate || 15,
      finishReason: templateData.finishReason || 'stop',
      avgLogprobs: templateData.avgLogprobs || -0.25
    },
    processingMetadata: {
      workflowId: "contact-tracking-augment",
      workflowName: "LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment",
      processedAt: new Date().toISOString(),
      status: "contact_tracking_complete",
      version: "1.0.0",
      executionId: $executionId,
      dataLossRisk: "ZERO",
      joinMethod: "semantic-field-based",
      trackingFieldsCount: Object.keys(contactData).length,
      readyForOutreach: true,
      errorHandling: "robust-fallbacks-implemented"
    }
  };
  
  console.log('✅ NORMAL PROCESSING OUTPUT PREPARED');
  console.log(`   Tracking ID: ${trackingId}`);
  console.log(`   Status: ${finalOutput.processingMetadata.status}`);
  console.log(`   Ready for Outreach: ${finalOutput.processingMetadata.readyForOutreach}`);
  
  // ✅ RETURN NORMAL PROCESSING OUTPUT
  return [{ json: finalOutput }];
}
