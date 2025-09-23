// DUPLICATE DETECTION & LOGGING NODE - NATIVE N8N ARCHITECTURE
// Purpose: Process duplicate detection using data from native Google Sheets query node
// Position: After Google Sheets Query node, before Google Sheets Tracking node
// Architecture: Uses N8N's native credential management system

// ✅ ACCESS DATA FROM MULTIPLE INPUT SOURCES
// Input 1: Current record data from Data Flattener
// Input 2: Existing Google Sheets data from Google Sheets Query node

const items = $input.all();
console.log('=== DUPLICATE DETECTION DEBUG - INPUT ANALYSIS ===');
console.log(`Total input items: ${items.length}`);

// ✅ EXTRACT CURRENT RECORD DATA (from Data Flattener)
let currentRecord = {};
if (items.length > 0) {
  currentRecord = items[0].json;
  console.log('✅ Current record found:', Object.keys(currentRecord));
} else {
  throw new Error('No current record data found from Data Flattener');
}

// ✅ EXTRACT EXISTING SHEETS DATA (from Google Sheets Query node)
let existingData = [];
if (items.length > 1) {
  // Multiple items means we have both current record and existing data
  existingData = items.slice(1).map(item => item.json);
  console.log(`✅ Existing data found: ${existingData.length} records`);
} else {
  // Single item means either no existing data or empty sheet
  console.log('📄 No existing data found (empty sheet or first record)');
}

// ✅ INITIALIZE DUPLICATE DETECTION VARIABLES
const dedupeKey = currentRecord.dedupeKey;
const companyName = currentRecord.companyName || 'Unknown';
const jobTitle = currentRecord.jobTitle || 'Unknown';

console.log('=== DUPLICATE DETECTION START ===');
console.log(`Processing: ${companyName} | ${jobTitle}`);
console.log(`DedupeKey: ${dedupeKey}`);

let isDuplicate = false;
let duplicateCount = 1;
let originalApplicationDate = null;
let duplicateCheckStatus = 'PENDING';
let duplicateCheckError = null;

try {
  console.log('🔍 Analyzing existing records for duplicates...');
  
  if (existingData.length === 0) {
    // ✅ EMPTY SHEET OR NO DATA
    console.log('📄 Google Sheets is empty or has no data rows');
    isDuplicate = false;
    duplicateCount = 1;
    duplicateCheckStatus = 'EMPTY_SHEET';
    originalApplicationDate = null;
  } else {
    // ✅ SEARCH FOR EXISTING RECORDS WITH SAME DEDUPEKEY
    console.log(`🔍 Total existing records: ${existingData.length}`);
    
    // Enhanced debugging: Log first few dedupeKeys for comparison
    if (existingData.length > 0) {
      console.log('🔍 Sample existing dedupeKeys:');
      existingData.slice(0, 5).forEach((record, index) => {
        const existingKey = record.dedupeKey || 'EMPTY';
        console.log(`   Record ${index + 1}: "${existingKey}"`);
      });
      console.log(`🔍 Current dedupeKey: "${dedupeKey}"`);
    }
    
    const existingRecords = existingData.filter(record => {
      const recordDedupeKey = record.dedupeKey;
      const matches = recordDedupeKey && recordDedupeKey.toLowerCase().trim() === dedupeKey.toLowerCase().trim();
      if (matches) {
        console.log(`🎯 MATCH FOUND: "${recordDedupeKey}" === "${dedupeKey}"`);
      }
      return matches;
    });
    
    console.log(`🔍 Matching records found: ${existingRecords.length}`);
    
    if (existingRecords.length > 0) {
      // ✅ DUPLICATE DETECTED
      isDuplicate = true;
      duplicateCount = existingRecords.length + 1; // +1 for current application
      duplicateCheckStatus = 'DUPLICATE_FOUND';
      
      console.log(`🚫 DUPLICATE DETECTED!`);
      console.log(`   Existing records: ${existingRecords.length}`);
      console.log(`   This will be attempt #${duplicateCount}`);
      
      // ✅ EXTRACT ORIGINAL APPLICATION DATE
      if (existingRecords[0].timeStamp) {
        originalApplicationDate = existingRecords[0].timeStamp;
        console.log(`   Original application date: ${originalApplicationDate}`);
      } else {
        console.warn('⚠️ Could not extract original application date');
        originalApplicationDate = 'Unknown';
      }
      
      // ✅ LOG EXISTING RECORD DETAILS FOR AUDIT
      existingRecords.forEach((record, index) => {
        const recordTimestamp = record.timeStamp || 'Unknown';
        const recordStatus = record.status || 'Unknown';
        console.log(`   Existing record ${index + 1}: ${recordTimestamp} | Status: ${recordStatus}`);
      });
      
    } else {
      // ✅ NEW RECORD
      isDuplicate = false;
      duplicateCount = 1;
      duplicateCheckStatus = 'NEW_RECORD';
      originalApplicationDate = null;
      
      console.log(`✅ NEW APPLICATION APPROVED`);
      console.log(`   No existing records found for dedupeKey: ${dedupeKey}`);
    }
  }
  
} catch (error) {
  // ✅ ERROR HANDLING WITH FAIL-SAFE BEHAVIOR
  console.error('❌ DUPLICATE DETECTION ERROR:', error.message);
  console.error('❌ Error details:', error);
  
  duplicateCheckError = error.message;
  duplicateCheckStatus = 'ERROR_FAIL_SAFE';
  
  // ✅ FAIL-SAFE: Treat as new application to ensure record is posted
  isDuplicate = false;
  duplicateCount = 1;
  originalApplicationDate = null;
  
  console.warn('⚠️ FAIL-SAFE MODE: Treating as new application to ensure record posting');
  console.warn('⚠️ Manual review may be required for this record');
}

