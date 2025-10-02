// OUTREACH TRACKING - INPUT PROCESSING (ENHANCED FOR AI RESUME - FIXED)
// Processes contact tracking data for outreach email creation
// ENHANCED: Extracts AI-generated customized resume from Resume Generation Workshop
// FIXED: Handles missing resume data gracefully with detailed diagnostics

const inputData = $json;
console.log('🔍 Outreach Input Debug:');
console.log('   Input keys:', Object.keys(inputData));
console.log('   ContactRecord keys:', inputData.contactRecord ? Object.keys(inputData.contactRecord) : 'No contactRecord');
console.log('   ResumeGeneration keys:', inputData.resumeGeneration ? Object.keys(inputData.resumeGeneration) : 'No resumeGeneration');

// DIAGNOSTIC: Log the complete input structure for debugging
console.log('📋 FULL INPUT DATA STRUCTURE:');
console.log(JSON.stringify(inputData, null, 2).substring(0, 500) + '...');

// Extract data from Contact Tracking workflow output structure
const contactRecord = inputData.contactRecord || {};
const outreachData = inputData.outreachData || {};
const processingMetadata = inputData.processingMetadata || {};

// ENHANCED: Extract resume data from Resume Generation Workshop (via Merge node)
const resumeGeneration = inputData.resumeGeneration || {};
console.log('📄 Resume Generation Data:', resumeGeneration ? 'FOUND' : 'MISSING');

// DIAGNOSTIC: If resumeGeneration exists, log its structure
if (resumeGeneration && Object.keys(resumeGeneration).length > 0) {
  console.log('📄 Resume Generation Structure:');
  console.log('   Keys:', Object.keys(resumeGeneration));
  console.log('   Has customizedResume:', !!resumeGeneration.customizedResume);
  console.log('   Has atsScore:', !!resumeGeneration.atsScore);
  console.log('   Has relevanceScore:', !!resumeGeneration.relevanceScore);
}

// Extract AI-generated customized resume TEXT (with fallback)
const customizedResumeText = resumeGeneration.customizedResume || '';
const resumeAtsScore = resumeGeneration.atsScore || 0;
const resumeRelevanceScore = resumeGeneration.relevanceScore || 0;
const resumeQualityPassed = resumeGeneration.qualityPassed || false;

console.log('📄 AI-Generated Resume Extracted:');
console.log('   Content Length: ' + customizedResumeText.length + ' characters'); // ✅ FIXED: Changed to string concatenation
console.log('   ATS Score: ' + resumeAtsScore + '%'); // ✅ FIXED: Changed to string concatenation
console.log('   Relevance Score: ' + resumeRelevanceScore + '%'); // ✅ FIXED: Changed to string concatenation
console.log('   Quality Passed: ' + resumeQualityPassed); // ✅ FIXED: Changed to string concatenation

// FIXED: Make resume validation optional with warning instead of error
let resumeDataAvailable = true;
if (!customizedResumeText || customizedResumeText.length < 100) {
  console.warn('⚠️ WARNING: AI-generated resume content is missing or too short');
  console.warn('   This may indicate:');
  console.warn('   1. Resume Generation Workshop did not execute');
  console.warn('   2. Main Orchestrator Merge node did not pass resume data');
  console.warn('   3. Resume Generation Workshop failed or returned empty content');
  console.warn('   Workflow will continue WITHOUT resume data for diagnostic purposes');
  resumeDataAvailable = false;
  
  // DIAGNOSTIC: Check if we have ANY resume-related data in the input
  console.log('🔍 DIAGNOSTIC: Checking for alternative resume data sources...');
  if (contactRecord.content) {
    console.log('   ✅ Found contactRecord.content (length:', contactRecord.content.length, ')');
  }
  if (contactRecord.resumeMatchScore) {
    console.log('   ✅ Found contactRecord.resumeMatchScore:', contactRecord.resumeMatchScore);
  }
  if (inputData.jobData) {
    console.log('   ✅ Found inputData.jobData');
  }
}

// Handle field name differences from Contact Tracking workflow
const jobTitle = contactRecord.jobTitle;
const companyName = contactRecord.companyName;
const jobLocation = contactRecord.jobLocation || 'Not specified';
const jobUrl = contactRecord.jobUrl || '';
const jobDescription = contactRecord.jobDescription || '';

// Validate required inputs
if (!jobTitle || !companyName) {
  console.error('❌ Validation failed:');
  console.error('   JobTitle:', jobTitle);
  console.error('   CompanyName:', companyName);
  throw new Error('Invalid job data: missing required fields (jobTitle: ' + !!jobTitle + ', companyName: ' + !!companyName + ')'); // ✅ FIXED: Changed to string concatenation
}

// Extract contact information
const contactName = contactRecord.contactName || 'Unknown Contact';
const contactFirstName = contactRecord.contactFirstName || '';
const contactLastName = contactRecord.contactLastName || '';
const contactTitle = contactRecord.contactTitle || '';
const recepientEmail = contactRecord.recepientEmail || '';

// Extract email template information
const emailTemplate = contactRecord.emailTemplate || {};
const emailSubject = emailTemplate.subject || outreachData.emailSubject || '';
const emailBody = emailTemplate.emailBody || outreachData.emailBody || '';

