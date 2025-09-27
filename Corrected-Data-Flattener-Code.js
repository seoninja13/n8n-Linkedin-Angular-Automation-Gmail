// DATA FLATTENER - CORRECTED AI ORIGINALDATA EXTRACTION
// Mode: "Run Once for Each Item" - PREVENTS 128x MULTIPLICATION  
// Purpose: Process exactly ONE item and extract data from AI's originalJobData structure
// FIX: Extract from AI's originalJobData structure to prevent error placeholders

console.log('🔧 DATA FLATTENER - Corrected AI OriginalData Extraction');

// ✅ GET SINGLE ITEM (not array processing)
const item = $json;

if (!item) {
  throw new Error('CRITICAL: No item data received in Data Flattener');
}

console.log('📋 Analyzing AI Email Template Generator output structure...');
console.log(`   Has originalJobData: ${!!item.originalJobData}`);
console.log(`   Has top-level companyName: ${!!item.companyName}`);
console.log(`   Has subject: ${!!item.subject}`);
console.log(`   Has emailBody: ${!!item.emailBody}`);

// ✅ EXTRACT ORIGINAL JOB DATA FROM AI'S PRESERVED STRUCTURE
let extractedJobData = {};

if (item.originalJobData && typeof item.originalJobData === 'object') {
  // ✅ PRIMARY: Extract from AI's originalJobData structure
  console.log('✅ Extracting from AI originalJobData structure');
  extractedJobData = {
    companyName: item.originalJobData.companyName || '',
    jobTitle: item.originalJobData.jobTitle || '',
    jobUrl: item.originalJobData.jobUrl || '',
    contactEmail: item.originalJobData.contactEmail || '',
    contactName: item.originalJobData.contactName || '',
    dedupeKey: item.originalJobData.dedupeKey || '',
    timeStamp: item.originalJobData.timeStamp || '',
    status: item.originalJobData.status || 'pending'
  };
  
  console.log(`   Extracted Company: "${extractedJobData.companyName}"`);
  console.log(`   Extracted Job Title: "${extractedJobData.jobTitle}"`);
  console.log(`   Extracted Contact Email: "${extractedJobData.contactEmail}"`);
  console.log(`   Extracted DedupeKey: "${extractedJobData.dedupeKey}"`);
  
} else {
  // ✅ FALLBACK: Extract from top-level properties (legacy compatibility)
  console.log('⚠️ No originalJobData found, using top-level properties');
  extractedJobData = {
    companyName: item.companyName || '',
    jobTitle: item.jobTitle || '',
    jobUrl: item.jobUrl || '',
    contactEmail: item.contactEmail || item.recipientEmail || '',
    contactName: item.contactName || '',
    dedupeKey: item.dedupeKey || '',
    timeStamp: item.timeStamp || '',
    status: item.status || 'pending'
  };
  
  console.log(`   Fallback Company: "${extractedJobData.companyName}"`);
  console.log(`   Fallback Job Title: "${extractedJobData.jobTitle}"`);
  console.log(`   Fallback Contact Email: "${extractedJobData.contactEmail}"`);
  console.log(`   Fallback DedupeKey: "${extractedJobData.dedupeKey}"`);
}

// ✅ FLATTEN AI-GENERATED EMAIL CONTENT
let flattenedContent = '';
let finishReason = '';
let avgLogprobs = '';

// Handle nested AI response structure
if (item.content && typeof item.content === 'object') {
  if (item.content.parts && Array.isArray(item.content.parts) && item.content.parts.length > 0) {
    flattenedContent = item.content.parts[0].text || '';
  } else if (item.content.text) {
    flattenedContent = item.content.text;
  } else {
    flattenedContent = JSON.stringify(item.content);
  }
} else if (typeof item.content === 'string') {
  flattenedContent = item.content;
}

// Extract AI metadata if present
if (item.finishReason) finishReason = item.finishReason;
if (item.avgLogprobs) avgLogprobs = item.avgLogprobs;

// ✅ VALIDATE CRITICAL FIELDS AND PROVIDE MEANINGFUL FALLBACKS
const validateField = (value, fieldName, fallback) => {
  if (!value || value.trim() === '') {
    console.warn(`⚠️ WARNING: Missing ${fieldName}, using fallback: "${fallback}"`);
    return fallback;
  }
  return value;
};

