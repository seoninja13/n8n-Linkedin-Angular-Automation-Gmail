// DUPLICATE DETECTION & LOGGING - FINAL CORRECTED VERSION FOR "RUN ONCE FOR EACH ITEM"
// Purpose: Process duplicate detection using data from Merge node
// Architecture: Native N8N with Merge node combining current + existing data
// Mode: "Run Once for Each Item" - CORRECTED to avoid .all() method calls

console.log('=== DUPLICATE DETECTION DEBUG - FINAL CORRECTED VERSION ===');

// ✅ CORRECTED: Access current item data (works with "Run Once for Each Item")
const currentRecord = $json;
console.log('✅ Current record keys:', Object.keys(currentRecord));

// ✅ CORRECTED: ACCESS EXISTING DATA WITHOUT .all() METHOD
// In "Run Once for Each Item" mode, the Merge node passes ALL data as the current item
// The current item from Merge contains both current record and existing records
let existingData = [];

try {
  console.log('🔍 Analyzing current record structure from Merge node...');
  
  // ✅ CORRECTED APPROACH: Check if current record contains merged data
  // When Merge node runs in "Run Once for Each Item", it combines all inputs into single items
  
  // Method 1: Check if we have array data indicating merged records
  if (Array.isArray(currentRecord.mergedData)) {
    console.log('📊 Found merged data array in current record');
    existingData = currentRecord.mergedData.filter(record => 
      record && Object.keys(record).length > 0 && record.dedupeKey !== currentRecord.dedupeKey
    );
    console.log(`✅ Existing records found via mergedData: ${existingData.length}`);
  }
  // Method 2: Check if we have existing records in a specific field
  else if (currentRecord.existingRecords && Array.isArray(currentRecord.existingRecords)) {
    console.log('📊 Found existing records array in current record');
    existingData = currentRecord.existingRecords.filter(record => 
      record && Object.keys(record).length > 0
    );
    console.log(`✅ Existing records found via existingRecords: ${existingData.length}`);
  }
  // Method 3: Try to access previous node data using item reference (safer approach)
  else {
    console.log('📊 Attempting to access Google Sheets data via item reference...');
    
    // ✅ SAFE APPROACH: Use $input.item to get the current item's source data
    const inputItem = $input.item;
    
    // Check if we can access the Google Sheets Query data from the input chain
    if (inputItem && inputItem.binary && inputItem.binary.sheetsData) {
      console.log('✅ Found sheets data in binary');
      existingData = JSON.parse(inputItem.binary.sheetsData.data.toString());
    }
    // Fallback: Check if Google Sheets data is embedded in the current record
    else if (currentRecord.googleSheetsData && Array.isArray(currentRecord.googleSheetsData)) {
      console.log('✅ Found embedded Google Sheets data');
      existingData = currentRecord.googleSheetsData;
    }
    // Final fallback: Assume empty sheet (first execution)
    else {
      console.log('📄 No existing data found - treating as first execution or empty sheet');
      existingData = [];
    }
  }
  
} catch (error) {
  console.warn('⚠️ Error accessing existing data, treating as empty sheet:', error.message);
  existingData = [];
}

// ✅ INITIALIZE DUPLICATE DETECTION VARIABLES
const dedupeKey = currentRecord.dedupeKey;
const companyName = currentRecord.companyName || 'Unknown';
const jobTitle = currentRecord.jobTitle || 'Unknown';

console.log('=== DUPLICATE DETECTION ANALYSIS ===');
console.log(`Processing: ${companyName} | ${jobTitle}`);
console.log(`DedupeKey: ${dedupeKey}`);
console.log(`Existing records to check: ${existingData.length}`);

let isDuplicate = false;
let duplicateCount = 1;
let originalApplicationDate = null;
let duplicateCheckStatus = 'PENDING';
let duplicateCheckError = null;

try {
  console.log('🔍 Analyzing existing records for duplicates...');
  
  if (existingData.length === 0) {
    // ✅ EMPTY SHEET OR NO DATA - FIRST EXECUTION
    console.log('📄 No existing data found - treating as first execution');
    isDuplicate = false;
    duplicateCount = 1;
    duplicateCheckStatus = 'EMPTY_SHEET';
    originalApplicationDate = null;
  } else {
    // ✅ SEARCH FOR EXISTING RECORDS WITH SAME DEDUPEKEY
    console.log(`🔍 Searching ${existingData.length} existing records for duplicates`);
    
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
  processingNode: 'duplicate-detection-final-corrected',
  
  // ✅ ADD AUDIT TRAIL FIELDS
  processedAt: currentTimestamp,
  workflowName: 'LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment',
  nodeType: 'duplicate-detection-no-all-method',
  
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
  console.log(`   📊 First application for this job (or empty sheet)`);
  console.log(`   ✅ Status marked as: PREPARED`);
  console.log(`   📝 Record will be posted to Google Sheets`);
  console.log(`   🚀 Workflow should continue to downstream processing`);
}

console.log('=== DUPLICATE DETECTION & LOGGING COMPLETE ===');

// ✅ RETURN ENHANCED DATA FOR GOOGLE SHEETS (compatible with "Run Once for Each Item")
return enhancedData;