// Extract duplicate detection fields
const isDuplicate = Boolean(contactRecord.isDuplicate || false);
const duplicateCount = contactRecord.duplicateCount || 0;
const duplicateReason = contactRecord.duplicateReason || '';
const originalApplicationDate = contactRecord.originalApplicationDate || '';
const duplicateDetectedAt = contactRecord.duplicateDetectedAt || '';

// Validate contact email
if (!recepientEmail) {
  throw new Error('Invalid contact data: missing recipient email');
}

// FIXED: Create resume object with fallback to contactRecord.content if AI resume is missing
const resumeContentFinal = customizedResumeText || contactRecord.content || '';
const resumeMatchScoreFinal = resumeAtsScore || contactRecord.resumeMatchScore || 0;
const qualificationScoreFinal = resumeRelevanceScore || contactRecord.qualificationScore || 0;

// ✅ FIXED: Create properly structured outreach data with complete object definitions
const outreachComponents = {
  job: {
    title: jobTitle,
    company: companyName,
    location: jobLocation,
    jobUrl: jobUrl,
    description: jobDescription
  },
  contact: {
    name: contactName,
    firstName: contactFirstName,
    lastName: contactLastName,
    email: recepientEmail,
    jobTitle: contactTitle,
    company: companyName
  },
  resume: {
    customizedContent: resumeContentFinal,
    matchScore: resumeMatchScoreFinal,
    qualificationScore: qualificationScoreFinal,
    atsScore: resumeAtsScore,
    relevanceScore: resumeRelevanceScore,
    qualityPassed: resumeQualityPassed,
    dataSource: customizedResumeText ? 'AI_GENERATED' : (contactRecord.content ? 'CONTACT_RECORD_FALLBACK' : 'NONE'),
    dataAvailable: resumeDataAvailable
  },
  email: {
    subject: emailSubject,
    body: emailBody,
    template: emailTemplate.emailTemplate || 'job-application-outreach',
    estimatedResponseRate: emailTemplate.estimatedResponseRate || 0
  },
  tracking: {
    dedupeKey: contactRecord.dedupeKey || '',
    trackingId: contactRecord.trackingId || '',
    status: contactRecord.status || 'PREPARED',
    priorityLevel: contactRecord.priorityLevel || 'MEDIUM',
    processedAt: contactRecord.processedAt || new Date().toISOString()
  },
  candidate: {
    name: "Ivo Dachev",
    firstName: "Ivo",
    lastName: "Dachev",
    email: "dachevivo@gmail.com",
    phone: "+1 (650)-222-7923",
    linkedin: "https://www.linkedin.com/in/ivodachev/"
  },
  isDuplicate: isDuplicate,
  duplicateCount: duplicateCount,
  duplicateReason: duplicateReason,
  originalApplicationDate: originalApplicationDate,
  duplicateDetectedAt: duplicateDetectedAt,
  outreachType: 'job-application-email',
  timestamp: new Date().toISOString(),
  originalInput: inputData,
  diagnostics: {
    resumeDataAvailable: resumeDataAvailable,
    resumeDataSource: customizedResumeText ? 'AI_GENERATED' : (contactRecord.content ? 'CONTACT_RECORD_FALLBACK' : 'NONE'),
    resumeContentLength: resumeContentFinal.length,
    inputDataKeys: Object.keys(inputData),
    resumeGenerationKeys: Object.keys(resumeGeneration)
  }
}; // ✅ FIXED: Added semicolon here

console.log('✅ Outreach Input Processing Success:');
console.log('   Job: ' + jobTitle + ' at ' + companyName); // ✅ FIXED: Changed to string concatenation
console.log('   Contact: ' + contactName + ' (' + recepientEmail + ')'); // ✅ FIXED: Changed to string concatenation
console.log('   Contact First Name: ' + contactFirstName); // ✅ FIXED: Changed to string concatenation
console.log('   Candidate: ' + outreachComponents.candidate.name); // ✅ FIXED: Changed to string concatenation
console.log('   Resume Data Source: ' + outreachComponents.resume.dataSource); // ✅ FIXED: Changed to string concatenation
console.log('   Resume ATS Score: ' + resumeAtsScore + '%'); // ✅ FIXED: Changed to string concatenation
console.log('   Resume Content Length: ' + resumeContentFinal.length + ' characters'); // ✅ FIXED: Changed to string concatenation
console.log('   Email Subject: ' + emailSubject); // ✅ FIXED: Changed to string concatenation
console.log('   Tracking Status: ' + contactRecord.status); // ✅ FIXED: Changed to string concatenation
console.log('   🔍 Duplicate Detection: isDuplicate=' + isDuplicate + ', duplicateCount=' + duplicateCount); // ✅ FIXED: Changed to string concatenation
console.log('   📋 Processing Path: ' + (isDuplicate ? 'DUPLICATE_DETECTED - Skip Email' : 'NEW_APPLICATION - Generate Email + Resume PDF')); // ✅ FIXED: Changed to string concatenation
console.log('   ⚠️ Resume Data Available: ' + (resumeDataAvailable ? 'YES' : 'NO (using fallback)')); // ✅ FIXED: Changed to string concatenation

return [{ json: outreachComponents }];

