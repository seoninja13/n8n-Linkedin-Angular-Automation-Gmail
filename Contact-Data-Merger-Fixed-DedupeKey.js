// CONTACT TRACKING - INPUT PROCESSING (ADAPTED FOR GOOGLE SHEETS SCHEMA)
// Merges Resume Generation + Contact Enrichment data for comprehensive tracking
// Field names adapted to match existing Google Sheets column structure
// FIXED: Changed dedupeKey separator from pipe (|) to hyphen (-) for duplicate detection

// ✅ FIXED: Proper data access method for N8N Code node
const items = $input.all();
const inputData = items[0].json;

// 🔍 DEBUG: Log the actual input structure
console.log('=== CONTACT TRACKING DEBUG - INPUT STRUCTURE ===');
console.log('Input data keys:', Object.keys(inputData));
console.log('Input data sample:', JSON.stringify(inputData, null, 2).substring(0, 500) + '...');

// ✅ CORRECTED: Extract data from proper nested structure
const contactEnrichment = inputData.contactEnrichment || {};
const primaryContact = contactEnrichment.primaryContact || {};
const resumeGeneration = inputData.resumeGeneration || {};
const jobData = inputData.jobData || {};

// 🔍 DEBUG: Log extracted sections
console.log('Contact enrichment found:', !!contactEnrichment.primaryContact);
console.log('Resume generation found:', !!resumeGeneration.customizedResume);
console.log('Job data found:', !!jobData.title);

// ✅ FALLBACK: Handle case where data might be in different structure
let recepientEmail = '';
let contactFirstName = '';
let contactLastName = '';
let content = '';
let resumeMatchScore = 0;

// Try nested structure first (from orchestrator merge)
if (primaryContact.email) {
  recepientEmail = primaryContact.email;
  contactFirstName = primaryContact.firstName || primaryContact.first_name || '';
  contactLastName = primaryContact.lastName || primaryContact.last_name || '';
}
// Fallback to flat structure (if data comes differently)
else if (inputData.contactEmail || inputData.recepientEmail) {
  recepientEmail = inputData.contactEmail || inputData.recepientEmail || '';
  contactFirstName = inputData.contactFirstName || '';
  contactLastName = inputData.contactLastName || '';
}

// Try nested resume structure first
if (resumeGeneration.customizedResume) {
  content = resumeGeneration.customizedResume;
  resumeMatchScore = resumeGeneration.atsScore || resumeGeneration.relevanceScore || 0;
}
// Fallback to flat structure
else if (inputData.customizedResume || inputData.content) {
  content = inputData.customizedResume || inputData.content || '';
  resumeMatchScore = inputData.resumeMatchScore || 0;
}

const contactFullName = contactFirstName && contactLastName 
  ? `${contactFirstName} ${contactLastName}` 
  : contactFirstName || contactLastName || '';

// ✅ CORRECTED: Job data extraction with fallbacks
const companyName = jobData.companyName || jobData.company || inputData.companyName || '';
const jobTitle = jobData.title || jobData.jobTitle || inputData.jobTitle || '';
const jobUrl = jobData.jobUrl || jobData.url || jobData.link || inputData.jobUrl || '';

// Validate required inputs
if (!jobTitle || !companyName) {
  console.error('❌ Missing required data:');
  console.error('Job title:', jobTitle);
  console.error('Company name:', companyName);
  console.error('Available input keys:', Object.keys(inputData));
  throw new Error(`Missing required job data: title (${jobTitle}) and companyName (${companyName})`);
}

// 🎯 CRITICAL FIX: Changed dedupeKey separator from pipe (|) to hyphen (-) for duplicate detection
console.log('🔧 DEDUPEKEY FIX: Changing separator from pipe (|) to hyphen (-)');
const dedupeKey = `${companyName}-${jobTitle}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
console.log(`✅ New dedupeKey format: "${dedupeKey}"`);

// ✅ ADAPTED: Field names match Google Sheets columns exactly
const mergedContactRecord = {
  // ✅ GOOGLE SHEETS SCHEMA MATCHING:
  timeStamp: new Date().toISOString(),           // matches 'timeStamp' column
  companyName: companyName,                      // matches 'companyName' column
  jobTitle: jobTitle,                            // matches 'jobTitle' column
  jobUrl: jobUrl,                                // matches 'jobUrl' column
  recepientEmail: recepientEmail,                // matches 'recepientEmail' column
  status: 'PREPARED',                            // matches 'status' column
  dedupeKey: dedupeKey,                          // matches 'dedupeKey' column - FIXED FORMAT
  content: content,                              // matches 'content' column
  finishReason: '',                              // matches 'finishReason' column (will be populated by AI Email Template Generator)
  avgLogprobs: 0,                                // matches 'avgLogprobs' column (will be populated by AI Email Template Generator)
  
  // Additional fields for AI Email Template Generator (not in Google Sheets)
  contactName: contactFullName,
  contactFirstName: contactFirstName,
  contactLastName: contactLastName,
  contactTitle: primaryContact.jobTitle || primaryContact.title || inputData.contactTitle || '',
  jobLocation: jobData.location || jobData.jobLocation || inputData.jobLocation || 'Not specified',
  jobDescription: jobData.descriptionText || jobData.description || jobData.descriptionHtml || '',
  jobType: jobData.jobType || inputData.jobType || 'Not specified',
  industry: jobData.industry || inputData.industry || 'Not specified',
  resumeMatchScore: resumeMatchScore,
  matchingKeywords: jobData.matchingKeywords || inputData.matchingKeywords || [],
  qualificationScore: resumeMatchScore,
  priorityLevel: resumeMatchScore >= 85 ? 'HIGH' : resumeMatchScore >= 70 ? 'MEDIUM' : 'LOW'
};

// 🔍 ENHANCED DEBUG: Log final merged record
console.log('=== CONTACT TRACKING DEBUG - FINAL RECORD ===');
console.log(`✅ Job: ${mergedContactRecord.jobTitle} at ${mergedContactRecord.companyName}`);
console.log(`✅ Recipient Email: ${mergedContactRecord.recepientEmail}`);
console.log(`✅ Contact Name: ${mergedContactRecord.contactName}`);
console.log(`✅ Content Length: ${mergedContactRecord.content.length} chars`);
console.log(`✅ Status: ${mergedContactRecord.status}`);
console.log(`✅ Dedupe Key: ${mergedContactRecord.dedupeKey}`);
console.log(`✅ Timestamp: ${mergedContactRecord.timeStamp}`);

// ⚠️ VALIDATION WARNINGS
if (!mergedContactRecord.recepientEmail) {
  console.warn('⚠️ WARNING: No recipient email found');
  console.warn('Primary contact data:', JSON.stringify(primaryContact, null, 2));
}
if (!mergedContactRecord.content) {
  console.warn('⚠️ WARNING: No content found');
  console.warn('Resume generation data:', JSON.stringify(resumeGeneration, null, 2));
}

return [{ json: mergedContactRecord }];