// ✅ ENHANCE DATA WITH DUPLICATE TRACKING INFORMATION
const currentTimestamp = new Date().toISOString();
const enhancedData = {
  // ✅ PRESERVE ALL ORIGINAL DATA
  ...currentRecord,
  
  // ✅ UPDATE STATUS BASED ON DUPLICATE DETECTION
  status: isDuplicate ? 'DUPLICATE' : 'PREPARED',
  
  // ✅ ADD DUPLICATE TRACKING FIELDS
  isDuplicate: isDuplicate,
  duplicateCount: duplicateCount,
  duplicateDetectedAt: isDuplicate ? currentTimestamp : null,
  originalApplicationDate: originalApplicationDate,
  duplicateReason: isDuplicate ? 'SAME_COMPANY_AND_JOB_TITLE' : null,
  
  // ✅ ADD PROCESSING METADATA
  duplicateCheckTimestamp: currentTimestamp,
  duplicateCheckStatus: duplicateCheckStatus,
  duplicateCheckError: duplicateCheckError,
  processingNode: 'duplicate-detection-native',
  
  // ✅ ADD AUDIT TRAIL FIELDS
  processedAt: currentTimestamp,
  workflowName: 'LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment',
  nodeType: 'duplicate-detection-native',
  
  // ✅ ENSURE UNIQUE RECORD IDENTIFIER
  uniqueRecordId: `${dedupeKey}-${currentTimestamp}-${Date.now()}`,
};

// ✅ COMPREHENSIVE VALIDATION
const requiredFields = ['timeStamp', 'companyName', 'jobTitle', 'dedupeKey', 'status'];
const missingFields = requiredFields.filter(field => !enhancedData[field]);

if (missingFields.length > 0) {
  console.error('❌ CRITICAL ERROR: Missing required fields:', missingFields);
  throw new Error(`Missing required fields for Google Sheets: ${missingFields.join(', ')}`);
}

// ✅ FINAL COMPREHENSIVE LOGGING
console.log('=== DUPLICATE DETECTION RESULTS ===');
console.log(`✅ Company: ${enhancedData.companyName}`);
console.log(`✅ Job Title: ${enhancedData.jobTitle}`);
console.log(`✅ DedupeKey: ${enhancedData.dedupeKey}`);
console.log(`✅ Status: ${enhancedData.status}`);
console.log(`✅ Is Duplicate: ${enhancedData.isDuplicate}`);
console.log(`✅ Duplicate Count: ${enhancedData.duplicateCount}`);
console.log(`✅ Original Application: ${enhancedData.originalApplicationDate || 'N/A'}`);
console.log(`✅ Check Status: ${enhancedData.duplicateCheckStatus}`);
console.log(`✅ Unique Record ID: ${enhancedData.uniqueRecordId}`);
console.log(`✅ Total Enhanced Fields: ${Object.keys(enhancedData).length}`);

// ✅ BUSINESS LOGIC SUMMARY
if (isDuplicate) {
  console.log('🚫 DUPLICATE APPLICATION SUMMARY:');
  console.log(`   📊 This is attempt #${duplicateCount} for this job`);
  console.log(`   📅 Original application: ${originalApplicationDate}`);
  console.log(`   ⚠️ Status marked as: DUPLICATE`);
  console.log(`   📝 Record will be posted to Google Sheets for audit trail`);
  console.log(`   💰 Recommendation: Consider early termination for cost optimization`);
} else {
  console.log('✅ NEW APPLICATION SUMMARY:');
  console.log(`   📊 First application for this job`);
  console.log(`   ✅ Status marked as: PREPARED`);
  console.log(`   📝 Record will be posted to Google Sheets`);
  console.log(`   🚀 Workflow should continue to downstream processing`);
}

console.log('=== DUPLICATE DETECTION & LOGGING COMPLETE ===');

// ✅ RETURN ENHANCED DATA FOR GOOGLE SHEETS
return [{ json: enhancedData }];