// ✅ CREATE FLATTENED RECORD WITH CORRECTED DATA EXTRACTION
const flattenedRecord = {
  // ✅ CORRECTED: Core job information from extracted data
  timeStamp: extractedJobData.timeStamp || new Date().toISOString(),
  companyName: validateField(extractedJobData.companyName, 'companyName', 'Company Name Missing'),
  jobTitle: validateField(extractedJobData.jobTitle, 'jobTitle', 'Job Title Missing'),
  jobUrl: extractedJobData.jobUrl || '',
  recipientEmail: validateField(extractedJobData.contactEmail, 'contactEmail', 'contact-missing@placeholder.com'),
  status: extractedJobData.status || 'pending',
  dedupeKey: validateField(extractedJobData.dedupeKey, 'dedupeKey', `missing-${Date.now()}`),
  
  // ✅ AI-generated email content
  content: flattenedContent,
  finishReason: finishReason,
  avgLogprobs: avgLogprobs,
  
  // ✅ Email template fields from AI output
  emailSubject: item.subject || item.emailSubject || `Application for ${extractedJobData.jobTitle || 'Position'} - Ivo Dachev`,
  emailBody: item.emailBody || flattenedContent || 'Email content not generated',
  emailTemplate: item.emailTemplate || 'job-application-outreach',
  estimatedResponseRate: item.estimatedResponseRate || '',
  
  // ✅ Additional AI fields
  personalizedElements: item.personalizedElements || [],
  trackingPixelUrl: item.trackingPixelUrl || '',
  followUpSubject: item.followUpSubject || '',
  followUpBody: item.followUpBody || '',
  
  // ✅ Initialize duplicate detection fields (will be set by duplicate detection node)
  isDuplicate: false,
  duplicateCount: 1,
  duplicateDetectedAt: '',
  originalApplicationDate: '',
  duplicateReason: '',
  
  // ✅ Processing metadata
  dataFlattenerTimestamp: new Date().toISOString(),
  processingMode: 'AI_ORIGINALDATA_EXTRACTION_CORRECTED',
  dataExtractionSource: item.originalJobData ? 'AI_ORIGINAL_DATA' : 'TOP_LEVEL_FALLBACK',
  dataExtractionSuccess: !!(extractedJobData.companyName && extractedJobData.jobTitle && extractedJobData.contactEmail)
};

// ✅ VALIDATION AND SUCCESS CONFIRMATION
console.log('✅ DATA FLATTENER RESULTS:');
console.log(`   Company: "${flattenedRecord.companyName}" (${flattenedRecord.companyName.includes('Missing') ? 'FALLBACK' : 'EXTRACTED'})`);
console.log(`   Job Title: "${flattenedRecord.jobTitle}" (${flattenedRecord.jobTitle.includes('Missing') ? 'FALLBACK' : 'EXTRACTED'})`);
console.log(`   Contact Email: "${flattenedRecord.recipientEmail}" (${flattenedRecord.recipientEmail.includes('placeholder') ? 'FALLBACK' : 'EXTRACTED'})`);
console.log(`   DedupeKey: "${flattenedRecord.dedupeKey}" (${flattenedRecord.dedupeKey.includes('missing-') ? 'FALLBACK' : 'EXTRACTED'})`);
console.log(`   Email Subject: "${flattenedRecord.emailSubject}"`);
console.log(`   Data Source: ${flattenedRecord.dataExtractionSource}`);
console.log(`   Extraction Success: ${flattenedRecord.dataExtractionSuccess}`);

// ✅ WARNINGS FOR MISSING DATA
if (!flattenedRecord.dataExtractionSuccess) {
  console.warn('⚠️ WARNING: Some critical fields are missing - check AI Email Template Generator output');
}

if (flattenedRecord.dataExtractionSource === 'TOP_LEVEL_FALLBACK') {
  console.warn('⚠️ WARNING: Using fallback extraction - AI originalJobData structure not found');
}

console.log(`✅ Data Flattener completed - Ready for duplicate detection`);

// CRITICAL: Return single item, not array
return { json: flattenedRecord };
