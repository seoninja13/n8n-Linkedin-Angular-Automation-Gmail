// DUPLICATE DETECTION & LOGGING - WORKING VERSION FOR "RUN ONCE FOR ALL ITEMS"
// Purpose: Process duplicate detection using data from Merge node
// Architecture: Native N8N with Merge node combining current + existing data
// Mode: "Run Once for All Items" - USES $input.all() method (RECOMMENDED)

console.log('=== DUPLICATE DETECTION DEBUG - ALL ITEMS MODE ===');

// ✅ ACCESS ALL DATA FROM MERGE NODE (Works in "Run Once for All Items")
const allItems = $input.all();
console.log(`📊 Merge node provided ${allItems.length} items`);

// ✅ EXTRACT CURRENT RECORD (first item from Data Flattener)
const currentRecord = allItems[0].json;
console.log('✅ Current record keys:', Object.keys(currentRecord));
console.log('✅ Current dedupeKey:', currentRecord.dedupeKey);

// ✅ EXTRACT EXISTING RECORDS (remaining items from Google Sheets Query)
let existingData = [];
if (allItems.length > 1) {
  existingData = allItems.slice(1).map(item => item.json).filter(record => 
    record && Object.keys(record).length > 0
  );
  console.log(`✅ Existing records found: ${existingData.length}`);
  
  // Debug: Log existing record dedupeKeys
  existingData.forEach((record, index) => {
    console.log(`   Existing record ${index + 1} dedupeKey: "${record.dedupeKey || 'EMPTY'}"`);
  });
} else {
  console.log('📄 No existing records (empty sheet or first execution)');
}

// ✅ INITIALIZE DUPLICATE DETECTION VARIABLES
const dedupeKey = currentRecord.dedupeKey;
const companyName = currentRecord.companyName || 'Unknown';
const jobTitle = currentRecord.jobTitle || 'Unknown';

console.log('=== DUPLICATE DETECTION ANALYSIS ===');
console.log(`Processing: ${companyName} | ${jobTitle}`);
console.log(`DedupeKey: "${dedupeKey}"`);
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
    console.log(`🔍 Looking for matches to: "${dedupeKey}"`);
    
    const existingRecords = existingData.filter(record => {
      const recordDedupeKey = record.dedupeKey;
      if (!recordDedupeKey) {
        console.log(`   ⚠️ Record has no dedupeKey: ${JSON.stringify(record).substring(0, 100)}...`);
        return false;
      }
      
      const currentKey = dedupeKey.toLowerCase().trim();
      const existingKey = recordDedupeKey.toLowerCase().trim();
      const matches = existingKey === currentKey;
      
      console.log(`   🔍 Comparing: "${existingKey}" === "${currentKey}" → ${matches}`);
      
      if (matches) {
        console.log(`🎯 DUPLICATE MATCH FOUND!`);
        console.log(`   Current: "${currentKey}"`);
        console.log(`   Existing: "${existingKey}"`);
      }
      
      return matches;
    });
    
    console.log(`🔍 Total matching records found: ${existingRecords.length}`);
    
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
      console.log(`   No existing records found for dedupeKey: "${dedupeKey}"`);
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
  processingNode: 'duplicate-detection-all-items-working',
  
  // ✅ ADD AUDIT TRAIL FIELDS
  processedAt: currentTimestamp,
  workflowName: 'LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment',
  nodeType: 'duplicate-detection-run-once-all-items',
  
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

// ✅ BUSINESS LOGIC SUMMARY
if (isDuplicate) {
  console.log('🚫 DUPLICATE APPLICATION SUMMARY:');
  console.log(`   📊 This is attempt #${duplicateCount} for this job`);
  console.log(`   📅 Original application: ${originalApplicationDate}`);
  console.log(`   ⚠️ Status marked as: DUPLICATE`);
  console.log(`   📝 Record will be posted to Google Sheets for audit trail`);
} else {
  console.log('✅ NEW APPLICATION SUMMARY:');
  console.log(`   📊 First application for this job (or empty sheet)`);
  console.log(`   ✅ Status marked as: PREPARED`);
  console.log(`   📝 Record will be posted to Google Sheets`);
  console.log(`   🚀 Workflow should continue to downstream processing`);
}

console.log('=== DUPLICATE DETECTION & LOGGING COMPLETE ===');

// ✅ RETURN ENHANCED DATA FOR GOOGLE SHEETS (array format for "Run Once for All Items")
return [{ json: enhancedData }];
